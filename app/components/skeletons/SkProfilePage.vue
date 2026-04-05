<template>
  <div class="min-h-screen bg-[#f5f5f5] pb-24 text-[#111827]">
    <div class="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <!-- Profile header card -->
      <section class="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div class="h-20 bg-gradient-to-b from-[#fff3e8] to-white" />
        <div class="px-6 pb-6">
          <div class="-mt-11 flex flex-wrap items-end justify-between gap-4">
            <div class="flex items-end gap-4">
              <!-- Avatar -->
              <Skeleton
                width="88px"
                height="88px"
                border-radius="50%"
              />
              <!-- User info -->
              <div>
                <div class="flex items-center gap-2">
                  <Skeleton width="160px" height="22px" />
                  <Skeleton width="80px" height="22px" border-radius="9999px" />
                </div>
                <div class="mt-2 flex flex-wrap gap-3">
                  <Skeleton v-for="n in 4" :key="n" :width="`${70 + n * 20}px`" height="14px" />
                </div>
              </div>
            </div>
            <!-- Edit button -->
            <Skeleton width="140px" height="38px" border-radius="9999px" />
          </div>
        </div>
      </section>

      <!-- 2-col: sidebar + content -->
      <div class="mt-6 grid gap-5 lg:grid-cols-[220px_1fr]">
        <!-- Sidebar menu -->
        <aside class="hidden h-fit rounded-2xl bg-white p-3 shadow-sm lg:block">
          <div v-for="n in 7" :key="n" class="mb-1 flex items-center gap-2 px-3 py-2">
            <Skeleton width="16px" height="16px" />
            <Skeleton :width="`${60 + n * 12}%`" height="14px" />
          </div>
        </aside>

        <!-- Main content -->
        <main class="space-y-5">
          <!-- Personal info form -->
          <section class="rounded-2xl bg-white p-5 shadow-sm">
            <Skeleton width="160px" height="20px" class="mb-4" />
            <div class="grid gap-4 md:grid-cols-2">
              <div v-for="n in 6" :key="n">
                <Skeleton width="70px" height="13px" class="mb-1" />
                <Skeleton width="100%" height="44px" border-radius="10px" />
              </div>
              <div class="md:col-span-2">
                <Skeleton width="140px" height="44px" border-radius="9999px" />
              </div>
            </div>
          </section>

          <!-- Recent orders -->
          <section class="rounded-2xl bg-white p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <Skeleton width="180px" height="20px" />
              <Skeleton width="70px" height="14px" />
            </div>
            <div
              v-for="n in 3"
              :key="n"
              class="mt-3 rounded-xl border border-gray-100 p-4 space-y-3"
            >
              <div class="flex items-center justify-between">
                <Skeleton width="90px" height="14px" />
                <Skeleton width="80px" height="14px" />
                <Skeleton width="70px" height="22px" border-radius="9999px" />
              </div>
              <div class="flex items-center justify-between">
                <div class="flex -space-x-2">
                  <Skeleton
                    v-for="i in 3"
                    :key="i"
                    width="40px"
                    height="40px"
                    border-radius="8px"
                  />
                </div>
                <Skeleton width="100px" height="16px" />
              </div>
              <div class="flex items-center justify-between">
                <Skeleton width="80px" height="14px" />
                <Skeleton width="70px" height="28px" border-radius="9999px" />
              </div>
            </div>
          </section>

          <!-- Points & rank -->
          <section class="rounded-2xl bg-[#e8f5e9]/50 p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <Skeleton width="220px" height="20px" />
              <Skeleton width="28px" height="28px" />
            </div>
            <Skeleton width="100px" height="36px" class="mt-2" />
            <Skeleton width="140px" height="14px" class="mt-1" />
            <Skeleton width="100%" height="12px" border-radius="9999px" class="mt-4" />
            <Skeleton width="180px" height="14px" class="mt-1" />
          </section>

          <!-- Address -->
          <section class="rounded-2xl bg-white p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <Skeleton width="60px" height="20px" />
              <Skeleton width="110px" height="30px" border-radius="9999px" />
            </div>
            <Skeleton width="280px" height="14px" class="mt-2" />
          </section>
        </main>
      </div>

      <!-- Mobile bottom tabs -->
      <div class="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white py-2 shadow-lg lg:hidden">
        <div class="mx-auto grid max-w-md grid-cols-5 text-center">
          <div v-for="n in 5" :key="n" class="flex flex-col items-center gap-1">
            <Skeleton width="20px" height="20px" />
            <Skeleton width="36px" height="10px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
</script>
