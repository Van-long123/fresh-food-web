<template>
  <div>
    <!-- AppLoading overlay khi submit đăng ký -->
    <AppLoading
      v-if="loading"
      variant="overlay"
      message="Đang tạo tài khoản..."
    />

    <div class="flex min-h-dvh w-full font-['Inter',sans-serif]">
      <Toast position="top-right" />

      <!-- Confetti particles -->
      <Teleport to="body">
        <div
          v-if="showConfetti"
          class="fixed inset-0 z-[9999] overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            v-for="i in 60"
            :key="i"
            class="absolute -top-[10px] rounded-[3px] [animation-name:confettiFall] [animation-timing-function:linear] [animation-fill-mode:forwards]"
            :style="getConfettiStyle(i)"
          />
        </div>
      </Teleport>

      <!-- ===== LEFT FORM PANEL ===== -->
      <div
        class="relative order-1 flex flex-1 items-center justify-center overflow-hidden bg-white px-6 py-10"
      >
        <div
          class="pointer-events-none absolute left-0 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff7ed]"
        />
        <div
          class="pointer-events-none absolute bottom-0 right-0 h-48 w-48 translate-x-1/2 translate-y-1/2 rounded-full bg-[#f0fdf4]"
        />

        <div class="relative z-10 w-full max-w-[500px]">
          <!-- Mobile logo -->
          <div class="mb-6 flex items-center gap-2 md:hidden">
            <div
              class="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#f97316] to-[#ea580c] text-lg font-black text-white shadow-[0_4px_10px_rgba(249,115,22,0.3)]"
            >
              S
            </div>
            <span class="text-lg font-black text-[#111827]"
              >SMART<span class="text-[#f97316]">FOOD</span></span
            >
          </div>

          <!-- Heading -->
          <div class="mb-7">
            <p
              class="mb-1 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[#f97316]"
            >
              Bắt đầu ngay hôm nay 🌟
            </p>
            <h2 class="m-0 mb-1 text-[1.75rem] font-black text-[#111827]">
              Tạo tài khoản
            </h2>
            <p class="text-sm text-[#9ca3af]">
              Chỉ mất 1 phút để tham gia SmartFood
            </p>
          </div>

          <!-- ===== CUSTOM STEPPER ===== -->
          <div class="mb-8 flex items-center" aria-label="Các bước đăng ký">
            <template v-for="(s, i) in steps" :key="s.label">
              <!-- Step circle -->
              <div
                class="relative z-[1] flex flex-col items-center gap-[0.4rem]"
              >
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] text-[0.9rem] font-bold transition-all duration-[400ms] ease-in-out"
                  :class="
                    currentStep > i + 1
                      ? 'border-[#f97316] bg-[#f97316] text-white'
                      : currentStep === i + 1
                        ? 'border-[#f97316] text-[#f97316] [animation:stepPulse_1.5s_ease-in-out_infinite] shadow-[0_0_0_0_rgba(249,115,22,0.4)]'
                        : 'border-[#d1d5db] bg-white text-[#9ca3af]'
                  "
                >
                  <svg
                    v-if="currentStep > i + 1"
                    viewBox="0 0 16 16"
                    class="h-4 w-4"
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
                <span
                  class="whitespace-nowrap text-[0.7rem] font-semibold transition-colors duration-300"
                  :class="
                    currentStep >= i + 1 ? 'text-[#f97316]' : 'text-[#9ca3af]'
                  "
                >
                  {{ s.label }}
                </span>
              </div>

              <!-- Connector line (not after last) -->
              <div
                v-if="i < steps.length - 1"
                class="relative mb-[1.4rem] mx-1.5 h-[3px] flex-1 overflow-hidden rounded-full bg-[#e5e7eb]"
              >
                <div
                  class="h-full rounded-full bg-[#f97316] transition-[width] duration-500 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
                  :class="currentStep > i + 1 ? 'w-full' : 'w-0'"
                />
              </div>
            </template>
          </div>

          <!-- ===== STEP CONTENT ===== -->
          <div
            class="relative min-h-[300px] overflow-hidden"
            :class="
              isShaking
                ? '[animation:shakeForm_0.5s_cubic-bezier(0.36,0.07,0.19,0.97)_both]'
                : ''
            "
          >
            <!-- STEP 1: Basic Info -->
            <Transition :name="transitionName" mode="out-in">
              <div v-if="currentStep === 1" key="step1" class="step-pane pb-2">
                <p class="mb-5 text-[0.9rem] font-bold text-[#374151]">
                  📋 Thông tin cơ bản
                </p>

                <!-- Full Name -->
                <div class="mb-4">
                  <label
                    class="mb-1.5 block text-sm font-semibold text-[#374151]"
                    >Họ và tên <span class="text-[#ef4444]">*</span></label
                  >
                  <div class="relative">
                    <span
                      class="pointer-events-none absolute bottom-0 left-3.5 top-0 z-10 flex items-center text-sm text-[#9ca3af]"
                      ><i class="pi pi-user"
                    /></span>
                    <InputText
                      v-model="form.name"
                      placeholder="Nguyễn Văn A"
                      :invalid="!!step1Errors.name"
                      class="h-[42px] w-full rounded-[12px] border-[#e5e7eb] pl-11 text-sm transition-[border-color,box-shadow] duration-200 focus:border-[#f97316] focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)] focus:outline-none"
                      aria-label="Họ và tên"
                    />
                  </div>
                  <small
                    v-if="step1Errors.name"
                    class="mt-1 block text-xs text-[#ef4444]"
                    >{{ step1Errors.name }}</small
                  >
                </div>

                <!-- Email -->
                <div class="mb-4">
                  <label
                    class="mb-1.5 block text-sm font-semibold text-[#374151]"
                    >Email <span class="text-[#ef4444]">*</span></label
                  >
                  <div class="relative">
                    <span
                      class="pointer-events-none absolute bottom-0 left-3.5 top-0 z-10 flex items-center text-sm text-[#9ca3af]"
                      ><i class="pi pi-envelope"
                    /></span>
                    <InputText
                      v-model="form.email"
                      type="email"
                      placeholder="your@email.com"
                      :invalid="!!step1Errors.email"
                      class="h-[42px] w-full rounded-[12px] border-[#e5e7eb] pl-11 text-sm transition-[border-color,box-shadow] duration-200 focus:border-[#f97316] focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)] focus:outline-none"
                      aria-label="Email"
                    />
                  </div>
                  <small
                    v-if="step1Errors.email"
                    class="mt-1 block text-xs text-[#ef4444]"
                    >{{ step1Errors.email }}</small
                  >
                </div>

                <!-- Phone -->
                <div class="mb-4">
                  <label
                    class="mb-1.5 block text-sm font-semibold text-[#374151]"
                    >Số điện thoại <span class="text-[#ef4444]">*</span></label
                  >
                  <div class="flex items-center gap-0">
                    <div
                      class="flex h-[42px] shrink-0 items-center whitespace-nowrap rounded-l-[12px] rounded-r-none border border-r-0 border-[#e5e7eb] bg-[#f9fafb] px-3.5 text-sm font-semibold text-[#374151]"
                    >
                      <span class="text-base">🇻🇳</span>
                      <span>+84</span>
                    </div>
                    <InputText
                      v-model="form.phone"
                      type="tel"
                      placeholder="9x xxx xxxx"
                      :invalid="!!step1Errors.phone"
                      class="h-[42px] w-full rounded-r-[12px] rounded-l-none border-[#e5e7eb] pl-11 text-sm transition-[border-color,box-shadow] duration-200 focus:border-[#f97316] focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)] focus:outline-none"
                      aria-label="Số điện thoại"
                    />
                  </div>
                  <small
                    v-if="step1Errors.phone"
                    class="mt-1 block text-xs text-[#ef4444]"
                    >{{ step1Errors.phone }}</small
                  >
                </div>

                <button
                  class="mt-5 flex w-full items-center justify-center gap-2 rounded-[12px] border-none bg-gradient-to-br from-[#f97316] to-[#ea580c] px-6 py-[0.8rem] text-[0.9rem] font-bold text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] transition-[transform,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(249,115,22,0.5)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-65"
                  @click="goNext(1)"
                >
                  Tiếp theo <i class="pi pi-arrow-right" />
                </button>
              </div>
            </Transition>

            <!-- STEP 2: Security -->
            <Transition :name="transitionName" mode="out-in">
              <div v-if="currentStep === 2" key="step2" class="step-pane pb-2">
                <p class="mb-5 text-[0.9rem] font-bold text-[#374151]">
                  🔐 Bảo mật tài khoản
                </p>

                <!-- Password -->
                <div class="mb-4">
                  <label
                    class="mb-1.5 block text-sm font-semibold text-[#374151]"
                    >Mật khẩu <span class="text-[#ef4444]">*</span></label
                  >
                  <div class="relative">
                    <span
                      class="pointer-events-none absolute bottom-0 left-3.5 top-0 z-10 flex items-center text-sm text-[#9ca3af]"
                      ><i class="pi pi-lock"
                    /></span>
                    <Password
                      v-model="form.password"
                      :feedback="false"
                      :toggle-mask="true"
                      placeholder="Ít nhất 8 ký tự"
                      :invalid="!!step2Errors.password"
                      input-class="h-[42px] w-full rounded-[12px] border-[#e5e7eb] pl-11 text-sm transition-[border-color,box-shadow] duration-200 focus:border-[#f97316] focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)] focus:outline-none"
                      class="w-full"
                      aria-label="Mật khẩu"
                      @update:model-value="updateStrength"
                    />
                  </div>

                  <!-- Strength meter -->
                  <div v-if="form.password" class="mt-2.5">
                    <div
                      class="mb-1.5 h-[6px] overflow-hidden rounded-full bg-[#e5e7eb]"
                    >
                      <div
                        class="h-full rounded-full transition-[width,background] duration-500"
                        :style="{
                          width: strengthWidth,
                          background: strengthColor,
                        }"
                      />
                    </div>
                    <span
                      class="text-xs font-bold"
                      :style="{ color: strengthColor }"
                      >{{ strengthLabel }}</span
                    >
                  </div>

                  <small
                    v-if="step2Errors.password"
                    class="mt-1 block text-xs text-[#ef4444]"
                    >{{ step2Errors.password }}</small
                  >
                </div>

                <!-- Confirm Password -->
                <div class="mb-4">
                  <label
                    class="mb-1.5 block text-sm font-semibold text-[#374151]"
                    >Xác nhận mật khẩu
                    <span class="text-[#ef4444]">*</span></label
                  >
                  <div class="relative">
                    <span
                      class="pointer-events-none absolute bottom-0 left-3.5 top-0 z-10 flex items-center text-sm text-[#9ca3af]"
                      ><i class="pi pi-lock"
                    /></span>
                    <Password
                      v-model="form.confirmPassword"
                      :feedback="false"
                      :toggle-mask="true"
                      placeholder="Nhập lại mật khẩu"
                      :invalid="!!step2Errors.confirmPassword"
                      input-class="h-[42px] w-full rounded-[12px] border-[#e5e7eb] pl-11 text-sm transition-[border-color,box-shadow] duration-200 focus:border-[#f97316] focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)] focus:outline-none"
                      class="w-full"
                      aria-label="Xác nhận mật khẩu"
                    />
                  </div>
                  <small
                    v-if="step2Errors.confirmPassword"
                    class="mt-1 block text-xs text-[#ef4444]"
                    >{{ step2Errors.confirmPassword }}</small
                  >
                </div>

                <!-- Password rules hint -->
                <div
                  class="mt-2 grid grid-cols-2 gap-2 rounded-[12px] border border-[#f3f4f6] bg-[#fafafa] p-3.5"
                >
                  <div
                    v-for="rule in passwordRules"
                    :key="rule.label"
                    class="flex items-center gap-1.5 text-[0.72rem] transition-colors duration-300"
                    :class="rule.met ? 'text-[#16a34a]' : 'text-[#9ca3af]'"
                  >
                    <i
                      :class="
                        rule.met
                          ? 'pi pi-check-circle text-[#16a34a]'
                          : 'pi pi-circle text-[0.7rem]'
                      "
                    />
                    {{ rule.label }}
                  </div>
                </div>

                <div class="mt-5 flex gap-3">
                  <button
                    class="flex items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#e5e7eb] bg-white px-5 py-[0.8rem] text-sm font-semibold text-[#374151] transition-[border-color,background,color] duration-200 hover:border-[#f97316] hover:bg-[#fff7ed] hover:text-[#f97316]"
                    @click="goBack"
                  >
                    <i class="pi pi-arrow-left" /> Quay lại
                  </button>
                  <button
                    class="mt-0 flex flex-1 items-center justify-center gap-2 rounded-[12px] border-none bg-gradient-to-br from-[#f97316] to-[#ea580c] px-6 py-[0.8rem] text-[0.9rem] font-bold text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] transition-[transform,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(249,115,22,0.5)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-65"
                    @click="goNext(2)"
                  >
                    Tiếp theo <i class="pi pi-arrow-right" />
                  </button>
                </div>
              </div>
            </Transition>

            <!-- STEP 3: Confirm -->
            <Transition :name="transitionName" mode="out-in">
              <div v-if="currentStep === 3" key="step3" class="step-pane pb-2">
                <p class="mb-5 text-[0.9rem] font-bold text-[#374151]">
                  ✅ Xác nhận thông tin
                </p>

                <!-- Info review card -->
                <div
                  class="relative mb-5 flex items-center gap-4 rounded-[14px] border-[1.5px] border-[#fed7aa] bg-[linear-gradient(135deg,#fff7ed,#fef9ec)] p-4"
                >
                  <div
                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] text-[1.25rem] font-black text-white"
                  >
                    {{ form.name.charAt(0).toUpperCase() || "?" }}
                  </div>
                  <div>
                    <div class="mb-1 text-[0.9rem] font-bold text-[#111827]">
                      {{ form.name }}
                    </div>
                    <div
                      class="mt-0.5 flex items-center gap-1.5 text-[0.78rem] text-[#6b7280]"
                    >
                      <i class="pi pi-envelope text-[0.7rem] text-[#f97316]" />
                      {{ form.email }}
                    </div>
                    <div
                      class="mt-0.5 flex items-center gap-1.5 text-[0.78rem] text-[#6b7280]"
                    >
                      <i class="pi pi-phone text-[0.7rem] text-[#f97316]" />
                      +84 {{ form.phone }}
                    </div>
                  </div>
                  <button
                    class="absolute right-3 top-2.5 border-none bg-transparent p-1.5 text-sm text-[#f97316] hover:text-[#ea580c]"
                    title="Chỉnh sửa"
                    @click="currentStep = 1"
                  >
                    <i class="pi pi-pencil" />
                  </button>
                </div>

                <!-- Agreements -->
                <div class="mb-4">
                  <div class="flex items-start gap-2.5">
                    <Checkbox
                      v-model="form.agreeTerms"
                      input-id="terms"
                      :binary="true"
                      :invalid="!!step3Errors.agreeTerms"
                    />
                    <label
                      for="terms"
                      class="cursor-pointer text-sm leading-6 text-[#4b5563]"
                    >
                      Tôi đồng ý với
                      <NuxtLink
                        :to="ROUTES.TERMS_OF_SERVICE"
                        class="font-semibold text-[#f97316] no-underline hover:underline"
                        >Điều khoản dịch vụ</NuxtLink
                      >
                      và
                      <NuxtLink
                        :to="ROUTES.PRIVACY_POLICY"
                        class="font-semibold text-[#f97316] no-underline hover:underline"
                        >Chính sách bảo mật</NuxtLink
                      >
                      <span class="text-[#ef4444]"> *</span>
                    </label>
                  </div>
                  <small
                    v-if="step3Errors.agreeTerms"
                    class="ml-7 mt-1 block text-xs text-[#ef4444]"
                    >{{ step3Errors.agreeTerms }}</small
                  >
                </div>

                <div class="mb-4">
                  <div class="flex items-start gap-2.5">
                    <Checkbox
                      v-model="form.agreePromo"
                      input-id="promo"
                      :binary="true"
                    />
                    <label
                      for="promo"
                      class="cursor-pointer text-sm leading-6 text-[#4b5563]"
                      >Nhận thông báo khuyến mãi qua email</label
                    >
                  </div>
                </div>

                <div class="mt-5 flex gap-3">
                  <button
                    class="flex items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#e5e7eb] bg-white px-5 py-[0.8rem] text-sm font-semibold text-[#374151] transition-[border-color,background,color] duration-200 hover:border-[#f97316] hover:bg-[#fff7ed] hover:text-[#f97316]"
                    @click="goBack"
                  >
                    <i class="pi pi-arrow-left" /> Quay lại
                  </button>
                  <button
                    class="mt-0 flex flex-1 items-center justify-center gap-2 rounded-[12px] border-none bg-gradient-to-br from-[#f97316] to-[#ea580c] px-6 py-[0.8rem] text-[0.9rem] font-bold text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] transition-[transform,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(249,115,22,0.5)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-65"
                    :disabled="loading"
                    @click="handleSubmit"
                  >
                    <svg
                      v-if="loading"
                      class="h-4 w-4 shrink-0 animate-[spin_0.8s_linear_infinite]"
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
          <p class="mt-5 text-center text-sm text-[#6b7280]">
            Đã có tài khoản?
            <NuxtLink
              :to="ROUTES.AUTH.LOGIN"
              class="ml-1 font-bold text-[#f97316] no-underline hover:text-[#ea580c] hover:underline"
              >Đăng nhập →</NuxtLink
            >
          </p>
        </div>
      </div>

      <!-- ===== RIGHT BRAND PANEL ===== -->
      <div
        class="relative order-2 hidden shrink-0 flex-col items-center justify-center overflow-hidden md:flex md:w-[40%]"
      >
        <div
          class="absolute inset-0 bg-[linear-gradient(135deg,#f97316_0%,#ea580c_55%,#c2410c_100%)] [animation:gradientShift_8s_ease_infinite_alternate]"
        />
        <div class="absolute inset-0 opacity-[0.08]">
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

        <span
          class="pointer-events-none absolute left-8 top-14 select-none text-[2.5rem] float-bob"
          style="animation-delay: 0s; animation-duration: 3.2s"
        >
          🍊
        </span>

        <span
          class="pointer-events-none absolute right-10 top-28 select-none text-[2.2rem] float-bob"
          style="animation-delay: 0s; animation-duration: 3.2s"
        >
          🥑
        </span>

        <span
          class="pointer-events-none absolute bottom-16 right-8 select-none text-[2.5rem] float-bob"
          style="animation-delay: 0s; animation-duration: 3.2s"
        >
          🌽
        </span>

        <span
          class="pointer-events-none absolute left-5 top-[45%] select-none text-[1.8rem] float-bob"
          style="animation-delay: 0s; animation-duration: 3.2s"
        >
          🥝
        </span>

        <div class="relative z-10 w-full px-8 text-center text-white">
          <!-- Logo -->
          <NuxtLink :to="ROUTES.HOME">
            <div class="mb-7 flex flex-col items-center">
              <div
                class="mb-3 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.2)] backdrop-blur-[8px] shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
              >
                <svg
                  viewBox="0 0 48 48"
                  class="h-11 w-11"
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
              <h1 class="m-0 text-[2rem] font-black tracking-[0.15em]">
                SMARTFOOD
              </h1>
              <div
                class="mt-2.5 h-[3px] w-14 rounded-full bg-[rgba(255,255,255,0.35)]"
              />
            </div>
          </NuxtLink>

          <p
            class="mb-8 text-[1.05rem] font-semibold leading-[1.7] text-[rgba(255,255,255,0.9)]"
          >
            Tươi ngon mỗi ngày<br /><strong class="text-white"
              >Đặt hàng siêu tốc</strong
            >
          </p>

          <!-- Step progress illustration -->
          <div class="flex flex-col gap-4 text-left">
            <div
              v-for="(s, i) in steps"
              :key="s.label"
              class="flex items-center gap-3.5 rounded-[14px] border p-[0.875rem_1rem] backdrop-blur-[4px] transition-all duration-[400ms] ease-[ease]"
              :class="
                currentStep > i
                  ? 'scale-[1.02] border-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.25)] opacity-100 shadow-[0_4px_16px_rgba(0,0,0,0.1)]'
                  : 'border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.1)] opacity-60'
              "
            >
              <div class="shrink-0 text-2xl">{{ s.icon }}</div>
              <div>
                <div class="text-sm font-bold text-white">
                  {{ s.brandTitle }}
                </div>
                <div class="mt-0.5 text-xs text-[rgba(255,255,255,0.8)]">
                  {{ s.brandDesc }}
                </div>
              </div>
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

useHead({
  title: "Đăng ký - SmartFood",
  meta: [{ name: "description", content: "Trang Đăng ký của SmartFood" }],
});

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

.step-pane {
  width: 100%;
}

/* ========================================
   STEP SLIDE TRANSITIONS
   ======================================== */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition:
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.32s ease;
  will-change: transform, opacity;
}

.slide-forward-leave-active,
.slide-back-leave-active {
  position: absolute;
  inset: 0;
  width: 100%;
}

.slide-forward-enter-from {
  opacity: 0;
  transform: translate3d(24px, 0, 0);
}
.slide-forward-leave-to {
  opacity: 0;
  transform: translate3d(-24px, 0, 0);
}

.slide-back-enter-from {
  opacity: 0;
  transform: translate3d(-24px, 0, 0);
}
.slide-back-leave-to {
  opacity: 0;
  transform: translate3d(24px, 0, 0);
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

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: #f97316 !important;
  border-color: #f97316 !important;
}
:deep(.p-checkbox .p-checkbox-box:focus) {
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2) !important;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
</style>
