import heroImg from "@/assets/hero-doctor.webp";
import { Calendar } from "lucide-react";
import { useLaunchConfig } from "@/hooks/useLaunchConfig";
import { formatDateRangeTwoLines } from "@/lib/dateRange";

const HighlightCard = () => {
  const { config } = useLaunchConfig();
  const [line1, line2] = formatDateRangeTwoLines(config.week_start, config.week_end);
  return (
  <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
    <div className="flex flex-row divide-x divide-border">
      <div className="flex items-center gap-3 px-4 sm:px-5 py-4 flex-1 justify-center sm:justify-start">
        <Calendar className="w-5 h-5 text-primary shrink-0" aria-hidden />
        <div className="text-left">
          <p className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Datas
          </p>
          <p className="font-body text-base md:text-lg font-semibold text-foreground leading-tight">
            {line1}{line2 && (<><br />{line2}</>)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 sm:px-5 py-4 flex-1 justify-center sm:justify-start">
        <div className="text-left">
          <p className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Investimento
          </p>
          <p className="font-body text-foreground leading-tight">
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
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-20 bg-background">
      <div className="section-container relative z-10">
        {/* Mobile */}
        <div className="flex flex-col items-center text-center md:hidden">
          <p className="text-xs font-body font-bold uppercase tracking-[0.18em] text-primary mb-4">
            Medicina · Nutrição · Fé
          </p>

          <h1 className="text-[28px] leading-tight font-serif font-semibold text-foreground animate-fade-up">
            Muitas mulheres engravidaram depois do{" "}
            <em className="text-primary not-italic italic font-semibold">Mounjaro</em>.
            <br />
            Mas nem todas podem usar essa medicação.
            <br />
            <span className="text-primary">Existe outro caminho.</span>
          </h1>

          <p className="mt-5 text-[15px] font-body text-muted-foreground leading-relaxed animate-fade-up-delay-1">
            O protocolo da Dra. Talita Melo que equilibra a resistência insulínica e melhora a fertilidade —
            sem remédio, em 7 dias.
          </p>

          <div className="mt-7 w-full animate-fade-up-delay-1">
            <HighlightCard />
          </div>

          <div className="mt-5 w-full animate-fade-up-delay-2">
            <a href="#oferta" className="btn-cta w-full">
              Quero garantir minha vaga
            </a>
          </div>

          <div className="mt-8 animate-fade-up-delay-2">
            <img
              src={heroImg}
              alt="Dra. Talita Melo - Ginecologista especialista em fertilidade"
              className="w-full max-w-[20rem] object-contain mx-auto"
              width={800}
              height={1024}
            />
          </div>

          <div className="w-full max-w-[20rem] animate-fade-up-delay-3">
            <div className="flex items-center gap-4 rounded-2xl bg-card px-6 py-4 shadow-sm border border-border text-left">
              <div className="w-1 h-10 rounded-full bg-primary" />
              <div>
                <p className="font-serif text-lg font-semibold text-foreground">
                  Dra. Talita Melo
                </p>
                <p className="text-sm font-body text-muted-foreground">
                  Ginecologista referência em Fertilidade · Co-fundadora do Programa Conceber
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-body font-bold uppercase tracking-[0.18em] text-primary mb-5">
              Medicina · Nutrição · Fé
            </p>

            <h1 className="text-4xl lg:text-5xl font-serif font-semibold leading-[1.15] text-foreground animate-fade-up">
              Muitas mulheres engravidaram depois do{" "}
              <em className="text-primary not-italic italic">Mounjaro</em>.
              <br />
              Mas nem todas podem usar essa medicação.
              <br />
              <span className="text-primary">Existe outro caminho.</span>
            </h1>

            <p className="mt-6 text-lg font-body text-muted-foreground leading-relaxed animate-fade-up-delay-1">
              O protocolo da Dra. Talita Melo que equilibra a <strong>resistência insulínica</strong>{" "}
              e melhora a fertilidade — sem remédio, em 7 dias.
            </p>

            <div className="mt-8 max-w-md animate-fade-up-delay-2">
              <HighlightCard />
            </div>

            <div className="mt-6 animate-fade-up-delay-3">
              <a href="#oferta" className="btn-cta text-lg">
                Quero garantir minha vaga
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center animate-fade-up">
            <img
              src={heroImg}
              alt="Dra. Talita Melo - Ginecologista especialista em fertilidade"
              className="w-full max-w-[32rem] object-contain"
              width={800}
              height={1024}
            />
            <div className="w-full max-w-[32rem] animate-fade-up-delay-3">
              <div className="flex items-center gap-4 rounded-2xl bg-card px-6 py-4 shadow-sm border border-border">
                <div className="w-1 h-10 rounded-full bg-primary" />
                <div>
                  <p className="font-serif text-lg font-semibold text-foreground">
                    Dra. Talita Melo
                  </p>
                  <p className="text-sm font-body text-muted-foreground">
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