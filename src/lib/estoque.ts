export type EstoqueItem = {
  slug: string;
  nome: string;
  quantidade: number;
  preco_centavos: number | null;
  estoque_minimo: number;
  ativo: boolean;
  controlar_estoque: boolean;
};

export type EstoqueMap = Record<string, EstoqueItem>;

export const ESTOQUE_BAIXO = 2;

/** Preço mostrado ao cliente: o painel manda, o catálogo é o padrão. */
export function precoDe(slug: string, precoCatalogo: number | undefined, estoque: EstoqueMap | undefined) {
  const item = estoque?.[slug];
  if (item && item.preco_centavos !== null && item.preco_centavos !== undefined) return item.preco_centavos;
  return precoCatalogo;
}

/** Quantas unidades ainda podem ser pedidas. undefined = produto ainda não controlado no painel. */
export function disponivel(slug: string, estoque: EstoqueMap | undefined) {
  const item = estoque?.[slug];
  if (!item) return undefined;
  if (!item.ativo) return 0;
  if (!item.controlar_estoque) return undefined;
  return Math.max(0, item.quantidade);
}

/** Mostra a tarja "em breve" quando o catálogo marca assim ou quando o estoque zerou. */
export function emBreveDe(slug: string, emBreveCatalogo: boolean, estoque: EstoqueMap | undefined) {
  return emBreveCatalogo || disponivel(slug, estoque) === 0;
}
