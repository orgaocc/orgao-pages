import heroImg from "@/assets/hero-doctor.webp";
import logoImg from "@/assets/logo-jejum.webp";

const HeroLo3 = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-20 bg-background">
      <div className="section-container relative z-10">
        {/* Mobile */}
        <div className="flex flex-col items-center text-center md:hidden">
          <div className="mb-6">
            <img src={logoImg} alt="Jejum para Engravidar" className="h-10 w-auto mx-auto" />
          </div>

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

          <div className="mt-7 w-full animate-fade-up-delay-2">
            <a href="#oferta" className="btn-cta w-full">
              Quero garantir minha vaga
            </a>
          </div>

          <p className="mt-4 text-xs font-body text-muted-foreground animate-fade-up-delay-2">
            Encontros online · <strong>27 de Abril a 3 de Maio</strong> · Por apenas <strong>R$57</strong>
          </p>

          <div className="mt-8 animate-fade-up-delay-2">
            <img
              src={heroImg}
              alt="Dra. Talita Melo - Ginecologista especialista em fertilidade"
              className="w-full max-w-[20rem] object-contain mx-auto"
              width={800}
              height={1024}
            />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-10">
              <img src={logoImg} alt="Jejum para Engravidar" className="h-12 w-auto" />
            </div>

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

            <div className="mt-8 animate-fade-up-delay-2">
              <a href="#oferta" className="btn-cta text-lg">
                Quero garantir minha vaga
              </a>
            </div>

            <p className="mt-5 text-sm font-body text-muted-foreground animate-fade-up-delay-3">
              Encontros online · <strong>27 de Abril a 3 de Maio</strong> · Por apenas <strong>R$57</strong>
            </p>
          </div>

          <div className="flex justify-center animate-fade-up">
            <img
              src={heroImg}
              alt="Dra. Talita Melo - Ginecologista especialista em fertilidade"
              className="w-full max-w-[32rem] object-contain"
              width={800}
              height={1024}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroLo3;