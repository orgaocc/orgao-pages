/* =============================================
   DATES
   ============================================= */
const MONTHS   = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WEEKDAYS = ["domingo","segunda","terça","quarta","quinta","sexta","sábado"];

function parseDate(str) {
  if (!str) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
  return m ? new Date(+m[1], +m[2]-1, +m[3]) : null;
}

function formatRange(s, e) {
  if (!s || !e) return CONFIG.fallback_dates;
  if (s.getMonth() === e.getMonth())
    return `${s.getDate()} a ${e.getDate()} de ${MONTHS[s.getMonth()]}`;
  return `${s.getDate()} de ${MONTHS[s.getMonth()]} a ${e.getDate()} de ${MONTHS[e.getMonth()]}`;
}

function formatUrgency(s) {
  if (!s) return CONFIG.fallback_urgency;
  return `Começa ${WEEKDAYS[s.getDay()]} — ${s.getDate()} de ${MONTHS[s.getMonth()]}`;
}

function applyDates() {
  const s = parseDate(CONFIG.week_start);
  const e = parseDate(CONFIG.week_end);
  const dateRange   = formatRange(s, e);
  const urgencyText = formatUrgency(s);
  document.querySelectorAll('[data-date-range]').forEach(el => el.textContent = dateRange);
  document.querySelectorAll('[data-urgency]').forEach(el => el.textContent = urgencyText);
}

async function loadDates() {
  applyDates();

  const fetchRemote = async () => {
    try {
      const res = await fetch(
        `${CONFIG.supabase_url}/rest/v1/launch_config?id=eq.1&select=week_start,week_end,link_ingresso`,
        { headers: { apikey: CONFIG.supabase_key, Authorization: `Bearer ${CONFIG.supabase_key}` } }
      );
      const [data] = await res.json();
      if (data) {
        if (data.week_start)    CONFIG.week_start    = data.week_start;
        if (data.week_end)      CONFIG.week_end      = data.week_end;
        if (data.link_ingresso) CONFIG.link_ingresso = data.link_ingresso;
        applyDates();
      }
    } catch (_) {}
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(fetchRemote, { timeout: 3000 });
  } else {
    setTimeout(fetchRemote, 1500);
  }
}

/* =============================================
   FAQ ACCORDION (legacy .faq-item; .faq-q em v10/v11 usa <details>)
   ============================================= */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn  = item.querySelector('.faq-btn');
    const body = item.querySelector('.faq-body');
    if (!btn || !body) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-body').style.maxHeight = '0';
        o.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* =============================================
   UTMs
   ============================================= */
function getUtms() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_campaign: p.get('utm_campaign') || '',
    utm_source:   p.get('utm_source')   || 'direto_site',
    utm_medium:   p.get('utm_medium')   || 'direto_site',
    utm_content:  p.get('utm_content')  || 'direto_site',
    utm_term:     p.get('utm_term')     || 'direto_site',
    utm_id:       p.get('utm_id')       || '',
    xcod:         p.get('xcod')         || '',
  };
}

/* =============================================
   DIRECT CHECKOUT
   Popup de precheckout foi arquivado em ./popup-archive.md.
   Todos os CTAs com [data-open-modal] redirecionam direto ao Hotmart.
   ============================================= */
function buildCheckoutUrl() {
  const utms = getUtms();
  const sep = CONFIG.link_ingresso.includes('?') ? '&' : '?';
  const checkoutMode = /[?&]checkoutMode=/.test(CONFIG.link_ingresso) ? '' : 'checkoutMode=10&';
  let url = `${CONFIG.link_ingresso}${sep}${checkoutMode}src=${encodeURIComponent(utms.utm_source)}&sck=${CONFIG.sck}`;
  if (utms.xcod) url += `&xcod=${encodeURIComponent(utms.xcod)}`;
  return url;
}

function initDirectCheckout() {
  document.querySelectorAll('[data-open-modal]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = buildCheckoutUrl();
    });
  });
}

/* =============================================
   SCROLL REVEAL
   ============================================= */
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -8% 0px' });
  els.forEach(el => io.observe(el));
}

/* =============================================
   FLOATING CTA
   ============================================= */
function initFloatCta() {
  const float = document.getElementById('float-cta');
  const hero  = document.getElementById('hero');
  const offer = document.getElementById('oferta');
  if (!float || !hero) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const offerRect  = offer ? offer.getBoundingClientRect() : null;
      const inOffer    = offerRect && offerRect.top < window.innerHeight && offerRect.bottom > 0;
      const modalEl    = document.getElementById('modal');
      const modalOpen  = modalEl ? modalEl.classList.contains('open') : false;
      if (heroBottom < 0 && !inOffer && !modalOpen) {
        float.classList.add('show');
      } else {
        float.classList.remove('show');
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  loadDates();
  initFaq();
  initDirectCheckout();
  initReveal();
  initFloatCta();
});
