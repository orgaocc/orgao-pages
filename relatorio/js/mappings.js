// =============================================================================
// MAPPINGS — Coluna do Postgres → código da metodologia
// =============================================================================
// Mapeamento direto coluna → A_Q_n. Substitui a estrutura antiga baseada em
// IDs opcoes_XXX da InLead (legado). A nova estrutura usa nomes humanos das
// colunas das tabelas gc_inlead_aulaN (uma tabela por aula no Postgres).
//
// Endpoint: hooks.grupoconceber.com/webhook/get-relatorio-data (n8n)
// retorna estrutura: { aulas_respondidas, aulas_vistas, aula1:{...}, aula2:{...}, ... }
// =============================================================================

// -----------------------------------------------------------------------------
// 1. COLUNA → CÓDIGO da metodologia, por aula
// -----------------------------------------------------------------------------
export const COLUMN_TO_QUESTION = {
  aula1: {
    ciclo_freq:         "A1_Q1",
    borra_cafe:         "A1_Q2",
    cor_sangue:         "A1_Q3",
    volume_fluxo:       "A1_Q4",
    intensidade_colica: "A1_Q5",
    coagulos:           "A1_Q6",
    odor:               "A1_Q7",
    duracao_fluxo:      "A1_Q8",
    muco_ovulatorio:    "A3_Q2_ALT",   // só usado se A3_Q2 da Aula 3 estiver vazio
  },
  aula2: {
    altura:               "A2_ALTURA",   // entra no cálculo do IMC
    peso:                 "A2_PESO",
    autopercepcao_peso:   "A2_Q2",       // não pontua
    melasma:              "A2_Q3",
    escurecimento_pele:   "A2_Q4",
    celulite:             "A2_Q5",
    pelos:                "A2_Q6",
    cabelo:               "A2_Q7",
    unhas:                "A2_Q8",
    inchada:              "A2_Q9",
    fadiga:               "A2_Q10",
    memoria:              "A2_Q11",
    intestino:            "A2_Q12",
    diagnostico:          "A2_Q13",
    diagnostico_outro:    "A2_Q13_OUTROS",
    tpm:                  "A2_Q14",
    // anticoncepcional e regularidade_ciclo: não usados pela metodologia atual
  },
  aula3: {
    percebe_periodo_fertil:  "A3_Q1",
    muco_cervical:           "A3_Q2",
    libido:                  "A3_Q3",
    metodo_ovulacao:         "A3_Q4",
    confirmou_ovulacao:      "A3_Q5",
    relacoes_periodo_fertil: "A3_Q6",
    exame_amh:               "A3_Q7",
    percebe_ovulacao:        "A3_Q8",
    interesse:               "INTERESSE_A3",
  },
  aula4: {
    historico_perdas:    "A4_Q1",
    perdeu_bebe:         "A4_Q2",
    desejo_gestacao:     "A4_Q3",       // não pontua
    folato:              "A4_Q4",
    suplementos:         "A4_Q5",
    suplemento_outro:    "A4_Q5_TEXTO",
    vitamina_d:          "A4_Q6",
    interesse:           "INTERESSE_A4",
  },
  aula5: {
    lubrificacao:               "A5_Q1",
    freq_sexual:                "A5_Q2",
    dor_relacao:                "A5_Q3",
    comunicacao_casal:          "A5_Q4",
    intimidade:                 "A5_Q5",
    excitacao:                  "A5_Q6",
    fatores_libido:             "A5_Q7",
    historico_ist:              "A5_Q8",
    peso_parceiro:              "A5_M1",
    parceiro_fuma:              "A5_M2",
    parceiro_bebe:              "A5_M3",
    parceiro_esteroides:        "A5_M4",
    espermograma:               "A5_M5",
    varicocele:                 "A5_M6",
    parceiro_atividade_fisica:  "A5_M7",
    interesse:                  "INTERESSE_A5",
  },
};

// -----------------------------------------------------------------------------
// 2. NORMALIZAÇÃO de texto descritivo → letra/código usado pelo scoring
// -----------------------------------------------------------------------------
// As tabelas de pontuação (em methodology.js) usam letras (A/B/C/D). O Postgres
// guarda o texto descritivo. Esta tabela traduz.
// -----------------------------------------------------------------------------
const N = (pairs) => Object.entries(pairs).map(([k, v]) => [k.toLowerCase(), v]);

export const NORMALIZE = {
  // ---- AULA 1 ----
  A1_Q1: N({
    "mais de 3 meses sem menstruar": "A",
    "menos de 25 dias":              "B",
    "entre 25 e 35 dias":            "C",
    "mais de 35 dias":               "D",
  }),
  A1_Q2: N({
    "não tenho borra":               "A",
    "1 dia":                         "B",
    "2 ou mais dias":                "C",
  }),
  A1_Q3: N({
    "vermelho vivo":                 "A",
    "vermelho escuro":               "B",
    "marrom escuro":                 "C",
    "rosa claro":                    "D",
  }),
  A1_Q4: N({
    "escasso":                       "A",
    "moderado":                      "B",
    "grande":                        "C",
    "intenso":                       "D",
  }),
  A1_Q5: N({
    "sem dor":                       "A",
    "0 a 3":                         "A",
    "moderada":                      "B",
    "4 a 6":                         "B",
    "intensa":                       "C",
    "7 a 9":                         "C",
    "máxima":                        "D",
    "incapacitante":                 "D",
  }),
  A1_Q6: N({
    "não tenho coágulos":            "1",
    "tenho coágulos":                "2",
  }),
  A1_Q7: N({
    "habitual":                      "A",
    "forte":                         "B",
    "fétido":                        "B",
  }),
  A1_Q8: N({
    "até 3 dias":                    "A",
    "3 a 5 dias":                    "B",
    "mais de 5":                     "C",
  }),

  // ---- AULA 2 ----
  A2_Q3: N({
    "sem manchas":                   "A",
    "manchas leves":                 "B",
    "manchas moderadas":             "C",
    "manchas intensas":              "D",
  }),
  A2_Q4: N({
    "não tenho escurecimento":       "A",
    "escurecimento leve":            "B",
    "escurecimento visível":         "C",
  }),
  A2_Q5: N({
    "grau i":                        "I",
    "grau ii":                       "II",
    "grau iii":                      "III",
    "grau iv":                       "IV",
  }),
  A2_Q6: N({
    "não tenho":                     "A",
    "leve":                          "B",
    "moderado":                      "C",
    "intenso":                       "D",
  }),
  A2_Q7: N({
    "não percebo":                   "A",
    "queda leve":                    "B",
    "queda intensa":                 "C",
    "alopecia":                      "D",
  }),
  A2_Q8: N({ "fortes": "fortes", "fracas": "fracas" }),
  A2_Q9:  N({ "não": "nao", "sim": "sim" }),
  A2_Q10: N({ "não": "nao", "sim": "sim" }),
  A2_Q11: N({ "não": "nao", "sim": "sim" }),
  A2_Q12: N({
    "funcionando bem":               "A",
    "preso":                         "B",
    "alterno":                       "C",
    "gases":                         "D",
  }),
  A2_Q14: N({
    "não sinto nada":                "A",
    "leve":                          "B",
    "moderados":                     "C",
    "intensos":                      "D",
  }),

  // ---- AULA 3 ----
  A3_Q1: N({ "não": "nao", "sim": "sim" }),
  A3_Q2: N({
    "não consigo":                   "A",
    "seco":                          "B",
    "esbranquiçado":                 "C",
    "transparente":                  "D",
    "clara de ovo":                  "D",
  }),
  A3_Q3: N({ "não": "nao", "sim": "sim" }),
  A3_Q5: N({ "não": "nao", "sim": "sim" }),
  A3_Q6: N({
    "às vezes":                      "asvezes",
    "sim":                           "sim",
    "não":                           "nao",
  }),
  A3_Q7: N({
    "amh maior que 1,0":             "A",
    "amh menor que 1,0":             "C",
    "amh menor que 0":               "D",
  }),

  // ---- AULA 4 ----
  A4_Q2: N({
    "nunca perdi":                   "_NA",
    "não":                           "nao",
    "sim":                           "sim",
  }),
  A4_Q4: N({
    "ácido fólico":                  "A",
    "metilfolato":                   "B",
    "não uso":                       "C",
    "não sei":                       "C",
  }),
  A4_Q6: N({
    "acima de 40":                   "A",
    "menor de 40":                   "B",
    "nunca fiz":                     "C",
  }),

  // ---- AULA 5 ----
  A5_Q1: N({
    "lubrificação normal":           "A",
    "lubrificação reduzida":         "B",
    "quase não tenho":               "C",
  }),
  A5_Q2: N({
    "01 ou menos":                   "A",
    "2 ou 3":                        "B",
    "+3":                            "C",
  }),
  A5_Q3: N({
    "frequentemente":                "A",
    "às vezes":                      "B",
    "não sinto":                     "C",
  }),
  A5_Q4: N({
    "aberta":                        "A",
    "às vezes é difícil":            "B",
    "evitamos":                      "C",
    "não está totalmente envolvido": "D",
  }),
  A5_Q5: N({
    "às vezes":                      "B",
    "sim":                           "A",
    "não":                           "C",
  }),
  A5_Q6: N({
    "se você for bem estimulada":    "A",
    "dificuldade":                   "B",
    "evitação":                      "C",
  }),
  A5_Q8: N({
    "eu já tive":                    "A",
    "parceiro já teve":              "B",
    "nós 2":                         "C",
    "nunca tivemos":                 "D",
  }),
  A5_M1: N({
    "magro":                         "magro",
    "peso adequado":                 "adequado",
    "sobrepeso":                     "sobrepeso",
    "obeso":                         "obeso",
  }),
  A5_M2: N({ "não": "nao", "sim": "sim" }),
  A5_M3: N({
    "frequentemente":                "frequente",
    "ocasionalmente":                "ocasional",
    "não":                           "nao",
  }),
  A5_M4: N({ "não": "nao", "sim": "sim" }),
  A5_M5: N({
    "resultado foi normal":          "normal",
    "houve alguma alteração":        "alterado",
    "nunca realizou":                "nunca",
    "não tenho parceiro":            "nunca",
  }),
  A5_M6: N({
    "sim":                           "sim",
    "nunca investigou":              "nunca",
    "não":                           "nao",
  }),
  A5_M7: N({ "não": "nao", "sim": "sim" }),
};

export function normalizeAnswer(qcode, raw) {
  if (raw === null || raw === undefined || raw === "") return null;
  if (Array.isArray(raw)) return raw;
  const s = String(raw).trim();
  if (s === "") return null;
  const map = NORMALIZE[qcode];
  if (!map) return s;
  const lower = s.toLowerCase();
  for (const [needle, letter] of map) {
    if (lower.includes(needle)) return letter;
  }
  return s;
}

// -----------------------------------------------------------------------------
// 3. Helpers pra multi-select (InLead pode entregar string com "|" ou array)
// -----------------------------------------------------------------------------
export function toArray(raw) {
  if (raw === null || raw === undefined || raw === "") return [];
  if (Array.isArray(raw)) return raw;
  const s = String(raw).trim();
  if (s === "") return [];
  if (s.startsWith("[")) { try { return JSON.parse(s); } catch (_) {} }
  if (s.includes("|")) return s.split("|").map((x) => x.trim()).filter(Boolean);
  if (s.includes(",")) return s.split(",").map((x) => x.trim()).filter(Boolean);
  return [s];
}

export function normalizeA4Q1(raw) {
  const arr = toArray(raw);
  const out = [];
  for (const item of arr) {
    const s = String(item).toLowerCase();
    if (s.includes("nunca perdi")) out.push("A");
    else if (s.includes("um aborto") && s.includes("3 primeiros")) out.push("B");
    else if (s.includes("2 ou +") || s.includes("2 ou mais")) out.push("C");
    else if (s.includes("ectópica") || s.includes("tubária")) out.push("D");
    else if (s.includes("química")) out.push("E");
    else if (s.includes("acima de 3 meses") || s.includes("útero")) out.push("F");
    else if (s.includes("após o nascimento") || s.includes("neonatal")) out.push("G");
  }
  return out;
}

export function normalizeDiagnosticos(raw, outrosTexto) {
  const arr = toArray(raw);
  const out = new Set();
  for (const item of arr) {
    const s = String(item).toLowerCase();
    if (s.includes("sop") || s.includes("ovário policístic") || s.includes("ovários policístic")) out.add("SOP");
    if (s.includes("endometriose")) out.add("Endometriose");
    if (s.includes("adenomiose")) out.add("Adenomiose");
    if (s.includes("mioma")) out.add("Mioma");
    if (s.includes("hipotireoid") || s.includes("hipotiroid")) out.add("Hipotireoidismo");
    if (s.includes("falhas de fiv") || s.includes("falha de fiv")) out.add("Falhas de FIV");
    if (s.includes("aborto")) out.add("Perda Gestacional");
    if (s.includes("infertilidade sem causa")) out.add("Infertilidade sem causa aparente");
    if (s.includes("menopausa precoce")) out.add("Baixa Reserva Ovariana");
    if (s.includes("baixa reserva")) out.add("Baixa Reserva Ovariana");
  }
  if (outrosTexto) {
    const t = String(outrosTexto).toLowerCase();
    if (t.includes("sop") || t.includes("policístic")) out.add("SOP");
    if (t.includes("endomet")) out.add("Endometriose");
    if (t.includes("adenom")) out.add("Adenomiose");
    if (t.includes("mioma")) out.add("Mioma");
    if (t.includes("hipotire")) out.add("Hipotireoidismo");
  }
  return Array.from(out);
}
