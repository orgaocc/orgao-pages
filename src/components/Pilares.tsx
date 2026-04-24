import { Heart, Leaf, Stethoscope } from "lucide-react";
import meditationImg from "@/assets/pilar-fe.webp";
import nutritionImg from "@/assets/pilar-nutricao.webp";
import onlineClassImg from "@/assets/pilar-medicina.webp";

const pillars = [
  {
    icon: Heart,
    title: "Fé",
    description: "Comece cada dia com uma poderosa meditação para renovar suas esperanças na gravidez.",
    image: meditationImg,
  },
  {
    icon: Leaf,
    title: "Nutrição",
    description: "Aplique um cardápio exclusivo para as janelas de alimentação de quem quer engravidar.",
    image: nutritionImg,
  },
  {
    icon: Stethoscope,
    title: "Medicina",
    description: "Conteúdo com atualizações da medicina sobre o que você precisa fazer para engravidar.",
    image: onlineClassImg,
  },
];

const Pilares = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="card-premium group overflow-hidden"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="aspect-[4/3] -mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-6 overflow-hidden rounded-t-2xl">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
                  <pillar.icon className="w-5 h-5 text-sage" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground uppercase tracking-wide">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-base font-body text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pilares;
