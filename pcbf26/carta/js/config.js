/* =============================================
   CONFIG — pcbf26/carta (carta da Dra. Talita gerada pelo quiz de anamnese)
   ============================================= */
var CONFIG = {
  carta: 'https://n8n.orgao.cc/webhook/pc-quiz-anamnese-carta',    // GET ?id=<sid> → { status, carta }
  evento: 'https://n8n.orgao.cc/webhook/pc-quiz-anamnese-evento',  // POST carta_aberta, checkout
  quiz: '/pcbf26/quiz/',

  // Checkout da Black que já está no ar (o mesmo da pcbf26/vendas): R$ 1.997,90 à vista ou 12x de R$ 197,90
  link_checkout: 'https://checkout.grupoconceber.com/pay/black-friday-grupo-plataforma-consulta',

  // Sem trailer: em 23/11/2026 a Dra. Talita não conseguiu gravar e a carta roda só com o texto.
};
