<template>
  <NotFoundPage v-if="statusCode === 404" />
  <SystemErrorPage v-else-if="statusCode === 500" />
  <SystemErrorPage v-else />
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";
import { watch } from "vue";

import NotFoundPage from "~/components/pages/errors/NotFoundPage.vue";
import SystemErrorPage from "~/components/pages/errors/SystemErrorPage.vue";

const props = defineProps<{
  error: NuxtError;
}>();

const statusCode = props.error?.statusCode || 500;
watch(
  () => props.error,
  (newError) => {
    console.log("🚀 ~ newError:", newError);
    console.log("🚀 ~ newError:", newError?.status);
  },
  { immediate: true },
);
watch(
  () => statusCode,
  (newStatus) => {
    console.log("🚀 ~ newStatus:", newStatus);
  },
  { immediate: true },
);
</script>
