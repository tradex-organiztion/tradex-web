'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { tradingPrincipleApi } from '@/lib/api'
import type { TradingPrincipleResponse } from '@/lib/api'
import { useAuthStore } from '@/stores'

// 데모용 확장 타입 (AI 분석 설명 포함)
interface PrincipleWithAI extends TradingPrincipleResponse {
  aiAnalysis?: string
}

// 데모용 매매 원칙 데이터
const DEMO_PRINCIPLES: PrincipleWithAI[] = [
  {
    id: 1,
    content: '하루에 3회 이상 연속 손실이 발생하면 그날은 더 이상 거래하지 않습니다.',
    aiAnalysis: '과거 데이터 분석 결과, 연속 손실 후 감정적 매매로 인한 추가 손실이 82%의 확률로 발생했습니다.',
    createdAt: '2026-01-30T13:45:00',
    updatedAt: '2026-01-30T13:45:00',
  },
  {
    id: 2,
    content: '손절 기준은 진입가 대비 2% 이하로 설정하고, 어떤 경우에도 이를 변경하거나 무시하지 않습니다.',
    aiAnalysis: '손절을 지키지 않은 경우 평균 손실이 7.3%까지 확대되었습니다.',
    createdAt: '2026-01-30T13:45:00',
    updatedAt: '2026-01-30T13:45:00',
  },
  {
    id: 3,
    content: '오후 9시 이후에는 신규 포지션을 진입하지 않습니다.',
    aiAnalysis: '야간 거래 시 승률이 37%로 낮고, 변동성이 큰 시간대에서 비계획적 매매가 많이 발생했습니다.',
    createdAt: '2026-01-30T13:45:00',
    updatedAt: '2026-01-30T13:45:00',
  },
  {
    id: 4,
    content: '포지션 진입 전 반드시 매매 일지에 진입 근거와 목표가, 손절가를 미리 작성합니다.',
    aiAnalysis: '사전 계획 없이 진입한 경우 평균 수익률이 -1.8%였으나, 계획을 세운 경우 +4.2%를 기록했습니다.',
    createdAt: '2026-01-30T13:45:00',
    updatedAt: '2026-01-30T13:45:00',
  },
  {
    id: 5,
    content: '전체 자산의 10% 이상을 단일 포지션에 투자하지 않습니다.',
    createdAt: '2026-01-29T13:45:00',
    updatedAt: '2026-01-29T13:45:00',
  },
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours < 12 ? '오전' : '오후'
  const h12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${yyyy}.${mm}.${dd} ${ampm} ${String(h12).padStart(2, '0')}:${minutes}`
}

// 깃발 아이콘 (빈 상태용)
function EmptyFlagIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 30C8 30 10 28 16 28C22 28 26 32 32 32C38 32 40 30 40 30V6C40 6 38 8 32 8C26 8 22 4 16 4C10 4 8 6 8 6V30Z" stroke="#D7D7D7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 44V30" stroke="#D7D7D7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function TradingPrinciplesPage() {
  const { isDemoMode } = useAuthStore()
  const [principles, setPrinciples] = useState<PrincipleWithAI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newContent, setNewContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  // Menu state
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch principles
  const fetchPrinciples = useCallback(async () => {
    if (isDemoMode) {
      setPrinciples(DEMO_PRINCIPLES)
      setIsLoading(false)
      return
    }

    const data = await tradingPrincipleApi.getAll().catch((err) => {
      console.warn('Principles fetch error:', err.message)
      return null
    })

    if (data) {
      setPrinciples(data)
    }
    setIsLoading(false)
  }, [isDemoMode])

  useEffect(() => {
    fetchPrinciples()
  }, [fetchPrinciples])

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Create
  const handleCreate = async () => {
    if (!newContent.trim() || isSubmitting) return

    if (isDemoMode) {
      const newPrinciple: PrincipleWithAI = {
        id: Date.now(),
        content: newContent.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setPrinciples((prev) => [...prev, newPrinciple])
      setNewContent('')
      return
    }

    setIsSubmitting(true)
    const result = await tradingPrincipleApi.create({ content: newContent.trim() }).catch((err) => {
      console.warn('Principle create error:', err.message)
      return null
    })
    if (result) {
      setPrinciples((prev) => [...prev, result])
      setNewContent('')
    }
    setIsSubmitting(false)
  }

  // Update
  const handleUpdate = async (id: number) => {
    if (!editContent.trim() || isUpdating) return

    if (isDemoMode) {
      setPrinciples((prev) =>
        prev.map((p) => (p.id === id ? { ...p, content: editContent.trim(), updatedAt: new Date().toISOString() } : p))
      )
      setEditingId(null)
      setEditContent('')
      return
    }

    setIsUpdating(true)
    const result = await tradingPrincipleApi.update(id, { content: editContent.trim() }).catch((err) => {
      console.warn('Principle update error:', err.message)
      return null
    })
    if (result) {
      setPrinciples((prev) => prev.map((p) => (p.id === id ? result : p)))
    }
    setEditingId(null)
    setEditContent('')
    setIsUpdating(false)
  }

  // Delete
  const handleDelete = async (id: number) => {
    setMenuOpenId(null)

    if (isDemoMode) {
      setPrinciples((prev) => prev.filter((p) => p.id !== id))
      return
    }

    await tradingPrincipleApi.delete(id).catch((err) => {
      console.warn('Principle delete error:', err.message)
    })
    setPrinciples((prev) => prev.filter((p) => p.id !== id))
  }

  // Start edit
  const handleStartEdit = (principle: PrincipleWithAI) => {
    setMenuOpenId(null)
    setEditingId(principle.id)
    setEditContent(principle.content)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleCreate()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-9 pt-8 pb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-title-1-bold text-label-normal">매매원칙</h1>
          {principles.length > 0 && (
            <span className="flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full bg-gray-900 text-white text-caption-bold">
              {principles.length}
            </span>
          )}
        </div>
        <p className="text-body-2-regular text-label-neutral mt-2">
          AI가 분석한 매매 습관을 기반으로 원칙을 추천합니다. 자유롭게 수정하거나 새로운 원칙을 추가해 보세요.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-9 pb-4">
        {principles.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32">
            <EmptyFlagIcon />
            <p className="text-body-1-regular text-label-neutral mt-6">아직 등록된 매매 원칙이 없습니다.</p>
            <p className="text-body-2-regular text-label-assistive mt-1">매매 중 느낀 점이나 지키고 싶은 기준을 자유롭게 적어보세요.</p>
          </div>
        ) : (
          /* Principles list */
          <div className="flex flex-col">
            {principles.map((principle) => (
              <div
                key={principle.id}
                className="flex items-start gap-3 py-5 border-b border-line-normal last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  {/* Badge + AI description + Date row */}
                  <div className="flex items-center gap-2 mb-2">
                    {principle.aiAnalysis ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-caption-medium bg-green-400 text-white shrink-0">
                        AI 분석
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-caption-medium border border-line-normal text-label-neutral shrink-0">
                        직접 추가
                      </span>
                    )}
                    {principle.aiAnalysis && (
                      <span className="text-body-2-regular text-label-assistive truncate">{principle.aiAnalysis}</span>
                    )}
                    <span className="text-caption-regular text-label-assistive flex items-center gap-1.5 shrink-0 ml-auto">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-900 inline-block" />
                      {formatDate(principle.createdAt)}
                    </span>
                  </div>

                  {/* Content - edit mode or display */}
                  {editingId === principle.id ? (
                    <div className="flex items-center gap-3">
                      <input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                            e.preventDefault()
                            handleUpdate(principle.id)
                          }
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        className="flex-1 px-4 py-3 border border-line-normal rounded-lg text-body-1-regular text-label-normal focus:outline-none focus:border-line-focused"
                        autoFocus
                      />
                      <button
                        onClick={handleCancelEdit}
                        className="px-5 py-3 border border-line-normal rounded-lg text-body-2-medium text-label-normal hover:bg-gray-50 transition-colors shrink-0"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleUpdate(principle.id)}
                        disabled={isUpdating || !editContent.trim()}
                        className="px-5 py-3 bg-gray-900 text-white rounded-lg text-body-2-medium hover:bg-gray-800 transition-colors shrink-0 disabled:opacity-50"
                      >
                        완료
                      </button>
                    </div>
                  ) : (
                    <p className="text-body-1-bold text-label-normal">{principle.content}</p>
                  )}
                </div>

                {/* Three-dot menu */}
                {editingId !== principle.id && (
                  <div className="relative shrink-0" ref={menuOpenId === principle.id ? menuRef : undefined}>
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === principle.id ? null : principle.id)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-label-neutral" />
                    </button>

                    {menuOpenId === principle.id && (
                      <div className="absolute right-0 top-8 z-10 w-28 bg-white border border-line-normal rounded-lg shadow-emphasize overflow-hidden">
                        <button
                          onClick={() => handleStartEdit(principle)}
                          className="w-full px-4 py-2.5 text-left text-body-2-regular text-label-normal hover:bg-gray-50 transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(principle.id)}
                          className="w-full px-4 py-2.5 text-left text-body-2-regular text-label-danger hover:bg-gray-50 transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom input bar - sticky */}
      <div className="border-t border-line-normal px-9 py-4 bg-white">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="새로운 매매 원칙을 입력해 주세요. (예. 하루 최대 3회까지만 거래한다.)"
            className="flex-1 px-4 py-3 border border-line-normal rounded-lg text-body-2-regular text-label-normal placeholder:text-label-assistive focus:outline-none focus:border-line-focused"
          />
          <button
            onClick={handleCreate}
            disabled={!newContent.trim() || isSubmitting}
            className={cn(
              "px-6 py-3 rounded-lg text-body-2-medium transition-colors shrink-0",
              newContent.trim()
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-100 text-label-disabled"
            )}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  )
}
