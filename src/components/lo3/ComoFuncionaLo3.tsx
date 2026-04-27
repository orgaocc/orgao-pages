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
    <section className="py-20 md:py-28 bg-background">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-14 md:mb-20">
          <div className="flex justify-center order-2 md:order-1">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-[0.07] blur-2xl"
                style={{ background: "hsl(var(--primary))" }}
              />
              <img
                src={talitaTercoImg}
                alt="Dra. Talita Melo em oração"
                className="relative w-full max-w-sm object-cover rounded-2xl shadow-[0_8px_32px_rgba(194,24,91,0.12)]"
                loading="lazy"
                width={640}
                height={800}
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-[22px] md:text-4xl font-semibold text-foreground leading-tight" style={{ fontFamily: 'Lora, Georgia, serif' }}>
              Jejum e Oração para Engravidar:{" "}
              <span className="text-primary">7 dias para equilibrar sua resistência insulínica</span>{" "}
              sem medicação
            </h2>
            <p className="mt-5 text-[15px] md:text-lg text-muted-foreground leading-relaxed">
              Uma rotina que une o que a medicina mais atual comprovou sobre fertilidade com o que a
              fé sustenta em cada mulher.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl bg-white overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] border border-border transition-all duration-300 hover:shadow-[0_8px_32px_rgba(194,24,91,0.12)] hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "hsl(var(--sage-light))" }}
                  >
                    <p.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-wide text-foreground" style={{ fontFamily: 'Lora, Georgia, serif' }}>
                    {p.title}
                  </h3>
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
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
