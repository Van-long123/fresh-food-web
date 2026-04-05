<template>
  <div class="min-h-screen bg-[#f5f5f5] pb-12 text-[#222]">
    <div class="mx-auto max-w-7xl px-4 pt-4 md:px-6">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-1">
        <Skeleton width="60px" height="12px" />
        <Skeleton width="8px" height="12px" />
        <Skeleton width="50px" height="12px" />
        <Skeleton width="8px" height="12px" />
        <Skeleton width="120px" height="12px" />
      </nav>

      <!-- Main 2-col layout -->
      <section class="mt-4 grid gap-6 lg:grid-cols-[45%_55%]">
        <!-- LEFT: Image gallery -->
        <div class="h-fit lg:sticky lg:top-20">
          <div class="rounded-2xl bg-white p-3 shadow-sm">
            <!-- Main image -->
            <Skeleton width="100%" height="0" class="!pb-[100%]" borderRadius="12px" />
            <!-- Thumbnails -->
            <div class="mt-3 flex gap-2">
              <Skeleton
                v-for="n in 4"
                :key="n"
                width="72px"
                height="72px"
                borderRadius="12px"
              />
            </div>
          </div>
        </div>

        <!-- RIGHT: Product info -->
        <div>
          <!-- Title -->
          <div class="space-y-2">
            <Skeleton width="100%" height="24px" />
            <Skeleton width="70%" height="24px" />
          </div>

          <!-- Rating -->
          <div class="mt-2 flex items-center gap-2">
            <Skeleton width="100px" height="16px" />
            <Skeleton width="80px" height="14px" />
          </div>

          <!-- Price row -->
          <div class="mt-4 flex flex-wrap items-end gap-3">
            <Skeleton width="140px" height="32px" />
            <Skeleton width="90px" height="18px" />
            <Skeleton width="100px" height="26px" borderRadius="9999px" />
          </div>

          <!-- Flash sale timer -->
          <div class="mt-4 rounded-2xl bg-gray-200 p-4">
            <Skeleton width="170px" height="16px" />
            <div class="mt-2 flex gap-2">
              <Skeleton v-for="n in 3" :key="n" width="56px" height="36px" borderRadius="6px" />
            </div>
          </div>

          <!-- Unit selector -->
          <div class="mt-5">
            <Skeleton width="80px" height="16px" />
            <div class="mt-2 flex flex-wrap gap-2">
              <Skeleton
                v-for="n in 3"
                :key="n"
                :width="`${60 + n * 20}px`"
                height="38px"
                borderRadius="9999px"
              />
            </div>
          </div>

          <!-- Quantity -->
          <div class="mt-5">
            <Skeleton width="60px" height="16px" />
            <div class="mt-2">
              <Skeleton width="160px" height="44px" borderRadius="9999px" />
            </div>
          </div>

          <!-- CTA buttons -->
          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            <Skeleton width="100%" height="48px" borderRadius="9999px" />
            <Skeleton width="100%" height="48px" borderRadius="9999px" />
          </div>

          <!-- Trust badges -->
          <div class="mt-5 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 sm:grid-cols-2">
            <Skeleton v-for="n in 4" :key="n" width="140px" height="16px" />
          </div>
        </div>
      </section>

      <!-- Tabs section -->
      <section class="mt-8 rounded-2xl bg-white p-4">
        <div class="flex gap-6 border-b border-[#e5e7eb] pb-3">
          <Skeleton v-for="n in 3" :key="n" :width="`${60 + n * 25}px`" height="16px" />
        </div>
        <div class="pt-4 space-y-3">
          <Skeleton width="100%" height="14px" />
          <Skeleton width="95%" height="14px" />
          <Skeleton width="100%" height="14px" />
          <Skeleton width="88%" height="14px" />
          <Skeleton width="70%" height="14px" />
        </div>
      </section>

      <!-- Suggestions -->
      <section class="mt-8">
        <Skeleton width="200px" height="22px" class="mb-4" />
        <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <SkProductCard v-for="n in 5" :key="n" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import SkProductCard from "./SkProductCard.vue";
</script>
