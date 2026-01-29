'use client'

import { useState } from 'react'
import { ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface JournalFormProps {
  mode?: 'create' | 'edit' | 'view'
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
  // 매매 후 복기 필드
  review: string
}

type TabType = 'pre-scenario' | 'post-review'

// 매매 후 복기 폼 컴포넌트 (간소화된 버전)
function PostReviewForm({
  formData,
  setFormData,
  isEditing,
}: {
  formData: Partial<JournalFormData>
  setFormData: React.Dispatch<React.SetStateAction<Partial<JournalFormData>>>
  isEditing: boolean
}) {
  return (
    <div className="space-y-4">
      <Label className="text-body-2-bold text-label-normal">매매 결과에 대한 피드백</Label>
      <textarea
        placeholder="매매 종료 후 감정 상태와 원칙 준수 여부를 솔직하게 기록해 보세요. (잘한 점 / 아쉬운 점 / 개선점 등)"
        className={cn(
          "w-full h-40 px-4 py-3 rounded-lg text-body-2-regular placeholder:text-label-assistive focus:outline-none resize-none",
          isEditing
            ? "bg-gray-50 border-none"
            : "bg-gray-50 border-none"
        )}
        value={formData.review || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
        disabled={!isEditing}
      />
    </div>
  )
}

export function JournalForm({ mode = 'create', initialData, onClose, onSubmit }: JournalFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pre-scenario')
  const [isEditing, setIsEditing] = useState(mode === 'create')
  const [formData, setFormData] = useState<Partial<JournalFormData>>({
    date: initialData?.date || '2025.12.11 14:30',
    pair: initialData?.pair || 'BTC/USDT',
    leverage: initialData?.leverage || 20,
    position: initialData?.position || 'Long',
    marketCondition: initialData?.marketCondition || '',
    style: initialData?.style || '',
    entryPrice: initialData?.entryPrice || 0,
    exitPrice: initialData?.exitPrice || 0,
    profit: initialData?.profit || 0,
    profitPercent: initialData?.profitPercent || 0,
    review: initialData?.review || '',
    ...initialData,
  })

  const handleSubmit = () => {
    onSubmit?.(formData as JournalFormData)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  // 조회 모드에서 보여줄 트레이딩 정보 (데이터가 있는 경우)
  const hasTradeData = formData.marketCondition && formData.entryPrice

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-line-normal">
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
          <ChevronsRight className="w-5 h-5 text-label-assistive" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          {/* Title Section */}
          <div className="mb-6">
            <h2 className="text-title-1-bold text-label-normal mb-1">매매일지 작성</h2>
            <p className="text-body-2-regular text-label-assistive">{formData.date}</p>
          </div>

          {/* Trading Pair & Position */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-title-2-bold text-label-normal">{formData.pair}</span>
            <span className="text-body-2-regular text-label-assistive">x{formData.leverage}</span>
            <span className={cn(
              "px-3 py-1 rounded text-body-2-medium border ml-1",
              formData.position === 'Long'
                ? "border-label-normal text-label-normal"
                : "border-label-normal text-label-normal"
            )}>
              {formData.position}
            </span>
          </div>

          {/* Trading Info - Edit Mode (create) */}
          {isEditing && mode === 'create' && (
            <div className="mb-6 space-y-4">
              {/* Row 1: 시장상태 / 트레이딩 스타일 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-body-2-medium text-label-normal">시장상태</Label>
                  <select
                    className="w-full h-12 px-4 bg-gray-50 rounded-lg text-body-2-regular text-label-assistive focus:outline-none appearance-none"
                    value={formData.marketCondition || ''}
                    onChange={(e) => setFormData({ ...formData, marketCondition: e.target.value })}
                  >
                    <option value="">선택</option>
                    <option value="상승장">상승장</option>
                    <option value="하락장">하락장</option>
                    <option value="횡보장">횡보장</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-body-2-medium text-label-normal">트레이딩 스타일</Label>
                  <select
                    className="w-full h-12 px-4 bg-gray-50 rounded-lg text-body-2-regular text-label-assistive focus:outline-none appearance-none"
                    value={formData.style || ''}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  >
                    <option value="">선택</option>
                    <option value="스캘핑">스캘핑</option>
                    <option value="데이트레이딩">데이트레이딩</option>
                    <option value="스윙">스윙</option>
                  </select>
                </div>
              </div>

              {/* Row 2: 진입가 / 청산가 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-body-2-medium text-label-normal">진입가</Label>
                  <Input
                    placeholder="(원)"
                    className="h-12 bg-gray-50 border-none"
                    value={formData.entryPrice || ''}
                    onChange={(e) => setFormData({ ...formData, entryPrice: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-body-2-medium text-label-normal">청산가</Label>
                  <Input
                    placeholder="(원)"
                    className="h-12 bg-gray-50 border-none"
                    value={formData.exitPrice || ''}
                    onChange={(e) => setFormData({ ...formData, exitPrice: Number(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* Row 3: 손익 / 수익률 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-body-2-medium text-label-normal">손익</Label>
                  <Input
                    placeholder="(원)"
                    className="h-12 bg-gray-50 border-none"
                    value={formData.profit || ''}
                    onChange={(e) => setFormData({ ...formData, profit: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-body-2-medium text-label-normal">수익률</Label>
                  <Input
                    placeholder="(%)"
                    className="h-12 bg-gray-50 border-none"
                    value={formData.profitPercent || ''}
                    onChange={(e) => setFormData({ ...formData, profitPercent: Number(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Trading Info - View Mode (edit/view with data) */}
          {(!isEditing || mode !== 'create') && hasTradeData && (
            <div className="mb-6 border-l-2 border-gray-200 pl-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-body-2-regular">
                <div className="flex gap-4">
                  <span className="text-label-assistive min-w-[50px]">시장상태</span>
                  <span className="text-label-normal">{formData.marketCondition}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-label-assistive min-w-[50px]">스타일</span>
                  <span className="text-label-normal">{formData.style}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-label-assistive min-w-[50px]">진입가</span>
                  <span className="text-label-normal">{formData.entryPrice?.toLocaleString()}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-label-assistive min-w-[50px]">청산가</span>
                  <span className="text-label-normal">{formData.exitPrice?.toLocaleString()}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-label-assistive min-w-[50px]">손익</span>
                  <span className={cn(
                    (formData.profit || 0) >= 0 ? "text-label-positive" : "text-label-danger"
                  )}>
                    {(formData.profit || 0) >= 0 ? '+' : ''}{formData.profit?.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-label-assistive min-w-[50px]">수익률</span>
                  <span className={cn(
                    (formData.profitPercent || 0) >= 0 ? "text-label-positive" : "text-label-danger"
                  )}>
                    {formData.profitPercent}%
                  </span>
                </div>
              </div>
            </div>
          )}

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
                  className="h-12 bg-gray-50 border-none"
                  value={formData.indicators || ''}
                  onChange={(e) => setFormData({ ...formData, indicators: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              {/* 기술적 분석 */}
              <div className="space-y-2">
                <Label className="text-body-2-bold text-label-normal">기술적 분석</Label>
                <Input
                  placeholder="지지/저항, 피보나치, 추세선, 채널 등"
                  className="h-12 bg-gray-50 border-none"
                  value={formData.technicalAnalysis || ''}
                  onChange={(e) => setFormData({ ...formData, technicalAnalysis: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              {/* 타임프레임 */}
              <div className="space-y-2">
                <Label className="text-body-2-bold text-label-normal">타임 프레임</Label>
                <Input
                  placeholder="15분봉, 1시간봉, 4시간봉, 일봉 등"
                  className="h-12 bg-gray-50 border-none"
                  value={formData.timeframe || ''}
                  onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              {/* TP/SL */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-body-2-bold text-label-normal">목표 익절가(TP)</Label>
                  <Input
                    placeholder="15분봉"
                    className="h-12 bg-gray-50 border-none"
                    value={formData.targetTP || ''}
                    onChange={(e) => setFormData({ ...formData, targetTP: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-body-2-bold text-label-normal">목표 손절가(SL)</Label>
                  <Input
                    placeholder="15분봉"
                    className="h-12 bg-gray-50 border-none"
                    value={formData.targetSL || ''}
                    onChange={(e) => setFormData({ ...formData, targetSL: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* 목표 시나리오 */}
              <div className="space-y-2">
                <Label className="text-body-2-bold text-label-normal">목표 시나리오</Label>
                <Button
                  variant="secondary"
                  className="w-full h-12 justify-center border-line-normal text-label-assistive"
                >
                  편집
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'post-review' && (
            <PostReviewForm
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-line-normal">
        {mode === 'create' ? (
          /* 새로 작성 모드: 취소 + 저장 */
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 h-12 border-line-normal"
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              className="flex-1 h-12 bg-element-primary-default hover:bg-element-primary-pressed"
              onClick={handleSubmit}
            >
              저장
            </Button>
          </div>
        ) : (
          /* 조회/수정 모드: 편집 버튼 */
          <Button
            variant="secondary"
            className="w-full h-12 border-line-normal"
            onClick={isEditing ? handleSubmit : handleEdit}
          >
            {isEditing ? '저장' : '편집'}
          </Button>
        )}
      </div>
    </div>
  )
}
