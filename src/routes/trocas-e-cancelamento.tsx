import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/SiteChrome";

export const Route = createFileRoute("/trocas-e-cancelamento")({
  head: () => ({ meta: [
    { title: "Trocas e Cancelamento — Vida na Praia Leve" },
    { name: "description", content: "Regras de cancelamento, arrependimento e trocas dos pedidos da Vida na Praia Leve (CNPJ 22.635.784/0001-67)." },
    { property: "og:title", content: "Trocas e Cancelamento — Vida na Praia Leve" },
    { property: "og:description", content: "Como cancelar pedidos e solicitar trocas na Vida na Praia Leve." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://vidanapraialeve.com.br/trocas-e-cancelamento" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Trocas e Cancelamento — Vida na Praia Leve" },
    { name: "twitter:description", content: "Como cancelar pedidos e solicitar trocas na Vida na Praia Leve." },
  ], links: [{ rel: "canonical", href: "https://vidanapraialeve.com.br/trocas-e-cancelamento" }] }),
  component: TrocasPage,
});

function TrocasPage() {
  return (
    <SiteChrome>
      <article className="container-x pt-32 pb-28 max-w-3xl">
        <span className="eyebrow">Institucional</span>
        <h1 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05]">Trocas e Cancelamento</h1>
        <p className="mt-6 text-foreground/70 font-light leading-relaxed">
          Trabalhamos com alimentos frescos e congelados, produzidos sob encomenda. Por isso, algumas regras
          de cancelamento e troca são diferentes das lojas comuns — e explicamos tudo aqui de forma clara.
        </p>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="font-display text-2xl md:text-3xl">Cancelamento e arrependimento (pedidos online)</h2>
            <p className="mt-4 text-foreground/70 font-light leading-relaxed">
              Para compras feitas pela internet, o Código de Defesa do Consumidor garante o direito de
              arrependimento em até 7 dias corridos após a contratação. Como trabalharmos com produtos de alta
              perecibilidade — alimentos frescos e congelados —, pedimos que a solicitação de cancelamento seja
              enviada o quanto antes, de preferência com pelo menos <strong className="font-medium text-foreground">24 horas de
              antecedência</strong> da data de produção ou entrega agendada. Assim conseguimos evitar o desperdício
              de alimentos já preparados.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl">Trocas por defeito ou avaria</h2>
            <p className="mt-4 text-foreground/70 font-light leading-relaxed">
              Se o produto chegou violado, estragado, com a embalagem danificada ou diferente do que foi
              pedido, você tem direito à <strong className="font-medium text-foreground">troca imediata ou ao estorno
              proporcional</strong> do valor. Entre em contato o quanto antes, de preferência no mesmo dia da
              entrega e, se possível, com uma foto do produto. Fazemos o acerto com rapidez e sem burocracia.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl">Insatisfação com o sabor</h2>
            <p className="mt-4 text-foreground/70 font-light leading-relaxed">
              Produtos que chegam em perfeitas condições de conservação não precisam ser trocados nem
              devolvidos quando o motivo é apenas o gosto pessoal, conforme o Código de Defesa do Consumidor.
              Ainda assim, sua opinião é muito bem-vinda: nos conte o que achou e faremos o possível para
              aprimorar o cardápio.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl">Como solicitar</h2>
            <p className="mt-4 text-foreground/70 font-light leading-relaxed">
              Cancelamentos e trocas são atendidos pelo WhatsApp (13) 3366-2961 e pelo e-mail
              contato@vidanapraialeve.com.br, de segunda a sábado, das 9h às 18h. Informe o nome do pedido e,
              no caso de trocas, descreva o ocorrido com fotos, se possível.
            </p>
          </section>
        </div>
      </article>
    </SiteChrome>
  );
}
