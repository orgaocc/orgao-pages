import { useMemo } from "react";
import heroImg from "@/assets/hero-doctor.webp";
import logoImg from "@/assets/logo-jejum.webp";

type Variation = {
  headline: React.ReactNode;
  subheadline: React.ReactNode;
};

const VARIATIONS: Variation[] = [
  // 0 — Original (control)
  {
    headline: (
      <>
        Para estar com seu filho no colo este ano, você precisa{" "}
        <em className="text-sage not-italic">preparar seu corpo e o seu espírito</em> agora.
      </>
    ),
    subheadline:
      "7 dias de jejum, orientação alimentar e atualizações da medicina para quem quer engravidar de forma natural.",
  },
  // 1
  {
    headline: (
      <>
        Chega de tentativas aleatórias de <strong>engravidar</strong>: prepare o berço que o{" "}
        <strong>seu futuro filho</strong> vai ocupar.
      </>
    ),
    subheadline: (
      <>
        Uma jornada de 7 dias unindo <u>jejum estratégico</u>, <u>plano alimentar</u> funcional e{" "}
        <u>medicina</u> para destravar sua fertilidade natural.
      </>
    ),
  },
  // 2
  {
    headline: (
      <>
        O caminho para <strong>engravidar</strong> começa no alinhamento entre a sua{" "}
        <strong>fé</strong> e a sua <strong>biologia</strong>.
      </>
    ),
    subheadline: (
      <>
        Receba <u>7 dias de direcionamento</u> clínico, <u>cardápio para fertilidade</u> e um{" "}
        <u>devocional exclusivo</u> para preparar seu corpo e mente.
      </>
    ),
  },
  // 3
  {
    headline: (
      <>
        Você não precisa carregar o <strong>peso da espera</strong> sozinha; prepare o seu corpo para{" "}
        <strong>engravidar</strong>.
      </>
    ),
    subheadline: (
      <>
        Participe de <u>7 dias de imersão</u> com <u>aulas</u> sobre fertilidade,{" "}
        <u>meditações</u> guiadas e <u>orientações médicas</u> de quem entende sua jornada.
      </>
    ),
  },
  // 4
  {
    headline: (
      <>
        Transforme a <strong>ansiedade da espera</strong> em um caminho claro de como{" "}
        <strong>engravidar</strong>.
      </>
    ),
    subheadline: (
      <>
        Protocolo de <u>7 dias com jejum</u>, <u>nutrição</u> avançada e{" "}
        <u>atualizações da medicina</u> para mulheres que buscam engravidar naturalmente.
      </>
    ),
  },
  // 5
  {
    headline: (
      <>
        Junte-se a <strong>mais de 1.700 mulheres</strong> que uniram fé e medicina para{" "}
        <strong>engravidar</strong>.
      </>
    ),
    subheadline: (
      <>
        Tenha acesso a <u>7 aulas exclusivas</u>, <u>plano alimentar</u> detalhado e{" "}
        <u>apoio espiritual</u> para preparar seu organismo para o próximo ciclo.
      </>
    ),
  },
  // 6
  {
    headline: (
      <>
        Não passe <strong>mais um mês</strong> sem dar ao seu corpo o que ele realmente precisa para{" "}
        <strong>engravidar</strong>.
      </>
    ),
    subheadline: (
      <>
        <u>7 dias de acompanhamento</u> com foco em <u>nutrição</u> fértil, <u>jejum</u> guiado e
        os <u>fundamentos médicos</u> para potencializar suas chances.
      </>
    ),
  },
  // 7
  {
    headline: (
      <>
        Fortaleça sua mente e espírito e prepare o seu corpo para <strong>engravidar</strong> ainda{" "}
        <strong>este ano</strong>.
      </>
    ),
    subheadline: (
      <>
        Uma semana com <u>devocional</u> exclusivo, <u>meditações</u>, <u>plano alimentar</u> e
        conteúdo para assistir e revisar.
      </>
    ),
  },
  // 8
  {
    headline: (
      <>
        Recupere o seu corpo e o seu espírito das várias tentativas de <strong>engravidar</strong> e
        comece a tentar do jeito certo.
      </>
    ),
    subheadline: (
      <>
        Conheça o <u>método de 7 dias</u> que combina jejum assistido, <u>medicina</u> integrativa e{" "}
        <u>suporte emocional</u> para futuras mães.
      </>
    ),
  },
];

function getVariantIndex(): number {
  const stored = sessionStorage.getItem("headline_variant");
  if (stored !== null) {
    const n = parseInt(stored, 10);
    if (!isNaN(n) && n >= 0 && n < VARIATIONS.length) return n;
  }
  const idx = Math.floor(Math.random() * VARIATIONS.length);
  sessionStorage.setItem("headline_variant", String(idx));
  return idx;
}

const HeroSection = () => {
  const variantIdx = useMemo(() => getVariantIndex(), []);
  const { headline, subheadline } = VARIATIONS[variantIdx];

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
            {headline}
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
              {headline}
            </h1>

            <p className="mt-6 text-xl font-body text-muted-foreground leading-relaxed animate-fade-up-delay-1">
              {subheadline}
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
