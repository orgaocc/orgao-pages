/* =============================================
   Detox da Tentante — comportamento compartilhado de /ddt/vsl/ e /ddt/v9/
   1. contador da barra do topo (CONFIG.inicio);
   2. faixa de depoimentos que anda sozinha (duplica as imagens pra emendar o fim no começo).
   ============================================= */
(function () {
  var cfg = typeof CONFIG !== 'undefined' ? CONFIG : {};

  /* ---------- contador ---------- */
  var cont = document.querySelector('[data-contador]');
  var alvo = cfg.inicio ? new Date(cfg.inicio).getTime() : NaN;
  if (cont && !isNaN(alvo)) {
    var partes = {
      d: cont.querySelector('[data-d]'), h: cont.querySelector('[data-h]'),
      m: cont.querySelector('[data-m]'), s: cont.querySelector('[data-s]'),
    };
    var dois = function (n) { return String(n).padStart(2, '0'); };
    var bate = function () {
      var falta = Math.max(0, Math.floor((alvo - Date.now()) / 1000));
      partes.d.textContent = dois(Math.floor(falta / 86400));
      partes.h.textContent = dois(Math.floor(falta % 86400 / 3600));
      partes.m.textContent = dois(Math.floor(falta % 3600 / 60));
      partes.s.textContent = dois(falta % 60);
      if (!falta) clearInterval(relogio);
    };
    var relogio = setInterval(bate, 1000);
    bate();
  }

  /* ---------- faixa de depoimentos ---------- */
  var trilho = document.querySelector('.faixa-dep__trilho');
  if (trilho && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.prototype.slice.call(trilho.children).forEach(function (el) {
      var copia = el.cloneNode(true);
      copia.setAttribute('aria-hidden', 'true');
      if (copia.tagName === 'IMG') copia.alt = '';
      trilho.appendChild(copia);
    });
    trilho.classList.add('anda');
  }
})();
