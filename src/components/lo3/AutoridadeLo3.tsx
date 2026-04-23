import autoridadeImg from "@/assets/autoridade.webp";

const AutoridadeLo3 = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="flex justify-center md:sticky md:top-8">
            <img
              src={autoridadeImg}
              alt="Dra. Talita Melo"
              className="rounded-2xl w-full max-w-sm object-cover shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
              loading="lazy"
              width={640}
              height={800}
            />
          </div>
          <div>
            <p className="text-xs font-body font-bold uppercase tracking-[0.18em] text-primary mb-3">
              Sua especialista
            </p>
            <h2 className="text-[22px] md:text-4xl font-serif font-semibold text-foreground leading-tight">
              Quem sou eu para te ajudar a engravidar?
            </h2>
            <div className="mt-6 space-y-4 text-[15px] font-body text-muted-foreground leading-relaxed">
              <p>
                Meu nome é <strong className="text-foreground">Talita Melo</strong>.
              </p>
              <p>
                Sou Médica Ginecologista, referência em fertilidade no Brasil, autora do livro{" "}
                <strong className="text-foreground">FÉrtilidade</strong> e co-fundadora do{" "}
                <strong className="text-foreground">Conceber</strong>, um dos maiores programas de
                acompanhamento para quem quer engravidar no Brasil.
              </p>
              <p>
                Quando vejo os relatos de mulheres que engravidaram com Mounjaro, não me surpreendo.
                Porque o mecanismo que essa medicação ativa — equilíbrio da resistência insulínica,
                melhora da ovulação, qualidade dos óvulos — é exatamente o que eu aprendi a estimular
                de forma natural.
              </p>
              <p>Aprendi isso da forma mais difícil.</p>
              <p>
                Com 7 diagnósticos, passei 10 anos no deserto da infertilidade e precisei enviar 5
                filhos a Deus.
              </p>
              <p>
                Mas por ter unido a medicina com a fé, hoje sou mãe de{" "}
                <strong className="text-foreground">dois filhos</strong>. Aos 42 e 43 anos.
              </p>
              <p>
                Isso só foi possível porque entendi que não adianta cuidar do corpo sem fortalecer
                o espírito. Da mesma forma, não adianta pedir um filho a Deus sem fazer pelo corpo
                o que ele precisa para receber essa graça.
              </p>

              <div className="rounded-xl bg-sage-light border-l-4 border-primary p-5 my-6">
                <p className="font-serif text-lg italic text-foreground">
                  "A ciência cura, mas é a fé que sustenta."
                </p>
              </div>

              <p>
                Por isso, criei este protocolo para ser um instrumento de conforto e leveza na sua
                jornada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutoridadeLo3;