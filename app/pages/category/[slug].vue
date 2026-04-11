<template>
  <SkCategoryProductsPage v-if="isLoading" />
  <CategoryProductsPage v-else />
</template>

<script setup lang="ts">


import { ref, onMounted } from "vue";
import CategoryProductsPage from "~/components/pages/catalog/CategoryProductsPage.vue";
import SkCategoryProductsPage from "~/components/skeletons/SkCategoryProductsPage.vue";

useHead({
  title: 'Danh mục sản phẩm - SmartFood',
  meta: [
    { name: 'description', content: 'Trang Danh mục sản phẩm của SmartFood' }
  ]
});


const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 700);
});
</script>
