// Receiver for authenticated order alerts; destination is fixed server-side.
function receberAlertaPedido_(data) {
  const key = PropertiesService.getScriptProperties().getProperty("ORDER_ALERT_TOKEN");
  if (!key || typeof data.token !== "string" || data.token !== key) return json_({ok:false});
  const p = data.pedido;
  if (!p || !/^[0-9a-f-]{36}$/.test(p.id) || !Array.isArray(p.itens) || !p.itens.length || p.itens.length > 60) return json_({ok:false});
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return json_({ok:false});
  try {
    const book = SpreadsheetApp.openById(NEWSLETTER.spreadsheetId);
    const sheet = book.getSheetByName("Avisos de pedidos") || book.insertSheet("Avisos de pedidos");
    if (!sheet.getLastRow()) {
      sheet.appendRow(["Pedido", "Situação do aviso", "Data do aviso"]);
      sheet.setFrozenRows(1);
      sheet.getRange(1,1,1,3).setBackground("#1F5D63").setFontColor("#ffffff").setFontWeight("bold");
      sheet.setColumnWidth(1,310); sheet.setColumnWidth(2,190); sheet.setColumnWidth(3,180);
      sheet.getRange("C2:C").setNumberFormat("dd/MM/yyyy HH:mm:ss");
    }
    const rows = sheet.getLastRow()>1 ? sheet.getRange(2,1,sheet.getLastRow()-1,3).getValues() : [];
    const found = rows.findIndex(r=>String(r[0])===p.id);
    if (found>=0 && rows[found][1]==="Enviado") return json_({ok:true,duplicate:true});
    // An interrupted send is ambiguous: do not risk sending a duplicate automatically.
    if (found>=0 && rows[found][1]==="Enviando") return json_({ok:false,message:"Envio em conferência"});
    if (MailApp.getRemainingDailyQuota()<1) return json_({ok:false,message:"Cota diária atingida"});
    const row = found>=0 ? found+2 : sheet.getLastRow()+1;
    sheet.getRange(row,1,1,3).setValues([[p.id,"Enviando",new Date()]]);
    SpreadsheetApp.flush();
    const moeda = v=>v===null || v===undefined ? "sob consulta" : "R$ "+(Number(v)/100).toFixed(2).replace(".",",");
    const itens = p.itens.map(i=>`${i.quantidade} × ${i.nome}\n  Unitário: ${moeda(i.preco_centavos)} | Subtotal: ${moeda(i.preco_centavos==null?null:i.quantidade*i.preco_centavos)}`).join("\n\n");
    const semPreco = p.itens.some(i=>i.preco_centavos==null);
    const titulo = p.teste ? "TESTE — Alerta de novo pedido" : "Novo pedido #"+p.id.slice(0,8);
    const body = `${p.teste ? "Este é um teste da integração. Nenhum pedido real foi criado.\n\n" : "Novo pedido registrado no site. Aguardando confirmação da loja.\n\n"}Pedido: ${p.id}\nCliente: ${p.cliente_nome}\nTelefone: ${p.cliente_telefone||"Não informado"}\nE-mail: ${p.cliente_email||"Não informado"}\nEndereço: ${p.endereco}\n\nITENS\n${itens}\n\nProdutos${semPreco?" (parcial)":""}: ${moeda(p.total_centavos)}\nFrete: ${moeda(p.frete_centavos)}\nTotal${semPreco?" (parcial; há itens sob consulta)":""}: ${moeda(Number(p.total_centavos)+Number(p.frete_centavos))}\n${p.observacao?"\nObservações: "+p.observacao+"\n":""}\nAbrir painel: https://vidanapraialeve.com.br/admin`;
    try {
      MailApp.sendEmail({to:"lucas@imperiodeideias.com.br",subject:titulo+" — Vida na Praia Leve",body,name:"Vida na Praia Leve"});
    } catch (error) {
      sheet.getRange(row,2).setValue("Pendente");
      return json_({ok:false,message:"Falha temporária no envio"});
    }
    sheet.getRange(row,2,1,2).setValues([["Enviado",new Date()]]);
    SpreadsheetApp.flush();
    return json_({ok:true});
  } finally {lock.releaseLock();}
}
