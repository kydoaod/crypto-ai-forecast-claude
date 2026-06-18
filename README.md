# Crypto AI Forecaster

Demo PWA — Preact + Vite + Tailwind v4. Nagpapakita ng live top-5 crypto prices
(CoinGecko) at AI-generated 2-sentence market sentiment forecast (Google Gemini)
kapag pinindot ang isang coin. Walang database/backend — pure client-side fetch.

## Setup

```bash
npm install
cp .env.example .env
# i-edit ang .env, ilagay ang sariling GEMINI_API_KEY mo
npm run dev
```

Buksan ang URL na lalabas sa terminal (default `http://localhost:5173`).

## Build para sa production / PWA install testing

```bash
npm run build
npm run preview
```

`npm run preview` ang dapat gamitin para subukan ang "Add to Home Screen" at
offline mode nang totoo — kasi naka-on lang ang service worker sa production
build (o sa dev gamit ang `devOptions.enabled: true` na nakalagay na sa
`vite.config.js`).

## Saan kunin ang Gemini API key

1. Pumunta sa https://aistudio.google.com/app/apikey
2. Mag-sign in gamit ang Google account, gumawa ng API key (libre).
3. I-paste sa `.env` bilang `VITE_GEMINI_API_KEY`.

## Tech stack

- Preact + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`, walang separate config file kailangan)
- `vite-plugin-pwa` — auto manifest + service worker + offline app-shell fallback
- CoinGecko Public API (free, no key) — top 5 coins by market cap
- Google Gemini API (`gemini-2.5-flash`) — AI sentiment forecast
