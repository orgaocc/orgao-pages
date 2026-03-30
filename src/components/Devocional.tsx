import devocionalImg from "@/assets/devocional-mockup.webp";

const Devocional = () => {
  return (
    <section className="py-16 md:py-24 section-champagne relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-sage-light opacity-30 blur-3xl" />
      <div className="section-container relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img
              src={devocionalImg}
              alt="Devocional Exclusivo FÉrtilidade"
              className="rounded-2xl w-full max-w-sm shadow-xl"
              loading="lazy"
              width={800}
              height={600}
            />
          </div>
          <div>
            <div className="inline-block rounded-full px-4 py-1.5 bg-sage-light mb-4">
              <span className="text-xs font-body font-semibold uppercase tracking-widest text-sage">
                Devocional Exclusivo
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground leading-tight">
              Faça as orações com um Devocional Exclusivo
            </h2>
            <p className="mt-6 text-lg font-body text-muted-foreground leading-relaxed">
              Inspirado nos ensinamentos da Bíblia Sagrada e no livro{" "}
              <strong className="text-foreground">FÉrtilidade</strong>. Um material precioso para
              acompanhar cada dia do seu jejum com fé e propósito.
            </p>
            <div className="mt-8">
              <a href="#oferta" className="btn-cta-accent">
                Garantir o meu Devocional agora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Devocional;
