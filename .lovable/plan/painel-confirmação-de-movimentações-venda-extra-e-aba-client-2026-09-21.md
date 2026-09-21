# Painel: confirmação de movimentações, venda extra e aba Clientes

## 1. Confirmar antes de movimentar o estoque

Hoje "+ Entrada" e "− Consumo próprio" debitam/creditam na hora. Passa a ter dois passos:

1. Você escolhe a quantidade e clica no botão da movimentação.
2. Aparece uma confirmação na própria linha do produto, com o resumo ("Retirar 3 un. de Suco Relax como consumo próprio — estoque ficará em 2") e os botões **Confirmar** e **Cancelar**.
3. Só depois de confirmar a movimentação é registrada, com aviso de sucesso.

Um campo opcional de observação fica na confirmação (ex.: "brinde para cliente", "nota fiscal 123"), guardado junto da movimentação e visível na aba Movimentações.

## 2. Nova movimentação "Venda extra"

Terceiro botão na linha de cada produto, ao lado de Entrada e Consumo próprio, com a mesma confirmação em dois passos.

- Debita o estoque, como o consumo próprio.
- Conta como venda: entra no ranking "Mais vendidos" e aparece no histórico como "Venda extra (fora do site)".
- Consumo próprio continua fora do ranking.

O ranking passa a somar as vendas do site (pedidos confirmados) com as vendas extras, respeitando o filtro de 7/30/90 dias.

## 3. Aba "Clientes"

Nova aba no painel, ao lado de Estoque/Pedidos/Mais vendidos/Movimentações.

Lista de clientes com busca por nome, telefone, e-mail ou CPF. Cada cliente mostra:

- Nome, telefone, e-mail, CPF e endereço cadastrado.
- Se tem conta no site ou se pediu como visitante.
- Quantidade de pedidos, total já comprado (pedidos confirmados) e data do último pedido.
- Ao abrir o cliente: a lista de pedidos dele com data, status, itens e valor.

Clientes sem conta (pedidos feitos como visitante) também aparecem, agrupados pelo telefone informado no pedido, para você não perder esse histórico.

Ordenação padrão: quem comprou mais recentemente primeiro.

## Detalhes técnicos

- Migração: novo valor `venda_extra` no enum `movimentacao_tipo`.
- `registrarMovimento` passa a aceitar `venda_extra` (delta negativo) e o campo `motivo` opcional vindo do painel.
- `painel` ganha `clientes`: `profiles` + agregação dos `pedidos` (com `pedido_itens`) por `user_id` e, quando nulo, por telefone/nome; e passa a retornar as movimentações `venda_extra` com data para o ranking.
- Ranking em `admin.tsx`: soma `vendas` (pedidos confirmados) + movimentações `venda_extra` dentro da janela de dias.
- Confirmação é estado local em `LinhaProduto` (nenhum diálogo nativo), mantendo o visual atual do painel.
