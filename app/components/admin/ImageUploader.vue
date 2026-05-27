<script setup lang="ts">
import { computed, ref, onUnmounted } from "vue";

/**
 * modelValue có thể là:
 * - single mode: string (URL từ server) | File (file mới) | ""
 * - multiple mode: (string | File)[] */
const props = withDefaults(
  defineProps<{
    modelValue: string | File | (string | File)[];
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
  "update:modelValue": [string | File | (string | File)[]];
}>();

const inputRef = ref<HTMLInputElement | null>(null);

// Object URLs tạm để preview File objects
// Track chúng để revoke khi không cần nữa
const objectUrlMap = new WeakMap<File, string>();
const trackedUrls = ref<string[]>([]);

const getPreviewSrc = (item: string | File): string => {
  if (typeof item === "string") return item;
  if (objectUrlMap.has(item)) return objectUrlMap.get(item)!;
  const url = URL.createObjectURL(item);
  objectUrlMap.set(item, url);
  trackedUrls.value.push(url);
  return url;
};

onUnmounted(() => {
  trackedUrls.value.forEach((url) => URL.revokeObjectURL(url));
});

const previewList = computed((): (string | File)[] => {
  if (Array.isArray(props.modelValue)) return props.modelValue;
  return props.modelValue ? [props.modelValue as string | File] : [];
});

const updateValue = (next: (string | File)[]) => {
  if (props.multiple) {
    emit("update:modelValue", next);
  } else {
    emit("update:modelValue", next[0] ?? "");
  }
};

// Handle file input
const handleFiles = (files: FileList | null) => {
  if (!files) return;
  const accepted: File[] = [];

  Array.from(files).forEach((file) => {
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > props.maxSize) return;
    accepted.push(file);
  });

  if (!accepted.length) return;

  if (props.multiple) {
    updateValue([...previewList.value, ...accepted]);
  } else {
    updateValue([accepted[0]]);
  }
};

const onInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  handleFiles(target.files);
  // reset input để có thể chọn lại cùng file
  target.value = "";
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
      <p>Kéo thả ảnh vào đây hoặc bấm để chọn tệp</p>
      <p class="text-xs text-gray-400">Tối đa {{ maxSize }}MB • {{ accept }}</p>
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
        v-for="(item, index) in previewList"
        :key="typeof item === 'string' ? item : item.name + index"
        class="relative group"
      >
        <img
          :src="getPreviewSrc(item)"
          alt="Xem trước"
          class="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
        />
        <!-- Badge phân biệt file mới / ảnh cũ -->
        <span
          v-if="typeof item !== 'string'"
          class="absolute bottom-1 left-1 rounded bg-blue-500/80 px-1 text-[10px] text-white leading-4"
          >Mới</span
        >
        <button
          type="button"
          class="absolute top-2 right-2 rounded-full bg-white/90 text-gray-700 text-xs px-2 py-1 shadow hover:bg-white"
          @click.stop="removeImage(index)"
        >
          Xóa
        </button>
      </div>
    </div>
  </div>
</template>
