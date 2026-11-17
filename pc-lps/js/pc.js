/* =============================================
   Programa Conceber (/pc-lps/) — comportamento da página
   1. mostra a versão da oferta do momento (CONFIG.estado) e preenche preço e link do assessor;
   2. faixas de depoimentos e de aulas que andam sozinhas (duplica as imagens pra emendar o fim no começo).
   ============================================= */
(function () {
  var cfg = typeof CONFIG !== 'undefined' ? CONFIG : null;

  /* ---------- oferta do momento ---------- */
  var aberta = document.querySelector('[data-estado="aberta"]');
  var espera = document.querySelector('[data-estado="espera"]');
  function whats(texto) { return 'https://api.whatsapp.com/send/?phone=' + cfg.whatsapp + '&text=' + encodeURIComponent(texto); }
  function aplicar() {
    var estado = cfg.estado_agora();
    var oferta = cfg.ofertas[estado];
    aberta.hidden = !oferta;
    espera.hidden = !!oferta;
    document.documentElement.setAttribute('data-oferta', estado);
    if (oferta) {
      aberta.querySelector('[data-preco="parcela"]').textContent = oferta.parcela;
      aberta.querySelector('[data-preco="avista"]').textContent = oferta.avista;
      aberta.querySelector('[data-assessor]').href = whats(oferta.assessor);
    } else {
      espera.querySelector('[data-lista]').href = cfg.espera.lista;
      espera.querySelector('[data-assessor-espera]').href = whats(cfg.espera.assessor);
    }
  }
  if (cfg && aberta && espera) {
    aplicar();
    setInterval(aplicar, 15000); // a página original também confere a cada 15 s
  }

  /* ---------- faixas ---------- */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-faixa] .faixa__trilho'), function (trilho) {
      Array.prototype.slice.call(trilho.children).forEach(function (el) {
        var copia = el.cloneNode(true);
        copia.setAttribute('aria-hidden', 'true');
        copia.alt = '';
        trilho.appendChild(copia);
      });
      trilho.classList.add('anda');
    });
  }
})();
