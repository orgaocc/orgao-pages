// =============================================================================
// API CLIENT — n8n webhook (lê do Postgres interno via workflow)
// =============================================================================
// Endpoint: hooks.grupoconceber.com/webhook/get-relatorio-data
// Resposta: JSON com estrutura { email, aulas_respondidas, aulas_vistas,
//                                aula1: {...}, aula2: {...}, ... }
// =============================================================================

const ENDPOINT = "https://hooks.grupoconceber.com/webhook/get-relatorio-data";

// Token compartilhado com o n8n pra barrar acessos automatizados externos.
// Não é segredo absoluto (vai pro browser), mas filtra scrapers/bots casuais.
// Pode ser rotacionado a qualquer momento — basta trocar aqui e no workflow n8n.
const TOKEN = "rltk_8271b97d58e3630e6d3dc1cf68b8d00ce7a628f8";

export async function fetchLeadReport(email) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, token: TOKEN }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`API falhou (${res.status}): ${txt}`);
  }
  const data = await res.json();

  // O n8n pode retornar como array (estilo Postgres) [{get_relatorio_data: {...}}]
  // ou como objeto direto. Normaliza pra objeto.
  if (Array.isArray(data)) {
    const first = data[0] || {};
    return first.get_relatorio_data || first.data || first;
  }
  if (data.get_relatorio_data) return data.get_relatorio_data;
  return data;
}
