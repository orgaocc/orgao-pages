---
title: Brain — Órgão Pages
tags: [orgao, pages, brain, index]
created: 2026-10-21
updated: 2026-10-21
---

# Brain — Órgão Pages

Repositório de páginas do projeto Órgão, conforme confirmação do Héric em 2026-10-21. Este Brain é a entrada rápida para o código; o [vault](vault/00-Indice.md) contém o detalhe. O Brain local completo da Órgão continua preservando o histórico privado de infraestrutura, dados e reuniões.

## Contexto

A campanha Jejum para Engravidar tem dez variantes no diretório `jpe/`. O repositório também contém o relatório de fertilidade e o mapa de operações. A raiz e o fallback apontam para `cc-v7b` na configuração versionada; o backup `cc-v7-bkp1` redireciona para `cc-v7`.

- [Mapa de todas as páginas](vault/01-Paginas/Mapa-das-Paginas.md).
- [Código e integrações](vault/01-Paginas/Estrutura-e-Integracoes.md).
- [Contexto trazido do Brain local](vault/02-Contexto/Contexto-do-Projeto.md).
- [Decisões aceitas](vault/03-Decisoes/Registro-de-Decisoes.md).
- [Publicação segura](vault/99-Referencias/Publicacao-Segura.md).

## Pendências

- Confirmar domínio, vínculo de deploy e revisão implantada antes de declarar publicação; há referência legada a outro nome de repositório no setup do relatório.
- Revisar datas de campanha com o responsável antes de modificá-las; os fallbacks no código podem pertencer a campanhas anteriores.
- Classificar separadamente configurações que já existiam no frontend; esta organização não altera o funcionamento das integrações nem comprova suas permissões no backend.

## Sessão de 2026-10-21

A pedido do Héric, preparada a documentação publicável no próprio repositório: README, Brain enxuto, vault, inventário das entradas HTML e regras de exclusão de arquivos privados. O conteúdo foi adaptado do contexto local e conferido contra os arquivos do Git; nenhum registro operacional restrito foi copiado integralmente. O `.env` preexistente foi retirado do índice, preservando a cópia local. A entrega será submetida por PR; merge e deploy são estados posteriores.

## Pink Friday 2026 (2026-10-21, Luan)

Entraram `/pcbf26/vendas/` e `/pcbf26/upsell/`, montadas do Figma "BLACK FRIDAY PC 2026". Endereço segue domínio / lançamento / página; `utm_page` grava `/pcbf26/...`. Link de checkout de cada página (e o id e o formato da VSL do upsell) ficam no `js/config.js` da pasta: trocar ali, sem mexer no HTML. Imagens em WebP. Detalhes no [mapa das páginas](vault/01-Paginas/Mapa-das-Paginas.md). Em 22/10 o layout novo virou o oficial nessas mesmas rotas; o antigo ficou em `/pcbf26/vendas-antiga/` e `/pcbf26/upsell-antiga/`. O `shared/precheckout.js` aceita variáveis `--pc-*` no `:root` da página pra o modal seguir o visual dela (só estilo; sem elas fica o laranja padrão).

Publicação: o Workers Builds constrói cada commit uma vez. Commit que chega primeiro por uma branch vira só prévia (`<branch>-jpe-cd.conceber.workers.dev`); levar o mesmo commit pra `main` não publica. Pra produção, o commit precisa nascer na `main` (ou merge com commit próprio).

## Detox da Tentante T58 (2026-11-16, Luan)

Entraram `/ddt/vsl/` e `/ddt/v9/`, versões novas das páginas de ingresso que hoje ficam no WordPress (`grupoconceber.com/ddt/vsl/` e `/ddt/v9/`). Mesma ordem de seções, mesma copy e mesmas cores das originais; muda o acabamento (Playfair Display + DM Sans, grid de 8, botão com texto escuro). Valor e data já são os da T58: R$ 97 ou 12x de R$ 9,34, de 07 até 13 de dezembro. O que é comum às duas fica em `ddt/shared/` (`ddt.css`, `ddt.js` com o contador e a faixa de depoimentos, `precheckout.js` copiado do `pcbf26` com o aviso da LGPD vindo do config). Cada página tem a paleta no `<style>` dela e o `js/config.js` com `inicio` (contador), `link_checkout` e os dados do pré-checkout (`lancamento: PC-RDF`, `utm_campaign: PC-LPS`, iguais aos do popup 453324 do WordPress).

Pendências: `link_checkout` vazio nas duas (o produto da T58 ainda não existe na Hotmart; sem ele o botão da oferta não abre o formulário); hora do contador (20h de 07/12) e as frases "começa nesta segunda-feira" a confirmar com a Bruna; `noindex` ligado enquanto for prévia. Branch `ddt-t58`, prévia em `ddt-t58-jpe-cd.conceber.workers.dev/ddt/vsl/` e `/ddt/v9/`.

## Página de venda do Programa Conceber (2026-11-17, Luan)

- `pc-lps/`: refeita a partir de `grupoconceber.com/pc-lps/` ("refaz essa página, tá bem feia"). Mesma ordem de seções,
  mesmos textos e preços; visual novo com as cores da marca (vinho, magenta, rosa, creme; verde nos botões).
- A oferta troca sozinha pela regra da original, no horário de Brasília: domingo a partir das 10h45 e segunda = 12x de
  R$ 279,90 / R$ 2.797,90; terça e quarta = 12x de R$ 297,90 / R$ 2.997,90; quinta a domingo 10h44 = inscrições fechadas
  (lista de espera). Regra e preços em `js/config.js` (`estado`). Pra ver cada versão: `?estado=2797`, `?estado=2997`,
  `?estado=espera`.
- **`link_checkout` das duas ofertas está vazio**: sem ele o botão de compra não abre o formulário. Falta o link da Guru
  do Programa Conceber da T58 (pedido à Bruna). Na original o redirecionamento estava dentro do formulário do Elementor
  "[PC-LPS] PRÉ-CHECKOUT | VENDAS", fora do código público.
- `lancamento` e `utm_campaign` do pré-checkout: a original mandava "PCT32"; pus "PCT58", a confirmar.
- Formulário de pré-checkout: o mesmo de `ddt/shared/precheckout.js`, com as cores da página pelas variáveis `--pc-*`.
- Conferida em 1440 e 390 no Chrome e no WebKit (nada fora da tela, todas as imagens, formulário abrindo com link).
