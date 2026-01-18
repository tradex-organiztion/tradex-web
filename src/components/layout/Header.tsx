'use client'

import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'

/**
 * Header - Figma 디자인 기준
 * 높이: 40px
 * 사이드바 헤더와 높이 동일
 * border-bottom만 있는 빈 영역
 */
export function Header() {
  const { isSidebarCollapsed } = useUIStore()

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-30 h-10 border-b border-line-normal bg-background-gray transition-all duration-300',
        isSidebarCollapsed ? 'left-16' : 'left-[180px]'
      )}
    />
  )
}
