"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "positive" | "negative" | "warning" | "info";
  className?: string;
}

export function Badge({ label, variant = "positive", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-0.5 rounded text-caption-medium",
        variant === "positive" &&
          "bg-element-positive-lighter text-element-positive-default",
        variant === "negative" &&
          "bg-element-danger-lighter text-element-danger-default",
        variant === "warning" &&
          "bg-element-warning-lighter text-element-warning-default",
        variant === "info" &&
          "bg-element-info-lighter text-element-info-default",
        className
      )}
    >
      {label}
    </span>
  );
}
