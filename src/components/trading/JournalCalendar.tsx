'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TradeEntry {
  id: string
  pair: string
  position?: 'Long' | 'Short'
  timestamp?: string
  profit: number
  profitPercent: number
}

interface DayTrades {
  [key: string]: TradeEntry[]
}

interface JournalCalendarProps {
  trades?: DayTrades
  onDateClick?: (date: Date) => void
  onTradeClick?: (trade: TradeEntry) => void
  onMonthChange?: (year: number, month: number) => void
}

interface CalendarDay {
  day: number
  isCurrentMonth: boolean
  isNextMonth?: boolean
  isPrevMonth?: boolean
}

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']

export function JournalCalendar({ trades = {}, onDateClick, onTradeClick, onMonthChange }: JournalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // Get day of week (0 = Sunday, adjust for Monday start)
  let startDay = firstDayOfMonth.getDay() - 1
  if (startDay < 0) startDay = 6

  // Get days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  const prevMonth = month === 0 ? 11 : month - 1

  // Get next month info
  const nextMonth = month === 11 ? 0 : month + 1

  // Generate calendar days with prev/next month info
  const calendarDays: CalendarDay[] = []

  // Previous month days
  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      isPrevMonth: true,
    })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
    })
  }

  // Next month days to fill remaining cells (exactly 5 rows = 35 cells)
  let nextMonthDay = 1
  while (calendarDays.length < 35) {
    calendarDays.push({
      day: nextMonthDay,
      isCurrentMonth: false,
      isNextMonth: true,
    })
    nextMonthDay++
  }

  const goToPrevMonth = () => {
    const newDate = new Date(year, month - 1, 1)
    setCurrentDate(newDate)
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth())
  }

  const goToNextMonth = () => {
    const newDate = new Date(year, month + 1, 1)
    setCurrentDate(newDate)
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth())
  }

  const formatDateKey = (day: number, targetMonth?: number, targetYear?: number) => {
    const m = targetMonth ?? month
    const y = targetYear ?? year
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  // Today's date for highlighting
  const today = new Date()
  const isToday = (day: number) =>
    year === today.getFullYear() && month === today.getMonth() && day === today.getDate()

  // Sample data for demonstration
  const sampleTrades: DayTrades = {
    [`${year}-${String(month + 1).padStart(2, '0')}-11`]: [
      { id: '1', pair: 'BTCUSDT', position: 'Long', timestamp: '01:47:04', profit: 1250, profitPercent: 5.2 },
      { id: '2', pair: 'ETHUSDT', position: 'Short', timestamp: '14:32:00', profit: -428, profitPercent: -2.1 },
    ],
  }

  const displayTrades = Object.keys(trades).length > 0 ? trades : sampleTrades

  // Format day label - show "X월 1일" for first day of each month
  const _formatDayLabel = (calendarDay: CalendarDay): string => {
    if (calendarDay.isCurrentMonth && calendarDay.day === 1) {
      return `${month + 1}월 ${calendarDay.day}일`
    }
    if (calendarDay.isPrevMonth && calendarDay.day === 1) {
      return `${prevMonth + 1}월 ${calendarDay.day}일`
    }
    if (calendarDay.isNextMonth && calendarDay.day === 1) {
      return `${nextMonth + 1}월 ${calendarDay.day}일`
    }
    return String(calendarDay.day)
  }

  // Format profit number with commas
  const formatProfit = (profit: number): string => {
    const absProfit = Math.abs(profit)
    const formatted = absProfit.toLocaleString()
    return profit >= 0 ? `+${formatted}` : `-${formatted}`
  }

  const totalRows = Math.ceil(calendarDays.length / 7)

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Calendar Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={goToPrevMonth}
          className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="이전 달"
        >
          <ChevronLeft className="w-5 h-5 text-label-normal" strokeWidth={1.5} />
        </button>
        <span className="text-body-1-bold text-label-normal">
          {year}년 {month + 1}월
        </span>
        <button
          onClick={goToNextMonth}
          className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="다음 달"
        >
          <ChevronRight className="w-5 h-5 text-label-normal" strokeWidth={1.5} />
        </button>
      </div>

      {/* Calendar Table */}
      <div className="flex flex-col flex-1">
        {/* Weekday Headers - Figma: padding 2px 8px, justify-content center, flex 1 0 0 */}
        <div className="grid grid-cols-7 border-b border-gray-300">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-[2px] px-[8px] flex justify-center items-center"
            >
              <span className="text-body-2-regular text-label-neutral">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1">
          {calendarDays.map((calendarDay, index) => {
            const dayTrades = calendarDay.isCurrentMonth
              ? (displayTrades[formatDateKey(calendarDay.day)] || [])
              : []
            const rowIndex = Math.floor(index / 7)
            const colIndex = index % 7
            const isLastRow = rowIndex === totalRows - 1
            const isLastCol = colIndex === 6

            const isTodayCell = calendarDay.isCurrentMonth && isToday(calendarDay.day)

            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col bg-white px-2 py-1 min-h-[100px]",
                  "border-gray-300",
                  "border-t-[0.4px] border-l-[0.4px]",
                  isLastCol && "border-r-[0.4px]",
                  isLastRow && "border-b-[0.4px]"
                )}
              >
                {/* Day number - right aligned */}
                <div className="flex justify-end p-0.5">
                  {isTodayCell ? (
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white text-body-2-medium">
                      {calendarDay.day}
                    </span>
                  ) : (
                    <span className={cn(
                      "text-body-2-medium w-6 text-center",
                      calendarDay.isCurrentMonth ? "text-label-neutral" : "text-gray-400"
                    )}>
                      {calendarDay.day}
                    </span>
                  )}
                </div>

                {/* Trade entries - Figma: colored left bar + pair + profit */}
                {calendarDay.isCurrentMonth && dayTrades.length > 0 && (
                  <div className="flex flex-col gap-1 mt-1">
                    {dayTrades.slice(0, 2).map((trade) => {
                      const isPositive = trade.profit >= 0
                      return (
                        <div
                          key={trade.id}
                          className="px-1 py-0.5 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            onTradeClick?.(trade)
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {/* Colored left bar */}
                            <div className={cn(
                              "w-[3px] h-3 rounded-full shrink-0",
                              isPositive ? "bg-green-400" : "bg-red-400"
                            )} />
                            <div className="flex items-center gap-1 min-w-0">
                              <span className="text-caption-medium text-label-normal truncate">
                                {trade.pair.includes('/') ? trade.pair : `${trade.pair.replace('USDT', '')}/USDT`}
                              </span>
                              <span className={cn(
                                "text-body-2-bold whitespace-nowrap",
                                isPositive ? "text-green-400" : "text-red-400"
                              )}>
                                {formatProfit(trade.profit)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {dayTrades.length > 2 && (
                      <div className="text-caption-regular text-gray-500 px-1">
                        +{dayTrades.length - 2}개 더보기
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
