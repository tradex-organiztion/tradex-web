'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Mic, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Suggested prompts from Figma design
const SUGGESTED_PROMPTS = [
  {
    icon: '📈',
    text: '현재 차트에서 4시간봉 기준으로 지지/저항선을 분석하고 차트에 그려줘',
  },
  {
    icon: '🔍',
    text: '최근 90일의 내 모든 거래에서 4시간 봉 기준으로 EMA 지표만 사용했을 경우, 예상되는 결과를 보여줘',
  },
  {
    icon: '📊',
    text: '최근 7일 간 내 매매 전략 별 승률을 분석하고, 문제점을 분석해서 내 매매 원칙을 설정해줘',
  },
  {
    icon: '🔔',
    text: '1시간 봉 기준으로 볼린저 밴드를 터치할 때 진입 트리거를 설정해줘',
  },
  {
    icon: '📰',
    text: '오늘 매매 시작 전 알아야 하는 이슈와 비트코인 시장 상황을 브리핑 해줘',
  },
]

// Action menu items
const ACTION_MENU_ITEMS = [
  { icon: '📷', label: '사진 및 파일 업로드' },
  { icon: '📊', label: '차트 분석 요청' },
  { icon: '📝', label: '매매일지 작성' },
  { icon: '🔔', label: '트리거 설정' },
]

export default function TradexAIPage() {
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)
  const actionMenuRef = useRef<HTMLDivElement>(null)

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
    // Navigate to chat page with the prompt
    router.push(`/ai/chat?q=${encodeURIComponent(inputValue)}`)
  }

  return (
    <div className="min-h-[calc(100vh-40px)] flex flex-col items-center justify-center -mt-8">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-element-primary-default rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <span className="text-display-2-bold text-label-normal">Tradex</span>
      </div>

      {/* Input Area */}
      <div className="w-full max-w-[600px] px-4">
        <div className="relative flex items-center bg-white border border-line-normal rounded-full px-5 py-3 shadow-normal focus-within:border-line-focused focus-within:shadow-emphasize transition-all">
          {/* Plus Button */}
          <div className="relative" ref={actionMenuRef}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            >
              <Plus className="w-5 h-5 text-label-assistive" />
            </Button>

            {/* Action Menu Dropdown */}
            {isActionMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-line-normal rounded-xl shadow-emphasize py-2 z-10">
                {ACTION_MENU_ITEMS.map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-body-2-regular text-label-neutral hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setIsActionMenuOpen(false)
                      // TODO: Handle action
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Tradex AI에게 무엇이든 물어보세요!"
            className="flex-1 px-3 text-body-2-regular text-label-normal placeholder:text-label-assistive focus:outline-none"
          />

          {/* Submit/Mic Button */}
          {inputValue.trim() ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={handleSubmit}
            >
              <Send className="w-5 h-5 text-label-normal" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
              <Mic className="w-5 h-5 text-label-assistive" />
            </Button>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="mt-8 space-y-2">
          {SUGGESTED_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handlePromptClick(prompt.text)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left text-body-2-regular text-label-neutral hover:bg-gray-50 rounded-xl transition-colors"
            >
              <span className="text-base shrink-0">{prompt.icon}</span>
              <span className="leading-relaxed line-clamp-2">{prompt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
