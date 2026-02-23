'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
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
    icon: <Image src="/icons/icon-binance.png" alt="바이낸스" width={20} height={20} className="rounded-full" />,
  },
  {
    id: 'bybit',
    name: '바이비트',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill="#1E1E1E" />
        <path d="M6.5 5.5H9.5L13.5 12H10.5L6.5 5.5Z" fill="white" />
        <path d="M6.5 14.5H9.5L10.5 12H7.5L6.5 14.5Z" fill="white" />
      </svg>
    ),
  },
  {
    id: 'bitget',
    name: '비트겟',
    icon: <Image src="/icons/icon-bitget.png" alt="비트겟" width={20} height={20} className="rounded-full" />,
  },
]

interface ExchangeFilterProps {
  selected?: string[]
  onChange?: (selected: string[]) => void
  className?: string
}

export function ExchangeFilter({ selected, onChange, className }: ExchangeFilterProps) {
  const [open, setOpen] = useState(false)
  const [internalSelected, setInternalSelected] = useState('binance')
  const ref = useRef<HTMLDivElement>(null)

  const selectedId = selected?.[0] || internalSelected
  const selectedExchange = EXCHANGES.find((e) => e.id === selectedId) || EXCHANGES[0]

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleSelect = (id: string) => {
    setInternalSelected(id)
    onChange?.([id])
    setOpen(false)
  }

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-2-medium transition-colors",
          "border border-line-normal bg-white text-label-normal hover:bg-gray-50"
        )}
      >
        {selectedExchange.icon}
        <span>{selectedExchange.name}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={cn("transition-transform", open && "rotate-180")}
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-[160px] rounded-lg border border-line-normal bg-white shadow-normal z-50 py-1">
          {EXCHANGES.map((exchange) => {
            const isSelected = exchange.id === selectedId
            return (
              <button
                key={exchange.id}
                onClick={() => handleSelect(exchange.id)}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 text-body-2-medium transition-colors hover:bg-gray-50",
                  isSelected ? "text-label-normal" : "text-label-neutral"
                )}
              >
                {exchange.icon}
                <span className="flex-1 text-left">{exchange.name}</span>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
