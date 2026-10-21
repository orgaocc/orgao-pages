---
title: Publicação segura da documentação
tags: [orgao, pages, publicacao]
updated: 2026-10-21
---

# Publicação segura

[Índice](../00-Indice.md) · [README](../../README.md)

Este repositório é público. O `.gitignore` protege arquivos locais não rastreados; a seleção explícita dos arquivos e a revisão do diff protegem a entrega proposta.

## Conteúdo permitido

README, Brain enxuto, notas técnicas sem valores de credenciais, mapa das páginas, decisões publicáveis e referências públicas. Exemplos de configuração, quando necessários, contêm apenas nomes de variáveis e valores vazios.

## Conteúdo que permanece privado

Arquivos `.env` e variações, `.CONEXOES.md`, chaves privadas e certificados com material privado, exports de leads/alunas, planilhas com dados pessoais, dumps SQL de dados, backups e logs. Documentos privados podem ficar em `private/` ou `vault/privado/`, pastas ignoradas. A cópia original do cérebro local e suas notas restritas permanecem fora deste checkout.

Não coloque credenciais em Markdown: ignorar `.env` não protege um valor copiado para um documento versionado. Mesmo URLs podem conter credenciais em parâmetros ou no usuário/senha; remova esses valores antes de documentar.

## Verificações antes de enviar

```sh
git status --short
git check-ignore -v .env .env.production .CONEXOES.md exports/exemplo.csv vault/privado/nota.md
git ls-files .env '.env.*' .CONEXOES.md
git diff --cached --stat
```

Revise o diff em ambiente local sem imprimir valores de credenciais em logs compartilhados. Arquivos já rastreados exigem remoção explícita do índice; adicionar uma regra ao `.gitignore` não os remove.

## Tratamento do arquivo preexistente

A revisão base já rastreava um `.env` com configuração do Supabase. Nesta proposta, ele é removido do índice e preservado apenas na cópia local. Os campos de chave nesse arquivo indicam papel JWT `anon`; isso não comprova as políticas ou permissões efetivas do serviço.

A remoção do arquivo não apaga o histórico nem altera configurações já embutidas no frontend. A documentação adicionada não copia valores desses arquivos. Qualquer segredo de fato exposto anteriormente precisa ser tratado no provedor responsável; esta entrega não realiza rotação nem mudanças de acesso.
