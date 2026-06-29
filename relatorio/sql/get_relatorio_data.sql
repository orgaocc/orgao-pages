-- =============================================================================
-- FUNCTION: public.get_relatorio_data(lead_email text)
-- =============================================================================
-- Retorna JSON estruturado com TODOS os dados do relatório de uma tentante:
-- contexto, aulas respondidas, e a última row de cada aula em formato humano.
-- Chamada do n8n via: SELECT get_relatorio_data($email) AS data;
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_relatorio_data(lead_email text)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT jsonb_build_object(
    'email', lower(lead_email),
    'aulas_respondidas', (
      (CASE WHEN EXISTS(SELECT 1 FROM gc_inlead_aula1 WHERE lower(email) = lower(lead_email)) THEN 1 ELSE 0 END) +
      (CASE WHEN EXISTS(SELECT 1 FROM gc_inlead_aula2 WHERE lower(email) = lower(lead_email)) THEN 1 ELSE 0 END) +
      (CASE WHEN EXISTS(SELECT 1 FROM gc_inlead_aula3 WHERE lower(email) = lower(lead_email)) THEN 1 ELSE 0 END) +
      (CASE WHEN EXISTS(SELECT 1 FROM gc_inlead_aula4 WHERE lower(email) = lower(lead_email)) THEN 1 ELSE 0 END) +
      (CASE WHEN EXISTS(SELECT 1 FROM gc_inlead_aula5 WHERE lower(email) = lower(lead_email)) THEN 1 ELSE 0 END)
    ),
    'aulas_vistas', (
      SELECT coalesce(jsonb_agg(aula), '[]'::jsonb) FROM (
        SELECT 'aula1' AS aula WHERE EXISTS(SELECT 1 FROM gc_inlead_aula1 WHERE lower(email) = lower(lead_email))
        UNION ALL SELECT 'aula2' WHERE EXISTS(SELECT 1 FROM gc_inlead_aula2 WHERE lower(email) = lower(lead_email))
        UNION ALL SELECT 'aula3' WHERE EXISTS(SELECT 1 FROM gc_inlead_aula3 WHERE lower(email) = lower(lead_email))
        UNION ALL SELECT 'aula4' WHERE EXISTS(SELECT 1 FROM gc_inlead_aula4 WHERE lower(email) = lower(lead_email))
        UNION ALL SELECT 'aula5' WHERE EXISTS(SELECT 1 FROM gc_inlead_aula5 WHERE lower(email) = lower(lead_email))
      ) t
    ),
    'aula1', (SELECT to_jsonb(t) FROM (
      SELECT ciclo_freq, borra_cafe, cor_sangue, volume_fluxo, intensidade_colica,
             coagulos, odor, duracao_fluxo, muco_ovulatorio, created_at
      FROM gc_inlead_aula1
      WHERE lower(email) = lower(lead_email)
      ORDER BY created_at DESC LIMIT 1
    ) t),
    'aula2', (SELECT to_jsonb(t) FROM (
      SELECT altura, peso, autopercepcao_peso, melasma, escurecimento_pele,
             celulite, pelos, cabelo, unhas, inchada, fadiga, memoria, intestino,
             diagnostico, diagnostico_outro, tpm, anticoncepcional, regularidade_ciclo, created_at
      FROM gc_inlead_aula2
      WHERE lower(email) = lower(lead_email)
      ORDER BY created_at DESC LIMIT 1
    ) t),
    'aula3', (SELECT to_jsonb(t) FROM (
      SELECT percebe_periodo_fertil, muco_cervical, libido, metodo_ovulacao,
             confirmou_ovulacao, relacoes_periodo_fertil, exame_amh,
             percebe_ovulacao, interesse, created_at
      FROM gc_inlead_aula3
      WHERE lower(email) = lower(lead_email)
      ORDER BY created_at DESC LIMIT 1
    ) t),
    'aula4', (SELECT to_jsonb(t) FROM (
      SELECT historico_perdas, perdeu_bebe, desejo_gestacao, folato,
             suplementos, suplemento_outro, vitamina_d, interesse, created_at
      FROM gc_inlead_aula4
      WHERE lower(email) = lower(lead_email)
      ORDER BY created_at DESC LIMIT 1
    ) t),
    'aula5', (SELECT to_jsonb(t) FROM (
      SELECT lubrificacao, freq_sexual, dor_relacao, comunicacao_casal,
             intimidade, excitacao, fatores_libido, historico_ist,
             peso_parceiro, parceiro_fuma, parceiro_bebe, parceiro_esteroides,
             espermograma, varicocele, parceiro_atividade_fisica, interesse, created_at
      FROM gc_inlead_aula5
      WHERE lower(email) = lower(lead_email)
      ORDER BY created_at DESC LIMIT 1
    ) t)
  );
$$;
