<template>
  <aside
    class="w-[240px] flex-shrink-0 bg-white border-r border-gray-100 sticky top-[89px] h-[calc(100vh-112px)] overflow-y-auto hidden lg:block custom-scrollbar pb-6 pt-2"
  >
    <ul>
      <li v-for="(item, index) in categories" :key="index">
        <NuxtLink
          :to="ROUTES.CATEGORY(item.slug)"
          class="flex items-center py-2.5 px-3 hover:bg-gray-50 group cursor-pointer border-b border-transparent hover:border-gray-50 transition-colors"
        >
          <div
            class="w-8 h-8 rounded-full overflow-hidden border border-gray-100 mr-3 flex-shrink-0 bg-white flex items-center justify-center p-0.5 group-hover:shadow-sm"
          >
            <img
              v-if="item.thumbnail"
              :src="item.thumbnail"
              :alt="item.title"
              class="w-full h-full object-contain rounded-full"
            />
          </div>
          <span
            class="text-[13px] text-gray-700 font-medium leading-snug flex-1 group-hover:text-[#f47f20]"
          >
            {{ item.title }}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3.5 w-3.5 text-gray-400 group-hover:text-[#f47f20]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </NuxtLink>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { ROUTES } from "~/constants/routes";
import type { SidebarCategory } from "~/types/home.type";

interface Props {
  categories?: SidebarCategory[];
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #94a3b8;
}
</style>
