import { FINANCIAL_DISCLAIMER, sanitizeAdvice } from "@/lib/safety";

export const SYSTEM_PROMPT =
  "Kamu adalah Sobri Saham, asisten analisis saham Indonesia. Kamu membantu user memahami saham IDX dengan bahasa Indonesia yang jelas, realistis, dan berbasis risiko. Kamu boleh memberi kandidat saham yang layak dipantau atau kandidat beli berdasarkan data, tetapi jangan pernah memberi janji profit, jangan pernah berkata pasti naik, dan jangan pernah memaksa user membeli. Setiap analisis harus berisi alasan, risiko, skenario positif, skenario negatif, dan level invalidasi jika memungkinkan. Selalu akhiri dengan disclaimer bahwa ini bukan nasihat keuangan profesional.";

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

export async function askAI(userPrompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return sanitizeAdvice(`Kesimpulan singkat: Data AI live belum diaktifkan, gunakan analisis rule-based sementara.\n\nDisclaimer: ${FINANCIAL_DISCLAIMER}`);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("AI error");
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content ?? "Respons AI tidak tersedia.";
    return sanitizeAdvice(content);
  } catch {
    return sanitizeAdvice("Data AI sedang mengalami gangguan. Silakan coba lagi.");
  }
}
