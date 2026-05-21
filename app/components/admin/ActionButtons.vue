<script setup lang="ts">
interface Props {
  editHref?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  deleteLoading?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  editHref: undefined,
  onEdit: undefined,
  onDelete: undefined,
  onView: undefined,
  showEdit: true,
  showDelete: true,
  showView: false,
  deleteLoading: false,
  disabled: false,
});

const emit = defineEmits<{
  edit: [];
  delete: [];
  view: [];
}>();
</script>

<template>
  <div class="flex items-center gap-2">
    <NuxtLink
      v-if="showEdit && editHref"
      :to="editHref"
      title="Chỉnh sửa"
      class="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
    >
      <i class="pi pi-pencil text-sm"></i>
    </NuxtLink>
    <button
      v-if="showEdit && onEdit && !editHref"
      type="button"
      :disabled="disabled"
      title="Chỉnh sửa"
      class="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-primary-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      @click="emit('edit')"
    >
      <i class="pi pi-pencil text-sm"></i>
    </button>

    <button
      v-if="showView && onView"
      type="button"
      :disabled="disabled"
      title="Xem"
      class="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-primary-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      @click="emit('view')"
    >
      <i class="pi pi-eye text-sm"></i>
    </button>

    <button
      v-if="showDelete && onDelete"
      type="button"
      :disabled="disabled || deleteLoading"
      title="Xóa"
      class="inline-flex items-center justify-center rounded-lg border border-red-200 p-2 text-red-500 transition hover:border-red-300 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-900/20"
      @click="emit('delete')"
    >
      <i class="pi pi-trash text-sm"></i>
    </button>
  </div>
</template>
