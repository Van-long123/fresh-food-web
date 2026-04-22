<template>
  <button
    v-show="isVisible"
    aria-label="Back to Top"
    class="fixed bottom-8 right-4 w-11 h-11 bg-white border border-gray-100 text-gray-500 hover:text-[#f47f20] hover:border-[#f47f20] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_16px_rgba(244,127,32,0.15)] flex items-center justify-center transition-all duration-300 z-50 group origin-center hover:-translate-y-1"
    @click="scrollToTop"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 group-hover:-translate-y-0.5 transition-transform duration-300 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2.5"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isVisible = ref(false);

const toggleVisibility = () => {
  if (window.scrollY > 300) {
    isVisible.value = true;
  } else {
    isVisible.value = false;
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", toggleVisibility);
});

onUnmounted(() => {
  window.removeEventListener("scroll", toggleVisibility);
});
</script>
