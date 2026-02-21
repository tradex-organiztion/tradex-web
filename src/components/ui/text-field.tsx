"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Input, type InputProps } from "./input"

/**
 * Tradex Design System - TextField Component
 * Based on Figma: https://www.figma.com/design/6nheNQYbvBrIczlMxe54F6/Tradex_0221
 *
 * A complete text input field with label, hint, and message support.
 */

const messageVariants = cva(
  "flex items-start gap-1 text-body-2-regular",
  {
    variants: {
      type: {
        hint: "text-gray-500",
        info: "text-blue-400",
        success: "text-green-400",
        error: "text-[#FF0015]",
      },
    },
    defaultVariants: {
      type: "hint",
    },
  }
)

export interface TextFieldProps extends Omit<InputProps, "state"> {
  /** Label text displayed above the input */
  label?: React.ReactNode
  /** Hint text displayed below the label */
  hint?: string
  /** Message displayed below the input */
  message?: string
  /** Message type determines the color and icon */
  messageType?: "hint" | "info" | "success" | "error"
  /** Right icon/element inside the input */
  rightElement?: React.ReactNode
  /** Left icon/element inside the input */
  leftElement?: React.ReactNode
  /** Container className */
  containerClassName?: string
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      hint,
      message,
      messageType = "hint",
      rightElement,
      leftElement,
      containerClassName,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Determine input state based on messageType
    const inputState = messageType === "error" ? "error" : messageType === "success" ? "success" : "default"

    return (
      <div className={cn("flex flex-col gap-2 w-full", containerClassName)}>
        {/* Label */}
        {label && (
          <label className="text-body-1-medium text-gray-800">
            {label}
          </label>
        )}

        {/* Hint (below label) */}
        {hint && (
          <p className="text-body-2-regular text-gray-500">
            {hint}
          </p>
        )}

        {/* Input wrapper for icons */}
        <div className="relative w-full">
          {leftElement && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
              {leftElement}
            </div>
          )}

          <Input
            ref={ref}
            state={inputState}
            disabled={disabled}
            className={cn(
              leftElement && "pl-12",
              rightElement && "pr-12",
              className
            )}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
              {rightElement}
            </div>
          )}
        </div>

        {/* Message (below input) */}
        {message && (
          <div className={cn(messageVariants({ type: messageType }))}>
            {messageType === "success" && (
              <SuccessIcon className="shrink-0 mt-0.5" />
            )}
            {messageType === "error" && (
              <ErrorIcon className="shrink-0 mt-0.5" />
            )}
            {messageType === "info" && (
              <InfoIcon className="shrink-0 mt-0.5" />
            )}
            <span>{message}</span>
          </div>
        )}
      </div>
    )
  }
)
TextField.displayName = "TextField"

// Icon components
function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8 1.33334C4.32 1.33334 1.33333 4.32001 1.33333 8.00001C1.33333 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8.00001C14.6667 4.32001 11.68 1.33334 8 1.33334ZM6.66667 11.3333L3.33333 8.00001L4.27333 7.06001L6.66667 9.44668L11.7267 4.38668L12.6667 5.33334L6.66667 11.3333Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="9" cy="9" r="8" fill="#FF0015"/>
      <path d="M6.5 6.5L11.5 11.5M11.5 6.5L6.5 11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8 1.33334C4.32 1.33334 1.33333 4.32001 1.33333 8.00001C1.33333 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8.00001C14.6667 4.32001 11.68 1.33334 8 1.33334ZM8.66667 11.3333H7.33333V7.33334H8.66667V11.3333ZM8.66667 6.00001H7.33333V4.66668H8.66667V6.00001Z"
        fill="currentColor"
      />
    </svg>
  )
}

export { TextField, messageVariants }
