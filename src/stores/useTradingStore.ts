import { create } from 'zustand'

export type PositionType = 'long' | 'short'
export type TradeStatus = 'open' | 'closed'

export interface TradingPrinciple {
  id: string
  title: string
  description: string
  category: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TradeEntry {
  id: string
  symbol: string
  position: PositionType
  entryPrice: number
  exitPrice?: number
  quantity: number
  status: TradeStatus
  pnl?: number
  pnlPercent?: number
  entryDate: string
  exitDate?: string
  notes?: string
  principleIds: string[]
  createdAt: string
  updatedAt: string
}

export type JournalFilterPeriod = '1d' | '1w' | '1m' | '3m' | '1y' | 'all'
export type JournalFilterResult = 'all' | 'profit' | 'loss'

interface TradingFilters {
  period: JournalFilterPeriod
  position: PositionType | 'all'
  result: JournalFilterResult
  search: string
}

interface TradingState {
  // Principles
  principles: TradingPrinciple[]
  selectedPrinciple: TradingPrinciple | null

  // Journal entries
  entries: TradeEntry[]
  selectedEntry: TradeEntry | null

  // Filters
  filters: TradingFilters

  // Loading states
  isLoadingPrinciples: boolean
  isLoadingEntries: boolean

  // Actions - Principles
  setPrinciples: (principles: TradingPrinciple[]) => void
  addPrinciple: (principle: TradingPrinciple) => void
  updatePrinciple: (id: string, updates: Partial<TradingPrinciple>) => void
  deletePrinciple: (id: string) => void
  setSelectedPrinciple: (principle: TradingPrinciple | null) => void

  // Actions - Entries
  setEntries: (entries: TradeEntry[]) => void
  addEntry: (entry: TradeEntry) => void
  updateEntry: (id: string, updates: Partial<TradeEntry>) => void
  deleteEntry: (id: string) => void
  setSelectedEntry: (entry: TradeEntry | null) => void

  // Actions - Filters
  setFilters: (filters: Partial<TradingFilters>) => void
  resetFilters: () => void

  // Actions - Loading
  setLoadingPrinciples: (loading: boolean) => void
  setLoadingEntries: (loading: boolean) => void
}

const defaultFilters: TradingFilters = {
  period: '1m',
  position: 'all',
  result: 'all',
  search: '',
}

export const useTradingStore = create<TradingState>((set) => ({
  // Initial state
  principles: [],
  selectedPrinciple: null,
  entries: [],
  selectedEntry: null,
  filters: defaultFilters,
  isLoadingPrinciples: false,
  isLoadingEntries: false,

  // Actions - Principles
  setPrinciples: (principles) =>
    set({ principles }),

  addPrinciple: (principle) =>
    set((state) => ({
      principles: [...state.principles, principle],
    })),

  updatePrinciple: (id, updates) =>
    set((state) => ({
      principles: state.principles.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    })),

  deletePrinciple: (id) =>
    set((state) => ({
      principles: state.principles.filter((p) => p.id !== id),
    })),

  setSelectedPrinciple: (selectedPrinciple) =>
    set({ selectedPrinciple }),

  // Actions - Entries
  setEntries: (entries) =>
    set({ entries }),

  addEntry: (entry) =>
    set((state) => ({
      entries: [...state.entries, entry],
    })),

  updateEntry: (id, updates) =>
    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
      ),
    })),

  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    })),

  setSelectedEntry: (selectedEntry) =>
    set({ selectedEntry }),

  // Actions - Filters
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  resetFilters: () =>
    set({ filters: defaultFilters }),

  // Actions - Loading
  setLoadingPrinciples: (isLoadingPrinciples) =>
    set({ isLoadingPrinciples }),

  setLoadingEntries: (isLoadingEntries) =>
    set({ isLoadingEntries }),
}))
