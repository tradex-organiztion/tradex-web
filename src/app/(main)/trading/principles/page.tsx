'use client'

import { useState } from 'react'
import { MoreVertical, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Principle {
  id: string
  text: string
  source: 'ai' | 'manual'
  aiDescription?: string
  timestamp: string
}

const _fmtTs = (daysAgo: number, hour: number, minute: number, ampm: '오전' | '오후') => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd} ${ampm} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

const samplePrinciples: Principle[] = [
  {
    id: '1',
    text: '하루에 3회 이상 연속 손실이 발생하면 그날은 더 이상 거래하지 않습니다.',
    source: 'ai',
    aiDescription: '과거 데이터 분석 결과, 연속 손실 후 감정적 매매로 인한 추가 손실이 82%의 확률로 발생했습니다.',
    timestamp: _fmtTs(0, 1, 45, '오후'),
  },
  {
    id: '2',
    text: '손절 기준은 진입가 대비 2% 이하로 설정하고, 어떤 경우에도 이를 변경하거나 무시하지 않습니다.',
    source: 'ai',
    aiDescription: '손절을 지키지 않은 경우 평균 손실이 7.3%까지 확대되었습니다.',
    timestamp: _fmtTs(0, 1, 45, '오후'),
  },
  {
    id: '3',
    text: '오후 9시 이후에는 신규 포지션을 진입하지 않습니다.',
    source: 'ai',
    aiDescription: '야간 거래 시 승률이 37%로 낮고, 변동성이 큰 시간대에서 비계획적 매매가 많이 발생했습니다.',
    timestamp: _fmtTs(0, 1, 45, '오후'),
  },
  {
    id: '4',
    text: '포지션 진입 전 반드시 매매 일지에 진입 근거와 목표가, 손절가를 미리 작성합니다.',
    source: 'ai',
    aiDescription: '사전 계획 없이 진입한 경우 평균 수익률이 -1.8%였으나, 계획을 세운 경우 +4.2%를 기록했습니다.',
    timestamp: _fmtTs(0, 1, 45, '오후'),
  },
  {
    id: '5',
    text: '전체 자산의 10% 이상을 단일 포지션에 투자하지 않습니다.',
    source: 'manual',
    timestamp: _fmtTs(1, 1, 45, '오후'),
  },
]

export default function PrinciplesPage() {
  const [principles, setPrinciples] = useState<Principle[]>(samplePrinciples)
  const [newPrinciple, setNewPrinciple] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const handleAdd = () => {
    if (!newPrinciple.trim()) return
    const now = new Date()
    const ampm = now.getHours() >= 12 ? '오후' : '오전'
    const hour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours()
    const principle: Principle = {
      id: String(Date.now()),
      text: newPrinciple.trim(),
      source: 'manual',
      timestamp: _fmtTs(0, hour, now.getMinutes(), ampm),
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
    if (e.key === 'Enter') {
      if (editingId) {
        handleEditSave()
      } else {
        handleAdd()
      }
    }
  }

  return (
    <div className="flex flex-col justify-between min-h-full">
      {/* Content */}
      <div className="flex flex-col gap-8">
        {/* Title Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-title-1-bold text-label-normal">매매원칙</h1>
            {principles.length > 0 && (
              <span className="flex items-center justify-center min-w-[26px] h-[26px] px-1.5 rounded-full bg-gray-800 text-body-2-medium text-white">
                {principles.length}
              </span>
            )}
          </div>
          <p className="text-body-1-regular text-label-neutral">
            AI가 분석한 매매 습관을 기반으로 원칙을 추천합니다. 자유롭게 수정하거나 새로운 원칙을 추가해 보세요.
          </p>
        </div>

        {/* Empty State */}
        {principles.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-32">
            <Flag className="w-10 h-10 text-gray-300 mb-4" />
            <p className="text-body-1-regular text-label-assistive text-center">
              아직 등록된 매매 원칙이 없습니다.
            </p>
            <p className="text-body-1-regular text-label-assistive text-center">
              매매 중 느낀 점이나 지키고 싶은 기준을 자유롭게 적어보세요.
            </p>
          </div>
        ) : (
          /* Principles List */
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
                  {/* AI Description */}
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
                      onKeyDown={handleKeyDown}
                      className="flex-1 px-4 py-3 border border-line-normal rounded-lg text-body-1-regular text-label-normal focus:outline-none focus:border-line-focused"
                      autoFocus
                    />
                    <button
                      onClick={handleEditCancel}
                      className="px-4 py-2.5 border border-line-normal rounded-lg text-body-1-medium text-label-normal hover:bg-gray-50 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleEditSave}
                      className="px-4 py-2.5 bg-gray-800 rounded-lg text-body-1-medium text-white hover:bg-gray-700 transition-colors"
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
        )}
      </div>

      {/* Bottom Input Section */}
      <div className="flex items-center gap-4 pt-8">
        <input
          type="text"
          value={newPrinciple}
          onChange={(e) => setNewPrinciple(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
          placeholder="새로운 매매 원칙을 입력해 주세요. (예. 하루 최대 3회까지만 거래한다.)"
          className="flex-1 px-4 py-3 border border-line-normal rounded-lg text-body-1-regular placeholder:text-label-disabled focus:outline-none focus:border-line-focused"
        />
        <button
          onClick={handleAdd}
          disabled={!newPrinciple.trim()}
          className={cn(
            "px-4 py-2.5 rounded-lg text-body-1-medium transition-colors flex-shrink-0",
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
