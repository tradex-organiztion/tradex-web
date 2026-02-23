'use client'

import { useState } from 'react'
import { Check, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { DatePickerCalendar } from '@/components/common'
import { ExchangeFilter } from '@/components/common/ExchangeFilter'

// 체크박스 컴포넌트 - Figma 기준 16x16, border-radius 4px
function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        className={cn(
          "w-4 h-4 flex items-center justify-center transition-colors",
          checked
            ? "bg-gray-800"
            : "border border-gray-300 bg-white"
        )}
        style={{ borderRadius: '4px' }}
        onClick={onChange}
      >
        {checked && (
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        )}
      </div>
      <span className="text-body-2-regular text-label-neutral">{label}</span>
    </label>
  )
}

// Best/Worst 전략 카드 컴포넌트 - Figma 디자인 기준 (테이블 형식)
function StrategyCard({
  type,
  title,
  fields,
  totalTrades,
  winRate,
  avgProfit,
}: {
  type: 'best' | 'worst'
  title: string
  fields: { label: string; value: string }[]
  totalTrades: number
  winRate: string
  avgProfit: string
}) {
  const isBest = type === 'best'

  return (
    <div className={cn(
      "bg-white rounded-xl p-5 flex-1",
      isBest ? "border-[0.6px] border-element-positive-default" : "border-[0.6px] border-element-danger-default"
    )} style={{ backgroundColor: isBest ? 'rgba(231, 248, 237, 0.2)' : 'rgba(255, 230, 232, 0.2)' }}>
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={cn(
            "text-caption-medium",
            isBest ? "text-element-positive-default" : "text-element-danger-default"
          )}>
            {isBest ? '최고 성과 전략' : '최저 성과 전략'}
          </span>
          <h3 className="text-body-1-bold text-label-normal mt-1">{title}</h3>
        </div>
        {/* Best/Worst 뱃지 */}
        <span className={cn(
          "px-2.5 py-1 rounded text-caption-bold text-white",
          isBest ? "bg-element-positive-default" : "bg-element-danger-default"
        )}>
          {isBest ? 'Best' : 'Worst'}
        </span>
      </div>

      {/* 정보 테이블 - Figma: 행별 label/value */}
      <div className="mb-4 border border-line-normal rounded-lg overflow-hidden">
        {fields.map((field, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center px-4 py-2.5",
              i !== fields.length - 1 && "border-b border-line-normal"
            )}
          >
            <span className="text-body-2-regular text-label-assistive w-16 shrink-0">{field.label}</span>
            <span className="text-body-2-medium text-label-normal">{field.value}</span>
          </div>
        ))}
      </div>

      {/* 하단 통계 - 3열 */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-line-normal">
        <div>
          <p className="text-caption-regular text-label-assistive mb-1">총 거래</p>
          <p className="text-title-2-bold text-label-normal">{totalTrades}회</p>
        </div>
        <div>
          <p className="text-caption-regular text-label-assistive mb-1">승률</p>
          <p className={cn(
            "text-title-2-bold",
            isBest ? "text-element-positive-default" : "text-element-danger-default"
          )}>{winRate}</p>
        </div>
        <div>
          <p className="text-caption-regular text-label-assistive mb-1">평균 수익</p>
          <p className={cn(
            "text-title-2-bold",
            isBest ? "text-element-positive-default" : "text-element-danger-default"
          )}>{avgProfit}</p>
        </div>
      </div>
    </div>
  )
}

// 메트릭 카드 컴포넌트 - Figma: 아이콘(56x56) + 라벨 + 값
function MetricCard({
  icon,
  label,
  value,
  isFirst = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  isFirst?: boolean
}) {
  return (
    <div className={cn(
      "bg-gray-50 rounded-lg flex items-center gap-4",
      isFirst ? "w-[365px] shrink-0 px-4 py-3" : "flex-1 px-4 py-3"
    )}>
      <div className="w-14 h-14 shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-body-2-medium text-label-neutral">{label}</span>
        <span className="text-title-1-bold text-label-normal">{value}</span>
      </div>
    </div>
  )
}

export default function StrategyAnalysisPage() {
  // 필터 상태
  const [filters, setFilters] = useState({
    indicators: ['볼린저 밴드'],
    style: ['스윙'],
    technical: [] as string[],
    position: [] as string[],
    market: ['하락장'],
    timeframe: ['4시간봉'],
  })

  const [showFilterPanel, setShowFilterPanel] = useState(false)

  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    return d.toISOString().slice(0, 10)
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10))

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }))
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-title-1-bold text-label-normal">전략 분석</h1>
          <div className="flex items-center gap-4">
            <ExchangeFilter />
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
            <button className="px-4 py-2 bg-gray-900 text-white text-body-2-medium rounded-lg hover:bg-gray-800 transition-colors">
              조회
            </button>
          </div>
        </div>
        <p className="text-body-1-regular text-label-neutral">
          나의 트레이딩 전략과 승률을 분석하고 최고의 성과를 만들어 보세요.
        </p>
      </div>

      {/* Best/Worst 전략 카드 */}
      <div className="flex gap-8">
        <StrategyCard
          type="best"
          title="가장 승률이 높은 트레이딩 전략입니다"
          fields={[
            { label: '지표', value: '볼린저 밴드' },
            { label: '스타일', value: '스윙' },
            { label: '시간', value: '4시간봉' },
          ]}
          totalTrades={45}
          winRate="72.5%"
          avgProfit="+2.4%"
        />
        <StrategyCard
          type="worst"
          title="가장 승률이 낮은 트레이딩 전략입니다"
          fields={[
            { label: '지표', value: 'RSI' },
            { label: '스타일', value: '스캘핑' },
            { label: '시간', value: '1분봉' },
          ]}
          totalTrades={120}
          winRate="38.2%"
          avgProfit="-1.2%"
        />
      </div>

      {/* 커스텀 전략 분석 카드 - Figma: left border only 0.6px, padding 20px 24px, gap 32px */}
      <div className="bg-white" style={{ borderLeft: '0.6px solid #D7D7D7' }}>
        <div className="py-5 px-6 flex flex-col gap-8">
          {/* Section 1: 헤더 - Figma: gap 10px between title group and content */}
          <div className="flex flex-col gap-[10px]">
            {/* 카드 헤더: 타이틀 + 필터 아이콘 버튼 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-title-2-bold text-label-normal">커스텀 전략 분석</h2>
                  <p className="text-body-1-regular text-label-neutral">
                    원하는 전략 조합을 선택하여 성과를 분석해 보세요.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* 필터 모달 (Figma: 별도 모달/시트) */}
          {showFilterPanel && (
            <>
              {/* 오버레이 */}
              <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowFilterPanel(false)} />
              {/* 모달 */}
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-heavy w-[480px] max-h-[80vh] overflow-y-auto">
                <div className="p-8 flex flex-col gap-6">
                  {/* 제목 */}
                  <h3 className="text-title-1-bold text-label-normal text-center">커스텀 전략 필터</h3>
                  {/* 지표 */}
                  <div className="flex flex-col gap-3">
                    <span className="text-body-1-bold text-label-normal">지표</span>
                    <div className="flex flex-wrap gap-3">
                      {['볼린저 밴드', 'RSI', 'MACD', 'EMA'].map((item) => (
                        <Checkbox
                          key={item}
                          label={item}
                          checked={filters.indicators.includes(item)}
                          onChange={() => toggleFilter('indicators', item)}
                        />
                      ))}
                    </div>
                  </div>
                  {/* 시간 (Figma: "시간" 라벨, 지표 다음 순서) */}
                  <div className="flex flex-col gap-3">
                    <span className="text-body-1-bold text-label-normal">시간</span>
                    <div className="flex flex-wrap gap-3">
                      {['15분봉', '1시간봉', '4시간봉', '일봉'].map((item) => (
                        <Checkbox
                          key={item}
                          label={item}
                          checked={filters.timeframe.includes(item)}
                          onChange={() => toggleFilter('timeframe', item)}
                        />
                      ))}
                    </div>
                  </div>
                  {/* 스타일 */}
                  <div className="flex flex-col gap-3">
                    <span className="text-body-1-bold text-label-normal">스타일</span>
                    <div className="flex gap-3">
                      {['스캘핑', '스윙'].map((item) => (
                        <Checkbox
                          key={item}
                          label={item}
                          checked={filters.style.includes(item)}
                          onChange={() => toggleFilter('style', item)}
                        />
                      ))}
                    </div>
                  </div>
                  {/* 기술적 분석 */}
                  <div className="flex flex-col gap-3">
                    <span className="text-body-1-bold text-label-normal">기술적 분석</span>
                    <div className="flex flex-wrap gap-3">
                      {['지지/저항선', '피보나치 되돌림', '추세선', '채널'].map((item) => (
                        <Checkbox
                          key={item}
                          label={item}
                          checked={filters.technical.includes(item)}
                          onChange={() => toggleFilter('technical', item)}
                        />
                      ))}
                    </div>
                  </div>
                  {/* 시장 */}
                  <div className="flex flex-col gap-3">
                    <span className="text-body-1-bold text-label-normal">시장</span>
                    <div className="flex gap-3">
                      {['상승장', '하락장', '횡보장'].map((item) => (
                        <Checkbox
                          key={item}
                          label={item}
                          checked={filters.market.includes(item)}
                          onChange={() => toggleFilter('market', item)}
                        />
                      ))}
                    </div>
                  </div>
                  {/* 포지션 */}
                  <div className="flex flex-col gap-3">
                    <span className="text-body-1-bold text-label-normal">포지션</span>
                    <div className="flex gap-3">
                      {['Long', 'Short'].map((item) => (
                        <Checkbox
                          key={item}
                          label={item}
                          checked={filters.position.includes(item)}
                          onChange={() => toggleFilter('position', item)}
                        />
                      ))}
                    </div>
                  </div>
                  {/* 조회 버튼 */}
                  <button
                    onClick={() => setShowFilterPanel(false)}
                    className="w-full py-4 bg-gray-100 text-label-disabled text-body-1-medium rounded-lg hover:bg-gray-200 hover:text-label-neutral transition-colors"
                  >
                    조회
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Section 2: AI 인사이트 + 강점/취약 - Figma: gap 12px */}
          <div className="flex flex-col gap-3">
            {/* AI 인사이트 바 - Figma: padding 8px 12px, gap 12px, border-radius 0 4px 4px 0, left border 2px */}
            <div
              className="flex items-center gap-3 px-3 py-2"
              style={{
                background: 'linear-gradient(90deg, rgba(0, 196, 131, 0.08) 0%, rgba(133, 209, 24, 0.08) 100%)',
                borderLeft: '2px solid #00C483',
                borderRadius: '0px 4px 4px 0px',
              }}
            >
              <span
                className="px-2 py-0.5 text-white text-caption-medium rounded shrink-0"
                style={{
                  background: 'linear-gradient(90deg, #00C483 0%, #85D118 100%)',
                }}
              >
                AI 인사이트
              </span>
              <p className="text-body-1-regular text-label-normal">
                <strong>1시간봉</strong>에서 성과가 <strong>1.3배 이상</strong> 높습니다. 해당 타임프레임에 집중해 보세요.
              </p>
            </div>

            {/* 전략의 강점 / 취약 구간 - Figma: ROW layout, gap 20px between sections */}
            <div className="flex gap-5">
              {/* 전략의 강점 - Figma: ROW (title left, bullets right), gap 32px */}
              <div className="flex-1 flex items-start gap-8">
                <div className="flex items-center gap-2 shrink-0">
                  <Image src="/icons/strategy/icon-face-smile.svg" alt="" width={20} height={20} />
                  <span className="text-body-1-bold text-label-normal">전략의 강점</span>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    '선택하신 조합은 65.5%의 높은 승률을 보이고 있습니다.',
                    '평균 R/R 비율이 2.3으로 리스크 대비 수익이 우수합니다.',
                    '최대 8회 연속 승리를 기록하여 일관성이 있습니다.',
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Image src="/icons/strategy/icon-system-success.svg" alt="" width={20} height={20} className="shrink-0" />
                      <span className="text-body-1-regular text-label-normal">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 취약 구간 - Figma: ROW (title left, bullets right), gap 32px */}
              <div className="flex-1 flex items-start gap-8">
                <div className="flex items-center gap-2 shrink-0">
                  <Image src="/icons/strategy/icon-face-sad.svg" alt="" width={20} height={20} />
                  <span className="text-body-1-bold text-label-normal">취약 구간</span>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    '횡보장에서는 승률이 평균 대비 15% 낮습니다.',
                    '최대 4회 연속 손실이 발생할 수 있으니 지금 관리에 주의하세요.',
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Image src="/icons/strategy/icon-system-success.svg" alt="" width={20} height={20} className="shrink-0" />
                      <span className="text-body-1-regular text-label-normal">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 메트릭 카드 + 차트 - Figma: gap 20px */}
          <div className="flex flex-col gap-5">
            {/* 메트릭 카드 - Figma: 3열 x 2행, gap 12px */}
            <div className="flex flex-col gap-3">
              {/* 첫째 행 */}
              <div className="flex items-center gap-3">
                <MetricCard
                  icon={<Image src="/icons/strategy/metric-total-trades.svg" alt="" width={24} height={24} />}
                  label="총 거래"
                  value="143회"
                  isFirst
                />
                <MetricCard
                  icon={<Image src="/icons/strategy/metric-win-rate.svg" alt="" width={24} height={24} />}
                  label="승률"
                  value="65.5%"
                />
                <MetricCard
                  icon={<Image src="/icons/strategy/metric-avg-profit.svg" alt="" width={24} height={24} />}
                  label="평균 수익"
                  value="+2.8%"
                />
              </div>
              {/* 둘째 행 */}
              <div className="flex items-center gap-3">
                <MetricCard
                  icon={<Image src="/icons/strategy/metric-avg-rr.svg" alt="" width={24} height={24} />}
                  label="평균 R/R"
                  value="143회"
                />
                <MetricCard
                  icon={<Image src="/icons/strategy/metric-cumulative.svg" alt="" width={24} height={24} />}
                  label="누적 수익"
                  value="+$43,759(18.3%)"
                />
                <MetricCard
                  icon={<Image src="/icons/strategy/metric-streak.svg" alt="" width={24} height={24} />}
                  label="최대 연속 기록(승/패)"
                  value="+8/-4회"
                />
              </div>
            </div>

            {/* 수익 곡선 + 승패 분포 - Figma: gap 12px, no border on cards */}
            <div className="flex gap-3">
              {/* 수익 곡선 차트 - Figma: padding 12px 0, no border */}
              <div className="flex-1 bg-white rounded-lg py-3 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Image src="/icons/strategy/chart-profit-curve.svg" alt="" width={20} height={20} />
                  <span className="text-body-1-bold text-label-normal">수익 곡선</span>
                </div>
                <div className="relative flex">
                  {/* Y축 라벨 - Figma: 세로 "수익률(%)" 위→아래 */}
                  <div className="flex items-center justify-center shrink-0" style={{ writingMode: 'vertical-lr' }}>
                    <span className="text-caption-regular text-label-assistive">수익률(%)</span>
                  </div>
                  <svg
                    className="flex-1 w-full"
                    style={{ height: '200px' }}
                    viewBox="0 0 500 200"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="strategyAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(19, 20, 22, 0.08)" />
                        <stop offset="100%" stopColor="rgba(19, 20, 22, 0)" />
                      </linearGradient>
                    </defs>

                    {/* Y축 그리드 라인 */}
                    {[0, 1, 2, 3].map((i) => {
                      const y = 20 + (i / 3) * 140
                      return (
                        <line
                          key={i}
                          x1={40}
                          y1={y}
                          x2={480}
                          y2={y}
                          stroke="#E5E5E5"
                          strokeWidth="1"
                        />
                      )
                    })}

                    {/* Y축 라벨 */}
                    {['120', '90', '60', '30'].map((label, i) => (
                      <text
                        key={i}
                        x={32}
                        y={20 + (i / 3) * 140 + 4}
                        textAnchor="end"
                        fontSize="11"
                        fill="#8F8F8F"
                      >
                        {label}
                      </text>
                    ))}

                    {/* 점선 세로선 */}
                    <line
                      x1={300}
                      y1={20}
                      x2={300}
                      y2={160}
                      stroke="#BDC1CA"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />

                    {/* 영역 채우기 - Figma: 변동이 있는 실제 수익 곡선 */}
                    <path
                      d="M40,130 C60,125 80,110 100,100 C120,90 130,85 140,80 C160,70 170,75 180,85 C190,95 200,90 220,78 C240,66 250,60 260,55 C280,48 290,50 300,60 C310,70 320,55 330,40 C340,30 350,32 360,35 C380,40 400,38 420,35 C440,32 460,30 480,32 L480,160 L40,160 Z"
                      fill="url(#strategyAreaGradient)"
                    />

                    {/* 라인 - Figma: 오르내리는 변동 곡선 */}
                    <path
                      d="M40,130 C60,125 80,110 100,100 C120,90 130,85 140,80 C160,70 170,75 180,85 C190,95 200,90 220,78 C240,66 250,60 260,55 C280,48 290,50 300,60 C310,70 320,55 330,40 C340,30 350,32 360,35 C380,40 400,38 420,35 C440,32 460,30 480,32"
                      fill="none"
                      stroke="#323232"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* 포인트 (점선과의 교차점) */}
                    <circle cx={300} cy={60} r={5} fill="#121212" stroke="#FFFFFF" strokeWidth="2" />

                    {/* X축 라벨 */}
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
                      const x = 40 + ((d - 1) / 29) * 440
                      return (
                        <text
                          key={d}
                          x={x}
                          y={180}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#8F8F8F"
                        >
                          {d}
                        </text>
                      )
                    })}
                  </svg>
                </div>
              </div>

              {/* 승패 분포 - Figma: padding 12px 16px, fixed width, 승 237px fixed */}
              <div className="w-[360px] shrink-0 bg-white rounded-lg px-4 py-3 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Image src="/icons/strategy/chart-win-loss.svg" alt="" width={20} height={20} />
                  <span className="text-body-1-bold text-label-normal">승패 분포</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex w-full h-[148px]">
                    {/* 승 - Figma: 237px fixed, border-radius 12px 0 0 12px */}
                    <div className="w-[237px] shrink-0 bg-gray-900 rounded-l-xl flex flex-col items-center justify-center">
                      <span className="text-caption-medium text-gray-400">승</span>
                      <span className="text-title-1-bold text-white">66%</span>
                    </div>
                    {/* 패 - Figma: fill, border-radius 0 12px 12px 0, 중간 회색 */}
                    <div className="flex-1 bg-gray-200 rounded-r-xl flex flex-col items-center justify-center">
                      <span className="text-caption-medium text-gray-500">패</span>
                      <span className="text-title-1-bold text-label-normal">34%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
