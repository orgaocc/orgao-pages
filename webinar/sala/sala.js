/* =============================================
   SALA — demonstração de webinar evergreen sem WebinarJam (12/11/2026)
   A sala lê a hora da sessão (do localStorage da inscrição, ou da URL) e:
   - antes da hora: contagem regressiva, abre sozinha;
   - na hora: dá play no vídeo gravado já no minuto certo (quem entra atrasado pega do meio), sem controles;
   - no minuto da oferta: o cartão de oferta aparece;
   - no fim do vídeo: sessão encerrada, sem replay.
   Presença: a cada minuto assistido a sala guardaria um sinal (aqui só registra no console; de verdade vai pro n8n/Supabase).
   URL: ?h=2026-11-12T10:45:00-03:00&t=WPJ-XXXX  |  ?demo=antes|aovivo|oferta|fim
   ============================================= */
(function () {
  var cfg = typeof CONFIG !== 'undefined' ? CONFIG : {};
  var sala = cfg.sala || {};
  var VIDEO = sala.video_url || '';
  var DURACAO = (sala.duracao_minutos || 60) * 60;      /* segundos; de verdade vem do vídeo (loadedmetadata) */
  var OFERTA_EM = (sala.oferta_minuto || 45) * 60;
  var params = new URLSearchParams(location.search);
  var demo = params.get('demo');

  function pad(n) { return String(n).padStart(2, '0'); }
  function q(s) { return document.querySelector(s); }
  function todos(s, f) { document.querySelectorAll(s).forEach(f); }

  /* ---------- quando é a sessão ---------- */
  var ingresso = params.get('t');
  var inicio = null;
  try {
    ingresso = ingresso || localStorage.getItem('ticket');
    var h = params.get('h') || localStorage.getItem('schedule');
    if (h) inicio = new Date(h);
  } catch (_) {}

  if (demo) {
    var agora = Date.now();
    if (demo === 'antes') inicio = new Date(agora + 5 * 60000 + 3000);
    if (demo === 'aovivo') inicio = new Date(agora - 90 * 1000);
    if (demo === 'oferta') inicio = new Date(agora - OFERTA_EM * 1000 - 5000);
    if (demo === 'fim') inicio = new Date(agora - DURACAO * 1000 - 60000);
    ingresso = ingresso || 'WPJ-DEMO1234';
    q('#demo-barra').hidden = false;
  }

  if (!inicio || isNaN(inicio.getTime())) { location.replace('../'); return; }

  /* ---------- textos fixos ---------- */
  todos('[data-hora-sessao]', function (el) { el.textContent = pad(inicio.getHours()) + ':' + pad(inicio.getMinutes()); });
  todos('[data-data-sessao]', function (el) { el.textContent = pad(inicio.getDate()) + '/' + pad(inicio.getMonth() + 1); });
  todos('[data-ingresso]', function (el) { el.textContent = ingresso || '—'; });
  if (sala.titulo) todos('[data-titulo-sessao]', function (el) { el.textContent = sala.titulo; });

  var numero = (cfg.whatsapp || '').replace(/\D/g, '');
  var msg = 'Estou na sala (' + (ingresso || '') + ') e tenho uma pergunta: ';
  q('[data-link-whatsapp]').href = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(msg);
  q('[data-link-oferta]').href = sala.link_oferta || '#';

  /* ---------- estados ---------- */
  var estadoAtual = null;
  var video = q('#video');
  var botaoSom = q('#video-som');
  var inicioAssistindo = null;
  var minutosRegistrados = 0;

  function mostrar(estado) {
    if (estado === estadoAtual) return;
    estadoAtual = estado;
    todos('[data-estado]', function (el) { el.hidden = el.dataset.estado !== estado; });
    q('#status').className = 'sala-status ' + estado;
    if (estado === 'aovivo') entrarAoVivo();
    if (estado === 'fim') { try { video.pause(); } catch (_) {} }
  }

  function segundosDesdeInicio() { return (Date.now() - inicio.getTime()) / 1000; }

  function entrarAoVivo() {
    inicioAssistindo = Date.now();
    if (!VIDEO) return;
    video.src = VIDEO;
    video.addEventListener('loadedmetadata', function () {
      if (isFinite(video.duration) && video.duration > 0) DURACAO = video.duration;
      sincronizar();
      video.play().catch(function () {});
    }, { once: true });
    /* autoplay só funciona mudo; o toque libera o som */
    botaoSom.hidden = false;
    botaoSom.addEventListener('click', function () {
      video.muted = false;
      sincronizar();
      video.play().catch(function () {});
      botaoSom.hidden = true;
    });
    video.load();
  }

  /* quem entra atrasado pega do minuto certo; se o vídeo atrasar, volta pro ponto */
  function sincronizar() {
    var alvo = segundosDesdeInicio();
    if (alvo < 0) alvo = 0;
    if (Math.abs(video.currentTime - alvo) > 2) {
      try { video.currentTime = alvo; } catch (_) {}
    }
  }

  function registrarPresenca() {
    if (!inicioAssistindo) return;
    var min = Math.floor((Date.now() - inicioAssistindo) / 60000);
    q('[data-assistindo]').textContent = min + ' min';
    if (min > minutosRegistrados) {
      minutosRegistrados = min;
      /* de verdade: POST pro webhook de presença {ingresso, minuto_da_sessao, minutos_assistidos} */
      console.log('[presença]', ingresso, 'minuto da sessão', Math.floor(segundosDesdeInicio() / 60), 'assistiu', min, 'min');
    }
  }

  function contagem(seg) {
    var s = Math.max(0, Math.floor(seg));
    q('[data-c-h]').textContent = pad(Math.floor(s / 3600));
    q('[data-c-m]').textContent = pad(Math.floor((s % 3600) / 60));
    q('[data-c-s]').textContent = pad(s % 60);
  }

  function tique() {
    var t = segundosDesdeInicio();
    if (t < 0) { mostrar('antes'); contagem(-t); return; }
    if (t >= DURACAO) { mostrar('fim'); return; }
    mostrar('aovivo');
    if (video.src && !video.paused) sincronizar();
    q('#oferta').hidden = t < OFERTA_EM;
    registrarPresenca();
  }

  tique();
  setInterval(tique, 1000);
})();
