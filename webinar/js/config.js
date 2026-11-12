/* =============================================
   CONFIG — webinar (inscrição no webinar evergreen do Programa Conceber)
   Tudo que muda de campanha pra campanha fica aqui. O HTML e o app.js não precisam ser editados.
   ============================================= */
const CONFIG = {
  /* Pra onde o formulário manda a inscrição (gatilho do n8n do Órgão).
     Vazio = modo de teste: o formulário simula a resposta e segue pra página de obrigado. */
  webhook_url: "",

  /* Número que recebe a confirmação pelo WhatsApp (conexão do Unnichat).
     Marketing - Grupo Conceber: +55 31 3191-9798 (a confirmar com a Bruna qual conexão vai responder). */
  whatsapp: "+55 31 3191-9798",

  /* Mensagem que a pessoa manda pelo WhatsApp. O ingresso é o que o n8n devolve (ex.: WPJ-06F9F91A). */
  mensagem_whatsapp: "Quero confirmar minha inscrição. Meu ingresso é {ingresso}.",
  prefixo_ingresso: "WPJ-",
  segundos_para_redirecionar: 15,

  /* Horários. O "Agora" é o próximo múltiplo de 15 minutos; os fixos entram nos dias seguintes. */
  fuso_horas: -3,                 /* horário de Brasília, independente do fuso do navegador */
  intervalo_minutos: 15,
  horarios_fixos: ["07:00", "12:00", "20:00"],
  quantos_horarios: 3,
  feriados: ["2026-12-25"],       /* dias sem sessão (AAAA-MM-DD) */
  atualizar_a_cada_segundos: 30,  /* o "Agora" avança sozinho, sem recarregar a página */

  /* Identificação do lead (mesmo padrão das outras páginas do Órgão). */
  lancamento: "[a preencher]",
  form:       "webinar_v1",
  source:     "webinar_v1",

  pagina_obrigado: "obrigado/",
};

/* Sala (demonstração de webinar sem WebinarJam, em sala/). Vídeo de exemplo público só pra ter imagem rodando. */
CONFIG.sala = {
  titulo: "[a preencher: título do webinar]",
  video_url: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
  duracao_minutos: 10,   /* de verdade vem do próprio vídeo; aqui serve pra demonstração */
  oferta_minuto: 3,      /* minuto da sessão em que o cartão de oferta aparece */
  link_oferta: "#",
};
