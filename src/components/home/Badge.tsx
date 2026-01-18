"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "positive" | "negative";
  className?: string;
}

export function Badge({ label, variant = "positive", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-0.5 rounded text-caption-medium",
        variant === "positive" && "bg-green-100 text-green-400",
        variant === "negative" && "bg-red-100 text-red-400",
        className
      )}
    >
      {label}
    </span>
  );
}
