import materiaisImg from "@/assets/materiais-exclusivos.webp";

const MaterialExclusivoLo3 = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <img
              src={materiaisImg}
              alt="Plano alimentar e devocional exclusivos"
              className="rounded-2xl w-full max-w-md shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
              loading="lazy"
              width={1024}
              height={768}
            />
          </div>
          <div>
            <p className="text-xs font-body font-bold uppercase tracking-[0.18em] text-primary mb-3">
              Material Exclusivo
            </p>
            <h2 className="text-[22px] md:text-4xl font-serif font-semibold text-foreground leading-tight">
              Desjejum guiado por plano alimentar e orações com um devocional
            </h2>
            <p className="mt-5 text-[15px] md:text-lg font-body text-muted-foreground leading-relaxed">
              Inspirado nos ensinamentos da Bíblia Sagrada e no livro{" "}
              <strong className="text-foreground">FÉrtilidade</strong>, você terá em mãos tudo o que
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