<template>
  <div>
    <NuxtRouteAnnouncer />
    <Toast position="top-right" />

    <!-- Fullpage loading khi khởi động app lần đầu / route transition -->
    <!-- <AppLoading v-if="isGlobalLoading" variant="fullpage" /> -->

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const isGlobalLoading = ref(true);
const nuxtApp = useNuxtApp();

const onPageStart = () => {
  isGlobalLoading.value = true;
};

const onPageFinish = () => {
  setTimeout(() => {
    isGlobalLoading.value = false;
  }, 180);
};

onMounted(() => {
  // Ẩn loading sau khi app khởi tạo xong
  setTimeout(() => {
    isGlobalLoading.value = false;
  }, 260);

  nuxtApp.hook("page:start", onPageStart);
  nuxtApp.hook("page:finish", onPageFinish);
});

onUnmounted(() => {
  nuxtApp.hooks.removeHook("page:start", onPageStart);
  nuxtApp.hooks.removeHook("page:finish", onPageFinish);
});
</script>
