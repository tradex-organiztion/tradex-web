'use client'

import { useState } from 'react'
import { Calendar, List, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JournalCalendar, JournalList, JournalForm } from '@/components/trading'
import type { JournalEntry } from '@/components/trading'
import { cn } from '@/lib/utils'

type ViewMode = 'calendar' | 'list'

// Sample data
const sampleEntries: JournalEntry[] = [
  {
    id: '1',
    date: '2025.12.11 14:30',
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
    date: '2025.12.11 14:32',
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
    date: '2025.12.11 14:36',
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
    date: '2025.12.11 14:36',
    pair: 'SOL/USDT',
    leverage: 10,
    position: 'Short',
    profit: -420,
    profitPercent: -8.2,
    hasPreScenario: false,
    hasPostReview: false,
  },
]

export default function JournalPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)

  const handleEntryClick = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setSelectedEntry(null)
    setIsFormOpen(true)
  }

  return (
    <div className="relative min-h-full">
      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        isFormOpen && "mr-[400px]"
      )}>
        {/* Page Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-title-1-bold text-label-normal">매매일지 관리</h1>
            <p className="text-body-2-regular text-label-assistive mt-1">
              성공적인 트레이딩을 위해 모든 매매를 기록하고 복기하세요.
            </p>
          </div>
          <Button
            className="bg-element-primary-default hover:bg-element-primary-pressed gap-2"
            onClick={handleAddNew}
          >
            <Plus className="w-4 h-4" />
            수동 추가하기
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant={viewMode === 'calendar' ? 'primary' : 'secondary'}
            size="sm"
            className={cn(
              "gap-2",
              viewMode === 'calendar'
                ? "bg-element-primary-default hover:bg-element-primary-pressed"
                : "border-line-normal text-label-neutral hover:bg-gray-50"
            )}
            onClick={() => setViewMode('calendar')}
          >
            <Calendar className="w-4 h-4" />
            캘린더 보기
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            size="sm"
            className={cn(
              "gap-2",
              viewMode === 'list'
                ? "bg-element-primary-default hover:bg-element-primary-pressed"
                : "border-line-normal text-label-neutral hover:bg-gray-50"
            )}
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
            리스트 보기
          </Button>
        </div>

        {/* Content */}
        {viewMode === 'calendar' ? (
          <JournalCalendar
            onTradeClick={(trade) => {
              // Find full entry from sample data
              const entry = sampleEntries.find(e => e.id === trade.id)
              if (entry) handleEntryClick(entry)
            }}
          />
        ) : (
          <JournalList
            entries={sampleEntries}
            onEntryClick={handleEntryClick}
          />
        )}
      </div>

      {/* Side Panel */}
      {isFormOpen && (
        <div className="fixed right-0 top-0 bottom-0 w-[400px] border-l border-line-normal shadow-heavy z-40">
          <JournalForm
            mode={selectedEntry ? 'edit' : 'create'}
            initialData={selectedEntry ? {
              date: selectedEntry.date,
              pair: selectedEntry.pair,
              leverage: selectedEntry.leverage,
              position: selectedEntry.position,
              profit: selectedEntry.profit,
              profitPercent: selectedEntry.profitPercent,
            } : undefined}
            onClose={() => setIsFormOpen(false)}
            onSubmit={(data) => {
              console.log('Submit:', data)
              setIsFormOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
