import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Leaf,
  Sparkles,
  Package,
  Truck,
  Snowflake,
  Heart,
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
import heroImg from "@/assets/hero-beach-food.jpg";
import aboutImg from "@/assets/about-family.jpg";
import beachImg from "@/assets/beach-banner.jpg";
import pDaily from "@/assets/product-daily.jpg";
import pPerf from "@/assets/product-performance.jpg";
import pWell from "@/assets/product-wellness.jpg";
import pPrem from "@/assets/product-premium.jpg";
import pSnack from "@/assets/product-snacks.jpg";
import pDess from "@/assets/product-desserts.jpg";
import pFunc from "@/assets/product-functional.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vida na Praia Leve — Leve uma vida mais leve" },
      { name: "description", content: "Refeições saudáveis congeladas, sucos detox, snacks funcionais e kits para transformar sua rotina. Praticidade premium com sabor de casa." },
      { property: "og:title", content: "Vida na Praia Leve — Leve uma vida mais leve" },
      { property: "og:description", content: "Alimentação saudável, prática e deliciosa. Refeições, kits e assinaturas entregues em casa." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const linhas = [
  { tag: "Dia a Dia", title: "Refeições equilibradas", desc: "Pratos completos para toda a semana, do café ao jantar.", img: pDaily, color: "sage" },
  { tag: "Performance", title: "Mais proteína, mais energia", desc: "Nutrição precisa para quem treina e busca resultados.", img: pPerf, color: "petrol" },
  { tag: "Bem-estar", title: "Low carb, vegano, sem glúten", desc: "Opções funcionais para cada estilo de vida.", img: pWell, color: "sage" },
  { tag: "Premium", title: "Peixes & receitas especiais", desc: "Ingredientes selecionados para momentos únicos.", img: pPrem, color: "deep" },
  { tag: "Lanches Inteligentes", title: "Empadas, pães de queijo, pizza fit", desc: "Praticidade saborosa para qualquer hora do dia.", img: pSnack, color: "coral" },
  { tag: "Momento Leve", title: "Brownies & sobremesas funcionais", desc: "Doces com propósito, sem culpa.", img: pDess, color: "coral" },
  { tag: "Funcionais", title: "Sucos, chás & mix nuts", desc: "Bebidas e snacks que trabalham por você.", img: pFunc, color: "sage" },
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

const kits = [
  { n: "Kit Dia a Dia", d: "10 refeições equilibradas para a rotina.", p: "R$ 289" },
  { n: "Kit Performance", d: "12 pratos com foco em proteína e energia.", p: "R$ 349" },
  { n: "Kit Casal", d: "Refeições pensadas para dois, sem preocupação.", p: "R$ 429" },
  { n: "Kit Família", d: "20 porções generosas para toda a semana.", p: "R$ 579" },
  { n: "Kit Emagrecimento", d: "Cardápio equilibrado para seus objetivos.", p: "R$ 319" },
  { n: "Kit Degustação", d: "Uma seleção do nosso melhor. Comece por aqui.", p: "R$ 199" },
];

const planos = [
  { n: "Essencial", d: "Refeições da semana, no seu ritmo.", f: ["8 refeições/semana", "Ajuste livre do cardápio", "Frete facilitado"] },
  { n: "Performance", d: "Para quem treina e vive intenso.", f: ["12 refeições + snacks", "Alto valor proteico", "Suporte nutricional"], destaque: true },
  { n: "Família", d: "Praticidade para o dia a dia em casa.", f: ["20 porções generosas", "Cardápio infantil disponível", "Frete grátis"] },
];

const depoimentos = [
  { n: "Ana Beatriz", c: "São Paulo, SP", t: "Meu almoço deixou de ser um problema. Sabor incrível e me sinto muito mais leve." },
  { n: "Rafael Menezes", c: "Rio de Janeiro, RJ", t: "Como atleta amador, o kit Performance mudou minha rotina. Recuperação melhor e mais energia." },
  { n: "Família Souza", c: "Florianópolis, SC", t: "As crianças amam. E a gente ganha tempo pra viver o que importa." },
];

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
          scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border/60" : "bg-transparent"
        }`}
      >
        <div className="container-x flex items-center justify-between py-4">
          <a href="#top" className="flex items-center gap-3">
            <img src={scrolled ? logoAsset.url : logoLightAsset.url} alt="Vida na Praia Leve" className="h-11 w-auto" />
          </a>
          <nav className="hidden lg:flex items-center gap-9 font-sub text-[13px] uppercase tracking-[0.18em]">
            {[
              ["Sobre", "#sobre"],
              ["Linhas", "#linhas"],
              ["Kits", "#kits"],
              ["Assinaturas", "#assinaturas"],
              ["Como funciona", "#como"],
              ["Blog", "#blog"],
            ].map(([l, h]) => (
              <a
                key={h}
                href={h}
                className={`transition-colors hover:text-accent ${scrolled ? "text-foreground/80" : "text-white/90"}`}
              >
                {l}
              </a>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            <a href="#pedir" className="btn-primary !py-2.5 !px-5 text-xs">Quero pedir</a>
          </div>
          <button
            className={`lg:hidden ${scrolled ? "text-foreground" : "text-white"}`}
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
            {[["Sobre","#sobre"],["Linhas","#linhas"],["Kits","#kits"],["Assinaturas","#assinaturas"],["Como funciona","#como"],["Blog","#blog"]].map(([l,h])=>(
              <a key={h} href={h} onClick={()=>setMenuOpen(false)}>{l}</a>
            ))}
            <a href="#pedir" onClick={()=>setMenuOpen(false)} className="btn-primary mt-6 w-fit">Quero pedir</a>
          </nav>
        </div>
      )}

      {/* HERO */}
      <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Mesa saudável à beira-mar"
          className="absolute inset-0 h-full w-full object-cover scale-105"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--deep)]/55 via-[color:var(--deep)]/25 to-[color:var(--deep)]/70" />
        <div className="relative z-10 container-x flex min-h-[100svh] flex-col justify-end pb-20 pt-40 text-[color:var(--offwhite)]">
          <div className="max-w-3xl animate-fade-up">
            <span className="eyebrow !text-[color:var(--sand)]">Vida · Leveza · Sabor</span>
            <h1 className="mt-6 text-5xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-[88px]">
              Leve uma vida
              <br />
              <span className="font-script text-[color:var(--coral)] text-6xl sm:text-7xl md:text-8xl lg:text-[110px] leading-none">mais leve</span>
            </h1>
            <p className="mt-8 max-w-xl font-light text-lg text-white/85">
              Alimentação saudável, prática e deliciosa para transformar sua rotina — do dia a dia à praia, do treino ao momento em família.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#linhas" className="btn-primary bg-[color:var(--coral)] shadow-[0_20px_50px_-15px_rgba(230,126,95,0.6)] hover:!bg-[color:var(--coral)]">
                Conheça nossos produtos <ArrowRight className="size-4" />
              </a>
              <a href="#pedir" className="btn-ghost text-white border-white/40 hover:bg-white/10">
                Quero pedir
              </a>
            </div>
          </div>
          <div className="mt-16 flex items-center gap-6 text-xs uppercase tracking-[0.3em] text-white/70 font-sub">
            <span className="h-px w-16 bg-white/40" />
            Role para descobrir
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
                alt="Família em torno de uma mesa saudável"
                loading="lazy"
                width={1408}
                height={1600}
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
            <a href="#pedir" className="btn-ghost self-start md:self-end text-foreground">Ver catálogo completo <ChevronRight className="size-4" /></a>
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
                </div>
                <div className="p-7">
                  <h3 className="text-2xl leading-tight">{l.title}</h3>
                  <p className="mt-3 text-sm text-foreground/65 font-light leading-relaxed">{l.desc}</p>
                  <a href="#pedir" className="mt-5 inline-flex items-center gap-2 font-sub uppercase tracking-[0.2em] text-xs text-[color:var(--petrol)] hover:text-[color:var(--coral)] transition-colors">
                    Explorar <ArrowRight className="size-3.5" />
                  </a>
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

      {/* KITS */}
      <section id="kits" className="py-24 md:py-32">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <span className="eyebrow">Kits selecionados</span>
            <h2 className="mt-4 text-4xl md:text-5xl leading-[1.05]">Combinações pensadas para o seu estilo de vida.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {kits.map((k, i) => (
              <div
                key={k.n}
                className={`card-lift rounded-3xl p-8 flex flex-col justify-between min-h-[240px] ${
                  i % 3 === 1 ? "bg-[color:var(--sage)]/25" : "bg-card border border-border"
                }`}
              >
                <div>
                  <Package className="size-5 text-[color:var(--coral)]" />
                  <h3 className="mt-4 text-2xl">{k.n}</h3>
                  <p className="mt-3 text-sm text-foreground/65 font-light">{k.d}</p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="font-display text-2xl text-[color:var(--petrol)]">{k.p}</span>
                  <a href="#pedir" className="inline-flex items-center gap-2 font-sub uppercase tracking-[0.2em] text-xs text-foreground hover:text-[color:var(--coral)]">
                    Montar <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASSINATURAS */}
      <section id="assinaturas" className="py-24 md:py-32 bg-[color:var(--deep)] text-[color:var(--offwhite)]">
        <div className="container-x">
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-7">
              <span className="eyebrow !text-[color:var(--sand)]">Assinaturas</span>
              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                Praticidade que <span className="font-script text-[color:var(--coral)]">vira hábito</span>.
              </h2>
            </div>
            <p className="lg:col-span-5 self-end text-lg text-white/70 font-light">
              Escolha um plano, deixe a rotina fluir. Ajuste, pause ou cancele quando quiser — sem burocracia.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {planos.map((p) => (
              <div
                key={p.n}
                className={`rounded-3xl p-8 border transition-all ${
                  p.destaque
                    ? "bg-[color:var(--coral)] text-[color:var(--offwhite)] border-[color:var(--coral)] shadow-2xl scale-[1.02]"
                    : "bg-white/5 border-white/10 hover:border-white/25"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl">{p.n}</h3>
                  {p.destaque && <span className="text-[10px] font-sub uppercase tracking-[0.25em] bg-white/20 px-2.5 py-1 rounded-full">Mais escolhido</span>}
                </div>
                <p className={`mt-3 text-sm font-light ${p.destaque ? "text-white/85" : "text-white/70"}`}>{p.d}</p>
                <ul className="mt-8 space-y-3 text-sm">
                  {p.f.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="mt-2 size-1.5 rounded-full bg-current opacity-60" /> {f}
                    </li>
                  ))}
                </ul>
                <a href="#pedir" className={`mt-10 inline-flex items-center gap-2 font-sub uppercase tracking-[0.2em] text-xs ${p.destaque ? "text-white" : "text-[color:var(--sand)]"}`}>
                  Em breve <ArrowRight className="size-3.5" />
                </a>
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
              <form className="lg:col-span-5 space-y-4" onSubmit={(e)=>e.preventDefault()}>
                <input
                  type="email"
                  required
                  placeholder="seu melhor e-mail"
                  className="w-full rounded-full bg-white/10 border border-white/20 px-6 py-4 text-base placeholder:text-white/50 focus:outline-none focus:border-[color:var(--coral)] transition"
                />
                <button className="btn-primary bg-[color:var(--coral)] hover:!bg-[color:var(--coral)] w-full">
                  Quero receber <Heart className="size-4" />
                </button>
                <p className="text-xs text-white/50 font-light">Sem spam. Só coisas boas.</p>
              </form>
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
              { t: "Explore", l: ["Sobre", "Linhas", "Kits", "Assinaturas", "Blog"] },
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
    </div>
  );
}
