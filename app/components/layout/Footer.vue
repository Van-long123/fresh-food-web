<template>
  <footer
    class="bg-[#1e293b] text-gray-300 pt-16 pb-8 font-sans w-full border-t-[6px] border-[#f47f20]"
  >
    <div class="max-w-360 mx-auto px-4 sm:px-6">
      <!-- Top Section: Beautiful Brands & Newsletter -->
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14 border-b border-gray-700/50 pb-12"
      >
        <!-- Brand / Logo Side -->
        <div
          class="flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <div
            class="bg-white/10 p-3 rounded-2xl backdrop-blur-sm shadow-xl inline-block mb-6 ring-1 ring-white/20"
          >
            <!-- Sử dụng logo.png thực cho Footer -->
            <img
              src="@/assets/images/logo.png"
              alt="SmartFood"
              class="h-10 w-auto object-contain drop-shadow-lg filter brightness-110"
            />
          </div>
          <p
            class="text-[14px] text-gray-400 font-medium max-w-md leading-relaxed"
          >
            Hệ thống bán lẻ thực phẩm SmartFood – Mang đến cho bữa ăn người Việt
            những sản phẩm An Toàn, Tươi Ngon và Tiết Kiệm nhất. Nông sản từ
            nông trại đến bàn ăn.
          </p>
        </div>

        <!-- Info Side -->
        <div
          class="flex flex-col justify-center items-center lg:items-end gap-6"
        >
          <!-- Giờ hoạt động -->
          <div class="text-center lg:text-right">
            <h3
              class="text-white text-[15px] font-bold mb-4 uppercase tracking-wider flex items-center justify-center lg:justify-end gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-[#f47f20]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v6l4 2"
                />
              </svg>
              Giờ Hoạt Động
            </h3>
            <ul class="space-y-1 text-[13px] text-gray-400">
              <li>
                Thứ Hai – Thứ Sáu:
                <span class="text-white font-semibold">7:00 – 21:00</span>
              </li>
              <li>
                Thứ Bảy – Chủ Nhật:
                <span class="text-white font-semibold">8:00 – 20:00</span>
              </li>
              <li>
                Lễ, Tết:
                <span class="text-white font-semibold">8:00 – 18:00</span>
              </li>
            </ul>
          </div>

          <!-- Cam kết -->
          <div class="flex flex-wrap justify-center lg:justify-end gap-3">
            <div
              class="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2 text-[12px] text-gray-300 border border-white/10"
            >
              <svg
                class="h-4 w-4 text-[#f47f20] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Hàng tươi mỗi ngày
            </div>
            <div
              class="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2 text-[12px] text-gray-300 border border-white/10"
            >
              <svg
                class="h-4 w-4 text-[#f47f20] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              An toàn vệ sinh
            </div>
            <div
              class="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2 text-[12px] text-gray-300 border border-white/10"
            >
              <svg
                class="h-4 w-4 text-[#f47f20] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Giao hàng nhanh
            </div>
          </div>
        </div>
      </div>

      <!-- Main Info Links Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <!-- Company details -->
        <div class="col-span-1 lg:col-span-2 space-y-4 pr-0 lg:pr-10">
          <h3
            class="font-bold text-white text-[15px] mb-6 uppercase tracking-wider border-b border-gray-700/50 pb-3 inline-block"
          >
            Liên Hệ Trực Tiếp
          </h3>
          <h4 class="font-black text-[#f47f20] text-[16px]">
            CÔNG TY CỔ PHẦN SMART FOOD
          </h4>
          <ul class="space-y-3 text-[13px] text-gray-400">
            <li class="flex gap-3">
              <svg
                class="w-5 h-5 text-gray-500 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span>
                123 Nguyễn Văn Linh, phường Nam Dương, Quận Hải Châu, Thành phố
                Đà Nẵng, Việt Nam</span
              >
            </li>
            <li class="flex gap-3">
              <svg
                class="w-5 h-5 text-gray-500 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <span
                >GPĐKKD: 0313403198 do sở KH & ĐT TP. Đà Nẵng cấp ngày
                17/08/2015.</span
              >
            </li>
            <li class="flex items-center gap-3">
              <svg
                class="w-5 h-5 text-[#3b82f6] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
              <span
                >Tổng đài miễn phí:
                <strong class="text-[#3b82f6] text-[15px]">{{
                  CONTACT_INFO.HOTLINE
                }}</strong>
                (7:00 - 21:00)</span
              >
            </li>
            <li class="flex items-center gap-3">
              <svg
                class="w-5 h-5 text-[#f47f20] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              <span
                >Email:
                <a
                  :href="`mailto:${CONTACT_INFO.EMAIL}`"
                  class="hover:text-white transition-colors"
                  >{{ CONTACT_INFO.EMAIL }}</a
                ></span
              >
            </li>
          </ul>
        </div>

        <!-- Column 2 -->
        <div class="space-y-4">
          <h3
            class="font-bold text-white text-[15px] mb-6 uppercase tracking-wider border-b border-gray-700/50 pb-3 inline-block"
          >
            Về SmartFood
          </h3>
          <ul class="space-y-3 text-[13px] text-gray-400 font-medium">
            <li>
              <NuxtLink
                :to="ROUTES.ABOUT"
                class="hover:text-[#f47f20] hover:translate-x-1 block transition-all"
                >Giới thiệu công ty</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                :to="ROUTES.VISION_MISSION"
                class="hover:text-[#f47f20] hover:translate-x-1 block transition-all"
                >Tầm nhìn & sứ mệnh</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                :to="ROUTES.NEWS"
                class="hover:text-[#f47f20] hover:translate-x-1 block transition-all"
                >Tin tức & sự kiện</NuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- Column 3 -->
        <div class="space-y-4">
          <h3
            class="font-bold text-white text-[15px] mb-6 uppercase tracking-wider border-b border-gray-700/50 pb-3 inline-block"
          >
            Chính Sách & Hỗ Trợ
          </h3>
          <ul class="space-y-3 text-[13px] text-gray-400 font-medium">
            <li>
              <NuxtLink
                :to="ROUTES.TERMS_OF_SERVICE"
                class="hover:text-[#f47f20] hover:translate-x-1 block transition-all"
                >Điều khoản hoạt động</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                :to="ROUTES.PRIVACY_POLICY"
                class="hover:text-[#f47f20] hover:translate-x-1 block transition-all"
                >Chính sách bảo mật</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                :to="ROUTES.RETURNS"
                class="hover:text-[#f47f20] hover:translate-x-1 block transition-all"
                >Quy định đổi trả hàng</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                :to="ROUTES.REGISTRATION_GUIDE"
                class="hover:text-[#f47f20] hover:translate-x-1 block transition-all"
                >Hướng dẫn đăng ký tài khoản</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                :to="ROUTES.SHOPPING_GUIDE"
                class="hover:text-[#f47f20] hover:translate-x-1 block transition-all"
                >Hướng dẫn mua sắm online</NuxtLink
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- Socials & App Badges -->
      <div
        class="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-800 pt-8 mt-10"
      >
        <div class="flex items-center gap-4">
          <NuxtLink
            :to="ROUTES.HOME"
            class="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#1877f2] flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
              />
            </svg>
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.HOME"
            class="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#ff0000] flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.052-.072 1.972l-.008.104-.022.261-.01.104c-.048.519-.119 1.023-.22 1.402a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c1.16-.312 5.569-.334 6.18-.335h.142c.309 0 1.587.006 2.927.052l.17.006.087.004.171.007.171.007c1.11.049 2.167.128 2.654.26zM5.93 5.34v4.618l4.002-2.31z"
              />
            </svg>
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.HOME"
            class="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#0077b5] flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"
              />
            </svg>
          </NuxtLink>
        </div>

        <!-- Trust Badges -->
        <div class="flex items-center gap-4">
          <img
            src="@/assets/images/footer_logobct_img.png"
            alt="Bộ Công Thương"
            class="h-14 w-37 object-cover drop-shadow-md"
          />
          <div class="text-xs text-gray-500 font-medium">
            Bản quyền © 2026<br />SmartFood. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ROUTES } from "~/constants/routes";
import { CONTACT_INFO } from "~/constants/contact";
</script>
