<script setup lang="ts">
import InputText from "primevue/inputtext";
import { ROUTES } from "~/constants/routes";
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
            class="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500"
          >
            <i class="pi pi-bars text-base"></i>
          </button>
          <div class="flex flex-col">
            <NuxtLink :to="ROUTES.HOME" class="flex items-center gap-2">
              <span
                class="text-lg font-semibold uppercase tracking-tight text-slate-900 dark:text-white"
                >SmartFood</span
              >
              <span
                class="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-600 dark:bg-primary-500/10 dark:text-primary-300"
                >Admin</span
              >
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center gap-4 lg:gap-6">
          <div class="hidden items-center gap-2 lg:flex">
            <div class="flex items-center gap-1.5 text-xs">
              <i class="pi pi-angle-right text-[0.6rem]"></i>
              <span class="text-slate-500">Dashboard</span>
            </div>
          </div>
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
                placeholder="Search orders, users, products"
                class="w-full !pl-10"
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
            class="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-sm text-slate-600 shadow-sm shadow-slate-200/40 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <img
              class="h-8 w-8 rounded-full object-cover"
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="user photo"
            />
            <span class="hidden text-sm font-medium lg:inline">Admin</span>
            <i class="pi pi-angle-down text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
