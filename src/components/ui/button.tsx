import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Tradex Design System - Button Component
 * Based on Figma: Tradex_0221
 *
 * Variants:
 * - primary: Dark filled button (main action) - gray-900
 * - secondary: Outlined button (secondary action) - white, border gray-300
 * - ghost: Text only button
 * - destructive: Error/danger action - red-400
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
          "bg-gray-900 !text-white rounded-lg",
          "hover:bg-gray-800",
          "active:bg-gray-800",
          "disabled:bg-gray-200 disabled:!text-gray-500",
        ].join(" "),
        // Secondary: Outlined button
        secondary: [
          "bg-white !text-gray-900 border border-gray-300 rounded-lg",
          "hover:border-gray-600",
          "active:border-gray-900",
          "disabled:border-gray-200 disabled:!text-gray-500 disabled:bg-white",
        ].join(" "),
        // Ghost: Text only
        ghost: [
          "!text-gray-900 bg-transparent",
          "hover:bg-gray-50",
          "active:bg-gray-200",
          "disabled:!text-gray-500",
        ].join(" "),
        // Destructive: Error action
        destructive: [
          "bg-red-400 !text-white rounded-lg",
          "hover:bg-red-300",
          "active:bg-red-300",
          "disabled:bg-gray-200 disabled:!text-gray-500",
        ].join(" "),
        // Link style
        link: "!text-blue-400 underline-offset-4 hover:underline disabled:!text-gray-500",
      },
      size: {
        // Large: 54px height (p-16 = 16px padding all around)
        lg: "h-[54px] px-4 py-4 text-body-1-medium rounded-lg gap-2 min-w-[78px]",
        // Medium: 38px height (default)
        md: "h-[38px] px-3 py-2 text-body-1-medium rounded-lg gap-1 min-w-[64px]",
        // Small: 28px height
        sm: "h-[28px] px-3 py-1.5 text-caption-medium rounded gap-1",
        // Icon variants
        icon: "size-10 rounded-lg",
        "icon-sm": "size-8 rounded",
        "icon-lg": "size-[54px] rounded-lg",
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
