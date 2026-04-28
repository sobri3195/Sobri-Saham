import { NextResponse } from "next/server";
import { askAI } from "@/lib/ai";

export async function POST(request: Request) {
  const body = await request.json();
  const message = String(body?.message || "").trim();
  if (!message) return NextResponse.json({ reply: "Pesan kosong." }, { status: 400 });

  const reply = await askAI(`Jawab dalam bahasa Indonesia dengan format analisis saham aman. Pertanyaan user: ${message}`);
  return NextResponse.json({ reply });
}
