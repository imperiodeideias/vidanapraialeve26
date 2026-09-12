import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteChrome } from "@/components/SiteChrome";
import { cartProducts, Quantity, useCart } from "@/components/Cart";
import { money, orderName, orderSummary } from "@/lib/order";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Seu pedido — Vida na Praia Leve" }, { name: "robots", content: "noindex" }] }),
  component: CartPage,
});
function CartPage() {
  const { quantities, set, ready } = useCart();
  const { items, total, pending, shipping, grandTotal, url } = orderSummary(cartProducts, quantities);
  return <SiteChrome><section className="container-x pt-32 pb-28">
    <span className="eyebrow">Confira antes de enviar</span>
    <h1 className="text-4xl mt-4 mb-8">Seu pedido</h1>
    {!ready ? <p>Carregando seu carrinho…</p> : !items.length ? <div className="rounded-3xl bg-card p-8 border border-border"><p className="mb-6">Seu carrinho está vazio. Escolha seus produtos favoritos para começar.</p><Link to="/catalogo" className="btn-primary">Explorar catálogo</Link></div> : <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
      <div className="space-y-4">
        {items.map(({ product: p, quantity }) => <article key={p.slug} className="rounded-2xl border border-border bg-card p-5 flex gap-4 flex-wrap sm:flex-nowrap">
          <img src={p.img} alt={p.nome} className="size-24 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg">{orderName(p)}</h2>
            <p className="text-sm mt-2 mb-3">{p.precoCentavos === undefined ? "Preço sob consulta" : money(p.precoCentavos) + " / unidade"}</p>
            <Quantity name={orderName(p)} value={quantity} minimum={p.pedidoMinimo || 1} onChange={q => set(p.slug, q)} />
            <button type="button" className="ml-4 underline text-sm" onClick={() => set(p.slug, 0)} aria-label={"Remover " + orderName(p)}>Remover</button>
            <p className="mt-3 font-semibold">{p.precoCentavos === undefined ? "Valor a confirmar" : money(p.precoCentavos * quantity)}</p>
          </div>
        </article>)}
        <Link to="/catalogo" className="inline-block underline py-4">Adicionar mais produtos</Link>
      </div>
      <aside className="rounded-3xl bg-[color:var(--sand)]/50 p-6 border border-border lg:sticky lg:top-28">
        <h2 className="text-2xl mb-6">Resumo do pedido</h2>
        <dl className="space-y-4">
          <div className="flex justify-between gap-4"><dt>{pending ? "Subtotal com preço" : "Total dos produtos"}</dt><dd className="font-semibold">{money(total)}</dd></div>
          <div className="flex justify-between gap-4"><dt>Frete (Peruíbe-SP)</dt><dd>{shipping === null ? "A confirmar" : shipping === 0 ? "Grátis" : money(shipping)}</dd></div>
          <div className="border-t border-border pt-4"><dt>Total final com frete</dt><dd className="mt-1 font-semibold">{grandTotal === null ? "A confirmar após definir os preços" : money(grandTotal)}</dd></div>
        </dl>
        {pending && <p className="text-sm mt-4">Há itens com preço sob consulta. Seus valores serão confirmados na conversa.</p>}
        <p className="text-sm mt-5 mb-6 text-foreground/70">Entrega em Peruíbe-SP: R$ 8,90. Pedidos acima de R$ 200 em produtos têm frete grátis.</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-center !px-4">Enviar pedido pelo WhatsApp</a>
        <p className="text-xs mt-4 text-foreground/60">O WhatsApp abrirá com os itens e valores preenchidos. Toque em enviar para concluir a solicitação. A loja confirmará seu pedido e endereço de entrega.</p>
      </aside>
    </div>}
  </section></SiteChrome>;
}
