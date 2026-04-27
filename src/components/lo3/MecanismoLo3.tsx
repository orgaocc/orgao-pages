import { ArrowDown } from "lucide-react";

const Mecanismo = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-[22px] md:text-4xl font-semibold text-foreground leading-tight" style={{ fontFamily: 'Lora, Georgia, serif' }}>
              Por que tantas mulheres engravidaram depois do{" "}
              <em className="text-primary italic">Mounjaro</em>?
            </h2>

            <div className="mt-7 space-y-4 text-[15px] md:text-base text-muted-foreground leading-relaxed">
              <p>
                Você provavelmente já viu esse relato em algum lugar. Mulheres que nunca conseguiram
                engravidar começaram a usar Mounjaro para emagrecer — e, de repente, descobriram que
                estavam grávidas.
              </p>
              <p>Isso não é acaso. A ciência explica.</p>
              <p>
                Existe algo em comum entre quem ganha peso e quem não consegue engravidar:{" "}
                <strong className="text-foreground font-semibold">a resistência insulínica</strong>.
              </p>
              <p>
                Quando você equilibra a <strong className="text-foreground font-semibold">resistência insulínica</strong>,
                a ovulação melhora. A qualidade dos óvulos melhora. Os hormônios se equilibram.
                E a fertilidade responde.
              </p>
              <p>
                É por isso que o Mounjaro, feito para emagrecer, está ajudando mulheres a engravidar.
              </p>

              <div className="mt-6 rounded-xl border-l-4 border-primary p-5" style={{ background: "hsl(var(--sage-light))" }}>
                <p className="text-foreground text-[15px] md:text-base leading-relaxed">
                  Mas nem toda mulher pode ou quer usar essa medicação. E foi pensando nisso que a
                  <strong> Dra. Talita</strong> desenvolveu um protocolo para fazer exatamente o
                  mesmo — de forma natural, sem remédio, com alimentação, jejum orientado e fé.
                </p>
              </div>
            </div>
          </div>

          {/* Infográfico */}
          <div className="rounded-2xl bg-background p-7 md:p-9 shadow-[0_4px_24px_rgba(194,24,91,0.08)] border border-border">
            <div className="grid grid-cols-2 gap-5">
              {/* Caminho A */}
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-5">
                  Caminho A
                </p>
                <div className="space-y-3">
                  <div className="rounded-xl bg-muted px-3 py-3.5 text-sm text-muted-foreground leading-snug">
                    Resistência<br />insulínica
                  </div>
                  <ArrowDown className="w-4 h-4 mx-auto text-muted-foreground" />
                  <div className="rounded-xl bg-muted px-3 py-3.5 text-sm text-muted-foreground leading-snug">
                    Ovulação<br />bloqueada
                  </div>
                  <ArrowDown className="w-4 h-4 mx-auto text-muted-foreground" />
                  <div className="rounded-xl bg-muted px-3 py-3.5 text-sm text-muted-foreground leading-snug">
                    Dificuldade de<br />engravidar
                  </div>
                </div>
              </div>

              {/* Caminho B */}
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-5">
                  Caminho B
                </p>
                <div className="space-y-3">
                  <div className="rounded-xl px-3 py-3.5 text-sm font-semibold text-primary leading-snug" style={{ background: "hsl(var(--sage-light))" }}>
                    Equilíbrio<br />metabólico
                  </div>
                  <ArrowDown className="w-4 h-4 mx-auto text-primary" />
                  <div className="rounded-xl px-3 py-3.5 text-sm font-semibold text-primary leading-snug" style={{ background: "hsl(var(--sage-light))" }}>
                    Ovulação<br />saudável
                  </div>
                  <ArrowDown className="w-4 h-4 mx-auto text-primary" />
                  <div className="rounded-xl bg-primary text-primary-foreground px-3 py-3.5 text-sm font-semibold leading-snug shadow-[0_4px_14px_rgba(194,24,91,0.3)]">
                    Fertilidade<br />restaurada
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mecanismo;
