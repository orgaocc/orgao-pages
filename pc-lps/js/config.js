/* =============================================
   CONFIG — pc-lps (página de venda do Programa Conceber)
   Refeita em 17/11/2026 a partir de grupoconceber.com/pc-lps/. Textos, preços e a regra de horário são os da página original.
   ============================================= */
const CONFIG = {
  // Pré-checkout. Na página original os dois campos vinham como "PCT32" (turma antiga). A CONFIRMAR com a Bruna o valor da T58.
  lancamento: "PCT58",
  utm_campaign: "PCT58",
  form: "pc_lps",
  source: "pc_lps",
  sck: "pc_lps",
  modal: {
    titulo: "Preencha o formulário abaixo:",
    sub: "",
    botao: "QUERO PARTICIPAR",
    aviso: "Os dados coletados são tratados nos termos da Lei Geral de Proteção de Dados e você pode se descadastrar da nossa lista de contatos a qualquer momento.",
  },

  // WhatsApp do assessor (o texto muda conforme a oferta do momento)
  whatsapp: "553182343964",

  // As duas ofertas. link_checkout vazio = o botão de compra não abre o formulário (falta o link da Guru da T58).
  ofertas: {
    "2797": {
      parcela: "12x de R$ 279,90",
      avista: "R$ 2.797,90",
      link_checkout: "",
      assessor: "Olá! Participei do Detox e tenho interesse em entrar para o Programa Conceber. Gostaria de falar com um assessor sobre a minha inscrição.",
    },
    "2997": {
      parcela: "12x de R$ 297,90",
      avista: "R$ 2.997,90",
      link_checkout: "",
      assessor: "Olá! Tenho interesse em participar do Conceber, mas queria conversar com um assessor antes de fazer minha inscrição.",
    },
  },

  // Inscrições fechadas
  espera: {
    lista: "https://forms.grupoconceber.com/?fluent-form=43",
    assessor: "Olá! Conheci a proposta do Conceber no Detox e fiquei com algumas dúvidas antes de concluir minha inscrição. Posso falar com um assessor?",
  },

  /* Qual versão da oferta aparece agora, no horário de Brasília. É a regra semanal da página original:
       domingo a partir das 10h45 e segunda-feira inteira ......... "2797" (oferta de abertura)
       terça e quarta-feira ........................................ "2997"
       quinta a sábado, e domingo antes das 10h45 .................. "espera" (inscrições fechadas)
     O Detox mensal (T58) vai de 7 a 13/12: se a venda seguir outro calendário, é aqui que se troca. */
  estado: function (agora) {
    var partes = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(agora || new Date());
    var v = {};
    partes.forEach(function (p) { v[p.type] = p.value; });
    var minuto = Number(v.hour) * 60 + Number(v.minute);
    if ((v.weekday === "Sun" && minuto >= 645) || v.weekday === "Mon") return "2797";
    if (v.weekday === "Tue" || v.weekday === "Wed") return "2997";
    return "espera";
  },
};

// Pra conferir cada versão sem esperar o dia: ?estado=2797, ?estado=2997 ou ?estado=espera
(function () {
  var pedido = new URLSearchParams(window.location.search).get("estado");
  CONFIG.estado_fixo = pedido === "2797" || pedido === "2997" || pedido === "espera" ? pedido : "";
  CONFIG.estado_agora = function () { return CONFIG.estado_fixo || CONFIG.estado(); };
  // o formulário de pré-checkout lê o link uma vez, ao abrir a página: vale o da oferta deste momento
  var oferta = CONFIG.ofertas[CONFIG.estado_agora()];
  CONFIG.link_checkout = oferta ? oferta.link_checkout : "";
})();
