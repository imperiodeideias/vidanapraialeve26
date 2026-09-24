import { CatalogPhoto } from "@/components/CatalogPhoto";
import { AddToCart } from "@/components/Cart";
import { ComingSoonBanner } from "@/components/ComingSoonBanner";
import { ProductPrice } from "@/components/ProductPrice";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronDown, Flame, Beef } from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { ProductCard } from "@/components/ProductCard";
import { getLinha, linhas, type Produto } from "@/data/catalogo";
import { useEstoque } from "@/hooks/useEstoque";
import { emBreveDe } from "@/lib/estoque";

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
          { title: "Categoria não encontrada — Vida na Praia Leve" },
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
        <h1 className="text-5xl">Categoria não encontrada</h1>
        <p className="mt-4 text-foreground/70">A categoria que você procura pode ter sido movida ou renomeada.</p>
        <Link to="/catalogo" className="btn-primary mt-8 inline-flex">Ver catálogo completo</Link>
      </div>
    </SiteChrome>
  );
}

function LinhaPage() {
  const { linha } = Route.useLoaderData();
  const { estoque } = useEstoque();
  const outrasLinhas = linhas.filter((l) => l.slug !== linha.slug).slice(0, 4);
  const produtos: Produto[] = linha.produtos.map((p: Produto) => ({ ...p, emBreve: emBreveDe(p.slug, p.emBreve, estoque) }));
  const disponiveis = produtos.filter(p => !p.emBreve);
  const emBreve = produtos.filter(p => p.emBreve);

  return (
    <SiteChrome>
      {/* HERO */}
      <section className="relative pt-40 pb-16 md:pt-52 md:pb-24 overflow-hidden">
        <CatalogPhoto
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
          <span className="eyebrow !text-[color:var(--sand)]">{linha.eyebrow}</span>
          <h1 className="mt-5 text-5xl md:text-6xl lg:text-7xl leading-[1.02]">
            {linha.nome}
          </h1>
          <p className="mt-8 text-lg font-light text-white/85 max-w-2xl leading-relaxed">
            {linha.descricao}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm font-sub uppercase tracking-[0.2em] text-white/80">
            <span>{disponiveis.length} {disponiveis.length === 1 ? "disponível" : "disponíveis"} · {produtos.length} no total</span>
            <span className="h-px w-8 bg-white/30" />
            <a href="#produtos" className="hover:text-white transition-colors inline-flex items-center gap-2">
              Ver produtos e preços <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section id="produtos" className="scroll-mt-24 py-20 md:py-28 bg-[color:var(--sand)]/30">
        <div className="container-x">
          <div className="flex items-center justify-between mb-12">
            <Link to="/catalogo" className="inline-flex items-center gap-2 font-sub uppercase tracking-[0.2em] text-xs text-foreground/70 hover:text-[color:var(--coral)] transition-colors">
              <ChevronLeft className="size-4" /> Voltar ao catálogo
            </Link>
          </div>

          {disponiveis.length === 0 && <p className="mb-8 text-foreground/70">Nenhum produto desta categoria está disponível no momento.</p>}
          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {disponiveis.map((p) => <ProductCard key={p.slug} produto={p} headingLevel="h2" />)}
          </div>

          {emBreve.length > 0 && (
            <details className="mt-14 group/breve">
              <summary className="cursor-pointer list-none inline-flex items-center gap-2 font-sub uppercase tracking-[0.2em] text-xs text-[color:var(--petrol)] hover:text-[color:var(--coral)]">
                Ver itens em breve ({emBreve.length}) <ChevronDown className="size-4 transition-transform group-open/breve:rotate-180" />
              </summary>
              <div className="mt-8 grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {emBreve.map((p) => <ProductCard key={p.slug} produto={p} headingLevel="h2" />)}
              </div>
            </details>
          )}
        </div>
      </section>

      {/* OUTRAS LINHAS */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow">Continue explorando</span>
            <h2 className="mt-4 text-3xl md:text-4xl leading-[1.05]">Outras categorias do catálogo</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {outrasLinhas.map((l) => (
              <Link
                key={l.slug}
                to="/catalogo/$linha"
                params={{ linha: l.slug }}
                className="card-lift group relative overflow-hidden rounded-2xl bg-card block"
              >
                <div className="relative shrink-0 aspect-[4/3] overflow-hidden">
                  <CatalogPhoto src={l.cover} alt={l.nome} loading="lazy" className="absolute inset-0 block h-full w-full object-cover object-center" />
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

