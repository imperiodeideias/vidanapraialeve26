import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { cadastrarClienteManual } from "@/lib/admin.functions";
export type ClienteManual = { id: string; nome: string; telefone: string; email: string | null; cpf: string | null; endereco: string | null };
export function ManualCustomers({ clientes, busca, onDone }: { clientes: ClienteManual[]; busca: string; onDone: (msg:string)=>void }) {
  const [aberto, setAberto] = useState(false);
  const vazio = { nome: "", telefone: "", email: "", cpf: "", endereco: "" };
  const [form,setForm] = useState(vazio);
  const cadastrar = useServerFn(cadastrarClienteManual);
  const mutation = useMutation({ mutationFn: () => cadastrar({ data: form }), onSuccess: () => { setForm(vazio); setAberto(false); onDone("Cliente cadastrado. Já pode ser selecionado nas vendas extras."); } });
  const encontrados = clientes.filter(c => [c.nome,c.telefone,c.email,c.cpf].some(v => v?.toLowerCase().includes(busca.trim().toLowerCase())));
  return <div className="mb-6">
    <button type="button" className="btn-primary mb-4" onClick={()=>{setAberto(!aberto);mutation.reset();}}>{aberto ? "Fechar cadastro" : "+ Cadastrar cliente"}</button>
    {aberto && <form className="rounded-2xl border bg-card p-5 mb-6 grid gap-4 sm:grid-cols-2" onSubmit={e=>{e.preventDefault();mutation.mutate();}}>
      <h2 className="text-xl sm:col-span-2">Cadastro manual de cliente</h2>
      <p className="text-sm sm:col-span-2">Para vendas realizadas fora do site. Este cadastro não cria senha nem acesso à loja.</p>
      {([['nome','Nome',true],['telefone','Telefone com DDD',true],['email','E-mail',false],['cpf','CPF (opcional)',false],['endereco','Endereço (opcional)',false]] as const).map(([key,label,required])=><label key={key} className={key==='endereco'?'sm:col-span-2 text-sm':'text-sm'}>{label}<input required={required} type={key==='email'?'email':key==='telefone'?'tel':'text'} minLength={key==='nome'?2:undefined} maxLength={key==='endereco'?500:key==='cpf'?14:key==='telefone'?20:120} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} className="block mt-1 w-full border rounded-xl bg-white p-3" /></label>)}
      {mutation.error && <p role="alert" className="text-red-700 sm:col-span-2">{mutation.error.message}</p>}
      <button type="submit" disabled={mutation.isPending} className="btn-primary disabled:opacity-50">{mutation.isPending?'Salvando…':'Salvar cliente'}</button>
    </form>}
    <h2 className="text-xl mb-4">Clientes cadastrados manualmente</h2>
    {!encontrados.length && <p className="text-sm mb-4">Nenhum cadastro manual encontrado.</p>}
    <div className="space-y-3 mb-6">{encontrados.map(c=><article key={c.id} className="border rounded-2xl bg-card p-5"><h3 className="font-semibold">{c.nome} <span className="text-xs font-normal">· Cadastro manual</span></h3><p className="text-sm mt-2">{[c.telefone,c.email].filter(Boolean).join(' — ')}</p>{c.endereco && <p className="text-sm mt-1">{c.endereco}</p>}</article>)}</div>
    <h2 className="text-xl mb-4">Clientes e visitantes do site</h2>
  </div>;
}
