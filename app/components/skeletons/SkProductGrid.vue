<template>
  <!-- Khuyen Mai HOT section skeleton -->
  <div
    class="bg-[#fdebea] rounded-xl p-4 sm:p-5 mb-10 border border-red-100/50 shadow-sm"
  >
    <!-- 2-row grid matching carousel-grid-2 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      <SkProductCard v-for="n in 10" :key="n" />
    </div>

    <!-- "Xem tat ca" link placeholder -->
    <div class="flex justify-center mt-6">
      <Skeleton width="80px" height="16px" />
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import SkProductCard from "./SkProductCard.vue";
</script>
