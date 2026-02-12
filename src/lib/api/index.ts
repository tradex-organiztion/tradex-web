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
  NotificationType,
  NotificationResponse,
} from './home'

// Trading API
export { principlesApi, journalApi } from './trading'
export type {
  CreatePrincipleRequest,
  UpdatePrincipleRequest,
  CreateEntryRequest,
  UpdateEntryRequest,
  JournalFilters,
  PaginatedResponse,
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
export { futuresApi } from './futures'
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
} from './futures'

// AI Chat API
export { aiApi } from './ai'
export type {
  AIChatRequest,
  AIChatResponse,
  AIAnalysisResponse,
  ChatStreamCallbacks,
} from './ai'

// Chart API
export { chartApi } from './chart'
