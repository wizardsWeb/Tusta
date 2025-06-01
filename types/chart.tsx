export interface ChartPoint {
  time: number
  price: number
}

export interface TrendlineData {
  id: string
  startPoint: ChartPoint
  endPoint: ChartPoint
  color: string
  width: number
  style?: number
  createdAt: string
}

export interface CandlestickData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}
