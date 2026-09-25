import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/SiteChrome";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({ meta: [
    { title: "Política de Privacidade — Vida na Praia Leve" },
    { name: "description", content: "Como a Vida na Praia Leve coleta, usa e protege seus dados pessoais. CNPJ 22.635.784/0001-67." },
    { property: "og:title", content: "Política de Privacidade — Vida na Praia Leve" },
    { property: "og:description", content: "Como a Vida na Praia Leve coleta, usa e protege seus dados pessoais." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://vidanapraialeve.com.br/politica-de-privacidade" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Política de Privacidade — Vida na Praia Leve" },
    { name: "twitter:description", content: "Como a Vida na Praia Leve coleta, usa e protege seus dados pessoais." },
  ], links: [{ rel: "canonical", href: "https://vidanapraialeve.com.br/politica-de-privacidade" }] }),
  component: PoliticaPage,
});

function PoliticaPage() {
  return (
    <SiteChrome>
      <article className="container-x pt-32 pb-28 max-w-3xl">
        <span className="eyebrow">Institucional</span>
        <h1 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05]">Política de Privacidade</h1>
        <p className="mt-6 text-foreground/70 font-light leading-relaxed">
          A sua privacidade importa para nós. Esta política explica, de forma simples, como o site da
          <strong className="font-medium text-foreground"> Vida na Praia Leve</strong> coleta, usa e protege as informações
          que você fornece ao navegar e fazer pedidos.
        </p>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="font-display text-2xl md:text-3xl">Quem somos</h2>
            <p className="mt-4 text-foreground/70 font-light leading-relaxed">
              Vida na Praia Leve, CNPJ <strong className="font-medium text-foreground">22.635.784/0001-67</strong>, com atuação em
              Peruíbe-SP e região. Atendimento de segunda a sábado, das 9h às 18h, pelo e-mail
              contato@vidanapraialeve.com.br e pelo WhatsApp (13) 3366-2961.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl">Quais dados coletamos</h2>
            <ul className="mt-4 space-y-3 text-foreground/70 font-light leading-relaxed list-disc pl-5">
              <li>Nome, telefone e e-mail informados no formulário de contato ou pedido;</li>
              <li>CPF, apenas se você optar por informá-lo (campo opcional);</li>
              <li>Endereço de entrega e dados do pedido, quando você finaliza uma compra;</li>
              <li>Mensagens enviadas pelo WhatsApp ou e-mail durante o atendimento.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl">Como usamos os dados</h2>
            <p className="mt-4 text-foreground/70 font-light leading-relaxed">
              Usamos suas informações exclusivamente para preparar e entregar seu pedido, combinar a entrega
              agendada, entrar em contato sobre sua compra, prestar atendimento e melhorar nosso site e nosso
              cardápio. Não vendemos, alugamos nem trocamos seus dados.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl">Com quem compartilhamos</h2>
            <p className="mt-4 text-foreground/70 font-light leading-relaxed">
              Compartilhamos apenas o necessário para cumprir o pedido e a entrega — por exemplo, o dado de
              contato e o endereço junto a quem realiza a entrega. Nenhuma informação é utilizada para fins
              publicitários de terceiros.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl">Segurança e conservação</h2>
            <p className="mt-4 text-foreground/70 font-light leading-relaxed">
              Seus dados ficam armazenados de forma segura e são mantidos apenas pelo tempo necessário para
              atender pedidos, resolver eventuais pendências e cumprir obrigações legais. Você pode pedir a
              correção ou exclusão dos seus dados a qualquer momento.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl">Seus direitos (LGPD)</h2>
            <p className="mt-4 text-foreground/70 font-light leading-relaxed">
              Conforme a Lei Geral de Proteção de Dados, você pode solicitar a qualquer momento: confirmação do
              tratamento, acesso aos seus dados, correção de informações incompletas ou desatualizadas,
              exclusão dos dados tratados com base no consentimento e revogação desse consentimento. Basta
              escrever para contato@vidanapraialeve.com.br.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl">Cookies e armazenamento local</h2>
            <p className="mt-4 text-foreground/70 font-light leading-relaxed">
              Utilizamos armazenamento local no seu navegador apenas para o funcionamento básico do site — como
              lembrar os itens do seu carrinho e manter a sessão da sua conta, quando você decide entrar na
              conta. Não usamos cookies de publicidade.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl">Atualizações</h2>
            <p className="mt-4 text-foreground/70 font-light leading-relaxed">
              Esta política pode ser atualizada para refletir melhorias no site ou mudanças legais. A versão
              publicada nesta página é sempre a vigente.
            </p>
          </section>
        </div>
      </article>
    </SiteChrome>
  );
}
