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
        "bg-white rounded-xl border-[0.6px] border-gray-300 px-6 py-5 flex-1 flex flex-col justify-center overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="text-body-2-medium text-label-neutral">{title}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-title-1-bold text-label-normal">{value}</p>
            {change && (
              <span
                className={cn(
                  "text-caption-medium rounded-[4px] px-2 py-0.5",
                  change.variant === "positive"
                    ? "bg-green-100 text-green-400"
                    : "bg-red-100 text-red-400"
                )}
              >
                {change.label}
              </span>
            )}
          </div>
          {subValue && (
            <p className="text-body-2-regular text-gray-500">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  );
}
