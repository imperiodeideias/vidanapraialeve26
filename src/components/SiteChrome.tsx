import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, Instagram, MessageCircle, Mail, MapPin } from "lucide-react";
import logoAsset from "@/assets/logo-vnpl.png.asset.json";
import logoLightAsset from "@/assets/logo-vnpl-light.png.asset.json";

type Props = { children: ReactNode; transparentUntilScroll?: boolean };

type NavItem =
  | { l: string; to: "/" | "/catalogo"; href?: undefined }
  | { l: string; href: string; to?: undefined };

const navItems: NavItem[] = [
  { l: "Início", to: "/" },
  { l: "Catálogo", to: "/catalogo" },
  { l: "Sobre", href: "/#sobre" },
  { l: "Kits", href: "/#kits" },
  { l: "Assinaturas", href: "/#assinaturas" },
  { l: "Como funciona", href: "/#como" },
];

export function SiteChrome({ children, transparentUntilScroll = false }: Props) {
  const [scrolled, setScrolled] = useState(!transparentUntilScroll);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!transparentUntilScroll) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentUntilScroll]);

  const logoSrc = transparentUntilScroll && !scrolled ? logoLightAsset.url : logoAsset.url;
  const textLight = transparentUntilScroll && !scrolled;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border/60" : "bg-transparent"
        }`}
      >
        <div className="container-x flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoSrc} alt="Vida na Praia Leve" className="h-11 w-auto" />
          </Link>
          <nav className="hidden lg:flex items-center gap-9 font-sub text-[13px] uppercase tracking-[0.18em]">
            {navItems.map((n) =>
              "to" in n ? (
                <Link key={n.l} to={n.to} className={`transition-colors hover:text-accent ${textLight ? "text-white/90" : "text-foreground/80"}`}>
                  {n.l}
                </Link>
              ) : (
                <a key={n.l} href={n.href} className={`transition-colors hover:text-accent ${textLight ? "text-white/90" : "text-foreground/80"}`}>
                  {n.l}
                </a>
              ),
            )}
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            <a href="/#pedir" className="btn-primary !py-2.5 !px-5 text-xs">Quero pedir</a>
          </div>
          <button
            className={`lg:hidden ${textLight ? "text-white" : "text-foreground"}`}
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-background">
          <div className="container-x flex items-center justify-between py-4">
            <img src={logoAsset.url} alt="Vida na Praia Leve" className="h-11 w-auto" />
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X className="size-6" /></button>
          </div>
          <nav className="container-x mt-10 flex flex-col gap-6 text-2xl font-display">
            {navItems.map((n) =>
              "to" in n ? (
                <Link key={n.l} to={n.to} onClick={() => setMenuOpen(false)}>{n.l}</Link>
              ) : (
                <a key={n.l} href={n.href} onClick={() => setMenuOpen(false)}>{n.l}</a>
              ),
            )}
            <a href="/#pedir" onClick={() => setMenuOpen(false)} className="btn-primary mt-6 w-fit">Quero pedir</a>
          </nav>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="bg-[color:var(--deep)] text-[color:var(--offwhite)] pt-20 pb-10">
        <div className="container-x grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2 max-w-md">
            <img src={logoLightAsset.url} alt="Vida na Praia Leve" className="h-12 w-auto mb-6" />
            <p className="font-light text-white/70 leading-relaxed">
              Vida na Praia Leve — alimentação saudável, praticidade e leveza. Um jeito novo de viver.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a href="#" className="size-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"><Instagram className="size-4" /></a>
              <a href="#" className="size-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"><MessageCircle className="size-4" /></a>
              <a href="#" className="size-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"><Mail className="size-4" /></a>
            </div>
          </div>
          <div>
            <p className="font-sub uppercase tracking-[0.25em] text-xs text-[color:var(--sand)] mb-5">Navegue</p>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link to="/" className="hover:text-white">Início</Link></li>
              <li><Link to="/catalogo" className="hover:text-white">Catálogo</Link></li>
              <li><a href="/#sobre" className="hover:text-white">Sobre</a></li>
              <li><a href="/#kits" className="hover:text-white">Kits</a></li>
              <li><a href="/#assinaturas" className="hover:text-white">Assinaturas</a></li>
            </ul>
          </div>
          <div>
            <p className="font-sub uppercase tracking-[0.25em] text-xs text-[color:var(--sand)] mb-5">Contato</p>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex gap-2"><MapPin className="size-4 mt-0.5 shrink-0" /> Litoral & Grandes centros — Brasil</li>
              <li className="flex gap-2"><Mail className="size-4 mt-0.5 shrink-0" /> contato@vidanapraialeve.com.br</li>
              <li className="flex gap-2"><MessageCircle className="size-4 mt-0.5 shrink-0" /> WhatsApp da loja</li>
            </ul>
          </div>
        </div>
        <div className="container-x mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50 font-sub uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} Vida na Praia Leve. Todos os direitos reservados.</p>
          <p>Distribuidora oficial Light Food Way</p>
        </div>
      </footer>
    </div>
  );
}
