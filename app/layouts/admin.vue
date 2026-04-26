<script setup lang="ts">
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
</script>


<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <AdminHeader />
    <div class="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <div id="main-content" class="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900 min-h-screen">
        <main>
          <slot />
        </main>
        
        <footer class="p-4 my-6 mx-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 xl:p-8 dark:bg-gray-800">
          <p class="mb-4 text-sm text-center text-gray-500 dark:text-gray-400 md:mb-0">
            &copy; 2024 <a href="/" class="hover:underline" target="_blank">SmartFood</a>. All rights reserved.
          </p>
          <ul class="flex flex-wrap items-center justify-center space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:space-x-6">
            <li>
              <a href="#" class="hover:underline">About</a>
            </li>
            <li>
              <a href="#" class="hover:underline">Privacy Policy</a>
            </li>
            <li>
              <a href="#" class="hover:underline">Licensing</a>
            </li>
            <li>
              <a href="#" class="hover:underline">Contact</a>
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
