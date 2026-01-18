"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface TradexAIInsightCardProps {
  className?: string;
}

/**
 * TradexAIInsightCard - Figma 디자인 기준
 * - flex-1 (남은 공간 채움)
 * - 테두리: 1px solid symbol-main (#0fdd99)
 * - 그라데이션: linear-gradient(118deg, rgba(15, 221, 153, 0.2) 8%, rgba(159, 249, 30, 0.2) 98%)
 * - 패딩: px-24 (24px), py-20 (20px)
 * - 타이틀: text-body-1-bold, color: label-normal
 * - 설명: text-body-2-regular, color: label-neutral
 * - 버튼: bg-element-primary-default, text-white, px-12, py-8, rounded-md
 */
export function TradexAIInsightCard({ className }: TradexAIInsightCardProps) {
  return (
    <div
      className={cn(
        "flex-1 min-w-[200px] rounded-[10px] border border-symbol-main px-6 py-5 shadow-[0px_2px_10px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden",
        className
      )}
      style={{
        background:
          "linear-gradient(118deg, rgba(15, 221, 153, 0.2) 8%, rgba(159, 249, 30, 0.2) 98%)",
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
          className="w-full bg-element-primary-default text-label-inverse text-body-1-medium text-center py-2 px-3 rounded-md hover:bg-element-primary-pressed transition-colors"
        >
          보러가기
        </Link>
      </div>
    </div>
  );
}
