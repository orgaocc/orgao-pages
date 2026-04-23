const tags = [
  "Resistência insulínica",
  "Síndrome dos ovários policísticos (SOP)",
  "Tentava há 3 anos",
  "Dois abortos anteriores",
  "Endometriose",
  "Fertilização sem sucesso",
  "Ciclo irregular",
];

const ProvaSocialLo3 = () => {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="section-container text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-body font-bold uppercase tracking-[0.18em] text-primary mb-4">
            Resultados Reais
          </p>
          <h2 className="text-[22px] md:text-5xl font-serif font-bold text-foreground">
            Mais de <span className="text-primary text-3xl md:text-6xl">1.700</span> mulheres já engravidaram
          </h2>
          <p className="mt-3 text-[15px] md:text-lg font-body text-muted-foreground">
            depois de unirem fé e medicina
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {tags.map((label) => (
            <div
              key={label}
              className="rounded-full px-5 py-2.5 bg-card border border-border font-body text-sm text-muted-foreground"
            >
              {label}
            </div>
          ))}
        </div>

        <p className="mt-10 text-base font-body text-muted-foreground italic max-w-lg mx-auto">
          "A ciência cura, mas é a fé que sustenta."
        </p>
      </div>
    </section>
  );
};

export default ProvaSocialLo3;