import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authApi } from '@/lib/api/auth'

/**
 * Auth Store - 인증 상태 관리
 *
 * OAuth2 로그인 플로우:
 * 1. 소셜 로그인 버튼 클릭 → OAuth URL로 리다이렉트
 * 2. 로그인 성공 → /oauth2/redirect?accessToken=xxx&refreshToken=xxx&profileCompleted=false
 * 3. 토큰 저장 → profileCompleted에 따라 라우팅
 *    - profileCompleted=false → /additional-info (추가 정보 입력)
 *    - profileCompleted=true → /home (메인 페이지)
 */

/**
 * User 타입 - Swagger /api/auth/me 응답 기준
 */
export interface User {
  userId?: number
  email?: string
  username?: string
  profileImageUrl?: string | null
  socialProvider?: 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER'
  profileCompleted: boolean
}

interface AuthState {
  // State
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isDemoMode: boolean

  // Actions
  setUser: (user: User | null) => void
  setTokens: (accessToken: string, refreshToken: string, profileCompleted?: boolean) => void
  setAccessToken: (token: string | null) => void
  setRefreshToken: (token: string | null) => void
  setProfileCompleted: (completed: boolean) => void
  login: (user: User, accessToken: string, refreshToken?: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  startDemoMode: () => void
  exitDemoMode: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      isDemoMode: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setTokens: (accessToken, refreshToken, profileCompleted = false) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          user: {
            ...get().user,
            profileCompleted,
          },
        }),

      setAccessToken: (accessToken) =>
        set({ accessToken }),

      setRefreshToken: (refreshToken) =>
        set({ refreshToken }),

      setProfileCompleted: (completed) => {
        const currentUser = get().user
        set({
          user: currentUser
            ? { ...currentUser, profileCompleted: completed }
            : { profileCompleted: completed },
        })
      },

      login: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken: refreshToken || null,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () => {
        if (!get().isDemoMode) {
          authApi.logout().catch((err) => {
            console.warn('Logout API error:', err.message)
          })
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isDemoMode: false,
        })
      },

      setLoading: (isLoading) =>
        set({ isLoading }),

      startDemoMode: () =>
        set({
          isDemoMode: true,
          isAuthenticated: false,
          isLoading: false,
          accessToken: null,
          refreshToken: null,
          user: {
            userId: 0,
            email: 'demo@tradex.kr',
            username: 'Demo User',
            profileCompleted: true,
            socialProvider: 'LOCAL',
          },
        }),

      exitDemoMode: () =>
        set({
          isDemoMode: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'tradex-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isDemoMode: state.isDemoMode,
      }),
    }
  )
)
