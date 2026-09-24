# Etapa 1 — Clareza, navegação e facilidade de compra

Somente a Etapa 1. Nada será publicado; identidade visual, banco, preços, estoque e pedidos ficam intocados. Sem testes que enviem WhatsApp ou criem pedidos.

## Problemas confirmados no código
- Home mostra o catálogo inteiro (seção "sabores") com busca, incluindo itens "em breve".
- Botão "Explorar sabores" no topo.
- Seção e link "Blog" apontam para marcas parceiras (não existe blog).
- "Fazer pedido" na página da categoria não leva aos produtos dela.
- Carrinho: "A confirmar após preencher o endereço e os preços", frase "dará baixa no estoque", seletor com os 27 estados.

## 1. Página inicial reorganizada
Ordem: abertura + faixa de entrega -> seleção curta de disponíveis (até 8) -> categorias -> como funciona -> depoimentos -> sobre a marca -> rodapé.
- Título mantido; texto de apoio: refeições congeladas, prontas para aquecer, entrega em Peruíbe, Pedro de Toledo, Ana Dias e Itariri.
- Botão principal "Ver cardápio e preços" -> /catalogo.
- Faixa de entrega logo abaixo: Peruíbe R$ 8,90 (grátis acima de R$ 200), demais cidades R$ 18,90 — valores lidos das regras já existentes, não reescritos.
- Frase: "Você envia a solicitação pelo WhatsApp e a loja confirma o pedido."
- Destaques só com produtos disponíveis e com foto real.
- Categorias mostram "X disponíveis".
- Remover seção e link "Blog" (marcas parceiras podem ficar no rodapé sem esse nome).

## 2. Catálogo completo com busca e filtros
- Em /catalogo: busca por nome, filtro por categoria e alternância "Disponíveis" (padrão) / "Em breve".
- Cartões com peso/volume e contagem de disponíveis por categoria.
- Na página da categoria: disponíveis primeiro; "em breve" agrupados em bloco separado e recolhido ("Ver itens em breve").
- "Fazer pedido" da categoria rola até a lista de produtos da própria categoria.

## 3. Detalhes dos produtos
- Botão "Ver detalhes" abre painel com os dados que já existem no catálogo (descrição, peso, kcal, proteína, selos).
- Campos sem dado não aparecem. Não será indicado "por 100 g/porção" sem confirmação.
- Lista de produtos com informações faltantes entregue como pendência de conteúdo.

## 4. Carrinho
- CEP como primeiro campo do bloco de entrega; ao digitar, mostra cobertura e frete (mesma regra atual).
- Resumo: Subtotal, Entrega, Total; sem CEP: "Informe seu CEP para calcular a entrega".
- Estado: fixado em SP (preenchido pelo CEP), mantendo a validação.
- CPF opcional mantido (usado no cadastro de clientes do painel).
- Texto final: "O WhatsApp abrirá com seu pedido preenchido. Enviar a mensagem é uma solicitação: a loja confirmará disponibilidade e pedido." Montagem da mensagem inalterada.

## 5. Navegação padronizada
Cabeçalho e rodapé iguais: Início, Catálogo, Kit Detox, Como funciona, Sobre, conta e carrinho.

## Testes
Playwright na prévia (desktop e celular): home, catálogo com busca/filtros, detalhes, categoria, carrinho com CEP de Peruíbe, de Itariri e de fora da área, limite do frete grátis — sem clicar em enviar.

## Pendências para você (não bloqueiam)
- Prazo de entrega, horários e formas de pagamento (não serão exibidos até confirmar).
- Base dos valores nutricionais (porção ou 100 g), ingredientes, alergênicos, validade e preparo.
- Manter ou não o bloco de marcas parceiras.

## Detalhes técnicos
- Arquivos: src/routes/index.tsx, catalogo.index.tsx, catalogo.$linha.tsx, carrinho.tsx, components/DeliveryForm.tsx, SiteChrome.tsx; novo componente ProductDetails (Dialog).
- Textos de frete derivados de src/lib/delivery.ts (exportar constantes da regra existente).
- Disponibilidade via emBreveDe/useEstoque existentes. Sem migrações.
