import { useState } from "react";
import { ProductInformation, informacaoDoProduto } from "@/components/ProductInformation";
import type { Produto } from "@/data/catalogo";
import { CatalogPhoto } from "@/components/CatalogPhoto";
import { ComingSoonBanner } from "@/components/ComingSoonBanner";
import { ProductPrice } from "@/components/ProductPrice";
import { AddToCart } from "@/components/Cart";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { EstoqueMap } from "@/lib/estoque";
import { Button } from "@/components/ui/button";

type Props = { produto: Produto; categoria?: string; headingLevel?: "h2" | "h3"; estoque?: EstoqueMap; carregando?: boolean };

export function ProductCard({ produto: p, categoria, headingLevel = "h3", estoque, carregando }: Props) {
  const [aberto, setAberto] = useState(false);
  const H = headingLevel;
  const ficha = informacaoDoProduto(p.slug);
  return (
    <article className="card-lift group bg-card rounded-3xl overflow-hidden border border-border flex flex-col">
      <div className="relative shrink-0 aspect-[4/3] overflow-hidden bg-[color:var(--sand)]/50">
        <CatalogPhoto src={p.img} alt={p.nome} loading="lazy" width={1000} height={750} className="absolute inset-0 block h-full w-full object-cover object-center" />
      </div>
      {p.emBreve && <ComingSoonBanner />}
      <div className="p-6 flex flex-col flex-1">
        {categoria && <span className="font-sub uppercase tracking-[0.2em] text-[10px] text-[color:var(--coral)]">{categoria}</span>}
        <H className="mt-2 text-lg leading-tight">{p.nome}</H>
        {p.subtitulo && <p className="mt-1.5 text-sm text-foreground/60 font-light leading-snug">{p.subtitulo}</p>}
        {p.peso && <p className="mt-2 text-xs font-sub uppercase tracking-[0.15em] text-foreground/60">{p.peso}</p>}
        <div className="flex-1" />
        <ProductPrice produto={p} estoque={estoque} carregando={carregando} />
        <Button variant="link" type="button" onClick={() => setAberto(true)} className="mt-1 min-h-11 self-start px-0 text-sm text-[color:var(--petrol)] hover:text-[color:var(--coral)]">
          Ver detalhes
        </Button>
        {p.emBreve ? <p className="mt-5 text-sm text-foreground/60">Disponível em breve</p> : <AddToCart produto={p} estoque={estoque} />}
      </div>
      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-xl max-h-[90dvh] overflow-y-auto rounded-3xl p-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
            <CatalogPhoto src={p.img} alt={p.nome} loading="lazy" width={1000} height={750} className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="p-7">
            {categoria && <span className="font-sub uppercase tracking-[0.2em] text-[10px] text-[color:var(--coral)]">{categoria}</span>}
            <DialogTitle className="mt-2 text-2xl leading-tight">{p.nome}</DialogTitle>
            {p.subtitulo && <p className="mt-1 text-foreground/60">{p.subtitulo}</p>}
            <DialogDescription className="mt-4 text-foreground/75 leading-relaxed">{ficha ? "Ingredientes e informação nutricional conforme o rótulo fornecido." : p.descricao}</DialogDescription>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {p.peso && <div><dt className="text-foreground/55 text-xs uppercase tracking-[0.15em]">Peso / volume</dt><dd className="mt-1">{p.peso}</dd></div>}
              {p.pedidoMinimo && <div><dt className="text-foreground/55 text-xs uppercase tracking-[0.15em]">Pedido mínimo</dt><dd className="mt-1">{p.pedidoMinimo} unidades</dd></div>}
            </dl>
            <ProductInformation slug={p.slug} />
            {!ficha && p.tags && p.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map(t => <span key={t} className="text-[10px] font-sub uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-[color:var(--sage)]/40 text-[color:var(--sage)]">{t}</span>)}
              </div>
            )}
            <ProductPrice produto={p} estoque={estoque} carregando={carregando} />
            {p.emBreve ? <p className="mt-5 text-sm text-foreground/60">Disponível em breve</p> : <AddToCart produto={p} estoque={estoque} />}
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}
