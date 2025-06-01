export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString()
}
