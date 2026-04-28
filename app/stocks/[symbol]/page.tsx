import { notFound } from "next/navigation";
import RiskBadge from "@/components/RiskBadge";
import ScoreBadge from "@/components/ScoreBadge";
import { askAI } from "@/lib/ai";
import { getStockAnalysis } from "@/lib/market-data";

export default async function StockDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const data = await getStockAnalysis(symbol);
  if (!data) notFound();

  const aiSummary = await askAI(`Analisa saham ${data.quote.symbol} dengan ringkas. Data: price ${data.quote.price}, change ${data.quote.changePercent}%, category ${data.score.category}`);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{data.quote.symbol}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border bg-white p-4">
          <p>Harga terakhir: <b>{data.quote.price.toFixed(2)}</b></p>
          <p>Perubahan harian: <b>{data.quote.changePercent.toFixed(2)}%</b></p>
          <p>Volume: <b>{data.quote.volume.toLocaleString("id-ID")}</b></p>
          <div className="mt-3 flex gap-2">
            <ScoreBadge score={data.score.technicalScore} />
            <RiskBadge score={data.score.riskScore} />
          </div>
        </section>
        <section className="rounded-xl border bg-white p-4 text-sm">
          <p>MA20: {data.indicators.ma20?.toFixed(2) ?? "-"}</p>
          <p>MA50: {data.indicators.ma50?.toFixed(2) ?? "-"}</p>
          <p>RSI14: {data.indicators.rsi14?.toFixed(2) ?? "-"}</p>
          <p>Support: {data.indicators.support?.toFixed(2) ?? "-"}</p>
          <p>Resistance: {data.indicators.resistance?.toFixed(2) ?? "-"}</p>
          <p>Status: {data.score.category}</p>
        </section>
      </div>
      <section className="rounded-xl border bg-white p-4">
        <h2 className="mb-2 font-semibold">Ringkasan AI</h2>
        <pre className="whitespace-pre-wrap text-sm">{aiSummary}</pre>
      </section>
    </div>
  );
}
