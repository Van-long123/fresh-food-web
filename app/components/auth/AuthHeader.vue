<template>
  <div class="text-center mb-8">
    <!-- Logo -->
    <NuxtLink
      to="/"
      class="inline-flex items-center justify-center mb-6 hover:opacity-80 transition-opacity"
    >
      <div
        class="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <span class="ml-3 text-xl font-black text-gray-800 tracking-tight"
        >King<span class="text-green-600">food</span></span
      >
    </NuxtLink>

    <!-- Title -->
    <h1 class="text-2xl font-bold text-gray-900 tracking-tight">{{ title }}</h1>
    <p v-if="subtitle" class="mt-2 text-sm text-gray-500 font-medium">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
});
</script>
