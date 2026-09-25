import fichas from "@/data/product-info.json";

type Ficha = (typeof fichas)[keyof typeof fichas];
export const informacaoDoProduto = (slug: string): Ficha | undefined =>
  (fichas as Record<string, Ficha>)[slug];

const nutrientes = [
  ["Valor energético", "kcal"],
  ["Carboidratos", "g"],
  ["Açúcares totais", "g"],
  ["Açúcares adicionados", "g"],
  ["Proteínas", "g"],
  ["Gorduras totais", "g"],
  ["Gorduras saturadas", "g"],
  ["Gorduras trans", "g"],
  ["Fibras alimentares", "g"],
  ["Sódio", "mg"],
] as const;

export function ProductInformation({ slug }: { slug: string }) {
  const ficha = informacaoDoProduto(slug);
  if (!ficha) return null;
  return (
    <div className="mt-6 space-y-6 border-t border-border pt-6 text-sm leading-relaxed">
      <section aria-label="Ingredientes">
        <h3 className="text-lg text-[color:var(--petrol)]">Ingredientes</h3>
        <p className="mt-2 text-foreground/80">{ficha.ingredientes}</p>
      </section>
      {ficha.alergenicos && (
        <section aria-label="Declaração de alergênicos do rótulo" className="rounded-xl bg-[color:var(--sand)]/40 p-4">
          <h3 className="font-semibold text-[color:var(--petrol)]">Declarações do rótulo</h3>
          <p className="mt-1">{ficha.alergenicos}</p>
          <p className="mt-2 text-xs text-foreground/65">Confira também a lista completa de ingredientes.</p>
        </section>
      )}
      <section aria-label="Informação nutricional">
        <h3 className="text-lg text-[color:var(--petrol)]">Informação nutricional</h3>
        <p className="mt-2 text-foreground/70">Porção indicada no rótulo: {ficha.porcao}.</p>
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">Informação nutricional por {ficha.base}</caption>
            <thead className="bg-[color:var(--petrol)] text-white">
              <tr><th scope="col" className="p-3 text-left font-medium">Nutriente</th><th scope="col" className="p-3 text-right font-medium">Por {ficha.base}</th></tr>
            </thead>
            <tbody>
              {nutrientes.map(([nome, unidade], i) => (
                <tr key={nome} className="border-t border-border even:bg-[color:var(--sand)]/20">
                  <th scope="row" className="px-3 py-2.5 text-left font-normal">{nome}</th>
                  <td className="px-3 py-2.5 text-right tabular-nums">{ficha.valores[i] !== "" ? `${ficha.valores[i]} ${unidade}` : "Não informado*"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {ficha.valores.includes("") && <p className="mt-2 text-xs text-foreground/65">* Dado ausente ou pendente de confirmação no material fornecido.</p>}
        {ficha.observacao && <p className="mt-3 text-xs text-foreground/70">{ficha.observacao}</p>}
      </section>
      {ficha.conservacao && <section aria-label="Conservação"><h3 className="text-lg text-[color:var(--petrol)]">Conservação</h3><p className="mt-2 text-foreground/80">{ficha.conservacao}</p></section>}
    </div>
  );
}
