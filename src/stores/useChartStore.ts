import { create } from 'zustand'
import type { IChartingLibraryWidget } from '@/charting_library'

interface ChartState {
  widgetInstance: IChartingLibraryWidget | null
  selectedSymbol: string  // Full name format: "BINANCE:BTC/USDT"
  isReady: boolean
  symbolSearchOpen: boolean
  setWidgetInstance: (widget: IChartingLibraryWidget | null) => void
  setSelectedSymbol: (symbol: string) => void
  setIsReady: (ready: boolean) => void
  setSymbolSearchOpen: (open: boolean) => void
}

export const useChartStore = create<ChartState>((set) => ({
  widgetInstance: null,
  selectedSymbol: 'BINANCE:BTC/USDT',
  isReady: false,
  symbolSearchOpen: false,
  setWidgetInstance: (widget) => set({ widgetInstance: widget }),
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setIsReady: (ready) => set({ isReady: ready }),
  setSymbolSearchOpen: (open) => set({ symbolSearchOpen: open }),
}))
