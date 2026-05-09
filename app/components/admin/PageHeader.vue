<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  showBackButton?: boolean;
  primaryAction?: {
    label: string;
    icon?: string;
    onClick: () => void;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    icon?: string;
    onClick: () => void;
    loading?: boolean;
  };
}

withDefaults(defineProps<Props>(), {
  showBackButton: false,
});

const router = useRouter();
</script>

<template>
  <section
    class="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80"
  >
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p
          v-if="breadcrumb"
          class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
        >
          {{ breadcrumb }}
        </p>
        <h1 class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
          {{ title }}
        </h1>
        <p
          v-if="subtitle"
          class="mt-1 text-sm text-slate-500 dark:text-slate-300"
        >
          {{ subtitle }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="showBackButton"
          type="button"
          @click="router.back()"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
        >
          <i class="pi pi-arrow-left"></i>
          Back
        </button>
        <button
          v-if="secondaryAction"
          type="button"
          @click="secondaryAction.onClick"
          :disabled="secondaryAction.loading"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
        >
          <i v-if="secondaryAction.icon" :class="secondaryAction.icon"></i>
          {{ secondaryAction.label }}
        </button>
        <button
          v-if="primaryAction"
          type="button"
          @click="primaryAction.onClick"
          :disabled="primaryAction.loading"
          class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          <i v-if="primaryAction.icon" :class="primaryAction.icon"></i>
          {{ primaryAction.label }}
        </button>
      </div>
    </div>
  </section>
</template>
