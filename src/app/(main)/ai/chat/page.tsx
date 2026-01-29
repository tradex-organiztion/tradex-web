'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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

  const [messages, setMessages] = useState<Message[]>(() => {
    // Handle initial query in initial state
    if (initialQuery) {
      return [{
        id: '1',
        role: 'user' as const,
        content: initialQuery,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      }]
    }
    return []
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(!!initialQuery)
  const initialQueryProcessed = useRef(false)

  // Generate AI response for initial query
  useEffect(() => {
    if (initialQuery && !initialQueryProcessed.current && messages.length === 1) {
      initialQueryProcessed.current = true
      const timer = setTimeout(() => {
        const assistantMessage: Message = {
          id: '2',
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
      return () => clearTimeout(timer)
    }
  }, [initialQuery, messages.length])

  const handleSend = useCallback((text?: string) => {
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
  }, [input, isLoading])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M5 17L10 12L14 16L19 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 11H19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1 max-w-[70%] space-y-4">
                    <p className="text-body-1-regular text-label-normal">
                      {message.content}
                    </p>
                    {message.stats && (
                      <div className="grid grid-cols-2 gap-3 border border-line-normal rounded-xl p-3">
                        <div className="px-4 py-3 border-r border-b border-line-normal">
                          <p className="text-caption-regular text-label-assistive mb-1">승률</p>
                          <p className="text-title-2-bold text-label-normal">{message.stats.winRate}</p>
                        </div>
                        <div className="px-4 py-3 border-b border-line-normal">
                          <p className="text-caption-regular text-label-assistive mb-1">순이익</p>
                          <p className="text-title-2-bold text-label-positive">{message.stats.profit}</p>
                        </div>
                        <div className="px-4 py-3 border-r border-line-normal">
                          <p className="text-caption-regular text-label-assistive mb-1">총 거래 수</p>
                          <p className="text-title-2-bold text-label-normal">{message.stats.totalTrades}</p>
                        </div>
                        <div className="px-4 py-3">
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
              <div className="h-10 w-10 shrink-0 rounded-full bg-gray-800 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M5 17L10 12L14 16L19 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 11H19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-4 py-2">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
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
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 shrink-0">
              <Mic className="w-5 h-5 text-label-assistive" />
            </Button>
            {input.trim() ? (
              <button
                onClick={() => handleSend()}
                className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
