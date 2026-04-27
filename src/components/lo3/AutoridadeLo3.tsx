import autoridadeImg from "@/assets/autoridade.webp";

const AutoridadeLo3 = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="flex justify-center md:sticky md:top-8">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-[0.07] blur-2xl"
                style={{ background: "hsl(var(--primary))" }}
              />
              <img
                src={autoridadeImg}
                alt="Dra. Talita Melo"
                className="relative rounded-2xl w-full max-w-sm object-cover shadow-[0_8px_32px_rgba(194,24,91,0.1)]"
                loading="lazy"
                width={640}
                height={800}
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
              Sua especialista
            </p>
            <h2 className="text-[22px] md:text-4xl font-semibold text-foreground leading-tight" style={{ fontFamily: 'Lora, Georgia, serif' }}>
              Quem sou eu para te ajudar a engravidar?
            </h2>
            <div className="mt-7 space-y-4 text-[15px] text-muted-foreground leading-relaxed">
              <p>
                Meu nome é <strong className="text-foreground font-semibold">Talita Melo</strong>.
              </p>
              <p>
                Sou Médica Ginecologista, referência em fertilidade no Brasil, autora do livro{" "}
                <strong className="text-foreground font-semibold">FÉrtilidade</strong> e co-fundadora do{" "}
                <strong className="text-foreground font-semibold">Conceber</strong>, um dos maiores programas de
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
                <strong className="text-foreground font-semibold">dois filhos</strong>. Aos 42 e 43 anos.
              </p>
              <p>
                Isso só foi possível porque entendi que não adianta cuidar do corpo sem fortalecer
                o espírito. Da mesma forma, não adianta pedir um filho a Deus sem fazer pelo corpo
                o que ele precisa para receber essa graça.
              </p>

              <div
                className="rounded-xl border-l-4 p-5 my-6"
                style={{
                  background: "hsl(var(--gold) / 0.08)",
                  borderColor: "hsl(var(--gold))",
                }}
              >
                <p className="text-lg italic text-foreground leading-relaxed" style={{ fontFamily: 'Lora, Georgia, serif' }}>
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
