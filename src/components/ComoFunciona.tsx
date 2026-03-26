

const ComoFunciona = () => {
  return (
    <section className="py-16 md:py-24 section-sage">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground leading-tight">
              Como funciona o Jejum e Oração para Engravidar?
            </h2>
            <p className="mt-6 text-lg font-body text-muted-foreground leading-relaxed">
              Uma rotina que une dois pilares essenciais para quem quer{" "}
              <strong className="text-foreground">engravidar ainda em 2026</strong>:
            </p>
            <p className="mt-4 text-2xl md:text-3xl font-serif font-semibold text-sage italic">
              A Espiritualidade e a Nutrição.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src={doctorImg}
              alt="Dra. Talita Melo"
              className="rounded-3xl w-full max-w-sm object-cover shadow-lg"
              loading="lazy"
              width={640}
              height={800}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;
