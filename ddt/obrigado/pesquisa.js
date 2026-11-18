/* =============================================
   Pesquisa do Detox na própria página, uma pergunta por tela.
   Envia pro mesmo Fluent Forms (formulário 102 do forms.grupoconceber.com), no mesmo formato
   que a pesquisa conversacional do WordPress manda: assim a entrada e as integrações (Dash etc.)
   continuam iguais. O retorno não dá pra ler (outro domínio, sem CORS), então o envio é "no-cors".
   ============================================= */
(function () {
  var CFG = {
    envio: 'https://forms.grupoconceber.com/wp-admin/admin-ajax.php',
    formId: 102,
    grupo: 'https://sndflw.com/i/pct58-ddt',
    // ?teste=1 monta tudo mas não envia (pra conferir sem criar entrada)
    teste: /[?&]teste=1\b/.test(location.search)
  };
  var P = window.PESQUISA_PERGUNTAS || [];
  var raiz = document.querySelector('[data-pesquisa]');
  if (!raiz || !P.length) return;

  var LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var respostas = {};
  var atual = -1; // -1 = abertura, P.length = enviar, P.length + 1 = pronto
  var barra = document.querySelector('[data-pesquisa-barra]');
  var contagem = document.querySelector('[data-pesquisa-contagem]');

  // e-mail que vier no endereço (Hotmart e afins) já entra preenchido
  var qs = new URLSearchParams(location.search);
  var emailUrl = qs.get('email') || qs.get('buyer_email') || qs.get('em') || '';
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailUrl)) respostas.email = emailUrl;

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function progresso() {
    var feitas = Math.max(0, Math.min(atual, P.length));
    if (barra) barra.style.width = Math.round((feitas / P.length) * 100) + '%';
    if (contagem) contagem.textContent = atual >= 0 && atual < P.length ? (atual + 1) + ' de ' + P.length : '';
  }

  function trocar(conteudo, voltando) {
    raiz.innerHTML = '';
    conteudo.classList.add(voltando ? 'pq-entra-volta' : 'pq-entra');
    raiz.appendChild(conteudo);
    progresso();
    var foco = conteudo.querySelector('[data-foco]');
    if (foco && window.matchMedia('(min-width: 721px)').matches) foco.focus({ preventScroll: true });
  }

  function erro(tela, msg) {
    var e = tela.querySelector('.pq-erro');
    e.textContent = msg;
    e.hidden = !msg;
  }

  function botaoOk(texto, acao) {
    var b = el('button', 'pq-ok', texto || 'OK');
    b.type = 'button';
    b.addEventListener('click', acao);
    return b;
  }

  function voltar() {
    if (atual > -1) mostrar(atual - 1, true);
  }

  function rodapeTela(tela, acao, textoOk) {
    var linha = el('div', 'pq-acoes');
    if (acao) linha.appendChild(botaoOk(textoOk, acao));
    if (atual > 0) {
      var v = el('button', 'pq-voltar', 'Voltar');
      v.type = 'button';
      v.addEventListener('click', voltar);
      linha.appendChild(v);
    }
    tela.appendChild(linha);
    var e = el('p', 'pq-erro');
    e.hidden = true;
    e.setAttribute('role', 'alert');
    tela.appendChild(e);
  }

  function abertura() {
    var t = el('div', 'pq-tela pq-abertura');
    t.appendChild(el('h2', 'pq-abertura-titulo', 'Detox da Tentante'));
    var p1 = el('p');
    p1.appendChild(document.createTextNode('Para saber a melhor maneira de ajudar você e todas as mulheres que querem ser mãe, gostaríamos de te conhecer um pouquinho mais e entender o que você espera do nosso '));
    var b = el('strong', null, 'Detox da Tentante');
    p1.appendChild(b);
    t.appendChild(p1);
    t.appendChild(el('p', 'pq-assinatura', 'Um beijo carinhoso, Dra Talita Melo.'));
    var linha = el('div', 'pq-acoes pq-acoes--centro');
    var c = botaoOk('Começar', function () { mostrar(0); });
    c.setAttribute('data-foco', '');
    linha.appendChild(c);
    t.appendChild(linha);
    return t;
  }

  function pergunta(i) {
    var q = P[i];
    var t = el('div', 'pq-tela');
    var cab = el('p', 'pq-num');
    cab.innerHTML = '<span>' + (i + 1) + '</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    t.appendChild(cab);
    var tit = el('h2', 'pq-titulo', q.titulo);
    if (q.obrigatoria) tit.appendChild(el('span', 'pq-req', '*'));
    t.appendChild(tit);

    var avancar;

    if (q.tipo === 'email' || q.tipo === 'texto') {
      var inp = el('input', 'pq-campo');
      inp.type = q.tipo === 'email' ? 'email' : 'text';
      if (q.tipo === 'email') { inp.autocomplete = 'email'; inp.inputMode = 'email'; inp.placeholder = 'nome@exemplo.com'; }
      else inp.placeholder = 'Digite a sua resposta aqui';
      inp.value = respostas[q.nome] || '';
      inp.setAttribute('data-foco', '');
      t.appendChild(inp);
      avancar = function () {
        var v = inp.value.trim();
        if (q.obrigatoria && !v) return erro(t, 'Esse campo é obrigatório.');
        if (q.tipo === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return erro(t, 'Digite um e-mail válido.');
        respostas[q.nome] = v || null;
        mostrar(i + 1);
      };
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); avancar(); } });
      inp.addEventListener('input', function () { erro(t, ''); });
      rodapeTela(t, avancar);
      return t;
    }

    if (q.tipo === 'radio' || q.tipo === 'checkbox') {
      var multi = q.tipo === 'checkbox';
      var lista = el('div', 'pq-opcoes' + (q.opcoes.length > 10 ? ' pq-opcoes--grade' : ''));
      lista.setAttribute('role', multi ? 'group' : 'radiogroup');
      var marcadas = multi ? (respostas[q.nome] || []).slice() : null;
      q.opcoes.forEach(function (op, k) {
        var b = el('button', 'pq-opcao');
        b.type = 'button';
        b.setAttribute(multi ? 'aria-pressed' : 'aria-checked', 'false');
        if (!multi) b.setAttribute('role', 'radio');
        if (k === 0) b.setAttribute('data-foco', '');
        var letra = el('span', 'pq-letra', LETRAS[k] || '');
        b.appendChild(letra);
        b.appendChild(el('span', 'pq-opcao-texto', op));
        var sel = multi ? marcadas.indexOf(op) > -1 : respostas[q.nome] === op;
        if (sel) { b.classList.add('marcada'); b.setAttribute(multi ? 'aria-pressed' : 'aria-checked', 'true'); }
        b.addEventListener('click', function () {
          erro(t, '');
          if (multi) {
            var pos = marcadas.indexOf(op);
            if (pos > -1) marcadas.splice(pos, 1); else marcadas.push(op);
            var on = marcadas.indexOf(op) > -1;
            b.classList.toggle('marcada', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
            return;
          }
          lista.querySelectorAll('.pq-opcao').forEach(function (x) { x.classList.remove('marcada'); x.setAttribute('aria-checked', 'false'); });
          b.classList.add('marcada');
          b.setAttribute('aria-checked', 'true');
          respostas[q.nome] = op;
          setTimeout(function () { mostrar(i + 1); }, 320);
        });
        lista.appendChild(b);
      });
      t.appendChild(lista);
      if (multi) {
        t.appendChild(el('p', 'pq-dica', 'Pode escolher mais de uma opção.'));
        avancar = function () {
          if (q.obrigatoria && !marcadas.length) return erro(t, 'Escolha pelo menos uma opção.');
          respostas[q.nome] = marcadas.slice();
          mostrar(i + 1);
        };
      } else {
        avancar = function () {
          if (q.obrigatoria && !respostas[q.nome]) return erro(t, 'Escolha uma opção.');
          mostrar(i + 1);
        };
      }
      rodapeTela(t, avancar);
      return t;
    }

    if (q.tipo === 'escala') {
      var escala = el('div', 'pq-escala');
      for (var n = q.min; n <= q.max; n++) (function (n) {
        var b = el('button', 'pq-nota', String(n));
        b.type = 'button';
        if (respostas[q.nome] === n) b.classList.add('marcada');
        if (n === q.min) b.setAttribute('data-foco', '');
        b.addEventListener('click', function () {
          escala.querySelectorAll('.pq-nota').forEach(function (x) { x.classList.remove('marcada'); });
          b.classList.add('marcada');
          respostas[q.nome] = n;
          setTimeout(function () { mostrar(i + 1); }, 320);
        });
        escala.appendChild(b);
      })(n);
      t.appendChild(escala);
      var pontas = el('div', 'pq-escala-pontas');
      pontas.appendChild(el('span', null, String(q.min)));
      pontas.appendChild(el('span', null, String(q.max)));
      t.appendChild(pontas);
      avancar = function () {
        if (q.obrigatoria && respostas[q.nome] == null) return erro(t, 'Escolha uma opção.');
        mostrar(i + 1);
      };
      rodapeTela(t, avancar);
      return t;
    }
    return t;
  }

  // mesmo formato do conversationalForm.js do Fluent Forms (getData + extra_inputs + isFFConversational)
  function montarDados() {
    var partes = [];
    var cod = encodeURIComponent;
    P.forEach(function (q) {
      var v = respostas[q.nome];
      if (q.tipo === 'checkbox') {
        if (!v || !v.length) return partes.push(cod(q.nome + '[]') + '=');
        v.forEach(function (x) { partes.push(cod(q.nome + '[]') + '=' + cod(x)); });
        return;
      }
      if (v == null || v === '') {
        if (q.tipo === 'radio') partes.push(cod(q.nome) + '=');
        return;
      }
      partes.push(cod(q.nome) + '=' + cod(v));
    });
    partes.push('observacao=');
    partes.push(cod('__fluent_form_embded_post_id') + '=false');
    partes.push(cod('_wp_http_referer') + '=' + cod('/?fluent-form=102&embedded=1'));
    partes.push('isFFConversational=true');
    return partes.join('&');
  }

  function enviar(tela, botao) {
    botao.disabled = true;
    botao.textContent = 'Enviando...';
    erro(tela, '');
    var fd = new FormData();
    fd.append('action', 'fluentform_submit');
    fd.append('data', montarDados());
    fd.append('form_id', String(CFG.formId));
    window.__pesquisaEnviada = { data: fd.get('data'), teste: CFG.teste };
    var envio = CFG.teste
      ? Promise.resolve()
      : fetch(CFG.envio + '?t=' + Date.now(), { method: 'POST', mode: 'no-cors', body: fd, keepalive: true });
    envio.then(function () {
      mostrar(P.length + 1);
    }).catch(function () {
      botao.disabled = false;
      botao.textContent = 'Enviar Respostas';
      erro(tela, 'Não conseguimos enviar agora. Confira a sua internet e tente de novo.');
    });
  }

  function telaEnviar() {
    var t = el('div', 'pq-tela pq-fim');
    t.appendChild(el('h2', 'pq-titulo', 'Tudo certo com as suas respostas?'));
    t.appendChild(el('p', 'pq-dica', 'Se quiser mudar alguma, é só voltar.'));
    var linha = el('div', 'pq-acoes');
    var b = botaoOk('Enviar Respostas');
    b.setAttribute('data-foco', '');
    b.addEventListener('click', function () { enviar(t, b); });
    linha.appendChild(b);
    var v = el('button', 'pq-voltar', 'Voltar');
    v.type = 'button';
    v.addEventListener('click', voltar);
    linha.appendChild(v);
    t.appendChild(linha);
    var e = el('p', 'pq-erro');
    e.hidden = true;
    e.setAttribute('role', 'alert');
    t.appendChild(e);
    return t;
  }

  function telaPronto() {
    var t = el('div', 'pq-tela pq-pronto');
    var ok = el('span', 'pq-pronto-ok');
    ok.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5"/></svg>';
    t.appendChild(ok);
    t.appendChild(el('h2', 'pq-titulo', 'Inscrição confirmada!'));
    t.appendChild(el('p', null, 'Agora entre no grupo exclusivo de whatsapp do Detox da Tentante.'));
    var linha = el('div', 'pq-acoes pq-acoes--centro');
    var a = el('a', 'pq-ok pq-grupo');
    a.href = CFG.grupo;
    a.innerHTML = '<svg aria-hidden="true"><use href="#i-wpp"/></svg>Entrar no grupo';
    a.setAttribute('data-foco', '');
    linha.appendChild(a);
    t.appendChild(linha);
    return t;
  }

  function mostrar(i, voltando) {
    atual = i;
    if (i < 0) return trocar(abertura(), voltando);
    if (i < P.length) return trocar(pergunta(i), voltando);
    if (i === P.length) return trocar(telaEnviar(), voltando);
    trocar(telaPronto(), voltando);
    if (barra) barra.style.width = '100%';
  }

  mostrar(-1);
})();
