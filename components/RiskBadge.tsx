export default function RiskBadge({ score }: { score: number }) {
  const label = score >= 70 ? "Risiko tinggi" : score >= 50 ? "Risiko sedang" : "Risiko rendah";
  const cls = score >= 70 ? "bg-red-100 text-red-700" : score >= 50 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${cls}`}>{label}</span>;
}
