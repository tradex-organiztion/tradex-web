'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { searchSymbols } from '@/lib/chart/exchangeManager'
import type { ExchangeId, MarketType, UnifiedSymbolInfo } from '@/lib/chart/types'

interface SymbolSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectSymbol: (fullName: string) => void
}

const MARKET_TABS: { label: string; value: MarketType | '' }[] = [
  { label: '전체', value: '' },
  { label: '현물', value: 'spot' },
  { label: '선물', value: 'futures' },
]

const EXCHANGE_FILTERS: { label: string; value: ExchangeId | '' }[] = [
  { label: '전체', value: '' },
  { label: 'Binance', value: 'BINANCE' },
  { label: 'Bybit', value: 'BYBIT' },
  { label: 'Bitget', value: 'BITGET' },
]

const PAGE_SIZE = 100

export function SymbolSearchDialog({
  open,
  onOpenChange,
  onSelectSymbol,
}: SymbolSearchDialogProps) {
  const [query, setQuery] = useState('')
  const [marketType, setMarketType] = useState<MarketType | ''>('')
  const [exchange, setExchange] = useState<ExchangeId | ''>('')
  const [symbols, setSymbols] = useState<UnifiedSymbolInfo[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const listRef = useRef<HTMLDivElement>(null)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const offsetRef = useRef(0)

  // Debounced search
  const doSearch = useCallback(
    async (q: string, mkt: MarketType | '', exch: ExchangeId | '', reset: boolean) => {
      const offset = reset ? 0 : offsetRef.current
      setLoading(true)

      try {
        const result = await searchSymbols(q, {
          exchange: exch || undefined,
          marketType: (mkt as MarketType) || undefined,
          offset,
          limit: PAGE_SIZE,
        })

        if (reset) {
          setSymbols(result.symbols)
          offsetRef.current = result.symbols.length
        } else {
          setSymbols((prev) => [...prev, ...result.symbols])
          offsetRef.current = offset + result.symbols.length
        }

        setTotal(result.total)
        setHasMore(offset + result.symbols.length < result.total)
      } catch {
        if (reset) setSymbols([])
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Reset and search when filters change
  useEffect(() => {
    if (!open) return

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => {
      doSearch(query, marketType, exchange, true)
    }, 200)

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [query, marketType, exchange, open, doSearch])

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setQuery('')
      setMarketType('')
      setExchange('')
      setSymbols([])
      setTotal(0)
      offsetRef.current = 0
      setHasMore(true)
    }
  }, [open])

  // Infinite scroll
  const handleScroll = useCallback(() => {
    const el = listRef.current
    if (!el || loading || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollHeight - scrollTop - clientHeight < 200) {
      doSearch(query, marketType, exchange, false)
    }
  }, [loading, hasMore, query, marketType, exchange, doSearch])

  const handleSelect = useCallback(
    (symbol: UnifiedSymbolInfo) => {
      onSelectSymbol(symbol.fullName)
      onOpenChange(false)
    },
    [onSelectSymbol, onOpenChange]
  )

  const exchangeColor = useMemo(
    () =>
      ({
        BINANCE: 'bg-yellow-100 text-yellow-400',
        BYBIT: 'bg-blue-100 text-blue-400',
        BITGET: 'bg-green-100 text-green-400',
      }) as Record<ExchangeId, string>,
    []
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[520px] p-0 gap-0 overflow-hidden max-h-[80vh]"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">심볼 검색</DialogTitle>

        {/* Search input */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-line-normal">
          <Search className="w-5 h-5 text-label-assistive shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="심볼 검색 (예: BTC, ETH, SOL)"
            className="flex-1 text-body-1-regular text-label-normal placeholder:text-label-assistive outline-none bg-transparent"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-label-assistive hover:text-label-neutral"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Market type tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-line-normal">
          {MARKET_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setMarketType(tab.value)}
              className={`px-3 py-1.5 rounded-md text-body-2-medium transition-colors ${
                marketType === tab.value
                  ? 'bg-element-primary-default text-label-inverse'
                  : 'text-label-neutral hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="w-px h-5 bg-line-normal mx-2" />

          {/* Exchange filters */}
          {EXCHANGE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setExchange(filter.value)}
              className={`px-3 py-1.5 rounded-md text-body-2-medium transition-colors ${
                exchange === filter.value
                  ? 'bg-element-primary-default text-label-inverse'
                  : 'text-label-neutral hover:bg-gray-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
          <span className="text-caption-medium text-label-assistive">
            심볼
          </span>
          <span className="text-caption-medium text-label-assistive">
            {total.toLocaleString()}개 결과
          </span>
        </div>

        {/* Symbol list with infinite scroll */}
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="overflow-y-auto"
          style={{ maxHeight: 'calc(80vh - 180px)' }}
        >
          {symbols.map((symbol, idx) => (
            <button
              key={`${symbol.exchange}-${symbol.symbol}-${symbol.marketType}-${idx}`}
              onClick={() => handleSelect(symbol)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              {/* Exchange badge */}
              <span
                className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  exchangeColor[symbol.exchange] || 'bg-gray-100 text-gray-500'
                }`}
              >
                {symbol.exchange === 'BINANCE'
                  ? 'BN'
                  : symbol.exchange === 'BYBIT'
                    ? 'BY'
                    : 'BG'}
              </span>

              {/* Symbol info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-body-2-bold text-label-normal">
                    {symbol.displaySymbol}
                  </span>
                  {symbol.marketType === 'futures' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-600">
                      선물
                    </span>
                  )}
                </div>
                <span className="text-caption-regular text-label-assistive">
                  {symbol.baseAsset} / {symbol.quoteAsset}
                </span>
              </div>

              {/* Exchange name */}
              <span className="text-caption-regular text-label-assistive shrink-0">
                {symbol.exchange}
              </span>
            </button>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!loading && symbols.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-label-assistive">
              <Search className="w-8 h-8 mb-2 opacity-30" />
              <span className="text-body-2-regular">검색 결과가 없습니다</span>
            </div>
          )}

          {/* End of list */}
          {!loading && !hasMore && symbols.length > 0 && (
            <div className="text-center py-3 text-caption-regular text-label-assistive">
              총 {total.toLocaleString()}개 심볼
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
