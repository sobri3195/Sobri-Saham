import { HistoricalPrice, Indicators } from "@/lib/types";

function average(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function calculateRSI(closes: number[], period = 14): number | null {
  if (closes.length <= period) return null;
  let gains = 0;
  let losses = 0;

  for (let i = closes.length - period; i < closes.length; i += 1) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

export function calculateIndicators(prices: HistoricalPrice[]): Indicators {
  if (!prices.length) {
    return {
      ma20: null,
      ma50: null,
      rsi14: null,
      priceChangePercent: 0,
      avgVolume: null,
      support: null,
      resistance: null
    };
  }

  const closes = prices.map((x) => x.close);
  const volumes = prices.map((x) => x.volume);
  const latest = closes[closes.length - 1];
  const first = closes[0];

  const ma20 = average(closes.slice(-20));
  const ma50 = average(closes.slice(-50));
  const rsi14 = calculateRSI(closes, 14);
  const avgVolume = average(volumes.slice(-20));

  const highs = prices.slice(-30).map((x) => x.high);
  const lows = prices.slice(-30).map((x) => x.low);

  return {
    ma20,
    ma50,
    rsi14,
    priceChangePercent: first === 0 ? 0 : ((latest - first) / first) * 100,
    avgVolume,
    support: lows.length ? Math.min(...lows) : null,
    resistance: highs.length ? Math.max(...highs) : null
  };
}
