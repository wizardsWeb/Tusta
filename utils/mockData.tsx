import type { CandlestickData } from "@/types/chart"

export function generateMockData(timeframe = "1D"): CandlestickData[] {
  const now = Date.now()
  const data: CandlestickData[] = []

  // Generate different amounts of data based on timeframe
  const intervals = {
    "1D": { count: 390, interval: 60000 }, // 1 minute intervals
    "1W": { count: 35, interval: 86400000 }, // 1 day intervals
    "1M": { count: 30, interval: 86400000 }, // 1 day intervals
    "3M": { count: 90, interval: 86400000 }, // 1 day intervals
    "6M": { count: 180, interval: 86400000 }, // 1 day intervals
    "1Y": { count: 365, interval: 86400000 }, // 1 day intervals
  }

  const config = intervals[timeframe as keyof typeof intervals] || intervals["1D"]

  let price = 250 + Math.random() * 50 // Start around $250-300

  for (let i = 0; i < config.count; i++) {
    const time = Math.floor((now - (config.count - i) * config.interval) / 1000)

    // Generate realistic price movement
    const change = (Math.random() - 0.5) * 4 // +/- $2 max change
    price = Math.max(200, Math.min(400, price + change)) // Keep price between $200-400

    const open = price
    const volatility = Math.random() * 3 + 1 // 1-4 dollar range
    const high = open + Math.random() * volatility
    const low = open - Math.random() * volatility
    const close = low + Math.random() * (high - low)

    data.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
    })

    price = close
  }

  return data
}
