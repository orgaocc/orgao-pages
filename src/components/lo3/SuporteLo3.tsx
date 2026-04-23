const SuporteLo3 = () => {
  return (
    <section className="py-16 md:py-20 bg-card">
      <div className="section-container text-center">
        <h3 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
          Ainda tem dúvidas?
        </h3>
        <p className="mt-3 text-[15px] font-body text-muted-foreground">
          Nossa equipe está à disposição para te ajudar.
        </p>
        <div className="mt-6">
          <a
            href="#oferta"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-body font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            Falar com o suporte
          </a>
        </div>
      </div>
    </section>
  );
};

export default SuporteLo3;