import { Stethoscope, Leaf, Heart } from "lucide-react";
import talitaTercoImg from "@/assets/talita-terco.webp";
import meditationImg from "@/assets/meditation.jpg";
import nutritionImg from "@/assets/nutrition-flat.jpg";
import onlineClassImg from "@/assets/online-class.jpg";

const pillars = [
  {
    icon: Stethoscope,
    title: "Medicina",
    image: onlineClassImg,
    description:
      "A Dra. Talita vai te guiar por um processo de jejum específico para equilibrar a resistência insulínica — o mesmo mecanismo do Mounjaro, sem injeção e com embasamento clínico.",
  },
  {
    icon: Leaf,
    title: "Nutrição",
    image: nutritionImg,
    description:
      "Após o jejum, um plano alimentar exclusivo com alimentos e vitaminas essenciais para melhorar sua fertilidade, ovulação e qualidade ovariana.",
  },
  {
    icon: Heart,
    title: "Fé",
    image: meditationImg,
    description:
      "Todos os dias, meditação da Palavra de Deus com passagens bíblicas sobre fertilidade. Porque é Deus quem decide o momento da gestação.",
  },
];

const ComoFuncionaLo3 = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-10 items-center mb-12 md:mb-16">
          <div className="flex justify-center order-2 md:order-1">
            <img
              src={talitaTercoImg}
              alt="Dra. Talita Melo em oração"
              className="w-full max-w-sm object-cover rounded-2xl"
              loading="lazy"
              width={640}
              height={800}
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-[22px] md:text-4xl font-serif font-semibold text-foreground leading-tight">
              Jejum e Oração para Engravidar:{" "}
              <span className="text-primary">7 dias para equilibrar sua resistência insulínica</span>{" "}
              sem medicação
            </h2>
            <p className="mt-5 text-[15px] md:text-lg font-body text-muted-foreground leading-relaxed">
              Uma rotina que une o que a medicina mais atual comprovou sobre fertilidade com o que a
              fé sustenta em cada mulher.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-xl bg-card overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
                    <p.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-serif font-bold uppercase tracking-wide text-foreground">
                    {p.title}
                  </h3>
                </div>
                <p className="text-[15px] font-body text-muted-foreground leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComoFuncionaLo3;