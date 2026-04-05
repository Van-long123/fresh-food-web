<template>
  <aside
    class="w-[240px] flex-shrink-0 bg-white border-r border-gray-100 sticky top-[112px] h-[calc(100vh-112px)] overflow-y-auto hidden lg:block pb-6 pt-2"
  >
    <ul>
      <li v-for="n in 17" :key="n">
        <div
          class="flex items-center py-2.5 px-3 border-b border-transparent"
        >
          <!-- Icon circle -->
          <div class="mr-3 flex-shrink-0">
            <Skeleton shape="circle" size="32px" />
          </div>
          <!-- Category name -->
          <div class="flex-1">
            <Skeleton
              :width="randomWidth(n)"
              height="14px"
            />
          </div>
          <!-- Arrow -->
          <Skeleton width="14px" height="14px" borderRadius="2px" />
        </div>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import Skeleton from "primevue/skeleton";

const widths = [
  "70%", "85%", "60%", "90%", "55%", "80%", "65%",
  "75%", "50%", "88%", "72%", "68%", "82%", "58%",
  "76%", "64%", "78%",
];

const randomWidth = (n) => widths[(n - 1) % widths.length];
</script>
