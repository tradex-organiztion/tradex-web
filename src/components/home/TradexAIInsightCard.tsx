"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface TradexAIInsightCardProps {
  className?: string;
}

/**
 * TradexAIInsightCard - Figma Tradex_0221 기준
 * - 배경: linear-gradient(135deg, #00C483 8%, #85D118 100%)
 * - 테두리: gradient linear-gradient(90deg, #00C483, #85D118) 0.6px
 * - 그림자: 0px 2px 10px 2px rgba(0,0,0,0.02)
 * - border-radius: 12px
 * - padding: 20px 24px
 * - 타이틀: Body 1/Bold, #121212
 * - 설명: Body 2/Regular, #767676
 * - 버튼: bg #121212, text white, rounded-lg, Body 1/Medium, padding 8px 12px
 */
export function TradexAIInsightCard({ className }: TradexAIInsightCardProps) {
  return (
    <div
      className={cn(
        "flex-1 min-w-[200px] rounded-xl px-6 py-5 flex flex-col justify-between overflow-hidden",
        className
      )}
      style={{
        background: "linear-gradient(135deg, rgba(0, 196, 131, 1) 8%, rgba(133, 209, 24, 1) 100%)",
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
