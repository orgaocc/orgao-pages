// =============================================================================
// METODOLOGIA — implementação fiel de metodologia_relatorio_conceber.md v1.0
// =============================================================================

import {
  detectAula, INPUT_TO_QUESTION,
  normalizeAnswer, toArray, normalizeA4Q1, normalizeDiagnosticos,
} from "./mappings.js";

// -----------------------------------------------------------------------------
// AGREGADOR — recebe N rows do banco e monta o input único
// -----------------------------------------------------------------------------
// A InLead envia 1 webhook POR ETAPA do form (cada nova resposta = nova row).
// Para cada aula, queremos a row MAIS COMPLETA (mais respostas preenchidas).
// -----------------------------------------------------------------------------
export function aggregateRows(rows) {
  const respostas = {};
  let nome = "", email = "";
  const aulasVistas = new Set();

  // 1. agrupa por aula, mantém a row com mais opcoes_ preenchidas
  //    detectAula prioriza row.aula (coluna do banco, vinda da edge function
  //    isolada da aula); cai pra fingerprint do payload se aula vier null.
  const bestByAula = {};   // aula → row
  for (const row of rows) {
    const payload = row.payload || {};
    const aula = detectAula(row);
    if (!aula) continue;
    const opcoesCount = Object.keys(payload).filter((k) => k.startsWith("opcoes_")).length;
    const cur = bestByAula[aula];
    const curCount = cur ? Object.keys(cur.payload || {}).filter((k) => k.startsWith("opcoes_")).length : -1;
    if (opcoesCount > curCount) bestByAula[aula] = row;
  }

  // ordem cronológica (mais antiga primeiro, mais nova sobrescreve em conflitos)
  const sorted = Object.entries(bestByAula)
    .map(([aula, row]) => ({ aula, row }))
    .sort((a, b) => new Date(a.row.created_at || 0) - new Date(b.row.created_at || 0));

  // Para a Aula 1, o campo `ciclo` é SOBRESCRITO (frequência e borra de café
  // têm o mesmo ID interno na InLead). Varre TODAS as rows da Aula 1 (ou
  // sem aula detectada — registros antigos) capturando os 2 valores distintos.
  const cicloValues = new Set();
  for (const row of rows) {
    const payload = row.payload || {};
    if (!payload.ciclo) continue;
    // só inclui se a row for da Aula 1 (ou sem identificação — fallback antigo)
    const aula = detectAula(row);
    if (aula && aula !== "aula1") continue;
    cicloValues.add(String(payload.ciclo).trim());
  }
  for (const v of cicloValues) {
    const s = v.toLowerCase();
    if (s.includes("borra")) respostas["A1_Q2"] = v;
    else respostas["A1_Q1"] = v;
  }

  for (const { aula, row } of sorted) {
    const payload = row.payload || {};
    aulasVistas.add(aula);

    const map = INPUT_TO_QUESTION[aula];
    if (!map) continue;

    // Aula 1 tem duas colunas chamadas "ciclo" → o JSON pode ter vindo como
    // ambas combinadas em uma única string com pipe (InLead). Trato abaixo.
    const cicloDual = [];

    for (const [inputKey, value] of Object.entries(payload)) {
      const qcode = map[inputKey];
      if (!qcode) continue;
      if (qcode === "_A1_DUAL") { cicloDual.push(value); continue; }
      respostas[qcode] = value;
    }

    if (cicloDual.length > 0) {
      // separa: a primeira "ciclo" é frequência (Q1), a segunda é borra de café (Q2)
      // se vier um valor único contendo "borra de café", é Q2
      // se vier "Entre 25 e 35", é Q1
      for (const v of cicloDual) {
        const s = String(v || "").toLowerCase();
        if (s.includes("borra")) respostas["A1_Q2"] = v;
        else if (s.includes("dias") || s.includes("meses")) respostas["A1_Q1"] = v;
      }
    }

    // detecta email no payload procurando valor com formato @
    if (!email) {
      for (const v of Object.values(payload)) {
        if (typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) {
          email = v.trim().toLowerCase();
          break;
        }
      }
    }
  }

  // se não temos nome real, deixa em branco — o render mostra o email no header
  // e o CTA usa fallback "Você"

  const hoje = new Date();
  const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const dataRel = `${String(hoje.getDate()).padStart(2,"0")} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;

  return {
    contexto: {
      nome, email,
      idade: null,
      anos_tentando: null,
      data_relatorio: dataRel,
      formularios_respondidos: aulasVistas.size,
      aulas_vistas: Array.from(aulasVistas),
    },
    respostas,
  };
}

// -----------------------------------------------------------------------------
// SCORE por questão — tabela do MD seção 3
// -----------------------------------------------------------------------------
const T = {
  A1_Q1: { A: [0,true],  B: [3,true],  C: [10,false], D: [3,true] },
  A1_Q2: { A: [10,false], B: [6,false], C: [2,true] },
  A1_Q3: { A: [10,false], B: [5,false], C: [2,true],  D: [3,true] },
  A1_Q4: { A: [3,true],   B: [10,false], C: [6,false], D: [2,true] },
  A1_Q5: { A: [10,false], B: [6,false], C: [3,true],  D: [0,true] },
  A1_Q6: { "1": [10,false], "2": [3,true] },
  A1_Q7: { A: [10,false], B: [3,true] },
  A1_Q8: { A: [5,false],  B: [10,false], C: [4,true] },
  A2_Q3: { A: [10,false], B: [7,false], C: [4,true],  D: [2,true] },
  A2_Q4: { A: [10,false], B: [6,false], C: [2,true] },
  A2_Q5: { I: [9,false],  II: [6,false], III: [4,true], IV: [2,true] },
  A2_Q6: { A: [10,false], B: [7,false], C: [4,true],  D: [2,true] },
  A2_Q7: { A: [10,false], B: [8,false], C: [3,true],  D: [1,true] },
  A2_Q8: { fortes: [10,false], fracas: [5,false] },
  A2_Q9:  { nao: [10,false], sim: [4,true] },
  A2_Q10: { nao: [10,false], sim: [3,true] },
  A2_Q11: { nao: [10,false], sim: [4,true] },
  A2_Q12: { A: [10,false], B: [3,true], C: [4,true], D: [4,true] },
  A2_Q14: { A: [10,false], B: [8,false], C: [5,false], D: [3,true] },
  A3_Q1: { sim: [10,false], nao: [4,true] },
  A3_Q2: { A: [3,true], B: [4,true], C: [6,false], D: [10,false] },
  A3_Q3: { sim: [10,false], nao: [4,true] },
  A3_Q5: { sim: [10,false], nao: [5,false] },
  A3_Q6: { sim: [10,false], asvezes: [6,false], nao: [3,true] },
  A4_Q2: { sim: [7,false], nao: [4,true], _NA: [10,false] },
  A4_Q4: { A: [4,true], B: [10,false], C: [2,true] },
  A4_Q6: { A: [10,false], B: [4,true], C: [3,true] },
  A5_Q1: { A: [10,false], B: [5,false], C: [2,true] },
  A5_Q2: { A: [4,true], B: [10,false], C: [9,false] },
  A5_Q3: { A: [2,true], B: [5,false], C: [10,false] },
  A5_Q4: { A: [10,false], B: [6,false], C: [3,true], D: [2,true] },
  A5_Q5: { A: [10,false], B: [6,false], C: [3,true] },
  A5_Q6: { A: [10,false], B: [5,false], C: [2,true] },
  A5_Q8: { A: [5,true], B: [5,true], C: [5,true], D: [10,false] },
  A5_M1: { adequado: [10,false], magro: [10,false], sobrepeso: [5,true], obeso: [2,true] },
  A5_M2: { nao: [10,false], sim: [2,true] },
  A5_M3: { nao: [10,false], ocasional: [7,false], frequente: [3,true] },
  A5_M4: { nao: [10,false], sim: [1,true] },
  A5_M5: { normal: [10,false], alterado: [2,true], nunca: [5,true] },
  A5_M6: { nao: [10,false], sim: [3,true], nunca: [5,false] },
  A5_M7: { sim: [10,false], nao: [4,true] },
};

function scoreFromTable(table, ans) {
  if (ans === null || ans === undefined) return { value: 5, alerta: false, missing: true };
  const hit = table[ans];
  if (!hit) return { value: 5, alerta: false, missing: true };
  return { value: hit[0], alerta: hit[1] };
}

function scoreIMC(peso, altura) {
  if (!peso || !altura) return { value: 5, alerta: false, imc: null, faixa: "desconhecido" };
  const a = altura > 3 ? altura / 100 : altura;
  const imc = peso / (a * a);
  if (imc >= 18.5 && imc <= 24.9) return { value: 10, alerta: false, imc, faixa: "adequado" };
  if (imc >= 25 && imc <= 29.9) return { value: 4, alerta: true, imc, faixa: "sobrepeso" };
  if (imc >= 30) return { value: 2, alerta: true, imc, faixa: "obesidade" };
  return { value: 4, alerta: true, imc, faixa: "abaixo" };
}

function scoreAMH(raw) {
  if (raw === null || raw === undefined || raw === "") return { value: 5, alerta: false, amh: null };
  const s = String(raw).toLowerCase();
  if (s.includes("maior que 1")) return { value: 10, alerta: false, amh: 1.5 };
  if (s.includes("menor que 1")) return { value: 4, alerta: true, amh: 0.7 };
  if (s.includes("menor que 0")) return { value: 2, alerta: true, amh: 0.3 };
  const num = parseFloat(s.replace(",", "."));
  if (!isNaN(num)) {
    if (num > 1.5) return { value: 10, alerta: false, amh: num };
    if (num >= 1.0) return { value: 7, alerta: false, amh: num };
    if (num >= 0.5) return { value: 4, alerta: true, amh: num };
    return { value: 2, alerta: true, amh: num };
  }
  return { value: 5, alerta: false, amh: null };
}

function scoreA3Q4(raw) {
  const arr = toArray(raw); const n = arr.length;
  if (n === 0) return { value: 3, alerta: true };
  if (n === 1) return { value: 6, alerta: false };
  return { value: 9, alerta: false };
}
function scoreA3Q8(raw) {
  const arr = toArray(raw); const n = arr.length;
  const isNoPercebo = arr.some((x) => String(x).toLowerCase().includes("não percebo"));
  if (isNoPercebo) return { value: 3, alerta: true };
  if (n >= 3) return { value: 10, alerta: false };
  if (n >= 1) return { value: 6, alerta: false };
  return { value: 5, alerta: false, missing: true };
}
function scoreA4Q1(raw) {
  const letters = normalizeA4Q1(raw);
  const map = { A: [10,false], B: [5,true], C: [2,true], D: [3,true], E: [5,true], F: [2,true], G: [1,true] };
  if (letters.length === 0) return { value: 5, alerta: false, perdas: [] };
  let worst = 11; let alerta = false;
  for (const k of letters) {
    if (!map[k]) continue;
    if (map[k][0] < worst) worst = map[k][0];
    if (map[k][1]) alerta = true;
  }
  return { value: worst === 11 ? 5 : worst, alerta, perdas: letters };
}
function scoreA4Q5(raw, textoExtra) {
  let arr = toArray(raw);
  if (textoExtra && String(textoExtra).trim()) {
    // texto extra geralmente lista vários suplementos, +1 ao count
    arr = arr.concat([textoExtra]);
  }
  const n = arr.filter((x) => !String(x).toLowerCase().includes("não uso")).length;
  if (n >= 3) return { value: 10, alerta: false };
  if (n >= 1) return { value: 6, alerta: false };
  return { value: 2, alerta: true };
}
function scoreA5Q7(raw) {
  const arr = toArray(raw).filter((x) => !String(x).toLowerCase().includes("satisfat"));
  if (arr.length === 0) return { value: 10, alerta: false };
  if (arr.length === 1) return { value: 6, alerta: false };
  return { value: 3, alerta: true };
}

function scoreQ(input, code) {
  const raw = input.respostas[code];
  const t = T[code];
  if (t) {
    const ans = normalizeAnswer(code, raw);
    return scoreFromTable(t, ans);
  }
  switch (code) {
    case "A2_Q1": {
      const peso = parseFloat(String(input.respostas["A2_PESO"] ?? "").replace(",", "."));
      const altura = parseFloat(String(input.respostas["A2_ALTURA"] ?? "").replace(",", "."));
      const r = scoreIMC(isNaN(peso) ? null : peso, isNaN(altura) ? null : altura);
      return { value: r.value, alerta: r.alerta };
    }
    case "A3_Q4": return scoreA3Q4(raw);
    case "A3_Q7": { const r = scoreAMH(raw); return { value: r.value, alerta: r.alerta }; }
    case "A3_Q8": return scoreA3Q8(raw);
    case "A4_Q1": { const r = scoreA4Q1(raw); return { value: r.value, alerta: r.alerta }; }
    case "A4_Q5": return scoreA4Q5(raw, input.respostas["A4_Q5_TEXTO"]);
    case "A5_Q7": return scoreA5Q7(raw);
    default: return { value: 5, alerta: false, missing: true };
  }
}

// -----------------------------------------------------------------------------
// PILARES
// -----------------------------------------------------------------------------
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const round = (v) => Math.round(v);

function pillarWeighted(input, weights) {
  let num = 0, den = 0;
  for (const [code, w] of weights) {
    const r = scoreQ(input, code);
    num += r.value * w;
    den += w;
  }
  if (den === 0) return 5;
  return clamp(round(num / den), 0, 10);
}

function pillarAtividade(input) {
  let base = 6;
  const peso = parseFloat(String(input.respostas["A2_PESO"] ?? "").replace(",", "."));
  const altura = parseFloat(String(input.respostas["A2_ALTURA"] ?? "").replace(",", "."));
  if (!isNaN(peso) && !isNaN(altura)) {
    const r = scoreIMC(peso, altura);
    if (r.faixa === "sobrepeso") base -= 1;
    if (r.faixa === "obesidade") base -= 2;
    if (r.faixa === "abaixo") base -= 1;
  }
  if (scoreQ(input, "A5_M7").value >= 8) base += 1;
  return clamp(base, 0, 10);
}

function pillarSono(input) {
  let base = 7;
  if (scoreQ(input, "A2_Q10").alerta) base -= 2;
  if (scoreQ(input, "A2_Q11").alerta) base -= 1;
  const tpm = normalizeAnswer("A2_Q14", input.respostas["A2_Q14"]);
  if (tpm === "D") base -= 1;
  return clamp(base, 0, 10);
}

// -----------------------------------------------------------------------------
// BLOCOS de análise
// -----------------------------------------------------------------------------
const BLOCO_QUESTOES = {
  ciclo:    ["A1_Q1","A1_Q2","A1_Q3","A1_Q4","A1_Q5","A1_Q6","A1_Q7","A1_Q8"],
  corpo:    ["A2_Q1","A2_Q3","A2_Q4","A2_Q5","A2_Q6","A2_Q7","A2_Q8","A2_Q9","A2_Q10","A2_Q11","A2_Q12","A2_Q14"],
  ovulacao: ["A3_Q1","A3_Q2","A3_Q3","A3_Q4","A3_Q5","A3_Q6","A3_Q7","A3_Q8"],
  nutricao: ["A4_Q1","A4_Q2","A4_Q4","A4_Q5","A4_Q6"],
  casal:    ["A5_Q1","A5_Q2","A5_Q3","A5_Q4","A5_Q5","A5_Q6","A5_Q7","A5_Q8","A5_M1","A5_M2","A5_M3","A5_M4","A5_M5","A5_M6","A5_M7"],
};

const BLOCO_INFO = {
  ciclo: {
    titulo: "Ciclo menstrual",
    insight_alto: "Ciclos muito longos e cólicas fortes não são apenas 'o seu normal'. O padrão do seu corpo sugere desequilíbrio hormonal associado à inflamação pélvica — algo muito comum em mulheres com SOP e adenomiose. Quando o corpo volta a ovular com qualidade, o ciclo costuma responder junto.",
    insight_medio: "Seu ciclo apresenta sinais de irregularidade que merecem atenção. Pequenos ajustes na regulação hormonal e no manejo da inflamação costumam normalizar o padrão menstrual de forma consistente.",
    insight_baixo: "Seu ciclo apresenta um padrão dentro do esperado. Manter consistência na rotina hormonal e nutricional sustenta esse equilíbrio ao longo da jornada.",
  },
  corpo: {
    titulo: "Corpo e equilíbrio hormonal",
    insight_alto: "Escurecimento em dobras de pele, queda de cabelo e inchaço constante formam um padrão que a medicina integrativa reconhece bem: resistência à insulina. Isso interfere diretamente na ovulação — e é reversível com o protocolo certo.",
    insight_medio: "Há sinais corporais que apontam para um eixo hormonal em desequilíbrio leve. A boa notícia é que esses sinais respondem rapidamente a ajustes metabólicos consistentes.",
    insight_baixo: "Seu corpo apresenta sinais consistentes de equilíbrio hormonal. O foco agora é manter — e ajustar pontualmente o que ainda pede cuidado.",
  },
  ovulacao: {
    titulo: "Ovulação e janela fértil",
    insight_alto: "Baixa reserva ovariana não significa ausência de chance. Significa que precisamos agir com estratégia, precisão e menos desperdício de tempo. Seu corpo ainda envia sinais de resposta hormonal — e isso muda completamente o cenário.",
    insight_medio: "Seu corpo mostra sinais ovulatórios, mas há lacunas na percepção e no aproveitamento da janela fértil. Estruturar o reconhecimento da ovulação aumenta significativamente as chances mês a mês.",
    insight_baixo: "Sua ovulação parece ocorrer com regularidade e percepção. Isso é uma base poderosa — agora é otimizar o aproveitamento de cada ciclo.",
  },
  nutricao: {
    titulo: "Nutrição e suplementação",
    insight_alto: "Fertilidade é metabolismo celular. Muitas mulheres chegam tentando engravidar sem que o corpo tenha sequer os nutrientes básicos para sustentar ovulação, implantação e desenvolvimento embrionário saudável.",
    insight_medio: "Há lacunas pontuais na sua suplementação que podem ser ajustadas com facilidade. Pequenas mudanças na rotina nutricional costumam ter impacto desproporcional na fertilidade.",
    insight_baixo: "Sua base nutricional está bem estruturada. O foco agora é manter a consistência e ajustar finamente conforme cada fase do ciclo.",
  },
  casal: {
    titulo: "Saúde do casal",
    insight_alto: "Fertilidade nunca é responsabilidade de uma mulher sozinha. Quando o casal é tratado como equipe, os resultados costumam mudar não apenas biologicamente — mas emocionalmente também.",
    insight_medio: "Há aspectos da saúde do casal que merecem cuidado conjunto. Tratar a fertilidade como projeto compartilhado costuma melhorar tanto resultados clínicos quanto a qualidade da jornada.",
    insight_baixo: "A dinâmica do casal aparece como um pilar de sustentação. Manter essa parceria ativa é um dos maiores diferenciais a longo prazo.",
  },
};

const PHRASES = {
  A1_Q1: { A: "Mais de 3 meses sem menstruar", B: "Ciclos abaixo de 25 dias", D: "Ciclos acima de 35 dias com irregularidade persistente" },
  A1_Q2: { B: "Borra de café no início da menstruação", C: "Borra de café por 2 ou mais dias antes da menstruação" },
  A1_Q3: { C: "Cor da menstruação escura/preta — sinal de estagnação", D: "Cor rosa clara — possível baixa de estrógeno" },
  A1_Q4: { A: "Fluxo menstrual escasso", D: "Fluxo intenso com risco de anemia" },
  A1_Q5: { C: "Cólicas intensas — média 7/10, comprometendo a rotina", D: "Cólicas incapacitantes" },
  A1_Q6: { "2": "Presença frequente de coágulos" },
  A1_Q7: { B: "Odor forte e diferente do habitual" },
  A1_Q8: { C: "Duração da menstruação acima de 5 dias" },
  A2_Q3: { C: "Melasma visível no rosto", D: "Melasma intenso" },
  A2_Q4: { C: "Escurecimento visível em axila, virilha e pescoço" },
  A2_Q5: { III: "Celulite em estágio avançado", IV: "Celulite em estágio avançado com nódulos" },
  A2_Q6: { C: "Hirsutismo moderado confirmado", D: "Hirsutismo intenso confirmado" },
  A2_Q7: { C: "Queda de cabelo intensa", D: "Quadro compatível com alopecia" },
  A2_Q9: { sim: "Inchaço corporal frequente" },
  A2_Q10: { sim: "Fadiga persistente ao longo do dia" },
  A2_Q11: { sim: "Lapsos de memória e dificuldade de concentração" },
  A2_Q12: { B: "Intestino preso de forma recorrente", C: "Intestino alternando entre prisão e diarreia", D: "Intestino com gases e dor frequente" },
  A2_Q14: { D: "TPM intensa afetando rotina e relacionamentos" },
  A3_Q1: { nao: "Não identifica ovulação naturalmente" },
  A3_Q2: { A: "Ausência de percepção de muco fértil", B: "Muco cervical seco ou ausente" },
  A3_Q3: { nao: "Libido reduzida no período fértil" },
  A3_Q5: { nao: "Nunca confirmou ovulação por ultrassom" },
  A3_Q6: { nao: "Relações esparsas no período fértil" },
  A4_Q2: { nao: "Causa da perda gestacional não investigada" },
  A4_Q4: { A: "Usa apenas ácido fólico — recomendação desatualizada", C: "Sem suplementação de folato" },
  A4_Q6: { B: "Vitamina D abaixo de 40 ng/mL", C: "Nunca realizou exame de vitamina D" },
  A5_Q1: { C: "Lubrificação ausente nas relações" },
  A5_Q2: { A: "Frequência sexual reduzida (1 ou menos por semana)" },
  A5_Q3: { A: "Dor frequente nas relações" },
  A5_Q4: { C: "Casal evita conversas sobre o tema", D: "Parceiro não envolvido na jornada" },
  A5_Q5: { C: "Intimidade do casal centrada apenas em engravidar" },
  A5_Q6: { C: "Evitação da relação sexual" },
  A5_Q8: { A: "Histórico de IST relatado", B: "Histórico de IST relatado", C: "Histórico de IST relatado" },
  A5_M1: { sobrepeso: "Parceiro com sobrepeso", obeso: "Parceiro com obesidade" },
  A5_M2: { sim: "Parceiro fuma" },
  A5_M3: { frequente: "Parceiro consome álcool com frequência" },
  A5_M4: { sim: "Parceiro faz uso de anabolizantes" },
  A5_M5: { alterado: "Espermograma com alterações", nunca: "Parceiro nunca fez espermograma" },
  A5_M6: { sim: "Varicocele diagnosticada" },
  A5_M7: { nao: "Parceiro sem rotina de atividade física" },
};

function findingPhrase(code, raw, ans, input) {
  const map = PHRASES[code];
  if (map && ans && map[ans]) return map[ans];
  if (code === "A2_Q1") {
    const peso = parseFloat(String(input.respostas["A2_PESO"] ?? "").replace(",", "."));
    const altura = parseFloat(String(input.respostas["A2_ALTURA"] ?? "").replace(",", "."));
    const r = scoreIMC(isNaN(peso) ? null : peso, isNaN(altura) ? null : altura);
    if (r.faixa === "sobrepeso") return `Sobrepeso (IMC ${r.imc.toFixed(1)})`;
    if (r.faixa === "obesidade") return `Obesidade (IMC ${r.imc.toFixed(1)})`;
    if (r.faixa === "abaixo") return `Baixo peso (IMC ${r.imc.toFixed(1)})`;
  }
  if (code === "A3_Q7") {
    const r = scoreAMH(raw);
    if (r.amh !== null && r.amh < 1.0) return `AMH ${r.amh.toFixed(1)} ng/mL — baixa reserva ovariana confirmada`;
  }
  return "";
}

function buildBloco(input, blocoId) {
  const info = BLOCO_INFO[blocoId];
  const codes = BLOCO_QUESTOES[blocoId];
  const alertas = [];
  for (const code of codes) {
    const r = scoreQ(input, code);
    if (r.alerta) {
      const ans = normalizeAnswer(code, input.respostas[code]);
      alertas.push({ code, value: r.value, phrase: findingPhrase(code, input.respostas[code], ans, input) });
    }
  }
  alertas.sort((a, b) => a.value - b.value);
  const findings = alertas.filter((a) => a.phrase).slice(0, 5).map((a) => a.phrase);
  let status, status_label;
  if (alertas.length >= 3) { status = "alerta"; status_label = "Sinal importante"; }
  else if (alertas.length >= 1) { status = "melhora"; status_label = "Ponto de melhora"; }
  else { status = "saudavel"; status_label = "Saudável"; }
  const insight = status === "alerta" ? info.insight_alto : status === "melhora" ? info.insight_medio : info.insight_baixo;
  return { id: blocoId, titulo: info.titulo, status, status_label, findings, insight };
}

// -----------------------------------------------------------------------------
// DIAGNÓSTICOS
// -----------------------------------------------------------------------------
const DIAG_DESC = {
  SOP: "A Síndrome dos Ovários Policísticos interfere diretamente na qualidade da ovulação e no equilíbrio hormonal. Quando bem conduzida, muitos ciclos voltam a responder naturalmente.",
  Endometriose: "Doença inflamatória que afeta a qualidade dos óvulos e a receptividade endometrial. Responde a protocolo anti-inflamatório consistente.",
  Adenomiose: "Processo inflamatório uterino frequentemente associado a cólicas intensas, fluxo alterado e dificuldade de implantação embrionária.",
  "Baixa Reserva Ovariana": "O AMH sugere redução da reserva de óvulos. Isso exige estratégia clínica rápida, inteligente e acompanhamento próximo.",
  Mioma: "Pode interferir na implantação dependendo da localização. Tratamento individualizado conforme tipo e tamanho.",
  Hipotireoidismo: "Disfunção tireoidiana impacta diretamente a ovulação e a qualidade do ciclo. Reposição adequada é fundamental.",
  "Fator Masculino": "Alterações no espermograma podem ser melhoradas em 90 dias com mudança de hábitos e acompanhamento.",
  "Perda Gestacional": "O histórico de perda gestacional merece investigação e cuidado específico para aumentar suas chances de uma gestação saudável.",
  "Falhas de FIV": "Falhas anteriores em FIV pedem investigação aprofundada de receptividade endometrial e qualidade embrionária.",
  "Infertilidade sem causa aparente": "Quando exames básicos não explicam, a investigação integrativa costuma revelar fatores nutricionais, inflamatórios e hormonais ainda não tratados.",
};

const DIAG_PRIORITY = ["SOP", "Endometriose", "Adenomiose", "Baixa Reserva Ovariana", "Perda Gestacional", "Mioma", "Hipotireoidismo", "Fator Masculino", "Falhas de FIV", "Infertilidade sem causa aparente"];

function buildDiagnosticos(input) {
  const set = new Set(normalizeDiagnosticos(input.respostas["A2_Q13"], input.respostas["A2_Q13_OUTROS"]));

  const amh = scoreAMH(input.respostas["A3_Q7"]);
  if (amh.amh !== null && amh.amh < 1.0) set.add("Baixa Reserva Ovariana");

  const m5 = normalizeAnswer("A5_M5", input.respostas["A5_M5"]);
  if (m5 === "alterado") set.add("Fator Masculino");

  const perdas = scoreA4Q1(input.respostas["A4_Q1"]);
  if (perdas.perdas.length > 0 && !perdas.perdas.includes("A")) set.add("Perda Gestacional");

  const list = DIAG_PRIORITY.filter((k) => set.has(k)).slice(0, 4);
  return list.map((k) => ({ key: k, titulo: k, descricao: DIAG_DESC[k] || "" }));
}

// -----------------------------------------------------------------------------
// GAPS
// -----------------------------------------------------------------------------
function buildGaps(input) {
  const gaps = [];
  gaps.push("Qual o real padrão da sua ovulação ao longo dos ciclos");
  const perdas = scoreA4Q1(input.respostas["A4_Q1"]);
  const temPerda = perdas.perdas.length > 0 && !perdas.perdas.includes("A");
  gaps.push(temPerda ? "Como sua história imunológica e endometrial pode estar afetando suas chances" : "Como o histórico de tentativas vem afetando seu eixo hormonal hoje");
  gaps.push("Como estão seus níveis de vitamina D, insulina e inflamação");
  const m2 = normalizeAnswer("A5_M2", input.respostas["A5_M2"]) === "sim";
  const m5 = normalizeAnswer("A5_M5", input.respostas["A5_M5"]) === "alterado";
  const m6 = normalizeAnswer("A5_M6", input.respostas["A5_M6"]);
  const temFatorMasc = m2 || m5 || m6 === "sim" || m6 === "nunca";
  gaps.push(temFatorMasc ? "Quanto da fertilidade masculina pode ser recuperado" : "Qual o impacto metabólico completo do quadro hormonal no seu corpo");
  gaps.push("Quais ajustes personalizados fariam mais diferença no seu caso");
  return gaps.slice(0, 5);
}

// -----------------------------------------------------------------------------
// CTA
// -----------------------------------------------------------------------------
function buildCTA(input, pilares, diagnosticos) {
  const primeiroNome = (input.contexto.nome || "").split(" ")[0];
  const n = diagnosticos.length;
  const simultaneo = n >= 2 ? "simultâneos" : "simultâneo";
  const entries = Object.entries(pilares).sort((a, b) => a[1] - b[1]);
  const piorPilar = entries[0][0];
  const achadoMap = {
    detox: "um padrão inflamatório que pede atenção",
    hormonal: "um quadro hormonal que precisa de ajuste",
    nutricao: "lacunas nutricionais importantes",
    atividade: "um corpo pedindo movimento",
    sono: "um padrão de exaustão acumulada",
    emocional: "uma carga emocional que merece cuidado",
    masculina: "um fator masculino a tratar",
  };
  const achado = achadoMap[piorPilar] || "pontos importantes a tratar";
  const perdas = scoreA4Q1(input.respostas["A4_Q1"]);
  const temPerda = perdas.perdas.length > 0 && !perdas.perdas.includes("A");
  const situacao = temPerda ? "uma perda que merece investigação — não conformidade" : "uma jornada que merece direção clara";

  // monta o vocativo + abertura sem repetir "Você"
  const vocativo = primeiroNome ? `${primeiroNome}, ` : "";
  const sujeito = primeiroNome ? "você tem" : "Você tem";
  const diagText = n === 0 ? "" : `${sujeito} ${n} diagnóstico${n > 1 ? "s" : ""} ${simultaneo}, `;

  // se não tem diagnósticos e não tem nome, capitaliza o achado
  let abertura;
  if (n === 0 && !primeiroNome) {
    abertura = `Identificamos ${achado}`;
  } else if (n === 0) {
    abertura = `${vocativo}identificamos ${achado}`;
  } else {
    abertura = `${vocativo}${diagText}${achado}`;
  }

  return `${abertura} e ${situacao}. Você não precisa de mais informação genérica. Você precisa de um protocolo feito para o seu corpo, com uma equipe que já guiou milhares de mulheres nessa jornada.`;
}

// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------
export function buildReport(input) {
  const pilares = {
    detox:     pillarWeighted(input, [["A1_Q1",1],["A1_Q2",2],["A1_Q3",2],["A1_Q6",1],["A1_Q7",2],["A2_Q12",2],["A2_Q3",1]]),
    hormonal:  pillarWeighted(input, [["A1_Q1",2],["A1_Q4",1],["A1_Q5",1],["A2_Q1",2],["A2_Q4",2],["A2_Q6",2],["A2_Q7",1],["A2_Q14",1],["A3_Q7",2]]),
    nutricao:  pillarWeighted(input, [["A4_Q4",3],["A4_Q5",2],["A4_Q6",2],["A2_Q8",1],["A2_Q12",1]]),
    atividade: pillarAtividade(input),
    sono:      pillarSono(input),
    emocional: clamp(pillarWeighted(input, [["A2_Q14",2],["A2_Q10",1],["A5_Q4",2],["A5_Q5",2],["A5_Q6",1],["A5_Q7",1]]) - ((input.contexto.anos_tentando ?? 0) >= 3 ? 1 : 0), 0, 10),
    masculina: pillarWeighted(input, [["A5_M1",1],["A5_M2",2],["A5_M3",1],["A5_M4",2],["A5_M5",3],["A5_M6",2],["A5_M7",1]]),
  };

  const indiceRaw = (pilares.detox + pilares.hormonal + pilares.nutricao + pilares.atividade + pilares.sono + pilares.emocional + pilares.masculina) / 7;
  const indice = Math.round(indiceRaw * 10) / 10;

  let sinais = 0;
  for (const codes of Object.values(BLOCO_QUESTOES)) {
    for (const c of codes) if (scoreQ(input, c).alerta) sinais++;
  }
  sinais += toArray(input.respostas["A2_Q13"]).length;

  const pilaresCriticos = Object.values(pilares).filter((v) => v <= 4).length;

  const blocos = ["ciclo", "corpo", "ovulacao", "nutricao", "casal"].map((id) => buildBloco(input, id));
  const diagnosticos = buildDiagnosticos(input);
  const cta = buildCTA(input, pilares, diagnosticos);
  const gaps = buildGaps(input);

  return {
    contexto: input.contexto,
    indice, pilares,
    contadores: {
      sinais_alerta: sinais,
      pilares_criticos: pilaresCriticos,
      anos_tentando: input.contexto.anos_tentando ?? 0,
      formularios: input.contexto.formularios_respondidos,
    },
    blocos, diagnosticos, gaps, cta,
  };
}
