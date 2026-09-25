# Páginas legais: Política de Privacidade + Trocas e Cancelamento

Novidade que o usuário verá: duas páginas legais novas (Política de Privacidade e Trocas e Cancelamento), o CNPJ 22.635.784/0001-67 exibido nos rodapés, e links para as duas páginas no rodapé de todo o site. Nada mais muda: mesmo layout, identidade, navegação e produtos.

## Páginas novas (mesma identidade visual do site)

### 1. `/politica-de-privacidade`
Página genérica de política de privacidade, em português, com os blocos:
- Identificação do site: Vida na Praia Leve, CNPJ 22.635.784/0001-67, Peruíbe-SP, contato@vidanapraialeve.com.br, WhatsApp (13) 3366-2961.
- Dados que coletamos: nome, telefone, e-mail, CPF (opcional), endereço de entrega e dados do pedido, quando o cliente faz um pedido ou contato.
- Para que usamos: preparar e entregar pedidos, contato pelo WhatsApp, atendimento e melhorias no site.
- Compartilhamento: apenas o necessário para a entrega; não vendemos dados.
- Direitos do titular (LGPD): acesso, correção, exclusão e revogação do consentimento, pedidos pelo e-mail de contato.
- Segurança e conservação: só o tempo necessário para o atendimento e obrigações legais.
- Cookies: armazenamento local básico (carrinho e sessão de conta).

### 2. `/trocas-e-cancelamento`
Texto melhorado a partir da sugestão do usuário, com os blocos:
- **Direito de arrependimento (pedidos online):** o Código de Defesa do Consumidor garante 7 dias corridos para desistir de compras pela internet. Por serem alimentos frescos ou congelados (alta perecibilidade), o pedido de cancelamento deve ser feito o quanto antes — de preferência com pelo menos 24 horas de antecedência da produção/entrega agendada, pelo WhatsApp.
- **Trocas por defeito ou avaria:** produto chegou violado, estragado, com embalagem danificada ou diferente do pedido → troca imediata ou estorno proporcional; contato pelo WhatsApp o quanto antes, com foto se possível.
- **Insatisfação com o sabor:** produtos em perfeitas condições não são trocados por gosto pessoal, conforme o Código de Defesa do Consumidor; aceitamos sugestões para aprimorar o cardápio.
- Fechamento com canais de contato (WhatsApp e e-mail) e horário de atendimento (segunda a sábado, 9h às 18h).

## Rodapé (todas as páginas)
- `src/routes/index.tsx` e `src/components/SiteChrome.tsx`: linha final passa a exibir o CNPJ — "© {ano} Vida na Praia Leve — CNPJ 22.635.784/0001-67".
- Links "Política de Privacidade" e "Trocas e Cancelamento" no rodapé (coluna própria ou junto do copyright), apontando para as rotas novas com `Link` do TanStack Router.
- Atribuição de produção: apenas "Distribuidora oficial Light Food Way" — nenhuma pessoa física é citada como produtora das refeições (nem na home, nem no catálogo, nem nas páginas novas).

## Detalhes técnicos
- Rotas novas: `src/routes/politica-de-privacidade.tsx` e `src/routes/trocas-e-cancelamento.tsx`, ambas com `SiteChrome` (cabeçalho, barra de entrega e rodapé padrão), `head()` com título e descrição próprios e `og:type`/`twitter:card`.
- Estilo tipográfico existente (Capriola/Poppins, tokens de cor do site); texto em coluna única de leitura, sem inventar dados não confirmados (nenhuma razão social além do CNPJ informado, nenhum endereço novo).
- Nenhum campo de cadastro, pedido ou estoque é alterado.

## Validação
- Build OK; verificar no navegador que as duas páginas abrem pelo link do rodapé, em desktop e celular, com cabeçalho/rodapé e botão de WhatsApp presentes.
