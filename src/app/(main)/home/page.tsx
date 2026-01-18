"use client";

import {
  StatCard,
  TradexAIInsightCard,
  WeeklyProfitChart,
  RiskScoreCard,
} from "@/components/home";

export default function HomePage() {
  // TODO: Replace with actual user data from API
  const userName = "Jay";

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-title-1-bold text-gray-800">
          안녕하세요 {userName}님!
        </h1>
        <p className="text-body-1-regular text-gray-600">
          오늘도 성공적인 트레이딩 되세요. 현재 시장 변동성이 확대되고 있습니다.
        </p>
      </div>

      {/* Stats Section */}
      <div className="flex flex-col gap-6">
        {/* Top Stats Row */}
        <div className="flex gap-5">
          <StatCard
            title="총 자산 (Total Assets)"
            value="$124,500.00"
            subValue="184,720,650 KRW"
            badge={{ label: "+25%", variant: "positive" }}
            className="flex-1"
          />
          <StatCard
            title="이번 달 실현 손익(PnL)"
            value="+$4,250.00"
            subValue="6,306,575 KRW"
            badge={{ label: "+ 8.2%", variant: "positive" }}
            className="flex-1"
          />
          <StatCard
            title="최근 7일 승률(Win Rate)"
            value="64.2%"
            subValue="6,306,575 KRW"
            badge={{ label: "- 2.1%", variant: "danger" }}
            className="flex-1"
          />
          <TradexAIInsightCard />
        </div>

        {/* Bottom Section - Chart and Risk Score */}
        <div className="flex gap-5">
          <div className="flex-[2]">
            <WeeklyProfitChart />
          </div>
          <div className="flex-1">
            <RiskScoreCard />
          </div>
        </div>
      </div>
    </div>
  );
}
