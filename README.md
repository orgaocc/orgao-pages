# Órgão Pages

Páginas estáticas da ÓrgãoCC / Grupo Conceber: versões da campanha Jejum para Engravidar, relatório de fertilidade e mapa de gestão tech e operações.

## Por onde começar

| Documento | Finalidade |
| --- | --- |
| [Brain.md](Brain.md) | Contexto rápido, pendências e continuidade entre sessões |
| [Índice do vault](vault/00-Indice.md) | Documentação por assunto |
| [Mapa das páginas](vault/01-Paginas/Mapa-das-Paginas.md) | Todas as entradas HTML, rotas e versões presentes no Git |
| [Estrutura e integrações](vault/01-Paginas/Estrutura-e-Integracoes.md) | Organização do código e dependências |
| [Contexto do projeto](vault/02-Contexto/Contexto-do-Projeto.md) | Síntese publicável do cérebro local da Órgão |
| [Decisões](vault/03-Decisoes/Registro-de-Decisoes.md) | Decisões aceitas e suas fontes |
| [Publicação segura](vault/99-Referencias/Publicacao-Segura.md) | O que pode ser versionado e o que permanece privado |

## Estrutura

```text
Brain.md                 contexto rápido
vault/                   notas, mapa e decisões
jpe/cc-*/                versões das landing pages
jpe/shared/              comportamento compartilhado
relatorio/               relatório, metodologia e integração HTTP
tech/                    mapa de gestão tech e operações
404.html                 redirecionamento de fallback
_redirects               regras de redirecionamento
_headers                 regras de cache
wrangler.toml            configuração de assets estáticos
```

## Visualizar localmente

Sem instalação de dependências ou build:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8080/jpe/cc-v7b/`, `http://127.0.0.1:8080/relatorio/` ou `http://127.0.0.1:8080/tech/`. O servidor Python não interpreta `_redirects`, `_headers` nem o fallback do Cloudflare; use os caminhos completos. Formulários, consultas e tracking podem chamar serviços reais: visualizar localmente não isola essas integrações.

## Manutenção

Leia o Brain antes de alterar uma página. Registre no vault o assunto correspondente, atualize o mapa quando criar ou remover entradas HTML e registre apenas decisões efetivamente aceitas. Use links Markdown relativos, navegáveis no GitHub.

O repositório é público. Credenciais, conexões privadas, exports de leads/alunas, dumps e registros operacionais restritos ficam fora do Git. Confira o diff antes de cada commit; `.gitignore` não remove conteúdo já rastreado nem apaga o histórico. Consulte a [política de publicação](vault/99-Referencias/Publicacao-Segura.md).

O mapa descreve o código versionado. Presença no Git não comprova que uma rota esteja implantada ou ativa no domínio de produção.
