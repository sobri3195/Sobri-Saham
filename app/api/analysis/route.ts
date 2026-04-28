import { NextResponse } from "next/server";
import { askAI } from "@/lib/ai";
import { getStockAnalysis } from "@/lib/market-data";

export async function POST(request: Request) {
  const body = await request.json();
  const symbol = String(body?.symbol || "").trim().toUpperCase();
  const question = String(body?.question || "Analisa saham ini");

  const data = symbol ? await getStockAnalysis(symbol) : null;

  const prompt = `Format jawaban:\n- Kesimpulan singkat\n- Status\n- Alasan utama\n- Risiko utama\n- Skenario positif\n- Skenario negatif\n- Level yang perlu dipantau\n- Disclaimer\n\nPertanyaan: ${question}\n\nData: ${JSON.stringify(data)}`;
  const answer = await askAI(prompt);
  return NextResponse.json({ symbol, answer, data });
}
