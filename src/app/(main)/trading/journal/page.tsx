'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calendar, List, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JournalCalendar, JournalList, JournalForm } from '@/components/trading'
import type { JournalEntry } from '@/components/trading'
import { cn } from '@/lib/utils'
import { journalApi } from '@/lib/api/trading'
import type { JournalResponse } from '@/lib/api/trading'
import { useAuthStore } from '@/stores'

type ViewMode = 'calendar' | 'list'

// Sample data for demo mode
const _today = new Date()
const _fmtDate = (d: Date, h: number, m: number) => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
const sampleEntries: JournalEntry[] = [
  {
    id: '1',
    date: _fmtDate(_today, 14, 30),
    pair: 'BTC/USDT',
    leverage: 20,
    position: 'Long',
    profit: 1250,
    profitPercent: 24.5,
    hasPreScenario: true,
    hasPostReview: false,
  },
  {
    id: '2',
    date: _fmtDate(_today, 14, 32),
    pair: 'ETH/USDT',
    leverage: 10,
    position: 'Short',
    profit: -420,
    profitPercent: -8.2,
    hasPreScenario: true,
    hasPostReview: false,
  },
  {
    id: '3',
    date: _fmtDate(_today, 14, 36),
    pair: 'SOL/USDT',
    leverage: 10,
    position: 'Short',
    profit: -420,
    profitPercent: -8.2,
    hasPreScenario: true,
    hasPostReview: false,
  },
  {
    id: '4',
    date: _fmtDate(_today, 14, 36),
    pair: 'SOL/USDT',
    leverage: 10,
    position: 'Short',
    profit: -420,
    profitPercent: -8.2,
    hasPreScenario: false,
    hasPostReview: false,
  },
]

/** JournalResponse → JournalEntry 변환 */
function toJournalEntry(j: JournalResponse, index: number): JournalEntry {
  const date = j.entryTime
    ? new Date(j.entryTime).toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      }).replace(/\./g, '.').replace(',', '')
    : ''

  return {
    id: j.journalId != null ? String(j.journalId) : `entry-${index}`,
    date,
    pair: j.symbol?.includes('/') ? j.symbol : `${j.symbol?.replace('USDT', '')}/USDT`,
    leverage: j.leverage ?? 1,
    position: j.side === 'LONG' ? 'Long' : 'Short',
    profit: j.realizedPnl ?? 0,
    profitPercent: j.roi ?? 0,
    hasPreScenario: !!j.entryScenario,
    hasPostReview: !!j.exitReview,
  }
}

export default function JournalPage() {
  const searchParams = useSearchParams()
  const { isDemoMode } = useAuthStore()

  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [selectedJournalId, setSelectedJournalId] = useState<number | null>(null)

  // 기간 필터 상태
  const now = new Date()
  const [calYear, setCalYear] = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth()) // 0-indexed

  // API data
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(!isDemoMode)

  const displayEntries = isDemoMode ? sampleEntries : entries

  /** 해당 월의 startDate/endDate를 yyyy-MM-dd 형식으로 반환 */
  const getMonthRange = useCallback((y: number, m: number) => {
    const startDate = `${y}-${String(m + 1).padStart(2, '0')}-01`
    const lastDay = new Date(y, m + 1, 0).getDate()
    const endDate = `${y}-${String(m + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
    return { startDate, endDate }
  }, [])

  // Fetch journals from API with date range
  const fetchJournals = useCallback(async () => {
    if (isDemoMode) return
    setIsLoading(true)
    const { startDate, endDate } = getMonthRange(calYear, calMonth)
    const data = await journalApi.getAll({ page: 0, size: 100, startDate, endDate }).catch((err) => {
      console.warn('Journal fetch error:', err.message)
      return null
    })
    if (data && data.content) {
      setEntries(data.content.map(toJournalEntry))
    }
    setIsLoading(false)
  }, [isDemoMode, calYear, calMonth, getMonthRange])

  useEffect(() => {
    if (isDemoMode) return
    let cancelled = false
    void (async () => {
      setIsLoading(true)
      const { startDate, endDate } = getMonthRange(calYear, calMonth)
      const data = await journalApi.getAll({ page: 0, size: 100, startDate, endDate }).catch((err) => {
        console.warn('Journal fetch error:', err.message)
        return null
      })
      if (cancelled) return
      if (data && data.content) {
        setEntries(data.content.map(toJournalEntry))
      }
      setIsLoading(false)
    })()
    return () => { cancelled = true }
  }, [isDemoMode, calYear, calMonth, getMonthRange])

  // Handle redirect query params for initial state
  const initialFromParams = useMemo(() => {
    const action = searchParams.get('action')
    const entryId = searchParams.get('entry')

    if (action === 'new') {
      return { isOpen: true, entry: null }
    }
    if (entryId) {
      const entry = displayEntries.find(e => e.id === entryId)
      if (entry) return { isOpen: true, entry }
    }
    return { isOpen: false, entry: null }
  }, [searchParams, displayEntries])

  // Apply initial params once
  const initialApplied = useRef(false)
  useEffect(() => {
    if (initialApplied.current) return
    if (initialFromParams.isOpen) {
      initialApplied.current = true
      // Use microtask to avoid synchronous setState in effect
      queueMicrotask(() => {
        setIsFormOpen(true)
        setSelectedEntry(initialFromParams.entry)
        if (initialFromParams.entry) {
          setSelectedJournalId(Number(initialFromParams.entry.id) || null)
        }
      })
    }
  }, [initialFromParams])

  const handleEntryClick = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setSelectedJournalId(Number(entry.id) || null)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setSelectedEntry(null)
    setSelectedJournalId(null)
    setIsFormOpen(true)
  }

  const _handleDelete = async (entry: JournalEntry) => {
    if (isDemoMode) return
    const id = Number(entry.id)
    if (!id) return
    const result = await journalApi.delete(id).catch((err) => {
      console.warn('Journal delete error:', err.message)
      return null
    })
    if (result !== null) {
      fetchJournals()
      setIsFormOpen(false)
    }
  }

  const handleFormSave = () => {
    fetchJournals()
    setIsFormOpen(false)
  }

  // Build DayTrades for calendar from entries
  const calendarTrades = useMemo(() => {
    const trades: Record<string, Array<{
      id: string
      pair: string
      position?: 'Long' | 'Short'
      timestamp?: string
      profit: number
      profitPercent: number
    }>> = {}

    for (const entry of displayEntries) {
      // Parse date to get YYYY-MM-DD key
      let dateKey: string
      try {
        const d = new Date(entry.date.replace(/\./g, '-').replace(' ', 'T'))
        if (!isNaN(d.getTime())) {
          dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        } else {
          continue
        }
      } catch {
        continue
      }

      if (!trades[dateKey]) trades[dateKey] = []
      trades[dateKey].push({
        id: entry.id,
        pair: entry.pair.replace('/', ''),
        position: entry.position,
        timestamp: entry.date.split(' ')[1] || undefined,
        profit: entry.profit,
        profitPercent: entry.profitPercent,
      })
    }

    return trades
  }, [displayEntries])

  return (
    <div className="relative min-h-full">
      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        isFormOpen && "mr-[549px]"
      )}>
        {/* Page Header - Figma: gap 8px between title/subtitle */}
        <div className="mb-8">
          <h1 className="text-title-1-bold text-label-normal">매매일지 관리</h1>
          <p className="text-body-1-regular text-label-neutral mt-2">
            성공적인 트레이딩을 위해 모든 매매를 기록하고 복기하세요.
          </p>
        </div>

        {/* View Mode Toggle + Add Button */}
        <div className="flex items-center justify-between mb-4">
          {/* Pill-style segmented toggle - Figma: wrapper padding 2px, border-radius 9999px */}
          <div className="flex items-center rounded-full p-[2px]">
            <button
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-full text-body-2-medium transition-colors",
                viewMode === 'calendar'
                  ? "bg-gray-200 text-label-normal"
                  : "text-gray-400 hover:text-label-neutral"
              )}
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="w-4 h-4" />
              캘린더 보기
            </button>
            <button
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-full text-body-2-medium transition-colors",
                viewMode === 'list'
                  ? "bg-gray-200 text-label-normal"
                  : "text-gray-400 hover:text-label-neutral"
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
              리스트 보기
            </button>
          </div>
          <Button
            className="bg-element-primary-default hover:bg-element-primary-pressed gap-1 text-body-2-medium rounded-[4px] px-2 py-2 h-auto"
            onClick={handleAddNew}
          >
            <Plus className="w-4 h-4" />
            수동 추가하기
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && !isDemoMode && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2 text-label-assistive">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              <span className="text-body-1-regular">매매일지를 불러오는 중...</span>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <>
            {viewMode === 'calendar' ? (
              <JournalCalendar
                trades={calendarTrades}
                onTradeClick={(trade) => {
                  const entry = displayEntries.find(e => e.id === trade.id)
                  if (entry) handleEntryClick(entry)
                }}
                onMonthChange={(year, month) => {
                  setCalYear(year)
                  setCalMonth(month)
                }}
              />
            ) : (
              <JournalList
                entries={displayEntries}
                onEntryClick={handleEntryClick}
              />
            )}
          </>
        )}
      </div>

      {/* Side Panel */}
      {isFormOpen && (
        <div className="fixed right-0 top-0 bottom-0 w-full border-l border-line-normal shadow-emphasize z-40 md:w-[549px]">
          <JournalForm
            journalId={selectedJournalId}
            initialData={selectedEntry ? {
              date: selectedEntry.date,
              pair: selectedEntry.pair,
              leverage: selectedEntry.leverage,
              position: selectedEntry.position,
              pnl: selectedEntry.profit >= 0 ? `+${selectedEntry.profit.toLocaleString()}` : selectedEntry.profit.toLocaleString(),
              pnlPercent: String(selectedEntry.profitPercent),
              result: selectedEntry.profit >= 0 ? 'Win' : 'Lose',
            } : undefined}
            onClose={() => setIsFormOpen(false)}
            onSave={handleFormSave}
          />
        </div>
      )}
    </div>
  )
}
