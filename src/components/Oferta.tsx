import { Check, ShieldCheck } from "lucide-react";

const items = [
  "Plano alimentar para a fertilidade",
  "7 encontros com meditações e conteúdo médico",
  "Área para acessar os materiais",
  "Devocional Exclusivo",
];

const Oferta = () => {
  return (
    <section id="oferta" className="py-16 md:py-24 section-blush">
      <div className="section-container">
        <div className="text-center mb-10">
          <p className="text-sm font-body font-semibold uppercase tracking-widest text-sage mb-3">
            Sua oportunidade
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
            Participe dos 7 dias de Jejum e Oração e receba:
          </h2>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="rounded-3xl bg-background p-8 md:p-10 shadow-xl border border-border">
            <ul className="space-y-4 mb-8">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sage flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-base font-body text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="text-center border-t border-border pt-8">
              <p className="text-base font-body text-muted-foreground line-through">
                De R$ 197,00
              </p>
              <p className="text-sm font-body text-muted-foreground mt-1">por apenas</p>
              <p className="text-5xl md:text-6xl font-serif font-bold text-sage mt-2">
                R$ 57<span className="text-2xl">,00</span>
              </p>
              <p className="text-sm font-body text-muted-foreground mt-2">
                ou 4x de R$ 7,88
              </p>

              <div className="mt-8">
                <a href="#" className="btn-cta w-full text-lg block text-center">
                  Quero garantir o meu ingresso
                </a>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm font-body text-taupe">
                <ShieldCheck className="w-4 h-4" />
                <span>Garantia de 7 dias, conforme a lei.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Oferta;
