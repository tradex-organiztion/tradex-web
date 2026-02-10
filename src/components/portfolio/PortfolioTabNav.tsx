'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PieChart, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { label: '보유 자산', href: '/portfolio/assets', icon: PieChart },
  { label: '선물 거래', href: '/portfolio/pnl', icon: TrendingUp },
]

export function PortfolioTabNav() {
  const pathname = usePathname()

  return (
    <div className="flex p-0.5 rounded-full bg-gray-100 w-fit">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-full transition-colors",
              isActive
                ? "bg-gray-200 text-body-2-medium text-label-normal"
                : "text-body-2-regular text-label-disabled"
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
