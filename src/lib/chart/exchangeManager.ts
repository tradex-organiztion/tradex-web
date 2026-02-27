// Unified exchange manager — orchestrates Binance, Bybit, Bitget

import type { ExchangeClient, ExchangeId, MarketType, UnifiedSymbolInfo, UnifiedKline } from './types'
import { parseFullSymbol } from './types'
import { binanceClient } from './binanceAdapter'
import { bybitClient } from './bybitClient'
import { bitgetClient } from './bitgetClient'

// --- Client registry ---

const clients: Record<ExchangeId, ExchangeClient> = {
  BINANCE: binanceClient,
  BYBIT: bybitClient,
  BITGET: bitgetClient,
}

function getClient(exchange: ExchangeId): ExchangeClient {
  return clients[exchange]
}

// --- Unified symbol cache ---

interface AllSymbolsCache {
  data: UnifiedSymbolInfo[]
  timestamp: number
}

let allSymbolsCache: AllSymbolsCache | null = null
const CACHE_TTL = 60 * 60 * 1000

/**
 * Get all symbols from all exchanges. Results are cached for 1 hour.
 * Optional filters for exchange and marketType.
 */
export async function getAllSymbols(
  exchange?: ExchangeId,
  marketType?: MarketType
): Promise<UnifiedSymbolInfo[]> {
  // If requesting specific exchange, delegate directly
  if (exchange) {
    return getClient(exchange).getSymbols(marketType)
  }

  // Fetch all if cache is stale
  const now = Date.now()
  if (!allSymbolsCache || now - allSymbolsCache.timestamp > CACHE_TTL) {
    const results = await Promise.allSettled([
      binanceClient.getSymbols(),
      bybitClient.getSymbols(),
      bitgetClient.getSymbols(),
    ])

    const allSymbols: UnifiedSymbolInfo[] = []
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allSymbols.push(...result.value)
      }
    }

    allSymbolsCache = { data: allSymbols, timestamp: now }
  }

  let data = allSymbolsCache.data
  if (marketType) {
    data = data.filter((s) => s.marketType === marketType)
  }
  return data
}

/**
 * Search symbols with query, exchange filter, and market type filter.
 * Returns paginated results.
 */
export async function searchSymbols(
  query: string,
  options?: {
    exchange?: ExchangeId
    marketType?: MarketType
    offset?: number
    limit?: number
  }
): Promise<{ symbols: UnifiedSymbolInfo[]; total: number }> {
  const { exchange, marketType, offset = 0, limit = 100 } = options || {}

  const all = await getAllSymbols(exchange, marketType)
  const q = query.toUpperCase().trim()

  let filtered: UnifiedSymbolInfo[]

  if (!q) {
    // No query: show popular pairs first (USDT pairs, then BTC pairs)
    filtered = sortByPopularity(all)
  } else {
    filtered = all.filter(
      (s) =>
        s.symbol.includes(q) ||
        s.baseAsset.includes(q) ||
        s.quoteAsset.includes(q) ||
        s.displaySymbol.includes(q)
    )
    // Prioritize exact base asset matches
    filtered.sort((a, b) => {
      const aExact = a.baseAsset === q ? 0 : 1
      const bExact = b.baseAsset === q ? 0 : 1
      if (aExact !== bExact) return aExact - bExact
      // Then USDT pairs first
      const aUsdt = a.quoteAsset === 'USDT' ? 0 : 1
      const bUsdt = b.quoteAsset === 'USDT' ? 0 : 1
      return aUsdt - bUsdt
    })
  }

  return {
    symbols: filtered.slice(offset, offset + limit),
    total: filtered.length,
  }
}

function sortByPopularity(symbols: UnifiedSymbolInfo[]): UnifiedSymbolInfo[] {
  // Top coins to prioritize
  const topCoins = new Set([
    'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'DOT', 'MATIC',
    'LINK', 'SHIB', 'UNI', 'LTC', 'ATOM', 'FIL', 'ARB', 'OP', 'APT', 'SUI',
    'NEAR', 'AAVE', 'TRX', 'BCH', 'ETC', 'PEPE', 'WIF', 'FET', 'INJ', 'RNDR',
  ])

  return [...symbols].sort((a, b) => {
    // USDT pairs first
    const aUsdt = a.quoteAsset === 'USDT' ? 0 : 1
    const bUsdt = b.quoteAsset === 'USDT' ? 0 : 1
    if (aUsdt !== bUsdt) return aUsdt - bUsdt

    // Top coins first
    const aTop = topCoins.has(a.baseAsset) ? 0 : 1
    const bTop = topCoins.has(b.baseAsset) ? 0 : 1
    if (aTop !== bTop) return aTop - bTop

    // Alphabetical
    return a.baseAsset.localeCompare(b.baseAsset)
  })
}

// --- Data fetching ---

export async function fetchKlines(
  fullSymbol: string,
  _marketType: MarketType,
  tvResolution: string,
  startTime?: number,
  endTime?: number,
  limit?: number
): Promise<UnifiedKline[]> {
  const { exchange, rawSymbol, marketType } = parseFullSymbol(fullSymbol)
  const client = getClient(exchange)
  const interval = client.mapResolution(tvResolution)
  return client.fetchKlines(rawSymbol, marketType, interval, startTime, endTime, limit)
}

export function subscribeKline(
  fullSymbol: string,
  _marketType: MarketType,
  tvResolution: string,
  onKline: (kline: UnifiedKline & { isFinal: boolean }) => void
): () => void {
  const { exchange, rawSymbol, marketType } = parseFullSymbol(fullSymbol)
  const client = getClient(exchange)
  const interval = client.mapResolution(tvResolution)
  return client.subscribeKline(rawSymbol, marketType, interval, onKline)
}

/**
 * Find symbol info by fullName (e.g. "BINANCE:BTC/USDT")
 */
export async function resolveSymbolInfo(fullName: string): Promise<UnifiedSymbolInfo | null> {
  const { exchange, rawSymbol, marketType } = parseFullSymbol(fullName)
  const symbols = await getClient(exchange).getSymbols(marketType)
  return symbols.find((s) => s.symbol === rawSymbol) || null
}

/**
 * Preload all exchange symbols in the background.
 * Call this early to avoid delay when user opens search.
 */
export function preloadSymbols(): void {
  getAllSymbols().catch(() => { /* silent preload */ })
}
