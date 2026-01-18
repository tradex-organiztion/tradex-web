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
}

const defaultItems: RiskItem[] = [
  { label: "뇌동매매", level: "high", percentage: 85 },
  { label: "손절준수", level: "low", percentage: 40 },
  { label: "뇌동매매", level: "medium", percentage: 55 },
  { label: "레버리지", level: "high", percentage: 85 },
];

const levelConfig = {
  high: {
    label: "높음",
    textColor: "text-red-400",
    bgColor: "bg-red-400",
  },
  medium: {
    label: "양호",
    textColor: "text-yellow-400",
    bgColor: "bg-yellow-400",
  },
  low: {
    label: "낮음",
    textColor: "text-green-400",
    bgColor: "bg-green-400",
  },
};

export function RiskScoreCard({
  items = defaultItems,
  aiCoachMessage = "최근 뇌동매매 지수가 높아지고 있습니다. 진입 전 사전 시나리오를 반드시 확인하세요.",
}: RiskScoreCardProps) {
  return (
    <div className="bg-white rounded-[10px] shadow-normal px-6 py-5 flex-1">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-0.5">
          <p className="text-body-1-bold text-gray-800">리스크 진단 점수</p>
          <p className="text-body-2-regular text-gray-600">
            현재 나의 매매 습관 점수입니다.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-5">
            {items.map((item, index) => {
              const config = levelConfig[item.level];
              return (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-body-2-medium text-gray-800">{item.label}</p>
                    <p className={cn("text-body-2-bold", config.textColor)}>
                      {config.label}
                    </p>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className={cn("h-2 rounded-full", config.bgColor)}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-caption-regular text-gray-600">
            💡 AI Coach: {aiCoachMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
