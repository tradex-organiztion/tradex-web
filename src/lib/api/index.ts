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
  CompleteProfileResponse,
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
  UnreadCountResponse,
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
