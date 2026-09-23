REVOKE SELECT ON public.pedido_itens FROM authenticated, anon;
GRANT SELECT (id, pedido_id, slug, nome, quantidade, preco_centavos, created_at) ON public.pedido_itens TO authenticated;