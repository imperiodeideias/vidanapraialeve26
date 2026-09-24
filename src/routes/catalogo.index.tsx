import { CatalogPhoto } from "@/components/CatalogPhoto";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import { ProductCard } from "@/components/ProductCard";
import { linhas } from "@/data/catalogo";
import { useEstoque } from "@/hooks/useEstoque";
import { emBreveDe } from "@/lib/estoque";

export const Route = createFileRoute("/catalogo/")({
  head: () => ({
    meta: [
      { title: "Catálogo completo — Vida na Praia Leve" },
      { name: "description", content: "Explore todas as linhas Vida na Praia Leve: caseirinhos, aves, carnes, peixes, massas, sopas, salgados fit, sobremesas e sucos." },
      { property: "og:title", content: "Catálogo completo — Vida na Praia Leve" },
      { property: "og:description", content: "Refeições, sucos, snacks e sobremesas saudáveis. Encontre a linha ideal para você." },
      { property: "og:url", content: "https://vidanapraialeve.lovable.app/catalogo" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

const normalizar = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function CatalogoIndex() {
  const totalProdutos = linhas.reduce((s, l) => s + l.produtos.length, 0);
  const { estoque, carregando } = useEstoque();
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [modo, setModo] = useState<"disponiveis" | "em-breve">("disponiveis");
  const todos = useMemo(() => linhas.flatMap(l => l.produtos.map(p => ({ ...p, emBreve: emBreveDe(p.slug, p.emBreve, estoque), linhaSlug: l.slug, linhaNome: l.nome }))), [estoque]);
  const disponiveisPorLinha = (slug: string) => todos.filter(p => p.linhaSlug === slug && !p.emBreve).length;
  const termo = normalizar(busca.trim());
  const base = todos.filter(p => (categoria === "todas" || p.linhaSlug === categoria) && normalizar([p.nome, p.subtitulo, p.descricao, p.linhaNome].filter(Boolean).join(" ")).includes(termo));
  const qtdDisp = base.filter(p => !p.emBreve).length;
  const qtdBreve = base.length - qtdDisp;
  const resultados = base.filter(p => (modo === "disponiveis" ? !p.emBreve : p.emBreve));
  const chip = (ativo: boolean) => `min-h-11 rounded-full px-4 py-2 font-sub text-[11px] uppercase tracking-[0.18em] transition-colors ${ativo ? "bg-[color:var(--petrol)] text-[color:var(--offwhite)]" : "bg-[color:var(--sand)]/60 text-foreground/70 hover:bg-[color:var(--sand)]"}`;
  return (
    <SiteChrome>
      {/* HERO */}
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 bg-[color:var(--sand)]/40">
        <div className="container-x max-w-4xl">
          <span className="eyebrow">Cardápio e preços</span>
          <h1 className="mt-5 text-5xl md:text-6xl leading-[1.02]">
            {totalProdutos} produtos.{" "}
            <span className="font-script text-[color:var(--coral)]">Um jeito leve</span>{" "}
            de comer bem todos os dias.
          </h1>
          <p className="mt-6 text-lg font-light text-foreground/70 max-w-2xl leading-relaxed">
            Busque um produto ou filtre por categoria. Mostramos primeiro o que está disponível para pedir agora.
          </p>
        </div>
      </section>

      {/* BUSCA E FILTROS */}
      <section id="produtos" className="py-16 md:py-20">
        <div className="container-x">
          <div className="max-w-xl">
            <label htmlFor="busca-catalogo" className="block mb-2 font-sub text-sm">Buscar prato ou produto</label>
            <input id="busca-catalogo" type="search" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Ex.: frango, suco, empada..." className="w-full rounded-xl border border-border bg-white px-4 py-3" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5" role="group" aria-label="Categoria">
            <button type="button" onClick={() => setCategoria("todas")} aria-pressed={categoria === "todas"} className={chip(categoria === "todas")}>Todas</button>
            {linhas.map(l => (
              <button key={l.slug} type="button" onClick={() => setCategoria(l.slug)} aria-pressed={categoria === l.slug} className={chip(categoria === l.slug)}>
                {l.nome} ({disponiveisPorLinha(l.slug)})
              </button>
            ))}
          </div>
          <div className="mt-6 inline-flex rounded-full border border-border p-1" role="group" aria-label="Disponibilidade">
            <button type="button" onClick={() => setModo("disponiveis")} aria-pressed={modo === "disponiveis"} className={chip(modo === "disponiveis")}>Disponíveis ({qtdDisp})</button>
            <button type="button" onClick={() => setModo("em-breve")} aria-pressed={modo === "em-breve"} className={chip(modo === "em-breve")}>Em breve ({qtdBreve})</button>
          </div>
          <p role="status" className="mt-5 text-sm text-foreground/65">
            {resultados.length} {resultados.length === 1 ? "produto encontrado" : "produtos encontrados"}{resultados.length === 0 ? ". Tente outro termo, categoria ou disponibilidade." : ""}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {resultados.map(p => <ProductCard key={p.slug} produto={p} categoria={p.linhaNome} estoque={estoque} carregando={carregando} />)}
          </div>
        </div>
      </section>

      {/* GRID DE LINHAS */}
      <section className="py-20 md:py-28 bg-[color:var(--sand)]/30">
        <div className="container-x">
          <h2 className="mb-10 text-3xl md:text-4xl">Categorias</h2>
          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {linhas.map((l) => (
              <Link
                key={l.slug}
                to="/catalogo/$linha"
                params={{ linha: l.slug }}
                className="card-lift group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <CatalogPhoto
                    src={l.cover}
                    alt={l.nome}
                    loading="lazy"
                    width={1000}
                    height={750}
                    className="absolute inset-0 block h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--deep)]/80 via-[color:var(--deep)]/20 to-transparent" />
                  <span className="absolute top-5 left-5 rounded-full bg-white/85 backdrop-blur px-3.5 py-1.5 text-[11px] font-sub uppercase tracking-[0.2em] text-[color:var(--petrol)]">
                    {l.eyebrow}
                  </span>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="font-sub text-xs uppercase tracking-[0.25em] text-white/80">
                      {disponiveisPorLinha(l.slug)} {disponiveisPorLinha(l.slug) === 1 ? "disponível" : "disponíveis"} · {l.produtos.length} no total
                    </p>
                    <h2 className="mt-2 text-3xl md:text-4xl leading-tight">{l.nome}</h2>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="min-h-[4.5rem] line-clamp-3 text-sm text-foreground/65 font-light leading-relaxed">{l.descricao}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 font-sub uppercase tracking-[0.2em] text-xs text-[color:var(--petrol)] group-hover:text-[color:var(--coral)] transition-colors">
                    Explorar <ArrowRight className="size-3.5" />
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
