// =============================================================================
// RENDER — recebe um relatório (output de buildReport) e atualiza o HTML
// =============================================================================

function setText(sel, val) {
  document.querySelectorAll(sel).forEach((el) => { el.textContent = val; });
}

// substitui o ponto decimal por vírgula para exibição PT-BR
function fmtIndice(v) {
  return Number(v).toFixed(1).replace(".", ",");
}

// -----------------------------------------------------------------------------
// RADAR — substitui o polígono e os labels com valores reais
// -----------------------------------------------------------------------------
const RADAR_AXES = [
  { key: "detox",     label: "Detox",       angleDeg: -90 },
  { key: "hormonal",  label: "Equilíbrio Hormonal",  angleDeg: -90 + 360/7 },
  { key: "nutricao",  label: "Nutrição",    angleDeg: -90 + 2*360/7 },
  { key: "atividade", label: "Atividade Física",  angleDeg: -90 + 3*360/7 },
  { key: "sono",      label: "Sono",        angleDeg: -90 + 4*360/7 },
  { key: "emocional", label: "Equilíbrio Emocional", angleDeg: -90 + 5*360/7 },
  { key: "masculina", label: "Fertilidade Masculina", angleDeg: -90 + 6*360/7 },
];

function updateRadar(pilares) {
  const polygon = document.getElementById("value-poly");
  const dots = document.querySelectorAll("[data-radar-dot]");
  if (!polygon) return;

  const R_MAX = 110; // raio máximo (escala 10) — bate com a grid do SVG
  const points = [];
  RADAR_AXES.forEach((axis, i) => {
    const v = pilares[axis.key] ?? 0;
    const r = (v / 10) * R_MAX;
    const a = (axis.angleDeg * Math.PI) / 180;
    const x = +(r * Math.cos(a)).toFixed(2);
    const y = +(r * Math.sin(a)).toFixed(2);
    points.push(`${x},${y}`);
    const dot = document.querySelector(`[data-radar-dot="${i}"]`);
    if (dot) { dot.setAttribute("cx", x); dot.setAttribute("cy", y); }
  });
  polygon.setAttribute("points", points.join(" "));

  // valores numéricos abaixo de cada label
  RADAR_AXES.forEach((axis) => {
    const el = document.querySelector(`[data-pillar-value="${axis.key}"]`);
    if (el) el.textContent = pilares[axis.key];
  });
}

// -----------------------------------------------------------------------------
// CARDS de bloco (análise por área)
// -----------------------------------------------------------------------------
function updateBlocos(blocos) {
  for (const b of blocos) {
    const card = document.querySelector(`[data-bloco="${b.id}"]`);
    if (!card) continue;
    card.classList.toggle("beige", b.status === "melhora" || b.status === "saudavel");
    const badge = card.querySelector("[data-bloco-badge]");
    if (badge) {
      badge.textContent = b.status_label;
      badge.classList.remove("pink", "beige");
      badge.classList.add(b.status === "alerta" ? "pink" : "beige");
    }
    const titleEl = card.querySelector("[data-bloco-title]");
    if (titleEl) titleEl.textContent = b.titulo;
    const list = card.querySelector("[data-bloco-list]");
    if (list) {
      list.innerHTML = "";
      for (const f of b.findings) {
        const li = document.createElement("li");
        li.textContent = f;
        list.appendChild(li);
      }
    }
    const quote = card.querySelector("[data-bloco-quote]");
    if (quote) quote.textContent = `"${b.insight}"`;
  }
}

// -----------------------------------------------------------------------------
// DIAGNÓSTICOS (até 4)
// -----------------------------------------------------------------------------
function updateDiagnosticos(diagnosticos) {
  const cards = document.querySelectorAll("[data-diag]");
  const grid = cards[0]?.parentElement;
  if (grid) grid.dataset.count = String(diagnosticos.length);
  cards.forEach((card, i) => {
    const d = diagnosticos[i];
    if (!d) { card.style.display = "none"; return; }
    card.style.display = "";
    const titleEl = card.querySelector("[data-diag-title]");
    const descEl = card.querySelector("[data-diag-desc]");
    if (titleEl) titleEl.textContent = d.titulo;
    if (descEl) descEl.textContent = d.descricao;
  });
}

// -----------------------------------------------------------------------------
// GAPS
// -----------------------------------------------------------------------------
function updateGaps(gaps) {
  const list = document.querySelector("[data-gaps]");
  if (!list) return;
  list.innerHTML = "";
  gaps.forEach((g, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="qresp-num">${i + 1}</span><span>${g}</span>`;
    list.appendChild(li);
  });
}

// -----------------------------------------------------------------------------
// CTA
// -----------------------------------------------------------------------------
function updateCTA(cta) {
  const el = document.querySelector("[data-cta-text]");
  if (el) el.textContent = cta;
}

// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------
export function renderReport(report) {
  const ctx = report.contexto || {};
  // Header: prioriza nome real; se não tiver, mostra o email (com fonte menor)
  const nomeEl = document.querySelector("[data-nome]");
  if (nomeEl) {
    const isEmail = !ctx.nome && !!ctx.email;
    nomeEl.textContent = ctx.nome || ctx.email || "—";
    nomeEl.classList.toggle("is-email", isEmail);
  }
  const idadeStr = ctx.idade != null ? `${ctx.idade} anos` : "";
  setText("[data-age-line]", `${idadeStr}${idadeStr ? " · " : ""}${ctx.data_relatorio || ""}`);

  setText("[data-indice]", fmtIndice(report.indice));
  setText("[data-stat-alertas]", report.contadores.sinais_alerta);
  setText("[data-stat-criticos]", report.contadores.pilares_criticos);
  setText("[data-stat-anos]", report.contadores.anos_tentando);
  setText("[data-stat-forms]", `${report.contadores.formularios}/5`);

  // texto "Sobre seu índice" — generativo simples baseado no índice
  const sobre = sobreIndice(report);
  setText("[data-sobre-text]", sobre);

  updateRadar(report.pilares);
  updateBlocos(report.blocos);
  updateDiagnosticos(report.diagnosticos);
  updateGaps(report.gaps);
  updateCTA(report.cta);
}

function sobreIndice(r) {
  if (r.indice >= 7.5) return "Seu corpo apresenta sinais consistentes de equilíbrio em vários pilares da fertilidade. O foco agora é manter essa base e refinar os pontos específicos que ainda pedem cuidado.";
  if (r.indice >= 5.5) return "Seu corpo apresenta um equilíbrio parcial — alguns pilares estão sustentando bem, outros pedem ajustes pontuais. Há espaço real para melhora com acompanhamento estruturado.";
  return "Seu corpo apresenta sinais importantes de desequilíbrio hormonal e inflamatório que interferem diretamente na ovulação, qualidade dos óvulos e implantação embrionária. A boa notícia é que existe espaço real para melhora quando olhamos o processo de forma completa.";
}

// -----------------------------------------------------------------------------
// LOADING / ERROR states
// -----------------------------------------------------------------------------
export function showError(msg) {
  setText("[data-nome]", "Não foi possível carregar o relatório");
  setText("[data-sobre-text]", msg);
}

export function showLoading() {
  setText("[data-nome]", "Carregando…");
}

// -----------------------------------------------------------------------------
// GATE — controla as 3 telas: login, bloqueio (incompleto), relatório
// -----------------------------------------------------------------------------
const AULAS = {
  aula1: { label: "Aula 1 — Ciclo menstrual",            url: "https://conceber.link/formulario-aula01" },
  aula2: { label: "Aula 2 — Corpo e equilíbrio hormonal", url: "https://conceber.link/formulario-aula02" },
  aula3: { label: "Aula 3 — Ovulação e janela fértil",   url: "https://conceber.link/formulario-aula03" },
  aula4: { label: "Aula 4 — Nutrição e suplementação",   url: "https://conceber.link/formulario-aula04" },
  aula5: { label: "Aula 5 — Saúde do casal",             url: "https://conceber.link/formulario-aula05" },
};

function showOnly(id) {
  for (const el of document.querySelectorAll(".gate, #report-stage")) {
    el.classList.toggle("hidden", el.id !== id);
  }
}

export function showLogin() { showOnly("gate-login"); }
export function showReport() { showOnly("report-stage"); }

export function showIncomplete(aulasVistas) {
  showOnly("gate-blocked");
  const list = document.getElementById("progress-list");
  if (!list) return;
  const vistas = new Set(aulasVistas || []);
  const faltantes = Object.keys(AULAS).filter((k) => !vistas.has(k));
  list.innerHTML = "";

  // ordem fixa: A1..A5 (não a ordem de chegada das rows)
  for (const [key, info] of Object.entries(AULAS)) {
    const done = vistas.has(key);
    const li = document.createElement("li");
    li.className = `progress-item ${done ? "done" : "pending"}`;
    if (done) {
      li.innerHTML = `
        <span class="progress-mark">✓</span>
        <span class="label">${info.label}</span>
        <span class="progress-status">respondido</span>
      `;
    } else {
      li.innerHTML = `
        <span class="progress-mark"></span>
        <span class="label">${info.label}</span>
        <a class="progress-link" href="${info.url}" target="_blank" rel="noopener">Preencher →</a>
      `;
    }
    list.appendChild(li);
  }

  // mensagem dinâmica no rodapé conforme número de faltantes
  const sub = document.querySelector("#gate-blocked .gate-subtitle:last-of-type");
  if (sub) {
    const n = faltantes.length;
    sub.innerHTML = n === 1
      ? `Você está a <b>1 formulário</b> de receber seu relatório completo. Clique em "Preencher" acima e, ao terminar, volte aqui.`
      : `Você ainda precisa preencher <b>${n} formulários</b>. Clique em cada "Preencher" acima e, ao terminar, volte aqui.`;
  }
}

export function setGateMessage(msg, isError = true) {
  const el = document.getElementById("gate-msg");
  if (!el) return;
  el.textContent = msg || "";
  el.style.color = isError ? "#a04738" : "var(--ink-soft)";
}

export function setGateLoading(loading) {
  const btn = document.getElementById("gate-btn");
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? "Carregando…" : "Acessar relatório";
}
