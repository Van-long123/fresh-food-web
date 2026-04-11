<template>
  <div class="cp-page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink :to="ROUTES.HOME" class="bc-link">Tài khoản</NuxtLink>
      <i class="pi pi-chevron-right bc-sep" />
      <span class="bc-link bc-dim">Bảo mật</span>
      <i class="pi pi-chevron-right bc-sep" />
      <span class="bc-current">Đổi mật khẩu</span>
    </nav>

    <!-- Main card -->
    <div class="cp-card" :class="{ shake: isShaking }">

      <!-- Success overlay -->
      <Transition name="overlay-fade">
        <div v-if="showSuccess" class="success-overlay" aria-live="polite">
          <div class="success-inner">
            <!-- Animated SVG checkmark -->
            <svg viewBox="0 0 90 90" class="success-svg" xmlns="http://www.w3.org/2000/svg">
              <circle cx="45" cy="45" r="40" fill="none" stroke="#16a34a" stroke-width="4"
                stroke-dasharray="252" stroke-dashoffset="252" class="succ-circle" />
              <path d="M26 45l13 13 25-25" fill="none" stroke="#16a34a" stroke-width="5"
                stroke-linecap="round" stroke-linejoin="round"
                stroke-dasharray="55" stroke-dashoffset="55" class="succ-check" />
            </svg>
            <h2 class="succ-title">Đổi mật khẩu thành công!</h2>
            <p class="succ-sub">Chuyển hướng về trang tài khoản sau <strong>{{ redirectCountdown }}s</strong>…</p>
            <!-- Mini countdown bar -->
            <div class="redirect-track">
              <div class="redirect-fill" :style="{ width: redirectProgress }" />
            </div>
          </div>
        </div>
      </Transition>

      <!-- Card header -->
      <div class="card-header">
        <div class="card-icon">
          <i class="pi pi-shield" />
        </div>
        <div>
          <h1 class="card-title">Đổi mật khẩu</h1>
          <p class="card-sub">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
        </div>
      </div>

      <Divider />

      <form novalidate @submit.prevent="handleSubmit">

        <!-- Current password -->
        <div class="field-group">
          <label class="field-label">Mật khẩu hiện tại <span class="req">*</span></label>
          <div class="input-wrap">
            <span class="input-icon"><i class="pi pi-lock" /></span>
            <Password
              v-model="form.current"
              :feedback="false"
              :toggle-mask="true"
              placeholder="Nhập mật khẩu hiện tại"
              :invalid="!!errors.current"
              input-class="prime-input"
              class="w-full"
              aria-label="Mật khẩu hiện tại"
            />
          </div>
          <small v-if="errors.current" class="field-error">{{ errors.current }}</small>
        </div>

        <!-- New password -->
        <div class="field-group">
          <label class="field-label">Mật khẩu mới <span class="req">*</span></label>
          <div class="input-wrap">
            <span class="input-icon"><i class="pi pi-lock-open" /></span>
            <Password
              v-model="form.newPwd"
              :feedback="false"
              :toggle-mask="true"
              placeholder="Mật khẩu ít nhất 8 ký tự"
              :invalid="!!errors.newPwd"
              input-class="prime-input"
              class="w-full"
              aria-label="Mật khẩu mới"
            />
          </div>
          <small v-if="errors.newPwd" class="field-error">{{ errors.newPwd }}</small>

          <!-- Strength meter -->
          <div v-if="form.newPwd" class="strength-wrap">
            <div class="strength-bar-row">
              <div
                v-for="i in 4" :key="i"
                class="strength-seg"
                :class="{ active: strength.score >= i }"
                :style="strength.score >= i ? { background: strength.color } : {}"
              />
            </div>
            <span v-if="strength.label" class="strength-label" :style="{ color: strength.color }">
              {{ strength.label }}
            </span>
          </div>

          <!-- Checklist -->
          <div v-if="form.newPwd" class="checklist">
            <div
              v-for="rule in rules" :key="rule.label"
              class="rule-item"
              :class="{ met: rule.met }"
            >
              <span class="rule-icon">
                <i :class="rule.met ? 'pi pi-check-circle' : 'pi pi-times-circle'" />
              </span>
              {{ rule.label }}
            </div>
          </div>
        </div>

        <!-- Confirm password -->
        <div class="field-group">
          <label class="field-label">Xác nhận mật khẩu mới <span class="req">*</span></label>
          <div class="input-wrap" :class="{ matched: isMatched, mismatched: isMismatched }">
            <span class="input-icon"><i class="pi pi-lock" /></span>
            <Password
              v-model="form.confirm"
              :feedback="false"
              :toggle-mask="true"
              placeholder="Nhập lại mật khẩu mới"
              :invalid="!!errors.confirm"
              input-class="prime-input"
              class="w-full"
              aria-label="Xác nhận mật khẩu mới"
            />
            <!-- Match indicator -->
            <span v-if="isMatched" class="match-badge match-ok">
              <i class="pi pi-check" />
            </span>
            <span v-else-if="isMismatched" class="match-badge match-fail">
              <i class="pi pi-times" />
            </span>
          </div>
          <small v-if="errors.confirm" class="field-error">{{ errors.confirm }}</small>
        </div>

        <!-- Tip box -->
        <div class="tip-box">
          <i class="pi pi-info-circle tip-icon" />
          <span>Đừng dùng lại mật khẩu đã dùng ở các nơi khác để bảo mật tốt hơn.</span>
        </div>

        <!-- Buttons -->
        <div class="btn-row">
          <button type="button" class="btn-cancel" @click="resetForm">
            Huỷ
          </button>
          <button type="submit" class="btn-primary" :disabled="loading">
            <svg v-if="loading" class="spinner" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
              <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <i v-else class="pi pi-check" />
            {{ loading ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">


import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { usePasswordStrength } from '~/composables/usePasswordStrength'
import { ROUTES } from '~/constants/routes'

useHead({
  title: 'Đổi mật khẩu - SmartFood',
  meta: [
    { name: 'description', content: 'Trang Đổi mật khẩu của SmartFood' }
  ]
});


definePageMeta({ layout: 'default' })

const router = useRouter()
const toast  = useToast()

// ===== FORM STATE =====
const form = reactive({ current: '', newPwd: '', confirm: '' })
const errors = reactive({ current: '', newPwd: '', confirm: '' })
const loading    = ref(false)
const isShaking  = ref(false)
const showSuccess = ref(false)

// ===== PASSWORD STRENGTH (composable) =====
const newPwdRef = reactive({ get value() { return form.newPwd } })
const { rules, strength } = usePasswordStrength(newPwdRef)

// ===== MATCH INDICATOR =====
const isMatched    = computed(() => form.confirm.length > 0 && form.newPwd === form.confirm)
const isMismatched = computed(() => form.confirm.length > 0 && form.newPwd !== form.confirm)

// ===== VALIDATION =====
const validate = (): boolean => {
  errors.current = errors.newPwd = errors.confirm = ''
  let ok = true

  if (!form.current) {
    errors.current = 'Vui lòng nhập mật khẩu hiện tại.'; ok = false
  }
  if (!form.newPwd) {
    errors.newPwd = 'Vui lòng nhập mật khẩu mới.'; ok = false
  } else if (form.newPwd.length < 8) {
    errors.newPwd = 'Mật khẩu mới phải có ít nhất 8 ký tự.'; ok = false
  } else if (form.newPwd === form.current) {
    errors.newPwd = 'Mật khẩu mới phải khác mật khẩu hiện tại.'; ok = false
  }
  if (!form.confirm) {
    errors.confirm = 'Vui lòng xác nhận mật khẩu mới.'; ok = false
  } else if (form.newPwd !== form.confirm) {
    errors.confirm = 'Xác nhận mật khẩu không khớp.'; ok = false
  }

  return ok
}

const shake = () => {
  isShaking.value = true
  setTimeout(() => { isShaking.value = false }, 600)
}

// ===== SUCCESS COUNTDOWN =====
const REDIRECT_SECONDS = 3
const redirectCountdown = ref(REDIRECT_SECONDS)
const redirectProgress  = computed(() => {
  const pct = (redirectCountdown.value / REDIRECT_SECONDS) * 100
  return `${pct}%`
})

let redirectTimer: ReturnType<typeof setInterval> | null = null

const startRedirect = () => {
  redirectCountdown.value = REDIRECT_SECONDS
  redirectTimer = setInterval(() => {
    redirectCountdown.value--
    if (redirectCountdown.value <= 0) {
      clearInterval(redirectTimer!)
      redirectTimer = null
      router.push(ROUTES.HOME)
    }
  }, 1000)
}

onBeforeUnmount(() => {
  if (redirectTimer) clearInterval(redirectTimer)
})

// ===== SUBMIT =====
const handleSubmit = async () => {
  if (!validate()) { shake(); return }

  loading.value = true
  await new Promise(r => setTimeout(r, 1800))
  loading.value = false

  showSuccess.value = true
  toast.add({ severity: 'success', summary: 'Thành công!', detail: 'Mật khẩu của bạn đã được thay đổi.', life: 5000 })
  startRedirect()
}

const resetForm = () => {
  form.current = form.newPwd = form.confirm = ''
  errors.current = errors.newPwd = errors.confirm = ''
}
</script>

<style scoped>
/* ========================================
   PAGE WRAPPER
   ======================================== */
.cp-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2.5rem 1rem 4rem;
  background: linear-gradient(160deg, #f9fafb 0%, #ffffff 100%);
  font-family: 'Inter', sans-serif;
}

/* ========================================
   BREADCRUMB
   ======================================== */
.breadcrumb {
  display: flex; align-items: center; gap: 0.375rem;
  width: 100%; max-width: 520px;
  font-size: 0.8rem;
  margin-bottom: 1.25rem;
}
.bc-link   { color: #f97316; font-weight: 600; text-decoration: none; }
.bc-link:hover { text-decoration: underline; }
.bc-dim    { color: #6b7280; font-weight: 500; }
.bc-sep    { font-size: 0.6rem; color: #d1d5db; }
.bc-current { color: #374151; font-weight: 700; }

/* ========================================
   CARD
   ======================================== */
.cp-card {
  width: 100%; max-width: 520px;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
  padding: 2rem 1.75rem 2.5rem;
  position: relative;
  overflow: hidden;
  animation: cardMount 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@media (min-width: 540px) { .cp-card { padding: 2.5rem; } }

@keyframes cardMount {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* Shake */
.shake { animation: shakeCard 0.55s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes shakeCard {
  10%, 90%  { transform: translateX(-3px); }
  20%, 80%  { transform: translateX(5px); }
  30%, 50%, 70% { transform: translateX(-6px); }
  40%, 60%  { transform: translateX(6px); }
}

/* ========================================
   CARD HEADER
   ======================================== */
.card-header {
  display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;
}
.card-icon {
  width: 3.25rem; height: 3.25rem;
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  border: 1.5px solid #fed7aa;
  border-radius: 0.875rem;
  display: flex; align-items: center; justify-content: center;
  color: #f97316; font-size: 1.25rem;
  flex-shrink: 0;
}
.card-title { font-size: 1.375rem; font-weight: 900; color: #111827; margin: 0 0 0.125rem 0; }
.card-sub   { font-size: 0.825rem; color: #9ca3af; margin: 0; }

/* ========================================
   FORM FIELDS
   ======================================== */
.field-group  { margin-bottom: 1.25rem; }
.field-label  { display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.4rem; }
.req          { color: #ef4444; }
.field-error  { display: block; font-size: 0.75rem; color: #ef4444; margin-top: 0.3rem; }

.input-wrap {
  position: relative;
}

/* Match state — override PrimeVue border */
.matched :deep(.p-password input) {
  border-color: #16a34a !important;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.12) !important;
}
.mismatched :deep(.p-password input) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important;
}

.match-badge {
  position: absolute; right: 2.75rem; top: 50%;
  transform: translateY(-50%);
  width: 1.25rem; height: 1.25rem;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 0.625rem; font-weight: 700; z-index: 10;
  animation: badgePop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.match-ok   { background: #16a34a; color: white; }
.match-fail { background: #ef4444; color: white; }

@keyframes badgePop {
  from { transform: translateY(-50%) scale(0.4); }
  to   { transform: translateY(-50%) scale(1); }
}

.input-icon {
  position: absolute; top: 0; bottom: 0; left: 0.875rem;
  display: flex; align-items: center;
  color: #9ca3af; font-size: 0.875rem; z-index: 10;
  pointer-events: none;
}

:deep(.p-password)       { width: 100%; }
:deep(.p-password input) {
  width: 100% !important;
  padding-left: 2.75rem !important;
  border-radius: 12px !important;
  border-color: #e5e7eb !important;
  font-size: 0.875rem; height: 44px;
  transition: border-color 0.25s, box-shadow 0.25s;
}
:deep(.p-password input:focus) {
  border-color: #f97316 !important;
  box-shadow: 0 0 0 3px rgba(249,115,22,0.15) !important;
  outline: none !important;
}

/* ========================================
   STRENGTH METER
   ======================================== */
.strength-wrap { margin-top: 0.625rem; }
.strength-bar-row {
  display: flex; gap: 4px; margin-bottom: 0.375rem;
}
.strength-seg {
  flex: 1; height: 5px; border-radius: 9999px;
  background: #e5e7eb;
  transition: background 0.4s ease;
}
.strength-seg.active { /* bg set via :style */ }
.strength-label {
  font-size: 0.72rem; font-weight: 700;
  transition: color 0.3s;
}

/* ========================================
   CHECKLIST
   ======================================== */
.checklist {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem;
  margin-top: 0.625rem;
  background: #fafafa; border: 1px solid #f3f4f6;
  border-radius: 12px; padding: 0.875rem;
}

.rule-item {
  display: flex; align-items: center; gap: 0.375rem;
  font-size: 0.75rem; color: #9ca3af;
  transition: color 0.3s;
}
.rule-item.met { color: #16a34a; }

.rule-icon { display: flex; align-items: center; font-size: 0.8rem; }
.rule-item.met .rule-icon { animation: rulePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

@keyframes rulePop {
  from { transform: scale(0.5); }
  to   { transform: scale(1); }
}

/* ========================================
   TIP BOX
   ======================================== */
.tip-box {
  display: flex; align-items: flex-start; gap: 0.5rem;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  border-radius: 10px; padding: 0.75rem;
  font-size: 0.8rem; color: #166534; margin-bottom: 1.5rem;
}
.tip-icon { color: #16a34a; margin-top: 0.1rem; flex-shrink: 0; }

/* ========================================
   BUTTONS
   ======================================== */
.btn-row {
  display: flex; gap: 0.75rem; align-items: center;
}

.btn-primary {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.875rem;
  border: none; border-radius: 12px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white; font-weight: 700; font-size: 0.9375rem;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(249,115,22,0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 8px 26px rgba(249,115,22,0.5);
}
.btn-primary:active:not(:disabled) { transform: scale(0.97); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; transform: none; }

.btn-cancel {
  padding: 0.875rem 1.25rem;
  border: none; background: none;
  font-size: 0.9rem; font-weight: 600; color: #6b7280; cursor: pointer;
  border-radius: 12px;
  transition: background 0.2s, color 0.2s;
}
.btn-cancel:hover { background: #f3f4f6; color: #374151; }

.spinner {
  width: 1rem; height: 1rem; flex-shrink: 0;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ========================================
   SUCCESS OVERLAY
   ======================================== */
.success-overlay {
  position: absolute; inset: 0; z-index: 20;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  border-radius: 1.5rem;
}

.success-inner { text-align: center; padding: 2rem; }

.success-svg { width: 6rem; height: 6rem; margin: 0 auto 1.25rem; }

.succ-circle {
  animation: drawCircle 0.6s ease-out 0.1s forwards;
}
.succ-check {
  animation: drawCheck 0.45s ease-out 0.65s forwards;
}

@keyframes drawCircle {
  from { stroke-dashoffset: 252; }
  to   { stroke-dashoffset: 0; }
}
@keyframes drawCheck {
  from { stroke-dashoffset: 55; }
  to   { stroke-dashoffset: 0; }
}

.succ-title { font-size: 1.4rem; font-weight: 900; color: #16a34a; margin: 0 0 0.5rem 0; }
.succ-sub   { font-size: 0.875rem; color: #6b7280; margin: 0 0 1.25rem 0; }

.redirect-track {
  width: 100%; height: 5px; background: #dcfce7; border-radius: 9999px; overflow: hidden;
}
.redirect-fill {
  height: 100%; background: #16a34a; border-radius: 9999px;
  transition: width 1s linear;
}

/* Overlay transition */
.overlay-fade-enter-active { transition: opacity 0.4s ease; }
.overlay-fade-leave-active { transition: opacity 0.3s ease; }
.overlay-fade-enter-from, .overlay-fade-leave-to { opacity: 0; }

/* ========================================
   DIVIDER
   ======================================== */
:deep(.p-divider::before) { border-color: #f3f4f6; }

/* Utilities */
.w-full { width: 100%; }
</style>
