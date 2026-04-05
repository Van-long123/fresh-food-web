<template>
  <SkProfilePage v-if="isLoading" />
  <ProfilePage v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProfilePage from "~/components/pages/account/ProfilePage.vue";
import SkProfilePage from "~/components/skeletons/SkProfilePage.vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 700);
});
</script>
