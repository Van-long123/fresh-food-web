<template>
  <div
    class="bg-white rounded border border-gray-100/50 flex flex-col h-full overflow-hidden"
  >
    <!-- Image Box — same pt-[100%] aspect ratio -->
    <div class="relative pt-[100%] overflow-hidden bg-white shrink-0">
      <div class="absolute inset-0 p-2">
        <Skeleton width="100%" height="100%" border-radius="4px" />
      </div>
    </div>

    <!-- Content Box — same p-3 flex structure -->
    <div class="p-3 flex flex-col flex-1 bg-white">
      <!-- Product name: 2 lines -->
      <div class="mb-2 flex-1 space-y-1.5">
        <Skeleton width="100%" height="14px" />
        <Skeleton width="75%" height="14px" />
      </div>

      <div class="mt-auto">
        <!-- Price line -->
        <div class="flex items-baseline gap-1.5 mb-0.5">
          <Skeleton width="90px" height="18px" />
          <Skeleton width="14px" height="14px" />
        </div>
        <!-- Original price + saving -->
        <div class="flex items-center gap-1.5 mb-3">
          <Skeleton width="70px" height="13px" />
          <Skeleton width="65px" height="13px" />
        </div>

        <!-- Buy button -->
        <Skeleton width="100%" height="32px" border-radius="9999px" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
</script>
