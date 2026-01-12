import { get, post, put, del } from './client'
import type { TradingPrinciple, TradeEntry } from '@/stores/useTradingStore'

// Principles API
export interface CreatePrincipleRequest {
  title: string
  description: string
  category: string
}

export interface UpdatePrincipleRequest {
  title?: string
  description?: string
  category?: string
  isActive?: boolean
}

export const principlesApi = {
  getAll: () =>
    get<TradingPrinciple[]>('/trading/principles'),

  getById: (id: string) =>
    get<TradingPrinciple>(`/trading/principles/${id}`),

  create: (data: CreatePrincipleRequest) =>
    post<TradingPrinciple>('/trading/principles', data),

  update: (id: string, data: UpdatePrincipleRequest) =>
    put<TradingPrinciple>(`/trading/principles/${id}`, data),

  delete: (id: string) =>
    del<void>(`/trading/principles/${id}`),

  // AI Recommendations
  getAIRecommendations: () =>
    get<TradingPrinciple[]>('/trading/principles/ai-recommendations'),
}

// Journal API
export interface CreateEntryRequest {
  symbol: string
  position: 'long' | 'short'
  entryPrice: number
  quantity: number
  entryDate: string
  notes?: string
  principleIds?: string[]
}

export interface UpdateEntryRequest {
  exitPrice?: number
  exitDate?: string
  notes?: string
  principleIds?: string[]
}

export interface JournalFilters {
  startDate?: string
  endDate?: string
  position?: 'long' | 'short'
  status?: 'open' | 'closed'
  result?: 'profit' | 'loss'
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const journalApi = {
  getAll: (filters?: JournalFilters) =>
    get<PaginatedResponse<TradeEntry>>('/trading/journal', { params: filters }),

  getById: (id: string) =>
    get<TradeEntry>(`/trading/journal/${id}`),

  create: (data: CreateEntryRequest) =>
    post<TradeEntry>('/trading/journal', data),

  update: (id: string, data: UpdateEntryRequest) =>
    put<TradeEntry>(`/trading/journal/${id}`, data),

  delete: (id: string) =>
    del<void>(`/trading/journal/${id}`),

  // Close position
  close: (id: string, exitPrice: number, exitDate: string) =>
    post<TradeEntry>(`/trading/journal/${id}/close`, { exitPrice, exitDate }),

  // Stats
  getStats: (period?: string) =>
    get<{
      totalTrades: number
      winRate: number
      totalPnL: number
      averagePnL: number
    }>('/trading/journal/stats', { params: { period } }),
}
