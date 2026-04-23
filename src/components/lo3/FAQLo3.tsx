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
      "Sim. O jejum do evento é específico e orientado pela Dra. Talita — bem diferente de restrições severas. Você vai aprender exatamente como e quando fazer, com segurança clínica.",
  },
  {
    question: "Funciona para quem tem SOP ou resistência insulínica?",
    answer:
      "Especialmente para essas mulheres. O protocolo foi desenvolvido justamente para equilibrar os desequilíbrios metabólicos que a resistência insulínica provoca — o mesmo que o Mounjaro faz, mas de forma natural.",
  },
  {
    question: "E se eu não gostar ou achar que não é pra mim?",
    answer:
      "Você tem garantia de 7 dias. Mas o que mais ouvimos das alunas é: \"por que não fiz isso antes?\"",
  },
];

const FAQLo3 = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[22px] md:text-4xl font-serif font-semibold text-foreground">
              Perguntas Frequentes
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl bg-card border border-border px-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                <AccordionTrigger className="text-left font-body text-base font-medium text-foreground py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] font-body text-muted-foreground leading-relaxed pb-5">
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

export default FAQLo3;