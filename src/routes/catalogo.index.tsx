import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { linhas } from "@/data/catalogo";

export const Route = createFileRoute("/catalogo/")({
  head: () => ({
    meta: [
      { title: "Catálogo completo — Vida na Praia Leve" },
      { name: "description", content: "Explore todas as linhas Vida na Praia Leve: caseirinhos, aves, carnes, peixes, massas, sopas, salgados fit, sobremesas, sucos detox e nuts." },
      { property: "og:title", content: "Catálogo completo — Vida na Praia Leve" },
      { property: "og:description", content: "Refeições, sucos, snacks e sobremesas saudáveis. Encontre a linha ideal para você." },
      { property: "og:url", content: "https://vidanapraialeve.lovable.app/catalogo" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://vidanapraialeve.lovable.app/catalogo" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Catálogo Vida na Praia Leve",
          description: "Catálogo completo de refeições, sucos, snacks e sobremesas saudáveis.",
          hasPart: linhas.map((l) => ({
            "@type": "CollectionPage",
            name: l.nome,
            url: `https://vidanapraialeve.lovable.app/catalogo/${l.slug}`,
          })),
        }),
      },
    ],
  }),
  component: CatalogoIndex,
});

function CatalogoIndex() {
  const totalProdutos = linhas.reduce((s, l) => s + l.produtos.length, 0);
  return (
    <SiteChrome>
      {/* HERO */}
      <section className="pt-40 pb-20 md:pt-48 md:pb-28 bg-[color:var(--sand)]/40">
        <div className="container-x max-w-4xl">
          <span className="eyebrow">Catálogo completo</span>
          <h1 className="mt-5 text-5xl md:text-6xl lg:text-7xl leading-[1.02]">
            {totalProdutos} produtos.{" "}
            <span className="font-script text-[color:var(--coral)]">Um jeito leve</span>{" "}
            de comer bem todos os dias.
          </h1>
          <p className="mt-8 text-lg md:text-xl font-light text-foreground/70 max-w-2xl leading-relaxed">
            De caseirinhos afetivos a sucos prensados a frio, cada linha foi pensada para um momento da sua rotina. Escolha por objetivo, estilo de vida ou humor do dia.
          </p>
        </div>
      </section>

      {/* GRID DE LINHAS */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {linhas.map((l, i) => (
              <Link
                key={l.slug}
                to="/catalogo/$linha"
                params={{ linha: l.slug }}
                className={`card-lift group relative overflow-hidden rounded-3xl bg-card shadow-sm ${
                  i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div className={`relative overflow-hidden ${i === 0 ? "aspect-[16/9]" : "aspect-[4/5]"}`}>
                  <img
                    src={l.cover}
                    alt={l.nome}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--deep)]/80 via-[color:var(--deep)]/20 to-transparent" />
                  <span className="absolute top-5 left-5 rounded-full bg-white/85 backdrop-blur px-3.5 py-1.5 text-[11px] font-sub uppercase tracking-[0.2em] text-[color:var(--petrol)]">
                    {l.eyebrow}
                  </span>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="font-sub text-xs uppercase tracking-[0.25em] text-white/70">
                      {l.produtos.length} {l.produtos.length === 1 ? "produto" : "produtos"}
                    </p>
                    <h2 className="mt-2 text-3xl md:text-4xl leading-tight">{l.nome}</h2>
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-sm text-foreground/65 font-light leading-relaxed">{l.descricao}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-sub uppercase tracking-[0.2em] text-xs text-[color:var(--petrol)] group-hover:text-[color:var(--coral)] transition-colors">
                    Ver linha <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
