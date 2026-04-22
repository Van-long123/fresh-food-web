<template>
  <ShoppingGuide />
</template>

<script setup lang="ts">
import ShoppingGuide from "~/components/pages/policies/ShoppingGuide.vue";

useHead({
  title: "Hướng dẫn mua sắm - SmartFood",
  meta: [
    { name: "description", content: "Trang Hướng dẫn mua sắm của SmartFood" },
  ],
});
</script>
