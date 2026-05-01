<template>
  <div class="coupon-grid">
    <div
      v-for="i in 6"
      :key="i"
      class="h-[180px] rounded-2xl bg-white border border-gray-100 grid overflow-hidden relative"
      style="grid-template-columns: 35% 14px 65%"
    >
      <div class="bg-gray-200 animate-pulse relative">
         <div class="absolute inset-0 skeleton-shimmer" />
      </div>
      <div class="border-l-2 border-dashed border-gray-200" />
      <div class="p-4 space-y-3">
        <div class="w-20 h-8 bg-gray-200 rounded animate-pulse" />
        <div class="w-full h-4 bg-gray-100 rounded animate-pulse" />
        <div class="w-32 h-4 bg-gray-100 rounded animate-pulse" />
        <div class="w-full h-8 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.coupon-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.skeleton-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
@media (max-width: 1024px) {
  .coupon-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 768px) {
  .coupon-grid { grid-template-columns: 1fr; }
}
</style>
