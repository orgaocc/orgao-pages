// =============================================================================
// TRACKING — registra quem consulta o relatório (envia ao n8n)
// =============================================================================
// Dispara um POST "fire-and-forget" pro webhook do n8n sempre que:
//   • alguém acessa um relatório completo (5/5)        → evento "relatorio_visualizado"
//   • alguém cai no gate de bloqueio (<5/5)            → evento "relatorio_bloqueado"
//   • um email não é encontrado                        → evento "email_nao_encontrado"
//
// Não bloqueia o carregamento: usa sendBeacon (sobrevive ao fechamento da aba)
// com fallback pra fetch keepalive. Falha de rede é silenciosa.
// =============================================================================

// Webhook n8n de produção (recebe os eventos de acesso ao relatório).
const N8N_WEBHOOK_URL = "https://hooks.grupoconceber.com/webhook/relatorio-acesso";

// liga/desliga o tracking sem mexer no resto do código
const TRACKING_ENABLED = true;

function deviceInfo() {
  return {
    user_agent: navigator.userAgent,
    platform: navigator.platform,
    idioma: navigator.language,
    tela: `${window.screen?.width}x${window.screen?.height}`,
    referrer: document.referrer || null,
  };
}

/**
 * Envia um evento de acesso ao n8n.
 * @param {string} evento  - relatorio_visualizado | relatorio_bloqueado | email_nao_encontrado
 * @param {object} dados   - campos extras (email, índice, aulas, etc.)
 */
export function trackAccess(evento, dados = {}) {
  if (!TRACKING_ENABLED || !N8N_WEBHOOK_URL) return;

  const body = JSON.stringify({
    evento,
    data_hora: new Date().toISOString(),
    origem: "relatorio-conceber",
    url: location.href,
    device: deviceInfo(),
    ...dados,
  });

  try {
    // sendBeacon: melhor pra eventos que não devem bloquear nem ser perdidos
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(N8N_WEBHOOK_URL, blob);
      if (ok) return;
    }
    // fallback: fetch com keepalive
    fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      mode: "no-cors",
    }).catch(() => {});
  } catch (_) {
    /* tracking nunca quebra o relatório */
  }
}
