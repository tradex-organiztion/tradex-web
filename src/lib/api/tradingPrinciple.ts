import { get, post, put, del } from './client'

/**
 * Trading Principle API
 *
 * 매매 원칙 CRUD API (Swagger 기준)
 */

// ============================================================
// Types
// ============================================================

/** 매매 원칙 요청 */
export interface TradingPrincipleRequest {
  content: string
}

/** 매매 원칙 응답 */
export interface TradingPrincipleResponse {
  id: number
  content: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// TradingPrinciple API
// ============================================================

export const tradingPrincipleApi = {
  /** 매매 원칙 목록 조회 */
  getAll: () =>
    get<TradingPrincipleResponse[]>('/api/trading-principles'),

  /** 매매 원칙 생성 */
  create: (data: TradingPrincipleRequest) =>
    post<TradingPrincipleResponse>('/api/trading-principles', data),

  /** 매매 원칙 수정 */
  update: (principleId: number, data: TradingPrincipleRequest) =>
    put<TradingPrincipleResponse>(`/api/trading-principles/${principleId}`, data),

  /** 매매 원칙 삭제 */
  delete: (principleId: number) =>
    del<void>(`/api/trading-principles/${principleId}`),
}
