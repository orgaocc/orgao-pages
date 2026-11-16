/* =============================================
   Detox da Tentante — página que mostra só o vídeo e revela o resto num segundo do vídeo (CONFIG.revelar_segundos).
   Tudo que tem a classe "esconder" aparece quando o vídeo chega nesse segundo. Quem já viu uma vez vê tudo ao voltar.
   Testes: ?aos=10 (revela aos 10 s) e ?mostrar=1 (revela na hora).
   ============================================= */
(function () {
  var cfg = typeof CONFIG !== 'undefined' ? CONFIG : {};
  var q = new URLSearchParams(window.location.search);
  var seg = q.has('aos') ? Number(q.get('aos')) : Number(cfg.revelar_segundos || 0);
  var CHAVE = 'ddt_revelado:' + window.location.pathname;
  var feito = false;
  function mostrar() {
    if (feito) return;
    feito = true;
    Array.prototype.forEach.call(document.querySelectorAll('.esconder'), function (e) { e.classList.remove('esconder'); });
    try { localStorage.setItem(CHAVE, '1'); } catch (e) {}
  }
  var jaViu = false;
  try { jaViu = localStorage.getItem(CHAVE) === '1'; } catch (e) {}
  if (!(seg > 0) || q.get('mostrar') === '1' || (jaViu && !q.has('aos'))) { mostrar(); return; }
  // o player do vídeo informa o tempo assistido; confere duas vezes por segundo
  var relogio = setInterval(function () {
    var p = document.querySelector('vturb-smartplayer');
    var t = 0;
    try { t = p && typeof p.currentTime === 'number' ? p.currentTime : 0; } catch (e) {}
    if (t >= seg) { clearInterval(relogio); mostrar(); }
  }, 500);
})();
