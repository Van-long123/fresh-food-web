<template>
  <section
    class="bg-white rounded border border-gray-100 mb-10 overflow-hidden shadow-sm"
  >
    <!-- ── Header ── -->
    <div
      class="flex items-center justify-between px-5 py-4 border-b border-gray-100"
    >
      <Skeleton width="200px" height="22px" />
      <Skeleton width="70px" height="16px" />
    </div>

    <!-- ── Body: 2 columns ── -->
    <div class="flex flex-col lg:flex-row gap-0">
      <!-- LEFT: Primary post skeleton -->
      <article
        class="w-full lg:w-[48%] p-4 lg:p-5 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-100"
      >
        <!-- Image 4:3 aspect -->
        <div class="w-full overflow-hidden rounded mb-3">
          <Skeleton width="100%" height="0" class="!pb-[75%]" border-radius="4px" />
        </div>
        <!-- Title -->
        <div class="mb-1.5 space-y-1.5">
          <Skeleton width="100%" height="18px" />
          <Skeleton width="80%" height="18px" />
        </div>
        <!-- Date -->
        <Skeleton width="110px" height="12px" class="mb-2" />
        <!-- Description -->
        <div class="space-y-1.5">
          <Skeleton width="100%" height="14px" />
          <Skeleton width="95%" height="14px" />
          <Skeleton width="60%" height="14px" />
        </div>
      </article>

      <!-- RIGHT: Secondary posts list -->
      <div class="w-full lg:w-[52%]">
        <div
          v-for="n in 6"
          :key="n"
          class="flex gap-3 px-4 py-3.5"
          :class="{ 'border-b border-gray-100': n !== 6 }"
        >
          <!-- Thumbnail -->
          <div class="w-[100px] sm:w-[120px] h-[70px] sm:h-[82px] flex-shrink-0">
            <Skeleton width="100%" height="100%" border-radius="4px" />
          </div>

          <!-- Text content -->
          <div class="flex flex-col flex-1 min-w-0 py-0.5 gap-1.5">
            <!-- Title 2 lines -->
            <Skeleton width="100%" height="15px" />
            <Skeleton width="70%" height="15px" />
            <!-- Date -->
            <Skeleton width="90px" height="11px" />
            <!-- Description (hidden on mobile, same as real) -->
            <div class="hidden sm:block space-y-1">
              <Skeleton width="100%" height="13px" />
              <Skeleton width="80%" height="13px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
</script>
