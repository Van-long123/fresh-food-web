<template>
  <div class="fp-page">
    <!-- Background vegetable pattern -->
    <div class="bg-pattern" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="veg-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
            <text x="10" y="35" font-size="28">🥦</text>
            <text x="55" y="75" font-size="26">🍅</text>
            <text x="5"  y="90" font-size="22">🌿</text>
            <text x="65" y="25" font-size="24">🥕</text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#veg-pattern)" />
      </svg>
    </div>

    <!-- Card -->
    <div class="fp-card">

      <!-- =========== STATE 1: INPUT EMAIL =========== -->
      <Transition name="crossfade" mode="out-in">
        <div v-if="state === 'input'" key="input" class="state-block">
          <!-- Floating lock+mail icon -->
          <div class="hero-icon" aria-hidden="true">
            <div class="icon-ring">
              <svg viewBox="0 0 56 56" fill="none" class="icon-svg" xmlns="http://www.w3.org/2000/svg">
                <!-- Lock body -->
                <rect x="13" y="26" width="30" height="20" rx="4" fill="#f97316" />
                <!-- Lock shackle -->
                <path d="M19 26v-7a9 9 0 0 1 18 0v7" stroke="#ea580c" stroke-width="3" stroke-linecap="round" fill="none"/>
                <!-- Mail slot -->
                <rect x="19" y="32" width="18" height="8" rx="2" fill="white" fill-opacity="0.9"/>
                <path d="M19 33l9 5 9-5" stroke="#f97316" stroke-width="1.5" stroke-linecap="round" fill="none"/>
              </svg>
            </div>
          </div>

          <h1 class="card-title">Quên mật khẩu?</h1>
          <p class="card-subtitle">Nhập email để nhận link đặt lại mật khẩu của bạn.</p>

          <form novalidate class="mt-6" @submit.prevent="handleSend">
            <div class="field-group" :class="{ error: !!emailError }">
              <label for="fp-email" class="field-label">Email <span class="req">*</span></label>
              <div class="input-wrap">
                <span class="input-icon"><i class="pi pi-envelope" /></span>
                <InputText
                  id="fp-email"
                  v-model="email"
                  type="email"
                  placeholder="your@email.com"
                  autocomplete="email"
                  :invalid="!!emailError"
                  class="prime-input"
                  aria-label="Email"
                  aria-required="true"
                />
              </div>
              <small v-if="emailError" class="field-error">{{ emailError }}</small>
            </div>

            <button type="submit" class="btn-primary" :disabled="loading">
              <svg v-if="loading" class="spinner" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
                <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <i v-else class="pi pi-send" />
              {{ loading ? 'Đang gửi...' : 'Gửi link đặt lại' }}
            </button>
          </form>

          <NuxtLink to="/auth/login" class="back-link">
            <i class="pi pi-arrow-left" /> Quay lại đăng nhập
          </NuxtLink>
        </div>
      </Transition>

      <!-- =========== STATE 2: SUCCESS =========== -->
      <Transition name="crossfade" mode="out-in">
        <div v-if="state === 'success'" key="success" class="state-block text-center">
          <!-- Animated SVG checkmark -->
          <div class="check-wrap" aria-label="Thành công">
            <svg viewBox="0 0 80 80" class="check-svg" xmlns="http://www.w3.org/2000/svg">
              <!-- Circle -->
              <circle
                cx="40" cy="40" r="36"
                fill="none"
                stroke="#16a34a"
                stroke-width="4"
                stroke-dasharray="226"
                stroke-dashoffset="226"
                class="check-circle"
                stroke-linecap="round"
              />
              <!-- Checkmark -->
              <path
                d="M24 40l10 10 22-20"
                fill="none"
                stroke="#16a34a"
                stroke-width="4.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-dasharray="50"
                stroke-dashoffset="50"
                class="check-mark"
              />
            </svg>
          </div>

          <h1 class="card-title success-title">Kiểm tra hộp thư!</h1>
          <p class="card-subtitle">
            Chúng tôi đã gửi link đặt lại mật khẩu đến
            <strong class="email-highlight">{{ email }}</strong>
          </p>

          <!-- Countdown timer -->
          <div class="countdown-wrap">
            <div class="countdown-ring">
              <svg viewBox="0 0 64 64" class="countdown-svg" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="27" fill="none" stroke="#e5e7eb" stroke-width="4"/>
                <circle
                  cx="32" cy="32" r="27"
                  fill="none"
                  stroke="#f97316"
                  stroke-width="4"
                  stroke-linecap="round"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="dashOffset"
                  transform="rotate(-90 32 32)"
                  style="transition: stroke-dashoffset 1s linear"
                />
              </svg>
              <span class="countdown-num">{{ countdown }}</span>
            </div>
            <span class="countdown-label">{{ countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Có thể gửi lại' }}</span>
          </div>

          <button class="btn-primary" :disabled="countdown > 0 || loading" @click="handleResend">
            <svg v-if="loading" class="spinner" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
              <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <i v-else class="pi pi-refresh" />
            {{ loading ? 'Đang gửi...' : 'Gửi lại email' }}
          </button>

          <button class="back-link mt-4" @click="resetState">
            Sai email? Thử lại
          </button>
        </div>
      </Transition>

      <!-- =========== STATE 3: ERROR =========== -->
      <Transition name="crossfade" mode="out-in">
        <div v-if="state === 'error'" key="error" class="state-block text-center">
          <!-- Animated X icon -->
          <div class="error-wrap" aria-label="Lỗi">
            <svg viewBox="0 0 80 80" class="error-svg" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="36" fill="#fef2f2" stroke="#ef4444" stroke-width="3" class="error-circle"/>
              <path d="M27 27l26 26M53 27L27 53" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" class="error-x"/>
            </svg>
          </div>

          <h1 class="card-title error-title">Email không tồn tại</h1>
          <p class="card-subtitle">
            Không tìm thấy tài khoản nào với email
            <strong class="email-highlight">{{ email }}</strong>.
            Vui lòng kiểm tra lại email của bạn.
          </p>

          <button class="btn-primary" @click="resetState">
            <i class="pi pi-refresh" /> Thử email khác
          </button>

          <NuxtLink to="/auth/register" class="back-link mt-3 block">
            Chưa có tài khoản? <strong>Đăng ký ngay →</strong>
          </NuxtLink>
        </div>
      </Transition>

    </div>

    <!-- Footer link -->
    <p class="page-footer-link">
      Nhớ mật khẩu rồi?
      <NuxtLink to="/auth/login" class="orange-link">Đăng nhập</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useToast } from 'primevue/usetoast'

definePageMeta({ layout: false })

const toast = useToast()

type PageState = 'input' | 'success' | 'error'

const state   = ref<PageState>('input')
const email   = ref('')
const emailError = ref('')
const loading = ref(false)

// ===== COUNTDOWN =====
const TOTAL_SECONDS = 59
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const circumference = computed(() => 2 * Math.PI * 27) // r=27
const dashOffset = computed(() => {
  const fraction = countdown.value / TOTAL_SECONDS
  return circumference.value * (1 - fraction)
})

const startCountdown = () => {
  countdown.value = TOTAL_SECONDS
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!)
      countdownTimer = null
    }
  }, 1000)
}

onBeforeUnmount(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

// ===== VALIDATION =====
const validate = (): boolean => {
  emailError.value = ''
  if (!email.value) { emailError.value = 'Email là bắt buộc.'; return false }
  if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email.value)) { emailError.value = 'Email không đúng định dạng.'; return false }
  return true
}

// ===== SIMULATE API =====
const simulateSend = async (): Promise<boolean> => {
  // Simulate: emails containing 'error' → fail, otherwise success
  return !email.value.toLowerCase().includes('error')
}

const handleSend = async () => {
  if (!validate()) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1500))
  const success = await simulateSend()
  loading.value = false

  if (success) {
    state.value = 'success'
    startCountdown()
    toast.add({ severity: 'success', summary: 'Đã gửi', detail: 'Kiểm tra hộp thư của bạn!', life: 4000 })
  } else {
    state.value = 'error'
  }
}

const handleResend = async () => {
  if (countdown.value > 0) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1500))
  loading.value = false
  startCountdown()
  toast.add({ severity: 'info', summary: 'Đã gửi lại', detail: `Email vừa được gửi đến ${email.value}`, life: 4000 })
}

const resetState = () => {
  state.value = 'input'
  emailError.value = ''
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null }
  countdown.value = 0
}
</script>

<style scoped>
/* ========================================
   PAGE WRAPPER
   ======================================== */
.fp-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #f9fafb 0%, #ffffff 100%);
  padding: 2rem 1rem;
  position: relative;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

/* Background pattern */
.bg-pattern {
  position: fixed; inset: 0;
  opacity: 0.045;
  pointer-events: none;
  z-index: 0;
}

/* ========================================
   CARD
   ======================================== */
.fp-card {
  position: relative; z-index: 1;
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05);
  padding: 2.5rem 2rem;
  animation: cardMount 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  overflow: hidden;
}

@media (min-width: 480px) {
  .fp-card { padding: 2.5rem; }
}

@keyframes cardMount {
  from { opacity: 0; transform: scale(0.94) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* ========================================
   STATE TRANSITIONS
   ======================================== */
.crossfade-enter-active,
.crossfade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.crossfade-enter-from { opacity: 0; transform: scale(0.96) translateY(8px); }
.crossfade-leave-to   { opacity: 0; transform: scale(1.02) translateY(-8px); }

.state-block { width: 100%; }

/* ========================================
   HERO ICON (STATE 1)
   ======================================== */
.hero-icon {
  display: flex; justify-content: center; margin-bottom: 1.5rem;
}

.icon-ring {
  width: 5.5rem; height: 5.5rem;
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  border-radius: 50%;
  border: 2px solid #fed7aa;
  display: flex; align-items: center; justify-content: center;
  animation: iconFloat 3s ease-in-out infinite;
  box-shadow: 0 6px 20px rgba(249,115,22,0.15);
}

.icon-svg { width: 3rem; height: 3rem; }

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50%       { transform: translateY(-8px) rotate(2deg); }
}

/* ========================================
   TYPOGRAPHY
   ======================================== */
.card-title {
  font-size: 1.625rem; font-weight: 900; color: #111827;
  margin: 0 0 0.375rem 0; text-align: center; line-height: 1.2;
}
.card-subtitle {
  font-size: 0.9rem; color: #6b7280;
  text-align: center; line-height: 1.6;
  margin: 0;
}
.success-title { color: #16a34a; }
.error-title   { color: #ef4444; }

.email-highlight {
  color: #f97316; font-weight: 700;
  overflow-wrap: anywhere;
}

.text-center { text-align: center; }

/* ========================================
   FORM FIELDS
   ======================================== */
.field-group { margin-bottom: 1.125rem; }
.field-label { display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.375rem; }
.req         { color: #ef4444; }
.field-error { display: block; font-size: 0.75rem; color: #ef4444; margin-top: 0.3rem; }

.input-wrap { position: relative; }
.input-icon {
  position: absolute; top: 0; bottom: 0; left: 0.875rem;
  display: flex; align-items: center;
  color: #9ca3af; font-size: 0.875rem; z-index: 10;
  pointer-events: none;
}

:deep(.prime-input),
:deep(.p-inputtext) {
  width: 100%;
  padding-left: 2.75rem !important;
  border-radius: 12px !important;
  border-color: #e5e7eb !important;
  font-size: 0.9rem;
  height: 44px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
:deep(.prime-input:focus),
:deep(.p-inputtext:focus) {
  border-color: #f97316 !important;
  box-shadow: 0 0 0 3px rgba(249,115,22,0.15) !important;
  outline: none !important;
}

/* ========================================
   BUTTONS
   ======================================== */
.btn-primary {
  width: 100%;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.875rem;
  border: none; border-radius: 12px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white; font-weight: 700; font-size: 0.9375rem;
  cursor: pointer; margin-top: 1rem;
  box-shadow: 0 4px 18px rgba(249,115,22,0.35);
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
}
.btn-primary:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 8px 26px rgba(249,115,22,0.5);
}
.btn-primary:active:not(:disabled) { transform: scale(0.97); }
.btn-primary:disabled {
  background: linear-gradient(135deg, #fdba74, #fb923c);
  opacity: 0.6; cursor: not-allowed;
  box-shadow: none; transform: none;
}

.spinner {
  width: 1rem; height: 1rem; flex-shrink: 0;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.back-link {
  display: flex; align-items: center; justify-content: center; gap: 0.375rem;
  margin-top: 1.125rem;
  font-size: 0.875rem; font-weight: 600; color: #6b7280;
  text-decoration: none; background: none; border: none; cursor: pointer;
  transition: color 0.2s;
  width: 100%;
}
.back-link:hover { color: #f97316; }

.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.block { display: block; }

/* ========================================
   SUCCESS STATE — ANIMATED CHECKMARK
   ======================================== */
.check-wrap {
  display: flex; justify-content: center; margin-bottom: 1.5rem;
}

.check-svg {
  width: 5.5rem; height: 5.5rem;
  overflow: visible;
}

.check-circle {
  animation: drawCircle 0.7s ease-out 0.1s forwards;
}
.check-mark {
  animation: drawCheck 0.4s ease-out 0.75s forwards;
}

@keyframes drawCircle {
  from { stroke-dashoffset: 226; }
  to   { stroke-dashoffset: 0; }
}
@keyframes drawCheck {
  from { stroke-dashoffset: 50; }
  to   { stroke-dashoffset: 0; }
}

/* Countdown timer */
.countdown-wrap {
  display: flex; flex-direction: column; align-items: center;
  gap: 0.5rem; margin: 1.5rem 0 0.5rem;
}

.countdown-ring {
  position: relative; width: 4rem; height: 4rem;
  display: flex; align-items: center; justify-content: center;
}

.countdown-svg {
  width: 4rem; height: 4rem;
  position: absolute; inset: 0;
}

.countdown-num {
  font-size: 1.05rem; font-weight: 900; color: #f97316;
  position: relative; z-index: 1;
}

.countdown-label {
  font-size: 0.8rem; font-weight: 600; color: #6b7280;
}

/* ========================================
   ERROR STATE — ANIMATED X
   ======================================== */
.error-wrap {
  display: flex; justify-content: center; margin-bottom: 1.5rem;
}

.error-svg { width: 5.5rem; height: 5.5rem; }

.error-circle {
  animation: errorPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  transform-origin: 40px 40px;
}
.error-x {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: drawX 0.4s ease-out 0.35s forwards;
}

@keyframes errorPop {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
@keyframes drawX {
  from { stroke-dashoffset: 40; }
  to   { stroke-dashoffset: 0;  }
}

/* ========================================
   PAGE FOOTER
   ======================================== */
.page-footer-link {
  position: relative; z-index: 1;
  font-size: 0.875rem; color: #9ca3af; margin-top: 1.5rem;
}
.orange-link { color: #f97316; font-weight: 700; text-decoration: none; margin-left: 0.25rem; }
.orange-link:hover { text-decoration: underline; color: #ea580c; }

/* ========================================
   MT utility
   ======================================== */
.mt-6 { margin-top: 1.5rem; }
</style>
