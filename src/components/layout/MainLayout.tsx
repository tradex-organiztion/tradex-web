'use client'

import { useUIStore } from '@/stores'
import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { TradexAIPanel } from './TradexAIPanel'

interface MainLayoutProps {
  children: React.ReactNode
  title?: string
}

export function MainLayout({ children, title }: MainLayoutProps) {
  const { isSidebarCollapsed, isAIPanelOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header title={title} />
      
      <main
        className={cn(
          'pt-16 transition-all duration-300',
          isSidebarCollapsed ? 'pl-16' : 'pl-60',
          isAIPanelOpen && 'pr-96'
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>

      <TradexAIPanel />
    </div>
  )
}
