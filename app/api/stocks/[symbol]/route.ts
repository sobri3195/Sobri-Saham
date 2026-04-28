import { NextResponse } from "next/server";
import { getStockAnalysis } from "@/lib/market-data";

export async function GET(_: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const data = await getStockAnalysis(symbol);
    if (!data) {
      return NextResponse.json({ message: "Data pasar belum tersedia. Coba lagi beberapa saat." }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Data pasar belum tersedia. Coba lagi beberapa saat." }, { status: 503 });
  }
}
