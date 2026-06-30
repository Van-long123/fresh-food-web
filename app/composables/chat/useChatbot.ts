import { ref, computed } from 'vue'
import {
  useClearChatbotHistoryMutation,
} from '~/mutations/chat/useSendChatbotMessageMutation'
import { chatbotService } from '~/services/chatbot.service'
import { streamChatbotMessageRequest } from '~/api/client/chat.api'
import { getChatSessionId, resetChatSessionId, formatChatTime } from '~/utils/chat'
import type { ChatMessage } from '~/types/chat.type'

/**
 * Composable quản lý state và data flow của chatbox.
 * Sử dụng SSE streaming (fetch + ReadableStream) thay cho axios mutation.
 */
export const useChatbot = () => {
  const messages = ref<ChatMessage[]>([])
  const inputText = ref('')
  const sessionId = ref<string>('')
  const isSending = ref(false)
  const streamingContent = ref('') // Nội dung đang stream từng chữ
  let abortController: AbortController | null = null

  const { mutateAsync: clearHistoryAsync, isPending: isClearing } = useClearChatbotHistoryMutation()

  // Computed: danh sách tin nhắn có thêm thời gian format
  const formattedMessages = computed(() =>
    messages.value.map((m) => ({
      ...m,
      timeLabel: formatChatTime(m.createdAt),
    }))
  )

  const isProcessing = computed(() => isSending.value || isClearing.value)
  const hasMessages = computed(() => messages.value.length > 0)
  const isLoadingHistory = ref(false)

  // Khởi tạo session (gọi trong onMounted của component)
  const initSession = async () => {
    sessionId.value = getChatSessionId()
    await loadHistory()
  }

  const loadHistory = async () => {
    try {
      isLoadingHistory.value = true
      const response = await chatbotService.getHistory(sessionId.value)
      if (response && response.messages && response.messages.length > 0) {
        messages.value = response.messages.map((m: any) => ({
          ...m,
          createdAt: new Date(m.createdAt)
        }))
      } else {
        initWelcomeMessage()
      }
    } catch (e) {
      initWelcomeMessage()
    } finally {
      isLoadingHistory.value = false
    }
  }

  // Thêm tin nhắn vào danh sách
  const addMessage = (msg: ChatMessage) => {
    messages.value.push({ ...msg, createdAt: new Date() })
  }

  // Gửi tin nhắn — dùng SSE streaming
  const sendMessage = async () => {
    const text = inputText.value.trim()
    if (!text || isSending.value) return

    // 1. Thêm tin nhắn user ngay lập tức (optimistic)
    addMessage({ role: 'user', content: text })
    inputText.value = ''
    isSending.value = true
    streamingContent.value = ''

    // 2. Thêm placeholder cho AI (sẽ cập nhật từng chunk)
    const placeholderIndex = messages.value.length
    messages.value.push({
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      isStreaming: true, // Flag để component hiện hiệu ứng typing
    } as any)

    try {
      abortController = new AbortController()
      
      // 3. Gọi SSE stream — onChunk được gọi mỗi khi nhận 1 đoạn chữ
      const fullReply = await streamChatbotMessageRequest(
        { message: text, sessionId: sessionId.value },
        (chunk: string) => {
          streamingContent.value += chunk // Cập nhật để UI ẩn dấu 3 chấm
          // Cập nhật trực tiếp nội dung placeholder trong mảng
          if (messages.value[placeholderIndex]) {
            messages.value[placeholderIndex] = {
              ...messages.value[placeholderIndex],
              content: (messages.value[placeholderIndex].content || '') + chunk,
            }
          }
        },
        abortController.signal
      )

      // 4. Đảm bảo nội dung cuối cùng đầy đủ và tắt flag streaming
      if (messages.value[placeholderIndex]) {
        messages.value[placeholderIndex] = {
          role: 'assistant',
          content: fullReply,
          createdAt: messages.value[placeholderIndex].createdAt,
        }
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Đã bị hủy bởi người dùng
        if (messages.value[placeholderIndex]) {
          messages.value[placeholderIndex] = {
            role: 'assistant',
            content: (messages.value[placeholderIndex].content || ''),
            createdAt: messages.value[placeholderIndex].createdAt,
          }
        }
      } else {
        const errMsg = 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!'
        if (messages.value[placeholderIndex]) {
          messages.value[placeholderIndex] = {
            role: 'assistant',
            content: errMsg,
            createdAt: messages.value[placeholderIndex].createdAt,
          }
        }
      }
    } finally {
      isSending.value = false
      streamingContent.value = ''
      abortController = null
    }
  }

  // Dừng tạo câu trả lời
  const stopMessage = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
      isSending.value = false
    }
  }

  // Xóa lịch sử chat
  const clearHistory = async () => {
    try {
      await clearHistoryAsync({ sessionId: sessionId.value })
    } catch (_e) {
      // Ignore — vẫn reset local state
    }
    messages.value = []
    sessionId.value = resetChatSessionId()
    initWelcomeMessage()
  }

  // Gửi tin nhắn chào mừng ban đầu từ bot
  const initWelcomeMessage = () => {
    if (messages.value.length === 0) {
      messages.value.push({
        role: 'assistant',
        content: '🌿 Xin chào! Tôi là trợ lý SmartFood. Tôi có thể giúp bạn tìm sản phẩm, xem khuyến mãi, kiểm tra đơn hàng hoặc tư vấn dinh dưỡng. Bạn cần tôi giúp gì?',
        createdAt: new Date(),
      })
    }
  }

  return {
    messages,
    formattedMessages,
    inputText,
    sessionId,
    isSending,
    isClearing,
    isProcessing,
    isLoadingHistory,
    hasMessages,
    streamingContent,
    initSession,
    initWelcomeMessage,
    sendMessage,
    stopMessage,
    clearHistory,
    addMessage,
  }
}
