import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Tradex Design System - Input Component
 * Based on Figma: https://www.figma.com/design/bIuxiR3Mqy0PfLkxIQv4Oa
 *
 * States:
 * - default: Normal state
 * - focused: Active input state
 * - error: Validation error state
 * - success: Validation success state
 */

const inputVariants = cva(
  [
    "w-full rounded-[8px] border bg-gray-0 px-4 py-3 text-body-1-regular text-gray-800",
    "placeholder:text-gray-300",
    "transition-all duration-200",
    "outline-none",
    "disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      state: {
        default: "border-gray-200 focus:border-gray-400 focus:border-[1.5px]",
        error: "border-red-500 border-[1.5px] focus:border-red-500",
        success: "border-gray-200 focus:border-gray-400 focus:border-[1.5px]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  state?: "default" | "error" | "success"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", state = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        data-state={state}
        className={cn(inputVariants({ state, className }))}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
