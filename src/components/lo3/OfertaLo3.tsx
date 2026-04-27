import { Check, ShieldCheck } from "lucide-react";
import { useState } from "react";
import FormModal from "@/components/FormModal";

const items = [
  "Jejum orientado para equilibrar a resistência insulínica",
  "Plano alimentar para a fertilidade",
  "Encontros noturnos ao vivo com a Dra. Talita",
  "Meditações diárias com passagens bíblicas",
  "Devocional exclusivo",
  "Área para acessar todos os materiais",
];

const OfertaLo3 = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="oferta" className="py-20 md:py-28 bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Sua oportunidade
          </p>
          <h2 className="text-[22px] md:text-4xl font-semibold text-foreground" style={{ fontFamily: 'Lora, Georgia, serif' }}>
            Participe dos 7 dias de Jejum e Oração e receba:
          </h2>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl bg-background p-8 md:p-10 shadow-[0_8px_40px_rgba(194,24,91,0.12)] border border-border">
            <ul className="space-y-4 mb-8">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 shadow-[0_2px_8px_rgba(194,24,91,0.3)]">
                    <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                  </div>
                  <span className="text-[15px] text-foreground leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <div className="text-center border-t border-border pt-8">
              <p className="text-sm text-muted-foreground line-through">De R$ 197,00</p>
              <p className="text-sm text-muted-foreground mt-1">por apenas</p>
              <p
                className="text-[44px] md:text-[52px] leading-none font-semibold text-primary mt-2"
                style={{ fontFamily: 'Lora, Georgia, serif' }}
              >
                R$ 57<span className="text-2xl">,00</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">ou 8x de R$ 7,88</p>

              <div className="mt-8">
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn-cta w-full text-base"
                  style={{ minHeight: "52px" }}
                >
                  Quero garantir o meu ingresso
                </button>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Garantia de 7 dias, conforme a lei.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};

export default OfertaLo3;
