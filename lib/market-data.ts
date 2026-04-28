import { calculateIndicators } from "@/lib/indicators";
import { scoreStock } from "@/lib/scoring";
import { StockAnalysis, StockQuote } from "@/lib/types";
import symbols from "@/data/idx-symbols.sample.json";
import { getDefaultWatchlist } from "@/lib/watchlist";

const PROVIDER = process.env.STOCK_DATA_PROVIDER || "yahoo";

function toProviderSymbol(symbol: string): string {
  const upper = symbol.toUpperCase().replace(".JK", "");
  return PROVIDER === "yahoo" ? `${upper}.JK` : upper;
}

async function fetchYahooQuote(symbol: string): Promise<StockQuote | null> {
  const yahooSymbol = toProviderSymbol(symbol);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?range=3mo&interval=1d`, {
      signal: controller.signal,
      cache: "no-store"
    });
    if (!res.ok) return null;
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) return null;
    const quote = result?.indicators?.quote?.[0];
    const timestamps: number[] = result?.timestamp || [];

    const historical = timestamps
      .map((ts, idx) => ({
        date: new Date(ts * 1000).toISOString().slice(0, 10),
        open: quote.open?.[idx] ?? quote.close?.[idx] ?? 0,
        high: quote.high?.[idx] ?? quote.close?.[idx] ?? 0,
        low: quote.low?.[idx] ?? quote.close?.[idx] ?? 0,
        close: quote.close?.[idx] ?? 0,
        volume: quote.volume?.[idx] ?? 0
      }))
      .filter((x) => x.close > 0);

    if (!historical.length) return null;

    const latest = historical[historical.length - 1];
    const prev = historical[historical.length - 2] ?? latest;
    const changePercent = prev.close ? ((latest.close - prev.close) / prev.close) * 100 : 0;

    return {
      symbol: symbol.toUpperCase(),
      name: symbols.find((s) => s.symbol === symbol.toUpperCase())?.name ?? symbol.toUpperCase(),
      price: latest.close,
      changePercent,
      volume: latest.volume,
      historical
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function mockQuote(symbol: string): StockQuote {
  const name = symbols.find((s) => s.symbol === symbol.toUpperCase())?.name ?? `${symbol.toUpperCase()} Tbk`;
  const base = 1000 + symbol.charCodeAt(0) * 5;
  const historical = Array.from({ length: 60 }, (_, i) => {
    const close = Math.max(50, base + Math.sin(i / 4) * 50 + i * 2);
    return {
      date: new Date(Date.now() - (60 - i) * 86400000).toISOString().slice(0, 10),
      open: close - 5,
      high: close + 10,
      low: close - 15,
      close,
      volume: 5000000 + i * 15000
    };
  });
  const latest = historical[historical.length - 1];
  const prev = historical[historical.length - 2];

  return {
    symbol: symbol.toUpperCase(),
    name,
    price: latest.close,
    changePercent: ((latest.close - prev.close) / prev.close) * 100,
    volume: latest.volume,
    historical
  };
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  const cleaned = symbol.toUpperCase().replace(/[^A-Z.]/g, "").replace(".JK", "");
  if (!cleaned) return null;

  if (PROVIDER === "yahoo") {
    const yahoo = await fetchYahooQuote(cleaned);
    if (yahoo) return yahoo;
  }

  return mockQuote(cleaned);
}

export async function getStockAnalysis(symbol: string): Promise<StockAnalysis | null> {
  const quote = await getStockQuote(symbol);
  if (!quote) return null;
  const indicators = calculateIndicators(quote.historical);
  const score = scoreStock({ quote, indicators });
  return { quote, indicators, score };
}

export async function getDashboardData() {
  const watchlist = getDefaultWatchlist();
  const analyses = await Promise.all(watchlist.map((symbol) => getStockAnalysis(symbol)));
  const valid = analyses.filter((x): x is NonNullable<typeof x> => x !== null);

  const sortedByChange = [...valid].sort((a, b) => b.quote.changePercent - a.quote.changePercent);
  const sortedByVolume = [...valid].sort((a, b) => b.quote.volume - a.quote.volume);

  return {
    ihsgSummary: "IHSG summary belum tersedia real-time dari provider saat ini.",
    topGainers: sortedByChange.slice(0, 5),
    topLosers: [...sortedByChange].reverse().slice(0, 5),
    highVolume: sortedByVolume.slice(0, 5),
    potential: valid.filter((x) => ["BUY_CANDIDATE", "STRONG_WATCH"].includes(x.score.category)).slice(0, 5),
    highRisk: valid.filter((x) => ["HIGH_RISK", "AVOID"].includes(x.score.category)).slice(0, 5),
    watchlist
  };
}
