export type ConsumoItem = { data: string; slug: string; nome: string; quantidade: number };
export type VendaItem = ConsumoItem & { vendaId: string; origem: "site" | "extra"; precoCentavos: number | null };
const diaLocal = (data: string) => new Date(new Date(data).getTime() - 3 * 3600000).toISOString().slice(0, 10);
export function resumirVendas(vendas: VendaItem[], consumos: ConsumoItem[], inicio: string, fim: string) {
  const dias = new Map<string, { dia: string; valor: number; unidades: number; consumo: number }>();
  for (let d = new Date(inicio + "T12:00:00Z"); d.toISOString().slice(0,10) <= fim; d.setUTCDate(d.getUTCDate() + 1)) {
    const dia = d.toISOString().slice(0,10); dias.set(dia, { dia, valor: 0, unidades: 0, consumo: 0 });
  }
  const produtos = new Map<string, { slug: string; nome: string; quantidade: number; valor: number }>();
  const consumidos = new Map<string, { slug: string; nome: string; quantidade: number }>();
  const ids = new Set<string>();
  let valor = 0, unidades = 0, unidadesSemPreco = 0;
  for (const v of vendas) {
    const dia = dias.get(diaLocal(v.data)); if (!dia) continue;
    ids.add(v.origem + ":" + v.vendaId);
    const subtotal = v.precoCentavos === null ? 0 : v.precoCentavos * v.quantidade;
    valor += subtotal; unidades += v.quantidade;
    if (v.precoCentavos === null) unidadesSemPreco += v.quantidade;
    dia.valor += subtotal; dia.unidades += v.quantidade;
    const p = produtos.get(v.slug) || { slug: v.slug, nome: v.nome, quantidade: 0, valor: 0 };
    p.quantidade += v.quantidade; p.valor += subtotal; produtos.set(v.slug, p);
  }
  for (const c of consumos) {
    const dia = dias.get(diaLocal(c.data)); if (!dia) continue;
    dia.consumo += c.quantidade;
    const p = consumidos.get(c.slug) || { slug: c.slug, nome: c.nome, quantidade: 0 };
    p.quantidade += c.quantidade; consumidos.set(c.slug, p);
  }
  return { totalVendas: ids.size, valor, unidades, unidadesSemPreco, dias: [...dias.values()], maisVendidos: [...produtos.values()].sort((a,b) => b.quantidade-a.quantidade), consumidos: [...consumidos.values()].sort((a,b) => b.quantidade-a.quantidade) };
}
