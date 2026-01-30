'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Mic, Send, TrendingUp, Search, Target, Bell, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

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
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-9 py-8 gap-[60px]">
      {/* Logo - Figma: 203x32px */}
      <Image
        src="/tradex-logo-black.svg"
        alt="Tradex"
        width={203}
        height={32}
        priority
      />

      {/* Bottom Section - Figma: width 700px, gap 16px */}
      <div className="w-full max-w-[700px] flex flex-col gap-4">
        {/* Prompt Input - Figma: 700x52px, rounded-full, shadow-emphasize */}
        <div className="relative" ref={actionMenuRef}>
          <div className="flex items-center h-[52px] bg-white border border-[#D7D7D7] rounded-full px-3 gap-4 shadow-emphasize">
            {/* Plus Button - Figma: 36x36px ghost button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full hover:bg-gray-100"
              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            >
              <Plus className="w-5 h-5 text-gray-800" />
            </Button>

            {/* Input - Figma: Body 1/Regular, placeholder #BABABA */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Tradex AI에게 무엇이든 물어보세요!"
              className="flex-1 text-body-1-regular text-label-normal placeholder:text-label-disabled focus:outline-none bg-transparent"
            />

            {/* Mic/Send Button - Figma: 36x36px ghost button */}
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
                <Mic className="w-5 h-5 text-gray-800" />
              </Button>
            )}
          </div>

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

        {/* Action Samples - Figma: column layout, each card has padding 12px, gap 16px */}
        <div className="flex flex-col">
          {SUGGESTED_PROMPTS.map((prompt, index) => {
            const IconComponent = prompt.icon
            return (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt.text)}
                className="flex items-center gap-4 px-3 py-3 text-left rounded-[200px] hover:bg-gray-50 transition-colors"
              >
                {/* Icon Container - Figma: 20x20px */}
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  <IconComponent className="w-[14px] h-[14px] text-gray-600" />
                </div>
                {/* Text - Figma: Body 2/Regular, #767676 */}
                <span className="text-body-2-regular text-gray-600">
                  {prompt.text}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
