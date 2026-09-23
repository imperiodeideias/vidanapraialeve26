import assert from 'node:assert/strict';
import {test} from 'node:test';
import {resumirVendas, type VendaItem} from './admin-sales.ts';
const base={data:'2026-09-22T15:00:00Z',slug:'a',nome:'Prato',quantidade:2,precoCentavos:2390,vendaId:'pedido',origem:'site' as const};
test('counts orders once and extras separately; sums historical prices',()=>{
 const rows:VendaItem[]=[base,{...base,slug:'b',quantidade:1,precoCentavos:1890},{...base,vendaId:'extra',origem:'extra',quantidade:1,precoCentavos:2000}];
 const r=resumirVendas(rows,[{...base,quantidade:3}],'2026-09-22','2026-09-22');
 assert.equal(r.totalVendas,2);assert.equal(r.valor,8670);assert.equal(r.unidades,4);assert.equal(r.consumidos[0].quantidade,3);assert.equal(r.maisVendidos[0].quantidade,3);
});
test('unpriced extras are not valued at current prices or counted as own consumption',()=>{
 const r=resumirVendas([{...base,origem:'extra',precoCentavos:null}],[],'2026-09-22','2026-09-22');
 assert.equal(r.valor,0);assert.equal(r.unidadesSemPreco,2);assert.equal(r.totalVendas,1);assert.deepEqual(r.consumidos,[]);
});
test('date boundaries use Brazil time, including final day and zero-sale dates',()=>{
 const r=resumirVendas([{...base,data:'2026-09-22T02:59:59Z'},{...base,data:'2026-09-23T02:59:59Z',vendaId:'last'}],[],'2026-09-22','2026-09-23');
 assert.equal(r.totalVendas,1);assert.equal(r.dias.length,2);assert.equal(r.dias[0].unidades,2);assert.equal(r.dias[1].unidades,0);
});
test('empty period returns zero totals',()=>{ const r=resumirVendas([],[],'2026-09-22','2026-09-22');assert.equal(r.totalVendas,0);assert.equal(r.valor,0);assert.deepEqual(r.maisVendidos,[]); });
test('profit uses recorded cost and flags missing cost',()=>{
 const r=resumirVendas([{...base,custoCentavos:1390},{...base,vendaId:'x',slug:'b',quantidade:1}],[],'2026-09-22','2026-09-22');
 assert.equal(r.lucro,(2390-1390)*2);assert.equal(r.unidadesSemCusto,1);assert.equal(r.dias[0].lucro,2000);
});
