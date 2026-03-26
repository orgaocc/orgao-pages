import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "É seguro fazer jejum enquanto tento engravidar?",
    answer:
      "Durante o período de jejum, você terá acesso a uma área com todas as meditações, aulas e materiais. Se você não conseguir participar de alguma atividade no horário marcado, pode ver a gravação em outro momento.",
  },
  {
    question: "Funciona para quem tem ciclo irregular ou problemas hormonais?",
    answer:
      "Sim. Justamente por unir conhecimento clínico e espiritual, o evento ajuda a identificar padrões e travas que muitas vezes passam despercebidos. As aulas e os materiais complementares foram pensados para te ajudar a dar um passo concreto na sua preparação física, emocional e espiritual para a gravidez.",
  },
  {
    question: "E se eu não conseguir acompanhar tudo durante os 7 dias?",
    answer:
      "O ideal é participar durante a semana do jejum, mas todo o conteúdo ficará disponível para você assistir até o dia 14/04.",
  },
  {
    question: "E se eu não gostar ou achar que não é pra mim?",
    answer:
      "Acreditamos tanto no que preparamos que temos certeza de que esse evento será um divisor de águas na sua vida. Mas, se ainda assim você sentir que não é o momento, basta seguir as orientações de reembolso dentro do prazo legal e devolveremos seu investimento sem complicações.",
  },
];

const FAQ = () => {
  return (
    <section className="py-16 md:py-24 section-sage">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
              Perguntas Frequentes
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-2xl bg-background border border-border px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-body text-base font-medium text-foreground py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base font-body text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
