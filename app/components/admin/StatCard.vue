<script setup lang="ts">
import { computed } from "vue";
const props = withDefaults(
  defineProps<{
    title: string;
    value: string | number;
    trend?: number;
    trendLabel?: string;
  }>(),
  {
    trend: undefined,
    trendLabel: "",
  },
);

const trendDirection = computed(() => {
  if (props.trend === undefined || props.trend === null) return "flat";
  if (props.trend > 0) return "up";
  if (props.trend < 0) return "down";
  return "flat";
});

const trendColor = computed(() => {
  if (trendDirection.value === "up")
    return "text-green-600 dark:text-green-400";
  if (trendDirection.value === "down") return "text-red-600 dark:text-red-400";
  return "text-gray-500 dark:text-gray-400";
});
</script>

<template>
  <div
    class="group rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/60 dark:border-slate-700/70 dark:bg-slate-900"
  >
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-300">
          {{ title }}
        </p>
        <div class="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
          {{ value }}
        </div>
        <div
          v-if="trend !== undefined"
          class="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800"
        >
          <svg
            v-if="trendDirection === 'up'"
            class="h-3.5 w-3.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <svg
            v-else-if="trendDirection === 'down'"
            class="h-3.5 w-3.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 112 0v11.586l2.293-2.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span :class="trendColor">{{ Math.abs(trend).toFixed(1) }}%</span>
          <span v-if="trendLabel" class="text-slate-500 dark:text-slate-400">
            {{ trendLabel }}
          </span>
        </div>
      </div>
      <div
        class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition group-hover:scale-105 dark:bg-primary-500/10 dark:text-primary-400"
      >
        <slot name="icon" />
      </div>
    </div>
  </div>
</template>
