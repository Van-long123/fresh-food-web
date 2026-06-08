import { useMutation } from '@tanstack/vue-query'
import { chatbotService } from '~/services/chatbot.service'
import type { ChatSendPayload, ChatClearPayload } from '~/types/chat.type'

/**
 * Mutation gửi tin nhắn đến chatbot AI.
 * Không cache (mutation), không invalidate queries vì chatbox tự quản lý state.
 */
export const useSendChatbotMessageMutation = () => {
  return useMutation({
    mutationFn: (payload: ChatSendPayload) => chatbotService.sendMessage(payload),
  })
}

/**
 * Mutation xóa lịch sử hội thoại.
 */
export const useClearChatbotHistoryMutation = () => {
  return useMutation({
    mutationFn: (payload: ChatClearPayload) => chatbotService.clearHistory(payload),
  })
}
