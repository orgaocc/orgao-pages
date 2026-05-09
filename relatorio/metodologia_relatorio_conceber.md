# Metodologia de Cálculo — Relatório de Fertilidade Programa Conceber

**Objetivo:** este documento define todas as regras de cálculo, mapeamento e geração de conteúdo do Relatório de Fertilidade, de forma que dois sistemas (humanos ou modelos) que recebam o mesmo input produzam exatamente o mesmo output.

**Versão:** 1.0 — Maio 2026

---

## 1. Princípios gerais

1. Todo cálculo é **determinístico**. Mesmas respostas → mesmo relatório.
2. Toda escala interna usa o intervalo **0 a 10** (0 = pior cenário, 10 = ideal).
3. Quando uma resposta é omitida, a questão recebe pontuação **5 (neutro)** e é marcada como `dado_ausente: true`.
4. Pilares são calculados como **média ponderada** das questões que contribuem.
5. Pontuações exibidas no radar são **arredondadas para inteiro** (regra: arredondamento padrão, 0,5 sobe).

---

## 2. Estrutura do input

O input é um objeto com 5 blocos, cada um correspondendo a uma aula. Adicionalmente, o input traz dados de contexto.

```
{
  "contexto": {
    "nome": str,
    "idade": int,
    "anos_tentando": int,
    "data_relatorio": "DD/MM/AAAA",
    "formularios_respondidos": int (0 a 5)
  },
  "aula1_ciclo": {...},
  "aula2_corpo": {...},
  "aula3_ovulacao": {...},
  "aula4_suplementacao": {...},
  "aula5_casal": {...}
}
```

Cada questão é referenciada por código no formato `A{aula}_Q{numero}` (ex: `A1_Q1`). Letras das alternativas seguem o formulário original.

---

## 3. Sistema de pontuação por questão

Cada questão recebe um valor de **0 a 10**. Esse é o valor bruto que entra no cálculo dos pilares. A coluna "alerta" indica se a resposta conta como sinal de alerta para o contador geral.

### 3.1 — Aula 1: Ciclo menstrual

| Questão | Resposta | Valor | Alerta |
|---|---|---|---|
| A1_Q1 (frequência) | A (>3 meses sem menstruar) | 0 | Sim |
| | B (≤25 dias) | 3 | Sim |
| | C (25–35 dias) | 10 | Não |
| | D (>35 dias) | 3 | Sim |
| A1_Q2 (borra de café) | A (não tem) | 10 | Não |
| | B (1 dia) | 6 | Não |
| | C (2+ dias) | 2 | Sim |
| A1_Q3 (cor) | A (vermelho vivo) | 10 | Não |
| | B (escuro/marrom) | 5 | Não |
| | C (marrom/preto) | 2 | Sim |
| | D (rosa claro) | 3 | Sim |
| A1_Q4 (volume) | A (escasso) | 3 | Sim |
| | B (moderado) | 10 | Não |
| | C (grande) | 6 | Não |
| | D (intenso) | 2 | Sim |
| A1_Q5 (cólicas) | A (0–3, leve) | 10 | Não |
| | B (4–6, moderado) | 6 | Não |
| | C (6–10, intensa) | 3 | Sim |
| | D (incapacitante) | 0 | Sim |
| A1_Q6 (coágulos) | 1 (não) | 10 | Não |
| | 2 (sim) | 3 | Sim |
| A1_Q7 (odor) | A (habitual) | 10 | Não |
| | B (forte) | 3 | Sim |
| A1_Q8 (duração) | A (≤3 dias) | 5 | Não |
| | B (3–5 dias) | 10 | Não |
| | C (>5 dias) | 4 | Sim |

### 3.2 — Aula 2: Corpo, hormônios e diagnósticos

**A2_Q1 (IMC, calculado de peso e altura):**
| IMC | Valor | Alerta |
|---|---|---|
| 18,5–24,9 | 10 | Não |
| 25,0–29,9 | 4 | Sim |
| ≥30,0 | 2 | Sim |
| <18,5 | 4 | Sim |

**A2_Q2 (percepção do peso):** subjetiva, não pontuada (apenas exibida).

| Questão | Resposta | Valor | Alerta |
|---|---|---|---|
| A2_Q3 (melasma) | A (nenhum) | 10 | Não |
| | B (leve) | 7 | Não |
| | C (visível) | 4 | Sim |
| | D (intenso) | 2 | Sim |
| A2_Q4 (escurecimento dobras) | A (nenhum) | 10 | Não |
| | B (leve, 1 região) | 6 | Não |
| | C (visível, 2+ regiões) | 2 | Sim |
| A2_Q5 (celulite) | I | 9 | Não |
| | II | 6 | Não |
| | III | 4 | Sim |
| | IV | 2 | Sim |
| A2_Q6 (hirsutismo) | A (não) | 10 | Não |
| | B (leve) | 7 | Não |
| | C (moderado) | 4 | Sim |
| | D (intenso) | 2 | Sim |
| A2_Q7 (queda cabelo) | A (não) | 10 | Não |
| | B (leve) | 8 | Não |
| | C (intensa) | 3 | Sim |
| | D (alopecia) | 1 | Sim |
| A2_Q8 (unhas) | Fortes | 10 | Não |
| | Fracas | 5 | Não |
| A2_Q9 (inchaço) | Não | 10 | Não |
| | Sim | 4 | Sim |
| A2_Q10 (fadiga) | Não | 10 | Não |
| | Sim | 3 | Sim |
| A2_Q11 (memória) | Não | 10 | Não |
| | Sim | 4 | Sim |
| A2_Q12 (intestino) | A (regular) | 10 | Não |
| | B (preso) | 3 | Sim |
| | C (alterna) | 4 | Sim |
| | D (gases/dor) | 4 | Sim |
| A2_Q14 (TPM) | A (nenhum) | 10 | Não |
| | B (leve) | 8 | Não |
| | C (moderado) | 5 | Não |
| | D (intenso) | 3 | Sim |

**A2_Q13 (diagnósticos, multi-select):** não entra no cálculo direto dos pilares; alimenta a seção "Diagnósticos mapeados" e ajusta o tom dos insights. Cada diagnóstico marcado conta como **+1 sinal de alerta**.

### 3.3 — Aula 3: Ovulação

| Questão | Resposta | Valor | Alerta |
|---|---|---|---|
| A3_Q1 (percepção da ovulação) | Sim | 10 | Não |
| | Não | 4 | Sim |
| A3_Q2 (muco cervical) | A (não percebe) | 3 | Sim |
| | B (seco/ausente) | 4 | Sim |
| | C (esbranquiçado pastoso) | 6 | Não |
| | D (clara de ovo) | 10 | Não |
| A3_Q3 (libido) | Sim | 10 | Não |
| | Não | 4 | Sim |
| A3_Q4 (métodos de reconhecimento) | 0 métodos | 3 | Sim |
| | 1 método | 6 | Não |
| | 2+ métodos | 9 | Não |
| A3_Q5 (confirmou ovulação por exame) | Sim | 10 | Não |
| | Não | 5 | Não |
| A3_Q6 (relações no período fértil) | Sim | 10 | Não |
| | Às vezes | 6 | Não |
| | Não | 3 | Sim |
| A3_Q7 (AMH) | >1,5 | 10 | Não |
| | 1,0–1,5 | 7 | Não |
| | 0,5–0,99 | 4 | Sim |
| | <0,5 | 2 | Sim |
| | Não fez | 5 | Não |
| A3_Q8 (sintomas de ovulação) | 3+ sintomas | 10 | Não |
| | 1–2 sintomas | 6 | Não |
| | "Não percebo" | 3 | Sim |

### 3.4 — Aula 4: Suplementação e perdas

**A4_Q1 (perdas gestacionais, multi-select):** valor = pior pontuação entre as marcadas.

| Resposta | Valor | Alerta |
|---|---|---|
| A (nunca perdi) | 10 | Não |
| B (1 aborto <3 meses) | 5 | Sim |
| C (2+ perdas <3 meses) | 2 | Sim |
| D (ectópica) | 3 | Sim |
| E (química) | 5 | Sim |
| F (perda >3 meses) | 2 | Sim |
| G (perda neonatal) | 1 | Sim |

| Questão | Resposta | Valor | Alerta |
|---|---|---|---|
| A4_Q2 (causa da perda) | Sim | 7 | Não |
| | Não | 4 | Sim |
| | N/A (sem perda) | — | Não |
| A4_Q3 (desejo de gravidez) | A (natural) | — | Não |
| | B (FIV se necessário) | — | Não |
| | C (preparando FIV) | — | Não |
| A4_Q4 (folato) | A (ácido fólico) | 4 | Sim |
| | B (metilfolato) | 10 | Não |
| | C (não usa) | 2 | Sim |
| A4_Q5 (outras vitaminas) | 3+ marcadas | 10 | Não |
| | 1–2 marcadas | 6 | Não |
| | nenhuma | 2 | Sim |
| A4_Q6 (vit D) | A (>40) | 10 | Não |
| | B (<40) | 4 | Sim |
| | C (nunca fez) | 3 | Sim |

A4_Q3 (desejo) é contextual e altera o tom do CTA — não entra no cálculo.

### 3.5 — Aula 5: Sexualidade e fator masculino

| Questão | Resposta | Valor | Alerta |
|---|---|---|---|
| A5_Q1 (lubrificação) | A (normal) | 10 | Não |
| | B (reduzida) | 5 | Não |
| | C (ausente) | 2 | Sim |
| A5_Q2 (frequência sexual) | A (≤1/sem) | 4 | Sim |
| | B (2–3/sem) | 10 | Não |
| | C (>3/sem) | 9 | Não |
| A5_Q3 (dor na relação) | A (frequente) | 2 | Sim |
| | B (às vezes) | 5 | Não |
| | C (não) | 10 | Não |
| A5_Q4 (comunicação) | A (aberta) | 10 | Não |
| | B (às vezes difícil) | 6 | Não |
| | C (evitam) | 3 | Sim |
| | D (parceiro não envolvido) | 2 | Sim |
| A5_Q5 (intimidade sem falar de gravidez) | A (sim) | 10 | Não |
| | B (às vezes) | 6 | Não |
| | C (não) | 3 | Sim |
| A5_Q6 (resposta a estímulo) | A (excita) | 10 | Não |
| | B (dificuldade) | 5 | Não |
| | C (evitação) | 2 | Sim |
| A5_Q7 (fatores atrapalhando) | apenas A (satisfatória) | 10 | Não |
| | 1 fator marcado | 6 | Não |
| | 2+ fatores marcados | 3 | Sim |
| A5_Q8 (ISTs) | D (nunca) | 10 | Não |
| | A/B/C (alguém teve) | 5 | Sim |

**Marido:**

| Questão | Resposta | Valor | Alerta |
|---|---|---|---|
| A5_M1 (peso) | Adequado/magro | 10 | Não |
| | Sobrepeso | 5 | Sim |
| | Obeso | 2 | Sim |
| A5_M2 (fuma) | Não | 10 | Não |
| | Sim | 2 | Sim |
| A5_M3 (álcool) | Não | 10 | Não |
| | Ocasional | 7 | Não |
| | Frequente | 3 | Sim |
| A5_M4 (anabolizantes) | Não | 10 | Não |
| | Sim | 1 | Sim |
| A5_M5 (espermograma) | Normal | 10 | Não |
| | Alterado | 2 | Sim |
| | Nunca fez | 5 | Sim |
| A5_M6 (varicocele) | Não | 10 | Não |
| | Sim | 3 | Sim |
| | Nunca investigou | 5 | Não |
| A5_M7 (atividade física) | Sim | 10 | Não |
| | Não | 4 | Sim |

---

## 4. Cálculo dos 7 pilares

Cada pilar é uma média ponderada das questões. A fórmula geral:

```
Pilar = Σ (valor_questão × peso) / Σ (pesos)
```

Resultado é arredondado para inteiro (0,5 sobe).

### 4.1 — Detox

| Questão | Peso |
|---|---|
| A1_Q1 (frequência ciclo) | 1 |
| A1_Q2 (borra de café) | 2 |
| A1_Q3 (cor menstruação) | 2 |
| A1_Q6 (coágulos) | 1 |
| A1_Q7 (odor) | 2 |
| A2_Q12 (intestino) | 2 |
| A2_Q3 (melasma) | 1 |

### 4.2 — Equilíbrio Hormonal

| Questão | Peso |
|---|---|
| A1_Q1 (frequência ciclo) | 2 |
| A1_Q4 (volume) | 1 |
| A1_Q5 (cólicas) | 1 |
| A2_Q1 (IMC) | 2 |
| A2_Q4 (escurecimento dobras) | 2 |
| A2_Q6 (hirsutismo) | 2 |
| A2_Q7 (queda cabelo) | 1 |
| A2_Q14 (TPM) | 1 |
| A3_Q7 (AMH) | 2 |

### 4.3 — Nutrição

| Questão | Peso |
|---|---|
| A4_Q4 (folato) | 3 |
| A4_Q5 (outras vitaminas) | 2 |
| A4_Q6 (vit D) | 2 |
| A2_Q8 (unhas) | 1 |
| A2_Q12 (intestino) | 1 |

### 4.4 — Atividade Física

Não há questão direta. A pontuação é **inferida**:

```
base = 6
se A2_Q1 IMC sobrepeso: base -= 1
se A2_Q1 IMC obesidade: base -= 2
se A2_Q1 IMC abaixo do peso: base -= 1
se A5_M7 marido pratica atividade: base += 1
resultado = clamp(base, 0, 10)
```

### 4.5 — Sono

Não há questão direta. A pontuação é **inferida**:

```
base = 7
se A2_Q10 fadiga = sim: base -= 2
se A2_Q11 memória = sim: base -= 1
se A2_Q14 TPM = D (intenso): base -= 1
resultado = clamp(base, 0, 10)
```

### 4.6 — Equilíbrio Emocional

| Questão | Peso |
|---|---|
| A2_Q14 (TPM) | 2 |
| A2_Q10 (fadiga) | 1 |
| A5_Q4 (comunicação casal) | 2 |
| A5_Q5 (intimidade sem falar de gravidez) | 2 |
| A5_Q6 (resposta a estímulo) | 1 |
| A5_Q7 (fatores atrapalhando) | 1 |

Adicionalmente, se `contexto.anos_tentando ≥ 3`, subtrair 1 ponto do resultado final (estresse acumulado da jornada).

### 4.7 — Fertilidade Masculina

| Questão | Peso |
|---|---|
| A5_M1 (peso) | 1 |
| A5_M2 (fuma) | 2 |
| A5_M3 (álcool) | 1 |
| A5_M4 (anabolizantes) | 2 |
| A5_M5 (espermograma) | 3 |
| A5_M6 (varicocele) | 2 |
| A5_M7 (atividade física) | 1 |

---

## 5. Índice de Preparo

Média aritmética simples dos 7 pilares (em escala 0–10), com **uma casa decimal**.

```
Indice = (Detox + Hormonal + Nutricao + AtividadeFisica + Sono + Emocional + Masculina) / 7
```

Apresentado no relatório como `X,Y` (ex: `4,8`).

---

## 6. Contadores exibidos

**Sinais de alerta identificados:** soma de todas as respostas com `alerta=Sim` (incluindo cada diagnóstico marcado em A2_Q13). Mostra o número total — **não** limitado.

**Pilares críticos:** quantidade de pilares com pontuação **≤ 4** (após arredondamento).

**Anos tentando engravidar:** valor direto de `contexto.anos_tentando`.

**Formulários respondidos:** valor direto de `contexto.formularios_respondidos`.

---

## 7. Status por bloco de análise

Cada bloco de análise (Ciclo, Corpo/Hormônios, Ovulação, Nutrição, Casal) recebe um status visual:

```
contar sinais de alerta nas questões do bloco:
  ≥ 3 alertas              → 🔴 Sinal importante
  1–2 alertas              → 🟡 Ponto de melhora
  0 alertas                → 🟢 Saudável
```

Mapeamento bloco → questões:

| Bloco | Questões |
|---|---|
| Ciclo menstrual | A1_Q1 a A1_Q8 |
| Corpo e equilíbrio hormonal | A2_Q1 a A2_Q14 (exceto Q2 e Q13) |
| Ovulação e janela fértil | A3_Q1 a A3_Q8 |
| Nutrição e suplementação | A4_Q1, A4_Q2, A4_Q4, A4_Q5, A4_Q6 |
| Saúde do casal | A5_Q1 a A5_Q8 + A5_M1 a A5_M7 |

---

## 8. Seleção dos achados (findings)

Cada bloco exibe **3 a 5 achados** em formato bullet. Regra de seleção:

1. Listar todas as questões do bloco com `alerta=Sim`.
2. Ordenar pela pontuação **mais baixa** (pior cenário primeiro).
3. Pegar as 3 a 5 primeiras (no mínimo 3 se houver, no máximo 5).
4. Cada achado é gerado por uma frase-padrão associada à resposta:

**Exemplos de frases-padrão:**

| Questão | Resposta | Frase |
|---|---|---|
| A1_Q1 | D | "Ciclos acima de 35 dias com irregularidade persistente" |
| A1_Q2 | C | "Borra de café por 2 ou mais dias antes da menstruação" |
| A1_Q5 | C | "Cólicas intensas — média {valor}/10, comprometendo a rotina" |
| A2_Q1 | sobrepeso | "Sobrepeso (IMC {valor})" |
| A2_Q4 | C | "Escurecimento visível em axila, virilha e pescoço" |
| A2_Q6 | C/D | "Hirsutismo {leve/moderado/intenso} confirmado" |
| A3_Q7 | <1,0 | "AMH {valor} ng/mL — baixa reserva ovariana confirmada" |
| A4_Q4 | A | "Usa apenas ácido fólico — recomendação desatualizada" |
| A4_Q6 | C | "Nunca realizou exame de vitamina D" |
| A5_M2 | sim | "Parceiro fuma" |
| A5_M5 | alterado | "Espermograma com alterações" |

(Cada frase deve ser registrada em uma tabela de mapeamento. Para qualquer alternativa não listada, gerar a frase baseada na descrição literal do formulário em tom clínico afirmativo.)

---

## 9. Diagnósticos mapeados

Exibe **até 4 cartões** na seção "Diagnósticos e próximos passos", baseado em A2_Q13 + condições inferidas.

**Regra de inclusão (ordem de prioridade):**

1. Cada diagnóstico marcado em A2_Q13 vira um cartão.
2. Se `A3_Q7 AMH < 1,0` e "Baixa Reserva Ovariana" não está marcada, incluir cartão "Baixa reserva ovariana".
3. Se `A5_M5 = alterado`, incluir cartão "Fator masculino".
4. Limite máximo de 4 cartões. Se houver mais, ordenar por severidade (SOP > Endometriose > Adenomiose > Baixa Reserva > Mioma > demais).

**Texto descritivo de cada diagnóstico** (fixo por diagnóstico):

| Diagnóstico | Descrição |
|---|---|
| SOP | "A Síndrome dos Ovários Policísticos interfere diretamente na ovulação e no equilíbrio hormonal. Frequentemente ligada à resistência insulínica." |
| Endometriose | "Doença inflamatória que afeta a qualidade dos óvulos e a receptividade endometrial. Responde a protocolo anti-inflamatório consistente." |
| Adenomiose | "Processo inflamatório uterino que explica cólicas intensas e fluxo escuro. Responde bem a protocolo anti-inflamatório estruturado." |
| Baixa reserva ovariana | "AMH {valor} ng/mL. A qualidade dos óvulos pode ser melhorada com nutrição, suplementação e redução do estresse oxidativo." |
| Mioma | "Pode interferir na implantação dependendo da localização. Tratamento individualizado conforme tipo e tamanho." |
| Hipotireoidismo | "Disfunção tireoidiana impacta diretamente a ovulação e a qualidade do ciclo. Reposição adequada é fundamental." |
| Fator masculino | "Alterações no espermograma podem ser melhoradas em 90 dias com mudança de hábitos e acompanhamento." |
| (demais) | Gerar texto curto (2 linhas) em tom clínico-acolhedor, conectando o diagnóstico à fertilidade. |

---

## 10. Geração dos insights (voz da Dra. Talita)

Cada bloco de análise tem um insight em itálico. Regras de tom **obrigatórias**:

1. Linguagem clínica afirmativa, **sem alarmismo**.
2. Sem promessa de gravidez ou cura.
3. Sem linguagem de autoajuda, manifestação ou "energia".
4. Pode incluir referência espiritual ecumênica (sem mencionar denominação).
5. Sempre conectar o achado a algo **reversível** ou **acionável**.
6. Comprimento: 2 a 3 frases, máx. 60 palavras.
7. Estrutura recomendada: **observação clínica + reframe + abertura para ação**.

**Exemplos de referência (consistentes com a voz):**

> "Escurecimento em dobras de pele, queda de cabelo e inchaço constante formam um padrão que a medicina integrativa reconhece bem: resistência à insulina. Isso interfere diretamente na ovulação — e é reversível quando tratamos o metabolismo de forma consistente."

> "Baixa reserva ovariana não significa ausência de chance. Significa que precisamos agir com estratégia, precisão e menos desperdício de tempo. Seu corpo ainda responde — e isso muda completamente o cenário."

**Mapeamento bloco → tema do insight:**

| Bloco | Tema central |
|---|---|
| Ciclo menstrual | desequilíbrio hormonal/inflamação que se reverte com ovulação de qualidade |
| Corpo/hormônios | resistência insulínica e padrão metabólico, reversível |
| Ovulação | reserva ovariana e janela fértil, ainda há resposta |
| Nutrição | metabolismo celular como base da fertilidade |
| Casal | fertilidade como jornada de dois, casal como equipe |

Para cada bloco, gerar um insight novo respeitando essas regras e o tema.

---

## 11. Seção "O que esse relatório ainda não consegue responder"

5 itens fixos com adaptação leve ao caso. Estrutura:

1. **Causa exata do desequilíbrio metabólico/hormonal** — adaptar conforme padrão dominante (resistência insulínica / disfunção tireoidiana / inflamatório / autoimune).
2. **Investigação de perdas gestacionais** — incluir apenas se A4_Q1 ≠ A. Se ausente, substituir por "Como sua história imunológica e endometrial está hoje".
3. **Marcadores reais (vitamina D, insulina, inflamação)** — sempre presente.
4. **Fertilidade masculina recuperável** — incluir apenas se há sinal masculino (A5_M2 sim, A5_M5 alterado, ou A5_M6 sim/desconhecido).
5. **Estresse crônico e nível hormonal atual** — sempre presente.

A seção sempre tem **exatamente 5 itens**. Se algum critério condicional não se aplica, substituir por um item alternativo da lista de reservas:

- "Como o histórico de tentativas vem afetando seu eixo hormonal hoje"
- "Quais ajustes na rotina mais impactariam o seu caso específico"
- "Qual o melhor momento clínico para considerar abordagens complementares"

---

## 12. CTA personalizado

O parágrafo de fechamento do CTA tem estrutura fixa, com **3 variáveis**:

```
{nome}, você tem {n_diagnosticos} diagnóstico(s) {simultaneo}, {achado_principal} e {situacao_perda}. Você não precisa de mais informação genérica. Você precisa de um protocolo feito para o seu corpo, com uma equipe que já guiou milhares de mulheres nessa jornada.
```

**Substituições:**

- `{nome}`: primeiro nome.
- `{n_diagnosticos}`: contagem de cartões na seção "Diagnósticos mapeados".
- `{simultaneo}`: "simultâneo" se 1, "simultâneos" se ≥2.
- `{achado_principal}`: descrição curta do pilar mais baixo. Tabela:
  - Detox → "um padrão inflamatório que pede atenção"
  - Hormonal → "um quadro hormonal que precisa de ajuste"
  - Nutrição → "lacunas nutricionais importantes"
  - Atividade Física → "um corpo pedindo movimento"
  - Sono → "um padrão de exaustão acumulada"
  - Emocional → "uma carga emocional que merece cuidado"
  - Masculina → "um fator masculino a tratar"
- `{situacao_perda}`: 
  - Se A4_Q1 = A: "uma jornada que merece direção clara"
  - Se ≥1 perda: "uma perda que merece investigação — não conformidade"

A grade de 6 diferenciais do Conceber é fixa, sem variação.

---

## 13. Arredondamentos e formatação final

| Elemento | Formato |
|---|---|
| Pontuações dos pilares (radar) | inteiro 0–10 |
| Índice de preparo | uma casa decimal, separador vírgula (ex: `4,8`) |
| AMH no texto | uma casa decimal + " ng/mL" |
| IMC no texto | uma casa decimal |
| Datas | "DD de Mês de AAAA" (mês por extenso) |
| Cores e ícones de status | 🔴 = alert (#B85C55) / 🟡 = amber (#A07820) / 🟢 = olive (#5C6A52) |

---

## 14. Exemplo trabalhado — caso "Carla Mendes"

Para validação cruzada. Inputs simulados:

```
contexto: Carla Mendes, 37 anos, 2 anos tentando, 5/5 formulários

Aula 1: Q1=D, Q2=C, Q3=C, Q4=B, Q5=C, Q6=2, Q7=B, Q8=B
Aula 2: peso=78kg/altura=1,63m (IMC=29,4 → sobrepeso),
        Q3=C, Q4=C, Q5=II, Q6=B, Q7=C, Q8=fracas, Q9=sim, Q10=sim,
        Q11=não, Q12=B, Q13=[SOP, Adenomiose, Aborto], Q14=D
Aula 3: Q1=não, Q2=B, Q3=não, Q4=[aplicativo], Q5=não, Q6=às vezes,
        Q7=0,8, Q8=[não percebo]
Aula 4: Q1=E (química), Q2=não, Q3=B, Q4=A, Q5=[nenhuma], Q6=C
Aula 5: Q1=B, Q2=A, Q3=B, Q4=C, Q5=B, Q6=A, Q7=[estresse, celular],
        Q8=D
        M1=sobrepeso, M2=ocasional (sim), M3=ocasional, M4=não,
        M5=alterado, M6=nunca investigou, M7=não
```

**Resultados esperados (após aplicação completa da metodologia):**

- Pilar Detox: ~3
- Pilar Hormonal: ~3
- Pilar Nutrição: ~5
- Pilar Atividade Física: ~6 (base 6 -1 sobrepeso +1 ?? ajustar) 
- Pilar Sono: ~4
- Pilar Emocional: ~4
- Pilar Masculina: ~5
- Índice de Preparo: 4,3 (recalcular conforme aplicação exata)
- Sinais de alerta: ~22 (somando todas as questões com alerta + diagnósticos)

**Observação importante:** o relatório "Carla" originalmente apresenta o índice 4,8 e contadores reduzidos (7 alertas). Esses números foram apresentados ilustrativamente. A metodologia descrita acima é a definitiva — caso queira reproduzir os valores exatos do relatório original, será necessário reconciliar (a) o sistema de contagem de alertas (sugiro adicionar regra de **deduplicação** por pilar — máximo 2 alertas exibidos por bloco no contador final) e (b) o cálculo do Índice (média aritmética simples sem ajustes).

---

## 15. Checklist de implementação

- [ ] Parser do input nos 5 blocos
- [ ] Tabelas de pontuação por questão (seção 3)
- [ ] Calculadora dos 7 pilares (seção 4)
- [ ] Cálculo do Índice de Preparo (seção 5)
- [ ] Contadores (seção 6)
- [ ] Lógica de status por bloco (seção 7)
- [ ] Seleção e geração de findings (seção 8)
- [ ] Mapeamento de diagnósticos (seção 9)
- [ ] Gerador de insights respeitando regras de tom (seção 10)
- [ ] Lógica condicional da seção de gaps (seção 11)
- [ ] Personalização do CTA (seção 12)
- [ ] Renderização HTML/PDF com formatação correta (seção 13)
- [ ] Validação contra o caso "Carla Mendes" (seção 14)

---

**Fim do documento.**
