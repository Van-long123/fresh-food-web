<template>
  <SkSearchPage v-if="isLoading" />
  <Search v-else />
</template>

<script setup lang="ts">


import { ref, onMounted } from "vue";
import Search from "~/components/pages/search/Search.vue";
import SkSearchPage from "~/components/skeletons/SkSearchPage.vue";

useHead({
  title: 'Tìm kiếm sản phẩm - SmartFood',
  meta: [
    { name: 'description', content: 'Trang Tìm kiếm sản phẩm của SmartFood' }
  ]
});


const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 700);
});
</script>
