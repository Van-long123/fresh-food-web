<script setup lang="ts">
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";

interface Props {
  visible: boolean;
  loading?: boolean;
  paymentId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  "update:visible": [boolean];
  confirm: [string];
  cancel: [];
}>();

const reason = defineModel<string>("reason", { default: "" });
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Issue Refund"
    :on-hide="() => emit('update:visible', false)"
    class="w-full max-w-md"
  >
    <div class="space-y-4">
      <div
        class="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-900/20"
      >
        <i
          class="pi pi-exclamation-triangle mt-0.5 text-amber-600 dark:text-amber-400"
        ></i>
        <div class="text-sm text-amber-900 dark:text-amber-200">
          <p class="font-medium">Payment ID: {{ paymentId }}</p>
          <p class="mt-1 text-xs opacity-80">Refunds cannot be reversed.</p>
        </div>
      </div>

      <div>
        <label
          class="block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Reason for refund
        </label>
        <Textarea
          v-model="reason"
          rows="4"
          placeholder="Explain why this refund is being issued..."
          class="mt-2 w-full"
          :disabled="loading"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2">
        <button
          type="button"
          class="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
          :disabled="loading"
          @click="() => emit('update:visible', false)"
        >
          Cancel
        </button>
        <button
          type="button"
          class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          :disabled="loading || !reason.trim()"
          @click="() => emit('confirm', reason)"
        >
          <span v-if="loading" class="inline-flex items-center gap-2">
            <i class="pi pi-spin pi-spinner text-sm"></i>
            Processing...
          </span>
          <span v-else>Confirm Refund</span>
        </button>
      </div>
    </template>
  </Dialog>
</template>
