# /webinar/ — inscrição no webinar evergreen do Programa Conceber

Esqueleto montado em 12/11/2026 a partir da página https://webinar.isalatuf.com.br (mesma estrategista; o Luan
mandou o código-fonte e os prints do WhatsApp). A copy e o visual final entram depois: todo texto marcado como
`[a preencher: ...]` e toda caixa listrada são lugar de conteúdo.

## Como funciona (o que a página da Isa faz, e esta copia)

1. **Horários de 15 em 15 minutos.** A lista "Escolha um horário" mostra 3 opções: o **Agora** (próximo múltiplo de
   15 min no horário de Brasília, marcado com o ponto pulsando) e os horários fixos dos próximos dias
   (`horarios_fixos` no `js/config.js`: 07:00, 12:00 e 20:00, igual à Isa). Feriados em `feriados` não geram sessão.
   O "Agora" avança sozinho a cada 30 s, sem recarregar a página.
2. **Formulário** (nome, e-mail, WhatsApp, horário, mais um campo escondido contra robô) faz `POST` em
   `webhook_url` com `{ data: {...}, referrer }`. `data` leva `schedule` (ISO com `-03:00`, ex.:
   `2026-11-12T10:45:00-03:00`), `name`, `email`, `phone` (`+55` + dígitos), as UTMs, `utm_page`, `lancamento`,
   `form` e `source`, no padrão das outras páginas do Órgão.
3. **O n8n responde** `{ ticket: "WPJ-XXXXXXXX", name, email, phone }` com status 200. Qualquer outra coisa
   (ou `{ code: "..." }`) vira a mensagem de erro no formulário. Na Isa o n8n inscreve a pessoa no
   WebinarJam/EverWebinar (o ingresso `WPJ-` é de lá) e devolve o ticket.
4. **Página de obrigado** (`obrigado/`): lê o ingresso do `localStorage`, monta o link
   `wa.me/<número>?text=Quero confirmar minha inscrição. Meu ingresso é WPJ-....` e redireciona sozinha em 15 s.
   Dispara `working_lead` no `dataLayer` uma vez por inscrição.
5. **No WhatsApp**, a automação (Unnichat) reconhece o ingresso na mensagem e responde com o link da sala, data e
   hora; depois manda "estou ao vivo" na hora da sessão e a pesquisa rápida. Isso é todo no Unnichat/n8n, fora desta
   página.

Sem `webhook_url` no config, o formulário **simula** a resposta (ingresso aleatório `WPJ-`) e segue pra obrigado:
serve pra testar layout e fluxo sem backend.

## O que falta pra ir pro ar

- `webhook_url`: a URL do gatilho no n8n do Órgão (fluxo a montar: receber, inscrever no webinar, guardar o lead,
  mandar pro Unnichat, devolver o ticket).
- `whatsapp`: confirmar qual conexão do Unnichat responde (está a Marketing, +55 31 3191-9798).
- `lancamento`, `form`, `source`: a tag do lançamento, pra linha da Data Table do n8n e pro Mautic.
- Copy, imagens (WebP em `assets/`), nome de quem apresenta, título da aba e `description`.
- Tirar o `noindex` das duas páginas.
- Testar o pixel (Pixel X App) com navegador de verdade, como em toda página nova.

## Sala sem WebinarJam (demonstração, `sala/`)

Pergunta do Luan em 12/11: "preciso do WebinarJam mesmo?". Não. A `sala/` mostra a ideia: lê a hora da sessão (do
`localStorage` da inscrição ou de `?h=<ISO>&t=<ingresso>`) e faz sozinha o que a sala do WebinarJam faz:
contagem antes da hora; na hora, play no vídeo gravado já no minuto certo (quem entra atrasado pega do meio), sem
barra nem pausa, "toque para ouvir" porque o autoplay nasce mudo; cartão de oferta no minuto `sala.oferta_minuto`;
pergunta pelo WhatsApp (o Unnichat responde); "você está assistindo há N min" e, a cada minuto, o sinal de presença
(aqui só no console; de verdade vai pro n8n/Supabase e vira tag no Unnichat); no fim do vídeo, "sessão encerrada, sem
replay". Pra mostrar: `sala/?demo=antes`, `?demo=aovivo`, `?demo=oferta`, `?demo=fim`. O vídeo em `sala.video_url` é um
exemplo público (Big Buck Bunny no archive.org), só pra ter imagem; o real vai pro Panda ou Cloudflare Stream.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | página de inscrição (hero com formulário, faixa, prova, mecanismo, fé, pra quem é, fecho, quem apresenta, barra fixa, modal) |
| `obrigado/index.html` | confirmação pelo WhatsApp |
| `js/config.js` | tudo que muda por campanha |
| `js/app.js` | horários, formulário, modal, barra fixa |
| `js/obrigado.js` | link do WhatsApp e contagem |
| `css/style.css` | esqueleto visual (paleta da `jpe/cc-v11`) |
