import { get, post } from './client'

/**
 * Subscription API
 *
 * 구독/결제 관련 API (Swagger 기준)
 */

// ============================================================
// Types
// ============================================================

/** 구독 플랜 */
export type SubscriptionPlan = 'FREE' | 'PRO' | 'PREMIUM'

/** 구독 상태 */
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELED'

/** 결제 상태 */
export type PaymentStatus = 'COMPLETED' | 'FAILED' | 'REFUNDED'

/** 내 구독 정보 응답 */
export interface SubscriptionResponse {
  currentPlan: SubscriptionPlan
  displayName: string
  price: number
  nextBillingDate: string
  status: SubscriptionStatus
  cardNumber: string
  cardCompany: string
}

/** 플랜 정보 응답 */
export interface PlanInfoResponse {
  plan: SubscriptionPlan
  displayName: string
  price: number
  current: boolean
}

/** 결제 내역 응답 */
export interface PaymentHistoryResponse {
  id: number
  plan: SubscriptionPlan
  planDisplayName: string
  amount: number
  paidAt: string
  status: PaymentStatus
}

/** 빌링키 발급 요청 */
export interface BillingKeyIssueRequest {
  authKey: string
  customerKey: string
  plan: SubscriptionPlan
}

/** 플랜 변경 요청 */
export interface ChangePlanRequest {
  newPlan: SubscriptionPlan
}

/** 구독 취소 요청 */
export interface CancelSubscriptionRequest {
  reason?: string
}

/** 결제 수단 변경 요청 */
export interface PaymentMethodRequest {
  authKey: string
  customerKey: string
}

// ============================================================
// Subscription API
// ============================================================

export const subscriptionApi = {
  /** 구독 플랜 목록 조회 */
  getPlans: () =>
    get<PlanInfoResponse[]>('/api/subscriptions/plans'),

  /** 내 구독 정보 조회 */
  getMySubscription: () =>
    get<SubscriptionResponse>('/api/subscriptions/me'),

  /** 결제 내역 조회 */
  getPaymentHistory: () =>
    get<PaymentHistoryResponse[]>('/api/subscriptions/payment-history'),

  /** 빌링키 발급 */
  issueBillingKey: (data: BillingKeyIssueRequest) =>
    post<SubscriptionResponse>('/api/subscriptions/billing-key', data),

  /** 플랜 변경 */
  changePlan: (data: ChangePlanRequest) =>
    post<SubscriptionResponse>('/api/subscriptions/change', data),

  /** 구독 취소 */
  cancelSubscription: (data?: CancelSubscriptionRequest) =>
    post<SubscriptionResponse>('/api/subscriptions/cancel', data),

  /** 결제 수단 변경 */
  changePaymentMethod: (data: PaymentMethodRequest) =>
    post<SubscriptionResponse>('/api/subscriptions/payment-method', data),
}
