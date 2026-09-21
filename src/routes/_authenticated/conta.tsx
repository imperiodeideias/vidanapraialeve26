import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import { supabase } from "@/integrations/supabase/client";
import { meuPerfil, salvarPerfil } from "@/lib/conta.functions";
import { useCart } from "@/components/Cart";
import { money } from "@/lib/order";

export const Route = createFileRoute("/_authenticated/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — Vida na Praia Leve" },
      { name: "description", content: "Seus dados de entrega e o histórico dos seus pedidos na Vida na Praia Leve." },
      { property: "og:title", content: "Minha conta — Vida na Praia Leve" },
      { property: "og:description", content: "Seus dados de entrega e histórico de pedidos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ContaPage,
});

const estados = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");
const campo = "w-full rounded-xl border border-border bg-white px-3 py-3";

function ContaPage() {
  const buscar = useServerFn(meuPerfil);
  const salvar = useServerFn(salvarPerfil);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { set } = useCart();
  const { data, isLoading } = useQuery({ queryKey: ["minha-conta"], queryFn: () => buscar() });
  const [form, setForm] = useState({ nome: "", cpf: "", telefone: "", cep: "", rua: "", numero: "", bairro: "", cidade: "", estado: "" });
  const [salvo, setSalvo] = useState("");

  useEffect(() => {
    const p = data?.perfil;
    if (p) setForm({ nome: p.nome || "", cpf: p.cpf || "", telefone: p.telefone || "", cep: p.cep || "", rua: p.rua || "", numero: p.numero || "", bairro: p.bairro || "", cidade: p.cidade || "", estado: p.estado || "" });
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => salvar({ data: form }),
    onSuccess: () => { setSalvo("Dados salvos!"); queryClient.invalidateQueries({ queryKey: ["minha-conta"] }); },
    onError: (e: Error) => setSalvo(e.message),
  });

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <SiteChrome>
      <section className="container-x pt-32 pb-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Sua conta</span>
            <h1 className="text-4xl mt-4">Olá{form.nome ? ", " + form.nome.split(" ")[0] : ""}</h1>
          </div>
          <div className="flex gap-4 items-center">
            {data?.admin && <Link to="/admin" className="btn-primary !px-4 !py-3 text-xs">Abrir painel</Link>}
            <button type="button" onClick={sair} className="underline text-sm">Sair</button>
          </div>
        </div>

        {isLoading ? <p className="mt-10">Carregando…</p> : <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr] items-start">
          <form className="space-y-4 rounded-3xl bg-card border border-border p-6" onSubmit={(e) => { e.preventDefault(); setSalvo(""); mutation.mutate(); }}>
            <h2 className="text-2xl mb-2">Meus dados</h2>
            <p className="text-sm text-foreground/70 mb-4">Usamos estes dados para preencher seus próximos pedidos.</p>
            {([["nome", "Nome completo"], ["cpf", "CPF"], ["telefone", "Telefone / WhatsApp"], ["cep", "CEP"], ["rua", "Endereço"], ["numero", "Número"], ["bairro", "Bairro"], ["cidade", "Cidade"]] as const).map(([key, label]) => (
              <div key={key}>
                <label htmlFor={"perfil-" + key} className="block text-sm mb-2">{label}</label>
                <input id={"perfil-" + key} maxLength={160} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={campo} />
              </div>
            ))}
            <div>
              <label htmlFor="perfil-estado" className="block text-sm mb-2">Estado</label>
              <select id="perfil-estado" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className={campo}>
                <option value="">Selecione</option>
                {estados.map((uf) => <option key={uf}>{uf}</option>)}
              </select>
            </div>
            <button type="submit" disabled={mutation.isPending} className="btn-primary w-full text-center !px-4 disabled:opacity-50">Salvar dados</button>
            {salvo && <p role="status" className="text-sm">{salvo}</p>}
          </form>

          <div>
            <h2 className="text-2xl mb-6">Meus pedidos</h2>
            {!data?.pedidos.length ? <p className="text-sm text-foreground/70">Você ainda não fez pedidos por aqui. <Link to="/catalogo" className="underline">Ver catálogo</Link></p> : <div className="space-y-4">
              {data.pedidos.map((pedido) => {
                const itens = (pedido.pedido_itens ?? []) as { id: string; slug: string; nome: string; quantidade: number }[];
                return (
                  <article key={pedido.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-foreground/70">{new Date(pedido.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
                      <span className="text-xs uppercase tracking-widest rounded-full px-3 py-1 bg-[color:var(--sand)] text-[color:var(--petrol)]">{pedido.status === "confirmado" ? "Confirmado" : pedido.status === "cancelado" ? "Cancelado" : "Aguardando confirmação"}</span>
                    </div>
                    <ul className="mt-3 text-sm space-y-1">
                      {itens.map((i) => <li key={i.id}>{i.quantidade} × {i.nome}</li>)}
                    </ul>
                    <p className="mt-3 font-semibold">{money((pedido.total_centavos || 0) + (pedido.frete_centavos || 0))}</p>
                    <button type="button" className="mt-4 underline text-sm" onClick={() => { itens.forEach((i) => set(i.slug, i.quantidade)); navigate({ to: "/carrinho" }); }}>Pedir novamente</button>
                  </article>
                );
              })}
            </div>}
          </div>
        </div>}
      </section>
    </SiteChrome>
  );
}
