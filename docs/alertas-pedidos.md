# Alertas de novos pedidos

Destinatário fixo: lucas@imperiodeideias.com.br.

O banco enfileira cada pedido depois da inserção dos itens. Um trabalho pg_cron processa a fila a cada minuto, e pg_net envia o aviso à integração Google existente. Não depende do cliente concluir o envio no WhatsApp nem de manter o site aberto. Não envia retroativamente os pedidos anteriores à ativação.

O receptor Apps Script usa MailApp, mantém os cadastros da newsletter e registra apenas identificador, situação e data do aviso na aba “Avisos de pedidos”. Os dados do pedido seguem no e-mail, sem CPF. O destinatário e o link do painel são fixos; o remetente é a conta Google proprietária da integração.

## Configuração privada

- Aplique a migração `20260923090000_alertas_pedidos.sql`.
- Instale `scripts/order-alerts.gs` no projeto Apps Script existente. No `doPost`, permita corpos de até 100000 caracteres e encaminhe `data.kind === "order_alert"` a `receberAlertaPedido_(data)` antes da validação da newsletter. Preserve o limite original de 2048 caracteres para os demais cadastros.
- Guarde o mesmo segredo aleatório em `ORDER_ALERT_TOKEN`, nas propriedades privadas do Apps Script, e em `internal_alertas.config.token`. Nunca publique esse valor no código ou no navegador do cliente.
- Configure o endpoint da implantação existente em `internal_alertas.config.endpoint`. Ative `ativo` somente após o teste do receptor. A implantação deve usar a conta proprietária já autorizada para a newsletter.

## Acompanhamento

A tabela privada `internal_alertas.fila` registra tentativas, confirmação do envio e último erro. Falhas temporárias têm novas tentativas, com intervalo progressivo limitado a uma hora. Ausência de confirmação não apaga o pedido. A fila aguarda resposta por até três minutos antes de tentar novamente.

Uma confirmação HTTP com `ok:true` significa que MailApp aceitou o envio; não comprova recebimento na caixa de entrada. Um identificador já marcado como “Enviado” é reconhecido sem reenviar. Se uma execução for interrompida durante o envio, fica “Enviando”: confira a caixa de entrada antes de marcar manualmente como “Enviado” ou “Pendente”, evitando duplicação em resultados ambíguos.

Para pausar os avisos, um administrador do banco pode definir `internal_alertas.config.ativo=false`. Os pedidos continuam sendo registrados e enfileirados. As configurações e a fila não são acessíveis pelas funções públicas do site.
