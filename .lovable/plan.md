# Painel administrativo, estoque e contas de cliente

Objetivo: criar uma área administrativa protegida por login para controlar estoque, preços e pedidos, e um cadastro opcional para os clientes repetirem pedidos.

## Ativar o backend

O site hoje é só front-end (catálogo em arquivo, carrinho no navegador). Para login, estoque e pedidos é preciso ativar o Lovable Cloud (banco de dados + contas de acesso).

Sua conta de administrador será `lucas@imperiodeideias.com.br` com a senha que você indicou. Observação de segurança: a senha não fica escrita no código — ela é gravada no sistema de contas. Recomendo trocá-la depois do primeiro acesso.

## Painel administrativo (`/admin`)

Acesso só com e-mail e senha de administrador. Clientes comuns não entram.

- **Estoque**: lista de todos os produtos com quantidade atual, preço e ordem mínima. Dá para editar quantidade e preço direto na lista, e lançar entradas (reposição).
- **Alertas**: destaque no topo com produtos esgotados e com estoque baixo (menos de 2 unidades).
- **Mais vendidos**: ranking por quantidade vendida, com filtro de período (7/30/90 dias). Consumo próprio não entra nesse ranking.
- **Pedidos**: cada pedido enviado pelo WhatsApp entra como "pendente". Você confirma (baixa o estoque) ou cancela. Também mostra nome, CPF, endereço, itens e total.
- **Consumo próprio**: botão para dar baixa em um produto informando quantidade e motivo. Reduz estoque e fica registrado como movimentação interna, fora das vendas.
- **Histórico de movimentações**: entrada, venda, consumo próprio e ajuste manual, com data e quem fez.

## Loja (lado do cliente)

- **Preços passam a vir do painel** e aparecem no catálogo, nos cards e no carrinho. Produto sem preço cadastrado continua "sob consulta".
- **Estoque zerado bloqueia**: produto esgotado não pode ser adicionado ao carrinho (fica marcado como "Esgotado"); quantidade no carrinho é limitada ao disponível.
- **Cadastro rápido opcional**: nome, e-mail, senha, CPF, telefone e endereço (os mesmos campos do formulário de entrega + CPF). Quem entra na conta tem o formulário de entrega preenchido automaticamente.
- **Meus pedidos**: página com os pedidos anteriores e botão "Pedir novamente", que recria o carrinho com os mesmos itens.
- Quem não quiser conta continua pedindo normalmente pelo WhatsApp, como hoje.

## Detalhes técnicos

- Tabelas: `profiles` (dados do cliente + CPF), `user_roles` (papel admin, tabela separada por segurança), `produtos_estoque` (slug, quantidade, preço em centavos, ativo), `pedidos` + `pedido_itens` (status pendente/confirmado/cancelado, snapshot de preços), `movimentacoes_estoque` (tipo: entrada, venda, consumo_proprio, ajuste).
- RLS em todas as tabelas: cliente lê/edita só o próprio perfil e pedidos; estoque e preços são leitura pública apenas para os campos necessários; escrita restrita a admin via função `has_role`.
- Catálogo continua em `src/data/catalogo.ts` como fonte de nomes, fotos e descrições; o banco guarda apenas estoque/preço por slug, sincronizados na primeira carga do painel.
- Server functions em `src/lib/*.functions.ts` para criar pedido, confirmar pedido, ajustar estoque e lançar consumo próprio; baixa de estoque feita de forma atômica no servidor.
- Rotas protegidas sob `src/routes/_authenticated/`, com verificação de papel admin nas telas e nas funções de servidor.
- Carrinho atual (localStorage) é mantido; passa a validar disponibilidade contra o estoque.

## Ordem de execução

1. Ativar Lovable Cloud e criar tabelas, políticas e a conta de administrador.
2. Login/cadastro e página de conta do cliente.
3. Painel: estoque, alertas, consumo próprio e movimentações.
4. Pedidos: registro no envio pelo WhatsApp, confirmação e baixa.
5. Loja: preços reais, bloqueio de esgotados, "pedir novamente".
6. Ranking de mais vendidos e conferência final de tudo.
