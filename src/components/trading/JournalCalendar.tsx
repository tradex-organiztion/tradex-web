'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

  // Generate calendar days
  const calendarDays: (number | null)[] = []

  // Previous month days
  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays.push(null) // null indicates previous month
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  // Fill remaining days
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null)
  }

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const formatDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const getTradesForDay = (day: number | null): TradeEntry[] => {
    if (day === null) return []
    return trades[formatDateKey(day)] || []
  }

  // Sample data for demonstration
  const sampleTrades: DayTrades = {
    [`${year}-${String(month + 1).padStart(2, '0')}-11`]: [
      { id: '1', pair: 'BTC/USDT', profit: 1250, profitPercent: 5.2 },
      { id: '2', pair: 'ETH/USDT', profit: -1250, profitPercent: -2.1 },
    ],
  }

  const displayTrades = Object.keys(trades).length > 0 ? trades : sampleTrades

  return (
    <div className="bg-white rounded-xl border border-line-normal">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-line-normal">
        <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
          <ChevronLeft className="w-5 h-5 text-label-assistive" />
        </Button>
        <span className="text-body-1-bold text-label-normal">
          {year}년 {month + 1}월
        </span>
        <Button variant="ghost" size="icon" onClick={goToNextMonth}>
          <ChevronRight className="w-5 h-5 text-label-assistive" />
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-line-normal">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={cn(
              "py-3 text-center text-body-2-medium",
              index === 5 || index === 6 ? "text-label-assistive" : "text-label-neutral"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayTrades = day !== null ? getTradesForDay(day) : []
          const isToday = day !== null &&
            new Date().getDate() === day &&
            new Date().getMonth() === month &&
            new Date().getFullYear() === year

          return (
            <div
              key={index}
              className={cn(
                "min-h-[100px] p-2 border-b border-r border-line-normal",
                index % 7 === 6 && "border-r-0",
                Math.floor(index / 7) === Math.floor((calendarDays.length - 1) / 7) && "border-b-0",
                day === null && "bg-gray-50"
              )}
              onClick={() => day !== null && onDateClick?.(new Date(year, month, day))}
            >
              {day !== null && (
                <>
                  <div className={cn(
                    "text-body-2-medium mb-1",
                    isToday ? "text-label-info" : "text-label-normal",
                    (index % 7 === 5 || index % 7 === 6) && "text-label-assistive"
                  )}>
                    {day === 1 ? `${month + 1}월 ${day}일` : day}
                  </div>
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
                          "w-1.5 h-1.5 rounded-full",
                          trade.profit >= 0 ? "bg-element-positive-default" : "bg-element-danger-default"
                        )} />
                        <span className="text-label-neutral truncate">{trade.pair}</span>
                        <span className={cn(
                          "font-medium",
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
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
