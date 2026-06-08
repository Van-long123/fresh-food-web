/**
 * Tạo sessionId duy nhất cho phiên chatbot.
 * Lưu vào localStorage để giữ nguyên khi user refresh trang.
 */
const SESSION_KEY = 'smartfood_chat_session'

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const getChatSessionId = (): string => {
  if (typeof window === 'undefined') return generateId()

  let sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = generateId()
    localStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

export const resetChatSessionId = (): string => {
  const newId = generateId()
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, newId)
  }
  return newId
}

/**
 * Format thời gian tin nhắn (HH:mm)
 */
export const formatChatTime = (date?: Date | string): string => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}
