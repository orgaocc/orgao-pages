import materiaisImg from "@/assets/materiais-exclusivos.webp";

const MaterialExclusivoLo3 = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-[0.08] blur-2xl"
                style={{ background: "hsl(var(--primary))" }}
              />
              <img
                src={materiaisImg}
                alt="Plano alimentar e devocional exclusivos"
                className="relative rounded-2xl w-full max-w-md shadow-[0_8px_32px_rgba(194,24,91,0.1)]"
                loading="lazy"
                width={1024}
                height={768}
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
              Material Exclusivo
            </p>
            <h2 className="text-[22px] md:text-4xl font-semibold text-foreground leading-tight" style={{ fontFamily: 'Lora, Georgia, serif' }}>
              Desjejum guiado por plano alimentar e orações com um devocional
            </h2>
            <p className="mt-5 text-[15px] md:text-lg text-muted-foreground leading-relaxed">
              Inspirado nos ensinamentos da Bíblia Sagrada e no livro{" "}
              <strong className="text-foreground font-semibold">FÉrtilidade</strong>, você terá em mãos tudo o que
              precisa para nutrir corpo e espírito durante os 7 dias.
            </p>
            <div className="mt-8">
              <a href="#oferta" className="btn-cta w-full md:w-auto text-center">
                Quero participar do Jejum e Oração
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaterialExclusivoLo3;
