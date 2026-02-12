import { get } from './client'

/**
 * Portfolio API
 *
 * Swagger: https://api.tradex.so/v3/api-docs
 * Tag: portfolio-controller
 */

// ============================================================
// Types
// ============================================================

/** GET /api/portfolio/summary */
export interface PortfolioSummaryResponse {
  /** 총 자산 (USDT) */
  totalAsset: number
  /** 오늘 PnL (USDT) */
  todayPnl: number
  /** 오늘 PnL 비율 (%) */
  todayPnlRate: number
  /** 주간 PnL (USDT) */
  weeklyPnl: number
  /** 주간 PnL 비율 (%) */
  weeklyPnlRate: number
}

/** 코인 잔고 */
export interface CoinBalance {
  /** 코인 심볼 */
  coin: string
  /** 수량 */
  quantity: number
  /** USD 가치 (USDT) */
  usdValue: number
  /** 비중 (%) */
  percentage: number
}

/** GET /api/portfolio/distribution */
export interface AssetDistributionResponse {
  /** 총 순자산 (USDT) */
  totalNetAsset: number
  /** 코인별 잔고 */
  coins: CoinBalance[]
}

/** 일별 PnL */
export interface DailyPnl {
  date: string
  /** PnL (USDT) */
  pnl: number
  /** 승리 횟수 */
  winCount: number
  /** 패배 횟수 */
  lossCount: number
}

/** GET /api/portfolio/daily-profit */
export interface DailyProfitResponse {
  year: number
  month: number
  /** 월간 총 PnL (USDT) */
  monthlyTotalPnl: number
  /** 월간 수익률 (%) */
  monthlyReturnRate: number
  /** 총 승리 횟수 */
  totalWinCount: number
  /** 총 패배 횟수 */
  totalLossCount: number
  /** 일별 PnL 목록 */
  dailyPnlList: DailyPnl[]
}

/** 일별 수익 (누적) */
export interface DailyProfit {
  date: string
  /** 당일 수익 (USDT) */
  profit: number
  /** 누적 수익 (USDT) */
  cumulativeProfit: number
  /** 누적 수익률 (%) */
  cumulativeProfitRate: number
}

/** GET /api/portfolio/cumulative-profit */
export interface CumulativeProfitResponse {
  startDate: string
  endDate: string
  /** 총 수익 (USDT) */
  totalProfit: number
  /** 총 수익률 (%) */
  totalProfitRate: number
  /** 일별 수익 */
  dailyProfits: DailyProfit[]
}

export type CumulativeProfitPeriod = '7d' | '30d' | '60d' | '90d' | '180d' | 'custom'

/** 일별 자산 */
export interface DailyAsset {
  date: string
  /** 총 자산 (USDT) */
  totalAsset: number
  /** 일간 수익률 (%) */
  dailyReturnRate: number
}

/** GET /api/portfolio/asset-history */
export interface AssetHistoryResponse {
  year: number
  month: number
  /** 시작 자산 (USDT) */
  startAsset: number
  /** 종료 자산 (USDT) */
  endAsset: number
  /** 월간 수익률 (%) */
  monthlyReturnRate: number
  /** 일별 자산 목록 */
  dailyAssets: DailyAsset[]
}

// ============================================================
// Portfolio API
// ============================================================

export const portfolioApi = {
  /** 포트폴리오 요약 (총 자산, 오늘/주간 PnL) */
  getSummary: () =>
    get<PortfolioSummaryResponse>('/api/portfolio/summary'),

  /** 자산 분배 현황 (코인별 잔고) */
  getDistribution: () =>
    get<AssetDistributionResponse>('/api/portfolio/distribution'),

  /** 일별 수익 (캘린더용) */
  getDailyProfit: (year: number, month: number) =>
    get<DailyProfitResponse>('/api/portfolio/daily-profit', {
      params: { year, month },
    }),

  /** 누적 수익 (차트용) */
  getCumulativeProfit: (
    period: CumulativeProfitPeriod = '7d',
    startDate?: string,
    endDate?: string
  ) =>
    get<CumulativeProfitResponse>('/api/portfolio/cumulative-profit', {
      params: { period, startDate, endDate },
    }),

  /** 자산 히스토리 (월별 일간 자산 추이) */
  getAssetHistory: (year: number, month: number) =>
    get<AssetHistoryResponse>('/api/portfolio/asset-history', {
      params: { year, month },
    }),
}
