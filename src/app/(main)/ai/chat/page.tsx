'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, Mic, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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

export default function TradexAIChatPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handle initial query
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSend(initialQuery)
    }
  }, [initialQuery])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

  return (
    <div className="flex flex-col h-[calc(100vh-40px-64px)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-[800px] mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === 'user' ? (
                /* User Message */
                <div className="flex justify-end gap-3">
                  <div className="max-w-[70%] rounded-2xl bg-gray-100 px-5 py-3">
                    <p className="text-body-1-regular text-label-normal">
                      {message.content}
                    </p>
                  </div>
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-gray-200 text-label-neutral">
                      U
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                /* Assistant Message */
                <div className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-element-primary-default flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="flex-1 max-w-[70%] space-y-4">
                    <p className="text-body-1-regular text-label-normal">
                      {message.content}
                    </p>
                    {message.stats && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-xl px-5 py-4">
                          <p className="text-caption-regular text-label-assistive mb-1">승률</p>
                          <p className="text-title-2-bold text-label-normal">{message.stats.winRate}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl px-5 py-4">
                          <p className="text-caption-regular text-label-assistive mb-1">순이익</p>
                          <p className="text-title-2-bold text-label-positive">{message.stats.profit}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl px-5 py-4">
                          <p className="text-caption-regular text-label-assistive mb-1">총 거래 수</p>
                          <p className="text-title-2-bold text-label-normal">{message.stats.totalTrades}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl px-5 py-4">
                          <p className="text-caption-regular text-label-assistive mb-1">수익 팩터</p>
                          <p className="text-title-2-bold text-label-normal">{message.stats.profitFactor}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <p className={cn(
                "text-caption-regular text-label-assistive mt-2",
                message.role === 'user' ? "text-right mr-14" : "ml-14"
              )}>
                {message.timestamp}
              </p>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-element-primary-default flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="flex items-center gap-2 px-5 py-4">
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-label-assistive" style={{ animationDelay: '0ms' }} />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-label-assistive" style={{ animationDelay: '150ms' }} />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-label-assistive" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-line-normal px-4 py-4">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-3 px-5 py-3 border border-line-normal rounded-full focus-within:border-line-focused transition-colors">
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 shrink-0">
              <Plus className="w-5 h-5 text-label-assistive" />
            </Button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tradex AI에게 무엇이든 물어보세요!"
              className="flex-1 bg-transparent text-body-1-regular placeholder:text-label-assistive focus:outline-none"
            />
            {input.trim() ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0 shrink-0"
                onClick={() => handleSend()}
              >
                <Send className="w-5 h-5 text-label-normal" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0 shrink-0">
                <Mic className="w-5 h-5 text-label-assistive" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
