import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { salvarProduto, registrarMovimento } from "@/lib/admin.functions";
import { linhas } from "@/data/catalogo";
import type { EstoqueItem as Produto } from "@/lib/estoque";
import type { ClienteManual } from "./ManualCustomers";
const campo = "rounded-lg border border-border bg-white px-2 py-2 text-sm";
type Movimento = "entrada" | "consumo_proprio" | "venda_extra";
const botao: Record<Movimento, string> = { entrada: "+ Entrada", consumo_proprio: "− Consumo próprio", venda_extra: "− Venda extra" };
const rotulo: Record<Movimento, string> = { entrada: "Entrada", consumo_proprio: "Baixa de consumo próprio", venda_extra: "Venda extra" };
const resumo: Record<Movimento, string> = { entrada: "Adicionar", consumo_proprio: "Retirar (consumo próprio)", venda_extra: "Baixar como venda extra" };

export function AdminStock({ produtos, clientes, onDone }: { produtos: Produto[]; clientes: ClienteManual[]; onDone: (msg: string) => void }) {
  const categorias = new Map(linhas.flatMap(l => l.produtos.map(p => [p.slug, l.nome] as const)));
  const grupos = new Map<string, Produto[]>();
  for (const p of produtos) {
    const categoria = categorias.get(p.slug) || (p.slug.startsWith("pizza-") ? "Pizzas" : p.slug === "mix-de-nuts" ? "Mix Nuts" : "Sem categoria");
    grupos.set(categoria, [...(grupos.get(categoria) || []), p]);
  }
  return <div className="space-y-8">{[...grupos].sort(([a],[b])=>a.localeCompare(b,"pt-BR")).map(([nome,items])=><section key={nome}>
    <h2 className="text-2xl border-b border-border pb-3 mb-4">{nome} <span className="text-sm text-foreground/60">({items.length})</span></h2>
    <div className="space-y-3">{items.map(p=><LinhaProduto key={p.slug} produto={p} clientes={clientes} onDone={onDone}/>)}</div>
  </section>)}</div>;
}
function LinhaProduto({ produto, clientes, onDone }: { produto: Produto; clientes: ClienteManual[]; onDone: (msg: string) => void }) {
  const salvar = useServerFn(salvarProduto);
  const movimentar = useServerFn(registrarMovimento);
  const [form, setForm] = useState({ preco: produto.preco_centavos === null ? "" : (produto.preco_centavos / 100).toFixed(2), minimo: String(produto.estoque_minimo), ativo: produto.ativo, controlar: produto.controlar_estoque });
  const [clienteId, setClienteId] = useState("");
  const [extra, setExtra] = useState("1");
  const [pendente, setPendente] = useState<Movimento | null>(null);
  const [motivo, setMotivo] = useState("");

  const salvarMut = useMutation({
    mutationFn: () => salvar({ data: { slug: produto.slug, preco_centavos: form.preco.trim() === "" ? null : Math.round(Number(form.preco.replace(",", ".")) * 100), estoque_minimo: Number(form.minimo), ativo: form.ativo, controlar_estoque: form.controlar } }),
    onSuccess: () => onDone(`${produto.nome} atualizado.`),
    onError: (e: Error) => onDone(e.message),
  });
  const movMut = useMutation({
    mutationFn: (tipo: Movimento) => movimentar({ data: { slug: produto.slug, quantidade: Number(extra), tipo, motivo: motivo.trim() || undefined, cliente_id: tipo === "venda_extra" ? clienteId || null : null } }),
    onSuccess: (_r, tipo) => { setPendente(null); setMotivo(""); onDone(`${rotulo[tipo]} registrada em ${produto.nome}.`); },
    onError: (e: Error) => onDone(e.message),
  });
  const quantidadeMov = Math.max(0, Math.trunc(Number(extra) || 0));
  const saldoPrevisto = produto.quantidade + (pendente === "entrada" ? quantidadeMov : -quantidadeMov);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] items-center">
      <div>
        <p className="font-semibold">{produto.nome}</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-xs">Quantidade<input className={campo + " w-24 block mt-1"} inputMode="numeric" value={produto.quantidade} readOnly aria-readonly="true" title="Use os botões de movimentação para alterar o saldo" /></label>
          <label className="text-xs">Preço (R$)<input className={campo + " w-28 block mt-1"} inputMode="decimal" placeholder="sob consulta" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} /></label>
          <label className="text-xs">Alerta abaixo de<input className={campo + " w-20 block mt-1"} inputMode="numeric" value={form.minimo} onChange={(e) => setForm({ ...form, minimo: e.target.value })} /></label>
          <label className="text-xs flex items-center gap-2 pb-2"><input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} /> À venda</label>
          <label className="text-xs flex items-center gap-2 pb-2"><input type="checkbox" checked={form.controlar} onChange={(e) => setForm({ ...form, controlar: e.target.checked })} /> Controlar estoque</label>
          <button type="button" onClick={() => salvarMut.mutate()} disabled={salvarMut.isPending} className="btn-primary !px-3 !py-2 text-xs disabled:opacity-50">Salvar</button>
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-2 md:items-end">
        <div className="flex flex-wrap items-end gap-2 md:justify-end">
          <label className="text-xs">Qtd.<input className={campo + " w-16 block mt-1"} inputMode="numeric" value={extra} onChange={(e) => { setExtra(e.target.value); setPendente(null); }} /></label>
          {(["entrada", "consumo_proprio", "venda_extra"] as const).map((tipo) => (
            <button key={tipo} type="button" onClick={() => { setPendente(tipo); setMotivo(""); }} className={`rounded-lg border px-3 py-2 text-xs ${pendente === tipo ? "border-[color:var(--petrol)] bg-[color:var(--sand)]" : "border-border"}`}>{botao[tipo]}</button>
          ))}
        </div>
        {pendente && <div className="rounded-xl border border-[color:var(--petrol)]/30 bg-[color:var(--sand)]/50 p-3 text-xs md:max-w-xs" role="group" aria-label="Confirmar movimentação">
          <p>{quantidadeMov < 1 ? "Informe uma quantidade maior que zero." : `${resumo[pendente]} ${quantidadeMov} un. de ${produto.nome} — estoque ficará em ${saldoPrevisto}.`}</p>
          {pendente === "venda_extra" && <label className="block mt-3">Cliente<select className={campo + " w-full mt-1"} value={clienteId} onChange={e=>setClienteId(e.target.value)}><option value="">Não identificado</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nome} — {c.telefone}</option>)}</select><span className="block mt-1">Cadastre novos clientes na aba Clientes.</span></label>}
          <input className={campo + " w-full mt-2"} placeholder="Observação (opcional)" maxLength={200} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => movMut.mutate(pendente)} disabled={movMut.isPending || !Number.isInteger(Number(extra)) || quantidadeMov < 1 || quantidadeMov > 9999 || saldoPrevisto < 0 || (pendente === "venda_extra" && produto.preco_centavos === null)} className="btn-primary !px-3 !py-2 text-xs disabled:opacity-50">Confirmar</button>
            <button type="button" onClick={() => setPendente(null)} className="underline">Cancelar</button>
          </div>
          {pendente === "venda_extra" && produto.preco_centavos === null && <p className="mt-2">Defina e salve o preço antes de registrar a venda.</p>}
          {saldoPrevisto < 0 && <p className="mt-2 text-[color:var(--coral)]">Estoque insuficiente para essa baixa.</p>}
        </div>}
      </div>
    </div>
  );
}
