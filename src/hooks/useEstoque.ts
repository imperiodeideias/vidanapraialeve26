import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EstoqueItem, EstoqueMap } from "@/lib/estoque";

export function useEstoque() {
  const query = useQuery({
    queryKey: ["estoque-publico"],
    staleTime: 30_000,
    queryFn: async (): Promise<EstoqueMap> => {
      const { data, error } = await supabase
        .from("produtos_estoque")
        .select("slug, nome, quantidade, preco_centavos, estoque_minimo, ativo, controlar_estoque");
      if (error) throw error;
      const map: EstoqueMap = {};
      for (const item of (data || []) as EstoqueItem[]) map[item.slug] = item;
      return map;
    },
  });
  return { estoque: query.data, carregando: query.isLoading };
}
