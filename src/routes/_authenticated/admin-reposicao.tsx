import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import { AdminStock } from "@/components/AdminStock";
import { painel } from "@/lib/admin.functions";
export const Route = createFileRoute("/_authenticated/admin-reposicao")({
  head:()=>({meta:[{title:"Produtos para reposição — Vida na Praia Leve"},{name:"robots",content:"noindex"}]}),
  component: Reposicao,
});
function Reposicao() {
  const buscar=useServerFn(painel);
  const cache=useQueryClient();
  const [aviso,setAviso]=useState("");
  const {data,isLoading,error}=useQuery({queryKey:["painel"],queryFn:()=>buscar()});
  const produtos=(data?.estoque ?? []).filter(p=>p.ativo && p.controlar_estoque && p.quantidade<=p.estoque_minimo);
  return <SiteChrome><section className="container-x pt-32 pb-24">
    <Link to="/admin" className="underline">← Voltar ao painel</Link>
    <h1 className="text-3xl sm:text-4xl mt-6 mb-4">Produtos para reposição</h1>
    <p className="mb-8">Produtos ativos com saldo igual ou inferior ao mínimo configurado.</p>
    {aviso && <p role="status" className="mb-5">{aviso}</p>}
    {isLoading?<p>Carregando…</p>:error?<p role="alert">{error.message}</p>:<>
      <p className="mb-6">{produtos.length} produto(s) para reposição.</p>
      {!produtos.length && <p>Nenhum produto precisa de reposição no momento.</p>}
      <AdminStock produtos={produtos} custos={data?.custos ?? {}} clientes={data?.clientesManuais ?? []} onDone={msg=>{setAviso(msg);cache.invalidateQueries({queryKey:["painel"]});cache.invalidateQueries({queryKey:["vendas"]});}}/>
    </>}
  </section></SiteChrome>;
}
