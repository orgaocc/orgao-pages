// =============================================================================
// APP — entry point
// =============================================================================
// Fluxo:
//   1. Mostra gate de login pedindo email
//   2. Submete → busca rows no Supabase via RPC
//   3. Agrega + checa quantas aulas (1..5) foram detectadas
//      • 5 aulas → renderiza relatório
//      • <5      → tela de bloqueio listando o que falta
//      • 0       → mensagem de email não encontrado
//
// Modos especiais (query string):
//   ?preview=carla   → exibe Carla hardcoded (modo design preview)
//   ?email=...       → bypass do gate (útil pra debug); aplica mesma regra de 5/5
//   ?debug=rows|input|report  → loga cada estágio no console
// =============================================================================

import { fetchLeadReport } from "./api.js";
import { aggregateRows, buildReport } from "./methodology.js";
import {
  renderReport, showError,
  showLogin, showReport, showIncomplete,
  setGateMessage, setGateLoading,
} from "./render.js";
import { trackAccess } from "./tracking.js";

const TODAS_AULAS = ["aula1", "aula2", "aula3", "aula4", "aula5"];

const FALLBACK_REPORT = {
  contexto: { nome: "Carla Mendes", email: "", idade: 37, anos_tentando: 2, data_relatorio: "08 de Maio de 2026", formularios_respondidos: 5 },
  indice: 4.8,
  pilares: { detox: 3, hormonal: 3, nutricao: 5, atividade: 6, sono: 4, emocional: 4, masculina: 5 },
  contadores: { sinais_alerta: 7, pilares_criticos: 3, anos_tentando: 2, formularios: 5 },
  blocos: [
    { id: "ciclo", titulo: "Ciclo menstrual", status: "alerta", status_label: "Sinal importante",
      findings: ["Ciclos acima de 35 dias", "Fluxo escuro e presença de \"borra de café\"", "Cólicas intensas — média 7/10", "Irregularidade persistente"],
      insight: "Ciclos muito longos e cólicas fortes não são apenas 'o seu normal'. O padrão do seu corpo sugere desequilíbrio hormonal associado à inflamação pélvica — algo muito comum em mulheres com SOP e adenomiose. Quando o corpo volta a ovular com qualidade, o ciclo costuma responder junto." },
    { id: "corpo", titulo: "Corpo e equilíbrio hormonal", status: "alerta", status_label: "Sinal importante",
      findings: ["Escurecimento em dobras da pele", "Melasma moderado", "Queda de cabelo e fadiga", "Sobrepeso associado a resistência insulínica"],
      insight: "Escurecimento em dobras de pele, queda de cabelo e inchaço constante formam um padrão que a medicina integrativa reconhece bem: resistência à insulina. Isso interfere diretamente na ovulação — e é reversível com o protocolo certo." },
    { id: "ovulacao", titulo: "Ovulação e janela fértil", status: "melhora", status_label: "Ponto de melhora",
      findings: ["Não identifica ovulação naturalmente", "Ausência de percepção de muco fértil", "AMH 0,8 — baixa reserva ovariana", "Nunca confirmou ovulação por ultrassom"],
      insight: "Baixa reserva ovariana não significa ausência de chance. Significa que precisamos agir com estratégia, precisão e menos desperdício de tempo. Seu corpo ainda envia sinais de resposta hormonal — e isso muda completamente o cenário." },
    { id: "nutricao", titulo: "Nutrição e suplementação", status: "melhora", status_label: "Ponto de melhora",
      findings: ["Uso apenas de ácido fólico", "Nunca investigou vitamina D", "Sem suporte antioxidante (Q10 / ômega 3)", "Histórico de perda gestacional"],
      insight: "Fertilidade é metabolismo celular. Muitas mulheres chegam tentando engravidar sem que o corpo tenha sequer os nutrientes básicos para sustentar ovulação, implantação e desenvolvimento embrionário saudável." },
    { id: "casal", titulo: "Saúde do casal", status: "melhora", status_label: "Ponto de melhora",
      findings: ["Espermograma com alterações", "Parceiro fuma ocasionalmente", "Tensão emocional na comunicação do casal", "Varicocele ainda não investigada"],
      insight: "Fertilidade nunca é responsabilidade de uma mulher sozinha. Quando o casal é tratado como equipe, os resultados costumam mudar não apenas biologicamente — mas emocionalmente também." },
  ],
  diagnosticos: [
    { key: "SOP", titulo: "SOP", descricao: "A Síndrome dos Ovários Policísticos interfere diretamente na qualidade da ovulação e no equilíbrio hormonal. Quando bem conduzida, muitos ciclos voltam a responder naturalmente." },
    { key: "Adenomiose", titulo: "Adenomiose", descricao: "Processo inflamatório uterino frequentemente associado a cólicas intensas, fluxo alterado e dificuldade de implantação embrionária." },
    { key: "Baixa Reserva Ovariana", titulo: "Baixa Reserva Ovariana", descricao: "O AMH de 0,8 sugere redução da reserva de óvulos. Isso exige estratégia clínica rápida, inteligente e acompanhamento próximo." },
    { key: "Perda Gestacional", titulo: "Perda Gestacional", descricao: "O histórico de perda gestacional merece investigação e cuidado específico para aumentar suas chances de uma gestação saudável." },
  ],
  gaps: [
    "Qual o real padrão da sua ovulação ao longo dos ciclos",
    "Como estão seus níveis de vitamina D, insulina e inflamação",
    "Qual o impacto metabólico completo da SOP no seu corpo",
    "Quanto da fertilidade masculina pode ser recuperado",
    "Quais ajustes personalizados fariam mais diferença no seu caso",
  ],
  cta: "Carla, o que mais atrasa mulheres tentantes não é apenas o diagnóstico — é caminhar sozinha, sem direção clara, tentando juntar informações soltas na internet enquanto o corpo continua pedindo ajuda. O Programa Conceber foi criado justamente para transformar esse caos em acompanhamento estruturado, individualizado e humano.",
};

// -----------------------------------------------------------------------------
// CORE — busca, agrega, decide qual tela mostrar
// -----------------------------------------------------------------------------
async function processarEmail(email, debug) {
  setGateLoading(true);
  setGateMessage("");

  let data;
  try {
    data = await fetchLeadReport(email);
  } catch (e) {
    console.error(e);
    setGateLoading(false);
    setGateMessage("Erro ao consultar o servidor. Tente novamente em instantes.");
    return;
  }

  if (debug === "rows") { console.log("DATA", data); setGateLoading(false); return; }

  if (!data || data.aulas_respondidas === 0 || !data.aulas_vistas?.length) {
    setGateLoading(false);
    setGateMessage("E-mail não encontrado nos formulários. Confira se digitou o mesmo e-mail usado no preenchimento.");
    trackAccess("email_nao_encontrado", { email });
    return;
  }

  const input = aggregateRows(data);
  if (debug === "input") { console.log("INPUT", input); setGateLoading(false); return; }

  const aulasVistas = input.contexto.aulas_vistas || [];
  const aulasFaltantes = TODAS_AULAS.filter((a) => !aulasVistas.includes(a));

  // ---- regra de acesso: tem que ter as 5 aulas ----
  if (input.contexto.formularios_respondidos < 5) {
    setGateLoading(false);
    showIncomplete(aulasVistas);
    trackAccess("relatorio_bloqueado", {
      email,
      aulas_respondidas: input.contexto.formularios_respondidos,
      aulas_vistas: aulasVistas,
      aulas_faltantes: aulasFaltantes,
    });
    return;
  }

  const report = buildReport(input);
  if (debug === "report") { console.log("REPORT", report); setGateLoading(false); return; }

  setGateLoading(false);
  renderReport(report);
  showReport();
  trackAccess("relatorio_visualizado", {
    email,
    aulas_respondidas: 5,
    indice: report.indice,
    pilares: report.pilares,
    sinais_alerta: report.contadores.sinais_alerta,
    pilares_criticos: report.contadores.pilares_criticos,
    diagnosticos: report.diagnosticos.map((d) => d.titulo),
  });
}

// -----------------------------------------------------------------------------
// UI bindings
// -----------------------------------------------------------------------------
function initGate(debug) {
  const form = document.getElementById("gate-form");
  const back = document.getElementById("gate-back");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = (document.getElementById("gate-email").value || "").trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setGateMessage("Digite um e-mail válido.");
        return;
      }
      processarEmail(email, debug);
    });
  }
  if (back) back.addEventListener("click", () => showLogin());
}

// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------
function main() {
  const params = new URLSearchParams(location.search);
  const preview = params.get("preview");
  const email = params.get("email");
  const debug = params.get("debug");

  initGate(debug);

  // ?preview=carla → mostra Carla hardcoded direto
  if (preview === "carla") { renderReport(FALLBACK_REPORT); showReport(); return; }

  // ?email=... → bypass do gate (mas mantém regra de 5/5)
  if (email) { processarEmail(email, debug); return; }

  // padrão: tela de login
  showLogin();
}

main();
