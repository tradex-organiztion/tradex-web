'use client'

import { useState } from 'react'
import { ChevronsRight, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'chart' | 'risk' | 'position_close' | 'position_entry' | 'trade'
  title: string
  description: string
  timestamp: string
  isRead: boolean
  action?: {
    label: string
  }
}

const typeConfig: Record<Notification['type'], { label: string; bgColor: string; textColor: string }> = {
  chart: { label: '차트 알림', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  risk: { label: '리스크 경고', bgColor: 'bg-element-danger-lighter', textColor: 'text-element-danger-default' },
  position_close: { label: '포지션 종료', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  position_entry: { label: '포지션 진입', bgColor: 'bg-element-positive-lighter', textColor: 'text-element-positive-default' },
  trade: { label: '매매 알림', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'chart',
    title: 'BTC/USDT 볼린저밴드 하단 이탈',
    description: '설정하신 차트 트리거 알림이 발생했습니다.',
    timestamp: '2026.01.30 오후 01:45',
    isRead: false,
    action: { label: '차트 바로가기' },
  },
  {
    id: '2',
    type: 'risk',
    title: '일일 최대 손실 한도 80% 도달',
    description: '현재 일일 손실이 설정한 한도의 80%에 도달했습니다.',
    timestamp: '2026.01.30 오전 11:20',
    isRead: false,
  },
  {
    id: '3',
    type: 'position_close',
    title: 'ETH/USDT 포지션 종료',
    description: '숏 포지션이 목표가 도달로 자동 청산되었습니다.',
    timestamp: '2026.01.29 오후 03:15',
    isRead: false,
    action: { label: '매매일지 작성' },
  },
  {
    id: '4',
    type: 'position_entry',
    title: 'SOL/USDT 포지션 진입',
    description: '롱 포지션 진입이 완료되었습니다. 진입가: $185.20',
    timestamp: '2026.01.29 오전 09:00',
    isRead: false,
    action: { label: '매매일지 작성' },
  },
  {
    id: '5',
    type: 'trade',
    title: '주간 거래 리포트 발행',
    description: '이번 주 거래 성과 리포트가 준비되었습니다.',
    timestamp: '2026.01.28 오후 06:00',
    isRead: true,
    action: { label: '삭제' },
  },
]

interface InboxSidePanelProps {
  onClose?: () => void
}

export function InboxSidePanel({ onClose }: InboxSidePanelProps) {
  const [notifications] = useState<Notification[]>(sampleNotifications)
  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Bar */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-line-normal">
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
          <ChevronsRight className="w-5 h-5 text-label-neutral" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="pt-8">
          {/* Title */}
          <div className="flex items-center gap-2 px-5 mb-4">
            <h2 className="text-title-1-bold text-label-normal">수신함</h2>
            <span className="flex items-center justify-center min-w-[26px] h-5 px-2 rounded-full bg-gray-800 text-body-2-medium text-white">
              {unreadCount}
            </span>
          </div>

          {/* Notification List */}
          <div>
            {notifications.map((notification) => {
              const config = typeConfig[notification.type]
              return (
                <div key={notification.id} className="px-5 py-4 border-b border-line-normal space-y-4">
                  {/* Badge + Timestamp */}
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-caption-medium",
                      config.bgColor, config.textColor
                    )}>
                      {config.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                      )}
                      <span className="text-caption-regular text-label-assistive text-right">
                        {notification.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-body-2-medium text-label-normal">{notification.title}</p>
                      <p className="text-body-2-regular text-label-neutral">{notification.description}</p>
                    </div>
                    {!notification.isRead && (
                      <button className="p-1 flex-shrink-0 hover:bg-gray-50 rounded transition-colors">
                        <MoreVertical className="w-6 h-6 text-label-assistive" />
                      </button>
                    )}
                  </div>

                  {/* Action Button */}
                  {notification.action && (
                    <button className="w-full py-1 px-2 border border-line-normal rounded text-body-2-medium text-label-normal hover:bg-gray-50 transition-colors text-center">
                      {notification.action.label}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
