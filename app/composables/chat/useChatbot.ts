import { ref, computed } from 'vue'
import {
  useSendChatbotMessageMutation,
  useClearChatbotHistoryMutation,
} from '~/mutations/chat/useSendChatbotMessageMutation'
import { chatbotService } from '~/services/chatbot.service'
import { getChatSessionId, resetChatSessionId, formatChatTime } from '~/utils/chat'
import type { ChatMessage } from '~/types/chat.type'

/**
 * Composable quản lý state và data flow của chatbox.
 * - Không dùng lifecycle hooks (onMounted, v.v.) — chỉ xử lý data flow.
 * - Lifecycle hooks đặt trong component .vue.
 */
export const useChatbot = () => {
  const messages = ref<ChatMessage[]>([])
  const inputText = ref('')
  const sessionId = ref<string>('')

  const { mutateAsync: sendMessageAsync, isPending: isSending } = useSendChatbotMessageMutation()
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

  // Thêm tin nhắn optimistically (user) trước khi gọi API
  const addMessage = (msg: ChatMessage) => {
    messages.value.push({ ...msg, createdAt: new Date() })
  }

  // Gửi tin nhắn
  const sendMessage = async () => {
    const text = inputText.value.trim()
    if (!text || isSending.value) return

    // Thêm tin nhắn user vào UI ngay lập tức (optimistic)
    addMessage({ role: 'user', content: text })
    inputText.value = ''

    try {
      const response = await sendMessageAsync({
        message: text,
        sessionId: sessionId.value,
      })

      // Thêm reply của AI
      addMessage({ role: 'assistant', content: response.reply })
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!'
      addMessage({ role: 'assistant', content: errMsg })
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
    initSession,
    initWelcomeMessage,
    sendMessage,
    clearHistory,
    addMessage,
  }
}
