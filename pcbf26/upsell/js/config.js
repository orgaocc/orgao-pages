/* =============================================
   CONFIG — pcbf26/upsell (Pink Friday 2026)
   ============================================= */
const CONFIG = {
  // Checkout do upsell (consulta adicional + Kit Gianna Vita). Vazio = o botão leva pra seção da oferta, sem pré-checkout.
  link_checkout: "https://checkout.grupoconceber.com/pay/upsell-bf-consulta-kit-fertilidade-maxima",

  // Pré-checkout (mesmo fluxo da JPE). Nome, e-mail e telefone vêm preenchidos se o checkout anterior mandar na URL.
  lancamento: "PC-T57-BF",
  form: "pcbf26_upsell",
  source: "pcbf26_upsell",
  sck: "pcbf26_upsell",
  modal: {
    titulo: "Consulta adicional + Kit Fertilidade Máxima Gianna Vita",
    sub: "12x de <strong>R$ 147,90</strong> ou <strong>R$ 1.497,90</strong> à vista",
    botao: "Sim! Quero adicionar esse cuidado",
  },

  // VSL no YouTube: só o id do vídeo (o que vem depois de "watch?v=").
  // PROVISÓRIO: vídeo do canal do Programa Conceber até a VSL da Dra. Talita ficar pronta.
  vsl_youtube_id: "dbBXkOURBvc",

  // "vertical" (9:16, como no Figma) ou "horizontal" (16:9). O provisório é horizontal.
  vsl_formato: "horizontal",
};
