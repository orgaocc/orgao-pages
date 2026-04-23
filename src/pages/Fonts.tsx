import { useEffect } from "react";

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;0,700;1,500&family=DM+Serif+Display:ital@0;1&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Cormorant+Infant:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap";

const samples = [
  {
    name: "Fraunces",
    family: '"Fraunces", serif',
    note: "Serif moderna e quente · curvas suaves · ar contemporâneo",
  },
  {
    name: "DM Serif Display",
    family: '"DM Serif Display", serif',
    note: "Serif elegante e alta · ar editorial · ótima para títulos grandes",
  },
  {
    name: "Lora",
    family: '"Lora", serif',
    note: "Serif suave e arredondada · calorosa e maternal",
  },
  {
    name: "Cormorant Infant",
    family: '"Cormorant Infant", serif',
    note: "Variação arredondada da Cormorant · curvas femininas e doces",
  },
];

const headline = "Jejum e Oração para Engravidar";
const subline =
  "O protocolo da Dra. Talita Melo que equilibra a resistência insulínica e melhora a fertilidade — sem remédio, em 7 dias.";
const lorem =
  "Inspirado nos ensinamentos da Bíblia Sagrada e no livro FÉrtilidade, você terá em mãos tudo o que precisa para nutrir corpo e espírito durante os 7 dias de jornada.";

const Fonts = () => {
  useEffect(() => {
    if (document.querySelector('link[data-fonts-preview="true"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS_HREF;
    link.dataset.fontsPreview = "true";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Comparativo tipográfico
          </p>
          <h1 className="text-3xl md:text-4xl font-serif">
            Escolha da fonte serif para v1 e v2
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Mesma headline e subtítulo renderizados em 4 fontes serif femininas. Compare peso,
            altura e personalidade antes de decidir.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {samples.map((s) => (
          <section
            key={s.name}
            className="rounded-2xl border border-border bg-card p-8 md:p-10 shadow-sm"
          >
            <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
              <h2
                className="text-xl font-semibold"
                style={{ fontFamily: s.family }}
              >
                {s.name}
              </h2>
              <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {s.note}
              </span>
            </div>

            <p
              className="text-4xl md:text-6xl leading-[1.1] text-foreground"
              style={{ fontFamily: s.family, fontWeight: 500 }}
            >
              {headline}
            </p>

            <p
              className="mt-6 text-lg md:text-2xl italic text-foreground/80"
              style={{ fontFamily: s.family, fontWeight: 400 }}
            >
              {subline}
            </p>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Peso 600 · 28px
                </p>
                <p
                  className="text-[28px] leading-snug"
                  style={{ fontFamily: s.family, fontWeight: 600 }}
                >
                  Muitas mulheres engravidaram depois do Mounjaro.
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Peso 400 · 16px (corpo)
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{ fontFamily: s.family, fontWeight: 400 }}
                >
                  {lorem}
                </p>
              </div>
            </div>
          </section>
        ))}
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Página interna de avaliação · não indexada
      </footer>
    </div>
  );
};

export default Fonts;
