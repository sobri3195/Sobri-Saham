import Link from "next/link";
import { StockAnalysis } from "@/lib/types";

export default function StockTable({ title, data }: { title: string; data: StockAnalysis[] }) {
  return (
    <section className="rounded-xl border bg-white p-4">
      <h2 className="mb-3 font-semibold">{title}</h2>
      <div className="space-y-2">
        {data.map((item) => (
          <Link key={item.quote.symbol} href={`/stocks/${item.quote.symbol}`} className="flex items-center justify-between rounded-md p-2 hover:bg-slate-50">
            <span>{item.quote.symbol}</span>
            <span className={item.quote.changePercent >= 0 ? "text-emerald-600" : "text-red-600"}>{item.quote.changePercent.toFixed(2)}%</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
