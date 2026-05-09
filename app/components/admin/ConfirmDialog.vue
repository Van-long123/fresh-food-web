<script setup lang="ts">
import Dialog from "primevue/dialog";

interface Props {
  visible: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  danger?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: "Confirm Action",
  message: "Are you sure?",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  loading: false,
  danger: false,
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  "update:visible": [boolean];
}>();

const handleConfirm = () => {
  emit("confirm");
};

const handleCancel = () => {
  emit("cancel");
  emit("update:visible", false);
};
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="title"
    :closable="!loading"
    class="w-full sm:max-w-md"
    @update:visible="(v) => emit('update:visible', v)"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div
          :class="[
            'flex h-10 w-10 items-center justify-center rounded-lg',
            danger
              ? 'bg-red-100 dark:bg-red-900/30'
              : 'bg-blue-100 dark:bg-blue-900/30',
          ]"
        >
          <i
            :class="[
              'pi text-lg',
              danger
                ? 'pi-exclamation-triangle text-red-600'
                : 'pi-check text-blue-600',
            ]"
          ></i>
        </div>
        <span class="text-lg font-semibold">{{ title }}</span>
      </div>
    </template>

    <p class="text-sm text-slate-600 dark:text-slate-400">
      {{ message }}
    </p>

    <template #footer>
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="handleCancel"
          :disabled="loading"
          class="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          @click="handleConfirm"
          :disabled="loading"
          :class="[
            'flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50',
            danger
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-primary-600 hover:bg-primary-700',
          ]"
        >
          <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
          {{ confirmLabel }}
        </button>
      </div>
    </template>
  </Dialog>
</template>
