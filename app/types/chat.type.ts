export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  role: ChatRole
  content: string
  createdAt?: Date | string
}

export interface ChatSendPayload {
  message: string
  sessionId: string
}

export interface ChatSendResponse {
  reply: string
  sessionId: string
}

export interface ChatClearPayload {
  sessionId: string
}
