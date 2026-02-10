"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { PageHeader } from "@/components/common"
import { Button } from "@/components/ui"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { homeApi, NotificationResponse, NotificationType } from "@/lib/api"

/**
 * 수신함(Inbox) 페이지
 *
 * API:
 * - GET /api/home/notifications - 전체 알림 목록
 * - GET /api/home/notifications/unread - 읽지 않은 알림만
 * - PATCH /api/home/notifications/:id/read - 읽음 처리
 * - DELETE /api/home/notifications/:id - 알림 삭제
 */

type FilterType = "all" | "unread"

// 알림 타입별 라벨 및 색상
const notificationTypeConfig: Record<NotificationType, { label: string; bgColor: string; textColor: string }> = {
  POSITION_ENTRY: { label: "포지션 진입", bgColor: "bg-element-positive-lighter", textColor: "text-element-positive-default" },
  POSITION_EXIT: { label: "포지션 종료", bgColor: "bg-gray-100", textColor: "text-gray-800" },
  RISK_WARNING: { label: "리스크 경고", bgColor: "bg-element-danger-lighter", textColor: "text-element-danger-default" },
}

export default function InboxPage() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<NotificationResponse | null>(null)

  // 알림 목록 불러오기
  const fetchNotifications = async () => {
    setIsLoading(true)
    setError(null)

    // API 호출 - 실패 시 빈 배열 반환
    const data = await (filter === "all"
      ? homeApi.getNotifications()
      : homeApi.getUnreadNotifications()
    ).catch((err) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  // 읽음 처리
  const handleMarkAsRead = async (id: number) => {
    await homeApi.markAsRead(id).catch((err) => {
      console.warn("Failed to mark as read:", err.message)
      return null
    })
    // 목록에서 읽음 상태로 업데이트
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
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
    }
    setDeleteTarget(null)
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "방금 전"
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="수신함"
        description={`총 ${notifications.length}개의 알림${unreadCount > 0 ? ` (읽지 않음 ${unreadCount}개)` : ""}`}
      />

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          전체
        </Button>
        <Button
          variant={filter === "unread" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setFilter("unread")}
        >
          읽지 않음
        </Button>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-[12px] shadow-normal overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-body-1-regular text-label-assistive">
              알림을 불러오는 중...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-body-1-regular text-element-danger-default">{error}</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={fetchNotifications}
            >
              다시 시도
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-body-1-regular text-label-assistive">
              {filter === "unread" ? "읽지 않은 알림이 없습니다." : "알림이 없습니다."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line-normal">
            {notifications.map((notification) => {
              const typeConfig = notificationTypeConfig[notification.type]
              return (
                <li
                  key={notification.id}
                  className={cn(
                    "px-5 py-4 hover:bg-gray-50 transition-colors"
                  )}
                >
                  <div className="space-y-3">
                    {/* Badge + Timestamp Row */}
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
                          <span className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
                        )}
                        <span className="text-caption-regular text-label-assistive">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-0.5">
                      <h3
                        className={cn(
                          "text-body-2-medium text-label-normal",
                          !notification.read && "font-bold"
                        )}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-body-2-regular text-label-neutral">
                        {notification.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="flex-1 py-1 px-2 border border-line-normal rounded text-body-2-medium text-label-normal hover:bg-gray-50 transition-colors text-center"
                        >
                          읽음 처리
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(notification)}
                        className="flex-1 py-1 px-2 border border-line-normal rounded text-body-2-medium text-label-normal hover:bg-gray-50 transition-colors text-center"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
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
