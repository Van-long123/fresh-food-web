<template>
  <!-- ── VARIANT: FULLPAGE ─────────────────────────────────────── -->
  <div v-if="variant === 'fullpage'" class="loading-fullpage">
    <!-- Layer 1: Background leaf decorations 4 góc -->
    <div class="leaf leaf-tl" aria-hidden="true">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <path
          d="M10 70 Q10 10 70 10 Q70 40 40 55 Q25 65 10 70Z"
          fill="#16A34A"
        />
        <path
          d="M15 68 Q20 35 55 20"
          stroke="#15803D"
          stroke-width="1.5"
          fill="none"
        />
      </svg>
    </div>
    <div class="leaf leaf-tr" aria-hidden="true">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <path
          d="M70 70 Q70 10 10 10 Q10 40 40 55 Q55 65 70 70Z"
          fill="#16A34A"
        />
        <path
          d="M65 68 Q60 35 25 20"
          stroke="#15803D"
          stroke-width="1.5"
          fill="none"
        />
      </svg>
    </div>
    <div class="leaf leaf-bl" aria-hidden="true">
      <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
        <path d="M5 5 Q60 5 60 60 Q35 60 20 40 Q10 25 5 5Z" fill="#16A34A" />
      </svg>
    </div>
    <div class="leaf leaf-br" aria-hidden="true">
      <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
        <path d="M65 5 Q10 5 10 60 Q35 60 50 40 Q60 25 65 5Z" fill="#16A34A" />
      </svg>
    </div>

    <!-- Layer 2: Main Logo -->
    <div class="logo-area">
      <!-- Vòng ngoài xoay ngược -->
      <div class="ring-outer" aria-hidden="true"></div>
      <!-- Vòng xoay chính -->
      <div class="ring-inner" aria-hidden="true"></div>

      <!-- Logo icon -->
      <div class="logo-circle">
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          aria-hidden="true"
        >
          <!-- Lá cây / rau củ icon -->
          <path
            d="M22 8 C14 8 8 14 8 22 C8 28 12 33 18 35 L18 38 L26 38 L26 35 C32 33 36 28 36 22 C36 14 30 8 22 8Z"
            fill="white"
            opacity="0.95"
          />
          <path
            d="M22 12 L22 34"
            stroke="#16A34A"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M22 20 C22 20 16 17 14 12 C18 11 22 14 22 20Z"
            fill="#86EFAC"
          />
          <path
            d="M22 24 C22 24 28 21 30 16 C26 15 22 18 22 24Z"
            fill="#86EFAC"
          />
        </svg>
      </div>

      <!-- Tên thương hiệu -->
      <p class="brand-name">SMARTFOOD</p>
      <!-- Tagline -->
      <p class="brand-tagline">Thực phẩm sạch — Sống khỏe mỗi ngày</p>
    </div>

    <!-- Layer 3: Loading Animation -->
    <div class="loading-anim-area">
      <!-- Nếu có progress → thanh xác định -->
      <div v-if="hasProgress" class="progress-track">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        <span class="progress-text">{{ progress }}%</span>
      </div>

      <!-- Dots bounce (phase 1) -->
      <div
        v-else-if="animPhase === 'dots'"
        class="dots-container"
        aria-label="Đang tải..."
      >
        <span class="dot dot-1"></span>
        <span class="dot dot-2"></span>
        <span class="dot dot-3"></span>
      </div>

      <!-- Food parade (phase 2) -->
      <div v-else class="parade-container" aria-label="Đang tải...">
        <span class="food-icon" style="animation-delay: 0s">🥦</span>
        <span class="food-icon" style="animation-delay: 0.4s">🍎</span>
        <span class="food-icon" style="animation-delay: 0.8s">🥕</span>
        <span class="food-icon" style="animation-delay: 1.2s">🍊</span>
        <span class="food-icon" style="animation-delay: 1.6s">🌿</span>
      </div>
    </div>

    <!-- Layer 4: Loading message -->
    <p :key="displayMessage" class="loading-message">
      {{ displayMessage }}
    </p>

    <!-- Layer 5: Tip corner (xuất hiện sau 2s) -->
    <div v-if="showTip" class="tip-box" aria-hidden="true">
      💡 Mẹo: Đặt hàng trước 10h sáng — giao trong ngày!
    </div>
  </div>

  <!-- ── VARIANT: OVERLAY ───────────────────────────────────────── -->
  <div
    v-else-if="variant === 'overlay'"
    class="loading-overlay"
    role="dialog"
    aria-modal="true"
    aria-label="Đang xử lý"
  >
    <div class="overlay-card">
      <!-- SVG Spinner -->
      <div class="spinner-wrap" aria-hidden="true">
        <svg class="svg-spinner" viewBox="0 0 50 50" width="56" height="56">
          <!-- Track mờ -->
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#FED7AA"
            stroke-width="4"
          />
          <!-- Arc cam xoay -->
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#F97316"
            stroke-width="4"
            stroke-linecap="round"
            stroke-dasharray="80 126"
            stroke-dashoffset="-10"
          />
          <!-- Chấm đầu arc -->
          <circle cx="25" cy="5" r="3" fill="#F97316" />
        </svg>
      </div>

      <!-- Text -->
      <p class="overlay-title">{{ props.message || "Đang xử lý..." }}</p>
      <p class="overlay-sub">Vui lòng không tắt trang</p>

      <!-- Progress bar (nếu có) -->
      <div v-if="hasProgress" class="overlay-progress-track">
        <div
          class="overlay-progress-fill"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </div>

  <!-- ── VARIANT: INLINE ────────────────────────────────────────── -->
  <div v-else-if="variant === 'inline'" class="loading-inline">
    <!-- 3 chấm bounce nhỏ hơn -->
    <div class="inline-dots" aria-label="Đang tải...">
      <span class="dot-sm dot-sm-1"></span>
      <span class="dot-sm dot-sm-2"></span>
      <span class="dot-sm dot-sm-3"></span>
    </div>
    <span class="inline-text">{{ props.message || "Đang tải thêm..." }}</span>
  </div>

  <!-- ── VARIANT: BUTTON ────────────────────────────────────────── -->
  <span
    v-else-if="variant === 'button'"
    class="loading-btn"
    aria-label="Đang xử lý"
  >
    <svg
      class="btn-spinner"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        stroke-width="2"
      />
      <circle
        cx="8"
        cy="8"
        r="6"
        fill="none"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-dasharray="25 13"
        stroke-dashoffset="-3"
      />
    </svg>
    <span>{{ props.message || "Đang xử lý..." }}</span>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

// ── Props ──────────────────────────────────────────────────────────────────────
const props = withDefaults(
  defineProps<{
    variant: "fullpage" | "overlay" | "inline" | "button";
    message?: string;
    progress?: number;
  }>(),
  {
    variant: "fullpage",
  },
);

// ── Messages xoay vòng (chỉ dùng cho fullpage) ────────────────────────────────
const messages = [
  "Đang tải sản phẩm tươi ngon...",
  "Chuẩn bị kho hàng cho bạn...",
  "Kiểm tra khuyến mãi hôm nay...",
  "Sắp xong rồi, chờ chút nhé!",
];

const messageIndex = ref(0);
const currentMessage = ref(messages[0]);
const showTip = ref(false);
const animPhase = ref<"dots" | "parade">("dots");

// Timers / intervals
let msgInterval: ReturnType<typeof setInterval> | null = null;
let phaseTimer: ReturnType<typeof setTimeout> | null = null;
let tipTimer: ReturnType<typeof setTimeout> | null = null;

// ── Computed ───────────────────────────────────────────────────────────────────
const hasProgress = computed(
  () => props.progress !== undefined && props.progress !== null,
);
const displayMessage = computed(() => props.message || currentMessage.value);

// ── Lifecycle ──────────────────────────────────────────────────────────────────
onMounted(() => {
  if (props.variant !== "fullpage") return;

  // Xoay messages mỗi 1.8s
  msgInterval = setInterval(() => {
    messageIndex.value = (messageIndex.value + 1) % messages.length;
    currentMessage.value = messages[messageIndex.value];
  }, 1800);

  // Chuyển sang food parade sau 1s
  phaseTimer = setTimeout(() => {
    animPhase.value = "parade";
  }, 1000);

  // Hiện tip sau 2s
  tipTimer = setTimeout(() => {
    showTip.value = true;
  }, 2000);
});

onUnmounted(() => {
  if (msgInterval) clearInterval(msgInterval);
  if (phaseTimer) clearTimeout(phaseTimer);
  if (tipTimer) clearTimeout(tipTimer);
});
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════════════
   KEYFRAMES ANIMATIONS
   ══════════════════════════════════════════════════════════════════ */

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes spin-reverse {
  to {
    transform: rotate(-360deg);
  }
}
@keyframes dot-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  40% {
    transform: translateY(-14px) scale(1.1);
    opacity: 0.7;
  }
}
@keyframes dot-bounce-sm {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
}
@keyframes food-parade {
  from {
    transform: translateX(220px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  to {
    transform: translateX(-220px);
    opacity: 0;
  }
}
@keyframes logo-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.04);
  }
}
@keyframes logo-enter {
  from {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.15);
    opacity: 1;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes leaf-sway {
  0%,
  100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}
@keyframes shimmer-slide {
  0% {
    transform: translateX(-150%);
  }
  100% {
    transform: translateX(350%);
  }
}
@keyframes mount-scale {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes tip-fadein {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes msg-cycle {
  0% {
    opacity: 0;
    transform: translateY(6px);
  }
  15% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-6px);
  }
}
@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ══════════════════════════════════════════════════════════════════
   VARIANT 1 — FULLPAGE
   ══════════════════════════════════════════════════════════════════ */

.loading-fullpage {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  overflow: hidden;
}

/* Leaf decorations – 4 góc */
.leaf {
  position: absolute;
  opacity: 0.07;
  animation: leaf-sway 8s ease-in-out infinite;
}
.leaf-tl {
  top: 0;
  left: 0;
  transform-origin: top left;
}
.leaf-tr {
  top: 0;
  right: 0;
  transform-origin: top right;
  animation-delay: -2s;
}
.leaf-bl {
  bottom: 0;
  left: 0;
  transform-origin: bottom left;
  animation-delay: -4s;
}
.leaf-br {
  bottom: 0;
  right: 0;
  transform-origin: bottom right;
  animation-delay: -6s;
}

/* Logo area */
.logo-area {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 200px;
  justify-content: center;
}

/* Vòng xoay chính */
.ring-inner {
  position: absolute;
  inset: calc(50% - 52px);
  width: 104px;
  height: 104px;
  border-radius: 50%;
  border: 3px solid #f97316;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

/* Vòng xoay ngược */
.ring-outer {
  position: absolute;
  inset: calc(50% - 60px);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px dashed rgba(249, 115, 22, 0.35);
  animation: spin-reverse 2s linear infinite;
}

/* Logo circle */
.logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ea580c);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.35);
  animation:
    logo-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both,
    logo-pulse 2s ease-in-out 0.5s infinite;
  position: relative;
  z-index: 1;
}

/* Brand name */
.brand-name {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 0.15em;
  background: linear-gradient(135deg, #f97316, #c2410c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fade-up 0.4s ease 0.3s both;
  position: absolute;
  bottom: 5px;
}

/* Tagline */
.brand-tagline {
  font-size: 13px;
  color: #6b7280;
  animation: fade-up 0.4s ease 0.5s both;
  margin-top: 4px;
  position: absolute;
  bottom: -20px;
  white-space: nowrap;
}

/* Loading animation area */
.loading-anim-area {
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 36px;
}

/* Progress bar xác định */
.progress-track {
  width: 100%;
  height: 4px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: visible;
  position: relative;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #ea580c);
  border-radius: 9999px;
  transition: width 0.3s ease;
}
.progress-text {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 12px;
  font-weight: 700;
  color: #f97316;
}

/* Dots bounce */
.dots-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f97316;
  animation: dot-bounce 1.2s ease-in-out infinite;
}
.dot-1 {
  animation-delay: 0s;
}
.dot-2 {
  animation-delay: 0.16s;
}
.dot-3 {
  animation-delay: 0.32s;
}

/* Food parade */
.parade-container {
  width: 200px;
  height: 28px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
}
.food-icon {
  position: absolute;
  font-size: 20px;
  animation: food-parade 2s linear infinite;
  line-height: 1;
}

/* Loading message */
.loading-message {
  font-size: 13px;
  color: #6b7280;
  text-align: center;
  margin-top: 16px;
  animation: msg-cycle 1.8s ease infinite;
  min-height: 20px;
}

/* Tip box */
.tip-box {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
  animation: tip-fadein 0.5s ease both;
}

/* ══════════════════════════════════════════════════════════════════
   VARIANT 2 — OVERLAY
   ══════════════════════════════════════════════════════════════════ */

.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 40px 48px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 280px;
  text-align: center;
  animation: mount-scale 0.4s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}

/* SVG spinner overlay */
.spinner-wrap {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
}
.svg-spinner {
  animation: spin 1s linear infinite;
}

.overlay-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 6px;
}
.overlay-sub {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 12px;
}

/* Progress overlay */
.overlay-progress-track {
  width: 180px;
  height: 3px;
  background: #f3f4f6;
  border-radius: 9999px;
  margin: 0 auto;
  overflow: hidden;
}
.overlay-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #ea580c);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

/* ══════════════════════════════════════════════════════════════════
   VARIANT 3 — INLINE
   ══════════════════════════════════════════════════════════════════ */

.loading-inline {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px;
  width: 100%;
}

.inline-dots {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dot-sm {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f97316;
  animation: dot-bounce-sm 1.2s ease-in-out infinite;
}
.dot-sm-1 {
  animation-delay: 0s;
}
.dot-sm-2 {
  animation-delay: 0.16s;
}
.dot-sm-3 {
  animation-delay: 0.32s;
}

.inline-text {
  font-size: 14px;
  color: #9ca3af;
}

/* ══════════════════════════════════════════════════════════════════
   VARIANT 4 — BUTTON
   ══════════════════════════════════════════════════════════════════ */

.loading-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}
.btn-spinner {
  animation: btn-spin 0.8s linear infinite;
  flex-shrink: 0;
}
</style>
