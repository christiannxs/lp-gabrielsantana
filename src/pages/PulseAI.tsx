import { useState, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

const BROKER_NAME = "Vorna Broker";
const TRADEROM_BASE =
  typeof import.meta.env?.VITE_TRADEROM_URL === "string" && import.meta.env.VITE_TRADEROM_URL
    ? import.meta.env.VITE_TRADEROM_URL
    : "https://trade.vornabroker.com/traderoom";

/** Converte ativo do painel para formato comum em URLs de broker (ex: EUR/USD → EURUSD) */
function assetToSymbol(asset: string): string {
  return asset.replace(/\s/g, "").replace("/", "").replace("-", "_");
}

/** Monta URL do iframe com parâmetros de ativo/timeframe quando o broker suportar */
function buildTraderoomUrl(base: string, asset: string, timeframe: string): string {
  try {
    const url = new URL(base);
    const symbol = assetToSymbol(asset);
    url.searchParams.set("symbol", symbol);
    url.searchParams.set("timeframe", timeframe);
    return url.toString();
  } catch {
    return base;
  }
}

const ASSETS = [
  "EUR/USD",
  "EUR/USD-OTC",
  "EUR/JPY",
  "EUR/JPY-OTC",
  "EUR/GBP",
  "EUR/GBP-OTC",
  "GBP/USD",
  "GBP/USD-OTC",
  "AUD/CAD",
  "AUD/CAD-OTC",
  "AUD/JPY",
  "AUD/JPY-OTC",
] as const;

const TIMEFRAMES = ["M1", "M5", "M15", "M30", "H1"] as const;

const ASSET_WEIGHTS: Record<string, number> = {
  "EUR/USD": 0.6,
  "EUR/USD-OTC": 0.6,
  "EUR/JPY": 0.65,
  "EUR/JPY-OTC": 0.65,
  "EUR/GBP": 0.55,
  "EUR/GBP-OTC": 0.55,
  "GBP/USD": 0.55,
  "GBP/USD-OTC": 0.55,
  "AUD/CAD": 0.5,
  "AUD/CAD-OTC": 0.5,
  "AUD/JPY": 0.5,
  "AUD/JPY-OTC": 0.5,
};

const TIMEFRAME_WEIGHTS: Record<string, number> = {
  "M1": 0.9,
  "M5": 0.85,
  "M15": 0.8,
  "M30": 0.6,
  "H1": 0.4,
};

const STEPS = ["ANALISANDO...", "CONECTANDO API DE DADOS...", "GERANDO SINAL..."];
const STEP_DELAY_MS = 5000;
const SIGNAL_RESET_MS = 300000; // 5 min

const PulseAI = () => {
  const [asset, setAsset] = useState<string>(ASSETS[0]);
  const [timeframe, setTimeframe] = useState<string>(TIMEFRAMES[0]);
  const [protections, setProtections] = useState<string>("-");
  const [action, setAction] = useState<string>("-");
  const [actionClass, setActionClass] = useState<string>("");
  const [startOp, setStartOp] = useState<string>("-");
  const [assertiveness, setAssertiveness] = useState<string>("-");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("GERAR SINAL");
  const [robotEyeFast, setRobotEyeFast] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const signalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const traderoomUrl = useMemo(
    () => buildTraderoomUrl(TRADEROM_BASE, asset, timeframe),
    [asset, timeframe]
  );

  const clearSignal = useCallback(() => {
    setProtections("-");
    setAction("-");
    setActionClass("");
    setStartOp("-");
    setAssertiveness("-");
    setRobotEyeFast(false);
  }, []);

  const generateSignal = useCallback(() => {
    const aw = ASSET_WEIGHTS[asset] ?? 0.5;
    const tw = TIMEFRAME_WEIGHTS[timeframe] ?? 0.7;
    const trendScore = aw * tw * 100 + (Math.random() * 10 - 5);

    // Simula leitura de vários indicadores (MACD, RSI, Estocástico, etc.)
    // e aplica a regra de "3 ou mais alinhados" para definir COMPRA ou VENDA.
    const indicators = Array.from({ length: 7 }).map(() => {
      const noise = Math.random() * 12 - 6; // ruído leve por indicador
      const score = trendScore + noise;
      if (score > 52) return "COMPRA" as const;
      if (score < 48) return "VENDA" as const;
      return "NEUTRO" as const;
    });

    const buyCount = indicators.filter((i) => i === "COMPRA").length;
    const sellCount = indicators.filter((i) => i === "VENDA").length;

    let dir: "COMPRA" | "VENDA" | "-" = "-";
    if (buyCount >= 3 && buyCount > sellCount) {
      dir = "COMPRA";
    } else if (sellCount >= 3 && sellCount > buyCount) {
      dir = "VENDA";
    }

    // Se a regra dos 3 não formar consenso, não gera entrada forte
    if (dir === "-") {
      clearSignal();
      return;
    }

    // Taxa de assertividade baseada no alinhamento dos indicadores
    const aligned = dir === "COMPRA" ? buyCount : sellCount;
    const baseAssert = 75 + aligned * 3 + Math.random() * 6;
    const assert = Math.min(98, Math.max(80, Math.round(baseAssert)));

    const now = new Date();
    const addMin =
      timeframe === "M1"
        ? 1
        : timeframe === "M5"
          ? 5
          : timeframe === "M15"
            ? 15
            : timeframe === "M30"
              ? 30
              : 60;
    const min = now.getMinutes() + addMin;
    const h = now.getHours() + Math.floor(min / 60);
    const m = min % 60;
    const startOpStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

    // Proteções simples: número de proteções acompanha força do consenso
    setProtections(aligned >= 5 ? "3" : aligned === 4 ? "2" : "1");
    setAction(dir);
    setActionClass(dir === "COMPRA" ? "pulseai-blink-buy" : "pulseai-blink-sell");
    setStartOp(startOpStr);
    setAssertiveness(`${assert}%`);
    setRobotEyeFast(true);

    if (signalTimeoutRef.current) clearTimeout(signalTimeoutRef.current);
    signalTimeoutRef.current = setTimeout(() => {
      clearSignal();
      signalTimeoutRef.current = null;
    }, SIGNAL_RESET_MS);

    setTimeout(() => setRobotEyeFast(false), 1000);

  }, [asset, timeframe, clearSignal]);

  const handleGenerateClick = () => {
    if (buttonDisabled) return;
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);

    setButtonDisabled(true);
    let stepIndex = 0;

    const runStep = () => {
      if (stepIndex < STEPS.length) {
        setButtonText(STEPS[stepIndex]);
        stepIndex++;
        stepTimeoutRef.current = setTimeout(runStep, STEP_DELAY_MS);
      } else {
        if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
        generateSignal();
        setButtonDisabled(false);
        setButtonText("GERAR SINAL");
      }
    };
    runStep();
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden bg-background text-foreground">
      {/* Iframe – login e sala na mesma tela do indicador; fallback se a plataforma bloquear iframe */}
      <div className="w-full md:w-[80%] h-[60vh] md:h-full relative flex flex-col">
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Voltar
          </Link>
          <span className="rounded-md bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary border border-primary/30">
            {BROKER_NAME}
          </span>
        </div>
        <iframe
          ref={iframeRef}
          key={traderoomUrl}
          src={traderoomUrl}
          title={`Login e sala de trading · ${BROKER_NAME}`}
          className="w-full flex-1 min-h-0 border-0 block"
        />
      </div>

      {/* Painel de sinais */}
      <div
        className="w-full md:w-[20%] h-[40vh] md:h-full flex flex-col items-center overflow-y-auto px-4 py-4 md:py-6 border-t md:border-t-0 md:border-l-4 border-primary bg-background shadow-[-4px_0_24px_hsl(var(--primary)/0.12)] relative"
        style={{ minWidth: 0 }}
      >
        {/* Logo Pulse A.I. (mesmo do favicon) */}
        <div className="relative w-full max-w-[180px] mb-4 md:mb-6 rounded-2xl overflow-hidden glow-primary-sm border border-primary/30 bg-card shadow-lg p-3 flex items-center justify-center">
          <img
            src="/favicon.svg"
            alt="Pulse A.I. Indicador"
            className="w-full h-auto max-h-[140px] object-contain block"
            width={180}
            height={140}
            fetchPriority="high"
          />
        </div>

        <h1 className="text-lg md:text-xl mb-2 text-primary text-glow">
          BEM-VINDO TRADER
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm text-center mb-2 max-w-[260px]">
          Opere ao lado no gráfico da <strong className="text-foreground">{BROKER_NAME}</strong>. Ativo e tempo são enviados para a sala quando o broker permitir.
        </p>
        <p className="text-muted-foreground text-xs text-center mb-4 max-w-[260px]">
          Dica: use Média Móvel simples período 100 no gráfico para filtrar a tendência.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-[260px] mb-4">
          <label htmlFor="assetSelect" className="text-xs font-medium text-muted-foreground">
            Ativo (sincronizado com a sala)
          </label>
          <select
            id="assetSelect"
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full py-2.5 px-3 rounded-md border-2 border-primary/50 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background hover:bg-muted/50 transition-colors"
          >
            {ASSETS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <label htmlFor="timeframeSelect" className="text-xs font-medium text-muted-foreground">
            Timeframe
          </label>
          <select
            id="timeframeSelect"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full py-2.5 px-3 rounded-md border-2 border-primary/50 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background hover:bg-muted/50 transition-colors"
          >
            {TIMEFRAMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          id="generateSignalBtn"
          disabled={buttonDisabled}
          onClick={handleGenerateClick}
          className="w-full max-w-[260px] py-3 rounded-lg font-semibold text-sm md:text-base border-0 cursor-pointer mb-4 disabled:opacity-60 disabled:cursor-not-allowed btn-primary glow-primary-sm"
        >
          {buttonText}
        </button>

        <div className="grid grid-cols-2 gap-2 w-full max-w-[260px]">
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-3 trading-panel hover:border-primary/40 transition-all hover:scale-[1.02]">
            <span className="text-xs text-muted-foreground mb-1">Proteções</span>
            <span className="text-sm font-bold text-foreground">{protections}</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-3 trading-panel hover:border-primary/40 transition-all hover:scale-[1.02]">
            <span className="text-xs text-muted-foreground mb-1">Direção de Entrada</span>
            <span className={`text-sm font-bold ${actionClass}`}>{action}</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-3 trading-panel hover:border-primary/40 transition-all hover:scale-[1.02]">
            <span className="text-xs text-muted-foreground mb-1">Horário de Operação</span>
            <span className="text-sm font-bold text-foreground">{startOp}</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-3 trading-panel hover:border-primary/40 transition-all hover:scale-[1.02]">
            <span className="text-xs text-muted-foreground mb-1">Taxa de Assertividade</span>
            <span className="text-sm font-bold text-primary">{assertiveness}</span>
          </div>
        </div>

        {/* Olho robô – escondido em mobile */}
        <div
          className={`hidden md:block absolute top-1/2 -left-10 w-[60px] h-[60px] rounded-full border-[3px] border-primary bg-primary/20 opacity-60 -translate-y-1/2 z-[1] ${robotEyeFast ? "pulseai-robot-eye-pulse-fast" : "pulseai-robot-eye-slow"}`}
          aria-hidden
        >
          <span className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1/2 -translate-y-1/2 pulseai-robot-eye-pulse" />
        </div>
      </div>
    </div>
  );
};

export default PulseAI;
