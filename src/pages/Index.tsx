import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TypingText = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && (
        <span
          className="inline-block w-0.5 h-[0.9em] bg-primary ml-0.5 align-middle rounded-full animate-pulse"
          aria-hidden
        />
      )}
    </span>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <section
        id="hero"
        className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-20 text-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/fotohero.JPG)" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-background/80" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(var(--primary)/0.15),transparent_60%)] pointer-events-none"
          aria-hidden
        />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 mb-6 text-[10px] font-mono font-semibold tracking-widest uppercase text-accent"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            Sinais CALL & PUT em tempo real
          </motion.div>

          <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-bold leading-[1.15] max-w-4xl mb-5 text-foreground tracking-tight">
            <span className="text-primary/90 text-base md:text-lg font-mono block mb-2 uppercase tracking-widest">
              Opções binárias · Indicador com IA
            </span>
            <TypingText text="Sinais de ALTA e BAIXA 100% gratuitos para você operar com confiança." />
          </h1>

          <motion.p
            className="relative text-muted-foreground text-base md:text-lg max-w-xl mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.6 }}
          >
            Indicador com IA, sem mensalidade e sem pegadinha. Receba{" "}
            <span className="text-accent font-medium">CALL</span> e{" "}
            <span className="text-destructive font-medium">PUT</span> em segundos, com paridade, horário e % de assertividade.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.4 }}
          >
            <Link
              to="/pulseai"
              className="relative btn-primary font-semibold text-base px-8 py-3.5 rounded-lg inline-block glow-primary-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Quero começar grátis agora
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border/80 space-y-3">
        <p className="font-mono text-xs tracking-wider">
          © 2026 Pulse A.I. Todos os direitos reservados.
        </p>
        <p className="mx-auto max-w-4xl text-[10px] leading-snug text-muted-foreground/70">
          Este site não é afiliado ao Facebook ou a qualquer entidade do Meta Ads. Depois que você sair do Facebook, a
          responsabilidade não é deles e sim do nosso site. Fazemos todos os esforços para indicar claramente e mostrar
          todas as provas do produto e usamos resultados reais. Nenhuma informação nessa página ou no grupo deve ser
          interpretado como ganhos garantidos, todos os feedbacks e depoimentos são reais de membros do grupo, mas não
          podem garantir resultados semelhantes ou iguais, o resultado final depende do esforço, dedicação e empenho
          individuais.
        </p>
      </footer>
    </div>
  );
};

export default Index;

