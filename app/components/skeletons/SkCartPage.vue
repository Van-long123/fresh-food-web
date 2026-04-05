<template>
  <div class="min-h-screen bg-[#f8fafc] pb-24 text-[#111827]">
    <div class="mx-auto w-[min(1200px,92vw)] pt-6">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2">
        <Skeleton width="60px" height="13px" />
        <Skeleton width="10px" height="13px" />
        <Skeleton width="60px" height="13px" />
      </div>

      <!-- Title -->
      <div class="mt-3 flex items-center gap-3">
        <Skeleton width="260px" height="28px" />
        <Skeleton width="80px" height="24px" border-radius="9999px" />
      </div>

      <!-- 2-col layout: 63% / 37% -->
      <section class="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[63%_37%]">
        <!-- LEFT: Cart items -->
        <div>
          <!-- Tools row -->
          <div class="mb-3 flex items-center justify-between">
            <Skeleton width="150px" height="14px" />
            <Skeleton width="90px" height="14px" />
            <Skeleton width="140px" height="14px" class="hidden md:block" />
          </div>

          <!-- Cart item skeletons -->
          <div class="space-y-3">
            <div
              v-for="n in 4"
              :key="n"
              class="grid grid-cols-[26px_80px_1fr_auto_40px] items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4"
            >
              <!-- Checkbox -->
              <Skeleton width="18px" height="18px" border-radius="6px" />
              <!-- Thumbnail -->
              <Skeleton width="80px" height="80px" border-radius="12px" />
              <!-- Info -->
              <div class="space-y-2">
                <Skeleton width="85%" height="16px" />
                <Skeleton width="60px" height="12px" />
                <Skeleton width="140px" height="12px" />
                <div class="flex gap-2">
                  <Skeleton width="70px" height="20px" border-radius="8px" />
                  <Skeleton width="90px" height="20px" border-radius="8px" />
                </div>
                <!-- Qty row -->
                <div class="flex items-center gap-2">
                  <Skeleton width="32px" height="32px" border-radius="50%" />
                  <Skeleton width="24px" height="16px" />
                  <Skeleton width="32px" height="32px" border-radius="50%" />
                </div>
              </div>
              <!-- Price -->
              <div class="space-y-1 text-right">
                <Skeleton width="70px" height="12px" />
                <Skeleton width="80px" height="16px" />
                <Skeleton width="90px" height="12px" />
              </div>
              <!-- Remove -->
              <Skeleton width="28px" height="28px" border-radius="8px" />
            </div>
          </div>

          <!-- Saved section -->
          <div class="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
            <div class="flex items-center justify-between">
              <Skeleton width="220px" height="16px" />
              <Skeleton width="16px" height="16px" />
            </div>
          </div>
        </div>

        <!-- RIGHT: Summary -->
        <aside class="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <Skeleton width="160px" height="18px" class="mb-4" />
          <!-- Summary rows -->
          <div class="space-y-3">
            <div v-for="n in 3" :key="n" class="flex items-center justify-between">
              <Skeleton width="80px" height="14px" />
              <Skeleton width="90px" height="14px" />
            </div>
            <!-- Total -->
            <div class="flex items-center justify-between border-t pt-3">
              <Skeleton width="90px" height="18px" />
              <Skeleton width="110px" height="20px" />
            </div>
          </div>

          <!-- Free ship bar -->
          <div class="mt-4">
            <Skeleton width="100%" height="14px" class="mb-2" />
            <Skeleton width="100%" height="8px" border-radius="4px" />
          </div>

          <!-- Voucher -->
          <div class="mt-4">
            <Skeleton width="140px" height="14px" class="mb-2" />
            <div class="flex gap-2">
              <Skeleton width="100%" height="40px" border-radius="8px" />
              <Skeleton width="80px" height="40px" border-radius="8px" />
            </div>
            <Skeleton width="100px" height="12px" class="mt-2" />
          </div>

          <!-- ETA -->
          <Skeleton
            width="100%"
            height="40px"
            border-radius="10px"
            class="mt-4"
          />

          <!-- Checkout button -->
          <Skeleton
            width="100%"
            height="48px"
            border-radius="9999px"
            class="mt-4"
          />

          <!-- Trust badges -->
          <div class="mt-4 flex flex-wrap gap-2">
            <Skeleton v-for="n in 3" :key="n" width="150px" height="14px" />
          </div>

          <!-- Pay icons -->
          <div class="mt-3 flex gap-2">
            <Skeleton
              v-for="n in 6"
              :key="n"
              width="44px"
              height="26px"
              border-radius="6px"
            />
          </div>
        </aside>
      </section>

      <!-- Suggestions -->
      <section class="mt-8">
        <Skeleton width="220px" height="20px" class="mb-4" />
        <div class="flex gap-4 overflow-hidden">
          <div
            v-for="n in 6"
            :key="n"
            class="w-[160px] shrink-0 space-y-2 rounded-xl border border-gray-100 bg-white p-3"
          >
            <Skeleton width="100%" height="100px" border-radius="8px" />
            <Skeleton width="90%" height="14px" />
            <div class="flex items-center justify-between">
              <Skeleton width="60px" height="14px" />
              <Skeleton width="40px" height="12px" />
            </div>
            <Skeleton width="28px" height="28px" border-radius="50%" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
</script>
