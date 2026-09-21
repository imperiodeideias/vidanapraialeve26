import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import { painel, salvarProduto, registrarMovimento, confirmarPedido, cancelarPedido, sincronizarCatalogo } from "@/lib/admin.functions";
import { money } from "@/lib/order";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel — Vida na Praia Leve" },
      { name: "description", content: "Painel interno de estoque, pedidos e vendas da Vida na Praia Leve." },
      { property: "og:title", content: "Painel — Vida na Praia Leve" },
      { property: "og:description", content: "Painel interno de estoque e pedidos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Produto = { slug: string; nome: string; quantidade: number; preco_centavos: number | null; estoque_minimo: number; ativo: boolean; controlar_estoque: boolean };
const campo = "rounded-lg border border-border bg-white px-2 py-2 text-sm";

function AdminPage() {
  const buscar = useServerFn(painel);
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["painel"], queryFn: () => buscar() });
  const recarregar = () => queryClient.invalidateQueries({ queryKey: ["painel"] });
  const [aba, setAba] = useState<"estoque" | "pedidos" | "vendas" | "historico">("estoque");
  const [dias, setDias] = useState(30);
  const [busca, setBusca] = useState("");
  const [aviso, setAviso] = useState("");

  const sincronizar = useServerFn(sincronizarCatalogo);
  const sync = useMutation({
    mutationFn: () => sincronizar(),
    onSuccess: (r) => { setAviso(r.adicionados ? `${r.adicionados} produto(s) do catálogo adicionados ao estoque.` : "Estoque já está com todos os produtos do catálogo."); recarregar(); },
    onError: (e: Error) => setAviso(e.message),
  });

  const estoque = (data?.estoque ?? []) as Produto[];
  const alertas = estoque.filter((p) => p.ativo && p.controlar_estoque && p.quantidade <= p.estoque_minimo);
  const pedidos = data?.pedidos ?? [];
  const pendentes = pedidos.filter((p) => p.status === "pendente");

  const maisVendidos = useMemo(() => {
    const limite = Date.now() - dias * 24 * 60 * 60 * 1000;
    const totais = new Map<string, { nome: string; quantidade: number }>();
    for (const v of data?.vendas ?? []) {
      if (!v.confirmado_em || new Date(v.confirmado_em).getTime() < limite) continue;
      const atual = totais.get(v.slug) || { nome: v.nome, quantidade: 0 };
      atual.quantidade += v.quantidade;
      totais.set(v.slug, atual);
    }
    return [...totais.values()].sort((a, b) => b.quantidade - a.quantidade).slice(0, 15);
  }, [data, dias]);

  if (error) return <SiteChrome><section className="container-x pt-32 pb-28"><h1 className="text-3xl">Painel</h1><p className="mt-4">{(error as Error).message}</p><Link to="/conta" className="underline mt-4 inline-block">Voltar para minha conta</Link></section></SiteChrome>;

  return (
    <SiteChrome>
      <section className="container-x pt-32 pb-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><span className="eyebrow">Uso interno</span><h1 className="text-4xl mt-4">Painel</h1></div>
          <div className="flex gap-3 items-center">
            <button type="button" onClick={() => sync.mutate()} disabled={sync.isPending} className="btn-primary !px-4 !py-3 text-xs disabled:opacity-50">Sincronizar catálogo</button>
            <Link to="/conta" className="underline text-sm">Minha conta</Link>
          </div>
        </div>
        {aviso && <p role="status" className="mt-4 text-sm text-[color:var(--petrol)]">{aviso}</p>}

        {isLoading ? <p className="mt-10">Carregando painel…</p> : <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Card titulo="Pedidos aguardando confirmação" valor={String(pendentes.length)} />
            <Card titulo="Produtos em falta ou estoque baixo" valor={String(alertas.length)} />
            <Card titulo="Itens em estoque" valor={String(estoque.reduce((s, p) => s + p.quantidade, 0))} />
          </div>

          {!!alertas.length && (
            <div className="mt-6 rounded-2xl border border-[color:var(--coral)]/40 bg-[color:var(--coral)]/10 p-5">
              <h2 className="text-lg mb-3">Precisa repor</h2>
              <ul className="text-sm grid gap-1 sm:grid-cols-2">
                {alertas.map((p) => <li key={p.slug}>{p.nome} — <strong>{p.quantidade === 0 ? "esgotado" : p.quantidade + " un."}</strong></li>)}
              </ul>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-2">
            {([["estoque", "Estoque"], ["pedidos", "Pedidos"], ["vendas", "Mais vendidos"], ["historico", "Movimentações"]] as const).map(([id, label]) => (
              <button key={id} type="button" onClick={() => setAba(id)} className={`rounded-full px-4 py-2 text-sm border ${aba === id ? "bg-[color:var(--petrol)] text-white border-transparent" : "border-border"}`}>{label}</button>
            ))}
          </div>

          {aba === "estoque" && <div className="mt-6">
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar produto" aria-label="Buscar produto" className="w-full max-w-sm rounded-xl border border-border bg-white px-3 py-3 mb-4" />
            {!estoque.length && <p className="text-sm">Nenhum produto no estoque ainda. Use “Sincronizar catálogo”.</p>}
            <div className="space-y-3">
              {estoque.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase())).map((p) => <LinhaProduto key={p.slug} produto={p} onDone={(msg) => { setAviso(msg); recarregar(); }} />)}
            </div>
          </div>}

          {aba === "pedidos" && <div className="mt-6 space-y-4">
            {!pedidos.length && <p className="text-sm">Nenhum pedido registrado ainda.</p>}
            {pedidos.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} onDone={(msg) => { setAviso(msg); recarregar(); }} />)}
          </div>}

          {aba === "vendas" && <div className="mt-6">
            <div className="flex gap-2 mb-5">
              {[7, 30, 90].map((d) => <button key={d} type="button" onClick={() => setDias(d)} className={`rounded-full px-4 py-2 text-sm border ${dias === d ? "bg-[color:var(--sage)] text-white border-transparent" : "border-border"}`}>{d} dias</button>)}
            </div>
            {!maisVendidos.length ? <p className="text-sm">Nenhuma venda confirmada nesse período. O consumo próprio não entra aqui.</p> : <ol className="space-y-2">
              {maisVendidos.map((v, i) => <li key={v.nome} className="flex justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 text-sm"><span>{i + 1}. {v.nome}</span><strong>{v.quantidade} un.</strong></li>)}
            </ol>}
          </div>}

          {aba === "historico" && <div className="mt-6 space-y-2">
            {!(data?.movimentacoes ?? []).length && <p className="text-sm">Sem movimentações ainda.</p>}
            {(data?.movimentacoes ?? []).map((m) => (
              <div key={m.id} className="flex flex-wrap justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                <span>{new Date(m.created_at).toLocaleString("pt-BR")} — {m.slug}</span>
                <span>{m.tipo === "venda" ? "Venda" : m.tipo === "entrada" ? "Entrada" : m.tipo === "consumo_proprio" ? "Consumo próprio" : "Ajuste"}: <strong>{m.quantidade > 0 ? "+" : ""}{m.quantidade}</strong></span>
              </div>
            ))}
          </div>}
        </>}
      </section>
    </SiteChrome>
  );
}

function Card({ titulo, valor }: { titulo: string; valor: string }) {
  return <div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-foreground/70">{titulo}</p><p className="text-3xl mt-2">{valor}</p></div>;
}

function LinhaProduto({ produto, onDone }: { produto: Produto; onDone: (msg: string) => void }) {
  const salvar = useServerFn(salvarProduto);
  const movimentar = useServerFn(registrarMovimento);
  const [form, setForm] = useState({ quantidade: String(produto.quantidade), preco: produto.preco_centavos === null ? "" : (produto.preco_centavos / 100).toFixed(2), minimo: String(produto.estoque_minimo), ativo: produto.ativo, controlar: produto.controlar_estoque });
  const [extra, setExtra] = useState("1");

  const salvarMut = useMutation({
    mutationFn: () => salvar({ data: { slug: produto.slug, quantidade: Number(form.quantidade), preco_centavos: form.preco.trim() === "" ? null : Math.round(Number(form.preco.replace(",", ".")) * 100), estoque_minimo: Number(form.minimo), ativo: form.ativo, controlar_estoque: form.controlar } }),
    onSuccess: () => onDone(`${produto.nome} atualizado.`),
    onError: (e: Error) => onDone(e.message),
  });
  const movMut = useMutation({
    mutationFn: (tipo: "entrada" | "consumo_proprio") => movimentar({ data: { slug: produto.slug, quantidade: Number(extra), tipo } }),
    onSuccess: () => onDone(`Movimentação registrada em ${produto.nome}.`),
    onError: (e: Error) => onDone(e.message),
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] items-center">
      <div>
        <p className="font-semibold">{produto.nome}</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-xs">Quantidade<input className={campo + " w-24 block mt-1"} inputMode="numeric" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} /></label>
          <label className="text-xs">Preço (R$)<input className={campo + " w-28 block mt-1"} inputMode="decimal" placeholder="sob consulta" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} /></label>
          <label className="text-xs">Alerta abaixo de<input className={campo + " w-20 block mt-1"} inputMode="numeric" value={form.minimo} onChange={(e) => setForm({ ...form, minimo: e.target.value })} /></label>
          <label className="text-xs flex items-center gap-2 pb-2"><input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} /> À venda</label>
          <label className="text-xs flex items-center gap-2 pb-2"><input type="checkbox" checked={form.controlar} onChange={(e) => setForm({ ...form, controlar: e.target.checked })} /> Controlar estoque</label>
          <button type="button" onClick={() => salvarMut.mutate()} disabled={salvarMut.isPending} className="btn-primary !px-3 !py-2 text-xs disabled:opacity-50">Salvar</button>
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-2 md:justify-end">
        <label className="text-xs">Qtd.<input className={campo + " w-16 block mt-1"} inputMode="numeric" value={extra} onChange={(e) => setExtra(e.target.value)} /></label>
        <button type="button" onClick={() => movMut.mutate("entrada")} disabled={movMut.isPending} className="rounded-lg border border-border px-3 py-2 text-xs">+ Entrada</button>
        <button type="button" onClick={() => movMut.mutate("consumo_proprio")} disabled={movMut.isPending} className="rounded-lg border border-border px-3 py-2 text-xs">− Consumo próprio</button>
      </div>
    </div>
  );
}

type PedidoRow = {
  id: string; cliente_nome: string; cliente_telefone: string | null; cliente_cpf: string | null; endereco: string;
  status: string; total_centavos: number; frete_centavos: number; created_at: string;
  pedido_itens?: { id: string; nome: string; quantidade: number }[] | null;
};

function PedidoCard({ pedido, onDone }: { pedido: PedidoRow; onDone: (msg: string) => void }) {
  const confirmar = useServerFn(confirmarPedido);
  const cancelar = useServerFn(cancelarPedido);
  const confirmarMut = useMutation({ mutationFn: () => confirmar({ data: { id: pedido.id } }), onSuccess: () => onDone("Pedido confirmado e estoque debitado."), onError: (e: Error) => onDone(e.message) });
  const cancelarMut = useMutation({ mutationFn: () => cancelar({ data: { id: pedido.id } }), onSuccess: () => onDone("Pedido cancelado."), onError: (e: Error) => onDone(e.message) });
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{pedido.cliente_nome}</p>
          <p className="text-sm text-foreground/70">{new Date(pedido.created_at).toLocaleString("pt-BR")}{pedido.cliente_telefone ? " — " + pedido.cliente_telefone : ""}</p>
        </div>
        <span className="text-xs uppercase tracking-widest rounded-full px-3 py-1 bg-[color:var(--sand)] text-[color:var(--petrol)]">{pedido.status === "confirmado" ? "Confirmado" : pedido.status === "cancelado" ? "Cancelado" : "Pendente"}</span>
      </div>
      <p className="text-sm mt-3">{pedido.endereco}</p>
      <ul className="mt-3 text-sm space-y-1">{(pedido.pedido_itens ?? []).map((i) => <li key={i.id}>{i.quantidade} × {i.nome}</li>)}</ul>
      <p className="mt-3 font-semibold">{money((pedido.total_centavos || 0) + (pedido.frete_centavos || 0))}</p>
      {pedido.status === "pendente" && <div className="mt-4 flex gap-3">
        <button type="button" onClick={() => confirmarMut.mutate()} disabled={confirmarMut.isPending} className="btn-primary !px-4 !py-2 text-xs disabled:opacity-50">Confirmar e dar baixa</button>
        <button type="button" onClick={() => cancelarMut.mutate()} disabled={cancelarMut.isPending} className="underline text-sm">Cancelar</button>
      </div>}
    </article>
  );
}
