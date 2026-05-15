-- =============================================================================
-- CLEANUP — remove os 5 registros de teste deixados pelas edge functions novas
-- =============================================================================
-- Confirmado pelo query do dia 15/05/2026 12:20 — existem 5 registros com
-- payload {"aula_marker":"AulaN","test":true}, criados pela própria Lovable
-- ao validar as 5 edge functions isoladas.
--
-- IDs confirmados:
--   f15ff0bd-939f-4f36-8aac-0b15cbce7cde (Aula1)
--   f81c3966-94e5-4e2f-bfb7-f3f0d441a36f (Aula2)
--   3419da1c-ba09-4c79-a3ef-5cc1865f92e1 (Aula3)
--   77ed570e-c612-44d9-9e45-c4746178bf0f (Aula4)
--   7cc3205c-89ad-47b0-b971-998104b418e8 (Aula5)
-- =============================================================================

DELETE FROM public.cpl_inlead_hooks
WHERE payload->>'test' = 'true';

-- Conferência (deve retornar 0):
SELECT count(*) AS test_remaining
FROM public.cpl_inlead_hooks
WHERE payload->>'test' = 'true';
