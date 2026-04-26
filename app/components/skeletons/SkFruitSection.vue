<template>
  <!-- Fruit banner skeleton — matches the 100px tall banner -->
  <div
    class="rounded-xl overflow-hidden mb-5 bg-gray-100 h-[100px] relative shadow-sm"
  >
    <Skeleton width="100%" height="100%" border-radius="12px" />
  </div>

  <!-- Fruit products slider skeleton -->
  <div class="relative mb-8">
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 py-1">
      <SkProductCard v-for="n in 5" :key="n" />
    </div>
  </div>

  <!-- "Xem tất cả" + border bottom -->
  <div class="flex justify-center mb-10 pb-6 border-b border-gray-200">
    <Skeleton width="80px" height="16px" />
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import SkProductCard from "./SkProductCard.vue";
</script>
