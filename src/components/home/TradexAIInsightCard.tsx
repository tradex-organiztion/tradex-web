"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface TradexAIInsightCardProps {
  className?: string;
}

export function TradexAIInsightCard({ className }: TradexAIInsightCardProps) {
  return (
    <div
      className={cn(
        "flex-1 min-w-[200px] flex flex-col gap-2.5 rounded-xl py-5 px-6",
        className
      )}
      style={{
        border: "0.6px solid #00C483",
        background: "linear-gradient(106deg, rgba(0, 196, 131, 0.10) 8.04%, rgba(133, 209, 24, 0.10) 98.05%)",
        boxShadow: "0px 2px 10px 2px rgba(0, 0, 0, 0.02)",
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-body-1-bold text-label-normal">Tradex AI Insight</p>
          <p className="text-body-2-regular text-label-neutral">
            오늘의 시장 현황과 이슈를 분석한
            <br />
            인사이트 리포트가 도착했어요!
          </p>
        </div>
        <Link
          href="/ai"
          className="w-full bg-gray-900 text-white text-body-1-medium text-center py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          보러가기
        </Link>
      </div>
    </div>
  );
}
