'use client'

import { cn } from '@/lib/utils'

export interface JournalEntry {
  id: string
  date: string
  pair: string
  leverage: number
  position: 'Long' | 'Short'
  profit: number
  profitPercent: number
  hasPreScenario: boolean
  hasPostReview: boolean
}

interface JournalListProps {
  entries: JournalEntry[]
  onEntryClick?: (entry: JournalEntry) => void
}

// Coin icon colors
const COIN_COLORS: Record<string, { bg: string; text: string }> = {
  BTC: { bg: 'bg-[#F7931A]', text: 'text-white' },
  ETH: { bg: 'bg-[#627EEA]', text: 'text-white' },
  SOL: { bg: 'bg-gradient-to-br from-[#9945FF] to-[#14F195]', text: 'text-white' },
  XRP: { bg: 'bg-[#23292F]', text: 'text-white' },
  BNB: { bg: 'bg-[#F3BA2F]', text: 'text-black' },
  ADA: { bg: 'bg-[#0033AD]', text: 'text-white' },
  DOGE: { bg: 'bg-[#C2A633]', text: 'text-white' },
  DEFAULT: { bg: 'bg-gray-400', text: 'text-white' },
}

function CoinIcon({ pair }: { pair: string }) {
  const coinSymbol = pair.split('/')[0]
  const colors = COIN_COLORS[coinSymbol] || COIN_COLORS.DEFAULT
  const initial = coinSymbol.charAt(0)

  return (
    <div className={cn(
      "w-6 h-6 rounded-full flex items-center justify-center text-caption-bold",
      colors.bg,
      colors.text
    )}>
      {initial}
    </div>
  )
}

// Sample data
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
    pair: 'BTC/USDT',
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
    pair: 'ETH/USDT',
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

export function JournalList({ entries = sampleEntries, onEntryClick }: JournalListProps) {
  return (
    <div className="bg-white overflow-hidden">
      {/* Table Header - Figma: padding 4px 16px, gap 16px, border-radius 8px 8px 0 0, bg #F1F1F1 */}
      <div className="grid grid-cols-7 gap-4 px-4 py-1 rounded-t-lg bg-gray-100">
        <div className="text-body-2-medium text-label-assistive">날짜</div>
        <div className="text-body-2-medium text-label-assistive">거래소</div>
        <div className="text-body-2-medium text-label-assistive">거래 종목</div>
        <div className="text-body-2-medium text-label-assistive">포지션</div>
        <div className="text-body-2-medium text-label-assistive">손익</div>
        <div className="text-body-2-medium text-label-assistive">사전 시나리오</div>
        <div className="text-body-2-medium text-label-assistive">매매 후 복기</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-line-normal">
        {entries.map((entry, index) => (
          <div
            key={entry.id ?? `entry-${index}`}
            className="grid grid-cols-7 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors items-center"
            onClick={() => onEntryClick?.(entry)}
          >
            {/* Date */}
            <div className="text-body-2-regular text-label-normal">
              {entry.date}
            </div>

            {/* Exchange */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#F3BA2F] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L7.5 2.5L4.5 5.5L3 4L6 1Z" fill="white"/>
                  <path d="M7.5 2.5L11 6L9.5 7.5L6 4L7.5 2.5Z" fill="white"/>
                  <path d="M9.5 7.5L6 11L4.5 9.5L8 6L9.5 7.5Z" fill="white"/>
                  <path d="M4.5 9.5L1 6L2.5 4.5L6 8L4.5 9.5Z" fill="white"/>
                </svg>
              </div>
              <span className="text-body-2-regular text-label-normal">바이낸스</span>
            </div>

            {/* Trading Pair with Coin Icon */}
            <div className="flex items-center gap-2">
              <CoinIcon pair={entry.pair} />
              <span className="text-body-2-medium text-label-normal">{entry.pair}</span>
            </div>

            {/* Position - Filled pill style */}
            <div>
              <span className={cn(
                "inline-flex items-center px-3 py-1 rounded text-body-2-medium",
                entry.position === 'Long'
                  ? "bg-element-positive-lighter text-element-positive-default"
                  : "bg-element-danger-lighter text-element-danger-default"
              )}>
                {entry.position}
              </span>
            </div>

            {/* Profit/Loss */}
            <div className={cn(
              "text-body-2-bold",
              entry.profit >= 0 ? "text-label-positive" : "text-label-danger"
            )}>
              {entry.profit >= 0 ? '+' : ''}{entry.profit.toLocaleString()}({entry.profitPercent}%)
            </div>

            {/* Pre-Scenario Status */}
            <div>
              {entry.hasPreScenario ? (
                <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-caption-medium text-label-neutral">
                  작성 완료
                </span>
              ) : (
                <span className="text-body-2-regular text-label-assistive">-</span>
              )}
            </div>

            {/* Post-Review Status */}
            <div>
              {entry.hasPostReview ? (
                <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-caption-medium text-label-neutral">
                  작성 완료
                </span>
              ) : (
                <span className="text-body-2-regular text-label-assistive">-</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {entries.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-body-1-regular text-label-assistive">
            등록된 매매일지가 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}
