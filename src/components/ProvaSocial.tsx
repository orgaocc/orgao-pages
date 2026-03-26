const ProvaSocial = () => {
  return (
    <section className="py-16 md:py-20 section-blush">
      <div className="section-container text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-body font-semibold uppercase tracking-widest text-sage mb-4">
            Resultados Reais
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            Mais de{" "}
            <span className="text-sage">1.700</span>{" "}
            mulheres já engravidaram
          </h2>
          <p className="mt-4 text-lg font-body text-muted-foreground">
            depois de unirem fé e medicina
          </p>
        </div>

        {/* Testimonial indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {[
            "Tentava há 3 anos",
            "Dois abortos anteriores",
            "Ovário policístico",
            "Endometriose",
            "Fertilização sem sucesso",
            "Ciclo irregular",
          ].map((label) => (
            <div
              key={label}
              className="rounded-full px-5 py-2.5 bg-cream border border-border font-body text-sm text-muted-foreground shadow-sm"
            >
              {label}
            </div>
          ))}
        </div>

        <p className="mt-10 text-base font-body text-taupe italic max-w-lg mx-auto">
          "A ciência cura, mas é a fé que sustenta."
        </p>
      </div>
    </section>
  );
};

export default ProvaSocial;
