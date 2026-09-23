CREATE TABLE public.produtos_custos (
  slug text PRIMARY KEY REFERENCES public.produtos_estoque(slug) ON DELETE CASCADE,
  custo_centavos integer NOT NULL CHECK (custo_centavos >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produtos_custos TO authenticated;
GRANT ALL ON public.produtos_custos TO service_role;
ALTER TABLE public.produtos_custos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Somente admin gerencia custos" ON public.produtos_custos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER produtos_custos_touch BEFORE UPDATE ON public.produtos_custos FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.pedido_itens ADD COLUMN custo_unitario_centavos integer;
ALTER TABLE public.movimentacoes_estoque ADD COLUMN custo_unitario_centavos integer;
REVOKE SELECT (custo_unitario_centavos) ON public.pedido_itens FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_confirmar_pedido(p_id uuid, p_user_id uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
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
    INSERT INTO public.movimentacoes_estoque(slug, tipo, quantidade, motivo, pedido_id, created_by, custo_unitario_centavos)
      VALUES(item.slug, 'venda', -item.quantidade, 'Venda confirmada', p_id, p_user_id, (SELECT custo_centavos FROM public.produtos_custos WHERE slug = item.slug));
  END LOOP;
  UPDATE public.pedido_itens i SET custo_unitario_centavos = c.custo_centavos FROM public.produtos_custos c WHERE i.pedido_id = p_id AND c.slug = i.slug;
  UPDATE public.pedidos SET status = 'confirmado', confirmado_em = now() WHERE id = p_id;
  PERFORM set_config('app.movimentando_estoque', 'off', true);
END; $function$;

CREATE OR REPLACE FUNCTION public.admin_registrar_movimento(p_slug text, p_quantidade integer, p_tipo text, p_motivo text, p_user_id uuid, p_cliente_id uuid DEFAULT NULL::uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
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
  INSERT INTO public.movimentacoes_estoque (slug, tipo, quantidade, motivo, created_by, preco_unitario_centavos, cliente_id, custo_unitario_centavos)
  VALUES (p_slug, p_tipo::public.movimentacao_tipo, delta, p_motivo, p_user_id,
    CASE WHEN p_tipo = 'venda_extra' THEN produto.preco_centavos ELSE NULL END,
    CASE WHEN p_tipo = 'venda_extra' THEN p_cliente_id ELSE NULL END,
    CASE WHEN p_tipo = 'venda_extra' THEN (SELECT custo_centavos FROM public.produtos_custos WHERE slug = p_slug) ELSE NULL END);
  PERFORM set_config('app.movimentando_estoque', 'off', true);
END; $function$;