'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { SettingsTabNav } from '@/components/settings'

function ToggleSwitch({ enabled, onChange, label }: { enabled: boolean; onChange: () => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative w-10 h-6 rounded-full transition-colors flex-shrink-0 p-0.5",
        enabled ? "bg-gray-800" : "bg-gray-300"
      )}
    >
      <span
        className={cn(
          "block w-5 h-5 bg-white rounded-full transition-transform",
          enabled && "translate-x-4"
        )}
      />
    </button>
  )
}

interface ToggleItem {
  id: string
  label: string
  enabled: boolean
}

export default function NotificationSettingsPage() {
  const [pushEnabled, setPushEnabled] = useState(true)
  const [notifications, setNotifications] = useState<ToggleItem[]>([
    { id: 'entry', label: '포지선 진입 알림', enabled: true },
    { id: 'exit', label: '포지선 종료 알림', enabled: true },
    { id: 'risk', label: '리스크 경고', enabled: true },
    { id: 'journal', label: '매매 일지 작성 리마인더', enabled: true },
    { id: 'chart', label: '차트 알림', enabled: true },
  ])

  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-title-1-bold text-label-normal">설정</h1>
        <p className="text-body-2-regular text-label-assistive mt-1">
          서비스 이용 환경을 설정하세요.
        </p>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-xl border border-line-normal shadow-emphasize overflow-hidden">
        <SettingsTabNav />

        {/* Content */}
        <div className="p-8 space-y-10">
          {/* 푸시 알림 */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-body-1-medium text-label-normal">푸시 알림</h2>
              <p className="text-body-2-regular text-label-neutral">
                모바일 및 데스크톱 푸시 알림을 설정하세요.
              </p>
            </div>
            <div className="border border-line-normal rounded-lg overflow-hidden">
              <div className="flex items-center px-4 py-3 gap-2">
                <span className="flex-1 py-0.5 text-body-1-regular text-label-normal">포지선 진입 알림</span>
                <ToggleSwitch enabled={pushEnabled} onChange={() => setPushEnabled(!pushEnabled)} label="포지션 진입 알림" />
              </div>
            </div>
          </div>

          {/* 알림 설정 */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-body-1-medium text-label-normal">알림 설정</h2>
              <p className="text-body-2-regular text-label-neutral">
                받고 싶은 알림 유형을 선택하세요.
              </p>
            </div>
            <div className="border border-line-normal rounded-lg overflow-hidden">
              {notifications.map((item, i) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center px-4 py-3 gap-2",
                    i < notifications.length - 1 && "border-b border-line-normal"
                  )}
                >
                  <span className="flex-1 py-0.5 text-body-1-regular text-label-normal">{item.label}</span>
                  <ToggleSwitch
                    enabled={item.enabled}
                    onChange={() => toggleNotification(item.id)}
                    label={item.label}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
