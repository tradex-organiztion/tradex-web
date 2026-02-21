'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Plus, Mic, Send, TrendingUp, Search, Target, Bell, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUIStore, useChartStore, useTriggerStore, useAIChatStore, generateMessageId } from '@/stores'
import type { AIMessage } from '@/stores'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { aiApi, chatSessionApi } from '@/lib/api/ai'
import { captureChartContext } from '@/lib/chart/chartContext'
import { executeAICommands } from '@/lib/chart/aiCommandExecutor'

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
  const sessionsLoaded = useRef(false)

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

  const getTimestamp = useCallback(() => {
    return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }, [])

  const handleNewConversation = useCallback(() => {
    const localId = createConversation('사이드 패널 대화')
    setPanelConvId(localId)

    // Best-effort backend session creation
    chatSessionApi.createSession().catch((err) => {
      console.warn('Failed to create backend session:', err.message)
    })
  }, [createConversation])

  const handleSend = useCallback(async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim() || isLoading) return

    // Ensure we have a conversation
    let convId = panelConvId
    if (!convId) {
      convId = createConversation('사이드 패널 대화')
      setPanelConvId(convId)

      // Best-effort backend session creation
      chatSessionApi.createSession().catch((err) => {
        console.warn('Failed to create backend session:', err.message)
      })
    }

    const userMessage: AIMessage = {
      id: generateMessageId(),
      role: 'user',
      content: messageText,
      timestamp: getTimestamp(),
    }

    addMessage(convId, userMessage)
    setInput('')
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
  }, [input, isLoading, getTimestamp, widgetInstance, addTrigger, addMessage, updateMessageContent, createConversation, panelConvId])

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

  if (!isAIPanelOpen) return null

  return (
    <div className="fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col bg-white shadow-emphasize border-l border-gray-300 md:w-[400px]">
      {/* Header */}
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
        <div className="flex-1" />
        <button
          onClick={handleNewConversation}
          className="text-caption-medium text-label-assistive hover:text-label-normal transition-colors"
        >
          새 대화
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        {messages.length === 0 ? (
          /* Empty State with Suggestions */
          <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center">
              <Image src="/tradex-logo-black.svg" alt="Tradex" width={203} height={32} priority />
            </div>
            <div className="flex flex-col gap-4">
              {SUGGESTION_PROMPTS.map((prompt, index) => {
                const IconComponent = prompt.icon
                return (
                  <button
                    key={index}
                    className="flex items-center gap-4 px-3 text-left hover:bg-gray-50 rounded-[200px] transition-colors"
                    onClick={() => handleSend(prompt.text)}
                  >
                    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                      <IconComponent className="w-[14px] h-[14px] text-gray-600" />
                    </div>
                    <span className="text-body-2-regular text-gray-600 py-1">
                      {prompt.text}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div key={message.id} className="w-[360px]">
                {message.role === 'user' ? (
                  <div className="pl-[60px]">
                    <div className="flex justify-end gap-4">
                      <div className="flex flex-col items-end gap-2 flex-1">
                        <div className="bg-white border border-gray-300 rounded-tl-xl rounded-bl-xl rounded-br-xl px-5 py-4">
                          <p className="text-body-1-regular text-gray-800">{message.content}</p>
                        </div>
                        <span className="text-caption-regular text-gray-500">{message.timestamp}</span>
                      </div>
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src="/avatar.png" />
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">U</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ) : (
                  <div className="pr-[60px]">
                    <div className="flex gap-4">
                      <div className="h-8 w-8 shrink-0 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                        <Image src="/tradex-logo-black.svg" alt="Tradex AI" width={20} height={20} className="invert" />
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="bg-gray-50 rounded-tr-xl rounded-bl-xl rounded-br-xl px-5 py-4">
                          <p className="text-body-2-regular text-gray-800">{message.content}</p>
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
                        <span className="text-caption-regular text-gray-500">{message.timestamp}</span>
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
                    <Image src="/tradex-logo-black.svg" alt="Tradex AI" width={20} height={20} className="invert" />
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

      {/* Input Area */}
      <div className="px-5 py-3 border-t border-gray-300">
        <div className="flex items-center gap-4 py-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-full hover:bg-gray-100">
            <Plus className="w-5 h-5 text-gray-800" />
          </Button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="무엇이든 물어보세요!"
            className="flex-1 bg-transparent text-body-1-regular text-gray-800 placeholder:text-gray-400 focus:outline-none"
          />
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
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-full hover:bg-gray-100">
              <Mic className="w-5 h-5 text-gray-800" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
