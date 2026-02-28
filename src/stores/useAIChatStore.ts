import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AIAttachment {
  name: string
  size: number
  type: string
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  attachments?: AIAttachment[]
  stats?: {
    winRate: string
    profit: string
    totalTrades: number
    profitFactor: number
  }
}

export interface Conversation {
  id: string
  title: string
  messages: AIMessage[]
  createdAt: string
  updatedAt: string
}

interface AIChatState {
  conversations: Conversation[]
  activeConversationId: string | null

  // Actions
  createConversation: (title?: string) => string
  deleteConversation: (id: string) => void
  setActiveConversation: (id: string | null) => void
  addMessage: (conversationId: string, message: AIMessage) => void
  updateMessageContent: (conversationId: string, messageId: string, content: string) => void
  getActiveConversation: () => Conversation | null
  updateConversationTitle: (id: string, title: string) => void
}

let messageCounter = 0
export function generateMessageId() {
  messageCounter += 1
  return `msg-${Date.now()}-${messageCounter}`
}

export const useAIChatStore = create<AIChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      createConversation: (title?: string) => {
        const id = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const now = new Date().toISOString()
        const conversation: Conversation = {
          id,
          title: title || '새 대화',
          messages: [],
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }))
        return id
      },

      deleteConversation: (id: string) => {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        }))
      },

      setActiveConversation: (id: string | null) => {
        set({ activeConversationId: id })
      },

      addMessage: (conversationId: string, message: AIMessage) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c
            const updatedMessages = [...c.messages, message]
            // Auto-update title from first user message
            const title =
              c.title === '새 대화' && message.role === 'user'
                ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
                : c.title
            return {
              ...c,
              title,
              messages: updatedMessages,
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      updateMessageContent: (conversationId: string, messageId: string, content: string) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content } : m
              ),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get()
        if (!activeConversationId) return null
        return conversations.find((c) => c.id === activeConversationId) || null
      },

      updateConversationTitle: (id: string, title: string) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        }))
      },
    }),
    {
      name: 'tradex-ai-chat',
      partialize: (state) => ({
        conversations: state.conversations.slice(0, 50), // Keep last 50 conversations
        activeConversationId: state.activeConversationId,
      }),
    }
  )
)
