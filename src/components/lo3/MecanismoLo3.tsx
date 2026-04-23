import { ArrowDown } from "lucide-react";

const Mecanismo = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[22px] md:text-4xl font-serif font-semibold text-foreground leading-tight">
              Por que tantas mulheres engravidaram depois do{" "}
              <em className="text-primary not-italic italic">Mounjaro</em>?
            </h2>

            <div className="mt-6 space-y-4 text-[15px] md:text-base font-body text-muted-foreground leading-relaxed">
              <p>
                Você provavelmente já viu esse relato em algum lugar. Mulheres que nunca conseguiram
                engravidar começaram a usar Mounjaro para emagrecer — e, de repente, descobriram que
                estavam grávidas.
              </p>
              <p>Isso não é acaso. A ciência explica.</p>
              <p>
                Existe algo em comum entre quem ganha peso e quem não consegue engravidar:{" "}
                <strong className="text-foreground">a resistência insulínica</strong>.
              </p>
              <p>
                Quando você equilibra a <strong className="text-foreground">resistência insulínica</strong>,
                a ovulação melhora. A qualidade dos óvulos melhora. Os hormônios se equilibram.
                E a fertilidade responde.
              </p>
              <p>
                É por isso que o Mounjaro, feito para emagrecer, está ajudando mulheres a engravidar.
              </p>

              <div className="mt-6 rounded-xl bg-sage-light border-l-4 border-primary p-5">
                <p className="text-foreground">
                  Mas nem toda mulher pode ou quer usar essa medicação. E foi pensando nisso que a
                  <strong> Dra. Talita</strong> desenvolveu um protocolo para fazer exatamente o
                  mesmo — de forma natural, sem remédio, com alimentação, jejum orientado e fé.
                </p>
              </div>
            </div>
          </div>

          {/* Infográfico */}
          <div className="rounded-2xl bg-background p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <div className="grid grid-cols-2 gap-4">
              {/* Caminho A */}
              <div className="text-center">
                <p className="text-xs font-body font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Caminho A
                </p>
                <div className="space-y-3">
                  <div className="rounded-lg bg-muted px-3 py-3 text-sm font-body text-muted-foreground">
                    Resistência<br />insulínica
                  </div>
                  <ArrowDown className="w-4 h-4 mx-auto text-muted-foreground" />
                  <div className="rounded-lg bg-muted px-3 py-3 text-sm font-body text-muted-foreground">
                    Ovulação<br />bloqueada
                  </div>
                  <ArrowDown className="w-4 h-4 mx-auto text-muted-foreground" />
                  <div className="rounded-lg bg-muted px-3 py-3 text-sm font-body text-muted-foreground">
                    Dificuldade de<br />engravidar
                  </div>
                </div>
              </div>

              {/* Caminho B */}
              <div className="text-center">
                <p className="text-xs font-body font-bold uppercase tracking-widest text-primary mb-4">
                  Caminho B
                </p>
                <div className="space-y-3">
                  <div className="rounded-lg bg-sage-light px-3 py-3 text-sm font-body font-semibold text-primary">
                    Equilíbrio<br />metabólico
                  </div>
                  <ArrowDown className="w-4 h-4 mx-auto text-primary" />
                  <div className="rounded-lg bg-sage-light px-3 py-3 text-sm font-body font-semibold text-primary">
                    Ovulação<br />saudável
                  </div>
                  <ArrowDown className="w-4 h-4 mx-auto text-primary" />
                  <div className="rounded-lg bg-primary text-primary-foreground px-3 py-3 text-sm font-body font-semibold">
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