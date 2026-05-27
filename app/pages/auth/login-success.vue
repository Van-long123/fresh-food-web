<template>
  <div
    class="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50 font-['Inter',sans-serif]"
  >
    <!-- Animated card -->
    <div class="w-full max-w-sm mx-auto px-6">
      <div
        class="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.10)] border border-gray-100 p-10 flex flex-col items-center gap-6 text-center"
        :class="{ 'animate-pulse-soft': isProcessing }"
      >
        <!-- Icon -->
        <div class="relative">
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500"
            :class="statusIconClass"
          >
            <!-- Loading spinner -->
            <svg
              v-if="isProcessing"
              class="w-10 h-10 text-orange-500 animate-spin"
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
            <!-- Success check -->
            <svg
              v-else-if="isSuccess"
              class="w-10 h-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <!-- Error X -->
            <svg
              v-else
              class="w-10 h-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <!-- Ripple ring (only when processing) -->
          <span
            v-if="isProcessing"
            class="absolute inset-0 rounded-full bg-orange-100 animate-ping opacity-40"
          />
        </div>

        <!-- Status text -->
        <div class="space-y-2">
          <h1 class="text-xl font-bold text-gray-900">{{ statusTitle }}</h1>
          <p class="text-sm text-gray-500 leading-relaxed">
            {{ statusMessage }}
          </p>
        </div>

        <!-- Progress dots (processing state) -->
        <div v-if="isProcessing" class="flex gap-1.5">
          <span
            v-for="i in 3"
            :key="i"
            class="w-2 h-2 rounded-full bg-orange-400 animate-bounce"
            :style="{ animationDelay: `${(i - 1) * 150}ms` }"
          />
        </div>

        <!-- Manual redirect button (fallback if auto redirect slow) -->
        <button
          v-if="isSuccess"
          id="btn-goto-home"
          class="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white text-sm font-semibold shadow-[0_4px_16px_rgba(249,115,22,0.35)] hover:scale-105 transition-transform duration-150 border-0 cursor-pointer"
          @click="handleGoHome"
        >
          Về trang chủ →
        </button>

        <button
          v-if="isError"
          id="btn-retry-login"
          class="mt-2 px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-150 cursor-pointer"
          @click="handleRetry"
        >
          ← Quay lại đăng nhập
        </button>
      </div>

      <!-- Brand footer -->
      <p class="mt-6 text-center text-xs text-gray-400">
        🌿 <span class="font-semibold">SmartFood</span> — Thực phẩm sạch, sống
        khỏe mỗi ngày
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSocialAuth } from "~/composables/auth/useSocialAuth";
import { ROUTES } from "~/constants/routes";

useHead({
  title: "Đang xử lý đăng nhập — SmartFood",
  meta: [{ name: "robots", content: "noindex" }],
});

// Trang này không cần layout và không cần guard — ai cũng có thể landing ở đây từ OAuth
definePageMeta({ layout: false });

const route = useRoute();
const router = useRouter();
const { isLoading, handleOAuthCallback } = useSocialAuth();

type PageStatus = "processing" | "success" | "error";
const status = ref<PageStatus>("processing");

const isProcessing = computed(() => status.value === "processing");
const isSuccess = computed(() => status.value === "success");
const isError = computed(() => status.value === "error");

const statusIconClass = computed(() => {
  if (isProcessing.value) return "bg-orange-50";
  if (isSuccess.value) return "bg-green-50";
  return "bg-red-50";
});

const statusTitle = computed(() => {
  if (isProcessing.value) return "Đang xác thực...";
  if (isSuccess.value) return "Đăng nhập thành công!";
  return "Xác thực thất bại";
});

const statusMessage = computed(() => {
  if (isProcessing.value)
    return "Hệ thống đang xử lý thông tin của bạn, vui lòng chờ trong giây lát.";
  if (isSuccess.value)
    return "Bạn đã đăng nhập thành công. Đang chuyển về trang chủ...";
  return "Không thể xác thực tài khoản xã hội. Vui lòng thử lại.";
});

const handleGoHome = async () => {
  await router.replace(ROUTES.HOME);
};

const handleRetry = async () => {
  await router.replace(ROUTES.AUTH.LOGIN);
};

// Lifecycle — gọi function từ composable tại đây (đúng theo rule)
onMounted(async () => {
  const userId = (route.query.userId as string) || null;

  if (!userId) {
    status.value = "error";
    return;
  }

  try {
    // handleOAuthCallback sẽ: gọi /verify-oauth → cập nhật store → redirect HOME
    // Override redirect để ta có thể kiểm soát status của trang này trước
    status.value = "processing";
    await handleOAuthCallback(userId);
    // Nếu handleOAuthCallback không throw và đã push HOME thì dòng dưới không chạy
    status.value = "success";
  } catch {
    status.value = "error";
  }
});
</script>

<style scoped>
@keyframes pulse-soft {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.01);
  }
}
.animate-pulse-soft {
  animation: pulse-soft 2s ease-in-out infinite;
}
</style>
