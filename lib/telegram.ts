export async function sendTelegramMessage(text: string, chatId?: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const fallbackChatId = process.env.TELEGRAM_CHAT_ID;
  const targetChat = chatId || fallbackChatId;
  if (!token || !targetChat) return false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: targetChat, text }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

export function validateTelegramSecret(request: Request): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) return true;
  return request.headers.get("x-telegram-bot-api-secret-token") === expected;
}
