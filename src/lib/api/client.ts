import axios, { AxiosError, type AxiosRequestConfig } from 'axios'

/**
 * API Client Configuration
 *
 * Base URL: https://api.tradex.so
 * - OAuth2 인증 엔드포인트: /oauth2/authorization/{provider}
 * - API 엔드포인트: /api/*
 *
 * 응답 형식:
 * - 정상 응답: { success: true, data: T }
 * - 에러 응답: { code: string, message: string }
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.tradex.so'

// ============================================================
// Types
// ============================================================

/** API 정상 응답 래퍼 */
export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

/** API 에러 응답 */
export interface ApiErrorResponse {
  code: string
  message: string
}

/** API 에러 클래스 */
export class ApiError extends Error {
  code: string
  statusCode?: number

  constructor(code: string, message: string, statusCode?: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
  }
}

/** API 응답이 성공 응답인지 확인 */
function isSuccessResponse<T>(data: unknown): data is ApiSuccessResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as ApiSuccessResponse<T>).success === true &&
    'data' in data
  )
}

/** API 응답이 에러 응답인지 확인 */
function isErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'code' in data &&
    'message' in data &&
    !('success' in data)
  )
}

// ============================================================
// Error Reporting (Slack)
// ============================================================

interface ErrorReportPayload {
  timestamp: string
  userId?: string
  userEmail?: string
  pageUrl: string
  apiEndpoint: string
  method: string
  statusCode: number
  errorCode?: string
  errorMessage?: string
  stackTrace?: string
  userAgent: string
}

/** 500 에러 발생 시 Slack으로 리포트 */
async function reportErrorToSlack(
  endpoint: string,
  method: string,
  statusCode: number,
  errorCode?: string,
  errorMessage?: string
): Promise<void> {
  // 클라이언트 사이드에서만 실행
  if (typeof window === 'undefined') return

  // 500번대 에러만 리포트
  if (statusCode < 500) return

  try {
    // 유저 정보 가져오기
    let userId: string | undefined
    let userEmail: string | undefined

    const authStorage = localStorage.getItem('tradex-auth')
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage)
        userId = state?.user?.id
        userEmail = state?.user?.email
      } catch {
        // ignore
      }
    }

    // Stack trace 생성
    const stackTrace = new Error().stack

    const payload: ErrorReportPayload = {
      timestamp: new Date().toISOString(),
      userId,
      userEmail,
      pageUrl: window.location.href,
      apiEndpoint: endpoint,
      method: method.toUpperCase(),
      statusCode,
      errorCode,
      errorMessage,
      stackTrace,
      userAgent: navigator.userAgent,
    }

    // 내부 API Route로 전송 (비동기, 실패해도 무시)
    fetch('/api/error-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // 에러 리포트 실패는 무시
    })
  } catch {
    // 에러 리포트 중 발생한 에러는 무시
  }
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORS 요청에서 쿠키 포함
})

// 토큰 갱신 중인지 추적
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

// 토큰 갱신 완료 후 대기 중인 요청들 처리
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

// 토큰 갱신 대기 큐에 추가
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('tradex-auth')
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage)
          if (state?.accessToken) {
            config.headers.Authorization = `Bearer ${state.accessToken}`
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - Handle API response wrapper and errors
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data

    // API 래퍼 응답 처리: { success: true, data: T } -> T
    if (isSuccessResponse(data)) {
      response.data = data.data
      return response
    }

    // 에러 응답 형식인 경우: { code: string, message: string }
    if (isErrorResponse(data)) {
      return Promise.reject(new ApiError(data.code, data.message, response.status))
    }

    // 래퍼 없는 응답은 그대로 반환 (OAuth 등 일부 엔드포인트)
    return response
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    const statusCode = error.response?.status
    const endpoint = originalRequest?.url || 'unknown'
    const method = originalRequest?.method || 'unknown'

    // 500번대 에러 발생 시 Slack으로 리포트
    if (statusCode && statusCode >= 500) {
      const errorData = error.response?.data
      reportErrorToSlack(
        endpoint,
        method,
        statusCode,
        isErrorResponse(errorData) ? errorData.code : undefined,
        isErrorResponse(errorData) ? errorData.message : error.message
      )
    }

    // 서버 에러 응답이 ApiErrorResponse 형식인 경우 ApiError로 변환
    if (error.response?.data && isErrorResponse(error.response.data)) {
      const apiError = new ApiError(
        error.response.data.code,
        error.response.data.message,
        error.response.status
      )

      // 401이 아닌 경우 바로 reject
      if (error.response.status !== 401) {
        return Promise.reject(apiError)
      }
    }

    // 401 에러이고 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 데모 모드인 경우 로그인 페이지로 리다이렉트하지 않음
      if (typeof window !== 'undefined') {
        const authStorage = localStorage.getItem('tradex-auth')
        if (authStorage) {
          try {
            const { state } = JSON.parse(authStorage)
            if (state?.isDemoMode) {
              // 데모 모드에서는 401을 조용히 처리 (리다이렉트 없음)
              return Promise.reject(error)
            }
          } catch {
            // ignore
          }
        }
      }

      // 이미 토큰 갱신 중인 경우
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      // refreshToken으로 accessToken 갱신 시도
      if (typeof window !== 'undefined') {
        const authStorage = localStorage.getItem('tradex-auth')
        if (authStorage) {
          try {
            const { state } = JSON.parse(authStorage)
            if (state?.refreshToken) {
              // Token refresh API 호출
              const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
                refreshToken: state.refreshToken
              })

              const { accessToken, refreshToken } = response.data

              // 새 토큰 저장
              const newState = {
                ...state,
                accessToken,
                refreshToken,
              }
              localStorage.setItem('tradex-auth', JSON.stringify({ state: newState }))

              isRefreshing = false
              onRefreshed(accessToken)

              // 원래 요청 재시도
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
              }
              return apiClient(originalRequest)
            }
          } catch (refreshError) {
            // Refresh 실패 시 로그아웃
            console.error('Token refresh failed:', refreshError)
            isRefreshing = false
            refreshSubscribers = []

            // 토큰 삭제 및 로그인 페이지로 이동
            localStorage.removeItem('tradex-auth')
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }

        // refreshToken이 없는 경우 로그아웃
        localStorage.removeItem('tradex-auth')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ============================================================
// Type-safe API methods
// ============================================================

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.get<T>(url, config)
  return response.data
}

export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config)
  return response.data
}

export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.put<T>(url, data, config)
  return response.data
}

export async function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config)
  return response.data
}

export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.delete<T>(url, config)
  return response.data
}

export default apiClient
