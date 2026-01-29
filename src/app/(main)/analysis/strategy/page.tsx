'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

// 전략 카드 컴포넌트 (Figma 기준 - 테이블 형태)
function StrategyCard({
  type,
  percentage,
  title,
  indicator,
  style,
  timeframe,
  totalTrades,
  avgProfit,
  profitPercent,
}: {
  type: 'best' | 'worst'
  percentage: number
  title: string
  indicator: string
  style: string
  timeframe: string
  totalTrades: number
  avgProfit: string
  profitPercent: string
}) {
  const isBest = type === 'best'

  return (
    <div className={cn(
      "bg-white rounded-xl border-2 p-5 flex-1",
      isBest ? "border-element-positive-default" : "border-element-danger-default"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={cn(
            "text-caption-bold",
            isBest ? "text-element-positive-default" : "text-element-danger-default"
          )}>
            {isBest ? 'Best' : 'Worst'}
          </span>
          <h3 className="text-body-1-bold text-label-normal mt-0.5">{title}</h3>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-body-2-bold text-white",
          isBest ? "bg-element-positive-default" : "bg-element-danger-default"
        )}>
          {percentage}%
        </span>
      </div>

      {/* 정보 테이블 */}
      <div className={cn(
        "border-l-2 pl-4 mb-4 space-y-2",
        isBest ? "border-element-positive-default" : "border-element-danger-default"
      )}>
        <div className="flex gap-8">
          <div className="flex gap-3">
            <span className="text-body-2-regular text-label-assistive min-w-[40px]">지표</span>
            <span className="text-body-2-medium text-label-normal">{indicator}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-body-2-regular text-label-assistive min-w-[40px]">스타일</span>
            <span className="text-body-2-medium text-label-normal">{style}</span>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="flex gap-3">
            <span className="text-body-2-regular text-label-assistive min-w-[40px]">시간</span>
            <span className="text-body-2-medium text-label-normal">{timeframe}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-body-2-regular text-label-assistive min-w-[40px]">총 거래</span>
            <span className="text-body-2-medium text-label-normal">{totalTrades}회</span>
          </div>
        </div>
      </div>

      {/* 하단 요약 */}
      <div className={cn(
        "flex items-center gap-8 pt-3 border-l-2 pl-4",
        isBest ? "border-element-positive-default" : "border-element-danger-default"
      )}>
        <div className="flex gap-3">
          <span className="text-body-2-regular text-label-assistive">총 거래</span>
          <span className="text-body-2-bold text-label-normal">{totalTrades}회</span>
        </div>
        <div className="flex gap-3">
          <span className="text-body-2-regular text-label-assistive">평균수익</span>
          <span className={cn(
            "text-body-2-bold",
            isBest ? "text-label-positive" : "text-label-danger"
          )}>
            {avgProfit}({profitPercent})
          </span>
        </div>
      </div>
    </div>
  )
}

// 체크박스 컴포넌트
function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
          checked ? "bg-element-primary-default border-element-primary-default" : "border-gray-300"
        )}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-body-2-regular text-label-neutral">{label}</span>
    </label>
  )
}

// AI 인사이트 카드
function AIInsightCard({
  type,
  message,
}: {
  type: 'strength' | 'weakness' | 'recommendation'
  message: string
}) {
  const styles = {
    strength: {
      bg: 'bg-element-positive-lighter',
      label: '강점',
      labelColor: 'text-element-positive-default',
      labelBg: 'bg-element-positive-default',
    },
    weakness: {
      bg: 'bg-element-danger-lighter',
      label: '약점',
      labelColor: 'text-element-danger-default',
      labelBg: 'bg-element-danger-default',
    },
    recommendation: {
      bg: 'bg-element-info-lighter',
      label: '권장',
      labelColor: 'text-element-info-default',
      labelBg: 'bg-element-info-default',
    },
  }

  const style = styles[type]

  return (
    <div className={cn("rounded-lg p-3 flex items-start gap-2", style.bg)}>
      <span className={cn("text-caption-bold text-white px-1.5 py-0.5 rounded shrink-0", style.labelBg)}>
        {style.label}
      </span>
      <p className={cn("text-caption-medium", style.labelColor)}>{message}</p>
    </div>
  )
}

// 빈 상태 컴포넌트
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p className="text-body-1-regular text-label-assistive">
        왼쪽에서 전략을 선택하면 분석 결과가 표시됩니다.
      </p>
    </div>
  )
}

export default function StrategyAnalysisPage() {
  // 필터 상태
  const [filters, setFilters] = useState({
    indicators: ['볼린저 밴드'],
    timeframe: ['4시간봉'],
    technical: [] as string[],
    market: ['하락장'],
    style: ['스윙'],
    position: [] as string[],
  })

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }))
  }

  // 필터가 선택되었는지 확인
  const hasSelectedFilters = Object.values(filters).some(arr => arr.length > 0)

  return (
    <div className="flex flex-col gap-6">
      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-title-1-bold text-label-normal">전략 분석</h1>
        <p className="text-body-2-regular text-label-neutral mt-1">
          나의 트레이딩 전략과 승률을 분석하고 최고의 성과를 만들어 보세요.
        </p>
      </div>

      {/* Best/Worst 전략 카드 */}
      <div className="flex gap-4">
        <StrategyCard
          type="best"
          percentage={76}
          title="가장 승률이 높은 트레이딩 전략입니다"
          indicator="볼린저 밴드"
          style="스윙"
          timeframe="4시간봉"
          totalTrades={56}
          avgProfit="+1,250"
          profitPercent="24.5%"
        />
        <StrategyCard
          type="worst"
          percentage={27}
          title="가장 승률이 낮은 트레이딩 전략입니다"
          indicator="볼린저 밴드"
          style="스윙"
          timeframe="4시간봉"
          totalTrades={56}
          avgProfit="-1,250"
          profitPercent="24.5%"
        />
      </div>

      {/* 분석 리포트 (하나의 카드 - 좌측 필터 + 우측 결과) */}
      <div className="bg-white rounded-xl border border-line-normal">
        <div className="p-5 border-b border-line-normal">
          <h2 className="text-body-1-bold text-label-normal">분석 리포트</h2>
          <p className="text-body-2-regular text-label-assistive mt-0.5">
            분석하고 싶은 전략을 선택 후 선택한 전략의 성과를 확인해 보세요.
          </p>
        </div>

        <div className="flex">
          {/* 좌측: 필터 영역 */}
          <div className="w-[400px] shrink-0 p-5 border-r border-line-normal">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {/* 지표 */}
              <div>
                <h3 className="text-body-2-bold text-label-normal mb-3">지표</h3>
                <div className="space-y-2.5">
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

              {/* 시간 */}
              <div>
                <h3 className="text-body-2-bold text-label-normal mb-3">시간</h3>
                <div className="space-y-2.5">
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

              {/* 기술적 분석 */}
              <div>
                <h3 className="text-body-2-bold text-label-normal mb-3">기술적 분석</h3>
                <div className="space-y-2.5">
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
              <div>
                <h3 className="text-body-2-bold text-label-normal mb-3">시장</h3>
                <div className="space-y-2.5">
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

              {/* 스타일 */}
              <div>
                <h3 className="text-body-2-bold text-label-normal mb-3">스타일</h3>
                <div className="space-y-2.5">
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

              {/* 포지션 */}
              <div>
                <h3 className="text-body-2-bold text-label-normal mb-3">포지션</h3>
                <div className="space-y-2.5">
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
            </div>
          </div>

          {/* 우측: 분석 결과 영역 */}
          <div className="flex-1 p-5">
            {hasSelectedFilters ? (
              <div className="space-y-5">
                {/* AI 인사이트 */}
                <div className="space-y-2">
                  <AIInsightCard
                    type="strength"
                    message="미국 개장 시간에 68%의 높은 승률을 보입니다."
                  />
                  <AIInsightCard
                    type="weakness"
                    message="이 전략은 횡보장에서 성과가 27%p 낮습니다. 명확한 추세 확인 후 진입해 보세요."
                  />
                  <AIInsightCard
                    type="recommendation"
                    message="1시간봉에서 성과가 1.3배 이상 높습니다. 해당 타임프레임에 집중해 보세요."
                  />
                </div>

                {/* 통계 그리드 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="border border-line-normal rounded-lg p-4">
                    <p className="text-body-2-regular text-label-assistive mb-1">승률</p>
                    <p className="text-title-2-bold text-label-normal">68.5%</p>
                  </div>
                  <div className="border border-line-normal rounded-lg p-4">
                    <p className="text-body-2-regular text-label-assistive mb-1">총 거래</p>
                    <p className="text-title-2-bold text-label-normal">143회</p>
                  </div>
                  <div className="border border-line-normal rounded-lg p-4">
                    <p className="text-body-2-regular text-label-assistive mb-1">평균 R/R 비율</p>
                    <p className="text-title-2-bold text-label-normal">2.10</p>
                  </div>
                  <div className="border border-line-normal rounded-lg p-4">
                    <p className="text-body-2-regular text-label-assistive mb-1">평균 수익</p>
                    <p className="text-title-2-bold text-label-positive">+$1,743<span className="text-body-2-medium">(2.4%)</span></p>
                  </div>
                  <div className="border border-line-normal rounded-lg p-4">
                    <p className="text-body-2-regular text-label-assistive mb-1">누적 수익</p>
                    <p className="text-title-2-bold text-label-positive">+$43,759<span className="text-body-2-medium">(18.3%)</span></p>
                  </div>
                  <div className="border border-line-normal rounded-lg p-4">
                    <p className="text-body-2-regular text-label-assistive mb-1">최대 연속 기록</p>
                    <p className="text-title-2-bold text-label-normal">+8/-4</p>
                  </div>
                </div>

                {/* 승패 분포 차트 */}
                <div className="border border-line-normal rounded-lg p-4">
                  <h3 className="text-body-2-bold text-label-normal mb-4">승패 분포</h3>
                  <div className="flex items-end gap-8">
                    {/* 바 차트 */}
                    <div className="flex-1 flex items-end justify-center gap-16 h-40">
                      <div className="flex flex-col items-center">
                        <div className="w-20 bg-element-positive-default rounded-t" style={{ height: '120px' }} />
                        <span className="text-caption-regular text-label-assistive mt-2">평균 승리</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-20 bg-element-danger-default rounded-t" style={{ height: '70px' }} />
                        <span className="text-caption-regular text-label-assistive mt-2">평균 손실</span>
                      </div>
                    </div>
                    {/* 우측 정보 */}
                    <div className="space-y-3 shrink-0">
                      <div className="border border-element-positive-default bg-element-positive-lighter rounded-lg p-3 min-w-[140px]">
                        <p className="text-caption-regular text-label-neutral">평균 승리</p>
                        <p className="text-body-1-bold text-element-positive-default">+3.20% <span className="text-caption-regular text-label-assistive">발생률 69%</span></p>
                      </div>
                      <div className="border border-element-danger-default bg-element-danger-lighter rounded-lg p-3 min-w-[140px]">
                        <p className="text-caption-regular text-label-neutral">평균 손실</p>
                        <p className="text-body-1-bold text-element-danger-default">-1.50% <span className="text-caption-regular text-label-assistive">발생률 32%</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 손익 그래프 */}
                <div className="border border-line-normal rounded-lg p-4">
                  <h3 className="text-body-2-bold text-label-normal mb-1">손익 그래프</h3>
                  <p className="text-caption-regular text-label-assistive mb-4">
                    지난 30일간 볼린저 밴드 지표와 스윙 매매 전략만 적용했다면 계좌는{' '}
                    <span className="text-label-positive font-medium">+14.2%</span> 성장했으며 최대 낙폭은{' '}
                    <span className="text-label-danger font-medium">-4.3%</span>입니다.
                  </p>

                  {/* 라인 차트 */}
                  <div className="relative h-40">
                    <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                      {/* Y축 그리드 */}
                      {[0, 30, 60, 90, 120].map((y) => (
                        <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4 4" />
                      ))}
                      {/* Y축 라벨 */}
                      <text x="30" y="8" textAnchor="end" className="text-[10px]" fill="#8F8F8F">120</text>
                      <text x="30" y="38" textAnchor="end" className="text-[10px]" fill="#8F8F8F">90</text>
                      <text x="30" y="68" textAnchor="end" className="text-[10px]" fill="#8F8F8F">60</text>
                      <text x="30" y="98" textAnchor="end" className="text-[10px]" fill="#8F8F8F">30</text>
                      <text x="30" y="120" textAnchor="end" className="text-[10px]" fill="#8F8F8F">0</text>
                      {/* 라인 */}
                      <polyline
                        fill="none"
                        stroke="#131416"
                        strokeWidth="2"
                        points="50,100 120,95 190,90 260,70 330,65 400,50 470,45"
                      />
                      {/* 포인트 */}
                      <circle cx="330" cy="65" r="5" fill="#131416" stroke="white" strokeWidth="2" />
                    </svg>
                    {/* X축 라벨 */}
                    <div className="absolute bottom-0 left-10 right-2 flex justify-between text-[10px] text-label-assistive">
                      <span>12/30</span>
                      <span>12/31</span>
                      <span>1/1</span>
                      <span>1/2</span>
                      <span>1/3</span>
                      <span>1/4</span>
                      <span>1/6</span>
                    </div>
                    {/* 툴팁 */}
                    <div className="absolute left-[60%] top-[40%] bg-white border border-line-normal rounded-lg shadow-normal px-3 py-2">
                      <p className="text-caption-regular text-label-assistive">2026. 01. 01 | 볼린저 밴드 & 스윙</p>
                      <p className="text-caption-medium">
                        누적 손익률 <span className="text-label-positive">+9.8%</span>
                      </p>
                      <p className="text-caption-medium">
                        해당 거래 손익 <span className="text-label-positive">+3.6%</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
