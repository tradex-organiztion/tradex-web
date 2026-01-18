"use client";

import Link from "next/link";

export function TradexAIInsightCard() {
  return (
    <div
      className="flex-1 min-w-[200px] rounded-[10px] border border-symbol-main px-6 py-5 shadow-[0px_2px_10px_2px_rgba(0,0,0,0.02)] flex flex-col"
      style={{
        background:
          "linear-gradient(118deg, rgba(15, 221, 153, 0.2) 8%, rgba(159, 249, 30, 0.2) 98%)",
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-body-1-bold text-gray-800">Tradex AI Insight</p>
          <p className="text-body-2-regular text-gray-600">
            오늘의 시장 현황과 이슈를 분석한
            <br />
            인사이트 리포트가 도착했어요!
          </p>
        </div>
        <Link
          href="/ai"
          className="w-full bg-gray-800 text-white text-body-1-medium text-center py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          보러가기
        </Link>
      </div>
    </div>
  );
}
