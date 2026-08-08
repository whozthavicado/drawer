# Drawer

Drawer — personal notes/prompts app with copy-to-clipboard, plus ZIP/image/audio-video conversion tools.

Deployed at: https://drawer-iota.vercel.app

## Env vars

Required (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Local dev

```bash
npm install
npm run dev
```

## Auth

Email + password (`supabase.auth.signInWithPassword`). Set or change your
password at `/account` while logged in.

## Tools

- `/tools/zip` — compress / decompress ZIP files
- `/tools/image` — convert images (PNG/JPEG/WebP)
- `/tools/media` — convert audio/video (ffmpeg.wasm, lazy-loaded)
