'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Mic, Send, TrendingUp, Search, Target, Bell, Newspaper, MessageSquare, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useAIChatStore } from '@/stores'

// Suggested prompts from Figma design
const SUGGESTED_PROMPTS = [
  {
    icon: TrendingUp,
    text: '현재 차트에서 4시간봉 기준으로 지지/저항선을 분석하고 차트에 그려줘',
  },
  {
    icon: Search,
    text: '최근 90일의 내 모든 거래에서 4시간 봉 기준으로 EMA 지표만 사용했을 경우, 예상되는 결과를 보여줘',
  },
  {
    icon: Target,
    text: '최근 7일 간 내 매매 전략 별 승률을 분석하고, 문제점을 분석해서 내 매매 원칙을 설정해줘',
  },
  {
    icon: Bell,
    text: '1시간 봉 기준으로 볼린저 밴드를 터치할 때 진입 트리거를 설정해줘',
  },
  {
    icon: Newspaper,
    text: '오늘 매매 시작 전 알아야 하는 이슈와 비트코인 시장 상황을 브리핑 해줘',
  },
]

// Action menu SVG icons
function IconCamera({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.6667 12.6667C14.6667 13.0203 14.5262 13.3594 14.2761 13.6095C14.0261 13.8595 13.687 14 13.3333 14H2.66667C2.31305 14 1.97391 13.8595 1.72386 13.6095C1.47381 13.3594 1.33334 13.0203 1.33334 12.6667V5.33333C1.33334 4.97971 1.47381 4.64057 1.72386 4.39052C1.97391 4.14048 2.31305 4 2.66667 4H5.33334L6.66667 2H9.33334L10.6667 4H13.3333C13.687 4 14.0261 4.14048 14.2761 4.39052C14.5262 4.64057 14.6667 4.97971 14.6667 5.33333V12.6667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="8.66667" r="2.66667" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}

function IconChartBar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 13.3333V6.66667M10 13.3333V2.66667M2 13.3333V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconEdit({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.3333 2.00004C11.5084 1.82494 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.4191 1.44775 12.6667 1.44775C12.9143 1.44775 13.1594 1.49653 13.3882 1.59129C13.617 1.68605 13.8249 1.82494 14 2.00004C14.1751 2.17513 14.314 2.383 14.4088 2.61181C14.5035 2.84062 14.5523 3.08578 14.5523 3.33337C14.5523 3.58097 14.5035 3.82613 14.4088 4.05494C14.314 4.28375 14.1751 4.49161 14 4.66671L5 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00004Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconBell({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5.33333C12 4.27247 11.5786 3.25505 10.8284 2.50491C10.0783 1.75476 9.06087 1.33333 8 1.33333C6.93913 1.33333 5.92172 1.75476 5.17157 2.50491C4.42143 3.25505 4 4.27247 4 5.33333C4 10 2 11.3333 2 11.3333H14C14 11.3333 12 10 12 5.33333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.15333 13.3333C8.97268 13.6451 8.71003 13.9027 8.39434 14.0773C8.07865 14.2519 7.72165 14.3371 7.36133 14.3238C7.00101 14.3105 6.65134 14.1993 6.34914 14.0023C6.04695 13.8052 5.80351 13.5296 5.64533 13.2053" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Action menu items
const ACTION_MENU_ITEMS = [
  { icon: IconCamera, label: '사진 및 파일 업로드' },
  { icon: IconChartBar, label: '차트 분석 요청' },
  { icon: IconEdit, label: '매매일지 작성' },
  { icon: IconBell, label: '트리거 설정' },
]

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '오늘'
  if (days === 1) return '어제'
  if (days < 7) return `${days}일 전`
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export default function TradexAIPage() {
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)
  const actionMenuRef = useRef<HTMLDivElement>(null)
  const { conversations, createConversation, deleteConversation, setActiveConversation } = useAIChatStore()

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt)
  }

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    // Create a new conversation and navigate to chat page
    const convId = createConversation()
    router.push(`/ai/chat?id=${convId}&q=${encodeURIComponent(inputValue)}`)
  }

  const handleConversationClick = (convId: string) => {
    setActiveConversation(convId)
    router.push(`/ai/chat?id=${convId}`)
  }

  const handleDeleteConversation = (e: React.MouseEvent, convId: string) => {
    e.stopPropagation()
    deleteConversation(convId)
  }

  return (
    <div className="min-h-[calc(100vh-48px)] flex flex-col items-center justify-center px-9 py-8 gap-[60px]">
      {/* Logo - Figma: Tradex wave icon + text, centered */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/tradex-icon.svg"
          alt="Tradex"
          width={48}
          height={48}
          priority
        />
        <span className="text-[40px] font-bold text-label-normal tracking-tight">Tradex</span>
      </div>

      {/* Bottom Section - Figma: width 700px, gap 16px */}
      <div className="w-full max-w-[700px] flex flex-col gap-4">
        {/* Prompt Input - Figma: 700x52px, rounded-full, shadow-emphasize */}
        <div className="relative" ref={actionMenuRef}>
          <div className="flex items-center h-[52px] bg-white border border-gray-300 rounded-full px-3 gap-4 shadow-emphasize">
            {/* Plus Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full hover:bg-gray-100"
              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            >
              <Plus className="w-5 h-5 text-label-normal" />
            </Button>

            {/* Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Tradex AI에게 무엇이든 물어보세요!"
              className="flex-1 text-body-1-regular text-label-normal placeholder:text-label-disabled focus:outline-none bg-transparent"
            />

            {/* Mic/Send Button */}
            {inputValue.trim() ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full bg-gray-800 hover:bg-gray-700"
                onClick={handleSubmit}
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full hover:bg-gray-100"
              >
                <Mic className="w-5 h-5 text-label-normal" />
              </Button>
            )}
          </div>

          {/* Action Menu Dropdown */}
          {isActionMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-line-normal rounded-xl shadow-emphasize py-2 z-10">
              {ACTION_MENU_ITEMS.map((item, index) => {
                const ItemIcon = item.icon
                return (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-body-2-regular text-label-neutral hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setIsActionMenuOpen(false)
                    }}
                  >
                    <ItemIcon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Conversation History or Suggestion Prompts */}
        {conversations.length > 0 ? (
          <div className="flex flex-col gap-2">
            {/* Recent conversations */}
            <div className="flex items-center justify-between px-3 pt-2">
              <span className="text-body-2-bold text-label-neutral">최근 대화</span>
              <span className="text-caption-regular text-label-assistive">{conversations.length}개</span>
            </div>
            <div className="flex flex-col">
              {conversations.slice(0, 5).map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleConversationClick(conv.id)}
                  className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <MessageSquare className="w-4 h-4 text-label-assistive shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-2-medium text-label-normal truncate">{conv.title}</p>
                    <p className="text-caption-regular text-label-assistive">
                      {conv.messages.length}개 메시지 · {formatDate(conv.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-label-assistive" />
                  </button>
                </button>
              ))}
            </div>

            {/* Divider + suggestion prompts */}
            <div className="border-t border-line-normal mt-2 pt-2">
              <span className="text-body-2-bold text-label-neutral px-3">추천 질문</span>
            </div>
            <div className="flex flex-col">
              {SUGGESTED_PROMPTS.slice(0, 3).map((prompt, index) => {
                const IconComponent = prompt.icon
                return (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt.text)}
                    className="flex items-center gap-4 px-3 py-3 text-left rounded-[200px] hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                      <IconComponent className="w-[14px] h-[14px] text-label-neutral" />
                    </div>
                    <span className="text-body-2-regular text-label-neutral">
                      {prompt.text}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          /* No history - show all suggestions */
          <div className="flex flex-col">
            {SUGGESTED_PROMPTS.map((prompt, index) => {
              const IconComponent = prompt.icon
              return (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="flex items-center gap-4 px-3 py-3 text-left rounded-[200px] hover:bg-gray-50 transition-colors"
                >
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                    <IconComponent className="w-[14px] h-[14px] text-label-neutral" />
                  </div>
                  <span className="text-body-2-regular text-label-neutral">
                    {prompt.text}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
