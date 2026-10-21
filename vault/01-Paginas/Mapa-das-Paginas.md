---
title: Mapa das páginas — Órgão Pages
tags: [orgao, pages, inventario]
updated: 2026-10-21
---

# Mapa das páginas

[Índice](../00-Indice.md) · [Estrutura e integrações](Estrutura-e-Integracoes.md)

Inventário extraído de todos os arquivos HTML na revisão base `e486a51123655e35ac5fa14b9055a1605e0779c6` em 2026-10-21: **13 entradas HTML**, sendo **10 variantes JPE**, relatório, tech e fallback. Não é uma verificação de disponibilidade em produção.

| Rota no código | Arquivo | Título HTML | Observação |
| --- | --- | --- | --- |
| `/404.html` | [404.html](../../404.html) | Redirecionando… | Fallback redireciona para `/jpe/cc-v7b/` |
| `/jpe/cc-v1/` | [jpe/cc-v1/index.html](../../jpe/cc-v1/index.html) | Jejum e Oração para Engravidar — Protocolo Médico | Versão de campanha presente no Git |
| `/jpe/cc-v10/` | [jpe/cc-v10/index.html](../../jpe/cc-v10/index.html) | Jejum para Engravidar — Dra. Talita Melo | 7 dias online e ao vivo | Versão de campanha presente no Git |
| `/jpe/cc-v11/` | [jpe/cc-v11/index.html](../../jpe/cc-v11/index.html) | Jejum para Engravidar — Detox de 7 dias com Dra. Talita Melo | Versão de campanha presente no Git |
| `/jpe/cc-v2/` | [jpe/cc-v2/index.html](../../jpe/cc-v2/index.html) | Jejum e Oração para Engravidar — Protocolo Médico | Versão de campanha presente no Git |
| `/jpe/cc-v2b/` | [jpe/cc-v2b/index.html](../../jpe/cc-v2b/index.html) | Jejum e Oração para Engravidar - Grupo Conceber | Versão de campanha presente no Git |
| `/jpe/cc-v3/` | [jpe/cc-v3/index.html](../../jpe/cc-v3/index.html) | Jejum e Oração para Engravidar - Grupo Conceber | Versão de campanha presente no Git |
| `/jpe/cc-v7/` | [jpe/cc-v7/index.html](../../jpe/cc-v7/index.html) | Jejum para Engravidar — Detox Metabólico - Grupo Conceber | Versão de campanha presente no Git |
| `/jpe/cc-v7-bkp1/` | [jpe/cc-v7-bkp1/index.html](../../jpe/cc-v7-bkp1/index.html) | Jejum para Engravidar — Detox Metabólico - Grupo Conceber | Cópia histórica; `_redirects` aponta esta rota para `/jpe/cc-v7/` |
| `/jpe/cc-v7b/` | [jpe/cc-v7b/index.html](../../jpe/cc-v7b/index.html) | Jejum para Engravidar — Detox Metabólico - Grupo Conceber | Destino de `/` e do fallback, conforme configuração |
| `/jpe/cc-v9/` | [jpe/cc-v9/index.html](../../jpe/cc-v9/index.html) | Jejum e Oração para Engravidar - Grupo Conceber | Versão de campanha presente no Git |
| `/relatorio/` | [relatorio/index.html](../../relatorio/index.html) | Programa Conceber — Relatório de Fertilidade | Relatório dinâmico; depende de integração HTTP |
| `/tech/` | [tech/index.html](../../tech/index.html) | Mapa Mental — Gestão Tech & Operações | Mapa de gestão tech e operações |

## Redirecionamentos e fallback

| Origem | Destino | Fonte |
| --- | --- | --- |
| `/` | `/jpe/cc-v7b/` (301) | [`_redirects`](../../_redirects) |
| `/jpe/cc-v7-bkp1/*` | `/jpe/cc-v7/` (301) | [`_redirects`](../../_redirects) |
| Fallback 404 | `/jpe/cc-v7b/` | [`404.html`](../../404.html) |

O comportamento efetivo depende da hospedagem interpretar as regras. O nome de uma variante ou sua posição na lista não determina qual campanha está ativa.

## Atualização

Ao criar, remover ou mudar uma página, confira seus assets e scripts, atualize esta tabela e mantenha o histórico das variantes. Não apague uma versão por inferir que um número menor está obsoleto.
