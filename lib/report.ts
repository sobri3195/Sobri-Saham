import { getDashboardData } from "@/lib/market-data";
import { FINANCIAL_DISCLAIMER } from "@/lib/safety";

function toRiskText(riskScore: number): string {
  if (riskScore >= 70) return "tinggi";
  if (riskScore >= 50) return "sedang";
  return "rendah";
}

export async function buildHourlyReport(): Promise<string> {
  const data = await getDashboardData();
  const wib = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

  const kandidat = data.potential.slice(0, 2);
  const hatiHati = data.highRisk.slice(0, 1);

  return [
    "📊 Sobri Saham - Laporan Pasar",
    "",
    `🕒 Waktu: ${wib} WIB`,
    "",
    "Ringkasan:",
    data.ihsgSummary,
    "",
    "🔥 Kandidat menarik:",
    ...kandidat.map((x, i) => `${i + 1}. ${x.quote.symbol} - ${x.score.reasons[0] ?? "Layak dipantau"} - Risiko: ${toRiskText(x.score.riskScore)}`),
    "",
    "⚠️ Perlu hati-hati:",
    ...hatiHati.map((x, i) => `${i + 1}. ${x.quote.symbol} - ${x.score.risks[0] ?? "Volatilitas tinggi"}`),
    "",
    "📌 Watchlist:",
    data.watchlist.join(", "),
    "",
    "🧭 Skenario:",
    "- Positif: Momentum berlanjut jika volume tetap kuat dan IHSG stabil.",
    "- Negatif: Tekanan jual global meningkatkan volatilitas.",
    "",
    `Catatan: ${FINANCIAL_DISCLAIMER}`
  ].join("\n");
}
