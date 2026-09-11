import type { Produto } from "@/data/catalogo";

const reais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function ProductPrice({ produto }: { produto: Produto }) {
  return (
    <div className="mt-4">
      <p className="font-display text-xl text-[color:var(--petrol)]">
        {produto.precoCentavos === undefined
          ? "Preço sob consulta"
          : reais.format(produto.precoCentavos / 100)}
        {produto.pedidoMinimo && <span className="text-sm font-sub"> / unidade</span>}
      </p>
      {produto.pedidoMinimo && (
        <p className="mt-1 text-xs text-foreground/70">
          Pedido mínimo: {produto.pedidoMinimo} unidades
          {produto.precoCentavos !== undefined && ` (${reais.format(produto.precoCentavos * produto.pedidoMinimo / 100)})`}
        </p>
      )}
    </div>
  );
}
