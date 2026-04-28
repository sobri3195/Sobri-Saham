export default function ScoreBadge({ score }: { score: number }) {
  return <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">Skor {Math.round(score)}</span>;
}
