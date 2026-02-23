'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plus, Mic, ArrowUp, X, FileText, ArrowDown, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAIChatStore, generateMessageId } from '@/stores'
import type { AIMessage, AIAttachment } from '@/stores'
import { aiApi, chatSessionApi } from '@/lib/api/ai'

export default function TradexAIChatPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const conversationId = searchParams.get('id')
  const initialQuery = searchParams.get('q') || ''
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const initialQueryProcessed = useRef(false)
  const sessionsLoaded = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
  const [attachedFiles, setAttachedFiles] = useState<AIAttachment[]>([])
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)
  const actionMenuRef = useRef<HTMLDivElement>(null)

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
        const ts = new Date(msg.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        if (msg.question) {
          addMessage(activeConvId, {
            id: generateMessageId(),
            role: 'user',
            content: msg.question,
            timestamp: ts,
          })
        }
        if (msg.response) {
          addMessage(activeConvId, {
            id: generateMessageId(),
            role: 'assistant',
            content: msg.response,
            timestamp: ts,
          })
        }
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
    if (!messageText.trim() && attachedFiles.length === 0) return
    if (isLoading) return

    const userMsg: AIMessage = {
      id: generateMessageId(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    }

    addMessage(activeConvId, userMsg)
    setInput('')
    setAttachedFiles([])
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
  }, [input, isLoading, activeConvId, attachedFiles, addMessage, updateMessageContent])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Track scroll position for scroll-to-bottom button
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom && messages.length > 3)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [messages.length])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newAttachments: AIAttachment[] = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }))
    setAttachedFiles((prev) => [...prev, ...newAttachments])
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Close action menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hasInput = input.trim() || attachedFiles.length > 0

  return (
    <div className="flex flex-col h-[calc(100vh-48px)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto relative" ref={messagesContainerRef}>
        <div className="flex flex-col items-center px-9 py-8">
          <div className="w-full max-w-[700px] flex flex-col gap-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'user' ? (
                  /* User Message - right-aligned */
                  <div className="flex justify-end gap-4">
                    <div className="flex flex-col items-end gap-2 flex-1">
                      <div className="max-w-[80%] rounded-2xl bg-gray-100 px-5 py-3">
                        {/* File attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {message.attachments.map((file, i) => (
                              <div key={i} className="inline-flex items-center gap-2 bg-white border border-line-normal rounded-full px-3 py-1.5">
                                <FileText className="w-4 h-4 text-label-assistive" />
                                <span className="text-body-2-medium text-label-normal">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {message.content && (
                          <p className="text-body-1-regular text-label-normal">
                            {message.content}
                          </p>
                        )}
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
                  /* AI Message - left-aligned */
                  <div className="flex gap-4">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-gray-900 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

            {/* Loading indicator */}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-4">
                <div className="h-8 w-8 shrink-0 rounded-full bg-gray-900 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

        {/* Scroll to bottom button - Figma C-6 */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border border-line-normal shadow-emphasize flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ArrowDown className="w-5 h-5 text-label-normal" />
          </button>
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-center justify-center px-9 py-8">
        <div className="w-full max-w-[700px] relative" ref={actionMenuRef}>
          <div className={cn(
            "bg-white border border-gray-300 shadow-emphasize",
            attachedFiles.length > 0 ? "rounded-2xl" : "rounded-full"
          )}>
            {/* Attached files row */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 pt-3">
                {attachedFiles.map((file, i) => (
                  <div key={i} className="inline-flex items-center gap-2 bg-gray-50 border border-line-normal rounded-full px-3 py-1.5">
                    <FileText className="w-4 h-4 text-label-assistive" />
                    <span className="text-body-2-medium text-label-normal">{file.name}</span>
                    <button onClick={() => removeFile(i)} className="hover:opacity-70">
                      <X className="w-4 h-4 text-label-assistive" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input row */}
            <div className="flex items-center h-[52px] px-3 gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full hover:bg-gray-100"
                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
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

              {isLoading ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 rounded-full bg-gray-900 hover:bg-gray-800"
                  onClick={() => setIsLoading(false)}
                >
                  <Square className="w-3.5 h-3.5 text-white fill-white" />
                </Button>
              ) : hasInput ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 rounded-full bg-gray-900 hover:bg-gray-800"
                  onClick={() => handleSend()}
                >
                  <ArrowUp className="w-4 h-4 text-white" />
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

          {/* Action Menu Dropdown */}
          {isActionMenuOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-48 bg-white border border-line-normal rounded-xl shadow-emphasize py-2 z-10">
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-body-2-regular text-label-neutral hover:bg-gray-50 transition-colors"
                onClick={() => {
                  fileInputRef.current?.click()
                  setIsActionMenuOpen(false)
                }}
              >
                <FileText className="w-4 h-4" />
                <span>사진 및 파일 업로드</span>
              </button>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>
    </div>
  )
}
