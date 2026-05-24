<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import InputText from "primevue/inputtext";
import Popover from "primevue/popover";
import { ROUTES } from "~/constants/routes";
import { resolveBreadcrumbs } from "~/utils/breadcrumb";
import { useAuthStore } from "~/stores/useAuthStore";

const isSidebarOpen = useState("adminSidebarOpen", () => false);
const route = useRoute();

const authStore = useAuthStore();
const isLoggingOut = ref(false);

const userName = computed(() => authStore.user?.fullname || "Quản trị viên");
const userEmail = computed(() => authStore.user?.email || "admin@smartfood.vn");
const userAvatar = computed(() => authStore.user?.avatar);

watch(
  () => authStore.user?.avatar,
  (val) => {
    console.log("🚀 ~ val:", val);
  },
);
const userRole = computed(() =>
  authStore.user?.role === "admin" ? "Quản trị viên" : "Quản trị viên",
);

const breadcrumbs = computed(() => {
  return resolveBreadcrumbs(route.path, route.params);
});

const userPopover = ref();

const toggleUserMenu = (event: Event) => {
  userPopover.value?.toggle(event);
};

const handleLogout = async () => {
  isLoggingOut.value = true;
  setTimeout(() => {
    authStore.logout();
    userPopover.value?.hide();
    isLoggingOut.value = false;
    navigateTo("/");
  }, 800);
};
</script>

<template>
  <nav
    class="fixed z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80"
  >
    <div class="px-4 py-3 lg:px-6">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button
            id="toggleSidebarMobile"
            aria-expanded="true"
            aria-controls="sidebar"
            class="lg:hidden rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500"
            @click="isSidebarOpen = !isSidebarOpen"
          >
            <i class="pi pi-bars text-base"></i>
          </button>
          <div class="flex flex-col">
            <NuxtLink
              :to="ROUTES.ADMIN.DASHBOARD"
              class="flex items-center gap-2"
            >
              <span
                class="text-lg font-semibold uppercase tracking-tight text-slate-900 dark:text-white"
                >SmartFood</span
              >
              <span
                class="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-600 dark:bg-primary-500/10 dark:text-primary-300"
                >Quản trị</span
              >
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center gap-4 lg:gap-6">
          <nav
            class="hidden items-center gap-2 lg:flex"
            aria-label="Breadcrumb"
          >
            <ol class="inline-flex items-center space-x-1 md:space-x-2">
              <li
                v-for="(crumb, idx) in breadcrumbs"
                :key="idx"
                class="inline-flex items-center"
              >
                <!-- Separator -->
                <i
                  v-if="idx > 0"
                  class="pi pi-angle-right mx-1.5 text-[0.7rem] text-slate-400 dark:text-slate-500"
                ></i>

                <!-- Link Item -->
                <NuxtLink
                  v-if="crumb.to && !crumb.active"
                  :to="crumb.to"
                  class="text-xs font-medium text-slate-500 hover:text-primary-600 transition-colors dark:text-slate-400 dark:hover:text-primary-400"
                >
                  {{ crumb.label }}
                </NuxtLink>

                <!-- Active Item -->
                <span
                  v-else
                  class="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-default"
                >
                  {{ crumb.label }}
                </span>
              </li>
            </ol>
          </nav>
        </div>

        <div class="flex flex-1 items-center justify-end gap-3">
          <div class="hidden w-full max-w-md lg:block">
            <div class="relative w-full">
              <i
                class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"
              ></i>
              <InputText
                id="topbar-search"
                type="text"
                placeholder="Tìm đơn hàng, người dùng, sản phẩm"
                class="w-full pl-10!"
              />
            </div>
          </div>

          <!-- <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
          >
            <i class="pi pi-bell text-base"></i>
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
          >
            <i class="pi pi-moon text-base"></i>
          </button> -->

          <button
            id="user-menu-button-2"
            type="button"
            class="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-sm text-slate-600 shadow-sm shadow-slate-200/40 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
            @click="toggleUserMenu"
          >
            <img
              v-if="userAvatar"
              class="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
              :src="userAvatar"
              alt="user photo"
            />
            <div
              v-else
              class="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
            />
            <span class="hidden text-sm font-medium lg:inline">{{
              userName
            }}</span>
            <i class="pi pi-angle-down text-xs"></i>
          </button>

          <Popover
            ref="userPopover"
            append-to="body"
            :pt="{
              root: {
                class:
                  'border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl rounded-2xl overflow-hidden p-0',
              },
              content: { class: 'p-0' },
            }"
          >
            <div
              class="w-64 divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350"
            >
              <!-- User Information -->
              <div class="px-4 py-3.5 flex items-center gap-3">
                <img
                  class="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                  :src="userAvatar"
                  alt="user photo"
                />
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-semibold text-slate-900 dark:text-white truncate"
                  >
                    {{ userName }}
                  </p>
                  <p
                    class="text-xs text-slate-500 dark:text-slate-400 truncate"
                  >
                    {{ userEmail }}
                  </p>
                  <div class="mt-1">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
                    >
                      {{ userRole }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Menu Actions -->
              <div class="p-1 space-y-0.5">
                <NuxtLink
                  to="/admin/settings"
                  class="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-250 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition"
                  @click="userPopover.hide()"
                >
                  <i
                    class="pi pi-user text-slate-400 dark:text-slate-500 text-[0.85rem]"
                  ></i>
                  <span>Hồ sơ</span>
                </NuxtLink>
                <NuxtLink
                  to="/admin/settings"
                  class="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-250 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition"
                  @click="userPopover.hide()"
                >
                  <i
                    class="pi pi-key text-slate-400 dark:text-slate-500 text-[0.85rem]"
                  ></i>
                  <span>Đổi mật khẩu</span>
                </NuxtLink>
              </div>

              <!-- Danger Action -->
              <div class="p-1">
                <button
                  type="button"
                  :disabled="isLoggingOut"
                  class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition text-left cursor-pointer disabled:opacity-55"
                  @click="handleLogout"
                >
                  <i
                    v-if="isLoggingOut"
                    class="pi pi-spin pi-spinner text-[0.85rem]"
                  ></i>
                  <i v-else class="pi pi-sign-out text-[0.85rem]"></i>
                  <span>{{
                    isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"
                  }}</span>
                </button>
              </div>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  </nav>
</template>
