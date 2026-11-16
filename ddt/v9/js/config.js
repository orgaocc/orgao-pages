/* =============================================
   CONFIG — ddt/v9 (Detox da Tentante, turma T58, lançamento de 7 a 13/12/2026)
   ============================================= */
const CONFIG = {
  // Começo da primeira aula: o contador do topo conta até aqui. A CONFIRMAR com a Bruna (a página antiga contava até as 20h do primeiro dia).
  inicio: "2026-12-07T20:00:00-03:00",

  // Checkout do ingresso na Hotmart. Vazio = o botão da oferta não abre o formulário (o produto da T58 ainda não existe).
  link_checkout: "",

  // Pré-checkout: mesmos valores do formulário da página antiga do WordPress (popup 453324)
  lancamento: "PC-RDF",
  utm_campaign: "PC-LPS",
  form: "ddt_v9",
  source: "ddt_v9",
  sck: "ddt_v9",                    // só vale pra checkout da Hotmart
  modal: {
    titulo: "Preencha o formulário abaixo:",
    sub: "",
    botao: "Quero garantir meu ingresso",
    aviso: "Os dados coletados são tratados nos termos da Lei Geral de Proteção de Dados e você pode se descadastrar da nossa lista de contatos a qualquer momento.",
  },
};
