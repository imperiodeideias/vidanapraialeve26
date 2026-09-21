import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({ redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined }),
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta — Vida na Praia Leve" },
      { name: "description", content: "Acesse sua conta da Vida na Praia Leve para repetir pedidos com mais rapidez e acompanhar seu histórico." },
      { property: "og:title", content: "Entrar ou criar conta — Vida na Praia Leve" },
      { property: "og:description", content: "Acesse sua conta para repetir pedidos e acompanhar seu histórico." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const destino = redirect && redirect.startsWith("/") ? redirect : "/conta";
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [form, setForm] = useState({ nome: "", email: "", senha: "", cpf: "", telefone: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: destino, replace: true });
    });
  }, [destino, navigate]);

  const campo = "w-full rounded-xl border border-border bg-white px-3 py-3";

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      if (modo === "entrar") {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.senha });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.email.trim(),
          password: form.senha,
          options: { emailRedirectTo: window.location.origin, data: { nome: form.nome.trim(), cpf: form.cpf.replace(/\D/g, ""), telefone: form.telefone } },
        });
        if (error) throw error;
        const { error: entradaErro } = await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.senha });
        if (entradaErro) throw entradaErro;
      }
      navigate({ to: destino, replace: true });
    } catch (e) {
      const mensagem = e instanceof Error ? e.message : "";
      setErro(/invalid login/i.test(mensagem) ? "E-mail ou senha incorretos." : /already registered/i.test(mensagem) ? "Esse e-mail já tem conta. Faça login." : mensagem || "Não foi possível continuar. Tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SiteChrome>
      <section className="container-x pt-32 pb-28 max-w-lg">
        <span className="eyebrow">Sua conta</span>
        <h1 className="text-4xl mt-4 mb-3">{modo === "entrar" ? "Entrar" : "Criar conta"}</h1>
        <p className="text-sm text-foreground/70 mb-8">Ter conta é opcional — serve para você repetir pedidos e não digitar o endereço de novo.</p>
        <form className="space-y-4" onSubmit={enviar}>
          {modo === "criar" && (
            <>
              <div><label htmlFor="conta-nome" className="block text-sm mb-2">Nome completo</label><input id="conta-nome" required minLength={2} maxLength={120} autoComplete="name" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className={campo} /></div>
              <div><label htmlFor="conta-cpf" className="block text-sm mb-2">CPF</label><input id="conta-cpf" inputMode="numeric" maxLength={14} value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} className={campo} /></div>
              <div><label htmlFor="conta-telefone" className="block text-sm mb-2">Telefone / WhatsApp</label><input id="conta-telefone" inputMode="tel" autoComplete="tel" maxLength={30} value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} className={campo} /></div>
            </>
          )}
          <div><label htmlFor="conta-email" className="block text-sm mb-2">E-mail</label><input id="conta-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={campo} /></div>
          <div><label htmlFor="conta-senha" className="block text-sm mb-2">Senha</label><input id="conta-senha" type="password" required minLength={6} autoComplete={modo === "entrar" ? "current-password" : "new-password"} value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} className={campo} /></div>
          {erro && <p role="alert" className="text-sm text-[color:var(--coral)]">{erro}</p>}
          <button type="submit" disabled={carregando} className="btn-primary w-full text-center !px-4 disabled:opacity-50">{carregando ? "Aguarde…" : modo === "entrar" ? "Entrar" : "Criar minha conta"}</button>
        </form>
        <button type="button" className="mt-6 underline text-sm" onClick={() => { setModo(modo === "entrar" ? "criar" : "entrar"); setErro(""); }}>
          {modo === "entrar" ? "Ainda não tenho conta — quero me cadastrar" : "Já tenho conta — quero entrar"}
        </button>
      </section>
    </SiteChrome>
  );
}
