function formatPrice(price) {
  if (price == null) return '—'
  if (price >= 1) {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    })
  }
  // Para sa coins na under $1 (hal. fractions of a cent), kailangan ng mas
  // marami pang decimal places para makita talaga ang value.
  return `$${price.toPrecision(4)}`
}

function formatChange(change) {
  if (change == null) return '—'
  const sign = change > 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}

export default function CoinCard({ coin, onSelect }) {
  const isUp = (coin.change24h ?? 0) >= 0

  return (
    <button
      type="button"
      onClick={() => onSelect(coin)}
      class="w-full flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5
             text-left transition active:scale-[0.98] active:bg-surface-2"
    >
      <img
        src={coin.image}
        alt={coin.name}
        width="36"
        height="36"
        class="h-9 w-9 shrink-0 rounded-full bg-surface-2"
        loading="lazy"
      />

      <div class="flex-1 min-w-0">
        <p class="font-display text-[15px] leading-tight truncate">{coin.name}</p>
        <p class="font-mono text-xs text-muted">{coin.symbol}</p>
      </div>

      <div class="text-right shrink-0">
        <p class="font-mono text-sm font-medium tabular-nums">{formatPrice(coin.price)}</p>
        <p class={`font-mono text-xs tabular-nums ${isUp ? 'text-up' : 'text-down'}`}>
          {formatChange(coin.change24h)}
        </p>
      </div>
    </button>
  )
}
