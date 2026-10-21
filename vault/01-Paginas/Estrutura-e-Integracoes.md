---
title: Estrutura e integrações
tags: [orgao, pages, arquitetura]
updated: 2026-10-21
---

# Estrutura e integrações

[Índice](../00-Indice.md) · [Mapa das páginas](Mapa-das-Paginas.md)

Fonte: arquivos do repositório consultados em 2026-10-21. Esta nota descreve o código, sem testar ou alterar serviços externos.

## Landing pages JPE

Cada variante mantém seu `index.html` e `js/config.js`; conforme a versão, estilos e imagens estão em pastas locais ou no HTML. O comportamento comum vive em [`jpe/shared/app-core.js`](../../jpe/shared/app-core.js): datas, formulário, modal e interação com os elementos das páginas.

A configuração das variantes inclui datas/fallbacks, checkout e identificação de origem. O núcleo compartilhado consulta configuração remota no Supabase. A migração do relatório para n8n não significa que as landing pages também tenham abandonado o Supabase.

Antes de editar o núcleo compartilhado, identifique todas as variantes que o carregam. Antes de mudar uma campanha, confira a configuração da variante e a configuração remota aplicável.

## Relatório de fertilidade

O [`relatorio/index.html`](../../relatorio/index.html) carrega módulos JavaScript para obter dados, mapear respostas, aplicar a metodologia e renderizar o relatório. A API é consumida via n8n; o código SQL e instruções de workflow já estão na pasta do relatório.

| Responsabilidade | Fonte existente |
| --- | --- |
| Inicialização e fluxo de telas | [`app.js`](../../relatorio/js/app.js) |
| Cliente HTTP | [`api.js`](../../relatorio/js/api.js) |
| Mapeamento das respostas | [`mappings.js`](../../relatorio/js/mappings.js) |
| Regras de cálculo | [`methodology.js`](../../relatorio/js/methodology.js) |
| Renderização | [`render.js`](../../relatorio/js/render.js) |
| Eventos de acesso | [`tracking.js`](../../relatorio/js/tracking.js) |
| Metodologia documentada | [Metodologia](../../relatorio/metodologia_relatorio_conceber.md) |
| Setup e workflow | [Setup](../../relatorio/SETUP.md) · [Instruções n8n](../../relatorio/n8n-workflow-instructions.md) |
| Função de banco | [`get_relatorio_data.sql`](../../relatorio/sql/get_relatorio_data.sql) |

O setup existente contém referência ao nome legado `orgaocc/hebe-cd-jpe`. O repositório desta documentação é `orgaocc/orgao-pages`; o vínculo atual de deploy não foi verificado. Alguns comentários antigos do frontend também podem mencionar a arquitetura anterior; o cliente HTTP é a fonte para a integração implementada.

Dados pessoais e respostas reais não devem ser usados como exemplos públicos. Valores entregues pelo frontend são visíveis ao visitante e não substituem autorização no servidor.

## Assets e hospedagem

[`wrangler.toml`](../../wrangler.toml) configura assets a partir da raiz e fallback `404-page`. [`_redirects`](../../_redirects) e [`_headers`](../../_headers) registram redirecionamentos e cache. Não há manifesto de dependências ou etapa de build no estado consultado.

Documentar a configuração não comprova deploy, cache efetivo ou domínio ativo. O `.gitignore` atua sobre o Git; não é uma regra de acesso HTTP nem substitui a seleção de arquivos de qualquer pacote de deploy.
