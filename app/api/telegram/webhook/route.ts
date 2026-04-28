import { NextResponse } from "next/server";
import { askAI } from "@/lib/ai";
import { buildHourlyReport } from "@/lib/report";
import { sendTelegramMessage, validateTelegramSecret } from "@/lib/telegram";
import { getDefaultWatchlist } from "@/lib/watchlist";

function menuText() {
  return [
    "Menu Sobri Saham:",
    "/start",
    "/menu",
    "/watchlist",
    "/report",
    "/analisa BBCA",
    "/top",
    "/risk"
  ].join("\n");
}

export async function POST(request: Request) {
  if (!validateTelegramSecret(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = await request.json();
  const msg = update?.message;
  const chatId = msg?.chat?.id;
  const text: string = msg?.text || "";

  if (!chatId || !text) return NextResponse.json({ ok: true });

  let reply = "Perintah belum dikenali. Ketik /menu.";
  const lower = text.toLowerCase();

  if (lower.startsWith("/start")) reply = "Halo! Saya Sobri Saham. Ketik /menu untuk fitur tersedia.";
  else if (lower.startsWith("/menu")) reply = menuText();
  else if (lower.startsWith("/watchlist")) reply = `Watchlist default: ${getDefaultWatchlist().join(", ")}`;
  else if (lower.startsWith("/report")) reply = await buildHourlyReport();
  else if (lower.startsWith("/analisa")) {
    const symbol = text.split(" ")[1] || "BBCA";
    reply = await askAI(`Analisa ${symbol} dalam format aman.`);
  } else if (lower.startsWith("/top")) reply = "Gunakan dashboard web untuk top gainers/losers terbaru.";
  else if (lower.startsWith("/risk")) reply = "Prioritaskan manajemen risiko: batasi posisi, tunggu konfirmasi, dan hindari leverage berlebihan.";

  await sendTelegramMessage(reply, String(chatId));
  return NextResponse.json({ ok: true });
}
