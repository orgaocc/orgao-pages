-- =============================================================================
-- FUNCTION: public.get_lead_webhooks(lead_email text)
-- =============================================================================
-- Devolve todas as submissões de uma tentante (filtro por email no payload),
-- agregadas em uma única lista. Roda como SECURITY DEFINER para conseguir ler
-- a cpl_inlead_hooks (que está bloqueada por RLS para anon).
--
-- v2 (2026-05-15): inclui a coluna `aula` no retorno. As 5 edge functions
-- isoladas (cpl-inlead-hooks-aulaN) gravam o valor 'AulaN' direto. Caso a
-- coluna esteja NULL (registros antigos), o front faz fallback pelo fingerprint
-- de chaves opcoes_*.
--
-- Para colar inteiro no SQL Editor do Supabase Cloud (substitui a v1).
-- =============================================================================

-- Postgres não permite mudar o tipo de retorno via CREATE OR REPLACE
-- (erro 42P13). Por isso fazemos DROP + CREATE.
DROP FUNCTION IF EXISTS public.get_lead_webhooks(text);

CREATE FUNCTION public.get_lead_webhooks(lead_email text)
RETURNS TABLE (
  id          uuid,
  payload     jsonb,
  headers     jsonb,
  aula        text,
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
    h.aula,
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

GRANT EXECUTE ON FUNCTION public.get_lead_webhooks(text) TO anon;

-- =============================================================================
-- Teste rápido após alterar:
-- =============================================================================
-- SELECT aula, count(*) AS rows
-- FROM public.get_lead_webhooks('marcelapassini@yahoo.com.br')
-- GROUP BY aula
-- ORDER BY aula;
-- =============================================================================
