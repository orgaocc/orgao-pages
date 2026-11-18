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

// datas e link do ingresso vêm só do config.js
function loadDates() {
  applyDates();
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
   MODAL
   ============================================= */
const modal = document.getElementById('modal');

function openModal()  { if (modal) { modal.classList.add('open');    document.body.style.overflow = 'hidden'; } }
function closeModal() { if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; } }

function initModal() {
  if (!modal) return;
  document.querySelectorAll('[data-open-modal]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openModal(); });
  });
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* =============================================
   PHONE MASK
   ============================================= */
function applyMask(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}

/* =============================================
   FORM SUBMIT
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

function pad(n) { return String(n).padStart(2, '0'); }
function submissionDate() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-btn');
  if (btn.disabled) return;

  const nome     = document.getElementById('f-nome').value.trim();
  const email    = document.getElementById('f-email').value.trim();
  const telefone = document.getElementById('f-tel').value;
  const digits   = telefone.replace(/\D/g, '');

  if (!nome || !email || digits.length < 10) return;

  btn.disabled = true;
  btn.textContent = 'ENVIANDO...';

  const utms = getUtms();
  const body = {
    nome, email,
    whatsapp:        `+55${digits}`,
    utm_campaign:    utms.utm_campaign,
    utm_source:      utms.utm_source,
    utm_medium:      utms.utm_medium,
    utm_content:     utms.utm_content,
    utm_term:        utms.utm_term,
    utm_page:        window.location.pathname,
    lancamento:      'PCT33',
    utm_id:          utms.utm_id,
    form:            CONFIG.form,
    source:          CONFIG.source,
    headline_test:   sessionStorage.getItem('headline_variant') || 'HeadOriginal',
    precheckout:     'true',
    submission_date: submissionDate(),
  };

  try {
    // direto pro n8n (leads_captacao), em form-urlencoded
    await fetch('https://n8n.orgao.cc/webhook/leads_captacao', {
      method: 'POST', mode: 'no-cors', keepalive: true,
      body: new URLSearchParams(body),
    });
  } catch (_) {}

  // link do checkout montado na hora do envio, sem sck nem src fixos: o VK decora (xcod + sck com a origem) e depois o onePixel (id do lead, fbp e UTMs)
  const link = new URL(CONFIG.link_ingresso);
  const q = link.searchParams;
  if (!q.has('checkoutMode')) q.set('checkoutMode', '10');
  q.set('name', nome); q.set('email', email); q.set('phonenumber', digits);
  new URLSearchParams(window.location.search).forEach((valor, chave) => {
    if (['name', 'nome', 'email', 'phone', 'phonenumber', 'phone_number', 'whatsapp'].includes(chave)) return;
    if (!q.has(chave)) q.set(chave, valor);
  });
  let url = link.toString();
  try { if (window.vkPixelSales && typeof vkPixelSales.generateDecoratedUrl === 'function') url = vkPixelSales.generateDecoratedUrl(url) || url; } catch (_) {}
  try { if (window.px && typeof px.decorate === 'function') url = px.decorate(url) || url; } catch (_) {}
  window.location.href = url;
}

function initForm() {
  const tel  = document.getElementById('f-tel');
  const form = document.getElementById('formClaude');
  if (!tel || !form) return;
  tel.addEventListener('input', function() { this.value = applyMask(this.value); });
  form.addEventListener('submit', handleSubmit);
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
  initModal();
  initForm();
  initReveal();
  initFloatCta();
});
