import { MessageCircle } from "lucide-react";
import logoImg from "@/assets/logo-jejum.webp";

const Footer = () => {
  return (
    <footer className="py-12 md:py-16">
      <div className="section-container">
        {/* Support block */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
            Ainda tem dúvidas?
          </h3>
          <p className="mt-3 text-base font-body text-muted-foreground">
            Nossa equipe está à disposição para te ajudar.
          </p>
          <div className="mt-6">
            <a
              href="https://link.grupoconceber.com/suporte-conceber"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta inline-flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Falar com o suporte
            </a>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-border pt-8 text-center">
          <img src={logoImg} alt="Jejum para Engravidar" className="h-8 md:h-10 w-auto mx-auto mb-2" />
          <p className="text-sm font-body text-muted-foreground">
            © {new Date().getFullYear()} Grupo Conceber. Todos os direitos reservados.
          </p>
          <div className="mt-3 flex justify-center gap-4 text-xs font-body text-taupe">
            <a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a>
            <span>·</span>
            <a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
