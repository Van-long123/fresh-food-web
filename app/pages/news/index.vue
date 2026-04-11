<template>
  <SkNewsListPage v-if="isLoading" />
  <NewsListPage v-else />
</template>

<script setup lang="ts">


import { ref, onMounted } from "vue";
import NewsListPage from "~/components/pages/content/NewsListPage.vue";
import SkNewsListPage from "~/components/skeletons/SkNewsListPage.vue";

useHead({
  title: 'Tin tức & Khuyến mãi - SmartFood',
  meta: [
    { name: 'description', content: 'Trang Tin tức & Khuyến mãi của SmartFood' }
  ]
});


const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 700);
});
</script>
