// Bitget v2 public API client

import type { ExchangeClient, UnifiedSymbolInfo, UnifiedKline, MarketType } from './types'

const REST_BASE = 'https://api.bitget.com'
const WS_URL = 'wss://ws.bitget.com/v2/ws/public'

// --- Resolution mapping ---
// Bitget spot granularity: 1min,5min,15min,30min,1h,4h,6h,12h,1day,1week,1M
// Bitget futures granularity: 1m,3m,5m,15m,30m,1H,4H,6H,12H,1D,1W,1M

const SPOT_RESOLUTION_MAP: Record<string, string> = {
  '1': '1min', '3': '5min', '5': '5min', '15': '15min', '30': '30min',
  '60': '1h', '120': '4h', '240': '4h', '360': '6h', '720': '12h',
  '1D': '1day', 'D': '1day', '1W': '1week', 'W': '1week', '1M': '1M', 'M': '1M',
}

const FUTURES_RESOLUTION_MAP: Record<string, string> = {
  '1': '1m', '3': '5m', '5': '5m', '15': '15m', '30': '30m',
  '60': '1H', '120': '4H', '240': '4H', '360': '6H', '720': '12H',
  '1D': '1D', 'D': '1D', '1W': '1W', 'W': '1W', '1M': '1M', 'M': '1M',
}

// Channel name mapping for WS (same for spot and futures)
const WS_CHANNEL_MAP: Record<string, string> = {
  '1min': 'candle1m', '5min': 'candle5m', '15min': 'candle15m', '30min': 'candle30m',
  '1h': 'candle1H', '4h': 'candle4H', '6h': 'candle6H', '12h': 'candle12H',
  '1day': 'candle1D', '1week': 'candle1W', '1M': 'candle1M',
  // Futures format keys (also map to same WS channels)
  '1m': 'candle1m', '5m': 'candle5m', '15m': 'candle15m', '30m': 'candle30m',
  '1H': 'candle1H', '4H': 'candle4H', '6H': 'candle6H', '12H': 'candle12H',
  '1D': 'candle1D', '1W': 'candle1W',
}

// --- Symbol cache ---

interface SymbolCache {
  data: UnifiedSymbolInfo[]
  timestamp: number
}

const cache: Record<string, SymbolCache> = {}
const CACHE_TTL = 60 * 60 * 1000

function countDecimals(value: string): number {
  if (!value || value === '0') return 2
  const parts = value.split('.')
  if (parts.length < 2) return 0
  const decimals = parts[1]
  for (let i = 0; i < decimals.length; i++) {
    if (decimals[i] !== '0') return i + 1
  }
  return decimals.length
}

async function fetchSpotSymbols(): Promise<UnifiedSymbolInfo[]> {
  const cacheKey = 'bitget_spot'
  const now = Date.now()
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data
  }

  const res = await fetch(`${REST_BASE}/api/v2/spot/public/symbols`)
  if (!res.ok) throw new Error(`Bitget spot symbols error: ${res.status}`)

  const json = await res.json()
  const list = json.data || []

  const symbols: UnifiedSymbolInfo[] = list
    .filter((item: { status: string }) => item.status === 'online')
    .map((item: { symbol: string; baseCoin: string; quoteCoin: string; pricePrecision: string; quantityPrecision: string }) => {
      const display = `${item.baseCoin}/${item.quoteCoin}`
      return {
        symbol: item.symbol,
        baseAsset: item.baseCoin,
        quoteAsset: item.quoteCoin,
        exchange: 'BITGET' as const,
        marketType: 'spot' as const,
        pricePrecision: parseInt(item.pricePrecision) || 2,
        quantityPrecision: parseInt(item.quantityPrecision) || 4,
        displaySymbol: display,
        fullName: `BITGET:${display}`,
      }
    })

  cache[cacheKey] = { data: symbols, timestamp: now }
  return symbols
}

async function fetchFuturesSymbols(): Promise<UnifiedSymbolInfo[]> {
  const cacheKey = 'bitget_futures'
  const now = Date.now()
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data
  }

  const res = await fetch(`${REST_BASE}/api/v2/mix/market/contracts?productType=USDT-FUTURES`)
  if (!res.ok) throw new Error(`Bitget futures symbols error: ${res.status}`)

  const json = await res.json()
  const list = json.data || []

  const symbols: UnifiedSymbolInfo[] = list
    .filter((item: { symbolStatus: string }) => item.symbolStatus === 'normal')
    .map((item: { symbol: string; baseCoin: string; quoteCoin: string; pricePlace: string; volumePlace: string }) => {
      const base = `${item.baseCoin}/${item.quoteCoin}`
      return {
        symbol: item.symbol,
        baseAsset: item.baseCoin,
        quoteAsset: item.quoteCoin,
        exchange: 'BITGET' as const,
        marketType: 'futures' as const,
        pricePrecision: parseInt(item.pricePlace) || 2,
        quantityPrecision: parseInt(item.volumePlace) || 4,
        displaySymbol: `${base}.P`,
        fullName: `BITGET:${base}.P`,
      }
    })

  cache[cacheKey] = { data: symbols, timestamp: now }
  return symbols
}

// --- Klines ---

async function fetchBitgetKlines(
  symbol: string,
  marketType: MarketType,
  granularity: string,
  startTime?: number,
  endTime?: number,
  limit: number = 1000
): Promise<UnifiedKline[]> {
  const isSpot = marketType === 'spot'
  const path = isSpot
    ? '/api/v2/spot/market/candles'
    : '/api/v2/mix/market/candles'

  const params = new URLSearchParams({
    symbol,
    granularity,
    limit: String(Math.min(limit, 1000)),
  })
  if (!isSpot) params.set('productType', 'USDT-FUTURES')
  if (startTime) params.set('startTime', String(startTime))
  if (endTime) params.set('endTime', String(endTime))

  const res = await fetch(`${REST_BASE}${path}?${params}`)
  if (!res.ok) throw new Error(`Bitget kline error: ${res.status}`)

  const json = await res.json()
  const list = json.data || []

  // Bitget returns [timestamp, open, high, low, close, volume, ...] in chronological order (oldest first)
  return list
    .map((k: string[]) => ({
      time: parseInt(k[0]),
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }))
}

// --- WebSocket ---

interface WsSub {
  ws: WebSocket | null
  isClosed: boolean
  reconnectTimer?: ReturnType<typeof setTimeout>
  reconnectDelay: number
  pingTimer?: ReturnType<typeof setInterval>
}

function subscribeBitgetKline(
  symbol: string,
  marketType: MarketType,
  granularity: string,
  onKline: (kline: UnifiedKline & { isFinal: boolean }) => void
): () => void {
  const instType = marketType === 'spot' ? 'SPOT' : 'USDT-FUTURES'
  const channel = WS_CHANNEL_MAP[granularity] || 'candle1H'

  const sub: WsSub = { ws: null, isClosed: false, reconnectDelay: 1000 }

  function connect() {
    if (sub.isClosed) return

    const ws = new WebSocket(WS_URL)
    sub.ws = ws

    ws.onopen = () => {
      sub.reconnectDelay = 1000
      ws.send(JSON.stringify({
        op: 'subscribe',
        args: [{ instType, channel, instId: symbol }],
      }))
      // Bitget requires ping every 30s
      sub.pingTimer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send('ping')
      }, 30000)
    }

    ws.onmessage = (event) => {
      if (event.data === 'pong') return
      try {
        const msg = JSON.parse(event.data)
        if (!msg.data?.length) return
        const d = msg.data[0]
        // d = [timestamp, open, high, low, close, volume, ...]
        onKline({
          time: parseInt(d[0]),
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
          volume: parseFloat(d[5]),
          isFinal: false, // Bitget doesn't provide confirm flag
        })
      } catch { /* ignore */ }
    }

    ws.onclose = () => {
      if (sub.pingTimer) clearInterval(sub.pingTimer)
      if (sub.isClosed) return
      sub.reconnectTimer = setTimeout(() => {
        sub.reconnectDelay = Math.min(sub.reconnectDelay * 2, 30000)
        connect()
      }, sub.reconnectDelay)
    }

    ws.onerror = () => ws.close()
  }

  connect()

  return () => {
    sub.isClosed = true
    if (sub.pingTimer) clearInterval(sub.pingTimer)
    if (sub.reconnectTimer) clearTimeout(sub.reconnectTimer)
    if (sub.ws && sub.ws.readyState <= WebSocket.OPEN) sub.ws.close()
  }
}

// --- Exported client ---

export const bitgetClient: ExchangeClient = {
  exchangeId: 'BITGET',

  async getSymbols(marketType?: MarketType): Promise<UnifiedSymbolInfo[]> {
    if (marketType === 'spot') return fetchSpotSymbols()
    if (marketType === 'futures') return fetchFuturesSymbols()
    const [spot, futures] = await Promise.all([
      fetchSpotSymbols(),
      fetchFuturesSymbols(),
    ])
    return [...spot, ...futures]
  },

  async fetchKlines(symbol, marketType, interval, startTime?, endTime?, limit?) {
    // interval here is tvResolution (raw from TradingView), map based on marketType
    const resMap = marketType === 'futures' ? FUTURES_RESOLUTION_MAP : SPOT_RESOLUTION_MAP
    const granularity = resMap[interval] || (marketType === 'futures' ? '1H' : '1h')
    return fetchBitgetKlines(symbol, marketType, granularity, startTime, endTime, limit)
  },

  subscribeKline(symbol, marketType, interval, onKline) {
    // interval here is tvResolution, map based on marketType
    const resMap = marketType === 'futures' ? FUTURES_RESOLUTION_MAP : SPOT_RESOLUTION_MAP
    const granularity = resMap[interval] || (marketType === 'futures' ? '1H' : '1h')
    return subscribeBitgetKline(symbol, marketType, granularity, onKline)
  },

  mapResolution(tvResolution: string): string {
    // Default mapping (spot format) — actual conversion happens in fetchKlines/subscribeKline
    return tvResolution
  },
}
