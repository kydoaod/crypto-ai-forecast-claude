// Google Gemini API (Generative Language API).
// Docs: https://ai.google.dev/gemini-api/docs
//
// SECURITY NOTE (important for demo): this implementation fetches from the browser
// directly for speed and zero backend/database. That means the API key is visible
// in browser network requests/bundles. This is acceptable for a demo, but in
// production the key should live behind a small backend/proxy (e.g. Cloudflare Worker).
const GEMINI_MODEL = 'gemini-2.5-flash' // fast and free-tier friendly
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

function buildPrompt(coinName, coinSymbol) {
  return `You are a crypto market analyst. Answer FOR ${coinName} (${coinSymbol}).

Respond ONLY with a valid JSON object — no leading text, no markdown, no code fences. Exact format:
{"sentiment": "Bullish", "forecast": "two-sentence market forecast with sentiment"}

The "sentiment" field must be one of: "Bullish", "Bearish", or "Neutral".
The "forecast" field must be exactly 2 sentences, like a message from a trader to a friend — direct and easy to understand, with no disclaimer.`
}

/**
 * Request an AI-generated market forecast + sentiment for a coin.
 * Returns: { sentiment: 'Bullish' | 'Bearish' | 'Neutral', forecast: string }
 */
export async function getForecast(coinName, coinSymbol) {
  if (!API_KEY) {
    throw new Error('Missing VITE_GEMINI_API_KEY. Add it to your .env file (see .env.example).')
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: buildPrompt(coinName, coinSymbol) }],
          },
        ],
        generationConfig: {
          temperature: 0.0,
          maxOutputTokens: 1024,
        },
      }),
    }
  )

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Gemini API error (HTTP ${res.status}). ${detail.slice(0, 200)}`)
  }

  const data = await res.json()
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  return parseForecastResponse(rawText)
}

function parseForecastResponse(rawText) {
  // Clean up in case the model wraps the JSON with ```json code fences.
  const cleaned = rawText.replace(/```json|```/g, '').trim()

  try {
    const parsed = JSON.parse(cleaned)
    const sentiment = ['Bullish', 'Bearish', 'Neutral'].includes(parsed.sentiment)
      ? parsed.sentiment
      : 'Neutral'
    return {
      sentiment,
      forecast: parsed.forecast || 'No clear answer was received from the AI.',
    }
  } catch {
    // Fallback if the model does not return clean JSON —
    // show the raw text instead of letting the UI crash.
    return {
      sentiment: 'Neutral',
      forecast: cleaned || 'No response was received from the AI.',
    }
  }
}
