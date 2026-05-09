// =============================================================================
// MAPPINGS — InLead → metodologia
// =============================================================================
// Cada form da InLead (1 por aula) tem um conjunto único de chaves opcoes_XXX.
// Identificamos a aula pela "fingerprint" (conjunto de chaves) e mapeamos cada
// chave para o código da metodologia (A1_Q1, A2_Q3, ...).
//
// Construído a partir dos CSVs de exportação dos 5 forms da InLead.
// =============================================================================

// -----------------------------------------------------------------------------
// FINGERPRINTS — conjuntos únicos de opcoes_XXX por aula
// -----------------------------------------------------------------------------
// A função `detectAula` checa qual conjunto bate melhor com o payload recebido.
// Fingerprints menores que mantêm exclusividade são mais robustos.
// -----------------------------------------------------------------------------
export const FINGERPRINTS = {
  aula1: ["opcoes_M3ha6H", "opcoes_oLYvSr", "opcoes_2qfvNF", "opcoes_wdkqXS", "opcoes_R9V6qD", "opcoes_VnbKfl", "ciclo", "sangue"],
  aula2: ["opcoes_IOKBFs", "opcoes_gMM9KV", "opcoes_TeegZa", "opcoes_3wumkJ", "opcoes_9lpcN5", "opcoes_WbJjTL", "opcoes_4bxWYp", "opcoes_o6dJ3w", "opcoes_StOCJM", "opcoes_jgp1Sk", "opcoes_KP3vpx", "opcoes_Ykyk5v", "opcoes_iOSe9Z", "opcoes_P7uR6r", "opcoes_Gq4olU", "JRZmed", "djSta6"],
  aula3: ["opcoes_eRnUZG", "opcoes_I2ghKe", "opcoes_PcC6DZ", "opcoes_2yeIVW", "opcoes_vBc5Lo", "opcoes_4HeNSE", "opcoes_mpR7Tz", "opcoes_1zEhT5", "opcoes_oNQe4U"],
  aula4: ["opcoes_Juo37X", "opcoes_ikYwe9", "opcoes_4bQ6Rl", "opcoes_T7pl6L", "opcoes_yXtKZY", "jsV9tr"],
  aula5: ["opcoes_Ed9Hul", "opcoes_rAmtmW", "opcoes_rB0ue6", "opcoes_CrwTbQ", "opcoes_uHKZxz", "opcoes_Zze6Ex", "opcoes_j36FM9", "opcoes_cyyDWr", "opcoes_Jz47hn", "opcoes_OLoCHh", "opcoes_UZqM4U", "opcoes_TyPZAZ", "opcoes_45a94e", "opcoes_k8vFWm"],
};

export function detectAula(payload) {
  if (!payload || typeof payload !== "object") return null;
  const keys = new Set(Object.keys(payload));
  let bestAula = null, bestScore = 0;
  for (const [aula, fp] of Object.entries(FINGERPRINTS)) {
    const score = fp.filter((k) => keys.has(k)).length;
    if (score > bestScore && score >= 3) { bestScore = score; bestAula = aula; }
  }
  return bestAula;
}

// -----------------------------------------------------------------------------
// INPUT → QUESTÃO (por aula, porque aulas 4 e 5 reusam IDs)
// -----------------------------------------------------------------------------
export const INPUT_TO_QUESTION = {
  aula1: {
    "ciclo":           "_A1_DUAL",   // a coluna 'ciclo' aparece 2x — tratamos no aggregator
    "sangue":          "A1_Q3",
    "opcoes_M3ha6H":   "A1_Q4",
    "opcoes_oLYvSr":   "A1_Q5",
    "opcoes_2qfvNF":   "A1_Q6",
    "opcoes_wdkqXS":   "A1_Q7",
    "opcoes_R9V6qD":   "A1_Q8",
    "opcoes_VnbKfl":   "A3_Q2_ALT", // versão simples de muco — só usar se não tiver A3_Q2 da Aula 3
  },
  aula2: {
    "JRZmed":          "A2_ALTURA",
    "djSta6":          "A2_PESO",
    "opcoes_IOKBFs":   "A2_Q2",
    "opcoes_gMM9KV":   "A2_Q3",
    "opcoes_TeegZa":   "A2_Q4",
    "opcoes_3wumkJ":   "A2_Q5",
    "opcoes_9lpcN5":   "A2_Q6",
    "opcoes_WbJjTL":   "A2_Q7",
    "opcoes_4bxWYp":   "A2_Q8",
    "opcoes_o6dJ3w":   "A2_Q9",
    "opcoes_StOCJM":   "A2_Q10",
    "opcoes_jgp1Sk":   "A2_Q11",
    "opcoes_KP3vpx":   "A2_Q12",
    "opcoes_Ykyk5v":   "A2_Q13",
    "G4f7Ev":          "A2_Q13_OUTROS",
    "opcoes_iOSe9Z":   "A2_Q14",
    // ignorados: opcoes_P7uR6r (anticoncepcional), opcoes_Gq4olU (regularidade — duplica A1_Q1)
  },
  aula3: {
    "opcoes_eRnUZG":   "A3_Q1",
    "opcoes_I2ghKe":   "A3_Q2",
    "opcoes_PcC6DZ":   "A3_Q3",
    "opcoes_2yeIVW":   "A3_Q4",
    "opcoes_vBc5Lo":   "A3_Q5",
    "opcoes_4HeNSE":   "A3_Q6",
    "opcoes_mpR7Tz":   "A3_Q7",
    "opcoes_1zEhT5":   "A3_Q8",
    // ignorado: opcoes_oNQe4U (CTA interesse)
  },
  aula4: {
    "opcoes_dZz5tG":   "A4_Q1",
    "opcoes_Juo37X":   "A4_Q2",
    "opcoes_ikYwe9":   "A4_Q3",
    "opcoes_4bQ6Rl":   "A4_Q4",
    "opcoes_T7pl6L":   "A4_Q5",
    "jsV9tr":          "A4_Q5_TEXTO",
    "opcoes_yXtKZY":   "A4_Q6",
    // ignorado: opcoes_aA3Uu3 (CTA interesse)
  },
  aula5: {
    "opcoes_dZz5tG":   "A5_Q1",       // mesmo ID que aula4 mas significado diferente
    "opcoes_Ed9Hul":   "A5_Q2",
    "opcoes_rAmtmW":   "A5_Q3",
    "opcoes_rB0ue6":   "A5_Q4",
    "opcoes_CrwTbQ":   "A5_Q5",
    "opcoes_uHKZxz":   "A5_Q6",
    "opcoes_Zze6Ex":   "A5_Q7",
    "opcoes_j36FM9":   "A5_Q8",
    "opcoes_cyyDWr":   "A5_M1",
    "opcoes_Jz47hn":   "A5_M2",
    "opcoes_OLoCHh":   "A5_M3",
    "opcoes_UZqM4U":   "A5_M4",
    "opcoes_TyPZAZ":   "A5_M5",
    "opcoes_45a94e":   "A5_M6",
    "opcoes_k8vFWm":   "A5_M7",
    // ignorado: opcoes_aA3Uu3 (CTA interesse)
  },
};

// -----------------------------------------------------------------------------
// NORMALIZAÇÃO — texto descritivo do InLead → letra usada nas tabelas de score
// -----------------------------------------------------------------------------
// Cada entrada usa "match parcial" case-insensitive. A primeira chave que casa vence.
// Mantém o texto original para findings (a metodologia tem frases por letra).
// -----------------------------------------------------------------------------
const N = (pairs) => Object.entries(pairs).map(([k, v]) => [k.toLowerCase(), v]);

export const NORMALIZE = {
  A1_Q1: N({
    "mais de 3 meses sem menstruar":   "A",
    "menos de 25 dias":                 "B",
    "entre 25 e 35 dias":               "C",
    "mais de 35 dias":                  "D",
  }),
  A1_Q2: N({
    "não tenho borra":                  "A",
    "1 dia":                            "B",
    "2 ou mais dias":                   "C",
  }),
  A1_Q3: N({
    "vermelho vivo":                    "A",
    "vermelho escuro":                  "B",
    "marrom escuro":                    "C",
    "rosa claro":                       "D",
  }),
  A1_Q4: N({
    "escasso":                          "A",
    "moderado":                         "B",
    "grande":                           "C",
    "intenso":                          "D",
  }),
  A1_Q5: N({
    "sem dor":                          "A",
    "0 a 3":                            "A",
    "moderada":                         "B",
    "4 a 6":                            "B",
    "intensa":                          "C",
    "7 a 9":                            "C",
    "máxima":                           "D",
    "incapacitante":                    "D",
  }),
  A1_Q6: N({
    "não tenho coágulos":               "1",
    "tenho coágulos":                   "2",
  }),
  A1_Q7: N({
    "habitual":                         "A",
    "forte":                            "B",
    "fétido":                           "B",
  }),
  A1_Q8: N({
    "até 3 dias":                       "A",
    "3 a 5 dias":                       "B",
    "mais de 5":                        "C",
  }),
  // ---- AULA 2 ----
  A2_Q3: N({
    "sem manchas":                      "A",
    "manchas leves":                    "B",
    "manchas moderadas":                "C",
    "manchas intensas":                 "D",
  }),
  A2_Q4: N({
    "não tenho escurecimento":          "A",
    "escurecimento leve":               "B",
    "escurecimento visível":            "C",
  }),
  A2_Q5: N({
    "grau i":                           "I",
    "grau ii":                          "II",
    "grau iii":                         "III",
    "grau iv":                          "IV",
  }),
  A2_Q6: N({
    "não tenho":                        "A",
    "leve":                             "B",
    "moderado":                         "C",
    "intenso":                          "D",
  }),
  A2_Q7: N({
    "não percebo":                      "A",
    "queda leve":                       "B",
    "queda intensa":                    "C",
    "alopecia":                         "D",
  }),
  A2_Q8: N({
    "fortes":                           "fortes",
    "fracas":                           "fracas",
  }),
  A2_Q9:  N({ "não": "nao", "sim": "sim" }),
  A2_Q10: N({ "não": "nao", "sim": "sim" }),
  A2_Q11: N({ "não": "nao", "sim": "sim" }),
  A2_Q12: N({
    "funcionando bem":                  "A",
    "preso":                            "B",
    "alterno":                          "C",
    "gases":                            "D",
  }),
  A2_Q14: N({
    "não sinto nada":                   "A",
    "leve":                             "B",
    "moderados":                        "C",
    "intensos":                         "D",
  }),
  // ---- AULA 3 ----
  A3_Q1: N({ "não": "nao", "sim": "sim" }),
  A3_Q2: N({
    "não consigo":                      "A",
    "seco":                             "B",
    "esbranquiçado":                    "C",
    "transparente":                     "D",
    "clara de ovo":                     "D",
  }),
  A3_Q3: N({ "não": "nao", "sim": "sim" }),
  A3_Q5: N({ "não": "nao", "sim": "sim" }),
  A3_Q6: N({
    "às vezes":                         "asvezes",
    "sim":                              "sim",
    "não":                              "nao",
  }),
  A3_Q7: N({
    "amh maior que 1,0":                "A",
    "amh menor que 1,0":                "C",
    "amh menor que 0":                  "D",
  }),
  // ---- AULA 4 ----
  A4_Q2: N({
    "nunca perdi":                      "_NA",   // pula a questão (não houve perda)
    "não":                              "nao",
    "sim":                              "sim",
  }),
  A4_Q4: N({
    "ácido fólico":                     "A",
    "metilfolato":                      "B",
    "não uso":                          "C",
    "não sei":                          "C",
  }),
  A4_Q6: N({
    "acima de 40":                      "A",
    "menor de 40":                      "B",
    "nunca fiz":                        "C",
  }),
  // ---- AULA 5 ----
  A5_Q1: N({
    "lubrificação normal":              "A",
    "lubrificação reduzida":            "B",
    "quase não tenho":                  "C",
  }),
  A5_Q2: N({
    "01 ou menos":                      "A",
    "2 ou 3":                           "B",
    "+3":                               "C",
  }),
  A5_Q3: N({
    "frequentemente":                   "A",
    "às vezes":                         "B",
    "não sinto":                        "C",
  }),
  A5_Q4: N({
    "aberta":                           "A",
    "às vezes é difícil":               "B",
    "evitamos":                         "C",
    "não está totalmente envolvido":    "D",
  }),
  A5_Q5: N({
    "às vezes":                         "B",
    "sim":                              "A",
    "não":                              "C",
  }),
  A5_Q6: N({
    "se você for bem estimulada":       "A",
    "dificuldade":                      "B",
    "evitação":                         "C",
  }),
  A5_Q8: N({
    "eu já tive":                       "A",
    "parceiro já teve":                 "B",
    "nós 2":                            "C",
    "nunca tivemos":                    "D",
  }),
  A5_M1: N({
    "magro":                            "magro",
    "peso adequado":                    "adequado",
    "sobrepeso":                        "sobrepeso",
    "obeso":                            "obeso",
  }),
  A5_M2: N({ "não": "nao", "sim": "sim" }),
  A5_M3: N({
    "frequentemente":                   "frequente",
    "ocasionalmente":                   "ocasional",
    "não":                              "nao",
  }),
  A5_M4: N({ "não": "nao", "sim": "sim" }),
  A5_M5: N({
    "resultado foi normal":             "normal",
    "houve alguma alteração":           "alterado",
    "nunca realizou":                   "nunca",
    "não tenho parceiro":               "nunca",
  }),
  A5_M6: N({
    "sim":                              "sim",
    "nunca investigou":                 "nunca",
    "não":                              "nao",
  }),
  A5_M7: N({ "não": "nao", "sim": "sim" }),
};

export function normalizeAnswer(qcode, raw) {
  if (raw === null || raw === undefined || raw === "") return null;
  if (Array.isArray(raw)) return raw;       // multi-select: deixa como array, score lida
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
// Multi-select: a InLead manda como string única OU como múltiplos campos.
// Esta função tenta extrair como array.
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

// -----------------------------------------------------------------------------
// A4_Q1 (perdas): mapeia texto → letra A..G (pra metodologia)
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// A2_Q13 (diagnósticos): texto → chave canônica usada nos descritivos
// -----------------------------------------------------------------------------
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
  // texto livre "outros" também varre
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
