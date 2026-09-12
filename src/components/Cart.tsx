import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { linhas, type Produto } from "@/data/catalogo";
import { cleanCart, type Quantities } from "@/lib/order";

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
  const { quantities } = useCart();
  const count = Object.values(quantities).reduce((a, b) => a + b, 0);
  return <Link to="/carrinho" className="fixed left-4 bottom-5 z-50 inline-flex items-center gap-2 rounded-full bg-[color:var(--petrol)] px-5 py-3 text-white shadow-xl text-sm" aria-label={"Conferir carrinho, " + count + " itens"}>
    <ShoppingBag className="size-5" /> Carrinho ({count})
  </Link>;
}
export function Quantity({ value, minimum = 1, onChange, name }: { value: number; minimum?: number; onChange: (q: number) => void; name: string }) {
  return <div className="inline-flex items-center rounded-xl border border-border bg-background">
    <button type="button" className="size-11 disabled:opacity-30" aria-label={"Diminuir quantidade de " + name} disabled={value <= minimum} onClick={() => onChange(value - 1)}>−</button>
    <input aria-label={"Quantidade de " + name} type="number" min={minimum} max={999} step={1} value={value} className="w-14 py-2 text-center bg-transparent" onChange={e => { const q = Number(e.target.value); if (Number.isInteger(q) && q >= minimum && q <= 999) onChange(q); }} />
    <button type="button" className="size-11 disabled:opacity-30" aria-label={"Aumentar quantidade de " + name} disabled={value >= 999} onClick={() => onChange(value + 1)}>+</button>
  </div>;
}
export function AddToCart({ produto }: { produto: Produto }) {
  const { add, ready } = useCart();
  const [quantity, setQuantity] = useState(produto.pedidoMinimo || 1);
  const [added, setAdded] = useState(false);
  if (produto.emBreve) return null;
  return <div className="mt-5 space-y-3">
    <Quantity value={quantity} minimum={produto.pedidoMinimo || 1} name={produto.nome} onChange={q => { setQuantity(q); setAdded(false); }} />
    <button type="button" disabled={!ready} className="btn-primary !px-4 !py-3 w-full text-xs" onClick={() => { add(produto.slug, quantity); setAdded(true); }}>Adicionar ao pedido</button>
    <p role="status" className="text-sm text-[color:var(--petrol)]">{added ? "Adicionado! Confira no carrinho." : ""}</p>
  </div>;
}
