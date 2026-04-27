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
    <section className="py-20 md:py-24 bg-background">
      <div className="section-container text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-5">
            Resultados Reais
          </p>
          <h2 className="font-semibold text-foreground" style={{ fontFamily: 'Lora, Georgia, serif' }}>
            <span className="text-[22px] md:text-4xl">Mais de </span>
            <span
              className="text-[3.5rem] md:text-[5.5rem] leading-none text-primary block md:inline"
              style={{ fontFamily: 'Lora, Georgia, serif' }}
            >
              1.700
            </span>
            <span className="text-[22px] md:text-4xl"> mulheres já engravidaram</span>
          </h2>
          <p className="mt-3 text-[15px] md:text-lg text-muted-foreground">
            depois de unirem fé e medicina
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {tags.map((label) => (
            <div
              key={label}
              className="rounded-full px-5 py-2.5 bg-white border border-border text-sm text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary/30 hover:text-foreground"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-lg mx-auto">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-2xl leading-none" style={{ color: "hsl(var(--gold))" }}>"</div>
            <p className="text-base text-muted-foreground italic leading-relaxed text-left">
              A ciência cura, mas é a fé que sustenta.
            </p>
            <div className="self-end text-2xl leading-none" style={{ color: "hsl(var(--gold))" }}>"</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProvaSocialLo3;
