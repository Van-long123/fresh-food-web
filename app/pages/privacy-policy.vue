<template>
  <div class="min-h-screen bg-white">
    <!-- Render the PrivacyPolicy component -->
    <PrivacyPolicy />
  </div>
</template>

<script setup lang="ts">
import PrivacyPolicy from "~/components/pages/policies/PrivacyPolicy.vue";

useHead({
  title: "Chính sách bảo mật - SmartFood",
  meta: [
    { name: "description", content: "Trang Chính sách bảo mật của SmartFood" },
  ],
});
</script>

<style scoped>
/* Page-level container styling */
</style>
