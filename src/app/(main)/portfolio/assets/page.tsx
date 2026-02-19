'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { PortfolioTabNav } from '@/components/portfolio'
import { useAuthStore } from '@/stores/useAuthStore'
import { portfolioApi } from '@/lib/api'
import type {
  PortfolioSummaryResponse,
  AssetDistributionResponse,
  DailyProfitResponse,
  CumulativeProfitResponse,
  CumulativeProfitPeriod,
  AssetHistoryResponse,
} from '@/lib/api'

const timeFilters = ['이전 7일', '30일', '60일', '90일', '180일', '사용자 지정']

const periodMap: Record<string, CumulativeProfitPeriod> = {
  '이전 7일': '7d',
  '30일': '30d',
  '60일': '60d',
  '90일': '90d',
  '180일': '180d',
  '사용자 지정': 'custom',
}

// ============================================================
// Mock Data (demo mode / API fallback)
// ============================================================

const mockSummary: PortfolioSummaryResponse = {
  totalAsset: 124500,
  todayPnl: 4250,
  todayPnlRate: 8.2,
  weeklyPnl: -3328.68,
  weeklyPnlRate: -2.1,
}

const mockDistribution: AssetDistributionResponse = {
  totalNetAsset: 123875,
  coins: [
    { coin: 'BTC', quantity: 1.2, usdValue: 82875, percentage: 66.9 },
    { coin: 'ETH', quantity: 12.5, usdValue: 41000, percentage: 33.1 },
  ],
}

const mockDailyProfit: DailyProfitResponse = {
  year: 2025,
  month: 12,
  monthlyTotalPnl: 24595,
  monthlyReturnRate: 24.6,
  totalWinCount: 15,
  totalLossCount: 5,
  dailyPnlList: [
    { date: '2025-12-01', pnl: 1250, winCount: 1, lossCount: 0 },
    { date: '2025-12-02', pnl: -1250, winCount: 0, lossCount: 1 },
    { date: '2025-12-03', pnl: 1250, winCount: 1, lossCount: 0 },
    { date: '2025-12-04', pnl: 1250, winCount: 1, lossCount: 0 },
    { date: '2025-12-05', pnl: 1250, winCount: 1, lossCount: 0 },
    { date: '2025-12-06', pnl: -1250, winCount: 0, lossCount: 1 },
    { date: '2025-12-07', pnl: -1250, winCount: 0, lossCount: 1 },
    { date: '2025-12-08', pnl: 1250, winCount: 1, lossCount: 0 },
    { date: '2025-12-09', pnl: 1250, winCount: 1, lossCount: 0 },
    { date: '2025-12-10', pnl: 1250, winCount: 1, lossCount: 0 },
    { date: '2025-12-13', pnl: 1250, winCount: 1, lossCount: 0 },
    { date: '2025-12-18', pnl: 1250, winCount: 1, lossCount: 0 },
    { date: '2025-12-19', pnl: 1250, winCount: 1, lossCount: 0 },
    { date: '2025-12-20', pnl: 1250, winCount: 1, lossCount: 0 },
    { date: '2025-12-27', pnl: 1250, winCount: 1, lossCount: 0 },
  ],
}

const mockCumulativeProfit: CumulativeProfitResponse = {
  startDate: '2025-01-06',
  endDate: '2025-01-19',
  totalProfit: 9200,
  totalProfitRate: 14.2,
  dailyProfits: [
    { date: '01/06', profit: 2400, cumulativeProfit: 2400, cumulativeProfitRate: 2.1 },
    { date: '01/07', profit: -600, cumulativeProfit: 1800, cumulativeProfitRate: 1.5 },
    { date: '01/08', profit: 1400, cumulativeProfit: 3200, cumulativeProfitRate: 3.8 },
    { date: '01/09', profit: 900, cumulativeProfit: 4100, cumulativeProfitRate: 5.2 },
    { date: '01/10', profit: -500, cumulativeProfit: 3600, cumulativeProfitRate: 4.1 },
    { date: '01/11', profit: 1600, cumulativeProfit: 5200, cumulativeProfitRate: 6.5 },
    { date: '01/12', profit: -400, cumulativeProfit: 4800, cumulativeProfitRate: 5.8 },
    { date: '01/13', profit: 1300, cumulativeProfit: 6100, cumulativeProfitRate: 8.2 },
    { date: '01/14', profit: -700, cumulativeProfit: 5400, cumulativeProfitRate: 7.1 },
    { date: '01/15', profit: 1800, cumulativeProfit: 7200, cumulativeProfitRate: 10.5 },
    { date: '01/16', profit: -400, cumulativeProfit: 6800, cumulativeProfitRate: 9.2 },
    { date: '01/17', profit: 1700, cumulativeProfit: 8500, cumulativeProfitRate: 12.8 },
    { date: '01/18', profit: -600, cumulativeProfit: 7900, cumulativeProfitRate: 11.5 },
    { date: '01/19', profit: 1300, cumulativeProfit: 9200, cumulativeProfitRate: 14.2 },
  ],
}

const mockAssetHistory: AssetHistoryResponse = {
  year: 2025,
  month: 1,
  startAsset: 95000,
  endAsset: 124500,
  monthlyReturnRate: 31.1,
  dailyAssets: [
    { date: '01/01', totalAsset: 95000, dailyReturnRate: 0 },
    { date: '01/03', totalAsset: 98000, dailyReturnRate: 3.2 },
    { date: '01/05', totalAsset: 96000, dailyReturnRate: -2.0 },
    { date: '01/07', totalAsset: 101000, dailyReturnRate: 5.2 },
    { date: '01/09', totalAsset: 105000, dailyReturnRate: 4.0 },
    { date: '01/11', totalAsset: 108000, dailyReturnRate: 2.9 },
    { date: '01/13', totalAsset: 112000, dailyReturnRate: 3.7 },
    { date: '01/15', totalAsset: 110000, dailyReturnRate: -1.8 },
    { date: '01/17', totalAsset: 118000, dailyReturnRate: 7.3 },
    { date: '01/19', totalAsset: 124500, dailyReturnRate: 5.5 },
  ],
}

const coinColors: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#38C0C0',
  SOL: '#9945FF',
  BNB: '#F3BA2F',
  USDT: '#26A17B',
}

// ============================================================
// Calendar Helper
// ============================================================

function getCalendarDays(year: number, month: number, dailyPnlMap: Record<number, number>) {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()

  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const prevMonthLast = new Date(year, month - 1, 0).getDate()
  const weeks: { day: number; currentMonth: boolean; pnl?: number }[][] = []
  let currentWeek: { day: number; currentMonth: boolean; pnl?: number }[] = []

  for (let i = startDow - 1; i >= 0; i--) {
    currentWeek.push({ day: prevMonthLast - i, currentMonth: false })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push({ day: d, currentMonth: true, pnl: dailyPnlMap[d] })
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    let nextDay = 1
    while (currentWeek.length < 7) {
      currentWeek.push({ day: nextDay, currentMonth: false })
      nextDay++
    }
    weeks.push(currentWeek)
  }

  return weeks
}

// ============================================================
// Line Chart Component
// ============================================================

function LineChart({ data, color, unit, showArea }: {
  data: { day: string; value: number }[]
  color: string
  unit?: string
  showArea?: boolean
}) {
  if (data.length === 0) return null
  const w = 320
  const h = 130
  const px = 30
  const py = 10
  const chartW = w - px * 2
  const chartH = h - py * 2

  const minVal = Math.min(...data.map(d => d.value)) * 0.9
  const maxVal = Math.max(...data.map(d => d.value)) * 1.05

  const points = data.map((d, i) => {
    const x = px + (i / (data.length - 1)) * chartW
    const y = py + chartH - ((d.value - minVal) / (maxVal - minVal)) * chartH
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${py + chartH} L ${points[0].x} ${py + chartH} Z`

  const gridLines = 4
  const yLabels = Array.from({ length: gridLines + 1 }, (_, i) => {
    const val = minVal + ((maxVal - minVal) / gridLines) * i
    return { y: py + chartH - (i / gridLines) * chartH, label: unit === '%' ? `${val.toFixed(1)}%` : `$${(val / 1000).toFixed(0)}k` }
  })

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      {yLabels.map((l, i) => (
        <g key={i}>
          <line x1={px} y1={l.y} x2={w - 10} y2={l.y} stroke="#F1F1F1" strokeWidth="1" />
          <text x={px - 4} y={l.y + 3} textAnchor="end" fontSize="8" className="fill-label-assistive">{l.label}</text>
        </g>
      ))}
      {showArea && <path d={areaPath} fill={color} opacity="0.1" />}
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={color} />
      ))}
    </svg>
  )
}

// ============================================================
// Page Component
// ============================================================

export default function AssetsPage() {
  const { isDemoMode } = useAuthStore()
  const [activeFilter, setActiveFilter] = useState('이전 7일')

  const now = new Date()
  const [calYear, setCalYear] = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth() + 1)

  // API data state
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummaryResponse>(mockSummary)
  const [distribution, setDistribution] = useState<AssetDistributionResponse>(mockDistribution)
  const [dailyProfit, setDailyProfit] = useState<DailyProfitResponse>(mockDailyProfit)
  const [cumulativeProfit, setCumulativeProfit] = useState<CumulativeProfitResponse>(mockCumulativeProfit)
  const [assetHistory, setAssetHistory] = useState<AssetHistoryResponse>(mockAssetHistory)

  // Fetch portfolio summary + distribution (no period dependency)
  useEffect(() => {
    if (isDemoMode) return

    const fetchBase = async () => {
      const [summaryRes, distRes] = await Promise.all([
        portfolioApi.getSummary().catch((err) => {
          console.warn('Portfolio summary API error:', err.message)
          return null
        }),
        portfolioApi.getDistribution().catch((err) => {
          console.warn('Portfolio distribution API error:', err.message)
          return null
        }),
      ])

      if (summaryRes) setPortfolioSummary(summaryRes)
      if (distRes) setDistribution(distRes)
    }

    fetchBase()
  }, [isDemoMode])

  // Fetch period-dependent data
  useEffect(() => {
    if (isDemoMode) return

    const period = periodMap[activeFilter] || '7d'

    const fetchPeriodData = async () => {
      const [cumulRes, assetRes] = await Promise.all([
        portfolioApi.getCumulativeProfit(period).catch((err) => {
          console.warn('Cumulative profit API error:', err.message)
          return null
        }),
        portfolioApi.getAssetHistory(calYear, calMonth).catch((err) => {
          console.warn('Asset history API error:', err.message)
          return null
        }),
      ])

      if (cumulRes) setCumulativeProfit(cumulRes)
      if (assetRes) setAssetHistory(assetRes)
    }

    fetchPeriodData()
  }, [activeFilter, isDemoMode, calYear, calMonth])

  // Fetch daily profit for calendar
  useEffect(() => {
    if (isDemoMode) return

    const fetchDailyProfit = async () => {
      const res = await portfolioApi.getDailyProfit(calYear, calMonth).catch((err) => {
        console.warn('Daily profit API error:', err.message)
        return null
      })
      if (res) setDailyProfit(res)
    }

    fetchDailyProfit()
  }, [isDemoMode, calYear, calMonth])

  // Navigate calendar
  const handlePrevMonth = () => {
    if (calMonth === 1) {
      setCalYear(calYear - 1)
      setCalMonth(12)
    } else {
      setCalMonth(calMonth - 1)
    }
  }
  const handleNextMonth = () => {
    if (calMonth === 12) {
      setCalYear(calYear + 1)
      setCalMonth(1)
    } else {
      setCalMonth(calMonth + 1)
    }
  }

  // Derived data
  const summaryCards = [
    {
      label: '총 자산',
      value: `$${portfolioSummary.totalAsset.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      badge: `${portfolioSummary.todayPnlRate >= 0 ? '+' : ''}${portfolioSummary.todayPnlRate.toFixed(0)}%`,
      badgeType: (portfolioSummary.todayPnlRate >= 0 ? 'positive' : 'danger') as 'positive' | 'danger',
      subValue: `${(portfolioSummary.totalAsset * 1485).toLocaleString('ko-KR')} KRW`,
    },
    {
      label: '오늘의 손익',
      value: `${portfolioSummary.todayPnl >= 0 ? '+' : ''}$${Math.abs(portfolioSummary.todayPnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      badge: `${portfolioSummary.todayPnlRate >= 0 ? '+' : ''} ${portfolioSummary.todayPnlRate.toFixed(1)}%`,
      badgeType: (portfolioSummary.todayPnlRate >= 0 ? 'positive' : 'danger') as 'positive' | 'danger',
      subValue: `${(Math.abs(portfolioSummary.todayPnl) * 1485).toLocaleString('ko-KR')} KRW`,
    },
    {
      label: '주간 손익',
      value: `${portfolioSummary.weeklyPnl >= 0 ? '+' : '-'}$${Math.abs(portfolioSummary.weeklyPnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      badge: `${portfolioSummary.weeklyPnlRate >= 0 ? '+' : ''} ${portfolioSummary.weeklyPnlRate.toFixed(1)}%`,
      badgeType: (portfolioSummary.weeklyPnlRate >= 0 ? 'positive' : 'danger') as 'positive' | 'danger',
      subValue: `${(Math.abs(portfolioSummary.weeklyPnl) * 1485).toLocaleString('ko-KR')} KRW`,
    },
  ]

  const allocationData = distribution.coins.map((coin) => ({
    symbol: coin.coin,
    name: coin.coin,
    value: coin.usdValue,
    color: coinColors[coin.coin] || '#888',
  }))

  const totalAllocation = allocationData.reduce((sum, a) => sum + a.value, 0)

  // Calendar PnL map
  const calendarPnlMap: Record<number, number> = {}
  dailyProfit.dailyPnlList.forEach((d) => {
    const day = new Date(d.date).getDate()
    calendarPnlMap[day] = d.pnl
  })

  const weeks = getCalendarDays(calYear, calMonth, calendarPnlMap)

  // Chart data from cumulative profit API
  const amountChartData = cumulativeProfit.dailyProfits.map((d) => ({
    day: d.date,
    value: d.cumulativeProfit,
  }))

  const percentChartData = cumulativeProfit.dailyProfits.map((d) => ({
    day: d.date,
    value: d.cumulativeProfitRate,
  }))

  const totalAssetChartData = assetHistory.dailyAssets.map((d) => ({
    day: d.date,
    value: d.totalAsset,
  }))

  // Donut chart segments
  const cumulativePercents = totalAllocation === 0 ? [] : allocationData.reduce<number[]>((acc, asset) => {
    const prev = acc.length > 0 ? acc[acc.length - 1] : 0
    acc.push(prev + (asset.value / totalAllocation) * 100)
    return acc
  }, [])

  const segments = totalAllocation === 0 ? [] : allocationData.map((asset, i) => {
    const percent = (asset.value / totalAllocation) * 100
    const startPercent = i === 0 ? 0 : cumulativePercents[i - 1]
    const startAngle = startPercent * 3.6
    const endAngle = (startPercent + percent) * 3.6

    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180
    const largeArc = percent > 50 ? 1 : 0

    const cx = 130, cy = 130, r = 100
    const x1 = cx + r * Math.cos(startRad)
    const y1 = cy + r * Math.sin(startRad)
    const x2 = cx + r * Math.cos(endRad)
    const y2 = cy + r * Math.sin(endRad)

    return (
      <path
        key={asset.symbol}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={asset.color}
      />
    )
  })

  return (
    <div className="flex flex-col gap-8">
      {/* Title Section */}
      <div className="space-y-2">
        <h1 className="text-title-1-bold text-label-normal">수익 관리</h1>
        <p className="text-body-1-regular text-label-neutral">
          계좌의 모든 거래 성과를 한눈에 파악하고 수익을 극대화하세요.
        </p>
      </div>

      {/* Tab Switcher */}
      <PortfolioTabNav />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-line-normal shadow-normal py-5 px-6 space-y-2"
          >
            <p className="text-body-2-medium text-label-neutral">{card.label}</p>
            <div className="flex items-center gap-2">
              <span className="text-title-1-bold text-label-normal">{card.value}</span>
              <span className={cn(
                "px-2 py-0.5 rounded text-caption-medium",
                card.badgeType === 'positive'
                  ? "bg-element-positive-lighter text-element-positive-default"
                  : "bg-element-danger-lighter text-element-danger-default"
              )}>
                {card.badge}
              </span>
            </div>
            <p className="text-body-2-regular text-label-assistive">{card.subValue}</p>
          </div>
        ))}
      </div>

      {/* 누적 손익 Card */}
      <div className="bg-white rounded-xl border border-line-normal shadow-normal py-5 px-6 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-title-2-bold text-label-normal">누적 손익</h2>
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

        {/* Dual Charts */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-0 md:divide-x md:divide-line-normal">
          {/* 금액 기준 */}
          <div className="pr-4 space-y-3">
            <div className="flex items-center gap-2">
              <Image src="/icons/icon-dollar.svg" alt="dollar" width={20} height={20} />
              <span className="text-body-1-bold text-label-normal">금액 기준</span>
            </div>
            <div className="h-40">
              <LineChart data={amountChartData} color="#13C34E" showArea />
            </div>
          </div>

          {/* 퍼센트 기준 */}
          <div className="pl-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-body-1-bold text-label-assistive">%</span>
              <span className="text-body-1-bold text-label-normal">퍼센트 기준</span>
            </div>
            <div className="h-40">
              <LineChart data={percentChartData} color="#0070FF" unit="%" showArea />
            </div>
          </div>
        </div>
      </div>

      {/* 총 자산 현황 Card */}
      <div className="bg-white rounded-xl border border-line-normal shadow-normal py-5 px-6 flex flex-col gap-5">
        <h2 className="text-title-2-bold text-label-normal">총 자산 현황</h2>
        <div className="h-48">
          <LineChart data={totalAssetChartData} color="#131416" showArea />
        </div>
      </div>

      {/* Bottom Section: 일일손익 + 자산분포 */}
      <div className="grid grid-cols-[1fr_auto] gap-3">
        {/* 일일손익 */}
        <div className="bg-white rounded-xl border border-line-normal shadow-normal py-5 px-6 flex flex-col gap-5">
          <h2 className="text-title-2-bold text-label-normal">일일 손익 (KRW)</h2>

          {/* Summary Stat Boxes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-3">
              <div className="w-14 h-14 flex items-center justify-center bg-gray-200/80 rounded-lg flex-shrink-0">
                <Image src="/icons/icon-signal.svg" alt="pnl" width={24} height={24} />
              </div>
              <div className="space-y-1">
                <p className="text-body-2-medium text-label-neutral">월간 손익</p>
                <p className="text-title-1-bold text-label-normal">
                  {dailyProfit.monthlyTotalPnl >= 0 ? '+' : ''}${dailyProfit.monthlyTotalPnl.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-3">
              <div className="w-14 h-14 flex items-center justify-center bg-gray-200/80 rounded-lg flex-shrink-0">
                <Image src="/icons/icon-signal.svg" alt="rate" width={24} height={24} />
              </div>
              <div className="space-y-1">
                <p className="text-body-2-medium text-label-neutral">투자 대비 수익률</p>
                <p className="text-title-1-bold text-label-normal">
                  {dailyProfit.monthlyReturnRate >= 0 ? '+' : ''}{dailyProfit.monthlyReturnRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Calendar Month Navigator */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-50 rounded transition-colors">
              <ChevronLeft className="w-5 h-5 text-label-normal" />
            </button>
            <span className="text-body-1-bold text-label-normal">{calYear}년 {calMonth}월</span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-50 rounded transition-colors">
              <ChevronRight className="w-5 h-5 text-label-normal" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div>
            {/* Weekday Header */}
            <div className="grid grid-cols-7 bg-gray-100 rounded-t-lg">
              {['월', '화', '수', '목', '금', '토', '일'].map((d) => (
                <div key={d} className="py-1.5 text-center text-body-2-regular text-label-neutral">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7">
                {week.map((cell, ci) => {
                  const hasPnl = cell.pnl !== undefined
                  const isPositive = hasPnl && cell.pnl! > 0
                  const isNegative = hasPnl && cell.pnl! < 0

                  return (
                    <div key={ci} className="p-1">
                      <div
                        className={cn(
                          "rounded-lg h-14 px-2 py-1 flex flex-col",
                          !cell.currentMonth && "opacity-40",
                          isPositive && "bg-element-positive-lighter",
                          isNegative && "bg-element-danger-lighter"
                        )}
                      >
                        <span className={cn(
                          "text-body-2-medium",
                          cell.currentMonth ? "text-label-neutral" : "text-label-disabled"
                        )}>
                          {cell.day}
                        </span>
                        {hasPnl && (
                          <span className={cn(
                            "text-body-2-bold text-xs truncate",
                            isPositive ? "text-label-positive" : "text-label-danger"
                          )}>
                            {isPositive ? `+${cell.pnl!.toLocaleString()}` : cell.pnl!.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 자산분포 */}
        <div className="bg-white rounded-xl border border-line-normal shadow-normal py-5 px-6 flex flex-col items-center gap-4 w-full md:w-[340px] shrink-0">
          <h2 className="text-title-2-bold text-label-normal self-start">자산 분포 (KRW)</h2>

          {/* Donut Chart */}
          <div className="relative">
            <svg viewBox="0 0 260 260" className="w-[200px] h-[200px]">
              {segments}
              <circle cx="130" cy="130" r="60" fill="white" />
              <text x="130" y="122" textAnchor="middle" className="fill-label-assistive" fontSize="14" fontWeight="400">순자산</text>
              <text x="130" y="145" textAnchor="middle" className="fill-label-normal" fontSize="20" fontWeight="600">
                ${distribution.totalNetAsset.toLocaleString()}
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div className="w-full space-y-2">
            {allocationData.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }} />
                  <span className="text-body-2-medium text-label-normal">{asset.symbol}</span>
                </div>
                <span className="text-body-2-bold text-label-positive">
                  +{asset.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
