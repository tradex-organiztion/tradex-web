import { create } from 'zustand'

export type PositionType = 'long' | 'short'
export type TradeStatus = 'open' | 'closed'

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
  // Journal entries
  entries: TradeEntry[]
  selectedEntry: TradeEntry | null

  // Filters
  filters: TradingFilters

  // Loading states
  isLoadingEntries: boolean

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
  entries: [],
  selectedEntry: null,
  filters: defaultFilters,
  isLoadingEntries: false,

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
  setLoadingEntries: (isLoadingEntries) =>
    set({ isLoadingEntries }),
}))
