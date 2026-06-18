// CoinGecko Public API — libre, walang API key na kailangan.
// Docs: https://docs.coingecko.com/reference/coins-markets
const BASE_URL = 'https://api.coingecko.com/api/v3'

/**
 * Kunin ang top-N cryptocurrencies base sa market cap, kasama ang
 * current price at 24h price change — lahat sa isang request.
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
      throw new Error('Rate-limited ng CoinGecko. Maghintay lang ng ilang segundo at subukan ulit.')
    }
    throw new Error(`Hindi makuha ang prices (HTTP ${res.status}).`)
  }

  const raw = await res.json()

  // I-normalize ang shape para mas malinis gamitin sa UI components.
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
