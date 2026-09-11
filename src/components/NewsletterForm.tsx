import { useRef, useState } from "react";
import { Heart } from "lucide-react";
import { subscribeNewsletter } from "@/lib/newsletter";

export function NewsletterForm() {
  const submitting = useRef(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  return (
    <form className="lg:col-span-5 space-y-4" onSubmit={async (event) => {
      event.preventDefault();
      if (submitting.current) return;
      const form = event.currentTarget;
      const values = new FormData(form);
      submitting.current = true;
      setStatus("loading");
      setMessage("");
      try {
        const result = await subscribeNewsletter({ data: {
          email: String(values.get("email") || ""),
          consent: values.get("consent") === "on",
          website: String(values.get("website") || ""),
        } });
        if (!result.ok) throw new Error(result.message);
        setStatus("success");
        setMessage("Cadastro recebido! Você receberá nossas novidades por e-mail.");
        form.reset();
      } catch {
        setStatus("error");
        setMessage("Não foi possível confirmar seu cadastro. Tente novamente em alguns instantes.");
      } finally {
        submitting.current = false;
      }
    }}>
      <label htmlFor="newsletter-email" className="sr-only">Seu e-mail</label>
      <input id="newsletter-email" name="email" type="email" autoComplete="email" maxLength={254}
        required placeholder="seu melhor e-mail" disabled={status === "loading"}
        className="w-full rounded-full bg-white/10 border border-white/20 px-6 py-4 text-base placeholder:text-white/50 focus:outline-none focus:border-[color:var(--coral)] transition" />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="newsletter-website">Website</label>
        <input id="newsletter-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="flex items-start gap-3 text-sm text-white/90">
        <input name="consent" type="checkbox" required disabled={status === "loading"}
          className="mt-1 size-4 shrink-0 accent-[color:var(--coral)]" />
        <span>Aceito receber novidades e ofertas da Vida na Praia Leve por e-mail.</span>
      </label>
      <button type="submit" disabled={status === "loading"} aria-busy={status === "loading"}
        className="btn-primary bg-[color:var(--coral)] hover:!bg-[color:var(--coral)] w-full disabled:opacity-60 disabled:cursor-wait">
        {status === "loading" ? "Cadastrando..." : "Quero receber"} <Heart className="size-4" />
      </button>
      <p role={status === "error" ? "alert" : "status"} aria-live="polite" className="text-sm text-white">
        {message}
      </p>
      <p className="text-xs text-white/70 font-light">Sem spam. Só coisas boas.</p>
    </form>
  );
}
