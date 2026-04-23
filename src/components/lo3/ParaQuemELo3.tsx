import { Check } from "lucide-react";
import paraQuemImg from "@/assets/para-quem-e.webp";

const points = [
  "Ouviu falar do Mounjaro, mas não pode, não quer ou não tem indicação para usar a medicação",
  "Suspeita ou já sabe que tem resistência insulínica ou SOP — mas nunca teve um protocolo prático para isso",
  "Tentou de tudo e ainda não entendeu o que está bloqueando a sua gestação",
  "Quer preparar o corpo de forma natural, com orientação médica e sem depender de remédio",
  "Sabe que fé e medicina precisam caminhar juntas — e quer viver isso na prática",
];

const ParaQuemELo3 = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-[22px] md:text-4xl font-serif font-semibold text-foreground leading-tight">
              O Jejum e Oração foi criado especialmente para{" "}
              <em className="text-primary not-italic italic">você</em> que:
            </h2>
            <ul className="mt-8 space-y-5">
              {points.map((point, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                  </div>
                  <p className="text-[15px] font-body text-muted-foreground leading-relaxed">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a href="#oferta" className="btn-cta w-full md:w-auto text-center">
                Quero me preparar para engravidar
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={paraQuemImg}
              alt="Casal esperando um bebê"
              className="w-full max-w-md object-cover rounded-2xl"
              loading="lazy"
              width={800}
              height={600}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParaQuemELo3;