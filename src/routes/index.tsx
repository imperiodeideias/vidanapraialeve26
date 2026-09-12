import { AddToCart } from "@/components/Cart";
import { ComingSoonBanner } from "@/components/ComingSoonBanner";
import { ProductPrice } from "@/components/ProductPrice";
import { NewsletterForm } from "@/components/NewsletterForm";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Leaf,
  Sparkles,
  Truck,
  Snowflake,
  ChevronRight,
  Instagram,
  MessageCircle,
  MapPin,
  Mail,
  Menu,
  X,
  Star,
} from "lucide-react";

import logoAsset from "@/assets/logo-vnpl.png.asset.json";
import logoLightAsset from "@/assets/logo-vnpl-light.png.asset.json";
import logoLfwAsset from "@/assets/logo-lfw.png.asset.json";
import aboutImg from "@/assets/sobre-familia.webp";
import beachImg from "@/assets/beach-banner.jpg";
import { linhas as catalogoLinhas } from "@/data/catalogo";
import pDaily from "@/assets/produtos/coxa-arroz-grega.jpg";
import pHero from "@/assets/hero-prato-blue-majik.webp";
import pHero2 from "@/assets/hero-lanche-vitalmax.webp";
import pHero3 from "@/assets/hero-doces.webp";
import pPerf from "@/assets/produtos/frango-cubos.jpg";
import pWell from "@/assets/produtos/feijoada-vegana.jpg";
import pPrem from "@/assets/produtos/salmao-maracuja.jpg";
import pSnackAsset from "@/assets/produtos/coxinha-fit-nova.jpg.asset.json";
import pDessAsset from "@/assets/produtos/brownie-fit-novo.jpg.asset.json";
import pFuncAsset from "@/assets/produtos/suco-blue-majik-novo.jpg.asset.json";

const pDess = pDessAsset.url;
const pFunc = pFuncAsset.url;
const pSnack = pSnackAsset.url;

const whatsappPedidoUrl = "https://wa.me/551333662961?text=" + encodeURIComponent(
  "Olá, estou no site da Vida na Praia Leve e gostaria de fazer um pedido"
);

const totalProdutos = catalogoLinhas.reduce((n, l) => n + l.produtos.length, 0);

const sabores = catalogoLinhas.flatMap((l) =>
  l.produtos.slice(0, 2).map((p) => ({ ...p, linhaSlug: l.slug, linhaNome: l.nome })),
);
const saboresFiltros = [
  { slug: "todos", nome: "Todos" },
  ...catalogoLinhas.map((l) => ({ slug: l.slug, nome: l.nome })),
];


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vida na Praia Leve - Alimentação leve em Peruíbe" },
      { name: "description", content: "Refeições congeladas, sucos prensados, lanches e doces em Peruíbe. Praticidade, sabor e bem-estar para deixar sua rotina mais leve." },
      { property: "og:title", content: "Vida na Praia Leve - Alimentação leve em Peruíbe" },
      { property: "og:description", content: "Refeições congeladas, sucos prensados, lanches e doces em Peruíbe. Praticidade, sabor e bem-estar para deixar sua rotina mais leve." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const linhas = [
  { slug: "caseirinhos", tag: "Dia a Dia", title: "Refeições equilibradas", desc: "Pratos completos para toda a semana, do café ao jantar.", img: pDaily, color: "sage" },
  { slug: "maromba", tag: "Performance", title: "Mais proteína, mais energia", desc: "Nutrição precisa para quem treina e busca resultados.", img: pPerf, color: "petrol" },
  { slug: "veggie", tag: "Bem-estar", title: "Low carb, vegano, sem glúten", desc: "Opções funcionais para cada estilo de vida.", img: pWell, color: "sage" },
  { slug: "peixes", tag: "Premium", title: "Peixes & receitas especiais", desc: "Ingredientes selecionados para momentos únicos.", img: pPrem, color: "deep" },
  { slug: "salgados", tag: "Lanches Inteligentes", title: "Empadas, pães de queijo, pizza fit", desc: "Praticidade saborosa para qualquer hora do dia.", img: pSnack, color: "coral" },
  { slug: "doces", tag: "Momento Leve", title: "Brownies & sobremesas funcionais", desc: "Doces com propósito, sem culpa.", img: pDess, color: "coral" },
  { slug: "sucos", tag: "Funcionais", title: "Sucos, chás & mix nuts", desc: "Bebidas e snacks que trabalham por você.", img: pFunc, color: "sage" },
];

const diferenciais = [
  { icon: Leaf, title: "Ingredientes selecionados", desc: "Do produtor à sua mesa, com curadoria criteriosa." },
  { icon: Snowflake, title: "Congelamento inteligente", desc: "Preservamos sabor, textura e nutrientes." },
  { icon: Sparkles, title: "Sabor de verdade", desc: "Receitas assinadas para você amar cada garfada." },
  { icon: Truck, title: "Entrega rápida", desc: "Chega em casa pronto para aquecer e aproveitar." },
];

const passos = [
  { n: "01", t: "Escolha", d: "Monte seu pedido ou assine um plano." },
  { n: "02", t: "Receba", d: "Entregamos congelado, com toda a segurança." },
  { n: "03", t: "Aqueça", d: "Pronto em minutos, no micro-ondas ou forno." },
  { n: "04", t: "Aproveite", d: "Coma bem, viva leve, tenha mais tempo." },
];


const depoimentos = [
  { n: "Soraia", c: "Peruíbe, SP", t: "Meu almoço deixou de ser um problema. Sabor incrível e me sinto muito mais leve." },
  { n: "Andrey", c: "Peruíbe, SP", t: "Como atleta amador, o kit Performance mudou minha rotina. Recuperação melhor e mais energia." },
  { n: "Edna", c: "Peruíbe, SP", t: "As crianças amam. E a gente ganha tempo pra viver o que importa." },
];

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtro, setFiltro] = useState("todos");


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-[0_10px_30px_-25px_rgba(6,30,38,0.6)]" : "bg-background"
        }`}
      >
        <div className="bg-[color:var(--deep)] text-[color:var(--offwhite)]">
          <div className="container-x flex items-center justify-center gap-3 py-2 text-[10px] sm:text-[11px] font-sub uppercase tracking-[0.25em]">
            <span className="text-white/80">Um jeito mais leve de comer bem, em Peruíbe</span>
            <span className="hidden sm:inline text-[color:var(--coral)]">•</span>
            <a
              href="https://www.instagram.com/vidanapraialeve/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-[color:var(--sand)] hover:text-[color:var(--coral)] transition-colors"
            >
              <Instagram className="size-3" /> @vidanapraialeve
            </a>
          </div>
        </div>
        <div className="container-x flex items-center justify-between py-3.5">
          <a href="#top" className="flex items-center gap-3">
            <img src={logoAsset.url} alt="Vida na Praia Leve" className="h-11 w-auto" />
          </a>
          <nav className="hidden lg:flex items-center gap-9 font-sub text-[13px] uppercase tracking-[0.18em]">
            {[
              ["Sobre", "#sobre"],
              ["Linhas", "#linhas"],
              ["Sabores", "#sabores"],
              ["Como funciona", "#como"],
            ].map(([l, h]) => (
              <a key={h} href={h} className="text-foreground/80 transition-colors hover:text-accent">
                {l}
              </a>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            <a href={whatsappPedidoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5 !px-5 text-xs">Quero pedir</a>
          </div>
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>


      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-background">
          <div className="container-x flex items-center justify-between py-4">
            <img src={logoAsset.url} alt="Vida na Praia Leve" className="h-11 w-auto" />
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X className="size-6" /></button>
          </div>
          <nav className="container-x mt-10 flex flex-col gap-6 text-2xl font-display">
            {[["Sobre","#sobre"],["Linhas","#linhas"],["Sabores","#sabores"],["Como funciona","#como"]].map(([l,h])=>(
              <a key={h} href={h} onClick={()=>setMenuOpen(false)}>{l}</a>
            ))}
            <a href={whatsappPedidoUrl} target="_blank" rel="noopener noreferrer" onClick={()=>setMenuOpen(false)} className="btn-primary mt-6 w-fit">Quero pedir</a>
          </nav>
        </div>
      )}

      {/* HERO */}
      <section id="top" className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="pointer-events-none absolute -top-40 -right-32 size-[560px] rounded-full bg-[color:var(--sage)]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-32 size-[420px] rounded-full bg-[color:var(--coral)]/10 blur-3xl" />
        <div className="relative container-x grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Texto */}
          <div className="lg:col-span-6 animate-fade-up">
            <span className="inline-flex items-center gap-2.5 font-sub uppercase tracking-[0.25em] text-[11px] text-[color:var(--petrol)]">
              <span className="size-2 rounded-full bg-[color:var(--coral)]" /> Alimentação leve em Peruíbe
            </span>
            <h1 className="mt-6 text-5xl leading-[1.02] sm:text-6xl lg:text-[76px]">
              Sua rotina mais leve começa
              <br />
              <span className="font-script text-[color:var(--coral)] text-6xl sm:text-7xl lg:text-[92px] leading-none">pelo prato.</span>
            </h1>
            <p className="mt-8 max-w-xl font-light text-lg text-foreground/70 leading-relaxed">
              Refeições, sucos, lanches e doces escolhidos para quem quer praticidade, sabor e bem-estar — sem transformar a alimentação em uma obrigação.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a href="#sabores" className="btn-primary bg-[color:var(--coral)] shadow-[0_20px_50px_-18px_rgba(230,126,95,0.7)] hover:!bg-[color:var(--coral)]">
                Explorar sabores <ArrowRight className="size-4" />
              </a>
              <a
                href="https://www.instagram.com/vidanapraialeve/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-b border-foreground/25 pb-1 font-sub text-sm text-foreground/80 hover:text-[color:var(--coral)] hover:border-[color:var(--coral)] transition-colors"
              >
                <Instagram className="size-4" /> @vidanapraialeve
              </a>
            </div>
            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-border pt-8 max-w-xl">
              {[
                { k: String(totalProdutos), v: "opções nos catálogos atuais" },
                { k: "Local", v: "atendimento em Peruíbe" },
                { k: "Leve", v: "na rotina e na escolha" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl md:text-3xl text-[color:var(--petrol)]">{s.k}</dt>
                  <dd className="mt-2 text-xs md:text-sm text-foreground/60 font-light leading-snug">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Colagem */}
          <div className="lg:col-span-6 relative animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="relative mx-auto aspect-square w-full max-w-[520px]">
              <div className="absolute inset-x-6 top-0 bottom-24 rounded-full bg-[color:var(--sage)]/25" />
              <img
                src={pHero}
                alt="Suco Blue Majik com salmão ao molho de maracujá, arroz negro e brócolis"
                width={900}
                height={900}
                className="blob-a absolute left-[10%] top-[2%] w-[80%] aspect-square object-cover shadow-[0_40px_80px_-30px_rgba(6,30,38,0.45)] ring-8 ring-background"
              />
              <img
                src={pHero2}
                alt="Suco Vital Max com lanche de frango e pães de queijo"
                loading="lazy"
                width={520}
                height={520}
                className="blob-b animate-floaty absolute left-0 bottom-[6%] w-[38%] aspect-square object-cover shadow-xl ring-8 ring-background"
              />
              <img
                src={pHero3}
                alt="Doces fit: mousse de limão, brigadeiro, beijinho e brownie"
                loading="lazy"
                width={520}
                height={520}
                className="absolute right-0 bottom-0 w-[36%] aspect-square rounded-full object-cover shadow-xl ring-8 ring-background"
              />
              <div className="absolute -left-2 top-[6%] size-24 md:size-28 hidden sm:block">
                <div className="spin-slow absolute inset-0 rounded-full bg-[color:var(--sand)]" />
                <span className="absolute inset-0 flex items-center justify-center text-center font-sub uppercase tracking-[0.18em] text-[9px] leading-[1.6] text-[color:var(--deep)]/80 px-3">
                  curadoria<br />prazer + praticidade
                </span>
              </div>
              <div className="absolute right-[2%] top-[14%] rounded-2xl bg-card shadow-[0_20px_45px_-20px_rgba(6,30,38,0.45)] px-4 py-3 flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-[color:var(--coral)]" />
                <p className="text-xs md:text-[13px] leading-tight font-sub">
                  Comida de verdade<br />para a vida real
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* MARQUEE VALUES */}
      <section className="bg-[color:var(--deep)] text-[color:var(--offwhite)] py-6 overflow-hidden">
        <div className="flex marquee gap-16 whitespace-nowrap font-sub uppercase tracking-[0.35em] text-xs">
          {Array.from({ length: 2 }).flatMap((_, i) => (
            ["Vida", "· Leveza ·", "Saúde", "· Praia ·", "Natureza", "· Bem-estar ·", "Qualidade", "· Praticidade ·", "Sofisticação", "· Vida na Praia Leve ·"].map((w, j) => (
              <span key={`${i}-${j}`} className="text-white/70">{w}</span>
            ))
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="py-28 md:py-40">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              <img
                src={aboutImg}
                alt="Pessoas reunidas à mesa compartilhando refeições e sucos"

                loading="lazy"
                width={1122}
                height={1402}
                className="rounded-3xl w-full h-auto shadow-[0_40px_80px_-30px_rgba(6,30,38,0.35)] object-cover aspect-[4/5]"
              />
              <div className="absolute -bottom-8 -right-4 md:-right-10 bg-[color:var(--sand)] rounded-2xl p-6 max-w-[240px] shadow-xl">
                <p className="font-script text-3xl text-[color:var(--petrol)] leading-none">leveza</p>
                <p className="mt-2 text-sm text-[color:var(--deep)]/70 font-light">
                  em cada refeição, em cada dia.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <span className="eyebrow">Sobre nós</span>
            <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              Muito mais do que refeições. <span className="text-[color:var(--sage)]">Um jeito de viver.</span>
            </h2>
            <p className="mt-8 text-lg font-light text-foreground/70 leading-relaxed max-w-xl">
              A Vida na Praia Leve nasceu para descomplicar a alimentação saudável. Cuidamos de cada detalhe — do ingrediente ao entregador — para que você tenha mais tempo, mais energia e mais leveza no que realmente importa.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { t: "Missão", d: "Levar praticidade e saúde para a rotina de cada cliente." },
                { t: "Visão", d: "Ser referência nacional em alimentação saudável e lifestyle." },
                { t: "Propósito", d: "Inspirar uma vida mais leve, com sabor e propósito." },
              ].map((b) => (
                <div key={b.t} className="border-t border-border pt-5">
                  <p className="font-sub uppercase tracking-[0.25em] text-xs text-[color:var(--coral)]">{b.t}</p>
                  <p className="mt-3 text-sm text-foreground/70 leading-relaxed">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LINHAS DE PRODUTOS */}
      <section id="linhas" className="py-24 md:py-32 bg-[color:var(--sand)]/40">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="eyebrow">Nossas linhas</span>
              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                Um cardápio para <span className="font-script text-[color:var(--coral)]">cada momento</span> da sua vida.
              </h2>
            </div>
            <Link to="/catalogo" className="btn-ghost self-start md:self-end text-foreground">Ver catálogo completo <ChevronRight className="size-4" /></Link>
          </div>

          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {linhas.map((l, i) => (
              <article
                key={l.tag}
                className={`card-lift group relative overflow-hidden rounded-3xl bg-card shadow-sm ${
                  i === 0 ? "lg:col-span-2 lg:row-span-1" : ""
                }`}
              >
                <div className={`relative overflow-hidden ${i === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}`}>
                  <img
                    src={l.img}
                    alt={l.title}
                    loading="lazy"
                    width={1000}
                    height={1200}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--deep)]/70 via-[color:var(--deep)]/10 to-transparent" />
                  <span className="absolute top-5 left-5 rounded-full bg-white/85 backdrop-blur px-3.5 py-1.5 text-[11px] font-sub uppercase tracking-[0.2em] text-[color:var(--petrol)]">
                    {l.tag}
                  </span>
                  <span className="absolute top-5 right-6 font-display text-3xl text-white/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="text-2xl leading-tight">{l.title}</h3>
                  <p className="mt-3 text-sm text-foreground/65 font-light leading-relaxed">{l.desc}</p>
                  <Link to="/catalogo/$linha" params={{ linha: l.slug }} className="mt-5 inline-flex items-center gap-2 font-sub uppercase tracking-[0.2em] text-xs text-[color:var(--petrol)] hover:text-[color:var(--coral)] transition-colors">
                    Explorar <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>

            ))}

            {/* Em breve card */}
            <article className="card-lift relative overflow-hidden rounded-3xl bg-[color:var(--petrol)] text-[color:var(--offwhite)] p-8 flex flex-col justify-between min-h-[280px]">
              <div>
                <span className="eyebrow !text-[color:var(--sand)]">Em breve</span>
                <h3 className="mt-4 text-3xl leading-tight">Novas linhas chegando</h3>
              </div>
              <ul className="mt-6 space-y-2 text-sm font-light text-white/80">
                <li>· Linha Pet</li>
                <li>· Produtos próprios</li>
                <li>· Suplementos</li>
                <li>· Snacks & presentes</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* SABORES */}
      <section id="sabores" className="py-24 md:py-32">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">Cardápio por linha</span>
            <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              Gostoso primeiro. <span className="font-script text-[color:var(--coral)]">Leve sempre.</span>
            </h2>
            <p className="mt-6 text-foreground/65 font-light text-lg">
              Uma amostra do catálogo completo. Filtre pelo momento que combina com você.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-2.5">
            {saboresFiltros.map((f) => (
              <button
                key={f.slug}
                onClick={() => setFiltro(f.slug)}
                className={`rounded-full px-4 py-2 font-sub text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  filtro === f.slug
                    ? "bg-[color:var(--petrol)] text-[color:var(--offwhite)]"
                    : "bg-[color:var(--sand)]/60 text-foreground/70 hover:bg-[color:var(--sand)]"
                }`}
              >
                {f.nome}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sabores
              .filter((p) => filtro === "todos" || p.linhaSlug === filtro)
              .map((p) => (
                <article
                  key={p.slug}
                  className="card-lift group overflow-hidden rounded-3xl bg-card border border-border"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.nome}
                      loading="lazy"
                      width={1000}
                      height={750}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    />
                    {p.emBreve && <ComingSoonBanner />}
                  </div>
                  <div className="p-6">
                    <span className="font-sub uppercase tracking-[0.2em] text-[10px] text-[color:var(--coral)]">{p.linhaNome}</span>
                    <h3 className="mt-2.5 text-lg leading-tight">{p.nome}</h3>
                    {p.subtitulo && <p className="mt-1.5 text-sm text-foreground/60 font-light leading-snug">{p.subtitulo}</p>}
                    <ProductPrice produto={p} />
                    <Link to="/catalogo/$linha" params={{ linha: p.linhaSlug }} className="mt-5 inline-flex items-center gap-2 font-sub uppercase tracking-[0.2em] text-[11px] text-[color:var(--petrol)]">
                      Ver detalhes <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <AddToCart produto={p} />
                  </div>
                </article>
              ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Link to="/catalogo" className="btn-ghost text-foreground">
              Ver os {totalProdutos} produtos <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}

      <section className="py-24 md:py-32">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <span className="eyebrow">Nossos diferenciais</span>
            <h2 className="mt-4 text-4xl md:text-5xl leading-[1.05]">Feito com cuidado, entregue com carinho.</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {diferenciais.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group">
                <div className="size-14 rounded-2xl bg-[color:var(--sand)] flex items-center justify-center text-[color:var(--petrol)] transition-transform group-hover:scale-105">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-6 text-xl">{title}</h3>
                <p className="mt-3 text-sm text-foreground/65 font-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como" className="relative py-28 md:py-40 overflow-hidden">
        <img src={beachImg} alt="" aria-hidden loading="lazy" width={1920} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[color:var(--deep)]/70" />
        <div className="relative container-x text-[color:var(--offwhite)]">
          <div className="max-w-2xl">
            <span className="eyebrow !text-[color:var(--sand)]">Como funciona</span>
            <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              Em quatro passos, <span className="font-script text-[color:var(--coral)]">simples assim</span>.
            </h2>
          </div>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {passos.map((p) => (
              <div key={p.n} className="border-t border-white/25 pt-6">
                <p className="font-display text-5xl text-[color:var(--sand)]">{p.n}</p>
                <p className="mt-6 font-sub uppercase tracking-[0.25em] text-xs text-[color:var(--coral)]">{p.t}</p>
                <p className="mt-3 text-white/75 font-light">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <span className="eyebrow">Quem prova, ama</span>
            <h2 className="mt-4 text-4xl md:text-5xl leading-[1.05]">Histórias de quem escolheu viver mais leve.</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {depoimentos.map((d) => (
              <figure key={d.n} className="rounded-3xl bg-card border border-border p-8 card-lift">
                <div className="flex text-[color:var(--coral)]">{Array.from({length:5}).map((_,i)=><Star key={i} className="size-4 fill-current"/>)}</div>
                <blockquote className="mt-6 text-lg leading-relaxed font-light text-foreground/85">"{d.t}"</blockquote>
                <figcaption className="mt-8 pt-6 border-t border-border">
                  <p className="font-display text-lg">{d.n}</p>
                  <p className="text-xs font-sub uppercase tracking-[0.2em] text-foreground/50 mt-1">{d.c}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* MARCAS PARCEIRAS */}
      <section id="blog" className="py-20 bg-[color:var(--sand)]/40">
        <div className="container-x">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="eyebrow">Marcas parceiras</span>
              <h2 className="mt-4 text-3xl md:text-4xl leading-[1.1]">Uma curadoria de marcas que compartilham nossos valores.</h2>
              <p className="mt-5 text-foreground/65 font-light">
                Começamos com a Light Food Way e caminhamos para uma seleção cada vez mais ampla de linhas próprias e parceiras — sempre com o mesmo compromisso.
              </p>
            </div>
            <div className="lg:col-span-7 flex flex-wrap items-center gap-10 lg:justify-end">
              <img src={logoLfwAsset.url} alt="Light Food Way" loading="lazy" className="h-16 w-auto opacity-90" />
              <div className="text-center px-6 py-4 rounded-2xl border border-dashed border-foreground/20">
                <p className="font-script text-3xl text-[color:var(--sage)]">em breve</p>
                <p className="text-[10px] font-sub uppercase tracking-[0.25em] text-foreground/50 mt-1">Novas marcas</p>
              </div>
              <div className="text-center px-6 py-4 rounded-2xl border border-dashed border-foreground/20">
                <p className="font-script text-3xl text-[color:var(--coral)]">próprias</p>
                <p className="text-[10px] font-sub uppercase tracking-[0.25em] text-foreground/50 mt-1">Linhas exclusivas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section id="pedir" className="py-28 md:py-40">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[color:var(--petrol)] text-[color:var(--offwhite)] px-8 py-16 md:px-20 md:py-24">
            <div className="absolute -top-20 -right-20 size-80 rounded-full bg-[color:var(--coral)]/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-[color:var(--sage)]/25 blur-3xl" />
            <div className="relative grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <span className="eyebrow !text-[color:var(--sand)]">Newsletter</span>
                <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                  Receba conteúdos, <span className="font-script text-[color:var(--coral)]">novidades</span> e ofertas exclusivas.
                </h2>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[color:var(--deep)] text-[color:var(--offwhite)] pt-20 pb-10">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <img src={logoLightAsset.url} alt="Vida na Praia Leve" className="h-14 w-auto" />
            <p className="mt-6 text-white/65 font-light max-w-sm">
              Alimentação saudável, prática e deliciosa. Uma marca brasileira de lifestyle para você viver com mais leveza.
            </p>
            <div className="mt-8 flex gap-3">
              {[Instagram, MessageCircle, Mail].map((Ic, i) => (
                <a key={i} href="#" className="size-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition">
                  <Ic className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 grid gap-10 sm:grid-cols-3">
            {[
              { t: "Explore", l: ["Sobre", "Linhas", "Sabores", "Blog"] },
              { t: "Institucional", l: ["Nossa história", "Parceiros", "Trabalhe conosco", "Imprensa"] },
              { t: "Contato", l: ["WhatsApp", "Instagram", "contato@vidanapraialeve.com.br", "Encontre uma loja"] },
            ].map((c) => (
              <div key={c.t}>
                <p className="font-sub uppercase tracking-[0.25em] text-xs text-[color:var(--sand)]">{c.t}</p>
                <ul className="mt-5 space-y-3 text-sm text-white/70 font-light">
                  {c.l.map((li) => (
                    <li key={li}><a href="#" className="hover:text-[color:var(--coral)] transition">{li}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="container-x mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/50 font-light">
          <p>© {new Date().getFullYear()} Vida na Praia Leve. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Política de privacidade</a>
            <a href="#" className="hover:text-white">Termos de uso</a>
            <span className="inline-flex items-center gap-2"><MapPin className="size-3.5" /> Brasil</span>
          </div>
        </div>
      </footer>

      {/* WhatsApp flutuante */}
      <a
        href={whatsappPedidoUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center size-14 rounded-full bg-[#25D366] text-white shadow-[0_12px_40px_-12px_rgba(37,211,102,0.7)] hover:scale-110 transition-transform duration-300"
      >
        <svg className="size-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403c-.514.056-.97.43-1.136.916-.198.56.04 1.166.53 1.49.49.323 1.13.29 1.58-.084.45-.373.62-.99.42-1.55-.2-.56-.74-.91-1.394-.772M12.048 2C6.516 2 2 6.486 2 12.016c0 2.13.663 4.132 1.806 5.79L2.6 21.416l3.675-1.177A9.96 9.96 0 0 0 12.048 22c5.532 0 10.048-4.486 10.048-10.016S17.58 2 12.048 2z"/>
        </svg>
      </a>
    </div>
  );
}

