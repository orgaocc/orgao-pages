/* =============================================
   PERGUNTAS — Quiz de anamnese "Seu plano para Conceber" (pcbf26/quiz)
   Texto das perguntas e respostas: briefing da Bruna de 19/11/2026.
   O `valor` de cada resposta é o que vai pro n8n; a regra dos pilares (fluxo "[PC] [BF26] Quiz Anamnese")
   lê esses valores. Mudou um valor aqui: mudar lá também (orgao-cc/quiz-anamnese/codigo/pilares.js).
   Onde o briefing não trazia saída do tipo "não sei", entrou "Prefiro não responder" (valor nao_responder).
   ============================================= */
var PERGUNTAS = [
  /* ---------- Bloco 1, situação ---------- */
  { id: 'q1', bloco: 'Sua história', pergunta: 'Há quanto tempo você tenta engravidar?', opcoes: [
    ['ate_6m', 'Até 6 meses'], ['6_12m', 'De 6 a 12 meses'], ['1_2a', 'De 1 a 2 anos'], ['2_5a', 'De 2 a 5 anos'],
    ['mais_5a', 'Mais de 5 anos'], ['nao_responder', 'Prefiro não responder'] ] },
  { id: 'q2', bloco: 'Sua história', pergunta: 'Essa é a sua primeira tentativa?', opcoes: [
    ['primeira', 'É a primeira vez'], ['tenho_filho', 'Já engravidei e tenho filho'], ['perdi', 'Já engravidei e perdi'],
    ['mais_perdas', 'Tive mais de uma perda'], ['nao_responder', 'Prefiro não responder'] ] },
  { id: 'q3', bloco: 'Sua história', pergunta: 'Você já fez algum tratamento?', opcoes: [
    ['nenhum', 'Nenhum'], ['inducao', 'Indução da ovulação'], ['inseminacao', 'Inseminação'], ['uma_fiv', 'Uma FIV'],
    ['mais_fiv', 'Mais de uma FIV'], ['nao_responder', 'Prefiro não responder'] ] },

  /* ---------- Bloco 2, diagnóstico ---------- */
  { id: 'q4', bloco: 'Diagnóstico', multipla: true, pergunta: 'Você tem algum diagnóstico?', ajuda: 'Pode marcar mais de um.', opcoes: [
    ['sop', 'SOP'], ['endometriose', 'Endometriose'], ['baixa_reserva', 'Baixa reserva ovariana'], ['trompas', 'Alteração nas trompas'],
    ['tireoide', 'Tireoide'], ['miomas', 'Miomas'], ['adenomiose', 'Adenomiose'], ['trombofilia', 'Trombofilia'],
    ['sem_causa', 'Infertilidade sem causa aparente'], ['nenhum', 'Nenhum', true], ['nao_sei', 'Não sei', true] ] },
  { id: 'q5', bloco: 'Diagnóstico', pergunta: 'Os seus exames estão em dia?', opcoes: [
    ['ultimos_6m', 'Fiz nos últimos 6 meses'], ['mais_1a', 'Fiz há mais de um ano'], ['nunca', 'Nunca investiguei a fundo'],
    ['nao_responder', 'Prefiro não responder'] ] },
  { id: 'q6', bloco: 'Diagnóstico', pergunta: 'O seu marido já fez espermograma?', opcoes: [
    ['normal', 'Fez e está normal'], ['alterado', 'Fez e veio alterado'], ['nunca', 'Nunca fez'], ['nao_se_aplica', 'Não se aplica'] ] },

  /* ---------- Bloco 3, os sete pilares (uma pergunta por pilar) ---------- */
  { id: 'q7', bloco: 'Equilíbrio Nutricional', pergunta: 'Como está a sua alimentação hoje?', opcoes: [
    ['sem_criterio', 'Como de tudo, sem me preocupar muito'], ['tento', 'Tento comer bem, mas não sei se é o certo para engravidar'],
    ['cortei', 'Já cortei vários alimentos e sigo uma dieta'], ['sem_rotina', 'Não consigo manter nenhuma rotina'],
    ['nao_responder', 'Prefiro não responder'] ] },
  { id: 'q8', bloco: 'Equilíbrio Hormonal', pergunta: 'Como é o seu ciclo menstrual?', opcoes: [
    ['regular', 'Regular, vem todo mês na mesma época'], ['irregular', 'Irregular, atrasa ou adianta'], ['doloroso', 'Muito doloroso'],
    ['ausente', 'Não menstruo ou menstruo só com medicação'], ['nao_sei', 'Não sei identificar'] ] },
  { id: 'q9', bloco: 'Atividade Física', pergunta: 'Você pratica atividade física?', opcoes: [
    ['nao', 'Não pratico'], ['as_vezes', 'De vez em quando'], ['tres_mais', 'Três vezes por semana ou mais'],
    ['pesado', 'Treino pesado quase todos os dias'], ['nao_responder', 'Prefiro não responder'] ] },
  { id: 'q10', bloco: 'Sono', pergunta: 'Como você tem dormido?', opcoes: [
    ['bem', 'Durmo bem e acordo descansada'], ['menos_6h', 'Durmo menos de seis horas'], ['acordo', 'Acordo várias vezes na madrugada'],
    ['demoro', 'Demoro muito para pegar no sono'], ['nao_responder', 'Prefiro não responder'] ] },
  { id: 'q11', bloco: 'Equilíbrio Emocional', pergunta: 'Como você tem se sentido nessa jornada?', opcoes: [
    ['esperancosa', 'Esperançosa'], ['ansiosa', 'Ansiosa, penso nisso o tempo todo'], ['cansada', 'Cansada, já não sei o que fazer'],
    ['triste', 'Triste, evito falar sobre o assunto'], ['nao_responder', 'Prefiro não responder'] ] },
  { id: 'q12', bloco: 'Fertilidade Masculina', pergunta: 'E o seu marido, como ele participa dessa jornada?', opcoes: [
    ['junto', 'Cuida da saúde dele junto comigo'], ['quando_peco', 'Faz exames quando eu peço'], ['nao_se_cuida', 'Não acha que precisa se cuidar'],
    ['nao_envolver', 'Prefiro não envolver ele por enquanto'] ] },
  { id: 'q13', bloco: 'Detox', multipla: true, pergunta: 'Você sente algum desses sinais com frequência?', ajuda: 'Pode marcar mais de um.', opcoes: [
    ['inchaco', 'Inchaço'], ['intestino', 'Intestino preso'], ['cansaco', 'Cansaço mesmo dormindo bem'], ['dor_cabeca', 'Dor de cabeça'],
    ['pele', 'Acne ou manchas na pele'], ['nenhum', 'Nenhum desses', true] ] },

  /* ---------- Bloco 4, prontidão (não aparece na carta; classifica a lead) ---------- */
  { id: 'q14', bloco: 'Para terminar', pergunta: 'O que mais te impede hoje?', opcoes: [
    ['nao_sei_comecar', 'Não sei por onde começar'], ['tentei_tudo', 'Já tentei de tudo'], ['ninguem_acompanha', 'Ninguém me acompanha de verdade'],
    ['valor', 'O valor'], ['medo', 'Medo de me frustrar de novo'], ['nao_responder', 'Prefiro não responder'] ] },
  { id: 'q15', bloco: 'Para terminar', pergunta: 'Se existisse um acompanhamento que aumentasse a sua chance, você começaria quando?', opcoes: [
    ['agora', 'Agora'], ['proximo_mes', 'No próximo mês'], ['pesquisando', 'Só estou pesquisando'] ] },
];
/* A 16 (nome, e-mail e WhatsApp) é a tela final, montada no quiz.js. */
