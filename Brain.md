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
