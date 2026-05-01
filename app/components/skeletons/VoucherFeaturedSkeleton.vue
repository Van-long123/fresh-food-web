<template>
  <div class="flex gap-[14px] overflow-hidden pb-2">
    <div
      v-for="i in 3"
      :key="i"
      class="min-w-[340px] h-[280px] rounded-[18px] bg-gray-200 animate-pulse relative overflow-hidden"
    >
      <div class="absolute inset-0 skeleton-shimmer" />
      <div class="p-[18px]">
        <div class="w-24 h-4 bg-gray-300 rounded mb-4" />
        <div class="w-48 h-10 bg-gray-300 rounded mb-4" />
        <div class="w-40 h-4 bg-gray-300 rounded" />
      </div>
      <div class="absolute bottom-0 left-0 right-0 p-4 bg-gray-100">
        <div class="w-full h-10 bg-gray-300 rounded-xl" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
