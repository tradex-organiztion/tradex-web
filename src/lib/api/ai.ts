import { apiClient, get, post, del } from './client'
import type { ChartContext } from '@/lib/chart/chartContext'
import type { AIChartCommand } from '@/lib/chart/aiCommandExecutor'

/**
 * AI Chat API
 *
 * Swagger: https://api.tradex.so/v3/api-docs
 * Tag: chat-controller
 *
 * POST /api/chat/message - SSE 스트리밍 응답
 */

// ============================================================
// Types
// ============================================================

export interface AIChatRequest {
  message: string
  chartContext?: ChartContext
}

export interface AIChatResponse {
  message: string
  commands?: AIChartCommand[]
  stats?: {
    winRate: string
    profit: string
    totalTrades: number
    profitFactor: number
  }
}

export interface AIAnalysisResponse {
  summary: string
  signals: Array<{
    type: 'bullish' | 'bearish' | 'neutral'
    description: string
    confidence: number
  }>
  recommendation: string
}

/** SSE 스트리밍 콜백 */
export interface ChatStreamCallbacks {
  onToken?: (token: string) => void
  onComplete?: (fullMessage: string) => void
  onError?: (error: Error) => void
}

// ============================================================
// AI Chat API
// ============================================================

export const aiApi = {
  /**
   * AI 채팅 메시지 전송 (SSE 스트리밍)
   *
   * POST /api/chat/message?question={message}
   * Content-Type: multipart/form-data (파일 첨부 시)
   * Response: text/event-stream (SSE)
   */
  chatStream: async (
    message: string,
    callbacks: ChatStreamCallbacks,
    sessionId?: number,
    files?: File[]
  ): Promise<void> => {
    const params = new URLSearchParams({ question: message })
    if (sessionId != null) {
      params.set('sessionId', String(sessionId))
    }
    const url = `/api/chat/message?${params.toString()}`

    // 파일이 있으면 multipart/form-data, 없으면 일반 POST
    let body: FormData | undefined
    const headers: Record<string, string> = {
      Accept: 'text/event-stream',
    }

    if (files && files.length > 0) {
      body = new FormData()
      files.forEach((file) => body!.append('files', file))
    }

    // 토큰 가져오기
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('tradex-auth')
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage)
          if (state?.accessToken) {
            headers['Authorization'] = `Bearer ${state.accessToken}`
          }
        } catch {
          // ignore
        }
      }
    }

    const baseURL = apiClient.defaults.baseURL || 'https://api.tradex.so'

    const response = await fetch(`${baseURL}${url}`, {
      method: 'POST',
      headers,
      body,
      credentials: 'include',
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      callbacks.onError?.(new Error(`Chat API error: ${response.status} ${errorText}`))
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      callbacks.onError?.(new Error('No response body'))
      return
    }

    const decoder = new TextDecoder()
    let fullMessage = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim()
            if (data === '[DONE]') {
              callbacks.onComplete?.(fullMessage)
              return
            }
            fullMessage += data
            callbacks.onToken?.(data)
          }
        }
      }

      callbacks.onComplete?.(fullMessage)
    } catch (error) {
      callbacks.onError?.(error instanceof Error ? error : new Error(String(error)))
    }
  },

  /**
   * AI 채팅 (비스트리밍, mock fallback)
   * 백엔드 SSE가 준비되지 않은 경우 또는 차트 명령이 필요한 경우 사용
   */
  chat: async (request: AIChatRequest): Promise<AIChatResponse> => {
    // TODO: SSE 응답을 파싱하여 commands 추출하는 로직 구현 시
    //       chatStream을 래핑하여 사용

    // Mock: 키워드 기반 응답 생성 (개발용)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return generateMockResponse(request.message)
  },

  /** 차트 분석 (AI) */
  analyzeChart: async (_context: ChartContext): Promise<AIAnalysisResponse> => {
    // TODO: POST /api/chat/message에 chartContext 포함하여 전송
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return {
      summary: '현재 BTC/USDT는 상승 추세 내 단기 조정 구간에 있습니다.',
      signals: [
        { type: 'bullish', description: '20일 EMA 지지 확인', confidence: 0.75 },
        { type: 'neutral', description: 'RSI 중립 구간', confidence: 0.6 },
        { type: 'bullish', description: '거래량 증가 동반 상승', confidence: 0.7 },
      ],
      recommendation: '지지선 터치 시 롱 진입을 고려하세요.',
    }
  },
}

// ============================================================
// Mock Response Generator (개발용)
// ============================================================

function generateMockResponse(message: string): AIChatResponse {
  const lowerMessage = message.toLowerCase()

  // Bollinger Bands
  if (lowerMessage.includes('볼린저') || lowerMessage.includes('bollinger')) {
    if (lowerMessage.includes('트리거') || lowerMessage.includes('trigger')) {
      return {
        message: '볼린저 밴드를 추가하고, 하단 밴드 터치 시 알림 트리거를 설정했습니다.',
        commands: [
          {
            action: 'ADD_STUDY',
            params: { name: 'Bollinger Bands', inputs: { in_0: 20, in_1: 2 } },
          },
        ],
      }
    }
    return {
      message: '볼린저 밴드(20, 2)를 차트에 추가했습니다.',
      commands: [
        {
          action: 'ADD_STUDY',
          params: { name: 'Bollinger Bands', inputs: { in_0: 20, in_1: 2 } },
        },
      ],
    }
  }

  // EMA
  if (lowerMessage.includes('ema') || lowerMessage.includes('지수이동평균')) {
    return {
      message: 'EMA(20, 50, 200)를 차트에 추가했습니다.',
      commands: [
        { action: 'ADD_STUDY', params: { name: 'Exponential Moving Average', inputs: { in_0: 20 }, forceOverlay: true } },
        { action: 'ADD_STUDY', params: { name: 'Exponential Moving Average', inputs: { in_0: 50 }, forceOverlay: true } },
        { action: 'ADD_STUDY', params: { name: 'Exponential Moving Average', inputs: { in_0: 200 }, forceOverlay: true } },
      ],
    }
  }

  // RSI
  if (lowerMessage.includes('rsi') || lowerMessage.includes('상대강도')) {
    return {
      message: 'RSI(14)를 차트에 추가했습니다.',
      commands: [
        { action: 'ADD_STUDY', params: { name: 'Relative Strength Index', inputs: { in_0: 14 } } },
      ],
    }
  }

  // MACD
  if (lowerMessage.includes('macd')) {
    return {
      message: 'MACD(12, 26, 9)를 차트에 추가했습니다.',
      commands: [
        { action: 'ADD_STUDY', params: { name: 'MACD', inputs: { in_0: 12, in_1: 26, in_2: 9 } } },
      ],
    }
  }

  // Chart analysis
  if (lowerMessage.includes('분석') || lowerMessage.includes('analyze')) {
    return {
      message: '현재 차트 분석 결과입니다.\n\n**기술적 분석 요약**\n- 현재 상승 추세에서 단기 조정 구간\n- RSI 중립 구간 (55), 과매수/과매도 아님\n- 20일 EMA 지지 확인 중\n\n**권장 전략**\n- 지지선(20 EMA) 터치 시 롱 진입 고려\n- 직전 고점 돌파 시 추가 매수',
      stats: {
        winRate: '64.2%',
        profit: '+ $12,450',
        totalTrades: 42,
        profitFactor: 2.1,
      },
    }
  }

  // Symbol change
  if (lowerMessage.includes('eth') || lowerMessage.includes('이더리움')) {
    return {
      message: '차트를 ETH/USDT로 변경했습니다.',
      commands: [
        { action: 'CHANGE_SYMBOL', params: { symbol: 'ETH/USDT' } },
      ],
    }
  }

  // Timeframe change
  if (lowerMessage.includes('4시간') || lowerMessage.includes('4h')) {
    return {
      message: '시간프레임을 4시간봉으로 변경했습니다.',
      commands: [
        { action: 'CHANGE_INTERVAL', params: { interval: '240' } },
      ],
    }
  }

  // Default response
  return {
    message: '최근 90일간 4시간봉 EMA(20, 50, 200) 골든크로스/데드크로스 전략 시뮬레이션 결과입니다.',
    stats: {
      winRate: '64.2%',
      profit: '+ $12,450',
      totalTrades: 42,
      profitFactor: 2.1,
    },
  }
}

// ============================================================
// Chat Session API
// ============================================================

export interface ChatSessionResponse {
  sessionId: number
  title: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessageResponse {
  question: string
  response: string
  createdAt: string
}

export interface ChatHistoryResponse {
  sessionId: number
  title: string
  messages: ChatMessageResponse[]
}

export const chatSessionApi = {
  /** 채팅 세션 목록 조회 */
  getSessions: () =>
    get<ChatSessionResponse[]>('/api/chat/sessions'),

  /** 새 채팅 세션 생성 */
  createSession: () =>
    post<ChatSessionResponse>('/api/chat/sessions'),

  /** 채팅 기록 조회 */
  getHistory: (sessionId: number) =>
    get<ChatHistoryResponse>(`/api/chat/sessions/${sessionId}/history`),

  /** 채팅 세션 삭제 */
  deleteSession: (sessionId: number) =>
    del<void>(`/api/chat/sessions/${sessionId}`),
}
