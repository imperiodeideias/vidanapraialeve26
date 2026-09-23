# Lucro no painel (custos só para o admin)

## O que você vai ver
- **Vendas**: ao lado de "Valor total de vendas", um novo card **"Lucro total"** (valor vendido menos o custo dos itens vendidos no período). O gráfico diário ganha uma barra de lucro.
- **Estoque**: em cada produto, ao lado do preço de venda, o **custo** (editável) e a **margem** (R$ e %).
- **Mais vendidos**: lucro de cada produto no período.
- Produto sem preço ou sem custo aparece como "lucro parcial" com um aviso, igual ao aviso atual de itens sem preço.
- Nada disso aparece para clientes: o custo fica guardado em um lugar que só a conta de administrador consegue ler.

## Carga dos custos
- Vou lançar os 69 custos que você enviou, ligando cada nome ao produto do catálogo.
- Casos que conferirei com você se não baterem com o catálogo: "Bolo de carne", "Salmão ao Molho Maracujá", "Pizza marguerita", "Tilápia assada" e "Sabor Sertanejo".

## Como o lucro é calculado
- Lucro = preço vendido − custo, por unidade, sem frete.
- O custo fica registrado no momento da venda, então se você mudar um custo depois, o lucro das vendas antigas não muda.
- Vendas já confirmadas antes desta mudança usam o custo atual.
- Consumo próprio não entra no lucro.

## Detalhes técnicos
- Nova tabela `produtos_custos` (slug, custo_centavos), com RLS e acesso somente para admin (`has_role`), sem acesso para anon. `produtos_estoque` continua pública e sem custo.
- Nova coluna `custo_unitario_centavos` em `pedido_itens` e `movimentacoes_estoque`, preenchida em `admin_confirmar_pedido` e `admin_registrar_movimento` (venda_extra).
- `painel` passa a retornar os custos; `salvarProduto` aceita o custo; `relatorioVendas` e `resumirVendas` calculam lucro total, lucro por dia e por produto (com teste atualizado).
- Interface: `AdminStock` (campo de custo + margem) e `AdminSales` (card, barra e ranking). Nada muda em `loja.functions`, `useEstoque` nem nas páginas públicas.
