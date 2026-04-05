<template>
  <div class="register-page">
    <Toast position="top-right" />

    <!-- Confetti particles -->
    <Teleport to="body">
      <div v-if="showConfetti" class="confetti-container" aria-hidden="true">
        <div
          v-for="i in 60"
          :key="i"
          class="confetti-piece"
          :style="getConfettiStyle(i)"
        />
      </div>
    </Teleport>

    <!-- ===== LEFT FORM PANEL ===== -->
    <div class="form-panel">
      <div class="form-deco-top-left" />
      <div class="form-deco-bottom-right" />

      <div class="form-container">
        <!-- Mobile logo -->
        <div class="mobile-logo">
          <div class="mobile-logo-icon">S</div>
          <span class="mobile-logo-text"
            >SMART<span class="text-orange">FOOD</span></span
          >
        </div>

        <!-- Heading -->
        <div class="form-heading">
          <p class="heading-sub">Bắt đầu ngay hôm nay 🌟</p>
          <h2 class="heading-title">Tạo tài khoản</h2>
          <p class="heading-desc">Chỉ mất 1 phút để tham gia SmartFood</p>
        </div>

        <!-- ===== CUSTOM STEPPER ===== -->
        <div class="stepper" aria-label="Các bước đăng ký">
          <template v-for="(s, i) in steps" :key="s.label">
            <!-- Step circle -->
            <div
              class="step-item"
              :class="{
                'step-done': currentStep > i + 1,
                'step-active': currentStep === i + 1,
              }"
            >
              <div class="step-circle">
                <svg
                  v-if="currentStep > i + 1"
                  viewBox="0 0 16 16"
                  class="step-check"
                  fill="none"
                >
                  <path
                    d="M3 8l3.5 3.5L13 5"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span class="step-label">{{ s.label }}</span>
            </div>

            <!-- Connector line (not after last) -->
            <div v-if="i < steps.length - 1" class="step-line">
              <div
                class="step-line-fill"
                :class="{ filled: currentStep > i + 1 }"
              />
            </div>
          </template>
        </div>

        <!-- ===== STEP CONTENT ===== -->
        <div class="steps-wrapper" :class="{ shake: isShaking }">
          <!-- STEP 1: Basic Info -->
          <Transition :name="transitionName" mode="out-in">
            <div v-if="currentStep === 1" key="step1" class="step-content">
              <p class="step-title">📋 Thông tin cơ bản</p>

              <!-- Full Name -->
              <div class="field-group">
                <label class="field-label"
                  >Họ và tên <span class="req">*</span></label
                >
                <div class="input-wrap">
                  <span class="input-icon"><i class="pi pi-user" /></span>
                  <InputText
                    v-model="form.name"
                    placeholder="Nguyễn Văn A"
                    :invalid="!!step1Errors.name"
                    class="prime-input"
                    aria-label="Họ và tên"
                  />
                </div>
                <small v-if="step1Errors.name" class="field-error">{{
                  step1Errors.name
                }}</small>
              </div>

              <!-- Email -->
              <div class="field-group">
                <label class="field-label"
                  >Email <span class="req">*</span></label
                >
                <div class="input-wrap">
                  <span class="input-icon"><i class="pi pi-envelope" /></span>
                  <InputText
                    v-model="form.email"
                    type="email"
                    placeholder="your@email.com"
                    :invalid="!!step1Errors.email"
                    class="prime-input"
                    aria-label="Email"
                  />
                </div>
                <small v-if="step1Errors.email" class="field-error">{{
                  step1Errors.email
                }}</small>
              </div>

              <!-- Phone -->
              <div class="field-group">
                <label class="field-label"
                  >Số điện thoại <span class="req">*</span></label
                >
                <div class="input-wrap phone-wrap">
                  <div class="phone-prefix">
                    <span class="flag">🇻🇳</span>
                    <span>+84</span>
                  </div>
                  <InputText
                    v-model="form.phone"
                    type="tel"
                    placeholder="9x xxx xxxx"
                    :invalid="!!step1Errors.phone"
                    class="prime-input phone-input"
                    aria-label="Số điện thoại"
                  />
                </div>
                <small v-if="step1Errors.phone" class="field-error">{{
                  step1Errors.phone
                }}</small>
              </div>

              <button class="btn-primary" @click="goNext(1)">
                Tiếp theo <i class="pi pi-arrow-right" />
              </button>
            </div>
          </Transition>

          <!-- STEP 2: Security -->
          <Transition :name="transitionName" mode="out-in">
            <div v-if="currentStep === 2" key="step2" class="step-content">
              <p class="step-title">🔐 Bảo mật tài khoản</p>

              <!-- Password -->
              <div class="field-group">
                <label class="field-label"
                  >Mật khẩu <span class="req">*</span></label
                >
                <div class="input-wrap">
                  <span class="input-icon"><i class="pi pi-lock" /></span>
                  <Password
                    v-model="form.password"
                    :feedback="false"
                    :toggle-mask="true"
                    placeholder="Ít nhất 8 ký tự"
                    :invalid="!!step2Errors.password"
                    input-class="prime-input"
                    class="w-full"
                    aria-label="Mật khẩu"
                    @update:model-value="updateStrength"
                  />
                </div>

                <!-- Strength meter -->
                <div v-if="form.password" class="strength-meter">
                  <div class="strength-bar-track">
                    <div
                      class="strength-bar-fill"
                      :style="{
                        width: strengthWidth,
                        background: strengthColor,
                      }"
                    />
                  </div>
                  <span
                    class="strength-label"
                    :style="{ color: strengthColor }"
                    >{{ strengthLabel }}</span
                  >
                </div>

                <small v-if="step2Errors.password" class="field-error">{{
                  step2Errors.password
                }}</small>
              </div>

              <!-- Confirm Password -->
              <div class="field-group">
                <label class="field-label"
                  >Xác nhận mật khẩu <span class="req">*</span></label
                >
                <div class="input-wrap">
                  <span class="input-icon"><i class="pi pi-lock" /></span>
                  <Password
                    v-model="form.confirmPassword"
                    :feedback="false"
                    :toggle-mask="true"
                    placeholder="Nhập lại mật khẩu"
                    :invalid="!!step2Errors.confirmPassword"
                    input-class="prime-input"
                    class="w-full"
                    aria-label="Xác nhận mật khẩu"
                  />
                </div>
                <small v-if="step2Errors.confirmPassword" class="field-error">{{
                  step2Errors.confirmPassword
                }}</small>
              </div>

              <!-- Password rules hint -->
              <div class="rules-box">
                <div
                  v-for="rule in passwordRules"
                  :key="rule.label"
                  class="rule-item"
                  :class="{ met: rule.met }"
                >
                  <i
                    :class="rule.met ? 'pi pi-check-circle' : 'pi pi-circle'"
                  />
                  {{ rule.label }}
                </div>
              </div>

              <div class="btn-row">
                <button class="btn-outline" @click="goBack">
                  <i class="pi pi-arrow-left" /> Quay lại
                </button>
                <button class="btn-primary flex-1" @click="goNext(2)">
                  Tiếp theo <i class="pi pi-arrow-right" />
                </button>
              </div>
            </div>
          </Transition>

          <!-- STEP 3: Confirm -->
          <Transition :name="transitionName" mode="out-in">
            <div v-if="currentStep === 3" key="step3" class="step-content">
              <p class="step-title">✅ Xác nhận thông tin</p>

              <!-- Info review card -->
              <div class="review-card">
                <div class="review-avatar">
                  {{ form.name.charAt(0).toUpperCase() || "?" }}
                </div>
                <div class="review-info">
                  <div class="review-name">{{ form.name }}</div>
                  <div class="review-detail">
                    <i class="pi pi-envelope" /> {{ form.email }}
                  </div>
                  <div class="review-detail">
                    <i class="pi pi-phone" /> +84 {{ form.phone }}
                  </div>
                </div>
                <button
                  class="review-edit"
                  @click="currentStep = 1"
                  title="Chỉnh sửa"
                >
                  <i class="pi pi-pencil" />
                </button>
              </div>

              <!-- Agreements -->
              <div class="field-group">
                <div class="checkbox-row">
                  <Checkbox
                    v-model="form.agreeTerms"
                    input-id="terms"
                    :binary="true"
                    :invalid="!!step3Errors.agreeTerms"
                  />
                  <label for="terms" class="checkbox-label">
                    Tôi đồng ý với
                    <NuxtLink :to="ROUTES.TERMS_OF_SERVICE" class="terms-link"
                      >Điều khoản dịch vụ</NuxtLink
                    >
                    và
                    <NuxtLink :to="ROUTES.PRIVACY_POLICY" class="terms-link"
                      >Chính sách bảo mật</NuxtLink
                    >
                    <span class="req"> *</span>
                  </label>
                </div>
                <small v-if="step3Errors.agreeTerms" class="field-error ml-7">{{
                  step3Errors.agreeTerms
                }}</small>
              </div>

              <div class="field-group">
                <div class="checkbox-row">
                  <Checkbox
                    v-model="form.agreePromo"
                    input-id="promo"
                    :binary="true"
                  />
                  <label for="promo" class="checkbox-label"
                    >Nhận thông báo khuyến mãi qua email</label
                  >
                </div>
              </div>

              <div class="btn-row">
                <button class="btn-outline" @click="goBack">
                  <i class="pi pi-arrow-left" /> Quay lại
                </button>
                <button
                  class="btn-primary btn-finish flex-1"
                  :disabled="loading"
                  @click="handleSubmit"
                >
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
                  <i v-else class="pi pi-check" />
                  {{ loading ? "Đang xử lý..." : "Hoàn tất đăng ký" }}
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Login link -->
        <p class="login-link-text">
          Đã có tài khoản?
          <NuxtLink :to="ROUTES.AUTH.LOGIN" class="login-link"
            >Đăng nhập →</NuxtLink
          >
        </p>
      </div>
    </div>

    <!-- ===== RIGHT BRAND PANEL ===== -->
    <div class="brand-panel">
      <div class="gradient-bg" />
      <div class="pattern-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="reg-pattern"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <text x="10" y="30" font-size="22">🥗</text>
              <text x="45" y="65" font-size="20">🍓</text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#reg-pattern)" />
        </svg>
      </div>

      <span class="float-el float-1">🍊</span>
      <span class="float-el float-2">🥑</span>
      <span class="float-el float-3">🍓</span>
      <span class="float-el float-4">🌽</span>
      <span class="float-el float-5">🥝</span>

      <div class="brand-content">
        <!-- Logo -->
        <NuxtLink :to="ROUTES.HOME">
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

        <p class="tagline">
          Tươi ngon mỗi ngày<br /><strong>Đặt hàng siêu tốc</strong>
        </p>

        <!-- Step progress illustration -->
        <div class="brand-steps">
          <div
            v-for="(s, i) in steps"
            :key="s.label"
            class="brand-step"
            :class="{ active: currentStep > i }"
          >
            <div class="brand-step-icon">{{ s.icon }}</div>
            <div class="brand-step-text">
              <div class="brand-step-title">{{ s.brandTitle }}</div>
              <div class="brand-step-desc">{{ s.brandDesc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { ROUTES } from "~/constants/routes";

definePageMeta({ layout: false });

const toast = useToast();
const loading = ref(false);
const showConfetti = ref(false);
const currentStep = ref(1);
const isShaking = ref(false);
const transitionName = ref("slide-forward");

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  agreePromo: boolean;
}

const form = reactive<RegisterForm>({
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
  agreePromo: false,
});

const step1Errors = reactive({ name: "", email: "", phone: "" });
const step2Errors = reactive({ password: "", confirmPassword: "" });
const step3Errors = reactive({ agreeTerms: "" });

const steps = [
  {
    label: "Thông tin",
    icon: "📋",
    brandTitle: "Thông tin cơ bản",
    brandDesc: "Tên, email và số điện thoại",
  },
  {
    label: "Bảo mật",
    icon: "🔐",
    brandTitle: "Thiết lập bảo mật",
    brandDesc: "Mật khẩu mạnh, an toàn",
  },
  {
    label: "Xác nhận",
    icon: "✅",
    brandTitle: "Xác nhận & Hoàn tất",
    brandDesc: "Kiểm tra rồi đăng ký",
  },
];

// ===== PASSWORD STRENGTH =====
const strengthScore = ref(0);

const updateStrength = (val: string) => {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  strengthScore.value = score;
};

const strengthWidth = computed(
  () => ["0%", "25%", "50%", "75%", "100%"][strengthScore.value],
);
const strengthColor = computed(
  () =>
    ["#ef4444", "#ef4444", "#f59e0b", "#22c55e", "#16a34a"][
      strengthScore.value
    ],
);
const strengthLabel = computed(
  () => ["", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"][strengthScore.value],
);

const passwordRules = computed(() => [
  { label: "Ít nhất 8 ký tự", met: form.password.length >= 8 },
  { label: "Chứa ít nhất 1 chữ hoa", met: /[A-Z]/.test(form.password) },
  { label: "Chứa ít nhất 1 số", met: /[0-9]/.test(form.password) },
  { label: "Ký tự đặc biệt (!@#...)", met: /[^A-Za-z0-9]/.test(form.password) },
]);

// ===== VALIDATION =====
const shake = () => {
  isShaking.value = true;
  setTimeout(() => {
    isShaking.value = false;
  }, 600);
};

const validateStep1 = (): boolean => {
  step1Errors.name = step1Errors.email = step1Errors.phone = "";
  let ok = true;
  if (!form.name.trim()) {
    step1Errors.name = "Vui lòng nhập họ và tên.";
    ok = false;
  }
  if (!form.email) {
    step1Errors.email = "Email là bắt buộc.";
    ok = false;
  } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(form.email)) {
    step1Errors.email = "Email không đúng định dạng.";
    ok = false;
  }
  if (!form.phone.trim()) {
    step1Errors.phone = "Vui lòng nhập số điện thoại.";
    ok = false;
  } else if (!/^[0-9]{8,10}$/.test(form.phone.replace(/\s/g, ""))) {
    step1Errors.phone = "Số điện thoại không hợp lệ.";
    ok = false;
  }
  return ok;
};

const validateStep2 = (): boolean => {
  step2Errors.password = step2Errors.confirmPassword = "";
  let ok = true;
  if (!form.password) {
    step2Errors.password = "Mật khẩu là bắt buộc.";
    ok = false;
  } else if (form.password.length < 8) {
    step2Errors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    ok = false;
  }
  if (!form.confirmPassword) {
    step2Errors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    ok = false;
  } else if (form.password !== form.confirmPassword) {
    step2Errors.confirmPassword = "Mật khẩu không khớp.";
    ok = false;
  }
  return ok;
};

const validateStep3 = (): boolean => {
  step3Errors.agreeTerms = "";
  if (!form.agreeTerms) {
    step3Errors.agreeTerms = "Bạn phải đồng ý với điều khoản để tiếp tục.";
    return false;
  }
  return true;
};

// ===== NAVIGATION =====
const goNext = (step: number) => {
  const valid = step === 1 ? validateStep1() : validateStep2();
  if (!valid) {
    shake();
    return;
  }
  transitionName.value = "slide-forward";
  currentStep.value++;
};

const goBack = () => {
  transitionName.value = "slide-back";
  currentStep.value--;
};

// ===== CONFETTI =====
const confettiColors = [
  "#f97316",
  "#ea580c",
  "#22c55e",
  "#16a34a",
  "#fbbf24",
  "#60a5fa",
  "#f472b6",
];

const getConfettiStyle = (i: number): Record<string, string> => {
  const color = confettiColors[(i - 1) % confettiColors.length];
  const left = `${Math.random() * 100}%`;
  const delay = `${Math.random() * 2}s`;
  const duration = `${2.5 + Math.random() * 2}s`;
  const size = `${6 + Math.floor(Math.random() * 8)}px`;
  return {
    background: color ?? "",
    left,
    animationDelay: delay,
    animationDuration: duration,
    width: size,
    height: size,
  };
};

const fireConfetti = () => {
  showConfetti.value = true;
  setTimeout(() => {
    showConfetti.value = false;
  }, 4000);
};

// ===== SUBMIT =====
const handleSubmit = async () => {
  if (!validateStep3()) {
    shake();
    return;
  }
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1800));
  loading.value = false;
  fireConfetti();
  toast.add({
    severity: "success",
    summary: "Chúc mừng! 🎉",
    detail: "Tài khoản của bạn đã được tạo thành công!",
    life: 5000,
  });
};
</script>

<style scoped>
/* ========================================
   ROOT
   ======================================== */
.register-page {
  display: flex;
  min-height: 100dvh;
  width: 100%;
  font-family: "Inter", sans-serif;
}

/* ========================================
   LEFT FORM PANEL
   ======================================== */
.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 2.5rem 1.5rem;
  position: relative;
  overflow: hidden;
  order: 1;
}

.form-deco-top-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 14rem;
  height: 14rem;
  background: #fff7ed;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.form-deco-bottom-right {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12rem;
  height: 12rem;
  background: #f0fdf4;
  border-radius: 50%;
  transform: translate(50%, 50%);
  pointer-events: none;
}

.form-container {
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 10;
}

/* Mobile logo */
.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
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

/* Heading */
.form-heading {
  margin-bottom: 1.75rem;
}
.heading-sub {
  color: #f97316;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.25rem;
}
.heading-title {
  font-size: 1.75rem;
  font-weight: 900;
  color: #111827;
  margin: 0 0 0.25rem 0;
}
.heading-desc {
  color: #9ca3af;
  font-size: 0.875rem;
}

/* ========================================
   STEPPER
   ======================================== */
.stepper {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  position: relative;
  z-index: 1;
}

.step-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  border: 2.5px solid #d1d5db;
  background: white;
  color: #9ca3af;
  transition: all 0.4s ease;
}

.step-done .step-circle {
  border-color: #f97316;
  background: #f97316;
  color: white;
}

.step-active .step-circle {
  border-color: #f97316;
  color: #f97316;
  animation: stepPulse 1.5s ease-in-out infinite;
  box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4);
}

@keyframes stepPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(249, 115, 22, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
  }
}

.step-check {
  width: 1rem;
  height: 1rem;
}

.step-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #9ca3af;
  white-space: nowrap;
  transition: color 0.3s;
}
.step-active .step-label,
.step-done .step-label {
  color: #f97316;
}

/* Connector line */
.step-line {
  flex: 1;
  height: 3px;
  background: #e5e7eb;
  border-radius: 9999px;
  margin: 0 0.375rem;
  margin-bottom: 1.4rem; /* align with circles */
  overflow: hidden;
  position: relative;
}
.step-line-fill {
  height: 100%;
  background: #f97316;
  border-radius: 9999px;
  width: 0;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.step-line-fill.filled {
  width: 100%;
}

/* ========================================
   STEP SLIDE TRANSITIONS
   ======================================== */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.slide-forward-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.slide-forward-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-back-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}
.slide-back-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

/* ========================================
   SHAKE ANIMATION
   ======================================== */
.shake {
  animation: shakeForm 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shakeForm {
  10%,
  90% {
    transform: translateX(-3px);
  }
  20%,
  80% {
    transform: translateX(5px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-6px);
  }
  40%,
  60% {
    transform: translateX(6px);
  }
}

/* ========================================
   STEP CONTENT
   ======================================== */
.steps-wrapper {
  min-height: 300px;
}

.step-content {
  padding-bottom: 0.5rem;
}
.step-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 1.25rem;
}

/* Fields */
.field-group {
  margin-bottom: 1rem;
}
.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.375rem;
}
.req {
  color: #ef4444;
}
.field-error {
  display: block;
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
}

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

/* Phone */
.phone-wrap {
  display: flex;
  align-items: center;
  gap: 0;
}
.phone-prefix {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0 0.875rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-right: none;
  border-radius: 12px 0 0 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  height: 42px;
  flex-shrink: 0;
  white-space: nowrap;
}
.flag {
  font-size: 1rem;
}

.phone-input {
  border-radius: 0 12px 12px 0 !important;
}

/* PrimeVue inputs */
:deep(.prime-input),
:deep(.p-inputtext) {
  width: 100%;
  padding-left: 2.75rem !important;
  border-radius: 12px !important;
  border-color: #e5e7eb !important;
  font-size: 0.875rem;
  height: 42px;
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
  width: 100% !important;
  padding-left: 2.75rem !important;
  border-radius: 12px !important;
  border-color: #e5e7eb !important;
  font-size: 0.875rem;
  height: 42px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
:deep(.p-password input:focus) {
  border-color: #f97316 !important;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15) !important;
  outline: none !important;
}

/* ========================================
   PASSWORD STRENGTH
   ======================================== */
.strength-meter {
  margin-top: 0.625rem;
}
.strength-bar-track {
  height: 6px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 0.375rem;
}
.strength-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition:
    width 0.5s ease,
    background 0.4s ease;
}
.strength-label {
  font-size: 0.75rem;
  font-weight: 700;
}

/* Password rules */
.rules-box {
  background: #fafafa;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  padding: 0.875rem;
  margin-top: 0.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
.rule-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.72rem;
  color: #9ca3af;
  transition: color 0.3s;
}
.rule-item i {
  font-size: 0.7rem;
}
.rule-item.met {
  color: #16a34a;
}
.rule-item.met i {
  color: #16a34a;
}

/* ========================================
   REVIEW CARD
   ======================================== */
.review-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #fff7ed, #fef9ec);
  border: 1.5px solid #fed7aa;
  border-radius: 14px;
  padding: 1rem;
  margin-bottom: 1.25rem;
  position: relative;
}
.review-avatar {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 900;
  flex-shrink: 0;
}
.review-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}
.review-detail {
  font-size: 0.78rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.125rem;
}
.review-detail i {
  color: #f97316;
  font-size: 0.7rem;
}
.review-edit {
  position: absolute;
  top: 0.625rem;
  right: 0.75rem;
  background: none;
  border: none;
  padding: 0.375rem;
  color: #f97316;
  cursor: pointer;
  font-size: 0.875rem;
}
.review-edit:hover {
  color: #ea580c;
}

/* Checkboxes */
.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}
.checkbox-label {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
  cursor: pointer;
}
.terms-link {
  color: #f97316;
  text-decoration: none;
  font-weight: 600;
}
.terms-link:hover {
  text-decoration: underline;
}
.ml-7 {
  margin-left: 1.75rem;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: #f97316 !important;
  border-color: #f97316 !important;
}
:deep(.p-checkbox .p-checkbox-box:focus) {
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2) !important;
}

/* ========================================
   BUTTONS
   ======================================== */
.btn-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
}
.flex-1 {
  flex: 1;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem 1.5rem;
  margin-top: 1.25rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.35);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.btn-row .btn-primary {
  margin-top: 0;
}
.btn-primary:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.5);
}
.btn-primary:active:not(:disabled) {
  transform: scale(0.97);
}
.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-outline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.25rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
}
.btn-outline:hover {
  border-color: #f97316;
  color: #f97316;
  background: #fff7ed;
}

.spinner {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Login link */
.login-link-text {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 1.25rem;
}
.login-link {
  font-weight: 700;
  color: #f97316;
  text-decoration: none;
  margin-left: 0.25rem;
}
.login-link:hover {
  text-decoration: underline;
  color: #ea580c;
}

/* ========================================
   RIGHT BRAND PANEL
   ======================================== */
.brand-panel {
  display: none;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  order: 2;
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

.float-el {
  position: absolute;
  user-select: none;
  pointer-events: none;
  animation: floatBob 3s ease-in-out infinite;
}
.float-1 {
  top: 3.5rem;
  left: 2rem;
  font-size: 2.5rem;
  animation-delay: 0s;
  animation-duration: 3.4s;
}
.float-2 {
  top: 7rem;
  right: 2.5rem;
  font-size: 2.2rem;
  animation-delay: 0.6s;
  animation-duration: 4.1s;
}
.float-3 {
  bottom: 8rem;
  left: 3.5rem;
  font-size: 2.2rem;
  animation-delay: 1.2s;
  animation-duration: 3.7s;
}
.float-4 {
  bottom: 4rem;
  right: 2rem;
  font-size: 2.5rem;
  animation-delay: 0.3s;
  animation-duration: 4.3s;
}
.float-5 {
  top: 45%;
  left: 1.25rem;
  font-size: 1.8rem;
  animation-delay: 1.8s;
  animation-duration: 3.9s;
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

.brand-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  padding: 0 2rem;
  width: 100%;
}

.logo-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.75rem;
}
.logo-box {
  width: 4.5rem;
  height: 4.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}
.logo-svg {
  width: 2.75rem;
  height: 2.75rem;
}
.brand-name {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  margin: 0;
}
.brand-divider {
  width: 3.5rem;
  height: 3px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 9999px;
  margin-top: 0.625rem;
}

.tagline {
  font-size: 1.05rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
  margin-bottom: 2rem;
}
.tagline strong {
  color: white;
}

/* Brand steps sidebar */
.brand-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}
.brand-step {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.4s ease;
  opacity: 0.6;
}
.brand-step.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  opacity: 1;
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.brand-step-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}
.brand-step-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
}
.brand-step-desc {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.125rem;
}

/* ========================================
   CONFETTI
   ======================================== */
.confetti-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}
.confetti-piece {
  position: absolute;
  top: -10px;
  border-radius: 3px;
  animation: confettiFall linear forwards;
}

@keyframes confettiFall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0;
  }
}

/* Divider */
:deep(.p-divider-content) {
  background: white;
}
:deep(.p-divider::before) {
  border-color: #e5e7eb;
}

/* Utilities */
.w-full {
  width: 100%;
}
</style>
