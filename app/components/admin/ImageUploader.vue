<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string | string[];
    multiple?: boolean;
    maxSize?: number;
    accept?: string;
  }>(),
  {
    multiple: false,
    maxSize: 5,
    accept: "image/*",
  },
);

const emit = defineEmits<{
  "update:modelValue": [string | string[]];
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const previewList = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue;
  return props.modelValue ? [props.modelValue] : [];
});

const updateValue = (next: string[]) => {
  if (props.multiple) {
    emit("update:modelValue", next);
  } else {
    emit("update:modelValue", next[0] || "");
  }
};

const handleFiles = (files: FileList | null) => {
  if (!files) return;
  const accepted: string[] = [];

  Array.from(files).forEach((file) => {
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > props.maxSize) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        accepted.push(reader.result);
        updateValue(
          props.multiple
            ? [...previewList.value, ...accepted]
            : [reader.result],
        );
      }
    };
    reader.readAsDataURL(file);
  });
};

const onInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  handleFiles(target.files);
};

const removeImage = (index: number) => {
  const updated = previewList.value.filter((_, idx) => idx !== index);
  updateValue(updated);
};

const openPicker = () => {
  inputRef.value?.click();
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  handleFiles(event.dataTransfer?.files || null);
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};
</script>

<template>
  <div class="space-y-3">
    <div
      class="flex flex-col items-center justify-center px-4 py-6 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 cursor-pointer hover:border-primary-400 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
      @click="openPicker"
      @drop="onDrop"
      @dragover="onDragOver"
    >
      <svg
        class="w-8 h-8 mb-2"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <p>Drag and drop images here, or click to browse</p>
      <p class="text-xs text-gray-400">Max {{ maxSize }}MB • {{ accept }}</p>
      <input
        ref="inputRef"
        type="file"
        :multiple="multiple"
        :accept="accept"
        class="hidden"
        @change="onInputChange"
      />
    </div>

    <div
      v-if="previewList.length"
      class="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      <div
        v-for="(src, index) in previewList"
        :key="src"
        class="relative group"
      >
        <img
          :src="src"
          alt="Preview"
          class="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
        />
        <button
          type="button"
          class="absolute top-2 right-2 rounded-full bg-white/90 text-gray-700 text-xs px-2 py-1 shadow hover:bg-white"
          @click.stop="removeImage(index)"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>
