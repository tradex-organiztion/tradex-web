"use client";

import { useState } from "react";

// 전략 카드 컴포넌트
function StrategyCard({
  type,
  percentage,
  title,
  tags,
  totalTrades,
  avgProfit,
  profitPercent,
}: {
  type: "best" | "worst";
  percentage: number;
  title: string;
  tags: { label: string; value: string }[];
  totalTrades: number;
  avgProfit: string;
  profitPercent: string;
}) {
  const isBest = type === "best";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex-1">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs text-gray-500">{isBest ? "Best" : "Worst"}</span>
          <h3 className="text-base font-semibold text-navy-900 mt-0.5">{title}</h3>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isBest
              ? "bg-success-100 text-success-500"
              : "bg-error-100 text-error-500"
          }`}
        >
          {percentage}%
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-0.5 h-8 rounded-full ${isBest ? "bg-success-500" : "bg-error-500"}`} />
            <div>
              <p className="text-sm font-medium text-navy-900">{tag.label}</p>
              <p className="text-xs text-gray-500">{tag.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          총 거래 <span className="font-medium text-navy-900">{totalTrades}회</span>
        </span>
        <span className="text-sm text-gray-500">
          평균 수익{" "}
          <span className={`font-medium ${isBest ? "text-success-500" : "text-error-500"}`}>
            {avgProfit}({profitPercent})
          </span>
        </span>
      </div>
    </div>
  );
}

// 체크박스 컴포넌트
function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          checked ? "bg-navy-900 border-navy-900" : "border-gray-300"
        }`}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

// 통계 카드 컴포넌트
function StatCard({
  label,
  value,
  subValue,
  valueColor = "text-navy-900",
}: {
  label: string;
  value: string;
  subValue?: string;
  valueColor?: string;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>
        {value}
        {subValue && <span className="text-sm font-medium ml-1">{subValue}</span>}
      </p>
    </div>
  );
}

// AI 인사이트 카드
function AIInsightCard({
  type,
  title,
  description,
}: {
  type: "strength" | "weakness" | "recommendation";
  title: string;
  description: string;
}) {
  const styles = {
    strength: {
      bg: "bg-success-100",
      border: "border-success-300",
      titleColor: "text-success-500",
    },
    weakness: {
      bg: "bg-error-100",
      border: "border-error-300",
      titleColor: "text-error-500",
    },
    recommendation: {
      bg: "bg-info-100",
      border: "border-info-300",
      titleColor: "text-info-500",
    },
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-3`}>
      <p className={`text-xs font-semibold ${style.titleColor} mb-1`}>{title}</p>
      <p className="text-xs text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
}

export default function StrategyAnalysisPage() {
  // 필터 상태
  const [filters, setFilters] = useState({
    indicators: ["볼린저 밴드"],
    market: ["하락장"],
    style: ["스윙"],
    position: [] as string[],
    technical: [] as string[],
    timeframe: ["4시간봉"],
  });

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="p-6">
        {/* 페이지 타이틀 */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">전략 분석</h1>
            <p className="text-gray-500 mt-1">
              나의 트레이딩 전략과 승률을 분석하고 최고의 성과를 만들어 보세요.
            </p>
          </div>
          <button className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">
            2025. 10. 15 - 2025. 11. 15
          </button>
        </div>

        {/* Best/Worst 전략 카드 */}
        <div className="flex gap-4 mb-6">
          <StrategyCard
            type="best"
            percentage={76}
            title="가장 승률이 높은 트레이딩 전략입니다"
            tags={[
              { label: "볼린저 밴드", value: "지표" },
              { label: "스윙", value: "스타일" },
              { label: "4시간봉", value: "시간" },
            ]}
            totalTrades={56}
            avgProfit="+3,978달러"
            profitPercent="5.7%"
          />
          <StrategyCard
            type="worst"
            percentage={27}
            title="가장 승률이 낮은 트레이딩 전략입니다"
            tags={[
              { label: "MACD", value: "지표" },
              { label: "스윙", value: "스타일" },
              { label: "지지선", value: "기술적 분석" },
              { label: "15분봉", value: "시간" },
            ]}
            totalTrades={34}
            avgProfit="-1,248달러"
            profitPercent="-2.1%"
          />
        </div>

        {/* 전략 선택 & 분석 리포트 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 전략 선택 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <h2 className="text-base font-semibold text-navy-900">전략 선택</h2>
            </div>
            <p className="text-sm text-gray-500 mb-5">분석하고 싶은 전략을 선택해주세요.</p>

            <div className="grid grid-cols-2 gap-6">
              {/* 지표 */}
              <div>
                <h3 className="text-sm font-medium text-navy-900 mb-3">지표</h3>
                <div className="space-y-2">
                  {["볼린저 밴드", "RSI", "MACD", "EMA"].map((item) => (
                    <Checkbox
                      key={item}
                      label={item}
                      checked={filters.indicators.includes(item)}
                      onChange={() => toggleFilter("indicators", item)}
                    />
                  ))}
                </div>
              </div>

              {/* 시장 */}
              <div>
                <h3 className="text-sm font-medium text-navy-900 mb-3">시장</h3>
                <div className="space-y-2">
                  {["상승장", "하락장", "횡보장"].map((item) => (
                    <Checkbox
                      key={item}
                      label={item}
                      checked={filters.market.includes(item)}
                      onChange={() => toggleFilter("market", item)}
                    />
                  ))}
                </div>
              </div>

              {/* 스타일 */}
              <div>
                <h3 className="text-sm font-medium text-navy-900 mb-3">스타일</h3>
                <div className="space-y-2">
                  {["스캘핑", "스윙"].map((item) => (
                    <Checkbox
                      key={item}
                      label={item}
                      checked={filters.style.includes(item)}
                      onChange={() => toggleFilter("style", item)}
                    />
                  ))}
                </div>
              </div>

              {/* 포지션 */}
              <div>
                <h3 className="text-sm font-medium text-navy-900 mb-3">포지션</h3>
                <div className="space-y-2">
                  {["Long", "Short"].map((item) => (
                    <Checkbox
                      key={item}
                      label={item}
                      checked={filters.position.includes(item)}
                      onChange={() => toggleFilter("position", item)}
                    />
                  ))}
                </div>
              </div>

              {/* 기술적 분석 */}
              <div>
                <h3 className="text-sm font-medium text-navy-900 mb-3">기술적 분석</h3>
                <div className="space-y-2">
                  {["지지/저항선", "피보나치 되돌림", "추세선", "채널"].map((item) => (
                    <Checkbox
                      key={item}
                      label={item}
                      checked={filters.technical.includes(item)}
                      onChange={() => toggleFilter("technical", item)}
                    />
                  ))}
                </div>
              </div>

              {/* 시간 */}
              <div>
                <h3 className="text-sm font-medium text-navy-900 mb-3">시간</h3>
                <div className="space-y-2">
                  {["15분봉", "1시간봉", "4시간봉", "일봉"].map((item) => (
                    <Checkbox
                      key={item}
                      label={item}
                      checked={filters.timeframe.includes(item)}
                      onChange={() => toggleFilter("timeframe", item)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 분석 리포트 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-base font-semibold text-navy-900">분석 리포트</h2>
            </div>
            <p className="text-sm text-gray-500 mb-5">선택한 전략의 성과를 확인해 보세요</p>

            {/* 통계 그리드 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatCard label="승률" value="68.5%" />
              <StatCard label="총 거래" value="143회" />
              <StatCard label="평균 수익" value="+1,743달러" subValue="(2.4%)" valueColor="text-success-500" />
              <StatCard label="평균 R/R 비율" value="2.10" />
              <StatCard label="누적 수익" value="+43,759달러" subValue="(18.3%)" valueColor="text-success-500" />
              <StatCard label="최대 연속 기록" value="+8 / -4" />
            </div>

            {/* 손익 그래프 & AI 분석 */}
            <div className="grid grid-cols-2 gap-4">
              {/* 손익 그래프 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-navy-900 mb-2">손익 그래프</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  지난 30일간 볼린저 밴드 지표와 스윙 매매 전략만 적용했다면 계좌는{" "}
                  <span className="text-success-500 font-medium">+14.2%</span> 성장했으며 최대 낙폭은{" "}
                  <span className="text-error-500 font-medium">-4.3%</span>입니다.
                </p>

                {/* 간단한 차트 (SVG) */}
                <div className="h-32 relative">
                  <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#13C34E"
                      strokeWidth="2"
                      points="0,80 30,70 60,75 90,50 120,55 150,40 180,45 210,30 240,25 270,15 300,20"
                    />
                  </svg>
                  {/* X축 라벨 */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-gray-400 -mb-4">
                    <span>10/15</span>
                    <span>10/20</span>
                    <span>10/25</span>
                    <span>10/30</span>
                    <span>11/05</span>
                    <span>11/10</span>
                    <span>11/15</span>
                  </div>
                </div>
              </div>

              {/* Tradex AI */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-navy-900 mb-3">Tradex AI</h3>
                <div className="space-y-2">
                  <AIInsightCard
                    type="strength"
                    title="강점"
                    description="미국 개장 시간에 68%의 높은 승률을 보입니다."
                  />
                  <AIInsightCard
                    type="weakness"
                    title="약점"
                    description="이 전략은 횡보장에서 성과가 27%p 낮습니다. 명확한 추세 확인 후 진입해 보세요."
                  />
                  <AIInsightCard
                    type="recommendation"
                    title="권장"
                    description="1시간봉에서 성과가 1.3배 이상 높습니다. 해당 타임프레임에 집중해 보세요."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
