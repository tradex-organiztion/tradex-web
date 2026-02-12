import type {
  IBasicDataFeed,
  OnReadyCallback,
  SearchSymbolsCallback,
  ResolveCallback,
  DatafeedErrorCallback,
  HistoryCallback,
  SubscribeBarsCallback,
  ResolutionString,
  LibrarySymbolInfo,
  DatafeedConfiguration,
  Bar,
  SearchSymbolResultItem,
  PeriodParams,
} from '@/charting_library'

const SUPPORTED_RESOLUTIONS: ResolutionString[] = [
  '1' as ResolutionString,
  '5' as ResolutionString,
  '15' as ResolutionString,
  '30' as ResolutionString,
  '60' as ResolutionString,
  '240' as ResolutionString,
  '1D' as ResolutionString,
  '1W' as ResolutionString,
  '1M' as ResolutionString,
]

const SYMBOLS: Record<string, Omit<LibrarySymbolInfo, 'data_status'>> = {
  'BTC/USDT': {
    name: 'BTC/USDT',
    ticker: 'BTC/USDT',
    description: 'Bitcoin / Tether',
    type: 'crypto',
    session: '24x7',
    exchange: 'Binance',
    listed_exchange: 'Binance',
    timezone: 'Etc/UTC',
    format: 'price',
    pricescale: 100,
    minmov: 1,
    has_intraday: true,
    has_weekly_and_monthly: true,
    supported_resolutions: SUPPORTED_RESOLUTIONS,
    volume_precision: 8,
  },
  'ETH/USDT': {
    name: 'ETH/USDT',
    ticker: 'ETH/USDT',
    description: 'Ethereum / Tether',
    type: 'crypto',
    session: '24x7',
    exchange: 'Binance',
    listed_exchange: 'Binance',
    timezone: 'Etc/UTC',
    format: 'price',
    pricescale: 100,
    minmov: 1,
    has_intraday: true,
    has_weekly_and_monthly: true,
    supported_resolutions: SUPPORTED_RESOLUTIONS,
    volume_precision: 8,
  },
  'SOL/USDT': {
    name: 'SOL/USDT',
    ticker: 'SOL/USDT',
    description: 'Solana / Tether',
    type: 'crypto',
    session: '24x7',
    exchange: 'Binance',
    listed_exchange: 'Binance',
    timezone: 'Etc/UTC',
    format: 'price',
    pricescale: 100,
    minmov: 1,
    has_intraday: true,
    has_weekly_and_monthly: true,
    supported_resolutions: SUPPORTED_RESOLUTIONS,
    volume_precision: 8,
  },
  'XRP/USDT': {
    name: 'XRP/USDT',
    ticker: 'XRP/USDT',
    description: 'Ripple / Tether',
    type: 'crypto',
    session: '24x7',
    exchange: 'Binance',
    listed_exchange: 'Binance',
    timezone: 'Etc/UTC',
    format: 'price',
    pricescale: 10000,
    minmov: 1,
    has_intraday: true,
    has_weekly_and_monthly: true,
    supported_resolutions: SUPPORTED_RESOLUTIONS,
    volume_precision: 8,
  },
  'DOGE/USDT': {
    name: 'DOGE/USDT',
    ticker: 'DOGE/USDT',
    description: 'Dogecoin / Tether',
    type: 'crypto',
    session: '24x7',
    exchange: 'Binance',
    listed_exchange: 'Binance',
    timezone: 'Etc/UTC',
    format: 'price',
    pricescale: 100000,
    minmov: 1,
    has_intraday: true,
    has_weekly_and_monthly: true,
    supported_resolutions: SUPPORTED_RESOLUTIONS,
    volume_precision: 8,
  },
}

function getResolutionInMs(resolution: string): number {
  const num = parseInt(resolution)
  if (resolution.endsWith('D') || resolution === '1D') return 86400000
  if (resolution.endsWith('W') || resolution === '1W') return 604800000
  if (resolution.endsWith('M') || resolution === '1M') return 2592000000
  if (!isNaN(num)) return num * 60000
  return 3600000
}

function generateBars(
  symbolName: string,
  resolution: string,
  from: number,
  to: number
): Bar[] {
  const bars: Bar[] = []
  const resolutionMs = getResolutionInMs(resolution)
  const seed = symbolName.charCodeAt(0) + symbolName.charCodeAt(1)

  const basePrices: Record<string, number> = {
    'BTC/USDT': 97000,
    'ETH/USDT': 3450,
    'SOL/USDT': 123,
    'XRP/USDT': 0.68,
    'DOGE/USDT': 0.099,
  }
  let price = basePrices[symbolName] || 100

  // Simple seeded random
  let rng = seed
  const random = () => {
    rng = (rng * 16807 + 0) % 2147483647
    return (rng & 0x7fffffff) / 0x7fffffff
  }

  // Align `from` to resolution boundary
  const startTime = Math.floor(from / resolutionMs) * resolutionMs

  for (let time = startTime; time <= to; time += resolutionMs) {
    const volatility = price * 0.015
    const open = price + (random() - 0.5) * volatility
    const close = open + (random() - 0.5) * volatility * 2
    const high = Math.max(open, close) + random() * volatility * 0.5
    const low = Math.min(open, close) - random() * volatility * 0.5
    const volume = 100 + random() * 1000

    bars.push({
      time,
      open,
      high,
      low,
      close,
      volume,
    })

    price = close
  }

  return bars
}

// Store last bar per symbol+resolution for realtime updates
const lastBars: Record<string, Bar> = {}
const subscribers: Record<string, { callback: SubscribeBarsCallback; interval: ReturnType<typeof setInterval> }> = {}

export class TradexDatafeed implements IBasicDataFeed {
  onReady(callback: OnReadyCallback): void {
    const config: DatafeedConfiguration = {
      supported_resolutions: SUPPORTED_RESOLUTIONS,
      exchanges: [
        { value: 'Binance', name: 'Binance', desc: 'Binance Exchange' },
      ],
      symbols_types: [
        { name: 'Crypto', value: 'crypto' },
      ],
    }
    // TradingView expects onReady to be async
    setTimeout(() => callback(config), 0)
  }

  searchSymbols(
    userInput: string,
    _exchange: string,
    _symbolType: string,
    onResult: SearchSymbolsCallback
  ): void {
    const query = userInput.toUpperCase()
    const results: SearchSymbolResultItem[] = Object.entries(SYMBOLS)
      .filter(([key]) => key.includes(query))
      .map(([key, info]) => ({
        symbol: key,
        full_name: key,
        description: info.description,
        exchange: info.exchange,
        ticker: key,
        type: info.type,
      }))
    onResult(results)
  }

  resolveSymbol(
    symbolName: string,
    onResolve: ResolveCallback,
    onError: DatafeedErrorCallback
  ): void {
    const symbolInfo = SYMBOLS[symbolName]
    if (!symbolInfo) {
      onError('Symbol not found')
      return
    }

    setTimeout(() => {
      onResolve({
        ...symbolInfo,
        data_status: 'streaming',
      } as LibrarySymbolInfo)
    }, 0)
  }

  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: DatafeedErrorCallback
  ): void {
    try {
      const { from, to, firstDataRequest } = periodParams
      const bars = generateBars(
        symbolInfo.name,
        resolution as string,
        from * 1000,
        to * 1000
      )

      if (bars.length === 0) {
        onResult([], { noData: true })
        return
      }

      // Store last bar for realtime updates
      if (firstDataRequest && bars.length > 0) {
        const key = `${symbolInfo.name}_${resolution}`
        lastBars[key] = { ...bars[bars.length - 1] }
      }

      onResult(bars, { noData: false })
    } catch (err) {
      onError(String(err))
    }
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    _onResetCacheNeededCallback: () => void
  ): void {
    const key = `${symbolInfo.name}_${resolution}`
    const resolutionMs = getResolutionInMs(resolution as string)

    const interval = setInterval(() => {
      const lastBar = lastBars[key]
      if (!lastBar) return

      const now = Date.now()
      const currentBarTime = Math.floor(now / resolutionMs) * resolutionMs

      if (currentBarTime > lastBar.time) {
        // New bar
        const newBar: Bar = {
          time: currentBarTime,
          open: lastBar.close,
          high: lastBar.close,
          low: lastBar.close,
          close: lastBar.close,
          volume: 0,
        }
        lastBars[key] = newBar
        onTick(newBar)
      } else {
        // Update current bar with simulated price movement
        const volatility = lastBar.close * 0.0005
        const change = (Math.random() - 0.5) * volatility
        const newClose = lastBar.close + change

        const updatedBar: Bar = {
          ...lastBar,
          high: Math.max(lastBar.high, newClose),
          low: Math.min(lastBar.low, newClose),
          close: newClose,
          volume: (lastBar.volume || 0) + Math.random() * 10,
        }
        lastBars[key] = updatedBar
        onTick(updatedBar)
      }
    }, 2000)

    subscribers[listenerGuid] = { callback: onTick, interval }
  }

  unsubscribeBars(listenerGuid: string): void {
    const sub = subscribers[listenerGuid]
    if (sub) {
      clearInterval(sub.interval)
      delete subscribers[listenerGuid]
    }
  }
}
