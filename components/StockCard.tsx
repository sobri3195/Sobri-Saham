import Link from "next/link";
import { StockAnalysis } from "@/lib/types";
import RiskBadge from "@/components/RiskBadge";
import ScoreBadge from "@/components/ScoreBadge";

export default function StockCard({ item }: { item: StockAnalysis }) {
  return (
    <Link href={`/stocks/${item.quote.symbol}`} className="block rounded-xl border bg-white p-4 shadow-sm hover:shadow">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{item.quote.symbol}</h3>
        <span className={item.quote.changePercent >= 0 ? "text-emerald-600" : "text-red-600"}>
          {item.quote.changePercent.toFixed(2)}%
        </span>
      </div>
      <p className="text-sm text-slate-500">Rp {item.quote.price.toFixed(2)}</p>
      <div className="mt-3 flex gap-2">
        <ScoreBadge score={item.score.technicalScore} />
        <RiskBadge score={item.score.riskScore} />
      </div>
    </Link>
  );
}
