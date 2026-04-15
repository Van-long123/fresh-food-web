<template>
  <div>
    <AppLoading v-if="loading" variant="overlay" message="Đang gửi email..." />

    <div
      class="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4 py-8 relative font-['Inter',sans-serif] overflow-hidden"
    >
      <!-- Background vegetable pattern -->
      <div
        class="fixed inset-0 opacity-[0.045] pointer-events-none z-0"
        aria-hidden="true"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="veg-pattern"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <text x="10" y="35" font-size="28">🥦</text>
              <text x="55" y="75" font-size="26">🍅</text>
              <text x="5" y="90" font-size="22">🌿</text>
              <text x="65" y="25" font-size="24">🥕</text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#veg-pattern)" />
        </svg>
      </div>

      <!-- Card -->
      <div
        class="relative z-10 w-full max-w-[480px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.09),0_2px_8px_rgba(0,0,0,0.05)] px-8 py-10 card-mount overflow-hidden sm:px-10"
      >
        <!-- STATE 1: INPUT EMAIL -->
        <Transition name="crossfade" mode="out-in">
          <div v-if="state === 'input'" key="input" class="w-full">
            <!-- Floating lock+mail icon -->
            <div class="flex justify-center mb-6" aria-hidden="true">
              <div
                class="w-22 h-22 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full border-2 border-orange-200 flex items-center justify-center icon-float shadow-[0_6px_20px_rgba(249,115,22,0.15)]"
                style="width: 5.5rem; height: 5.5rem"
              >
                <svg
                  viewBox="0 0 56 56"
                  fill="none"
                  class="w-12 h-12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="13"
                    y="26"
                    width="30"
                    height="20"
                    rx="4"
                    fill="#f97316"
                  />
                  <path
                    d="M19 26v-7a9 9 0 0 1 18 0v7"
                    stroke="#ea580c"
                    stroke-width="3"
                    stroke-linecap="round"
                    fill="none"
                  />
                  <rect
                    x="19"
                    y="32"
                    width="18"
                    height="8"
                    rx="2"
                    fill="white"
                    fill-opacity="0.9"
                  />
                  <path
                    d="M19 33l9 5 9-5"
                    stroke="#f97316"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            <h1
              class="text-[1.625rem] font-black text-gray-900 mb-1.5 text-center leading-tight"
            >
              Quên mật khẩu?
            </h1>
            <p
              class="text-[0.9rem] text-gray-500 text-center leading-relaxed m-0"
            >
              Nhập email để nhận link đặt lại mật khẩu của bạn.
            </p>

            <form novalidate class="mt-6" @submit.prevent="handleSend">
              <div
                class="mb-[1.125rem]"
                :class="{ 'field-error-state': !!emailError }"
              >
                <label
                  for="fp-email"
                  class="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Email <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span
                    class="absolute top-0 bottom-0 left-3.5 flex items-center text-gray-400 text-sm z-10 pointer-events-none"
                  >
                    <i class="pi pi-envelope" />
                  </span>
                  <InputText
                    id="fp-email"
                    v-model="email"
                    type="email"
                    placeholder="your@email.com"
                    autocomplete="email"
                    :invalid="!!emailError"
                    class="prime-input w-full !pl-11 !rounded-xl !border-gray-200 text-[0.9rem] !h-11 transition-[border-color,box-shadow] duration-200"
                    aria-label="Email"
                    aria-required="true"
                  />
                </div>
                <small
                  v-if="emailError"
                  class="block text-xs text-red-500 mt-1.5"
                  >{{ emailError }}</small
                >
              </div>

              <button
                type="submit"
                class="w-full flex items-center justify-center gap-2 py-3.5 border-0 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-[0.9375rem] cursor-pointer mt-4 shadow-[0_4px_18px_rgba(249,115,22,0.35)] transition-[transform,box-shadow,opacity] duration-200 hover:scale-[1.02] hover:shadow-[0_8px_26px_rgba(249,115,22,0.5)] active:scale-[0.97] disabled:from-orange-300 disabled:to-orange-400 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                :disabled="loading"
              >
                <svg
                  v-if="loading"
                  class="w-4 h-4 flex-shrink-0 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    class="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    class="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <i v-else class="pi pi-send" />
                {{ loading ? "Đang gửi..." : "Gửi link đặt lại" }}
              </button>
            </form>

            <NuxtLink
              :to="ROUTES.AUTH.LOGIN"
              class="flex items-center justify-center gap-1.5 mt-[1.125rem] text-sm font-semibold text-gray-500 no-underline bg-transparent border-0 cursor-pointer transition-colors duration-200 hover:text-orange-500 w-full"
            >
              <i class="pi pi-arrow-left" /> Quay lại đăng nhập
            </NuxtLink>
          </div>
        </Transition>

        <!-- STATE 2: SUCCESS -->
        <Transition name="crossfade" mode="out-in">
          <div
            v-if="state === 'success'"
            key="success"
            class="w-full text-center"
          >
            <!-- Animated SVG checkmark -->
            <div class="flex justify-center mb-6" aria-label="Thành công">
              <svg
                viewBox="0 0 80 80"
                class="w-22 h-22 overflow-visible"
                style="width: 5.5rem; height: 5.5rem"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="#16a34a"
                  stroke-width="4"
                  stroke-dasharray="226"
                  stroke-dashoffset="226"
                  class="check-circle"
                  stroke-linecap="round"
                />
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

            <h1
              class="text-[1.625rem] font-black text-green-600 mb-1.5 text-center leading-tight"
            >
              Kiểm tra hộp thư!
            </h1>
            <p
              class="text-[0.9rem] text-gray-500 text-center leading-relaxed m-0"
            >
              Chúng tôi đã gửi link đặt lại mật khẩu đến
              <strong class="text-orange-500 font-bold break-all">{{
                email
              }}</strong>
            </p>

            <!-- Countdown timer -->
            <div class="flex flex-col items-center gap-2 mt-6 mb-2">
              <div class="relative w-16 h-16 flex items-center justify-center">
                <svg
                  viewBox="0 0 64 64"
                  class="w-16 h-16 absolute inset-0"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="27"
                    fill="none"
                    stroke="#e5e7eb"
                    stroke-width="4"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="27"
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
                <span
                  class="text-[1.05rem] font-black text-orange-500 relative z-10"
                  >{{ countdown }}</span
                >
              </div>
              <span class="text-[0.8rem] font-semibold text-gray-500">{{
                countdown > 0 ? `Gửi lại sau ${countdown}s` : "Có thể gửi lại"
              }}</span>
            </div>

            <button
              class="w-full flex items-center justify-center gap-2 py-3.5 border-0 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-[0.9375rem] cursor-pointer mt-4 shadow-[0_4px_18px_rgba(249,115,22,0.35)] transition-[transform,box-shadow,opacity] duration-200 hover:scale-[1.02] hover:shadow-[0_8px_26px_rgba(249,115,22,0.5)] active:scale-[0.97] disabled:from-orange-300 disabled:to-orange-400 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
              :disabled="countdown > 0 || loading"
              @click="handleResend"
            >
              <svg
                v-if="loading"
                class="w-4 h-4 flex-shrink-0 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  class="opacity-25"
                />
                <path
                  fill="currentColor"
                  class="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <i v-else class="pi pi-refresh" />
              {{ loading ? "Đang gửi..." : "Gửi lại email" }}
            </button>

            <button
              class="flex items-center justify-center gap-1.5 mt-4 text-sm font-semibold text-gray-500 no-underline bg-transparent border-0 cursor-pointer transition-colors duration-200 hover:text-orange-500 w-full"
              @click="resetState"
            >
              Sai email? Thử lại
            </button>
          </div>
        </Transition>

        <!-- STATE 3: ERROR -->
        <Transition name="crossfade" mode="out-in">
          <div v-if="state === 'error'" key="error" class="w-full text-center">
            <!-- Animated X icon -->
            <div class="flex justify-center mb-6" aria-label="Lỗi">
              <svg
                viewBox="0 0 80 80"
                class="w-22 h-22"
                style="width: 5.5rem; height: 5.5rem"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="#fef2f2"
                  stroke="#ef4444"
                  stroke-width="3"
                  class="error-circle"
                />
                <path
                  d="M27 27l26 26M53 27L27 53"
                  stroke="#ef4444"
                  stroke-width="4.5"
                  stroke-linecap="round"
                  class="error-x"
                />
              </svg>
            </div>

            <h1
              class="text-[1.625rem] font-black text-red-500 mb-1.5 text-center leading-tight"
            >
              Email không tồn tại
            </h1>
            <p
              class="text-[0.9rem] text-gray-500 text-center leading-relaxed m-0"
            >
              Không tìm thấy tài khoản nào với email
              <strong class="text-orange-500 font-bold break-all">{{
                email
              }}</strong
              >. Vui lòng kiểm tra lại email của bạn.
            </p>

            <button
              class="w-full flex items-center justify-center gap-2 py-3.5 border-0 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-[0.9375rem] cursor-pointer mt-4 shadow-[0_4px_18px_rgba(249,115,22,0.35)] transition-[transform,box-shadow,opacity] duration-200 hover:scale-[1.02] hover:shadow-[0_8px_26px_rgba(249,115,22,0.5)] active:scale-[0.97]"
              @click="resetState"
            >
              <i class="pi pi-refresh" /> Thử email khác
            </button>

            <NuxtLink
              :to="ROUTES.AUTH.REGISTER"
              class="flex items-center justify-center gap-1.5 mt-3 text-sm font-semibold text-gray-500 no-underline bg-transparent border-0 cursor-pointer transition-colors duration-200 hover:text-orange-500 w-full block"
            >
              Chưa có tài khoản? <strong>Đăng ký ngay →</strong>
            </NuxtLink>
          </div>
        </Transition>
      </div>

      <!-- Footer link -->
      <p class="relative z-10 text-sm text-gray-400 mt-6">
        Nhớ mật khẩu rồi?
        <NuxtLink
          :to="ROUTES.AUTH.LOGIN"
          class="text-orange-500 font-bold no-underline ml-1 hover:underline hover:text-orange-600"
          >Đăng nhập</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue";
import { ROUTES } from "~/constants/routes";
import { useToast } from "primevue/usetoast";

useHead({
  title: "Quên mật khẩu - SmartFood",
  meta: [{ name: "description", content: "Trang Quên mật khẩu của SmartFood" }],
});

definePageMeta({ layout: false });

const toast = useToast();

type PageState = "input" | "success" | "error";

const state = ref<PageState>("input");
const email = ref("");
const emailError = ref("");
const loading = ref(false);

const TOTAL_SECONDS = 59;
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const circumference = computed(() => 2 * Math.PI * 27);
const dashOffset = computed(() => {
  const fraction = countdown.value / TOTAL_SECONDS;
  return circumference.value * (1 - fraction);
});

const startCountdown = () => {
  countdown.value = TOTAL_SECONDS;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!);
      countdownTimer = null;
    }
  }, 1000);
};

onBeforeUnmount(() => {
  if (countdownTimer) clearInterval(countdownTimer);
});

const validate = (): boolean => {
  emailError.value = "";
  if (!email.value) {
    emailError.value = "Email là bắt buộc.";
    return false;
  }
  if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email.value)) {
    emailError.value = "Email không đúng định dạng.";
    return false;
  }
  return true;
};

const simulateSend = async (): Promise<boolean> => {
  return !email.value.toLowerCase().includes("error");
};

const handleSend = async () => {
  if (!validate()) return;
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1500));
  const success = await simulateSend();
  loading.value = false;

  if (success) {
    state.value = "success";
    startCountdown();
    toast.add({
      severity: "success",
      summary: "Đã gửi",
      detail: "Kiểm tra hộp thư của bạn!",
      life: 4000,
    });
  } else {
    state.value = "error";
  }
};

const handleResend = async () => {
  if (countdown.value > 0) return;
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1500));
  loading.value = false;
  startCountdown();
  toast.add({
    severity: "info",
    summary: "Đã gửi lại",
    detail: `Email vừa được gửi đến ${email.value}`,
    life: 4000,
  });
};

const resetState = () => {
  state.value = "input";
  emailError.value = "";
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  countdown.value = 0;
};
</script>

<style scoped>
/* State transitions */
.crossfade-enter-active,
.crossfade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.crossfade-enter-from {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}
.crossfade-leave-to {
  opacity: 0;
  transform: scale(1.02) translateY(-8px);
}

/* Card mount animation */
.card-mount {
  animation: cardMount 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes cardMount {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Icon float animation */
.icon-float {
  animation: iconFloat 3s ease-in-out infinite;
}
@keyframes iconFloat {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }
  50% {
    transform: translateY(-8px) rotate(2deg);
  }
}

/* PrimeVue input overrides */
:deep(.prime-input),
:deep(.p-inputtext) {
  padding-left: 2.75rem !important;
  border-radius: 12px !important;
  border-color: #e5e7eb !important;
  font-size: 0.9rem;
  height: 44px;
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

/* Animated checkmark */
.check-circle {
  animation: drawCircle 0.7s ease-out 0.1s forwards;
}
.check-mark {
  animation: drawCheck 0.4s ease-out 0.75s forwards;
}
@keyframes drawCircle {
  from {
    stroke-dashoffset: 226;
  }
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes drawCheck {
  from {
    stroke-dashoffset: 50;
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* Animated error X */
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
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes drawX {
  from {
    stroke-dashoffset: 40;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>
