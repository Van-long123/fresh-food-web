<template>
  <div class="min-h-screen bg-[#f5f5f5] pb-14 text-[#111827]">
    <div class="mx-auto max-w-7xl px-4 pt-4 md:px-6">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-1">
        <Skeleton width="60px" height="12px" />
        <Skeleton width="8px" height="12px" />
        <Skeleton width="50px" height="12px" />
        <Skeleton width="8px" height="12px" />
        <Skeleton width="80px" height="12px" />
      </nav>

      <!-- Banner -->
      <div class="mt-3 rounded-2xl overflow-hidden" style="min-height: 120px">
        <Skeleton width="100%" height="140px" borderRadius="16px" />
      </div>

      <!-- Filter chips bar -->
      <div class="sticky top-15 z-30 mt-3 border-b border-[#e5e7eb] bg-white shadow-sm">
        <div class="flex items-center justify-between gap-3 px-3 py-3 md:px-4">
          <div class="flex items-center gap-2">
            <Skeleton
              v-for="n in 4"
              :key="n"
              :width="`${50 + n * 12}px`"
              height="30px"
              borderRadius="9999px"
            />
          </div>
          <div class="flex items-center gap-2">
            <Skeleton width="120px" height="36px" borderRadius="8px" class="hidden md:block" />
            <Skeleton width="36px" height="36px" borderRadius="8px" />
          </div>
        </div>
      </div>

      <!-- Main content: sidebar + grid -->
      <section class="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        <!-- Sidebar -->
        <aside class="hidden h-fit rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:block">
          <Skeleton width="140px" height="16px" class="mb-3" />
          <div class="space-y-2.5">
            <div v-for="n in 4" :key="n" class="flex items-center gap-2 px-2">
              <Skeleton width="18px" height="18px" />
              <Skeleton :width="`${50 + n * 15}%`" height="14px" />
            </div>
          </div>

          <div class="mt-5">
            <Skeleton width="60px" height="16px" class="mb-2" />
            <Skeleton width="100%" height="14px" class="mb-3" />
            <Skeleton width="100%" height="8px" borderRadius="4px" />
          </div>

          <div class="mt-5">
            <Skeleton width="80px" height="16px" class="mb-2" />
            <div v-for="n in 4" :key="n" class="mt-2 flex items-center gap-2">
              <Skeleton width="16px" height="16px" borderRadius="3px" />
              <Skeleton :width="`${40 + n * 10}%`" height="14px" />
            </div>
          </div>
        </aside>

        <!-- Product grid -->
        <div>
          <div class="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <SkProductCard v-for="n in 10" :key="n" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import SkProductCard from "./SkProductCard.vue";
</script>
