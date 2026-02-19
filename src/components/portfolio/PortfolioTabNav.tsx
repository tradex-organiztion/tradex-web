'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Assets', href: '/portfolio/assets' },
  { label: 'Perpetuals & Futures', href: '/portfolio/pnl' },
]

export function PortfolioTabNav() {
  const pathname = usePathname()

  return (
    <div className="flex border-b border-line-normal">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-3 text-body-1-medium transition-colors border-b-2 -mb-px",
              isActive
                ? "border-label-normal text-label-normal"
                : "border-transparent text-label-assistive hover:text-label-neutral"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
