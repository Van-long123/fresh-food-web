<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Quản lý bảng giá - Quản trị SmartFood",
});
</script>

<template>
  <div class="px-4 pt-6">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Gói dịch vụ
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        Chọn gói phù hợp nhất cho nhu cầu kinh doanh của bạn.
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="plan in ['Cơ bản', 'Chuyên nghiệp', 'Doanh nghiệp']"
        :key="plan"
        class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
      >
        <h5
          class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {{ plan }}
        </h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Phù hợp cho nhóm nhỏ và doanh nghiệp khởi nghiệp.
        </p>
        <div class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          2.490.000đ<span class="text-lg font-normal text-gray-500"
            >/tháng</span
          >
        </div>
        <ul class="space-y-4 mb-8">
          <li v-for="i in 4" :key="i" class="flex items-center space-x-3">
            <svg
              class="shrink-0 w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="text-gray-600 dark:text-gray-300"
              >Tính năng {{ i }}</span
            >
          </li>
        </ul>
        <button
          class="w-full text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Bắt đầu ngay
        </button>
      </div>
    </div>
  </div>
</template>
