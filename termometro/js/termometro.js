/* =============================================
   TERMÔMETRO DA INTOXICAÇÃO — /termometro/
   Perguntas, pontos, faixas e textos: termometro-conteudo.md v3 da Elisa (22/11/2026). Sinais, pontes, provas e a
   lógica de tela: o protótipo dela. Acréscimo nosso: a tela de nome e WhatsApp antes do resultado, que manda
   nome, WhatsApp e faixa pro n8n (Unnichat com a tag da faixa) e não segura o resultado se o envio falhar.
   ============================================= */
(function () {
  var CHAVE = 'termometro_v1';
  var UTMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];

  var GROUPS = {
    entra: { label: 'O que entra no seu corpo', aula: 'segunda-feira, quando começamos o detox e eu explico o que tirar e o que incluir' },
    corpo: { label: 'O que o seu corpo mostra', aula: 'segunda-feira, quando você começa a observar cansaço, intestino e sono' },
    ciclo: { label: 'A sua menstruação', aula: 'terça-feira, a aula em que eu leio a sua menstruação: cor, fluxo e cólica' },
  };

  /* prova casada com o bloco em que ela mais pontuou */
  var PROOF = {
    ciclo: { title: 'No mês em que a borra sumiu, <em>ela engravidou.</em>', text: 'A Márcia tinha 42 anos e estava travada na fase da menstruação. Foi por ali que ela começou.', img: 'assets/prova-marcia.webp', alt: 'Márcia, 42 anos: fiz o detox, emagreci, e no mês que não veio mais borra, eu engravidei.' },
    entra: { title: 'Ela mudou o que entrava no corpo. <em>Grávida de 20 semanas.</em>', text: 'A Laís tinha antimülleriano de 0,21. Ela mudou o dia a dia, os produtos de beleza e a alimentação.', img: 'assets/prova-lais.webp', alt: 'Laís: mudei muita coisa, meu dia a dia, produtos de beleza, alimentação.' },
    corpo: { title: 'O corpo responde rápido. <em>Elas contam na primeira semana.</em>', text: 'Intestino, sono e inchaço são os primeiros sinais que eu peço para você observar no detox.', img: null },
  };

  /* opções: [texto, pontos]. w: 2 = vale em dobro (perguntas 7, 9 e 10). sinal: como aparece no resultado. ponte: onde entra no Detox */
  var QUESTIONS = [
    { g: 'entra', q: 'Quanta água você bebe por dia?', sinal: 'Pouca água ao longo do dia',
      ponte: 'No detox você calcula a sua quantidade de água pelo seu peso e organiza em duas garrafas por dia.',
      o: [['2 litros ou mais', 0], ['Entre 1 e 2 litros', 1], ['Menos de 1 litro', 2]] },
    { g: 'entra', q: 'Você toma café?', sinal: 'Café no dia a dia',
      ponte: 'O café sai por 7 dias, e a lista de substituições mostra o que entra no lugar.',
      o: [['Não tomo', 0], ['Às vezes', 1], ['Todos os dias', 2]] },
    { g: 'entra', q: 'Com que frequência você come industrializados?', hint: 'Embutidos, refrigerante, biscoito recheado, comida pronta.', sinal: 'Industrializados na rotina',
      ponte: 'O cardápio já vem pronto, com lista de compras e substituições. Você só segue.',
      o: [['Quase nunca', 0], ['Algumas vezes na semana', 1], ['Todos os dias', 2]] },
    { g: 'entra', q: 'Por quanto tempo você usou anticoncepcional hormonal?', sinal: 'Anos de anticoncepcional',
      ponte: 'Você conta isso no formulário da semana, e entra no seu relatório de domingo.',
      o: [['Nunca usei', 0], ['Menos de 5 anos', 1], ['5 anos ou mais', 2]] },

    { g: 'corpo', q: 'Você acorda cansada, mesmo dormindo a noite toda?', sinal: 'Acordar cansada',
      ponte: 'É um dos três sinais que eu peço para você acompanhar nos 7 dias: cansaço, intestino e sono.',
      o: [['Não', 0], ['Às vezes', 1], ['Quase sempre', 2]] },
    { g: 'corpo', q: 'Você termina o dia inchada ou com a barriga estufada?', sinal: 'Inchaço e barriga estufada',
      ponte: 'Você mede a cintura no primeiro dia e de novo no sétimo, para ver o quanto desinchou.',
      o: [['Não', 0], ['Às vezes', 1], ['Quase sempre', 2]] },
    { g: 'corpo', w: 2, q: 'Como funciona o seu intestino?', sinal: 'Intestino preso ou desregulado',
      ponte: 'É um dos três sinais que eu peço para você acompanhar nos 7 dias: cansaço, intestino e sono.',
      o: [['Funciona todos os dias', 0], ['Às vezes prende, ou tenho gases e estufamento', 1], ['Fico mais de um dia sem ir ao banheiro, ou alterno preso e solto', 2]] },
    { g: 'corpo', q: 'Como está o seu sono?', sinal: 'Sono ruim',
      ponte: 'É um dos três sinais que eu peço para você acompanhar nos 7 dias: cansaço, intestino e sono.',
      o: [['Durmo bem', 0], ['Às vezes demoro para dormir ou acordo no meio da noite', 1], ['Isso acontece quase toda noite', 2]] },

    { g: 'ciclo', w: 2, q: 'Aparece uma borrinha marrom, tipo borra de café, antes de a menstruação descer?', hint: 'Se você não está menstruando, responda pensando nas suas últimas menstruações.', sinal: 'Borra de café antes de menstruar',
      ponte: 'É o sinal mais clássico de oxidação. Na aula de terça eu explico de onde ela vem.',
      o: [['Não', 0], ['Sim, por 1 dia', 1], ['Sim, por 2 dias ou mais', 2]] },
    { g: 'ciclo', w: 2, q: 'Qual é a cor do sangue na maior parte dos dias?', sinal: 'Sangue escuro ou aguado',
      ponte: 'Na terça você aprende a ler a cor da sua menstruação.',
      o: [['Vermelho vivo', 0], ['Vermelho escuro, puxando para o marrom', 1], ['Marrom escuro, quase preto, ou rosa claro e aguado', 2]] },
    { g: 'ciclo', q: 'Saem coágulos na sua menstruação?', sinal: 'Coágulos na menstruação',
      ponte: 'Na terça eu explico o que os coágulos dizem sobre os seus hormônios.',
      o: [['Não', 0], ['Às vezes, pequenos', 1], ['Sim, em quase toda menstruação', 2]] },
    { g: 'ciclo', q: 'Como é a sua cólica?', sinal: 'Cólica que pede remédio',
      ponte: 'Menos cólica é um dos primeiros relatos das alunas na semana do detox.',
      o: [['Pouca ou nenhuma, não preciso de remédio', 0], ['Preciso de remédio de vez em quando', 1], ['Preciso de remédio todo mês, ou a dor me impede de trabalhar', 2]] },
  ];

  /* faixas do .md: 0-9 leve, 10-19 moderada, 20-30 alta. Título, texto, próximo passo e botão de cada uma */
  var RESULTS = {
    leve: { chip: 'Intoxicação leve', css: 'low', title: 'Poucos sinais por fora. <em>Falta olhar por dentro.</em>',
      text: 'Isso é bom, e eu não vou te assustar. Mas se o bebê ainda não veio e o seu corpo quase não dá sinal, a resposta não está no que você sente. Está nos seus exames, lidos com a régua de quem quer engravidar. Normal para o laboratório não é normal para gestar.',
      passo: 'No Detox da Tentante eu investigo isso com você. São 7 dias: você limpa o que ainda sobra com o cardápio, em casa, e a cada dia eu olho uma fase da sua fertilidade com os seus exames. No domingo você recebe o relatório da sua fertilidade, com o seu nome.',
      botao: 'Quero o meu relatório' },
    moderada: { chip: 'Intoxicação moderada', css: 'mid', title: 'O seu corpo <em>já está te avisando.</em>',
      text: 'Você marcou sinais em mais de um lugar. Na minha prática, isso costuma indicar um corpo que acumula mais do que elimina. O que intoxica inflama, e o que inflama oxida o óvulo e o endométrio, que é a terra onde o bebê precisa se implantar. Esses sinais não somem sozinhos. Mas são modificáveis, e o corpo responde rápido quando recebe a direção certa.',
      passo: 'O primeiro passo são os 7 dias do Detox da Tentante. Você segue o cardápio em casa, eu investigo com você o que está por trás desses sinais, uma fase por dia, e no domingo você recebe o relatório da sua fertilidade, com o seu nome.',
      botao: 'Quero descobrir o que está por trás' },
    alta: { chip: 'Intoxicação alta', css: 'high', title: 'O seu corpo <em>está pedindo socorro.</em>',
      text: 'Eu quero que você leia isso com carinho, sem culpa: ninguém te ensinou a olhar para esses sinais. Mas eles são muitos, e são fortes. Um corpo assim costuma estar inflamado e oxidado, e é nele que o óvulo amadurece e o bebê precisa se implantar. Com esse nível, começar por vitamina ou por tratamento é pular uma etapa. Primeiro a gente limpa, depois a gente nutre.',
      passo: 'Comece pelos 7 dias do Detox da Tentante. Muitas alunas já contam diferença no sono, no intestino e no inchaço nessa primeira semana. E enquanto o seu corpo limpa, eu investigo com você qual fase da sua fertilidade está travada. No domingo você recebe o relatório, com o seu nome.',
      botao: 'Quero começar o meu detox' },
  };

  /* ====== PONTUAÇÃO (função pura): soma simples, máximo 30 ====== */
  function score(answers) {
    var g = { entra: { pts: 0, max: 0 }, corpo: { pts: 0, max: 0 }, ciclo: { pts: 0, max: 0 } };
    var marked = [];
    QUESTIONS.forEach(function (q, i) {
      var w = q.w || 1;
      g[q.g].max += 2 * w;
      var a = answers[i]; if (a == null) return;
      var p = q.o[a][1];
      g[q.g].pts += p * w;
      if (p > 0) marked.push({ sinal: q.sinal, ponte: q.ponte, p: p, w: w, i: i });
    });
    var total = g.entra.pts + g.corpo.pts + g.ciclo.pts;
    var faixa = total <= 9 ? 'leve' : total <= 19 ? 'moderada' : 'alta';
    var top = null, best = -1;
    ['ciclo', 'corpo', 'entra'].forEach(function (k) { // empate: menstruação, depois corpo, depois o que entra
      var r = g[k].pts / g[k].max;
      if (r > best) { best = r; top = k; }
    });
    marked.sort(function (a, b) { return (b.p * b.w) - (a.p * a.w) || b.p - a.p || a.i - b.i; });
    return { total: total, faixa: faixa, groups: g, top: best > 0 ? top : null, signs: marked.slice(0, 5) };
  }
  window.TERMOMETRO_SCORE = score; // pros testes

  /* ====== estado (try/catch: navegador anônimo pode recusar o localStorage) ====== */
  function lerLS(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ler() { try { return JSON.parse(lerLS(CHAVE)) || null; } catch (e) { return null; } }
  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {} }
  function novoSid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  }

  var params = new URLSearchParams(location.search);
  var estado = ler();
  if (!estado || !estado.sid) estado = { sid: novoSid(), dados: null, utm: {} };
  var temUtm = UTMS.some(function (k) { return params.get(k); });
  if (temUtm || !estado.utm) { estado.utm = {}; UTMS.forEach(function (k) { if (params.get(k)) estado.utm[k] = params.get(k).slice(0, 200); }); }
  salvar();

  var answers = QUESTIONS.map(function () { return null; });
  var cur = 0;
  var ultimo = null;
  var $ = function (id) { return document.getElementById(id); };

  function show(id) { ['intro', 'quiz', 'lead', 'result'].forEach(function (s) { $(s).classList.toggle('hidden', s !== id); }); window.scrollTo(0, 0); }

  function render() {
    var q = QUESTIONS[cur];
    $('qgroup').textContent = GROUPS[q.g].label;
    $('qtext').textContent = q.q;
    $('qhint').textContent = q.hint || '';
    $('qhint').classList.toggle('hidden', !q.hint);
    $('count').textContent = 'Pergunta ' + (cur + 1) + ' de ' + QUESTIONS.length;
    $('bar').firstElementChild.style.width = (cur / QUESTIONS.length * 100) + '%';
    $('back').classList.toggle('hidden', cur === 0);
    var box = $('qopts'); box.innerHTML = '';
    q.o.forEach(function (o, idx) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'opt';
      b.setAttribute('role', 'radio');
      b.textContent = o[0];
      b.setAttribute('aria-pressed', answers[cur] === idx ? 'true' : 'false');
      b.setAttribute('aria-checked', answers[cur] === idx ? 'true' : 'false');
      b.addEventListener('click', function () { choose(idx); });
      box.appendChild(b);
    });
  }

  function choose(idx) {
    answers[cur] = idx;
    if (cur < QUESTIONS.length - 1) { cur++; render(); window.scrollTo(0, 0); }
    else leadScreen();
  }

  /* ====== nome e WhatsApp ====== */
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
  function maiuscula(s) { return s.replace(/(^|\s)(\S)/g, function (m, a, b) { return a + b.toUpperCase(); }); }

  // quem se inscreveu no webinar neste navegador já tem nome e WhatsApp guardados pela página de inscrição
  function dadosConhecidos() {
    if (estado.dados) return estado.dados;
    var nome = [lerLS('firstName'), lerLS('lastName')].filter(Boolean).join(' ').trim();
    var tel = (params.get('phone') || params.get('whatsapp') || lerLS('phone') || '').replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
    return { nome: maiuscula(params.get('name') || params.get('nome') || nome), whatsapp: tel, email: (params.get('email') || lerLS('email') || '').trim(), ticket: lerLS('ticket') || '' };
  }

  function leadScreen() {
    var d = dadosConhecidos();
    $('count').textContent = '';
    $('bar').firstElementChild.style.width = '100%';
    $('f-nome').value = d.nome || '';
    $('f-tel').value = d.whatsapp ? mascara(String(d.whatsapp).replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')) : '';
    show('lead');
  }

  function erro(f, msg) { f.setAttribute('aria-invalid', 'true'); var s = $(f.id + '-erro'); s.textContent = msg; s.hidden = false; }
  function limparErro(f) { f.removeAttribute('aria-invalid'); $(f.id + '-erro').hidden = true; }
  $('f-tel').addEventListener('input', function () { this.value = mascara(this.value); limparErro(this); });
  $('f-nome').addEventListener('input', function () { limparErro(this); });

  $('form-lead').addEventListener('submit', function (e) {
    e.preventDefault();
    var fNome = $('f-nome'), fTel = $('f-tel');
    var nome = maiuscula(fNome.value.trim().replace(/\s+/g, ' ')), tel = fTel.value;
    var ok = true;
    if (nome.length < 2) { erro(fNome, 'Escreva o seu nome.'); ok = false; }
    if (!telefoneOk(tel)) { erro(fTel, 'Confira o DDD e o número do seu WhatsApp.'); ok = false; }
    if (!ok) { var p = document.querySelector('#lead [aria-invalid="true"]'); if (p) p.focus(); return; }
    var antes = dadosConhecidos();
    estado.dados = { nome: nome, whatsapp: tel.replace(/\D/g, ''), email: antes.email || '', ticket: antes.ticket || '' };
    salvar();
    var r = score(answers);
    var botao = $('ver'); botao.disabled = true; botao.textContent = 'Calculando...';
    enviar(r, $('f-empresa').value).then(function () {
      botao.disabled = false; botao.textContent = 'Ver o meu resultado';
      finish(r);
    });
  });

  // manda pro n8n e espera no máximo 4 s: o resultado aparece mesmo se o envio falhar
  function enviar(r, robo) {
    if (robo) return Promise.resolve();
    var corpo = Object.assign({
      sid: estado.sid, nome: estado.dados.nome, whatsapp: '+55' + estado.dados.whatsapp,
      email: estado.dados.email, ticket: estado.dados.ticket,
      faixa: r.faixa, pontos: r.total, bloco_principal: r.top || '',
      blocos: { entra: r.groups.entra.pts, corpo: r.groups.corpo.pts, ciclo: r.groups.ciclo.pts },
      respostas: answers, utm_page: location.pathname,
    }, estado.utm);
    var envio = fetch(CONFIG.enviar, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo), keepalive: true })
      .then(function (res) { estado.enviado = res.ok ? r.faixa : null; salvar(); })
      .catch(function () {});
    try { if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'termometro_' + r.faixa }); } catch (e) {}
    return Promise.race([envio, new Promise(function (ok) { setTimeout(ok, 4000); })]);
  }

  /* ====== checkout: sck da faixa, nome e WhatsApp preenchidos, UTMs da página ====== */
  function checkoutLink(faixa) {
    var url = new URL(CONFIG.checkout);
    var q = url.searchParams;
    q.set('sck', CONFIG.sck + '_' + faixa);
    var d = estado.dados;
    if (d) {
      if (d.nome) q.set('name', d.nome);
      if (d.email) q.set('email', d.email);
      if (d.whatsapp) q.set('phonenumber', d.whatsapp);
    }
    params.forEach(function (v, k) {
      if (['name', 'nome', 'email', 'phone', 'phonenumber', 'whatsapp', 'sck'].indexOf(k) !== -1) return;
      if (!q.has(k)) q.set(k, v);
    });
    return url.toString();
  }

  /* ====== resultado ====== */
  function finish(r) {
    ultimo = r;
    var R = RESULTS[r.faixa];
    $('count').textContent = '';
    $('bar').firstElementChild.style.width = '100%';
    $('rlevel').textContent = R.chip; $('rlevel').className = 'level ' + R.css;
    $('rtitle').innerHTML = R.title;
    $('rtext').textContent = R.text;
    $('rpasso').textContent = R.passo;
    $('rbtn').textContent = R.botao;
    $('rscore').textContent = r.total + ' de 30 pontos';

    var box = $('rgroups'); box.innerHTML = '';
    ['entra', 'corpo', 'ciclo'].forEach(function (k) {
      var g = r.groups[k];
      var d = document.createElement('div'); d.className = 'g' + (k === r.top ? ' top' : '');
      d.innerHTML = '<div class="row"><span></span><span></span></div><div class="track"><i></i></div>';
      d.querySelector('.row span').textContent = GROUPS[k].label;
      d.querySelector('.row span:last-child').textContent = g.pts + ' de ' + g.max;
      d.querySelector('i').style.width = (g.pts / g.max * 100) + '%';
      box.appendChild(d);
    });
    $('rfocus').textContent = r.top
      ? 'Os seus sinais aparecem principalmente em: ' + GROUPS[r.top].label.toLowerCase() + '. É o tema de ' + GROUPS[r.top].aula + '.'
      : 'Você não marcou nenhum sinal. Use os 7 dias para confirmar isso nos seus exames.';

    var sg = $('rsigns'); sg.innerHTML = '';
    r.signs.forEach(function (s) {
      var d = document.createElement('div'); d.className = 'sign';
      var b = document.createElement('b'); b.textContent = s.sinal;
      var sp = document.createElement('span'); sp.textContent = s.ponte;
      d.appendChild(b); d.appendChild(sp); sg.appendChild(d);
    });
    $('rsignsCard').classList.toggle('hidden', r.signs.length === 0);

    var P = PROOF[r.top || 'corpo'];
    $('ptitle').innerHTML = P.title; $('ptext').textContent = P.text;
    $('pimgBox').classList.toggle('hidden', !P.img);
    $('pquotes').classList.toggle('hidden', !!P.img);
    if (P.img) { $('pimg').src = P.img; $('pimg').alt = P.alt; }

    if (estado.dados && estado.dados.nome) $('rpNome').textContent = estado.dados.nome;
    $('rpDetox').style.width = Math.max(8, 100 - r.total / 30 * 100) + '%';
    $('bonus').classList.toggle('hidden', !CONFIG.bonus_ao_vivo);
    var href = checkoutLink(r.faixa);
    document.querySelectorAll('.cta').forEach(function (a) { a.href = href; });

    show('result');
    $('pin').style.left = '0%';
    requestAnimationFrame(function () { requestAnimationFrame(function () { $('pin').style.left = Math.max(2, Math.min(98, r.total / 30 * 100)) + '%'; }); });
  }

  $('start').addEventListener('click', function () { cur = 0; render(); show('quiz'); });
  $('back').addEventListener('click', function () { if (cur > 0) { cur--; render(); } });
  $('back-lead').addEventListener('click', function () { cur = QUESTIONS.length - 1; render(); show('quiz'); });
  $('redo').addEventListener('click', function () { answers = QUESTIONS.map(function () { return null; }); cur = 0; render(); show('quiz'); });

  /* prévia pra revisão: #previa-leve, #previa-moderada ou #previa-alta mostra o resultado direto, sem enviar nada */
  (function () {
    var m = { '#previa-leve': 0, '#previa-moderada': 1, '#previa-alta': 2 }[location.hash];
    if (m == null) return;
    answers = QUESTIONS.map(function (q, i) { return m === 0 ? (i === 8 ? 1 : 0) : m === 1 ? (q.g === 'ciclo' ? 2 : (i % 2)) : 2; });
    finish(score(answers));
  })();
})();
