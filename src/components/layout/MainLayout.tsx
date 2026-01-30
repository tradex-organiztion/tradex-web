'use client'

import { useUIStore } from '@/stores'
import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { TradexAIPanel } from './TradexAIPanel'

interface MainLayoutProps {
  children: React.ReactNode
}

/**
 * MainLayout - Figma 디자인 기준
 * - 사이드바: 200px (접힌 상태 64px)
 * - 헤더: 64px
 * - 콘텐츠 padding: 36px 좌우, 32px 위아래
 * - gap: 32px
 */
export function MainLayout({ children }: MainLayoutProps) {
  const { isSidebarCollapsed, isAIPanelOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-background-gray">
      <Sidebar />
      <Header />

      <main
        className={cn(
          'pt-16 transition-all duration-300',
          isSidebarCollapsed ? 'pl-16' : 'pl-[200px]',
          isAIPanelOpen && 'pr-96'
        )}
      >
        <div className="px-9 py-8">
          {children}
        </div>
      </main>

      <TradexAIPanel />
    </div>
  )
}
