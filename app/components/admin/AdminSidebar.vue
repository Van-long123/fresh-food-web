<script setup lang="ts">
import { ref } from "vue";
import { ROUTES } from "~/constants/routes";

const openDropdowns = ref<Record<string, boolean>>({
  crud: false,
  pages: false,
  auth: false,
});

const toggleDropdown = (key: string) => {
  openDropdowns.value[key] = !openDropdowns.value[key];
};
</script>

<template>
  <aside
    id="sidebar"
    class="fixed top-0 left-0 z-40 flex h-full w-64 flex-col pt-20 font-normal transition-width duration-75 lg:flex"
    aria-label="Sidebar"
  >
    <div
      class="relative flex min-h-0 flex-1 border-r border-slate-200/60 bg-white/90 pt-0 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80"
    >
      <div class="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
        <div class="flex-1 space-y-4 bg-transparent px-3">
          <ul class="pb-2 space-y-2">
            <li>
              <NuxtLink
                :to="ROUTES.ADMIN.DASHBOARD"
                class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                active-class="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
              >
                <svg
                  class="h-5 w-5 text-slate-400 transition group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span class="ml-3">Dashboard</span>
              </NuxtLink>
            </li>

            <li>
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="toggleDropdown('crud')"
              >
                <svg
                  class="h-5 w-5 text-slate-400 transition group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-white"
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
                <span class="flex-1 text-left whitespace-nowrap">Catalog</span>
                <svg
                  class="h-5 w-5 transition-transform duration-200"
                  :class="{ 'rotate-180': openDropdowns.crud }"
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
              <ul v-show="openDropdowns.crud" class="space-y-2 py-2">
                <li>
                  <NuxtLink
                    :to="ROUTES.ADMIN.PRODUCTS"
                    class="flex items-center rounded-xl px-3 py-2 pl-10 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    active-class="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    >Products</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink
                    :to="ROUTES.ADMIN.CATEGORIES"
                    class="flex items-center rounded-xl px-3 py-2 pl-10 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    active-class="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    >Categories</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink
                    :to="ROUTES.ADMIN.ORDERS"
                    class="flex items-center rounded-xl px-3 py-2 pl-10 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    active-class="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    >Orders</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink
                    :to="ROUTES.ADMIN.VOUCHERS"
                    class="flex items-center rounded-xl px-3 py-2 pl-10 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    active-class="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    >Vouchers</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink
                    :to="ROUTES.ADMIN.REVIEWS"
                    class="flex items-center rounded-xl px-3 py-2 pl-10 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    active-class="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    >Reviews</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink
                    :to="ROUTES.ADMIN.ARTICLES"
                    class="flex items-center rounded-xl px-3 py-2 pl-10 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    active-class="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    >Articles</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink
                    :to="ROUTES.ADMIN.ROLES"
                    class="flex items-center rounded-xl px-3 py-2 pl-10 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    active-class="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    >Roles</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink
                    :to="ROUTES.ADMIN.PAYMENTS"
                    class="flex items-center rounded-xl px-3 py-2 pl-10 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    active-class="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    >Payments</NuxtLink
                  >
                </li>
              </ul>
            </li>

            <li>
              <NuxtLink
                :to="ROUTES.ADMIN.USERS"
                class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                active-class="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
              >
                <svg
                  class="h-5 w-5 text-slate-400 transition group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-white"
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
                <span class="ml-3">Users</span>
              </NuxtLink>
            </li>

            <li>
              <NuxtLink
                :to="ROUTES.ADMIN.SETTINGS"
                class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                active-class="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
              >
                <svg
                  class="h-5 w-5 text-slate-400 transition group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-white"
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
                <span class="ml-3">Settings</span>
              </NuxtLink>
            </li>

            <li>
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="toggleDropdown('pages')"
              >
                <svg
                  class="h-5 w-5 text-slate-400 transition group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="flex-1 text-left whitespace-nowrap">Pages</span>
                <svg
                  class="h-5 w-5 transition-transform duration-200"
                  :class="{ 'rotate-180': openDropdowns.pages }"
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
              <ul v-show="openDropdowns.pages" class="space-y-2 py-2">
                <li>
                  <NuxtLink
                    :to="ROUTES.ADMIN.PRICING"
                    class="flex items-center rounded-xl px-3 py-2 pl-10 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >Pricing</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink
                    :to="ROUTES.ADMIN.MAINTENANCE"
                    class="flex items-center rounded-xl px-3 py-2 pl-10 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >Maintenance</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink
                    :to="ROUTES.ERROR_404"
                    class="flex items-center rounded-xl px-3 py-2 pl-10 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >404 Page</NuxtLink
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>
