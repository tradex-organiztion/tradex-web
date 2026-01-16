import { post, get } from './client'
import type { User } from '@/stores/useAuthStore'

/**
 * Auth API
 *
 * OAuth2 소셜 로그인 URL:
 * - Google: https://api.tradex.so/oauth2/authorization/google
 * - Kakao: https://api.tradex.so/oauth2/authorization/kakao
 *
 * OAuth2 리다이렉트 (로그인 성공 후):
 * - http://localhost:3000/oauth2/redirect?accessToken=xxx&refreshToken=xxx&profileCompleted=false
 */

// OAuth2 URLs
export const OAUTH_URLS = {
  google: 'https://api.tradex.so/oauth2/authorization/google',
  kakao: 'https://api.tradex.so/oauth2/authorization/kakao',
} as const

export type OAuthProvider = keyof typeof OAUTH_URLS

// Request/Response Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
  phone?: string  // 휴대폰 번호 (인증 완료된 번호)
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
  exchangeName: string     // 필수: binance, upbit, etc.
  apiKey: string           // 필수
  apiSecret: string        // 필수
}

export interface CompleteProfileResponse {
  success: boolean
  user: User
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

// Auth API
export const authApi = {
  // 기본 로그인/회원가입
  login: (data: LoginRequest) =>
    post<LoginResponse>('/api/auth/login', data),

  signup: (data: SignupRequest) =>
    post<SignupResponse>('/api/auth/signup', data),

  logout: () =>
    post<void>('/api/auth/logout'),

  // 현재 사용자 정보
  me: () =>
    get<User>('/api/auth/me'),

  // 프로필 완성 (추가 정보 입력)
  completeProfile: (data: CompleteProfileRequest) =>
    post<CompleteProfileResponse>('/api/auth/complete-profile', data),

  // 토큰 갱신
  refreshToken: (data: RefreshTokenRequest) =>
    post<RefreshTokenResponse>('/api/auth/refresh', data),

  // 비밀번호 찾기/재설정
  forgotPassword: (email: string) =>
    post<void>('/api/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    post<void>('/api/auth/reset-password', { token, password }),

  // 아이디 찾기
  findId: (name: string, phone: string) =>
    post<{ email: string }>('/api/auth/find-id', { name, phone }),

  // 휴대폰 인증
  sendVerificationCode: (phone: string) =>
    post<{ success: boolean }>('/api/auth/send-verification', { phone }),

  verifyCode: (phone: string, code: string) =>
    post<{ success: boolean }>('/api/auth/verify-code', { phone, code }),
}

/**
 * 소셜 로그인 시작
 * @param provider - 'google' | 'kakao'
 *
 * 브라우저를 OAuth 인증 페이지로 리다이렉트합니다.
 * 인증 성공 후 /oauth2/redirect 페이지로 돌아옵니다.
 */
export function startOAuthLogin(provider: OAuthProvider): void {
  window.location.href = OAUTH_URLS[provider]
}
