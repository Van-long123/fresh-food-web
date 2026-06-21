<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import AdminHeader from "~/components/admin/AdminHeader.vue";
import AdminSidebar from "~/components/admin/AdminSidebar.vue";
import { useAdminSocket } from "~/composables/order/useAdminSocket";

const { setupSocket, cleanupSocket } = useAdminSocket();

onMounted(() => {
  setupSocket();
});

onUnmounted(() => {
  cleanupSocket();
});
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-950">
    <AdminHeader />
    <div class="flex overflow-hidden bg-slate-50 pt-20 dark:bg-slate-950">
      <AdminSidebar />
      <div
        id="main-content"
        class="relative min-h-screen w-full overflow-y-auto bg-slate-50 lg:ml-64 dark:bg-slate-950"
      >
        <main class="space-y-6 pb-12 pt-6">
          <slot />
        </main>

        <footer
          class="mx-4 my-6 rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm shadow-slate-200/40 backdrop-blur md:flex md:items-center md:justify-between dark:border-slate-700/70 dark:bg-slate-900/80"
        >
          <p
            class="mb-4 text-center text-sm text-slate-500 dark:text-slate-300 md:mb-0"
          >
            &copy; 2024
            <a href="/" class="hover:underline" target="_blank">SmartFood</a>.
            Bảo lưu mọi quyền.
          </p>
          <ul
            class="flex flex-wrap items-center justify-center space-x-4 text-sm font-medium text-slate-500 dark:text-slate-300 md:space-x-6"
          >
            <li>
              <a href="#" class="hover:underline">Giới thiệu</a>
            </li>
            <li>
              <a href="#" class="hover:underline">Chính sách bảo mật</a>
            </li>
            <li>
              <a href="#" class="hover:underline">Giấy phép</a>
            </li>
            <li>
              <a href="#" class="hover:underline">Liên hệ</a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  </div>
</template>

<style>
/* Dashboard specific styles can go here */
</style>
