import { get, patch, del } from './client'

// ============================================================
// Types (Swagger NotificationResponse 기준)
// ============================================================

/** 알림 타입 */
export type NotificationType = 'POSITION_ENTRY' | 'POSITION_EXIT' | 'RISK_WARNING'

/** 알림 응답 */
export interface NotificationResponse {
  id: number
  type: NotificationType
  title: string
  message: string
  positionId?: number | null
  createdAt: string
  read: boolean
}

// ============================================================
// Notification API (Swagger: /api/notifications)
// ============================================================

export const notificationApi = {
  /** 전체 알림 목록 조회 (최신순) */
  getAll: () =>
    get<NotificationResponse[]>('/api/notifications'),

  /** 읽지 않은 알림만 조회 */
  getUnread: () =>
    get<NotificationResponse[]>('/api/notifications/unread'),

  /** 읽지 않은 알림 개수 */
  getUnreadCount: () =>
    get<Record<string, number>>('/api/notifications/unread/count'),

  /** 특정 알림 읽음 처리 */
  markAsRead: (id: number) =>
    patch<NotificationResponse>(`/api/notifications/${id}/read`),

  /** 전체 알림 읽음 처리 */
  markAllAsRead: () =>
    patch<void>('/api/notifications/read-all'),

  /** 알림 삭제 */
  delete: (id: number) =>
    del<void>(`/api/notifications/${id}`),
}
