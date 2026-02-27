// Unified types for multi-exchange chart support

export type ExchangeId = 'BINANCE' | 'BYBIT' | 'BITGET'
export type MarketType = 'spot' | 'futures'

export interface UnifiedSymbolInfo {
  symbol: string          // Exchange-native format: "BTCUSDT"
  baseAsset: string       // "BTC"
  quoteAsset: string      // "USDT"
  exchange: ExchangeId
  marketType: MarketType
  pricePrecision: number
  quantityPrecision: number
  displaySymbol: string   // "BTC/USDT" (spot) or "BTC/USDT.P" (futures perpetual)
  fullName: string        // "BINANCE:BTC/USDT" or "BINANCE:BTC/USDT.P"
}

export interface UnifiedKline {
  time: number   // open time (ms)
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface ExchangeClient {
  readonly exchangeId: ExchangeId
  getSymbols(marketType?: MarketType): Promise<UnifiedSymbolInfo[]>
  fetchKlines(
    symbol: string,
    marketType: MarketType,
    interval: string,
    startTime?: number,
    endTime?: number,
    limit?: number
  ): Promise<UnifiedKline[]>
  subscribeKline(
    symbol: string,
    marketType: MarketType,
    interval: string,
    onKline: (kline: UnifiedKline & { isFinal: boolean }) => void
  ): () => void
  mapResolution(tvResolution: string): string
}

/**
 * Parse fullName like "BINANCE:BTC/USDT" or "BINANCE:BTC/USDT.P"
 * → { exchange, displaySymbol, rawSymbol, marketType }
 */
export function parseFullSymbol(fullName: string): {
  exchange: ExchangeId
  displaySymbol: string
  rawSymbol: string
  marketType: MarketType
} {
  const parts = fullName.split(':')
  if (parts.length === 2) {
    const exchange = parts[0] as ExchangeId
    const displaySymbol = parts[1]
    const isFutures = displaySymbol.endsWith('.P')
    const cleanDisplay = isFutures ? displaySymbol.slice(0, -2) : displaySymbol
    return {
      exchange,
      displaySymbol,
      rawSymbol: cleanDisplay.replace('/', '').toUpperCase(),
      marketType: isFutures ? 'futures' : 'spot',
    }
  }
  // Fallback: assume Binance spot
  const isFutures = fullName.endsWith('.P')
  const cleanName = isFutures ? fullName.slice(0, -2) : fullName
  return {
    exchange: 'BINANCE',
    displaySymbol: fullName,
    rawSymbol: cleanName.replace('/', '').toUpperCase(),
    marketType: isFutures ? 'futures' : 'spot',
  }
}

/** Build full symbol name */
export function buildFullSymbol(exchange: ExchangeId, baseDisplay: string, marketType: MarketType): string {
  const suffix = marketType === 'futures' ? '.P' : ''
  return `${exchange}:${baseDisplay}${suffix}`
}
