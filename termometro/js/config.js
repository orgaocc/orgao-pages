/* =============================================
   CONFIG — /termometro/ (Termômetro da Intoxicação, presente do webinar da Imersão Detox para Engravidar)
   Conteúdo da Elisa (termometro-conteudo.md v3 e protótipo, WhatsApp 22/11/2026). Vai no chat do EverWebinar aos 1:09:35.
   O fluxo do n8n é o "[PC] [WEBINAR] Termômetro (página → Unnichat)" (orgao-cc/webinar-conceber/termometro/n8n).
   ============================================= */
var CONFIG = {
  // nome + WhatsApp + faixa vão pra cá antes do resultado; o n8n cria/acha o contato no Unnichat e põe a tag da faixa
  enviar: 'https://n8n.orgao.cc/webhook/pc-termometro',

  // checkout do Detox da Tentante (o mesmo da sala do webinar). O sck sai por faixa: termometro_leve/_moderada/_alta
  checkout: 'https://pay.hotmart.com/T106499003D?off=dx5vmnqf&checkoutMode=10',
  sck: 'termometro',

  // Guia de Suplementação na tela de resultado. A Elisa: "só pode aparecer enquanto a imersão estiver no ar.
  // Fora isso, não citar." Fica desligado até ela confirmar quando ele vale.
  bonus_ao_vivo: false,
};
