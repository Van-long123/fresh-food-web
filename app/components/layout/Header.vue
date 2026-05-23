<template>
  <header
    class="sticky top-0 z-50 w-full text-white shadow-md transition-all duration-300"
  >
    <!-- Main Top Bar -->
    <div class="bg-[#f47f20]">
      <div
        class="max-w-360 mx-auto px-4 sm:px-6 flex items-center h-16 gap-4 sm:gap-8"
      >
        <!-- Logo -->
        <NuxtLink
          :to="ROUTES.HOME"
          class="shrink-0 flex items-center h-10 w-auto hover:opacity-90 transition-opacity"
        >
          <img
            :src="logoSrc"
            :alt="websiteDisplayName"
            class="h-full w-auto object-contain"
          />
        </NuxtLink>

        <!-- Search Bar -->
        <div class="flex-1 max-w-137.5 hidden md:block">
          <div
            class="relative flex items-center w-full h-9.5 rounded-full bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] focus-within:ring-2 focus-within:ring-[#ffd3aa] transition-all"
          >
            <div
              class="px-3.5 flex items-center justify-center text-[#2196f3] cursor-pointer"
              @click="handleSearch"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4.5 w-4.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm sản phẩm trong Smartfood..."
              class="w-full h-full outline-none text-[13px] text-gray-800 placeholder-gray-400 bg-transparent font-medium"
              @keyup.enter="handleSearch"
            />
          </div>
        </div>

        <!-- Header Links - Updated as requested -->
        <div
          class="hidden lg:flex items-center gap-5 text-[13px] font-semibold whitespace-nowrap shrink-0 ml-auto"
        >
          <NuxtLink
            :to="ROUTES.SUPPORT"
            class="hover:text-white/80 transition-colors flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Hỗ trợ khách hàng
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.NEWS"
            class="hover:text-white/80 transition-colors flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            Tin tức &amp; Sự kiện
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.VOUCHERS"
            class="hover:text-white/80 transition-colors flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            Voucher của tôi
          </NuxtLink>
          <!-- <NuxtLink
            :to="ROUTES.ABOUT"
            class="hover:text-white/80 transition-colors flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Về chúng tôi
          </NuxtLink> -->

          <span class="text-white/40 font-light mx-1">|</span>

          <button
            v-if="!authStore.isLoggedIn"
            class="flex items-center gap-2 hover:text-white/80 transition-colors cursor-pointer"
            @click="router.push(ROUTES.AUTH.LOGIN)"
          >
            <div class="bg-white/10 p-1.5 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div class="flex flex-col items-start leading-[1.1]">
              <span class="font-bold">Đăng nhập</span>
              <span class="text-[11px] font-normal text-white/90"
                >Tài khoản</span
              >
            </div>
          </button>

          <button
            v-else
            class="flex items-center gap-2 hover:text-white/80 transition-colors cursor-pointer"
            @click="router.push(ROUTES.PROFILE)"
          >
            <div class="bg-white/10 p-1.5 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div class="flex flex-col items-start leading-[1.1]">
              <span class="text-[11px] font-normal text-white/90"
                >Xin chào</span
              >
              <span class="font-bold line-clamp-1 max-w-28">{{
                headerDisplayName
              }}</span>
            </div>
          </button>

          <button
            class="flex items-center gap-2 hover:text-white/80 transition-colors ml-1 cursor-pointer"
            @click.stop="toggleCartPanel"
          >
            <div class="relative bg-white/10 p-1.5 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span
                class="absolute -top-1.5 -right-1.5 bg-red-600 border-[1.5px] border-[#f47f20] text-white text-[10px] font-black px-1 min-w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm"
                >{{ itemCount }}</span
              >
            </div>
            <div class="flex flex-col items-start leading-[1.1]">
              <span class="font-bold">Giỏ hàng</span>
              <span class="text-[11px] font-normal text-white/90">{{
                formatVnd(totalAmount)
              }}</span>
            </div>
          </button>
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          class="lg:hidden ml-auto flex items-center text-white cursor-pointer"
          @click="isMobileMenuOpen = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <Transition name="cart-backdrop">
      <div
        v-if="showCartPanel"
        class="fixed inset-0 z-55 bg-slate-900/20 backdrop-blur-[1px]"
        @click="showCartPanel = false"
      />
    </Transition>

    <Transition name="cart-popover">
      <section
        v-if="showCartPanel"
        ref="cartPanelRef"
        class="fixed right-4 top-18 z-60 w-[min(400px,92vw)] rounded-2xl border border-[#e5e7eb]/80 bg-white text-[#0f172a] shadow-[0_20px_50px_rgba(15,23,42,0.15)]"
        aria-label="Mini cart"
        @click.stop
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-3.5"
        >
          <div class="flex items-center gap-2.5">
            <h3 class="text-[15px] font-bold tracking-wide text-[#0f172a]">
              Giỏ hàng
            </h3>
            <span
              v-if="itemCount > 0"
              class="rounded-full bg-[#fff7ed] px-2 py-0.5 text-[11px] font-bold text-[#ea580c]"
              >{{ itemCount }} sản phẩm</span
            >
          </div>
          <button
            class="grid h-7 w-7 place-items-center rounded-lg text-[#94a3b8] transition hover:bg-[#fff1f2] hover:text-[#e11d48]"
            aria-label="Close mini cart"
            @click="showCartPanel = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <!-- Cart Items -->
        <div class="max-h-80 overflow-y-auto px-4 py-3">
          <div v-if="displayCartItems.length" class="space-y-2.5">
            <article
              v-for="item in displayCartItems"
              :key="item.id"
              class="group flex items-start gap-3 rounded-xl border border-[#f1f5f9] bg-[#fafbfc] p-2.5 transition-colors hover:border-[#e2e8f0] hover:bg-white"
              :class="{ 'opacity-50': item.isOutOfStock }"
            >
              <!-- Image -->
              <NuxtLink
                :to="ROUTES.PRODUCT_DETAIL(item.slug || '')"
                class="relative shrink-0 block"
                :class="{ 'pointer-events-none': item.isOutOfStock }"
                @click="showCartPanel = false"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="h-14 w-14 rounded-lg border border-[#e2e8f0] object-cover hover:opacity-80 transition-opacity"
                />
              </NuxtLink>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <NuxtLink
                    :to="ROUTES.PRODUCT_DETAIL(item.slug || '')"
                    class="line-clamp-2 text-[13px] font-semibold leading-snug text-[#1e293b] hover:text-[#f97316] transition-colors"
                    :class="{ 'pointer-events-none': item.isOutOfStock }"
                    @click="showCartPanel = false"
                  >
                    {{ item.name }}
                  </NuxtLink>
                  <button
                    class="shrink-0 grid h-6 w-6 place-items-center rounded-md text-[#cbd5e1] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                    :aria-label="`Remove ${item.name} from cart`"
                    @click="removeItem(item.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div class="mt-1.5 flex items-center justify-between">
                  <div
                    class="flex items-center gap-1"
                    aria-label="Quantity controls"
                  >
                    <button
                      class="qty-btn"
                      :disabled="isItemUpdating(item.id) || item.isOutOfStock"
                      :aria-label="`Decrease quantity for ${item.name}`"
                      @click="decreaseQty(item.id)"
                    >
                      −
                    </button>
                    <span
                      class="w-6 text-center text-[12px] font-bold text-[#334155]"
                      >{{ item.quantity }}</span
                    >
                    <button
                      class="qty-btn"
                      :disabled="isItemUpdating(item.id) || item.isOutOfStock"
                      :aria-label="`Increase quantity for ${item.name}`"
                      @click="increaseQty(item.id)"
                    >
                      +
                    </button>
                  </div>
                  <div class="text-right">
                    <p
                      v-if="item.isOutOfStock"
                      class="text-[11px] text-red-500 font-bold leading-none mb-1"
                    >
                      Hết hàng
                    </p>
                    <p
                      class="text-[14px] font-bold tracking-tight text-[#0f172a]"
                    >
                      {{ formatVnd(item.price * item.quantity) }}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <div
            v-else
            class="flex flex-col items-center justify-center py-6 px-4 text-center"
          >
            <div
              class="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mb-3"
            >
              <i class="pi pi-shopping-cart text-[#f47f20] text-xl"></i>
            </div>
            <p class="text-[13px] font-semibold text-gray-500 mb-3.5">
              Giỏ hàng của bạn đang trống
            </p>
            <NuxtLink
              :to="ROUTES.HOME"
              class="w-full h-9 rounded-lg bg-gradient-to-r from-[#f97316] to-[#ef4444] text-[12px] font-bold text-white flex items-center justify-center gap-2 hover:shadow-md hover:shadow-orange-200/50 transition-all"
              @click="showCartPanel = false"
            >
              Khám phá sản phẩm
            </NuxtLink>
          </div>
        </div>

        <!-- Footer -->
        <div
          v-if="displayCartItems.length"
          class="border-t border-[#f1f5f9] px-5 pb-4 pt-3.5"
        >
          <div class="flex items-center justify-between">
            <span class="text-[13px] font-semibold text-[#64748b]"
              >Tổng cộng</span
            >
            <strong
              class="text-xl font-extrabold tracking-tight text-[#ef4444]"
              >{{ formatVnd(totalAmount) }}</strong
            >
          </div>
          <div class="mt-3">
            <NuxtLink
              :to="ROUTES.CART"
              class="w-full h-10 rounded-lg bg-linear-to-r from-[#f97316] to-[#ef4444] text-[13px] font-bold text-white transition hover:shadow-md hover:shadow-orange-200/50 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              @click="showCartPanel = false"
            >
              Tiến hành thanh toán
            </NuxtLink>
            <!-- <button
              class="h-10 rounded-lg bg-linear-to-r from-[#f97316] to-[#ef4444] text-[13px] font-bold text-white transition hover:shadow-md hover:shadow-orange-200/50 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              aria-label="Proceed to checkout"
              :disabled="isValidating"
              @click="handleHeaderCheckout"
            >
              <i v-if="isValidating" class="pi pi-spinner pi-spin"></i>
              <span>{{ isValidating ? "Đang xử lý..." : "Thanh toán" }}</span>
            </button> -->
          </div>
        </div>
      </section>
    </Transition>

    <!-- PrimeVue Drawer for Mobile Navigation -->
    <Drawer
      v-model:visible="isMobileMenuOpen"
      position="right"
      :pt="{ root: { class: '!w-[300px] sm:!w-[350px] font-sans' } }"
    >
      <template #header>
        <div class="font-bold text-lg text-gray-800 flex items-center gap-2">
          <img
            :src="logoSrc"
            :alt="websiteDisplayName"
            class="h-8 w-auto object-contain"
          />
        </div>
      </template>

      <div class="flex flex-col gap-4 mt-2">
        <!-- Account Info -->
        <div
          class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100"
          @click="
            () => {
              isMobileMenuOpen = false;
              router.push(
                authStore.isLoggedIn ? ROUTES.PROFILE : ROUTES.AUTH.LOGIN,
              );
            }
          "
        >
          <div
            class="bg-orange-100 text-[#f47f20] p-2.5 rounded-full shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-[#f47f20] text-sm">
              {{ authStore.isLoggedIn ? "Xin chào" : "Đăng nhập / Đăng ký" }}
            </span>
            <span class="text-xs text-gray-500 font-medium">
              {{
                authStore.isLoggedIn ? headerDisplayName : "Quản lý tài khoản"
              }}
            </span>
          </div>
        </div>

        <!-- Mobile Links Structure matches Desktop -->
        <nav class="flex flex-col mt-2">
          <NuxtLink
            :to="ROUTES.SUPPORT"
            class="py-3.5 px-3 flex items-center gap-3 text-gray-700 font-medium border-b border-gray-100 hover:text-[#f47f20] hover:bg-orange-50/50 rounded-lg transition-colors"
            @click="isMobileMenuOpen = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400 group-hover:text-[#f47f20]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Hỗ trợ khách hàng
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.NEWS"
            class="py-3.5 px-3 flex items-center gap-3 text-gray-700 font-medium border-b border-gray-100 hover:text-[#f47f20] hover:bg-orange-50/50 rounded-lg transition-colors"
            @click="isMobileMenuOpen = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400 group-hover:text-[#f47f20]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            Tin tức & Sự kiện
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.ABOUT"
            class="py-3.5 px-3 flex items-center gap-3 text-gray-700 font-medium border-b border-gray-100 hover:text-[#f47f20] hover:bg-orange-50/50 rounded-lg transition-colors"
            @click="isMobileMenuOpen = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400 group-hover:text-[#f47f20]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Về chúng tôi
          </NuxtLink>
          <!-- Added Mobile specific features -->
          <NuxtLink
            :to="ROUTES.CART"
            class="py-3.5 px-3 flex items-center gap-3 text-gray-700 font-medium border-b border-gray-100 hover:text-[#f47f20] hover:bg-orange-50/50 rounded-lg transition-colors"
            @click="isMobileMenuOpen = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Giỏ hàng của bạn
            <span
              class="bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ml-auto"
              >{{ itemCount }}</span
            >
          </NuxtLink>
        </nav>
      </div>
    </Drawer>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ROUTES } from "~/constants/routes";
import { useCart } from "~/composables/cart/useCart";
import { useAuthStore } from "~/stores/useAuthStore";
import { useCheckout } from "~/composables/checkout/useCheckout";
import { useSettingsStore } from "~/stores/useSettingsStore";
import fallbackLogo from "@/assets/images/logo.png";

const router = useRouter();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const searchQuery = ref("");
const isMobileMenuOpen = ref(false);
const showCartPanel = ref(false);
const visibleNotice = ref(false);
const cartPanelRef = ref(null);

// ── Client Settings (từ store — không gọi lại API) ───────────────
const logoSrc = computed(() => {
  const logo = settingsStore.logo;
  return logo && logo.trim() !== ''
    ? logo
    : (fallbackLogo as unknown as string);
});

const websiteDisplayName = computed(() => settingsStore.websiteName);

const headerDisplayName = computed(() => {
  return authStore.user?.fullname || authStore.user?.email || "Tài khoản";
});

const {
  cartItems,
  itemCount,
  totalAmount,
  formatVnd,
  increaseQty,
  decreaseQty,
  removeItem,
  ensureCartReady,
  isItemUpdating,
} = useCart();

const { itemsOutOfStock } = useCheckout();

const displayCartItems = computed(() => {
  return [...cartItems.value]
    .filter((item) => !item.deleted && item.status !== "inactive")
    .sort((a, b) => {
      const aOOS =
        itemsOutOfStock.value?.has(a.id) || Number(a.stock || 0) === 0;
      const bOOS =
        itemsOutOfStock.value?.has(b.id) || Number(b.stock || 0) === 0;

      // 1. Đẩy sản phẩm hết hàng xuống dưới cùng
      if (aOOS !== bOOS) return aOOS ? 1 : -1;

      // 2. Sản phẩm còn hàng: Sắp xếp theo thời gian thêm vào (Mới nhất lên trên)
      const aTime = new Date(a.addedAt || 0).getTime();
      const bTime = new Date(b.addedAt || 0).getTime();
      return bTime - aTime;
    })
    .map((item) => {
      const isOutOfStock =
        itemsOutOfStock.value?.has(item.id) || Number(item.stock || 0) === 0;
      return {
        ...item,
        isOutOfStock,
      };
    });
});

const toggleCartPanel = () => {
  showCartPanel.value = !showCartPanel.value;
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: ROUTES.SEARCH,
      query: { q: searchQuery.value.trim() },
    });
    isMobileMenuOpen.value = false;
  }
};

// const handleHeaderCheckout = async () => {
//   if (cartItems.value.length === 0) return;

//   const checkoutPayload = {
//     products: cartItems.value.map((item) => ({
//       id: item.id,
//       title: item.name,
//       thumbnail: item.image || "",
//       quantity: item.quantity,
//       priceNew: item.price,
//       totalPrice: item.price * item.quantity,
//       categoryId: item.categoryId || null,
//     })),
//     voucherCode: undefined,
//     discountVoucher: 0,
//     shippingFee: 0,
//     subtotal: totalAmount.value,
//     grandTotal: totalAmount.value,
//   };

//   await proceedToCheckout(cartItems.value, checkoutPayload);
//   showCartPanel.value = false;
// };

const handleClickOutside = (event) => {
  if (!showCartPanel.value) return;
  const panel = cartPanelRef.value;
  if (!panel) return;
  const target = event.target;
  if (!(target instanceof Node)) return;
  if (panel.contains(target)) return;
  showCartPanel.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  ensureCartReady();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.qty-btn {
  width: 26px;
  height: 26px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #475569;
  background: #f8fafc;
  font-size: 14px;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.qty-btn:hover:not(:disabled) {
  background: #fff7ed;
  border-color: #f97316;
  color: #f97316;
}

.qty-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.cart-popover-enter-active,
.cart-popover-leave-active,
.cart-backdrop-enter-active,
.cart-backdrop-leave-active,
.cart-toast-enter-active,
.cart-toast-leave-active {
  transition: all 0.2s ease;
}

.cart-popover-enter-from,
.cart-popover-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.cart-backdrop-enter-from,
.cart-backdrop-leave-to {
  opacity: 0;
}

.cart-toast-enter-from,
.cart-toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

<style>
@keyframes toastProgress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}
</style>
