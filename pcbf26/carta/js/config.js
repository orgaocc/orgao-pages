/* =============================================
   CONFIG — pcbf26/carta (carta da Dra. Talita gerada pelo quiz de anamnese)
   ============================================= */
var CONFIG = {
  carta: 'https://n8n.orgao.cc/webhook/pc-quiz-anamnese-carta',    // GET ?id=<sid> → { status, carta }
  evento: 'https://n8n.orgao.cc/webhook/pc-quiz-anamnese-evento',  // POST carta_aberta, trailer, checkout
  quiz: '/pcbf26/quiz/',

  // Checkout da Black que já está no ar (o mesmo da pcbf26/vendas): R$ 1.997,90 à vista ou 12x de R$ 197,90
  link_checkout: 'https://checkout.grupoconceber.com/pay/black-friday-grupo-plataforma-consulta',

  // Trailer do Programa Conceber (gravação com a Talita + edição da Isabela).
  // Endereço de incorporação (YouTube: https://www.youtube-nocookie.com/embed/<id>; Panda/Vimeo: o link do iframe).
  // Vazio = a carta sobe sem o trailer (o bloco some).
  trailer_embed: '',
};
