import materiaisImg from "@/assets/materiais-exclusivos.webp";

const MaterialExclusivo = () => {
  return (
    <section className="py-16 md:py-24 section-champagne">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img
              src={materiaisImg}
              alt="Material exclusivo do programa"
              className="rounded-2xl w-full max-w-md shadow-lg"
              loading="lazy"
              width={1024}
              height={768}
            />
          </div>
          <div>
            <p className="text-sm font-body font-semibold uppercase tracking-widest text-sage mb-3">
              Material Exclusivo
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground leading-tight">
              Desjejum guiado por plano alimentar e orações com um devocional
            </h2>
            <p className="mt-6 text-lg font-body text-muted-foreground leading-relaxed">
              Inspirado nos ensinamentos da Bíblia Sagrada e no livro{" "}
              <strong className="text-foreground">FÉrtilidade</strong>, você terá em mãos tudo
              o que precisa para nutrir corpo e espírito durante os 7 dias.
            </p>
            <div className="mt-8">
              <a href="#oferta" className="btn-cta">
                Quero participar do Jejum e Oração
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaterialExclusivo;
