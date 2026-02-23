'use client'

import { useState, useEffect, useCallback } from 'react'
import { Check } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { DatePickerCalendar } from '@/components/common'
import { ExchangeFilter } from '@/components/common/ExchangeFilter'
import { useAuthStore } from '@/stores/useAuthStore'
import { riskApi, type RiskAnalysisResponse } from '@/lib/api/analysis'

// 리스크 카테고리 타입
type RiskCategory = 'entry' | 'exit' | 'position' | 'timing' | 'emotion'

// 탭 데이터 - Figma 디자인 기준
const RISK_TABS: { id: RiskCategory; label: string }[] = [
  { id: 'entry', label: '진입 리스크' },
  { id: 'exit', label: '청산리스크' },
  { id: 'position', label: '포지션 관리 리스크' },
  { id: 'timing', label: '시간∙상황 리스크' },
  { id: 'emotion', label: '감정 기반 리스크' },
]

// 탭별 UI 데이터 타입
interface RiskTabData {
  title: string
  description: string
  aiInsight: string
  stats: { label: string; value: string; details?: { label: string; value: string }[] }[]
  best: { label: string; value: string }
  worst: { label: string; value: string }
}

// 안전한 숫자 포맷팅 (null/undefined 방어)
const fmt = (v: number | null | undefined, digits = 0) => (v ?? 0).toFixed(digits)

// API 응답을 UI 데이터로 변환
function mapApiToTabData(data: RiskAnalysisResponse): Record<RiskCategory, RiskTabData> {
  const { entryRisk, exitRisk, positionManagementRisk, timeRisk, emotionalRisk, totalTrades } = data

  return {
    entry: {
      title: '진입 리스크',
      description: '어떤 상황에서 잘못 들어가고 있는가?',
      aiInsight: `지난 기간동안 매매의 ${fmt(entryRisk.unplannedEntryRate)}%가 '계획 외 진입'이며, 이 구간은 평균 승률이 ${fmt(entryRisk.unplannedEntryWinRate)}%입니다.`,
      stats: [
        {
          label: '계획 외 진입',
          value: `${fmt(entryRisk.unplannedEntryRate)}%`,
          details: [
            { label: '횟수', value: `${entryRisk.unplannedEntryCount ?? 0}/${totalTrades}회` },
          ]
        },
        {
          label: '손절 후 재진입',
          value: `${entryRisk.emotionalReEntryCount ?? 0}회`,
          details: [
            { label: '횟수', value: `${entryRisk.emotionalReEntryCount ?? 0}회` },
            { label: '비율', value: `${fmt(entryRisk.emotionalReEntryRate)}%` },
          ]
        },
        {
          label: '연속 진입(뇌동매매)',
          value: `${entryRisk.impulsiveTradeCount ?? 0}회`,
          details: [
            { label: '횟수', value: `${entryRisk.impulsiveTradeCount ?? 0}회` },
            { label: '비율', value: `${fmt(entryRisk.impulsiveTradeRate)}%` },
          ]
        },
      ],
      best: { label: '사전 분석 진입 승률', value: `${fmt(entryRisk.plannedEntryWinRate)}%` },
      worst: { label: '계획 외 진입 승률', value: `${fmt(entryRisk.unplannedEntryWinRate)}%` },
    },
    exit: {
      title: '청산 리스크',
      description: '왜 수익을 극대화하지 못하고 손실을 키우는가?',
      aiInsight: `${totalTrades}번의 거래 중 ${exitRisk.earlyTpCount ?? 0}번에서 목표가 도달 전 조기 익절이 발생했습니다.`,
      stats: [
        {
          label: '손절가 미준수',
          value: `${fmt(exitRisk.slViolationRate)}%`,
          details: [
            { label: '횟수', value: `${exitRisk.slViolationCount ?? 0}/${totalTrades}회` },
          ]
        },
        {
          label: '조기 익절',
          value: `${fmt(exitRisk.earlyTpRate)}%`,
          details: [
            { label: '횟수', value: `${exitRisk.earlyTpCount ?? 0}/${totalTrades}회` },
          ]
        },
        {
          label: '평균 손절 지연',
          value: `${fmt(exitRisk.avgSlDelay, 1)}%`,
          details: [
            { label: '횟수', value: `${totalTrades}회` },
          ]
        },
      ],
      best: { label: '계획대로 청산 시 평균수익', value: '-' },
      worst: { label: '조기 청산 시 평균 수익', value: '-' },
    },
    position: {
      title: '포지션 관리 리스크',
      description: '내 포지션 운용 방식 자체가 리스크를 만들고 있는가?',
      aiInsight: `평균 손익비가 ${fmt(positionManagementRisk.avgRrRatio, 2)}으로, ${(positionManagementRisk.avgRrRatio ?? 0) < 1 ? '장기적으로 손실 구조입니다.' : '양호한 수준입니다.'}`,
      stats: [
        {
          label: '평균 손익비(R/R)',
          value: `${fmt(positionManagementRisk.avgRrRatio, 1)}`,
        },
        {
          label: '물타기 빈도(횟수)',
          value: `${positionManagementRisk.averagingDownCount ?? 0}회`,
          details: [
            { label: '비율', value: `${fmt(positionManagementRisk.averagingDownRate)}%` },
          ]
        },
      ],
      best: { label: '적정 레버리지 승률', value: '-' },
      worst: { label: '과도한 레버리지 승률', value: '-' },
    },
    timing: {
      title: '시간∙상황 리스크',
      description: '특정 시간대나 시장 상태에서 유독 약한가?',
      aiInsight: `횡보장 승률 ${fmt(timeRisk.sidewaysWinRate)}%, 상승장 승률 ${fmt(timeRisk.uptrendWinRate)}%, 하락장 승률 ${fmt(timeRisk.downtrendWinRate)}%입니다.`,
      stats: [
        { label: '시간대별 승률', value: '' },
        { label: '상황별 승률', value: '' },
      ],
      best: { label: '추세장 승률', value: `${fmt(timeRisk.uptrendWinRate)}%` },
      worst: { label: '횡보장 승률', value: `${fmt(timeRisk.sidewaysWinRate)}%` },
    },
    emotion: {
      title: '감정 기반 리스크',
      description: '감정이 개입된 매매가 실제 손실을 만드는가?',
      aiInsight: `감정 매매 비율이 ${fmt(emotionalRisk.emotionalTradeRate)}%입니다. 손절 후 바로 진입하는 패턴이 '감정 기반 매매'로 분류됩니다.`,
      stats: [
        {
          label: '감정 매매',
          value: `${fmt(emotionalRisk.emotionalTradeRate)}%`,
          details: [
            { label: '횟수', value: `${emotionalRisk.emotionalTradeCount ?? 0}회` },
          ]
        },
        {
          label: '과신 진입 (익절 후 즉시 진입)',
          value: `${fmt(emotionalRisk.overconfidentEntryRate)}%`,
          details: [
            { label: '횟수', value: `${emotionalRisk.overconfidentEntryCount ?? 0}회` },
          ]
        },
        {
          label: '손절 후 즉시 역포지션',
          value: `${fmt(emotionalRisk.immediateReverseRate)}%`,
          details: [
            { label: '횟수', value: `${emotionalRisk.immediateReverseCount ?? 0}회` },
          ]
        },
      ],
      best: { label: '차분한 상태 진입 승률', value: '-' },
      worst: { label: '감정적 진입 승률', value: '-' },
    },
  }
}

// 데모 모드 mock 데이터
const MOCK_RISK_DATA: Record<RiskCategory, RiskTabData> = {
  entry: {
    title: '진입 리스크',
    description: '어떤 상황에서 잘못 들어가고 있는가?',
    aiInsight: "지난 30일동안 매매의 38%가 '계획 외 진입'이며, 이 구간은 평균 승률이 24%입니다.",
    stats: [
      {
        label: '계획 외 진입',
        value: '38%',
        details: [
          { label: '횟수', value: '48/127회' },
          { label: '손실 기여도', value: '32%' },
        ]
      },
      {
        label: '손절 후 재진입',
        value: '14회',
        details: [
          { label: '횟수', value: '14/20회' },
          { label: '평균 손실', value: '-2.4%' },
        ]
      },
      {
        label: '연속 진입(뇌동매매)',
        value: '17회',
        details: [
          { label: '횟수', value: '17회' },
          { label: '손실 비중', value: '28%' },
        ]
      },
    ],
    best: { label: '사전 분석 진입 승률', value: '62%' },
    worst: { label: '계획 외 진입 승률', value: '24%' },
  },
  exit: {
    title: '청산 리스크',
    description: '왜 수익을 극대화하지 못하고 손실을 키우는가?',
    aiInsight: '지난 20번의 거래 중 14번에서 목표가 도달 전 조기 익절이 발생했습니다.',
    stats: [
      {
        label: '손절가 미준수',
        value: '67%',
        details: [
          { label: '횟수', value: '85/127회' },
          { label: '추가 손실', value: '-₩420,000' },
        ]
      },
      {
        label: '조기 익절',
        value: '58%',
        details: [
          { label: '횟수', value: '73/127회' },
          { label: '추가 손실', value: '-₩850,000' },
        ]
      },
      {
        label: '평균 손절 지연',
        value: '-1.5%',
        details: [
          { label: '횟수', value: '127회' },
        ]
      },
    ],
    best: { label: '계획대로 청산 시 평균수익', value: '+5.2%' },
    worst: { label: '조기 청산 시 평균 수익', value: '+1.4%' },
  },
  position: {
    title: '포지션 관리 리스크',
    description: '내 포지션 운용 방식 자체가 리스크를 만들고 있는가?',
    aiInsight: '레버리지 x15 이상 포지션이 전체 손실의 61%를 차지합니다. 평균 손익비가 0.72로, 장기적으로 손실 구조입니다.',
    stats: [
      {
        label: '평균 손익비(R/R)',
        value: '0.7',
      },
      {
        label: '물타기 빈도(횟수)',
        value: '23회',
      },
    ],
    best: { label: 'x10 이하 레버리지 승률', value: '68%' },
    worst: { label: 'x20 이상 레버리지 승률', value: '31%' },
  },
  timing: {
    title: '시간∙상황 리스크',
    description: '특정 시간대나 시장 상태에서 유독 약한가?',
    aiInsight: '횡보장에서 손실의 50%를 기록하고 있습니다. 오전 진입의 평균 승률이 22%로 매우 낮습니다.',
    stats: [
      { label: '시간대별 승률', value: '' },
      { label: '상황별 승률', value: '' },
    ],
    best: { label: '추세장 승률', value: '71%' },
    worst: { label: '횡보장 승률', value: '28%' },
  },
  emotion: {
    title: '감정 기반 리스크',
    description: '감정이 개입된 매매가 실제 손실을 만드는가?',
    aiInsight: "익절 후 첫 거래 승률이 평소의 절반 이하로 감소합니다. 손절 후 바로 진입하는 패턴이 '감정 기반 매매'로 분류됩니다.",
    stats: [
      {
        label: '감정 매매',
        value: '38%',
        details: [
          { label: '횟수', value: '1/10회' },
          { label: '손실 비중', value: '40% ($-4,598)' },
        ]
      },
      {
        label: '과신 진입 (익절 후 즉시 진입)',
        value: '38%',
        details: [
          { label: '횟수', value: '1/10회' },
          { label: '손실 비중', value: '40% ($-4,598)' },
        ]
      },
      {
        label: '손절 후 즉시 역포지션',
        value: '38%',
        details: [
          { label: '횟수', value: '1/10회' },
          { label: '손실 비중', value: '40% ($-4,598)' },
        ]
      },
    ],
    best: { label: '차분한 상태 진입 승률', value: '64%' },
    worst: { label: '감정적 진입 승률', value: '29%' },
  },
}

// 핵심 개선 권장사항
const RECOMMENDATIONS = [
  '횡보장 진입을 피하고 명확한 추세 확인 후 진입하세요.',
  '오전 9-11시 진입을 자제하고 밤 시간대 매매에 집중하세요.',
  '레버리지를 10배 이하로 제한하세요.',
  '손절 후 최소 1시간 대기 후 재진입을 고려하세요.',
  '목표가를 설정하고 자동 청산 주문을 활용하세요.',
]


// AI 인사이트 컴포넌트 - Figma 1960:6713 기준
function AIInsightBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 py-2 px-3"
      style={{
        background: 'linear-gradient(90deg, rgba(15, 221, 153, 0.15) 0%, rgba(159, 249, 30, 0.15) 100%)',
        borderLeft: '2px solid #0FDD99',
        borderRadius: '0px 4px 4px 0px',
      }}
    >
      <span
        className="shrink-0 px-2 py-0.5 text-white text-caption-medium rounded"
        style={{
          background: 'linear-gradient(90deg, #0FDD99 0%, #9FF91E 100%)',
        }}
      >
        AI 인사이트
      </span>
      <p className="text-body-1-regular text-label-normal">{children}</p>
    </div>
  )
}

// 시간대별 승률 차트 - Figma 2095:6084 기준
function HourlyWinRateChart({ hourlyWinRates }: { hourlyWinRates?: Record<string, number> }) {
  // 시간대별 승률 데이터 (0~23시) - API 데이터 또는 기본값
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    value: hourlyWinRates?.[String(i)] ?? 0,
  }))

  // Chart dimensions
  const chartWidth = 480
  const chartHeight = 180
  const padding = { left: 30, right: 10, top: 10, bottom: 30 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  const maxValue = Math.max(...hourlyData.map(d => d.value), 1)
  const yMax = Math.ceil(maxValue / 10) * 10 || 50

  // Generate points
  const points = hourlyData.map((d, i) => {
    const x = padding.left + (i / (hourlyData.length - 1)) * innerWidth
    const y = padding.top + innerHeight - (d.value / yMax) * innerHeight
    return { x, y, ...d }
  })

  // Generate line path
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  // Generate area path (for gradient fill)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`

  // Y-axis labels
  const yLabels = [yMax, Math.round(yMax / 2)]

  // X-axis labels - Figma: 모든 시간 표시 (0~23)
  const xLabels = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div
      className="flex-1 rounded-lg bg-white p-4 flex flex-col gap-3"
      style={{ border: '0.6px solid #D7D7D7' }}
    >
      <div className="flex items-center gap-2">
        <Image src="/icons/strategy/chart-profit-curve.svg" alt="" width={20} height={20} />
        <span className="text-body-1-bold text-label-normal">시간대별 승률</span>
      </div>

      <div className="relative">
        <svg
          width="100%"
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="hourlyLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D7D7D7" />
              <stop offset="100%" stopColor="#323232" />
            </linearGradient>
            <linearGradient id="hourlyAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(50, 50, 50, 0.1)" />
              <stop offset="100%" stopColor="rgba(50, 50, 50, 0)" />
            </linearGradient>
          </defs>

          {/* Y-axis grid lines */}
          {[0, 1].map((i) => {
            const y = padding.top + (i / 1) * innerHeight
            return (
              <line
                key={i}
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#D7D7D7"
                strokeWidth="1"
              />
            )
          })}

          {/* Y-axis labels */}
          {yLabels.map((label, i) => (
            <text
              key={i}
              x={padding.left - 8}
              y={padding.top + (i / 1) * innerHeight + 4}
              textAnchor="end"
              className="text-[12px]"
              fill="#8F8F8F"
            >
              {label}
            </text>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#hourlyAreaGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#hourlyLineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X-axis labels */}
          {xLabels.map((hour) => {
            const point = points.find(p => p.hour === hour)
            if (!point) return null
            return (
              <text
                key={hour}
                x={point.x}
                y={chartHeight - 5}
                textAnchor="middle"
                className="text-[12px]"
                fill="#8F8F8F"
              >
                {hour}
              </text>
            )
          })}
        </svg>
      </div>

      <div className="text-caption-regular text-gray-500">승률(%)</div>
    </div>
  )
}

// 상황별 승률 차트 - Figma 2095:6084 기준
function SituationWinRateChart({ uptrendWinRate, downtrendWinRate, sidewaysWinRate }: {
  uptrendWinRate: number
  downtrendWinRate: number
  sidewaysWinRate: number
}) {
  // 상황별 승률 데이터
  const situationData = [
    { label: '상승', value: uptrendWinRate },
    { label: '하락', value: downtrendWinRate },
    { label: '횡보', value: sidewaysWinRate },
  ]

  // Chart dimensions
  const chartWidth = 300
  const chartHeight = 180
  const padding = { left: 30, right: 10, top: 10, bottom: 30 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  const maxValue = Math.max(...situationData.map(d => d.value), 1)
  const yMax = Math.ceil(maxValue / 10) * 10 || 50

  // Y-axis labels
  const yLabels = [yMax, Math.round(yMax / 2)]

  // Bar dimensions
  const barWidth = 50
  const barGap = (innerWidth - barWidth * situationData.length) / (situationData.length + 1)

  return (
    <div
      className="flex-1 rounded-lg bg-white p-4 flex flex-col gap-3"
      style={{ border: '0.6px solid #D7D7D7' }}
    >
      <div className="flex items-center gap-2">
        <Image src="/icons/strategy/chart-profit-curve.svg" alt="" width={20} height={20} />
        <span className="text-body-1-bold text-label-normal">상황별 승률</span>
      </div>

      <div className="relative">
        <svg
          width="100%"
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Y-axis grid lines */}
          {[0, 1].map((i) => {
            const y = padding.top + (i / 1) * innerHeight
            return (
              <line
                key={i}
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#D7D7D7"
                strokeWidth="1"
              />
            )
          })}

          {/* Y-axis labels */}
          {yLabels.map((label, i) => (
            <text
              key={i}
              x={padding.left - 8}
              y={padding.top + (i / 1) * innerHeight + 4}
              textAnchor="end"
              className="text-[12px]"
              fill="#8F8F8F"
            >
              {label}
            </text>
          ))}

          {/* Bars */}
          {situationData.map((item, i) => {
            const barHeight = (item.value / yMax) * innerHeight
            const x = padding.left + barGap + i * (barWidth + barGap)
            const y = padding.top + innerHeight - barHeight
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#565656"
                rx="4"
                ry="4"
              />
            )
          })}

          {/* X-axis labels */}
          {situationData.map((item, i) => {
            const x = padding.left + barGap + i * (barWidth + barGap) + barWidth / 2
            return (
              <text
                key={i}
                x={x}
                y={chartHeight - 5}
                textAnchor="middle"
                className="text-[12px]"
                fill="#8F8F8F"
              >
                {item.label}
              </text>
            )
          })}
        </svg>
      </div>

      <div className="text-caption-regular text-gray-500">승률(%)</div>
    </div>
  )
}


export default function RiskPatternPage() {
  const { isDemoMode } = useAuthStore()

  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    return d.toISOString().slice(0, 10)
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [activeTab, setActiveTab] = useState<RiskCategory>('entry')
  const [selectedExchange, setSelectedExchange] = useState<string[]>(['binance'])

  // API 데이터 상태
  const [riskData, setRiskData] = useState<Record<RiskCategory, RiskTabData>>(MOCK_RISK_DATA)
  const [apiResponse, setApiResponse] = useState<RiskAnalysisResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchRiskData = useCallback(async () => {
    if (isDemoMode) {
      setRiskData(MOCK_RISK_DATA)
      return
    }

    setIsLoading(true)

    const exchangeMap: Record<string, string> = {
      binance: 'BINANCE',
      bybit: 'BYBIT',
      bitget: 'BITGET',
    }

    const data = await riskApi.getAnalysis({
      exchangeName: exchangeMap[selectedExchange[0]] || 'BINANCE',
      startDate,
      endDate,
    }).catch((err) => {
      console.warn('Risk analysis API error:', err.message)
      return null
    })

    if (data) {
      setApiResponse(data)
      setRiskData(mapApiToTabData(data))
    }
    // API 실패 시 기존 mock 데이터 유지

    setIsLoading(false)
  }, [isDemoMode, selectedExchange, startDate, endDate])

  useEffect(() => {
    fetchRiskData()
  }, [fetchRiskData])

  const handleSearch = () => {
    fetchRiskData()
  }

  const currentData = riskData[activeTab]

  // 시간∙상황 리스크 차트용 데이터
  const timeRisk = apiResponse?.timeRisk

  return (
    <div className="flex flex-col gap-12">
      {/* Section 1: Header + Date Filter + Cards */}
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-title-1-bold text-label-normal">리스크 패턴</h1>
            <div className="flex items-center gap-4">
              <ExchangeFilter
                selected={selectedExchange}
                onChange={setSelectedExchange}
              />
              <div className="flex items-center gap-2">
                <DatePickerCalendar
                  value={startDate}
                  onChange={setStartDate}
                />
                <span className="text-body-1-regular text-label-normal">~</span>
                <DatePickerCalendar
                  value={endDate}
                  onChange={setEndDate}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-900 text-white text-body-2-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isLoading ? '조회중...' : '조회'}
              </button>
            </div>
          </div>
          <p className="text-body-1-regular text-label-neutral">
            반복되는 실수와 습관을 파악하여 손실을 최소화하세요.
          </p>
        </div>

        {/* Cards Section */}
        <div className="flex flex-col gap-5">
          {/* 상단 3개 요약 카드 - 가로 배치 */}
          <div className="flex gap-4">
            {/* Card 1: 가장 치명적인 리스크 */}
            <div
              className="flex-1 flex flex-col gap-3 bg-white py-5 px-6 rounded-xl"
              style={{ border: '0.6px solid #D7D7D7' }}
            >
              <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-body-2-medium text-label-normal w-fit">
                가장 치명적인 리스크 패턴 분석
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-body-2-medium text-label-neutral">손절 후 즉각 재진입(복수매매) 손실 기여도</span>
                <div className="flex items-center gap-2">
                  <span className="text-title-1-bold text-red-400">
                    {apiResponse ? `${apiResponse.emotionalRisk.emotionalTradeRate.toFixed(0)}%` : '42%'}
                  </span>
                  <span className="text-caption-regular text-red-400">
                    {apiResponse ? `${apiResponse.emotionalRisk.emotionalTradeCount}회 발생` : '14회 발생'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: 가장 자주 발생하는 */}
            <div
              className="flex-1 flex flex-col gap-3 bg-white py-5 px-6 rounded-xl"
              style={{ border: '0.6px solid #D7D7D7' }}
            >
              <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-body-2-medium text-label-normal w-fit">
                가장 자주 발생하는 습관
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-body-2-medium text-label-neutral">계획 외 진입 발생 비율</span>
                <div className="flex items-center gap-2">
                  <span className="text-title-1-bold text-red-400">
                    {apiResponse ? `${apiResponse.entryRisk.unplannedEntryRate.toFixed(0)}%` : '38%'}
                  </span>
                  <span className="text-caption-regular text-red-400">
                    {apiResponse ? `${apiResponse.entryRisk.unplannedEntryCount}건 발생` : '48건 발생'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: 리스크 패턴으로 인한 손실 비중 */}
            <div
              className="flex-1 flex flex-col gap-3 bg-white py-5 px-6 rounded-xl"
              style={{ border: '0.6px solid #D7D7D7' }}
            >
              <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-body-2-medium text-label-normal w-fit">
                리스크 패턴으로 인한 손실 비중
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-body-2-medium text-label-neutral">패턴별 누적 손실</span>
                <div className="flex items-center gap-2">
                  <span className="text-title-1-bold text-red-400">
                    {apiResponse
                      ? `${apiResponse.entryRisk.impulsiveTradeRate.toFixed(0)}%`
                      : '42%(-₩18,750)'}
                  </span>
                  <span className="text-caption-regular text-red-400">전체 손실 중</span>
                </div>
              </div>
            </div>
          </div>

          {/* DNA 분석 카드 - 세로 배치 */}
          <div
            className="rounded-xl overflow-hidden bg-white"
            style={{ border: '0.6px solid #D7D7D7' }}
          >
            {/* 타이틀 영역 */}
            <div className="p-5 pb-0">
              <span className="text-body-1-regular text-label-neutral block">Tradex DNA 분석</span>
              <span className="text-title-2-bold text-label-normal">AI 기반 종합 분석 리포트</span>
            </div>
            {/* 콘텐츠 영역 */}
            <div className="p-5 flex flex-col gap-5">
              {/* AI Insight */}
              <AIInsightBox>
                당신은 고변동 구간에서 지나치게 공격적입니다. 오전 매매를 줄이고 상승 추세를 공략하는 편이 승률이 <span className="font-bold">2배</span> 높습니다.
              </AIInsightBox>

              {/* Recommendations */}
              <div className="flex gap-8">
                <div className="flex items-center gap-2 shrink-0">
                  <Image src="/icons/risk/icon-idea.svg" alt="" width={20} height={20} />
                  <span className="text-body-1-bold text-label-normal">핵심 개선 권장사항</span>
                </div>
                <div className="flex flex-col flex-1">
                  {RECOMMENDATIONS.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-3 py-3">
                        <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-body-1-regular text-label-normal">{item}</span>
                      </div>
                      {index < RECOMMENDATIONS.length - 1 && (
                        <div style={{ height: '0.4px', backgroundColor: '#D7D7D7' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-300" />

      {/* Section 2: 상세 분석 */}
      <div className="flex flex-col gap-8">
        {/* Section Header + Tabs */}
        <div className="flex flex-col gap-3">
          <h2 className="text-title-2-bold text-label-normal">상세 분석</h2>

          {/* Tabs */}
          <div className="flex items-center gap-3">
            {RISK_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 py-2 rounded-lg text-body-1-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-label-normal hover:bg-gray-200"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '0.6px solid #D7D7D7' }}
        >
          {/* 상단: 타이틀 영역 */}
          <div
            className="bg-white p-5"
            style={{ borderBottom: '0.6px solid #D7D7D7' }}
          >
            <span className="text-title-2-bold text-label-normal block">{currentData.title}</span>
            <span className="text-body-1-regular text-label-neutral mt-1">{currentData.description}</span>
          </div>

          {/* 하단: 콘텐츠 영역 */}
          <div className="bg-white p-5 flex flex-col gap-3">
            {/* AI Insight */}
            <AIInsightBox>{currentData.aiInsight}</AIInsightBox>

            {/* Stats Grid */}
            <div className="flex gap-3">
              {activeTab === 'timing' ? (
                <>
                  <HourlyWinRateChart
                    hourlyWinRates={timeRisk?.hourlyWinRates ?? (isDemoMode ? undefined : undefined)}
                  />
                  <SituationWinRateChart
                    uptrendWinRate={timeRisk?.uptrendWinRate ?? 65}
                    downtrendWinRate={timeRisk?.downtrendWinRate ?? 45}
                    sidewaysWinRate={timeRisk?.sidewaysWinRate ?? 28}
                  />
                </>
              ) : (
                currentData.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-lg bg-white p-4 flex flex-col gap-3"
                    style={{ border: '0.6px solid #D7D7D7' }}
                  >
                    {/* Main Stat */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-body-2-medium text-label-neutral">{stat.label}</span>
                      {stat.value && (
                        <span className="text-title-1-bold text-label-normal">{stat.value}</span>
                      )}
                    </div>

                    {/* Divider & Details */}
                    {stat.details && (
                      <>
                        <div style={{ height: '0.4px', backgroundColor: '#D7D7D7' }} />
                        <div className="flex flex-col gap-1">
                          {stat.details.map((detail, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Image
                                  src={detail.label === '횟수' ? '/icons/risk/icon-trading.svg' : '/icons/risk/icon-pie-chart.svg'}
                                  alt=""
                                  width={16}
                                  height={16}
                                />
                                <span className="text-caption-regular text-label-neutral">{detail.label}</span>
                              </div>
                              <span className="text-body-2-bold text-label-normal">{detail.value}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Best / Worst Comparison */}
            <div className="flex gap-3">
              {/* Best */}
              <div
                className="flex-1 rounded-xl p-4"
                style={{
                  backgroundColor: 'rgba(231, 248, 237, 0.2)',
                  border: '0.6px solid #13C34E'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-caption-bold text-white bg-element-positive-default w-fit">Best</span>
                    <span className="text-body-1-bold text-label-normal">{currentData.best.label}</span>
                  </div>
                  <span className="text-title-1-bold text-green-400">{currentData.best.value}</span>
                </div>
              </div>

              {/* Worst */}
              <div
                className="flex-1 rounded-xl p-4"
                style={{
                  backgroundColor: 'rgba(255, 230, 232, 0.2)',
                  border: '0.6px solid #FF0015'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-caption-bold text-white bg-element-danger-default w-fit">Worst</span>
                    <span className="text-body-1-bold text-label-normal">{currentData.worst.label}</span>
                  </div>
                  <span className="text-title-1-bold text-red-400">{currentData.worst.value}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
