import { get, patch, del } from './client'
import { apiClient } from './client'
import type { PageResponse } from './futures'
import type { OrderResponse } from './futures'
import type { MarketCondition } from './futures'

// ============================================================
// Journal API (Swagger 기준)
// ============================================================

/** 매매일지 응답 - Swagger JournalResponse */
export interface JournalResponse {
  journalId: number
  positionId: number
  /** 계획 익절가 */
  plannedTargetPrice?: number
  /** 계획 손절가 */
  plannedStopLoss?: number
  /** 진입 시나리오 */
  entryScenario?: string
  /** 청산 복기 */
  exitReview?: string
  /** 지표 목록 */
  indicators?: string[]
  /** 타임프레임 목록 */
  timeframes?: string[]
  /** 기술적 분석 목록 */
  technicalAnalyses?: string[]
  /** 거래소명 */
  exchangeName?: 'BYBIT' | 'BINANCE' | 'BITGET'
  /** 심볼 */
  symbol: string
  /** 포지션 방향 */
  side: 'LONG' | 'SHORT'
  /** 시장 상태 */
  marketCondition?: MarketCondition
  /** 레버리지 */
  leverage: number
  /** 포지션 상태 */
  positionStatus: 'OPEN' | 'CLOSED'
  /** 진입 시각 */
  entryTime: string
  /** 청산 시각 */
  exitTime?: string
  /** 평균 진입가 */
  avgEntryPrice: number
  /** 평균 청산가 */
  avgExitPrice?: number
  /** 실현 손익 */
  realizedPnl?: number
  /** 진입 수수료 */
  openFee?: number
  /** 청산 수수료 */
  closedFee?: number
  /** 목표가 */
  targetPrice?: number
  /** 손절가 */
  stopLossPrice?: number
  /** 수익률 */
  roi?: number
  /** 오더 목록 */
  orders?: OrderResponse[]
  /** 생성일 */
  createdAt: string
}

/** 매매일지 수정 요청 - Swagger JournalRequest */
export interface UpdateJournalRequest {
  plannedTargetPrice?: number
  plannedStopLoss?: number
  entryScenario?: string
  exitReview?: string
  indicators?: string[]
  timeframes?: string[]
  technicalAnalyses?: string[]
  marketCondition?: MarketCondition
}

/** 매매일지 목록 조회 필터 - Swagger 쿼리 파라미터 */
export interface JournalFilters {
  symbol?: string
  side?: 'LONG' | 'SHORT'
  positionStatus?: 'OPEN' | 'CLOSED'
  startDate?: string              // yyyy-MM-dd
  endDate?: string                // yyyy-MM-dd
  page?: number
  size?: number
  sort?: string[]
}

// ============================================================
// Journal Stats API
// ============================================================

export type TradingStyle = 'SCALPING' | 'SWING'

export interface JournalStatsParams {
  indicators?: string[]
  timeframes?: string[]
  technicalAnalyses?: string[]
  tradingStyle?: TradingStyle
  positionSide?: 'LONG' | 'SHORT'
  marketCondition?: MarketCondition
}

export interface JournalStatsResponse {
  totalTrades: number
  winCount: number
  lossCount: number
  winRate: number
  avgPnl: number
  avgRoi: number
}

export interface JournalStatsOptionsResponse {
  indicators: string[]
  timeframes: string[]
  technicalAnalyses: string[]
}

export const journalStatsApi = {
  /** 매매일지 통계 조회 (필터별) */
  getStats: (params?: JournalStatsParams) =>
    get<JournalStatsResponse>('/api/journals/stats', { params }),

  /** 통계 필터에 사용 가능한 옵션 값 목록 */
  getStatsOptions: () =>
    get<JournalStatsOptionsResponse>('/api/journals/stats/options'),
}

export const journalApi = {
  /** 매매일지 목록 조회 (페이지네이션) */
  getAll: (filters?: JournalFilters) =>
    get<PageResponse<JournalResponse>>('/api/journals', {
      params: {
        ...filters,
        sort: filters?.sort?.join(','),
      },
    }),

  /** 매매일지 상세 조회 (오더 포함) */
  getById: (id: number) =>
    get<JournalResponse>(`/api/journals/${id}`),

  /** 매매일지 수정 (시나리오, 복기, 지표 등) */
  update: (id: number, data: UpdateJournalRequest) =>
    patch<JournalResponse>(`/api/journals/${id}`, data),

  /** 매매일지 삭제 */
  delete: (id: number) =>
    del<void>(`/api/journals/${id}`),

  /** 스크린샷 업로드 (multipart/form-data) */
  uploadScreenshot: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<string>('/api/journals/screenshot', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}
