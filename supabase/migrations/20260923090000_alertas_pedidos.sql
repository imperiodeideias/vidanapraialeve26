-- Durable queue: only completed item inserts enqueue new orders. No historical backfill.
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE SCHEMA IF NOT EXISTS internal_alertas;
REVOKE ALL ON SCHEMA internal_alertas FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS internal_alertas.config (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  endpoint text NOT NULL, token text NOT NULL, ativo boolean NOT NULL DEFAULT false
);
CREATE TABLE IF NOT EXISTS internal_alertas.fila (
  pedido_id uuid PRIMARY KEY REFERENCES public.pedidos(id) ON DELETE CASCADE,
  criado_em timestamptz NOT NULL DEFAULT now(), enviado_em timestamptz,
  tentativas integer NOT NULL DEFAULT 0, request_id bigint,
  solicitado_em timestamptz, proxima_tentativa timestamptz NOT NULL DEFAULT now(),
  ultimo_erro text
);
REVOKE ALL ON ALL TABLES IN SCHEMA internal_alertas FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION internal_alertas.enfileirar() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,internal_alertas AS $$
BEGIN
  INSERT INTO internal_alertas.fila(pedido_id) SELECT DISTINCT pedido_id FROM novos_itens ON CONFLICT DO NOTHING;
  RETURN NULL;
END; $$;
DROP TRIGGER IF EXISTS enfileirar_alerta_pedido ON public.pedido_itens;
CREATE TRIGGER enfileirar_alerta_pedido AFTER INSERT ON public.pedido_itens
REFERENCING NEW TABLE AS novos_itens FOR EACH STATEMENT EXECUTE FUNCTION internal_alertas.enfileirar();

CREATE OR REPLACE FUNCTION internal_alertas.processar() RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,internal_alertas AS $$
DECLARE cfg internal_alertas.config; job internal_alertas.fila; resp record; payload jsonb; rid bigint; sucesso boolean;
BEGIN
  IF NOT pg_try_advisory_xact_lock(23092026,901) THEN RETURN; END IF;
  SELECT * INTO cfg FROM internal_alertas.config WHERE id AND ativo;
  IF NOT FOUND THEN RETURN; END IF;
  FOR job IN SELECT * FROM internal_alertas.fila WHERE enviado_em IS NULL AND proxima_tentativa<=now() ORDER BY criado_em LIMIT 20 FOR UPDATE SKIP LOCKED LOOP
    IF job.request_id IS NOT NULL THEN
      SELECT status_code,content,error_msg INTO resp FROM net._http_response WHERE id=job.request_id;
      IF NOT FOUND AND job.solicitado_em>now()-interval '3 minutes' THEN CONTINUE; END IF;
      sucesso:=false;
      IF FOUND AND resp.status_code=200 THEN
        BEGIN sucesso:=coalesce((resp.content::jsonb->>'ok')::boolean,false); EXCEPTION WHEN OTHERS THEN sucesso:=false; END;
      END IF;
      IF sucesso THEN
        UPDATE internal_alertas.fila SET enviado_em=now(),ultimo_erro=NULL WHERE pedido_id=job.pedido_id;
        CONTINUE;
      END IF;
      UPDATE internal_alertas.fila SET request_id=NULL,ultimo_erro='Envio não confirmado; nova tentativa automática',proxima_tentativa=now()+least(60,power(2,least(job.tentativas,6))::integer)*interval '1 minute' WHERE pedido_id=job.pedido_id;
      CONTINUE;
    END IF;
    SELECT jsonb_build_object('id',p.id,'cliente_nome',p.cliente_nome,'cliente_telefone',p.cliente_telefone,'cliente_email',p.cliente_email,'endereco',p.endereco,'observacao',p.observacao,'total_centavos',p.total_centavos,'frete_centavos',p.frete_centavos,'itens',(SELECT jsonb_agg(jsonb_build_object('nome',i.nome,'quantidade',i.quantidade,'preco_centavos',i.preco_centavos) ORDER BY i.id) FROM public.pedido_itens i WHERE i.pedido_id=p.id)) INTO payload FROM public.pedidos p WHERE p.id=job.pedido_id;
    IF payload IS NULL OR payload->'itens'='null'::jsonb THEN CONTINUE; END IF;
    BEGIN
      SELECT net.http_post(url:=cfg.endpoint,body:=jsonb_build_object('kind','order_alert','token',cfg.token,'pedido',payload),timeout_milliseconds:=20000) INTO rid;
      UPDATE internal_alertas.fila SET request_id=rid,solicitado_em=now(),tentativas=tentativas+1,proxima_tentativa=now()+interval '1 minute' WHERE pedido_id=job.pedido_id;
    EXCEPTION WHEN OTHERS THEN
      UPDATE internal_alertas.fila SET ultimo_erro='Serviço de envio temporariamente indisponível',proxima_tentativa=now()+interval '5 minutes' WHERE pedido_id=job.pedido_id;
    END;
  END LOOP;
END; $$;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA internal_alertas FROM PUBLIC,anon,authenticated;
SELECT cron.schedule('alertas-novos-pedidos','* * * * *','SELECT internal_alertas.processar();');
