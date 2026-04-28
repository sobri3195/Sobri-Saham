# Security Policy

## Reporting Secrets Exposure

Jika token, API key, atau credential pernah dibagikan (chat, issue, commit, screenshot, dll), anggap **sudah bocor** dan lakukan langkah berikut:

1. **Revoke/rotate** semua credential yang terekspos.
2. Update credential baru di provider masing-masing.
3. Simpan credential hanya di environment variable (`.env`, Vercel Environment Variables, atau secret manager).
4. Jangan commit file berisi secret ke repository.

## Supported Secrets Handling

- Gunakan `.env.example` hanya sebagai template tanpa nilai rahasia.
- File `.env` sudah di-ignore oleh Git dan harus dipakai untuk local development.
- Jangan menaruh secret di source code, README, PR description, maupun log.

## Recommended Incident Checklist

- [ ] Rotate provider key/token (OpenAI, Telegram, Twilio, AWS, dll.)
- [ ] Audit log akses provider setelah rotasi.
- [ ] Hapus secret yang sempat diposting di kanal publik.
- [ ] Pastikan aplikasi sudah memakai key baru.
