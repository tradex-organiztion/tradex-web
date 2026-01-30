'use client'

import { useState } from 'react'
import { Plus, Mic, Send, TrendingUp, Search, Target, Bell, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUIStore } from '@/stores'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  stats?: {
    winRate: string
    profit: string
    totalTrades: number
    profitFactor: number
  }
}

// Suggestion prompts matching Figma design
const SUGGESTION_PROMPTS = [
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

export function TradexAIPanel() {
  const router = useRouter()
  const { isAIPanelOpen, setAIPanelOpen } = useUIStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulated AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '최근 90일간 4시간봉 EMA(20, 50, 200) 골든크로스/ 데드크로스 전략 시뮬레이션 결과입니다.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        stats: {
          winRate: '64.2%',
          profit: '+ $12,450',
          totalTrades: 42,
          profitFactor: 2.1,
        },
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleExpand = () => {
    setAIPanelOpen(false)
    router.push('/ai')
  }

  if (!isAIPanelOpen) return null

  return (
    <div className="fixed bottom-0 right-0 top-0 z-50 flex w-[400px] flex-col bg-white shadow-emphasize border-l border-[#D7D7D7]">
      {/* Header - Figma: padding 0 20px, gap 8px, border-bottom 0.6px */}
      <div className="flex items-center gap-2 px-5 h-12 border-b border-[#D7D7D7]">
        <button
          onClick={() => setAIPanelOpen(false)}
          className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <Image
            src="/icons/icon-double-chevron.svg"
            alt="Close"
            width={20}
            height={20}
          />
        </button>
        <button
          onClick={handleExpand}
          className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <Image
            src="/icons/icon-expand.svg"
            alt="Expand"
            width={20}
            height={20}
          />
        </button>
      </div>

      {/* Messages Area - Figma: padding 32px 16px, gap 16px */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        {messages.length === 0 ? (
          /* Empty State with Suggestions - Figma: gap 16px */
          <div className="flex flex-col h-full">
            {/* Center Logo */}
            <div className="flex-1 flex items-center justify-center">
              <Image
                src="/tradex-logo-black.svg"
                alt="Tradex"
                width={203}
                height={32}
                priority
              />
            </div>
            {/* Suggestions - Figma: padding 0 12px, gap 16px */}
            <div className="flex flex-col gap-4">
              {SUGGESTION_PROMPTS.map((prompt, index) => {
                const IconComponent = prompt.icon
                return (
                  <button
                    key={index}
                    className="flex items-center gap-4 px-3 text-left hover:bg-gray-50 rounded-[200px] transition-colors"
                    onClick={() => handleSend(prompt.text)}
                  >
                    {/* Icon - Figma: 20x20px container */}
                    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                      <IconComponent className="w-[14px] h-[14px] text-gray-600" />
                    </div>
                    {/* Text - Figma: Body 2/Regular, #767676 */}
                    <span className="text-body-2-regular text-gray-600 py-1">
                      {prompt.text}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          /* Chat Messages - Figma: gap 16px */
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div key={message.id} className="w-[360px]">
                {message.role === 'user' ? (
                  /* User Message - Figma: padding-left 60px, align flex-end */
                  <div className="pl-[60px]">
                    <div className="flex justify-end gap-4">
                      <div className="flex flex-col items-end gap-2 flex-1">
                        {/* Message Box - Figma: padding 16px 20px, border-radius 12px 0 12px 12px, border 0.5px #D7D7D7 */}
                        <div className="bg-white border border-[#D7D7D7] rounded-tl-xl rounded-bl-xl rounded-br-xl px-5 py-4">
                          <p className="text-body-1-regular text-gray-800">
                            {message.content}
                          </p>
                        </div>
                        {/* Timestamp - Figma: Caption/Regular, #8F8F8F */}
                        <span className="text-caption-regular text-gray-500">
                          {message.timestamp}
                        </span>
                      </div>
                      {/* Profile - Figma: 32x32 */}
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src="/avatar.png" />
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                          U
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ) : (
                  /* Assistant Message - Figma: padding-right 60px */
                  <div className="pr-[60px]">
                    <div className="flex gap-4">
                      {/* Profile - Figma: 32x32 with Tradex logo */}
                      <div className="h-8 w-8 shrink-0 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                        <Image
                          src="/tradex-logo-black.svg"
                          alt="Tradex AI"
                          width={20}
                          height={20}
                          className="invert"
                        />
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        {/* Message Box - Figma: padding 16px 20px, bg #F8F8F8, border-radius 0 12px 12px 12px */}
                        <div className="bg-gray-50 rounded-tr-xl rounded-bl-xl rounded-br-xl px-5 py-4">
                          <p className="text-body-2-regular text-gray-800">
                            {message.content}
                          </p>
                          {/* Stats Card - Figma: gap 12px */}
                          {message.stats && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <div className="bg-white rounded-lg px-4 py-3">
                                <p className="text-caption-regular text-gray-500 mb-1">승률</p>
                                <p className="text-body-1-bold text-gray-800">{message.stats.winRate}</p>
                              </div>
                              <div className="bg-white rounded-lg px-4 py-3">
                                <p className="text-caption-regular text-gray-500 mb-1">순이익</p>
                                <p className="text-body-1-bold text-green-400">{message.stats.profit}</p>
                              </div>
                              <div className="bg-white rounded-lg px-4 py-3">
                                <p className="text-caption-regular text-gray-500 mb-1">총 거래 수</p>
                                <p className="text-body-1-bold text-gray-800">{message.stats.totalTrades}</p>
                              </div>
                              <div className="bg-white rounded-lg px-4 py-3">
                                <p className="text-caption-regular text-gray-500 mb-1">수익 팩터</p>
                                <p className="text-body-1-bold text-gray-800">{message.stats.profitFactor}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Timestamp - Figma: Caption/Regular, #8F8F8F */}
                        <span className="text-caption-regular text-gray-500">
                          {message.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading State */}
            {isLoading && (
              <div className="w-[360px] pr-[60px]">
                <div className="flex gap-4">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/tradex-logo-black.svg"
                      alt="Tradex AI"
                      width={20}
                      height={20}
                      className="invert"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 px-5 py-4">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area - Figma: padding 12px 20px, border-top 0.6px #D7D7D7 */}
      <div className="px-5 py-3 border-t border-[#D7D7D7]">
        {/* Prompt Input - Figma: padding 8px 0, gap 16px */}
        <div className="flex items-center gap-4 py-2">
          {/* Plus Button - Figma: 36x36px ghost */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full hover:bg-gray-100"
          >
            <Plus className="w-5 h-5 text-gray-800" />
          </Button>

          {/* Input - Figma: Body 1/Regular, placeholder #BABABA */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="무엇이든 물어보세요!"
            className="flex-1 bg-transparent text-body-1-regular text-gray-800 placeholder:text-gray-400 focus:outline-none"
          />

          {/* Mic/Send Button - Figma: 36x36px ghost */}
          {input.trim() ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full bg-gray-800 hover:bg-gray-700"
              onClick={() => handleSend()}
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
      </div>
    </div>
  )
}
