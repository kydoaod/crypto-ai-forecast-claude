// Google Gemini API (Generative Language API).
// Docs: https://ai.google.dev/gemini-api/docs
//
// SECURITY NOTE (importante para sa demo): kinakailangan dito ay direktang
// fetch mula sa browser para mabilis at walang backend/database — pero
// ibig sabihin VISIBLE ang API key sa browser network tab/bundle. Sapat na
// ito para sa isang demo, pero sa production, dapat itago ang key sa likod
// ng isang maliit na backend/proxy (hal. Cloudflare Worker) bago ilabas.
const GEMINI_MODEL = 'gemini-2.5-flash' // mabilis at libre-tier friendly
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

function buildPrompt(coinName, coinSymbol) {
  return `Ikaw ay isang crypto market analyst. Sumagot ka PARA SA ${coinName} (${coinSymbol}).

Sumagot ka LAMANG ng isang valid na JSON object — walang paunang salita, walang markdown, walang code fences. Eksaktong format:
{"sentiment": "Bullish", "forecast": "dalawang pangungusap na Taglish market forecast at sentiment"}

Ang "sentiment" ay dapat isa lamang sa: "Bullish", "Bearish", o "Neutral".
Ang "forecast" ay eksaktong 2 pangungusap, parang mensahe mula sa isang trader sa kaibigan — direkta at madaling intindihin, walang disclaimer.`
}

/**
 * Humingi ng AI-generated market forecast + sentiment para sa isang coin.
 * Returns: { sentiment: 'Bullish' | 'Bearish' | 'Neutral', forecast: string }
 */
export async function getForecast(coinName, coinSymbol) {
  if (!API_KEY) {
    throw new Error('Walang VITE_GEMINI_API_KEY. Lagay ito sa .env file (tingnan ang .env.example).')
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
          temperature: 0.7,
          maxOutputTokens: 200,
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
  // Linisin kung sakaling nilagyan ng model ng ```json code fences.
  const cleaned = rawText.replace(/```json|```/g, '').trim()

  try {
    const parsed = JSON.parse(cleaned)
    const sentiment = ['Bullish', 'Bearish', 'Neutral'].includes(parsed.sentiment)
      ? parsed.sentiment
      : 'Neutral'
    return {
      sentiment,
      forecast: parsed.forecast || 'Walang malinaw na sagot na natanggap mula sa AI.',
    }
  } catch {
    // Fallback kung sakaling hindi clean JSON ang ibinalik ng model —
    // ipakita pa rin ang raw text sa user kesa mag-crash ang UI.
    return {
      sentiment: 'Neutral',
      forecast: cleaned || 'Walang sagot na natanggap mula sa AI.',
    }
  }
}
