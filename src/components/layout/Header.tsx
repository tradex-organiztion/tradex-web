'use client'

import { Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'

/**
 * Header - Figma 디자인 기준
 * 높이: 64px (py-3 = 12px * 2 + 버튼 높이 40px)
 * 우측 상단에 "Tradex AI에게 묻기" 버튼
 */
export function Header() {
  const { isSidebarCollapsed, toggleAIPanel, isAIPanelOpen } = useUIStore()

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-30 h-16 border-b border-line-normal bg-white transition-all duration-300 flex items-center justify-end px-6',
        isSidebarCollapsed ? 'left-16' : 'left-[200px]',
        isAIPanelOpen && 'right-96'
      )}
    >
      <button
        onClick={toggleAIPanel}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border text-body-2-medium transition-colors",
          isAIPanelOpen
            ? "border-label-normal bg-gray-100 text-label-normal"
            : "border-line-normal text-label-neutral hover:bg-gray-50"
        )}
      >
        <Lightbulb className="w-4 h-4" />
        Tradex AI에게 묻기
      </button>
    </header>
  )
}
