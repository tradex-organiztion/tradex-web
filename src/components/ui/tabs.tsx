"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

/**
 * Tradex Design System - Tabs Component
 * Based on Figma: https://www.figma.com/design/bIuxiR3Mqy0PfLkxIQv4Oa
 *
 * Figma 디자인 기준:
 * - 언더라인 스타일 탭 (필 스타일 아님)
 * - 높이: 56px
 * - 활성: border-bottom 2px #131416, SemiBold 20px, color #131416
 * - 비활성: border-bottom 1px #cdd1d5, Regular 20px, color #8a949e
 */

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex w-full bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base styles
        "flex-1 h-[56px] flex items-center justify-center",
        "text-[20px] text-center whitespace-nowrap",
        "transition-all outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        // Inactive state (default)
        "font-normal !text-[#8A949E] border-b border-[#CDD1D5]",
        // Active state
        "data-[state=active]:font-semibold data-[state=active]:!text-[#131416]",
        "data-[state=active]:border-b-2 data-[state=active]:border-[#131416]",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
