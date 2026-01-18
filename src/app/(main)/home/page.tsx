"use client";

import {
  StatCard,
  TradexAIInsightCard,
  WeeklyProfitChart,
  RiskScoreCard,
} from "@/components/home";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Home Page - Figma 디자인 기준
 * - gap: 32px (메인 섹션 간격)
 * - 인사 영역 gap: 8px
 * - 카드 간격: 20px
 * - 카드 높이: 154px
 * - 하단 차트 너비: 669px, 리스크 카드: flex-1
 */
export default function HomePage() {
  const { user } = useAuthStore();
  const userName = user?.username || "User";

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting Section - gap: 8px */}
      <div className="flex flex-col gap-2">
        <h1 className="text-title-1-bold text-[#0f172a]">
          안녕하세요 {userName}님!
        </h1>
        <p className="text-body-1-regular text-label-neutral">
          오늘도 성공적인 트레이딩 되세요. 현재 시장 변동성이 확대되고 있습니다.
        </p>
      </div>

      {/* Dashboard Section - gap: 24px */}
      <div className="flex flex-col gap-6">
        {/* Top Stats Row - gap: 20px */}
        <div className="flex gap-5">
          <StatCard
            title="총 자산 (Total Assets)"
            value="$124,500.00"
            subValue="184,720,650 KRW"
            badge={{ label: "+25%", variant: "positive" }}
          />
          <StatCard
            title="이번 달 실현 손익(PnL)"
            value="+$4,250.00"
            subValue="6,306,575 KRW"
            badge={{ label: "+ 8.2%", variant: "positive" }}
          />
          <StatCard
            title="최근 7일 승률(Win Rate)"
            value="64.2%"
            subValue="6,306,575 KRW"
            badge={{ label: "- 2.1%", variant: "danger" }}
          />
          <TradexAIInsightCard />
        </div>

        {/* Bottom Section - gap: 20px */}
        <div className="flex gap-5">
          <WeeklyProfitChart className="w-[669px] shrink-0" />
          <RiskScoreCard className="flex-1" />
        </div>
      </div>
    </div>
  );
}
