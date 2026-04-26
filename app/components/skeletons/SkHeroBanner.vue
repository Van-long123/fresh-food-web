<template>
  <div
    class="relative rounded-lg overflow-hidden aspect-[21/9] md:aspect-[3/1] bg-gray-100 mb-6"
  >
    <!-- Full banner skeleton -->
    <Skeleton width="100%" height="100%" border-radius="8px" />

    <!-- Overlay content placeholders -->
    <div
      class="absolute inset-0 flex items-center justify-start p-8 md:p-16"
    >
      <div class="max-w-lg space-y-3">
        <!-- Badge pill -->
        <Skeleton width="180px" height="30px" border-radius="9999px" />
        <!-- Title -->
        <Skeleton width="320px" height="40px" />
        <Skeleton width="240px" height="40px" />
        <!-- Description -->
        <Skeleton width="280px" height="18px" />
      </div>
    </div>

    <!-- Dots placeholder -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <Skeleton
        v-for="n in 5"
        :key="n"
        :width="n === 1 ? '32px' : '10px'"
        height="10px"
        border-radius="9999px"
      />
    </div>

    <!-- Counter badge -->
    <div class="absolute bottom-4 right-4">
      <Skeleton width="48px" height="24px" border-radius="8px" />
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
</script>
