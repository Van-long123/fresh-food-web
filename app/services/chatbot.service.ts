import { sendChatbotMessageRequest, clearChatbotHistoryRequest, getChatbotHistoryRequest } from '~/api/client/chat.api'
import type { ChatSendPayload, ChatClearPayload } from '~/types/chat.type'

export const chatbotService = {
  sendMessage: (payload: ChatSendPayload) => sendChatbotMessageRequest(payload),
  clearHistory: (payload: ChatClearPayload) => clearChatbotHistoryRequest(payload),
  getHistory: (sessionId: string) => getChatbotHistoryRequest(sessionId),
}
