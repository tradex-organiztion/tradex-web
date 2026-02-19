'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plus, Mic, Send, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAIChatStore, generateMessageId } from '@/stores'
import type { AIMessage } from '@/stores'
import { aiApi, chatSessionApi } from '@/lib/api/ai'

export default function TradexAIChatPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const conversationId = searchParams.get('id')
  const initialQuery = searchParams.get('q') || ''
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initialQueryProcessed = useRef(false)
  const sessionsLoaded = useRef(false)

  const {
    conversations,
    addMessage,
    updateMessageContent,
    createConversation,
    setActiveConversation,
  } = useAIChatStore()

  // Find or create conversation
  const [activeConvId] = useState<string>(() => {
    if (conversationId) {
      const exists = conversations.find((c) => c.id === conversationId)
      if (exists) return conversationId
    }
    return createConversation()
  })

  const conversation = conversations.find((c) => c.id === activeConvId)
  const messages = conversation?.messages || []

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(!!initialQuery)

  // Set active conversation in store
  useEffect(() => {
    setActiveConversation(activeConvId)
  }, [activeConvId, setActiveConversation])

  // Load backend sessions on mount (best-effort)
  useEffect(() => {
    if (sessionsLoaded.current) return
    sessionsLoaded.current = true

    chatSessionApi.getSessions().catch((err) => {
      console.warn('Failed to load chat sessions:', err.message)
    })
    // Sessions are loaded for side-effect awareness; local Zustand store is source of truth for now
  }, [])

  // Try to create a backend session for the current conversation
  useEffect(() => {
    if (!activeConvId) return
    chatSessionApi.createSession().catch((err) => {
      console.warn('Failed to create backend session:', err.message)
    })
  }, [activeConvId])

  // Load history from backend if conversation has an ID that looks like a backend ID
  useEffect(() => {
    if (!conversationId) return
    const numericId = Number(conversationId)
    if (isNaN(numericId)) return // local ID, skip

    let cancelled = false
    chatSessionApi.getHistory(numericId).then((history) => {
      if (cancelled || !history?.messages) return
      // Populate local store with backend messages
      for (const msg of history.messages) {
        addMessage(activeConvId, {
          id: generateMessageId(),
          role: msg.role === 'USER' ? 'user' : 'assistant',
          content: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        })
      }
    }).catch((err) => {
      console.warn('Failed to load chat history:', err.message)
    })

    return () => { cancelled = true }
  }, [conversationId, activeConvId, addMessage])

  // Handle initial query
  useEffect(() => {
    if (initialQuery && !initialQueryProcessed.current && messages.length === 0) {
      initialQueryProcessed.current = true

      const userMsg: AIMessage = {
        id: generateMessageId(),
        role: 'user',
        content: initialQuery,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      }
      addMessage(activeConvId, userMsg)

      // Create placeholder for streaming
      const assistantMsgId = generateMessageId()
      addMessage(activeConvId, {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      })

      let streamed = ''
      aiApi.chatStream(initialQuery, {
        onToken: (token) => {
          streamed += token
          updateMessageContent(activeConvId, assistantMsgId, streamed)
        },
        onComplete: (full) => {
          updateMessageContent(activeConvId, assistantMsgId, full)
          setIsLoading(false)
        },
        onError: async () => {
          // Fallback to mock
          const response = await aiApi.chat({ message: initialQuery }).catch(() => null)
          updateMessageContent(activeConvId, assistantMsgId,
            response?.message || '죄송합니다. 응답을 생성할 수 없습니다.')
          setIsLoading(false)
        },
      }).catch(() => setIsLoading(false))
    }
  }, [initialQuery, activeConvId, messages.length, addMessage, updateMessageContent])

  const handleSend = useCallback(async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim() || isLoading) return

    const userMsg: AIMessage = {
      id: generateMessageId(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }

    addMessage(activeConvId, userMsg)
    setInput('')
    setIsLoading(true)

    // Create placeholder for streaming
    const assistantMsgId = generateMessageId()
    addMessage(activeConvId, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    })

    let streamed = ''
    await aiApi.chatStream(messageText, {
      onToken: (token) => {
        streamed += token
        updateMessageContent(activeConvId, assistantMsgId, streamed)
      },
      onComplete: (full) => {
        updateMessageContent(activeConvId, assistantMsgId, full)
        setIsLoading(false)
      },
      onError: async () => {
        const response = await aiApi.chat({ message: messageText }).catch(() => null)
        updateMessageContent(activeConvId, assistantMsgId,
          response?.message || '죄송합니다. 응답을 생성할 수 없습니다.')
        setIsLoading(false)
      },
    }).catch(() => setIsLoading(false))
  }, [input, isLoading, activeConvId, addMessage, updateMessageContent])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-40px-64px)]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-line-normal">
        <button
          onClick={() => router.push('/ai')}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-label-normal" />
        </button>
        <span className="text-body-1-bold text-label-normal truncate">
          {conversation?.title || '새 대화'}
        </span>
      </div>

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
