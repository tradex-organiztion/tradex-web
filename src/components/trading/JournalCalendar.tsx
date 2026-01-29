'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TradeEntry {
  id: string
  pair: string
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

  // Get next month info
  const nextMonth = month === 11 ? 0 : month + 1
  const nextMonthYear = month === 11 ? year + 1 : year

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

  // Next month days to fill remaining cells
  let nextMonthDay = 1
  while (calendarDays.length % 7 !== 0 || calendarDays.length < 35) {
    calendarDays.push({
      day: nextMonthDay,
      isCurrentMonth: false,
      isNextMonth: true,
    })
    nextMonthDay++
    if (calendarDays.length >= 42) break // Max 6 rows
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

  const getTradesForDay = (calendarDay: CalendarDay): TradeEntry[] => {
    if (!calendarDay.isCurrentMonth) return []
    return trades[formatDateKey(calendarDay.day)] || []
  }

  // Sample data for demonstration
  const sampleTrades: DayTrades = {
    [`${year}-${String(month + 1).padStart(2, '0')}-11`]: [
      { id: '1', pair: 'BTC/USDT', profit: 1250, profitPercent: 5.2 },
      { id: '2', pair: 'ETH/USDT', profit: -1250, profitPercent: -2.1 },
    ],
  }

  const displayTrades = Object.keys(trades).length > 0 ? trades : sampleTrades

  // Format day label
  const formatDayLabel = (calendarDay: CalendarDay): string => {
    if (calendarDay.isCurrentMonth && calendarDay.day === 1) {
      return `${month + 1}월 ${calendarDay.day}일`
    }
    if (calendarDay.isNextMonth && calendarDay.day === 1) {
      return `${nextMonth + 1}월 ${calendarDay.day}일`
    }
    return String(calendarDay.day)
  }

  return (
    <div>
      {/* Calendar Header - Outside the table */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-label-neutral" />
        </button>
        <span className="text-body-1-bold text-label-normal min-w-[120px] text-center">
          {year}년 {month + 1}월
        </span>
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-label-neutral" />
        </button>
      </div>

      {/* Calendar Table */}
      <div className="bg-white">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-line-normal">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-body-2-medium text-label-assistive"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((calendarDay, index) => {
            const dayTrades = calendarDay.isCurrentMonth
              ? (displayTrades[formatDateKey(calendarDay.day)] || [])
              : []
            const isToday = calendarDay.isCurrentMonth &&
              new Date().getDate() === calendarDay.day &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year
            const isLastRow = Math.floor(index / 7) === Math.floor((calendarDays.length - 1) / 7)
            const isLastCol = index % 7 === 6

            return (
              <div
                key={index}
                className={cn(
                  "min-h-[100px] p-2 border-b border-r border-line-normal",
                  isLastCol && "border-r-0",
                  isLastRow && "border-b-0"
                )}
                onClick={() => calendarDay.isCurrentMonth && onDateClick?.(new Date(year, month, calendarDay.day))}
              >
                {/* Day number - right aligned */}
                <div className={cn(
                  "text-body-2-medium mb-1 text-right",
                  !calendarDay.isCurrentMonth && "text-label-disabled",
                  calendarDay.isCurrentMonth && isToday && "text-label-info",
                  calendarDay.isCurrentMonth && !isToday && "text-label-normal"
                )}>
                  {formatDayLabel(calendarDay)}
                </div>

                {/* Trades for this day */}
                {calendarDay.isCurrentMonth && (
                  <div className="space-y-1">
                    {dayTrades.slice(0, 2).map((trade) => (
                      <div
                        key={trade.id}
                        className="flex items-center gap-1 text-caption-regular cursor-pointer hover:opacity-70"
                        onClick={(e) => {
                          e.stopPropagation()
                          onTradeClick?.(trade)
                        }}
                      >
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          trade.profit >= 0 ? "bg-element-positive-default" : "bg-element-danger-default"
                        )} />
                        <span className="text-label-neutral truncate">{trade.pair}</span>
                        <span className={cn(
                          "font-medium whitespace-nowrap",
                          trade.profit >= 0 ? "text-label-positive" : "text-label-danger"
                        )}>
                          {trade.profit >= 0 ? '+' : ''}{trade.profit.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {dayTrades.length > 2 && (
                      <div className="text-caption-regular text-label-assistive">
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
