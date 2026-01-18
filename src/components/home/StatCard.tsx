"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  badge?: {
    label: string;
    variant: "positive" | "danger";
  };
  className?: string;
}

/**
 * StatCard - Figma 디자인 기준
 * - 너비: 276.75px (flex-1로 균등 분배)
 * - 높이: 154px
 * - 패딩: px-24 (24px), py-20 (20px)
 * - 타이틀: text-body-2-medium, color: label-neutral (#464c53)
 * - 값: text-title-1-bold, color: label-normal (#131416)
 * - 서브값: text-body-2-regular, color: label-assistive (#6d7882)
 */
export function StatCard({
  title,
  value,
  subValue,
  badge,
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
          <div className="flex items-center gap-2">
            <p className="text-title-1-bold text-label-normal">{value}</p>
            {badge && <Badge variant={badge.variant} size="sm">{badge.label}</Badge>}
          </div>
          {subValue && (
            <p className="text-body-2-regular text-label-assistive">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  );
}
