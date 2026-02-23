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
  subscribeKline,
  toBinanceInterval,
} from './binanceClient'

import { chartDataApi } from '@/lib/api/chart'

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

    chartDataApi.searchSymbols(query)
      .then((symbols) => {
        const results: SearchSymbolResultItem[] = symbols.map((s) => ({
          symbol: s.ticker,
          full_name: s.ticker,
          description: s.description,
          exchange: s.exchange || 'Binance',
          ticker: s.ticker,
          type: s.type || 'crypto',
        }))
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
    chartDataApi.getSymbolInfo(symbolName)
      .then((info) => {
        const symbolInfo: LibrarySymbolInfo = {
          name: info.name,
          ticker: info.ticker,
          description: info.description,
          type: info.type || 'crypto',
          session: info.session || '24x7',
          exchange: info.exchange || 'Binance',
          listed_exchange: info.exchange || 'Binance',
          timezone: (info.timezone || 'Etc/UTC') as LibrarySymbolInfo['timezone'],
          format: 'price',
          pricescale: info.pricescale,
          minmov: info.minmov || 1,
          has_intraday: info.has_intraday ?? true,
          has_weekly_and_monthly: info.has_weekly_and_monthly ?? true,
          supported_resolutions: (info.supported_resolutions as ResolutionString[]) || SUPPORTED_RESOLUTIONS,
          volume_precision: info.volume_precision ?? 2,
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
    const { from, to, firstDataRequest, countBack } = periodParams

    chartDataApi.getBars({
      symbol: symbolInfo.name,
      resolution: resolution as string,
      from,
      to,
      countBack,
    })
      .then((response) => {
        if (response.noData || response.bars.length === 0) {
          onResult([], { noData: true })
          return
        }

        const bars: Bar[] = response.bars.map((b) => ({
          time: b.time,
          open: b.open,
          high: b.high,
          low: b.low,
          close: b.close,
          volume: b.volume,
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

  // WebSocket은 Binance 직접 연결 유지 (백엔드에 WS 엔드포인트 없음)
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
