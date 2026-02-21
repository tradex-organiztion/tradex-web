'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plus, Mic, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  }, [])

  // Try to create a backend session for the current conversation
  useEffect(() => {
    if (!activeConvId) return
    chatSessionApi.createSession().catch((err) => {
      console.warn('Failed to create backend session:', err.message)
    })
  }, [activeConvId])

  // Load history from backend if conversation has a numeric backend ID
  useEffect(() => {
    if (!conversationId) return
    const numericId = Number(conversationId)
    if (isNaN(numericId)) return

    let cancelled = false
    chatSessionApi.getHistory(numericId).then((history) => {
      if (cancelled || !history?.messages) return
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
    <div className="flex flex-col h-[calc(100vh-48px)]">
      {/* Messages Area - Figma: centered, padding 32px 36px, gap 16px */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-9 py-8">
          <div className="w-full max-w-[700px] flex flex-col gap-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'user' ? (
                  /* User Message - Figma: right-aligned, avatar 32x32 */
                  <div className="flex justify-end gap-4">
                    <div className="flex flex-col items-end gap-2 flex-1">
                      <div className="max-w-[80%] rounded-2xl bg-gray-100 px-5 py-3">
                        <p className="text-body-1-regular text-label-normal">
                          {message.content}
                        </p>
                      </div>
                      <p className="text-caption-regular text-label-assistive">
                        {message.timestamp}
                      </p>
                    </div>
                    <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" fill="#8F8F8F"/>
                        <path d="M8 9.5C5.33 9.5 2 10.84 2 12.5V14H14V12.5C14 10.84 10.67 9.5 8 9.5Z" fill="#8F8F8F"/>
                      </svg>
                    </div>
                  </div>
                ) : (
                  /* AI Message - Figma: left-aligned, avatar 32x32, bg-gray-50, asymmetric rounded */
                  <div className="flex gap-4">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-gray-900 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M5 17L10 12L14 16L19 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 11H19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="bg-gray-50 rounded-r-xl rounded-bl-xl px-5 py-4">
                        <p className="text-body-1-regular text-label-normal whitespace-pre-wrap">
                          {message.content}
                        </p>
                        {message.stats && (
                          <div className="grid grid-cols-2 gap-3 border border-line-normal rounded-xl p-3 mt-4">
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
                      <p className="text-caption-regular text-label-assistive">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-4">
                <div className="h-8 w-8 shrink-0 rounded-full bg-gray-900 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M5 17L10 12L14 16L19 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 11H19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-r-xl rounded-bl-xl px-5 py-4">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area - Figma: centered, same prompt input as main page */}
      <div className="flex items-center justify-center px-9 py-8">
        <div className="flex items-center w-full max-w-[700px] h-[52px] bg-white border border-gray-300 rounded-full px-3 gap-4 shadow-emphasize">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full hover:bg-gray-100"
          >
            <Plus className="w-5 h-5 text-gray-900" />
          </Button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tradex AI에게 무엇이든 물어보세요!"
            className="flex-1 text-body-1-regular text-label-normal placeholder:text-label-disabled focus:outline-none bg-transparent"
          />

          {input.trim() ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full bg-gray-900 hover:bg-gray-800"
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
              <Mic className="w-5 h-5 text-gray-900" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
