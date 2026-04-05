<template>
  <div class="min-h-screen bg-white">
    <!-- Render the PrivacyPolicy component -->
    <PrivacyPolicy />
  </div>
</template>

<script setup lang="ts">
import PrivacyPolicy from "~/components/PrivacyPolicy.vue";

// SEO meta handled via Nuxt auto-imported useHead
useHead({
  title: "Chính Sách Bảo Mật — SmartFood",
  meta: [
    {
      name: "description",
      content: "Chi tiết chính sách bảo mật của SmartFood, GDPR-inspired, bảo vệ quyền riêng tư của người dùng."
    }
  ]
});
</script>

<style scoped>
/* Page-level container styling */
</style>
