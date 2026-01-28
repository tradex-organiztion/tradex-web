'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// 아이콘 컴포넌트들
function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6L8 1.33333L14 6V13.3333C14 13.687 13.8595 14.0261 13.6095 14.2761C13.3594 14.5262 13.0203 14.6667 12.6667 14.6667H3.33333C2.97971 14.6667 2.64057 14.5262 2.39052 14.2761C2.14048 14.0261 2 13.687 2 13.3333V6Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 14.6667V8H10V14.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconAI({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1.33333V3.33333M8 12.6667V14.6667M3.33333 8H1.33333M14.6667 8H12.6667M12.2427 12.2427L10.8284 10.8284M12.2427 3.75736L10.8284 5.17157M3.75736 12.2427L5.17157 10.8284M3.75736 3.75736L5.17157 5.17157" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}

function IconInbox({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 8H10.6667L9.33333 10H6.66667L5.33333 8H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.63333 3.40667L2 8V12C2 12.3536 2.14048 12.6928 2.39052 12.9428C2.64057 13.1929 2.97971 13.3333 3.33333 13.3333H12.6667C13.0203 13.3333 13.3594 13.1929 13.6095 12.9428C13.8595 12.6928 14 12.3536 14 12V8L12.3667 3.40667C12.2728 3.13909 12.0968 2.90671 11.8636 2.74351C11.6304 2.58031 11.3519 2.49429 11.0667 2.5H4.93333C4.64808 2.49429 4.36961 2.58031 4.1364 2.74351C3.9032 2.90671 3.72722 3.13909 3.63333 3.40667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12.6667L6.66667 8L9.33333 10.6667L14 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 4H14V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconJournal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.33333 1.33333H4C3.64638 1.33333 3.30724 1.47381 3.05719 1.72386C2.80714 1.97391 2.66667 2.31304 2.66667 2.66667V13.3333C2.66667 13.687 2.80714 14.0261 3.05719 14.2761C3.30724 14.5262 3.64638 14.6667 4 14.6667H12C12.3536 14.6667 12.6928 14.5262 12.9428 14.2761C13.1929 14.0261 13.3333 13.687 13.3333 13.3333V5.33333L9.33333 1.33333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.33333 1.33333V5.33333H13.3333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.33333 8.66667L7.33333 10.6667L10.6667 6.66667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconStrategy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}

function IconRisk({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.94 1.33333L14.14 10.6667C14.2325 10.8269 14.2814 11.0084 14.2821 11.1932C14.2828 11.378 14.2352 11.5598 14.1439 11.7208C14.0527 11.8817 13.9209 12.0162 13.7619 12.1106C13.6029 12.205 13.4221 12.2561 13.2373 12.2593H2.83733C2.65262 12.2561 2.47182 12.205 2.31282 12.1106C2.15381 12.0162 2.02198 11.8817 1.9308 11.7208C1.83961 11.5598 1.79194 11.378 1.79267 11.1932C1.79339 11.0084 1.84248 10.8269 1.935 10.6667L7.135 1.33333C7.22876 1.17715 7.36152 1.0481 7.52056 0.959058C7.67959 0.870016 7.85932 0.82373 8.042 0.82373C8.22468 0.82373 8.40441 0.870016 8.56344 0.959058C8.72248 1.0481 8.85524 1.17715 8.949 1.33333H8.94Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 5.33333V7.33333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="9.66667" r="0.5" fill="currentColor"/>
    </svg>
  )
}

function IconProfit({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 4V12M10 5.5H7C6.60218 5.5 6.22064 5.65804 5.93934 5.93934C5.65804 6.22064 5.5 6.60218 5.5 7C5.5 7.39782 5.65804 7.77936 5.93934 8.06066C6.22064 8.34196 6.60218 8.5 7 8.5H9C9.39782 8.5 9.77936 8.65804 10.0607 8.93934C10.342 9.22064 10.5 9.60218 10.5 10C10.5 10.3978 10.342 10.7794 10.0607 11.0607C9.77936 11.342 9.39782 11.5 9 11.5H5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconToggle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="9" y="3" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    items: [
      { label: '홈', href: '/home', icon: IconHome },
      { label: 'Tradex AI', href: '/ai', icon: IconAI },
      { label: '수신함', href: '/inbox', icon: IconInbox },
    ],
  },
  {
    title: 'Chart',
    items: [
      { label: '차트 분석', href: '/chart', icon: IconChart },
    ],
  },
  {
    title: 'Trading Log',
    items: [
      { label: '매매일지 관리', href: '/trading/journal', icon: IconJournal },
    ],
  },
  {
    title: 'Analysis',
    items: [
      { label: '전략 분석', href: '/analysis/strategy', icon: IconStrategy },
      { label: '리스크 패턴', href: '/analysis/risk', icon: IconRisk },
      { label: '수익 관리', href: '/portfolio/assets', icon: IconProfit },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isSidebarCollapsed, setSidebarCollapsed } = useUIStore()
  const { user, isDemoMode, logout } = useAuthStore()

  const handleLoginClick = () => {
    logout() // 데모 모드 해제 및 상태 초기화
    router.push('/login')
  }

  const isActive = (href: string) => {
    if (href === '/home') return pathname === '/home'
    if (href === '/ai') return pathname === '/ai' || pathname.startsWith('/ai/')
    return pathname.startsWith(href.split('/').slice(0, 3).join('/'))
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-300 bg-white shadow-normal transition-all duration-300',
          isSidebarCollapsed ? 'w-16' : 'w-[200px]'
        )}
      >
        {/* Header: Logo + Toggle */}
        <div className="flex h-10 items-center justify-between border-b border-gray-300 px-5">
          {!isSidebarCollapsed ? (
            <>
              <Link href="/home" className="flex items-center">
                <Image
                  src="/images/logo-black.svg"
                  alt="Tradex"
                  width={80}
                  height={13}
                  className="h-[13px] w-auto"
                />
              </Link>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="flex size-5 items-center justify-center rounded text-gray-500 hover:text-gray-800"
              >
                <IconToggle className="size-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="mx-auto flex size-5 items-center justify-center rounded text-gray-500 hover:text-gray-800"
            >
              <IconToggle className="size-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-5 py-8">
          <div className="flex flex-col gap-6">
            {navSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="flex flex-col gap-1">
                {/* Section Title */}
                {section.title && !isSidebarCollapsed && (
                  <div className="px-2 py-1">
                    <span className="text-caption-medium text-label-disabled">
                      {section.title}
                    </span>
                  </div>
                )}

                {/* Section Items */}
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)

                  const linkContent = (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-2 py-1 text-body-2-medium transition-colors',
                        active
                          ? 'bg-background-gray text-label-normal'
                          : 'text-label-assistive hover:bg-background-gray hover:text-label-normal'
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      {!isSidebarCollapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-400 px-1.5 text-caption-medium text-white">
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
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-400 px-1.5 text-caption-medium text-white">
                              {item.badge}
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    )
                  }

                  return <div key={item.href}>{linkContent}</div>
                })}
              </div>
            ))}
          </div>
        </nav>

        {/* Profile Section */}
        <div className="border-t border-gray-300 px-5 py-3">
          {isDemoMode ? (
            // 데모 모드일 때: 로그인 버튼 표시
            !isSidebarCollapsed ? (
              <button
                onClick={handleLoginClick}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-body-2-medium text-white transition-colors hover:bg-black-light"
              >
                로그인
              </button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLoginClick}
                    className="flex w-full justify-center"
                  >
                    <div className="flex size-7 items-center justify-center rounded-lg bg-black text-white">
                      <svg className="size-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2H12.6667C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6.66667 11.3333L10 8L6.66667 4.66667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 8H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  로그인
                </TooltipContent>
              </Tooltip>
            )
          ) : (
            // 로그인 상태일 때: 유저 프로필 표시
            !isSidebarCollapsed ? (
              <Link href="/settings/account" className="flex items-center gap-3">
                <div className="flex size-7 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                  {user?.profileImageUrl ? (
                    <Image
                      src={user.profileImageUrl}
                      alt={user.username || 'User'}
                      width={28}
                      height={28}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-caption-medium text-gray-500">
                      {user?.username?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <span className="text-body-2-bold text-label-normal">
                  {user?.username || 'User'}
                </span>
              </Link>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/settings/account" className="flex justify-center">
                    <div className="flex size-7 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                      {user?.profileImageUrl ? (
                        <Image
                          src={user.profileImageUrl}
                          alt={user.username || 'User'}
                          width={28}
                          height={28}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="text-caption-medium text-gray-500">
                          {user?.username?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {user?.username || 'User'}
                </TooltipContent>
              </Tooltip>
            )
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
