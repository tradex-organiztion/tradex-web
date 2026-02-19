'use client'

import { useState } from 'react'
import { ChevronsRight, Plus, ChevronDown, ChevronUp, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { positionsApi, ordersApi } from '@/lib/api/futures'
import { journalApi } from '@/lib/api/trading'
import type { UpdateJournalRequest } from '@/lib/api/trading'
import { useAuthStore } from '@/stores'

interface JournalFormProps {
  journalId?: number | null
  initialData?: Partial<JournalFormData>
  onClose?: () => void
  onSave?: () => void
}

export interface JournalFormData {
  date: string
  pair: string
  leverage: number
  position: 'Long' | 'Short'
  quantity: string
  holdTime: string
  entryPrice: string
  exitPrice: string
  pnl: string
  pnlPercent: string
  result: string
  entryTime: string
  exitTime: string
  entryVolume: string
  exitVolume: string
  entryFee: string
  exitFee: string
  fundingFee: string
  indicators: string[]
  timeframes: string[]
  technicalAnalysis: string[]
  targetTP: string
  targetSL: string
  entryReason: string
  scenario: string
  review: string
}

type TabType = 'pre-scenario' | 'post-review'
type InputMode = 'auto' | 'manual'

// 사용 가능한 지표 목록
const availableIndicators = [
  'RSI', 'MACD', 'Bollinger Bands', 'EMA', 'SMA', 'Stochastic',
  'ATR', 'Volume Profile', 'Fibonacci', 'Ichimoku', 'VWAP', 'OBV',
]

// 사용 가능한 타임프레임
const availableTimeframes = [
  '1분', '3분', '5분', '15분', '30분', '1시간', '2시간', '4시간', '1일', '1주',
]

// 사용 가능한 기술적 분석
const availableTechnicalAnalysis = [
  '지지선/저항선', '추세선', '패턴 분석', '캔들 패턴', '다이버전스',
  '피보나치 되돌림', '엘리어트 파동', '하모닉 패턴',
]

// 자동입력용 거래 목록 (거래소에서 가져온 데이터 시뮬레이션)
const autoImportTrades = [
  { id: 'auto-1', pair: 'BTC/USDT', position: 'Long' as const, leverage: 20, entryPrice: '98,200', exitPrice: '99,400', pnl: '+1,250', time: '2025.12.11 14:30' },
  { id: 'auto-2', pair: 'ETH/USDT', position: 'Short' as const, leverage: 10, entryPrice: '3,450', exitPrice: '3,520', pnl: '-420', time: '2025.12.11 15:20' },
  { id: 'auto-3', pair: 'SOL/USDT', position: 'Long' as const, leverage: 5, entryPrice: '185.20', exitPrice: '190.50', pnl: '+530', time: '2025.12.10 09:15' },
]

// 태그 선택 컴포넌트
function TagSelector({
  label,
  selectedItems,
  availableItems,
  onAdd,
  onRemove,
}: {
  label: string
  selectedItems: string[]
  availableItems: string[]
  onAdd: (item: string) => void
  onRemove: (item: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = availableItems.filter(
    item => !selectedItems.includes(item) && item.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-2">
      <label className="text-body-1-medium text-label-normal block">{label}</label>

      {/* Selected Tags */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedItems.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-body-2-medium text-label-normal"
            >
              {item}
              <button
                onClick={() => onRemove(item)}
                className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add Button / Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center gap-1 px-3 py-2 border border-line-normal rounded-lg text-body-1-medium text-label-normal hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          추가
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => { setIsOpen(false); setSearchQuery('') }} />
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-line-normal rounded-lg shadow-emphasize z-20 max-h-[240px] overflow-hidden">
              {/* Search */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-line-normal">
                <Search className="w-4 h-4 text-label-assistive" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색..."
                  className="flex-1 text-body-2-regular text-label-normal placeholder:text-label-disabled focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Options */}
              <div className="overflow-y-auto max-h-[180px]">
                {filteredItems.length === 0 ? (
                  <p className="px-3 py-2 text-body-2-regular text-label-assistive">항목이 없습니다</p>
                ) : (
                  filteredItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        onAdd(item)
                        setSearchQuery('')
                      }}
                      className="w-full text-left px-3 py-2 text-body-2-regular text-label-normal hover:bg-gray-50 transition-colors"
                    >
                      {item}
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function JournalForm({ journalId, initialData, onClose, onSave }: JournalFormProps) {
  const { isDemoMode } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabType>('pre-scenario')
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [inputMode, setInputMode] = useState<InputMode>(initialData ? 'auto' : 'manual')
  const [showAutoImport, setShowAutoImport] = useState(false)
  const [showOrderAdd, setShowOrderAdd] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Order form state
  const [orderPrice, setOrderPrice] = useState('')
  const [orderQuantity, setOrderQuantity] = useState('')
  const [orderTime, setOrderTime] = useState('')
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY')

  const [formData, setFormData] = useState<Partial<JournalFormData>>({
    date: '2025.12.11 14:30',
    pair: 'BTC/USDT',
    leverage: 20,
    position: 'Long',
    quantity: '0.05',
    holdTime: '2시간 43분',
    entryPrice: '98,200',
    exitPrice: '99,400',
    pnl: '+1,250',
    pnlPercent: '24.5',
    result: 'Win',
    entryTime: '2025.12.11 14:30',
    exitTime: '2025.12.11 17:13',
    entryVolume: '4,910',
    exitVolume: '4,970',
    entryFee: '-0.98',
    exitFee: '-0.99',
    fundingFee: '-0.98',
    indicators: [],
    timeframes: [],
    technicalAnalysis: [],
    targetTP: '',
    targetSL: '',
    entryReason: '',
    scenario: '',
    review: '',
    ...initialData,
  })

  const isPositive = formData.pnl ? !formData.pnl.startsWith('-') : true
  const hasTradeData = formData.pair && formData.entryPrice
  const isEditMode = !!journalId

  // 자동입력 선택
  const handleAutoImport = (trade: typeof autoImportTrades[0]) => {
    setFormData(prev => ({
      ...prev,
      pair: trade.pair,
      position: trade.position,
      leverage: trade.leverage,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice,
      pnl: trade.pnl,
      date: trade.time,
      result: trade.pnl.startsWith('+') ? 'Win' : 'Lose',
    }))
    setShowAutoImport(false)
  }

  /** 새 매매일지 생성: positionsApi.create() → 서버가 저널 자동 생성 */
  const handleCreateNew = async () => {
    if (isDemoMode) {
      onSave?.()
      return
    }

    setIsSaving(true)
    setSaveError(null)

    const symbol = formData.pair?.replace('/', '') || 'BTCUSDT'
    const side = formData.position === 'Short' ? 'SHORT' as const : 'LONG' as const
    const entryPrice = parseFloat(String(formData.entryPrice).replace(/,/g, '')) || 0
    const size = parseFloat(String(formData.quantity).replace(/,/g, '')) || 0
    const leverage = formData.leverage || 1

    const result = await positionsApi.create({
      symbol,
      side,
      leverage,
      entryPrice,
      size,
    }).catch((err) => {
      console.warn('Position create error:', err.message)
      setSaveError('포지션 생성에 실패했습니다. 다시 시도해주세요.')
      return null
    })

    if (result) {
      onSave?.()
    }
    setIsSaving(false)
  }

  /** 기존 매매일지 수정: journalApi.update() */
  const handleUpdateJournal = async () => {
    if (isDemoMode || !journalId) {
      onSave?.()
      return
    }

    setIsSaving(true)
    setSaveError(null)

    const updateData: UpdateJournalRequest = {
      memo: formData.scenario,
      review: formData.review,
      preScenario: formData.scenario,
      entryReason: formData.entryReason,
      indicators: formData.indicators,
      timeframes: formData.timeframes,
      technicalAnalysis: formData.technicalAnalysis,
      targetTP: formData.targetTP,
      targetSL: formData.targetSL,
    }

    const result = await journalApi.update(journalId, updateData).catch((err) => {
      console.warn('Journal update error:', err.message)
      setSaveError('매매일지 수정에 실패했습니다. 다시 시도해주세요.')
      return null
    })

    if (result) {
      onSave?.()
    }
    setIsSaving(false)
  }

  const handleSave = () => {
    if (isEditMode) {
      handleUpdateJournal()
    } else {
      handleCreateNew()
    }
  }

  // 주문 추가 핸들러
  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isDemoMode || !journalId) {
      setShowOrderAdd(false)
      return
    }

    // journalId를 positionId로 사용 (서버에서 매핑)
    const price = parseFloat(orderPrice.replace(/,/g, '')) || 0
    const quantity = parseFloat(orderQuantity.replace(/,/g, '')) || 0

    if (!price || !quantity) return

    const result = await ordersApi.create(journalId, {
      side: orderType,
      type: 'MARKET',
      price,
      quantity,
      executedAt: orderTime || undefined,
    }).catch((err) => {
      console.warn('Order create error:', err.message)
      return null
    })

    if (result) {
      setShowOrderAdd(false)
      setOrderPrice('')
      setOrderQuantity('')
      setOrderTime('')
      onSave?.()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Bar */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-line-normal">
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
          <ChevronsRight className="w-5 h-5 text-label-neutral" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-8 space-y-6">
          {/* Title Section */}
          <div className="space-y-1">
            <h2 className="text-title-1-bold text-label-normal">
              {isEditMode ? '매매일지 수정' : '매매일지 작성'}
            </h2>
            <p className="text-body-2-regular text-label-assistive">{formData.date}</p>
          </div>

          {/* Input Mode Toggle (only for new entries) */}
          {!isEditMode && (
            <div className="flex gap-2">
              <button
                onClick={() => setInputMode('auto')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-body-2-medium transition-colors border",
                  inputMode === 'auto'
                    ? "border-gray-800 bg-gray-900 text-white"
                    : "border-line-normal text-label-normal hover:bg-gray-50"
                )}
              >
                자동입력
              </button>
              <button
                onClick={() => setInputMode('manual')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-body-2-medium transition-colors border",
                  inputMode === 'manual'
                    ? "border-gray-800 bg-gray-900 text-white"
                    : "border-line-normal text-label-normal hover:bg-gray-50"
                )}
              >
                수동입력
              </button>
            </div>
          )}

          {/* Auto Import Dropdown */}
          {!isEditMode && inputMode === 'auto' && (
            <div className="relative">
              <button
                onClick={() => setShowAutoImport(!showAutoImport)}
                className="w-full flex items-center justify-between px-4 py-3 border border-line-normal rounded-lg text-body-1-regular text-label-normal hover:bg-gray-50 transition-colors"
              >
                <span>거래소에서 가져오기</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", showAutoImport && "rotate-180")} />
              </button>

              {showAutoImport && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowAutoImport(false)} />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-line-normal rounded-lg shadow-emphasize z-20 max-h-[300px] overflow-y-auto">
                    {autoImportTrades.map((trade) => (
                      <button
                        key={trade.id}
                        onClick={() => handleAutoImport(trade)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-line-normal last:border-b-0"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-body-2-bold text-label-normal">{trade.pair}</span>
                            <span className={cn(
                              "px-1.5 py-0.5 rounded text-caption-medium",
                              trade.position === 'Long'
                                ? "bg-element-positive-lighter text-element-positive-default"
                                : "bg-element-danger-lighter text-element-danger-default"
                            )}>
                              {trade.position}
                            </span>
                            <span className="text-caption-regular text-label-assistive">x{trade.leverage}</span>
                          </div>
                          <span className={cn(
                            "text-body-2-bold",
                            trade.pnl.startsWith('+') ? "text-element-positive-default" : "text-element-danger-default"
                          )}>
                            {trade.pnl}
                          </span>
                        </div>
                        <p className="text-caption-regular text-label-assistive">{trade.time}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Manual Input Form */}
          {!isEditMode && inputMode === 'manual' && !hasTradeData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-body-1-medium text-label-normal block">거래쌍</label>
                  <input
                    type="text"
                    placeholder="BTC/USDT"
                    className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    value={formData.pair || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, pair: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-body-1-medium text-label-normal block">레버리지</label>
                  <input
                    type="number"
                    placeholder="20"
                    className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    value={formData.leverage || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, leverage: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-body-1-medium text-label-normal block">포지션</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, position: 'Long' }))}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-body-2-medium transition-colors border",
                      formData.position === 'Long'
                        ? "border-element-positive-default bg-element-positive-lighter text-element-positive-default"
                        : "border-line-normal text-label-normal hover:bg-gray-50"
                    )}
                  >
                    Long
                  </button>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, position: 'Short' }))}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-body-2-medium transition-colors border",
                      formData.position === 'Short'
                        ? "border-element-danger-default bg-element-danger-lighter text-element-danger-default"
                        : "border-line-normal text-label-normal hover:bg-gray-50"
                    )}
                  >
                    Short
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-body-1-medium text-label-normal block">진입가</label>
                  <input
                    type="text"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    value={formData.entryPrice || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-body-1-medium text-label-normal block">청산가</label>
                  <input
                    type="text"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    value={formData.exitPrice || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, exitPrice: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-body-1-medium text-label-normal block">수량</label>
                  <input
                    type="text"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    value={formData.quantity || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-body-1-medium text-label-normal block">손익</label>
                  <input
                    type="text"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    value={formData.pnl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, pnl: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Trade Summary Card */}
          {hasTradeData && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-bold">₿</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-title-2-bold text-label-normal">{formData.pair}</span>
                  <span className="text-body-1-regular text-label-assistive">x{formData.leverage}</span>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded text-caption-medium",
                  formData.position === 'Long'
                    ? "bg-element-positive-lighter text-element-positive-default"
                    : "bg-element-danger-lighter text-element-danger-default"
                )}>
                  {formData.position}
                </span>
              </div>

              {/* Data Grid */}
              <div className="border-l-2 border-line-normal pl-3">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div className="flex">
                    <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">수량</span>
                    <span className="text-body-2-medium text-label-normal">{formData.quantity}</span>
                  </div>
                  <div className="flex">
                    <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">보유 시간</span>
                    <span className="text-body-2-medium text-label-normal">{formData.holdTime}</span>
                  </div>
                  <div className="flex">
                    <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">진입가</span>
                    <span className="text-body-2-medium text-label-normal">{formData.entryPrice}</span>
                  </div>
                  <div className="flex">
                    <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">청산가</span>
                    <span className="text-body-2-medium text-label-normal">{formData.exitPrice}</span>
                  </div>
                  <div className="flex">
                    <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">손익</span>
                    <span className={cn(
                      "text-body-2-bold",
                      isPositive ? "text-element-positive-default" : "text-element-danger-default"
                    )}>
                      {formData.pnl}({formData.pnlPercent}%)
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">결과</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-caption-medium",
                      formData.result === 'Win'
                        ? "bg-element-positive-lighter text-element-positive-default"
                        : "bg-element-danger-lighter text-element-danger-default"
                    )}>
                      {formData.result}
                    </span>
                  </div>
                </div>

                {/* Expandable Detail */}
                <button
                  onClick={() => setIsDetailOpen(!isDetailOpen)}
                  className="flex items-center gap-1 mt-3 text-body-2-regular text-label-assistive hover:text-label-neutral transition-colors"
                >
                  주문 상세 내역
                  {isDetailOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isDetailOpen && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
                    <div className="flex">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">진입 시간</span>
                      <span className="text-body-2-medium text-label-normal">{formData.entryTime}</span>
                    </div>
                    <div className="flex">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">청산 시간</span>
                      <span className="text-body-2-medium text-label-normal">{formData.exitTime}</span>
                    </div>
                    <div className="flex">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">진입 거래대금</span>
                      <span className="text-body-2-medium text-label-normal">{formData.entryVolume}</span>
                    </div>
                    <div className="flex">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">청산 거래대금</span>
                      <span className="text-body-2-medium text-label-normal">{formData.exitVolume}</span>
                    </div>
                    <div className="flex">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">진입 수수료</span>
                      <span className="text-body-2-medium text-label-normal">{formData.entryFee}</span>
                    </div>
                    <div className="flex">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">청산 수수료</span>
                      <span className="text-body-2-medium text-label-normal">{formData.exitFee}</span>
                    </div>
                    <div className="flex">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">펀딩 수수료</span>
                      <span className="text-body-2-medium text-label-normal">{formData.fundingFee}</span>
                    </div>
                  </div>
                )}

                {/* 주문 추가 버튼 */}
                <button
                  onClick={() => setShowOrderAdd(true)}
                  className="flex items-center gap-1 mt-3 text-body-2-medium text-label-normal hover:text-label-neutral transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  주문 추가
                </button>
              </div>
            </div>
          )}

          {/* 주문 추가 모달 */}
          {showOrderAdd && (
            <div className="border border-line-normal rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-body-1-bold text-label-normal">주문 추가</h3>
                <button onClick={() => setShowOrderAdd(false)} className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <X className="w-4 h-4 text-label-assistive" />
                </button>
              </div>
              <form onSubmit={handleAddOrder} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-body-2-medium text-label-neutral">유형</label>
                    <select
                      className="w-full px-3 py-2 border border-line-normal rounded-lg text-body-2-regular focus:outline-none focus:border-line-focused bg-white"
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value as 'BUY' | 'SELL')}
                    >
                      <option value="BUY">추가 진입</option>
                      <option value="SELL">부분 청산</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-body-2-medium text-label-neutral">가격</label>
                    <input
                      type="text"
                      placeholder="0"
                      value={orderPrice}
                      onChange={(e) => setOrderPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-line-normal rounded-lg text-body-2-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-body-2-medium text-label-neutral">수량</label>
                    <input
                      type="text"
                      placeholder="0"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(e.target.value)}
                      className="w-full px-3 py-2 border border-line-normal rounded-lg text-body-2-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-body-2-medium text-label-neutral">시간</label>
                    <input
                      type="text"
                      placeholder="YYYY.MM.DD HH:MM"
                      value={orderTime}
                      onChange={(e) => setOrderTime(e.target.value)}
                      className="w-full px-3 py-2 border border-line-normal rounded-lg text-body-2-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-gray-900 text-white text-body-2-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  추가
                </button>
              </form>
            </div>
          )}

          {/* Tabs */}
          <div className="flex">
            <button
              className={cn(
                "flex-1 h-14 px-2 transition-colors",
                activeTab === 'pre-scenario'
                  ? "text-title-2-bold text-label-normal border-b-2 border-gray-800"
                  : "text-title-2-regular text-label-disabled border-b border-line-normal"
              )}
              onClick={() => setActiveTab('pre-scenario')}
            >
              사전 시나리오
            </button>
            <button
              className={cn(
                "flex-1 h-14 px-2 transition-colors",
                activeTab === 'post-review'
                  ? "text-title-2-bold text-label-normal border-b-2 border-gray-800"
                  : "text-title-2-regular text-label-disabled border-b border-line-normal"
              )}
              onClick={() => setActiveTab('post-review')}
            >
              매매 후 복기
            </button>
          </div>

          {/* Pre-scenario Tab Content */}
          {activeTab === 'pre-scenario' && (
            <div className="space-y-4">
              {/* AI Helper Notice */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-bold bg-gradient-to-br from-symbol-sub to-symbol-main bg-clip-text text-transparent">T</span>
                </div>
                <span className="text-body-1-medium text-label-normal">
                  Tradex AI Assistant가 학습하여 이후 전략 분석에 활용해요.
                </span>
              </div>

              {/* 지표 - Tag Selector */}
              <TagSelector
                label="지표"
                selectedItems={formData.indicators || []}
                availableItems={availableIndicators}
                onAdd={(item) => setFormData(prev => ({
                  ...prev,
                  indicators: [...(prev.indicators || []), item]
                }))}
                onRemove={(item) => setFormData(prev => ({
                  ...prev,
                  indicators: (prev.indicators || []).filter(i => i !== item)
                }))}
              />

              {/* 타임 프레임 - Tag Selector */}
              <TagSelector
                label="타임 프레임"
                selectedItems={formData.timeframes || []}
                availableItems={availableTimeframes}
                onAdd={(item) => setFormData(prev => ({
                  ...prev,
                  timeframes: [...(prev.timeframes || []), item]
                }))}
                onRemove={(item) => setFormData(prev => ({
                  ...prev,
                  timeframes: (prev.timeframes || []).filter(i => i !== item)
                }))}
              />

              {/* 기술적 분석 - Tag Selector */}
              <TagSelector
                label="기술적 분석"
                selectedItems={formData.technicalAnalysis || []}
                availableItems={availableTechnicalAnalysis}
                onAdd={(item) => setFormData(prev => ({
                  ...prev,
                  technicalAnalysis: [...(prev.technicalAnalysis || []), item]
                }))}
                onRemove={(item) => setFormData(prev => ({
                  ...prev,
                  technicalAnalysis: (prev.technicalAnalysis || []).filter(i => i !== item)
                }))}
              />

              {/* TP/SL */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-body-1-medium text-label-normal block">목표 익절가(TP)</label>
                  <input
                    type="text"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular text-label-normal placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    value={formData.targetTP || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetTP: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-body-1-medium text-label-normal block">목표 손절가(SL)</label>
                  <input
                    type="text"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular text-label-normal placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    value={formData.targetSL || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetSL: e.target.value }))}
                  />
                </div>
              </div>

              {/* 진입 근거 */}
              <div className="space-y-2">
                <label className="text-body-1-medium text-label-normal block">진입 근거</label>
                <textarea
                  placeholder="진입 근거에 대해 기록해 보세요. (예. 90k 근처의 지지선과 4시간봉 기준 볼린저 밴드 하단 선이 겹쳐서 롱 포지션 진입)"
                  className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused resize-none h-28"
                  value={formData.entryReason || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, entryReason: e.target.value }))}
                />
              </div>

              {/* 목표 시나리오 */}
              <div className="space-y-2">
                <label className="text-body-1-medium text-label-normal block">목표 시나리오</label>
                <textarea
                  placeholder="목표/계획에 대해 자유롭게 기록해 보세요."
                  className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused resize-none h-28"
                  value={formData.scenario || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, scenario: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Post-review Tab Content */}
          {activeTab === 'post-review' && (
            <div className="space-y-2">
              <label className="text-body-1-medium text-label-normal block">매매 결과에 대한 피드백</label>
              <textarea
                placeholder="매매 종료 후 감정 상태와 원칙 준수 여부를 솔직하게 기록해 보세요. (잘한 점 / 아쉬운 점 / 개선점 등)"
                className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused resize-none h-40"
                value={formData.review || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
              />
            </div>
          )}

          {/* Save Error */}
          {saveError && (
            <p className="text-body-2-regular text-label-danger">{saveError}</p>
          )}
        </div>
      </div>

      {/* Bottom Save Button */}
      <div className="px-5 py-4 border-t border-line-normal">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "w-full py-3 rounded-lg text-body-1-bold transition-colors",
            isSaving
              ? "bg-element-primary-disabled text-label-disabled cursor-not-allowed"
              : "bg-element-primary-default hover:bg-element-primary-pressed text-label-inverse"
          )}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  )
}
