<template>
  <div class="register-guide-page">
    <div class="guide-shell">
      <div class="form-panel">
        <div class="form-deco-top-left" />
        <div class="form-deco-bottom-right" />

        <div class="form-container">
          <div class="mobile-logo">
            <div class="mobile-logo-icon">S</div>
            <span class="mobile-logo-text"
              >SMART<span class="text-orange">FOOD</span></span
            >
          </div>

          <div class="form-heading">
            <p class="heading-sub">Bắt đầu ngay hôm nay 🌟</p>
            <h1 class="heading-title">Hướng dẫn đăng ký tài khoản</h1>
            <p class="heading-desc">
              Quy trình giống hệt trang đăng ký, theo từng bước rõ ràng
            </p>
          </div>

          <div class="stepper" aria-label="Các bước đăng ký tài khoản">
            <template v-for="(step, i) in steps" :key="step.label">
              <button
                class="step-item"
                :class="{
                  'step-done': activeStep > i + 1,
                  'step-active': activeStep === i + 1,
                }"
                @click="activeStep = i + 1"
              >
                <div class="step-circle">
                  <svg
                    v-if="activeStep > i + 1"
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
                <span class="step-label">{{ step.label }}</span>
              </button>

              <div v-if="i < steps.length - 1" class="step-line">
                <div
                  class="step-line-fill"
                  :class="{ filled: activeStep > i + 1 }"
                />
              </div>
            </template>
          </div>

          <Transition name="slide-forward" mode="out-in">
            <div :key="activeStep" class="step-content">
              <p class="step-title">{{ currentGuide.title }}</p>

              <div class="review-card">
                <div class="review-avatar">{{ activeStep }}</div>
                <div class="review-info">
                  <div class="review-name">{{ currentGuide.highlight }}</div>
                  <div
                    class="review-detail"
                    v-for="line in currentGuide.details"
                    :key="line"
                  >
                    <i class="pi pi-check-circle" /> {{ line }}
                  </div>
                </div>
              </div>

              <div class="rules-box">
                <div
                  v-for="tip in currentGuide.tips"
                  :key="tip"
                  class="rule-item met"
                >
                  <i class="pi pi-star-fill" />
                  {{ tip }}
                </div>
              </div>

              <div class="btn-row">
                <button
                  class="btn-outline"
                  :disabled="activeStep === 1"
                  @click="prevStep"
                >
                  <i class="pi pi-arrow-left" /> Quay lại
                </button>

                <NuxtLink
                  v-if="activeStep === steps.length"
                  to="/auth/register"
                  class="btn-primary flex-1"
                >
                  Đăng ký ngay <i class="pi pi-arrow-right" />
                </NuxtLink>

                <button v-else class="btn-primary flex-1" @click="nextStep">
                  Tiếp theo <i class="pi pi-arrow-right" />
                </button>
              </div>
            </div>
          </Transition>

          <p class="login-link-text">
            Đã có tài khoản?
            <NuxtLink to="/auth/login" class="login-link">Đăng nhập →</NuxtLink>
          </p>
        </div>
      </div>

      <div class="brand-panel">
        <div class="gradient-bg" />
        <div class="pattern-overlay" />

        <span class="float-el float-1">🍊</span>
        <span class="float-el float-2">🥑</span>
        <span class="float-el float-3">🍓</span>

        <div class="brand-content">
          <div class="logo-wrap">
            <div class="logo-box">S</div>
            <h2 class="brand-name">SMARTFOOD</h2>
            <div class="brand-divider" />
          </div>

          <p class="tagline">
            Luồng đăng ký chuẩn hóa<br /><strong>nhanh, rõ, an toàn</strong>
          </p>

          <div class="brand-steps">
            <div
              v-for="(step, i) in steps"
              :key="step.label"
              class="brand-step"
              :class="{ active: activeStep > i }"
            >
              <div class="brand-step-icon">{{ step.icon }}</div>
              <div class="brand-step-text">
                <div class="brand-step-title">{{ step.brandTitle }}</div>
                <div class="brand-step-desc">{{ step.brandDesc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const activeStep = ref(1);

const steps = [
  {
    label: "Thông tin",
    icon: "📋",
    brandTitle: "Thông tin cơ bản",
    brandDesc: "Họ tên, email và số điện thoại",
    title: "📋 Bước 1 - Điền thông tin cơ bản",
    highlight: "Nhập đúng họ tên, email và số điện thoại",
    details: [
      "Số điện thoại theo định dạng Việt Nam",
      "Email cần chính xác để nhận thông báo",
      "Kiểm tra chính tả trước khi sang bước tiếp",
    ],
    tips: ["Dùng email đang hoạt động", "Tên trùng giấy tờ để xác minh dễ hơn"],
  },
  {
    label: "Bảo mật",
    icon: "🔐",
    brandTitle: "Thiết lập bảo mật",
    brandDesc: "Tạo mật khẩu mạnh, xác nhận mật khẩu",
    title: "🔐 Bước 2 - Thiết lập mật khẩu",
    highlight: "Đặt mật khẩu mạnh để bảo vệ tài khoản",
    details: [
      "Tối thiểu 8 ký tự",
      "Có chữ hoa, chữ số và ký tự đặc biệt",
      "Xác nhận mật khẩu phải khớp tuyệt đối",
    ],
    tips: ["Không dùng ngày sinh", "Không chia sẻ mật khẩu cho người khác"],
  },
  {
    label: "Xác nhận",
    icon: "✅",
    brandTitle: "Xác nhận & hoàn tất",
    brandDesc: "Đồng ý điều khoản và gửi đăng ký",
    title: "✅ Bước 3 - Xác nhận thông tin",
    highlight: "Rà soát lần cuối và hoàn tất đăng ký",
    details: [
      "Đọc điều khoản dịch vụ và chính sách bảo mật",
      "Tick đồng ý để tiếp tục",
      "Nhấn Hoàn tất đăng ký để tạo tài khoản",
    ],
    tips: [
      "Lưu email để khôi phục mật khẩu",
      "Bật thông báo để không bỏ lỡ ưu đãi",
    ],
  },
];

const currentGuide = computed<(typeof steps)[number]>(() => {
  const index = Math.min(Math.max(activeStep.value - 1, 0), steps.length - 1);
  return steps[index] as (typeof steps)[number];
});

const nextStep = () => {
  if (activeStep.value < steps.length) activeStep.value += 1;
};

const prevStep = () => {
  if (activeStep.value > 1) activeStep.value -= 1;
};
</script>

<style scoped>
.register-guide-page {
  background: #f5f5f5;
  min-height: 100dvh;
  padding: 16px;
}

.guide-shell {
  margin: 0 auto;
  display: flex;
  min-height: calc(100dvh - 32px);
  max-width: 1300px;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid #e5e7eb;
  background: white;
}

.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 2rem 1.5rem;
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
}

.form-container {
  width: 100%;
  max-width: 520px;
  position: relative;
  z-index: 2;
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.mobile-logo-icon {
  width: 2.25rem;
  height: 2.25rem;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 0.625rem;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 900;
}

.mobile-logo-text {
  font-size: 1.1rem;
  font-weight: 900;
  color: #111827;
}

.text-orange {
  color: #f97316;
}

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
  font-size: 1.8rem;
  font-weight: 900;
  color: #111827;
  margin: 0;
}

.heading-desc {
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 0.3rem;
}

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
  background: transparent;
  border: none;
  cursor: pointer;
}

.step-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
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
  box-shadow: 0 0 0 6px rgba(249, 115, 22, 0.12);
}

.step-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #9ca3af;
}

.step-active .step-label,
.step-done .step-label {
  color: #f97316;
}

.step-line {
  flex: 1;
  height: 3px;
  background: #e5e7eb;
  border-radius: 9999px;
  margin: 0 0.5rem;
  margin-bottom: 1.4rem;
  overflow: hidden;
}

.step-line-fill {
  height: 100%;
  width: 0;
  background: #f97316;
  transition: width 0.35s ease;
}

.step-line-fill.filled {
  width: 100%;
}

.step-content {
  border: 1px solid #f3f4f6;
  border-radius: 16px;
  padding: 1rem;
  background: #fff;
}

.step-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.9rem;
}

.review-card {
  display: flex;
  gap: 1rem;
  border: 1px solid #fed7aa;
  border-radius: 14px;
  background: linear-gradient(135deg, #fff7ed, #fef9ec);
  padding: 1rem;
}

.review-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  display: grid;
  place-items: center;
  font-size: 1.25rem;
  font-weight: 900;
  flex-shrink: 0;
}

.review-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.2rem;
}

.review-detail {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.2rem;
}

.review-detail i {
  color: #16a34a;
}

.rules-box {
  margin-top: 0.8rem;
  border: 1px solid #f3f4f6;
  background: #fafafa;
  border-radius: 12px;
  padding: 0.875rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.rule-item {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  font-size: 0.76rem;
  color: #16a34a;
  font-weight: 600;
}

.btn-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
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
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.8rem 1.2rem;
  text-decoration: none;
}

.btn-outline {
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #374151;
  padding: 0.8rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-link-text {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 1.25rem;
}

.login-link {
  font-weight: 700;
  color: #f97316;
  margin-left: 0.25rem;
  text-decoration: none;
}

.brand-panel {
  display: none;
  width: 42%;
  position: relative;
  overflow: hidden;
}

@media (min-width: 960px) {
  .brand-panel {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-logo {
    display: none;
  }
}

.gradient-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 55%, #c2410c 100%);
}

.pattern-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.85) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
}

.brand-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  color: white;
  padding: 0 2rem;
}

.float-el {
  position: absolute;
  animation: floatBob 3s ease-in-out infinite;
}

.float-1 {
  top: 3rem;
  left: 2rem;
  font-size: 2rem;
}

.float-2 {
  right: 2rem;
  top: 8rem;
  font-size: 2rem;
}

.float-3 {
  bottom: 6rem;
  left: 3rem;
  font-size: 2rem;
}

.logo-wrap {
  text-align: center;
  margin-bottom: 1.75rem;
}

.logo-box {
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
  font-size: 2rem;
  font-weight: 900;
  margin: 0 auto 0.6rem;
}

.brand-name {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.brand-divider {
  width: 3rem;
  height: 3px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.35);
  margin: 0.6rem auto 0;
}

.tagline {
  text-align: center;
  line-height: 1.6;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.brand-steps {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.brand-step {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.1);
  padding: 0.875rem 1rem;
  opacity: 0.65;
  transition: all 0.35s ease;
}

.brand-step.active {
  opacity: 1;
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.02);
}

.brand-step-icon {
  font-size: 1.4rem;
}

.brand-step-title {
  font-size: 0.85rem;
  font-weight: 700;
}

.brand-step-desc {
  font-size: 0.76rem;
  color: rgba(255, 255, 255, 0.8);
}

.slide-forward-enter-active,
.slide-forward-leave-active {
  transition: all 0.3s ease;
}

.slide-forward-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-forward-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@keyframes floatBob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 959px) {
  .guide-shell {
    border-radius: 14px;
  }
}
</style>
