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
      <div
        class="w-full max-w-130 bg-white rounded-3xl relative overflow-hidden p-8 sm:p-10"
        style="
          box-shadow:
            0 10px 40px rgba(0, 0, 0, 0.08),
            0 2px 8px rgba(0, 0, 0, 0.04);
          animation: cardMount 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        "
        :class="{ shake: isShaking }"
      >
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-13 h-13 shrink-0 flex items-center justify-center rounded-[0.875rem] text-[#f97316] text-xl"
            style="
              background: linear-gradient(135deg, #fff7ed, #ffedd5);
              border: 1.5px solid #fed7aa;
            "
          >
            <i class="pi pi-key" />
          </div>
          <div>
            <h1 class="text-[1.375rem] font-black text-gray-900 m-0 mb-0.5">
              Thiết lập mật khẩu
            </h1>
            <p class="text-[0.825rem] text-gray-400 m-0">
              Kích hoạt tài khoản SmartFood của bạn
            </p>
          </div>
        </div>

        <Divider />

        <form novalidate @submit.prevent="handleSubmit">
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
                <i class="pi pi-unlock" />
              </span>
              <Password
                v-model="form.newPwd"
                :feedback="false"
                :toggle-mask="true"
                placeholder="Mật khẩu ít nhất 8 ký tự"
                :invalid="!!errors.newPwd"
                input-class="prime-input !pl-10 !w-full"
                class="w-full"
                aria-label="Mật khẩu mới"
              />
            </div>
            <small
              v-if="errors.newPwd"
              class="block text-[0.75rem] text-red-500 mt-1"
              >{{ errors.newPwd }}</small
            >

            <div v-if="form.newPwd" class="mt-2.5">
              <div class="flex gap-1 mb-1.5">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="flex-1 h-1.25 rounded-full bg-gray-200 transition-[background] duration-400 ease-in-out"
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

            <div
              v-if="form.newPwd"
              class="grid grid-cols-2 gap-1.5 mt-2.5 bg-[#fafafa] border border-gray-100 rounded-xl p-3.5"
            >
              <div
                v-for="rule in rules"
                :key="rule.label"
                class="flex items-center gap-1.5 text-[0.75rem] text-gray-400 transition-colors duration-300"
                :class="{ 'text-green-600!': rule.met }"
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
                input-class="prime-input !pl-10 !w-full"
                class="w-full"
                aria-label="Xác nhận mật khẩu mới"
              />
              <span
                v-if="isMatched"
                class="absolute right-11 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[0.625rem] font-bold z-10 badge-pop"
                >OK</span
              >
            </div>
            <small
              v-if="errors.confirm"
              class="block text-[0.75rem] text-red-500 mt-1"
              >{{ errors.confirm }}</small
            >
          </div>

          <div class="flex flex-col gap-2">
            <button
              type="submit"
              class="w-full rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
              :disabled="loading"
            >
              {{ loading ? "Đang lưu..." : "Lưu mật khẩu" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useChangePassword } from "~/composables/auth/useChangePassword";

useHead({
  title: "Thiết lập mật khẩu - SmartFood",
  meta: [
    { name: "description", content: "Trang thiết lập mật khẩu SmartFood" },
  ],
});

definePageMeta({ layout: "default", middleware: "guest" });

const route = useRoute();
const toast = useToast();

const tokenFromQuery = computed(() => String(route.query.token || ""));

const {
  form,
  errors,
  loading,
  isShaking,
  showSuccess,
  rules,
  strength,
  isMatched,
  isMismatched,
  validate,
  shake,
  submitSetPassword,
} = useChangePassword("set-password");

const handleSubmit = async () => {
  if (!validate()) {
    shake();
    return;
  }

  if (!tokenFromQuery.value) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Liên kết kích hoạt không hợp lệ.",
      life: 4000,
    });
    return;
  }

  try {
    await submitSetPassword(tokenFromQuery.value);
    showSuccess.value = true;
    toast.add({
      severity: "success",
      summary: "Thành công!",
      detail: "Mật khẩu của bạn đã được thiết lập.",
      life: 5000,
    });
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail:
        error?.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại.",
      life: 5000,
    });
  }
};
</script>

<style scoped>
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
</style>
