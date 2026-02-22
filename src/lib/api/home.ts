import { get, patch, del } from './client'

/**
 * Home API
 *
 * 홈 화면 요약 정보 및 알림 관련 API
 */

// ============================================================
// Types
// ============================================================

/** 일별 PnL 차트 데이터 */
export interface DailyPnlChartData {
  date: string
  cumulativePnl: number
}

/**
 * 홈 화면 요약 정보 응답
 * GET /api/home/summary
 */
export interface HomeSummaryResponse {
  /** 오늘 총 자산 */
  todayTotalAsset: number
  /** 어제 총 자산 */
  yesterdayTotalAsset: number
  /** 자산 변화율 (%) */
  assetChangeRate: number
  /** 이번 달 PnL */
  thisMonthPnl: number
  /** 지난 달 최종 PnL */
  lastMonthFinalPnl: number
  /** 달성률 (%) */
  achievementRate: number
  /** 총 승리 횟수 */
  totalWins: number
  /** 총 패배 횟수 */
  totalLosses: number
  /** 승률 (%) */
  winRate: number
  /** 7일간 PnL 차트 데이터 */
  pnlChart: DailyPnlChartData[]
}

/** 알림 타입 */
export type NotificationType = 'POSITION_ENTRY' | 'POSITION_EXIT' | 'RISK_WARNING' | 'CHART_ALERT' | 'TRADE_ALERT'

/**
 * 알림 응답
 */
export interface NotificationResponse {
  id: number
  type: NotificationType
  title: string
  message: string
  positionId?: number | null
  createdAt: string
  read: boolean
}

/** 읽지 않은 알림 개수 - API는 number(long) 직접 반환 */

// ============================================================
// Home API
// ============================================================

export const homeApi = {
  // ============================================================
  // 홈 화면 요약
  // ============================================================

  /**
   * 홈 화면에 표시할 사용자의 트레이딩 요약 정보를 조회합니다
   * - 자산 현황
   * - 월간 PnL
   * - 승률
   * - 7일간 PnL 차트
   */
  getSummary: () =>
    get<HomeSummaryResponse>('/api/home/summary'),

  // ============================================================
  // 알림
  // ============================================================

  /** 모든 알림 목록 조회 (최신순) */
  getNotifications: () =>
    get<NotificationResponse[]>('/api/home/notifications'),

  /** 읽지 않은 알림만 조회 */
  getUnreadNotifications: () =>
    get<NotificationResponse[]>('/api/home/notifications/unread'),

  /** 읽지 않은 알림 개수 조회 */
  getUnreadCount: () =>
    get<number>('/api/home/notifications/unread-count'),

  /** 특정 알림 읽음 처리 */
  markAsRead: (id: number) =>
    patch<NotificationResponse>(`/api/home/notifications/${id}/read`),

  /** 알림 삭제 */
  deleteNotification: (id: number) =>
    del<void>(`/api/home/notifications/${id}`),
}
