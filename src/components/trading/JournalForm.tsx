'use client'

import { useState, useRef } from 'react'
import { ChevronRight, Upload, Image as ImageIcon, X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
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
  // 매매 후 복기 필드
  review: string
  screenshots: string[]
  followedPrinciples: boolean
  emotionalState: string
  lessonsLearned: string
  improvementPoints: string
}

type TabType = 'pre-scenario' | 'post-review'

// 매매 후 복기 폼 컴포넌트
function PostReviewForm({
  formData,
  setFormData,
}: {
  formData: Partial<JournalFormData>
  setFormData: React.Dispatch<React.SetStateAction<Partial<JournalFormData>>>
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // 실제 구현에서는 파일을 서버에 업로드하고 URL을 받아옴
    // 여기서는 임시로 로컬 URL 생성
    const newScreenshots = Array.from(files).map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      screenshots: [...(prev.screenshots || []), ...newScreenshots]
    }))
  }

  const removeScreenshot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots?.filter((_, i) => i !== index) || []
    }))
  }

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true)
    // AI 분석 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsAnalyzing(false)
  }

  return (
    <div className="space-y-6">
      {/* 차트 스크린샷 */}
      <div className="space-y-3">
        <Label className="text-body-2-bold text-label-normal">차트 스크린샷</Label>
        <div className="flex flex-wrap gap-2">
          {formData.screenshots?.map((screenshot, index) => (
            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-line-normal">
              <img src={screenshot} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeScreenshot(index)}
                className="absolute top-1 right-1 w-5 h-5 bg-gray-800/70 rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-line-normal flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-5 h-5 text-label-assistive" />
            <span className="text-caption-regular text-label-assistive">추가</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* 원칙 준수 여부 */}
      <div className="space-y-3">
        <Label className="text-body-2-bold text-label-normal">매매 원칙 준수 여부</Label>
        <div className="flex gap-2">
          <button
            onClick={() => setFormData(prev => ({ ...prev, followedPrinciples: true }))}
            className={cn(
              "flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 transition-colors",
              formData.followedPrinciples === true
                ? "border-element-positive-default bg-element-positive-lighter text-element-positive-default"
                : "border-line-normal text-label-neutral hover:bg-gray-50"
            )}
          >
            <CheckCircle2 className="w-4 h-4" />
            준수함
          </button>
          <button
            onClick={() => setFormData(prev => ({ ...prev, followedPrinciples: false }))}
            className={cn(
              "flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 transition-colors",
              formData.followedPrinciples === false
                ? "border-element-danger-default bg-element-danger-lighter text-element-danger-default"
                : "border-line-normal text-label-neutral hover:bg-gray-50"
            )}
          >
            <AlertCircle className="w-4 h-4" />
            미준수
          </button>
        </div>
      </div>

      {/* 감정 상태 */}
      <div className="space-y-3">
        <Label className="text-body-2-bold text-label-normal">매매 시 감정 상태</Label>
        <div className="flex gap-2 flex-wrap">
          {['침착함', '조급함', '확신', '불안', 'FOMO', '탐욕'].map((emotion) => (
            <button
              key={emotion}
              onClick={() => setFormData(prev => ({ ...prev, emotionalState: emotion }))}
              className={cn(
                "px-4 py-2 rounded-full border text-body-2-regular transition-colors",
                formData.emotionalState === emotion
                  ? "border-element-primary-default bg-element-primary-default text-gray-0"
                  : "border-line-normal text-label-neutral hover:bg-gray-50"
              )}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      {/* 복기 내용 */}
      <div className="space-y-3">
        <Label className="text-body-2-bold text-label-normal">복기 내용</Label>
        <textarea
          placeholder="이번 매매에서 잘한 점, 아쉬운 점, 개선할 점을 작성해주세요."
          className="w-full h-32 px-4 py-3 border border-line-normal rounded-lg text-body-2-regular placeholder:text-label-assistive focus:outline-none focus:border-line-focused resize-none"
          value={formData.review || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
        />
      </div>

      {/* 배운 점 */}
      <div className="space-y-3">
        <Label className="text-body-2-bold text-label-normal">배운 점 (Key Takeaways)</Label>
        <textarea
          placeholder="이번 매매를 통해 배운 핵심 교훈을 작성해주세요."
          className="w-full h-24 px-4 py-3 border border-line-normal rounded-lg text-body-2-regular placeholder:text-label-assistive focus:outline-none focus:border-line-focused resize-none"
          value={formData.lessonsLearned || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, lessonsLearned: e.target.value }))}
        />
      </div>

      {/* 개선 사항 */}
      <div className="space-y-3">
        <Label className="text-body-2-bold text-label-normal">다음에 개선할 점</Label>
        <textarea
          placeholder="다음 매매에서 개선할 구체적인 사항을 작성해주세요."
          className="w-full h-24 px-4 py-3 border border-line-normal rounded-lg text-body-2-regular placeholder:text-label-assistive focus:outline-none focus:border-line-focused resize-none"
          value={formData.improvementPoints || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, improvementPoints: e.target.value }))}
        />
      </div>

      {/* Tradex AI 분석 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-body-2-bold text-label-normal">Tradex AI 분석</Label>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAIAnalysis}
            disabled={isAnalyzing}
            className="gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            {isAnalyzing ? '분석 중...' : 'AI 분석 요청'}
          </Button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          {isAnalyzing ? (
            <div className="flex items-center gap-3 text-body-2-regular text-label-assistive">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
              AI가 매매 내용을 분석하고 있습니다...
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-element-primary-default flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-body-2-medium text-label-normal mb-1">분석 요약</p>
                  <p className="text-body-2-regular text-label-neutral">
                    매매 복기 내용을 작성하고 AI 분석을 요청하면 Tradex AI가 매매 패턴을 분석하고 개선 제안을 제공합니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <p className="text-caption-regular text-label-assistive">
          Tradex AI Assistant가 학습하여 이후 전략 분석에 활용해요.
        </p>
      </div>
    </div>
  )
}

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
    screenshots: initialData?.screenshots || [],
    review: initialData?.review || '',
    lessonsLearned: initialData?.lessonsLearned || '',
    improvementPoints: initialData?.improvementPoints || '',
    emotionalState: initialData?.emotionalState || '',
    followedPrinciples: initialData?.followedPrinciples,
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
            <PostReviewForm
              formData={formData}
              setFormData={setFormData}
            />
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
