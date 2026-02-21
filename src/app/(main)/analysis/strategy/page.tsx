'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DatePickerCalendar } from '@/components/common'

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

// Best/Worst 전략 카드 컴포넌트 - Figma 디자인 기준
function StrategyCard({
  type,
  title,
  percentage,
  fields,
  totalTrades,
  avgProfit,
}: {
  type: 'best' | 'worst'
  title: string
  percentage: number
  fields: { label: string; value: string }[]
  totalTrades: number
  avgProfit: string
}) {
  const isBest = type === 'best'

  return (
    <div className={cn(
      "bg-white rounded-xl border-2 p-5 flex-1",
      isBest ? "border-element-positive-default" : "border-element-danger-default"
    )}>
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
        {/* 원형 퍼센트 뱃지 */}
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shrink-0",
          isBest ? "bg-element-positive-default" : "bg-element-danger-default"
        )}>
          <span className="text-body-1-bold text-white">{percentage}%</span>
        </div>
      </div>

      {/* 정보 - 가로 레이아웃 */}
      <div className="flex gap-6 mb-4">
        {fields.map((field, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-body-2-medium text-label-normal">{field.value}</span>
            <span className="text-caption-regular text-label-assistive">{field.label}</span>
          </div>
        ))}
      </div>

      {/* 하단 통계 */}
      <div className="flex gap-6 pt-4 border-t border-line-normal">
        <div>
          <p className="text-caption-regular text-label-assistive mb-1">총 거래</p>
          <p className="text-title-2-bold text-label-normal">{totalTrades}회</p>
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

  const hasSelectedFilters = Object.values(filters).some(arr => arr.length > 0)

  return (
    <div className="flex flex-col gap-6">
      {/* 페이지 타이틀 + 날짜 필터 (같은 행) */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-title-1-bold text-label-normal">전략 분석</h1>
          <p className="text-body-1-regular text-label-neutral">
            나의 트레이딩 전략과 승률을 분석하고 최고의 성과를 만들어 보세요.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
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
      </div>

      {/* Best/Worst 전략 카드 */}
      <div className="flex gap-4">
        <StrategyCard
          type="best"
          title="가장 승률이 높은 트레이딩 전략입니다"
          percentage={76}
          fields={[
            { label: '지표', value: '볼린저 밴드' },
            { label: '스타일', value: '스윙' },
            { label: '타임프레임', value: '4시간봉' },
          ]}
          totalTrades={56}
          avgProfit="+$3,978(5.7%)"
        />
        <StrategyCard
          type="worst"
          title="가장 승률이 낮은 트레이딩 전략입니다"
          percentage={27}
          fields={[
            { label: '지표', value: 'MACD' },
            { label: '스타일', value: '스윙' },
            { label: '기술적 분석', value: '지지선' },
            { label: '타임프레임', value: '15분봉' },
          ]}
          totalTrades={120}
          avgProfit="-$1,245(1.2%)"
        />
      </div>

      {/* 전략 선택 + 분석 리포트 (좌우 분리) */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* 왼쪽: 전략 선택 */}
        <div className="w-full shrink-0 bg-white rounded-xl border-[0.6px] border-gray-300 lg:w-[380px]">
          <div className="p-5 border-b border-line-normal">
            <h2 className="text-title-2-bold text-label-normal">전략 선택</h2>
            <p className="text-body-2-regular text-label-assistive mt-0.5">
              분석하고 싶은 전략을 선택해주세요.
            </p>
          </div>
          <div className="p-5 flex flex-col gap-5">
            {/* 지표 */}
            <div className="flex flex-col gap-2">
              <span className="text-body-2-medium text-label-normal">지표</span>
              <div className="flex flex-wrap gap-2">
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

            {/* 스타일 */}
            <div className="flex flex-col gap-2">
              <span className="text-body-2-medium text-label-normal">스타일</span>
              <div className="flex gap-2">
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
            <div className="flex flex-col gap-2">
              <span className="text-body-2-medium text-label-normal">기술적 분석</span>
              <div className="flex flex-wrap gap-2">
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

            {/* 포지션 */}
            <div className="flex flex-col gap-2">
              <span className="text-body-2-medium text-label-normal">포지션</span>
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

            {/* 시장 */}
            <div className="flex flex-col gap-2">
              <span className="text-body-2-medium text-label-normal">시장</span>
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

            {/* 타임프레임 */}
            <div className="flex flex-col gap-2">
              <span className="text-body-2-medium text-label-normal">타임프레임</span>
              <div className="flex flex-wrap gap-2">
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
          </div>
        </div>

        {/* 오른쪽: 분석 리포트 */}
        <div className="flex-1 bg-white rounded-xl border-[0.6px] border-gray-300">
          <div className="p-5 border-b border-line-normal">
            <h2 className="text-title-2-bold text-label-normal">분석 리포트</h2>
            <p className="text-body-2-regular text-label-assistive mt-0.5">
              선택한 전략의 성과를 확인해 보세요.
            </p>
          </div>

          {hasSelectedFilters ? (
            <div className="p-5 flex flex-col gap-5">
              {/* 통계 카드 그리드 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="border-[0.6px] border-gray-300 rounded-lg p-4">
                  <p className="text-caption-regular text-label-assistive mb-1">승률</p>
                  <p className="text-title-1-bold text-label-normal">68.5%</p>
                </div>
                <div className="border-[0.6px] border-gray-300 rounded-lg p-4">
                  <p className="text-caption-regular text-label-assistive mb-1">총 거래</p>
                  <p className="text-title-1-bold text-label-normal">143회</p>
                </div>
                <div className="border-[0.6px] border-gray-300 rounded-lg p-4">
                  <p className="text-caption-regular text-label-assistive mb-1">평균 수익</p>
                  <p className="text-title-1-bold text-element-positive-default">+1,743달러(2.4%)</p>
                </div>
                <div className="border-[0.6px] border-gray-300 rounded-lg p-4">
                  <p className="text-caption-regular text-label-assistive mb-1">평균 R/R 비율</p>
                  <p className="text-title-1-bold text-label-normal">2.10</p>
                </div>
                <div className="border-[0.6px] border-gray-300 rounded-lg p-4">
                  <p className="text-caption-regular text-label-assistive mb-1">누적 수익</p>
                  <p className="text-title-1-bold text-element-positive-default">+43,759달러(18.3%)</p>
                </div>
                <div className="border-[0.6px] border-gray-300 rounded-lg p-4">
                  <p className="text-caption-regular text-label-assistive mb-1">최대 연속 기록(승/패)</p>
                  <p className="text-title-1-bold text-label-normal">+8/-4</p>
                </div>
              </div>

              {/* 손익 그래프 + Tradex AI 패널 */}
              <div className="flex gap-4">
                {/* 손익 그래프 */}
                <div
                  className="flex-1 rounded-lg flex flex-col gap-3"
                  style={{ border: '0.6px solid #D7D7D7', padding: '12px 16px' }}
                >
                  <span className="text-body-2-medium text-label-neutral">손익 그래프</span>
                  <div style={{ height: '0.4px', backgroundColor: '#D7D7D7' }} />
                  <p className="text-caption-regular text-label-assistive">
                    지난 30일간 볼린저 밴드 지표와 스윙 매매 전략만 적용했다면 아래와 같은 수익을 달성할 수 있었습니다.
                  </p>
                  <div className="relative">
                    <svg
                      width="100%"
                      height={180}
                      viewBox="0 0 400 180"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <defs>
                        <linearGradient id="strategyAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(19, 20, 22, 0.1)" />
                          <stop offset="100%" stopColor="rgba(19, 20, 22, 0)" />
                        </linearGradient>
                      </defs>

                      {/* Y축 그리드 라인 */}
                      {[0, 1, 2, 3].map((i) => {
                        const y = 15 + (i / 3) * 120
                        return (
                          <line
                            key={i}
                            x1={40}
                            y1={y}
                            x2={380}
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
                          y={15 + (i / 3) * 120 + 4}
                          textAnchor="end"
                          fontSize="11"
                          fill="#8F8F8F"
                        >
                          {label}
                        </text>
                      ))}

                      {/* 영역 채우기 */}
                      <path
                        d="M40,130 L80,125 L120,115 L160,100 L200,85 L240,70 L280,55 L320,45 L360,35 L380,30 L380,135 L40,135 Z"
                        fill="url(#strategyAreaGradient)"
                      />

                      {/* 라인 */}
                      <path
                        d="M40,130 L80,125 L120,115 L160,100 L200,85 L240,70 L280,55 L320,45 L360,35 L380,30"
                        fill="none"
                        stroke="#323232"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* X축 라벨 */}
                      {['10/15', '10/20', '10/25', '11/01', '11/05', '11/10', '11/15'].map((d, i) => (
                        <text
                          key={d}
                          x={40 + (i / 6) * 340}
                          y={160}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#8F8F8F"
                        >
                          {d}
                        </text>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Tradex AI 패널 */}
                <div className="w-[240px] shrink-0 flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 text-white text-caption-medium rounded"
                      style={{
                        background: 'linear-gradient(90deg, #0FDD99 0%, #9FF91E 100%)',
                      }}
                    >
                      Tradex AI
                    </span>
                  </div>

                  {/* 강점 카드 */}
                  <div
                    className="rounded-lg p-3 flex flex-col gap-1"
                    style={{
                      backgroundColor: 'rgba(231, 248, 237, 0.3)',
                      border: '0.6px solid #13C34E',
                    }}
                  >
                    <span className="text-caption-bold text-element-positive-default">강점</span>
                    <p className="text-caption-regular text-label-neutral">
                      볼린저 밴드 + 스윙 조합에서 승률 76%로 매우 우수한 성과를 보이고 있습니다.
                    </p>
                  </div>

                  {/* 약점 카드 */}
                  <div
                    className="rounded-lg p-3 flex flex-col gap-1"
                    style={{
                      backgroundColor: 'rgba(255, 230, 232, 0.3)',
                      border: '0.6px solid #FF0015',
                    }}
                  >
                    <span className="text-caption-bold text-element-danger-default">약점</span>
                    <p className="text-caption-regular text-label-neutral">
                      횡보장에서는 승률이 평균 대비 15% 낮습니다. 횡보 구간 진입을 줄이세요.
                    </p>
                  </div>

                  {/* 권장 카드 */}
                  <div
                    className="rounded-lg p-3 flex flex-col gap-1"
                    style={{
                      backgroundColor: 'rgba(231, 248, 237, 0.3)',
                      border: '0.6px solid #13C34E',
                    }}
                  >
                    <span className="text-caption-bold text-element-positive-default">권장</span>
                    <p className="text-caption-regular text-label-neutral">
                      1시간봉에서 성과가 1.3배 이상 높습니다. 해당 타임프레임에 집중해 보세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 flex items-center justify-center">
              <p className="text-body-1-regular text-label-assistive">
                전략을 선택하면 분석 결과가 표시됩니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
