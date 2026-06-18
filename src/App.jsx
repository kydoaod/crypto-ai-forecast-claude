import { useState, useEffect, useCallback } from 'preact/hooks'
import { fetchTopCoins } from './lib/coingecko'
import { getForecast } from './lib/gemini'
import CoinCard from './components/CoinCard'
import ForecastSheet from './components/ForecastSheet'

export default function App() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [selectedCoin, setSelectedCoin] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [forecastError, setForecastError] = useState(null)

  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // --- Network status (para visible ang offline-fallback sa demo) ---
  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // --- Load top 5 coins ---
  const loadCoins = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const data = await fetchTopCoins(5)
      setCoins(data)
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCoins()
  }, [loadCoins])

  // --- AI forecast on coin tap ---
  const requestForecast = useCallback(async (coin) => {
    setForecastLoading(true)
    setForecastError(null)
    setForecast(null)
    try {
      const result = await getForecast(coin.name, coin.symbol)
      setForecast(result)
    } catch (err) {
      setForecastError(err.message)
    } finally {
      setForecastLoading(false)
    }
  }, [])

  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin)
    requestForecast(coin)
  }

  const closeSheet = () => setSelectedCoin(null)

  return (
    <div class="min-h-screen bg-bg font-body text-text">
      {!isOnline && (
        <div class="bg-gold/15 px-4 py-2 text-center text-xs font-medium text-gold">
          ⚠ Offline mode — pinapakita ang huling na-cache na datos.
        </div>
      )}

      <header class="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg/85 px-5 py-4 backdrop-blur">
        <div>
          <h1 class="font-display text-xl tracking-tight">Crypto AI Forecaster</h1>
          <p class="text-xs text-muted">Live prices · AI sentiment</p>
        </div>
        <span class="flex items-center gap-1.5 text-xs text-up">
          <span class="h-1.5 w-1.5 rounded-full bg-up animate-pulse" />
          Live
        </span>
      </header>

      <main class="mx-auto max-w-md space-y-3 px-5 pb-10 pt-4">
        {loading && <SkeletonList />}

        {!loading && loadError && (
          <div class="rounded-2xl border border-down/40 bg-surface p-4 text-sm">
            <p class="text-down">Hindi na-load ang prices.</p>
            <p class="mt-1 text-muted">{loadError}</p>
            <button
              type="button"
              onClick={loadCoins}
              class="mt-3 rounded-lg border border-gold/40 px-3 py-1.5 text-xs text-gold active:bg-gold/10"
            >
              Subukan ulit
            </button>
          </div>
        )}

        {!loading &&
          !loadError &&
          coins.map((coin) => <CoinCard key={coin.id} coin={coin} onSelect={handleSelectCoin} />)}
      </main>

      <ForecastSheet
        coin={selectedCoin}
        loading={forecastLoading}
        error={forecastError}
        result={forecast}
        onClose={closeSheet}
        onRetry={() => requestForecast(selectedCoin)}
      />
    </div>
  )
}

function SkeletonList() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} class="h-[68px] animate-pulse rounded-2xl bg-surface" />
      ))}
    </>
  )
}
