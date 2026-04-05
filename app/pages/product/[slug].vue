<template>
  <SkProductDetailPage v-if="isLoading" />
  <ProductDetailPage v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProductDetailPage from "~/components/pages/catalog/ProductDetailPage.vue";
import SkProductDetailPage from "~/components/skeletons/SkProductDetailPage.vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 700);
});
</script>
