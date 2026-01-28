import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Tradex Design System - Badge Component
 * Based on Figma: https://www.figma.com/design/104P8oC9SxaydWLtbg55EV
 *
 * Variants:
 * - Solid: Filled background (primary, positive-solid, danger-solid, warning-solid, info-solid)
 * - Light: Light background with colored text (secondary, positive, danger, warning, info)
 * - Outline: Border only
 *
 * Sizes:
 * - sm: 20px height
 * - md: 24px height (default)
 * - lg: 28px height
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[4px] font-medium whitespace-nowrap shrink-0 [&>svg]:pointer-events-none transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        // Solid variants (filled background)
        primary: "bg-element-primary-default text-gray-0 border-transparent",
        "positive-solid": "bg-element-positive-default text-gray-0 border-transparent",
        "danger-solid": "bg-element-danger-default text-gray-0 border-transparent",
        "warning-solid": "bg-element-warning-default text-gray-800 border-transparent",
        "info-solid": "bg-element-info-default text-gray-0 border-transparent",

        // Light variants (light background with colored text)
        secondary: "bg-gray-100 text-gray-800 border-transparent",
        positive: "bg-element-positive-lighter text-element-positive-default border-transparent",
        danger: "bg-element-danger-lighter text-element-danger-default border-transparent",
        warning: "bg-element-warning-lighter text-element-warning-default border-transparent",
        info: "bg-element-info-lighter text-element-info-default border-transparent",

        // Outline variant
        outline: "bg-transparent text-gray-800 border border-gray-300",
      },
      size: {
        sm: "h-5 px-1.5 text-caption-medium gap-0.5 [&>svg]:size-3",
        md: "h-6 px-2 text-caption-medium gap-1 [&>svg]:size-3.5",
        lg: "h-7 px-2.5 text-body-2-medium gap-1 [&>svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

function Badge({
  className,
  variant,
  size,
  asChild = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </Comp>
  )
}

export { Badge, badgeVariants }
