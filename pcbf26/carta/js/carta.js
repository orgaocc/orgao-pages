/* =============================================
   CARTA — pcbf26/carta/?id=<sid>
   Texto fixo do briefing da Bruna (19/11/2026, Parte 3). Só o que vem da IA muda: DEVOLUTIVA, EXPLICACAO_1..3 e
   ACAO_1..3 (os pilares são escolhidos por regra no n8n). O parágrafo da perda só aparece pra quem contou que perdeu.
   Ajuste nosso no texto: "o/a" e "pelo/pela" acompanham o pilar (a Atividade Física, a Fertilidade Masculina).
   ============================================= */
(function () {
  var params = new URLSearchParams(location.search);
  var id = (params.get('id') || '').slice(0, 36);
  var $ = function (i) { return document.getElementById(i); };

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function evento(tipo) {
    if (!id) return Promise.resolve();
    return fetch(CONFIG.evento, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sid: id, tipo: tipo }), keepalive: true }).catch(function () {});
  }

  /* ---------- buscar a carta (enquanto a IA escreve, espera) ---------- */
  var tentativas = 0;
  function buscar() {
    if (!/^[0-9a-f-]{36}$/i.test(id)) return naoAchou();
    fetch(CONFIG.carta + '?id=' + encodeURIComponent(id))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j.status === 'pronta') return mostrar(j.carta);
        if (j.status === 'gerando' && ++tentativas < 45) {
          if (tentativas === 8) $('carregando-texto').textContent = 'Estou lendo cada resposta com calma. Só mais um pouquinho.';
          return setTimeout(buscar, 2500);
        }
        if (j.status === 'gerando') { $('carregando-texto').innerHTML = 'O seu plano está quase pronto. <a href="">Toque aqui para atualizar</a> em alguns instantes.'; return; }
        naoAchou();
      })
      .catch(function () {
        if (++tentativas < 45) return setTimeout(buscar, 3000);
        $('carregando-texto').innerHTML = 'Não consegui carregar agora. Confira a sua internet e <a href="">toque aqui para tentar de novo</a>.';
      });
  }
  function naoAchou() { $('carregando').hidden = true; $('nao-achou').hidden = false; }

  /* ---------- montar ---------- */
  function mostrar(c) {
    var nome = esc(c.primeiro || '');
    var P = (c.pilares || []).map(function (p) {
      var a = p.artigo === 'a';
      return { nome: esc(p.nome), o: a ? 'a' : 'o', pelo: a ? 'pela' : 'pelo' };
    });
    if (P.length < 3) return naoAchou();
    var ia = function (k) { return '<span class="ia">' + esc(c[k]) + '</span>'; };
    var p = function (t) { return '<p>' + t + '</p>'; };
    var h2 = function (t) { return '<h2>' + t + '</h2>'; };

    var trailer = '';
    if (CONFIG.trailer_embed) {
      trailer = '<div class="trailer" id="trailer"><button type="button" id="trailer-play"><img src="../vendas/assets/depoimento-talita-familia.webp" alt="" loading="lazy"><span>Assistir ao trailer</span></button></div>';
    }

    var html = [
      p('Antes de qualquer outra coisa, eu preciso te dizer isto: o fato de você ter parado o seu dia para responder perguntas sobre o seu ciclo, sobre o seu sono, sobre a sua alimentação e sobre a sua história já diz muito sobre o tamanho do seu desejo de ser mãe.'),
      p(ia('devolutiva')),
      c.perda ? p('E você me contou também que já viveu a dor de uma gestação que não seguiu, e eu sinto muito, porque eu sei exatamente o que é isso. Eu perdi cinco filhos que não estão nos meus braços, e durante muito tempo a minha casa continuou vazia enquanto eu ouvia respostas prontas e genéricas, como "toma ácido fólico" e "é natural perder bebês na sua idade".') : '',
      p('Eu estou aqui como médica, como uma mulher que já esteve exatamente no seu lugar e também como mãe. E é por isso que eu quero te mostrar o que eu enxerguei na sua anamnese.'),

      h2('O que eu enxerguei no seu caso'),
      p('A fertilidade não é uma coisa só, ela se sustenta em sete pilares, e eles são o equilíbrio nutricional, o equilíbrio hormonal, a atividade física, o sono, o equilíbrio emocional, a fertilidade masculina e o detox, que é a desintoxicação do seu organismo. Quando um desses sete pilares está em desequilíbrio, o seu corpo gasta a energia dele tentando compensar aquele desequilíbrio, em vez de usar essa energia para engravidar.'),
      p('Pelas suas respostas, ' + nome + ', eu identifiquei três pilares que hoje estão bloqueando a sua fertilidade.'),
      '<div class="pilares">' + ['primeiro', 'segundo', 'terceiro'].map(function (ord, i) {
        return '<div class="pilar"><span class="pilar-num">' + (i + 1) + '</span><div><h3>' + P[i].nome + '</h3>' +
          p('O ' + ord + ' é ' + P[i].o + ' ' + P[i].nome + '. ' + ia('explicacao_' + (i + 1))) + '</div></div>';
      }).join('') + '</div>',

      h2('Por que o que você já tentou não resolveu'),
      p('Agora veja só, e aqui está o ponto que muda tudo: você provavelmente já tentou cuidar de um desses pilares sozinha. Você já mudou a sua alimentação, ou já comprou suplementos, ou já tentou dormir melhor, e mesmo assim o seu teste continuou negativo.'),
      p('Isso não aconteceu porque você fez errado, e também não aconteceu porque o seu corpo é diferente dos outros. Aconteceu porque cuidar de um pilar isolado, enquanto os outros seis continuam em desequilíbrio, é como limpar um cômodo de uma casa inteira que está fechada há anos e esperar que a casa toda fique pronta para receber a visita mais importante da sua vida.'),
      p('Os sete pilares da fertilidade precisam ser trabalhados juntos, na ordem certa e de forma intencional para o seu caso. Foi assim que eu preparei o meu próprio corpo para conceber, e foi assim que mais de duas mil mulheres percorreram esse mesmo caminho que eu percorri e hoje têm os seus filhos nos braços, da mesma forma que eu tenho os meus.'),

      h2('O que eu faria no seu lugar'),
      '<div class="pilares">' +
        '<div class="pilar"><span class="pilar-num">1</span><div>' + p('Começando ' + P[0].pelo + ' ' + P[0].nome + ', que é o que mais está pesando hoje no seu caso, eu faria o seguinte: ' + ia('acao_1')) + '</div></div>' +
        '<div class="pilar"><span class="pilar-num">2</span><div>' + p('Depois, para ' + P[1].o + ' ' + P[1].nome + ', ' + ia('acao_2')) + '</div></div>' +
        '<div class="pilar"><span class="pilar-num">3</span><div>' + p('E para ' + P[2].o + ' ' + P[2].nome + ', ' + ia('acao_3')) + '</div></div>' +
      '</div>',
      p('Isso você já pode começar hoje, por conta própria, e eu quero mesmo que você comece.'),

      h2('Agora, deixa eu te explicar uma coisa com sinceridade'),
      p('Esse plano que você acabou de ler aponta a direção, mas ele não caminha com você. Ele não olha os seus exames, ele não ajusta a sua rota quando o seu ciclo mudar e ele não responde quando você tiver uma dúvida às onze da noite, que é a hora em que essas dúvidas costumam chegar.'),
      p('É exatamente para isso que existe o Programa Conceber.'),
      trailer,

      h2('O que você recebe no Programa Conceber'),
      p('O Programa Conceber é um protocolo de doze semanas para preparar o seu corpo para engravidar, aplicando à sua história os sete pilares da fertilidade. E eu quero te explicar o que isso significa na prática, porque o Programa Conceber não é um curso: você não entra para assistir aulas sobre como uma tentante deveria se preparar, você entra para viver essa preparação, uma semana por vez, com uma equipe inteira acompanhando o que está acontecendo no seu corpo.'),
      p('<strong>Para você saber o que fazer todos os dias.</strong> Toda semana você recebe o protocolo daquela semana: o seu protocolo alimentar, feito por nutricionistas especialistas em fertilidade, com o cardápio, a lista de compras e as receitas; a sua trilha de treinos, com aulas curtas que você faz em casa, sem precisar de academia; e as orientações daquela semana para o seu sono e para o seu emocional. E para acompanhar tudo isso, dia após dia, chega na sua casa o Planner Conceber, um planner físico, para você enxergar a sua semana inteira num lugar só.'),
      '<img class="planner" src="../vendas/assets/planner.webp" alt="Planner Conceber" loading="lazy">',
      p('<strong>Para você nunca mais caminhar sozinha.</strong> Toda semana você tem mentorias ao vivo comigo e com o corpo técnico do Programa Conceber, e se você não conseguir estar no horário, a mentoria fica gravada para você. E entre uma mentoria e outra, você tem um grupo exclusivo, onde as suas dúvidas são respondidas em até quarenta e oito horas, porque a dúvida não aparece no dia da consulta, ela aparece na quarta-feira à noite. E é uma equipe de verdade, não é uma inteligência artificial: você tem médicas ginecologistas, nutricionistas, psicóloga, educador físico e um teólogo, para fortalecer a sua fé, olhando para o seu caso.'),
      p('<strong>Para você entender o seu corpo.</strong> Na décima semana, você tem uma consulta individual com uma médica do corpo técnico do Programa Conceber, formada pela Dra. Talita Melo no método dos sete pilares da fertilidade. E essa consulta é uma consulta de verdade, só sua: a médica olha para o seu caso, para a sua história e para tudo o que você viveu nessas dez semanas. É nessa consulta que você recebe o pedido dos seus exames e dos exames do seu marido, feito para o caso de vocês, com receita digital, que vale no convênio e no SUS. Vocês fazem esses exames, enviam para nós, e a partir deles você recebe a sua devolutiva individual, o seu Panorama Fértil, que te diz com todas as letras onde você está, o que precisa de atenção e qual é o seu próximo passo. E é dessa mesma consulta que vem a prescrição da sua suplementação individual, e também da suplementação individual do seu marido, de acordo com o que a médica enxergar que cada um de vocês precisa, para que cada coisa que você coloca para dentro do seu corpo tenha um porquê.'),
      p('Você tem ainda as masterclasses sobre os diagnósticos, e você não precisa assistir a todas, você assiste àquela que é do seu caso. E tem os cursos complementares, como o de trombofilia e o da fisioterapeuta, para te ajudar na mobilidade pélvica.'),
      p('E tem uma parte que é muito especial para mim, que é o Conceber com Amor. Eu sonho com o dia em que você vai me mandar uma mensagem dizendo "Dra. Talita, estou grávida", e eu não quero que nesse dia comece uma nova solidão, cheia de novas dúvidas sobre o que você pode comer agora. O Conceber com Amor te recebe no dia em que o seu positivo chegar, com três cardápios para a sua gestação, para você saber o que colocar no seu prato agora que você está nutrindo duas vidas.'),
      p('Os sete pilares da fertilidade são a base para todas as alunas, mas a forma como cada pilar é aplicado depende de você. A sua consulta da décima semana é a sua consulta, os exames pedidos são os exames do seu caso e do caso do seu marido, a devolutiva é a sua devolutiva, e a prescrição da suplementação é a sua e a do seu marido.'),

      h2('O seu investimento'),
      p(nome + ', eu quero te lembrar por que o Programa Conceber existe. Ele nasceu porque eu atendia uma mulher por vez no consultório e chegava em casa pensando nas outras, aquelas que me escreviam e eu não conseguia responder, aquelas que não tinham como pagar uma consulta particular e que iam continuar tentando sozinhas porque nunca ia sobrar dinheiro para chegar até mim.'),
      p('E toda vez que chega a Black Friday, eu penso nessas mulheres. Eu penso em você, que talvez esteja aí do outro lado com vontade de entrar e com medo de olhar para o valor.'),
      p('Por isso, até o dia trinta de novembro, o Programa Conceber completo, com tudo o que eu acabei de te mostrar, sai por R$ 1.997,90 à vista, ou em 12 vezes de R$ 197,90 no cartão de crédito.'),
      p('A sua parcela sai por menos de sete reais por dia, por doze semanas de protocolo, de direcionamento e de acompanhamento com a minha equipe.'),
      p('E eu quero que você olhe para esse valor pensando numa coisa: talvez você já gaste mais do que isso por mês em suplemento que ninguém olhou para os seus exames antes de indicar. Talvez você já tenha gastado mais do que isso em um único exame que você repetiu sem saber para quê. A diferença não é o quanto você gasta, a diferença é ter alguém organizando isso com você e por você.'),
      '<div class="preco">' +
        '<p class="preco-cond">Até 30 de novembro</p>' +
        '<p class="preco-parc"><small>12x de</small>R$ 197,90</p>' +
        '<p class="preco-vista">ou <strong>R$ 1.997,90</strong> à vista</p>' +
        '<a class="btn" id="comprar" href="' + esc(CONFIG.link_checkout) + '">Quero entrar no Programa Conceber</a>' +
      '</div>',
      p(nome + ', independentemente do que você decidir agora, eu quero que você saia daqui sabendo quais são os três pilares que estão bloqueando a sua fertilidade hoje. Isso já é mais do que a maioria das mulheres descobre em anos de tentativa.'),
      p('Estou te esperando do outro lado.'),
      '<div class="assinatura"><img src="../vendas/assets/talita-retrato.webp" alt="" loading="lazy"><div><strong>Dra. Talita Melo</strong><span>Ginecologista, referência em fertilidade há mais de quinze anos</span></div></div>',
    ].join('');

    $('abertura').innerHTML = nome + ', eu li com atenção tudo o que você me respondeu.';
    $('papel').innerHTML = html;
    document.title = 'O seu plano para Conceber, ' + (c.primeiro || '');
    $('carregando').hidden = true; $('carta').hidden = false;
    window.scrollTo(0, 0);
    evento('carta_aberta');

    var play = $('trailer-play');
    if (play) play.addEventListener('click', function () {
      evento('trailer');
      var f = document.createElement('iframe');
      f.src = CONFIG.trailer_embed + (CONFIG.trailer_embed.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1';
      f.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
      f.allowFullscreen = true; f.title = 'Trailer do Programa Conceber';
      $('trailer').innerHTML = ''; $('trailer').appendChild(f);
    });

    $('comprar').addEventListener('click', function (e) {
      e.preventDefault();
      var destino = urlCheckout();
      var foi = false;
      function ir() { if (!foi) { foi = true; location.href = destino; } }
      setTimeout(ir, 800);
      evento('checkout').then(ir);
    });
  }

  /* ---------- checkout com os dados preenchidos (os que ficaram neste navegador no fim do quiz) ----------
     Mesma decoração do pcbf26/shared/precheckout.js: UTMs da página, VK Metrics e onePixel (nessa ordem). */
  function urlCheckout() {
    var url = new URL(CONFIG.link_checkout);
    var q = url.searchParams;
    var d = null;
    try { d = JSON.parse(sessionStorage.getItem('pcbf26_comprador') || localStorage.getItem('pcbf26_comprador') || 'null'); } catch (e) {}
    if (d && d.email) {
      var dig = String(d.whatsapp || '').replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
      q.set('name', d.nome || ''); q.set('email', d.email);
      if (dig) { q.set('phone_number', dig); q.set('phone_local_code', '55'); }
    }
    params.forEach(function (valor, chave) { if (chave !== 'id' && !q.has(chave)) q.set(chave, valor); });
    if (!q.has('utm_source')) q.set('utm_source', 'quiz');
    var destino = url.toString();
    try { var vk = window.vkPixelSales && window.vkPixelSales.generateDecoratedUrl; if (typeof vk === 'function') destino = vk(destino) || destino; } catch (e) {}
    try { if (window.px && typeof px.decorate === 'function') destino = px.decorate(destino) || destino; } catch (e) {}
    return destino;
  }

  buscar();
})();
