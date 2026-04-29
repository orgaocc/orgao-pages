# Projeto hebe-orgao-cc / jpe

Landing pages do "Jejum e Oração para Engravidar" (Grupo Conceber).

## Estrutura

- `jpe/cc-v1/`, `cc-v2/`, `cc-v2b/`, `cc-v3/`, `cc-v7/`, `cc-v7b/`, `cc-v9/` — landing pages
  - `cc-v7b` é a página de teste de performance bruta (sem Pixel X)
- `jpe/shared/app-core.js` — JS compartilhado (form submit, FAQ, modal, dates)
- `_redirects`, `_headers`, `404.html` — config Cloudflare Pages

## Regras de git (IMPORTANTE)

**NUNCA fazer `git commit` ou `git push` sem autorização explícita do usuário.**

- O GitHub é o destino final de produção, não rascunho.
- Sempre fazer as mudanças, mostrar o que mudou, e **esperar o usuário pedir** o commit/push.
- Frases como "pode comitar", "pode dar o push", "pode pushar", "pull mediante autorização" liberam a ação. Sem isso, parar antes.
- Se o usuário disser "faça X e dê o push", aí pode commitar+pushar de uma vez.

## Pixel X App

O bloco do Pixel X precisa ficar **exatamente** como o original, sem otimização (sem preconnect, dns-prefetch, defer, async externo, ou pxa-fb.js separado):

```html
<!-- Pixel X App - START -->
<script type='text/javascript'>
!function(){var e=window.location.href,t=document.title,n=Date.now(),o=document.createElement('script');o.src='https://pxa.grupoconceber.com/remote?url='+encodeURIComponent(e)+'&title='+encodeURIComponent(t)+'&time='+n,o.async=!0,document.head.appendChild(o)}()
</script>
<!-- Pixel X App - END -->
```

Aplicar em todas as páginas **exceto cc-v7b** (que é a página de teste sem pxa).

## Imagens

Todas as imagens são self-hosted dentro do projeto. Não referenciar URLs do `grupoconceber.com` em `<img src>` — apenas em meta tags `og:image`/`twitter:image` e JSON-LD (que precisam de URL absoluta para social sharing).

Imagens compartilhadas ficam em `cc-v3/assets/` (logo-footer, orgao, talita, mask-group-1-1, icon_conceber). Imagens específicas de página ficam no `assets/` da própria página.

## Headline A/B test

`cc-v1`, `cc-v2`, `cc-v2b` rodam A/B test de headline (`Head3` vs `Head7`) salvo em `sessionStorage.headline_variant`. As demais páginas (sem A/B test) enviam `HeadOriginal` no campo `headline_variant` do form submit.
