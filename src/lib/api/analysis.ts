import { get } from './client'

// ============================================================
// 공통 타입
// ============================================================

export type AnalysisPeriod = '7d' | '30d' | '60d' | '90d' | '180d' | 'all' | 'custom'

export interface AnalysisParams {
  exchangeName?: string
  period?: AnalysisPeriod
  startDate?: string
  endDate?: string
}

// ============================================================
// Risk Analysis API
// ============================================================

export interface EntryRiskResponse {
  unplannedEntryCount: number
  unplannedEntryRate: number
  unplannedEntryWinRate: number
  plannedEntryWinRate: number
  emotionalReEntryCount: number
  emotionalReEntryRate: number
  impulsiveTradeCount: number
  impulsiveTradeRate: number
}

export interface ExitRiskResponse {
  slViolationCount: number
  slViolationRate: number
  avgSlDelay: number
  earlyTpCount: number
  earlyTpRate: number
}

export interface PositionManagementRiskResponse {
  avgRrRatio: number
  averagingDownCount: number
  averagingDownRate: number
}

export interface TimeRiskResponse {
  hourlyWinRates: Record<string, number>
  uptrendWinRate: number
  downtrendWinRate: number
  sidewaysWinRate: number
}

export interface EmotionalRiskResponse {
  emotionalTradeCount: number
  emotionalTradeRate: number
  overconfidentEntryCount: number
  overconfidentEntryRate: number
  immediateReverseCount: number
  immediateReverseRate: number
}

export interface RiskAnalysisResponse {
  totalTrades: number
  entryRisk: EntryRiskResponse
  exitRisk: ExitRiskResponse
  positionManagementRisk: PositionManagementRiskResponse
  timeRisk: TimeRiskResponse
  emotionalRisk: EmotionalRiskResponse
}

export const riskApi = {
  /** 5개 카테고리 리스크 분석 */
  getAnalysis: (params?: AnalysisParams) =>
    get<RiskAnalysisResponse>('/api/risk/analysis', { params }),
}

// ============================================================
// Strategy Analysis API
// ============================================================

export interface StrategyItem {
  indicators: string[]
  technicalAnalyses: string[]
  timeframes: string[]
  side: 'LONG' | 'SHORT'
  marketCondition: 'UPTREND' | 'DOWNTREND' | 'SIDEWAYS'
  totalTrades: number
  winCount: number
  lossCount: number
  winRate: number
  avgProfit: number
  avgRrRatio: number
}

export interface StrategyAnalysisResponse {
  totalTrades: number
  strategies: StrategyItem[]
}

export const strategyApi = {
  /** 전략 패턴 집계 분석 */
  getAnalysis: (params?: AnalysisParams) =>
    get<StrategyAnalysisResponse>('/api/strategy/analysis', { params }),
}
