/* =============================================
   CONFIG — pcbf26/vendas-antiga (Pink Friday 2026, layout antigo)
   ============================================= */
const CONFIG = {
  // Checkout da oferta Pink Friday (Guru ou Hotmart). Vazio = os botões levam pra seção da oferta, sem pré-checkout.
  link_checkout: "https://checkout.grupoconceber.com/pay/black-friday-grupo-plataforma-consulta",

  // Pré-checkout (mesmo fluxo da JPE: lead no process-lead e checkout com os dados preenchidos)
  lancamento: "PC-T57-BF",          // tag_form do "Programa Conceber BF" na tabela de mapeamento do n8n
  form: "pcbf26_vendas_antiga",
  source: "pcbf26_vendas_antiga",
  sck: "pcbf26_vendas_antiga",             // só vale pra checkout da Hotmart
  modal: {
    titulo: "Pink Friday Conceber",
    sub: "12x de <strong>R$ 197,90</strong> ou <strong>R$ 1.997,90</strong> à vista",
    botao: "Quero entrar no Programa Conceber",
  },
};
