"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface TradexAIInsightCardProps {
  className?: string;
}

/**
 * TradexAIInsightCard - Figma 디자인 기준
 * - flex-1 (남은 공간 채움)
 * - 배경: gray-800 (#323232) 또는 label-normal (#131416)
 * - 패딩: px-24 (24px), py-20 (20px)
 * - 타이틀: text-body-1-bold, color: white
 * - 설명: text-body-2-regular, color: gray-300
 * - 버튼: bg-white, text-label-normal, rounded-md
 */
export function TradexAIInsightCard({ className }: TradexAIInsightCardProps) {
  return (
    <div
      className={cn(
        "flex-1 min-w-[200px] rounded-[10px] px-6 py-5 flex flex-col justify-between overflow-hidden",
        className
      )}
      style={{ backgroundColor: '#5B21B6' }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-body-1-bold text-white">Tradex AI Insight</p>
          <p className="text-body-2-regular text-symbol-main">
            오늘의 시장 현황과 이슈를 분석한
            <br />
            인사이트 리포트가 도착했어요!
          </p>
        </div>
        <Link
          href="/ai"
          className="w-full border border-white/60 text-white text-body-1-medium text-center py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors"
        >
          보러가기
        </Link>
      </div>
    </div>
  );
}
