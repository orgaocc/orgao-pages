import heroImg from "@/assets/hero-doctor.webp";
import logoImg from "@/assets/logo-jejum.webp";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 gradient-soft" />
      <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-blush opacity-40 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-sage-light opacity-30 blur-3xl" />

      <div className="section-container relative z-10">
        {/* Mobile / Tablet: stacked layout */}
        <div className="flex flex-col items-center text-center md:hidden">
          <div className="mb-6">
            <img src={logoImg} alt="Jejum para Engravidar" className="h-10 w-auto mx-auto" />
          </div>

          <h1 className="text-3xl font-serif font-semibold leading-tight text-foreground animate-fade-up">
            Para estar com seu filho no colo este ano, você precisa{" "}
            <em className="text-sage not-italic">preparar seu corpo e o seu espírito</em> agora.
          </h1>

          <div className="mt-6 animate-fade-up-delay-1">
            <a href="#oferta" className="btn-cta text-lg">
              Garantir meu ingresso
            </a>
          </div>

          <p className="mt-4 text-sm font-body text-taupe animate-fade-up-delay-2">
            Encontros online e ao vivo, de <strong>06 a 12 de Abril</strong>, por apenas <strong>R$57</strong>
          </p>

          <div className="mt-8 animate-fade-up-delay-2">
            <img
              src={heroImg}
              alt="Dra. Talita Melo - Ginecologista especialista em fertilidade"
              className="w-full max-w-[20rem] object-contain object-bottom drop-shadow-2xl mx-auto"
              width={800}
              height={1024}
            />
          </div>

          <div className="w-full max-w-[20rem] animate-fade-up-delay-3">
            <div className="flex items-center gap-4 rounded-2xl bg-cream px-6 py-4 shadow-sm border border-border text-left">
              <div className="w-1 h-10 rounded-full bg-sage" />
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

        {/* Desktop: 2-column layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 items-end">
          <div>
            <div className="mb-12">
              <img src={logoImg} alt="Jejum para Engravidar" className="h-12 w-auto" />
            </div>

            <h1 className="text-4xl lg:text-5xl font-serif font-semibold leading-tight text-foreground animate-fade-up">
              Para estar com seu filho no colo este ano, você precisa{" "}
              <em className="text-sage not-italic">preparar seu corpo e o seu espírito</em> agora.
            </h1>

            <p className="mt-6 text-xl font-body text-muted-foreground leading-relaxed animate-fade-up-delay-1">
              7 dias de jejum, orientação alimentar e atualizações da medicina para quem quer engravidar de forma natural.
            </p>

            <div className="mt-8 animate-fade-up-delay-2">
              <a href="#oferta" className="btn-cta text-lg">
                Garantir meu ingresso
              </a>
            </div>

            <p className="mt-5 text-sm font-body text-taupe animate-fade-up-delay-3">
              Encontros online e ao vivo, de <strong>06 a 12 de Abril</strong>, por apenas <strong>R$57</strong>
            </p>
          </div>

          <div className="flex flex-col items-end self-end animate-fade-up">
            <img
              src={heroImg}
              alt="Dra. Talita Melo - Ginecologista especialista em fertilidade"
              className="w-full max-w-[32rem] object-contain object-bottom drop-shadow-2xl"
              width={800}
              height={1024}
            />
            <div className="w-full max-w-[32rem] animate-fade-up-delay-3">
              <div className="flex items-center gap-4 rounded-2xl bg-cream px-6 py-4 shadow-sm border border-border">
                <div className="w-1 h-10 rounded-full bg-sage" />
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

export default HeroSection;
