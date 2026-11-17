/* =============================================
   CONFIG — ddt/vsl (Detox da Tentante, turma T58, lançamento de 7 a 13/12/2026)
   ============================================= */
const CONFIG = {
  // Começo da primeira aula: o contador do topo conta até aqui. A CONFIRMAR com a Bruna (a página antiga contava até as 20h do primeiro dia).
  inicio: "2026-12-07T20:00:00-03:00",

  // Checkout do ingresso na Hotmart: página de pagamento do produto novo da T58 (ID 8993150, R$ 97). Vazio = o botão da oferta não abre o formulário.
  // Em 16/11 o produto ainda estava em rascunho: o formulário abre e manda o lead, mas a compra só funciona quando o cadastro for finalizado na Hotmart.
  link_checkout: "https://pay.hotmart.com/C108529467K",

  // Pré-checkout: mesmos valores do formulário da página antiga do WordPress (popup 453324)
  lancamento: "PC-RDF",
  utm_campaign: "PC-LPS",
  form: "ddt_vsl",
  source: "ddt_vsl",
  sck: "ddt_vsl",                   // só vale pra checkout da Hotmart
  modal: {
    titulo: "Preencha o formulário abaixo:",
    sub: "",
    botao: "Quero garantir meu ingresso",
    aviso: "Os dados coletados são tratados nos termos da Lei Geral de Proteção de Dados e você pode se descadastrar da nossa lista de contatos a qualquer momento.",
  },
};
