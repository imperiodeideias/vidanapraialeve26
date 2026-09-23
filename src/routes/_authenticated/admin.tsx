import { AdminSales } from "@/components/AdminSales";
import { AdminStock } from "@/components/AdminStock";
import { ManualCustomers } from "@/components/ManualCustomers";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import { painel, confirmarPedido, cancelarPedido, sincronizarCatalogo, type ClienteResumo } from "@/lib/admin.functions";
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

function AdminPage() {
  const buscar = useServerFn(painel);
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["painel"], queryFn: () => buscar() });
  const recarregar = () => { queryClient.invalidateQueries({ queryKey: ["painel"] }); queryClient.invalidateQueries({ queryKey: ["vendas"] }); };
  const [aba, setAba] = useState<"estoque" | "pedidos" | "clientes" | "vendas" | "historico">("estoque");
  const [buscaCliente, setBuscaCliente] = useState("");
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

  const clientesFiltrados = useMemo(() => {
    const termo = buscaCliente.trim().toLowerCase();
    const lista = (data?.clientes ?? []) as ClienteResumo[];
    if (!termo) return lista;
    return lista.filter((c) => [c.nome, c.email, c.cpf, c.telefone].some((v) => (v || "").toLowerCase().includes(termo)));
  }, [data, buscaCliente]);

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

          <Link to="/admin-reposicao" className="btn-primary mt-6 inline-flex">Produtos para reposição ({alertas.length})</Link>

          <div className="mt-10 flex flex-wrap gap-2">
            {([["estoque", "Estoque"], ["pedidos", "Pedidos"], ["clientes", "Clientes"], ["vendas", "Vendas"], ["historico", "Movimentações"]] as const).map(([id, label]) => (
              <button key={id} type="button" onClick={() => setAba(id)} className={`rounded-full px-4 py-2 text-sm border ${aba === id ? "bg-[color:var(--petrol)] text-white border-transparent" : "border-border"}`}>{label}</button>
            ))}
          </div>

          {aba === "estoque" && <div className="mt-6">
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar produto" aria-label="Buscar produto" className="w-full max-w-sm rounded-xl border border-border bg-white px-3 py-3 mb-4" />
            {!estoque.length && <p className="text-sm">Nenhum produto no estoque ainda. Use “Sincronizar catálogo”.</p>}
            <AdminStock produtos={estoque.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))} clientes={data?.clientesManuais ?? []} custos={data?.custos ?? {}} onDone={msg => { setAviso(msg); recarregar(); }} />
          </div>}

          {aba === "pedidos" && <div className="mt-6 space-y-4">
            {!pedidos.length && <p className="text-sm">Nenhum pedido registrado ainda.</p>}
            {pedidos.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} onDone={(msg) => { setAviso(msg); recarregar(); }} />)}
          </div>}

          {aba === "clientes" && <div className="mt-6">
            <input value={buscaCliente} onChange={(e) => setBuscaCliente(e.target.value)} placeholder="Buscar por nome, telefone, e-mail ou CPF" aria-label="Buscar cliente" className="w-full max-w-md rounded-xl border border-border bg-white px-3 py-3 mb-4" />
            <ManualCustomers clientes={data?.clientesManuais ?? []} busca={buscaCliente} onDone={msg => { setAviso(msg); recarregar(); }} />
            {!clientesFiltrados.length ? <p className="text-sm">Nenhum cliente encontrado.</p> : <div className="space-y-3">
              {clientesFiltrados.map((c) => <ClienteCard key={c.chave} cliente={c} />)}
            </div>}
          </div>}

          {aba === "vendas" && <AdminSales />}

          {aba === "historico" && <div className="mt-6 space-y-2">
            {!(data?.movimentacoes ?? []).length && <p className="text-sm">Sem movimentações ainda.</p>}
            {(data?.movimentacoes ?? []).map((m) => (
              <div key={m.id} className="flex flex-wrap justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                <span>{new Date(m.created_at).toLocaleString("pt-BR")} — {m.slug}</span>
                <span>{m.tipo === "venda" ? "Venda" : m.tipo === "venda_extra" ? "Venda extra (fora do site)" : m.tipo === "entrada" ? "Entrada" : m.tipo === "consumo_proprio" ? "Consumo próprio" : "Ajuste"}{m.motivo ? " — " + m.motivo : ""}: <strong>{m.quantidade > 0 ? "+" : ""}{m.quantidade}</strong></span>
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

function ClienteCard({ cliente }: { cliente: ClienteResumo }) {
  const [aberto, setAberto] = useState(false);
  const confirmados = cliente.pedidos.filter((p) => p.status === "confirmado").length;
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{cliente.nome} <span className="text-xs uppercase tracking-widest rounded-full px-2 py-1 ml-2 bg-[color:var(--sand)] text-[color:var(--petrol)]">{cliente.temConta ? "Com conta" : "Visitante"}</span></p>
          <p className="text-sm text-foreground/70 mt-1">{[cliente.telefone, cliente.email, cliente.cpf ? "CPF " + cliente.cpf : null].filter(Boolean).join(" — ") || "Sem contato informado"}</p>
          {cliente.endereco && <p className="text-sm text-foreground/70">{cliente.endereco}</p>}
        </div>
        <div className="text-sm text-right">
          <p>{cliente.pedidos.length} pedido(s) · {confirmados} confirmado(s)</p>
          <p className="font-semibold">{money(cliente.totalGasto)}</p>
          <p className="text-foreground/70">{cliente.ultimoPedido ? "Último: " + new Date(cliente.ultimoPedido).toLocaleDateString("pt-BR") : "Ainda sem pedidos"}</p>
        </div>
      </div>
      {!!cliente.pedidos.length && <button type="button" onClick={() => setAberto(!aberto)} className="underline text-sm mt-3">{aberto ? "Ocultar pedidos" : "Ver pedidos"}</button>}
      {aberto && <div className="mt-3 space-y-2">
        {cliente.pedidos.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
            <div className="flex flex-wrap justify-between gap-3">
              <span>{new Date(p.created_at).toLocaleString("pt-BR")}</span>
              <span>{p.status === "confirmado" ? "Confirmado" : p.status === "cancelado" ? "Cancelado" : "Pendente"} · <strong>{money((p.total_centavos || 0) + (p.frete_centavos || 0))}</strong></span>
            </div>
            <ul className="mt-2 text-foreground/75">{(p.pedido_itens ?? []).map((i) => <li key={i.id}>{i.quantidade} × {i.nome}</li>)}</ul>
          </div>
        ))}
      </div>}
    </article>
  );
}
