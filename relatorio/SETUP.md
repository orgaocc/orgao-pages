# Setup — Relatório de Fertilidade

Relatório dinâmico que lê as respostas das 5 aulas (forms InLead) do **Postgres interno** (`ep.orgao.cc`), aplica a metodologia descrita em [`metodologia_relatorio_conceber.md`](metodologia_relatorio_conceber.md) e renderiza o HTML.

## Arquitetura

```
Tentante → p.grupoconceber.com/relatorio/
              │ fetch POST
              ▼
hooks.grupoconceber.com/webhook/get-relatorio-data  ← n8n
              │
              ▼ SQL: SELECT get_relatorio_data($1)
       ep.orgao.cc:5433 (metabase)
              │ retorna JSON com 5 aulas
              ▼
       Frontend renderiza relatório

[paralelo]
       Tracking → hooks.grupoconceber.com/webhook/relatorio-acesso
```

**Migração de Junho/2026:** removida 100% a dependência da Lovable/Supabase. Tudo passa pela infra interna (`*.orgao.cc` / `*.grupoconceber.com`).

## Estrutura do projeto

```
relatorio/
├── index.html                              ← HTML (gate + relatório)
├── metodologia_relatorio_conceber.md       ← spec da metodologia
├── SETUP.md                                ← este arquivo
├── n8n-workflow-instructions.md            ← como criar o workflow n8n
├── assets/                                 ← logo
├── sql/
│   └── get_relatorio_data.sql              ← função PG (rodar 1x)
└── js/
    ├── app.js                              ← entry point
    ├── api.js                              ← cliente HTTP do n8n
    ├── mappings.js                         ← coluna PG → código metodologia
    ├── methodology.js                      ← cálculo do relatório
    ├── render.js                           ← preenche o HTML
    └── tracking.js                         ← envia eventos ao n8n
```

## Setup (1x)

### 1. Função SQL no Postgres
Rodar [`sql/get_relatorio_data.sql`](sql/get_relatorio_data.sql) no Postgres interno (`ep.orgao.cc:5433`).

### 2. Workflow n8n
Seguir [`n8n-workflow-instructions.md`](n8n-workflow-instructions.md) — 3 nós (Webhook → Postgres → Respond).

### 3. Workflow n8n de tracking (já existe)
Continua igual: `hooks.grupoconceber.com/webhook/relatorio-acesso`.

## Tabelas Postgres (gravadas em tempo real pelo n8n)

| Tabela | Conteúdo |
|---|---|
| `gc_inlead_aula1` | Ciclo menstrual |
| `gc_inlead_aula2` | Corpo e equilíbrio hormonal |
| `gc_inlead_aula3` | Ovulação e janela fértil |
| `gc_inlead_aula4` | Nutrição e suplementação |
| `gc_inlead_aula5` | Saúde do casal |

Cada uma com colunas em português (`ciclo_freq`, `intensidade_colica`, etc.) + `raw jsonb` (payload bruto do webhook InLead) + `imported_at`.

## Como o front consome

```
http://localhost:8080/relatorio/                           → gate de login
http://localhost:8080/relatorio/?email=x@y.com             → busca direto
http://localhost:8080/relatorio/?email=x@y.com&debug=rows  → loga JSON do n8n
http://localhost:8080/relatorio/?preview=carla             → modo design (Carla mock)
```

## Hospedagem

Cloudflare Pages no domínio `p.grupoconceber.com`, deploy automático em push pra `main` do repo `orgaocc/hebe-cd-jpe`.

## O que mudou em relação à versão anterior

| | Antes | Agora |
|---|---|---|
| Banco | Supabase Lovable (`cpl_inlead_hooks`) | Postgres interno (`gc_inlead_aulaN`) |
| API | Supabase RPC (`get_lead_webhooks`) | n8n webhook (`get-relatorio-data`) |
| Auth | Supabase anon key | Sem auth (webhook público) |
| Estrutura dados | `payload.opcoes_XXX` (IDs InLead) | Colunas humanas (`ciclo_freq`, etc.) |
| Coluna `interesse` | Não capturada | ✅ A3/A4/A5 |
| Coluna `raw` | Inexistente | ✅ payload bruto preservado |
