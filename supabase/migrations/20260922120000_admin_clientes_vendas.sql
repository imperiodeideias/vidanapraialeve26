-- Additive migration: preserve stock, orders and historical movements.
CREATE TABLE IF NOT EXISTS public.clientes_manuais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL CHECK (char_length(nome) BETWEEN 2 AND 120),
  telefone text NOT NULL, email text, cpf text, endereco text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS clientes_manuais_telefone_idx ON public.clientes_manuais (telefone);
ALTER TABLE public.clientes_manuais ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.clientes_manuais TO authenticated;
GRANT ALL ON public.clientes_manuais TO service_role;
DROP POLICY IF EXISTS "Admin consulta clientes manuais" ON public.clientes_manuais;
CREATE POLICY "Admin consulta clientes manuais" ON public.clientes_manuais FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
ALTER TABLE public.movimentacoes_estoque
  ADD COLUMN IF NOT EXISTS preco_unitario_centavos integer CHECK (preco_unitario_centavos >= 0),
  ADD COLUMN IF NOT EXISTS cliente_id uuid REFERENCES public.clientes_manuais(id) ON DELETE SET NULL;

-- Only the movement and order transactions below may change a balance.
CREATE OR REPLACE FUNCTION public.proteger_saldo_estoque() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.quantidade IS DISTINCT FROM OLD.quantidade AND current_setting('app.movimentando_estoque', true) IS DISTINCT FROM 'on' THEN
    RAISE EXCEPTION 'Altere a quantidade pelos botões de entrada, consumo próprio ou venda extra.';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS proteger_saldo_estoque ON public.produtos_estoque;
CREATE TRIGGER proteger_saldo_estoque BEFORE UPDATE ON public.produtos_estoque FOR EACH ROW EXECUTE FUNCTION public.proteger_saldo_estoque();

CREATE OR REPLACE FUNCTION public.admin_registrar_movimento(p_slug text, p_quantidade integer, p_tipo text, p_motivo text, p_user_id uuid, p_cliente_id uuid DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE produto public.produtos_estoque; delta integer;
BEGIN
  IF NOT public.has_role(p_user_id, 'admin') THEN RAISE EXCEPTION 'Acesso restrito.'; END IF;
  IF p_tipo IS NULL OR p_quantidade IS NULL OR p_tipo NOT IN ('entrada', 'consumo_proprio', 'venda_extra') OR p_quantidade NOT BETWEEN 1 AND 9999 THEN RAISE EXCEPTION 'Movimentação inválida.'; END IF;
  SELECT * INTO produto FROM public.produtos_estoque WHERE slug = p_slug FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Produto não encontrado.'; END IF;
  IF p_tipo = 'venda_extra' AND produto.preco_centavos IS NULL THEN RAISE EXCEPTION 'Defina o preço do produto antes de registrar a venda extra.'; END IF;
  delta := CASE WHEN p_tipo = 'entrada' THEN p_quantidade ELSE -p_quantidade END;
  IF produto.quantidade + delta < 0 THEN RAISE EXCEPTION 'Estoque insuficiente.'; END IF;
  PERFORM set_config('app.movimentando_estoque', 'on', true);
  UPDATE public.produtos_estoque SET quantidade = quantidade + delta, controlar_estoque = true WHERE slug = p_slug;
  INSERT INTO public.movimentacoes_estoque (slug, tipo, quantidade, motivo, created_by, preco_unitario_centavos, cliente_id)
  VALUES (p_slug, p_tipo::public.movimentacao_tipo, delta, p_motivo, p_user_id, CASE WHEN p_tipo = 'venda_extra' THEN produto.preco_centavos ELSE NULL END, CASE WHEN p_tipo = 'venda_extra' THEN p_cliente_id ELSE NULL END);
  PERFORM set_config('app.movimentando_estoque', 'off', true);
END; $$;

CREATE OR REPLACE FUNCTION public.admin_confirmar_pedido(p_id uuid, p_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE pedido public.pedidos; item record; saldo integer;
BEGIN
  IF NOT public.has_role(p_user_id, 'admin') THEN RAISE EXCEPTION 'Acesso restrito.'; END IF;
  SELECT * INTO pedido FROM public.pedidos WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR pedido.status <> 'pendente' THEN RAISE EXCEPTION 'Pedido não encontrado ou já tratado.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.pedido_itens WHERE pedido_id = p_id) THEN RAISE EXCEPTION 'Pedido sem itens.'; END IF;
  PERFORM set_config('app.movimentando_estoque', 'on', true);
  FOR item IN SELECT slug, sum(quantidade)::integer AS quantidade FROM public.pedido_itens WHERE pedido_id = p_id GROUP BY slug ORDER BY slug LOOP
    SELECT quantidade INTO saldo FROM public.produtos_estoque WHERE slug = item.slug FOR UPDATE;
    IF NOT FOUND OR item.quantidade < 1 OR saldo < item.quantidade THEN RAISE EXCEPTION 'Estoque insuficiente para %.', item.slug; END IF;
    UPDATE public.produtos_estoque SET quantidade = quantidade - item.quantidade, controlar_estoque = true WHERE slug = item.slug;
    INSERT INTO public.movimentacoes_estoque(slug, tipo, quantidade, motivo, pedido_id, created_by) VALUES(item.slug, 'venda', -item.quantidade, 'Venda confirmada', p_id, p_user_id);
  END LOOP;
  UPDATE public.pedidos SET status = 'confirmado', confirmado_em = now() WHERE id = p_id;
  PERFORM set_config('app.movimentando_estoque', 'off', true);
END; $$;
REVOKE ALL ON FUNCTION public.admin_registrar_movimento(text, integer, text, text, uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_confirmar_pedido(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_registrar_movimento(text, integer, text, text, uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_confirmar_pedido(uuid, uuid) TO service_role;
