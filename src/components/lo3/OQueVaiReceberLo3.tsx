import { UtensilsCrossed, Salad, Video, Sparkles, PlayCircle } from "lucide-react";
import receber1 from "@/assets/receber-1.webp";
import receber2 from "@/assets/receber-2.webp";
import receber3 from "@/assets/receber-3.webp";

const items = [
  {
    icon: UtensilsCrossed,
    title: "Jejum Orientado para Fertilidade",
    description:
      "Um processo guiado pela Dra. Talita para equilibrar sua resistência insulínica — simples, seguro e específico para quem quer engravidar.",
    image: null,
  },
  {
    icon: Salad,
    title: "Plano Alimentar para Fertilidade",
    description:
      "Alimentos e vitaminas essenciais para melhorar ovulação, qualidade dos óvulos e equilíbrio hormonal. Com opções de cardápio e substituições para os 7 dias.",
    image: receber1,
  },
  {
    icon: Video,
    title: "Encontros Noturnos ao Vivo com a Dra. Talita",
    description:
      "Todo dia à noite, um encontro ao vivo para tirar suas dúvidas e receber as novidades mais atuais da medicina em fertilidade para 2026.",
    image: receber3,
  },
  {
    icon: Sparkles,
    title: "Meditações Diárias",
    description:
      "Passagens bíblicas sobre fertilidade para meditar cada manhã e sustentar espiritualmente cada etapa da jornada.",
    image: receber2,
  },
  {
    icon: PlayCircle,
    title: "Gravações Liberadas",
    description: "Todas as aulas disponíveis para rever durante os 7 dias do evento.",
    image: null,
  },
];

const OQueVaiReceberLo3 = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="section-container">
        <div className="text-center mb-12">
          <p className="text-xs font-body font-bold uppercase tracking-[0.18em] text-primary mb-3">
            Seu programa completo
          </p>
          <h2 className="text-[22px] md:text-4xl font-serif font-semibold text-foreground">
            É isso que você vai receber
          </h2>
        </div>

        <div className="space-y-6">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="rounded-xl bg-background p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] grid md:grid-cols-2 gap-6 items-center"
            >
              {item.image ? (
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rounded-xl w-full aspect-[4/3] object-cover"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </div>
              ) : null}
              <div className={`${item.image && i % 2 === 1 ? "md:order-1" : ""} ${!item.image ? "md:col-span-2" : ""}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-serif font-semibold text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[15px] font-body text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OQueVaiReceberLo3;