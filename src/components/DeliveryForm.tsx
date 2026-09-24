import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { servesRegion, type DeliveryRegion } from "@/lib/delivery";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DadosPedido = { name: string; address: string; region: DeliveryRegion; phone: string; cpf: string; email: string };

export function DeliveryForm({ getUrl, onRegionChange }: { getUrl: (dados: DadosPedido) => Promise<string>; onRegionChange: (region: DeliveryRegion) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cep, setCep] = useState("");
  const [fields, setFields] = useState({ street: "", number: "", district: "", city: "", state: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState("");
  const [sent, setSent] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [postalRegion, setPostalRegion] = useState<DeliveryRegion | null>(null);
  const blocked = Boolean(fields.city.trim() && fields.state && !servesRegion(fields)) || Boolean(postalRegion && !servesRegion(postalRegion));
  useEffect(() => { onRegionChange({ city: fields.city, state: fields.state }); }, [fields.city, fields.state, onRegionChange]);
  const version = useRef(0);
  useEffect(() => {
    const id = ++version.current;
    setPostalRegion(null);
    if (cep.length !== 8) { setLoading(false); setStatus(""); return; }
    const controller = new AbortController();
    setLoading(true);
    setStatus("Consultando CEP…");
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    fetch("https://viacep.com.br/ws/" + cep + "/json/", { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        if (id !== version.current) return;
        if (data.erro) throw new Error();
        setPostalRegion({ city: data.localidade || "", state: data.uf || "" });
        setFields(old => ({ ...old, street: data.logradouro || "", district: data.bairro || "", city: data.localidade || "", state: data.uf || "" }));
        setStatus("Confira o endereço e preencha os campos que faltarem.");
      })
      .catch(() => { if (id === version.current) setStatus("Não foi possível localizar o CEP. Confira os números e preencha o endereço manualmente."); })
      .finally(() => { window.clearTimeout(timeout); if (id === version.current) setLoading(false); });
    return () => { ++version.current; controller.abort(); window.clearTimeout(timeout); };
  }, [cep]);
  useEffect(() => {
    let vivo = true;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user || !vivo) return;
      setEmail(data.user.email || "");
      const { data: perfil } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
      if (!perfil || !vivo) return;
      setName(n => n || perfil.nome || "");
      setPhone(p => p || perfil.telefone || "");
      setCpf(c => c || perfil.cpf || "");
      if (perfil.cep) setCep(c => c || perfil.cep!);
      setFields(f => (f.street ? f : { street: perfil.rua || "", number: perfil.numero || "", district: perfil.bairro || "", city: perfil.cidade || "", state: perfil.estado || "" }));
    });
    return () => { vivo = false; };
  }, []);
  const inputClass = "w-full rounded-xl border border-border bg-white px-3 py-3";
  return <><form className="space-y-4" onSubmit={async e => {
    e.preventDefault();
    if (enviando || blocked || cep.length !== 8 || loading || !name.trim() || Object.values(fields).some(v => !v.trim())) return;
    const address = fields.street.trim() + ", " + fields.number.trim() + " - " + fields.district.trim() + ", " + fields.city.trim() + " - " + fields.state + ", CEP " + cep.slice(0,5) + "-" + cep.slice(5);
    const janela = window.open("about:blank", "_blank");
    setErro("");
    setEnviando(true);
    try {
      const url = await getUrl({ name: name.trim(), address, region: { city: fields.city, state: fields.state }, phone: phone.trim(), cpf: cpf.replace(/\D/g, ""), email });
      if (janela) janela.location.href = url; else window.open(url, "_blank", "noopener,noreferrer");
      setOpened(url);
      setSent(false);
      setModalOpen(true);
    } catch (error) {
      janela?.close();
      setErro(error instanceof Error ? error.message : "Não foi possível registrar seu pedido. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }}>
    <div><label htmlFor="pedido-cep" className="block text-sm mb-2">CEP de entrega</label><input id="pedido-cep" autoComplete="postal-code" inputMode="numeric" required pattern="[0-9]{5}-[0-9]{3}" maxLength={9} value={cep.length > 5 ? cep.slice(0,5) + "-" + cep.slice(5) : cep} onChange={e => { ++version.current; setPostalRegion(null); setCep(e.target.value.replace(/\D/g, "").slice(0,8)); setFields({ street: "", number: "", district: "", city: "", state: "" }); setOpened(""); }} className={inputClass} /></div>
    <div><label htmlFor="pedido-nome" className="block text-sm mb-2">Seu nome</label><input id="pedido-nome" autoComplete="name" required minLength={2} maxLength={120} value={name} onChange={e => { setName(e.target.value); setOpened(""); }} className={inputClass} /></div>
    <div><label htmlFor="pedido-telefone" className="block text-sm mb-2">Telefone / WhatsApp</label><input id="pedido-telefone" autoComplete="tel" inputMode="tel" required maxLength={30} value={phone} onChange={e => { setPhone(e.target.value); setOpened(""); }} className={inputClass} /></div>
    <div><label htmlFor="pedido-cpf" className="block text-sm mb-2">CPF (opcional)</label><input id="pedido-cpf" inputMode="numeric" maxLength={14} value={cpf} onChange={e => { setCpf(e.target.value); setOpened(""); }} className={inputClass} /></div>
    <p role="status" className="text-xs text-foreground/65">{status}</p>
    {([
      ["street", "Endereço", "address-line1"], ["number", "Número", "off"],
      ["district", "Bairro", "address-level3"], ["city", "Cidade", "address-level2"],
    ] as const).map(([key, label, autocomplete]) => <div key={key}><label htmlFor={"pedido-" + key} className="block text-sm mb-2">{label}</label><input id={"pedido-" + key} autoComplete={autocomplete} required maxLength={160} disabled={loading} value={fields[key]} onChange={e => { setFields(old => ({ ...old, [key]: e.target.value })); setOpened(""); }} className={inputClass} /></div>)}
    <div><label htmlFor="pedido-state" className="block text-sm mb-2">Estado</label><select id="pedido-state" autoComplete="address-level1" required disabled={loading} value={fields.state} onChange={e => { setFields(old => ({ ...old, state: e.target.value })); setOpened(""); }} className={inputClass}><option value="">Selecione</option><option value="SP">SP</option>{fields.state && fields.state !== "SP" && <option value={fields.state}>{fields.state}</option>}</select></div>
    <p className="text-xs text-foreground/65">Entregamos em Peruíbe, Pedro de Toledo, Ana Dias e Itariri (SP). Nome e endereço serão incluídos na mensagem do WhatsApp.</p>
    {blocked && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">Infelizmente não atendemos a sua região.</p>}
    {erro && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">{erro}</p>}
    <button type="submit" disabled={loading || blocked || enviando} className="btn-primary w-full text-center !px-4 disabled:opacity-50">{enviando ? "Registrando pedido…" : "Enviar solicitação pelo WhatsApp"}</button>
    {opened && <button type="button" onClick={() => setModalOpen(true)} className="w-full underline text-sm">Conferir envio do pedido</button>}
  </form>
  <Dialog open={modalOpen} onOpenChange={setModalOpen}>
    <DialogContent className="w-[calc(100%-2rem)] max-w-2xl max-h-[90dvh] overflow-y-auto rounded-3xl p-8 sm:p-14 text-center">
      {sent ? <CheckCircle2 className="mx-auto size-20 text-[color:var(--sage)]" aria-hidden="true" /> : <MessageCircle className="mx-auto size-20 text-[color:var(--petrol)]" aria-hidden="true" />}
      <DialogTitle className="text-3xl sm:text-4xl leading-tight mt-4">{sent ? "Pedido enviado com sucesso!" : "Finalize seu pedido no WhatsApp"}</DialogTitle>
      <DialogDescription className="text-lg sm:text-xl mt-3">{sent ? "Aguarde nosso contato." : "Toque em enviar no WhatsApp. Depois, confirme o envio abaixo."}</DialogDescription>
      {sent ? <button type="button" className="btn-primary justify-center mt-6" onClick={() => setModalOpen(false)}>Voltar ao site</button> : <div className="grid gap-4 mt-6">
        <button type="button" className="btn-primary justify-center" onClick={() => setSent(true)}>Já enviei no WhatsApp</button>
        <a href={opened} target="_blank" rel="noopener noreferrer" className="underline">Abrir WhatsApp novamente</a>
      </div>}
    </DialogContent>
  </Dialog></>;
}
