"use client"

import { useState, useEffect } from "react"
import { Bell, Trash2, Check } from "lucide-react"
import { PageHeader } from "@/components/common"
import { Button } from "@/components/ui"
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
  POSITION_ENTRY: { label: "진입", bgColor: "bg-info-100", textColor: "text-info-500" },
  POSITION_EXIT: { label: "청산", bgColor: "bg-success-100", textColor: "text-success-500" },
  RISK_WARNING: { label: "위험", bgColor: "bg-error-100", textColor: "text-error-500" },
}

export default function InboxPage() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  // 알림 삭제
  const handleDelete = async (id: number) => {
    const result = await homeApi.deleteNotification(id).catch((err) => {
      console.warn("Failed to delete notification:", err.message)
      return null
    })
    if (result !== null) {
      // 성공 시에만 목록에서 제거
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }
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
            <p className="text-body-1-regular text-error-500">{error}</p>
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
                    "p-4 hover:bg-gray-50 transition-colors",
                    !notification.read && "bg-info-100/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon / Badge */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                        typeConfig.bgColor
                      )}
                    >
                      <Bell className={cn("w-4 h-4", typeConfig.textColor)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "text-caption-medium px-2 py-0.5 rounded",
                            typeConfig.bgColor,
                            typeConfig.textColor
                          )}
                        >
                          {typeConfig.label}
                        </span>
                        <span className="text-caption-regular text-label-assistive">
                          {formatDate(notification.createdAt)}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-info-500 rounded-full" />
                        )}
                      </div>
                      <h3
                        className={cn(
                          "text-body-1-medium text-label-normal truncate",
                          !notification.read && "font-bold"
                        )}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-body-2-regular text-label-neutral mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-label-assistive hover:text-info-500 hover:bg-info-100 rounded-lg transition-colors"
                          title="읽음 처리"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-label-assistive hover:text-error-500 hover:bg-error-100 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
