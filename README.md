# Crypto AI Forecaster

Demo PWA — Preact + Vite + Tailwind v4. Displays live top-5 crypto prices
(CoinGecko) and AI-generated 2-sentence market sentiment forecasts (Google Gemini)
when a coin is tapped. No database/backend — pure client-side fetch.

## Setup

```bash
npm install
cp .env.example .env
# edit .env and add your own GEMINI_API_KEY
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:5173`).

## Build for production / PWA install testing

```bash
npm run build
npm run preview
```

Use `npm run preview` to test Add to Home Screen and
real offline mode — the service worker is only enabled in production
builds (or in dev when `devOptions.enabled: true` is enabled in
`vite.config.js`).

## Where to get the Gemini API key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with a Google account and create an API key (free).
3. Paste it in `.env` as `VITE_GEMINI_API_KEY`.

## Tech stack

- Preact + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`, no separate config file needed)
- `vite-plugin-pwa` — auto manifest + service worker + offline app-shell fallback
- CoinGecko Public API (free, no key) — top 5 coins by market cap
- Google Gemini API (`gemini-2.5-flash`) — AI sentiment forecast
