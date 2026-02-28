'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { PortfolioTabNav } from '@/components/portfolio'
import { ExchangeFilter } from '@/components/common/ExchangeFilter'
import { useAuthStore } from '@/stores/useAuthStore'
import { futuresApi } from '@/lib/api'
import type {
  FuturesPeriod,
  FuturesSummaryResponse,
  ProfitRankingResponse,
  ClosedPositionResponse,
  ClosedPositionsSummaryResponse,
  PageResponse,
} from '@/lib/api'

const timeFilters = ['이전 7일', '30일', '60일', '90일', '180일', '사용자 지정']

const periodMap: Record<string, FuturesPeriod> = {
  '이전 7일': '7d',
  '30일': '30d',
  '60일': '60d',
  '90일': '90d',
  '180일': '180d',
  '사용자 지정': 'all',
}

// ============================================================
// Mock Data (demo mode / API fallback)
// ============================================================

const mockSummary: FuturesSummaryResponse = {
  totalPnl: 5234,
  totalVolume: 53550,
  winRate: 80,
  winCount: 4,
  lossCount: 1,
  totalTradeCount: 5,
  pnlChart: [
    { date: '01/06', pnl: 850, cumulativePnl: 850 },
    { date: '01/07', pnl: -420, cumulativePnl: 430 },
    { date: '01/08', pnl: 1250, cumulativePnl: 1680 },
    { date: '01/09', pnl: 300, cumulativePnl: 1980 },
    { date: '01/10', pnl: -680, cumulativePnl: 1300 },
    { date: '01/11', pnl: 1540, cumulativePnl: 2840 },
    { date: '01/12', pnl: 920, cumulativePnl: 3760 },
    { date: '01/13', pnl: -350, cumulativePnl: 3410 },
    { date: '01/14', pnl: 1800, cumulativePnl: 5210 },
    { date: '01/15', pnl: -120, cumulativePnl: 5090 },
    { date: '01/16', pnl: 650, cumulativePnl: 5740 },
    { date: '01/17', pnl: 1100, cumulativePnl: 6840 },
    { date: '01/18', pnl: -890, cumulativePnl: 5950 },
    { date: '01/19', pnl: 420, cumulativePnl: 6370 },
  ],
}

const mockRanking: ProfitRankingResponse = {
  rankings: [
    { rank: 1, symbol: 'BTCUSDT', totalPnl: 12450.75, tradeCount: 15, winRate: 80 },
    { rank: 2, symbol: 'ETHUSDT', totalPnl: 8450.20, tradeCount: 12, winRate: 75 },
    { rank: 3, symbol: 'SOLUSDT', totalPnl: 3450, tradeCount: 8, winRate: 62.5 },
    { rank: 4, symbol: 'BNBUSDT', totalPnl: 1890, tradeCount: 6, winRate: 66.7 },
    { rank: 5, symbol: 'ADAUSDT', totalPnl: -2340, tradeCount: 5, winRate: 40 },
  ],
}

const mockClosedPositions: PageResponse<ClosedPositionResponse> = {
  content: [
    { id: 1, symbol: 'BTCUSDT', side: 'LONG', size: 0.5, leverage: 20, entryPrice: 42500, exitPrice: 43200, pnl: 1250, result: 'WIN', volume: 21600, totalFee: 21.6, entryTime: new Date(Date.now() - 2 * 3600000).toISOString().slice(0, 19), exitTime: new Date(Date.now() - 0.5 * 3600000).toISOString().slice(0, 19) },
    { id: 2, symbol: 'BTCUSDT', side: 'SHORT', size: 5, leverage: 10, entryPrice: 2250, exitPrice: 1950, pnl: 300, result: 'LOSS', volume: 4810, totalFee: 4.81, entryTime: new Date(Date.now() - 3 * 3600000).toISOString().slice(0, 19), exitTime: new Date(Date.now() - 2 * 3600000).toISOString().slice(0, 19) },
    { id: 3, symbol: 'ETHUSDT', side: 'SHORT', size: 0.5, leverage: 15, entryPrice: 42500, exitPrice: 43200, pnl: 1250, result: 'WIN', volume: 21600, totalFee: 21.6, entryTime: new Date(Date.now() - 4 * 3600000).toISOString().slice(0, 19), exitTime: new Date(Date.now() - 2.5 * 3600000).toISOString().slice(0, 19) },
    { id: 4, symbol: 'SOLUSDT', side: 'LONG', size: 0.5, leverage: 10, entryPrice: 42500, exitPrice: 43200, pnl: 1250, result: 'WIN', volume: 21600, totalFee: 21.6, entryTime: new Date(Date.now() - 5 * 3600000).toISOString().slice(0, 19), exitTime: new Date(Date.now() - 3 * 3600000).toISOString().slice(0, 19) },
  ],
  totalElements: 4,
  totalPages: 1,
  size: 20,
  number: 0,
  first: true,
  last: true,
  numberOfElements: 4,
  empty: false,
}

const mockClosedSummary: ClosedPositionsSummaryResponse = {
  totalClosedCount: 5,
  winRate: 80,
  longPnl: 1250,
  longCount: 3,
  shortPnl: -420,
  shortCount: 2,
}

// ============================================================
// Helper Components
// ============================================================

const coinColors: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#9945FF',
  BNB: '#F3BA2F',
  ADA: '#0033AD',
}

function extractCoin(symbol: string) {
  return symbol.replace(/USDT$/, '')
}

function formatPair(symbol: string) {
  const coin = extractCoin(symbol)
  return `${coin}/USDT`
}

function CoinIcon({ coin, size = 24 }: { coin: string; size?: number }) {
  const color = coinColors[coin] || '#888'
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.45 }}
    >
      {coin.charAt(0)}
    </div>
  )
}

/** Smooth bezier curve through points */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(i + 2, pts.length - 1)]
    const tension = 0.3
    const cp1x = p1.x + (p2.x - p0.x) * tension
    const cp1y = p1.y + (p2.y - p0.y) * tension
    const cp2x = p2.x - (p3.x - p1.x) * tension
    const cp2y = p2.y - (p3.y - p1.y) * tension
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return d
}

function PnLAreaChart({ data }: { data: { day: string; value: number }[] }) {
  if (data.length === 0) return null

  // Use cumulative values for the area chart
  const values = data.map(d => d.value)
  const cumulativeValues = values.reduce<number[]>((acc, v) => {
    acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + v)
    return acc
  }, [])

  const chartW = 700
  const chartH = 200
  const padding = { left: 45, right: 10, top: 15, bottom: 25 }
  const innerW = chartW - padding.left - padding.right
  const innerH = chartH - padding.top - padding.bottom

  const maxVal = Math.max(...cumulativeValues)
  const minVal = Math.min(...cumulativeValues, 0)
  const range = maxVal - minVal || 1

  const points = cumulativeValues.map((v, i) => ({
    x: padding.left + (i / (data.length - 1)) * innerW,
    y: padding.top + innerH - ((v - minVal) / range) * innerH,
  }))

  const linePath = smoothPath(points)
  const areaPath = `${linePath} L${points[points.length - 1].x},${padding.top + innerH} L${points[0].x},${padding.top + innerH} Z`

  // Y-axis grid lines (4 lines)
  const ySteps = 4
  const yGridLines = Array.from({ length: ySteps + 1 }, (_, i) => {
    const val = minVal + (range / ySteps) * (ySteps - i)
    const y = padding.top + (i / ySteps) * innerH
    return { val, y }
  })

  // X-axis labels (show every few)
  const labelInterval = Math.max(1, Math.floor(data.length / 7))

  return (
    <div>
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="none" style={{ height: '208px' }}>
        <defs>
          <linearGradient id="pnlAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#323232" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#323232" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines */}
        {yGridLines.map((g, i) => (
          <g key={i}>
            <line x1={padding.left} y1={g.y} x2={chartW - padding.right} y2={g.y} stroke="#E5E5E5" strokeWidth="0.5" />
            <text x={padding.left - 8} y={g.y + 4} textAnchor="end" fontSize="10" fill="#8F8F8F">
              {g.val >= 0 ? '+' : ''}{Math.round(g.val).toLocaleString()}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#pnlAreaFill)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#323232" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % labelInterval !== 0 && i !== data.length - 1) return null
          return (
            <text key={i} x={points[i].x} y={chartH - 5} textAnchor="middle" fontSize="10" fill="#8F8F8F">
              {d.day}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

// ============================================================
// Page Component
// ============================================================

export default function PnLPage() {
  const { isDemoMode } = useAuthStore()
  const [activeFilter, setActiveFilter] = useState('이전 7일')
  const [isLoading, setIsLoading] = useState(!isDemoMode)

  // API data state
  const [summary, setSummary] = useState<FuturesSummaryResponse>(mockSummary)
  const [ranking, setRanking] = useState<ProfitRankingResponse>(mockRanking)
  const [closedPositions, setClosedPositions] = useState<PageResponse<ClosedPositionResponse>>(mockClosedPositions)
  const [closedSummary, setClosedSummary] = useState<ClosedPositionsSummaryResponse>(mockClosedSummary)

  useEffect(() => {
    if (isDemoMode) return

    const period = periodMap[activeFilter] || '7d'
    let cancelled = false

    const fetchData = async () => {
      setIsLoading(true)

      const [summaryRes, rankingRes, positionsRes, closedSummaryRes] = await Promise.all([
        futuresApi.getSummary(period).catch((err) => {
          console.warn('Futures summary API error:', err.message)
          return null
        }),
        futuresApi.getProfitRanking(period).catch((err) => {
          console.warn('Futures ranking API error:', err.message)
          return null
        }),
        futuresApi.getClosedPositions(undefined, { page: 0, size: 20, sort: ['exitTime,desc'] }).catch((err) => {
          console.warn('Closed positions API error:', err.message)
          return null
        }),
        futuresApi.getClosedPositionsSummary(period).catch((err) => {
          console.warn('Closed positions summary API error:', err.message)
          return null
        }),
      ])

      if (cancelled) return

      if (summaryRes) setSummary(summaryRes)
      if (rankingRes) setRanking(rankingRes)
      if (positionsRes) setClosedPositions(positionsRes)
      if (closedSummaryRes) setClosedSummary(closedSummaryRes)

      setIsLoading(false)
    }

    fetchData()

    return () => { cancelled = true }
  }, [activeFilter, isDemoMode])

  // Derived data for UI
  const summaryCards = [
    { label: '총 손익', value: `${summary.totalPnl >= 0 ? '+' : ''}$${Math.abs(summary.totalPnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: '/icons/portfolio/icon-total-pnl.svg' },
    { label: '거래 규모', value: `$${summary.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: '/icons/portfolio/icon-trade-volume.svg' },
    { label: '승률', value: `${summary.winRate}%`, icon: '/icons/portfolio/icon-win-rate.svg' },
    { label: '승/패 횟수', value: `+${summary.winCount}/-${summary.lossCount}회`, icon: '/icons/portfolio/icon-win-loss-count.svg' },
  ]

  const topPairs = ranking.rankings.map((r) => ({
    rank: r.rank,
    pair: formatPair(r.symbol),
    coin: extractCoin(r.symbol),
    pnl: `${r.totalPnl >= 0 ? '+' : ''}$${Math.abs(r.totalPnl).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
    pnlValue: Math.abs(r.totalPnl),
    isPositive: r.totalPnl >= 0,
  }))

  const maxPnlValue = topPairs.length > 0 ? Math.max(...topPairs.map(p => p.pnlValue)) : 1

  const tradeHistory = closedPositions.content.map((p) => ({
    id: p.id,
    pair: formatPair(p.symbol),
    coin: extractCoin(p.symbol),
    qty: String(p.size),
    entry: `$${p.entryPrice.toLocaleString()}`,
    exit: `$${p.exitPrice.toLocaleString()}`,
    position: p.side === 'LONG' ? 'Long' as const : 'Short' as const,
    pnl: `${p.pnl >= 0 ? '+' : ''}$${Math.abs(p.pnl).toLocaleString()}`,
    result: p.result === 'WIN' ? 'Win' as const : 'Lose' as const,
    volume: `$${p.volume.toLocaleString()}`,
    fee: `$${p.totalFee.toLocaleString()}`,
  }))

  const detailCards = [
    { label: '총 종료 주문 수', value: `${closedSummary.totalClosedCount}회`, icon: '/icons/portfolio/icon-closed-orders.svg' },
    { label: '종료 주문 승률', value: `${closedSummary.winRate}%`, icon: '/icons/portfolio/icon-closed-win-rate.svg' },
    { label: '롱 포지션 손익', value: `${closedSummary.longPnl >= 0 ? '+' : ''}${closedSummary.longPnl.toLocaleString()}(${closedSummary.longCount}회)`, icon: '/icons/portfolio/icon-long-pnl.svg' },
    { label: '숏 포지션 손익', value: `${closedSummary.shortPnl >= 0 ? '+' : ''}${closedSummary.shortPnl.toLocaleString()}(${closedSummary.shortCount}회)`, icon: '/icons/portfolio/icon-short-pnl.svg' },
  ]

  const pnlChartData = summary.pnlChart.map((d) => ({
    day: d.date,
    value: d.pnl,
  }))

  return (
    <div className="flex flex-col gap-8">
      {/* Title Section */}
      <div className="space-y-2">
        <h1 className="text-title-1-bold text-label-normal">수익 관리</h1>
        <p className="text-body-1-regular text-label-neutral">
          계좌의 모든 거래 성과를 한눈에 파악하고 수익을 극대화하세요.
        </p>
      </div>

      {/* Tab Switcher + 거래소 필터 */}
      <div className="flex items-center justify-between">
        <PortfolioTabNav />
        <ExchangeFilter />
      </div>

      {/* 손익 Card */}
      <div className="bg-white rounded-xl border-[0.6px] border-gray-300 py-5 px-6 flex flex-col gap-8">
        {/* Card Header + Filters */}
        <div className="flex items-center justify-between">
          <h2 className="text-title-2-bold text-label-normal">손익</h2>
          <div className="flex gap-1">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-3 py-2 rounded-lg text-body-1-medium transition-colors",
                  activeFilter === filter
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-line-normal text-label-normal hover:bg-gray-50"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-3">
              <div className="w-14 h-14 flex-shrink-0">
                <Image src={card.icon} alt={card.label} width={56} height={56} />
              </div>
              <div className="space-y-1">
                <p className="text-body-2-medium text-label-neutral">{card.label}</p>
                <p className={cn(
                  "text-title-1-bold text-label-normal",
                  isLoading && "animate-pulse"
                )}>{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* P&L Area Chart */}
        <PnLAreaChart data={pnlChartData} />
      </div>

      {/* 손익 랭킹 Card */}
      <div className="bg-white rounded-xl border-[0.6px] border-gray-300 py-5 px-6 flex flex-col gap-5">
        <h2 className="text-title-2-bold text-label-normal">손익 랭킹</h2>
        <div className="space-y-5">
          {topPairs.map((pair) => (
            <div key={pair.rank} className="flex items-center gap-5">
              <span className="flex items-center justify-center min-w-[26px] h-5 px-2 rounded-full bg-gray-900 text-body-2-medium text-white">
                {pair.rank}
              </span>
              <CoinIcon coin={pair.coin} />
              <span className="text-body-2-bold text-label-normal w-20">{pair.pair}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full",
                    pair.isPositive ? "bg-element-positive-default" : "bg-element-danger-default"
                  )}
                  style={{ width: `${(pair.pnlValue / maxPnlValue) * 100}%` }}
                />
              </div>
              <span className={cn(
                "text-body-2-bold w-[100px] text-right",
                pair.isPositive ? "text-label-positive" : "text-label-danger"
              )}>
                {pair.pnl}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 체결 완료 주문 / 종료된 포지션 Card */}
      <div className="bg-white rounded-xl border-[0.6px] border-gray-300 py-5 px-6 flex flex-col gap-5">
        <h2 className="text-title-2-bold text-label-normal">체결 완료 주문 / 종료된 포지션</h2>

        {/* Detail Summary Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {detailCards.map((card) => (
            <div key={card.label} className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-3">
              <div className="w-14 h-14 flex-shrink-0">
                <Image src={card.icon} alt={card.label} width={56} height={56} />
              </div>
              <div className="space-y-1">
                <p className="text-body-2-medium text-label-neutral">{card.label}</p>
                <p className="text-title-1-bold text-label-normal">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trade History Table */}
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-9 gap-4 px-4 py-1 bg-gray-100 rounded-t-lg text-body-2-regular text-label-neutral min-w-[800px]">
            <span>거래 페어</span>
            <span className="text-right">수량</span>
            <span className="text-right">진입가</span>
            <span className="text-right">종료가</span>
            <span>포지션</span>
            <span className="text-right">손익</span>
            <span>결과</span>
            <span className="text-right">거래 규모</span>
            <span className="text-right">수수료</span>
          </div>

          {/* Table Body */}
          {tradeHistory.map((trade) => (
            <div
              key={trade.id}
              className="grid grid-cols-9 gap-4 px-4 py-3 border-b border-gray-200 last:border-b-0 items-center min-w-[800px]"
            >
              <span className="flex items-center gap-2">
                <CoinIcon coin={trade.coin} size={20} />
                <span className="text-body-2-bold text-label-normal">{trade.pair}</span>
              </span>
              <span className="text-right text-body-1-medium text-label-normal">{trade.qty}</span>
              <span className="text-right text-body-1-medium text-label-normal">{trade.entry}</span>
              <span className="text-right text-body-1-medium text-label-normal">{trade.exit}</span>
              <span className="flex items-center">
                <span className={cn(
                  "px-2 py-0.5 rounded text-caption-medium",
                  trade.position === 'Long'
                    ? "bg-element-positive-lighter text-element-positive-default"
                    : "bg-element-danger-lighter text-element-danger-default"
                )}>
                  {trade.position}
                </span>
              </span>
              <span className={cn(
                "text-right text-body-2-bold",
                trade.pnl.startsWith('+') ? "text-label-positive" : "text-label-danger"
              )}>
                {trade.pnl}
              </span>
              <span className="flex items-center">
                <span className={cn(
                  "px-2 py-0.5 rounded text-caption-medium",
                  trade.result === 'Win'
                    ? "bg-element-positive-lighter text-element-positive-default"
                    : "bg-element-danger-lighter text-element-danger-default"
                )}>
                  {trade.result}
                </span>
              </span>
              <span className="text-right text-body-1-medium text-label-normal">{trade.volume}</span>
              <span className="text-right text-body-1-medium text-label-normal">{trade.fee}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
