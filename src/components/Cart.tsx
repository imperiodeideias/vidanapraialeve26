import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, ShoppingBag, ShoppingCart } from "lucide-react";
import { linhas, type Produto } from "@/data/catalogo";
import { cleanCart, money, whatsappNumber, type Quantities } from "@/lib/order";
import { useEstoque } from "@/hooks/useEstoque";
import { disponivel, precoDe, type EstoqueMap } from "@/lib/estoque";
import { Button } from "@/components/ui/button";

export const cartProducts = linhas.flatMap(l => l.produtos);
const storageKey = "vnpl-pedido-v1";
const Context = createContext<{ quantities: Quantities; ready: boolean; add: (slug: string, q: number) => void; set: (slug: string, q: number) => void } | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [quantities, update] = useState<Quantities>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { update(cleanCart(JSON.parse(localStorage.getItem(storageKey) || "{}"), cartProducts)); } catch { /* Start with an empty cart if storage is unavailable. */ }
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey) {
        try { update(cleanCart(JSON.parse(event.newValue || "{}"), cartProducts)); } catch { update({}); }
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (ready) { try { localStorage.setItem(storageKey, JSON.stringify(quantities)); } catch { /* The current tab still retains the order. */ } }
  }, [quantities, ready]);
  const set = (slug: string, q: number) => update(old => cleanCart({ ...old, [slug]: q }, cartProducts));
  const add = (slug: string, q: number) => update(old => cleanCart({ ...old, [slug]: (old[slug] || 0) + q }, cartProducts));
  return <Context.Provider value={{ quantities, ready, add, set }}>{children}</Context.Provider>;
}
export function useCart() {
  const cart = useContext(Context);
  if (!cart) throw new Error("CartProvider is required");
  return cart;
}
export function CartLink() {
  const { quantities, ready } = useCart();
  const { estoque } = useEstoque();
  const count = Object.values(quantities).reduce((a, b) => a + b, 0);
  const subtotal = cartProducts.reduce((total, produto) => total + (quantities[produto.slug] || 0) * (precoDe(produto.slug, produto.precoCentavos, estoque) || 0), 0);
  if (!ready) return null;
  return <Link to="/carrinho" className={count > 0
    ? "fixed inset-x-3 bottom-[max(.75rem,env(safe-area-inset-bottom))] z-50 grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-[color:var(--petrol)] px-4 py-2.5 text-[color:var(--offwhite)] shadow-xl sm:left-4 sm:right-auto sm:bottom-5 sm:flex sm:min-h-0 sm:rounded-full sm:px-5 sm:py-3"
    : "fixed left-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 inline-flex min-h-11 items-center gap-2 rounded-full bg-[color:var(--petrol)] px-5 py-3 text-[color:var(--offwhite)] shadow-xl text-sm"}
    aria-label={`Ver pedido, ${count} ${count === 1 ? "item" : "itens"}${count > 0 ? `, subtotal ${money(subtotal)}` : ""}`}>
    <ShoppingBag className="size-5 shrink-0" aria-hidden="true" />
    {count > 0 ? <><span className="min-w-0"><span className="block text-xs opacity-80">{count} {count === 1 ? "item" : "itens"}</span><strong className="block truncate text-sm font-semibold">Subtotal {money(subtotal)}</strong></span><span className="shrink-0 text-sm font-semibold sm:hidden">Ver pedido</span><span className="hidden sm:inline">Carrinho ({count})</span></> : <span>Carrinho (0)</span>}
  </Link>;
}
export function FloatingWhatsApp() {
  const { quantities } = useCart();
  const count = Object.values(quantities).reduce((a, b) => a + b, 0);
  return <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá, estou no site da Vida na Praia Leve e gostaria de tirar uma dúvida")}`} target="_blank" rel="noopener noreferrer" aria-label="Fale com a loja pelo WhatsApp" className={`fixed right-4 z-50 inline-flex size-14 items-center justify-center rounded-full bg-[color:var(--whatsapp)] text-[color:var(--offwhite)] shadow-xl transition-transform hover:scale-105 ${count > 0 ? "bottom-[calc(max(.75rem,env(safe-area-inset-bottom))+4.75rem)] sm:bottom-6" : "bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:bottom-6"}`}>
    <MessageCircle className="size-7" aria-hidden="true" />
  </a>;
}
export function HeaderCart({ onClick }: { onClick?: () => void }) {
  const { quantities } = useCart();
  const count = Object.values(quantities).reduce((a, b) => a + b, 0);
  return <Link to="/carrinho" onClick={onClick} title="Conferir carrinho" aria-label={"Conferir carrinho, " + count + " itens"} className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-current/20 text-[color:var(--petrol)] hover:bg-[color:var(--sand)] transition-colors">
    <ShoppingCart className="size-5" aria-hidden="true" />
    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[color:var(--coral)] text-white text-[10px] font-semibold flex items-center justify-center" aria-hidden="true">{count}</span>
  </Link>;
}
export function Quantity({ value, minimum = 1, onChange, name }: { value: number; minimum?: number; onChange: (q: number) => void; name: string }) {
  return <div className="inline-flex items-center rounded-xl border border-border bg-background">
    <Button variant="ghost" size="icon" type="button" className="size-11 disabled:opacity-30" aria-label={"Diminuir quantidade de " + name} disabled={value <= minimum} onClick={() => onChange(value - 1)}>−</Button>
    <input aria-label={"Quantidade de " + name} type="number" min={minimum} max={999} step={1} value={value} className="w-14 py-2 text-center bg-transparent" onChange={e => { const q = Number(e.target.value); if (Number.isInteger(q) && q >= minimum && q <= 999) onChange(q); }} />
    <Button variant="ghost" size="icon" type="button" className="size-11 disabled:opacity-30" aria-label={"Aumentar quantidade de " + name} disabled={value >= 999} onClick={() => onChange(value + 1)}>+</Button>
  </div>;
}
export function AddToCart({ produto, estoque: estoqueRecebido }: { produto: Produto; estoque?: EstoqueMap }) {
  const { add, ready, quantities } = useCart();
  const { estoque: estoqueConsultado } = useEstoque();
  const estoque = estoqueRecebido ?? estoqueConsultado;
  const [quantity, setQuantity] = useState(produto.pedidoMinimo || 1);
  const [added, setAdded] = useState(false);
  const emEstoque = disponivel(produto.slug, estoque);
  if (produto.emBreve || emEstoque === 0) return null;
  const noCarrinho = quantities[produto.slug] || 0;
  const esgotado = emEstoque === 0;
  const excede = emEstoque !== undefined && noCarrinho + quantity > emEstoque;
  return <div className="mt-5 space-y-3">
    <Quantity value={quantity} minimum={produto.pedidoMinimo || 1} name={produto.nome} onChange={q => { setQuantity(q); setAdded(false); }} />
    <Button type="button" disabled={!ready || esgotado || excede} className="btn-primary !h-auto !px-4 !py-3 w-full text-xs disabled:opacity-50" onClick={() => { add(produto.slug, quantity); setAdded(true); }}>
      {esgotado ? "Esgotado" : "Adicionar ao pedido"}
    </Button>
    <p role="status" className="text-sm text-[color:var(--petrol)]">{esgotado ? "Produto esgotado. Fale com a loja para saber a próxima data." : excede ? `Temos apenas ${emEstoque} unidade(s) disponíveis.` : added ? "Adicionado! Confira no carrinho." : ""}</p>
  </div>;
}
