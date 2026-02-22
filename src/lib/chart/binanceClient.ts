// Binance public API client (no authentication required)

const REST_BASE = 'https://api.binance.com/api/v3'
const WS_BASE = 'wss://stream.binance.com:9443/ws'

// --- Symbol & Resolution helpers ---

/** Convert display symbol (BTC/USDT) to Binance format (BTCUSDT) */
export function toBinanceSymbol(symbol: string): string {
  return symbol.replace('/', '').toUpperCase()
}

/** Convert Binance symbol (BTCUSDT) to display format (BTC/USDT) */
export function toDisplaySymbol(binanceSymbol: string, quoteAsset: string): string {
  const base = binanceSymbol.slice(0, binanceSymbol.length - quoteAsset.length)
  return `${base}/${quoteAsset}`
}

/** Map TradingView resolution string to Binance interval */
const RESOLUTION_MAP: Record<string, string> = {
  '1': '1m',
  '3': '3m',
  '5': '5m',
  '15': '15m',
  '30': '30m',
  '60': '1h',
  '120': '2h',
  '240': '4h',
  '360': '6h',
  '480': '8h',
  '720': '12h',
  '1D': '1d',
  'D': '1d',
  '1W': '1w',
  'W': '1w',
  '1M': '1M',
  'M': '1M',
}

export function toBinanceInterval(resolution: string): string {
  return RESOLUTION_MAP[resolution] || '1h'
}

// --- REST API ---

export interface BinanceKline {
  time: number      // open time (ms)
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export async function fetchKlines(
  symbol: string,
  interval: string,
  startTime?: number,
  endTime?: number,
  limit: number = 1000
): Promise<BinanceKline[]> {
  const params = new URLSearchParams({
    symbol: toBinanceSymbol(symbol),
    interval,
    limit: String(limit),
  })
  if (startTime) params.set('startTime', String(startTime))
  if (endTime) params.set('endTime', String(endTime))

  const res = await fetch(`${REST_BASE}/klines?${params}`)
  if (!res.ok) {
    throw new Error(`Binance klines error: ${res.status} ${res.statusText}`)
  }

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

// --- Exchange Info (cached) ---

export interface BinanceSymbolInfo {
  symbol: string        // e.g. "BTCUSDT"
  baseAsset: string     // e.g. "BTC"
  quoteAsset: string    // e.g. "USDT"
  status: string
  pricePrecision: number   // decimal places derived from PRICE_FILTER tickSize
  quantityPrecision: number // decimal places derived from LOT_SIZE stepSize
}

/** Count decimal places from a tick/step size string like "0.01000000" → 2 */
function precisionFromTickSize(tickSize: string): number {
  if (!tickSize || tickSize === '0') return 2
  const parts = tickSize.split('.')
  if (parts.length < 2) return 0
  const decimals = parts[1]
  // Find position of first non-zero digit from left
  for (let i = 0; i < decimals.length; i++) {
    if (decimals[i] !== '0') return i + 1
  }
  return decimals.length
}

interface BinanceFilter {
  filterType: string
  tickSize?: string
  stepSize?: string
  [key: string]: unknown
}

let exchangeInfoCache: BinanceSymbolInfo[] | null = null
let exchangeInfoTimestamp = 0
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export async function getExchangeSymbols(): Promise<BinanceSymbolInfo[]> {
  const now = Date.now()
  if (exchangeInfoCache && now - exchangeInfoTimestamp < CACHE_TTL) {
    return exchangeInfoCache
  }

  const res = await fetch(`${REST_BASE}/exchangeInfo?permissions=SPOT`)
  if (!res.ok) {
    throw new Error(`Binance exchangeInfo error: ${res.status}`)
  }

  const data = await res.json()
  exchangeInfoCache = (data.symbols as Array<{
    symbol: string
    baseAsset: string
    quoteAsset: string
    status: string
    filters: BinanceFilter[]
  }>)
    .filter((s) => s.status === 'TRADING')
    .map((s) => {
      const priceFilter = s.filters.find((f) => f.filterType === 'PRICE_FILTER')
      const lotFilter = s.filters.find((f) => f.filterType === 'LOT_SIZE')
      return {
        symbol: s.symbol,
        baseAsset: s.baseAsset,
        quoteAsset: s.quoteAsset,
        status: s.status,
        pricePrecision: precisionFromTickSize(priceFilter?.tickSize || '0.01'),
        quantityPrecision: precisionFromTickSize(lotFilter?.stepSize || '0.00001'),
      }
    })

  exchangeInfoTimestamp = now
  return exchangeInfoCache
}

// --- WebSocket ---

interface WsSubscription {
  ws: WebSocket
  reconnectTimer?: ReturnType<typeof setTimeout>
  reconnectDelay: number
  isClosed: boolean
}

const WS_MAX_RECONNECT_DELAY = 30_000

export function subscribeKline(
  symbol: string,
  interval: string,
  onKline: (kline: BinanceKline & { isFinal: boolean }) => void
): () => void {
  const binanceSymbol = toBinanceSymbol(symbol).toLowerCase()
  const url = `${WS_BASE}/${binanceSymbol}@kline_${interval}`

  const sub: WsSubscription = {
    ws: null!,
    reconnectDelay: 1000,
    isClosed: false,
  }

  function connect() {
    if (sub.isClosed) return

    const ws = new WebSocket(url)
    sub.ws = ws

    ws.onopen = () => {
      sub.reconnectDelay = 1000 // reset on successful connection
    }

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
      } catch {
        // ignore parse errors
      }
    }

    ws.onclose = () => {
      if (sub.isClosed) return
      sub.reconnectTimer = setTimeout(() => {
        sub.reconnectDelay = Math.min(sub.reconnectDelay * 2, WS_MAX_RECONNECT_DELAY)
        connect()
      }, sub.reconnectDelay)
    }

    ws.onerror = () => {
      ws.close()
    }
  }

  connect()

  // Return unsubscribe function
  return () => {
    sub.isClosed = true
    if (sub.reconnectTimer) clearTimeout(sub.reconnectTimer)
    if (sub.ws && sub.ws.readyState <= WebSocket.OPEN) {
      sub.ws.close()
    }
  }
}
