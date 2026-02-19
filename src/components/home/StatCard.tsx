"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  change?: {
    label: string;
    variant: "positive" | "danger";
  };
  className?: string;
}

/**
 * StatCard - Figma 디자인 기준
 * - 퍼센트 변동은 Badge가 아닌 일반 색상 텍스트로 표시
 * - subValue 옆에 변동률 표시
 */
export function StatCard({
  title,
  value,
  subValue,
  change,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-[10px] shadow-normal px-6 py-5 h-[154px] flex-1 flex flex-col justify-center overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="text-body-2-medium text-label-neutral">{title}</p>
        <div className="flex flex-col gap-1">
          <p className="text-title-1-bold text-label-normal">{value}</p>
          {(subValue || change) && (
            <div className="flex items-center gap-2">
              {subValue && (
                <p className="text-body-2-regular text-label-assistive">{subValue}</p>
              )}
              {change && (
                <span className={cn(
                  "text-body-2-bold",
                  change.variant === "positive" ? "text-label-positive" : "text-label-danger"
                )}>
                  {change.label}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
