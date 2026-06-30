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

/**
 * Gọi endpoint SSE /chatbot/stream bằng fetch + ReadableStream.
 * Mỗi khi backend gửi một chunk, callback onChunk(text) được gọi ngay.
 * Khi stream kết thúc, Promise resolve với toàn bộ reply.
 *
 * @param payload   - { message, sessionId }
 * @param onChunk   - Callback nhận từng đoạn chữ (streaming)
 * @param signal    - AbortSignal để hủy request nếu cần
 */
export const streamChatbotMessageRequest = async (
  payload: ChatSendPayload,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<string> => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl as string
  const url = `${baseUrl}${API_ENDPOINTS.CHATBOT.STREAM}`

  let response = await fetch(url, {
    method: 'POST',
    credentials: 'include', // Gửi cookie để xác thực (giống withCredentials: true)
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })

  // Nếu token hết hạn (410), mượn axios để trigger interceptor làm mới token, sau đó gọi lại fetch
  if (response.status === 410) {
    try {
      await getChatbotHistoryRequest(payload.sessionId)
    } catch (e) {
      // Bỏ qua lỗi, miễn là quá trình refresh diễn ra
    }
    response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    })
  }

  if (!response.ok || !response.body) {
    throw new Error(`Lỗi kết nối stream: ${response.status}`)
  }
  // đón các luồng dữ liệu đổ về qua mạng.
  const reader = response.body.getReader()
  // Dữ liệu truyền qua mạng Internet là các byte nhị phân (binary data). Trình duyệt không đọc được.
  // TextDecoder có nhiệm vụ dịch đống byte nhị phân đó thành chữ tiếng Việt có dấu hoàn chỉnh.
  const decoder = new TextDecoder('utf-8')
  let fullReply = ''
  let buffer = ''

  while (true) {
    // reader.read() sẽ "đợi" (await) cho đến khi có một gói dữ liệu mới truyền từ Backend tới.
    const { done, value } = await reader.read()
    if (done) break // Nếu Server tắt luồng (done = true) thì thoát vòng lặp.

    // Dùng decoder dịch byte → text
    buffer += decoder.decode(value, { stream: true })
    // Tách từng dòng SSE (kết thúc bằng \n\n)
    const lines = buffer.split('\n\n')
    buffer = lines.pop() ?? '' // Phần chưa đủ — giữ lại cho lần đọc tiếp

    for (const line of lines) {
      const rawData = line.startsWith('data: ') ? line.slice(6) : line
      if (!rawData.trim()) continue
      try {
        const parsed = JSON.parse(rawData)
        if (parsed.type === 'chunk' && parsed.content) {
          fullReply += parsed.content
          onChunk(parsed.content) // Gọi callback ngay lập tức
        }
        // type === 'done' | 'error' → bỏ qua, vòng lặp while sẽ tự kết thúc
      } catch {
        // Bỏ qua dòng JSON lỗi
      }
    }
  }

  return fullReply
}
