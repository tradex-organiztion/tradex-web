export { apiClient, get, post, put, patch, del, ApiError } from './client'
export type { ApiSuccessResponse, ApiErrorResponse } from './client'

// Auth API
export { authApi, OAUTH_URLS, startOAuthLogin } from './auth'
export type {
  OAuthProvider,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  CompleteProfileRequest,
  UserResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SmsVerificationType,
  SendSmsRequest,
  VerifySmsRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  FindEmailRequest,
  FindEmailResponse,
  MessageResponse,
} from './auth'

// Home API
export { homeApi } from './home'
export type {
  DailyPnlChartData,
  HomeSummaryResponse,
  HomeNotificationType,
  HomeNotificationResponse,
} from './home'

// Notification API (수신함 전용: /api/notifications)
export { notificationApi } from './notification'
export type {
  NotificationType,
  NotificationResponse,
} from './notification'

// Trading API
export { journalApi, journalStatsApi } from './trading'
export type {
  JournalFilters,
  JournalResponse,
  UpdateJournalRequest,
  TradingStyle,
  JournalStatsParams,
  JournalStatsResponse,
  JournalStatsOptionsResponse,
} from './trading'

// Portfolio API
export { portfolioApi } from './portfolio'
export type {
  PortfolioSummaryResponse,
  CoinBalance,
  AssetDistributionResponse,
  DailyPnl,
  DailyProfitResponse,
  DailyProfit,
  CumulativeProfitResponse,
  CumulativeProfitPeriod,
  DailyAsset,
  AssetHistoryResponse,
} from './portfolio'

// Futures API
export { futuresApi, positionsApi, ordersApi } from './futures'
export type {
  FuturesPeriod,
  PnlChartData,
  FuturesSummaryResponse,
  PairProfit,
  ProfitRankingResponse,
  PositionSide,
  TradeResult,
  ClosedPositionResponse,
  PageableParams,
  PageResponse,
  ClosedPositionsFilter,
  ClosedPositionsSummaryResponse,
  PositionRequest,
  PositionResponse,
  OrderRequest,
  OrderResponse,
} from './futures'

// AI Chat API
export { aiApi, chatSessionApi } from './ai'
export type {
  AIChatRequest,
  AIChatResponse,
  AIAnalysisResponse,
  ChatStreamCallbacks,
  ChatSessionResponse,
  ChatMessageResponse,
  ChatHistoryResponse,
} from './ai'

// Exchange API
export { exchangeApi } from './exchange'
export type {
  ExchangeApiKeyResponse,
  ExchangeApiKeyRequest,
} from './exchange'

// Analysis API
export { riskApi, strategyApi } from './analysis'
export type {
  AnalysisPeriod,
  AnalysisParams,
  EntryRiskResponse,
  ExitRiskResponse,
  PositionManagementRiskResponse,
  TimeRiskResponse,
  EmotionalRiskResponse,
  RiskAnalysisResponse,
  StrategyItem,
  StrategyAnalysisResponse,
} from './analysis'

// Chart API
export { chartDataApi } from './chart'
export type {
  ChartExchange,
  SymbolInfoResponse,
  BarData,
  BarsResponse,
  BarsParams,
} from './chart'

// Chart Layout API
export { chartLayoutApi } from './chartLayout'
export type {
  ChartLayoutRequest,
  ChartLayoutMetaResponse,
  ChartLayoutContentResponse,
} from './chartLayout'

// Subscription API (결제)
export { subscriptionApi } from './subscription'
export type {
  SubscriptionPlan,
  SubscriptionStatus,
  PaymentStatus,
  SubscriptionResponse,
  PlanInfoResponse,
  PaymentHistoryResponse,
  BillingKeyIssueRequest,
  ChangePlanRequest,
  CancelSubscriptionRequest,
  PaymentMethodRequest,
} from './subscription'

// Trading Principle API (매매 원칙)
export { tradingPrincipleApi } from './tradingPrinciple'
export type {
  TradingPrincipleRequest,
  TradingPrincipleResponse,
} from './tradingPrinciple'
