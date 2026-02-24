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

import {
  fetchKlines,
  getExchangeSymbols,
  toDisplaySymbol,
  subscribeKline,
  toBinanceInterval,
} from './binanceClient'

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

export class TradexDatafeed implements IBasicDataFeed {
  private lastBars: Record<string, Bar> = {}
  private wsUnsubscribers: Record<string, () => void> = {}

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
    setTimeout(() => callback(config), 0)
  }

  searchSymbols(
    userInput: string,
    _exchange: string,
    _symbolType: string,
    onResult: SearchSymbolsCallback
  ): void {
    const query = userInput.toUpperCase()

    getExchangeSymbols()
      .then((symbols) => {
        const filtered = symbols.filter(
          (s) =>
            s.symbol.includes(query) ||
            s.baseAsset.includes(query) ||
            s.quoteAsset.includes(query)
        )
        const results: SearchSymbolResultItem[] = filtered.slice(0, 30).map((s) => {
          const display = toDisplaySymbol(s.symbol, s.quoteAsset)
          return {
            symbol: display,
            full_name: display,
            description: `${s.baseAsset} / ${s.quoteAsset}`,
            exchange: 'Binance',
            ticker: display,
            type: 'crypto',
          }
        })
        onResult(results)
      })
      .catch(() => {
        onResult([])
      })
  }

  resolveSymbol(
    symbolName: string,
    onResolve: ResolveCallback,
    onError: DatafeedErrorCallback
  ): void {
    getExchangeSymbols()
      .then((symbols) => {
        const target = symbolName.replace('/', '').toUpperCase()
        const info = symbols.find((s) => s.symbol === target)
        if (!info) {
          onError('Symbol not found')
          return
        }

        const display = toDisplaySymbol(info.symbol, info.quoteAsset)
        const pricescale = Math.pow(10, info.pricePrecision)

        const symbolInfo: LibrarySymbolInfo = {
          name: display,
          ticker: display,
          description: `${info.baseAsset} / ${info.quoteAsset}`,
          type: 'crypto',
          session: '24x7',
          exchange: 'Binance',
          listed_exchange: 'Binance',
          timezone: 'Etc/UTC' as LibrarySymbolInfo['timezone'],
          format: 'price',
          pricescale,
          minmov: 1,
          has_intraday: true,
          has_weekly_and_monthly: true,
          supported_resolutions: SUPPORTED_RESOLUTIONS,
          volume_precision: info.quantityPrecision,
          data_status: 'streaming',
        } as LibrarySymbolInfo

        setTimeout(() => onResolve(symbolInfo), 0)
      })
      .catch(() => {
        onError('Failed to resolve symbol')
      })
  }

  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: DatafeedErrorCallback
  ): void {
    const { from, to, firstDataRequest } = periodParams
    const interval = toBinanceInterval(resolution as string)

    fetchKlines(symbolInfo.name, interval, from * 1000, to * 1000)
      .then((klines) => {
        if (klines.length === 0) {
          onResult([], { noData: true })
          return
        }

        const bars: Bar[] = klines.map((k) => ({
          time: k.time,
          open: k.open,
          high: k.high,
          low: k.low,
          close: k.close,
          volume: k.volume,
        }))

        if (firstDataRequest && bars.length > 0) {
          const key = `${symbolInfo.name}_${resolution}`
          this.lastBars[key] = { ...bars[bars.length - 1] }
        }

        onResult(bars, { noData: false })
      })
      .catch((err) => {
        onError(String(err))
      })
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    _onResetCacheNeededCallback: () => void
  ): void {
    const key = `${symbolInfo.name}_${resolution}`
    const interval = toBinanceInterval(resolution as string)

    const unsubscribe = subscribeKline(
      symbolInfo.name,
      interval,
      (kline) => {
        const lastBar = this.lastBars[key]
        if (!lastBar) return

        let bar: Bar

        if (kline.time > lastBar.time) {
          // New candle
          bar = {
            time: kline.time,
            open: kline.open,
            high: kline.high,
            low: kline.low,
            close: kline.close,
            volume: kline.volume,
          }
        } else {
          // Update current candle
          bar = {
            ...lastBar,
            high: Math.max(lastBar.high, kline.high),
            low: Math.min(lastBar.low, kline.low),
            close: kline.close,
            volume: kline.volume,
          }
        }

        this.lastBars[key] = bar
        onTick(bar)
      }
    )

    this.wsUnsubscribers[listenerGuid] = unsubscribe
  }

  unsubscribeBars(listenerGuid: string): void {
    const unsubscribe = this.wsUnsubscribers[listenerGuid]
    if (unsubscribe) {
      unsubscribe()
      delete this.wsUnsubscribers[listenerGuid]
    }
  }
}
