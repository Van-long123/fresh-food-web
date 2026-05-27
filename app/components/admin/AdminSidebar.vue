<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ROUTES } from "~/constants/routes";
import { PERMISSIONS } from "~/constants/permissions";
import { usePermissions } from "~/composables/auth/usePermissions";

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

const { hasPermission } = usePermissions();

const icons = {
  dashboard: "pi pi-chart-pie",
  catalog: "pi pi-box",
  sales: "pi pi-shopping-bag",
  content: "pi pi-file",
  users: "pi pi-users",
  roles: "pi pi-shield",
  settings: "pi pi-cog",
  maintenance: "pi pi-wrench",
};

const getIconClass = (icon: keyof typeof icons) => icons[icon];

const sections = computed(() => [
  {
    title: "Tổng quan",
    items: [
      {
        key: "dashboard",
        label: "Tổng quan",
        to: ROUTES.ADMIN.DASHBOARD,
        icon: "dashboard",
        permission: PERMISSIONS.DASHBOARD.VIEW,
      },
    ],
  },
  {
    title: "Kinh doanh",
    groups: [
      {
        key: "catalog",
        label: "Sản phẩm",
        icon: "catalog",
        items: [
          {
            key: "products",
            label: "Danh sách sản phẩm",
            to: ROUTES.ADMIN.PRODUCTS,
            permission: PERMISSIONS.PRODUCTS.VIEW,
          },
          {
            key: "categories",
            label: "Danh mục",
            to: ROUTES.ADMIN.CATEGORIES,
            permission: PERMISSIONS.CATEGORIES.VIEW,
          },
        ],
      },
      {
        key: "sales",
        label: "Bán hàng",
        icon: "sales",
        items: [
          {
            key: "orders",
            label: "Đơn hàng",
            to: ROUTES.ADMIN.ORDERS,
            permission: PERMISSIONS.ORDERS.VIEW,
          },
          {
            key: "vouchers",
            label: "Mã giảm giá",
            to: ROUTES.ADMIN.VOUCHERS,
            permission: PERMISSIONS.VOUCHERS.VIEW,
          },
          {
            key: "payments",
            label: "Thanh toán",
            to: ROUTES.ADMIN.PAYMENTS,
            permission: PERMISSIONS.PAYMENTS.VIEW,
          },
          {
            key: "refundRequests",
            label: "Yêu cầu hoàn tiền",
            to: ROUTES.ADMIN.REFUND_REQUESTS,
            permission: PERMISSIONS.REFUND_REQUESTS.VIEW,
          },
        ],
      },
    ],
  },
  {
    title: "Nội dung & phản hồi",
    groups: [
      {
        key: "management",
        label: "Nội dung",
        icon: "content",
        items: [
          {
            key: "articles",
            label: "Bài viết",
            to: ROUTES.ADMIN.ARTICLES,
            permission: PERMISSIONS.ARTICLES.VIEW,
          },
          {
            key: "reviews",
            label: "Đánh giá",
            to: ROUTES.ADMIN.REVIEWS,
            permission: PERMISSIONS.REVIEWS.VIEW,
          },
        ],
      },
    ],
  },
  {
    title: "Quản trị hệ thống",
    items: [
      {
        key: "users",
        label: "Người dùng",
        to: ROUTES.ADMIN.USERS,
        icon: "users",
        permission: PERMISSIONS.USERS.VIEW,
      },
      {
        key: "roles",
        label: "Vai trò",
        to: ROUTES.ADMIN.ROLES,
        icon: "roles",
        permission: PERMISSIONS.ROLES.VIEW,
      },
      {
        key: "settings",
        label: "Cài đặt",
        to: ROUTES.ADMIN.SETTINGS,
        icon: "settings",
        permission: PERMISSIONS.SETTINGS.VIEW,
      },
      {
        key: "maintenance",
        label: "Bảo trì",
        to: ROUTES.ADMIN.MAINTENANCE,
        icon: "maintenance",
        permission: PERMISSIONS.SETTINGS.VIEW,
      },
    ],
  },
]);

const filteredSections = computed(() =>
  sections.value
    .map((section) => {
      const items = (section.items || []).filter((item) =>
        hasPermission(item.permission),
      );
      const groups = (section.groups || [])
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => hasPermission(item.permission)),
        }))
        .filter((group) => group.items.length > 0);
      return { ...section, items, groups };
    })
    .filter(
      (section) =>
        (section.items && section.items.length > 0) ||
        (section.groups && section.groups.length > 0),
    ),
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
          <div
            v-for="section in filteredSections"
            :key="section.title"
            class="space-y-1.5"
          >
            <span
              class="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block"
            >
              {{ section.title }}
            </span>
            <ul class="space-y-1">
              <li v-for="item in section.items || []" :key="item.key">
                <NuxtLink
                  :to="item.to"
                  class="flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  exact-active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                >
                  <i
                    :class="[
                      getIconClass(item.icon as keyof typeof icons),
                      'text-slate-400 transition dark:text-slate-400',
                    ]"
                  ></i>
                  <span>{{ item.label }}</span>
                </NuxtLink>
              </li>

              <li v-for="group in section.groups || []" :key="group.key">
                <button
                  type="button"
                  class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  @click="toggleDropdown(group.key)"
                >
                  <i
                    :class="[
                      getIconClass(group.icon as keyof typeof icons),
                      'text-slate-400 transition dark:text-slate-400',
                    ]"
                  ></i>
                  <span class="flex-1 text-left whitespace-nowrap">
                    {{ group.label }}
                  </span>
                  <svg
                    class="h-5 w-5 transition-transform duration-200"
                    :class="{ 'rotate-180': openDropdowns[group.key] }"
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
                  v-show="openDropdowns[group.key]"
                  class="ml-5 mt-1 pl-3 border-l border-slate-200/60 dark:border-slate-800 space-y-1 py-1"
                >
                  <li v-for="item in group.items" :key="item.key">
                    <NuxtLink
                      :to="item.to"
                      class="flex items-center rounded-lg px-3 py-1.5 text-[15px] text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                      active-class="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 font-semibold"
                    >
                      {{ item.label }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
