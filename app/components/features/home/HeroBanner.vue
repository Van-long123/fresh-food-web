<template>
  <div
    class="relative rounded-lg overflow-hidden aspect-[21/9] md:aspect-[3/1] bg-gray-100 mb-6 group cursor-pointer"
    @mouseenter="pauseSlide"
    @mouseleave="startSlide"
  >
    <div
      class="flex transition-transform duration-700 ease-in-out h-full w-full"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="min-w-full h-full relative"
      >
        <img
          :src="slide.image"
          :alt="slide.title"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-transparent flex items-center justify-start p-8 md:p-16"
        >
          <div class="text-left text-white max-w-lg">
            <span
              class="bg-white text-orange-600 font-bold px-4 py-1.5 rounded-full text-sm inline-block mb-3"
              >Combo Độc Quyền Online</span
            >
            <h2 class="text-4xl md:text-6xl font-black mb-2 tracking-tight">
              {{ slide.title }}
            </h2>
            <p class="text-lg font-medium">{{ slide.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Arrows -->
    <button
      class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      @click.stop="prevSlide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    <button
      class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      @click.stop="nextSlide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>

    <!-- Counter Badge -->
    <div
      class="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded shadow-lg z-10"
    >
      {{ currentIndex + 1 }}/{{ slides.length }}
    </div>

    <!-- Dots Container -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
      <button
        v-for="(_, index) in slides"
        :key="index"
        class="w-2.5 h-2.5 rounded-full transition-all"
        :class="
          currentIndex === index
            ? 'bg-white w-8'
            : 'bg-white/50 hover:bg-white/80'
        "
        @click="goToSlide(index)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const slides = ref([
  {
    image:
      "https://res.cloudinary.com/dnraaygwf/image/upload/v1778662048/photo-1542838132-92c53300491e_am4sst.avif",
    title: "MÓN NGON MỖI NGÀY",
    description: "Chất Lượng - Tiện Lợi - Tiết Kiệm",
  },
  {
    image:
      "https://res.cloudinary.com/dnraaygwf/image/upload/v1778662053/photo-1604719312566-8912e9227c6a_lmwqwn.avif",
    title: "THỰC PHẨM TƯƠI SỐNG",
    description:
      "Giảm đến 30% cho các sản phẩm thịt cá, rau củ quả trong tuần lễ vàng.",
  },
  {
    image:
      "https://res.cloudinary.com/dnraaygwf/image/upload/v1778662048/photo-1583258292688-d0213dc5a3a8_a70tvd.avif",
    title: "TRÁI CÂY NHẬP KHẨU",
    description: "Táo, Nho, Cherry nhập khẩu trực tiếp, đảm bảo độ tươi ngon.",
  },
  // {
  //   image: banner1,
  //   description:
  //     "Voucher giảm sâu kết hợp combo giá tốt - Mua sắm thả ga cuối tuần!",
  // },
  // {
  //   image: banner2,
  // },
]);

const currentIndex = ref(0);
let timer = null;

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + slides.value.length) % slides.value.length;
};

const goToSlide = (index) => {
  currentIndex.value = index;
};

const startSlide = () => {
  timer = setInterval(nextSlide, 5000);
};

const pauseSlide = () => {
  clearInterval(timer);
};

onMounted(() => {
  startSlide();
});

onUnmounted(() => {
  pauseSlide();
});
</script>
