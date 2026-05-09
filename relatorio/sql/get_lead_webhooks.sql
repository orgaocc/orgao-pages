-- =============================================================================
-- FUNCTION: public.get_lead_webhooks(lead_email text)
-- =============================================================================
-- Devolve todas as submissões de uma tentante (filtro por email no payload),
-- agregadas em uma única lista. Roda como SECURITY DEFINER para conseguir ler
-- a cpl_inlead_hooks (que está bloqueada por RLS para anon).
--
-- Como o ID do campo de email muda por form, fazemos a busca varrendo TODOS
-- os pares chave/valor do payload procurando um valor com formato de email.
--
-- Para colar inteiro no SQL Editor do Supabase Cloud.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_lead_webhooks(lead_email text)
RETURNS TABLE (
  id          uuid,
  payload     jsonb,
  headers     jsonb,
  created_at  timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    h.id,
    h.payload,
    h.headers,
    h.created_at
  FROM public.cpl_inlead_hooks h
  WHERE
    h.payload != '{}'::jsonb
    AND EXISTS (
      SELECT 1
      FROM jsonb_each_text(h.payload) AS kv(k, v)
      WHERE lower(v) = lower(lead_email)
    )
  ORDER BY h.created_at ASC;
$$;

-- Permite que a anon role (a chave usada no front) chame essa função
GRANT EXECUTE ON FUNCTION public.get_lead_webhooks(text) TO anon;

-- =============================================================================
-- TESTE
-- =============================================================================
-- SELECT count(*) AS total, min(created_at) AS primeira, max(created_at) AS ultima
-- FROM public.get_lead_webhooks('clauzinhasantos5@gmail.com');
-- =============================================================================
