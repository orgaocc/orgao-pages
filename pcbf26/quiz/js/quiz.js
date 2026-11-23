/* =============================================
   QUIZ — pcbf26/quiz
   Uma pergunta por tela, barra de progresso, toque na resposta e avança sozinho (menos nas de múltipla escolha
   e na identificação). Cada resposta vai pro n8n (evento "passo") e fica no navegador, pra quem fechar a página
   voltar de onde parou. A identificação (nome, e-mail, WhatsApp) é a última tela.
   ============================================= */
(function () {
  var CHAVE = 'pcbf26_quiz_v1';
  var TOTAL = PERGUNTAS.length + 1; // 15 perguntas + identificação
  var UTMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];

  /* ---------- estado (com try/catch: navegador anônimo pode recusar o localStorage) ---------- */
  function novoSid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  }
  function ler() { try { return JSON.parse(localStorage.getItem(CHAVE)) || null; } catch (e) { return null; } }
  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {} }

  var params = new URLSearchParams(location.search);
  var estado = ler();
  if (!estado || !estado.sid) estado = { sid: novoSid(), idx: 0, respostas: {}, utm: {} };
  // UTM da visita atual vale mais que a guardada (novo disparo, nova origem)
  var temUtm = UTMS.some(function (k) { return params.get(k); });
  if (temUtm || !estado.utm) { estado.utm = {}; UTMS.forEach(function (k) { if (params.get(k)) estado.utm[k] = params.get(k).slice(0, 200); }); }
  salvar();

  var $ = function (id) { return document.getElementById(id); };
  var abertura = $('abertura'), quiz = $('quiz'), tela = $('tela'), montando = $('montando');

  /* ---------- envio de eventos (não segura a tela) ---------- */
  function post(url, corpo) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo), keepalive: true });
  }
  function evento(tipo, extra) {
    var corpo = Object.assign({ sid: estado.sid, tipo: tipo }, estado.utm, extra || {});
    post(CONFIG.evento, corpo).catch(function () {});
  }

  /* ---------- abertura ---------- */
  if (estado.concluido) {
    var ver = $('ver-plano');
    ver.hidden = false;
    ver.href = CONFIG.carta + '?id=' + encodeURIComponent(estado.concluido);
  }
  $('comecar').addEventListener('click', function () {
    if (estado.concluido) { estado = { sid: novoSid(), idx: 0, respostas: {}, utm: estado.utm }; salvar(); }
    abertura.hidden = true; quiz.hidden = false;
    mostrar(Math.min(estado.idx || 0, TOTAL - 1));
    window.scrollTo(0, 0);
  });
  $('voltar').addEventListener('click', function () { if (estado.idx > 0) mostrar(estado.idx - 1); });

  /* ---------- telas ---------- */
  function progresso(i) {
    $('barra').firstElementChild.style.width = (i / TOTAL * 100) + '%';
    $('barra').setAttribute('aria-valuenow', String(i));
    $('contador').textContent = (i + 1) + ' de ' + TOTAL;
    $('voltar').disabled = i === 0;
  }

  function mostrar(i) {
    estado.idx = i; salvar();
    progresso(i);
    tela.classList.remove('entra'); void tela.offsetWidth; tela.classList.add('entra');
    if (i >= PERGUNTAS.length) return identificacao();
    var p = PERGUNTAS[i];
    var atual = estado.respostas[p.id];
    var marcadas = p.multipla ? (Array.isArray(atual) ? atual.slice() : []) : null;

    tela.innerHTML = '';
    var bloco = el('span', 'bloco', p.bloco);
    var h = el('h2', '', p.pergunta); h.id = 'pergunta';
    tela.appendChild(bloco); tela.appendChild(h);
    if (p.ajuda) tela.appendChild(el('p', 'ajuda', p.ajuda));

    var lista = el('div', 'opcoes' + (p.multipla ? ' multipla' : ''));
    lista.setAttribute('role', p.multipla ? 'group' : 'radiogroup');
    lista.setAttribute('aria-labelledby', 'pergunta');
    var botoes = [];
    p.opcoes.forEach(function (o) {
      var valor = o[0], rotulo = o[1], exclusiva = !!o[2];
      var b = el('button', 'opcao');
      b.type = 'button';
      b.setAttribute('role', p.multipla ? 'checkbox' : 'radio');
      b.setAttribute('aria-checked', String(p.multipla ? marcadas.indexOf(valor) !== -1 : atual === valor));
      b.appendChild(el('span', 'marca')); b.appendChild(el('span', '', rotulo));
      b.addEventListener('click', function () {
        if (!p.multipla) {
          botoes.forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
          responder(p, valor);
          setTimeout(function () { mostrar(i + 1); window.scrollTo(0, 0); }, 220);
          return;
        }
        var pos = marcadas.indexOf(valor);
        if (pos !== -1) marcadas.splice(pos, 1);
        else if (exclusiva) marcadas = [valor];
        else {
          // marcar um sinal desmarca "nenhum"/"não sei"
          marcadas = marcadas.filter(function (v) { return !p.opcoes.some(function (x) { return x[0] === v && x[2]; }); });
          marcadas.push(valor);
        }
        botoes.forEach(function (x, k) { x.setAttribute('aria-checked', String(marcadas.indexOf(p.opcoes[k][0]) !== -1)); });
        seguir.disabled = !marcadas.length;
      });
      botoes.push(b); lista.appendChild(b);
    });
    tela.appendChild(lista);

    if (p.multipla) {
      var seguir = el('button', 'btn seguir', 'Continuar');
      seguir.type = 'button';
      seguir.disabled = !marcadas.length;
      seguir.addEventListener('click', function () {
        if (!marcadas.length) return;
        responder(p, marcadas.slice());
        mostrar(i + 1); window.scrollTo(0, 0);
      });
      tela.appendChild(seguir);
    }
  }

  function responder(p, valor) {
    estado.respostas[p.id] = valor; salvar();
    evento('passo', { passo: PERGUNTAS.indexOf(p) + 1, respostas: estado.respostas });
  }

  /* ---------- identificação (tela 16) ---------- */
  var DDDS = '11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(' ');
  function mascara(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }
  function telefoneOk(v) {
    var d = v.replace(/\D/g, '');
    if (DDDS.indexOf(d.slice(0, 2)) === -1) return false;
    return (d.length === 11 && d[2] === '9') || d.length === 10;
  }

  /* número completo "+DDI DDD número" (seletor de país do /shared/telefone.js); sem "+" é Brasil */
  function completo(v) {
    v = String(v || '').trim();
    if (!v) return '';
    if (v.charAt(0) === '+') return '+' + v.replace(/\D/g, '');
    return '+55' + v.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
  }

  function identificacao() {
    var dados = estado.dados || {};
    tela.innerHTML =
      '<span class="bloco">Último passo</span>' +
      '<h2 id="pergunta">Para onde eu envio o seu plano?</h2>' +
      '<form class="campos" id="form-plano" novalidate>' +
        campo('f-nome', 'Seu nome', 'text', 'name', 'Como você se chama?') +
        campo('f-email', 'Seu e-mail', 'email', 'email', 'seu@email.com') +
        campo('f-tel', 'Seu WhatsApp com DDD', 'tel', 'tel', '(00) 00000-0000') +
        '<div class="escondido" aria-hidden="true"><label for="f-empresa">Empresa</label><input id="f-empresa" name="company" tabindex="-1" autocomplete="off"></div>' +
        '<button type="submit" class="btn seguir" id="enviar">Receber meu plano</button>' +
        '<p class="seguro"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>Os seus dados ficam protegidos com a nossa equipe</p>' +
        '<p class="aviso-erro" id="aviso" role="alert" hidden></p>' +
      '</form>';
    var fNome = $('f-nome'), fEmail = $('f-email'), fTel = $('f-tel');
    fNome.value = dados.nome || params.get('name') || params.get('nome') || '';
    fEmail.value = dados.email || params.get('email') || '';
    var telUrl = completo(dados.whatsapp || params.get('phone') || params.get('whatsapp') || '');
    if (telUrl && window.TelPais) TelPais.preencher(fTel, telUrl);
    else if (telUrl) fTel.value = mascara(telUrl.replace(/\D/g, '').slice(2));
    fTel.addEventListener('input', function () { if (!this.dataset.telPais) this.value = mascara(this.value); });
    [fNome, fEmail, fTel].forEach(function (f) { f.addEventListener('input', function () { limparErro(f); }); });
    setTimeout(function () { (fNome.value ? (fEmail.value ? fTel : fEmail) : fNome).focus({ preventScroll: true }); }, 50);

    $('form-plano').addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = fNome.value.trim(), email = fEmail.value.trim(), tel = fTel.value;
      var valido = true;
      if (nome.length < 2) { erro(fNome, 'Escreva o seu nome.'); valido = false; }
      if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) { erro(fEmail, 'Confira o seu e-mail: falta algum pedaço.'); valido = false; }
      var numero = window.TelPais ? TelPais.numero(fTel) : (telefoneOk(tel) ? '+55' + tel.replace(/\D/g, '') : '');
      if (!numero) { erro(fTel, 'Confira o DDD e o número do seu WhatsApp.'); valido = false; }
      if (!valido) { var primeiro = tela.querySelector('[aria-invalid="true"]'); if (primeiro) primeiro.focus(); return; }
      estado.dados = { nome: nome, email: email, whatsapp: numero, ddi: window.TelPais ? TelPais.ddi(fTel) : '55' }; salvar();
      enviar($('f-empresa').value);
    });
  }

  function campo(id, rotulo, tipo, auto, ph) {
    return '<div class="campo"><label for="' + id + '">' + rotulo + '</label>' +
      '<input id="' + id + '" type="' + tipo + '" autocomplete="' + auto + '" placeholder="' + ph + '"' + (tipo === 'tel' ? ' inputmode="tel"' : '') + ' required aria-describedby="' + id + '-erro">' +
      '<span class="erro" id="' + id + '-erro" hidden></span></div>';
  }
  function erro(f, msg) { f.setAttribute('aria-invalid', 'true'); var s = $(f.id + '-erro'); s.textContent = msg; s.hidden = false; }
  function limparErro(f) { f.removeAttribute('aria-invalid'); $(f.id + '-erro').hidden = true; }

  var MENSAGENS = {
    nomeInvalido: 'Confira o seu nome.', emailInvalido: 'Confira o seu e-mail.', telefoneInvalido: 'Confira o seu WhatsApp com DDD.',
    respostaFaltando: 'Faltou responder uma pergunta. Volte e confira, por favor.',
  };

  function enviar(robo) {
    var botao = $('enviar'), aviso = $('aviso');
    botao.disabled = true; aviso.hidden = true;
    quiz.hidden = true; montando.hidden = false; window.scrollTo(0, 0);
    var corpo = Object.assign({ sid: estado.sid, respostas: estado.respostas, utm_page: location.pathname, company: robo || '' }, estado.utm, {
      nome: estado.dados.nome, email: estado.dados.email, whatsapp: estado.dados.whatsapp, ddi: estado.dados.ddi || '55',
    });
    post(CONFIG.enviar, corpo)
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok || !res.j.ok) throw new Error(res.j.code || 'erroServidor');
        estado.concluido = res.j.id || estado.sid; salvar();
        // a carta usa esses dados pra deixar o checkout preenchido (ficam só neste navegador)
        try { sessionStorage.setItem('pcbf26_comprador', JSON.stringify(estado.dados)); localStorage.setItem('pcbf26_comprador', JSON.stringify(estado.dados)); } catch (e) {}
        var destino = CONFIG.carta + '?id=' + encodeURIComponent(estado.concluido);
        var q = new URLSearchParams();
        UTMS.forEach(function (k) { if (estado.utm[k]) q.set(k, estado.utm[k]); });
        location.href = destino + (q.toString() ? '&' + q.toString() : '');
      })
      .catch(function (e) {
        montando.hidden = true; quiz.hidden = false;
        botao.disabled = false;
        var code = e && e.message;
        if (code === 'respostaFaltando') { mostrar(0); return; }
        aviso.textContent = MENSAGENS[code] || 'Não consegui enviar agora. Confira a sua internet e toque em "Receber meu plano" de novo.';
        aviso.hidden = false;
      });
  }

  function el(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto) e.textContent = texto;
    return e;
  }

  // já tinha começado neste navegador: o botão retoma da pergunta onde parou
  if (!estado.concluido && estado.idx > 0) {
    $('comecar').textContent = 'Continuar de onde parei';
  }
})();
