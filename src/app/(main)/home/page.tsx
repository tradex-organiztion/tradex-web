"use client";

import { useEffect, useState } from "react";
import {
  StatCard,
  TradexAIInsightCard,
  WeeklyProfitChart,
  RiskScoreCard,
} from "@/components/home";
import { useAuthStore } from "@/stores/useAuthStore";
import { homeApi, HomeSummaryResponse } from "@/lib/api";

/**
 * Home Page - Figma 디자인 기준
 * API: GET /api/home/summary
 */
export default function HomePage() {
  const { user, isDemoMode } = useAuthStore();
  const userName = user?.username || "User";

  const [summaryData, setSummaryData] = useState<HomeSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);

      // 데모 모드에서는 API 호출 없이 목 데이터 사용
      if (isDemoMode) {
        setSummaryData({
          todayTotalAsset: 125000,
          yesterdayTotalAsset: 120000,
          assetChangeRate: 4.17,
          thisMonthPnl: 8500,
          lastMonthFinalPnl: 6200,
          achievementRate: 137.1,
          totalWins: 18,
          totalLosses: 7,
          winRate: 72.0,
          pnlChart: [
            { date: "01/20", cumulativePnl: 1200 },
            { date: "01/21", cumulativePnl: 900 },
            { date: "01/22", cumulativePnl: 1750 },
            { date: "01/23", cumulativePnl: 2850 },
            { date: "01/24", cumulativePnl: 2650 },
            { date: "01/25", cumulativePnl: 4150 },
            { date: "01/26", cumulativePnl: 5050 },
          ],
        });
        setIsLoading(false);
        return;
      }

      // API 호출 - 실패 시 null 반환
      const data = await homeApi.getSummary().catch((err) => {
        console.warn("Home summary API unavailable:", err.message);
        return null;
      });

      if (data) {
        setSummaryData(data);
      } else {
        setError("API 서버에 연결할 수 없습니다. 기본 데이터를 표시합니다.");
      }

      setIsLoading(false);
    };

    fetchSummary();
  }, [isDemoMode]);

  // 금액 포맷팅 함수
  const formatCurrency = (value: number, currency: "USD" | "KRW" = "USD") => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(value);
    }
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // 퍼센트 포맷팅 함수
  const formatPercent = (value: number, showSign = true) => {
    const sign = showSign && value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  // USD를 KRW로 변환 (임시 환율 1,485원)
  const usdToKrw = (usd: number) => usd * 1485;

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-title-1-bold text-gray-800">
            안녕하세요 {userName}님!
          </h1>
          <p className="text-body-1-regular text-symbol-main">
            데이터를 불러오는 중입니다...
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-1 h-[154px] bg-gray-100 rounded-[16px] animate-pulse"
              />
            ))}
          </div>
          <div className="flex gap-5">
            <div className="w-full max-w-[669px] h-[300px] bg-gray-100 rounded-[16px] animate-pulse" />
            <div className="flex-1 h-[300px] bg-gray-100 rounded-[16px] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !summaryData) {
    // 에러 시 기본값으로 표시
    const defaultData: HomeSummaryResponse = {
      todayTotalAsset: 0,
      yesterdayTotalAsset: 0,
      assetChangeRate: 0,
      thisMonthPnl: 0,
      lastMonthFinalPnl: 0,
      achievementRate: 0,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
      pnlChart: [],
    };
    const data = summaryData || defaultData;

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-title-1-bold text-gray-800">
            안녕하세요 {userName}님!
          </h1>
          <p className="text-body-1-regular text-symbol-main">
            {error || "오늘도 성공적인 트레이딩 되세요."}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <StatCard
              title="총 자산 (Total Assets)"
              value={formatCurrency(data.todayTotalAsset)}
              subValue={formatCurrency(usdToKrw(data.todayTotalAsset), "KRW")}
              change={{
                label: formatPercent(data.assetChangeRate),
                variant: data.assetChangeRate >= 0 ? "positive" : "danger",
              }}
            />
            <StatCard
              title="이번 달 실현 손익(PnL)"
              value={formatCurrency(data.thisMonthPnl)}
              subValue={formatCurrency(usdToKrw(data.thisMonthPnl), "KRW")}
              change={{
                label: formatPercent(data.achievementRate),
                variant: data.achievementRate >= 0 ? "positive" : "danger",
              }}
            />
            <StatCard
              title="최근 7일 승률(Win Rate)"
              value={`${data.winRate.toFixed(1)}%`}
              subValue={`${data.totalWins}승 ${data.totalLosses}패`}
              change={{
                label: formatPercent(0),
                variant: "positive",
              }}
            />
            <TradexAIInsightCard />
          </div>

          <div className="flex gap-5">
            <WeeklyProfitChart className="w-full max-w-[669px] shrink-0" chartData={data.pnlChart} />
            <RiskScoreCard className="flex-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-title-1-bold text-gray-800">
          안녕하세요 {userName}님!
        </h1>
        <p className="text-body-1-regular text-symbol-main">
          오늘도 성공적인 트레이딩 되세요. 현재 시장 변동성이 확대되고 있습니다.
        </p>
      </div>

      {/* Dashboard Section */}
      <div className="flex flex-col gap-6">
        {/* Top Stats Row */}
        <div className="flex gap-4">
          <StatCard
            title="총 자산 (Total Assets)"
            value={formatCurrency(summaryData.todayTotalAsset)}
            subValue={formatCurrency(usdToKrw(summaryData.todayTotalAsset), "KRW")}
            change={{
              label: formatPercent(summaryData.assetChangeRate),
              variant: summaryData.assetChangeRate >= 0 ? "positive" : "danger",
            }}
          />
          <StatCard
            title="이번 달 실현 손익(PnL)"
            value={formatCurrency(summaryData.thisMonthPnl)}
            subValue={formatCurrency(usdToKrw(summaryData.thisMonthPnl), "KRW")}
            change={{
              label: formatPercent(summaryData.achievementRate),
              variant: summaryData.achievementRate >= 0 ? "positive" : "danger",
            }}
          />
          <StatCard
            title="최근 7일 승률(Win Rate)"
            value={`${summaryData.winRate.toFixed(1)}%`}
            subValue={`${summaryData.totalWins}승 ${summaryData.totalLosses}패`}
            change={{
              label:
                summaryData.winRate > 50
                  ? `+${(summaryData.winRate - 50).toFixed(1)}%`
                  : `${(summaryData.winRate - 50).toFixed(1)}%`,
              variant: summaryData.winRate >= 50 ? "positive" : "danger",
            }}
          />
          <TradexAIInsightCard />
        </div>

        {/* Bottom Section */}
        <div className="flex gap-5">
          {/* Note: 20px gap = gap-5 */}
          <WeeklyProfitChart className="w-full max-w-[669px] shrink-0" chartData={summaryData.pnlChart} />
          <RiskScoreCard className="flex-1" />
        </div>
      </div>
    </div>
  );
}
