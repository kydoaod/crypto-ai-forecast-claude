const SENTIMENT_STYLES = {
  Bullish: 'text-up border-up/40 bg-up/10',
  Bearish: 'text-down border-down/40 bg-down/10',
  Neutral: 'text-gold border-gold/40 bg-gold/10',
}

export default function ForecastSheet({ coin, loading, error, result, onClose, onRetry }) {
  if (!coin) return null

  return (
    <div class="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop — tap to close */}
      <div class="absolute inset-0 bg-black/70 animate-fade-in" onClick={onClose} />

      {/* Sheet */}
      <div class="relative w-full max-w-md animate-slide-up rounded-t-3xl border border-border bg-surface px-5 pb-8 pt-4">
        <div class="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />

        <div class="mb-4 flex items-center gap-3">
          <img src={coin.image} alt={coin.name} class="h-10 w-10 rounded-full bg-surface-2" />
          <div class="min-w-0 flex-1">
            <p class="font-display text-base leading-tight">{coin.name}</p>
            <p class="font-mono text-xs text-muted">{coin.symbol} · AI Forecast</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Isara"
            class="rounded-full border border-border p-2 text-muted active:bg-surface-2"
          >
            ✕
          </button>
        </div>

        {/* "Terminal" readout panel — signature element ng app */}
        <div class="min-h-[150px] rounded-2xl border border-gold/30 bg-bg p-4">
          {loading && (
            <div class="font-mono text-sm text-muted">
              <p class="mb-2 text-gold">$ generating_forecast --coin="{coin.symbol}"</p>
              <p>
                Kinukwenta ng AI ang sentiment<span class="cursor-blink">▍</span>
              </p>
            </div>
          )}

          {!loading && error && (
            <div class="font-mono text-sm">
              <p class="mb-2 text-down">⚠ error:</p>
              <p class="mb-3 text-muted">{error}</p>
              <button
                type="button"
                onClick={onRetry}
                class="rounded-lg border border-gold/40 px-3 py-1.5 text-xs text-gold active:bg-gold/10"
              >
                Subukan ulit
              </button>
            </div>
          )}

          {!loading && !error && result && (
            <div class="font-mono">
              <span
                class={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                  SENTIMENT_STYLES[result.sentiment] ?? SENTIMENT_STYLES.Neutral
                }`}
              >
                <span class="h-1.5 w-1.5 rounded-full bg-current" />
                {result.sentiment}
              </span>
              <p class="mt-3 text-sm leading-relaxed text-text">{result.forecast}</p>
            </div>
          )}
        </div>

        <p class="mt-3 text-center text-[11px] text-muted">
          AI-generated lang ito — hindi ito financial advice.
        </p>
      </div>
    </div>
  )
}
