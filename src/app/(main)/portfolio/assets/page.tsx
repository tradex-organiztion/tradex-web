'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { PortfolioTabNav } from '@/components/portfolio'
import { ExchangeFilter } from '@/components/common/ExchangeFilter'
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

const _now = new Date()
const _curYear = _now.getFullYear()
const _curMonth = _now.getMonth() + 1
const _isoDate = (day: number) => `${_curYear}-${String(_curMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`

const mockDailyProfit: DailyProfitResponse = {
  year: _curYear,
  month: _curMonth,
  monthlyTotalPnl: 24595,
  monthlyReturnRate: 24.6,
  totalWinCount: 15,
  totalLossCount: 5,
  dailyPnlList: [
    { date: _isoDate(1), pnl: 1250, winCount: 1, lossCount: 0 },
    { date: _isoDate(2), pnl: -1250, winCount: 0, lossCount: 1 },
    { date: _isoDate(3), pnl: 1250, winCount: 1, lossCount: 0 },
    { date: _isoDate(4), pnl: 1250, winCount: 1, lossCount: 0 },
    { date: _isoDate(5), pnl: 1250, winCount: 1, lossCount: 0 },
    { date: _isoDate(6), pnl: -1250, winCount: 0, lossCount: 1 },
    { date: _isoDate(7), pnl: -1250, winCount: 0, lossCount: 1 },
    { date: _isoDate(8), pnl: 1250, winCount: 1, lossCount: 0 },
    { date: _isoDate(9), pnl: 1250, winCount: 1, lossCount: 0 },
    { date: _isoDate(10), pnl: 1250, winCount: 1, lossCount: 0 },
    { date: _isoDate(13), pnl: 1250, winCount: 1, lossCount: 0 },
    { date: _isoDate(18), pnl: 1250, winCount: 1, lossCount: 0 },
    { date: _isoDate(19), pnl: 1250, winCount: 1, lossCount: 0 },
  ],
}

const _mmdd = (day: number) => `${String(_curMonth).padStart(2, '0')}/${String(day).padStart(2, '0')}`

const mockCumulativeProfit: CumulativeProfitResponse = {
  startDate: _isoDate(1),
  endDate: _isoDate(14),
  totalProfit: 9200,
  totalProfitRate: 14.2,
  dailyProfits: [
    { date: _mmdd(1), profit: 2400, cumulativeProfit: 2400, cumulativeProfitRate: 2.1 },
    { date: _mmdd(2), profit: -600, cumulativeProfit: 1800, cumulativeProfitRate: 1.5 },
    { date: _mmdd(3), profit: 1400, cumulativeProfit: 3200, cumulativeProfitRate: 3.8 },
    { date: _mmdd(4), profit: 900, cumulativeProfit: 4100, cumulativeProfitRate: 5.2 },
    { date: _mmdd(5), profit: -500, cumulativeProfit: 3600, cumulativeProfitRate: 4.1 },
    { date: _mmdd(6), profit: 1600, cumulativeProfit: 5200, cumulativeProfitRate: 6.5 },
    { date: _mmdd(7), profit: -400, cumulativeProfit: 4800, cumulativeProfitRate: 5.8 },
    { date: _mmdd(8), profit: 1300, cumulativeProfit: 6100, cumulativeProfitRate: 8.2 },
    { date: _mmdd(9), profit: -700, cumulativeProfit: 5400, cumulativeProfitRate: 7.1 },
    { date: _mmdd(10), profit: 1800, cumulativeProfit: 7200, cumulativeProfitRate: 10.5 },
    { date: _mmdd(11), profit: -400, cumulativeProfit: 6800, cumulativeProfitRate: 9.2 },
    { date: _mmdd(12), profit: 1700, cumulativeProfit: 8500, cumulativeProfitRate: 12.8 },
    { date: _mmdd(13), profit: -600, cumulativeProfit: 7900, cumulativeProfitRate: 11.5 },
    { date: _mmdd(14), profit: 1300, cumulativeProfit: 9200, cumulativeProfitRate: 14.2 },
  ],
}

const mockAssetHistory: AssetHistoryResponse = {
  year: _curYear,
  month: _curMonth,
  startAsset: 95000,
  endAsset: 124500,
  monthlyReturnRate: 31.1,
  dailyAssets: [
    { date: _mmdd(1), totalAsset: 95000, dailyReturnRate: 0 },
    { date: _mmdd(3), totalAsset: 98000, dailyReturnRate: 3.2 },
    { date: _mmdd(5), totalAsset: 96000, dailyReturnRate: -2.0 },
    { date: _mmdd(7), totalAsset: 101000, dailyReturnRate: 5.2 },
    { date: _mmdd(9), totalAsset: 105000, dailyReturnRate: 4.0 },
    { date: _mmdd(11), totalAsset: 108000, dailyReturnRate: 2.9 },
    { date: _mmdd(13), totalAsset: 112000, dailyReturnRate: 3.7 },
    { date: _mmdd(15), totalAsset: 110000, dailyReturnRate: -1.8 },
    { date: _mmdd(17), totalAsset: 118000, dailyReturnRate: 7.3 },
    { date: _mmdd(19), totalAsset: 124500, dailyReturnRate: 5.5 },
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

function LineChart({ data, color, unit, showArea, gradientId, lineColor, areaColor }: {
  data: { day: string; value: number }[]
  color: string
  unit?: string
  showArea?: boolean
  gradientId?: string
  lineColor?: string
  areaColor?: string
}) {
  if (data.length === 0) return null
  const w = 700
  const h = 180
  const pLeft = 45
  const pRight = 10
  const pTop = 15
  const pBottom = 25
  const chartW = w - pLeft - pRight
  const chartH = h - pTop - pBottom

  const rawMin = Math.min(...data.map(d => d.value))
  const rawMax = Math.max(...data.map(d => d.value))
  const minVal = rawMin * 0.9
  const maxVal = rawMax * 1.05
  const range = maxVal - minVal || 1

  const points = data.map((d, i) => {
    const x = pLeft + (i / Math.max(data.length - 1, 1)) * chartW
    const y = pTop + chartH - ((d.value - minVal) / range) * chartH
    return { x, y, ...d }
  })

  const linePath = smoothPath(points)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${pTop + chartH} L ${points[0].x} ${pTop + chartH} Z`

  const gId = gradientId || `areaGrad-${color.replace('#', '')}`

  const gridLines = 4
  const yLabels = Array.from({ length: gridLines + 1 }, (_, i) => {
    const val = minVal + ((maxVal - minVal) / gridLines) * i
    return { y: pTop + chartH - (i / gridLines) * chartH, label: unit === '%' ? `${val.toFixed(1)}%` : `$${(val / 1000).toFixed(0)}k` }
  })

  // Find max point for dot marker
  const maxPoint = points.reduce((max, p) => p.y < max.y ? p : max, points[0])

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: '100%' }}>
      <defs>
        <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={areaColor || color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={areaColor || color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {yLabels.map((l, i) => (
        <g key={i}>
          <line x1={pLeft} y1={l.y} x2={w - pRight} y2={l.y} stroke="#F1F1F1" strokeWidth="0.5" />
          <text x={pLeft - 6} y={l.y + 3} textAnchor="end" fontSize="10" className="fill-label-assistive">{l.label}</text>
        </g>
      ))}
      {showArea && <path d={areaPath} fill={`url(#${gId})`} />}
      <path d={linePath} fill="none" stroke={lineColor || color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Peak dot marker */}
      <circle cx={maxPoint.x} cy={maxPoint.y} r={3.5} fill="white" stroke={lineColor || color} strokeWidth="2" />
      {/* X-axis labels */}
      {data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 5)) === 0 || i === data.length - 1).map((d) => {
        const idx = data.indexOf(d)
        return (
          <text key={idx} x={points[idx].x} y={h - 5} textAnchor="middle" fontSize="10" className="fill-label-assistive">
            {d.day}
          </text>
        )
      })}
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

  const totalAssetChartData = assetHistory.dailyAssets.map((d) => {
    // X축에 일자 번호만 표시 (01/15 → 15)
    const dayNum = d.date.includes('/') ? d.date.split('/')[1].replace(/^0/, '') : d.date
    return { day: dayNum, value: d.totalAsset }
  })

  // Donut chart segments
  const cumulativePercents = totalAllocation === 0 ? [] : allocationData.reduce<number[]>((acc, asset) => {
    const prev = acc.length > 0 ? acc[acc.length - 1] : 0
    acc.push(prev + (asset.value / totalAllocation) * 100)
    return acc
  }, [])

  // Ring (annulus) segments instead of pie
  const ringSegments = totalAllocation === 0 ? [] : allocationData.map((asset, i) => {
    const percent = (asset.value / totalAllocation) * 100
    const startPercent = i === 0 ? 0 : cumulativePercents[i - 1]
    const startAngle = startPercent * 3.6
    const endAngle = (startPercent + percent) * 3.6

    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180
    const largeArc = percent > 50 ? 1 : 0

    const cx = 130, cy = 130, outerR = 110, innerR = 75
    const ox1 = cx + outerR * Math.cos(startRad)
    const oy1 = cy + outerR * Math.sin(startRad)
    const ox2 = cx + outerR * Math.cos(endRad)
    const oy2 = cy + outerR * Math.sin(endRad)
    const ix1 = cx + innerR * Math.cos(endRad)
    const iy1 = cy + innerR * Math.sin(endRad)
    const ix2 = cx + innerR * Math.cos(startRad)
    const iy2 = cy + innerR * Math.sin(startRad)

    return (
      <path
        key={asset.symbol}
        d={`M ${ox1} ${oy1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${ox2} ${oy2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} Z`}
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

      {/* Tab Switcher + 거래소 필터 */}
      <div className="flex items-center justify-between">
        <PortfolioTabNav />
        <ExchangeFilter />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border-[0.6px] border-gray-300 py-5 px-6 space-y-2"
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
      <div className="bg-white rounded-xl border-[0.6px] border-gray-300 py-5 px-6 flex flex-col gap-8">
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
              <LineChart data={amountChartData} color="#131416" showArea gradientId="amountGrad" />
            </div>
          </div>

          {/* 퍼센트 기준 */}
          <div className="pl-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-body-1-bold text-label-assistive">%</span>
              <span className="text-body-1-bold text-label-normal">퍼센트 기준</span>
            </div>
            <div className="h-40">
              <LineChart data={percentChartData} color="#131416" unit="%" showArea gradientId="percentGrad" />
            </div>
          </div>
        </div>
      </div>

      {/* 총 자산 현황 Card */}
      <div className="bg-white rounded-xl border-[0.6px] border-gray-300 py-5 px-6 flex flex-col gap-5">
        <h2 className="text-title-2-bold text-label-normal">총 자산 현황</h2>
        <div className="h-48">
          <LineChart data={totalAssetChartData} color="#131416" showArea gradientId="totalAssetGrad" />
        </div>
      </div>

      {/* Bottom Section: 일일손익 + 자산분포 */}
      <div className="grid grid-cols-[1fr_auto] gap-3">
        {/* 일일손익 */}
        <div className="bg-white rounded-xl border-[0.6px] border-gray-300 py-5 px-6 flex flex-col gap-5">
          <h2 className="text-title-2-bold text-label-normal">일일손익</h2>

          {/* Summary Stat Boxes - Figma: bg #F8F8F8, padding 12px 16px, gap 16px, rounded-lg */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-3">
              <div className="w-14 h-14 flex-shrink-0">
                <Image src="/icons/portfolio/icon-monthly-pnl.svg" alt="월간 손익" width={56} height={56} />
              </div>
              <div className="space-y-1">
                <p className="text-body-2-medium text-label-neutral">월간 손익</p>
                <p className="text-title-1-bold text-label-normal">
                  {dailyProfit.monthlyTotalPnl >= 0 ? '+' : ''}${dailyProfit.monthlyTotalPnl.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-3">
              <div className="w-14 h-14 flex-shrink-0">
                <Image src="/icons/portfolio/icon-return-rate.svg" alt="투자 대비 수익률" width={56} height={56} />
              </div>
              <div className="space-y-1">
                <p className="text-body-2-medium text-label-neutral">투자 대비 수익률</p>
                <p className="text-title-1-bold text-label-normal">
                  {dailyProfit.monthlyReturnRate >= 0 ? '+' : ''}{dailyProfit.monthlyReturnRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Calendar Month Navigator - Figma: left-aligned */}
          <div className="flex items-center gap-4">
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
        <div className="bg-white rounded-xl border-[0.6px] border-gray-300 py-5 px-6 flex flex-col items-center gap-4 w-full md:w-[340px] shrink-0">
          <h2 className="text-title-2-bold text-label-normal self-start">자산분포</h2>

          {/* Donut Chart - Figma: large donut filling most of card width */}
          <div className="relative flex items-center justify-center w-full py-4">
            <svg viewBox="0 0 260 260" className="w-[260px] h-[260px]">
              {ringSegments}
              <text x="130" y="122" textAnchor="middle" className="fill-label-assistive" fontSize="12" fontWeight="400">순자산</text>
              <text x="130" y="148" textAnchor="middle" className="fill-label-normal" fontSize="18" fontWeight="600">
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
