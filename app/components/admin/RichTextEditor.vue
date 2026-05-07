<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [string];
}>();

const updateValue = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div
    class="border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700"
  >
    <div
      class="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-400"
    >
      <span class="font-medium">Editor</span>
      <span class="text-gray-400">Basic textarea placeholder</span>
    </div>
    <textarea
      class="w-full min-h-[160px] p-3 text-sm text-gray-900 bg-white border-0 focus:ring-0 dark:bg-gray-900 dark:text-gray-100"
      :placeholder="placeholder || 'Write content here...'"
      :value="modelValue"
      @input="updateValue"
    ></textarea>
  </div>
</template>
