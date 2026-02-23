import { get, post, patch, del } from './client'

/**
 * Futures API
 *
 * Swagger: https://api.tradex.so/v3/api-docs
 * Tag: futures-controller
 */

// ============================================================
// Types
// ============================================================

export type FuturesPeriod = '7d' | '30d' | '60d' | '90d' | '180d' | 'all'

/** PnL 차트 데이터 포인트 */
export interface PnlChartData {
  date: string
  /** 당일 PnL (USDT) */
  pnl: number
  /** 누적 PnL (USDT) */
  cumulativePnl: number
}

/** GET /api/futures/summary */
export interface FuturesSummaryResponse {
  /** 총 PnL (USDT) */
  totalPnl: number
  /** 총 거래량 (USDT) */
  totalVolume: number
  /** 승률 (%) */
  winRate: number
  /** 승리 횟수 */
  winCount: number
  /** 패배 횟수 */
  lossCount: number
  /** 총 거래 횟수 */
  totalTradeCount: number
  /** PnL 차트 데이터 */
  pnlChart: PnlChartData[]
}

/** 종목별 수익 랭킹 */
export interface PairProfit {
  rank: number
  /** 심볼 (예: BTCUSDT) */
  symbol: string
  /** 총 PnL (USDT) */
  totalPnl: number
  /** 거래 횟수 */
  tradeCount: number
  /** 승률 (%) */
  winRate: number
}

/** GET /api/futures/profit-ranking */
export interface ProfitRankingResponse {
  rankings: PairProfit[]
}

export type PositionSide = 'LONG' | 'SHORT'
export type TradeResult = 'WIN' | 'LOSS'

/** 청산된 포지션 */
export interface ClosedPositionResponse {
  id: number
  symbol: string
  side: PositionSide
  /** 포지션 사이즈 */
  size: number
  /** 레버리지 */
  leverage: number
  /** 진입가 */
  entryPrice: number
  /** 청산가 */
  exitPrice: number
  /** 실현 PnL (USDT) */
  pnl: number
  /** 결과 */
  result: TradeResult
  /** 거래량 (USDT) */
  volume: number
  /** 총 수수료 (USDT) */
  totalFee: number
  /** 진입 시각 */
  entryTime: string
  /** 청산 시각 */
  exitTime: string
}

/** 페이지네이션 파라미터 */
export interface PageableParams {
  page?: number
  size?: number
  sort?: string[]
}

/** 페이지네이션 응답 */
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

/** 청산 포지션 필터 */
export interface ClosedPositionsFilter {
  /** 심볼 필터 (예: BTCUSDT) */
  symbol?: string
  /** 포지션 방향 필터 */
  side?: PositionSide
  /** 거래소 필터 */
  exchange?: ExchangeName
}

/** GET /api/futures/closed-positions/summary */
export interface ClosedPositionsSummaryResponse {
  /** 총 청산 횟수 */
  totalClosedCount: number
  /** 승률 (%) */
  winRate: number
  /** 롱 PnL (USDT) */
  longPnl: number
  /** 롱 횟수 */
  longCount: number
  /** 숏 PnL (USDT) */
  shortPnl: number
  /** 숏 횟수 */
  shortCount: number
}

// ============================================================
// Futures API
// ============================================================

export const futuresApi = {
  /** 선물 거래 요약 (총 PnL, 승률, 거래량, PnL 차트) */
  getSummary: (period: FuturesPeriod = '30d', exchange?: ExchangeName) =>
    get<FuturesSummaryResponse>('/api/futures/summary', {
      params: { period, exchange },
    }),

  /** 종목별 수익 랭킹 */
  getProfitRanking: (period: FuturesPeriod = '30d', exchange?: ExchangeName) =>
    get<ProfitRankingResponse>('/api/futures/profit-ranking', {
      params: { period, exchange },
    }),

  /** 청산 포지션 목록 (페이지네이션) */
  getClosedPositions: (
    filter?: ClosedPositionsFilter,
    pageable?: PageableParams
  ) =>
    get<PageResponse<ClosedPositionResponse>>('/api/futures/closed-positions', {
      params: {
        ...filter,
        ...pageable,
        sort: pageable?.sort?.join(','),
      },
    }),

  /** 청산 포지션 요약 (롱/숏 PnL, 승률) */
  getClosedPositionsSummary: (period: FuturesPeriod = '30d', exchange?: ExchangeName) =>
    get<ClosedPositionsSummaryResponse>('/api/futures/closed-positions/summary', {
      params: { period, exchange },
    }),
}

// ============================================================
// Position CRUD API (Swagger 기준)
// ============================================================

export type ExchangeName = 'BYBIT' | 'BINANCE' | 'BITGET'
export type MarketCondition = 'UPTREND' | 'DOWNTREND' | 'SIDEWAYS'

export interface PositionRequest {
  exchangeName?: ExchangeName
  symbol: string
  side: PositionSide
  avgEntryPrice: number
  currentSize: number
  entryTime: string              // ISO date-time (required)
  leverage?: number
  targetPrice?: number
  stopLossPrice?: number
  avgExitPrice?: number
  exitTime?: string              // ISO date-time
}

export interface PositionResponse {
  positionId: number
  userId: number
  exchangeName: ExchangeName
  symbol: string
  side: PositionSide
  entryTime: string
  avgEntryPrice: number
  leverage: number
  exitTime?: string
  avgExitPrice?: number
  realizedPnl?: number
  targetPrice?: number
  stopLossPrice?: number
  openFee?: number
  closedFee?: number
  marketCondition?: MarketCondition
  status: 'OPEN' | 'CLOSED'
  roi?: number
  createdAt: string
}

export const positionsApi = {
  /** 포지션 수동 생성 (매매일지 자동 생성) */
  create: (data: PositionRequest) =>
    post<PositionResponse>('/api/futures/positions', data),

  /** 포지션 수정 */
  update: (positionId: number, data: Partial<PositionRequest>) =>
    patch<PositionResponse>(`/api/futures/positions/${positionId}`, data),

  /** 포지션 삭제 (연결된 오더, 매매일지도 삭제) */
  delete: (positionId: number) =>
    del<void>(`/api/futures/positions/${positionId}`),
}

// ============================================================
// Order API (Swagger 기준)
// ============================================================

export type OrderType = 'MARKET' | 'LIMIT' | 'STOP_LOSS'
export type PositionEffect = 'OPEN' | 'CLOSE'
export type OrderStatus = 'NEW' | 'FILLED' | 'CANCELED'

export interface OrderRequest {
  side: 'BUY' | 'SELL'
  orderType: OrderType             // required
  orderTime: string                // ISO date-time (required)
  positionEffect?: PositionEffect
  filledQuantity?: number
  filledPrice?: number
  cumExecFee?: number
  realizedPnl?: number
  fillTime?: string                // ISO date-time
}

export interface OrderResponse {
  orderId: number
  side: 'BUY' | 'SELL'
  orderType: OrderType
  positionEffect?: PositionEffect
  filledQuantity?: number
  filledPrice?: number
  cumExecFee?: number
  realizedPnl?: number
  status: OrderStatus
  orderTime: string
  fillTime?: string
  createdAt: string
}

export const ordersApi = {
  /** 포지션에 오더 추가 */
  create: (positionId: number, data: OrderRequest) =>
    post<OrderResponse>(`/api/positions/${positionId}/orders`, data),

  /** 오더 수정 */
  update: (orderId: number, data: Partial<OrderRequest>) =>
    patch<OrderResponse>(`/api/orders/${orderId}`, data),

  /** 오더 삭제 */
  delete: (orderId: number) =>
    del<void>(`/api/orders/${orderId}`),

  /** 오더를 다른 포지션으로 이동 */
  move: (orderId: number, targetPositionId: number) =>
    patch<OrderResponse>(`/api/orders/${orderId}/move`, undefined, {
      params: { targetPositionId },
    }),
}
