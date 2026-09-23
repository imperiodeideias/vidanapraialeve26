import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { relatorioVendas } from "@/lib/admin.functions";
import { money } from "@/lib/order";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from "recharts";

const hoje = () => new Date(Date.now() - 3 * 3600000).toISOString().slice(0,10);
const antes = (dias: number) => new Date(Date.now() - 3 * 3600000 - (dias-1) * 86400000).toISOString().slice(0,10);
export function AdminSales() {
  const [inicio, setInicio] = useState(() => antes(30));
  const [fim, setFim] = useState(hoje);
  const buscar = useServerFn(relatorioVendas);
  const valido = Boolean(inicio && fim && inicio <= fim && +new Date(fim) - +new Date(inicio) < 366 * 86400000);
  const { data, error, isLoading } = useQuery({ queryKey: ["vendas", inicio, fim], queryFn: () => buscar({ data: { inicio, fim } }), enabled: valido });
  return <section className="mt-6 space-y-6" aria-label="Relatório de vendas">
    <h2 className="text-2xl">Vendas</h2>
    <div className="flex flex-wrap gap-3 items-end">
      <label className="text-sm">De<input type="date" value={inicio} onChange={e=>setInicio(e.target.value)} className="block border rounded-xl p-3 bg-white" /></label>
      <label className="text-sm">Até<input type="date" value={fim} onChange={e=>setFim(e.target.value)} className="block border rounded-xl p-3 bg-white" /></label>
      {[7,30,90].map(d=><button key={d} className="rounded-full border px-4 py-2 text-sm" onClick={()=>{setInicio(antes(d));setFim(hoje());}}>Últimos {d} dias</button>)}
    </div>
    <p className="text-sm text-foreground/65">Horário de Brasília. Cada pedido confirmado conta como uma venda; cada lançamento de venda extra conta como outra. Valores dos produtos, sem frete. Consumo próprio não compõe as vendas.</p>
    {!valido && <p role="alert">Selecione um período válido de até um ano.</p>}
    {error && <p role="alert">Não foi possível carregar as vendas: {error.message}</p>}
    {valido && isLoading && <p role="status">Carregando vendas…</p>}
    {valido && data && <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Total de vendas",data.totalVendas],["Valor total de vendas",money(data.valor)],["Lucro total",money(data.lucro)],["Unidades vendidas",data.unidades]].map(([label,value])=><div key={label} className="rounded-2xl border bg-card p-5"><p className="text-sm">{label}</p><p className="text-3xl mt-3">{value}</p></div>)}</div>
      {data.unidadesSemPreco > 0 && <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm">Valor parcial: {data.unidadesSemPreco} unidade(s) vendida(s) sem preço registrado. Entram na quantidade, mas não no valor total. O preço atual não foi usado para estimar vendas antigas.</p>}
      {data.unidadesSemCusto > 0 && <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm">Lucro parcial: {data.unidadesSemCusto} unidade(s) vendida(s) sem custo cadastrado não entram no lucro.</p>}
      {!data.totalVendas && <p>Nenhuma venda confirmada neste período.</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 min-w-0"><h3 className="text-lg mb-4">Vendas e lucro por dia</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.dias}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="dia" tickFormatter={v=>v.slice(8)+"/"+v.slice(5,7)}/><YAxis tickFormatter={v=>money(v)}/><Tooltip formatter={(v:number)=>money(v)}/><Legend/><Bar name="Vendas" dataKey="valor" fill="#1F5D63"/><Bar name="Lucro" dataKey="lucro" fill="#7D9D87"/></BarChart></ResponsiveContainer></div></section>
        <section className="rounded-2xl border bg-card p-5 min-w-0"><h3 className="text-lg mb-4">Unidades vendidas e consumidas</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.dias}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="dia" tickFormatter={v=>v.slice(8)+"/"+v.slice(5,7)}/><YAxis allowDecimals={false}/><Tooltip/><Legend/><Line name="Vendidas" dataKey="unidades" stroke="#1F5D63" dot={false}/><Line name="Consumo próprio" dataKey="consumo" stroke="#E67E5F" dot={false}/></LineChart></ResponsiveContainer></div></section>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section><h3 className="text-xl mb-4">Produtos mais vendidos</h3><ol className="space-y-2">{data.maisVendidos.map((p,i)=><li key={p.slug} className="rounded-xl border p-4 flex justify-between gap-4"><span>{i+1}. {p.nome}</span><span className="shrink-0 text-right"><strong>{p.quantidade} un.</strong><span className="block text-xs">Lucro {money(p.lucro)}</span></span></li>)}</ol></section>
        <section><h3 className="text-xl mb-4">Produtos consumidos — consumo próprio</h3><p className="text-sm mb-3">{data.consumidos.reduce((s,p)=>s+p.quantidade,0)} unidades no período</p>{!data.consumidos.length && <p className="text-sm">Nenhum consumo próprio registrado neste período.</p>}<ul className="space-y-2">{data.consumidos.map(p=><li key={p.slug} className="rounded-xl border p-4 flex justify-between gap-4"><span>{p.nome}</span><strong className="shrink-0">{p.quantidade} un.</strong></li>)}</ul></section>
      </div>
    </>}
  </section>;
}
