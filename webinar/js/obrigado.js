/* =============================================
   OBRIGADO — confirmação pelo WhatsApp
   Lê o ingresso que a inscrição guardou no localStorage, monta o link do WhatsApp com a mensagem
   pronta e redireciona sozinho depois da contagem. Sem ingresso, mostra o estado de erro.
   ============================================= */
(function () {
  var cfg = typeof CONFIG !== 'undefined' ? CONFIG : {};

  /* evento pro GTM/pixel, uma vez só por inscrição */
  try {
    if (localStorage.getItem('eventStatus') === 'pending') {
      localStorage.setItem('eventStatus', 'sent');
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'working_lead',
        ticket: localStorage.getItem('ticket'),
        firstName: localStorage.getItem('firstName'),
        lastName: localStorage.getItem('lastName'),
        email: localStorage.getItem('email'),
        phone: localStorage.getItem('phone'),
      });
    }
  } catch (_) {}

  document.addEventListener('DOMContentLoaded', function () {
    var confirmar = document.querySelector('[data-estado-confirmar]');
    var erro = document.querySelector('[data-estado-erro]');
    var link = document.querySelector('[data-link-whatsapp]');
    var contador = document.querySelector('[data-contador]');
    var horarioEl = document.querySelector('[data-horario-escolhido]');
    var ingresso = null, horario = null;
    try { ingresso = localStorage.getItem('ticket'); horario = localStorage.getItem('schedule'); } catch (_) {}

    var prefixo = cfg.prefixo_ingresso || 'WPJ-';
    if (!ingresso || ingresso.indexOf(prefixo) !== 0) {
      if (erro) erro.hidden = false;
      return;
    }
    if (confirmar) confirmar.hidden = false;

    if (horarioEl && horario) {
      var d = new Date(horario);
      if (!isNaN(d.getTime())) {
        var pad = function (n) { return String(n).padStart(2, '0'); };
        horarioEl.textContent = pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + ' às ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + 'h';
      }
    }

    var numero = (cfg.whatsapp || '').replace(/\D/g, '');
    var texto = (cfg.mensagem_whatsapp || 'Quero confirmar minha inscrição. Meu ingresso é {ingresso}.').replace('{ingresso}', ingresso);
    var url = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);
    if (link) link.href = url;

    var s = cfg.segundos_para_redirecionar || 15;
    if (contador) contador.textContent = s;
    var t = setInterval(function () {
      s--;
      if (contador) contador.textContent = Math.max(0, s);
      if (s <= 0) { clearInterval(t); window.location.href = url; }
    }, 1000);
  });
})();
