/* =============================================
   Detox da Tentante — página que mostra só o vídeo e revela o resto conforme o vídeo anda.
   Cada elemento com a classe "esconder" aparece quando o vídeo chega no segundo dele:
     data-quando="botao"  -> CONFIG.revelar.botao   (o botão de compra do topo)
     data-quando="oferta" -> CONFIG.revelar.oferta  (o resto da página, com a oferta)
     sem data-quando      -> CONFIG.revelar.oferta
   Quem já viu uma vez vê tudo ao voltar. Segundo 0 (ou sem valor) = aparece na hora.
   Testes: ?aos=10 (tudo aos 10 s) e ?mostrar=1 (tudo na hora).
   ============================================= */
(function () {
  var cfg = typeof CONFIG !== 'undefined' ? CONFIG : {};
  var tempos = cfg.revelar || {};
  var q = new URLSearchParams(window.location.search);
  var CHAVE = 'ddt_revelado:' + window.location.pathname;
  var teste = q.has('aos') ? Number(q.get('aos')) : null;
  function segundoDe(el) {
    if (teste !== null) return teste;
    var chave = el.getAttribute('data-quando') || 'oferta';
    return Number(tempos[chave] || 0);
  }
  var pendentes = Array.prototype.slice.call(document.querySelectorAll('.esconder'));
  function mostrar(el) { el.classList.remove('esconder'); }
  var jaViu = false;
  try { jaViu = localStorage.getItem(CHAVE) === '1'; } catch (e) {}
  if (q.get('mostrar') === '1' || (jaViu && teste === null)) { pendentes.forEach(mostrar); return; }
  function confere(t) {
    pendentes = pendentes.filter(function (el) {
      if (t >= segundoDe(el)) { mostrar(el); return false; }
      return true;
    });
    if (!pendentes.length) {
      clearInterval(relogio);
      try { localStorage.setItem(CHAVE, '1'); } catch (e) {}
    }
  }
  // o player do vídeo informa o tempo assistido; confere duas vezes por segundo
  var relogio = setInterval(function () {
    var p = document.querySelector('vturb-smartplayer');
    var t = 0;
    try { t = p && typeof p.currentTime === 'number' ? p.currentTime : 0; } catch (e) {}
    confere(t);
  }, 500);
  confere(0);
})();
