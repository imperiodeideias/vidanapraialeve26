import { CatalogPhoto } from "@/components/CatalogPhoto";
import { useMemo, useState } from "react";
import { deliveryFee, resumoEntrega, type DeliveryRegion } from "@/lib/delivery";
import { DeliveryForm } from "@/components/DeliveryForm";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SiteChrome } from "@/components/SiteChrome";
import { cartProducts, Quantity, useCart } from "@/components/Cart";
import { money, orderName, orderSummary } from "@/lib/order";
import { useEstoque } from "@/hooks/useEstoque";
import { disponivel, precoDe } from "@/lib/estoque";
import { criarPedido } from "@/lib/loja.functions";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [
    { title: "Seu pedido — Vida na Praia Leve" },
    { name: "description", content: "Confira os produtos, calcule a entrega pelo CEP e envie sua solicitação à Vida na Praia Leve." },
    { property: "og:title", content: "Seu pedido — Vida na Praia Leve" },
    { property: "og:description", content: "Confira os produtos e calcule a entrega antes de enviar sua solicitação." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: CartPage,
});
function CartPage() {
  const { quantities, set, ready } = useCart();
  const { estoque } = useEstoque();
  const registrar = useServerFn(criarPedido);
  const [region, setRegion] = useState<DeliveryRegion>({ city: "", state: "" });
  const produtos = useMemo(() => cartProducts.map(p => ({ ...p, precoCentavos: precoDe(p.slug, p.precoCentavos, estoque) })), [estoque]);
  const { items, total, pending } = orderSummary(produtos, quantities);
  const fee = deliveryFee(total, region);
  const shipping = pending && fee === 890 ? null : fee;
  const grandTotal = pending || shipping === null ? null : total + shipping;
  const indisponiveis = items.filter(({ product: p, quantity }) => {
    const restante = disponivel(p.slug, estoque);
    return restante !== undefined && restante < quantity;
  });
  return <SiteChrome><section className="container-x pt-32 pb-28">
    <span className="eyebrow">Confira antes de enviar</span>
    <h1 className="text-4xl mt-4 mb-8">Seu pedido</h1>
    <p className="-mt-4 mb-8 text-sm text-foreground/70">Entrega agendada a combinar. Atendimento de segunda a sábado, das 9h às 18h. Pagamento por PIX, dinheiro, débito ou crédito.</p>
    {!ready ? <p>Carregando seu carrinho…</p> : !items.length ? <div className="rounded-3xl bg-card p-8 border border-border"><p className="mb-6">Seu carrinho está vazio. Escolha seus produtos favoritos para começar.</p><Link to="/catalogo" className="btn-primary">Explorar catálogo</Link></div> : <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
      <div className="space-y-4">
        {items.map(({ product: p, quantity }) => {
          const restante = disponivel(p.slug, estoque);
          return <article key={p.slug} className="rounded-2xl border border-border bg-card p-5 flex gap-4 flex-wrap sm:flex-nowrap">
            <CatalogPhoto src={p.img} alt={p.nome} className="relative size-24 shrink-0 rounded-xl object-cover object-center" />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg">{orderName(p)}</h2>
              <p className="text-sm mt-2 mb-3">{p.precoCentavos === undefined ? "Preço sob consulta" : money(p.precoCentavos) + " / unidade"}</p>
              <Quantity name={orderName(p)} value={quantity} minimum={p.pedidoMinimo || 1} onChange={q => set(p.slug, q)} />
              <button type="button" className="ml-4 underline text-sm" onClick={() => set(p.slug, 0)} aria-label={"Remover " + orderName(p)}>Remover</button>
              <p className="mt-3 font-semibold">{p.precoCentavos === undefined ? "Valor a confirmar" : money(p.precoCentavos * quantity)}</p>
              {restante !== undefined && restante < quantity && <p className="mt-2 text-sm font-semibold text-[color:var(--coral)]">{restante === 0 ? "Esgotado no momento — remova para continuar." : `Temos apenas ${restante} unidade(s). Ajuste a quantidade.`}</p>}
            </div>
          </article>;
        })}
        <Link to="/catalogo" className="inline-block underline py-4">Adicionar mais produtos</Link>
      </div>
      <aside className="rounded-3xl bg-[color:var(--sand)]/50 p-6 border border-border lg:sticky lg:top-28">
        <h2 className="text-2xl mb-6">Resumo do pedido</h2>
        <dl className="space-y-4">
          <div className="flex justify-between gap-4"><dt>{pending ? "Subtotal (itens com preço)" : "Subtotal"}</dt><dd className="font-semibold">{money(total)}</dd></div>
          <div className="flex justify-between gap-4"><dt>Entrega{region.city ? ` (${region.city}-${region.state})` : ""}</dt><dd>{shipping === null ? (region.city ? "—" : "Informe o CEP") : shipping === 0 ? "Grátis" : money(shipping)}</dd></div>
          <div className="border-t border-border pt-4"><dt>Total</dt><dd className="mt-1 font-semibold">{grandTotal === null ? (pending ? "Confirmado pela loja na conversa" : "Informe seu CEP para calcular a entrega") : money(grandTotal)}</dd></div>
        </dl>
        {pending && <p className="text-sm mt-4">Há itens com preço sob consulta. Seus valores serão confirmados na conversa.</p>}
        <p className="text-sm mt-5 mb-6 text-foreground/70">{resumoEntrega}</p>
        {indisponiveis.length ? <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">Ajuste os itens sem estoque antes de enviar o pedido.</p> : <DeliveryForm onRegionChange={setRegion} getUrl={async dados => {
          const resumo = orderSummary(produtos, quantities, { name: dados.name, address: dados.address, region: dados.region });
          await registrar({ data: {
            nome: dados.name,
            cpf: dados.cpf,
            telefone: dados.phone,
            email: dados.email,
            endereco: dados.address,
            frete_centavos: deliveryFee(resumo.total, dados.region) ?? 0,
            itens: items.map(({ product, quantity }) => ({ slug: product.slug, quantidade: quantity })),
          } });
          return resumo.url;
        }} />}
        <p className="text-xs mt-4 text-foreground/60">O WhatsApp abrirá com seu pedido preenchido. Enviar a mensagem é uma solicitação: a loja confirmará a disponibilidade e o pedido.</p>
      </aside>
    </div>}
  </section></SiteChrome>;
}
