'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface JournalFormProps {
  mode?: 'create' | 'edit'
  initialData?: Partial<JournalFormData>
  onClose?: () => void
  onSubmit?: (data: JournalFormData) => void
}

interface JournalFormData {
  date: string
  pair: string
  leverage: number
  position: 'Long' | 'Short'
  marketCondition: string
  style: string
  entryPrice: number
  exitPrice: number
  profit: number
  profitPercent: number
  indicators: string
  technicalAnalysis: string
  timeframe: string
  targetTP: string
  targetSL: string
  scenario: string
}

type TabType = 'pre-scenario' | 'post-review'

export function JournalForm({ mode = 'create', initialData, onClose, onSubmit }: JournalFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pre-scenario')
  const [formData, setFormData] = useState<Partial<JournalFormData>>({
    date: initialData?.date || '2025.12.11 14:30',
    pair: initialData?.pair || 'BTC/USDT',
    leverage: initialData?.leverage || 20,
    position: initialData?.position || 'Long',
    marketCondition: initialData?.marketCondition || '상승장',
    style: initialData?.style || '스윙',
    entryPrice: initialData?.entryPrice || 98200,
    exitPrice: initialData?.exitPrice || 99400,
    profit: initialData?.profit || 1250,
    profitPercent: initialData?.profitPercent || 24.5,
    ...initialData,
  })

  const handleSubmit = () => {
    onSubmit?.(formData as JournalFormData)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-line-normal">
        <Button variant="ghost" size="icon" onClick={onClose} className="p-0">
          <ChevronRight className="w-5 h-5 text-label-assistive rotate-180" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          {/* Title Section */}
          <div className="mb-6">
            <h2 className="text-title-1-bold text-label-normal mb-1">매매일지 작성</h2>
            <p className="text-body-2-regular text-label-assistive">{formData.date}</p>
          </div>

          {/* Trading Summary */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-title-2-bold text-label-normal">{formData.pair}</span>
              <span className="text-body-2-regular text-label-assistive">x{formData.leverage}</span>
              <Badge
                variant={formData.position === 'Long' ? 'positive-solid' : 'danger-solid'}
                className="ml-1"
              >
                {formData.position}
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-body-2-regular">
              <div className="flex justify-between">
                <span className="text-label-assistive">시장상태</span>
                <span className="text-label-normal">{formData.marketCondition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-label-assistive">스타일</span>
                <span className="text-label-normal">{formData.style}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-label-assistive">진입가</span>
                <span className="text-label-normal">{formData.entryPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-label-assistive">청산가</span>
                <span className="text-label-normal">{formData.exitPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-label-assistive">손익</span>
                <span className={cn(
                  (formData.profit || 0) >= 0 ? "text-label-positive" : "text-label-danger"
                )}>
                  {(formData.profit || 0) >= 0 ? '+' : ''}{formData.profit?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-label-assistive">수익률</span>
                <span className={cn(
                  (formData.profitPercent || 0) >= 0 ? "text-label-positive" : "text-label-danger"
                )}>
                  {formData.profitPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-line-normal mb-6">
            <button
              className={cn(
                "flex-1 py-3 text-body-2-medium transition-colors",
                activeTab === 'pre-scenario'
                  ? "text-label-normal border-b-2 border-label-normal"
                  : "text-label-assistive"
              )}
              onClick={() => setActiveTab('pre-scenario')}
            >
              사전 시나리오
            </button>
            <button
              className={cn(
                "flex-1 py-3 text-body-2-medium transition-colors",
                activeTab === 'post-review'
                  ? "text-label-normal border-b-2 border-label-normal"
                  : "text-label-assistive"
              )}
              onClick={() => setActiveTab('post-review')}
            >
              매매 후 복기
            </button>
          </div>

          {/* Form Fields */}
          {activeTab === 'pre-scenario' && (
            <div className="space-y-6">
              {/* 지표 */}
              <div className="space-y-2">
                <Label className="text-body-2-bold text-label-normal">지표</Label>
                <Input
                  placeholder="볼린저 밴드, RSI, MACD, EMA 등"
                  className="border-line-normal"
                  value={formData.indicators || ''}
                  onChange={(e) => setFormData({ ...formData, indicators: e.target.value })}
                />
              </div>

              {/* 기술적 분석 */}
              <div className="space-y-2">
                <Label className="text-body-2-bold text-label-normal">기술적 분석</Label>
                <Input
                  placeholder="지지/저항, 피보나치, 추세선, 채널 등"
                  className="border-line-normal"
                  value={formData.technicalAnalysis || ''}
                  onChange={(e) => setFormData({ ...formData, technicalAnalysis: e.target.value })}
                />
              </div>

              {/* 타임프레임 */}
              <div className="space-y-2">
                <Label className="text-body-2-bold text-label-normal">타임프레임</Label>
                <Input
                  placeholder="15분봉, 1시간봉, 4시간봉, 일봉 등"
                  className="border-line-normal"
                  value={formData.timeframe || ''}
                  onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                />
              </div>

              {/* TP/SL */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-body-2-bold text-label-normal">목표 익절가(TP)</Label>
                  <Input
                    placeholder="15분봉"
                    className="border-line-normal"
                    value={formData.targetTP || ''}
                    onChange={(e) => setFormData({ ...formData, targetTP: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-body-2-bold text-label-normal">목표 손절가(SL)</Label>
                  <Input
                    placeholder="15분봉"
                    className="border-line-normal"
                    value={formData.targetSL || ''}
                    onChange={(e) => setFormData({ ...formData, targetSL: e.target.value })}
                  />
                </div>
              </div>

              {/* 목표 시나리오 */}
              <div className="space-y-2">
                <Label className="text-body-2-bold text-label-normal">목표 시나리오</Label>
                <Button
                  variant="secondary"
                  className="w-full justify-center border-line-normal text-label-assistive"
                >
                  편집
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'post-review' && (
            <div className="space-y-6">
              <p className="text-body-2-regular text-label-assistive text-center py-8">
                매매 후 복기 내용을 작성해주세요.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-line-normal">
        <Button
          className="w-full bg-element-primary-default hover:bg-element-primary-pressed"
          onClick={handleSubmit}
        >
          저장하기
        </Button>
      </div>
    </div>
  )
}
