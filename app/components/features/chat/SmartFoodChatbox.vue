<template>
  <!-- Floating chat button -->
  <div class="chatbox-wrapper">
    <!-- Toggle Button -->
    <Transition name="fade-scale">
      <button
        v-show="!isOpen"
        id="chatbox-toggle-btn"
        class="chat-fab"
        aria-label="Mở chatbot SmartFood"
        @click="openChat"
      >
        <i class="pi pi-comments chat-fab__icon" />
        <span class="chat-fab__badge" v-if="unreadCount > 0">{{
          unreadCount
        }}</span>
      </button>
    </Transition>

    <!-- Chat Dialog Panel -->
    <Transition name="slide-up">
      <div v-show="isOpen" class="chat-panel-container">
        <div class="chat-panel" role="dialog" aria-label="SmartFood AI Chatbox">
          <!-- Header -->
          <div class="chat-panel__header">
            <div class="chat-panel__header-info">
              <Avatar
                image="/icons/chatbot-avatar.svg"
                shape="circle"
                size="normal"
                class="chat-panel__avatar"
              />
              <div>
                <p class="chat-panel__title">SmartFood AI</p>
                <p class="chat-panel__subtitle">
                  <span class="online-dot" />
                  Trực tuyến
                </p>
              </div>
            </div>
            <div class="chat-panel__header-actions">
              <Button
                title="Xóa lịch sử chat"
                icon="pi pi-trash"
                text
                rounded
                size="small"
                severity="secondary"
                :loading="isClearing"
                aria-label="Xóa lịch sử chat"
                @click="onClearHistory"
              />
              <Button
                icon="pi pi-times"
                text
                rounded
                size="small"
                severity="secondary"
                aria-label="Đóng chatbot"
                @click="closeChat"
              />
            </div>
          </div>

          <!-- Messages Area -->
          <div
            ref="messagesContainerRef"
            class="chat-panel__messages"
            aria-live="polite"
            @click="onMessagesClick"
          >
            <!-- Welcome / empty state -->
            <div v-if="!hasMessages" class="chat-panel__empty">
              <div class="chat-panel__suggestions">
                <p class="chat-panel__suggestions-label">Gợi ý câu hỏi:</p>
                <div class="chat-panel__suggestions-list">
                  <Chip
                    v-for="(suggestion, idx) in QUICK_SUGGESTIONS"
                    :key="idx"
                    :label="suggestion"
                    class="chat-suggestion-chip"
                    @click="onQuickSuggestion(suggestion)"
                  />
                </div>
              </div>
            </div>

            <!-- Messages list -->
            <template v-for="(msg, idx) in formattedMessages" :key="idx">
              <div
                class="chat-message"
                :class="[
                  msg.role === 'user'
                    ? 'chat-message--user'
                    : 'chat-message--bot',
                ]"
              >
                <!-- Bot avatar -->
                <Avatar
                  v-if="msg.role === 'assistant'"
                  image="/icons/chatbot-avatar.svg"
                  shape="circle"
                  size="small"
                  class="chat-message__avatar"
                />

                <div class="chat-message__bubble-wrapper">
                  <div class="chat-message__bubble">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <span v-html="formatMessageContent(msg.content)" />
                  </div>
                  <span v-if="msg.timeLabel" class="chat-message__time">{{
                    msg.timeLabel
                  }}</span>
                </div>
              </div>
            </template>

            <!-- Typing indicator -->
            <div v-if="isSending" class="chat-message chat-message--bot">
              <Avatar
                image="/icons/chatbot-avatar.svg"
                shape="circle"
                size="small"
                class="chat-message__avatar"
              />
              <div class="chat-typing"><span /><span /><span /></div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="chat-panel__input">
            <Textarea
              id="chatbox-input"
              v-model="inputText"
              rows="1"
              auto-resize
              placeholder="Hỏi về sản phẩm, đơn hàng, khuyến mãi..."
              class="chat-panel__textarea"
              :disabled="isSending"
              @keydown.enter.exact.prevent="onSendMessage"
            />
            <Button
              id="chatbox-send-btn"
              icon="pi pi-send"
              rounded
              aria-label="Gửi tin nhắn"
              :loading="isSending"
              :disabled="!inputText.trim()"
              class="chat-panel__send-btn"
              @click="onSendMessage"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Chip from "primevue/chip";
import Textarea from "primevue/textarea";
import { useChatbot } from "~/composables/chat/useChatbot";

// ─── Composable ───────────────────────────────────────────────────────────────
const {
  formattedMessages,
  inputText,
  isSending,
  isClearing,
  hasMessages,
  initSession,
  sendMessage,
  clearHistory,
} = useChatbot();

// ─── Local state ──────────────────────────────────────────────────────────────
const isOpen = ref(false);
const unreadCount = ref(0);
const messagesContainerRef = ref<HTMLElement | null>(null);
const router = useRouter();

// ─── Quick suggestions ────────────────────────────────────────────────────────
const QUICK_SUGGESTIONS = [
  "Sản phẩm hữu cơ nào đang có?",
  "Có voucher giảm giá không?",
  "Kiểm tra đơn hàng của tôi",
  "Thực phẩm tốt cho người giảm cân",
  "Rau củ tươi hôm nay có gì?",
];

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await initSession();
});

// ─── Watch messages → auto scroll ────────────────────────────────────────────
watch(
  () => formattedMessages.value.length,
  () => {
    nextTick(() => scrollToBottom());
  },
);

// ─── Methods ──────────────────────────────────────────────────────────────────
const openChat = () => {
  isOpen.value = true;
  unreadCount.value = 0;
  nextTick(() => scrollToBottom());
};

const closeChat = () => {
  isOpen.value = false;
};

const scrollToBottom = () => {
  if (messagesContainerRef.value) {
    messagesContainerRef.value.scrollTop =
      messagesContainerRef.value.scrollHeight;
  }
};

const onSendMessage = async () => {
  await sendMessage();
};

const onClearHistory = async () => {
  await clearHistory();
};

const onQuickSuggestion = (text: string) => {
  inputText.value = text;
  sendMessage();
};

/**
 * Chuyển đổi newline thành <br> và giữ an toàn.
 */
const formatMessageContent = (content: string): string => {
  return content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="chat-link">$1</a>',
    )
    .replace(/\n/g, "<br>");
};

const onMessagesClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.matches('.chat-link')) {
    e.preventDefault();
    const href = target.getAttribute('href');
    if (href) {
      router.push(href);
      closeChat(); 
    }
  }
};
</script>

<style scoped>
/* ─── FAB Button ──────────────────────────────────────────────────────────── */
.chatbox-wrapper {
  position: fixed;
  bottom: 5.5rem; /* Nằm trên nút scrolltop (scrolltop = bottom-8 = 2rem + h-11 = 2.75rem => 4.75rem) */
  right: 1.1rem; /* Căn giữa tương đối với nút scrolltop (nút scrolltop = right-4 = 1rem, chat button to hơn nên nhích ra xíu) */
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

/* Chat Dialog nằm đè lên nút FAB thay vì xếp chồng trong flex */
.chat-panel-container {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 22rem;
  /* Tránh che mất button FAB khi ẩn, nhưng v-if sẽ xử lý việc này */
}

.chat-fab {
  position: relative;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(22, 163, 74, 0.45);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.chat-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(22, 163, 74, 0.55);
}

.chat-fab__icon {
  font-size: 1.4rem;
  color: #fff;
}

.chat-fab__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 4px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

/* ─── Chat Panel ──────────────────────────────────────────────────────────── */
.chat-panel {
  width: 22rem;
  max-height: 80vh;
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (max-width: 480px) {
  .chat-panel {
    width: calc(100vw - 2rem);
    max-height: 85vh;
  }
  .chatbox-wrapper {
    bottom: 1rem;
    right: 1rem;
  }
}

/* Header */
.chat-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: #fff;
}

.chat-panel__header-info {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.chat-panel__avatar {
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.15);
}

.chat-panel__title {
  font-size: 0.9375rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.chat-panel__subtitle {
  font-size: 0.75rem;
  margin: 0;
  opacity: 0.85;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.online-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #86efac;
  display: inline-block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.chat-panel__header-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.chat-panel__header-actions :deep(.p-button) {
  color: rgba(255, 255, 255, 0.85) !important;
}

.chat-panel__header-actions :deep(.p-button:hover) {
  background: rgba(255, 255, 255, 0.15) !important;
  color: #fff !important;
}

/* Messages */
.chat-panel__messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  scroll-behavior: smooth;
  min-height: 14rem;
  max-height: 22rem;
}

.chat-panel__messages::-webkit-scrollbar {
  width: 4px;
}

.chat-panel__messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-panel__messages::-webkit-scrollbar-thumb {
  background: #d1fae5;
  border-radius: 99px;
}

/* Empty/Suggestions */
.chat-panel__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.chat-panel__suggestions-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.chat-panel__suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.chat-suggestion-chip {
  cursor: pointer;
  font-size: 0.75rem !important;
  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.chat-suggestion-chip:hover {
  transform: translateY(-1px);
}

:deep(.chat-suggestion-chip .p-chip) {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  font-size: 0.75rem;
}

:deep(.chat-suggestion-chip .p-chip:hover) {
  background: #dcfce7;
}

/* Message bubbles */
.chat-message {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.chat-message--user {
  flex-direction: row-reverse;
}

.chat-message__avatar {
  flex-shrink: 0;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.chat-message__bubble-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  max-width: 80%;
}

.chat-message--user .chat-message__bubble-wrapper {
  align-items: flex-end;
}

.chat-message--bot .chat-message__bubble-wrapper {
  align-items: flex-start;
}

.chat-message__bubble {
  padding: 0.625rem 0.875rem;
  border-radius: 1.125rem;
  font-size: 0.875rem;
  line-height: 1.5;
  word-break: break-word;
}

.chat-message--user .chat-message__bubble {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.chat-message--bot .chat-message__bubble {
  background: #f3f4f6;
  color: #111827;
  border-bottom-left-radius: 4px;
}

.chat-message__time {
  font-size: 0.65rem;
  color: #9ca3af;
  padding: 0 0.25rem;
}

:deep(.chat-link) {
  color: #15803d;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;
}

:deep(.chat-link:hover) {
  color: #16a34a;
}

/* Typing indicator */
.chat-typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  border-radius: 1.125rem;
  border-bottom-left-radius: 4px;
}

.chat-typing span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typing-bounce 1.2s infinite;
}

.chat-typing span:nth-child(2) {
  animation-delay: 0.2s;
}
.chat-typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-6px);
  }
}

/* Input */
.chat-panel__input {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #f3f4f6;
  background: #fff;
}

.chat-panel__textarea {
  flex: 1;
  font-size: 0.875rem !important;
  resize: none !important;
  border-radius: 1rem !important;
  max-height: 6rem;
  overflow-y: auto !important;
}

.chat-panel__send-btn {
  flex-shrink: 0;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
  border: none !important;
  width: 2.5rem;
  height: 2.5rem;
}

.chat-panel__send-btn:not(:disabled):hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

/* ─── Transitions ─────────────────────────────────────────────────────────── */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(1.5rem) scale(0.95);
}
</style>
