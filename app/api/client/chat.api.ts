import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type { ChatSendPayload, ChatSendResponse, ChatClearPayload } from '~/types/chat.type'

export const sendChatbotMessageRequest = async (
  payload: ChatSendPayload
): Promise<ChatSendResponse> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.CHATBOT.MESSAGE, payload)
  return response.data
}

export const clearChatbotHistoryRequest = async (
  payload: ChatClearPayload
): Promise<{ cleared: boolean }> => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.CHATBOT.HISTORY, {
    data: payload,
  })
  return response.data
}

export const getChatbotHistoryRequest = async (
  sessionId: string
): Promise<{ messages: any[] }> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.CHATBOT.HISTORY, {
    params: { sessionId },
  })
  return response.data
}
