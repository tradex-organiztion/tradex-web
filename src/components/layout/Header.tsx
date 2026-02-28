'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useUIStore, useAuthStore } from '@/stores'
import { homeApi } from '@/lib/api/home'

// 수신함 아이콘
function IconInbox({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 8H10.6667L9.33333 10H6.66667L5.33333 8H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.63333 3.40667L2 8V12C2 12.3536 2.14048 12.6928 2.39052 12.9428C2.64057 13.1929 2.97971 13.3333 3.33333 13.3333H12.6667C13.0203 13.3333 13.3594 13.1929 13.6095 12.9428C13.8595 12.6928 14 12.3536 14 12V8L12.3667 3.40667C12.2728 3.13909 12.0968 2.90671 11.8636 2.74351C11.6304 2.58031 11.3519 2.49429 11.0667 2.5H4.93333C4.64808 2.49429 4.36961 2.58031 4.1364 2.74351C3.9032 2.90671 3.72722 3.13909 3.63333 3.40667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 깃발/알림 아이콘
function IconFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.66667 10C2.66667 10 3.33333 9.33333 5.33333 9.33333C7.33333 9.33333 8.66667 10.6667 10.6667 10.6667C12.6667 10.6667 13.3333 10 13.3333 10V2C13.3333 2 12.6667 2.66667 10.6667 2.66667C8.66667 2.66667 7.33333 1.33333 5.33333 1.33333C3.33333 1.33333 2.66667 2 2.66667 2V10Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.66667 14.6667V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// AI 아이콘
function IconAI({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1.33333V3.33333M8 12.6667V14.6667M3.33333 8H1.33333M14.6667 8H12.6667M12.2427 12.2427L10.8284 10.8284M12.2427 3.75736L10.8284 5.17157M3.75736 12.2427L5.17157 10.8284M3.75736 3.75736L5.17157 5.17157" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}

export function Header() {
  const { isAIPanelOpen, isMobile, setSidebarCollapsed, toggleAIPanel } = useUIStore()
  const { isDemoMode } = useAuthStore()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnread = () => {
      if (isDemoMode) {
        setUnreadCount(3)
        return
      }

      homeApi.getUnreadCount().then((count) => {
        setUnreadCount(count)
      }).catch((err) => {
        console.warn('Unread count fetch error:', err.message)
      })
    }

    fetchUnread()
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [isDemoMode])

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-30 flex items-center justify-end gap-2 border-b border-gray-300/60 bg-white px-9 transition-all duration-300',
        isMobile ? 'left-0' : 'left-[200px]',
        isAIPanelOpen && !isMobile && 'right-96'
      )}
      style={{ height: '48px' }}
    >
      {/* Mobile hamburger menu */}
      {isMobile && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="mr-auto flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
        >
          <svg className="size-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {/* Right-aligned header buttons */}
      <button
        onClick={() => {
          window.location.href = '/inbox'
        }}
        className="relative flex h-7 items-center gap-0.5 rounded border border-gray-300 bg-white px-2 text-body-2-medium text-gray-900 transition-colors hover:bg-gray-50"
      >
        <IconInbox className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-400 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <button
        className="flex h-7 items-center gap-0.5 rounded border border-gray-300 bg-white px-2 text-body-2-medium text-gray-900 transition-colors hover:bg-gray-50"
      >
        <IconFlag className="size-4" />
      </button>

      <button
        onClick={toggleAIPanel}
        className="flex h-7 items-center gap-0.5 rounded border border-gray-300 bg-white px-2 text-body-2-medium text-gray-900 transition-colors hover:bg-gray-50"
      >
        <IconAI className="size-4" />
        <span>Tradex AI</span>
      </button>
    </header>
  )
}
