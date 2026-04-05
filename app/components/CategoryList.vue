<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Danh Mục Nổi Bật</h2>
    </div>

    <div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="`/category/${category.id}`"
        class="group flex flex-col items-center gap-3"
      >
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-50 flex items-center justify-center p-4 shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-green-200 group-hover:-translate-y-1 transition-all duration-300"
        >
          <img
            :src="category.image"
            :alt="category.name"
            class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <span
          class="text-xs sm:text-sm font-medium text-center text-gray-700 group-hover:text-green-600 transition-colors line-clamp-2"
        >
          {{ category.name }}
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

// Mock Data
const categories = ref([
  {
    id: 1,
    name: "Thịt, Cá, Hải Sản",
    image: "https://cdn-icons-png.flaticon.com/512/3143/3143645.png",
  },
  {
    id: 2,
    name: "Rau, Củ, Trái Cây",
    image: "https://cdn-icons-png.flaticon.com/512/3081/3081831.png",
  },
  {
    id: 3,
    name: "Sữa & Bơ, Phô mai",
    image: "https://cdn-icons-png.flaticon.com/512/3014/3014526.png",
  },
  {
    id: 4,
    name: "Gạo, Bột, Đồ khô",
    image: "https://cdn-icons-png.flaticon.com/512/2857/2857448.png",
  },
  {
    id: 5,
    name: "Đồ uống, Giải khát",
    image: "https://cdn-icons-png.flaticon.com/512/3050/3050114.png",
  },
  {
    id: 6,
    name: "Bánh kẹo, Ăn vặt",
    image: "https://cdn-icons-png.flaticon.com/512/2553/2553642.png",
  },
  {
    id: 7,
    name: "Đồ hộp, Chế biến",
    image: "https://cdn-icons-png.flaticon.com/512/3081/3081977.png",
  },
  {
    id: 8,
    name: "Vệ sinh nhà cửa",
    image: "https://cdn-icons-png.flaticon.com/512/1036/1036034.png",
  },
]);
</script>
