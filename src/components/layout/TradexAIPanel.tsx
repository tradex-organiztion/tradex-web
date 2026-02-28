'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Plus, Mic, ArrowUp, Square, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore, useChartStore, useTriggerStore, useAIChatStore, generateMessageId } from '@/stores'
import type { AIMessage, AIAttachment } from '@/stores'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { aiApi, chatSessionApi } from '@/lib/api/ai'
import { captureChartContext } from '@/lib/chart/chartContext'
import { executeAICommands } from '@/lib/chart/aiCommandExecutor'

// Suggestion prompts matching Figma design - using emoji icons
const SUGGESTION_PROMPTS = [
  {
    emoji: '✏️',
    text: '현재 차트에서 4시간봉 기준으로 지지/저항선을 분석하고 차트에 그려줘',
  },
  {
    emoji: '🔑',
    text: '최근 90일의 내 모든 거래에서 4시간 봉 기준으로 EMA 지표만 사용했을 경우, 예상되는 결과를 보여줘',
  },
  {
    emoji: '📊',
    text: '최근 7일 간 내 매매 전략 별 승률을 분석하고, 문제점을 분석해서 내 매매 원칙을 설정해줘',
  },
  {
    emoji: '🔔',
    text: '1시간 봉 기준으로 볼린저 밴드를 터치할 때 진입 트리거를 설정해줘',
  },
  {
    emoji: '📰',
    text: '오늘 매매 시작 전 알아야 하는 이슈와 비트코인 시장 상황을 브리핑 해줘',
  },
]

export function TradexAIPanel() {
  const router = useRouter()
  const { isAIPanelOpen, setAIPanelOpen } = useUIStore()
  const { widgetInstance } = useChartStore()
  const { addTrigger } = useTriggerStore()
  const {
    conversations,
    activeConversationId,
    createConversation,
    addMessage,
    updateMessageContent,
    setActiveConversation,
  } = useAIChatStore()

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [panelConvId, setPanelConvId] = useState<string | null>(
    activeConversationId
  )
  const [attachedFiles, setAttachedFiles] = useState<AIAttachment[]>([])
  const sessionsLoaded = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentConv = conversations.find((c) => c.id === panelConvId)
  const messages = currentConv?.messages || []

  // Load backend sessions when panel opens
  useEffect(() => {
    if (!isAIPanelOpen || sessionsLoaded.current) return
    sessionsLoaded.current = true

    chatSessionApi.getSessions().catch((err) => {
      console.warn('Failed to load chat sessions:', err.message)
    })
  }, [isAIPanelOpen])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const getTimestamp = useCallback(() => {
    return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }, [])

  const _handleNewConversation = useCallback(() => {
    const localId = createConversation('사이드 패널 대화')
    setPanelConvId(localId)

    chatSessionApi.createSession().catch((err) => {
      console.warn('Failed to create backend session:', err.message)
    })
  }, [createConversation])

  const handleSend = useCallback(async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim() && attachedFiles.length === 0) return
    if (isLoading) return

    // Ensure we have a conversation
    let convId = panelConvId
    if (!convId) {
      convId = createConversation('사이드 패널 대화')
      setPanelConvId(convId)

      chatSessionApi.createSession().catch((err) => {
        console.warn('Failed to create backend session:', err.message)
      })
    }

    const userMessage: AIMessage = {
      id: generateMessageId(),
      role: 'user',
      content: messageText,
      timestamp: getTimestamp(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    }

    addMessage(convId, userMessage)
    setInput('')
    setAttachedFiles([])
    setIsLoading(true)

    // Create placeholder assistant message for streaming
    const assistantMsgId = generateMessageId()
    const assistantMessage: AIMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: getTimestamp(),
    }
    addMessage(convId, assistantMessage)

    // Try SSE streaming first, fallback to mock
    let streamedContent = ''
    const finalConvId = convId

    await aiApi.chatStream(messageText, {
      onToken: (token) => {
        streamedContent += token
        updateMessageContent(finalConvId, assistantMsgId, streamedContent)
      },
      onComplete: (fullMessage) => {
        updateMessageContent(finalConvId, assistantMsgId, fullMessage)
        setIsLoading(false)
      },
      onError: async () => {
        // Fallback to mock API
        let chartContext
        if (widgetInstance) {
          chartContext = await captureChartContext(widgetInstance).catch(() => undefined)
        }

        const response = await aiApi.chat({
          message: messageText,
          chartContext,
        }).catch(() => null)

        if (response) {
          if (response.commands && widgetInstance) {
            await executeAICommands(widgetInstance, response.commands, addTrigger).catch((err) => {
              console.warn('AI command execution error:', err)
            })
          }
          updateMessageContent(finalConvId, assistantMsgId, response.message)
        } else {
          updateMessageContent(finalConvId, assistantMsgId, '죄송합니다. 응답을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.')
        }
        setIsLoading(false)
      },
    }).catch(() => {
      setIsLoading(false)
    })
  }, [input, isLoading, getTimestamp, widgetInstance, addTrigger, addMessage, updateMessageContent, createConversation, panelConvId, attachedFiles])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleExpand = () => {
    if (panelConvId) {
      setActiveConversation(panelConvId)
    }
    setAIPanelOpen(false)
    router.push(panelConvId ? `/ai/chat?id=${panelConvId}` : '/ai')
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

  if (!isAIPanelOpen) return null

  const hasInput = input.trim() || attachedFiles.length > 0

  return (
    <div className="fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col bg-white shadow-emphasize border-l border-gray-300 md:w-[400px]">
      {/* Header - Figma: >> icon + expand icon */}
      <div className="flex items-center gap-2 px-5 h-12 border-b border-gray-300">
        <button
          onClick={() => setAIPanelOpen(false)}
          className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <Image src="/icons/icon-double-chevron.svg" alt="Close" width={20} height={20} />
        </button>
        <button
          onClick={handleExpand}
          className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <Image src="/icons/icon-expand.svg" alt="Expand" width={20} height={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        {messages.length === 0 ? (
          /* Empty State with Suggestions - Figma C-7 */
          <div className="flex flex-col h-full">
            <div className="flex-1" />
            <div className="flex flex-col gap-3">
              {SUGGESTION_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  className="flex items-center gap-3 px-3 py-1 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => handleSend(prompt.text)}
                >
                  <span className="w-5 h-5 shrink-0 flex items-center justify-center text-[14px] leading-none">
                    {prompt.emoji}
                  </span>
                  <span className="text-body-2-regular text-label-neutral truncate">
                    {prompt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages - Figma C-8 */
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'user' ? (
                  <div className="flex justify-end gap-3">
                    <div className="flex flex-col items-end gap-1.5 flex-1 min-w-0">
                      <div className="max-w-[85%] bg-white border border-line-normal rounded-2xl px-4 py-3">
                        {/* File attachments in message */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {message.attachments.map((file, i) => (
                              <div key={i} className="inline-flex items-center gap-2 bg-gray-50 border border-line-normal rounded-full px-3 py-1.5">
                                <FileText className="w-4 h-4 text-label-assistive" />
                                <span className="text-body-2-medium text-label-normal">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {message.content && (
                          <p className="text-body-2-regular text-label-normal">{message.content}</p>
                        )}
                      </div>
                      <span className="text-caption-regular text-label-assistive">{message.timestamp}</span>
                    </div>
                    <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" fill="#8F8F8F"/>
                        <path d="M8 9.5C5.33 9.5 2 10.84 2 12.5V14H14V12.5C14 10.84 10.67 9.5 8 9.5Z" fill="#8F8F8F"/>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-gray-900 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M5 17L10 12L14 16L19 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 11H19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-tr-xl rounded-bl-xl rounded-br-xl px-4 py-3">
                        <p className="text-body-2-regular text-label-normal whitespace-pre-wrap">{message.content}</p>
                        {message.stats && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="bg-white rounded-lg px-3 py-2.5">
                              <p className="text-caption-regular text-label-assistive mb-0.5">승률</p>
                              <p className="text-body-1-bold text-label-normal">{message.stats.winRate}</p>
                            </div>
                            <div className="bg-white rounded-lg px-3 py-2.5">
                              <p className="text-caption-regular text-label-assistive mb-0.5">순이익</p>
                              <p className="text-body-1-bold text-label-positive">{message.stats.profit}</p>
                            </div>
                            <div className="bg-white rounded-lg px-3 py-2.5">
                              <p className="text-caption-regular text-label-assistive mb-0.5">총 거래</p>
                              <p className="text-body-1-bold text-label-normal">{message.stats.totalTrades}</p>
                            </div>
                            <div className="bg-white rounded-lg px-3 py-2.5">
                              <p className="text-caption-regular text-label-assistive mb-0.5">수익 팩터</p>
                              <p className="text-body-1-bold text-label-normal">{message.stats.profitFactor}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-caption-regular text-label-assistive">{message.timestamp}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading State */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-gray-900 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 17L10 12L14 16L19 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 11H19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Figma: bottom bar with border-t */}
      <div className="px-4 py-3 border-t border-gray-300">
        {/* Attached files */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachedFiles.map((file, i) => (
              <div key={i} className="inline-flex items-center gap-2 bg-gray-50 border border-line-normal rounded-full px-3 py-1.5">
                <FileText className="w-4 h-4 text-label-assistive" />
                <span className="text-body-2-medium text-label-normal truncate max-w-[200px]">{file.name}</span>
                <button onClick={() => removeFile(i)} className="hover:opacity-70">
                  <X className="w-4 h-4 text-label-assistive" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="w-5 h-5 text-label-normal" />
          </Button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="무엇이든 물어보세요!"
            className="flex-1 bg-transparent text-body-2-regular text-label-normal placeholder:text-label-disabled focus:outline-none"
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
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-full hover:bg-gray-100">
              <Mic className="w-5 h-5 text-label-normal" />
            </Button>
          )}
        </div>

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
  )
}
