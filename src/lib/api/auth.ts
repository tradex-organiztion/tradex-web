import { post, get } from './client'
import type { User } from '@/stores/useAuthStore'

/**
 * Auth API
 *
 * OAuth2 소셜 로그인 URL:
 * - Google: https://api.tradex.so/oauth2/authorization/google
 * - Kakao: https://api.tradex.so/oauth2/authorization/kakao
 * - Naver: https://api.tradex.so/oauth2/authorization/naver
 *
 * OAuth2 리다이렉트 (로그인 성공 후):
 * - http://localhost:3000/oauth2/redirect?accessToken=xxx&refreshToken=xxx&profileCompleted=false
 */

// OAuth2 URLs
export const OAUTH_URLS = {
  google: 'https://api.tradex.so/oauth2/authorization/google',
  kakao: 'https://api.tradex.so/oauth2/authorization/kakao',
  naver: 'https://api.tradex.so/oauth2/authorization/naver',
} as const

export type OAuthProvider = keyof typeof OAUTH_URLS

// ============================================================
// Request/Response Types
// ============================================================

// 로그인
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

/**
 * 회원가입 요청 - Swagger 기준
 * POST /api/auth/signup
 * 전화번호 인증이 선행되어야 합니다
 */
export interface SignupRequest {
  email: string
  password: string      // 최소 8자
  username: string      // 2-100자
  phoneNumber: string   // 패턴: ^01[0-9]{8,9}$
}

export interface SignupResponse {
  user: User
  accessToken: string
  refreshToken: string
}

/**
 * 추가 정보 입력 (프로필 완성) 요청
 * POST /api/auth/complete-profile
 */
export interface CompleteProfileRequest {
  username?: string        // 선택
  exchangeName: string     // 필수: BYBIT 등
  apiKey: string           // 필수
  apiSecret?: string       // 선택
}

export interface CompleteProfileResponse {
  success: boolean
  user: User
}

// 토큰 갱신
export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

// ============================================================
// SMS 인증 관련
// ============================================================

export type SmsVerificationType = 'SIGNUP' | 'FIND_EMAIL'

/**
 * SMS 인증코드 발송 요청
 * POST /api/auth/send-sms
 */
export interface SendSmsRequest {
  phoneNumber: string   // 패턴: ^01[0-9]{8,9}$
  type: SmsVerificationType
}

/**
 * SMS 인증코드 확인 요청
 * POST /api/auth/verify-sms
 */
export interface VerifySmsRequest {
  phoneNumber: string   // 패턴: ^01[0-9]{8,9}$
  code: string          // 6자리
  type: SmsVerificationType
}

// ============================================================
// 비밀번호 찾기/재설정
// ============================================================

/**
 * 비밀번호 찾기 요청 (이메일로 재설정 링크 발송)
 * POST /api/auth/forgot-password
 */
export interface ForgotPasswordRequest {
  email: string
}

/**
 * 비밀번호 재설정 요청
 * POST /api/auth/reset-password
 */
export interface ResetPasswordRequest {
  token: string
  newPassword: string   // 최소 8자
}

// ============================================================
// 이메일(아이디) 찾기
// ============================================================

/**
 * 이메일 찾기 요청 (휴대폰 인증 후)
 * POST /api/auth/find-email
 */
export interface FindEmailRequest {
  phoneNumber: string   // 패턴: ^01[0-9]{8,9}$
}

export interface FindEmailResponse {
  maskedEmail: string | null
}

// 공통 메시지 응답
export interface MessageResponse {
  message: string
}

// Auth API
export const authApi = {
  // ============================================================
  // 기본 로그인/회원가입
  // ============================================================

  /** 이메일/비밀번호 로그인 */
  login: (data: LoginRequest) =>
    post<LoginResponse>('/api/auth/login', data),

  /** 회원가입 (휴대폰 인증 필수) */
  signup: (data: SignupRequest) =>
    post<SignupResponse>('/api/auth/signup', data),

  /** 로그아웃 */
  logout: () =>
    post<void>('/api/auth/logout'),

  /** 현재 사용자 정보 조회 */
  me: () =>
    get<User>('/api/auth/me'),

  /** 프로필 완성 (거래소 API 연동) */
  completeProfile: (data: CompleteProfileRequest) =>
    post<CompleteProfileResponse>('/api/auth/complete-profile', data),

  /** 토큰 갱신 */
  refreshToken: (data: RefreshTokenRequest) =>
    post<RefreshTokenResponse>('/api/auth/refresh', data),

  // ============================================================
  // SMS 인증
  // ============================================================

  /** SMS 인증코드 발송 */
  sendSms: (data: SendSmsRequest) =>
    post<MessageResponse>('/api/auth/send-sms', data),

  /** SMS 인증코드 확인 */
  verifySms: (data: VerifySmsRequest) =>
    post<MessageResponse>('/api/auth/verify-sms', data),

  // ============================================================
  // 비밀번호 찾기/재설정
  // ============================================================

  /** 비밀번호 찾기 (이메일로 재설정 링크 발송) */
  forgotPassword: (data: ForgotPasswordRequest) =>
    post<MessageResponse>('/api/auth/forgot-password', data),

  /** 비밀번호 재설정 */
  resetPassword: (data: ResetPasswordRequest) =>
    post<MessageResponse>('/api/auth/reset-password', data),

  // ============================================================
  // 이메일(아이디) 찾기
  // ============================================================

  /** 이메일 찾기 (휴대폰 인증 후) */
  findEmail: (data: FindEmailRequest) =>
    post<FindEmailResponse>('/api/auth/find-email', data),
}

/**
 * 소셜 로그인 시작
 * @param provider - 'google' | 'kakao' | 'naver'
 *
 * 브라우저를 OAuth 인증 페이지로 리다이렉트합니다.
 * 인증 성공 후 /oauth2/redirect 페이지로 돌아옵니다.
 */
export function startOAuthLogin(provider: OAuthProvider): void {
  window.location.href = OAUTH_URLS[provider]
}
