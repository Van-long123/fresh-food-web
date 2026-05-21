<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ROUTES } from "~/constants/routes";

const openDropdowns = ref<Record<string, boolean>>({
  catalog: false,
  sales: false,
  management: false,
});

const toggleDropdown = (key: string) => {
  openDropdowns.value[key] = !openDropdowns.value[key];
};

const isSidebarOpen = useState("adminSidebarOpen", () => false);

const route = useRoute();
watch(
  () => route.path,
  () => {
    isSidebarOpen.value = false;
  },
);
</script>

<template>
  <aside
    id="sidebar"
    :class="[
      isSidebarOpen ? 'flex' : 'hidden',
      'fixed top-0 left-0 z-40 h-full w-64 flex-col pt-20 font-normal transition-width duration-75 lg:flex',
    ]"
    aria-label="Sidebar"
  >
    <div
      class="relative flex min-h-0 flex-1 border-r border-slate-200/60 bg-white/90 pt-0 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80"
    >
      <div class="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
        <div class="flex-1 space-y-6 bg-transparent px-4">
          <!-- ── Section: Main ── -->
          <div class="space-y-1.5">
            <span
              class="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block"
            >
              Tổng quan
            </span>
            <ul class="space-y-1">
              <li>
                <NuxtLink
                  :to="ROUTES.ADMIN.DASHBOARD"
                  class="flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  exact-active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                >
                  <svg
                    class="h-5 w-5 text-slate-400 transition dark:text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path
                      d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
                    ></path>
                  </svg>
                  <span>Tổng quan</span>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- ── Section: Business ── -->
          <div class="space-y-1.5">
            <span
              class="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block"
            >
              Kinh doanh
            </span>
            <ul class="space-y-1">
              <!-- Catalog Group -->
              <li>
                <button
                  type="button"
                  class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  @click="toggleDropdown('catalog')"
                >
                  <svg
                    class="h-5 w-5 text-slate-400 transition dark:text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                      d="M.99 5.24A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25l.01 9.5A2.25 2.25 0 0116.76 17H3.26A2.267 2.267 0 011 14.74l-.01-9.5zm8.26 9.52v-.625a.75.75 0 00-.75-.75H3.25a.75.75 0 00-.75.75v.615c0 .414.336.75.75.75h5.373a.75.75 0 00.627-.74zm1.5 0a.75.75 0 00.627.74h5.373a.75.75 0 00.75-.75v-.615a.75.75 0 00-.75-.75H11.5a.75.75 0 00-.75.75v.625zm6.75-3.63v-.625a.75.75 0 00-.75-.75H11.5a.75.75 0 00-.75.75v.625c0 .414.336.75.75.75h5.25a.75.75 0 00.75-.75zm-8.25 0v-.625a.75.75 0 00-.75-.75H3.25a.75.75 0 00-.75.75v.625c0 .414.336.75.75.75H8.5a.75.75 0 00.75-.75zM17.5 7.5v-.625a.75.75 0 00-.75-.75H11.5a.75.75 0 00-.75.75V7.5c0 .414.336.75.75.75h5.25a.75.75 0 00.75-.75zm-8.25 0v-.625a.75.75 0 00-.75-.75H3.25a.75.75 0 00-.75.75V7.5c0 .414.336.75.75.75H8.5a.75.75 0 00.75-.75z"
                    ></path>
                  </svg>
                  <span class="flex-1 text-left whitespace-nowrap"
                    >Sản phẩm</span
                  >

                  <svg
                    class="h-5 w-5 transition-transform duration-200"
                    :class="{ 'rotate-180': openDropdowns.catalog }"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
                <ul
                  v-show="openDropdowns.catalog"
                  class="ml-5 mt-1 pl-3 border-l border-slate-200/60 dark:border-slate-800 space-y-1 py-1"
                >
                  <li>
                    <NuxtLink
                      :to="ROUTES.ADMIN.PRODUCTS"
                      class="flex items-center rounded-lg px-3 py-1.5 text-[15px] text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                      active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                    >
                      Danh sách sản phẩm
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      :to="ROUTES.ADMIN.CATEGORIES"
                      class="flex items-center rounded-lg px-3 py-1.5 text-[15px] text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                      active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                    >
                      Danh mục
                    </NuxtLink>
                  </li>
                </ul>
              </li>

              <!-- Sales Group -->
              <li>
                <button
                  type="button"
                  class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  @click="toggleDropdown('sales')"
                >
                  <svg
                    class="h-5 w-5 text-slate-400 transition dark:text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    ></path>
                  </svg>
                  <span class="flex-1 text-left whitespace-nowrap"
                    >Bán hàng</span
                  >
                  <svg
                    class="h-5 w-5 transition-transform duration-200"
                    :class="{ 'rotate-180': openDropdowns.sales }"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
                <ul
                  v-show="openDropdowns.sales"
                  class="ml-5 mt-1 pl-3 border-l border-slate-200/60 dark:border-slate-800 space-y-1 py-1"
                >
                  <li>
                    <NuxtLink
                      :to="ROUTES.ADMIN.ORDERS"
                      class="flex items-center rounded-lg px-3 py-1.5 text-[15px] text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                      active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                    >
                      Đơn hàng
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      :to="ROUTES.ADMIN.VOUCHERS"
                      class="flex items-center rounded-lg px-3 py-1.5 text-[15px] text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                      active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                    >
                      Mã giảm giá
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      :to="ROUTES.ADMIN.PAYMENTS"
                      class="flex items-center rounded-lg px-3 py-1.5 text-[15px] text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                      active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                    >
                      Thanh toán
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      :to="ROUTES.ADMIN.REFUND_REQUESTS"
                      class="flex items-center rounded-lg px-3 py-1.5 text-[15px] text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                      active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                    >
                      Yêu cầu hoàn tiền
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- ── Section: Content & Feedback ── -->
          <div class="space-y-1.5">
            <span
              class="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block"
            >
              Nội dung & phản hồi
            </span>
            <ul class="space-y-1">
              <!-- Management Group (Reviews & Articles) -->
              <li>
                <button
                  type="button"
                  class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  @click="toggleDropdown('management')"
                >
                  <svg
                    class="h-5 w-5 text-slate-400 transition dark:text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2v3m2-3V9m0 0a2 2 0 100 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span class="flex-1 text-left whitespace-nowrap"
                    >Nội dung</span
                  >
                  <svg
                    class="h-5 w-5 transition-transform duration-200"
                    :class="{ 'rotate-180': openDropdowns.management }"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
                <ul
                  v-show="openDropdowns.management"
                  class="ml-5 mt-1 pl-3 border-l border-slate-200/60 dark:border-slate-800 space-y-1 py-1"
                >
                  <li>
                    <NuxtLink
                      :to="ROUTES.ADMIN.ARTICLES"
                      class="flex items-center rounded-lg px-3 py-1.5 text-[15px] text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                      active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                    >
                      Bài viết
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      :to="ROUTES.ADMIN.REVIEWS"
                      class="flex items-center rounded-lg px-3 py-1.5 text-[15px] text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                      active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                    >
                      Đánh giá
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- ── Section: Administration ── -->
          <div class="space-y-1.5">
            <span
              class="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block"
            >
              Quản trị hệ thống
            </span>
            <ul class="space-y-1">
              <!-- Users -->
              <li>
                <NuxtLink
                  :to="ROUTES.ADMIN.USERS"
                  class="flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                >
                  <svg
                    class="h-5 w-5 text-slate-400 transition dark:text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>Người dùng</span>
                </NuxtLink>
              </li>

              <!-- Roles -->
              <li>
                <NuxtLink
                  :to="ROUTES.ADMIN.ROLES"
                  class="flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                >
                  <svg
                    class="h-5 w-5 text-slate-400 transition dark:text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                  <span>Vai trò</span>
                </NuxtLink>
              </li>

              <!-- Settings -->
              <li>
                <NuxtLink
                  :to="ROUTES.ADMIN.SETTINGS"
                  class="flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                >
                  <svg
                    class="h-5 w-5 text-slate-400 transition dark:text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>Cài đặt</span>
                </NuxtLink>
              </li>

              <!-- Maintenance -->
              <li>
                <NuxtLink
                  :to="ROUTES.ADMIN.MAINTENANCE"
                  class="flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                >
                  <svg
                    class="h-5 w-5 text-slate-400 transition dark:text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
                    ></path>
                  </svg>
                  <span>Bảo trì</span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
