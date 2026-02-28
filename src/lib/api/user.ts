import { post } from './client'
import type { MessageResponse } from './auth'

/**
 * User API
 *
 * Swagger: https://api.tradex.so/v3/api-docs
 * Tag: user-controller
 */

/**
 * 비밀번호 변경 요청 (휴대폰 인증 완료 후)
 * POST /api/users/me/password
 *
 * 사전 조건:
 * 1. POST /api/auth/send-sms (type: RESET_PASSWORD)
 * 2. POST /api/auth/verify-sms (type: RESET_PASSWORD)
 */
export interface ChangePasswordByPhoneRequest {
  phoneNumber: string    // 패턴: ^01[0-9]{8,9}$
  currentPassword: string
  newPassword: string    // 최소 8자
}

export const userApi = {
  /** 비밀번호 변경 (휴대폰 인증 완료 후) */
  changePassword: (data: ChangePasswordByPhoneRequest) =>
    post<MessageResponse>('/api/users/me/password', data),
}
