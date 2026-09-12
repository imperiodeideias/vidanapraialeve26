export const whatsappNumber = "551333662961";
export const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value / 100);
export type OrderProduct = { slug: string; nome: string; subtitulo?: string; peso?: string; emBreve: boolean; precoCentavos?: number; pedidoMinimo?: number };
export type Quantities = Record<string, number>;
export function cleanCart(value: unknown, products: OrderProduct[]): Quantities {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Quantities = {};
  for (const p of products) {
    const q = (value as Quantities)[p.slug];
    if (!p.emBreve && Number.isInteger(q) && q > 0) result[p.slug] = Math.max(p.pedidoMinimo || 1, Math.min(999, q));
  }
  return result;
}
export function orderName(p: OrderProduct) {
  return [p.nome, p.subtitulo, p.peso].filter(Boolean).join(" — ");
}
export function orderSummary<T extends OrderProduct>(products: T[], quantities: Quantities) {
  const cart = cleanCart(quantities, products);
  const items = products.filter(p => cart[p.slug]).map(p => ({ product: p, quantity: cart[p.slug] }));
  const total = items.reduce((sum, i) => sum + (i.product.precoCentavos || 0) * i.quantity, 0);
  const pending = items.some(i => i.product.precoCentavos === undefined);
  const shipping = !items.length || total > 20000 ? 0 : pending ? null : 890;
  const grandTotal = pending ? null : total + (shipping || 0);
  const message = [
    "Olá, estou no site da Vida na Praia Leve e gostaria de fazer um pedido:",
    "",
    ...items.map(({ product: p, quantity: q }) => p.precoCentavos === undefined
      ? q + " × " + orderName(p) + " | preço sob consulta"
      : q + " × " + orderName(p) + " | " + money(p.precoCentavos) + " cada | " + money(p.precoCentavos * q)),
    "",
    (pending ? "Subtotal dos itens com preço: " : "Total dos produtos: ") + money(total),
    ...(pending ? ["Há itens com preço a confirmar."] : []),
    "Frete (Peruíbe-SP): " + (shipping === null ? "a confirmar após definir os preços" : shipping === 0 ? "Grátis" : money(shipping)),
    "Total com frete: " + (grandTotal === null ? "a confirmar" : money(grandTotal)),
    "Entrega em Peruíbe-SP: R$ 8,90. Pedidos acima de R$ 200 em produtos têm frete grátis.",
  ].join("\n");
  return { items, total, pending, shipping, grandTotal, url: "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message) };
}
