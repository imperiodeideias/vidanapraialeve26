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

async function movimentar(db: Db, slug: string, delta: number, tipo: "entrada" | "venda" | "venda_extra" | "consumo_proprio" | "ajuste", motivo: string | null, userId: string, pedidoId?: string) {
  const { data: atual, error } = await db.from("produtos_estoque").select("quantidade").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!atual) throw new Error("Produto não encontrado no estoque.");
  const nova = atual.quantidade + delta;
  if (nova < 0) throw new Error("Estoque insuficiente para esta baixa.");
  const { data: atualizado, error: updateErro } = await db
    .from("produtos_estoque")
    .update({ quantidade: nova })
    .eq("slug", slug)
    .eq("quantidade", atual.quantidade)
    .select("slug");
  if (updateErro) throw new Error(updateErro.message);
  if (!atualizado?.length) throw new Error("O estoque mudou enquanto salvávamos. Tente de novo.");
  await db.from("produtos_estoque").update({ controlar_estoque: true }).eq("slug", slug);
  await db.from("movimentacoes_estoque").insert({ slug, tipo, quantidade: delta, motivo, created_by: userId, pedido_id: pedidoId ?? null });
}


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
    const [estoque, pedidos, movimentacoes, vendas, extras, perfis] = await Promise.all([
      db.from("produtos_estoque").select("*").order("nome"),
      db.from("pedidos").select("*, pedido_itens(*)").order("created_at", { ascending: false }).limit(200),
      db.from("movimentacoes_estoque").select("*").order("created_at", { ascending: false }).limit(60),
      db.from("pedido_itens").select("slug, nome, quantidade, pedidos!inner(status, confirmado_em)").eq("pedidos.status", "confirmado"),
      db.from("movimentacoes_estoque").select("slug, quantidade, created_at").eq("tipo", "venda_extra"),
      db.from("profiles").select("*"),
    ]);
    const erro = estoque.error || pedidos.error || movimentacoes.error || vendas.error || extras.error || perfis.error;
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
    };
  });

export const salvarProduto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { slug: string; preco_centavos: number | null; quantidade: number; estoque_minimo: number; ativo: boolean; controlar_estoque: boolean }) => input)
  .handler(async ({ data, context }) => {
    const db = await admin(context);
    const { data: atual, error } = await db.from("produtos_estoque").select("quantidade").eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    if (!atual) throw new Error("Produto não encontrado.");
    const quantidade = Math.max(0, Math.trunc(Number(data.quantidade) || 0));
    const { error: updateErro } = await db
      .from("produtos_estoque")
      .update({
        quantidade,
        preco_centavos: data.preco_centavos === null ? null : Math.max(0, Math.trunc(data.preco_centavos)),
        estoque_minimo: Math.max(0, Math.trunc(Number(data.estoque_minimo) || 0)),
        ativo: !!data.ativo,
        controlar_estoque: !!data.controlar_estoque,
      })
      .eq("slug", data.slug);
    if (updateErro) throw new Error(updateErro.message);
    if (quantidade !== atual.quantidade) {
      await db.from("movimentacoes_estoque").insert({
        slug: data.slug,
        tipo: "ajuste",
        quantidade: quantidade - atual.quantidade,
        motivo: "Ajuste manual no painel",
        created_by: context.userId,
      });
    }
    return { ok: true };
  });

export const registrarMovimento = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { slug: string; quantidade: number; tipo: "entrada" | "consumo_proprio" | "venda_extra"; motivo?: string }) => input)
  .handler(async ({ data, context }) => {
    const db = await admin(context);
    const quantidade = Math.trunc(Number(data.quantidade) || 0);
    if (quantidade < 1 || quantidade > 9999) throw new Error("Informe uma quantidade válida.");
    const delta = data.tipo === "entrada" ? quantidade : -quantidade;
    const padrao = data.tipo === "entrada" ? "Entrada de estoque" : data.tipo === "venda_extra" ? "Venda fora do site" : "Consumo próprio";
    await movimentar(db, data.slug, delta, data.tipo, data.motivo?.trim().slice(0, 200) || padrao, context.userId);
    return { ok: true };
  });

export const confirmarPedido = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const db = await admin(context);
    const { data: pedido, error } = await db.from("pedidos").select("id, status, pedido_itens(slug, quantidade)").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!pedido) throw new Error("Pedido não encontrado.");
    if (pedido.status !== "pendente") throw new Error("Este pedido já foi tratado.");
    for (const item of pedido.pedido_itens as { slug: string; quantidade: number }[]) {
      await movimentar(db, item.slug, -item.quantidade, "venda", "Venda confirmada", context.userId, pedido.id);
    }
    const { error: updateErro } = await db.from("pedidos").update({ status: "confirmado", confirmado_em: new Date().toISOString() }).eq("id", pedido.id).eq("status", "pendente");
    if (updateErro) throw new Error(updateErro.message);
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
