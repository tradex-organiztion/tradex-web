'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

function IconAssets({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 4V12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M5 8H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function IconFutures({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12.6667L6.66667 8L9.33333 10.6667L14 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 4H14V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const tabs = [
  { label: '보유 자산', href: '/portfolio/assets', icon: IconAssets },
  { label: '선물 거래', href: '/portfolio/pnl', icon: IconFutures },
]

export function PortfolioTabNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 rounded-full p-[2px]">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-body-1-medium transition-colors",
              isActive
                ? "bg-gray-200 text-label-normal"
                : "text-label-assistive hover:text-label-neutral"
            )}
          >
            <Icon className="size-4" />
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
