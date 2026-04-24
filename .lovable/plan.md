
# Ajustes nas 3 landing pages (LO1, LO2, LO3)

## 1. Tarja vermelha de urgência (todas as páginas)

**Novo componente:** `src/components/UrgencyBar.tsx`
- Barra fixa no topo (`sticky top-0 z-50`)
- Fundo vermelho (`bg-red-600`), texto branco, centralizado
- Texto: **"⏰ Começa na próxima segunda — 27 de Abril"**
- Padding compacto (`py-2`), fonte pequena/bold (`text-sm font-semibold`)
- Responsivo (em mobile encurta para "Começa segunda · 27/04")

**Integração:**
- `src/pages/Index.tsx` → adicionar `<UrgencyBar />` antes do `<HeroSection />`
- `src/pages/IndexLo2.tsx` → idem
- `src/pages/IndexLo3.tsx` → adicionar antes do `<HeroLo3 />`

## 2. Remover logo da primeira dobra (todas)

**`src/components/HeroSection.tsx`** (usado por LO1 e LO2):
- Remover bloco `<img src={logoImg} ... />` tanto no layout mobile quanto desktop
- Remover o import `import logoImg from "@/assets/logo-jejum.webp"`

**`src/components/lo3/HeroLo3.tsx`:**
- Mesma remoção (mobile + desktop) e remover o import do logo

## 3. Destaque para data e preço na primeira dobra

Substituir a linha pequena de texto ("Encontros online, de 27 de Abril...") por um **card/pill destacado** logo abaixo do CTA, com mais peso visual.

**Estrutura do destaque (mesmo conteúdo, estilo por tema):**
```
┌─────────────────────────────────────┐
│  📅 27 de Abril a 3 de Maio         │
│  💰 Apenas R$ 57  (ou 8x R$ 7,88)   │
└─────────────────────────────────────┘
```

- Card com `border` sutil, `rounded-xl`, fundo levemente tonalizado (usando tokens já existentes: `bg-cream` em LO1, tom rosado em LO2, `bg-primary/5` em LO3)
- Duas linhas: data (com ícone de calendário) e preço (com destaque maior no "R$ 57")
- Mesma estrutura aplicada em mobile e desktop

**Arquivos:**
- `src/components/HeroSection.tsx` (cobre LO1 + LO2 — usa tokens semânticos que já mudam por tema)
- `src/components/lo3/HeroLo3.tsx`

## Arquivos afetados
- ✨ Criar: `src/components/UrgencyBar.tsx`
- ✏️ Editar: `src/components/HeroSection.tsx`, `src/components/lo3/HeroLo3.tsx`, `src/pages/Index.tsx`, `src/pages/IndexLo2.tsx`, `src/pages/IndexLo3.tsx`

## Fora de escopo
- Não altero outras seções, fontes, cores globais ou estrutura das páginas
- Não mexo em tracking, formulário ou fluxo de checkout
