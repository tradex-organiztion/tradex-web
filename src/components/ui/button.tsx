import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Tradex Design System - Button Component
 * Based on Figma: https://www.figma.com/design/bIuxiR3Mqy0PfLkxIQv4Oa
 *
 * Variants:
 * - primary: Dark filled button (main action)
 * - secondary: Outlined button (secondary action)
 * - ghost: Text only button
 * - destructive: Error/danger action
 *
 * Sizes:
 * - lg: 54px height (large)
 * - md: 38px height (medium, default)
 * - sm: 28px height (small)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Primary: Dark filled button
        primary: [
          "bg-[#131416] !text-[#FFFFFF] rounded-[8px]",
          "hover:bg-[#1E2124]",
          "active:bg-[#1E2124]",
          "disabled:bg-[#E6E8EA] disabled:!text-[#8A949E]",
        ].join(" "),
        // Secondary: Outlined button
        secondary: [
          "bg-[#FFFFFF] !text-[#131416] border border-[#CDD1D5] rounded-[8px]",
          "hover:border-[#6D7882]",
          "active:border-[#131416]",
          "disabled:border-[#E6E8EA] disabled:!text-[#8A949E] disabled:bg-[#FFFFFF]",
        ].join(" "),
        // Ghost: Text only
        ghost: [
          "!text-[#131416] bg-transparent",
          "hover:bg-[#F4F5F6]",
          "active:bg-[#E6E8EA]",
          "disabled:!text-[#8A949E]",
        ].join(" "),
        // Destructive: Error action
        destructive: [
          "bg-[#FF0015] !text-[#FFFFFF] rounded-[8px]",
          "hover:bg-[#FF4D5E]",
          "active:bg-[#FF4D5E]",
          "disabled:bg-[#E6E8EA] disabled:!text-[#8A949E]",
        ].join(" "),
        // Link style
        link: "!text-[#0070FF] underline-offset-4 hover:underline disabled:!text-[#8A949E]",
      },
      size: {
        // Large: 54px height (p-16 = 16px padding all around)
        lg: "h-[54px] px-4 py-4 text-body-1-medium rounded-[8px] gap-2 min-w-[78px]",
        // Medium: 38px height (default)
        md: "h-[38px] px-3 py-2 text-body-1-medium rounded-[8px] gap-1 min-w-[64px]",
        // Small: 28px height
        sm: "h-[28px] px-3 py-1.5 text-caption-medium rounded-[4px] gap-1",
        // Icon variants
        icon: "size-10 rounded-[8px]",
        "icon-sm": "size-8 rounded-[4px]",
        "icon-lg": "size-[54px] rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, leftIcon, rightIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
