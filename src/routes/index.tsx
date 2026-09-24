import { CatalogPhoto } from "@/components/CatalogPhoto";
import { FooterContacts, contactLinks } from "@/components/FooterContacts";
import { HeroPhoto } from "@/components/HeroPhoto";
import { HeaderCart } from "@/components/Cart";
import { ProductCard } from "@/components/ProductCard";
import { CIDADES_ATENDIDAS, resumoEntrega } from "@/lib/delivery";
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
  Star,
  User,
} from "lucide-react";

import logoAsset from "@/assets/logo-vnpl.png.asset.json";
import logoLightAsset from "@/assets/logo-vnpl-light.png.asset.json";
import logoLfwAsset from "@/assets/logo-lfw.png.asset.json";
import aboutImg from "@/assets/sobre-familia.webp";
import beachImg from "@/assets/beach-banner.jpg";
import { linhas as catalogoLinhas } from "@/data/catalogo";
import { useEstoque } from "@/hooks/useEstoque";
import { emBreveDe } from "@/lib/estoque";
import pHero from "@/assets/hero-prato-blue-majik.webp";
import pHero2 from "@/assets/hero-lanche-vitalmax.webp";
import pHero3 from "@/assets/hero-doces.webp";
import pHeroMobile from "@/assets/hero-prato-720.webp.asset.json";
import pHero2Mobile from "@/assets/hero-lanche-480.webp.asset.json";
import pHero3Mobile from "@/assets/hero-doces-480.webp.asset.json";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";


const sabores = catalogoLinhas.flatMap((l) =>
  l.produtos.map((p) => ({ ...p, linhaSlug: l.slug, linhaNome: l.nome })),
);
const navHome = [
  ["Início", "/"],
  ["Catálogo", "/catalogo"],
  ["Kit Detox", "/catalogo/kits-detox"],
  ["Como funciona", "#como"],
  ["Sobre", "#sobre"],
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

const linhas = catalogoLinhas.map(l => ({
  slug: l.slug, tag: l.eyebrow, title: l.nome, desc: l.descricao, img: l.cover,
}));

const diferenciais = [
  { icon: Leaf, title: "Ingredientes selecionados", desc: "Do produtor à sua mesa, com curadoria criteriosa." },
  { icon: Snowflake, title: "Ultracongelamento", desc: "Preservamos sabor, textura e nutrientes." },
  { icon: Sparkles, title: "Sabor de verdade", desc: "Receitas assinadas para você amar cada garfada." },
  { icon: Truck, title: "Entrega segura (agendada)", desc: "Chega em casa pronto para aquecer e aproveitar." },
];

const passos = [
  { n: "01", t: "Escolha", d: "Monte seu pedido no site e envie pelo WhatsApp." },
  { n: "02", t: "Receba", d: "Entregamos congelado, com toda a segurança." },
  { n: "03", t: "Aqueça", d: "Pronto em minutos, no micro-ondas." },
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
  const { estoque, carregando } = useEstoque();
  const comStatus = sabores.map(p => ({ ...p, emBreve: emBreveDe(p.slug, p.emBreve, estoque) }));
  // Um destaque por categoria (rodízio), só com itens disponíveis.
  const destaques = estoque ? catalogoLinhas.flatMap(l => comStatus.filter(p => p.linhaSlug === l.slug && !p.emBreve).slice(0, 2)).slice(0, 8) : [];
  const disponiveisPorLinha = (slug: string) => comStatus.filter(p => p.linhaSlug === slug && !p.emBreve).length;



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
            <span className="text-white text-center">Frete grátis em Peruíbe acima de R$ 200</span>
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
            <img src={logoAsset.url} alt="Vida na Praia Leve" width={160} height={100} className="h-11 w-auto" />
          </a>
          <nav className="hidden lg:flex items-center gap-9 font-sub text-[13px] uppercase tracking-[0.18em]">
            {navHome.map(([l, h]) => (
              <a key={h} href={h} className="text-foreground/80 transition-colors hover:text-accent">
                {l}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 ml-auto lg:ml-0 mr-4 lg:mr-0">
            <Link to="/conta" title="Minha conta" aria-label="Minha conta" className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-current/20 text-[color:var(--petrol)] hover:bg-[color:var(--sand)] transition-colors">
              <User className="size-5" aria-hidden="true" />
            </Link>
            <HeaderCart />
          </div>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="size-11 text-foreground lg:hidden" aria-label="Abrir menu"><Menu className="size-6" /></Button></SheetTrigger>
            <SheetContent side="right" className="w-full max-w-none px-6 pt-24 sm:max-w-sm">
              <SheetTitle className="sr-only">Menu principal</SheetTitle>
              <nav className="flex flex-col gap-2 text-2xl font-display" aria-label="Menu principal">
                {navHome.map(([l,h]) => <SheetClose asChild key={h}><a href={h} className="flex min-h-12 items-center">{l}</a></SheetClose>)}
                <div className="mt-6 flex items-center gap-4"><HeaderCart onClick={() => setMenuOpen(false)} /></div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden pt-32 pb-12 sm:pt-36 sm:pb-16 md:pt-44 md:pb-28">
        <div className="pointer-events-none absolute -top-40 -right-32 size-[560px] rounded-full bg-[color:var(--sage)]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-32 size-[420px] rounded-full bg-[color:var(--coral)]/10 blur-3xl" />
        <div className="relative container-x grid items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-10">
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
              Refeições congeladas prontas para aquecer, além de sucos, lanches e doces. Entregamos em Peruíbe, Pedro de Toledo, Ana Dias e Itariri.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link to="/catalogo" className="btn-primary bg-[color:var(--coral)] shadow-[0_20px_50px_-18px_rgba(230,126,95,0.7)] hover:!bg-[color:var(--coral)]">
                Ver cardápio e preços <ArrowRight className="size-4" />
              </Link>
              <a
                href="https://www.instagram.com/vidanapraialeve/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-b border-foreground/25 pb-1 font-sub text-sm text-foreground/80 hover:text-[color:var(--coral)] hover:border-[color:var(--coral)] transition-colors"
              >
                <Instagram className="size-4" /> @vidanapraialeve
              </a>
            </div>
          </div>

          {/* Colagem */}
          <div className="lg:col-span-6 relative animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="relative mx-auto aspect-square w-full max-w-[520px]">
              <div className="absolute inset-x-6 top-0 bottom-24 rounded-full bg-[color:var(--sage)]/25" />
              <HeroPhoto
                src={pHero}
                mobileSrc={pHeroMobile.url}
                eager
                alt="Suco Blue Majik com salmão ao molho de maracujá, arroz negro e brócolis"
                className="blob-a absolute left-[10%] top-[2%] w-[80%] aspect-square  bg-[color:var(--sand)] shadow-[0_40px_80px_-30px_rgba(6,30,38,0.45)] ring-8 ring-background"
              />
              <HeroPhoto
                src={pHero2}
                mobileSrc={pHero2Mobile.url}
                alt="Suco Vital Max com lanche de frango e pães de queijo"
                className="blob-b animate-floaty absolute left-0 bottom-[6%] w-[38%] aspect-square  bg-[color:var(--sand)] shadow-xl ring-8 ring-background"
              />
              <HeroPhoto
                src={pHero3}
                mobileSrc={pHero3Mobile.url}
                alt="Doces fit: mousse de limão, brigadeiro, beijinho e brownie"
                className="absolute right-0 bottom-0 w-[36%] aspect-square rounded-full  bg-[color:var(--sand)] shadow-xl ring-8 ring-background"
              />
              <div className="absolute -left-2 top-[6%] size-24 md:size-28 hidden sm:block">
                <div className="spin-slow absolute inset-0 rounded-full bg-[color:var(--sand)]" />
                <span className="absolute inset-0 flex items-center justify-center text-center font-sub uppercase tracking-[0.18em] text-[9px] leading-[1.6] text-[color:var(--deep)]/80 px-3">
                  curadoria<br />prazer + praticidade
                </span>
              </div>
              <div className="absolute right-[2%] -top-[8%] rounded-2xl bg-card shadow-[0_20px_45px_-20px_rgba(6,30,38,0.45)] px-4 py-3 flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-[color:var(--coral)]" />
                <p className="text-xs md:text-[13px] leading-tight font-sub">
                  Comida de verdade<br />para a vida real
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ENTREGA */}
      <section aria-label="Entrega" className="bg-[color:var(--petrol)] text-[color:var(--offwhite)]">
        <div className="container-x grid gap-4 py-6 md:grid-cols-3 md:items-center text-sm">
          <p className="inline-flex items-start gap-2"><Truck className="size-4 mt-0.5 shrink-0" /> <span><strong className="font-semibold">Entregamos em</strong> {CIDADES_ATENDIDAS.join(", ").replace(/, ([^,]*)$/, " e $1")} (SP).</span></p>
          <p className="inline-flex items-start gap-2"><MapPin className="size-4 mt-0.5 shrink-0" /> {resumoEntrega}</p>
          <p className="inline-flex items-start gap-2"><MessageCircle className="size-4 mt-0.5 shrink-0" /> Você envia a solicitação pelo WhatsApp e a loja confirma o pedido.</p>
        </div>
      </section>
      {/* DESTAQUES DISPONIVEIS */}
      <section id="destaques" className="py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="eyebrow">Disponíveis agora</span>
              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                Gostoso primeiro. <span className="font-script text-[color:var(--coral)]">Leve sempre.</span>
              </h2>
            </div>
            <Link to="/catalogo" className="btn-ghost self-start md:self-end text-foreground">Ver cardápio completo <ChevronRight className="size-4" /></Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {carregando ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-muted" aria-hidden="true" />) : destaques.map(p => <ProductCard key={p.slug} produto={p} categoria={p.linhaNome} estoque={estoque} carregando={carregando} />)}
          </div>
        </div>
      </section>
      {/* LINHAS DE PRODUTOS */}
      <section id="linhas" className="py-24 md:py-32 bg-[color:var(--sand)]/40">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="eyebrow">Categorias</span>
              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                Um cardápio para <span className="font-script text-[color:var(--coral)]">cada momento</span> da sua vida.
              </h2>
            </div>
            <Link to="/catalogo" className="btn-ghost self-start md:self-end text-foreground">Ver catálogo completo <ChevronRight className="size-4" /></Link>
          </div>

          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {linhas.map((l) => (
              <article
                key={l.slug}
                className="card-lift group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <CatalogPhoto
                    src={l.img}
                    alt={l.title}
                    loading="lazy"
                    width={1000}
                    height={1200}
                    className="absolute inset-0 block h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--deep)]/70 via-[color:var(--deep)]/10 to-transparent" />
                  <span className="absolute top-5 left-5 rounded-full bg-white/85 backdrop-blur px-3.5 py-1.5 text-[11px] font-sub uppercase tracking-[0.2em] text-[color:var(--petrol)]">
                    {l.tag}
                  </span>
                  <span className="absolute bottom-4 left-5 rounded-full bg-[color:var(--deep)]/75 px-3 py-1 text-[11px] font-sub uppercase tracking-[0.18em] text-white">
                    {disponiveisPorLinha(l.slug)} {disponiveisPorLinha(l.slug) === 1 ? "disponível" : "disponíveis"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="text-2xl leading-tight">{l.title}</h3>
                  <p className="mt-3 min-h-[4.5rem] line-clamp-3 text-sm text-foreground/65 font-light leading-relaxed">{l.desc}</p>
                  <Link to="/catalogo/$linha" params={{ linha: l.slug }} className="mt-auto inline-flex items-center gap-2 pt-5 font-sub uppercase tracking-[0.2em] text-xs text-[color:var(--petrol)] hover:text-[color:var(--coral)] transition-colors">
                    Explorar <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>

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
                className="rounded-3xl w-full h-auto shadow-[0_40px_80px_-30px_rgba(6,30,38,0.35)] object-cover"
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
      {/* MARCAS PARCEIRAS */}
      <section id="marcas" className="py-20 bg-[color:var(--sand)]/40">
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
              <img src={logoLfwAsset.url} alt="Light Food Way" loading="lazy" width={220} height={120} className="h-16 w-auto opacity-90" />
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
            <img src={logoLightAsset.url} alt="Vida na Praia Leve" loading="lazy" width={160} height={100} className="h-14 w-auto" />
            <p className="mt-6 text-white/70 font-light max-w-sm">
              Alimentação saudável, prática e deliciosa. Uma marca brasileira de lifestyle para você viver com mais leveza.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">Entrega agendada a combinar. Atendimento de segunda a sábado, das 9h às 18h. Pagamento por PIX, dinheiro, débito ou crédito.</p>
            <FooterContacts />
          </div>
          <div className="lg:col-span-8 grid gap-10 sm:grid-cols-3">
            {[
              { t: "Explore", l: [["Sobre", "/#sobre"], ["Categorias", "/#linhas"], ["Cardápio e preços", "/catalogo"]] },
              { t: "Sua compra", l: [["Como funciona", "/#como"], ["Catálogo completo", "/catalogo"], ["Kit Detox", "/catalogo/kits-detox"], ["Meu carrinho", "/carrinho"]] },
              { t: "Contato", l: [["WhatsApp", contactLinks.whatsapp], ["Instagram", contactLinks.instagram], ["contato@vidanapraialeve.com.br", contactLinks.email], ["Consultar entrega em Peruíbe", contactLinks.whatsapp]] },
            ].map((c) => (
              <div key={c.t}>
                <p className="font-sub uppercase tracking-[0.25em] text-xs text-[color:var(--sand)]">{c.t}</p>
                <ul className="mt-5 space-y-3 text-sm text-white/70 font-light">
                  {c.l.map(([label, href]) => (
                    <li key={label}><a href={href} target={href.startsWith("https:") ? "_blank" : undefined} rel={href.startsWith("https:") ? "noopener noreferrer" : undefined} className="hover:text-[color:var(--coral)] transition">{label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="container-x mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/50 font-light">
          <p>© {new Date().getFullYear()} Vida na Praia Leve. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href={contactLinks.location} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white"><MapPin className="size-3.5" /> Peruíbe-SP</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

