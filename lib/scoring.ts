import { Indicators, StockQuote, StockScore } from "@/lib/types";

export function scoreStock(stockData: { quote: StockQuote; indicators: Indicators }): StockScore {
  const { quote, indicators } = stockData;
  const reasons: string[] = [];
  const risks: string[] = [];

  if (quote.historical.length < 20 || indicators.ma20 === null || indicators.ma50 === null || indicators.rsi14 === null) {
    return {
      technicalScore: 40,
      riskScore: 55,
      category: "WAIT_CONFIRMATION",
      reasons: ["Data historis belum cukup untuk konfirmasi tren."],
      risks: ["Sinyal teknikal belum lengkap."]
    };
  }

  let technicalScore = 50;
  let riskScore = 40;

  if (quote.price > indicators.ma20 && quote.price > indicators.ma50) {
    technicalScore += 20;
    reasons.push("Harga berada di atas MA20 dan MA50.");
  }

  if (indicators.ma20 > indicators.ma50) {
    technicalScore += 10;
    reasons.push("MA20 di atas MA50 menunjukkan momentum positif.");
  }

  if (indicators.rsi14 >= 45 && indicators.rsi14 <= 65) {
    technicalScore += 10;
    reasons.push("RSI berada di area sehat (45-65).");
  }

  if (indicators.rsi14 > 75) {
    riskScore += 20;
    risks.push("RSI tinggi (overbought), rawan pullback.");
  }

  if (indicators.rsi14 < 30) {
    riskScore += 15;
    reasons.push("RSI rendah (oversold), ada potensi rebound.");
    risks.push("Tekanan jual masih kuat.");
  }

  if (indicators.avgVolume && quote.volume > indicators.avgVolume) {
    technicalScore += 5;
    reasons.push("Volume di atas rata-rata, minat pasar meningkat.");
  }

  if (Math.abs(quote.changePercent) > 7) {
    riskScore += 20;
    risks.push("Perubahan harian ekstrem, volatilitas tinggi.");
  }

  technicalScore = Math.max(0, Math.min(100, technicalScore));
  riskScore = Math.max(0, Math.min(100, riskScore));

  let category: StockScore["category"] = "WAIT_CONFIRMATION";
  if (riskScore >= 80) category = "AVOID";
  else if (riskScore >= 65) category = "HIGH_RISK";
  else if (technicalScore >= 75) category = "BUY_CANDIDATE";
  else if (technicalScore >= 60) category = "STRONG_WATCH";

  return { technicalScore, riskScore, category, reasons, risks };
}
