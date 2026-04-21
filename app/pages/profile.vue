<template>
  <SkProfilePage v-if="isLoading" />
  <ProfilePage v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProfilePage from "~/components/pages/account/ProfilePage.vue";
import SkProfilePage from "~/components/skeletons/SkProfilePage.vue";

definePageMeta({ middleware: "auth" });

useHead({
  title: "Hồ sơ cá nhân - SmartFood",
  meta: [{ name: "description", content: "Trang Hồ sơ cá nhân của SmartFood" }],
});

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 700);
});
</script>
