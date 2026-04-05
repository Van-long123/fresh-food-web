<template>
  <aside class="w-[240px] flex-shrink-0 bg-white border-r border-gray-100 sticky top-[112px] h-[calc(100vh-112px)] overflow-y-auto hidden lg:block custom-scrollbar pb-6 pt-2">
    <ul>
      <li v-for="(item, index) in categories" :key="index">
        <NuxtLink :to="item.link" class="flex items-center py-2.5 px-3 hover:bg-gray-50 group cursor-pointer border-b border-transparent hover:border-gray-50 transition-colors">
          <div class="w-8 h-8 rounded-full overflow-hidden border border-gray-100 mr-3 flex-shrink-0 bg-white flex items-center justify-center p-0.5 group-hover:shadow-sm">
            <img :src="item.icon" :alt="item.name" class="w-full h-full object-contain rounded-full" />
          </div>
          <span class="text-[13px] text-gray-700 font-medium leading-snug flex-1 group-hover:text-[#f47f20]">
            {{ item.name }}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400 group-hover:text-[#f47f20]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
  { name: 'Khuyến mãi HOT', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/3594/3594165.png' },
  { name: 'Thế giới trái cây', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/3137/3137286.png' },
  { name: 'Rau củ quả', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/2153/2153788.png' },
  { name: 'Thịt, cá, trứng, thủy, hải sản', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/3143/3143645.png' },
  { name: 'Kem, sữa chua', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/2619/2619472.png' },
  { name: 'Sữa, bơ, phô mai', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/3014/3014526.png' },
  { name: 'Mì gói, xúc xích, đồ hộp', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/2857/2857448.png' },
  { name: 'Thực phẩm đông mát', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081977.png' },
  { name: 'Bánh kẹo, ăn vặt', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/2553/2553642.png' },
  { name: 'Bánh tươi, ngũ cốc, ăn sáng', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/3014/3014526.png' },
  { name: 'Thẻ quà tặng', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/2953/2953283.png' },
  { name: 'Gạo, đậu, bột, đồ khô', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/2857/2857448.png' },
  { name: 'Dầu ăn, nước chấm, gia vị', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081977.png' },
  { name: 'Bia, rượu, đồ uống có cồn', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/3050/3050114.png' },
  { name: 'Trà, cà phê, nước giải khát', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/1036/1036034.png' },
  { name: 'Đồ dùng gia đình', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/1036/1036034.png' },
  { name: 'Chăm sóc cá nhân', link: '#', icon: 'https://cdn-icons-png.flaticon.com/512/2953/2953283.png' }
])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #94a3b8;
}
</style>
