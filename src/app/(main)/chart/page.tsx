'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Search, Star, ChevronDown, Sparkles, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useChartStore } from '@/stores/useChartStore'

// TradingView requires window object - must be loaded client-side only
const TVChartContainer = dynamic(
  () => import('@/components/chart/TVChartContainer').then(mod => ({ default: mod.TVChartContainer })),
  { ssr: false }
)
const TriggerPanel = dynamic(
  () => import('@/components/chart/TriggerPanel').then(mod => ({ default: mod.TriggerPanel })),
  { ssr: false }
)

// 샘플 워치리스트 데이터
const watchlistData = [
  { symbol: 'BTC/USDT', price: 97245.50, change: 2.34, isFavorite: true },
  { symbol: 'ETH/USDT', price: 3456.78, change: -1.23, isFavorite: true },
  { symbol: 'SOL/USDT', price: 123.45, change: 5.67, isFavorite: false },
  { symbol: 'XRP/USDT', price: 0.6789, change: -0.45, isFavorite: false },
  { symbol: 'DOGE/USDT', price: 0.0987, change: 8.90, isFavorite: false },
]

export default function ChartPage() {
  const { selectedSymbol, setSelectedSymbol } = useChartStore()
  const [showWatchlist, setShowWatchlist] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredWatchlist = watchlistData.filter(item =>
    item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedData = watchlistData.find(w => w.symbol === selectedSymbol)

  return (
    <div className="flex flex-col h-[calc(100vh-40px-64px)]">
      {/* Page Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-line-normal bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-title-2-bold text-gray-800">차트 분석</h1>
          <Badge variant="info" size="sm">
            실시간
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2">
            <Bell className="w-4 h-4" />
            알림 설정
          </Button>
          <Button variant="secondary" size="sm" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI 분석
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Watchlist Sidebar */}
        {showWatchlist && (
          <div className="w-64 border-r border-line-normal bg-white flex flex-col">
            {/* Search */}
            <div className="p-3 border-b border-line-normal">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-label-assistive" />
                <Input
                  placeholder="심볼 검색"
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Watchlist */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                <p className="px-2 py-1 text-caption-medium text-label-assistive">관심 종목</p>
                {filteredWatchlist.map((item) => (
                  <button
                    key={item.symbol}
                    onClick={() => setSelectedSymbol(item.symbol)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors",
                      selectedSymbol === item.symbol
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Star
                        className={cn(
                          "w-4 h-4",
                          item.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        )}
                      />
                      <span className="text-body-2-medium text-label-normal">{item.symbol}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-body-2-medium text-label-normal">
                        ${item.price.toLocaleString()}
                      </p>
                      <p className={cn(
                        "text-caption-regular",
                        item.change >= 0 ? "text-label-positive" : "text-label-danger"
                      )}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Symbol Header */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-line-normal">
            <button
              onClick={() => setShowWatchlist(!showWatchlist)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            >
              <ChevronDown className={cn(
                "w-5 h-5 text-label-neutral transition-transform",
                showWatchlist ? "rotate-90" : "-rotate-90"
              )} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-title-1-bold text-label-normal">{selectedSymbol}</h2>
                {selectedData && (
                  <Badge variant={selectedData.change >= 0 ? 'positive' : 'danger'} size="sm">
                    {selectedData.change >= 0 ? '+' : ''}{selectedData.change}%
                  </Badge>
                )}
              </div>
              <p className="text-body-2-regular text-label-assistive">Binance Futures · 영구 계약</p>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-6 text-body-2-regular">
              <div>
                <p className="text-label-assistive">고가</p>
                <p className="text-label-positive">$98,456.00</p>
              </div>
              <div>
                <p className="text-label-assistive">저가</p>
                <p className="text-label-danger">$95,123.00</p>
              </div>
              <div>
                <p className="text-label-assistive">거래량</p>
                <p className="text-label-normal">1.2B USDT</p>
              </div>
            </div>
          </div>

          {/* TradingView Chart (replaces CandleChart + ChartToolbar) */}
          <div className="flex-1 relative">
            <TVChartContainer
              symbol={selectedSymbol}
              className="absolute inset-0"
            />
          </div>

          {/* Trigger Panel */}
          <TriggerPanel />

          {/* Bottom Panel - Trade Info */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-line-normal bg-gray-50">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-caption-regular text-label-assistive">미체결</p>
                <p className="text-body-2-medium text-label-normal">0건</p>
              </div>
              <div>
                <p className="text-caption-regular text-label-assistive">포지션</p>
                <p className="text-body-2-medium text-label-normal">없음</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" className="bg-element-positive-default hover:bg-green-500 text-white border-0">
                롱 (매수)
              </Button>
              <Button variant="secondary" className="bg-element-danger-default hover:bg-red-500 text-white border-0">
                숏 (매도)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
