import { get, post, put, del } from './client'

/**
 * Chart Layout API
 *
 * TradingView 차트 레이아웃 저장/불러오기 API (Swagger 기준)
 */

// ============================================================
// Types
// ============================================================

/** 차트 레이아웃 저장 요청 */
export interface ChartLayoutRequest {
  name: string
  symbol?: string
  resolution?: string
  content: string
}

/** 차트 레이아웃 메타 정보 응답 */
export interface ChartLayoutMetaResponse {
  id: number
  name: string
  symbol: string
  resolution: string
  createdAt: string
  updatedAt: string
}

/** 차트 레이아웃 콘텐츠 응답 */
export interface ChartLayoutContentResponse {
  id: number
  content: string
}

// ============================================================
// ChartLayout API
// ============================================================

export const chartLayoutApi = {
  /** 차트 레이아웃 목록 조회 */
  getAll: () =>
    get<ChartLayoutMetaResponse[]>('/api/chart-layouts'),

  /** 차트 레이아웃 생성 */
  create: (data: ChartLayoutRequest) =>
    post<Record<string, number>>('/api/chart-layouts', data),

  /** 차트 레이아웃 수정 */
  update: (id: number, data: ChartLayoutRequest) =>
    put<void>(`/api/chart-layouts/${id}`, data),

  /** 차트 레이아웃 삭제 */
  delete: (id: number) =>
    del<void>(`/api/chart-layouts/${id}`),

  /** 차트 레이아웃 콘텐츠 조회 */
  getContent: (id: number) =>
    get<ChartLayoutContentResponse>(`/api/chart-layouts/${id}/content`),
}
