<template>
  <div class="flex items-center gap-4 sm:gap-6 mb-8 overflow-x-auto pb-2 px-1">
    <div
      v-for="n in 5"
      :key="n"
      class="flex flex-col items-center gap-2 flex-shrink-0"
    >
      <!-- Circle badge -->
      <Skeleton shape="circle" size="84px" />
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
</script>
