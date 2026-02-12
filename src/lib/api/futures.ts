import { get } from './client'

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
  getSummary: (period: FuturesPeriod = '30d') =>
    get<FuturesSummaryResponse>('/api/futures/summary', {
      params: { period },
    }),

  /** 종목별 수익 랭킹 */
  getProfitRanking: (period: FuturesPeriod = '30d') =>
    get<ProfitRankingResponse>('/api/futures/profit-ranking', {
      params: { period },
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
  getClosedPositionsSummary: (period: FuturesPeriod = '30d') =>
    get<ClosedPositionsSummaryResponse>('/api/futures/closed-positions/summary', {
      params: { period },
    }),
}
