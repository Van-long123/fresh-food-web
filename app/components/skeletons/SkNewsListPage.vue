<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <!-- Hero section -->
    <section
      class="relative overflow-hidden bg-emerald-600 px-4 pb-12 pt-16 text-white"
    >
      <div class="mx-auto w-full max-w-6xl">
        <Skeleton width="120px" height="14px" class="mb-3 opacity-60" />
        <Skeleton width="420px" height="40px" class="mb-2" />
        <Skeleton width="360px" height="40px" class="mb-4 hidden sm:block" />
        <Skeleton width="300px" height="16px" class="mb-1" />
        <Skeleton width="260px" height="16px" class="mb-7" />
        <!-- Search bar -->
        <Skeleton
          width="100%"
          height="48px"
          border-radius="16px"
          class="max-w-xl"
        />
      </div>
    </section>

    <!-- Category chips bar -->
    <section
      class="sticky top-16 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur"
    >
      <div
        class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3"
      >
        <div class="flex flex-wrap gap-2">
          <Skeleton
            v-for="n in 5"
            :key="n"
            :width="`${50 + n * 14}px`"
            height="30px"
            border-radius="9999px"
          />
        </div>
        <Skeleton width="120px" height="32px" border-radius="12px" />
      </div>
    </section>

    <!-- Main content -->
    <main
      class="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px]"
    >
      <div class="space-y-10">
        <!-- Featured Stories -->
        <section>
          <div class="mb-4 flex items-center justify-between">
            <Skeleton width="200px" height="24px" />
            <Skeleton width="90px" height="24px" border-radius="9999px" />
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div class="md:col-span-3">
              <Skeleton width="100%" height="300px" border-radius="16px" />
            </div>
            <div class="grid gap-4 md:col-span-2">
              <div
                class="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <Skeleton width="100%" height="112px" border-radius="12px" class="mb-3" />
                <Skeleton width="60px" height="10px" class="mb-1" />
                <Skeleton width="100%" height="16px" />
                <Skeleton width="80%" height="16px" />
              </div>
              <div
                class="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <Skeleton width="100%" height="112px" border-radius="12px" class="mb-3" />
                <Skeleton width="80px" height="10px" class="mb-1" />
                <Skeleton width="90%" height="16px" />
                <Skeleton width="70%" height="16px" />
              </div>
            </div>
          </div>
        </section>

        <!-- Latest Articles -->
        <section>
          <div class="mb-4 flex items-center justify-between">
            <Skeleton width="180px" height="24px" />
            <Skeleton width="60px" height="14px" />
          </div>
          <div
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            <article
              v-for="n in 6"
              :key="n"
              class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <Skeleton width="100%" height="150px" border-radius="12px" />
              <Skeleton width="45%" height="12px" />
              <Skeleton width="100%" height="16px" />
              <Skeleton width="82%" height="14px" />
              <Skeleton width="66%" height="14px" />
              <div class="flex items-center justify-between pt-2">
                <div class="flex items-center gap-2">
                  <Skeleton width="32px" height="32px" border-radius="50%" />
                  <div>
                    <Skeleton width="70px" height="12px" />
                    <Skeleton width="50px" height="10px" class="mt-1" />
                  </div>
                </div>
                <Skeleton width="40px" height="12px" />
              </div>
            </article>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <aside class="space-y-4 lg:sticky lg:top-32 lg:h-fit">
        <!-- Popular Posts -->
        <section class="rounded-2xl border border-slate-200 bg-white p-4">
          <Skeleton width="120px" height="16px" class="mb-3" />
          <div class="space-y-3">
            <div v-for="n in 5" :key="n" class="flex items-start gap-3">
              <Skeleton width="24px" height="20px" />
              <div class="flex-1">
                <Skeleton width="100%" height="14px" />
                <Skeleton width="70%" height="14px" class="mt-1" />
              </div>
            </div>
          </div>
        </section>

        <!-- Hot Tags -->
        <section class="rounded-2xl border border-slate-200 bg-white p-4">
          <Skeleton width="80px" height="16px" class="mb-3" />
          <div class="flex flex-wrap gap-2">
            <Skeleton
              v-for="n in 6"
              :key="n"
              :width="`${55 + n * 10}px`"
              height="26px"
              border-radius="9999px"
            />
          </div>
        </section>

        <!-- Newsletter -->
        <section class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <Skeleton width="100px" height="16px" class="mb-2" />
          <Skeleton width="100%" height="14px" class="mb-1" />
          <Skeleton width="80%" height="14px" class="mb-3" />
          <Skeleton width="100%" height="38px" border-radius="12px" class="mb-3" />
          <Skeleton width="100%" height="40px" border-radius="12px" />
        </section>
      </aside>
    </main>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
</script>
