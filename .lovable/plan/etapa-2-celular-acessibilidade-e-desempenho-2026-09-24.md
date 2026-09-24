# Etapa 2 — Celular, acessibilidade e desempenho

Somente a Etapa 2. Nada será publicado; clientes, pedidos, preços, estoque e integrações ficam intocados. O bloco de marcas parceiras será mantido e o CPF continuará opcional.

## 1. Experiência no celular
- Reduzir o espaço vertical da abertura no celular e aproximar as fotos dos alimentos do texto principal, preservando a composição atual no desktop.
- Substituir os atalhos flutuantes concorrentes por uma barra de pedido no celular quando houver itens, com quantidade, subtotal e ação “Ver pedido”.
- Manter WhatsApp e carrinho acessíveis sem sobrepor textos, botões ou a barra de pedido; reservar espaço inferior nas telas pequenas.
- Manter o carrinho compacto atual no desktop.

## 2. Acessibilidade
- Garantir áreas de toque adequadas, foco visível e contraste legível nos controles principais.
- Tornar os menus móveis modais acessíveis: foco inicial, retenção do foco, fechamento por Escape e devolução do foco ao botão que abriu.
- Preservar rótulos e mensagens de confirmação para leitor de tela.
- Ampliar a preferência de redução de movimento para transições, animações de entrada e rolagem suave.

## 3. Desempenho e estabilidade visual
- Priorizar somente a foto principal da abertura; carregar as demais imagens fora da primeira tela sob demanda.
- Informar dimensões estáveis e proporções corretas para logos e fotos, evitando deslocamentos durante o carregamento.
- Reduzir o tamanho dos arquivos locais mais pesados usados na abertura sem alterar o enquadramento visual.
- Evitar mostrar preço provisório enquanto o estoque/preço real ainda está carregando; usar um espaço reservado consistente até a informação definitiva chegar.
- Evitar consultas duplicadas de estoque dentro de cada cartão, compartilhando o estado já carregado quando possível.

## 4. Informações confirmadas
- Incluir de forma discreta onde fizer sentido: entrega agendada a combinar; atendimento de segunda a sábado, das 9h às 18h; PIX, dinheiro, cartão de débito ou crédito.
- Não adicionar informações de produto ainda não confirmadas.

## Validação
- Testar a prévia em celular e desktop: abertura, menu por toque/teclado/Escape, adicionar/remover itens, barra de pedido, carrinho e WhatsApp sem sobreposição.
- Conferir visualmente larguras pequenas e grandes, foco, redução de movimento e ausência de deslocamentos perceptíveis.
- Medir antes e depois com Lighthouse quando o ambiente permitir, registrando apenas resultados realmente medidos.
- Não abrir o WhatsApp, não enviar mensagens e não criar pedidos durante os testes.

## Detalhes técnicos
- Áreas principais: `src/routes/index.tsx`, `src/components/SiteChrome.tsx`, `src/components/Cart.tsx`, `src/components/ProductCard.tsx`, `src/components/ProductPrice.tsx`, `src/components/CatalogPhoto.tsx`, `src/components/HeroPhoto.tsx`, `src/styles.css`.
- Sem migrações e sem alterações no fluxo de confirmação do pedido.
