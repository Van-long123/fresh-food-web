<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 px-4 py-12 font-sans relative overflow-hidden">
    <!-- Decorative blobs -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style="animation-delay: 2s;" />
    <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

    <!-- Content -->
    <div class="relative z-10 w-full max-w-md">
      <slot />
    </div>
  </div>
</template>
