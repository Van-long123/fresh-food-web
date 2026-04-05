<template>
  <div class="login-page">
    <Toast position="top-right" />

    <!-- ===== LEFT BRAND PANEL ===== -->
    <div class="brand-panel">
      <!-- Animated background gradient -->
      <div class="gradient-bg" />

      <!-- SVG food pattern overlay -->
      <div class="pattern-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="food-pattern"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <text x="10" y="30" font-size="22">🍎</text>
              <text x="45" y="65" font-size="20">🥕</text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#food-pattern)" />
        </svg>
      </div>

      <!-- Floating fruit decorations -->
      <span class="float-el float-1">🍊</span>
      <span class="float-el float-2">🥦</span>
      <span class="float-el float-3">🍋</span>
      <span class="float-el float-4">🍇</span>
      <span class="float-el float-5">🌿</span>

      <!-- Brand content -->
      <div class="brand-content">
        <!-- Logo -->
        <NuxtLink to="/">
          <div class="logo-wrap">
            <div class="logo-box">
              <svg
                viewBox="0 0 48 48"
                class="logo-svg"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 4 C20 4 17 7 18 10 C22 9 28 9 30 10 C31 7 28 4 24 4Z"
                  fill="#86efac"
                />
                <path
                  d="M22 10 L24 4 L26 10"
                  stroke="#86efac"
                  stroke-width="1.5"
                  fill="none"
                />
                <path
                  d="M30 16 C30 13 27 11 24 11 C21 11 17 12.5 17 16 C17 19 20 20.5 24 21.5 C28 22.5 31 24 31 27.5 C31 31 27.5 33 24 33 C20.5 33 17 31 17 27.5"
                  stroke="white"
                  stroke-width="3.5"
                  stroke-linecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <h1 class="brand-name">SMARTFOOD</h1>
            <div class="brand-divider" />
          </div>
        </NuxtLink>

        <!-- Tagline -->
        <p class="tagline">
          Mua sắm thông minh<br />
          <strong>Sống khỏe mỗi ngày</strong>
        </p>

        <!-- Benefit bullets -->
        <div class="benefits">
          <div
            v-for="benefit in benefits"
            :key="benefit.text"
            class="benefit-item"
          >
            <div class="benefit-icon">{{ benefit.icon }}</div>
            <span>{{ benefit.text }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== RIGHT FORM PANEL ===== -->
    <div class="form-panel">
      <div class="form-deco-top" />
      <div class="form-deco-bottom" />

      <div class="form-container">
        <!-- Mobile logo -->
        <div class="mobile-logo">
          <div class="mobile-logo-icon">S</div>
          <span class="mobile-logo-text"
            >SMART<span class="text-orange">FOOD</span></span
          >
        </div>

        <!-- Greeting -->
        <div class="field-item" style="--delay: 0ms">
          <p class="greeting-sub">Chào mừng trở lại! 👋</p>
          <h2 class="greeting-title">Đăng nhập</h2>
          <p class="greeting-desc">
            Nhập thông tin đăng nhập để tiếp tục mua sắm
          </p>
        </div>

        <form novalidate @submit.prevent="handleSubmit">
          <!-- Email -->
          <div class="field-item mb-5" style="--delay: 100ms">
            <label for="email" class="field-label">
              Email <span class="required">*</span>
            </label>
            <div class="input-wrap">
              <span class="input-icon"><i class="pi pi-envelope" /></span>
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                autocomplete="email"
                :invalid="!!errors.email"
                class="prime-input"
                aria-label="Email"
                aria-required="true"
              />
            </div>
            <InlineMessage
              v-if="errors.email"
              severity="error"
              class="field-error"
            >
              {{ errors.email }}
            </InlineMessage>
          </div>

          <!-- Password -->
          <div class="field-item mb-5" style="--delay: 200ms">
            <div class="label-row">
              <label for="password" class="field-label">
                Mật khẩu <span class="required">*</span>
              </label>
              <NuxtLink to="/auth/forgot-password" class="forgot-link"
                >Quên mật khẩu?</NuxtLink
              >
            </div>
            <div class="input-wrap">
              <span class="input-icon"><i class="pi pi-lock" /></span>
              <Password
                id="password"
                v-model="form.password"
                :feedback="false"
                :toggle-mask="true"
                placeholder="••••••••"
                autocomplete="current-password"
                :invalid="!!errors.password"
                input-class="prime-input"
                class="w-full"
                aria-label="Mật khẩu"
                aria-required="true"
              />
            </div>
            <InlineMessage
              v-if="errors.password"
              severity="error"
              class="field-error"
            >
              {{ errors.password }}
            </InlineMessage>
          </div>

          <!-- Remember me -->
          <div class="field-item remember-row" style="--delay: 300ms">
            <Checkbox
              v-model="form.remember"
              input-id="remember"
              :binary="true"
            />
            <label for="remember" class="remember-label"
              >Ghi nhớ đăng nhập trong 30 ngày</label
            >
          </div>

          <!-- Submit -->
          <div class="field-item mt-5" style="--delay: 400ms">
            <button type="submit" :disabled="loading" class="login-btn">
              <svg
                v-if="loading"
                class="spinner"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <i v-else class="pi pi-sign-in" />
              {{ loading ? "Đang xử lý..." : "Đăng nhập" }}
            </button>
          </div>
        </form>

        <!-- Divider -->
        <div class="field-item" style="--delay: 500ms">
          <Divider
            ><span class="divider-text">hoặc đăng nhập với</span></Divider
          >
        </div>

        <!-- Social buttons -->
        <div class="field-item social-row" style="--delay: 600ms">
          <button type="button" class="social-btn google-btn">
            <svg class="social-icon" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button type="button" class="social-btn facebook-btn">
            <svg class="social-icon" viewBox="0 0 24 24" fill="#1877F2">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            Facebook
          </button>
        </div>

        <!-- Register link -->
        <p class="field-item register-link-text" style="--delay: 700ms">
          Chưa có tài khoản?
          <NuxtLink to="/auth/register" class="register-link"
            >Đăng ký ngay →</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useToast } from "primevue/usetoast";

definePageMeta({ layout: false });

const toast = useToast();
const loading = ref<boolean>(false);

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface FormErrors {
  email: string;
  password: string;
}

const form = reactive<LoginForm>({ email: "", password: "", remember: false });
const errors = reactive<FormErrors>({ email: "", password: "" });

const benefits = [
  { icon: "🛒", text: "1.000+ sản phẩm tươi ngon mỗi ngày" },
  { icon: "🚀", text: "Giao hàng tận nhà trong 2 giờ" },
  { icon: "💳", text: "Thanh toán an toàn, bảo mật tuyệt đối" },
];

const validate = (): boolean => {
  errors.email = "";
  errors.password = "";
  let valid = true;
  if (!form.email) {
    errors.email = "Email là bắt buộc.";
    valid = false;
  } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(form.email)) {
    errors.email = "Email không đúng định dạng.";
    valid = false;
  }
  if (!form.password) {
    errors.password = "Mật khẩu là bắt buộc.";
    valid = false;
  } else if (form.password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    valid = false;
  }
  return valid;
};

const handleSubmit = async (): Promise<void> => {
  if (!validate()) return;
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1500));
  loading.value = false;
  toast.add({
    severity: "success",
    summary: "Thành công",
    detail: "Đăng nhập thành công!",
    life: 3000,
  });
};
</script>

<style scoped>
/* ========================================
   ROOT LAYOUT
   ======================================== */
.login-page {
  display: flex;
  min-height: 100dvh;
  width: 100%;
  font-family: "Inter", sans-serif;
}

/* ========================================
   LEFT BRAND PANEL
   ======================================== */
.brand-panel {
  display: none;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .brand-panel {
    display: flex;
    width: 40%;
  }
}

.gradient-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 55%, #c2410c 100%);
  animation: gradientShift 8s ease infinite alternate;
}

@keyframes gradientShift {
  0% {
    filter: hue-rotate(0deg) brightness(1);
  }
  100% {
    filter: hue-rotate(18deg) brightness(1.06);
  }
}

.pattern-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.08;
}

/* Floating emojis */
.float-el {
  position: absolute;
  font-size: 2rem;
  user-select: none;
  pointer-events: none;
  animation: floatBob 3s ease-in-out infinite;
}
.float-1 {
  top: 4rem;
  left: 2.5rem;
  font-size: 2.5rem;
  animation-delay: 0s;
  animation-duration: 3.2s;
}
.float-2 {
  top: 8rem;
  right: 3rem;
  font-size: 2rem;
  animation-delay: 0.8s;
  animation-duration: 4s;
}
.float-3 {
  bottom: 8rem;
  left: 4rem;
  font-size: 2rem;
  animation-delay: 1.5s;
  animation-duration: 3.5s;
}
.float-4 {
  bottom: 5rem;
  right: 2.5rem;
  font-size: 2.5rem;
  animation-delay: 0.4s;
  animation-duration: 4.5s;
}
.float-5 {
  top: 50%;
  left: 1.5rem;
  font-size: 1.5rem;
  animation-delay: 2s;
  animation-duration: 3.8s;
}

@keyframes floatBob {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-14px) rotate(6deg);
  }
}

/* Brand content */
.brand-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  padding: 0 2.5rem;
}

.logo-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.logo-box {
  width: 5rem;
  height: 5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  ring: 2px solid rgba(255, 255, 255, 0.3);
}

.logo-svg {
  width: 3rem;
  height: 3rem;
}
.brand-name {
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  margin: 0;
}
.brand-divider {
  width: 4rem;
  height: 3px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 9999px;
  margin-top: 0.75rem;
}

.tagline {
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
}
.tagline strong {
  color: white;
}

.benefits {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}
.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
}
.benefit-icon {
  width: 2.25rem;
  height: 2.25rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  backdrop-filter: blur(4px);
}
.benefit-item span {
  font-size: 0.875rem;
  font-weight: 500;
}

/* ========================================
   RIGHT FORM PANEL
   ======================================== */
.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 3rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.form-deco-top {
  position: absolute;
  top: 0;
  right: 0;
  width: 16rem;
  height: 16rem;
  background: #fff7ed;
  border-radius: 50%;
  transform: translate(50%, -50%);
  pointer-events: none;
}
.form-deco-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 12rem;
  height: 12rem;
  background: #f0fdf4;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  pointer-events: none;
}

.form-container {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 10;
  animation: slideInRight 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Stagger fields */
.field-item {
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--delay, 0ms);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile logo */
.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
@media (min-width: 768px) {
  .mobile-logo {
    display: none;
  }
}

.mobile-logo-icon {
  width: 2.25rem;
  height: 2.25rem;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 900;
  font-size: 1.125rem;
  box-shadow: 0 4px 10px rgba(249, 115, 22, 0.3);
}
.mobile-logo-text {
  font-size: 1.125rem;
  font-weight: 900;
  color: #111827;
}
.text-orange {
  color: #f97316;
}

/* Greeting */
.greeting-sub {
  color: #f97316;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.375rem;
}
.greeting-title {
  font-size: 1.875rem;
  font-weight: 900;
  color: #111827;
  margin: 0 0 0.375rem 0;
}
.greeting-desc {
  color: #9ca3af;
  font-size: 0.875rem;
  margin-bottom: 2rem;
}

/* Labels */
.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.375rem;
}
.required {
  color: #ef4444;
}
.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.375rem;
}
.forgot-link {
  font-size: 0.75rem;
  font-weight: 600;
  color: #f97316;
  text-decoration: none;
}
.forgot-link:hover {
  color: #ea580c;
  text-decoration: underline;
}

/* Inputs */
.input-wrap {
  position: relative;
}
.input-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0.875rem;
  display: flex;
  align-items: center;
  color: #9ca3af;
  font-size: 0.875rem;
  z-index: 10;
  pointer-events: none;
}

:deep(.prime-input),
:deep(.p-inputtext) {
  width: 100%;
  padding-left: 2.75rem !important;
  border-radius: 12px !important;
  border-color: #e5e7eb !important;
  font-size: 0.9rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
:deep(.prime-input:focus),
:deep(.p-inputtext:focus) {
  border-color: #f97316 !important;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15) !important;
  outline: none !important;
}
:deep(.p-password) {
  width: 100%;
}
:deep(.p-password input) {
  width: 100%;
  padding-left: 2.75rem !important;
  border-radius: 12px !important;
  border-color: #e5e7eb !important;
  font-size: 0.9rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
:deep(.p-password input:focus) {
  border-color: #f97316 !important;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15) !important;
  outline: none !important;
}

/* Remember me */
.remember-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0;
}
.remember-label {
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  user-select: none;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: #f97316 !important;
  border-color: #f97316 !important;
}
:deep(.p-checkbox .p-checkbox-box:focus) {
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2) !important;
}

/* Submit button */
.login-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.login-btn:not(:disabled):hover {
  transform: scale(1.025);
  box-shadow: 0 8px 28px rgba(249, 115, 22, 0.55);
}
.login-btn:not(:disabled):active {
  transform: scale(0.97);
}
.login-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.spinner {
  width: 1rem;
  height: 1rem;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Divider */
:deep(.p-divider-content) {
  background: white;
}
:deep(.p-divider::before) {
  border-color: #e5e7eb;
}
.divider-text {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
  padding: 0 0.5rem;
}

/* Social */
.social-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.15s,
    box-shadow 0.15s,
    border-color 0.15s,
    background 0.15s;
}
.social-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}
.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.social-btn:active {
  transform: translateY(0);
}
.google-btn:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}
.facebook-btn:hover {
  border-color: #bfdbfe;
  background: #eff6ff;
}

/* Register link */
.register-link-text {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}
.register-link {
  font-weight: 700;
  color: #f97316;
  text-decoration: none;
  margin-left: 0.25rem;
}
.register-link:hover {
  color: #ea580c;
  text-decoration: underline;
}

/* Error messages */
.field-error {
  font-size: 0.75rem;
  margin-top: 0.375rem;
  width: 100%;
  justify-content: flex-start;
}
:deep(.p-inlinemessage) {
  padding: 0.25rem 0.625rem;
  border-radius: 8px;
  font-size: 0.75rem;
}

/* mb utility */
.mb-5 {
  margin-bottom: 1.25rem;
}
.mt-5 {
  margin-top: 1.25rem;
}
.w-full {
  width: 100%;
}
</style>
