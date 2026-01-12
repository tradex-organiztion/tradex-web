'use client'

import { useState } from 'react'
import { X, Send, Paperclip, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useUIStore } from '@/stores'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function TradexAIPanel() {
  const { isAIPanelOpen, setAIPanelOpen } = useUIStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! Tradex AI입니다. 트레이딩에 관해 무엇이든 물어보세요.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // TODO: API 연동
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 현재 AI 기능은 개발 중입니다. 곧 서비스될 예정입니다.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isAIPanelOpen) return null

  return (
    <div className="fixed bottom-0 right-0 top-0 z-50 flex w-96 flex-col border-l border-gray-200 bg-white shadow-lg">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <div>
            <h2 className="font-semibold text-navy-900">Tradex AI</h2>
            <p className="text-xs text-gray-500">트레이딩 어시스턴트</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAIPanelOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' && 'flex-row-reverse'
            )}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback
                className={cn(
                  message.role === 'assistant'
                    ? 'bg-navy-900 text-white'
                    : 'bg-gray-200 text-gray-700'
                )}
              >
                {message.role === 'assistant' ? 'AI' : 'U'}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                'max-w-[75%] rounded-lg px-4 py-2.5 text-sm',
                message.role === 'assistant'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-navy-900 text-white'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-navy-900 text-white">
                AI
              </AvatarFallback>
            </Avatar>
            <div className="rounded-lg bg-gray-100 px-4 py-2.5">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
          <div className="relative flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              className="min-h-[44px] max-h-32 resize-none pr-20"
              rows={1}
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mic className="h-4 w-4 text-gray-500" />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">
          Tradex AI는 실수할 수 있습니다. 중요한 결정은 직접 확인하세요.
        </p>
      </div>
    </div>
  )
}
