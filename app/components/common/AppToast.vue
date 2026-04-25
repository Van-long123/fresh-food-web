<template>
  <Toast
    position="top-right"
    class="!w-[400px]"
    :pt="{ closeButton: { style: 'display: none' } }"
  >
    <template #message="slotProps">
      <div class="toast-card" :data-severity="slotProps.message.severity">
        <div class="toast-accent" />

        <div class="toast-icon">
          <i :class="[getIcon(slotProps.message), 'text-base']" />
        </div>

        <div class="toast-body">
          <p class="toast-summary">{{ slotProps.message.summary }}</p>
          <p v-if="slotProps.message.detail" class="toast-detail">
            {{ slotProps.message.detail }}
          </p>
        </div>

        <button class="toast-close" @click="closeToast(slotProps.message)">
          <i class="pi pi-times text-[11px]" />
        </button>

        <div class="toast-progress" />
      </div>
    </template>
  </Toast>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";

const toast = useToast();

const severityIcon: Record<string, string> = {
  success: "pi pi-check-circle",
  info: "pi pi-info-circle",
  warn: "pi pi-exclamation-triangle",
  error: "pi pi-times-circle",
};

function getIcon(message: any) {
  return message.icon ?? severityIcon[message.severity] ?? "pi pi-bell";
}

function closeToast(message: any) {
  toast.remove(message);
}
</script>
