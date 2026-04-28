import { NextResponse } from "next/server";
import { buildHourlyReport } from "@/lib/report";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret");
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  const expected = process.env.CRON_SECRET;

  if (!expected || (querySecret !== expected && bearer !== expected)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const report = await buildHourlyReport();
  const sent = await sendTelegramMessage(report);
  return NextResponse.json({ ok: sent, report });
}
