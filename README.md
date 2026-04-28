# Sobri Saham

**Sobri Saham** adalah aplikasi full-stack untuk analisis saham Indonesia (IDX) dengan web chat, analisis berbasis AI, dan integrasi Telegram.

## Fitur Utama
- Dashboard pasar ringkas (gainers, losers, volume tinggi, kandidat, risiko tinggi)
- Detail saham (harga, MA20/MA50, RSI14, support/resistance, skor)
- Chat AI berbahasa Indonesia
- Watchlist default IDX
- Telegram webhook bot commands
- Laporan otomatis per jam via Vercel Cron
- Disclaimer finansial dan guardrail bahasa aman

## 1) Cara Install
```bash
npm install
npm run dev
```

Build production:
```bash
npm run build
npm run start
```

Lint:
```bash
npm run lint
```

## 2) Cara Isi `.env`
Copy contoh:
```bash
cp .env.example .env
```

Isi variabel:
- `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_WEBHOOK_SECRET`
- `STOCK_DATA_PROVIDER` (`yahoo` default)
- `STOCK_DATA_API_KEY`
- `CRON_SECRET`
- `NEXT_PUBLIC_APP_NAME`

> Jangan hardcode secret di source code.

## 3) Cara Deploy ke Vercel
1. Push repo ke Git provider.
2. Import project ke Vercel.
3. Isi semua Environment Variables di dashboard Vercel.
4. Deploy.
5. Pastikan cron aktif dari `vercel.json`.

## 4) Cara Set Telegram Webhook
Setelah deploy, pasang webhook:
```bash
curl -X POST "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
  -d "url=https://<domain-anda>/api/telegram/webhook" \
  -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
```

Command didukung:
- `/start`
- `/menu`
- `/watchlist`
- `/report`
- `/analisa BBCA`
- `/top`
- `/risk`

## 5) Cara Test Cron
Manual test endpoint:
```bash
curl "https://<domain-anda>/api/cron/hourly-report?secret=<CRON_SECRET>"
```

Alternatif security: kirim Bearer token via header Authorization bila query expansion Vercel tidak mendukung variabel di path.

## 6) Cara Tambah Saham Watchlist
Edit file `data/idx-watchlist.json` dan tambahkan simbol saham IDX baru.

## 7) Disclaimer Finansial
Sobri Saham tidak melakukan transaksi otomatis, tidak menjanjikan profit, dan tidak memberi instruksi absolut seperti “wajib beli”.

**Analisis ini bukan nasihat keuangan profesional. Selalu lakukan riset mandiri dan gunakan manajemen risiko.**
