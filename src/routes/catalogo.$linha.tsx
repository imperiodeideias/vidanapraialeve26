import { AddToCart } from "@/components/Cart";
import { ComingSoonBanner } from "@/components/ComingSoonBanner";
import { ProductPrice } from "@/components/ProductPrice";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, Flame, Beef } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { getLinha, linhas, type Produto } from "@/data/catalogo";

export const Route = createFileRoute("/catalogo/$linha")({
  loader: ({ params }) => {
    const linha = getLinha(params.linha);
    if (!linha) throw notFound();
    return { linha };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Linha não encontrada — Vida na Praia Leve" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const l = loaderData.linha;
    const url = `https://vidanapraialeve.lovable.app/catalogo/${params.linha}`;
    return {
      meta: [
        { title: `${l.nome} — Catálogo Vida na Praia Leve` },
        { name: "description", content: `${l.headline} ${l.descricao}` },
        { property: "og:title", content: `${l.nome} — Vida na Praia Leve` },
        { property: "og:description", content: l.descricao },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: `https://vidanapraialeve.lovable.app${l.cover}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: `https://vidanapraialeve.lovable.app${l.cover}` },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Linha ${l.nome} — Vida na Praia Leve`,
            description: l.descricao,
            numberOfItems: l.produtos.length,
            itemListElement: l.produtos.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Product",
                name: p.nome,
                description: p.descricao,
                category: l.nome,
                brand: { "@type": "Brand", name: "Vida na Praia Leve" },
              },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Início", item: "https://vidanapraialeve.lovable.app/" },
              { "@type": "ListItem", position: 2, name: "Catálogo", item: "https://vidanapraialeve.lovable.app/catalogo" },
              { "@type": "ListItem", position: 3, name: l.nome, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: LinhaPage,
  notFoundComponent: LinhaNotFound,
});

function LinhaNotFound() {
  return (
    <SiteChrome>
      <div className="pt-40 pb-32 container-x text-center">
        <h1 className="text-5xl">Linha não encontrada</h1>
        <p className="mt-4 text-foreground/70">A linha que você procura pode ter sido movida ou renomeada.</p>
        <Link to="/catalogo" className="btn-primary mt-8 inline-flex">Ver catálogo completo</Link>
      </div>
    </SiteChrome>
  );
}

function LinhaPage() {
  const { linha } = Route.useLoaderData();
  const outrasLinhas = linhas.filter((l) => l.slug !== linha.slug).slice(0, 4);

  return (
    <SiteChrome>
      {/* HERO */}
      <section className="relative pt-40 pb-16 md:pt-52 md:pb-24 overflow-hidden">
        <img
          src={linha.cover}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--deep)]/60 via-[color:var(--deep)]/50 to-[color:var(--deep)]/85" />
        <div className="relative container-x text-[color:var(--offwhite)] max-w-4xl">
          <nav className="flex items-center gap-2 text-xs font-sub uppercase tracking-[0.25em] text-white/70 mb-8">
            <Link to="/" className="hover:text-white">Início</Link>
            <span>/</span>
            <Link to="/catalogo" className="hover:text-white">Catálogo</Link>
            <span>/</span>
            <span className="text-white">{linha.nome}</span>
          </nav>
          <span className="eyebrow !text-[color:var(--sand)]">Linha {linha.eyebrow}</span>
          <h1 className="mt-5 text-5xl md:text-6xl lg:text-7xl leading-[1.02]">
            {linha.nome}
          </h1>
          <p className="mt-6 font-script text-4xl md:text-5xl text-[color:var(--coral)]">
            {linha.headline}
          </p>
          <p className="mt-8 text-lg font-light text-white/85 max-w-2xl leading-relaxed">
            {linha.descricao}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm font-sub uppercase tracking-[0.2em] text-white/80">
            <span>{linha.produtos.length} {linha.produtos.length === 1 ? "produto" : "produtos"}</span>
            <span className="h-px w-8 bg-white/30" />
            <a href="/catalogo" className="hover:text-white transition-colors inline-flex items-center gap-2">
              Fazer pedido <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section className="py-20 md:py-28 bg-[color:var(--sand)]/30">
        <div className="container-x">
          <div className="flex items-center justify-between mb-12">
            <Link to="/catalogo" className="inline-flex items-center gap-2 font-sub uppercase tracking-[0.2em] text-xs text-foreground/70 hover:text-[color:var(--coral)] transition-colors">
              <ChevronLeft className="size-4" /> Voltar ao catálogo
            </Link>
          </div>

          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {linha.produtos.map((p: Produto) => (
              <article key={p.slug} className="card-lift group bg-card rounded-3xl overflow-hidden shadow-sm flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--sand)]/50">
                  <img
                    src={p.img}
                    alt={p.nome}
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                {p.emBreve && <ComingSoonBanner />}
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl leading-tight">{p.nome}</h2>
                  {p.peso && <p className="mt-2 text-xs text-foreground/60">{p.peso}</p>}
                  {p.subtitulo && <p className="mt-1 text-sm text-foreground/60 font-light">{p.subtitulo}</p>}
                  <p className="mt-3 text-sm text-foreground/65 font-light leading-relaxed flex-1">{p.descricao}</p>
                  <ProductPrice produto={p} />

                  {(p.kcal || p.proteina) && (
                    <div className="mt-5 flex items-center gap-4 text-xs font-sub uppercase tracking-[0.15em] text-foreground/60">
                      {p.kcal && (
                        <span className="inline-flex items-center gap-1.5">
                          <Flame className="size-3.5 text-[color:var(--coral)]" /> {p.kcal} kcal
                        </span>
                      )}
                      {p.proteina && (
                        <span className="inline-flex items-center gap-1.5">
                          <Beef className="size-3.5 text-[color:var(--petrol)]" /> {p.proteina}g proteína
                        </span>
                      )}
                    </div>
                  )}

                  {p.tags && p.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.tags.map((t: string) => (
                        <span key={t} className="text-[10px] font-sub uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-[color:var(--sage)]/40 text-[color:var(--sage)]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {p.emBreve ? <p className="mt-6 text-sm text-foreground/60">Disponível em breve</p> : <AddToCart produto={p} />}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OUTRAS LINHAS */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow">Continue explorando</span>
            <h2 className="mt-4 text-3xl md:text-4xl leading-[1.05]">Outras linhas do catálogo</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {outrasLinhas.map((l) => (
              <Link
                key={l.slug}
                to="/catalogo/$linha"
                params={{ linha: l.slug }}
                className="card-lift group relative overflow-hidden rounded-2xl bg-card block"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={l.cover} alt={l.nome} loading="lazy" className="h-full w-full object-cover object-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--deep)]/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[10px] font-sub uppercase tracking-[0.25em] text-white/70">{l.eyebrow}</p>
                    <p className="text-xl leading-tight mt-1">{l.nome}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}

