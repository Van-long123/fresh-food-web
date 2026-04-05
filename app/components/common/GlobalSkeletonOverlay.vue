<template>
  <Transition name="skeleton-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-1200 bg-white/92 backdrop-blur-[1px]"
      aria-live="polite"
      aria-busy="true"
      aria-label="Dang tai du lieu"
    >
      <div class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="mb-6 flex items-center justify-between">
          <Skeleton width="160px" height="26px" borderRadius="0.6rem" />
          <div class="flex items-center gap-2">
            <Skeleton width="84px" height="36px" borderRadius="9999px" />
            <Skeleton width="84px" height="36px" borderRadius="9999px" />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="md:col-span-2">
            <Skeleton height="260px" borderRadius="1.1rem" />
          </div>
          <div class="space-y-4">
            <Skeleton height="122px" borderRadius="1.1rem" />
            <Skeleton height="122px" borderRadius="1.1rem" />
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="n in 6"
            :key="n"
            class="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <Skeleton height="150px" borderRadius="0.9rem" />
            <Skeleton class="mt-3" width="42%" height="12px" />
            <Skeleton class="mt-2" width="92%" height="18px" />
            <Skeleton class="mt-2" width="76%" height="16px" />
            <Skeleton class="mt-3" width="58%" height="14px" />
          </article>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>();
</script>

<style scoped>
.skeleton-fade-enter-active,
.skeleton-fade-leave-active {
  transition: opacity 0.2s ease;
}

.skeleton-fade-enter-from,
.skeleton-fade-leave-to {
  opacity: 0;
}
</style>
