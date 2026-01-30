'use client'

import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'

// Figma 디자인 기준 아이콘
function IconAIBulb({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 12.6667V13.3333C6 13.687 6.14048 14.0261 6.39052 14.2761C6.64057 14.5262 6.97971 14.6667 7.33333 14.6667H8.66667C9.02029 14.6667 9.35943 14.5262 9.60948 14.2761C9.85952 14.0261 10 13.687 10 13.3333V12.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 12.6667H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 1.33333C6.58551 1.33333 5.22896 1.89523 4.22876 2.89543C3.22857 3.89562 2.66667 5.25217 2.66667 6.66666C2.66667 8.66666 3.66667 10.3333 5.33333 11.3333V12.6667H10.6667V11.3333C12.3333 10.3333 13.3333 8.66666 13.3333 6.66666C13.3333 5.25217 12.7714 3.89562 11.7712 2.89543C10.771 1.89523 9.41449 1.33333 8 1.33333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/**
 * Header - Figma 디자인 기준
 * 높이: 64px
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
          "flex items-center gap-2 h-9 px-4 rounded-full border text-body-2-medium transition-colors",
          isAIPanelOpen
            ? "border-label-normal bg-gray-100 text-label-normal"
            : "border-line-normal text-label-neutral hover:bg-gray-50"
        )}
      >
        <IconAIBulb className="w-4 h-4" />
        Tradex AI에게 묻기
      </button>
    </header>
  )
}
