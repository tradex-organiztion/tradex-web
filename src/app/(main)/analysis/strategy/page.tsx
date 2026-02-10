'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DatePickerCalendar } from '@/components/common'

// AI 인사이트 컴포넌트 - 리스크 패턴 페이지와 동일
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
      <p className="text-body-1-regular text-gray-800">{children}</p>
    </div>
  )
}

// Best/Worst 전략 카드 컴포넌트
function StrategyCard({
  type,
  title,
  indicator,
  style,
  timeframe,
  totalTrades,
  winRate,
  avgProfit,
}: {
  type: 'best' | 'worst'
  title: string
  indicator: string
  style: string
  timeframe: string
  totalTrades: number
  winRate: string
  avgProfit: string
}) {
  const isBest = type === 'best'

  return (
    <div className={cn(
      "bg-white rounded-xl border-2 p-5 flex-1",
      isBest ? "border-element-positive-default" : "border-element-danger-default"
    )}>
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className={cn(
            "text-caption-medium",
            isBest ? "text-element-positive-default" : "text-element-danger-default"
          )}>
            {isBest ? '최고 성과 전략' : '최저 성과 전략'}
          </span>
          <h3 className="text-body-1-bold text-label-normal mt-1">{title}</h3>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-lg text-body-2-bold text-white",
          isBest ? "bg-element-positive-default" : "bg-element-danger-default"
        )}>
          {isBest ? 'Best' : 'Worst'}
        </span>
      </div>

      {/* 정보 테이블 */}
      <div className="border-l-2 border-gray-200 pl-4 mb-4 space-y-1.5">
        <div className="flex">
          <span className="text-body-2-regular text-label-assistive w-14">지표</span>
          <span className="text-body-2-medium text-label-normal">{indicator}</span>
        </div>
        <div className="flex">
          <span className="text-body-2-regular text-label-assistive w-14">스타일</span>
          <span className="text-body-2-medium text-label-normal">{style}</span>
        </div>
        <div className="flex">
          <span className="text-body-2-regular text-label-assistive w-14">시간</span>
          <span className="text-body-2-medium text-label-normal">{timeframe}</span>
        </div>
      </div>

      {/* 하단 통계 */}
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
      <span className="text-body-2-regular text-gray-600">{label}</span>
    </label>
  )
}

export default function StrategyAnalysisPage() {
  // 필터 상태
  const [filters, setFilters] = useState({
    indicators: ['볼린저 밴드'],
    timeframe: ['4시간봉'],
    style: ['스윙'],
    technical: [] as string[],
    market: ['하락장'],
    position: [] as string[],
  })

  const [showResults, setShowResults] = useState(true)
  const [startDate, setStartDate] = useState('2025-12-25')
  const [endDate, setEndDate] = useState('2026-01-25')

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }))
  }

  const hasSelectedFilters = Object.values(filters).some(arr => arr.length > 0)

  return (
    <div className="flex flex-col gap-6">
      {/* 페이지 타이틀 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-title-1-bold text-label-normal">전략 분석</h1>
        <p className="text-body-2-regular text-label-assistive">
          나의 트레이딩 전략과 승률을 분석하고 최고의 성과를 만들어 보세요.
        </p>
      </div>

      {/* 날짜 범위 필터 - Figma 기준 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <DatePickerCalendar
            value={startDate}
            onChange={setStartDate}
          />
          <span className="text-body-1-regular text-gray-800">~</span>
          <DatePickerCalendar
            value={endDate}
            onChange={setEndDate}
          />
        </div>
        <button className="px-3 py-2 bg-gray-800 text-white text-body-1-medium rounded-lg hover:bg-gray-700 transition-colors">
          조회
        </button>
      </div>

      {/* Best/Worst 전략 카드 */}
      <div className="flex gap-4">
        <StrategyCard
          type="best"
          title="가장 승률이 높은 트레이딩 전략입니다"
          indicator="볼린저 밴드"
          style="스윙"
          timeframe="4시간봉"
          totalTrades={45}
          winRate="72.5%"
          avgProfit="+2.4%"
        />
        <StrategyCard
          type="worst"
          title="가장 승률이 낮은 트레이딩 전략입니다"
          indicator="RSI"
          style="스캘핑"
          timeframe="1분봉"
          totalTrades={120}
          winRate="38.2%"
          avgProfit="-1.2%"
        />
      </div>

      {/* 커스텀 전략 분석 */}
      <div className="bg-white rounded-xl border border-line-normal">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-line-normal">
          <div>
            <h2 className="text-title-2-bold text-label-normal">커스텀 전략 분석</h2>
            <p className="text-body-2-regular text-label-assistive mt-0.5">
              원하는 전략 조합을 선택하여 성과를 분석해 보세요.
            </p>
          </div>
          <button
            onClick={() => setShowResults(true)}
            className="px-5 py-2 border border-line-normal rounded-lg text-body-2-medium text-label-neutral hover:bg-gray-50 transition-colors"
          >
            조회
          </button>
        </div>

        {/* 필터 영역 - Figma 2171-5073 기준 */}
        <div className="bg-gray-50 py-5 px-6 border-b border-line-normal">
          <div className="flex gap-4">
            {/* 왼쪽 컬럼: 지표, 시간, 스타일 */}
            <div className="flex-1 flex flex-col gap-5">
              {/* 지표 */}
              <div className="flex flex-col gap-2">
                <span className="text-body-2-medium text-gray-800">지표</span>
                <div className="flex gap-2">
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
              <div className="flex flex-col gap-2">
                <span className="text-body-2-medium text-gray-800">시간</span>
                <div className="flex gap-2">
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
              <div className="flex flex-col gap-2">
                <span className="text-body-2-medium text-gray-800">스타일</span>
                <div className="flex gap-2">
                  {['스켈핑', '스윙'].map((item) => (
                    <Checkbox
                      key={item}
                      label={item}
                      checked={filters.style.includes(item)}
                      onChange={() => toggleFilter('style', item)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 오른쪽 컬럼: 기술적 분석, 시장, 포지션 */}
            <div className="flex-1 flex flex-col gap-5">
              {/* 기술적 분석 */}
              <div className="flex flex-col gap-2">
                <span className="text-body-2-medium text-gray-800">기술적 분석</span>
                <div className="flex gap-2">
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
              <div className="flex flex-col gap-2">
                <span className="text-body-2-medium text-gray-800">시장</span>
                <div className="flex gap-2">
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
              <div className="flex flex-col gap-2">
                <span className="text-body-2-medium text-gray-800">포지션</span>
                <div className="flex gap-2">
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
        </div>

        {/* 분석 결과 */}
        {hasSelectedFilters && showResults && (
          <div className="p-5">
            {/* 통계 카드 그리드 */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="border border-line-normal rounded-lg p-4">
                <p className="text-caption-regular text-label-assistive mb-1">총 거래</p>
                <p className="text-title-1-bold text-label-normal">143회</p>
              </div>
              <div className="border border-line-normal rounded-lg p-4">
                <p className="text-caption-regular text-label-assistive mb-1">승률</p>
                <p className="text-title-1-bold text-label-normal">65.5%</p>
              </div>
              <div className="border border-line-normal rounded-lg p-4">
                <p className="text-caption-regular text-label-assistive mb-1">평균 수익</p>
                <p className="text-title-1-bold text-element-positive-default">+2.8%</p>
              </div>
              <div className="border border-line-normal rounded-lg p-4">
                <p className="text-caption-regular text-label-assistive mb-1">평균 R/R</p>
                <p className="text-title-1-bold text-label-normal">143회</p>
              </div>
              <div className="border border-line-normal rounded-lg p-4">
                <p className="text-caption-regular text-label-assistive mb-1">누적 수익</p>
                <p className="text-title-1-bold text-element-positive-default">+$43,759(18.3%)</p>
              </div>
              <div className="border border-line-normal rounded-lg p-4">
                <p className="text-caption-regular text-label-assistive mb-1">최대 연속 기록(승/패)</p>
                <p className="text-title-1-bold text-label-normal">+8/-4회</p>
              </div>
            </div>

            {/* 차트 영역 - Figma 2171-5753, 2171-5824 기준 */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* 수익 곡선 - 홈 대시보드 WeeklyProfitChart 참고 */}
              <div
                className="rounded-lg flex flex-col gap-3"
                style={{ border: '0.6px solid #D7D7D7', padding: '12px 16px' }}
              >
                <span className="text-body-2-medium text-gray-600">수익 곡선</span>
                <div style={{ height: '0.4px', backgroundColor: '#D7D7D7' }} />
                <div className="relative">
                  <svg
                    width="100%"
                    height={200}
                    viewBox="0 0 500 200"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="strategyAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(19, 20, 22, 0.1)" />
                        <stop offset="100%" stopColor="rgba(19, 20, 22, 0)" />
                      </linearGradient>
                    </defs>

                    {/* Y축 그리드 라인 (점선) */}
                    {[0, 1, 2, 3].map((i) => {
                      const y = 20 + (i / 3) * 140
                      return (
                        <line
                          key={i}
                          x1={40}
                          y1={y}
                          x2={480}
                          y2={y}
                          stroke="#D7D7D7"
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
                        fontSize="12"
                        fill="#8F8F8F"
                      >
                        {label}
                      </text>
                    ))}

                    {/* 영역 채우기 */}
                    <path
                      d="M40,155 L55,150 L70,145 L85,140 L100,135 L115,125 L130,120 L145,115 L160,108 L175,100 L190,95 L205,88 L220,82 L235,75 L250,70 L265,65 L280,60 L295,55 L310,50 L325,48 L340,45 L355,42 L370,40 L385,38 L400,36 L415,34 L430,32 L445,30 L460,28 L480,25 L480,160 L40,160 Z"
                      fill="url(#strategyAreaGradient)"
                    />

                    {/* 라인 */}
                    <path
                      d="M40,155 L55,150 L70,145 L85,140 L100,135 L115,125 L130,120 L145,115 L160,108 L175,100 L190,95 L205,88 L220,82 L235,75 L250,70 L265,65 L280,60 L295,55 L310,50 L325,48 L340,45 L355,42 L370,40 L385,38 L400,36 L415,34 L430,32 L445,30 L460,28 L480,25"
                      fill="none"
                      stroke="#323232"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* X축 라벨 */}
                    {[1, 5, 10, 15, 20, 25, 30].map((n, i) => (
                      <text
                        key={n}
                        x={40 + (i / 6) * 440}
                        y={180}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#8F8F8F"
                      >
                        {n}
                      </text>
                    ))}
                  </svg>
                </div>
                <span className="text-caption-regular text-gray-500">수익률(%)</span>
              </div>

              {/* 승패 분포 */}
              <div
                className="rounded-lg flex flex-col gap-3"
                style={{ border: '0.6px solid #D7D7D7', padding: '12px 16px' }}
              >
                <span className="text-body-2-medium text-gray-600">승패 분포</span>
                <div style={{ height: '0.4px', backgroundColor: '#D7D7D7' }} />
                <div className="flex items-center flex-1 py-8">
                  {/* 승 바 */}
                  <div
                    className="flex items-center justify-center py-4 px-4"
                    style={{
                      width: '66%',
                      backgroundColor: '#E7F8ED',
                      borderRadius: '12px 0 0 12px',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-body-2-medium" style={{ color: '#13C34E' }}>승</span>
                      <span className="text-title-1-bold" style={{ color: '#13C34E' }}>66%</span>
                    </div>
                  </div>
                  {/* 패 바 */}
                  <div
                    className="flex items-center justify-center py-4 px-4"
                    style={{
                      width: '34%',
                      backgroundColor: '#FFE6E8',
                      borderRadius: '0 12px 12px 0',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-body-2-medium" style={{ color: '#FF0015' }}>패</span>
                      <span className="text-title-1-bold" style={{ color: '#FF0015' }}>34%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI 인사이트 - 리스크 패턴 페이지와 동일한 스타일 */}
            <div className="mb-5">
              <AIInsightBox>
                1시간봉에서 성과가 <span className="font-bold">1.3배 이상</span> 높습니다. 해당 타임프레임에 집중해 보세요.
              </AIInsightBox>
            </div>

            {/* 전략의 강점 / 취약 구간 */}
            <div className="grid grid-cols-2 gap-8">
              {/* 전략의 강점 */}
              <div>
                <h3 className="text-body-1-bold text-label-normal mb-3">전략의 강점</h3>
                <div className="space-y-2">
                  {[
                    '선택하신 조합은 65.5%의 높은 승률을 보이고 있습니다.',
                    '평균 R/R 비율이 2.3으로 리스크 대비 수익이 우수합니다.',
                    '최대 8회 연속 승리를 기록하여 일관성이 있습니다.',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-element-positive-default flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                      <p className="text-body-2-regular text-label-neutral">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 취약 구간 */}
              <div>
                <h3 className="text-body-1-bold text-label-normal mb-3">취약 구간</h3>
                <div className="space-y-2">
                  {[
                    '횡보장에서는 승률이 평균 대비 15% 낮습니다.',
                    '최대 4회 연속 손실이 발생할 수 있으니 자금 관리에 주의하세요.',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-element-danger-default flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                      <p className="text-body-2-regular text-label-neutral">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
