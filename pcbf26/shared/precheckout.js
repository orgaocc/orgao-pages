/* =============================================
   PRÉ-CHECKOUT — Pink Friday 2026 (pcbf26)
   Mesmo fluxo das páginas JPE (jpe/shared/app-core.js):
   1. botão de compra abre o modal (nome, e-mail, WhatsApp);
   2. o lead vai pro process-lead (Supabase) com utm_page e precheckout;
   3. redireciona pro checkout com os dados preenchidos.
   Cada página define no js/config.js: link_checkout, lancamento, form, source, sck e o texto do modal.
   Sem link_checkout, o botão só desce até a oferta (não abre o modal).
   ============================================= */
(function () {
  var SUPABASE_URL = 'https://mjzboolbdynbavxpounr.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qemJvb2xiZHluYmF2eHBvdW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjYyMTAsImV4cCI6MjA5MDQ0MjIxMH0.Os0IHYXD1-5tF0rzxBWlupa8UwpaKnezjfyyofbAOdc';

  var cfg = typeof CONFIG !== 'undefined' ? CONFIG : {};
  var link = cfg.link_checkout || '';
  if (!link) return;

  var params = new URLSearchParams(window.location.search);
  function utm(nome, padrao) { return params.get(nome) || padrao; }

  /* ---------- estilo do modal ---------- */
  var css = '' +
    '.pc-modal{position:fixed;inset:0;z-index:100;background:rgba(10,4,8,.72);display:none;align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(4px)}' +
    '.pc-modal.open{display:flex}' +
    '.pc-box{background:#fff;border-radius:16px;width:100%;max-width:440px;position:relative;max-height:92vh;overflow-y:auto;box-shadow:0 20px 50px rgba(0,0,0,.4);font-family:Montserrat,system-ui,sans-serif;color:#1b1a1a}' +
    '.pc-fechar{position:absolute;top:12px;right:12px;width:36px;height:36px;border:0;border-radius:50%;background:#ffeff7;color:#700f45;display:flex;align-items:center;justify-content:center;cursor:pointer}' +
    '.pc-fechar svg{width:18px;height:18px}' +
    '.pc-inner{padding:32px 26px 26px}' +
    '.pc-titulo{font-size:21px;font-weight:800;text-align:center;color:#1b1a1a;margin:0 0 6px}' +
    '.pc-sub{text-align:center;font-size:14px;color:#555;margin:0 0 20px}' +
    '.pc-sub strong{color:#d32382;font-weight:800}' +
    '.pc-campo{margin-bottom:13px}' +
    '.pc-campo label{display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px}' +
    '.pc-campo input{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid #ddd;border-radius:10px;font:inherit;font-size:16px;color:#1b1a1a;background:#fff}' +
    '.pc-campo input:focus{outline:0;border-color:#d32382;box-shadow:0 0 0 3px rgba(211,35,130,.15)}' +
    '.pc-campo input[aria-invalid=true]{border-color:#c62828}' +
    '.pc-btn{width:100%;margin-top:6px;border:0;cursor:pointer;background:linear-gradient(96deg,#ff6e30 1.35%,#ff9e02 104.4%);color:#fffef5;font:800 17px/1.2 Montserrat,system-ui,sans-serif;text-transform:uppercase;border-radius:10px;padding:16px 18px;min-height:60px}' +
    '.pc-btn:disabled{opacity:.7;cursor:wait}' +
    '.pc-seguro{display:flex;align-items:center;justify-content:center;gap:6px;margin:14px 0 0;font-size:12px;color:#555}' +
    '.pc-seguro svg{width:14px;height:14px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- modal ---------- */
  var m = cfg.modal || {};
  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div id="modal" class="pc-modal" role="dialog" aria-modal="true" aria-labelledby="pc-titulo">' +
      '<div class="pc-box">' +
        '<button type="button" class="pc-fechar" id="modal-close" aria-label="Fechar">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
        '<div class="pc-inner">' +
          '<h3 class="pc-titulo" id="pc-titulo"></h3>' +
          '<p class="pc-sub" id="pc-sub"></p>' +
          '<form id="formClaude" class="p-ia-checkout" novalidate>' +
            '<div class="pc-campo"><label for="f-nome">Seu nome</label><input id="f-nome" name="nome" type="text" placeholder="Como você se chama?" autocomplete="name" required></div>' +
            '<div class="pc-campo"><label for="f-email">E-mail</label><input id="f-email" name="email" type="email" placeholder="seu@email.com" autocomplete="email" required></div>' +
            '<div class="pc-campo"><label for="f-tel">WhatsApp</label><input id="f-tel" name="tel" type="tel" inputmode="tel" placeholder="(00) 00000-0000" autocomplete="tel" required></div>' +
            '<button id="form-btn" type="submit" class="pc-btn"></button>' +
            '<p class="pc-seguro"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>Ambiente seguro · Seus dados são protegidos</p>' +
          '</form>' +
        '</div>' +
      '</div>' +
    '</div>';
  var modal = wrap.firstChild;
  document.body.appendChild(modal);
  modal.querySelector('#pc-titulo').textContent = m.titulo || '';
  modal.querySelector('#pc-sub').innerHTML = m.sub || '';
  var btn = modal.querySelector('#form-btn');
  btn.textContent = m.botao || 'Continuar';

  var fNome = modal.querySelector('#f-nome'), fEmail = modal.querySelector('#f-email'), fTel = modal.querySelector('#f-tel');

  /* pré-preenche com o que vier na URL (ex.: redirecionamento pós-compra pro upsell) */
  fNome.value = params.get('name') || params.get('nome') || '';
  fEmail.value = params.get('email') || '';
  var telUrl = (params.get('phone') || params.get('phonenumber') || params.get('phone_number') || params.get('whatsapp') || '').replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
  if (telUrl) fTel.value = mascara(telUrl);

  var ultimoFoco = null;
  function abrir(e) {
    e.preventDefault(); ultimoFoco = document.activeElement;
    modal.classList.add('open'); document.body.style.overflow = 'hidden';
    setTimeout(function () { (fNome.value ? (fEmail.value ? fTel : fEmail) : fNome).focus(); }, 30);
  }
  function fechar() {
    modal.classList.remove('open'); document.body.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
  }
  document.querySelectorAll('[data-checkout]').forEach(function (a) { a.addEventListener('click', abrir); });
  modal.addEventListener('click', function (e) { if (e.target === modal) fechar(); });
  modal.querySelector('#modal-close').addEventListener('click', fechar);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) fechar(); });

  /* ---------- máscara do telefone (igual à JPE) ---------- */
  function mascara(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 7) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }
  fTel.addEventListener('input', function () { this.value = mascara(this.value); });

  function pad(n) { return String(n).padStart(2, '0'); }
  function dataEnvio() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  /* ---------- link do checkout com os dados ---------- */
  function urlCheckout(nome, email, digitos) {
    var url = new URL(link);
    var q = url.searchParams;
    var hotmart = /hotmart\.com$/.test(url.hostname);
    if (hotmart) {
      if (!q.has('checkoutMode')) q.set('checkoutMode', '10');
      q.set('name', nome); q.set('email', email); q.set('phonenumber', digitos);
      q.set('src', utm('utm_source', 'direto_site'));
      if (cfg.sck) q.set('sck', cfg.sck);
    } else {
      // Guru e outros: nome, e-mail e telefone pelos nomes mais comuns (conferir com o link real)
      q.set('name', nome); q.set('email', email);
      q.set('phone_number', digitos); q.set('phone_local_code', '55');
    }
    // repassa o rastreio da página (utm_*, xcod, src, sck...) sem sobrescrever o que já está no link
    params.forEach(function (valor, chave) {
      if (['name', 'nome', 'email', 'phone', 'phonenumber', 'phone_number', 'whatsapp'].indexOf(chave) !== -1) return;
      if (!q.has(chave)) q.set(chave, valor);
    });
    return url.toString();
  }

  modal.querySelector('#formClaude').addEventListener('submit', function (e) {
    e.preventDefault();
    if (btn.disabled) return;
    var nome = fNome.value.trim(), email = fEmail.value.trim(), digitos = fTel.value.replace(/\D/g, '');
    fNome.setAttribute('aria-invalid', String(!nome));
    fEmail.setAttribute('aria-invalid', String(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)));
    fTel.setAttribute('aria-invalid', String(digitos.length < 10));
    if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || digitos.length < 10) return;

    btn.disabled = true; btn.textContent = 'ENVIANDO...';
    var corpo = {
      nome: nome, email: email, whatsapp: '+55' + digitos,
      utm_campaign: utm('utm_campaign', ''), utm_source: utm('utm_source', 'direto_site'),
      utm_medium: utm('utm_medium', 'direto_site'), utm_content: utm('utm_content', 'direto_site'),
      utm_term: utm('utm_term', 'direto_site'), utm_id: utm('utm_id', ''),
      utm_page: window.location.pathname, lancamento: cfg.lancamento || '',
      form: cfg.form || '', source: cfg.source || '', precheckout: 'true', submission_date: dataEnvio(),
    };
    var destino = urlCheckout(nome, email, digitos);
    var foi = false;
    function ir() { if (!foi) { foi = true; window.location.href = destino; } }
    // não segura a compradora: no máximo 2,5 s esperando o registro do lead
    setTimeout(ir, 2500);
    fetch(SUPABASE_URL + '/functions/v1/process-lead', {
      method: 'POST', keepalive: true,
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY },
      body: JSON.stringify(corpo),
    }).catch(function () {}).then(ir);
  });
})();
