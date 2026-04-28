/* =============================================
   CONFIG — cc-lo1
   ============================================= */
const CONFIG = {
  week_start:       null,
  week_end:         null,
  fallback_dates:   "4 a 10 de Maio",
  fallback_urgency: "Começa segunda — 4 de Maio",
  link_ingresso:    "https://pay.hotmart.com/E104660930C",
  supabase_url:     "https://mjzboolbdynbavxpounr.supabase.co",
  supabase_key:     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qemJvb2xiZHluYmF2eHBvdW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjYyMTAsImV4cCI6MjA5MDQ0MjIxMH0.Os0IHYXD1-5tF0rzxBWlupa8UwpaKnezjfyyofbAOdc",
  form:             "hebe_html_lo1",
  source:           "jep_lo1",
  sck:              "hebe_html_lo1",
};

/* =============================================
   HEADLINE A/B TEST
   ============================================= */
const HEADLINES = {
  Head0: 'Para estar com seu filho no colo este ano, você precisa <em class="text-sage">preparar seu corpo e o seu espírito</em> agora.',
  Head3: 'Você não precisa carregar o <strong class="text-sage">peso da espera</strong> sozinha; prepare o seu corpo para <strong class="text-sage">engravidar</strong>.',
  Head7: 'Fortaleça sua mente e espírito e prepare o seu corpo para <strong class="text-sage">engravidar</strong> ainda <strong class="text-sage">este ano</strong>.',
  Head8: 'Recupere o seu corpo e o seu espírito das várias tentativas de <strong class="text-sage">engravidar</strong> e comece a tentar do jeito certo.',
};
const SUBHEADLINES = {
  Head0: '7 dias de jejum, orientação alimentar e atualizações da medicina para quem quer engravidar de forma natural.',
  Head3: 'Participe de <u>7 dias de imersão</u> com <u>aulas</u> sobre fertilidade, <u>meditações</u> guiadas e <u>orientações médicas</u> de quem entende sua jornada.',
  Head7: 'Uma semana com <u>devocional</u> exclusivo, <u>meditações</u>, <u>plano alimentar</u> e conteúdo para assistir e revisar.',
  Head8: 'Conheça o <u>método de 7 dias</u> que combina jejum assistido, <u>medicina</u> integrativa e <u>suporte emocional</u> para futuras mães.',
};

(function applyHeadlineVariant() {
  const keys = ['Head0','Head3','Head7','Head8'];
  let key = sessionStorage.getItem('headline_variant');
  if (!key || !keys.includes(key)) {
    key = keys[Math.floor(Math.random() * keys.length)];
    sessionStorage.setItem('headline_variant', key);
  }
  document.addEventListener('DOMContentLoaded', function() {
    const h  = document.getElementById('hero-headline');
    const hd = document.getElementById('hero-headline-d');
    const s  = document.getElementById('hero-subheadline');
    if (h)  h.innerHTML  = HEADLINES[key];
    if (hd) hd.innerHTML = HEADLINES[key];
    if (s)  s.innerHTML  = SUBHEADLINES[key];
  });
})();
