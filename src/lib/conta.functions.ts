import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PerfilInput = {
  nome: string;
  cpf?: string;
  telefone?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
};

export const meuPerfil = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [perfil, pedidos, papel] = await Promise.all([
      context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle(),
      context.supabase.from("pedidos").select("*, pedido_itens(id, pedido_id, slug, nome, quantidade, preco_centavos, created_at)").order("created_at", { ascending: false }).limit(30),
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    ]);
    if (perfil.error) throw new Error(perfil.error.message);
    return { perfil: perfil.data, pedidos: pedidos.data ?? [], admin: papel.data === true };
  });

export const salvarPerfil = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: PerfilInput) => input)
  .handler(async ({ data, context }) => {
    const limpo = {
      nome: String(data.nome || "").trim().slice(0, 120),
      cpf: String(data.cpf || "").replace(/\D/g, "").slice(0, 11) || null,
      telefone: String(data.telefone || "").slice(0, 30) || null,
      cep: String(data.cep || "").replace(/\D/g, "").slice(0, 8) || null,
      rua: String(data.rua || "").slice(0, 160) || null,
      numero: String(data.numero || "").slice(0, 20) || null,
      bairro: String(data.bairro || "").slice(0, 120) || null,
      cidade: String(data.cidade || "").slice(0, 120) || null,
      estado: String(data.estado || "").slice(0, 2) || null,
    };
    if (limpo.nome.length < 2) throw new Error("Informe seu nome.");
    const { error } = await context.supabase.from("profiles").update(limpo).eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
