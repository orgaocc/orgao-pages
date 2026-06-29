# Workflow n8n — `get-relatorio-data`

Endpoint que o front (`relatorio/js/api.js`) consome pra buscar os dados de um lead direto no Postgres interno.

URL final esperada: `https://hooks.grupoconceber.com/webhook/get-relatorio-data`

## Pré-requisito (1x, no Postgres)

Rodar [`sql/get_relatorio_data.sql`](sql/get_relatorio_data.sql) **uma vez** no Postgres `ep.orgao.cc:5433` (database `metabase`). Cria a função `get_relatorio_data(lead_email text)` que faz o trabalho pesado e retorna 1 JSON com tudo.

Já está rodada — eu criei via psycopg2 durante o desenvolvimento. Mas se algum dia precisar recriar, o SQL está commitado.

## Setup do workflow no n8n

### 1. Credencial Postgres (uma vez)

n8n → **Credentials** → **+ New** → **Postgres**

| Campo | Valor |
|---|---|
| Name | `Postgres Interno (Metabase)` |
| Host | `ep.orgao.cc` |
| Port | `5433` |
| Database | `metabase` |
| User | `postgres` |
| Password | `<senha>` |
| SSL | `disable` |

Salva.

### 2. Workflow novo

**Nome:** `get-relatorio-data`

#### Nó 1 — Webhook
- HTTP Method: `POST`
- Path: `get-relatorio-data`
- Response Mode: `Last Node`
- Response Code: `200`
- Response Headers (adicionar):
  - `Access-Control-Allow-Origin`: `*`
  - `Access-Control-Allow-Methods`: `POST, OPTIONS`
  - `Access-Control-Allow-Headers`: `content-type`
- Authentication: `None`

#### Nó 2 — Postgres
- Credential: `Postgres Interno (Metabase)`
- Operation: `Execute Query`
- Query:
```sql
SELECT public.get_relatorio_data($1::text) AS data;
```
- Query Parameters: `={{ $json.body.email }}`

#### Nó 3 — Respond to Webhook
- Respond With: `JSON`
- Response Body: `={{ $json.data }}`

### 3. Activate workflow

Toggle no canto superior direito.

### 4. Token de segurança

O workflow tem um nó de validação que exige um `token` no body — barra requests automatizados externos. Token atual: `rltk_8271b97d58e3630e6d3dc1cf68b8d00ce7a628f8` (também presente em [`js/api.js`](js/api.js)).

Pra rotacionar: trocar o valor no workflow n8n + em `js/api.js` (mesmo valor nos dois lugares).

### 5. Testar

```bash
TOKEN="rltk_8271b97d58e3630e6d3dc1cf68b8d00ce7a628f8"
curl -s -X POST "https://hooks.grupoconceber.com/webhook/get-relatorio-data" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"marianaadalberto@hotmail.com\",\"token\":\"$TOKEN\"}" | jq .aulas_respondidas
# esperado: 5
```

## Como o front consome

```js
// js/api.js
fetch("https://hooks.grupoconceber.com/webhook/get-relatorio-data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "..." })
})
  .then(r => r.json())
  // → { email, aulas_respondidas, aulas_vistas, aula1: {...}, ... }
```
