import devocionalImg from "@/assets/devocional-mockup.webp";

const DevocionalLo3 = () => {
  return (
    <section className="py-16 md:py-24 bg-card relative overflow-hidden">
      <div className="section-container relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-3xl"
                style={{ background: "hsl(var(--gold) / 0.15)" }}
              />
              <img
                src={devocionalImg}
                alt="Devocional Exclusivo FÉrtilidade"
                className="relative rounded-2xl w-full max-w-sm shadow-xl"
                loading="lazy"
                width={800}
                height={600}
              />
            </div>
          </div>
          <div>
            <p
              className="text-xs font-body font-bold uppercase tracking-[0.18em] mb-3"
              style={{ color: "hsl(var(--gold))" }}
            >
              Devocional Exclusivo
            </p>
            <h2 className="text-[22px] md:text-4xl font-serif font-semibold text-foreground leading-tight">
              Faça as orações com um Devocional Exclusivo
            </h2>
            <p className="mt-5 text-[15px] md:text-lg font-body text-muted-foreground leading-relaxed">
              Inspirado nos ensinamentos da Bíblia Sagrada e no livro{" "}
              <strong className="text-foreground">FÉrtilidade</strong>. Um guia para acompanhar
              cada dia do seu jejum com fé e propósito — porque nenhuma medicação substitui o que
              a fé é capaz de sustentar.
            </p>
            <div className="mt-8">
              <a href="#oferta" className="btn-cta w-full md:w-auto text-center">
                Garantir o meu Devocional agora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevocionalLo3;