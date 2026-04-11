<template>
  <div class="min-h-screen flex flex-col font-sans bg-gray-50/30">
    <!-- Same layout as homepage -->
    <div class="max-w-[1440px] mx-auto w-full flex items-start flex-1 gap-4">
      <!-- Left Sidebar skeleton -->
      <SkSidebar />

      <!-- Right Content -->
      <main class="flex-1 min-w-0 px-4 sm:px-6 lg:px-0 py-6 pb-16">
        <!-- Category badges skeleton -->
        <div
          class="flex items-center gap-4 sm:gap-6 mb-6 overflow-hidden pb-2 px-1 pt-1"
        >
          <div
            v-for="n in 6"
            :key="n"
            class="flex flex-col items-center gap-1.5 shrink-0"
          >
            <Skeleton shape="circle" size="60px" />
            <Skeleton width="56px" height="10px" />
          </div>
        </div>

        <!-- Result count text skeleton -->
        <div class="mb-4">
          <Skeleton width="320px" height="16px" />
        </div>

        <!-- Product grid skeleton: 6 columns × 5 rows = 30 cards -->
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
        >
          <SkProductCard v-for="n in 30" :key="n" />
        </div>

        <!-- Pagination skeleton -->
        <div class="flex items-center justify-center gap-2 pt-6">
          <Skeleton width="80px" height="36px" borderRadius="8px" />
          <Skeleton
            v-for="n in 3"
            :key="n"
            width="36px"
            height="36px"
            borderRadius="8px"
          />
          <Skeleton width="80px" height="36px" borderRadius="8px" />
        </div>
        <div class="flex justify-center mt-2">
          <Skeleton width="240px" height="12px" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import SkSidebar from "./SkSidebar.vue";
import SkProductCard from "./SkProductCard.vue";
</script>
