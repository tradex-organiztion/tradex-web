import { post, get } from './client'
import type { User } from '@/stores/useAuthStore'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
}

export interface AdditionalInfoRequest {
  nickname?: string
  tradingExperience?: string
  preferredMarkets?: string[]
}

export const authApi = {
  login: (data: LoginRequest) =>
    post<LoginResponse>('/auth/login', data),

  signup: (data: SignupRequest) =>
    post<LoginResponse>('/auth/signup', data),

  logout: () =>
    post<void>('/auth/logout'),

  me: () =>
    get<User>('/auth/me'),

  updateAdditionalInfo: (data: AdditionalInfoRequest) =>
    post<User>('/auth/additional-info', data),

  // OAuth
  googleLogin: () =>
    get<{ url: string }>('/auth/google'),

  appleLogin: () =>
    get<{ url: string }>('/auth/apple'),

  // Password
  forgotPassword: (email: string) =>
    post<void>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    post<void>('/auth/reset-password', { token, password }),
}
