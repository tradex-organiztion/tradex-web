"use client"

import { useState, useEffect } from "react"
import { Bell, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/common"
import { Button } from "@/components/ui"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { notificationApi, NotificationResponse, NotificationType } from "@/lib/api"
import { useAuthStore } from "@/stores"

/**
 * 수신함(Inbox) 페이지 - Figma 기준: 전체 너비 리스트 레이아웃
 *
 * Figma 노드: 4001:27495
 * - 타이틀: "수신함" + 카운트 뱃지
 * - 전체 너비 리스트, 각 아이템에 뱃지/날짜/제목/설명/액션버튼/더보기
 * - 아이템 클릭 시 사이드패널 오버레이 (4001:27592)
 */

// 알림 타입별 라벨 및 색상 (Swagger: POSITION_ENTRY, POSITION_EXIT, RISK_WARNING)
const notificationTypeConfig: Record<NotificationType, { label: string; bgColor: string; textColor: string }> = {
  POSITION_ENTRY: { label: "포지션 진입", bgColor: "bg-element-positive-lighter", textColor: "text-element-positive-default" },
  POSITION_EXIT: { label: "포지션 종료", bgColor: "bg-gray-100", textColor: "text-label-normal" },
  RISK_WARNING: { label: "리스크 경고", bgColor: "bg-element-danger-lighter", textColor: "text-element-danger-default" },
}

// 알림 타입별 액션 버튼
const notificationActionConfig: Record<NotificationType, { label: string; href?: string } | null> = {
  POSITION_ENTRY: { label: "매매일지 작성" },
  POSITION_EXIT: { label: "매매일지 작성" },
  RISK_WARNING: null,
}

// 데모 모드용 샘플 알림 데이터
const _demoDate = (daysAgo: number, h: number, m: number) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

const demoNotifications: NotificationResponse[] = [
  { id: 1, type: "POSITION_ENTRY", title: "BTC/USDT 롱 포지션 진입", message: "바이낸스에서 BTC/USDT 롱 포지션이 $97,250에 진입되었습니다. 목표가: $99,500, 손절가: $96,000", read: false, createdAt: _demoDate(0, 14, 30) },
  { id: 2, type: "RISK_WARNING", title: "연속 손실 경고", message: "오늘 3회 연속 손실이 발생했습니다. 매매 원칙에 따라 금일 추가 거래를 중단하는 것을 권장합니다.", read: false, createdAt: _demoDate(0, 11, 15) },
  { id: 3, type: "POSITION_EXIT", title: "ETH/USDT 숏 포지션 종료", message: "바이낸스에서 ETH/USDT 숏 포지션이 $2,680에 종료되었습니다. 수익: +$340 (+2.1%)", read: true, createdAt: _demoDate(1, 16, 45) },
  { id: 4, type: "POSITION_ENTRY", title: "SOL/USDT 롱 포지션 진입", message: "비트겟에서 SOL/USDT 롱 포지션이 $185에 진입되었습니다.", read: true, createdAt: _demoDate(2, 9, 30) },
  { id: 5, type: "RISK_WARNING", title: "레버리지 과다 경고", message: "현재 평균 레버리지가 15x로 높은 수준입니다. 리스크 관리를 위해 레버리지를 줄이는 것을 권장합니다.", read: true, createdAt: _demoDate(3, 10, 0) },
  { id: 6, type: "POSITION_EXIT", title: "BTC/USDT 롱 포지션 종료", message: "바이비트에서 BTC/USDT 롱 포지션이 $98,100에 종료되었습니다. 수익: +$850 (+1.2%)", read: false, createdAt: _demoDate(0, 10, 0) },
  { id: 7, type: "POSITION_ENTRY", title: "ETH/USDT 숏 포지션 진입", message: "바이낸스에서 ETH/USDT 숏 포지션이 $2,750에 진입되었습니다.", read: true, createdAt: _demoDate(1, 8, 30) },
]

export default function InboxPage() {
  const isDemoMode = useAuthStore((s) => s.isDemoMode)
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<NotificationResponse | null>(null)
  const [selectedNotification, setSelectedNotification] = useState<NotificationResponse | null>(null)

  // 알림 목록 불러오기
  const fetchNotifications = async () => {
    setIsLoading(true)
    setError(null)

    if (isDemoMode) {
      setNotifications(demoNotifications)
      setIsLoading(false)
      return
    }

    const data = await notificationApi.getAll().catch((err) => {
      console.warn("Notifications API unavailable:", err.message)
      return null
    })

    if (data) {
      setNotifications(data)
    } else {
      setNotifications([])
      setError("API 서버에 연결할 수 없습니다.")
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  // 읽음 처리
  const handleMarkAsRead = async (id: number) => {
    await notificationApi.markAsRead(id).catch((err) => {
      console.warn("Failed to mark as read:", err.message)
      return null
    })
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  // 알림 클릭 → 사이드패널 오픈
  const handleNotificationClick = (notification: NotificationResponse) => {
    setSelectedNotification(notification)
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }
  }

  // 사이드패널 닫기
  const handleCloseSidePanel = () => {
    setSelectedNotification(null)
  }

  // 알림 삭제 확인 모달 열기
  const handleDeleteClick = (e: React.MouseEvent, notification: NotificationResponse) => {
    e.stopPropagation()
    setDeleteTarget(notification)
  }

  // 알림 삭제 실행
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    const result = await notificationApi.delete(deleteTarget.id).catch((err) => {
      console.warn("Failed to delete notification:", err.message)
      return null
    })
    if (result !== null) {
      setNotifications((prev) => prev.filter((n) => n.id !== deleteTarget.id))
      if (selectedNotification?.id === deleteTarget.id) {
        setSelectedNotification(null)
      }
    }
    setDeleteTarget(null)
  }

  // 날짜 포맷: "2026.01.30 오후 01:45"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const y = date.getFullYear()
    const m = (date.getMonth() + 1).toString().padStart(2, "0")
    const d = date.getDate().toString().padStart(2, "0")
    const hours = date.getHours()
    const ampm = hours >= 12 ? "오후" : "오전"
    const h12 = (hours % 12 || 12).toString().padStart(2, "0")
    const min = date.getMinutes().toString().padStart(2, "0")
    return `${y}.${m}.${d} ${ampm} ${h12}:${min}`
  }

  // 상세 패널 날짜 포맷
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-col gap-6 relative">
      {/* 타이틀: "수신함" + 카운트 뱃지 */}
      <div className="flex items-center gap-2">
        <h1 className="text-title-1-bold text-label-normal">수신함</h1>
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[26px] h-5 px-2 rounded-full bg-gray-900 text-body-2-medium text-white">
            {unreadCount}
          </span>
        )}
      </div>

      {/* 알림 리스트 - 전체 너비 */}
      <div>
        {isLoading ? (
          <div className="py-16 text-center">
            <p className="text-body-2-regular text-label-assistive">불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-body-2-regular text-element-danger-default">{error}</p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={fetchNotifications}>
              다시 시도
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-body-2-regular text-label-assistive">알림이 없습니다.</p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => {
              const typeConfig = notificationTypeConfig[notification.type]
              const actionConfig = notificationActionConfig[notification.type]
              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full text-left border-b border-line-normal py-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex flex-col gap-3">
                    {/* Row 1: 뱃지 + 날짜/더보기 */}
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-caption-medium px-2 py-0.5 rounded",
                          typeConfig.bgColor,
                          typeConfig.textColor
                        )}
                      >
                        {typeConfig.label}
                      </span>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                        )}
                        <span className="text-caption-regular text-label-assistive">
                          {formatDate(notification.createdAt)}
                        </span>
                        <button
                          onClick={(e) => handleDeleteClick(e, notification)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-label-assistive" />
                        </button>
                      </div>
                    </div>

                    {/* Row 2: 제목 + 설명 + 액션 버튼 */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 flex flex-col gap-0.5">
                        <p className="text-body-2-medium text-label-normal">
                          {notification.title}
                        </p>
                        <p className="text-body-2-regular text-label-neutral">
                          {notification.message}
                        </p>
                      </div>
                      {actionConfig && (
                        <span className="flex-shrink-0 text-body-2-medium text-label-normal px-2 py-1 border border-line-normal rounded">
                          {actionConfig.label}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 사이드패널 오버레이 (Figma: 4001:27592) */}
      {selectedNotification && (
        <>
          {/* 백드롭 */}
          <div
            className="fixed inset-0 z-40"
            onClick={handleCloseSidePanel}
          />
          {/* 사이드패널 */}
          <div className="fixed top-0 right-0 h-full w-[400px] bg-white border-l border-line-normal shadow-emphasize z-50 flex flex-col">
            {/* 패널 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line-normal">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-caption-medium px-2 py-0.5 rounded",
                    notificationTypeConfig[selectedNotification.type].bgColor,
                    notificationTypeConfig[selectedNotification.type].textColor
                  )}
                >
                  {notificationTypeConfig[selectedNotification.type].label}
                </span>
                <span className="text-caption-regular text-label-assistive">
                  {formatFullDate(selectedNotification.createdAt)}
                </span>
              </div>
              <button
                onClick={(e) => handleDeleteClick(e, selectedNotification)}
                className="p-1.5 hover:bg-gray-50 rounded transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-label-assistive" />
              </button>
            </div>

            {/* 패널 본문 */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
              <p className="text-body-1-regular text-label-neutral leading-relaxed">
                {selectedNotification.message}
              </p>
            </div>
          </div>
        </>
      )}

      {/* 삭제 확인 모달 */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent showCloseButton={false} className="w-[327px] p-4 pt-6 rounded-xl shadow-emphasize">
          <DialogHeader className="items-center">
            <DialogTitle className="text-title-2-bold text-label-normal text-center">
              삭제 하시겠습니까?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 mt-2">
            <Button
              variant="secondary"
              className="flex-1 h-12 border-line-normal rounded-lg"
              onClick={() => setDeleteTarget(null)}
            >
              취소
            </Button>
            <Button
              className="flex-1 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
              onClick={handleDeleteConfirm}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
