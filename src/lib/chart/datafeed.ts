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

import type { ExchangeId, MarketType } from './types'
import { parseFullSymbol } from './types'
import {
  searchSymbols as searchAllSymbols,
  resolveSymbolInfo,
  fetchKlines,
  subscribeKline,
} from './exchangeManager'

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
        { value: 'Bybit', name: 'Bybit', desc: 'Bybit Exchange' },
        { value: 'Bitget', name: 'Bitget', desc: 'Bitget Exchange' },
      ],
      symbols_types: [
        { name: 'All', value: '' },
        { name: 'Spot', value: 'spot' },
        { name: 'Futures', value: 'futures' },
      ],
    }
    setTimeout(() => callback(config), 0)
  }

  searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback
  ): void {
    const exchangeMap: Record<string, ExchangeId> = {
      'Binance': 'BINANCE',
      'Bybit': 'BYBIT',
      'Bitget': 'BITGET',
    }

    searchAllSymbols(userInput, {
      exchange: exchangeMap[exchange],
      marketType: (symbolType as MarketType) || undefined,
      limit: 100,
    })
      .then(({ symbols }) => {
        const results: SearchSymbolResultItem[] = symbols.map((s) => ({
          symbol: s.fullName,
          full_name: s.fullName,
          description: `${s.baseAsset} / ${s.quoteAsset}`,
          exchange: s.exchange,
          ticker: s.fullName,
          type: s.marketType === 'futures' ? 'futures' : 'crypto',
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
    resolveSymbolInfo(symbolName)
      .then((info) => {
        if (!info) {
          onError('Symbol not found')
          return
        }

        const pricescale = Math.pow(10, info.pricePrecision)
        const symbolInfo: LibrarySymbolInfo = {
          name: info.fullName,
          ticker: info.fullName,
          description: `${info.baseAsset} / ${info.quoteAsset}`,
          type: info.marketType === 'futures' ? 'futures' : 'crypto',
          session: '24x7',
          exchange: info.exchange,
          listed_exchange: info.exchange,
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
    const marketType = parseFullSymbol(symbolInfo.name).marketType

    fetchKlines(symbolInfo.name, marketType, resolution as string, from * 1000, to * 1000)
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
    const marketType = parseFullSymbol(symbolInfo.name).marketType

    const unsubscribe = subscribeKline(
      symbolInfo.name,
      marketType,
      resolution as string,
      (kline) => {
        const lastBar = this.lastBars[key]
        if (!lastBar) return

        let bar: Bar

        if (kline.time > lastBar.time) {
          bar = {
            time: kline.time,
            open: kline.open,
            high: kline.high,
            low: kline.low,
            close: kline.close,
            volume: kline.volume,
          }
        } else {
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
