export type RiskLevel = "rendah" | "sedang" | "tinggi";

export type ScoreCategory =
  | "STRONG_WATCH"
  | "BUY_CANDIDATE"
  | "WAIT_CONFIRMATION"
  | "HIGH_RISK"
  | "AVOID";

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  volume: number;
  historical: HistoricalPrice[];
}

export interface Indicators {
  ma20: number | null;
  ma50: number | null;
  rsi14: number | null;
  priceChangePercent: number;
  avgVolume: number | null;
  support: number | null;
  resistance: number | null;
}

export interface StockScore {
  technicalScore: number;
  riskScore: number;
  category: ScoreCategory;
  reasons: string[];
  risks: string[];
}

export interface StockAnalysis {
  quote: StockQuote;
  indicators: Indicators;
  score: StockScore;
}
