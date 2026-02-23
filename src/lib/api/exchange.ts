import { get, post, patch, del } from './client'

/**
 * Exchange API Key Management
 *
 * Swagger: https://api.tradex.so/v3/api-docs
 * Tag: exchange-api-key-controller
 */

// ============================================================
// Types (Swagger 기준)
// ============================================================

export interface ExchangeApiKeyResponse {
  id: number
  exchangeName: 'BYBIT' | 'BINANCE' | 'BITGET'
  /** 마스킹된 API 키 */
  maskedApiKey: string
  /** 활성 상태 */
  isActive: boolean
  createdAt: string
}

export interface ExchangeApiKeyRequest {
  exchangeName: 'BYBIT' | 'BINANCE' | 'BITGET'
  apiKey: string
  apiSecret: string
  /** Bitget 등 일부 거래소에서 필요 */
  passphrase?: string
}

// ============================================================
// Exchange API Key API
// ============================================================

export const exchangeApi = {
  /** 모든 API 키 목록 조회 */
  getAll: () =>
    get<ExchangeApiKeyResponse[]>('/api/exchange-keys'),

  /** 활성 API 키만 조회 */
  getActive: () =>
    get<ExchangeApiKeyResponse[]>('/api/exchange-keys/active'),

  /** 특정 거래소의 API 키 조회 */
  getByExchange: (exchangeName: string) =>
    get<ExchangeApiKeyResponse>(`/api/exchange-keys/exchange/${exchangeName}`),

  /** 특정 API 키 조회 */
  getById: (apiKeyId: number) =>
    get<ExchangeApiKeyResponse>(`/api/exchange-keys/${apiKeyId}`),

  /** API 키 추가 */
  create: (data: ExchangeApiKeyRequest) =>
    post<ExchangeApiKeyResponse>('/api/exchange-keys', data),

  /** API 키 수정 */
  update: (apiKeyId: number, data: ExchangeApiKeyRequest) =>
    patch<ExchangeApiKeyResponse>(`/api/exchange-keys/${apiKeyId}`, data),

  /** API 키 삭제 */
  delete: (apiKeyId: number) =>
    del<void>(`/api/exchange-keys/${apiKeyId}`),

  /** API 키 활성화 */
  activate: (apiKeyId: number) =>
    patch<ExchangeApiKeyResponse>(`/api/exchange-keys/${apiKeyId}/activate`),

  /** API 키 비활성화 */
  deactivate: (apiKeyId: number) =>
    patch<ExchangeApiKeyResponse>(`/api/exchange-keys/${apiKeyId}/deactivate`),
}
