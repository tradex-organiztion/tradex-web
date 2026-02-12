import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Trigger } from '@/types/trigger'

interface TriggerState {
  triggers: Trigger[]
  addTrigger: (trigger: Trigger) => void
  removeTrigger: (id: string) => void
  updateTrigger: (id: string, updates: Partial<Trigger>) => void
  toggleTrigger: (id: string) => void
  setLastTriggered: (id: string) => void
}

export const useTriggerStore = create<TriggerState>()(
  persist(
    (set) => ({
      triggers: [],

      addTrigger: (trigger) =>
        set((state) => ({
          triggers: [...state.triggers, trigger],
        })),

      removeTrigger: (id) =>
        set((state) => ({
          triggers: state.triggers.filter((t) => t.id !== id),
        })),

      updateTrigger: (id, updates) =>
        set((state) => ({
          triggers: state.triggers.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      toggleTrigger: (id) =>
        set((state) => ({
          triggers: state.triggers.map((t) =>
            t.id === id ? { ...t, active: !t.active } : t
          ),
        })),

      setLastTriggered: (id) =>
        set((state) => ({
          triggers: state.triggers.map((t) =>
            t.id === id ? { ...t, lastTriggeredAt: new Date().toISOString() } : t
          ),
        })),
    }),
    {
      name: 'tradex-triggers',
    }
  )
)
