<template>
  <div class="flex items-center justify-center gap-10 py-10 mt-4 select-none">
    <!-- Previous Arrow -->
    <button
      :disabled="modelValue <= 1"
      class="p-2 transition-all duration-300 group cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
      aria-label="Previous Page"
      @click="prevPage"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 text-gray-400 group-hover:text-[#006766] transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    <!-- Page Numbers -->
    <div class="relative flex items-center gap-4 bg-gray-50/50 p-1.5 rounded-full border border-gray-100/50">
      <!-- Premium Sliding Active Background -->
      <div
        class="absolute top-1.5 bottom-1.5 w-12 h-12 bg-[#006766] rounded-full shadow-[0_8px_20px_rgba(0,103,102,0.35)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
        :style="{
          transform: `translateX(${(modelValue - 1) * (48 + 16)}px)`,
        }"
      />

      <button
        v-for="page in totalPages"
        :key="page"
        class="relative w-12 h-12 flex items-center justify-center text-[16px] font-bold transition-all duration-300 cursor-pointer z-10"
        :class="[
          modelValue === page ? 'text-white' : 'text-[#3b386b] hover:text-[#006766] hover:scale-110',
        ]"
        @click="emit('update:modelValue', page)"
      >
        {{ page }}
      </button>
    </div>

    <!-- Next Arrow -->
    <button
      :disabled="modelValue >= totalPages"
      class="p-2 transition-all duration-300 group cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
      aria-label="Next Page"
      @click="nextPage"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 text-gray-400 group-hover:text-[#006766] transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * @file AppPagination.vue
 * @description Custom pagination component matching the brand design.
 * Features a circular active state and specialized color palette.
 */

const props = defineProps<{
  modelValue: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const prevPage = () => {
  if (props.modelValue > 1) {
    emit("update:modelValue", props.modelValue - 1);
  }
};

const nextPage = () => {
  if (props.modelValue < props.totalPages) {
    emit("update:modelValue", props.modelValue + 1);
  }
};
</script>

<style scoped>
/* Optional: additive micro-interactions */
button:active:not(:disabled) {
  transform: scale(0.95);
}
</style>
