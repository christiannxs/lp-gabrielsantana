import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import tradingSetup from "@/assets/trading-setup.jpg";

// ─── Particles Background ───
const Particles = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 8,
    size: 1 + Math.random() * 3,
    isBlue: Math.random() > 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            background: p.isBlue ? "hsl(220 100% 60%)" : "hsl(270 100% 65%)",
            boxShadow: p.isBlue
              ? "0 0 6px hsl(220 100% 60% / 0.8)"
              : "0 0 6px hsl(270 100% 65% / 0.8)",
            animation: `float-particle ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
};

// ─── Typing Effect ───
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
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-[3px] h-[1em] bg-primary ml-1 animate-pulse align-middle" />}
    </span>
  );
};

// ─── Animated Candle Chart ───
const CandleChart = () => {
  const candles = [
    { o: 60, c: 75, h: 80, l: 55 },
    { o: 75, c: 65, h: 78, l: 60 },
    { o: 65, c: 80, h: 85, l: 62 },
    { o: 80, c: 90, h: 95, l: 78 },
    { o: 90, c: 82, h: 93, l: 78 },
    { o: 82, c: 95, h: 100, l: 80 },
    { o: 95, c: 88, h: 98, l: 85 },
    { o: 88, c: 105, h: 110, l: 86 },
    { o: 105, c: 115, h: 120, l: 102 },
    { o: 115, c: 108, h: 118, l: 105 },
    { o: 108, c: 125, h: 130, l: 106 },
    { o: 125, c: 135, h: 140, l: 122 },
  ];

  return (
    <div className="flex items-end justify-center gap-2 h-48 md:h-64">
      {candles.map((c, i) => {
        const isGreen = c.c > c.o;
        const bodyTop = Math.max(c.o, c.c);
        const bodyBot = Math.min(c.o, c.c);
        const bodyH = bodyTop - bodyBot;
        const wickH = c.h - c.l;

        return (
          <motion.div
            key={i}
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            viewport={{ once: true }}
          >
            {/* Wick */}
            <div
              className="w-[2px] absolute"
              style={{
                height: `${wickH * 1.5}px`,
                bottom: `${(c.l - 50) * 1.5}px`,
                background: isGreen ? "hsl(150 80% 50%)" : "hsl(0 80% 55%)",
              }}
            />
            {/* Body */}
            <div
              className="w-3 md:w-4 rounded-sm absolute"
              style={{
                height: `${Math.max(bodyH * 1.5, 3)}px`,
                bottom: `${(bodyBot - 50) * 1.5}px`,
                background: isGreen
                  ? "linear-gradient(to top, hsl(150 80% 40%), hsl(150 80% 55%))"
                  : "linear-gradient(to top, hsl(0 80% 45%), hsl(0 80% 60%))",
                boxShadow: isGreen
                  ? "0 0 8px hsl(150 80% 50% / 0.4)"
                  : "0 0 8px hsl(0 80% 55% / 0.4)",
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── Feature Card ───
const FeatureCard = ({
  icon,
  title,
  delay,
}: {
  icon: string;
  title: string;
  delay: number;
}) => (
  <motion.div
    className="glass rounded-xl p-6 text-center hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_hsl(220_100%_60%/0.15)]"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="text-3xl mb-3">{icon}</div>
    <p className="font-semibold text-foreground text-sm md:text-base">{title}</p>
  </motion.div>
);

// ─── Main Page ───
const Index = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden grid-bg">
      <Particles />

      {/* ── Hero ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        {/* Badge */}
        <motion.div
          className="glass rounded-full px-5 py-2 mb-8 text-xs md:text-sm tracking-widest uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary font-bold">Quantum Pulse AI™</span>
          <span className="text-muted-foreground ml-2">— Indicador Inteligente</span>
        </motion.div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight max-w-5xl mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          <TypingText text='Veja como eu faço de R$150 a R$1.500 todos os dias no mercado de Trading usando o meu Indicador de I.A.' />
        </h1>

        {/* Subheadline */}
        <motion.p
          className="text-muted-foreground text-sm md:text-lg max-w-2xl mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          Um sistema automatizado que analisa o mercado em segundos e entrega sinais claros para você operar com confiança.
        </motion.p>

        {/* CTA */}
        <motion.a
          href="#"
          className="neon-btn neon-pulse text-primary-foreground font-bold text-base md:text-lg px-8 py-4 rounded-xl inline-block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.5, duration: 0.5 }}
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          🔥 GARANTIR ACESSO GRATUITO AGORA
        </motion.a>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-primary/40 flex items-start justify-center pt-1">
            <div className="w-1 h-2 rounded-full bg-primary" />
          </div>
        </motion.div>
      </section>

      {/* ── Section 2 – Power of AI ── */}
      <section className="relative z-10 py-20 md:py-32 px-4">
        {/* Digital lines BG */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[1px] w-full"
              style={{
                top: `${20 + i * 15}%`,
                background: `linear-gradient(90deg, transparent, hsl(220 100% 60% / 0.1), transparent)`,
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.h2
            className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            O Poder do Quantum Pulse AI™
          </motion.h2>

          <motion.p
            className="text-muted-foreground max-w-3xl mx-auto mb-14 text-sm md:text-base leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Enquanto 90% dos traders operam no achismo, o Quantum Pulse AI™ analisa padrões, volume e comportamento do mercado em tempo real, entregando sinais baseados em dados — não em emoção.
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <FeatureCard icon="⚡" title="Análise automática" delay={0} />
            <FeatureCard icon="📊" title="Sinais claros de compra e venda" delay={0.1} />
            <FeatureCard icon="🖥️" title="Interface simples" delay={0.2} />
            <FeatureCard icon="🚀" title="Ideal para iniciantes" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ── Section 3 – Visual Proof ── */}
      <section className="relative z-10 py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Resultados Reais com Quantum Pulse AI™
            </h2>

            {/* Proof photo */}
            <motion.div
              className="mb-10 rounded-xl overflow-hidden border border-primary/20 shadow-[0_0_40px_hsl(220_100%_60%/0.15)]"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src={tradingSetup}
                alt="Setup de trading com Quantum Pulse AI mostrando resultados em tempo real"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>

            <CandleChart />

            <p className="text-center text-muted-foreground mt-8 text-sm md:text-base">
              De <span className="text-primary font-bold">R$150</span> a{" "}
              <span className="text-accent font-bold">R$1.500</span> no mesmo dia utilizando apenas o indicador.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section – Depoimentos ── */}
      <section className="relative z-10 py-20 md:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-2xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            O Que Nossos Usuários Dizem
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-14 text-sm md:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            viewport={{ once: true }}
          >
            Resultados reais de pessoas comuns que transformaram suas vidas com o Quantum Pulse AI™
          </motion.p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Carlos M.",
                role: "Iniciante em Trading",
                text: "Em 2 semanas já recuperei meu investimento inicial. O indicador é absurdamente preciso, parece que ele lê o mercado!",
                profit: "+R$4.200",
                avatar: "CM",
              },
              {
                name: "Ana Paula S.",
                role: "Trader há 1 ano",
                text: "Eu já tinha desistido do mercado financeiro até conhecer o Quantum Pulse. Agora opero todos os dias com confiança e resultados consistentes.",
                profit: "+R$8.750",
                avatar: "AP",
              },
              {
                name: "Rafael T.",
                role: "Engenheiro de Software",
                text: "Como dev, eu entendo a tecnologia por trás. A IA realmente analisa padrões que nenhum humano conseguiria em tempo real. Impressionante.",
                profit: "+R$12.300",
                avatar: "RT",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                className="glass rounded-xl p-6 flex flex-col justify-between hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_hsl(220_100%_60%/0.12)]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
              >
                {/* Stars */}
                <div className="text-yellow-400 text-sm mb-3">★★★★★</div>

                <p className="text-foreground/90 text-sm leading-relaxed mb-6 flex-1">"{t.text}"</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                    {t.profit}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 – Final CTA ── */}
      <section className="relative z-10 py-20 md:py-32 px-4">
        {/* Glow background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div
            className="glass rounded-full px-4 py-1.5 inline-block mb-6 text-xs tracking-widest uppercase text-primary"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            ⏳ Vagas limitadas
          </motion.div>

          <motion.h2
            className="text-2xl md:text-5xl font-black mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Acesso 100% Gratuito por Tempo Limitado
          </motion.h2>

          <motion.p
            className="text-muted-foreground mb-10 text-sm md:text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Clique no botão abaixo e garanta seu acesso gratuito ao Quantum Pulse AI™ antes que as vagas sejam encerradas.
          </motion.p>

          <motion.a
            href="#"
            className="neon-btn neon-pulse text-primary-foreground font-black text-lg md:text-xl px-10 py-5 rounded-xl inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            🚀 QUERO MEU ACESSO GRATUITO
          </motion.a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-muted-foreground text-xs border-t border-border/50">
        <p>© 2026 Quantum Pulse AI™ — Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
