<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
        <div v-if="isFlashSale" class="hidden sm:flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
          </svg>
          Kết thúc sau 02:45:10
        </div>
      </div>
        <NuxtLink :to="ROUTES.CATEGORY('khuyen-mai-hot')" class="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 group">
          Xem tất cả
        <svg
xmlns="http://www.w3.org/2000/svg"
class="h-4 w-4 group-hover:translate-x-1 transition-transform"
fill="none"
viewBox="0 0 24 24"
stroke="currentColor"
stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
    </div>

    <!-- Layout Horizontal Scroll for Mobile, Grid for Desktop -->
    <div
:class="[
      'flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-5 gap-4 lg:gap-6 lg:overflow-visible hide-scrollbar',
    ]">
      <div v-for="product in products" :key="product.id" class="w-[200px] sm:w-[240px] lg:w-auto flex-shrink-0 lg:flex-shrink">
         <ProductCard :product="product" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ROUTES } from "~/constants/routes";
import ProductCard from './ProductCard.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  products: {
    type: Array,
    required: true
  },
  isFlashSale: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
