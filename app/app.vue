<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- <GlobalSkeletonOverlay :visible="isGlobalLoading" /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

// import GlobalSkeletonOverlay from "~/components/common/GlobalSkeletonOverlay.vue";

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
