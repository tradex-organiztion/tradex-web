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
 * MainLayout - Figma Tradex_0221 기준
 * - 사이드바: 항상 200px 고정 (데스크톱)
 * - 헤더: 48px
 * - 콘텐츠 padding: 36px 좌우, 32px 위아래
 */
export function MainLayout({ children }: MainLayoutProps) {
  const { isAIPanelOpen, isMobile } = useUIStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main
        className={cn(
          'pt-12 transition-all duration-300',
          isMobile ? 'pl-0' : 'pl-[200px]',
          isAIPanelOpen && !isMobile && 'pr-96'
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
