const BANNED_PHRASES = ["wajib beli", "pasti naik", "jamin profit"];

export const FINANCIAL_DISCLAIMER =
  "Analisis ini bukan nasihat keuangan profesional. Selalu lakukan riset mandiri dan gunakan manajemen risiko.";

export function sanitizeAdvice(text: string): string {
  let output = text;
  for (const phrase of BANNED_PHRASES) {
    output = output.replaceAll(new RegExp(phrase, "gi"), "tunggu konfirmasi");
  }
  if (!output.includes("bukan nasihat keuangan profesional")) {
    output = `${output}\n\n${FINANCIAL_DISCLAIMER}`;
  }
  return output;
}
