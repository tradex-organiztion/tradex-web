'use client'

import { useState } from 'react'
import { ChevronsRight, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface JournalFormProps {
  initialData?: Partial<JournalFormData>
  onClose?: () => void
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

export function JournalForm({ initialData, onClose }: JournalFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pre-scenario')
  const [isDetailOpen, setIsDetailOpen] = useState(false)
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
            <h2 className="text-title-1-bold text-label-normal">매매일지 작성</h2>
            <p className="text-body-2-regular text-label-assistive">{formData.date}</p>
          </div>

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
              </div>
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

              {/* 지표 */}
              <div className="space-y-2">
                <label className="text-body-1-medium text-label-normal block">지표</label>
                <button className="w-full flex items-center justify-center gap-1 px-3 py-2 border border-line-normal rounded-lg text-body-1-medium text-label-normal hover:bg-gray-50 transition-colors">
                  <Plus className="w-4 h-4" />
                  추가
                </button>
              </div>

              {/* 타임 프레임 */}
              <div className="space-y-2">
                <label className="text-body-1-medium text-label-normal block">타임 프레임</label>
                <button className="w-full flex items-center justify-center gap-1 px-3 py-2 border border-line-normal rounded-lg text-body-1-medium text-label-normal hover:bg-gray-50 transition-colors">
                  <Plus className="w-4 h-4" />
                  추가
                </button>
              </div>

              {/* 기술적 분석 */}
              <div className="space-y-2">
                <label className="text-body-1-medium text-label-normal block">기술적 분석</label>
                <button className="w-full flex items-center justify-center gap-1 px-3 py-2 border border-line-normal rounded-lg text-body-1-medium text-label-normal hover:bg-gray-50 transition-colors">
                  <Plus className="w-4 h-4" />
                  추가
                </button>
              </div>

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
        </div>
      </div>
    </div>
  )
}
