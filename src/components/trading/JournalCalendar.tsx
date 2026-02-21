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
}

interface CalendarDay {
  day: number
  isCurrentMonth: boolean
  isNextMonth?: boolean
  isPrevMonth?: boolean
}

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']

export function JournalCalendar({ trades = {}, onDateClick, onTradeClick }: JournalCalendarProps) {
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
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
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
  const formatDayLabel = (calendarDay: CalendarDay): string => {
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
      {/* Calendar Header - Figma: gap 16px between elements */}
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
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gray-50 rounded-t-lg border border-gray-200">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={cn(
                "py-2 px-2 flex justify-center items-center",
                index < 6 && "border-r border-gray-200"
              )}
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

            // Border classes based on position (Figma spec)
            const borderClasses = cn(
              "border-gray-200",
              "border-t",
              "border-l",
              isLastCol && "border-r",
              isLastRow && "border-b"
            )

            const isTodayCell = calendarDay.isCurrentMonth && isToday(calendarDay.day)

            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col bg-white px-2 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors min-h-[120px]",
                  borderClasses
                )}
                onClick={() => calendarDay.isCurrentMonth && onDateClick?.(new Date(year, month, calendarDay.day))}
              >
                {/* Day number - right aligned */}
                <div className={cn(
                  "text-body-2-medium text-right p-0.5",
                  isTodayCell
                    ? "text-element-positive-default font-bold"
                    : calendarDay.isCurrentMonth ? "text-label-neutral" : "text-gray-400"
                )}>
                  {formatDayLabel(calendarDay)}
                </div>

                {/* Trade cards for this day - Figma 상세 디자인 */}
                {calendarDay.isCurrentMonth && dayTrades.length > 0 && (
                  <div className="flex flex-col gap-1 mt-1">
                    {dayTrades.slice(0, 2).map((trade) => (
                      <div
                        key={trade.id}
                        className="rounded-md border border-gray-200 bg-white p-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          onTradeClick?.(trade)
                        }}
                      >
                        {/* Pair name + Position badge */}
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-caption-bold text-label-normal truncate">
                            {trade.pair}
                          </span>
                          {trade.position && (
                            <span className={cn(
                              "text-[10px] font-medium px-1 py-px rounded shrink-0",
                              trade.position === 'Long'
                                ? "bg-element-positive-lighter text-element-positive-default"
                                : "bg-element-danger-lighter text-element-danger-default"
                            )}>
                              {trade.position}
                            </span>
                          )}
                        </div>
                        {/* Timestamp */}
                        {trade.timestamp && (
                          <p className="text-[10px] text-gray-400 mb-0.5">{trade.timestamp}</p>
                        )}
                        {/* P&L */}
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400">Closed P&L</span>
                          <span className={cn(
                            "text-caption-bold",
                            trade.profit >= 0 ? "text-element-positive-default" : "text-element-danger-default"
                          )}>
                            {formatProfit(trade.profit)}
                          </span>
                        </div>
                      </div>
                    ))}
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
