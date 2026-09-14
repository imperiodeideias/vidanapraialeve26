import { useEffect, useRef, useState } from "react";

export function DeliveryForm({ getUrl }: { getUrl: (name: string, address: string) => string }) {
  const [name, setName] = useState("");
  const [cep, setCep] = useState("");
  const [fields, setFields] = useState({ street: "", number: "", district: "", city: "", state: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState("");
  const [sent, setSent] = useState(false);
  const version = useRef(0);
  useEffect(() => {
    const id = ++version.current;
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
        setFields(old => ({ ...old, street: data.logradouro || "", district: data.bairro || "", city: data.localidade || "", state: data.uf || "" }));
        setStatus("Confira o endereço e preencha os campos que faltarem.");
      })
      .catch(() => { if (id === version.current) setStatus("Não foi possível localizar o CEP. Confira os números e preencha o endereço manualmente."); })
      .finally(() => { window.clearTimeout(timeout); if (id === version.current) setLoading(false); });
    return () => { ++version.current; controller.abort(); window.clearTimeout(timeout); };
  }, [cep]);
  const inputClass = "w-full rounded-xl border border-border bg-white px-3 py-3";
  if (sent) return <div role="status" className="rounded-xl bg-white p-5 text-[color:var(--petrol)]"><p className="font-semibold">Pedido enviado com sucesso! Aguarde nosso contato.</p><button type="button" onClick={() => { setSent(false); setOpened(""); }} className="mt-4 underline text-sm">Voltar ao pedido</button></div>;
  return <form className="space-y-4" onSubmit={e => {
    e.preventDefault();
    if (loading || !name.trim() || Object.values(fields).some(v => !v.trim())) return;
    const address = fields.street.trim() + ", " + fields.number.trim() + " - " + fields.district.trim() + ", " + fields.city.trim() + " - " + fields.state + ", CEP " + cep.slice(0,5) + "-" + cep.slice(5);
    const url = getUrl(name.trim(), address);
    window.open(url, "_blank", "noopener,noreferrer");
    setOpened(url);
  }}>
    <div><label htmlFor="pedido-nome" className="block text-sm mb-2">Seu nome</label><input id="pedido-nome" autoComplete="name" required minLength={2} maxLength={120} value={name} onChange={e => { setName(e.target.value); setOpened(""); }} className={inputClass} /></div>
    <div><label htmlFor="pedido-cep" className="block text-sm mb-2">CEP</label><input id="pedido-cep" autoComplete="postal-code" inputMode="numeric" required pattern="[0-9]{5}-[0-9]{3}" maxLength={9} value={cep.length > 5 ? cep.slice(0,5) + "-" + cep.slice(5) : cep} onChange={e => { ++version.current; setCep(e.target.value.replace(/\D/g, "").slice(0,8)); setFields({ street: "", number: "", district: "", city: "", state: "" }); setOpened(""); }} className={inputClass} /></div>
    <p role="status" className="text-xs text-foreground/65">{status}</p>
    {([
      ["street", "Endereço", "address-line1"], ["number", "Número", "off"],
      ["district", "Bairro", "address-level3"], ["city", "Cidade", "address-level2"],
    ] as const).map(([key, label, autocomplete]) => <div key={key}><label htmlFor={"pedido-" + key} className="block text-sm mb-2">{label}</label><input id={"pedido-" + key} autoComplete={autocomplete} required maxLength={160} disabled={loading} value={fields[key]} onChange={e => { setFields(old => ({ ...old, [key]: e.target.value })); setOpened(""); }} className={inputClass} /></div>)}
    <div><label htmlFor="pedido-state" className="block text-sm mb-2">Estado</label><select id="pedido-state" autoComplete="address-level1" required disabled={loading} value={fields.state} onChange={e => { setFields(old => ({ ...old, state: e.target.value })); setOpened(""); }} className={inputClass}><option value="">Selecione</option>{"AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ").map(uf => <option key={uf}>{uf}</option>)}</select></div>
    <p className="text-xs text-foreground/65">Nome e endereço serão incluídos no WhatsApp. Frete informado válido para Peruíbe-SP.</p>
    <button type="submit" disabled={loading} className="btn-primary w-full text-center !px-4 disabled:opacity-50">Enviar pedido pelo WhatsApp</button>
    {opened && <div className="rounded-xl bg-white p-4 space-y-3" role="status"><p className="text-sm">Finalize o envio no WhatsApp. Depois, confirme abaixo.</p><a href={opened} target="_blank" rel="noopener noreferrer" className="block underline text-sm">Abrir WhatsApp novamente</a><button type="button" onClick={() => setSent(true)} className="btn-primary w-full !px-3">Já enviei no WhatsApp</button></div>}
  </form>;
}
