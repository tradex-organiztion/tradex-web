'use client'

import { useState } from 'react'
import { ChevronsRight, MoreVertical } from 'lucide-react'
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
    aiDescription: '손절 라인을 자주 변경하여 손실이 확대되는 경향이 있습니다.',
    timestamp: _fmtTs(0, 11, 20, '오전'),
  },
  {
    id: '3',
    text: '오후 9시 이후에는 신규 포지션을 진입하지 않습니다.',
    source: 'ai',
    aiDescription: '야간 시간대 매매에서 손실률이 높게 나타났습니다.',
    timestamp: _fmtTs(1, 3, 15, '오후'),
  },
  {
    id: '4',
    text: '포지션 진입 전 반드시 매매 일지에 진입 근거와 목표가, 손절가를 미리 작성합니다.',
    source: 'ai',
    aiDescription: '사전 시나리오 없이 진입한 매매의 손실률이 높습니다.',
    timestamp: _fmtTs(1, 9, 0, '오전'),
  },
  {
    id: '5',
    text: '전체 자산의 10% 이상을 단일 포지션에 투자하지 않습니다.',
    source: 'manual',
    timestamp: _fmtTs(2, 6, 0, '오후'),
  },
]

interface PrinciplesSidePanelProps {
  onClose?: () => void
}

export function PrinciplesSidePanel({ onClose }: PrinciplesSidePanelProps) {
  const [principles, setPrinciples] = useState<Principle[]>(samplePrinciples)
  const [newPrinciple, setNewPrinciple] = useState('')

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd()
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
        <div className="pt-8">
          {/* Title Section */}
          <div className="px-5 space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-title-1-bold text-label-normal">매매원칙</h2>
              <span className="flex items-center justify-center min-w-[26px] h-5 px-2 rounded-full bg-gray-800 text-body-2-medium text-white">
                {principles.length}
              </span>
            </div>
            <p className="text-body-1-regular text-label-neutral">
              AI가 분석한 매매 습관을 기반으로 원칙을 추천합니다. 자유롭게 수정하거나 새로운 원칙을 추가해 보세요.
            </p>
          </div>

          {/* Principles List */}
          <div>
            {principles.map((principle) => (
              <div key={principle.id} className="px-5 py-4 border-b border-line-normal space-y-4">
                {/* Metadata */}
                <div className="space-y-3">
                  {/* Badge + Timestamp */}
                  <div className="flex items-center justify-between">
                    {principle.source === 'ai' ? (
                      <span className="px-2 py-0.5 rounded text-caption-medium text-white bg-gradient-to-r from-symbol-main to-symbol-sub">
                        AI 분석
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-caption-medium text-label-normal bg-gray-100">
                        직접 추가
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                      <span className="text-caption-regular text-label-assistive text-right">
                        {principle.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* AI Description */}
                  {principle.aiDescription && (
                    <p className="text-body-2-regular text-label-neutral">
                      {principle.aiDescription}
                    </p>
                  )}
                </div>

                {/* Principle Text */}
                <div className="flex items-center gap-4">
                  <p className="flex-1 text-body-1-medium text-label-normal">
                    {principle.text}
                  </p>
                  <button className="p-1 flex-shrink-0 hover:bg-gray-50 rounded transition-colors">
                    <MoreVertical className="w-6 h-6 text-label-assistive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Input Bar */}
      <div className="flex items-center gap-4 p-4">
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
            "px-3 py-2 rounded-lg text-body-1-medium transition-colors flex-shrink-0",
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
