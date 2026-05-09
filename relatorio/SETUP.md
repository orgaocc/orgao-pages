# Setup — Relatório de Fertilidade

Relatório dinâmico que lê as respostas das 5 aulas (forms InLead) da tabela
`cpl_inlead_hooks` no Supabase, aplica a metodologia descrita em
[`metodologia_relatorio_conceber.md`](metodologia_relatorio_conceber.md) e
renderiza o HTML.

**Sem CLI, sem deploy de edge function.** Só uma função SQL no Supabase Cloud
+ JavaScript rodando no browser.

---

## Estrutura

```
relatorio/
├── relatorio-conceber.html              ← HTML (template + data-attributes)
├── metodologia_relatorio_conceber.md    ← spec da metodologia (referência)
├── SETUP.md                             ← este arquivo
├── sql/
│   └── get_lead_webhooks.sql            ← função SQL para colar no SQL Editor
└── js/
    ├── app.js                           ← entry point (lê ?email=, orquestra)
    ├── supabase.js                      ← chamada HTTP à RPC
    ├── mappings.js                      ← opcoes_XXX → A_Q_n + normalização
    ├── methodology.js                   ← implementa o MD inteiro
    └── render.js                        ← preenche o HTML com os dados
```

---

## Passo 1 — Criar a função SQL no Supabase

1. Abrir o **SQL Editor** do projeto Supabase (`mjzboolbdynbavxpounr`)
2. Colar todo o conteúdo de [`sql/get_lead_webhooks.sql`](sql/get_lead_webhooks.sql)
3. **Run**
4. Conferir o teste comentado no fim do arquivo:

   ```sql
   SELECT count(*) FROM public.get_lead_webhooks('clauzinhasantos5@gmail.com');
   ```

   Deve retornar pelo menos 1 (essa tentante respondeu a Aula 5).

A função usa `SECURITY DEFINER` → roda com privilégios do criador (postgres),
bypassando o RLS da `cpl_inlead_hooks`. O `GRANT EXECUTE ... TO anon` permite
que o front consulte usando a anon key.

---

## Passo 2 — Testar o relatório

### 2.1 — Modo design preview (sem banco)

Abrir o `relatorio-conceber.html` direto no browser **sem query string**:

```
relatorio-conceber.html
```

Carrega os dados hardcoded da Carla Mendes (mesma cara que o template original).
Útil para revisar o design.

### 2.2 — Modo dinâmico (lê do banco)

```
relatorio-conceber.html?email=clauzinhasantos5@gmail.com
```

O front:
1. faz `POST` na RPC `/rest/v1/rpc/get_lead_webhooks` com `{lead_email: ...}`
2. recebe N rows (uma por aula respondida)
3. detecta a aula de cada row pela "fingerprint" (conjunto único de chaves opcoes_*)
4. mapeia cada `opcoes_XXX` → código da metodologia (A1_Q1, A2_Q3, ...)
5. roda a metodologia → calcula 7 pilares, índice, contadores, findings, diagnósticos, gaps, CTA
6. renderiza no HTML

### 2.3 — Debug (DevTools)

Adicionar `&debug=rows|input|report` para ver cada estágio no console:

```
relatorio-conceber.html?email=...&debug=rows     → rows brutas do banco
relatorio-conceber.html?email=...&debug=input    → input agregado depois do mapping
relatorio-conceber.html?email=...&debug=report   → JSON final pronto pro render
```

---

## Como adaptar quando os forms da InLead mudarem

Se você editar um form na InLead (adicionar/remover pergunta, mudar texto de opção),
os IDs `opcoes_XXX` podem mudar e o mapeamento quebra parcialmente.

**Onde editar:** [`js/mappings.js`](js/mappings.js)

**O que editar:**

1. **`FINGERPRINTS`** — se um form ganhar/perder uma pergunta, atualizar o array de chaves esperadas dessa aula
2. **`INPUT_TO_QUESTION`** — adicionar/atualizar a chave nova → código da metodologia
3. **`NORMALIZE`** — se o texto da opção mudou, atualizar o needle do match parcial

**Como descobrir os novos IDs:** rode no SQL Editor

```sql
SELECT
  jsonb_object_keys(payload) AS chave,
  count(*) AS aparece_em_n_payloads
FROM public.cpl_inlead_hooks
WHERE created_at > now() - interval '7 days'
  AND payload != '{}'::jsonb
GROUP BY 1
ORDER BY 2 DESC;
```

---

## Mapeamento dos 5 forms (referência rápida)

| Aula | Form ID URL | # perguntas |
|---|---|---|
| Aula 1 — Ciclo menstrual | `Yk5cbX` | 8 |
| Aula 2 — Corpo/hormônios | `OyLh10` | 14 + altura/peso |
| Aula 3 — Ovulação | `5eQ0xw` | 8 |
| Aula 4 — Suplementação | `cUzRqH` | 6 + texto livre |
| Aula 5 — Casal | `RfERBP` | 15 |

Cada `opcoes_XXX` é único por aula (com 2 exceções compartilhadas entre A4 e A5,
que mapeamos por contexto). Tudo está em [`js/mappings.js`](js/mappings.js).

---

## Hospedagem

O relatório é HTML+JS estático puro — pode hospedar em qualquer lugar:
Cloudflare Pages, Netlify, Vercel, ou direto no mesmo bucket do JPE.

Para Cloudflare Pages (igual JPE): basta dar deploy da pasta `relatorio/`.
