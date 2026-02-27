import { get } from './client'

// ============================================================
// Chart Data API (Swagger 엔드포인트)
// ============================================================

export type ChartExchange = 'BYBIT' | 'BINANCE' | 'BITGET'

export interface SymbolInfoResponse {
  name: string
  ticker: string
  description: string
  type: string
  session: string
  exchange: string
  timezone: string
  pricescale: number
  minmov: number
  has_intraday: boolean
  has_weekly_and_monthly: boolean
  supported_resolutions: string[]
  volume_precision: number
}

export interface BarData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface BarsResponse {
  bars: BarData[]
  noData: boolean
}

export interface BarsParams {
  symbol: string
  resolution: string
  from: number
  to: number
  countBack?: number
  exchange?: ChartExchange
}

export const chartDataApi = {
  /** TradingView 심볼 메타데이터 조회 */
  getSymbolInfo: (symbol: string, exchange?: ChartExchange) =>
    get<SymbolInfoResponse>('/api/chart/symbols', {
      params: { symbol, exchange },
    }),

  /** 키워드로 심볼 검색 */
  searchSymbols: (query: string, exchange?: ChartExchange) =>
    get<SymbolInfoResponse[]>('/api/chart/search', {
      params: { query, exchange },
    }),

  /** OHLCV 캔들 데이터 조회 */
  getBars: (params: BarsParams) =>
    get<BarsResponse>('/api/chart/bars', { params }),
}

// Chart 레이아웃 저장/불러오기는 chartLayoutApi (src/lib/api/chartLayout.ts) 사용
// TradingView save_load_adapter는 src/lib/chart/saveLoadAdapter.ts 참조
