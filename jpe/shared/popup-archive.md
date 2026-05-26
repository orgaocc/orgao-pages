# Popup de precheckout — arquivo de referência

Este documento guarda o popup de captura de lead (nome / e-mail / WhatsApp)
que ficava entre os CTAs e o checkout Hotmart. Foi desativado em produção
para deixar as páginas redirecionarem direto ao checkout, **mas pode ser
reativado a qualquer momento** seguindo o passo a passo abaixo.

## Como o popup funcionava

1. CTA com `data-open-modal` → `openModal()` adicionava `.open` ao `#modal`
2. Usuário preenchia nome / e-mail / WhatsApp e dava submit
3. `handleSubmit()` enviava o lead pra Supabase Edge Function
   `{supabase_url}/functions/v1/process-lead` (gravando na tabela de leads
   com `precheckout: 'true'`, UTMs, `form`, `source`, `headline_variant`,
   `submission_date`)
4. Em seguida fazia `window.location.href` para o checkout Hotmart com
   `name`, `email`, `phonenumber`, `src` (utm_source) e `sck` injetados,
   além de `xcod` se viesse na URL.

## URL final montada (com lead)

```
{CONFIG.link_ingresso}?checkoutMode=10
  &name={nome}
  &email={email}
  &phonenumber={digits}
  &src={utm_source}
  &sck={CONFIG.sck}
  [&xcod={xcod}]
```

## URL atual (direta, sem lead)

```
{CONFIG.link_ingresso}?checkoutMode=10
  &src={utm_source}
  &sck={CONFIG.sck}
  [&xcod={xcod}]
```

A função `buildCheckoutUrl()` em `app-core.js` monta isso a cada clique.

---

## Como reativar o popup

### 1) Garanta o HTML do modal na página

Cada landing tem hoje (inert) o bloco abaixo no fim do `<body>`. Se ele
foi removido, recoloque:

```html
<!-- ==================== MODAL ==================== -->
<div id="modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal-box">
    <button id="modal-close" class="modal-close" aria-label="Fechar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
    <div class="modal-inner">
      <span class="eyebrow center">Garantir ingresso</span>
      <h3 id="modal-title" class="modal-title">Jejum para Engravidar — 7 dias</h3>
      <p class="modal-sub"><span data-date-range>4 a 10 de Maio</span> · Por apenas <strong>R$ 57</strong></p>
      <form id="formClaude" novalidate>
        <div class="field-wrap">
          <label class="field-label" for="f-nome">Seu nome</label>
          <input id="f-nome" name="nome" type="text" class="field-input" placeholder="Como você se chama?" autocomplete="given-name" required>
        </div>
        <div class="field-wrap">
          <label class="field-label" for="f-email">E-mail</label>
          <input id="f-email" name="email" type="email" class="field-input" placeholder="seu@email.com" autocomplete="email" required>
        </div>
        <div class="field-wrap">
          <label class="field-label" for="f-tel">WhatsApp</label>
          <input id="f-tel" name="tel" type="tel" class="field-input" placeholder="(00) 00000-0000" autocomplete="tel" required>
        </div>
        <button id="form-btn" type="submit" class="btn-cta full">
          Quero garantir meu ingresso por R$ 57
        </button>
        <p class="modal-secure">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          Ambiente seguro · Seus dados são protegidos
        </p>
      </form>
    </div>
  </div>
</div>
```

### 2) Garanta o CSS do modal

O CSS varia por página (cada landing tem sua paleta), mas a estrutura base:

```css
.modal{
  position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.6);
  display:none;align-items:center;justify-content:center;
  padding:18px;backdrop-filter:blur(4px)
}
.modal.open{display:flex}
.modal-box{
  background:#fff;border-radius:16px;width:100%;max-width:440px;
  position:relative;max-height:92vh;overflow-y:auto;
  box-shadow:0 20px 50px rgba(0,0,0,.3)
}
.modal-close{
  position:absolute;top:14px;right:14px;
  width:36px;height:36px;border-radius:50%;
  background:#f5efe6;color:#6b6b6b;
  display:flex;align-items:center;justify-content:center;
  transition:background .2s ease,color .2s ease
}
.modal-close svg{width:18px;height:18px}
.modal-inner{padding:32px 28px 28px}
.modal-title{font-size:22px;text-align:center;margin-bottom:8px;font-weight:600}
.modal-sub{text-align:center;font-size:14px;color:#6b6b6b;margin-bottom:22px}
.field-wrap{margin-bottom:14px}
.field-label{display:block;font-size:12px;font-weight:600;color:#6b6b6b;margin-bottom:6px;letter-spacing:.02em}
.field-input{
  width:100%;padding:13px 14px;border:1px solid #e4ddcd;
  border-radius:12px;font:inherit;font-size:15px;background:#fff;
  transition:border-color .2s ease,box-shadow .2s ease
}
.field-input:focus{outline:0;border-color:#3F5947;box-shadow:0 0 0 3px rgba(63,89,71,.15)}
.modal-secure{
  display:flex;align-items:center;justify-content:center;gap:6px;
  margin-top:14px;font-size:12px;color:#6b6b6b
}
.modal-secure svg{width:14px;height:14px}
```

### 3) Restaure o JS em `jpe/shared/app-core.js`

Cole de volta as funções abaixo e troque `initDirectCheckout()` por
`initModal()` + `initForm()` no bloco `DOMContentLoaded`:

```js
/* =============================================
   MODAL
   ============================================= */
const modal = document.getElementById('modal');

function openModal()  { modal.classList.add('open');    document.body.style.overflow = 'hidden'; }
function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }

function initModal() {
  document.querySelectorAll('[data-open-modal]').forEach(el => el.addEventListener('click', openModal));
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* =============================================
   PHONE MASK
   ============================================= */
function applyMask(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}

/* =============================================
   FORM SUBMIT
   ============================================= */
function pad(n) { return String(n).padStart(2, '0'); }
function submissionDate() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-btn');
  if (btn.disabled) return;

  const nome     = document.getElementById('f-nome').value.trim();
  const email    = document.getElementById('f-email').value.trim();
  const telefone = document.getElementById('f-tel').value;
  const digits   = telefone.replace(/\D/g, '');

  if (!nome || !email || digits.length < 10) return;

  btn.disabled = true;
  btn.textContent = 'ENVIANDO...';

  const utms = getUtms();
  const body = {
    nome, email,
    whatsapp:        `+55${digits}`,
    utm_campaign:    utms.utm_campaign,
    utm_source:      utms.utm_source,
    utm_medium:      utms.utm_medium,
    utm_content:     utms.utm_content,
    utm_term:        utms.utm_term,
    utm_page:        window.location.pathname,
    lancamento:      'PCT33',
    utm_id:          utms.utm_id,
    form:            CONFIG.form,
    source:          CONFIG.source,
    headline_variant: sessionStorage.getItem('headline_variant') || 'HeadOriginal',
    precheckout:     'true',
    submission_date: submissionDate(),
  };

  try {
    await fetch(`${CONFIG.supabase_url}/functions/v1/process-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey:         CONFIG.supabase_key,
        Authorization:  `Bearer ${CONFIG.supabase_key}`,
      },
      body: JSON.stringify(body),
    });
  } catch (_) {}

  const sep = CONFIG.link_ingresso.includes('?') ? '&' : '?';
  const checkoutMode = /[?&]checkoutMode=/.test(CONFIG.link_ingresso) ? '' : 'checkoutMode=10&';
  let url = `${CONFIG.link_ingresso}${sep}${checkoutMode}name=${encodeURIComponent(nome)}&email=${encodeURIComponent(email)}&phonenumber=${encodeURIComponent(digits)}&src=${encodeURIComponent(utms.utm_source)}&sck=${CONFIG.sck}`;
  if (utms.xcod) url += `&xcod=${encodeURIComponent(utms.xcod)}`;
  window.location.href = url;
}

function initForm() {
  document.getElementById('f-tel').addEventListener('input', function() {
    this.value = applyMask(this.value);
  });
  document.getElementById('formClaude').addEventListener('submit', handleSubmit);
}
```

E no `DOMContentLoaded`:

```js
document.addEventListener('DOMContentLoaded', () => {
  loadDates();
  initFaq();
  initModal();      // <- volta
  initForm();       // <- volta
  // initDirectCheckout();   // <- remove
  initReveal();
  initFloatCta();
});
```

### 4) Garanta que o `#modal` tem `class="modal"` (display:none por padrão)

Já é o caso em todas as páginas atuais. Só conferir que ninguém tirou.

---

## Observações

- O HTML do modal ficou **inert** nas páginas mesmo após o desligamento
  (estilizado com `display:none`), então não precisa removê-lo.
- Reativar não exige rebuild — só editar `app-core.js`, commitar e pushar.
  O Cloudflare Pages publica em ~1-2 min.
- O endpoint `/functions/v1/process-lead` segue ativo no Supabase; nada
  do lado de banco foi tocado.
