/* =============================================
   CONFIG — pcbf26/upsell-v2 (Pink Friday 2026)
   ============================================= */
const CONFIG = {
  // Checkout do upsell (consulta adicional + Kit Gianna Vita). Vazio = o botão leva pra seção da oferta.
  link_checkout: "https://checkout.grupoconceber.com/pay/upsell-bf-consulta-kit-fertilidade-maxima/1click",  // 1 clique da Guru (Gabriel, 21/10)

  // Sem pré-checkout: o botão vai direto pro checkout com os dados da URL. Campos abaixo ficam pra se voltar o modal.
  lancamento: "PC-T57-BF",
  form: "pcbf26_upsell_v2",
  source: "pcbf26_upsell_v2",
  sck: "pcbf26_upsell_v2",
  modal: {
    titulo: "Consulta adicional + Kit Fertilidade Máxima Gianna Vita",
    sub: "12x de <strong>R$ 147,90</strong> ou <strong>R$ 1.497,90</strong> à vista",
    botao: "Sim! Quero adicionar esse cuidado",
  },
};
