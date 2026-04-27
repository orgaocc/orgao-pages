import devocionalImg from "@/assets/devocional-mockup.webp";

const DevocionalLo3 = () => {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Gold ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: "hsl(var(--gold))" }}
      />

      <div className="section-container relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative">
              <div
                className="absolute -inset-5 rounded-3xl blur-2xl opacity-20"
                style={{ background: "hsl(var(--gold))" }}
              />
              <div
                className="absolute -inset-2 rounded-3xl opacity-40"
                style={{ background: "hsl(var(--gold) / 0.12)", border: "1px solid hsl(var(--gold) / 0.25)" }}
              />
              <img
                src={devocionalImg}
                alt="Devocional Exclusivo FÉrtilidade"
                className="relative rounded-2xl w-full max-w-sm shadow-[0_16px_48px_rgba(0,0,0,0.15)]"
                loading="lazy"
                width={800}
                height={600}
              />
            </div>
          </div>
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
              style={{ color: "hsl(var(--gold))" }}
            >
              Devocional Exclusivo
            </p>
            <h2 className="text-[22px] md:text-4xl font-semibold text-foreground leading-tight" style={{ fontFamily: 'Lora, Georgia, serif' }}>
              Faça as orações com um Devocional Exclusivo
            </h2>
            <p className="mt-5 text-[15px] md:text-lg text-muted-foreground leading-relaxed">
              Inspirado nos ensinamentos da Bíblia Sagrada e no livro{" "}
              <strong className="text-foreground font-semibold">FÉrtilidade</strong>. Um guia para acompanhar
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
