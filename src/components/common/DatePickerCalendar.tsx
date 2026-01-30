'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DatePickerCalendarProps {
  value: string // YYYY-MM-DD 형식
  onChange: (date: string) => void
  placeholder?: string
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export function DatePickerCalendar({ value, onChange, placeholder = '날짜 선택' }: DatePickerCalendarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [year, month] = value.split('-').map(Number)
      return { year, month }
    }
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  })
  const containerRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 선택된 날짜 파싱
  const selectedDate = value ? {
    year: parseInt(value.split('-')[0]),
    month: parseInt(value.split('-')[1]),
    day: parseInt(value.split('-')[2])
  } : null

  // 해당 월의 첫 날과 마지막 날 계산
  const getMonthData = (year: number, month: number) => {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay() // 0 = 일요일

    // 이전 달 날짜
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year
    const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate()

    const days: { day: number; isCurrentMonth: boolean; year: number; month: number }[] = []

    // 이전 달 날짜 채우기
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        year: prevYear,
        month: prevMonth
      })
    }

    // 현재 달 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        year,
        month
      })
    }

    // 다음 달 날짜 채우기 (6주 = 42일로 맞추기)
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        year: nextYear,
        month: nextMonth
      })
    }

    // 5주만 필요한 경우
    if (days.length > 35 && days.slice(35).every(d => !d.isCurrentMonth)) {
      return days.slice(0, 35)
    }

    return days
  }

  const days = getMonthData(viewDate.year, viewDate.month)

  // 월 이동
  const goToPrevMonth = () => {
    setViewDate(prev => ({
      year: prev.month === 1 ? prev.year - 1 : prev.year,
      month: prev.month === 1 ? 12 : prev.month - 1
    }))
  }

  const goToNextMonth = () => {
    setViewDate(prev => ({
      year: prev.month === 12 ? prev.year + 1 : prev.year,
      month: prev.month === 12 ? 1 : prev.month + 1
    }))
  }

  // 날짜 선택
  const handleDateSelect = (day: { day: number; year: number; month: number }) => {
    const dateStr = `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`
    onChange(dateStr)
    setIsOpen(false)
  }

  // 날짜가 선택된 날짜인지 확인
  const isSelected = (day: { day: number; year: number; month: number }) => {
    if (!selectedDate) return false
    return day.year === selectedDate.year &&
           day.month === selectedDate.month &&
           day.day === selectedDate.day
  }

  // 주 단위로 분리
  const weeks: typeof days[] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  // 표시용 날짜 포맷
  const displayValue = value || placeholder

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 border border-line-normal rounded-lg bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-body-2-regular text-label-normal min-w-[80px] text-left">
          {displayValue}
        </span>
        <Calendar className="w-4 h-4 text-label-assistive" />
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl border border-gray-300 shadow-normal">
          {/* Header */}
          <div className="relative">
            {/* Background with blur effect */}
            <div className="absolute inset-0 bg-white/[0.88] backdrop-blur-[64px] rounded-t-xl" />

            {/* Navigation */}
            <div className="relative px-3 pt-5 pb-2.5">
              <div className="flex items-center justify-between">
                {/* Prev Button */}
                <button
                  onClick={goToPrevMonth}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>

                {/* Month/Year */}
                <span className="text-body-2-bold text-gray-800">
                  {viewDate.year}년 {viewDate.month}월
                </span>

                {/* Next Button */}
                <button
                  onClick={goToNextMonth}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="relative px-3 pb-2">
              <div className="flex">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="w-7 h-7 flex items-center justify-center"
                  >
                    <span className="text-caption-regular text-gray-500">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Body */}
          <div className="px-3 pb-3.5">
            <div className="flex flex-col gap-0.5">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex">
                  {week.map((day, dayIndex) => (
                    <button
                      key={`${weekIndex}-${dayIndex}`}
                      onClick={() => handleDateSelect(day)}
                      className={cn(
                        "w-7 h-7 flex items-center justify-center rounded-full text-caption-regular transition-colors",
                        isSelected(day)
                          ? "bg-gray-800 text-white"
                          : day.isCurrentMonth
                            ? "text-gray-800 hover:bg-gray-100"
                            : "text-gray-400 hover:bg-gray-50"
                      )}
                    >
                      {day.day}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
