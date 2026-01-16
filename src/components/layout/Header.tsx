'use client'

import { Bell, MessageSquare, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore, useUIStore } from '@/stores'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title?: string
  icon?: React.ReactNode
}

export function Header({ title, icon }: HeaderProps) {
  const { user, logout } = useAuthStore()
  const { toggleAIPanel, isSidebarCollapsed } = useUIStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 transition-all duration-300',
        isSidebarCollapsed ? 'left-16' : 'left-60'
      )}
    >
      {/* Left: Title & Search */}
      <div className="flex items-center gap-6">
        {(title || icon) && (
          <div className="flex items-center gap-2">
            {icon && <span className="text-navy-900">{icon}</span>}
            {title && <h1 className="text-xl font-semibold text-navy-900">{title}</h1>}
          </div>
        )}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="검색..."
            className="w-64 pl-10"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* AI Chat Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleAIPanel}
          className="gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Tradex AI</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-500 text-[10px] font-medium text-white">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImage} alt={user?.username} />
                <AvatarFallback className="bg-navy-900 text-white">
                  {user?.username?.charAt(0) || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user?.username || '사용자'}</span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/settings/account">계정 설정</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/settings/subscription">구독 관리</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-error-500">
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
