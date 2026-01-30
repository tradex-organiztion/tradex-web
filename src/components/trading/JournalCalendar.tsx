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

  // Sample data for demonstration
  const sampleTrades: DayTrades = {
    [`${year}-${String(month + 1).padStart(2, '0')}-11`]: [
      { id: '1', pair: 'BTC/USDT', profit: 1250000, profitPercent: 5.2 },
      { id: '2', pair: 'ETH/USDT', profit: -1250, profitPercent: -2.1 },
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
          <ChevronLeft className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
        </button>
        <span className="text-body-1-bold text-gray-800">
          {year}년 {month + 1}월
        </span>
        <button
          onClick={goToNextMonth}
          className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="다음 달"
        >
          <ChevronRight className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
        </button>
      </div>

      {/* Calendar Table */}
      <div className="flex flex-col flex-1">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gray-100 rounded-t-lg">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={cn(
                "py-1 px-2 flex justify-center items-center",
                index < 6 && "border-r border-gray-300/40"
              )}
            >
              <span className="text-body-2-regular text-gray-600">{day}</span>
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
              "border-gray-300/40",
              // Top border for all cells
              "border-t",
              // Left border for all cells
              "border-l",
              // Right border only for last column
              isLastCol && "border-r",
              // Bottom border only for last row
              isLastRow && "border-b"
            )

            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col bg-white px-2 py-1 cursor-pointer hover:bg-gray-50 transition-colors min-h-[100px]",
                  borderClasses
                )}
                onClick={() => calendarDay.isCurrentMonth && onDateClick?.(new Date(year, month, calendarDay.day))}
              >
                {/* Day number - right aligned */}
                <div className={cn(
                  "text-body-2-medium text-right p-0.5",
                  calendarDay.isCurrentMonth ? "text-gray-600" : "text-gray-400"
                )}>
                  {formatDayLabel(calendarDay)}
                </div>

                {/* Trade cards for this day */}
                {calendarDay.isCurrentMonth && dayTrades.length > 0 && (
                  <div className="flex flex-col gap-0.5 mt-auto">
                    {dayTrades.slice(0, 2).map((trade) => (
                      <div
                        key={trade.id}
                        className={cn(
                          "rounded py-0.5 px-1 cursor-pointer hover:opacity-80 transition-opacity",
                          trade.profit >= 0 ? "bg-gray-100" : "bg-red-100"
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onTradeClick?.(trade)
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {/* Color dot */}
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            trade.profit >= 0 ? "bg-green-400" : "bg-red-400"
                          )} />
                          {/* Coin name and profit */}
                          <div className="flex items-center gap-1 flex-1 min-w-0">
                            <span className="text-caption-medium text-gray-800 truncate">
                              {trade.pair}
                            </span>
                            <span className={cn(
                              "text-body-2-bold whitespace-nowrap",
                              trade.profit >= 0 ? "text-green-400" : "text-red-400"
                            )}>
                              {formatProfit(trade.profit)}
                            </span>
                          </div>
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
