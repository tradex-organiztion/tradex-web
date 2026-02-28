'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronsRight, Plus, ChevronDown, ChevronUp, X, Search, Upload, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { positionsApi } from '@/lib/api/futures'
import { journalApi } from '@/lib/api/trading'
import { tradingPrincipleApi } from '@/lib/api/tradingPrinciple'
import type { TradingPrincipleResponse } from '@/lib/api/tradingPrinciple'
import type { UpdateJournalRequest } from '@/lib/api/trading'
import type { OrderResponse } from '@/lib/api/futures'
import { useAuthStore } from '@/stores'
import Image from 'next/image'

interface JournalFormProps {
  journalId?: number | null
  initialData?: Partial<JournalFormData>
  onClose?: () => void
  onSave?: () => void
}

export interface JournalFormData {
  date: string
  exchange: string
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
  principlesChecked: boolean[]
}

type TabType = 'pre-scenario' | 'post-review'
type InputMode = 'auto' | 'manual'

// 사용 가능한 지표 목록
const availableIndicators = [
  'RSI', 'MACD', '볼린저 밴드', 'EMA', 'SMA', 'Stochastic',
  'ATR', 'Volume Profile', 'Fibonacci', 'Ichimoku', 'VWAP', 'OBV',
]

// 사용 가능한 타임프레임
const availableTimeframes = [
  '1분봉', '3분봉', '5분봉', '15분봉', '30분봉', '1시간봉', '2시간봉', '4시간봉', '1일봉', '1주봉',
]

// 사용 가능한 기술적 분석
const availableTechnicalAnalysis = [
  '15분봉', '30분봉', '1시간봉', '4시간봉', '지지선/저항선', '추세선', '패턴 분석', '캔들 패턴',
]

// 추천 태그
const recommendedIndicators = ['볼린저 밴드', 'RSI', 'MACD']
const recommendedTimeframes = ['15분봉']
const recommendedTechnicalAnalysis = ['15분봉', '15분봉']

// 매매원칙 목록 (데모 모드 fallback)
const DEMO_TRADING_PRINCIPLES = [
  '하루에 3회 이상 연속 손실이 발생하면 그날은 더 이상 거래하지 않습니다.',
  '손절 기준은 진입가 대비 2% 이하로 설정하고, 어떤 경우에도 이를 변경하거나 무시하지 않습니다.',
  '오후 9시 이후에는 신규 포지션을 진입하지 않습니다.',
  '포지션 진입 전 반드시 매매 일지에 진입 근거와 목표가, 손절가를 미리 작성합니다.',
  '전체 자산의 10% 이상을 단일 포지션에 투자하지 않습니다.',
]

// 자동입력용 거래 목록
const _now = new Date()
const _fmt = (d: Date, h: number, m: number) => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
const _yesterday = new Date(_now)
_yesterday.setDate(_yesterday.getDate() - 1)

const _autoImportTrades = [
  { id: 'auto-1', pair: 'BTC/USDT', position: 'Long' as const, leverage: 20, entryPrice: '98,200', exitPrice: '99,400', pnl: '+1,250', time: _fmt(_now, 14, 30) },
  { id: 'auto-2', pair: 'ETH/USDT', position: 'Short' as const, leverage: 10, entryPrice: '3,450', exitPrice: '3,520', pnl: '-420', time: _fmt(_now, 15, 20) },
  { id: 'auto-3', pair: 'SOL/USDT', position: 'Long' as const, leverage: 5, entryPrice: '185.20', exitPrice: '190.50', pnl: '+530', time: _fmt(_yesterday, 9, 15) },
]

// 태그 선택 컴포넌트 - Figma 디자인 반영
function TagSelector({
  label,
  selectedItems,
  recommendedItems,
  availableItems,
  onAdd,
  onRemove,
}: {
  label: string
  selectedItems: string[]
  recommendedItems?: string[]
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
      <label className="text-body-1-bold text-label-normal block">{label}</label>

      {/* Recommended Tags */}
      {recommendedItems && recommendedItems.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-body-2-medium text-label-assistive">추천</span>
          {recommendedItems.map((item, i) => (
            <span
              key={`rec-${i}`}
              className="px-2.5 py-1 bg-gray-100 rounded-lg text-body-2-medium text-label-normal"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Selected Tags (removable) */}
      {selectedItems.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {selectedItems.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-line-normal rounded-lg text-body-2-medium text-label-normal"
            >
              {item}
              <button
                onClick={() => onRemove(item)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3.5 h-3.5 text-label-assistive" />
              </button>
            </span>
          ))}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-line-normal rounded-lg text-body-2-medium text-label-normal hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            추가
          </button>
        </div>
      )}

      {/* Add Button (full width when no items selected) */}
      {selectedItems.length === 0 && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center gap-1 px-3 py-2.5 border border-line-normal rounded-lg text-body-1-medium text-label-normal hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="relative">
          <div className="fixed inset-0 z-10" onClick={() => { setIsOpen(false); setSearchQuery('') }} />
          <div className="absolute top-0 left-0 right-0 bg-white border border-line-normal rounded-lg shadow-emphasize z-20 max-h-[240px] overflow-hidden">
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
        </div>
      )}
    </div>
  )
}

// 주문 데이터 표시 컴포넌트
function _OrderCard({
  pair,
  position,
  quantity,
  entryPrice,
  exitPrice,
  pnl,
  pnlPercent,
  result,
  isDetailOpen,
  onToggleDetail,
  detailData,
}: {
  pair: string
  position: string
  quantity: string
  entryPrice: string
  exitPrice: string
  pnl: string
  pnlPercent: string
  result: string
  isDetailOpen: boolean
  onToggleDetail: () => void
  detailData?: {
    entryTime: string
    exitTime: string
    entryVolume: string
    exitVolume: string
    entryFee: string
    exitFee: string
    fundingFee: string
  }
}) {
  const isPositive = pnl && !pnl.startsWith('-')

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[10px] font-bold">₿</span>
        </div>
        <span className="text-body-1-bold text-label-normal">{pair}</span>
        <span className={cn(
          "px-2 py-0.5 rounded text-caption-medium",
          position === 'Long'
            ? "bg-element-positive-lighter text-element-positive-default"
            : "bg-element-danger-lighter text-element-danger-default"
        )}>
          {position}
        </span>
      </div>

      <div className="border-l-2 border-line-normal pl-3">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
          <div className="flex">
            <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">수량</span>
            <span className="text-body-2-medium text-label-normal">{quantity}</span>
          </div>
          <div className="flex">
            <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">진입가</span>
            <span className="text-body-2-medium text-label-normal">{entryPrice}</span>
          </div>
          <div className="flex">
            <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">청산가</span>
            <span className="text-body-2-medium text-label-normal">{exitPrice}</span>
          </div>
          <div className="flex">
            <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">손익</span>
            <span className={cn(
              "text-body-2-bold",
              isPositive ? "text-element-positive-default" : "text-element-danger-default"
            )}>
              {pnl}({pnlPercent}%)
            </span>
          </div>
          <div className="flex">
            <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">결과</span>
            <span className={cn(
              "px-2 py-0.5 rounded text-caption-medium",
              result === 'Win'
                ? "bg-element-positive-lighter text-element-positive-default"
                : "bg-element-danger-lighter text-element-danger-default"
            )}>
              {result}
            </span>
          </div>
        </div>

        <button
          onClick={onToggleDetail}
          className="flex items-center gap-1 mt-2 text-body-2-regular text-label-assistive hover:text-label-neutral transition-colors"
        >
          주문 상세 내역
          {isDetailOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isDetailOpen && detailData && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-2">
            <div className="flex">
              <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">거래 시간</span>
              <span className="text-body-2-medium text-label-normal">{detailData.entryTime}</span>
            </div>
            <div className="flex">
              <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">청산 시간</span>
              <span className="text-body-2-medium text-label-normal">{detailData.exitTime}</span>
            </div>
            <div className="flex">
              <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">진입 거래대금</span>
              <span className="text-body-2-medium text-label-normal">{detailData.entryVolume}</span>
            </div>
            <div className="flex">
              <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">청산 거래대금</span>
              <span className="text-body-2-medium text-label-normal">{detailData.exitVolume}</span>
            </div>
            <div className="flex">
              <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">진입 수수료</span>
              <span className="text-body-2-medium text-label-normal">{detailData.entryFee}</span>
            </div>
            <div className="flex">
              <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">청산 수수료</span>
              <span className="text-body-2-medium text-label-normal">{detailData.exitFee}</span>
            </div>
            <div className="flex">
              <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">펀딩 수수료</span>
              <span className="text-body-2-medium text-label-normal">{detailData.fundingFee}</span>
            </div>
          </div>
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
  const [_showAutoImport, _setShowAutoImport] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiOrders, setApiOrders] = useState<OrderResponse[]>([])
  const [principles, setPrinciples] = useState<TradingPrincipleResponse[]>([])
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const screenshotInputRef = useRef<HTMLInputElement>(null)

  // 매매 원칙 API 로드
  useEffect(() => {
    if (isDemoMode) {
      setPrinciples(DEMO_TRADING_PRINCIPLES.map((content, idx) => ({
        id: idx + 1,
        content,
        createdAt: '',
        updatedAt: '',
      })))
      return
    }

    tradingPrincipleApi.getAll().then((data) => {
      setPrinciples(data)
    }).catch((err) => {
      console.warn('Failed to load trading principles:', err.message)
      // fallback to demo data
      setPrinciples(DEMO_TRADING_PRINCIPLES.map((content, idx) => ({
        id: idx + 1,
        content,
        createdAt: '',
        updatedAt: '',
      })))
    })
  }, [isDemoMode])

  // Manual input: additional orders
  const [additionalOrders, setAdditionalOrders] = useState<Array<{
    pair: string
    position: 'Long' | 'Short'
    quantity: string
    entryPrice: string
    exitPrice: string
    pnl: string
    result: string
  }>>([])

  const [formData, setFormData] = useState<Partial<JournalFormData>>({
    date: _fmt(_now, _now.getHours(), _now.getMinutes()),
    exchange: '바이낸스',
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
    entryTime: _fmt(_now, 14, 30),
    exitTime: _fmt(_now, 17, 13),
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
    principlesChecked: DEMO_TRADING_PRINCIPLES.map(() => false),
    ...initialData,
  })

  // journalId가 있으면 API에서 상세 데이터 로드
  useEffect(() => {
    if (!journalId || isDemoMode) return

    setIsLoading(true)
    journalApi.getById(journalId).then((data) => {
      // API 응답을 formData에 매핑
      const symbolFormatted = data.symbol
        ? data.symbol.replace(/USDT$/, '/USDT').replace(/BUSD$/, '/BUSD')
        : ''
      const pnlValue = data.realizedPnl ?? 0
      const roiValue = data.roi ?? 0
      const isPositive = pnlValue >= 0

      setFormData(prev => ({
        ...prev,
        date: data.entryTime ? new Date(data.entryTime).toLocaleString('ko-KR') : prev.date,
        exchange: data.exchangeName ?? prev.exchange,
        pair: symbolFormatted || prev.pair,
        leverage: data.leverage ?? prev.leverage,
        position: data.side === 'SHORT' ? 'Short' : 'Long',
        entryPrice: data.avgEntryPrice?.toLocaleString() ?? prev.entryPrice,
        exitPrice: data.avgExitPrice?.toLocaleString() ?? prev.exitPrice,
        pnl: pnlValue !== 0 ? `${isPositive ? '+' : ''}${pnlValue.toLocaleString()}` : prev.pnl,
        pnlPercent: roiValue !== 0 ? roiValue.toFixed(2) : prev.pnlPercent,
        result: pnlValue >= 0 ? 'Win' : 'Lose',
        entryTime: data.entryTime ? new Date(data.entryTime).toLocaleString('ko-KR') : prev.entryTime,
        exitTime: data.exitTime ? new Date(data.exitTime).toLocaleString('ko-KR') : prev.exitTime,
        entryFee: data.openFee?.toLocaleString() ?? prev.entryFee,
        exitFee: data.closedFee?.toLocaleString() ?? prev.exitFee,
        // 시나리오/복기
        scenario: data.entryScenario ?? prev.scenario,
        review: data.exitReview ?? prev.review,
        // 태그
        indicators: data.indicators ?? prev.indicators,
        timeframes: data.timeframes ?? prev.timeframes,
        technicalAnalysis: data.technicalAnalyses ?? prev.technicalAnalysis,
        // TP/SL
        targetTP: data.plannedTargetPrice?.toString() ?? prev.targetTP,
        targetSL: data.plannedStopLoss?.toString() ?? prev.targetSL,
      }))

      // 오더 데이터 별도 저장
      if (data.orders && data.orders.length > 0) {
        setApiOrders(data.orders)
      }

      setInputMode('auto')
      setIsLoading(false)
    }).catch((err) => {
      console.warn('Journal detail fetch error:', err.message)
      setIsLoading(false)
    })
  }, [journalId, isDemoMode])

  const hasTradeData = formData.pair && formData.entryPrice
  const isEditMode = !!journalId

  const _handleAutoImport = (trade: typeof _autoImportTrades[0]) => {
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
    _setShowAutoImport(false)
  }

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
      avgEntryPrice: entryPrice,
      currentSize: size,
      entryTime: new Date().toISOString(),
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

  const handleUpdateJournal = async () => {
    if (isDemoMode || !journalId) {
      onSave?.()
      return
    }

    setIsSaving(true)
    setSaveError(null)

    const updateData: UpdateJournalRequest = {
      entryScenario: formData.scenario,
      exitReview: formData.review,
      indicators: formData.indicators,
      timeframes: formData.timeframes,
      technicalAnalyses: formData.technicalAnalysis,
      plannedTargetPrice: formData.targetTP ? parseFloat(formData.targetTP) : undefined,
      plannedStopLoss: formData.targetSL ? parseFloat(formData.targetSL) : undefined,
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

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setAiAnalysisResult('최근 10회 거래 중 4회에서 손절 기준을 지키지 않고 보유 시간이 길어지는 패턴이 나타났습니다.\n손절 후 최소 1시간 대기 원칙을 설정해보세요.')
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleAddOrder = () => {
    setAdditionalOrders(prev => [...prev, {
      pair: '',
      position: 'Long',
      quantity: '',
      entryPrice: '',
      exitPrice: '',
      pnl: '',
      result: 'Win',
    }])
  }

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 입력 초기화 (같은 파일 재선택 가능)
    e.target.value = ''

    if (!file.type.startsWith('image/')) {
      setSaveError('이미지 파일만 업로드 가능합니다.')
      return
    }

    setIsUploading(true)
    setSaveError(null)

    try {
      const url = await journalApi.uploadScreenshot(journalId!, file)
      setScreenshots(prev => [...prev, url])
    } catch (err) {
      console.warn('Screenshot upload failed:', (err as Error).message)
      setSaveError('스크린샷 업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index))
  }

  const togglePrincipleCheck = (index: number) => {
    setFormData(prev => {
      const checked = [...(prev.principlesChecked || principles.map(() => false))]
      checked[index] = !checked[index]
      return { ...prev, principlesChecked: checked }
    })
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
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
              <span className="text-body-2-regular text-label-assistive">매매일지 불러오는 중...</span>
            </div>
          </div>
        ) : (
        <div className="px-5 py-8 space-y-6">
          {/* Title Section */}
          <div className="space-y-1">
            <h2 className="text-title-1-bold text-label-normal">
              {isEditMode ? '매매일지 수정' : '매매일지 작성'}
            </h2>
            <p className="text-body-2-regular text-label-assistive">
              {formData.date} | {formData.exchange || '바이낸스'}
            </p>
          </div>

          {/* Trade Summary - Auto mode */}
          {hasTradeData && inputMode === 'auto' && (
            <div className="space-y-4">
              {/* Main Trade Header */}
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

              {/* Main Trade Data */}
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
                      formData.pnl && !formData.pnl.startsWith('-') ? "text-element-positive-default" : "text-element-danger-default"
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
              </div>

              {/* API Orders */}
              {apiOrders.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-body-2-bold text-label-neutral">오더 내역 ({apiOrders.length})</h4>
                  {apiOrders.map((order) => {
                    const orderPnl = order.realizedPnl ?? 0
                    const isOrderPositive = orderPnl >= 0
                    return (
                      <div key={order.orderId} className="border-l-2 border-line-normal pl-3">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                          <div className="flex">
                            <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">방향</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-caption-medium",
                              order.side === 'BUY'
                                ? "bg-element-positive-lighter text-element-positive-default"
                                : "bg-element-danger-lighter text-element-danger-default"
                            )}>
                              {order.side}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">유형</span>
                            <span className="text-body-2-medium text-label-normal">{order.orderType}</span>
                          </div>
                          {order.filledQuantity != null && (
                            <div className="flex">
                              <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">체결 수량</span>
                              <span className="text-body-2-medium text-label-normal">{order.filledQuantity.toLocaleString()}</span>
                            </div>
                          )}
                          {order.filledPrice != null && (
                            <div className="flex">
                              <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">체결 가격</span>
                              <span className="text-body-2-medium text-label-normal">{order.filledPrice.toLocaleString()}</span>
                            </div>
                          )}
                          {order.cumExecFee != null && (
                            <div className="flex">
                              <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">수수료</span>
                              <span className="text-body-2-medium text-label-normal">{order.cumExecFee.toLocaleString()}</span>
                            </div>
                          )}
                          {order.realizedPnl != null && (
                            <div className="flex">
                              <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">실현 손익</span>
                              <span className={cn(
                                "text-body-2-bold",
                                isOrderPositive ? "text-element-positive-default" : "text-element-danger-default"
                              )}>
                                {isOrderPositive ? '+' : ''}{orderPnl.toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div className="flex">
                            <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">상태</span>
                            <span className="text-body-2-medium text-label-normal">{order.status}</span>
                          </div>
                          {order.fillTime && (
                            <div className="flex">
                              <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">체결 시간</span>
                              <span className="text-body-2-medium text-label-normal">{new Date(order.fillTime).toLocaleString('ko-KR')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Manual Input Form */}
          {inputMode === 'manual' && (
            <div className="space-y-4">
              {/* Trading pair & Leverage */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-body-2-medium text-label-neutral">거래 페어</label>
                  <input
                    type="text"
                    placeholder="입력(예. BTC/USDT)"
                    className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    value={formData.pair || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, pair: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-body-2-medium text-label-neutral">레버리지</label>
                  <input
                    type="text"
                    placeholder="입력"
                    className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    value={formData.leverage || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, leverage: Number(e.target.value) }))}
                  />
                </div>
              </div>

              {/* Position direction */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-body-2-medium text-label-neutral">포지션 방향</label>
                </div>
                <div />
              </div>
              <div className="flex gap-2 -mt-2">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, position: 'Long' }))}
                  className={cn(
                    "px-4 py-2 rounded-lg text-body-2-medium transition-colors border",
                    formData.position === 'Long'
                      ? "border-gray-800 bg-gray-900 text-white"
                      : "border-line-normal text-label-normal hover:bg-gray-50"
                  )}
                >
                  Long
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, position: 'Short' }))}
                  className={cn(
                    "px-4 py-2 rounded-lg text-body-2-medium transition-colors border",
                    formData.position === 'Short'
                      ? "border-gray-800 bg-gray-900 text-white"
                      : "border-line-normal text-label-normal hover:bg-gray-50"
                  )}
                >
                  Short
                </button>
              </div>

              {/* Trade details grid */}
              <div className="border-l-2 border-line-normal pl-3 space-y-2">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div className="flex items-center">
                    <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">수량</span>
                    <input type="text" placeholder="입력" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1"
                      value={formData.quantity || ''} onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))} />
                  </div>
                  <div className="flex items-center">
                    <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">보유 시간</span>
                    <input type="text" placeholder="예. 2시간 43분" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1"
                      value={formData.holdTime || ''} onChange={(e) => setFormData(prev => ({ ...prev, holdTime: e.target.value }))} />
                  </div>
                  <div className="flex items-center">
                    <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">진입가</span>
                    <input type="text" placeholder="입력" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1"
                      value={formData.entryPrice || ''} onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: e.target.value }))} />
                  </div>
                  <div className="flex items-center">
                    <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">청산가</span>
                    <input type="text" placeholder="입력" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1"
                      value={formData.exitPrice || ''} onChange={(e) => setFormData(prev => ({ ...prev, exitPrice: e.target.value }))} />
                  </div>
                  <div className="flex items-center">
                    <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">손익</span>
                    <input type="text" placeholder="입력" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1"
                      value={formData.pnl || ''} onChange={(e) => setFormData(prev => ({ ...prev, pnl: e.target.value }))} />
                  </div>
                  <div className="flex items-center">
                    <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">결과</span>
                    <div className="flex gap-2">
                      <button onClick={() => setFormData(prev => ({ ...prev, result: 'Win' }))}
                        className={cn("px-3 py-1 rounded text-caption-medium border transition-colors",
                          formData.result === 'Win' ? "border-gray-800 bg-gray-900 text-white" : "border-line-normal text-label-normal"
                        )}>Win</button>
                      <button onClick={() => setFormData(prev => ({ ...prev, result: 'Lose' }))}
                        className={cn("px-3 py-1 rounded text-caption-medium border transition-colors",
                          formData.result === 'Lose' ? "border-gray-800 bg-gray-900 text-white" : "border-line-normal text-label-normal"
                        )}>Lose</button>
                    </div>
                  </div>
                </div>

                {/* Expandable order details */}
                <button
                  onClick={() => setIsDetailOpen(!isDetailOpen)}
                  className="flex items-center gap-1 mt-2 text-body-2-regular text-label-assistive hover:text-label-neutral transition-colors"
                >
                  주문 상세 내역
                  {isDetailOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isDetailOpen && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
                    <div className="flex items-center">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">진입 시간</span>
                      <input type="text" placeholder="예. 2025.12.11 14:30" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1"
                        value={formData.entryTime || ''} onChange={(e) => setFormData(prev => ({ ...prev, entryTime: e.target.value }))} />
                    </div>
                    <div className="flex items-center">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">청산 시간</span>
                      <input type="text" placeholder="예. 2025.12.11 14:30" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1"
                        value={formData.exitTime || ''} onChange={(e) => setFormData(prev => ({ ...prev, exitTime: e.target.value }))} />
                    </div>
                    <div className="flex items-center">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">진입 거래대금</span>
                      <input type="text" placeholder="입력" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1"
                        value={formData.entryVolume || ''} onChange={(e) => setFormData(prev => ({ ...prev, entryVolume: e.target.value }))} />
                    </div>
                    <div className="flex items-center">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">청산 거래대금</span>
                      <input type="text" placeholder="입력" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1"
                        value={formData.exitVolume || ''} onChange={(e) => setFormData(prev => ({ ...prev, exitVolume: e.target.value }))} />
                    </div>
                    <div className="flex items-center">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">진입 수수료</span>
                      <input type="text" placeholder="입력" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1"
                        value={formData.entryFee || ''} onChange={(e) => setFormData(prev => ({ ...prev, entryFee: e.target.value }))} />
                    </div>
                    <div className="flex items-center">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">청산 수수료</span>
                      <input type="text" placeholder="입력" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1"
                        value={formData.exitFee || ''} onChange={(e) => setFormData(prev => ({ ...prev, exitFee: e.target.value }))} />
                    </div>
                    <div className="flex items-center">
                      <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">펀딩 수수료</span>
                      <input type="text" placeholder="입력" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1"
                        value={formData.fundingFee || ''} onChange={(e) => setFormData(prev => ({ ...prev, fundingFee: e.target.value }))} />
                    </div>
                  </div>
                )}
              </div>

              {/* Additional orders */}
              {additionalOrders.map((_, idx) => (
                <div key={idx} className="space-y-3 pt-4 border-t border-line-normal">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-body-2-medium text-label-neutral">거래 페어</label>
                      <input type="text" placeholder="입력(예. BTC/USDT)"
                        className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-body-2-medium text-label-neutral">포지션 방향</label>
                      <div className="flex gap-2">
                        <button className="px-4 py-2.5 rounded-lg text-body-2-medium border border-gray-800 bg-gray-900 text-white">Long</button>
                        <button className="px-4 py-2.5 rounded-lg text-body-2-medium border border-line-normal text-label-normal">Short</button>
                      </div>
                    </div>
                  </div>
                  <div className="border-l-2 border-line-normal pl-3">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      <div className="flex items-center">
                        <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">수량</span>
                        <input type="text" placeholder="입력" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1" />
                      </div>
                      <div className="flex items-center">
                        <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">진입가</span>
                        <input type="text" placeholder="입력" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1" />
                      </div>
                      <div className="flex items-center">
                        <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">청산가</span>
                        <input type="text" placeholder="입력" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1" />
                      </div>
                      <div className="flex items-center">
                        <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">손익</span>
                        <input type="text" placeholder="입력" className="flex-1 text-body-2-regular placeholder:text-label-disabled focus:outline-none border-b border-line-normal py-1" />
                      </div>
                      <div className="flex items-center">
                        <span className="text-body-2-regular text-label-assistive w-[90px] flex-shrink-0">결과</span>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 rounded text-caption-medium border border-line-normal text-label-normal">Win</button>
                          <button className="px-3 py-1 rounded text-caption-medium border border-line-normal text-label-normal">Lose</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* + 오더 추가 button */}
              <button
                onClick={handleAddOrder}
                className="w-full flex items-center justify-center gap-1 px-3 py-3 border border-line-normal rounded-lg text-body-1-medium text-label-normal hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                오더 추가
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-line-normal">
            <button
              className={cn(
                "flex-1 h-14 px-2 transition-colors",
                activeTab === 'pre-scenario'
                  ? "text-title-2-bold text-label-normal border-b-2 border-gray-800"
                  : "text-title-2-regular text-label-disabled"
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
                  : "text-title-2-regular text-label-disabled"
              )}
              onClick={() => setActiveTab('post-review')}
            >
              매매 후 복기
            </button>
          </div>

          {/* AI Helper Notice */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-bold bg-gradient-to-br from-symbol-sub to-symbol-main bg-clip-text text-transparent">T</span>
            </div>
            <span className="text-body-2-regular text-label-neutral">
              <span className="text-body-2-bold text-label-normal">Tradex AI Assistant</span>가 학습하여 이후 전략 분석에 활용해요.
            </span>
          </div>

          {/* Pre-scenario Tab Content */}
          {activeTab === 'pre-scenario' && (
            <div className="space-y-6">
              {/* 지표 */}
              <TagSelector
                label="지표"
                selectedItems={formData.indicators || []}
                recommendedItems={recommendedIndicators}
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

              {/* 타임 프레임 */}
              <TagSelector
                label="타임 프레임"
                selectedItems={formData.timeframes || []}
                recommendedItems={recommendedTimeframes}
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

              {/* 기술적 분석 */}
              <TagSelector
                label="기술적 분석"
                selectedItems={formData.technicalAnalysis || []}
                recommendedItems={recommendedTechnicalAnalysis}
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
                  <label className="text-body-1-bold text-label-normal block">목표 익절가(TP)</label>
                  <input
                    type="text"
                    placeholder="목표 익절가를 입력해 주세요."
                    className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular text-label-normal placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    value={formData.targetTP || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetTP: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-body-1-bold text-label-normal block">목표 손절가(SL)</label>
                  <input
                    type="text"
                    placeholder="목표 손절가를 입력해 주세요."
                    className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular text-label-normal placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
                    value={formData.targetSL || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetSL: e.target.value }))}
                  />
                </div>
              </div>

              {/* 진입 근거 */}
              <div className="space-y-2">
                <label className="text-body-1-bold text-label-normal block">진입 근거</label>
                <textarea
                  placeholder="진입 근거에 대해 기록해 보세요. (예. 90k 근처의 지지선과 4시간봉 기준 볼린저 밴드 하단 선이 겹쳐서 롱 포지션 진입)"
                  className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused resize-none h-28"
                  value={formData.entryReason || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, entryReason: e.target.value }))}
                />
              </div>

              {/* 목표 시나리오 */}
              <div className="space-y-2">
                <label className="text-body-1-bold text-label-normal block">목표 시나리오</label>
                <textarea
                  placeholder="목표/계획에 대해 자유롭게 기록해 보세요."
                  className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused resize-none h-28"
                  value={formData.scenario || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, scenario: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Post-review Tab Content - Figma E-6/E-7 */}
          {activeTab === 'post-review' && (
            <div className="space-y-6">
              {/* 차트 스크린샷 */}
              <div className="space-y-2">
                <label className="text-body-1-bold text-label-normal block">차트 스크린샷</label>
                <input
                  ref={screenshotInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleScreenshotUpload}
                />
                <div className="flex flex-wrap gap-2">
                  {screenshots.map((url, idx) => (
                    <div key={idx} className="relative w-[80px] h-[80px] rounded-lg overflow-hidden border border-line-normal group">
                      <Image src={url} alt={`스크린샷 ${idx + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeScreenshot(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {/* 스크린샷 업로드는 저장된 일지(editMode)에서만 가능 */}
                  <button
                    type="button"
                    onClick={() => screenshotInputRef.current?.click()}
                    disabled={isUploading || !isEditMode}
                    title={!isEditMode ? '일지 저장 후 업로드 가능합니다' : undefined}
                    className="w-[80px] h-[80px] border border-dashed border-line-normal rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {isUploading ? (
                      <RefreshCw className="w-5 h-5 text-label-assistive animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5 text-label-assistive" />
                    )}
                    <span className="text-caption-regular text-label-assistive">
                      {isUploading ? '업로드중' : '추가'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 복기 내용 */}
              <div className="space-y-2">
                <label className="text-body-1-bold text-label-normal block">복기 내용</label>
                <textarea
                  placeholder="이번 매매에서 잘한 점이나 아쉬운 점, 개선할 점을 자유롭게 작성해 주세요."
                  className="w-full px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused resize-none h-32"
                  value={formData.review || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                />
              </div>

              {/* 매매원칙 준수 여부 */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-body-1-bold text-label-normal block">매매원칙 준수 여부</label>
                  <p className="text-body-2-regular text-label-assistive">이번 매매에서 아래 원칙을 얼마나 지켰는지 체크해보세요.</p>
                </div>
                <div className="space-y-3">
                  {principles.length === 0 ? (
                    <p className="text-body-2-regular text-label-assistive">등록된 매매 원칙이 없습니다.</p>
                  ) : principles.map((principle, idx) => (
                    <label key={principle.id} className="flex items-start gap-3 cursor-pointer">
                      <div
                        onClick={() => togglePrincipleCheck(idx)}
                        className={cn(
                          "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                          formData.principlesChecked?.[idx]
                            ? "bg-gray-900"
                            : "border border-line-normal bg-white"
                        )}
                      >
                        {formData.principlesChecked?.[idx] && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-body-2-regular text-label-normal leading-relaxed">{principle.content}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tradex AI 분석 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="text-body-1-bold text-label-normal block">Tradex AI 분석</label>
                    <p className="text-body-2-regular text-label-assistive">매매 복기 내용을 작성하고 AI 분석을 요청하면 Tradex AI가 매매 패턴을 분석하고 개선 제안을 제공합니다.</p>
                  </div>
                  <button
                    onClick={handleAIAnalysis}
                    disabled={isAnalyzing}
                    className="shrink-0 ml-4 flex items-center gap-1.5 px-4 py-2 border border-line-normal rounded-lg text-body-2-medium text-label-normal hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={cn("w-4 h-4", isAnalyzing && "animate-spin")} />
                    AI 분석하기
                  </button>
                </div>

                {/* AI Analysis Result */}
                {aiAnalysisResult && (
                  <div className="border border-element-positive-default rounded-lg p-4 bg-element-positive-lighter/30">
                    <span className="inline-block px-2 py-0.5 bg-element-positive-default text-white text-caption-medium rounded mb-2">Tradex AI 분석</span>
                    <p className="text-body-2-regular text-label-normal whitespace-pre-line">{aiAnalysisResult}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Save Error */}
          {saveError && (
            <p className="text-body-2-regular text-label-danger">{saveError}</p>
          )}
        </div>
        )}
      </div>

      {/* Bottom Buttons - Figma: 취소 + 저장 */}
      <div className="px-5 py-4 border-t border-line-normal flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-lg text-body-1-bold border border-line-normal text-label-normal hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "flex-1 py-3 rounded-lg text-body-1-bold transition-colors",
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
