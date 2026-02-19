import { get, post, put, patch, del } from './client'
import type { TradingPrinciple } from '@/stores/useTradingStore'
import type { PageResponse } from './futures'

// Principles API (백엔드 미구현 — mock 유지)
export interface CreatePrincipleRequest {
  title: string
  description: string
  category: string
}

export interface UpdatePrincipleRequest {
  title?: string
  description?: string
  category?: string
  isActive?: boolean
}

export const principlesApi = {
  getAll: () =>
    get<TradingPrinciple[]>('/trading/principles'),

  getById: (id: string) =>
    get<TradingPrinciple>(`/trading/principles/${id}`),

  create: (data: CreatePrincipleRequest) =>
    post<TradingPrinciple>('/trading/principles', data),

  update: (id: string, data: UpdatePrincipleRequest) =>
    put<TradingPrinciple>(`/trading/principles/${id}`, data),

  delete: (id: string) =>
    del<void>(`/trading/principles/${id}`),

  // AI Recommendations
  getAIRecommendations: () =>
    get<TradingPrinciple[]>('/trading/principles/ai-recommendations'),
}

// ============================================================
// Journal API
// ============================================================

/** 매매일지 응답 */
export interface JournalResponse {
  id: number
  positionId: number
  symbol: string
  side: 'LONG' | 'SHORT'
  leverage: number
  entryPrice: number
  exitPrice?: number
  size: number
  pnl: number
  pnlPercent?: number
  status: 'OPEN' | 'CLOSED'
  entryTime: string
  exitTime?: string
  memo?: string
  review?: string
  preScenario?: string
  entryReason?: string
  indicators?: string[]
  timeframes?: string[]
  technicalAnalysis?: string[]
  targetTP?: string
  targetSL?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateJournalRequest {
  memo?: string
  review?: string
  preScenario?: string
  entryReason?: string
  indicators?: string[]
  timeframes?: string[]
  technicalAnalysis?: string[]
  targetTP?: string
  targetSL?: string
}

export interface JournalFilters {
  page?: number
  size?: number
  sort?: string[]
}

// 하위 호환용 (기존 코드에서 참조)
export interface CreateEntryRequest {
  symbol: string
  position: 'long' | 'short'
  entryPrice: number
  quantity: number
  entryDate: string
  notes?: string
  principleIds?: string[]
}

export interface UpdateEntryRequest {
  exitPrice?: number
  exitDate?: string
  notes?: string
  principleIds?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
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

  /** 매매일지 수정 (메모, 복기 등) */
  update: (id: number, data: UpdateJournalRequest) =>
    patch<JournalResponse>(`/api/journals/${id}`, data),

  /** 매매일지 삭제 */
  delete: (id: number) =>
    del<void>(`/api/journals/${id}`),
}
