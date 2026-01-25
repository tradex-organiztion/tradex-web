'use client'

import { useState } from 'react'
import { ChevronRight, Plus, Mic, ArrowUpRight, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUIStore } from '@/stores'
import { cn } from '@/lib/utils'

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

interface SuggestionChip {
  id: string
  icon: string
  text: string
}

const SUGGESTION_CHIPS: SuggestionChip[] = [
  { id: '1', icon: '📈', text: '현재 차트에서 4시간봉 기준으로 지지/저항선을 분석하고 차트에 그려줘' },
  { id: '2', icon: '🔍', text: '최근 90일의 내 모든 거래에서 4시간 봉 기준으로 EMA 지표만 사용했을 경우, 예상되는 결과를 보여줘' },
  { id: '3', icon: '📊', text: '최근 7일 간 내 매매 전략 별 승률을 분석하고, 문제점을 분석해서 내 매매 원칙을 설정해줘' },
  { id: '4', icon: '🔔', text: '1시간 봉 기준으로 볼린저 밴드를 터치할 때 진입 트리거를 설정해줘' },
  { id: '5', icon: '📰', text: '오늘 매매 시작 전 알아야 하는 이슈와 비트코인 시장 상황을 브리핑 해줘' },
]

export function TradexAIPanel() {
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

  if (!isAIPanelOpen) return null

  return (
    <div className="fixed bottom-0 right-0 top-0 z-50 flex w-[400px] flex-col border-l border-line-normal bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line-normal">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAIPanelOpen(false)}
          className="p-0 h-6 w-6"
        >
          <ChevronRight className="h-5 w-5 text-label-assistive" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-0 h-6 w-6"
        >
          <ArrowUpRight className="h-5 w-5 text-label-assistive" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          /* Empty State with Suggestions */
          <div className="flex flex-col h-full justify-end pb-4">
            <div className="space-y-2">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  className="flex items-start gap-2 w-full text-left px-3 py-2.5 rounded-lg border border-line-normal hover:bg-gray-50 transition-colors"
                  onClick={() => handleSend(chip.text)}
                >
                  <span className="text-base shrink-0">{chip.icon}</span>
                  <span className="text-body-2-regular text-label-neutral line-clamp-2">
                    {chip.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'user' ? (
                  /* User Message */
                  <div className="flex justify-end gap-2">
                    <div className="max-w-[280px] rounded-2xl bg-gray-100 px-4 py-3">
                      <p className="text-body-2-regular text-label-normal">
                        {message.content}
                      </p>
                    </div>
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src="/avatar.png" />
                      <AvatarFallback className="bg-gray-200 text-label-neutral text-xs">
                        U
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  /* Assistant Message */
                  <div className="flex gap-2">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-element-primary-default flex items-center justify-center">
                      <span className="text-white text-sm font-bold">T</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <p className="text-body-2-regular text-label-normal">
                        {message.content}
                      </p>
                      {message.stats && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-50 rounded-lg px-4 py-3">
                            <p className="text-caption-regular text-label-assistive mb-1">승률</p>
                            <p className="text-body-1-bold text-label-normal">{message.stats.winRate}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg px-4 py-3">
                            <p className="text-caption-regular text-label-assistive mb-1">순이익</p>
                            <p className="text-body-1-bold text-label-positive">{message.stats.profit}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg px-4 py-3">
                            <p className="text-caption-regular text-label-assistive mb-1">총 거래 수</p>
                            <p className="text-body-1-bold text-label-normal">{message.stats.totalTrades}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg px-4 py-3">
                            <p className="text-caption-regular text-label-assistive mb-1">수익 팩터</p>
                            <p className="text-body-1-bold text-label-normal">{message.stats.profitFactor}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <p className={cn(
                  "text-caption-regular text-label-assistive mt-1",
                  message.role === 'user' ? "text-right mr-10" : "ml-10"
                )}>
                  {message.timestamp}
                </p>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2">
                <div className="h-8 w-8 shrink-0 rounded-full bg-element-primary-default flex items-center justify-center">
                  <span className="text-white text-sm font-bold">T</span>
                </div>
                <div className="flex items-center gap-1.5 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-label-assistive" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-label-assistive" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-label-assistive" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-line-normal">
        <div className="flex items-center gap-2 px-4 py-3 border border-line-normal rounded-full">
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0 shrink-0">
            <Plus className="h-5 w-5 text-label-assistive" />
          </Button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="무엇이든 물어보세요!"
            className="flex-1 bg-transparent text-body-2-regular placeholder:text-label-assistive focus:outline-none"
          />
          {input.trim() ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 shrink-0"
              onClick={() => handleSend()}
            >
              <Send className="h-5 w-5 text-label-normal" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 shrink-0">
              <Mic className="h-5 w-5 text-label-assistive" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
