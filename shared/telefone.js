/* =====================================================================
   TELEFONE COM PAÍS — seletor de bandeira em todo campo de WhatsApp
   ---------------------------------------------------------------------
   Pedido do Luan (23/11/2026): todo formulário com a bandeira do país, já em Brasil, com opção de trocar
   (tem quem use número dos Estados Unidos, Portugal...), e o número sempre sai completo: +DDI DDD número.

   Liga sozinho em todo <input type="tel"> da página, inclusive os que aparecem depois (modal, quiz).
   Pra deixar um campo de fora: data-tel-pais="nao".

   O que a página usa:
     TelPais.numero(input)   -> "+5516993532222" / "+13055551234", ou "" se o número não está completo
     TelPais.ddi(input)      -> "55", "1", "351"...
     TelPais.nacional(input) -> só DDD + número, sem o código do país ("16993532222")
     TelPais.brasil(input)   -> true se o país escolhido é o Brasil
     TelPais.preencher(input, valor) -> "+13055551234" escolhe o país sozinho; sem "+" é Brasil
   Digitar ou colar um número começando com "+" também troca o país sozinho.
   Bandeiras: flag-icons 7.5.0 pelo jsDelivr (o Windows não mostra bandeira em emoji).
   ===================================================================== */
(function () {
  'use strict';
  if (window.TelPais) return;

  var BANDEIRA = 'https://cdn.jsdelivr.net/npm/flag-icons@7.5.0/flags/4x3/';

  /* iso|nome|ddi. Os três primeiros ficam no topo da lista; o resto vai em ordem alfabética.
     Países que dividem o código (+1, +7): o primeiro da lista é o que um "+1..." colado escolhe. */
  var PAISES = ('br|Brasil|55;us|Estados Unidos|1;pt|Portugal|351;' +
    'ca|Canadá|1;mx|México|52;ar|Argentina|54;bo|Bolívia|591;cl|Chile|56;co|Colômbia|57;cr|Costa Rica|506;cu|Cuba|53;' +
    'do|República Dominicana|1;ec|Equador|593;sv|El Salvador|503;gt|Guatemala|502;ht|Haiti|509;hn|Honduras|504;' +
    'jm|Jamaica|1;ni|Nicarágua|505;pa|Panamá|507;py|Paraguai|595;pe|Peru|51;pr|Porto Rico|1;uy|Uruguai|598;' +
    've|Venezuela|58;gy|Guiana|592;sr|Suriname|597;gf|Guiana Francesa|594;bs|Bahamas|1;tt|Trinidad e Tobago|1;bz|Belize|501;' +
    'es|Espanha|34;fr|França|33;it|Itália|39;de|Alemanha|49;gb|Reino Unido|44;ie|Irlanda|353;nl|Países Baixos|31;' +
    'be|Bélgica|32;lu|Luxemburgo|352;ch|Suíça|41;at|Áustria|43;se|Suécia|46;no|Noruega|47;dk|Dinamarca|45;fi|Finlândia|358;' +
    'is|Islândia|354;pl|Polônia|48;cz|Tchéquia|420;sk|Eslováquia|421;hu|Hungria|36;ro|Romênia|40;bg|Bulgária|359;' +
    'gr|Grécia|30;hr|Croácia|385;si|Eslovênia|386;rs|Sérvia|381;ba|Bósnia e Herzegovina|387;me|Montenegro|382;' +
    'mk|Macedônia do Norte|389;al|Albânia|355;ua|Ucrânia|380;ru|Rússia|7;by|Belarus|375;md|Moldávia|373;lt|Lituânia|370;' +
    'lv|Letônia|371;ee|Estônia|372;mt|Malta|356;cy|Chipre|357;ad|Andorra|376;mc|Mônaco|377;sm|San Marino|378;' +
    'li|Liechtenstein|423;tr|Turquia|90;ge|Geórgia|995;am|Armênia|374;az|Azerbaijão|994;' +
    'ao|Angola|244;mz|Moçambique|258;cv|Cabo Verde|238;gw|Guiné-Bissau|245;st|São Tomé e Príncipe|239;za|África do Sul|27;' +
    'ng|Nigéria|234;gh|Gana|233;ke|Quênia|254;eg|Egito|20;ma|Marrocos|212;dz|Argélia|213;tn|Tunísia|216;sn|Senegal|221;' +
    'ci|Costa do Marfim|225;cm|Camarões|237;et|Etiópia|251;tz|Tanzânia|255;ug|Uganda|256;cd|República Democrática do Congo|243;' +
    'cg|Congo|242;ly|Líbia|218;zw|Zimbábue|263;zm|Zâmbia|260;na|Namíbia|264;bw|Botsuana|267;mu|Maurício|230;' +
    'mg|Madagascar|261;rw|Ruanda|250;' +
    'ae|Emirados Árabes Unidos|971;sa|Arábia Saudita|966;qa|Catar|974;kw|Kuwait|965;bh|Bahrein|973;om|Omã|968;' +
    'il|Israel|972;jo|Jordânia|962;lb|Líbano|961;sy|Síria|963;iq|Iraque|964;ir|Irã|98;af|Afeganistão|93;pk|Paquistão|92;' +
    'in|Índia|91;bd|Bangladesh|880;lk|Sri Lanka|94;np|Nepal|977;cn|China|86;hk|Hong Kong|852;mo|Macau|853;tw|Taiwan|886;' +
    'jp|Japão|81;kr|Coreia do Sul|82;sg|Singapura|65;my|Malásia|60;th|Tailândia|66;vn|Vietnã|84;ph|Filipinas|63;' +
    'id|Indonésia|62;kh|Camboja|855;kz|Cazaquistão|7;uz|Uzbequistão|998;tl|Timor-Leste|670;' +
    'au|Austrália|61;nz|Nova Zelândia|64')
    .split(';').map(function (s) { var p = s.split('|'); return { iso: p[0], nome: p[1], ddi: p[2] }; });
  var TOPO = PAISES.slice(0, 3);
  var RESTO = PAISES.slice(3).sort(function (a, b) { return a.nome.localeCompare(b.nome, 'pt-BR'); });
  var LISTA = TOPO.concat(RESTO);
  var BR = PAISES[0];
  var DDDS = '11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(' ');

  function porIso(iso) { for (var i = 0; i < PAISES.length; i++) if (PAISES[i].iso === iso) return PAISES[i]; return null; }
  // o código mais longo que casa com o começo dos dígitos (o primeiro da lista ganha o empate: +1 = EUA, +7 = Rússia)
  function porPrefixo(dig) {
    for (var n = 4; n >= 1; n--) {
      var cod = dig.slice(0, n);
      for (var i = 0; i < PAISES.length; i++) if (PAISES[i].ddi === cod) return PAISES[i];
    }
    return null;
  }
  function semAcento(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

  /* ---------- Brasil ---------- */
  function soNumeroBR(v) {
    var d = String(v || '').replace(/\D/g, '');
    if (d.length > 11 && d.indexOf('55') === 0) d = d.slice(2);   // "+55 16 9..." do preenchimento automático
    if (d.length > 10 && d.charAt(0) === '0') d = d.slice(1);     // "016..."
    return d.slice(0, 11);
  }
  function mascaraBR(d) {
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }
  function validoBR(d) {
    if (DDDS.indexOf(d.slice(0, 2)) === -1) return false;
    return (d.length === 11 && d.charAt(2) === '9') || d.length === 10;
  }

  /* ---------- outros países ---------- */
  function maxNacional(p) { return p.ddi === '1' ? 10 : 15 - p.ddi.length; }
  function validoFora(p, d) {
    if (p.ddi === '1') return d.length === 10;
    if (p.iso === 'pt') return d.length === 9;
    return d.length >= 6 && d.length + p.ddi.length <= 15;
  }

  /* ---------- estilo (herda a fonte e a cor do campo de cada página) ---------- */
  var css =
    '.tp{position:relative;display:block;width:100%}' +
    '.tp>input{width:100%}' +
    '.tp-btn{position:absolute;left:1px;top:1px;bottom:1px;display:flex;align-items:center;gap:6px;padding:0 8px 0 12px;' +
      'border:0;background:transparent;color:inherit;font:inherit;cursor:pointer;border-radius:inherit;z-index:1}' +
    '.tp-btn:focus-visible{outline:2px solid currentColor;outline-offset:-2px}' +
    '.tp-btn img,.tp-op img{width:22px;height:16px;border-radius:2px;object-fit:cover;flex:none;box-shadow:0 0 0 1px rgba(0,0,0,.12)}' +
    '.tp-btn span{font-size:.95em;opacity:.85}' +
    '.tp-btn svg{width:10px;height:10px;opacity:.6;flex:none}' +
    '.tp-btn::after{content:"";position:absolute;right:0;top:25%;bottom:25%;width:1px;background:currentColor;opacity:.2}' +
    '.tp-painel{position:fixed;z-index:2147483000;background:#fff;color:#1b1a1a;border-radius:12px;' +
      'box-shadow:0 12px 40px rgba(0,0,0,.25);display:flex;flex-direction:column;overflow:hidden;' +
      'font:16px/1.3 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-align:left}' +
    '.tp-busca{margin:8px;padding:10px 12px;border:1px solid #d9d9d9;border-radius:8px;font:inherit;font-size:16px;color:inherit;background:#fff;outline:none}' +
    '.tp-busca:focus{border-color:#888}' +
    '.tp-lista{list-style:none;margin:0;padding:0 0 8px;overflow-y:auto;overscroll-behavior:contain}' +
    '.tp-op{display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer}' +
    '.tp-op b{font-weight:400;flex:1}' +
    '.tp-op i{font-style:normal;color:#777;font-size:.9em}' +
    '.tp-op[aria-selected="true"],.tp-op.ativo{background:#f1f1f1}' +
    '.tp-sep{height:1px;background:#eee;margin:6px 0}' +
    '.tp-vazio{padding:12px 14px;color:#777}' +
    '.tp-veu{position:fixed;inset:0;z-index:2147482999;background:rgba(0,0,0,.35)}' +
    '@media (max-width:600px){.tp-painel{left:0!important;right:0;bottom:0;top:auto!important;width:auto!important;' +
      'max-height:72vh!important;border-radius:16px 16px 0 0}}';
  function estilo() {
    if (document.getElementById('tp-estilo')) return;
    var s = document.createElement('style'); s.id = 'tp-estilo'; s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  }

  var SETA = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  function bandeira(p, ja) { return '<img src="' + BANDEIRA + p.iso + '.svg" alt=""' + (ja ? '' : ' loading="lazy"') + ' decoding="async">'; }

  /* ---------- cada campo ---------- */
  var estados = new WeakMap();

  function ligar(input) {
    if (!input || estados.has(input) || input.getAttribute('data-tel-pais') === 'nao') return;
    estilo();
    var est = { pais: BR, phBR: input.getAttribute('placeholder') || '(00) 00000-0000' };
    estados.set(input, est);
    input.setAttribute('data-tel-pais', 'on');

    var caixa = document.createElement('span');
    caixa.className = 'tp';
    input.parentNode.insertBefore(caixa, input);
    caixa.appendChild(input);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tp-btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    caixa.insertBefore(btn, input);
    est.btn = btn; est.input = input;

    function recuo() {
      var cs = getComputedStyle(input);
      btn.style.fontSize = cs.fontSize;
      btn.style.borderRadius = cs.borderRadius;
      input.style.paddingLeft = (btn.offsetWidth + 10) + 'px';
    }
    est.recuo = recuo;
    pintar(est);
    if (document.readyState === 'complete') recuo(); else window.addEventListener('load', recuo);
    requestAnimationFrame(recuo);
    // campo escondido (modal fechado) mede 0: mede de novo quando o botão ganha tamanho
    if (window.ResizeObserver) new ResizeObserver(function () { if (btn.offsetWidth) recuo(); }).observe(btn);
    input.addEventListener('focus', recuo);

    btn.addEventListener('click', function () { abrir(est); });

    input.addEventListener('input', function () {
      var v = input.value;
      // número colado ou digitado com "+": acha o país pelo código
      if (/^\s*(\+|00)/.test(v)) {
        var dig = v.replace(/^\s*00/, '').replace(/\D/g, '');
        var p = porPrefixo(dig);
        if (p && dig.length > p.ddi.length) { trocar(est, p, dig.slice(p.ddi.length)); return; }
        return; // ainda digitando o código
      }
      formatar(est, v);
    });

    if (input.value) formatar(est, input.value);
  }

  function pintar(est) {
    est.btn.innerHTML = bandeira(est.pais, true) + '<span>+' + est.pais.ddi + '</span>' + SETA;
    est.btn.setAttribute('aria-label', 'País do telefone: ' + est.pais.nome + ' (+' + est.pais.ddi + '). Trocar');
    est.input.setAttribute('placeholder', est.pais === BR ? est.phBR : 'Número com código de área');
    if (est.recuo) est.recuo();
  }

  function formatar(est, v) {
    var input = est.input;
    if (est.pais === BR) {
      input.value = mascaraBR(soNumeroBR(v));
    } else {
      var d = String(v).replace(/\D/g, '');
      if (d.indexOf(est.pais.ddi) === 0 && d.length > maxNacional(est.pais)) d = d.slice(est.pais.ddi.length);
      d = d.slice(0, maxNacional(est.pais));
      // agrupa de 3 em 3 só pra leitura
      input.value = d.replace(/(\d{3})(?=\d)/g, '$1 ');
    }
  }

  function trocar(est, pais, resto) {
    est.pais = pais;
    pintar(est);
    formatar(est, resto != null ? resto : est.input.value);
    est.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* ---------- lista de países ---------- */
  var aberto = null;

  function abrir(est) {
    if (aberto) { fechar(); return; }
    var celular = window.matchMedia('(max-width:600px)').matches;
    // dentro de um <dialog> aberto (modal do webinar) a lista mora no próprio dialog: o resto da página fica por baixo e travado
    var raiz = est.input.closest('dialog[open]') || document.body;
    var veu = null;
    if (celular) { veu = document.createElement('div'); veu.className = 'tp-veu'; raiz.appendChild(veu); }

    var painel = document.createElement('div');
    painel.className = 'tp-painel';
    painel.innerHTML = '<input class="tp-busca" type="search" placeholder="Buscar país ou código" aria-label="Buscar país" autocomplete="off">' +
      '<ul class="tp-lista" role="listbox" aria-label="País do telefone"></ul>';
    raiz.appendChild(painel);
    var busca = painel.querySelector('.tp-busca'), ul = painel.querySelector('.tp-lista');
    var ativo = -1, itens = [];

    function desenhar() {
      var q = semAcento(busca.value.trim()).replace(/^\+/, '');
      var lista = q ? LISTA.filter(function (p) {
        return semAcento(p.nome).indexOf(q) !== -1 || p.ddi.indexOf(q) === 0 || p.iso === q;
      }) : LISTA;
      itens = lista;
      ul.innerHTML = lista.length ? lista.map(function (p, i) {
        var sep = !q && i === TOPO.length ? '<li class="tp-sep" role="presentation"></li>' : '';
        return sep + '<li class="tp-op" role="option" data-i="' + i + '" aria-selected="' + (p === est.pais) + '">' +
          bandeira(p) + '<b>' + p.nome + '</b><i>+' + p.ddi + '</i></li>';
      }).join('') : '<li class="tp-vazio">Nenhum país encontrado</li>';
      ativo = q && lista.length ? 0 : -1;
      marcar();
    }
    function marcar() {
      var ops = ul.querySelectorAll('.tp-op');
      for (var i = 0; i < ops.length; i++) ops[i].classList.toggle('ativo', i === ativo);
      if (ativo >= 0 && ops[ativo]) ops[ativo].scrollIntoView({ block: 'nearest' });
    }
    function escolher(p) { fechar(); trocar(est, p); est.input.focus(); }

    function posicionar() {
      if (celular) return;
      var r = est.input.getBoundingClientRect();
      var largura = Math.max(r.width, 300);
      var abaixo = window.innerHeight - r.bottom - 12, acima = r.top - 12;
      var paraBaixo = abaixo >= 220 || abaixo >= acima;
      var alto = Math.min(340, paraBaixo ? abaixo : acima);
      painel.style.width = largura + 'px';
      painel.style.maxHeight = alto + 'px';
      painel.style.left = Math.max(8, Math.min(r.left, window.innerWidth - largura - 8)) + 'px';
      painel.style.top = (paraBaixo ? r.bottom + 6 : r.top - 6 - Math.min(alto, painel.offsetHeight)) + 'px';
    }

    ul.addEventListener('click', function (e) {
      var li = e.target.closest('.tp-op'); if (li) escolher(itens[+li.getAttribute('data-i')]);
    });
    busca.addEventListener('input', function () { desenhar(); posicionar(); });
    busca.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); ativo = Math.min(itens.length - 1, ativo + 1); marcar(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); ativo = Math.max(0, ativo - 1); marcar(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (itens[ativo]) escolher(itens[ativo]); }
      else if (e.key === 'Escape') { e.preventDefault(); fechar(); est.btn.focus(); }
    });
    function fora(e) { if (!painel.contains(e.target) && !est.btn.contains(e.target)) fechar(); }
    function rolou(e) { if (!painel.contains(e.target)) posicionar(); }

    aberto = { painel: painel, veu: veu, est: est, fora: fora, rolou: rolou };
    est.btn.setAttribute('aria-expanded', 'true');
    desenhar();
    posicionar();
    setTimeout(function () {
      document.addEventListener('mousedown', fora, true);
      document.addEventListener('touchstart', fora, true);
    }, 0);
    window.addEventListener('scroll', rolou, true);
    window.addEventListener('resize', fechar);
    if (!celular) busca.focus();
    var atual = ul.querySelector('[aria-selected="true"]');
    if (atual) atual.scrollIntoView({ block: 'center' });
  }

  function fechar() {
    if (!aberto) return;
    var a = aberto; aberto = null;
    a.painel.remove(); if (a.veu) a.veu.remove();
    a.est.btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', a.fora, true);
    document.removeEventListener('touchstart', a.fora, true);
    window.removeEventListener('scroll', a.rolou, true);
    window.removeEventListener('resize', fechar);
  }

  /* ---------- o que a página usa ---------- */
  function est(input) { if (input && !estados.has(input)) ligar(input); return estados.get(input); }

  function nacional(input) {
    var e = est(input); if (!e) return '';
    return e.pais === BR ? soNumeroBR(input.value) : input.value.replace(/\D/g, '');
  }
  function valido(input) {
    var e = est(input); if (!e) return false;
    var d = nacional(input);
    return e.pais === BR ? validoBR(d) : validoFora(e.pais, d);
  }

  window.TelPais = {
    ligar: ligar,
    valido: valido,
    nacional: nacional,
    ddi: function (input) { var e = est(input); return e ? e.pais.ddi : '55'; },
    brasil: function (input) { var e = est(input); return !e || e.pais === BR; },
    numero: function (input) { var e = est(input); return e && valido(input) ? '+' + e.pais.ddi + nacional(input) : ''; },
    preencher: function (input, valor) {
      var e = est(input); if (!e || !valor) return;
      var v = String(valor).trim();
      if (/^(\+|00)/.test(v)) {
        var dig = v.replace(/^00/, '').replace(/\D/g, '');
        var p = porPrefixo(dig);
        if (p) { trocar(e, p, dig.slice(p.ddi.length)); return; }
      }
      trocar(e, BR, v);
    },
    // separa "+13055551234" em país e número (pra montar link de checkout, por exemplo)
    separar: function (completo) {
      var dig = String(completo || '').replace(/\D/g, '');
      var p = /^\s*\+/.test(String(completo)) ? porPrefixo(dig) : null;
      if (!p) { var br = soNumeroBR(dig); return { ddi: '55', nacional: br, brasil: true }; }
      return { ddi: p.ddi, nacional: dig.slice(p.ddi.length), brasil: p === BR };
    },
    paises: LISTA,
  };

  /* ---------- liga sozinho ---------- */
  function varrer(raiz) {
    var campos = (raiz.querySelectorAll ? raiz : document).querySelectorAll('input[type="tel"]');
    for (var i = 0; i < campos.length; i++) ligar(campos[i]);
    if (raiz.matches && raiz.matches('input[type="tel"]')) ligar(raiz);
  }
  function iniciar() {
    varrer(document);
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) for (var j = 0; j < ms[i].addedNodes.length; j++) {
        var n = ms[i].addedNodes[j]; if (n.nodeType === 1) varrer(n);
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
