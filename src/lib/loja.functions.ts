import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export type NovoPedidoItem = { slug: string; quantidade: number };
export type NovoPedido = {
  nome: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  endereco: string;
  observacao?: string;
  frete_centavos?: number;
  itens: NovoPedidoItem[];
};

function validarPedido(input: NovoPedido): NovoPedido {
  if (!input || typeof input !== "object") throw new Error("Pedido inválido.");
  const nome = String(input.nome || "").trim();
  const endereco = String(input.endereco || "").trim();
  if (nome.length < 2 || nome.length > 120) throw new Error("Informe seu nome.");
  if (endereco.length < 5 || endereco.length > 400) throw new Error("Informe o endereço de entrega.");
  const itens = Array.isArray(input.itens) ? input.itens : [];
  if (!itens.length || itens.length > 60) throw new Error("Seu pedido está vazio.");
  return {
    nome,
    endereco,
    cpf: String(input.cpf || "").replace(/\D/g, "").slice(0, 11) || undefined,
    telefone: String(input.telefone || "").slice(0, 30) || undefined,
    email: String(input.email || "").slice(0, 180) || undefined,
    observacao: String(input.observacao || "").slice(0, 500) || undefined,
    frete_centavos: Number.isInteger(input.frete_centavos) ? Math.max(0, input.frete_centavos as number) : 0,
    itens: itens.map((i) => {
      const slug = String(i.slug || "").slice(0, 120);
      const quantidade = Number(i.quantidade);
      if (!slug || !Number.isInteger(quantidade) || quantidade < 1 || quantidade > 999) throw new Error("Quantidade inválida no pedido.");
      return { slug, quantidade };
    }),
  };
}

async function usuarioDaRequisicao(): Promise<string | null> {
  const header = getRequest()?.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || token.split(".").length !== 3) return null;
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}

/** Registra o pedido como pendente. O estoque só é debitado quando a loja confirma no painel. */
export const criarPedido = createServerFn({ method: "POST" })
  .inputValidator(validarPedido)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = await usuarioDaRequisicao();

    const slugs = data.itens.map((i) => i.slug);
    const { data: estoque, error: estoqueErro } = await supabaseAdmin
      .from("produtos_estoque")
      .select("slug, nome, quantidade, preco_centavos, ativo, controlar_estoque")
      .in("slug", slugs);
    if (estoqueErro) throw new Error(estoqueErro.message);

    const porSlug = new Map((estoque || []).map((e) => [e.slug, e]));
    let total = 0;
    const itens = data.itens.map((item) => {
      const produto = porSlug.get(item.slug);
      if (produto && (!produto.ativo || (produto.controlar_estoque && produto.quantidade < item.quantidade))) {
        throw new Error(`Sem estoque suficiente de ${produto.nome || item.slug}.`);
      }
      const preco = produto?.preco_centavos ?? null;
      if (preco !== null) total += preco * item.quantidade;
      return { slug: item.slug, nome: produto?.nome || item.slug, quantidade: item.quantidade, preco_centavos: preco };
    });

    const { data: pedido, error } = await supabaseAdmin
      .from("pedidos")
      .insert({
        user_id: userId,
        cliente_nome: data.nome,
        cliente_cpf: data.cpf ?? null,
        cliente_telefone: data.telefone ?? null,
        cliente_email: data.email ?? null,
        endereco: data.endereco,
        observacao: data.observacao ?? null,
        total_centavos: total,
        frete_centavos: data.frete_centavos ?? 0,
      })
      .select("id")
      .single();
    if (error || !pedido) throw new Error(error?.message || "Não foi possível registrar o pedido.");

    const { error: itensErro } = await supabaseAdmin
      .from("pedido_itens")
      .insert(itens.map((i) => ({ ...i, pedido_id: pedido.id })));
    if (itensErro) {
      await supabaseAdmin.from("pedidos").delete().eq("id", pedido.id);
      throw new Error(itensErro.message);
    }

    return { id: pedido.id as string };
  });
