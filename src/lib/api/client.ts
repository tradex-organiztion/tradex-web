import axios, { AxiosError, type AxiosRequestConfig } from 'axios'

/**
 * API Client Configuration
 *
 * Base URL: https://api.tradex.so
 * - OAuth2 인증 엔드포인트: /oauth2/authorization/{provider}
 * - API 엔드포인트: /api/*
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.tradex.so'

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

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // 401 에러이고 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
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

// Type-safe API methods
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  statusCode: number
}

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
