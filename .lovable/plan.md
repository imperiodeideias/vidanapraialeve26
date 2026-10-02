# Pedido concluído: carrinho zerado + resumo do pedido

## Objetivo
Quando a pessoa confirmar que enviou o pedido pelo WhatsApp, o carrinho será esvaziado automaticamente e a página mostrará um resumo completo do que foi pedido.

## O que muda

### 1. Limpar o carrinho
- Adicionar uma função `clear()` no carrinho (em `src/components/Cart.tsx`) que zera as quantidades e apaga o pedido salvo no navegador.

### 2. Guardar o resumo antes de limpar
- Na página do carrinho (`src/routes/carrinho.tsx`), no momento do envio, guardar em memória: itens (nome, quantidade, preço unitário e subtotal de cada um), subtotal, valor da entrega, total, nome e endereço do cliente.

### 3. Tela de confirmação com resumo
- Quando a pessoa tocar em "Já enviei no WhatsApp" na janela de confirmação:
  - a janela fecha;
  - o carrinho é zerado (a barra inferior e o contador do ícone somem);
  - a página do carrinho passa a mostrar a tela "Pedido enviado com sucesso!" com:
    - lista dos itens pedidos (quantidade, nome, valor de cada um);
    - subtotal, entrega (com cidade) e total;
    - nome e endereço de entrega informados;
    - aviso de que a loja confirmará a disponibilidade pelo WhatsApp;
    - botão "Voltar ao catálogo".
- Se a pessoa recarregar a página depois, o carrinho aparece vazio normalmente (o resumo não fica salvo).

## Detalhes técnicos
- `src/components/Cart.tsx`: nova função `clear()` no contexto do carrinho.
- `src/components/DeliveryForm.tsx`: nova propriedade `onSent`, chamada ao confirmar o envio.
- `src/routes/carrinho.tsx`: estado com o resumo do pedido enviado; renderização condicional da tela de confirmação.
- Nada muda no registro do pedido no painel, nas regras de frete ou no envio pelo WhatsApp.

## Validação
- Testar no navegador (celular e desktop): montar pedido, enviar, confirmar "Já enviei" e conferir que o carrinho zera, o resumo aparece correto e os valores batem — sem abrir o WhatsApp de verdade nem criar pedidos reais de teste no painel.
