<script setup lang="ts">
import { ref, watch } from "vue";
import InputText from "primevue/inputtext";

interface Props {
  modelValue?: string;
  placeholder?: string;
  showFilters?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "Tìm kiếm...",
  showFilters: false,
});

const emit = defineEmits<{
  "update:modelValue": [string];
  filter: [];
}>();

const searchQuery = ref("");

watch(
  () => searchQuery.value,
  (value) => {
    emit("update:modelValue", value);
  },
);
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <div class="relative flex-1 sm:max-w-xs">
      <div class="relative w-full">
        <i
          class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"
        ></i>
        <InputText
          v-model="searchQuery"
          type="text"
          :placeholder="placeholder"
          class="w-full !pl-10"
        />
      </div>
    </div>
    <button
      v-if="showFilters"
      type="button"
      class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
    >
      <i class="pi pi-filter"></i>
      Bộ lọc
    </button>
    <slot name="actions"></slot>
  </div>
</template>
