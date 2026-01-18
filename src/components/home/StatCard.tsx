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
        "bg-white rounded-[10px] shadow-normal px-6 py-5 h-[154px] flex flex-col justify-center",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="text-body-2-medium text-gray-600">{title}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-title-1-bold text-gray-800">{value}</p>
            {badge && <Badge variant={badge.variant} size="sm">{badge.label}</Badge>}
          </div>
          {subValue && (
            <p className="text-body-2-regular text-gray-400">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  );
}
