import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O evento fica gravado?",
    answer:
      "Sim, o conteúdo ficará disponível apenas durante a semana do evento. Após esse período, não será mais possível acessar as aulas.",
  },
  {
    question: "Para quem é o jejum?",
    answer:
      "O Jejum e Oração para Engravidar é indicado para mulheres e casais que desejam se preparar para a gestação, cuidando do corpo, do emocional e da espiritualidade ✨",
  },
  {
    question: "Não tenho ciclo, posso participar?",
    answer:
      "Sim! Mesmo sem ciclo, você pode participar. O jejum atua na redução da inflamação, no equilíbrio hormonal e na organização do organismo como um todo.",
  },
  {
    question: "É seguro fazer jejum enquanto tento engravidar?",
    answer:
      "Sim, é seguro, desde que você siga exatamente as orientações do programa e não estenda o período do cardápio. O processo foi estruturado para ser feito com segurança e equilíbrio.",
  },
  {
    question: "Tenho diagnóstico, posso participar?",
    answer:
      "Sim! Ter um diagnóstico não impede sua participação. Pelo contrário, o jejum pode ajudar na preparação do corpo, reduzindo inflamação e melhorando o ambiente hormonal. Muitas mulheres com SOP, endometriose e outros quadros participam e se beneficiam.",
  },
  {
    question: "Por onde o evento acontece?",
    answer:
      "O evento ocorre online, através do YouTube. Após a compra, você receberá no seu e-mail todas as orientações, incluindo o link do grupo exclusivo de WhatsApp, que é por onde serão enviados os links das aulas e materiais de apoio.",
  },
  {
    question: "Em quais horários acontecem as aulas?",
    answer:
      "As aulas acontecem às 7h30 de segunda a sexta-feira e às 9h no sábado e domingo ✨",
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