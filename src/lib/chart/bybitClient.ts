// Bybit v5 public API client

import type { ExchangeClient, UnifiedSymbolInfo, UnifiedKline, MarketType } from './types'

const REST_BASE = 'https://api.bybit.com'
const WS_SPOT = 'wss://stream.bybit.com/v5/public/spot'
const WS_LINEAR = 'wss://stream.bybit.com/v5/public/linear'

// --- Resolution mapping ---

const RESOLUTION_MAP: Record<string, string> = {
  '1': '1', '3': '3', '5': '5', '15': '15', '30': '30',
  '60': '60', '120': '120', '240': '240', '360': '360', '720': '720',
  '1D': 'D', 'D': 'D', '1W': 'W', 'W': 'W', '1M': 'M', 'M': 'M',
}

// --- Symbol cache ---

interface SymbolCache {
  data: UnifiedSymbolInfo[]
  timestamp: number
}

const cache: Record<string, SymbolCache> = {}
const CACHE_TTL = 60 * 60 * 1000

async function fetchInstruments(category: 'spot' | 'linear'): Promise<UnifiedSymbolInfo[]> {
  const cacheKey = `bybit_${category}`
  const now = Date.now()
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data
  }

  const marketType: MarketType = category === 'spot' ? 'spot' : 'futures'
  const symbols: UnifiedSymbolInfo[] = []
  let cursor = ''

  // Bybit paginates with cursor
  do {
    const params = new URLSearchParams({ category, limit: '1000' })
    if (cursor) params.set('cursor', cursor)

    const res = await fetch(`${REST_BASE}/v5/market/instruments-info?${params}`)
    if (!res.ok) break

    const json = await res.json()
    const list = json.result?.list || []
    cursor = json.result?.nextPageCursor || ''

    for (const item of list) {
      if (item.status !== 'Trading') continue
      // For futures, only include perpetual contracts (skip dated futures)
      if (category === 'linear' && item.contractType !== 'LinearPerpetual') continue

      const base = item.baseCoin || ''
      const quote = item.quoteCoin || ''
      const display = `${base}/${quote}`

      const suffix = marketType === 'futures' ? '.P' : ''
      symbols.push({
        symbol: item.symbol,
        baseAsset: base,
        quoteAsset: quote,
        exchange: 'BYBIT',
        marketType,
        pricePrecision: countDecimals(item.priceFilter?.tickSize || '0.01'),
        quantityPrecision: countDecimals(item.lotSizeFilter?.basePrecision || item.lotSizeFilter?.qtyStep || '0.00001'),
        displaySymbol: `${display}${suffix}`,
        fullName: `BYBIT:${display}${suffix}`,
      })
    }
  } while (cursor)

  cache[cacheKey] = { data: symbols, timestamp: now }
  return symbols
}

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

// --- Klines ---

async function fetchBybitKlines(
  symbol: string,
  category: 'spot' | 'linear',
  interval: string,
  startTime?: number,
  endTime?: number,
  limit: number = 1000
): Promise<UnifiedKline[]> {
  const params = new URLSearchParams({
    category,
    symbol,
    interval,
    limit: String(Math.min(limit, 1000)),
  })
  if (startTime) params.set('start', String(startTime))
  if (endTime) params.set('end', String(endTime))

  const res = await fetch(`${REST_BASE}/v5/market/kline?${params}`)
  if (!res.ok) throw new Error(`Bybit kline error: ${res.status}`)

  const json = await res.json()
  const list = json.result?.list || []

  // Bybit returns newest first, reverse to chronological
  return list
    .map((k: string[]) => ({
      time: parseInt(k[0]),
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }))
    .reverse()
}

// --- WebSocket ---

interface WsSub {
  ws: WebSocket | null
  isClosed: boolean
  reconnectTimer?: ReturnType<typeof setTimeout>
  reconnectDelay: number
  pingTimer?: ReturnType<typeof setInterval>
}

function subscribeBybitKline(
  symbol: string,
  category: 'spot' | 'linear',
  interval: string,
  onKline: (kline: UnifiedKline & { isFinal: boolean }) => void
): () => void {
  const wsUrl = category === 'spot' ? WS_SPOT : WS_LINEAR
  const topic = `kline.${interval}.${symbol}`

  const sub: WsSub = { ws: null, isClosed: false, reconnectDelay: 1000 }

  function connect() {
    if (sub.isClosed) return

    const ws = new WebSocket(wsUrl)
    sub.ws = ws

    ws.onopen = () => {
      sub.reconnectDelay = 1000
      ws.send(JSON.stringify({ op: 'subscribe', args: [topic] }))
      // Bybit requires ping every 20s
      sub.pingTimer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ op: 'ping' }))
        }
      }, 20000)
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.topic !== topic || !msg.data?.length) return
        const d = msg.data[0]
        onKline({
          time: parseInt(d.start),
          open: parseFloat(d.open),
          high: parseFloat(d.high),
          low: parseFloat(d.low),
          close: parseFloat(d.close),
          volume: parseFloat(d.volume),
          isFinal: d.confirm === true,
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

export const bybitClient: ExchangeClient = {
  exchangeId: 'BYBIT',

  async getSymbols(marketType?: MarketType): Promise<UnifiedSymbolInfo[]> {
    if (marketType === 'spot') return fetchInstruments('spot')
    if (marketType === 'futures') return fetchInstruments('linear')
    const [spot, futures] = await Promise.all([
      fetchInstruments('spot'),
      fetchInstruments('linear'),
    ])
    return [...spot, ...futures]
  },

  async fetchKlines(symbol, marketType, interval, startTime?, endTime?, limit?) {
    const category = marketType === 'futures' ? 'linear' : 'spot'
    return fetchBybitKlines(symbol, category, interval, startTime, endTime, limit)
  },

  subscribeKline(symbol, marketType, interval, onKline) {
    const category = marketType === 'futures' ? 'linear' : 'spot'
    return subscribeBybitKline(symbol, category, interval, onKline)
  },

  mapResolution(tvResolution: string): string {
    return RESOLUTION_MAP[tvResolution] || '60'
  },
}
