import heroImg from "@/assets/hero-doctor.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 gradient-soft" />
      <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-blush opacity-40 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-sage-light opacity-30 blur-3xl" />

      <div className="section-container relative z-10">
        {/* Logo area */}
        <div className="mb-8 md:mb-12">
          <span className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Jejum<span className="text-sage italic"> para </span>Engravidar
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left - Copy */}
          <div className="order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold leading-tight text-foreground animate-fade-up">
              Para estar com seu filho no colo este ano, você precisa{" "}
              <em className="text-sage not-italic">preparar seu corpo e o seu espírito</em> agora.
            </h1>

            <p className="mt-6 text-lg md:text-xl font-body text-muted-foreground leading-relaxed animate-fade-up-delay-1">
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

          {/* Right - Image */}
          <div className="order-1 md:order-2 flex justify-center animate-fade-up">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-champagne opacity-50 blur-xl" />
              <img
                src={heroImg}
                alt="Dra. Talita Melo - Ginecologista especialista em fertilidade"
                className="relative rounded-3xl w-full max-w-md object-cover shadow-xl"
                width={800}
                height={1024}
              />
            </div>
          </div>
        </div>

        {/* Authority badge */}
        <div className="mt-12 md:mt-16 animate-fade-up-delay-3">
          <div className="inline-flex items-center gap-4 rounded-2xl bg-cream px-6 py-4 shadow-sm border border-border">
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
    </section>
  );
};

export default HeroSection;
