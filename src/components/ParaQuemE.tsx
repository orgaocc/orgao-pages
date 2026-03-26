import { Check } from "lucide-react";

const points = [
  "Tentou quase de tudo, mas ainda não jejuou com acompanhamento alimentar adequado.",
  "Sabe que precisa alinhar corpo e espírito para engravidar, mas ainda não recebeu ajuda médica pra isso.",
  "Quer se fortalecer durante o tratamento para engravidar, mas não quer fazer isso sozinha.",
  "Busca acolhimento emocional, cuidado com o corpo e fortalecimento para a alma.",
];

const ParaQuemE = () => {
  return (
    <section className="py-16 md:py-24 section-sage">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground leading-tight">
              O Jejum e Oração foi especialmente criado para{" "}
              <em className="text-sage not-italic">você</em> que:
            </h2>
            <ul className="mt-8 space-y-5">
              {points.map((point, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-sage flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <p className="text-base font-body text-muted-foreground leading-relaxed">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <img
              src="https://grupoconceber.com/wp-content/uploads/2026/01/Mask-group-28-1.webp"
              alt="Casal abraçado esperando um bebê"
              className="rounded-3xl w-full max-w-md object-cover shadow-lg"
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

export default ParaQuemE;
