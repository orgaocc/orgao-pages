/* =============================================
   CONFIG — pcbf26/quiz (quiz de anamnese "Seu plano para Conceber", Black 2026)
   O fluxo do n8n é o "[PC] [BF26] Quiz Anamnese (página → IA → carta)" (orgao-cc/quiz-anamnese).
   ============================================= */
var CONFIG = {
  enviar: 'https://n8n.orgao.cc/webhook/pc-quiz-anamnese-enviar',  // POST final (respostas + nome, e-mail, WhatsApp)
  evento: 'https://n8n.orgao.cc/webhook/pc-quiz-anamnese-evento',  // POST a cada resposta (pra não perder quem abandona)
  carta: '/pcbf26/carta/',                                          // a carta abre em /pcbf26/carta/?id=<sid>
};
