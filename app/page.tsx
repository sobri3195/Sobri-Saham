import StockCard from "@/components/StockCard";
import StockTable from "@/components/StockTable";
import { getDashboardData } from "@/lib/market-data";

export default async function HomePage() {
  const dashboard = await getDashboardData();

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-4">
        <h1 className="text-2xl font-bold">Sobri Saham</h1>
        <p className="text-slate-600">Asisten analisis saham Indonesia</p>
        <p className="mt-2 text-sm text-slate-500">{dashboard.ihsgSummary}</p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Kandidat saham potensial</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dashboard.potential.map((item) => <StockCard key={item.quote.symbol} item={item} />)}
        </div>
      </section>

      <section id="watchlist" className="grid gap-4 lg:grid-cols-3">
        <StockTable title="Top Gainers" data={dashboard.topGainers} />
        <StockTable title="Top Losers" data={dashboard.topLosers} />
        <StockTable title="Volume Tinggi" data={dashboard.highVolume} />
      </section>
    </div>
  );
}
