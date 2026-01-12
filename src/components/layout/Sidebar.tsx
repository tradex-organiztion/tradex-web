'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Inbox,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
}

const navItems: NavItem[] = [
  { label: '홈', href: '/home', icon: Home },
  { label: '수신함', href: '/inbox', icon: Inbox, badge: 3 },
  { label: '매매 관리', href: '/trading/principles', icon: FileText },
  { label: '차트 분석', href: '/chart', icon: LineChart },
  { label: '분석', href: '/analysis/strategy', icon: BarChart3 },
  { label: '수익 관리', href: '/portfolio/assets', icon: PieChart },
]

const bottomNavItems: NavItem[] = [
  { label: '설정', href: '/settings/account', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isSidebarCollapsed, setSidebarCollapsed } = useUIStore()

  const isActive = (href: string) => {
    if (href === '/home') return pathname === '/home'
    return pathname.startsWith(href.split('/').slice(0, 2).join('/'))
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300',
          isSidebarCollapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          {!isSidebarCollapsed && (
            <Link href="/home" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900">
                <span className="text-sm font-bold text-white">T</span>
              </div>
              <span className="text-lg font-semibold text-navy-900">Tradex</span>
            </Link>
          )}
          {isSidebarCollapsed && (
            <Link href="/home" className="mx-auto">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900">
                <span className="text-sm font-bold text-white">T</span>
              </div>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-navy-900 text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-navy-900'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isSidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error-500 px-1.5 text-xs font-medium text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )

            if (isSidebarCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error-500 px-1.5 text-xs font-medium text-white">
                        {item.badge}
                      </span>
                    )}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.href}>{linkContent}</div>
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 p-3">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-navy-900 text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-navy-900'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </Link>
            )

            if (isSidebarCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.href}>{linkContent}</div>
          })}

          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className={cn(
              'mt-2 w-full justify-center text-gray-500 hover:text-navy-900',
              isSidebarCollapsed && 'px-0'
            )}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">접기</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
