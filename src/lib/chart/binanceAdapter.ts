// Binance adapter — wraps existing binanceClient to conform to ExchangeClient interface
// Also adds futures (USDT-M) support

import type { ExchangeClient, UnifiedSymbolInfo, UnifiedKline, MarketType } from './types'
import {
  fetchKlines as fetchBinanceSpotKlines,
  getExchangeSymbols as getBinanceSpotSymbols,
  subscribeKline as subscribeBinanceSpotKline,
  toBinanceInterval,
  toDisplaySymbol,
} from './binanceClient'

const FAPI_BASE = 'https://fapi.binance.com'
const FAPI_WS = 'wss://fstream.binance.com/ws'

// --- Futures symbols ---

interface FuturesCache {
  data: UnifiedSymbolInfo[]
  timestamp: number
}

let futuresCache: FuturesCache | null = null
const CACHE_TTL = 60 * 60 * 1000

async function getBinanceFuturesSymbols(): Promise<UnifiedSymbolInfo[]> {
  const now = Date.now()
  if (futuresCache && now - futuresCache.timestamp < CACHE_TTL) {
    return futuresCache.data
  }

  const res = await fetch(`${FAPI_BASE}/fapi/v1/exchangeInfo`)
  if (!res.ok) throw new Error(`Binance futures exchangeInfo error: ${res.status}`)

  const data = await res.json()
  const symbols: UnifiedSymbolInfo[] = (data.symbols || [])
    .filter((s: { status: string; contractType: string }) =>
      s.status === 'TRADING' && s.contractType === 'PERPETUAL'
    )
    .map((s: { symbol: string; baseAsset: string; quoteAsset: string; pricePrecision: number; quantityPrecision: number }) => {
      const base = `${s.baseAsset}/${s.quoteAsset}`
      return {
        symbol: s.symbol,
        baseAsset: s.baseAsset,
        quoteAsset: s.quoteAsset,
        exchange: 'BINANCE' as const,
        marketType: 'futures' as const,
        pricePrecision: s.pricePrecision,
        quantityPrecision: s.quantityPrecision,
        displaySymbol: `${base}.P`,
        fullName: `BINANCE:${base}.P`,
      }
    })

  futuresCache = { data: symbols, timestamp: now }
  return symbols
}

// --- Futures klines ---

async function fetchBinanceFuturesKlines(
  symbol: string,
  interval: string,
  startTime?: number,
  endTime?: number,
  limit: number = 1000
): Promise<UnifiedKline[]> {
  const params = new URLSearchParams({
    symbol,
    interval,
    limit: String(limit),
  })
  if (startTime) params.set('startTime', String(startTime))
  if (endTime) params.set('endTime', String(endTime))

  const res = await fetch(`${FAPI_BASE}/fapi/v1/klines?${params}`)
  if (!res.ok) throw new Error(`Binance futures klines error: ${res.status}`)

  const data: unknown[][] = await res.json()
  return data.map((k) => ({
    time: k[0] as number,
    open: parseFloat(k[1] as string),
    high: parseFloat(k[2] as string),
    low: parseFloat(k[3] as string),
    close: parseFloat(k[4] as string),
    volume: parseFloat(k[5] as string),
  }))
}

// --- Futures WebSocket ---

function subscribeBinanceFuturesKline(
  symbol: string,
  interval: string,
  onKline: (kline: UnifiedKline & { isFinal: boolean }) => void
): () => void {
  const stream = `${symbol.toLowerCase()}@kline_${interval}`
  const url = `${FAPI_WS}/${stream}`

  let ws: WebSocket | null = null
  let isClosed = false
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined
  let reconnectDelay = 1000

  function connect() {
    if (isClosed) return
    ws = new WebSocket(url)

    ws.onopen = () => { reconnectDelay = 1000 }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        const k = msg.k
        if (!k) return
        onKline({
          time: k.t as number,
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
          isFinal: k.x as boolean,
        })
      } catch { /* ignore */ }
    }

    ws.onclose = () => {
      if (isClosed) return
      reconnectTimer = setTimeout(() => {
        reconnectDelay = Math.min(reconnectDelay * 2, 30000)
        connect()
      }, reconnectDelay)
    }

    ws.onerror = () => ws?.close()
  }

  connect()

  return () => {
    isClosed = true
    if (reconnectTimer) clearTimeout(reconnectTimer)
    if (ws && ws.readyState <= WebSocket.OPEN) ws.close()
  }
}

// --- Exported client ---

export const binanceClient: ExchangeClient = {
  exchangeId: 'BINANCE',

  async getSymbols(marketType?: MarketType): Promise<UnifiedSymbolInfo[]> {
    if (marketType === 'spot') {
      const raw = await getBinanceSpotSymbols()
      return raw.map((s) => ({
        symbol: s.symbol,
        baseAsset: s.baseAsset,
        quoteAsset: s.quoteAsset,
        exchange: 'BINANCE' as const,
        marketType: 'spot' as const,
        pricePrecision: s.pricePrecision,
        quantityPrecision: s.quantityPrecision,
        displaySymbol: toDisplaySymbol(s.symbol, s.quoteAsset),
        fullName: `BINANCE:${toDisplaySymbol(s.symbol, s.quoteAsset)}`,
      }))
    }

    if (marketType === 'futures') {
      return getBinanceFuturesSymbols()
    }

    const [spotRaw, futures] = await Promise.all([
      getBinanceSpotSymbols(),
      getBinanceFuturesSymbols(),
    ])

    const spot: UnifiedSymbolInfo[] = spotRaw.map((s) => ({
      symbol: s.symbol,
      baseAsset: s.baseAsset,
      quoteAsset: s.quoteAsset,
      exchange: 'BINANCE' as const,
      marketType: 'spot' as const,
      pricePrecision: s.pricePrecision,
      quantityPrecision: s.quantityPrecision,
      displaySymbol: toDisplaySymbol(s.symbol, s.quoteAsset),
      fullName: `BINANCE:${toDisplaySymbol(s.symbol, s.quoteAsset)}`,
    }))

    return [...spot, ...futures]
  },

  async fetchKlines(symbol, marketType, interval, startTime?, endTime?, limit?) {
    if (marketType === 'futures') {
      return fetchBinanceFuturesKlines(symbol, interval, startTime, endTime, limit)
    }
    // symbol is raw format (BTCUSDT). fetchBinanceSpotKlines calls toBinanceSymbol
    // which strips "/" — so passing raw symbol directly is fine via a dummy display format.
    const dummyDisplay = symbol // toBinanceSymbol("BTCUSDT") → "BTCUSDT" (no-op)
    const klines = await fetchBinanceSpotKlines(dummyDisplay, interval, startTime, endTime, limit)
    return klines.map((k) => ({
      time: k.time,
      open: k.open,
      high: k.high,
      low: k.low,
      close: k.close,
      volume: k.volume,
    }))
  },

  subscribeKline(symbol, marketType, interval, onKline) {
    if (marketType === 'futures') {
      return subscribeBinanceFuturesKline(symbol, interval, onKline)
    }
    // symbol is raw format (BTCUSDT). subscribeBinanceSpotKline calls toBinanceSymbol internally.
    return subscribeBinanceSpotKline(symbol, interval, (k) => {
      onKline({
        time: k.time,
        open: k.open,
        high: k.high,
        low: k.low,
        close: k.close,
        volume: k.volume,
        isFinal: k.isFinal,
      })
    })
  },

  mapResolution(tvResolution: string): string {
    return toBinanceInterval(tvResolution)
  },
}
