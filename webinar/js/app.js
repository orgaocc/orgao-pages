/* =============================================
   WEBINAR — horários de 15 em 15 minutos + inscrição
   Mesma mecânica da página webinar.isalatuf.com.br (JS lido em 12/11/2026):
   1. a lista de horários tem um "Agora" (próximo múltiplo de 15 min, no horário de Brasília)
      e os horários fixos dos próximos dias, até completar `quantos_horarios`;
   2. o formulário manda nome, e-mail, WhatsApp e o horário (ISO com -03:00) pro webhook do n8n;
   3. o n8n inscreve a pessoa no webinar e devolve { ticket, name, email, phone };
   4. a página guarda o ingresso no localStorage e vai pra obrigado/, que abre o WhatsApp.
   ============================================= */
(function () {
  var cfg = typeof CONFIG !== 'undefined' ? CONFIG : {};
  var FUSO = cfg.fuso_horas != null ? cfg.fuso_horas : -3;
  var OFFSET = FUSO * 3600000;
  var INTERVALO = cfg.intervalo_minutos || 15;
  var MOSTRAR = cfg.quantos_horarios || 3;
  var FIXOS = cfg.horarios_fixos || [];
  var FERIADOS = cfg.feriados || [];

  var MENSAGENS = {
    horarioInvalido: 'Horário inválido. Atualize a página e escolha de novo.',
    nomeInvalido: 'Digite seu nome.',
    emailInvalido: 'Digite um e-mail válido.',
    telefoneInvalido: 'Digite um WhatsApp válido, com DDD.',
    erroServidor: 'Não deu pra concluir sua inscrição agora. Tente de novo em instantes.',
    processando: 'Processando...',
    sucesso: 'Inscrição feita! Só mais um passo...',
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  /* ---------- relógio de Brasília ----------
     Desloca o Date pelo fuso e lê com getUTC*: assim o cálculo não depende do fuso do navegador. */
  function emBrasilia(d) { return new Date(d.getTime() + OFFSET); }
  function deBrasilia(b) { return new Date(b.getTime() - OFFSET); }
  function diaIso(b) { return b.getUTCFullYear() + '-' + pad(b.getUTCMonth() + 1) + '-' + pad(b.getUTCDate()); }
  function fusoTexto() { return (FUSO < 0 ? '-' : '+') + pad(Math.abs(FUSO)) + ':00'; }
  function iso(d) {
    var b = emBrasilia(d);
    return diaIso(b) + 'T' + pad(b.getUTCHours()) + ':' + pad(b.getUTCMinutes()) + ':00' + fusoTexto();
  }
  function ehFeriado(d) { return FERIADOS.indexOf(diaIso(emBrasilia(d))) !== -1; }

  /* próximo múltiplo do intervalo, pelo menos 1 minuto à frente */
  function proximoAgora(agora) {
    var b = emBrasilia(agora);
    b.setUTCSeconds(0, 0);
    b.setUTCMinutes(Math.ceil((b.getUTCMinutes() + 1) / INTERVALO) * INTERVALO);
    return deBrasilia(b);
  }

  /* cada horário fixo nos próximos dias, pulando feriados */
  function horariosFixos(agora, porHorario) {
    var lista = [];
    var limite = emBrasilia(agora).getTime();
    FIXOS.forEach(function (hm) {
      var partes = hm.split(':');
      var b = emBrasilia(agora);
      b.setUTCHours(+partes[0], +partes[1], 0, 0);
      if (b.getTime() <= limite) b.setUTCDate(b.getUTCDate() + 1);
      var n = 0;
      while (n < porHorario) {
        var d = deBrasilia(b);
        if (!ehFeriado(d)) { lista.push(d); n++; }
        b.setUTCDate(b.getUTCDate() + 1);
      }
    });
    return lista;
  }

  function montarHorarios() {
    var agora = new Date();
    var itens = [];
    var jit = ehFeriado(agora) ? null : proximoAgora(agora);
    if (jit) itens.push({ data: jit, agora: true });
    var porHorario = Math.ceil(MOSTRAR / Math.max(FIXOS.length, 1)) + 1;
    horariosFixos(agora, porHorario).forEach(function (d) {
      if (!jit || iso(d) !== iso(jit)) itens.push({ data: d, agora: false });
    });
    itens.sort(function (a, b) { return a.data - b.data; });
    return itens.slice(0, MOSTRAR);
  }

  /* "[DIA DA SEMANA], [DATA], às [HORÁRIO]" (formato da copy), sempre no horário de Brasília */
  function textoSessao(d) {
    var b = emBrasilia(d);
    var dia = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'][b.getUTCDay()];
    var hora = b.getUTCHours() + 'h' + (b.getUTCMinutes() ? pad(b.getUTCMinutes()) : '');
    return dia + ', ' + pad(b.getUTCDate()) + '/' + pad(b.getUTCMonth() + 1) + ', às ' + hora;
  }

  function rotulo(item) {
    var agora = new Date();
    var d = item.data;
    var min = Math.max(1, Math.round((d - agora) / 60000));
    var h = Math.floor(min / 60), m = min % 60;
    var comeca = h > 0 ? 'Começa em ' + h + 'h ' + m + 'min' : 'Começa em ' + m + (m === 1 ? ' minuto' : ' minutos');
    return {
      titulo: (item.agora ? '<span class="hr-agora"><i></i>Agora</span> · ' : '') + textoSessao(d),
      texto: textoSessao(d),
      sub: comeca,
    };
  }

  /* ---------- dropdown de horários ---------- */
  function fecharTodos() {
    document.querySelectorAll('[data-horarios-menu]').forEach(function (m) { m.hidden = true; });
    document.querySelectorAll('[data-horarios-toggle]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }

  function renderHorarios(caixa) {
    var botao = caixa.querySelector('[data-horarios-toggle]');
    var menu = caixa.querySelector('[data-horarios-menu]');
    var campo = caixa.querySelector('input[name="schedule"]');
    var texto = botao.querySelector('span') || botao;
    var itens = montarHorarios();
    var valores = itens.map(function (i) { return iso(i.data); });

    menu.innerHTML = '';
    itens.forEach(function (item) {
      var r = rotulo(item);
      var opc = document.createElement('button');
      opc.type = 'button';
      opc.className = 'hr-opcao';
      opc.setAttribute('role', 'option');
      opc.innerHTML = '<span class="hr-titulo">' + r.titulo + '</span><small>' + r.sub + '</small>';
      opc.addEventListener('click', function () {
        campo.value = iso(item.data);
        texto.innerHTML = r.titulo;
        botao.classList.add('hr-escolhido');
        /* a data do selo do topo e da barra fixa acompanha o horário escolhido (pedido da Bruna, 18/11) */
        sessaoEscolhida = iso(item.data);
        mostrarSessao(r.texto);
      });
      menu.appendChild(opc);
    });

    /* o horário escolhido já passou? volta pro estado inicial */
    if (campo.value && valores.indexOf(campo.value) === -1) {
      campo.value = '';
      texto.textContent = botao.dataset.textoInicial;
      botao.classList.remove('hr-escolhido');
    }
    /* com caixa vazia (páginas da imersão), a primeira sessão já vem escolhida */
    if (!campo.value && !botao.dataset.textoInicial && itens.length) {
      var r0 = rotulo(itens[0]);
      campo.value = iso(itens[0].data);
      texto.innerHTML = r0.titulo;
      botao.classList.add('hr-escolhido');
    }
    /* linha "Imersão gratuita | Ao vivo | [DATA E HORÁRIO]" */
    if (itens.length) {
      var pos = valores.indexOf(sessaoEscolhida);
      mostrarSessao(rotulo(itens[pos > -1 ? pos : 0]).texto);
    }
  }

  var sessaoEscolhida = '';
  function mostrarSessao(texto) {
    document.querySelectorAll('[data-proxima-sessao]').forEach(function (el) { el.textContent = texto; });
  }

  function initHorarios() {
    var caixas = document.querySelectorAll('[data-horarios]');
    if (!caixas.length) return;
    caixas.forEach(function (caixa) {
      var botao = caixa.querySelector('[data-horarios-toggle]');
      var menu = caixa.querySelector('[data-horarios-menu]');
      botao.dataset.textoInicial = (botao.querySelector('span') || botao).textContent.trim();
      botao.addEventListener('click', function (e) {
        e.stopPropagation();
        var abrir = menu.hidden;
        fecharTodos();
        menu.hidden = !abrir;
        botao.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      });
      menu.addEventListener('click', function () { fecharTodos(); });
      renderHorarios(caixa);
    });
    document.addEventListener('click', fecharTodos);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharTodos(); });

    var cada = (cfg.atualizar_a_cada_segundos || 30) * 1000;
    setInterval(function () {
      caixas.forEach(function (caixa) {
        if (caixa.querySelector('[data-horarios-menu]').hidden) renderHorarios(caixa);
      });
    }, cada);
  }

  /* ---------- telefone ---------- */
  function mascara(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 7) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  /* ---------- UTMs (mesmo padrão do jpe/shared/app-core.js) ---------- */
  function utms() {
    var p = new URLSearchParams(window.location.search);
    return {
      utm_campaign: p.get('utm_campaign') || '',
      utm_source:   p.get('utm_source')   || 'direto_site',
      utm_medium:   p.get('utm_medium')   || 'direto_site',
      utm_content:  p.get('utm_content')  || 'direto_site',
      utm_term:     p.get('utm_term')     || 'direto_site',
      utm_id:       p.get('utm_id')       || '',
      xcod:         p.get('xcod')         || '',
      vk_source:    p.get('vk_source')    || '',
      vk_ad_id:     p.get('vk_ad_id')     || '',
    };
  }

  /* ---------- formulário ---------- */
  function aviso(form, tipo, chave) {
    var el = form.querySelector('[data-form-aviso]');
    if (!el) {
      el = document.createElement('p');
      el.setAttribute('data-form-aviso', '');
      form.appendChild(el);
    }
    el.className = 'form-aviso form-aviso--' + tipo;
    el.textContent = MENSAGENS[chave] || chave;
    el.hidden = false;
  }

  function travar(form, sim) {
    form.querySelectorAll('input, button').forEach(function (el) { el.disabled = sim; });
  }

  function limparNome(nome) {
    var n = (nome || '').replace(/[^\p{L}\s'-]/gu, ' ').replace(/\s+/g, ' ').trim();
    return n.split(' ').map(function (p) { return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase(); }).join(' ');
  }

  function horarioValido(valor) {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/.test(valor || '')) return false;
    var d = new Date(valor);
    return !isNaN(d.getTime()) && d.getTime() > Date.now();
  }

  function simularResposta(dados) {
    /* sem webhook_url configurado: a página roda sozinha pra teste de layout e fluxo */
    var hex = Math.random().toString(16).slice(2, 10).toUpperCase();
    return Promise.resolve({ status: 200, json: function () {
      return Promise.resolve({ ticket: (cfg.prefixo_ingresso || 'WPJ-') + hex, name: dados.name, email: dados.email, phone: dados.phone, simulado: true });
    } });
  }

  function enviar(e) {
    var form = e.target;
    if (!form.matches('[data-form-inscricao]')) return;
    e.preventDefault();

    var campos = Object.fromEntries(new FormData(form).entries());
    if (campos.company) return; /* robô preencheu o campo escondido */

    var nome = limparNome(campos.name);
    var email = (campos.email || '').trim();
    var digitos = (campos.phone || '').replace(/\D/g, '');

    if (!horarioValido(campos.schedule)) return aviso(form, 'erro', 'horarioInvalido');
    if (!nome) return aviso(form, 'erro', 'nomeInvalido');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return aviso(form, 'erro', 'emailInvalido');
    if (digitos.length < 10 || digitos.length > 11) return aviso(form, 'erro', 'telefoneInvalido');

    aviso(form, 'info', 'processando');
    travar(form, true);

    var u = utms();
    var dados = {
      schedule: campos.schedule,
      name: nome,
      email: email,
      phone: '+55' + digitos,
      utm_campaign: u.utm_campaign,
      utm_source: u.utm_source,
      utm_medium: u.utm_medium,
      utm_content: u.utm_content,
      utm_term: u.utm_term,
      utm_id: u.utm_id,
      xcod: u.xcod,
      vk_source: u.vk_source,
      vk_ad_id: u.vk_ad_id,
      utm_page: window.location.pathname,
      lancamento: cfg.lancamento || '',
      form: cfg.form || '',
      source: cfg.source || '',
    };

    var controle = new AbortController();
    var tempo = setTimeout(function () { controle.abort(); }, 8000);
    var pedido = cfg.webhook_url
      ? fetch(cfg.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dados, referrer: window.location.href }),
          signal: controle.signal,
        })
      : simularResposta(dados);

    var resposta;
    pedido
      .then(function (r) { clearTimeout(tempo); resposta = r; return r.json(); })
      .then(function (json) {
        if (resposta.status !== 200 || !json || !json.ticket) {
          aviso(form, 'erro', (json && MENSAGENS[json.code]) ? json.code : 'erroServidor');
          travar(form, false);
          return;
        }
        var partes = (json.name || nome).trim().split(/\s+/);
        try {
          localStorage.setItem('ticket', json.ticket);
          localStorage.setItem('firstName', (partes[0] || '').toLowerCase());
          localStorage.setItem('lastName', (partes.length > 1 ? partes[partes.length - 1] : '').toLowerCase());
          localStorage.setItem('email', (json.email || email).trim().toLowerCase());
          localStorage.setItem('phone', (json.phone || dados.phone).replace(/\D/g, ''));
          localStorage.setItem('schedule', campos.schedule);
          localStorage.setItem('eventStatus', 'pending');
        } catch (_) {}
        aviso(form, 'ok', 'sucesso');
        travar(form, false);
        setTimeout(function () { window.location.href = cfg.pagina_obrigado || 'obrigado/'; }, 500);
      })
      .catch(function () {
        aviso(form, 'erro', 'erroServidor');
        travar(form, false);
      });
  }

  function initForm() {
    document.addEventListener('input', function (e) {
      var el = e.target;
      if (el.name === 'phone' && el.closest('[data-form-inscricao]')) el.value = mascara(el.value);
    });
    document.addEventListener('submit', enviar);
  }

  /* ---------- modal e barra fixa ---------- */
  function initModal() {
    var modal = document.getElementById('modal-inscricao');
    if (!modal) return;
    document.querySelectorAll('[data-abrir-modal]').forEach(function (b) {
      b.addEventListener('click', function () { modal.showModal(); });
    });
    modal.querySelectorAll('[data-fechar-modal]').forEach(function (b) {
      b.addEventListener('click', function () { modal.close(); });
    });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
  }

  function initBarraFixa() {
    var barra = document.getElementById('barra-fixa');
    var hero = document.getElementById('hero');
    if (!barra || !hero) return;
    var aguardando = false;
    function olhar() {
      if (aguardando) return;
      aguardando = true;
      requestAnimationFrame(function () {
        var rodape = document.getElementById('rodape');
        var rodapeChegou = rodape && rodape.getBoundingClientRect().top < window.innerHeight;
        barra.classList.toggle('mostrar', hero.getBoundingClientRect().bottom < 0 && !rodapeChegou);
        aguardando = false;
      });
    }
    window.addEventListener('scroll', olhar, { passive: true });
    olhar();
  }

  /* ---------- carrossel de depoimentos: setas, barra de progresso e ampliar ---------- */
  function initPrints() {
    var trilho = document.querySelector('[data-prints]');
    if (!trilho) return;
    // mural: mostra uma parte e abre o resto no botão; se tudo já cabe, o botão some
    var mural = document.querySelector('[data-mural]');
    var acao = document.querySelector('[data-mural-acao]');
    var abrir = document.querySelector('[data-mural-abrir]');
    function conferirAltura() {
      if (!mural || !acao || mural.classList.contains('aberto')) return;
      var cabe = trilho.scrollHeight <= mural.clientHeight + 2;
      acao.hidden = cabe;
      mural.classList.toggle('cabe', cabe);
    }
    if (abrir) abrir.addEventListener('click', function () {
      mural.classList.add('aberto');
      acao.hidden = true;
    });
    window.addEventListener('resize', conferirAltura);
    window.addEventListener('load', conferirAltura);
    conferirAltura();

    var zoom = document.getElementById('zoom-print');
    if (!zoom) return;
    var zoomImg = zoom.querySelector('[data-zoom-img]');
    trilho.addEventListener('click', function (e) {
      var cel = e.target.closest('[data-zoom]');
      if (!cel) return;
      zoomImg.src = cel.getAttribute('data-zoom');
      zoomImg.alt = (cel.querySelector('img') || {}).alt || '';
      zoom.showModal();
    });
    zoom.addEventListener('click', function (e) { if (e.target === zoom || e.target.closest('[data-fechar-zoom]')) zoom.close(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPrints();
    initHorarios();
    initForm();
    initModal();
    initBarraFixa();
  });
})();
