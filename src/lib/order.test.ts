import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanCart, orderSummary } from "./order.ts";
const products = [
  { slug: "a", nome: "Frango", subtitulo: "com arroz", peso: "300g", emBreve: false, precoCentavos: 2090 },
  { slug: "b", nome: "Suco", emBreve: false, precoCentavos: 1890 },
  { slug: "c", nome: "Indisponível", emBreve: true, precoCentavos: 1000 },
  { slug: "d", nome: "Nuts", emBreve: false, pedidoMinimo: 10 },
];
test("revalidates saved carts against availability and quantity limits", () => {
  assert.deepEqual(cleanCart({ a: 2, b: -1, c: 3, d: 1, missing: 5 }, products), { a: 2, d: 10 });
  assert.deepEqual(cleanCart({ a: 0.5, b: 1000 }, products), { b: 999 });
  assert.deepEqual(cleanCart(null, products), {});
});
test("calculates integer-cent totals and encodes complete WhatsApp order", () => {
  const result = orderSummary(products, { a: 2, b: 3 });
  assert.equal(result.total, 9850);
  const url = new URL(result.url);
  assert.equal(url.pathname, "/551333662961");
  const message = url.searchParams.get("text")!;
  assert.match(message, /2 × Frango — com arroz — 300g/);
  assert.match(message, /3 × Suco/);
  assert.match(message, /98,50/);
  assert.match(message, /Frete: a combinar/);
  assert.match(message, /Total final com frete: a confirmar/);
});
test("does not treat unpriced products as a complete total", () => {
  const result = orderSummary(products, { a: 1, d: 10 });
  assert.equal(result.pending, true);
  assert.match(decodeURIComponent(result.url), /Subtotal dos itens com preço/);
});
