import heroImg from "@/assets/hero-doctor.webp";
import { Calendar } from "lucide-react";
import { useLaunchConfig } from "@/hooks/useLaunchConfig";
import { formatDateRangeTwoLines } from "@/lib/dateRange";

const HighlightCard = () => {
  const { config } = useLaunchConfig();
  const [line1, line2] = formatDateRangeTwoLines(config.week_start, config.week_end);
  return (
    <div className="rounded-2xl bg-white border border-border shadow-[0_2px_16px_rgba(194,24,91,0.08)] overflow-hidden">
      <div className="flex flex-row divide-x divide-border">
        <div className="flex items-center gap-3 px-4 sm:px-5 py-4 flex-1 justify-center sm:justify-start">
          <Calendar className="w-5 h-5 text-primary shrink-0" aria-hidden />
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Datas
            </p>
            <p className="text-base md:text-lg font-semibold text-foreground leading-tight">
              {line1}{line2 && (<><br />{line2}</>)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 sm:px-5 py-4 flex-1 justify-center sm:justify-start">
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Investimento
            </p>
            <p className="text-foreground leading-tight">
              <span className={`${line2 ? "block" : "inline"} text-2xl md:text-3xl font-bold text-primary tracking-tight`}>R$ 57</span>
              <span className={`${line2 ? "block mt-0.5" : "inline ml-2"} text-xs md:text-sm text-muted-foreground`}>
                ou 8x R$ 7,88
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroLo3 = () => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-background">
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: "hsl(var(--primary))", transform: "translate(30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: "hsl(var(--gold))", transform: "translate(-30%, 30%)" }}
      />

      <div className="section-container relative z-10">
        {/* Mobile */}
        <div className="flex flex-col items-center text-center md:hidden">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-px w-6 opacity-40" style={{ background: "hsl(var(--primary))" }} />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Medicina · Nutrição · Fé
            </p>
            <div className="h-px w-6 opacity-40" style={{ background: "hsl(var(--primary))" }} />
          </div>

          <h1 className="text-[30px] leading-[1.25] font-semibold text-foreground animate-fade-up" style={{ fontFamily: 'Lora, Georgia, serif' }}>
            Muitas mulheres engravidaram depois do{" "}
            <em className="text-primary italic">Mounjaro</em>.
            <br />
            Mas nem todas podem usar essa medicação.
            <br />
            <span className="text-primary">Existe outro caminho.</span>
          </h1>

          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground animate-fade-up-delay-1">
            O protocolo da Dra. Talita Melo que equilibra a resistência insulínica e melhora a fertilidade —
            sem remédio, em 7 dias.
          </p>

          <div className="mt-7 w-full animate-fade-up-delay-1">
            <HighlightCard />
          </div>

          <div className="mt-6 w-full animate-fade-up-delay-2">
            <a href="#oferta" className="btn-cta w-full text-[15px]">
              Quero garantir minha vaga
            </a>
          </div>

          <div className="mt-10 animate-fade-up-delay-2 relative">
            <div
              className="absolute inset-0 rounded-3xl opacity-10 blur-2xl"
              style={{ background: "hsl(var(--primary))", transform: "scale(0.85) translateY(12px)" }}
            />
            <img
              src={heroImg}
              alt="Dra. Talita Melo - Ginecologista especialista em fertilidade"
              className="relative w-full max-w-[22rem] object-contain mx-auto"
              width={800}
              height={1024}
            />
          </div>

          <div className="w-full max-w-[22rem] animate-fade-up-delay-3">
            <div className="flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-[0_2px_16px_rgba(194,24,91,0.1)] border border-border text-left">
              <div className="w-1 h-10 rounded-full bg-primary" />
              <div>
                <p className="text-lg font-semibold text-foreground" style={{ fontFamily: 'Lora, Georgia, serif' }}>
                  Dra. Talita Melo
                </p>
                <p className="text-sm text-muted-foreground leading-snug mt-0.5">
                  Ginecologista referência em Fertilidade · Co-fundadora do Programa Conceber
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 opacity-40" style={{ background: "hsl(var(--primary))" }} />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Medicina · Nutrição · Fé
              </p>
            </div>

            <h1 className="text-[2.6rem] lg:text-[3.2rem] font-semibold leading-[1.2] text-foreground animate-fade-up" style={{ fontFamily: 'Lora, Georgia, serif' }}>
              Muitas mulheres engravidaram depois do{" "}
              <em className="text-primary italic">Mounjaro</em>.
              <br />
              Mas nem todas podem usar essa medicação.
              <br />
              <span className="text-primary">Existe outro caminho.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground animate-fade-up-delay-1">
              O protocolo da Dra. Talita Melo que equilibra a{" "}
              <strong className="text-foreground font-semibold">resistência insulínica</strong>{" "}
              e melhora a fertilidade — sem remédio, em 7 dias.
            </p>

            <div className="mt-8 max-w-md animate-fade-up-delay-2">
              <HighlightCard />
            </div>

            <div className="mt-7 animate-fade-up-delay-3">
              <a href="#oferta" className="btn-cta text-base">
                Quero garantir minha vaga
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center animate-fade-up">
            <div className="relative w-full max-w-[34rem]">
              <div
                className="absolute inset-0 rounded-3xl opacity-10 blur-3xl"
                style={{ background: "hsl(var(--primary))", transform: "scale(0.8) translateY(16px)" }}
              />
              <img
                src={heroImg}
                alt="Dra. Talita Melo - Ginecologista especialista em fertilidade"
                className="relative w-full object-contain"
                width={800}
                height={1024}
              />
            </div>
            <div className="w-full max-w-[34rem] mt-1 animate-fade-up-delay-3">
              <div className="flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-[0_2px_16px_rgba(194,24,91,0.1)] border border-border">
                <div className="w-1 h-10 rounded-full bg-primary" />
                <div>
                  <p className="text-lg font-semibold text-foreground" style={{ fontFamily: 'Lora, Georgia, serif' }}>
                    Dra. Talita Melo
                  </p>
                  <p className="text-sm text-muted-foreground leading-snug mt-0.5">
                    Ginecologista referência em Fertilidade · Co-fundadora do Programa Conceber
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroLo3;
