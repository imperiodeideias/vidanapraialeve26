import assert from 'node:assert/strict';
import { test } from 'node:test';
import { servesRegion, deliveryFee } from './delivery.ts';
import { orderSummary } from './order.ts';
test('delivery allows only supported SP localities, including postal district spelling', () => {
  for (const city of ['Peruíbe', ' peruibe ', 'Pedro de Toledo', 'Ana Dias', 'Itariri', 'Ana Dias (Itariri)']) assert.equal(servesRegion({city,state:'SP'}),true,city);
  for (const region of [{city:'Santos',state:'SP'},{city:'Peruíbe',state:'RJ'},{city:'Peruibe Centro',state:'SP'},{city:'',state:''}]) assert.equal(servesRegion(region),false);
});
test('regional freight stays at 18.90 above 200; only Peruibe gets free delivery', () => {
  for(const city of ['Pedro de Toledo','Ana Dias','Itariri']) for(const total of [19999,20000,20001,40000]) assert.equal(deliveryFee(total,{city,state:'SP'}),1890);
  assert.equal(deliveryFee(20000,{city:'Peruíbe',state:'SP'}),890);
  assert.equal(deliveryFee(20001,{city:'Peruíbe',state:'SP'}),0);
  assert.equal(deliveryFee(20001,{city:'Santos',state:'SP'}),null);
});
test('WhatsApp uses customer city, freight and final total once', () => {
 const result=orderSummary([{slug:'a',nome:'Prato',emBreve:false,precoCentavos:2090}],{a:2},{name:'Teste',address:'Endereço de teste',region:{city:'Itariri',state:'SP'}});
 assert.equal(result.shipping,1890); assert.equal(result.grandTotal,6070);
 const text=decodeURIComponent(result.url); assert.match(text,/Frete \(Itariri-SP\): R\$.*18,90/); assert.match(text,/60,70/); assert.equal(text.includes('Peruíbe'),false);
});
