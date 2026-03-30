import { UtensilsCrossed, Sparkles, GraduationCap, PlayCircle } from "lucide-react";

const deliverables = [
  {
    icon: UtensilsCrossed,
    title: "Plano Alimentar",
    description:
      "Para seguir durante os 7 dias de Jejum, com horários, ingredientes, opções de cardápio e de substituições.",
    image: "https://grupoconceber.com/wp-content/uploads/2025/12/Mask-group-12.webp",
  },
  {
    icon: Sparkles,
    title: "Meditações Guiadas",
    description: "Orações matinais para manter inabalável a fé na sua gravidez.",
    image: "https://grupoconceber.com/wp-content/uploads/2025/12/Mask-group-13.webp",
  },
  {
    icon: GraduationCap,
    title: "7 aulas sobre conteúdos de fertilidade",
    description:
      "Conteúdos com tudo que a medicina já comprovou ajudar na busca por uma gravidez rápida e saudável.",
    image: "https://grupoconceber.com/wp-content/uploads/2025/12/Mask-group-14.webp",
  },
  {
    icon: PlayCircle,
    title: "Gravações liberadas",
    description:
      "Todas as aulas estarão disponíveis para consulta enquanto durar o jejum.",
    image: "https://grupoconceber.com/wp-content/uploads/2025/12/Mask-group-15.webp",
  },
];

const OQueVaiReceber = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="section-container">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-sm font-body font-semibold uppercase tracking-widest text-sage mb-3">
            Seu programa completo
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
            É isso que você vai receber
          </h2>
        </div>

        <div className="space-y-8">
          {deliverables.map((item, i) => (
            <div
              key={item.title}
              className={`card-premium grid md:grid-cols-2 gap-8 items-center overflow-hidden ${
                i % 2 === 1 ? "md:direction-rtl" : ""
              }`}
            >
              <div className={`${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-sage" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-semibold text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="text-base font-body text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className={`${i % 2 === 1 ? "md:order-1" : ""}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded-xl w-full aspect-[4/3] object-cover"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#oferta" className="btn-cta">
            Quero me preparar para engravidar
          </a>
        </div>
      </div>
    </section>
  );
};

export default OQueVaiReceber;
