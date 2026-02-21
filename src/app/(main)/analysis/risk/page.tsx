'use client'

import { useState } from 'react'
import { Check, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DatePickerCalendar } from '@/components/common'

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

// 각 탭별 데이터 - Figma 디자인 기준
const RISK_DATA: Record<RiskCategory, {
  title: string
  description: string
  aiInsight: string
  stats: { label: string; value: string; details?: { label: string; value: string }[] }[]
  best: { label: string; value: string }
  worst: { label: string; value: string }
}> = {
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
    // Figma node-id=2095-5050
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
    // Figma node-id=2095-5610
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
    // Figma node-id=2095-6084
    title: '시간∙상황 리스크',
    description: '특정 시간대나 시장 상태에서 유독 약한가?',
    aiInsight: '횡보장에서 손실의 50%를 기록하고 있습니다. 오전 진입의 평균 승률이 22%로 매우 낮습니다.',
    stats: [
      {
        label: '시간대별 승률',
        value: '',
      },
      {
        label: '상황별 승률',
        value: '',
      },
    ],
    best: { label: '추세장 승률', value: '71%' },
    worst: { label: '횡보장 승률', value: '28%' },
  },
  emotion: {
    // Figma node-id=2095-6557
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

// 리스크 진단 점수 데이터
const RISK_SCORE_ITEMS: { label: string; level: '높음' | '중간' | '낮음'; value: number }[] = [
  { label: '뇌동매매 지수', level: '높음', value: 78 },
  { label: '손절 미준수율', level: '중간', value: 52 },
  { label: '과도한 레버리지', level: '높음', value: 71 },
  { label: '감정적 매매 빈도', level: '낮음', value: 25 },
  { label: '포지션 집중도', level: '중간', value: 48 },
]

// 최근 7일 승률 데이터
const WEEKLY_WINRATE = {
  current: { winRate: 72.0, wins: 18, losses: 7, change: 8.5 },
  previous: { winRate: 63.5, wins: 14, losses: 8 },
}

// 종료 주문 승률 데이터
const EXIT_ORDER_STATS = [
  {
    label: '목표가 도달 청산',
    value: '42%',
    details: [
      { label: '횟수', value: '53/127회' },
      { label: '평균 수익', value: '+3.8%' },
    ],
  },
  {
    label: '손절가 도달 청산',
    value: '31%',
    details: [
      { label: '횟수', value: '39/127회' },
      { label: '평균 손실', value: '-2.1%' },
    ],
  },
  {
    label: '수동 청산',
    value: '27%',
    details: [
      { label: '횟수', value: '35/127회' },
      { label: '평균 수익', value: '+0.4%' },
    ],
  },
]

// 기술적 레벨 데이터 (4시간봉 기준)
const TECHNICAL_LEVELS: { label: string; value: string; status: 'positive' | 'danger' | 'neutral' }[] = [
  { label: '지지선 (S1)', value: '$42,500', status: 'neutral' },
  { label: '지지선 (S2)', value: '$41,200', status: 'danger' },
  { label: '저항선 (R1)', value: '$45,000', status: 'neutral' },
  { label: '저항선 (R2)', value: '$46,800', status: 'positive' },
  { label: 'EMA 20', value: '$43,200', status: 'positive' },
  { label: 'EMA 50', value: '$42,800', status: 'neutral' },
  { label: 'RSI (14)', value: '58.3', status: 'neutral' },
  { label: 'MACD', value: '매수 신호', status: 'positive' },
]

// 보유 시간 분석 데이터
const HOLD_TIME_DATA: { label: string; percentage: number; avgProfit: string; count: number; status: 'positive' | 'danger' }[] = [
  { label: '1시간 이하', percentage: 45, avgProfit: '+2.5%', count: 57, status: 'positive' },
  { label: '1~4시간', percentage: 28, avgProfit: '+1.8%', count: 36, status: 'positive' },
  { label: '4~24시간', percentage: 18, avgProfit: '+3.2%', count: 23, status: 'positive' },
  { label: '24시간 이상', percentage: 9, avgProfit: '-0.4%', count: 11, status: 'danger' },
]

// 포트폴리오 리스크 경고 데이터
const PORTFOLIO_WARNINGS: { type: 'danger' | 'warning' | 'info'; message: string }[] = [
  { type: 'danger', message: 'BTC 포지션이 전체의 72%를 차지하고 있습니다. 분산 투자를 권장합니다.' },
  { type: 'warning', message: '평균 레버리지 18.5배로, 권장 수준(10배)을 초과하고 있습니다.' },
  { type: 'info', message: '최근 7일 동안 새로운 거래 페어가 3개 추가되었습니다.' },
]

// AI 종합 분석 리포트 인사이트
const AI_REPORT_INSIGHTS = [
  '현재 승률 대비 손익비가 낮아, 수익 구간에서 더 오래 보유할 필요가 있습니다.',
  '오전 시간대(9-11시) 매매를 줄이면 월간 손실을 약 35% 감소시킬 수 있습니다.',
  '볼린저 밴드 + 스윙 조합이 가장 안정적인 수익을 보이고 있으며, 이 전략에 집중하는 것을 권장합니다.',
  '감정적 매매 빈도가 전월 대비 15% 감소하여 긍정적인 개선 추세입니다.',
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

// 시간대별 승률 차트 - Figma 2095:6084 기준 (WeeklyProfitChart 패턴 참고)
function HourlyWinRateChart() {
  // 시간대별 승률 데이터 (0~23시)
  const hourlyData = [
    { hour: 0, value: 35 },
    { hour: 1, value: 28 },
    { hour: 2, value: 22 },
    { hour: 3, value: 18 },
    { hour: 4, value: 15 },
    { hour: 5, value: 12 },
    { hour: 6, value: 15 },
    { hour: 7, value: 20 },
    { hour: 8, value: 25 },
    { hour: 9, value: 22 },
    { hour: 10, value: 28 },
    { hour: 11, value: 35 },
    { hour: 12, value: 42 },
    { hour: 13, value: 48 },
    { hour: 14, value: 52 },
    { hour: 15, value: 55 },
    { hour: 16, value: 50 },
    { hour: 17, value: 48 },
    { hour: 18, value: 45 },
    { hour: 19, value: 40 },
    { hour: 20, value: 45 },
    { hour: 21, value: 50 },
    { hour: 22, value: 48 },
    { hour: 23, value: 42 },
  ]

  // Chart dimensions
  const chartWidth = 480
  const chartHeight = 180
  const padding = { left: 30, right: 10, top: 10, bottom: 30 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  // Generate points
  const points = hourlyData.map((d, i) => {
    const x = padding.left + (i / (hourlyData.length - 1)) * innerWidth
    const y = padding.top + innerHeight - ((d.value - 10) / 50) * innerHeight
    return { x, y, ...d }
  })

  // Generate line path
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  // Generate area path (for gradient fill)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`

  // Y-axis labels
  const yLabels = [50, 25]

  // X-axis labels (선택적으로 표시)
  const xLabels = [0, 4, 8, 12, 16, 20, 23]

  return (
    <div
      className="flex-1 rounded-lg bg-white p-4 flex flex-col gap-3"
      style={{ border: '0.6px solid #D7D7D7' }}
    >
      <span className="text-body-2-medium text-label-neutral">시간대별 승률</span>
      <div style={{ height: '0.4px', backgroundColor: '#D7D7D7' }} />

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

// 상황별 승률 차트 - Figma 2095:6084 기준 (WeeklyProfitChart 패턴 참고)
function SituationWinRateChart() {
  // 상황별 승률 데이터
  const situationData = [
    { label: '상승', value: 65 },
    { label: '하락', value: 45 },
    { label: '횡보', value: 28 },
  ]

  // Chart dimensions
  const chartWidth = 300
  const chartHeight = 180
  const padding = { left: 30, right: 10, top: 10, bottom: 30 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  // Y-axis labels
  const yLabels = [50, 25]

  // Bar dimensions
  const barWidth = 50
  const barGap = (innerWidth - barWidth * situationData.length) / (situationData.length + 1)

  return (
    <div
      className="flex-1 rounded-lg bg-white p-4 flex flex-col gap-3"
      style={{ border: '0.6px solid #D7D7D7' }}
    >
      <span className="text-body-2-medium text-label-neutral">상황별 승률</span>
      <div style={{ height: '0.4px', backgroundColor: '#D7D7D7' }} />

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
            const barHeight = (item.value / 70) * innerHeight
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

// 최근 7일 수익 곡선 차트 - Figma 기준
function WeeklyProfitCurveChart() {
  const data = [
    { date: '1/11', value: 3200 },
    { date: '1/12', value: 4500 },
    { date: '1/13', value: 3890 },
    { date: '1/14', value: 5200 },
    { date: '1/15', value: 6800 },
    { date: '1/16', value: 7200 },
    { date: '1/17', value: 8100 },
  ]

  const chartWidth = 480
  const chartHeight = 200
  const padding = { left: 40, right: 10, top: 15, bottom: 30 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom
  const maxVal = 9000
  const minVal = 1000
  const range = maxVal - minVal

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * innerWidth,
    y: padding.top + innerHeight - ((d.value - minVal) / range) * innerHeight,
    ...d,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`

  return (
    <div
      className="flex-1 rounded-lg bg-white p-4 flex flex-col gap-3"
      style={{ border: '0.6px solid #D7D7D7' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-body-2-medium text-label-neutral">주간 수익 곡선</span>
        <span className="text-caption-regular text-gray-500">최근 7일간의 누적 수익금 추이입니다.</span>
      </div>
      <div style={{ height: '0.4px', backgroundColor: '#D7D7D7' }} />
      <div className="relative">
        <svg
          width="100%"
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="weeklyProfitArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(19, 20, 22, 0.1)" />
              <stop offset="100%" stopColor="rgba(19, 20, 22, 0)" />
            </linearGradient>
          </defs>
          {/* Grid + Y labels */}
          {['9k', '7k', '5k', '3k'].map((label, i) => {
            const y = padding.top + (i / 3) * innerHeight
            return (
              <g key={label}>
                <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#D7D7D7" strokeWidth="1" />
                <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[12px]" fill="#8F8F8F">{label}</text>
              </g>
            )
          })}
          <path d={areaPath} fill="url(#weeklyProfitArea)" />
          <path d={linePath} fill="none" stroke="#323232" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p) => (
            <circle key={p.date} cx={p.x} cy={p.y} r="3" fill="#323232" />
          ))}
          {points.map((p) => (
            <text key={`label-${p.date}`} x={p.x} y={chartHeight - 5} textAnchor="middle" className="text-[12px]" fill="#8F8F8F">{p.date}</text>
          ))}
        </svg>
      </div>
      <span className="text-caption-regular text-gray-500">수익금($)</span>
    </div>
  )
}

// 누적 수익 차트 - Figma 기준
function CumulativeProfitChart() {
  const data = [
    { month: '10월', value: 12000 },
    { month: '11월', value: 18500 },
    { month: '12월', value: 15200 },
    { month: '1월', value: 28000 },
    { month: '2월', value: 35000 },
    { month: '3월', value: 43759 },
  ]

  const chartWidth = 480
  const chartHeight = 200
  const padding = { left: 45, right: 10, top: 15, bottom: 30 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom
  const maxVal = 50000

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * innerWidth,
    y: padding.top + innerHeight - (d.value / maxVal) * innerHeight,
    ...d,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`

  return (
    <div
      className="flex-1 rounded-lg bg-white p-4 flex flex-col gap-3"
      style={{ border: '0.6px solid #D7D7D7' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-body-2-medium text-label-neutral">누적 수익</span>
        <span className="text-title-2-bold text-element-positive-default">+$43,759</span>
      </div>
      <div style={{ height: '0.4px', backgroundColor: '#D7D7D7' }} />
      <div className="relative">
        <svg
          width="100%"
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="cumulativeArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(19, 195, 78, 0.15)" />
              <stop offset="100%" stopColor="rgba(19, 195, 78, 0)" />
            </linearGradient>
          </defs>
          {['50k', '40k', '30k', '20k', '10k'].map((label, i) => {
            const y = padding.top + (i / 4) * innerHeight
            return (
              <g key={label}>
                <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#D7D7D7" strokeWidth="1" />
                <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[12px]" fill="#8F8F8F">{label}</text>
              </g>
            )
          })}
          <path d={areaPath} fill="url(#cumulativeArea)" />
          <path d={linePath} fill="none" stroke="#13C34E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p) => (
            <circle key={p.month} cx={p.x} cy={p.y} r="3" fill="#13C34E" />
          ))}
          {points.map((p) => (
            <text key={`label-${p.month}`} x={p.x} y={chartHeight - 5} textAnchor="middle" className="text-[12px]" fill="#8F8F8F">{p.month}</text>
          ))}
        </svg>
      </div>
    </div>
  )
}

// 수익률(%) 바 차트 - Figma 기준
function ProfitRateBarChart() {
  const data = [
    { label: '10월', value: 5.2 },
    { label: '11월', value: -2.1 },
    { label: '12월', value: 8.3 },
    { label: '1월', value: 3.7 },
    { label: '2월', value: -1.5 },
    { label: '3월', value: 6.8 },
  ]

  const chartWidth = 480
  const chartHeight = 200
  const padding = { left: 40, right: 10, top: 15, bottom: 30 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom
  const scale = 10
  const zeroY = padding.top + innerHeight / 2
  const barWidth = innerWidth / data.length * 0.6
  const barGap = innerWidth / data.length * 0.4

  return (
    <div
      className="flex-1 rounded-lg bg-white p-4 flex flex-col gap-3"
      style={{ border: '0.6px solid #D7D7D7' }}
    >
      <span className="text-body-2-medium text-label-neutral">수익률(%)</span>
      <div style={{ height: '0.4px', backgroundColor: '#D7D7D7' }} />
      <div className="relative">
        <svg
          width="100%"
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {[`+${scale}%`, '0%', `-${scale}%`].map((label, i) => {
            const y = padding.top + (i / 2) * innerHeight
            return (
              <g key={label}>
                <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#D7D7D7" strokeWidth={i === 1 ? '1.5' : '1'} />
                <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[12px]" fill="#8F8F8F">{label}</text>
              </g>
            )
          })}
          {data.map((d, i) => {
            const x = padding.left + (barGap / 2) + i * (barWidth + barGap)
            const barH = (Math.abs(d.value) / scale) * (innerHeight / 2)
            const y = d.value >= 0 ? zeroY - barH : zeroY
            const fill = d.value >= 0 ? '#13C34E' : '#FF0015'
            return (
              <g key={d.label}>
                <rect x={x} y={y} width={barWidth} height={barH} fill={fill} rx="4" ry="4" />
                <text x={x + barWidth / 2} y={chartHeight - 5} textAnchor="middle" className="text-[12px]" fill="#8F8F8F">{d.label}</text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default function RiskPatternPage() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    return d.toISOString().slice(0, 10)
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [activeTab, setActiveTab] = useState<RiskCategory>('entry')

  const currentData = RISK_DATA[activeTab]

  return (
    <div className="flex flex-col gap-12">
      {/* Section 1: Header + Date Filter + Cards */}
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-title-1-bold text-label-normal">리스크 패턴</h1>
          <p className="text-body-1-regular text-label-neutral">
            반복되는 실수와 습관을 파악하여 손실을 최소화하세요.
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-4">
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
          <button className="px-3 py-2 bg-gray-800 text-white text-body-1-medium rounded-lg hover:bg-gray-700 transition-colors">
            조회
          </button>
        </div>

        {/* Cards Section - Figma 1960:6616 기준 */}
        <div className="flex flex-col gap-5">
          {/* 상단 3개 요약 카드 - 가로 배치, gap 32px */}
          <div className="flex gap-8">
            {/* Card 1: 가장 치명적인 리스크 */}
            <div
              className="flex-1 rounded-xl overflow-hidden"
              style={{ border: '0.6px solid #D7D7D7' }}
            >
              {/* 상단: 타이틀 영역 (회색 배경) */}
              <div
                className="bg-gray-50 p-5"
                style={{ borderBottom: '0.6px solid #D7D7D7' }}
              >
                <span className="text-body-1-regular text-label-neutral block">가장 치명적인 리스크</span>
                <span className="text-title-2-bold text-label-normal">패턴 분석</span>
              </div>
              {/* 하단: 값 영역 (흰색 배경) */}
              <div className="bg-white p-5">
                <span className="text-body-2-medium text-label-neutral block">손절 후 즉각 재진입(복수매매) 손실 기여도</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-title-1-bold text-red-400">42%</span>
                  <span className="text-caption-regular text-label-neutral">14회 발생</span>
                </div>
              </div>
            </div>

            {/* Card 2: 가장 자주 발생하는 */}
            <div
              className="flex-1 rounded-xl overflow-hidden"
              style={{ border: '0.6px solid #D7D7D7' }}
            >
              {/* 상단: 타이틀 영역 (회색 배경) */}
              <div
                className="bg-gray-50 p-5"
                style={{ borderBottom: '0.6px solid #D7D7D7' }}
              >
                <span className="text-body-1-regular text-label-neutral block">가장 자주 발생하는</span>
                <span className="text-title-2-bold text-label-normal">습관</span>
              </div>
              {/* 하단: 값 영역 (흰색 배경) */}
              <div className="bg-white p-5">
                <span className="text-body-2-medium text-label-neutral block">계획 외 진입 발생 비율</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-title-1-bold text-red-400">38%</span>
                  <span className="text-caption-regular text-label-neutral">48건 발생</span>
                </div>
              </div>
            </div>

            {/* Card 3: 리스크 패턴으로 인한 손실 비중 */}
            <div
              className="flex-1 rounded-xl overflow-hidden"
              style={{ border: '0.6px solid #D7D7D7' }}
            >
              {/* 상단: 타이틀 영역 (회색 배경) */}
              <div
                className="bg-gray-50 p-5"
                style={{ borderBottom: '0.6px solid #D7D7D7' }}
              >
                <span className="text-body-1-regular text-label-neutral block">리스크 패턴으로 인한</span>
                <span className="text-title-2-bold text-label-normal">손실 비중</span>
              </div>
              {/* 하단: 값 영역 (흰색 배경) */}
              <div className="bg-white p-5">
                <span className="text-body-2-medium text-label-neutral block">패턴별 누적 손실</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-title-1-bold text-red-400">42%(-₩18,750)</span>
                  <span className="text-caption-regular text-label-neutral">전체 손실 중</span>
                </div>
              </div>
            </div>
          </div>

          {/* DNA 분석 카드 - 세로 배치 */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: '0.6px solid #D7D7D7' }}
          >
            {/* 상단: 타이틀 영역 (회색 배경) */}
            <div
              className="bg-gray-50 p-5"
              style={{ borderBottom: '0.6px solid #D7D7D7' }}
            >
              <span className="text-body-1-regular text-label-neutral block">Tradex DNA 분석</span>
              <span className="text-title-2-bold text-label-normal">AI 기반 종합 분석 리포트</span>
            </div>
            {/* 하단: 콘텐츠 영역 (흰색 배경) */}
            <div className="bg-white p-5 flex flex-col gap-5">
              {/* AI Insight */}
              <AIInsightBox>
                당신은 고변동 구간에서 지나치게 공격적입니다. 오전 매매를 줄이고 상승 추세를 공략하는 편이 승률이 <span className="font-bold">2배</span> 높습니다.
              </AIInsightBox>

              {/* Recommendations - 가로 배치, gap 32px */}
              <div className="flex gap-8">
                <span className="text-body-1-bold text-label-normal shrink-0">핵심 개선 권장사항</span>
                <div className="flex flex-col gap-2">
                  {RECOMMENDATIONS.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-body-1-regular text-label-normal">{item}</span>
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

          {/* Tabs - gap 12px */}
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

        {/* Tab Content - 세로 배치 */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '0.6px solid #D7D7D7' }}
        >
          {/* 상단: 타이틀 영역 (흰색 배경) */}
          <div
            className="bg-white p-5"
            style={{ borderBottom: '0.6px solid #D7D7D7' }}
          >
            <span className="text-body-1-regular text-label-neutral block">{currentData.description}</span>
            <span className="text-title-2-bold text-label-normal">{currentData.title}</span>
          </div>

          {/* 하단: 콘텐츠 영역 (흰색 배경) */}
          <div className="bg-white p-5 flex flex-col gap-3">
            {/* AI Insight */}
            <AIInsightBox>{currentData.aiInsight}</AIInsightBox>

            {/* Stats Grid - 탭별로 다른 렌더링 */}
            <div className="flex gap-3">
              {activeTab === 'timing' ? (
                // 시간∙상황 리스크: 차트 컴포넌트 표시
                <>
                  <HourlyWinRateChart />
                  <SituationWinRateChart />
                </>
              ) : (
                // 다른 탭: 일반 stat 카드 표시
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
                              <span className="text-caption-regular text-label-neutral">{detail.label}</span>
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

            {/* Best / Worst Comparison - 2개 가로 배치, gap 12px */}
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
                    <span className="text-caption-regular text-green-400">Best</span>
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
                    <span className="text-caption-regular text-red-400">Worst</span>
                    <span className="text-body-1-bold text-label-normal">{currentData.worst.label}</span>
                  </div>
                  <span className="text-title-1-bold text-red-400">{currentData.worst.value}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-300" />

      {/* Section 3: 리스크 진단 + 주간 성과 */}
      <div className="flex flex-col gap-8">
        <h2 className="text-title-2-bold text-label-normal">리스크 진단</h2>

        {/* 리스크 진단 점수 */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '0.6px solid #D7D7D7' }}
        >
          <div
            className="bg-gray-50 p-5"
            style={{ borderBottom: '0.6px solid #D7D7D7' }}
          >
            <span className="text-body-1-regular text-label-neutral block">현재 나의 매매 습관 점수입니다.</span>
            <span className="text-title-2-bold text-label-normal">리스크 진단 점수</span>
          </div>
          <div className="bg-white p-5 flex flex-col gap-5">
            {RISK_SCORE_ITEMS.map((item) => {
              const levelColor = item.level === '높음' ? 'text-red-400' : item.level === '중간' ? 'text-yellow-400' : 'text-green-400'
              const barColor = item.level === '높음' ? '#FF0015' : item.level === '중간' ? '#FEC700' : '#13C34E'
              return (
                <div key={item.label} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-body-2-medium text-label-normal">{item.label}</span>
                    <span className={cn("text-body-2-bold", levelColor)}>{item.level}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.value}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>
              )
            })}
            <AIInsightBox>
              최근 뇌동매매 지수가 높아지고 있습니다. 진입 전 사전 시나리오를 <span className="font-bold">반드시</span> 확인하세요.
            </AIInsightBox>
          </div>
        </div>

        {/* 최근 7일 승률 + 주간 수익 곡선 */}
        <div className="flex gap-4">
          {/* 최근 7일 승률 */}
          <div
            className="flex-1 rounded-xl overflow-hidden"
            style={{ border: '0.6px solid #D7D7D7' }}
          >
            <div
              className="bg-gray-50 p-5"
              style={{ borderBottom: '0.6px solid #D7D7D7' }}
            >
              <span className="text-body-1-regular text-label-neutral block">이전 7일 대비</span>
              <span className="text-title-2-bold text-label-normal">최근 7일 승률(Win Rate)</span>
            </div>
            <div className="bg-white p-5 flex flex-col gap-4">
              <div className="flex items-end gap-3">
                <span className="text-display-2-bold text-label-normal">{WEEKLY_WINRATE.current.winRate}%</span>
                <span className="text-body-1-bold text-green-400 pb-1">+{WEEKLY_WINRATE.current.change}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-body-2-regular text-label-neutral">
                  {WEEKLY_WINRATE.current.wins}승 {WEEKLY_WINRATE.current.losses}패
                </span>
                <span className="text-caption-regular text-gray-500">|</span>
                <span className="text-caption-regular text-gray-500">
                  이전 7일: {WEEKLY_WINRATE.previous.winRate}% ({WEEKLY_WINRATE.previous.wins}승 {WEEKLY_WINRATE.previous.losses}패)
                </span>
              </div>
              {/* 승패 비율 바 */}
              <div className="flex h-3 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${(WEEKLY_WINRATE.current.wins / (WEEKLY_WINRATE.current.wins + WEEKLY_WINRATE.current.losses)) * 100}%`,
                    backgroundColor: '#13C34E',
                  }}
                />
                <div
                  style={{
                    width: `${(WEEKLY_WINRATE.current.losses / (WEEKLY_WINRATE.current.wins + WEEKLY_WINRATE.current.losses)) * 100}%`,
                    backgroundColor: '#FF0015',
                  }}
                />
              </div>
              <div className="flex justify-between text-caption-regular text-gray-500">
                <span>승 {Math.round((WEEKLY_WINRATE.current.wins / (WEEKLY_WINRATE.current.wins + WEEKLY_WINRATE.current.losses)) * 100)}%</span>
                <span>패 {Math.round((WEEKLY_WINRATE.current.losses / (WEEKLY_WINRATE.current.wins + WEEKLY_WINRATE.current.losses)) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* 주간 수익 곡선 */}
          <WeeklyProfitCurveChart />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-300" />

      {/* Section 4: 수익 분석 */}
      <div className="flex flex-col gap-8">
        <h2 className="text-title-2-bold text-label-normal">수익 분석</h2>

        {/* 누적 수익 + 수익률(%) */}
        <div className="flex gap-4">
          <CumulativeProfitChart />
          <ProfitRateBarChart />
        </div>

        {/* 수익 팩터 + 평균 수익 비교 */}
        <div className="flex gap-4">
          {/* 수익 팩터 */}
          <div
            className="flex-1 rounded-xl overflow-hidden"
            style={{ border: '0.6px solid #D7D7D7' }}
          >
            <div
              className="bg-gray-50 p-5"
              style={{ borderBottom: '0.6px solid #D7D7D7' }}
            >
              <span className="text-body-1-regular text-label-neutral block">총 수익 / 총 손실</span>
              <span className="text-title-2-bold text-label-normal">수익 팩터</span>
            </div>
            <div className="bg-white p-5 flex flex-col gap-4">
              <div className="flex items-end gap-2">
                <span className="text-display-2-bold text-label-normal">1.85</span>
                <span className="text-body-2-bold text-green-400 pb-2">우수</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full"
                  style={{ width: '62%', backgroundColor: '#13C34E' }}
                />
              </div>
              <div className="flex justify-between text-caption-regular text-gray-500">
                <span>0</span>
                <span>1.0</span>
                <span>2.0</span>
                <span>3.0</span>
              </div>
              <AIInsightBox>
                수익 팩터가 <span className="font-bold">1.85</span>로 우수한 수준입니다. 손익비 관리가 잘 되고 있습니다.
              </AIInsightBox>
            </div>
          </div>

          {/* 평균 수익 비교 */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Best */}
            <div
              className="flex-1 rounded-xl p-5"
              style={{
                backgroundColor: 'rgba(231, 248, 237, 0.2)',
                border: '0.6px solid #13C34E',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-caption-regular text-green-400">Best</span>
                  <span className="text-body-1-bold text-label-normal">계획대로 청산 시 평균수익</span>
                </div>
                <span className="text-title-1-bold text-green-400">+5.2%</span>
              </div>
            </div>
            {/* Worst */}
            <div
              className="flex-1 rounded-xl p-5"
              style={{
                backgroundColor: 'rgba(255, 230, 232, 0.2)',
                border: '0.6px solid #FF0015',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-caption-regular text-red-400">Worst</span>
                  <span className="text-body-1-bold text-label-normal">조기 청산 시 평균 수익</span>
                </div>
                <span className="text-title-1-bold text-red-400">+1.4%</span>
              </div>
            </div>
            {/* 차이 표시 */}
            <div className="text-center py-2">
              <span className="text-caption-medium text-gray-500">
                계획대로 청산 시 평균 <span className="text-body-2-bold text-label-normal">3.8%p</span> 더 높은 수익
              </span>
            </div>
          </div>
        </div>

        {/* 종료 주문 승률 */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '0.6px solid #D7D7D7' }}
        >
          <div
            className="bg-gray-50 p-5"
            style={{ borderBottom: '0.6px solid #D7D7D7' }}
          >
            <span className="text-body-1-regular text-label-neutral block">청산 방식별 성과</span>
            <span className="text-title-2-bold text-label-normal">종료 주문 승률</span>
          </div>
          <div className="bg-white p-5 flex flex-col gap-3">
            <div className="flex gap-3">
              {EXIT_ORDER_STATS.map((stat, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-lg bg-white p-4 flex flex-col gap-3"
                  style={{ border: '0.6px solid #D7D7D7' }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-body-2-medium text-label-neutral">{stat.label}</span>
                    <span className="text-title-1-bold text-label-normal">{stat.value}</span>
                  </div>
                  {stat.details && (
                    <>
                      <div style={{ height: '0.4px', backgroundColor: '#D7D7D7' }} />
                      <div className="flex flex-col gap-1">
                        {stat.details.map((detail, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-caption-regular text-label-neutral">{detail.label}</span>
                            <span className="text-body-2-bold text-label-normal">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <AIInsightBox>
              목표가 도달 청산의 평균 수익이 <span className="font-bold">+3.8%</span>로 가장 높습니다. 자동 청산 주문 설정을 적극 활용하세요.
            </AIInsightBox>
          </div>
        </div>

        {/* 보유 시간 분석 */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '0.6px solid #D7D7D7' }}
        >
          <div
            className="bg-gray-50 p-5"
            style={{ borderBottom: '0.6px solid #D7D7D7' }}
          >
            <span className="text-body-1-regular text-label-neutral block">포지션별 평균 보유 기간</span>
            <span className="text-title-2-bold text-label-normal">보유 시간</span>
          </div>
          <div className="bg-white p-5 flex flex-col gap-4">
            {HOLD_TIME_DATA.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="text-body-2-medium text-label-normal w-24 shrink-0">{item.label}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full rounded-lg flex items-center px-3"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.status === 'positive' ? '#323232' : '#FF0015',
                    }}
                  >
                    {item.percentage >= 15 && (
                      <span className="text-caption-bold text-white">{item.percentage}%</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 w-20">
                  <span className={cn(
                    "text-body-2-bold",
                    item.status === 'positive' ? "text-green-400" : "text-red-400"
                  )}>
                    {item.avgProfit}
                  </span>
                  <span className="text-caption-regular text-gray-500">{item.count}회</span>
                </div>
              </div>
            ))}
            <AIInsightBox>
              4~24시간 보유 시 평균 수익이 <span className="font-bold">+3.2%</span>로 가장 높습니다. 단기 매매를 줄이고 보유 시간을 늘려보세요.
            </AIInsightBox>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-300" />

      {/* Section 5: 종합 분석 */}
      <div className="flex flex-col gap-8">
        <h2 className="text-title-2-bold text-label-normal">종합 분석</h2>

        {/* 포트폴리오 리스크 경고 */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '0.6px solid #D7D7D7' }}
        >
          <div
            className="bg-gray-50 p-5"
            style={{ borderBottom: '0.6px solid #D7D7D7' }}
          >
            <span className="text-body-1-regular text-label-neutral block">현재 포트폴리오 상태</span>
            <span className="text-title-2-bold text-label-normal">포트폴리오 리스크 경고</span>
          </div>
          <div className="bg-white p-5 flex flex-col gap-3">
            {PORTFOLIO_WARNINGS.map((warning, index) => {
              const config = {
                danger: {
                  bg: 'rgba(255, 0, 21, 0.08)',
                  border: '#FF0015',
                  text: 'text-red-400',
                  icon: <AlertTriangle className="w-4 h-4" />,
                },
                warning: {
                  bg: 'rgba(254, 199, 0, 0.08)',
                  border: '#FEC700',
                  text: 'text-yellow-400',
                  icon: <AlertTriangle className="w-4 h-4" />,
                },
                info: {
                  bg: 'rgba(0, 112, 255, 0.08)',
                  border: '#0070FF',
                  text: 'text-blue-400',
                  icon: <Info className="w-4 h-4" />,
                },
              }[warning.type]
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{
                    backgroundColor: config.bg,
                    border: `0.6px solid ${config.border}`,
                  }}
                >
                  <span className={cn("shrink-0", config.text)}>{config.icon}</span>
                  <span className={cn("text-body-2-medium", config.text)}>{warning.message}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 기술적 분석 */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '0.6px solid #D7D7D7' }}
        >
          <div
            className="bg-gray-50 p-5"
            style={{ borderBottom: '0.6px solid #D7D7D7' }}
          >
            <span className="text-body-1-regular text-label-neutral block">기본 차트 분석</span>
            <span className="text-title-2-bold text-label-normal">기술적 레벨 (4시간봉)</span>
          </div>
          <div className="bg-white p-5">
            <div className="grid grid-cols-2 gap-3">
              {TECHNICAL_LEVELS.map((level) => {
                const statusColor =
                  level.status === 'positive' ? 'text-green-400'
                  : level.status === 'danger' ? 'text-red-400'
                  : 'text-label-neutral'
                const dotColor =
                  level.status === 'positive' ? '#13C34E'
                  : level.status === 'danger' ? '#FF0015'
                  : '#8F8F8F'
                return (
                  <div
                    key={level.label}
                    className="flex items-center justify-between py-3 px-4 rounded-lg"
                    style={{ border: '0.6px solid #D7D7D7' }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: dotColor }}
                      />
                      <span className="text-body-2-medium text-label-normal">{level.label}</span>
                    </div>
                    <span className={cn("text-body-2-bold", statusColor)}>{level.value}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* AI 기반 종합 분석 리포트 */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '0.6px solid #D7D7D7' }}
        >
          <div
            className="bg-gray-50 p-5"
            style={{ borderBottom: '0.6px solid #D7D7D7' }}
          >
            <span className="text-body-1-regular text-label-neutral block">Tradex AI Assistant가 학습하여 이후 전략 분석에 활용해요.</span>
            <span className="text-title-2-bold text-label-normal">AI 기반 종합 분석 리포트</span>
          </div>
          <div className="bg-white p-5 flex flex-col gap-5">
            <AIInsightBox>
              당신은 고변동 구간에서 지나치게 공격적입니다. 오전 매매를 줄이고 상승 추세를 공략하는 편이 승률이 <span className="font-bold">2배</span> 높습니다.
            </AIInsightBox>

            <div className="flex gap-8">
              <span className="text-body-1-bold text-label-normal shrink-0">분석 결과</span>
              <div className="flex flex-col gap-2">
                {AI_REPORT_INSIGHTS.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-body-1-regular text-label-normal">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
