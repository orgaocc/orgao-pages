const Autoridade = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img
              src="https://grupoconceber.com/wp-content/uploads/2025/12/Mask-group-17.webp"
              alt="Dra. Talita Melo"
              className="rounded-3xl w-full max-w-sm object-cover shadow-lg"
              loading="lazy"
              width={640}
              height={800}
            />
          </div>
          <div>
            <p className="text-sm font-body font-semibold uppercase tracking-widest text-sage mb-3">
              Sua especialista
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground leading-tight">
              Quem sou eu para te ajudar a <em className="text-sage not-italic">engravidar?</em>
            </h2>
            <div className="mt-6 space-y-4 text-base font-body text-muted-foreground leading-relaxed">
              <p>
                Meu nome é <strong className="text-foreground">Talita Melo</strong>.
              </p>
              <p>
                Sou Médica Ginecologista, referência em fertilidade no Brasil, autora do livro
                FÉrtilidade e co-fundadora do <strong className="text-foreground">Conceber</strong>,
                um dos maiores programas de acompanhamento para quem quer engravidar no Brasil.
              </p>
              <p>
                Com 7 diagnósticos, <strong className="text-foreground">passei 10 anos no deserto da infertilidade</strong>{" "}
                e precisei enviar 5 filhos a Deus.
              </p>
              <p>
                Mas, por ter unido a fé e a medicina, hoje sou mãe de dois filhos.
                Sim, <strong className="text-foreground">dois filhos</strong>. Aos 42 e 43 anos.
              </p>
              <p>
                Isso só foi possível porque entendi que não adianta cuidar do corpo sem fortalecer
                o espírito. Da mesma forma, não adianta pedir um filho a Deus sem fazer pelo corpo
                o que ele precisa para engravidar.
              </p>
              <p className="font-serif text-lg italic text-foreground">
                "A ciência cura, mas é a fé que sustenta."
              </p>
              <p>
                Por isso, uni as duas para ser um instrumento de conforto e leveza na sua jornada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Autoridade;
