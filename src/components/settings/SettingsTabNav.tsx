'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const settingsTabs = [
  { label: '계정', href: '/settings/account' },
  { label: '기본', href: '/settings/preferences' },
  { label: '알림', href: '/settings/notifications' },
  { label: '구독', href: '/settings/subscription' },
]

export function SettingsTabNav() {
  const pathname = usePathname()

  return (
    <div className="flex border-b border-line-normal">
      {settingsTabs.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "w-[120px] h-14 flex items-center justify-center px-2 transition-colors",
              isActive
                ? "text-title-2-bold text-label-normal border-b-2 border-gray-800"
                : "text-title-2-regular text-label-disabled hover:text-label-neutral"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
