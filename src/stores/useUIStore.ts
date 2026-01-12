import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface UIState {
  // Sidebar
  isSidebarOpen: boolean
  isSidebarCollapsed: boolean

  // AI Panel
  isAIPanelOpen: boolean

  // Theme
  theme: Theme

  // Mobile
  isMobile: boolean

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleAIPanel: () => void
  setAIPanelOpen: (open: boolean) => void
  setTheme: (theme: Theme) => void
  setIsMobile: (isMobile: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      isSidebarOpen: true,
      isSidebarCollapsed: false,
      isAIPanelOpen: false,
      theme: 'system',
      isMobile: false,

      // Actions
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      setSidebarOpen: (isSidebarOpen) =>
        set({ isSidebarOpen }),

      setSidebarCollapsed: (isSidebarCollapsed) =>
        set({ isSidebarCollapsed }),

      toggleAIPanel: () =>
        set((state) => ({ isAIPanelOpen: !state.isAIPanelOpen })),

      setAIPanelOpen: (isAIPanelOpen) =>
        set({ isAIPanelOpen }),

      setTheme: (theme) =>
        set({ theme }),

      setIsMobile: (isMobile) =>
        set({ isMobile }),
    }),
    {
      name: 'tradex-ui',
      partialize: (state) => ({
        theme: state.theme,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
)
