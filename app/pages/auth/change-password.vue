<template>
  <div>
    <AppLoading
      v-if="loading"
      variant="overlay"
      message="Đang lưu mật khẩu..."
    />

    <div
      class="min-h-dvh flex flex-col items-center justify-start px-4 pt-10 pb-16"
      style="background: linear-gradient(160deg, #f9fafb 0%, #ffffff 100%)"
    >
      <!-- Breadcrumb -->
      <nav
        class="flex items-center gap-1.5 w-full max-w-[520px] text-[0.8rem] mb-5"
        aria-label="Breadcrumb"
      >
        <NuxtLink
          :to="ROUTES.HOME"
          class="text-[#f97316] font-semibold no-underline hover:underline"
          >Tài khoản</NuxtLink
        >
        <i class="pi pi-chevron-right text-[0.6rem] text-gray-300" />
        <span class="text-gray-500 font-medium">Bảo mật</span>
        <i class="pi pi-chevron-right text-[0.6rem] text-gray-300" />
        <span class="text-gray-700 font-bold">Đổi mật khẩu</span>
      </nav>

      <!-- Main card -->
      <div
        class="w-full max-w-[520px] bg-white rounded-3xl relative overflow-hidden p-8 sm:p-10"
        style="
          box-shadow:
            0 10px 40px rgba(0, 0, 0, 0.08),
            0 2px 8px rgba(0, 0, 0, 0.04);
          animation: cardMount 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        "
        :class="{ shake: isShaking }"
      >
        <!-- Success overlay -->
        <Transition name="overlay-fade">
          <div
            v-if="showSuccess"
            class="absolute inset-0 z-20 flex items-center justify-center rounded-3xl"
            style="
              background: rgba(255, 255, 255, 0.97);
              backdrop-filter: blur(6px);
            "
            aria-live="polite"
          >
            <div class="text-center p-8">
              <svg
                viewBox="0 0 90 90"
                class="w-24 h-24 mx-auto mb-5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="45"
                  cy="45"
                  r="40"
                  fill="none"
                  stroke="#16a34a"
                  stroke-width="4"
                  stroke-dasharray="252"
                  stroke-dashoffset="252"
                  class="succ-circle"
                />
                <path
                  d="M26 45l13 13 25-25"
                  fill="none"
                  stroke="#16a34a"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-dasharray="55"
                  stroke-dashoffset="55"
                  class="succ-check"
                />
              </svg>
              <h2 class="text-[1.4rem] font-black text-green-600 mb-2 mt-0">
                Đổi mật khẩu thành công!
              </h2>
              <p class="text-[0.875rem] text-gray-500 mb-5 mt-0">
                Chuyển hướng về trang tài khoản sau
                <strong>{{ redirectCountdown }}s</strong>…
              </p>
              <div
                class="w-full h-[5px] bg-green-100 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-green-600 rounded-full transition-[width] duration-1000 linear"
                  :style="{ width: redirectProgress }"
                />
              </div>
            </div>
          </div>
        </Transition>

        <!-- Card header -->
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-[3.25rem] h-[3.25rem] flex-shrink-0 flex items-center justify-center rounded-[0.875rem] text-[#f97316] text-xl"
            style="
              background: linear-gradient(135deg, #fff7ed, #ffedd5);
              border: 1.5px solid #fed7aa;
            "
          >
            <i class="pi pi-shield" />
          </div>
          <div>
            <h1 class="text-[1.375rem] font-black text-gray-900 m-0 mb-0.5">
              Đổi mật khẩu
            </h1>
            <p class="text-[0.825rem] text-gray-400 m-0">
              Cập nhật mật khẩu để bảo vệ tài khoản của bạn
            </p>
          </div>
        </div>

        <Divider />

        <form novalidate @submit.prevent="handleSubmit">
          <!-- Current password -->
          <div class="mb-5">
            <label
              class="block text-[0.875rem] font-semibold text-gray-700 mb-1.5"
            >
              Mật khẩu hiện tại <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span
                class="absolute top-0 bottom-0 left-3.5 flex items-center text-gray-400 text-[0.875rem] z-10 pointer-events-none"
              >
                <i class="pi pi-lock" />
              </span>
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
            <small
              v-if="errors.current"
              class="block text-[0.75rem] text-red-500 mt-1"
              >{{ errors.current }}</small
            >
          </div>

          <!-- New password -->
          <div class="mb-5">
            <label
              class="block text-[0.875rem] font-semibold text-gray-700 mb-1.5"
            >
              Mật khẩu mới <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span
                class="absolute top-0 bottom-0 left-3.5 flex items-center text-gray-400 text-[0.875rem] z-10 pointer-events-none"
              >
                <i class="pi pi-lock-open" />
              </span>
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
            <small
              v-if="errors.newPwd"
              class="block text-[0.75rem] text-red-500 mt-1"
              >{{ errors.newPwd }}</small
            >

            <!-- Strength meter -->
            <div v-if="form.newPwd" class="mt-2.5">
              <div class="flex gap-1 mb-1.5">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="flex-1 h-[5px] rounded-full bg-gray-200 transition-[background] duration-[400ms] ease-in-out"
                  :style="
                    strength.score >= i ? { background: strength.color } : {}
                  "
                />
              </div>
              <span
                v-if="strength.label"
                class="text-[0.72rem] font-bold transition-colors duration-300"
                :style="{ color: strength.color }"
              >
                {{ strength.label }}
              </span>
            </div>

            <!-- Checklist -->
            <div
              v-if="form.newPwd"
              class="grid grid-cols-2 gap-1.5 mt-2.5 bg-[#fafafa] border border-gray-100 rounded-xl p-3.5"
            >
              <div
                v-for="rule in rules"
                :key="rule.label"
                class="flex items-center gap-1.5 text-[0.75rem] text-gray-400 transition-colors duration-300"
                :class="{ '!text-green-600': rule.met }"
              >
                <span
                  class="flex items-center text-[0.8rem]"
                  :class="{ 'rule-pop': rule.met }"
                >
                  <i
                    :class="
                      rule.met ? 'pi pi-check-circle' : 'pi pi-times-circle'
                    "
                  />
                </span>
                {{ rule.label }}
              </div>
            </div>
          </div>

          <!-- Confirm password -->
          <div class="mb-5">
            <label
              class="block text-[0.875rem] font-semibold text-gray-700 mb-1.5"
            >
              Xác nhận mật khẩu mới <span class="text-red-500">*</span>
            </label>
            <div
              class="relative"
              :class="{ matched: isMatched, mismatched: isMismatched }"
            >
              <span
                class="absolute top-0 bottom-0 left-3.5 flex items-center text-gray-400 text-[0.875rem] z-10 pointer-events-none"
              >
                <i class="pi pi-lock" />
              </span>
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
              <span
                v-if="isMatched"
                class="absolute right-11 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[0.625rem] font-bold z-10 badge-pop"
              >
                <i class="pi pi-check" />
              </span>
              <span
                v-else-if="isMismatched"
                class="absolute right-11 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[0.625rem] font-bold z-10 badge-pop"
              >
                <i class="pi pi-times" />
              </span>
            </div>
            <small
              v-if="errors.confirm"
              class="block text-[0.75rem] text-red-500 mt-1"
              >{{ errors.confirm }}</small
            >
          </div>

          <!-- Tip box -->
          <div
            class="flex items-start gap-2 bg-green-50 border border-green-200 rounded-[10px] p-3 text-[0.8rem] text-green-800 mb-6"
          >
            <i class="pi pi-info-circle text-green-600 mt-0.5 flex-shrink-0" />
            <span
              >Đừng dùng lại mật khẩu đã dùng ở các nơi khác để bảo mật tốt
              hơn.</span
            >
          </div>

          <!-- Buttons -->
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="px-5 py-3.5 border-none bg-transparent text-[0.9rem] font-semibold text-gray-500 cursor-pointer rounded-xl transition-[background,color] duration-200 hover:bg-gray-100 hover:text-gray-700"
              @click="resetForm"
            >
              Huỷ
            </button>
            <button
              type="submit"
              class="flex-1 flex items-center justify-center gap-2 py-3.5 border-none rounded-xl text-white font-bold text-[0.9375rem] cursor-pointer transition-[transform,box-shadow] duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none hover:enabled:scale-[1.02] active:enabled:scale-[0.97]"
              style="
                background: linear-gradient(135deg, #f97316, #ea580c);
                box-shadow: 0 4px 18px rgba(249, 115, 22, 0.35);
              "
              :class="{
                'hover:!shadow-[0_8px_26px_rgba(249,115,22,0.5)]': !loading,
              }"
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
              <i v-else class="pi pi-check" />
              {{ loading ? "Đang lưu..." : "Lưu thay đổi" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { usePasswordStrength } from "~/composables/usePasswordStrength";
import { ROUTES } from "~/constants/routes";

useHead({
  title: "Đổi mật khẩu - SmartFood",
  meta: [{ name: "description", content: "Trang Đổi mật khẩu của SmartFood" }],
});
definePageMeta({ layout: "default" });

const router = useRouter();
const toast = useToast();

const form = reactive({ current: "", newPwd: "", confirm: "" });
const errors = reactive({ current: "", newPwd: "", confirm: "" });
const loading = ref(false);
const isShaking = ref(false);
const showSuccess = ref(false);

const newPwdRef = reactive({
  get value() {
    return form.newPwd;
  },
});
const { rules, strength } = usePasswordStrength(newPwdRef);

const isMatched = computed(
  () => form.confirm.length > 0 && form.newPwd === form.confirm,
);
const isMismatched = computed(
  () => form.confirm.length > 0 && form.newPwd !== form.confirm,
);

const validate = (): boolean => {
  errors.current = errors.newPwd = errors.confirm = "";
  let ok = true;
  if (!form.current) {
    errors.current = "Vui lòng nhập mật khẩu hiện tại.";
    ok = false;
  }
  if (!form.newPwd) {
    errors.newPwd = "Vui lòng nhập mật khẩu mới.";
    ok = false;
  } else if (form.newPwd.length < 8) {
    errors.newPwd = "Mật khẩu mới phải có ít nhất 8 ký tự.";
    ok = false;
  } else if (form.newPwd === form.current) {
    errors.newPwd = "Mật khẩu mới phải khác mật khẩu hiện tại.";
    ok = false;
  }
  if (!form.confirm) {
    errors.confirm = "Vui lòng xác nhận mật khẩu mới.";
    ok = false;
  } else if (form.newPwd !== form.confirm) {
    errors.confirm = "Xác nhận mật khẩu không khớp.";
    ok = false;
  }
  return ok;
};

const shake = () => {
  isShaking.value = true;
  setTimeout(() => {
    isShaking.value = false;
  }, 600);
};

const REDIRECT_SECONDS = 3;
const redirectCountdown = ref(REDIRECT_SECONDS);
const redirectProgress = computed(
  () => `${(redirectCountdown.value / REDIRECT_SECONDS) * 100}%`,
);
let redirectTimer: ReturnType<typeof setInterval> | null = null;

const startRedirect = () => {
  redirectCountdown.value = REDIRECT_SECONDS;
  redirectTimer = setInterval(() => {
    redirectCountdown.value--;
    if (redirectCountdown.value <= 0) {
      clearInterval(redirectTimer!);
      redirectTimer = null;
      router.push(ROUTES.HOME);
    }
  }, 1000);
};

onBeforeUnmount(() => {
  if (redirectTimer) clearInterval(redirectTimer);
});

const handleSubmit = async () => {
  if (!validate()) {
    shake();
    return;
  }
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1800));
  loading.value = false;
  showSuccess.value = true;
  toast.add({
    severity: "success",
    summary: "Thành công!",
    detail: "Mật khẩu của bạn đã được thay đổi.",
    life: 5000,
  });
  startRedirect();
};

const resetForm = () => {
  form.current = form.newPwd = form.confirm = "";
  errors.current = errors.newPwd = errors.confirm = "";
};
</script>

<style scoped>
/* Card mount animation */
@keyframes cardMount {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Shake */
.shake {
  animation: shakeCard 0.55s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes shakeCard {
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

/* Match badge pop */
.badge-pop {
  animation: badgePop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes badgePop {
  from {
    transform: translateY(-50%) scale(0.4);
  }
  to {
    transform: translateY(-50%) scale(1);
  }
}

/* Rule pop */
.rule-pop {
  animation: rulePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes rulePop {
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
}

/* Success SVG draw */
.succ-circle {
  animation: drawCircle 0.6s ease-out 0.1s forwards;
}
.succ-check {
  animation: drawCheck 0.45s ease-out 0.65s forwards;
}
@keyframes drawCircle {
  from {
    stroke-dashoffset: 252;
  }
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes drawCheck {
  from {
    stroke-dashoffset: 55;
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* Overlay transition */
.overlay-fade-enter-active {
  transition: opacity 0.4s ease;
}
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* PrimeVue Password overrides */
:deep(.p-password) {
  width: 100%;
}
:deep(.p-password input) {
  width: 100% !important;
  padding-left: 2.75rem !important;
  border-radius: 12px !important;
  border-color: #e5e7eb !important;
  font-size: 0.875rem;
  height: 44px;
  transition:
    border-color 0.25s,
    box-shadow 0.25s;
}
:deep(.p-password input:focus) {
  border-color: #f97316 !important;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15) !important;
  outline: none !important;
}

/* Matched / mismatched border states */
.matched :deep(.p-password input) {
  border-color: #16a34a !important;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12) !important;
}
.mismatched :deep(.p-password input) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

:deep(.p-divider::before) {
  border-color: #f3f4f6;
}
</style>
