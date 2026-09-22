import { z } from "zod";
import { resumirVendas, type VendaItem, type ConsumoItem } from "./admin-sales";
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

async function admin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (data !== true) throw new Error("Acesso restrito ao administrador.");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

type Db = Awaited<ReturnType<typeof admin>>;


type PerfilRow = { id: string; nome: string; email: string | null; cpf: string | null; telefone: string | null; cep: string | null; rua: string | null; numero: string | null; bairro: string | null; cidade: string | null; estado: string | null };
type PedidoComItens = {
  id: string; user_id: string | null; cliente_nome: string; cliente_email: string | null; cliente_cpf: string | null;
  cliente_telefone: string | null; endereco: string; status: string; total_centavos: number; frete_centavos: number;
  created_at: string; pedido_itens?: { id: string; nome: string; quantidade: number }[] | null;
};
export type ClienteResumo = {
  chave: string; nome: string; email: string | null; cpf: string | null; telefone: string | null; endereco: string | null;
  temConta: boolean; pedidos: PedidoComItens[]; totalGasto: number; ultimoPedido: string | null;
};

const soDigitos = (v: string | null | undefined) => (v || "").replace(/\D/g, "");

/** Junta clientes cadastrados e visitantes (agrupados pelo telefone do pedido). */
function agruparClientes(perfis: PerfilRow[], pedidos: PedidoComItens[]): ClienteResumo[] {
  const mapa = new Map<string, ClienteResumo>();
  for (const perfil of perfis) {
    const endereco = [perfil.rua, perfil.numero, perfil.bairro, perfil.cidade, perfil.estado].filter(Boolean).join(", ");
    mapa.set("conta:" + perfil.id, {
      chave: "conta:" + perfil.id,
      nome: perfil.nome || perfil.email || "Cliente",
      email: perfil.email, cpf: perfil.cpf, telefone: perfil.telefone,
      endereco: endereco || null,
      temConta: true, pedidos: [], totalGasto: 0, ultimoPedido: null,
    });
  }
  for (const pedido of pedidos) {
    const chave = pedido.user_id ? "conta:" + pedido.user_id : "visitante:" + (soDigitos(pedido.cliente_telefone) || pedido.cliente_nome.trim().toLowerCase());
    let cliente = mapa.get(chave);
    if (!cliente) {
      cliente = {
        chave, nome: pedido.cliente_nome, email: pedido.cliente_email, cpf: pedido.cliente_cpf,
        telefone: pedido.cliente_telefone, endereco: pedido.endereco,
        temConta: !!pedido.user_id, pedidos: [], totalGasto: 0, ultimoPedido: null,
      };
      mapa.set(chave, cliente);
    }
    cliente.pedidos.push(pedido);
    if (pedido.status === "confirmado") cliente.totalGasto += (pedido.total_centavos || 0) + (pedido.frete_centavos || 0);
    if (!cliente.ultimoPedido || pedido.created_at > cliente.ultimoPedido) cliente.ultimoPedido = pedido.created_at;
    cliente.telefone = cliente.telefone || pedido.cliente_telefone;
    cliente.cpf = cliente.cpf || pedido.cliente_cpf;
    cliente.email = cliente.email || pedido.cliente_email;
    cliente.endereco = cliente.endereco || pedido.endereco;
  }
  return [...mapa.values()].sort((a, b) => (b.ultimoPedido || "").localeCompare(a.ultimoPedido || ""));
}

export const painel = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await admin(context);
    const [estoque, pedidos, movimentacoes, vendas, extras, perfis, manuais] = await Promise.all([
      db.from("produtos_estoque").select("*").order("nome"),
      db.from("pedidos").select("*, pedido_itens(*)").order("created_at", { ascending: false }).limit(200),
      db.from("movimentacoes_estoque").select("*").order("created_at", { ascending: false }).limit(60),
      db.from("pedido_itens").select("slug, nome, quantidade, pedidos!inner(status, confirmado_em)").eq("pedidos.status", "confirmado"),
      db.from("movimentacoes_estoque").select("slug, quantidade, created_at").eq("tipo", "venda_extra"),
      db.from("profiles").select("*"),
      db.from("clientes_manuais").select("*").order("nome"),
    ]);
    const erro = estoque.error || pedidos.error || movimentacoes.error || vendas.error || extras.error || perfis.error || manuais.error;
    if (erro) throw new Error(erro.message);
    const nomeDoSlug = new Map((estoque.data ?? []).map((p) => [p.slug, p.nome] as const));
    return {
      estoque: estoque.data ?? [],
      pedidos: pedidos.data ?? [],
      movimentacoes: movimentacoes.data ?? [],
      vendas: (vendas.data ?? []).map((v) => ({
        slug: v.slug,
        nome: v.nome,
        quantidade: v.quantidade,
        confirmado_em: (v as unknown as { pedidos: { confirmado_em: string | null } }).pedidos.confirmado_em,
      })).concat((extras.data ?? []).map((e) => ({
        slug: e.slug,
        nome: nomeDoSlug.get(e.slug) ?? e.slug,
        quantidade: Math.abs(e.quantidade),
        confirmado_em: e.created_at as string | null,
      }))),
      clientes: agruparClientes(perfis.data ?? [], pedidos.data ?? []),
      clientesManuais: manuais.data ?? [],
    };
  });

export const salvarProduto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { slug: string; preco_centavos: number | null; estoque_minimo: number; ativo: boolean; controlar_estoque: boolean }) => input)
  .handler(async ({ data, context }) => {
    const db = await admin(context);
    const { data: atual, error } = await db.from("produtos_estoque").select("quantidade").eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    if (!atual) throw new Error("Produto não encontrado.");
    if ("quantidade" in data) throw new Error("Altere a quantidade somente por uma movimentação de estoque.");
    const { error: updateErro } = await db
      .from("produtos_estoque")
      .update({
        preco_centavos: data.preco_centavos === null ? null : Math.max(0, Math.trunc(data.preco_centavos)),
        estoque_minimo: Math.max(0, Math.trunc(Number(data.estoque_minimo) || 0)),
        ativo: !!data.ativo,
        controlar_estoque: !!data.controlar_estoque,
      })
      .eq("slug", data.slug);
    if (updateErro) throw new Error(updateErro.message);
    return { ok: true };
  });

export const registrarMovimento = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ slug: z.string().min(1), quantidade: z.number().int().min(1).max(9999), tipo: z.enum(["entrada", "consumo_proprio", "venda_extra"]), motivo: z.string().max(200).optional(), cliente_id: z.string().uuid().nullable().optional() }))
  .handler(async ({ data, context }) => {
    const db = await admin(context);
    const { error } = await db.rpc("admin_registrar_movimento", { p_slug: data.slug, p_quantidade: data.quantidade, p_tipo: data.tipo, p_motivo: data.motivo?.trim() || "Movimentação manual", p_user_id: context.userId, p_cliente_id: data.cliente_id || undefined });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const confirmarPedido = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const db = await admin(context);
    const { error } = await db.rpc("admin_confirmar_pedido", { p_id: data.id, p_user_id: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const cancelarPedido = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const db = await admin(context);
    const { error } = await db.from("pedidos").update({ status: "cancelado" }).eq("id", data.id).eq("status", "pendente");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Traz para o painel todo produto novo publicado no catálogo do site. */
export const sincronizarCatalogo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await admin(context);
    const { linhas } = await import("@/data/catalogo");
    const produtos = linhas.flatMap((l) => l.produtos);
    const { data: existentes, error } = await db.from("produtos_estoque").select("slug");
    if (error) throw new Error(error.message);
    const conhecidos = new Set((existentes ?? []).map((e) => e.slug));
    const novos = produtos
      .filter((p) => !conhecidos.has(p.slug))
      .map((p) => ({
        slug: p.slug,
        nome: [p.nome, p.subtitulo].filter(Boolean).join(" — "),
        quantidade: 0,
        preco_centavos: p.precoCentavos ?? null,
        ativo: !p.emBreve,
      }));
    if (novos.length) {
      const { error: insertErro } = await db.from("produtos_estoque").insert(novos);
      if (insertErro) throw new Error(insertErro.message);
    }
    const nomes = produtos.map((p) => ({ slug: p.slug, nome: [p.nome, p.subtitulo].filter(Boolean).join(" — ") }));
    await Promise.all(nomes.filter((n) => conhecidos.has(n.slug)).map((n) => db.from("produtos_estoque").update({ nome: n.nome }).eq("slug", n.slug)));
    return { adicionados: novos.length };
  });

export const cadastrarClienteManual = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ nome: z.string().trim().min(2).max(120), telefone: z.string().transform(v => v.replace(/\D/g, "")).refine(v => /^\d{10,13}$/.test(v), "Informe um telefone válido com DDD."), email: z.union([z.string().email(), z.literal("")]).optional(), cpf: z.string().max(14).optional(), endereco: z.string().trim().max(500).optional() }))
  .handler(async ({ data, context }) => {
    const db = await admin(context);
    const telefone = data.telefone.length >= 12 && data.telefone.startsWith("55") ? data.telefone.slice(2) : data.telefone;
    const { error } = await db.from("clientes_manuais").insert({ nome: data.nome, telefone, email: data.email || null, cpf: data.cpf?.replace(/\D/g, "") || null, endereco: data.endereco || null, created_by: context.userId });
    if (error) throw new Error(error.code === "23505" ? "Já existe um cliente manual com esse telefone." : error.message);
    return { ok: true };
  });

async function todasPaginas<T>(pagina: (inicio: number, fim: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
  const rows: T[] = [];
  for (let inicio = 0; ; inicio += 500) {
    const { data, error } = await pagina(inicio, inicio + 499);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < 500) return rows;
  }
}
export const relatorioVendas = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }))
  .handler(async ({ data, context }) => {
    const db = await admin(context);
    const inicio = new Date(data.inicio + "T00:00:00-03:00");
    const fim = new Date(data.fim + "T23:59:59.999-03:00");
    if (!Number.isFinite(+inicio) || !Number.isFinite(+fim) || fim < inicio || +fim - +inicio > 366 * 86400000) throw new Error("Selecione um período válido de até um ano.");
    const [pedidos, movimentos, estoque] = await Promise.all([
      todasPaginas((a,b) => db.from("pedidos").select("id, confirmado_em, pedido_itens(slug, nome, quantidade, preco_centavos)").eq("status", "confirmado").gte("confirmado_em", inicio.toISOString()).lte("confirmado_em", fim.toISOString()).order("id").range(a,b)),
      todasPaginas((a,b) => db.from("movimentacoes_estoque").select("id, slug, tipo, quantidade, created_at, preco_unitario_centavos, cliente_id").in("tipo", ["venda_extra", "consumo_proprio"]).gte("created_at", inicio.toISOString()).lte("created_at", fim.toISOString()).order("id").range(a,b)),
      db.from("produtos_estoque").select("slug, nome"),
    ]);
    if (estoque.error) throw new Error(estoque.error.message);
    const nomes = new Map((estoque.data ?? []).map(p => [p.slug, p.nome]));
    const vendas: VendaItem[] = pedidos.flatMap(p => (p.pedido_itens ?? []).map(i => ({ vendaId: p.id, origem: "site" as const, data: p.confirmado_em!, slug: i.slug, nome: i.nome, quantidade: i.quantidade, precoCentavos: i.preco_centavos })));
    const consumos: ConsumoItem[] = [];
    for (const m of movimentos) {
      const item = { data: m.created_at, slug: m.slug, nome: nomes.get(m.slug) || m.slug, quantidade: Math.abs(m.quantidade) };
      if (m.tipo === "consumo_proprio") consumos.push(item);
      else vendas.push({ ...item, vendaId: m.id, origem: "extra", precoCentavos: m.preco_unitario_centavos });
    }
    return resumirVendas(vendas, consumos, data.inicio, data.fim);
  });
