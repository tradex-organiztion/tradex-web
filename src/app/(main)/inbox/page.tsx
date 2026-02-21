"use client"

import { useState, useEffect } from "react"
import { Bell, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/common"
import { Button } from "@/components/ui"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { homeApi, NotificationResponse, NotificationType } from "@/lib/api"

/**
 * 수신함(Inbox) 페이지 - 분할 패널 레이아웃
 *
 * 좌측: 알림 목록
 * 우측: 선택된 알림 상세
 */

// 알림 타입별 라벨 및 색상
const notificationTypeConfig: Record<NotificationType, { label: string; bgColor: string; textColor: string }> = {
  POSITION_ENTRY: { label: "포지션 진입", bgColor: "bg-element-positive-lighter", textColor: "text-element-positive-default" },
  POSITION_EXIT: { label: "포지션 종료", bgColor: "bg-gray-100", textColor: "text-label-normal" },
  RISK_WARNING: { label: "리스크 경고", bgColor: "bg-element-danger-lighter", textColor: "text-element-danger-default" },
}

export default function InboxPage() {
  const [filter] = useState<"all" | "unread">("all")
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<NotificationResponse | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selectedNotification = notifications.find((n) => n.id === selectedId) || null

  // 알림 목록 불러오기
  const fetchNotifications = async () => {
    setIsLoading(true)
    setError(null)

    const data = await (filter === "all"
      ? homeApi.getNotifications()
      : homeApi.getUnreadNotifications()
    ).catch((err) => {
      console.warn("Notifications API unavailable:", err.message)
      return null
    })

    if (data) {
      setNotifications(data)
      // 첫 번째 알림 자동 선택
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id)
      }
    } else {
      setNotifications([])
      setError("API 서버에 연결할 수 없습니다.")
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  // 읽음 처리
  const handleMarkAsRead = async (id: number) => {
    await homeApi.markAsRead(id).catch((err) => {
      console.warn("Failed to mark as read:", err.message)
      return null
    })
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  // 알림 선택 시 자동 읽음 처리
  const handleSelectNotification = (notification: NotificationResponse) => {
    setSelectedId(notification.id)
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }
  }

  // 알림 삭제 확인 모달 열기
  const handleDeleteClick = (notification: NotificationResponse) => {
    setDeleteTarget(notification)
  }

  // 알림 삭제 실행
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    const result = await homeApi.deleteNotification(deleteTarget.id).catch((err) => {
      console.warn("Failed to delete notification:", err.message)
      return null
    })
    if (result !== null) {
      setNotifications((prev) => prev.filter((n) => n.id !== deleteTarget.id))
      if (selectedId === deleteTarget.id) {
        setSelectedId(null)
      }
    }
    setDeleteTarget(null)
  }

  // 날짜 포맷팅 (Figma: 절대 날짜 "2025. 11. 27. 11:39")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const y = date.getFullYear()
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const d = date.getDate().toString().padStart(2, '0')
    const h = date.getHours().toString().padStart(2, '0')
    const min = date.getMinutes().toString().padStart(2, '0')
    return `${y}. ${m}. ${d}. ${h}:${min}`
  }

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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="수신함"
      />

      {/* Split Panel Layout */}
      <div className="bg-white rounded-xl border-[0.6px] border-gray-300 overflow-hidden flex min-h-[600px]">
        {/* Left: Notification List */}
        <div className="w-full shrink-0 border-r border-line-normal flex flex-col md:w-[380px]">
          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-body-2-regular text-label-assistive">불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-body-2-regular text-element-danger-default">{error}</p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={fetchNotifications}>
                  다시 시도
                </Button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-body-2-regular text-label-assistive">
                  {filter === "unread" ? "읽지 않은 알림이 없습니다." : "알림이 없습니다."}
                </p>
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => {
                  const typeConfig = notificationTypeConfig[notification.type]
                  const isSelected = selectedId === notification.id
                  return (
                    <li key={notification.id}>
                      <button
                        onClick={() => handleSelectNotification(notification)}
                        className={cn(
                          "w-full text-left px-4 py-3 border-b border-line-normal transition-colors",
                          isSelected ? "bg-gray-50" : "hover:bg-gray-50/50",
                          !notification.read && "bg-blue-50/30"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={cn(
                            "text-caption-medium px-1.5 py-0.5 rounded",
                            typeConfig.bgColor, typeConfig.textColor
                          )}>
                            {typeConfig.label}
                          </span>
                          <span className="flex-1" />
                          {!notification.read && (
                            <span className="w-1.5 h-1.5 bg-gray-800 rounded-full flex-shrink-0" />
                          )}
                          <span className="text-caption-regular text-label-assistive">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        <p className={cn(
                          "text-body-2-medium text-label-normal",
                          !notification.read && "font-bold"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-caption-regular text-label-neutral mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div className="flex-1 flex flex-col">
          {selectedNotification ? (
            <div className="flex-1 flex flex-col">
              {/* Detail Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-line-normal">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-caption-medium px-2 py-0.5 rounded",
                    notificationTypeConfig[selectedNotification.type].bgColor,
                    notificationTypeConfig[selectedNotification.type].textColor
                  )}>
                    {notificationTypeConfig[selectedNotification.type].label}
                  </span>
                  <span className="text-caption-regular text-label-assistive">
                    {formatFullDate(selectedNotification.createdAt)}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteClick(selectedNotification)}
                  className="p-1.5 hover:bg-gray-50 rounded transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-label-assistive" />
                </button>
              </div>

              {/* Detail Content */}
              <div className="flex-1 px-6 py-6">
                <h2 className="text-title-2-bold text-label-normal mb-3">
                  {selectedNotification.title}
                </h2>
                <p className="text-body-1-regular text-label-neutral leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Figma에 하단 액션바 없음 */}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-body-1-regular text-label-assistive">
                  알림을 선택하세요
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

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
