'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PortfolioTabNav } from '@/components/portfolio'

// 요약 카드 데이터
const summaryCards = [
  {
    label: '총 자산 (Total Assets)',
    value: '$124,500.00',
    badge: '+25%',
    badgeType: 'positive' as const,
    subValue: '184,720,650 KRW',
  },
  {
    label: '오늘의 손익',
    value: '+$4,250.00',
    badge: '+ 8.2%',
    badgeType: 'positive' as const,
    subValue: '6,306,575 KRW',
  },
  {
    label: '주간 손익',
    value: '64.2%',
    badge: '- 2.1%',
    badgeType: 'danger' as const,
    subValue: '6,306,575 KRW',
  },
]

// 시간 필터 옵션
const timeFilters = ['이전 7일', '30일', '60일', '90일', '180일', '사용자 지정']

// 자산 배분 데이터
const allocationData = [
  { symbol: 'BTC', name: 'Bitcoin', value: 82875, color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', value: 41000, color: '#38C0C0' },
]

export default function AssetsPage() {
  const [activeFilter, setActiveFilter] = useState('이전 7일')
  const [currentMonth] = useState('2025년 12월')

  const totalAllocation = allocationData.reduce((sum, a) => sum + a.value, 0)

  // 도넛 차트 세그먼트 계산 (totalAllocation이 0이면 빈 배열)
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
    <div className="flex flex-col gap-4">
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
      <div className="grid grid-cols-3 gap-5">
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

      {/* Chart Section */}
      <div className="bg-white rounded-xl border border-line-normal shadow-normal overflow-hidden">
        {/* Time Filters */}
        <div className="flex gap-2.5 p-5 border-b border-line-normal">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-3 py-2 rounded-lg text-body-1-medium transition-colors",
                activeFilter === filter
                  ? "bg-gray-800 text-white"
                  : "bg-white border border-line-normal text-label-normal hover:bg-gray-50"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="p-5">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-body-2-regular text-label-assistive">자산 추이 차트</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left - 일일손익 */}
        <div className="bg-white rounded-xl border border-line-normal shadow-normal py-5 px-6 space-y-4">
          <h3 className="text-body-1-bold text-label-normal">일일손익</h3>
          {/* Month Navigator */}
          <div className="flex items-center justify-center gap-4">
            <button className="p-1 hover:bg-gray-50 rounded transition-colors">
              <ChevronLeft className="w-5 h-5 text-label-normal" />
            </button>
            <span className="text-body-1-bold text-label-normal">{currentMonth}</span>
            <button className="p-1 hover:bg-gray-50 rounded transition-colors">
              <ChevronRight className="w-5 h-5 text-label-normal" />
            </button>
          </div>

          {/* Allocation Items */}
          <div className="space-y-2">
            {allocationData.map((asset) => (
              <div
                key={asset.symbol}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: asset.color }} />
                  <span className="text-body-2-medium text-label-normal">{asset.symbol}</span>
                  <span className="text-body-2-regular text-label-assistive">{asset.name}</span>
                </div>
                <span className="text-body-2-medium text-label-normal">
                  ${asset.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - 자산분포 Donut */}
        <div className="bg-white rounded-xl border border-line-normal shadow-normal py-5 px-6 flex flex-col items-center gap-4">
          <h3 className="text-body-1-bold text-label-normal self-start">자산분포</h3>

          {/* Donut Chart with centered text */}
          <div className="relative">
            <svg viewBox="0 0 260 260" className="w-[200px] h-[200px]">
              {segments}
              <circle cx="130" cy="130" r="60" fill="white" />
              <text x="130" y="122" textAnchor="middle" className="fill-label-assistive" fontSize="14" fontWeight="400">순자산</text>
              <text x="130" y="145" textAnchor="middle" className="fill-label-normal" fontSize="20" fontWeight="600">$9,401,908</text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex gap-6">
            {allocationData.map((asset) => (
              <div key={asset.symbol} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: asset.color }} />
                <span className="text-body-1-bold text-label-normal">
                  +{(asset.value / 100).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
