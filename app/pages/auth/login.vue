<template>
  <div>
    <AppLoading v-if="loading" variant="overlay" message="Đang đăng nhập..." />

    <div class="flex min-h-dvh w-full font-['Inter',sans-serif]">
      <Toast position="top-right" />

      <!-- LEFT BRAND PANEL -->
      <div
        class="hidden md:flex md:w-[40%] relative flex-col items-center justify-center overflow-hidden flex-shrink-0"
      >
        <!-- Animated background gradient -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 gradient-shift"
        />

        <!-- SVG food pattern overlay -->
        <div class="absolute inset-0 opacity-[0.08]">
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
        <span
          class="absolute text-[2.5rem] top-16 left-10 select-none pointer-events-none float-bob"
          style="animation-delay: 0s; animation-duration: 3.2s"
          >🍊</span
        >
        <span
          class="absolute text-[2rem] top-32 right-12 select-none pointer-events-none float-bob"
          style="animation-delay: 0.8s; animation-duration: 4s"
          >🥦</span
        >
        <span
          class="absolute text-[2rem] bottom-32 left-16 select-none pointer-events-none float-bob"
          style="animation-delay: 1.5s; animation-duration: 3.5s"
          >🍋</span
        >
        <span
          class="absolute text-[2.5rem] bottom-20 right-10 select-none pointer-events-none float-bob"
          style="animation-delay: 0.4s; animation-duration: 4.5s"
          >🍇</span
        >
        <span
          class="absolute text-[1.5rem] top-1/2 left-6 select-none pointer-events-none float-bob"
          style="animation-delay: 2s; animation-duration: 3.8s"
          >🌿</span
        >

        <!-- Brand content -->
        <div class="relative z-10 text-center text-white px-10">
          <NuxtLink :to="ROUTES.HOME">
            <div class="flex flex-col items-center mb-8">
              <div
                class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.15)] ring-2 ring-white/30"
              >
                <svg
                  viewBox="0 0 48 48"
                  class="w-12 h-12"
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
              <h1 class="text-4xl font-black tracking-[0.15em] m-0">
                SMARTFOOD
              </h1>
              <div class="w-16 h-[3px] bg-white/35 rounded-full mt-3" />
            </div>
          </NuxtLink>

          <p
            class="text-[1.15rem] font-semibold leading-[1.7] text-white/90 mb-10"
          >
            Mua sắm thông minh<br />
            <strong class="text-white">Sống khỏe mỗi ngày</strong>
          </p>

          <div class="flex flex-col gap-4 text-left">
            <div
              v-for="benefit in benefits"
              :key="benefit.text"
              class="flex items-center gap-3.5 text-white/90"
            >
              <div
                class="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-base flex-shrink-0 backdrop-blur-sm"
              >
                {{ benefit.icon }}
              </div>
              <span class="text-sm font-medium">{{ benefit.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT FORM PANEL -->
      <div
        class="flex-1 flex items-center justify-center bg-white py-12 px-6 relative overflow-hidden"
      >
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
        <div
          class="absolute bottom-0 left-0 w-48 h-48 bg-green-50 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"
        />

        <div class="w-full max-w-[420px] relative z-10 slide-in-right">
          <!-- Mobile logo -->
          <div class="flex md:hidden items-center gap-2 mb-8">
            <div
              class="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[0.625rem] flex items-center justify-center text-white font-black text-lg shadow-[0_4px_10px_rgba(249,115,22,0.3)]"
            >
              S
            </div>
            <span class="text-lg font-black text-gray-900"
              >SMART<span class="text-orange-500">FOOD</span></span
            >
          </div>

          <!-- Greeting -->
          <div class="fade-up" style="--delay: 0ms">
            <p
              class="text-orange-500 font-semibold text-[0.8rem] uppercase tracking-[0.08em] mb-1.5"
            >
              Chào mừng trở lại! 👋
            </p>
            <h2 class="text-[1.875rem] font-black text-gray-900 m-0 mb-1.5">
              Đăng nhập
            </h2>
            <p class="text-gray-400 text-sm mb-8">
              Nhập thông tin đăng nhập để tiếp tục mua sắm
            </p>
          </div>

          <form novalidate @submit.prevent="handleSubmit">
            <!-- Email -->
            <div class="mb-5 fade-up" style="--delay: 100ms">
              <label
                for="email"
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
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="your@email.com"
                  autocomplete="email"
                  :invalid="!!errors.email"
                  class="prime-input w-full"
                  aria-label="Email"
                  aria-required="true"
                />
              </div>
              <small
                v-if="errors.email"
                class="block text-xs text-red-500 mt-1.5"
                >{{ errors.email }}</small
              >
            </div>

            <!-- Password -->
            <div class="mb-5 fade-up" style="--delay: 200ms">
              <div class="flex items-center justify-between mb-1.5">
                <label
                  for="password"
                  class="block text-sm font-semibold text-gray-700"
                >
                  Mật khẩu <span class="text-red-500">*</span>
                </label>
                <NuxtLink
                  :to="ROUTES.AUTH.FORGOT_PASSWORD"
                  class="text-xs font-semibold text-orange-500 no-underline hover:text-orange-600 hover:underline"
                  >Quên mật khẩu?</NuxtLink
                >
              </div>
              <div class="relative">
                <span
                  class="absolute top-0 bottom-0 left-3.5 flex items-center text-gray-400 text-sm z-10 pointer-events-none"
                >
                  <i class="pi pi-lock" />
                </span>
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
              <small
                v-if="errors.password"
                class="block text-xs text-red-500 mt-1.5"
                >{{ errors.password }}</small
              >
            </div>

            <!-- Remember me -->
            <div
              class="flex items-center gap-2.5 fade-up"
              style="--delay: 300ms"
            >
              <Checkbox
                v-model="form.remember"
                input-id="remember"
                :binary="true"
              />
              <label
                for="remember"
                class="text-sm text-gray-600 cursor-pointer select-none"
                >Ghi nhớ đăng nhập trong 30 ngày</label
              >
            </div>

            <!-- Submit -->
            <div class="mt-5 fade-up" style="--delay: 400ms">
              <button
                type="submit"
                :disabled="loading"
                class="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 border-0 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-[0.9375rem] cursor-pointer shadow-[0_4px_20px_rgba(249,115,22,0.4)] transition-[transform,box-shadow] duration-200 enabled:hover:scale-[1.025] enabled:hover:shadow-[0_8px_28px_rgba(249,115,22,0.55)] enabled:active:scale-[0.97] disabled:opacity-65 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="loading"
                  class="w-4 h-4 animate-spin flex-shrink-0"
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
          <div class="fade-up" style="--delay: 500ms">
            <Divider
              ><span class="text-xs text-gray-400 font-medium px-2"
                >hoặc đăng nhập với</span
              ></Divider
            >
          </div>

          <!-- Social buttons -->
          <div class="grid grid-cols-2 gap-3 fade-up" style="--delay: 600ms">
            <button
              type="button"
              class="flex items-center justify-center gap-2 py-2.5 px-4 border-[1.5px] border-gray-200 rounded-xl bg-white cursor-pointer text-sm font-semibold text-gray-700 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[transform,box-shadow,border-color,background] duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:border-gray-300 hover:bg-gray-50 active:translate-y-0"
            >
              <svg
                class="w-[1.125rem] h-[1.125rem] flex-shrink-0"
                viewBox="0 0 24 24"
              >
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
            <button
              type="button"
              class="flex items-center justify-center gap-2 py-2.5 px-4 border-[1.5px] border-gray-200 rounded-xl bg-white cursor-pointer text-sm font-semibold text-gray-700 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[transform,box-shadow,border-color,background] duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:border-blue-200 hover:bg-blue-50 active:translate-y-0"
            >
              <svg
                class="w-[1.125rem] h-[1.125rem] flex-shrink-0"
                viewBox="0 0 24 24"
                fill="#1877F2"
              >
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              Facebook
            </button>
          </div>

          <!-- Register link -->
          <p
            class="text-center text-sm text-gray-500 mt-2 fade-up"
            style="--delay: 700ms"
          >
            Chưa có tài khoản?
            <NuxtLink
              :to="ROUTES.AUTH.REGISTER"
              class="font-bold text-orange-500 no-underline ml-1 hover:text-orange-600 hover:underline"
              >Đăng ký ngay →</NuxtLink
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ROUTES } from "~/constants/routes";
import { useToast } from "primevue/usetoast";

useHead({
  title: "Đăng nhập - SmartFood",
  meta: [{ name: "description", content: "Trang Đăng nhập của SmartFood" }],
});

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
/* Gradient animation */
.gradient-shift {
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

/* Floating bob animation */
.float-bob {
  animation: floatBob 3s ease-in-out infinite;
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

/* Slide in right */
.slide-in-right {
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

/* Stagger fade up */
.fade-up {
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

/* PrimeVue input overrides */
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

/* Checkbox overrides */
:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: #f97316 !important;
  border-color: #f97316 !important;
}
:deep(.p-checkbox .p-checkbox-box:focus) {
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2) !important;
}

/* Divider overrides */
:deep(.p-divider-content) {
  background: white;
}
:deep(.p-divider::before) {
  border-color: #e5e7eb;
}
</style>
