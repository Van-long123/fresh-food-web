<template>
  <SkCartPage v-if="isLoading" />
  <Cart v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Cart from "~/components/pages/commerce/Cart.vue";
import SkCartPage from "~/components/skeletons/SkCartPage.vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 700);
});
</script>
