'use client'

import { useState } from 'react'
import { MoreVertical, Sparkles, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { aiApi } from '@/lib/api/ai'

interface Principle {
  id: string
  text: string
  source: 'ai' | 'manual'
  aiDescription?: string
  timestamp: string
  isEditing?: boolean
}

const samplePrinciples: Principle[] = [
  {
    id: '1',
    text: '하루에 3회 이상 연속 손실이 발생하면 그날은 더 이상 거래하지 않습니다.',
    source: 'ai',
    aiDescription: '최근 연속 손실 후 무리한 복구 매매 패턴이 감지되었습니다.',
    timestamp: '2시간 전',
  },
  {
    id: '2',
    text: '손절 기준은 진입가 대비 2% 이하로 설정하고, 어떤 경우에도 이를 변경하거나 무시하지 않습니다.',
    source: 'ai',
    aiDescription: '손절 라인을 자주 변경하여 손실이 확대되는 경향이 있습니다.',
    timestamp: '3시간 전',
  },
  {
    id: '3',
    text: '오후 9시 이후에는 신규 포지션을 진입하지 않습니다.',
    source: 'ai',
    aiDescription: '야간 시간대 매매에서 손실률이 높게 나타났습니다.',
    timestamp: '1일 전',
  },
  {
    id: '4',
    text: '포지션 진입 전 반드시 매매 일지에 진입 근거와 목표가, 손절가를 미리 작성합니다.',
    source: 'ai',
    aiDescription: '사전 시나리오 없이 진입한 매매의 손실률이 높습니다.',
    timestamp: '2일 전',
  },
  {
    id: '5',
    text: '전체 자산의 10% 이상을 단일 포지션에 투자하지 않습니다.',
    source: 'manual',
    timestamp: '3일 전',
  },
]

// AI 추천 원칙 타입
interface AISuggestion {
  id: string
  text: string
  reason: string
}

export default function PrinciplesPage() {
  const [principles, setPrinciples] = useState<Principle[]>(samplePrinciples)
  const [newPrinciple, setNewPrinciple] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [isAiLoading, setIsAiLoading] = useState(false)

  const handleAdd = () => {
    if (!newPrinciple.trim()) return
    const principle: Principle = {
      id: String(Date.now()),
      text: newPrinciple.trim(),
      source: 'manual',
      timestamp: '방금 전',
    }
    setPrinciples(prev => [...prev, principle])
    setNewPrinciple('')
  }

  const handleEdit = (principle: Principle) => {
    setEditingId(principle.id)
    setEditText(principle.text)
  }

  const handleEditSave = () => {
    if (!editingId) return
    setPrinciples(prev =>
      prev.map(p => p.id === editingId ? { ...p, text: editText } : p)
    )
    setEditingId(null)
    setEditText('')
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd()
  }

  const handleAiRecommend = async () => {
    setIsAiLoading(true)
    // AI 분석 요청 (mock fallback)
    const response = await aiApi.chat({
      message: '내 매매 기록을 분석하고 매매 원칙 3가지를 추천해줘',
    }).catch(() => null)

    if (response) {
      // 응답 파싱하여 추천 원칙 생성 (실제 API에서는 structured response)
      const mockSuggestions: AISuggestion[] = [
        {
          id: `ai-${Date.now()}-1`,
          text: '상승 추세에서만 롱 포지션을 진입하고, 횡보/하락장에서는 관망합니다.',
          reason: '추세 역방향 매매에서 평균 -4.2% 손실이 발생했습니다.',
        },
        {
          id: `ai-${Date.now()}-2`,
          text: '한 번에 전체 물량을 진입하지 않고, 2~3회에 나누어 분할 매수합니다.',
          reason: '일괄 진입 시 평균 진입가가 불리하여 승률이 12% 낮았습니다.',
        },
        {
          id: `ai-${Date.now()}-3`,
          text: '주요 경제 지표 발표 30분 전후로는 매매를 하지 않습니다.',
          reason: '지표 발표 전후 변동성 구간에서 손실 비율이 높습니다.',
        },
      ]
      setAiSuggestions(mockSuggestions)
    }
    setIsAiLoading(false)
  }

  const handleAcceptSuggestion = (suggestion: AISuggestion) => {
    const principle: Principle = {
      id: suggestion.id,
      text: suggestion.text,
      source: 'ai',
      aiDescription: suggestion.reason,
      timestamp: '방금 전',
    }
    setPrinciples(prev => [...prev, principle])
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
  }

  const handleRejectSuggestion = (id: string) => {
    setAiSuggestions(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="flex flex-col justify-between min-h-full">
      {/* Content */}
      <div className="flex flex-col gap-8">
        {/* Title Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-title-1-bold text-label-normal">매매원칙</h1>
              <span className="flex items-center justify-center min-w-[26px] h-5 px-1.5 rounded-full bg-gray-800 text-body-2-medium text-white">
                {principles.length}
              </span>
            </div>
            <button
              onClick={handleAiRecommend}
              disabled={isAiLoading}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-body-2-medium transition-colors",
                isAiLoading
                  ? "bg-gray-100 text-label-disabled cursor-not-allowed"
                  : "bg-gradient-to-r from-symbol-main to-symbol-sub text-white hover:opacity-90"
              )}
            >
              <Sparkles className="w-4 h-4" />
              {isAiLoading ? 'AI 분석 중...' : 'AI 원칙 추천'}
            </button>
          </div>
          <p className="text-body-1-regular text-label-neutral">
            AI가 분석한 매매 습관을 기반으로 원칙을 추천합니다. 자유롭게 수정하거나 새로운 원칙을 추가해 보세요.
          </p>
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-symbol-main" />
              <span className="text-body-2-bold text-label-normal">AI 추천 원칙</span>
              <span className="text-caption-regular text-label-assistive">수락하면 원칙 목록에 추가됩니다</span>
            </div>
            {aiSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="border border-symbol-main/30 bg-element-positive-lighter/30 rounded-xl p-4 space-y-3"
              >
                <p className="text-body-2-regular text-label-neutral">{suggestion.reason}</p>
                <p className="text-body-1-medium text-label-normal">{suggestion.text}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAcceptSuggestion(suggestion)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white rounded-lg text-body-2-medium hover:bg-gray-700 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    수락
                  </button>
                  <button
                    onClick={() => handleRejectSuggestion(suggestion.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-line-normal text-label-normal rounded-lg text-body-2-medium hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    거절
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Principles List */}
        <div className="divide-y divide-line-normal">
          {principles.map((principle) => (
            <div key={principle.id} className="py-4 space-y-3">
              {/* Header: Badge + Timestamp */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {principle.source === 'ai' ? (
                    <span className="flex-shrink-0 px-2 py-0.5 rounded text-caption-medium text-white bg-gradient-to-r from-symbol-main to-symbol-sub">
                      AI 분석
                    </span>
                  ) : (
                    <span className="flex-shrink-0 px-2 py-0.5 rounded text-caption-medium text-label-normal bg-gray-100">
                      직접 추가
                    </span>
                  )}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                    <span className="text-caption-regular text-label-assistive">{principle.timestamp}</span>
                  </div>
                </div>
                {/* AI Description - separate row */}
                {principle.aiDescription && (
                  <p className="text-body-2-regular text-label-neutral">
                    {principle.aiDescription}
                  </p>
                )}
              </div>

              {/* Principle Content */}
              {editingId === principle.id ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 px-4 py-3 border border-line-normal rounded-lg text-body-1-regular text-label-normal focus:outline-none focus:border-line-focused"
                    autoFocus
                  />
                  <button
                    onClick={handleEditCancel}
                    className="px-3 py-2 border border-line-normal rounded-lg text-body-1-medium text-label-normal hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleEditSave}
                    className="px-3 py-2 bg-gray-800 rounded-lg text-body-1-medium text-white hover:bg-gray-700 transition-colors"
                  >
                    완료
                  </button>
                  <button className="p-1">
                    <MoreVertical className="w-6 h-6 text-label-assistive" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <p className="flex-1 text-body-1-medium text-label-normal">{principle.text}</p>
                  <button
                    onClick={() => handleEdit(principle)}
                    className="p-1 flex-shrink-0 hover:bg-gray-50 rounded transition-colors"
                  >
                    <MoreVertical className="w-6 h-6 text-label-assistive" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Input Section */}
      <div className="flex items-center gap-4 pt-8">
        <input
          type="text"
          value={newPrinciple}
          onChange={(e) => setNewPrinciple(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="새로운 매매 원칙을 입력해 주세요. (예. 하루 최대 3회까지만 거래한다.)"
          className="flex-1 px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
        />
        <button
          onClick={handleAdd}
          disabled={!newPrinciple.trim()}
          className={cn(
            "px-3 py-2 rounded-lg text-body-1-medium transition-colors",
            newPrinciple.trim()
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-100 text-label-disabled cursor-not-allowed"
          )}
        >
          추가
        </button>
      </div>
    </div>
  )
}
