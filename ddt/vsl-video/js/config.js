/* =============================================
   CONFIG — ddt/vsl-video (a página /ddt/vsl/ mostrando só o vídeo até a hora do preço; Detox da Tentante, turma T58, lançamento de 7 a 13/12/2026)
   ============================================= */
const CONFIG = {
  // Segundo do vídeo (14min52s no total) em que cada parte aparece. PROVISÓRIO: falta a Elisa passar os minutos certos.
  //   botao  = o botão de compra do topo (quando a doutora fala em comprar)
  //   oferta = o resto da página, com a oferta
  // 0 = aparece na hora. Pra testar: ?aos=10 revela tudo aos 10 s; ?mostrar=1 revela na hora.
  revelar: { botao: 600, oferta: 600 },

  // Começo da primeira aula: o contador do topo conta até aqui. A CONFIRMAR com a Bruna (a página antiga contava até as 20h do primeiro dia).
  inicio: "2026-12-07T20:00:00-03:00",

  // Checkout do ingresso na Hotmart. 17/11: a Elisa decidiu não ter produto novo. É o Detox que já vende (ID 8009648), no preço
  // "[PC] [T58] DDTM" (R$ 97 ou 12x de R$ 9,34, código dx5vmnqf), criado ao lado dos preços que já existiam. Vazio = o botão não abre o formulário.
  link_checkout: "https://pay.hotmart.com/T106499003D?off=dx5vmnqf&checkoutMode=10",

  // Pré-checkout: mesmos valores do formulário da página antiga do WordPress (popup 453324)
  lancamento: "PC-RDF",
  utm_campaign: "PC-LPS",
  form: "ddt_vsl_video",
  source: "ddt_vsl_video",
  sck: "ddt_vsl_video",                   // só vale pra checkout da Hotmart
  modal: {
    titulo: "Preencha o formulário abaixo:",
    sub: "",
    botao: "Quero garantir meu ingresso",
    aviso: "Os dados coletados são tratados nos termos da Lei Geral de Proteção de Dados e você pode se descadastrar da nossa lista de contatos a qualquer momento.",
  },
};
