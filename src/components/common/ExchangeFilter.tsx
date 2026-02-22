'use client'

import { cn } from '@/lib/utils'

interface Exchange {
  id: string
  name: string
  icon: React.ReactNode
}

const EXCHANGES: Exchange[] = [
  {
    id: 'binance',
    name: '바이낸스',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="#F3BA2F" />
        <path d="M8 3L9.5 4.5L7 7L5.5 5.5L8 3Z" fill="white" />
        <path d="M9.5 4.5L12 7L10.5 8.5L8 6L9.5 4.5Z" fill="white" />
        <path d="M10.5 8.5L8 11L6.5 9.5L9 7L10.5 8.5Z" fill="white" />
        <path d="M6.5 9.5L4 7L5.5 5.5L8 8L6.5 9.5Z" fill="white" />
      </svg>
    ),
  },
  {
    id: 'bitget',
    name: '비트겟',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="#00F0FF" />
        <path d="M5 5.5L8 4L11 5.5V10.5L8 12L5 10.5V5.5Z" fill="white" />
      </svg>
    ),
  },
]

interface ExchangeFilterProps {
  selected?: string[]
  onChange?: (selected: string[]) => void
  className?: string
}

export function ExchangeFilter({ selected, onChange, className }: ExchangeFilterProps) {
  const selectedExchanges = selected || EXCHANGES.map((e) => e.id)

  const handleToggle = (id: string) => {
    if (!onChange) return
    if (selectedExchanges.includes(id)) {
      const next = selectedExchanges.filter((s) => s !== id)
      if (next.length > 0) onChange(next)
    } else {
      onChange([...selectedExchanges, id])
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {EXCHANGES.map((exchange) => {
        const isSelected = selectedExchanges.includes(exchange.id)
        return (
          <button
            key={exchange.id}
            onClick={() => handleToggle(exchange.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-body-2-medium transition-colors border",
              isSelected
                ? "border-line-normal bg-white text-label-normal"
                : "border-transparent bg-gray-100 text-label-assistive"
            )}
          >
            {exchange.icon}
            <span>{exchange.name}</span>
          </button>
        )
      })}
    </div>
  )
}
