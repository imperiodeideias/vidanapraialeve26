import type { Produto } from "@/data/catalogo";
import { useEstoque } from "@/hooks/useEstoque";
import { disponivel, precoDe, type EstoqueMap } from "@/lib/estoque";

const reais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function ProductPrice({ produto, estoque: estoqueRecebido, carregando: carregandoRecebido }: { produto: Produto; estoque?: EstoqueMap; carregando?: boolean }) {
  const consulta = useEstoque();
  const estoque = estoqueRecebido ?? consulta.estoque;
  const carregando = carregandoRecebido ?? consulta.carregando;
  const preco = precoDe(produto.slug, produto.precoCentavos, estoque);
  const emEstoque = disponivel(produto.slug, estoque);
  return (
    <div className="mt-4">
      <p className={`min-h-7 font-display text-xl text-[color:var(--petrol)] ${carregando ? "animate-pulse rounded bg-muted text-transparent" : ""}`} aria-busy={carregando}>
        {carregando ? "Carregando preço" : <>
        {preco === undefined ? "Preço sob consulta" : reais.format(preco / 100)}
        {produto.pedidoMinimo && <span className="text-sm font-sub"> / unidade</span>}
        </>}
      </p>
      {!carregando && produto.pedidoMinimo && (
        <p className="mt-1 text-xs text-foreground/70">
          Pedido mínimo: {produto.pedidoMinimo} unidades
          {preco !== undefined && ` (${reais.format((preco * produto.pedidoMinimo) / 100)})`}
        </p>
      )}
      {emEstoque !== undefined && emEstoque > 0 && emEstoque <= 2 && (
        <p className="mt-1 text-xs text-[color:var(--coral)]">{emEstoque === 1 ? "Última unidade" : `Últimas ${emEstoque} unidades`}</p>
      )}
    </div>
  );
}
