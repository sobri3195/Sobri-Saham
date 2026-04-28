import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/market-data";

export async function GET() {
  try {
    const data = await getDashboardData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Data pasar belum tersedia. Coba lagi beberapa saat." }, { status: 503 });
  }
}
