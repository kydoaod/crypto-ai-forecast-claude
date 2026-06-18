// CoinGecko Public API — free, no API key required.
// Docs: https://docs.coingecko.com/reference/coins-markets
const BASE_URL = 'https://api.coingecko.com/api/v3'

/**
 * Fetch the top-N cryptocurrencies by market cap, including current price
 * and 24h price change — all in a single request.
 */
export async function fetchTopCoins(limit = 5) {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: String(limit),
    page: '1',
    sparkline: 'false',
    price_change_percentage: '24h',
  })

  const res = await fetch(`${BASE_URL}/coins/markets?${params.toString()}`)

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error('CoinGecko rate limit exceeded. Wait a few seconds and try again.')
    }
    throw new Error(`Unable to fetch prices (HTTP ${res.status}).`)
  }

  const raw = await res.json()

  // Normalize the response shape for cleaner UI integration.
  return raw.map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol?.toUpperCase() ?? '',
    image: coin.image,
    price: coin.current_price,
    change24h: coin.price_change_percentage_24h,
    marketCap: coin.market_cap,
    rank: coin.market_cap_rank,
  }))
}
