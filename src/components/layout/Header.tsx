'use client'

import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'

/**
 * Header - Figma 디자인 기준
 * 높이: 64px
 * 깔끔한 상단 바 (모바일에서 햄버거 메뉴 표시)
 */
export function Header() {
  const { isSidebarCollapsed, isAIPanelOpen, isMobile, setSidebarCollapsed } = useUIStore()

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-30 h-16 border-b border-line-normal bg-white transition-all duration-300 flex items-center px-6',
        isMobile
          ? 'left-0'
          : isSidebarCollapsed ? 'left-16' : 'left-[200px]',
        isAIPanelOpen && !isMobile && 'right-96'
      )}
    >
      {/* Mobile hamburger menu */}
      {isMobile && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="flex size-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="size-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </header>
  )
}
