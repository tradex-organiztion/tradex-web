"use client";

import { cn } from "@/lib/utils";

interface RiskItem {
  label: string;
  level: "high" | "medium" | "low";
  percentage: number;
}

interface RiskScoreCardProps {
  items?: RiskItem[];
  aiCoachMessage?: string;
  className?: string;
}

const defaultItems: RiskItem[] = [
  { label: "뇌동매매", level: "high", percentage: 85 },
  { label: "손절준수", level: "low", percentage: 40 },
  { label: "뇌동매매", level: "medium", percentage: 55 },
  { label: "레버리지", level: "high", percentage: 85 },
];

/**
 * RiskScoreCard - Figma 디자인 기준
 * - flex-1 (남은 공간 채움)
 * - 배경: white
 * - 테두리 반경: 10px
 * - 그림자: shadow-normal
 * - 패딩: px-24, py-20
 * - 타이틀: text-body-1-bold, color: label-normal
 * - 설명: text-body-2-regular, color: label-neutral
 * - 섹션 간격: 24px
 * - 리스크 아이템:
 *   - 라벨: text-body-2-medium, color: label-normal
 *   - 레벨: text-body-2-bold
 *     - high: label-danger
 *     - low: label-positive
 *     - medium: label-warning
 *   - 프로그래스 바:
 *     - 배경: element-primary-disabled
 *     - 채움: element-danger-default / element-positive-default / element-warning-default
 *     - 높이: 8px, rounded-full
 *   - 아이템 간격: 20px
 * - AI Coach: text-caption-regular, color: label-neutral
 */
const levelConfig = {
  high: {
    label: "높음",
    textColor: "text-label-danger",
    bgColor: "bg-element-danger-default",
  },
  medium: {
    label: "양호",
    textColor: "text-label-warning",
    bgColor: "bg-element-warning-default",
  },
  low: {
    label: "낮음",
    textColor: "text-label-positive",
    bgColor: "bg-element-positive-default",
  },
};

export function RiskScoreCard({
  items = defaultItems,
  aiCoachMessage = "최근 뇌동매매 지수가 높아지고 있습니다. 진입 전 사전 시나리오를 반드시 확인하세요.",
  className,
}: RiskScoreCardProps) {
  return (
    <div className={cn("bg-white rounded-[10px] shadow-normal px-6 py-5 flex-1", className)}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-0.5">
          <p className="text-body-1-bold text-label-normal">리스크 진단 점수</p>
          <p className="text-body-2-regular text-label-neutral">
            현재 나의 매매 습관 점수입니다.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-5">
            {items.map((item, index) => {
              const config = levelConfig[item.level];
              return (
                <div key={index}>
                  {index > 0 && <div className="h-px bg-gray-100 mb-5" />}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between h-5">
                      <p className="text-body-2-medium text-label-normal">{item.label}</p>
                      <p className={cn("text-body-2-bold", config.textColor)}>
                        {config.label}
                      </p>
                    </div>
                    <div className="w-full h-2 bg-element-primary-disabled rounded-full">
                      <div
                        className={cn("h-2 rounded-full", config.bgColor)}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-caption-regular text-label-neutral">
            💡 AI Coach: {aiCoachMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
