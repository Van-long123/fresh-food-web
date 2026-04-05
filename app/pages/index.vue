<template>
  <!-- Skeleton Loading -->
  <SkHomePage v-if="isLoading" />

  <div
    v-else
    class="min-h-screen flex flex-col font-sans bg-gray-50/30 selection:bg-[#f47f20] selection:text-white"
  >
    <!-- Main Area with max width -->
    <div class="max-w-[1440px] mx-auto w-full flex items-start flex-1 gap-4">
      <!-- Left Sidebar - Sticky -->
      <Sidebar />

      <!-- Right Content Flow -->
      <main class="flex-1 min-w-0 px-4 sm:px-6 lg:px-0 py-6 pb-16">
        <!-- Hero Banner Component -->
        <HeroBanner />

        <!-- 6 Circular Campaign Badges -->
        <div
          class="flex items-center gap-4 sm:gap-6 mb-8 overflow-x-auto pb-2 custom-scrollbar hide-scrollbar-mobile px-1"
        >
          <div
            v-for="cat in categoriesMenu"
            :key="cat.id"
            @click="activeCategory = cat.id"
            class="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0 transition-transform duration-300 hover:-translate-y-1"
          >
            <!-- Active Wrapper style matches the screenshot (pink border wrap for selected) -->
            <div
              class="w-[84px] h-[84px] rounded-full flex items-center justify-center transition-all duration-300"
              :class="
                activeCategory === cat.id
                  ? 'p-[3px] border-[1.5px] border-[#fbafaf] bg-[#fdebea]'
                  : 'p-0 border-transparent bg-transparent opacity-90 hover:opacity-100'
              "
            >
              <div
                class="w-full h-full rounded-full flex items-center justify-center text-center font-black leading-tight shadow-md border-2 border-white/80"
                :class="[
                  cat.color,
                  cat.textColor,
                  activeCategory === cat.id ? 'text-[13px]' : 'text-[11px]',
                ]"
                v-html="cat.name"
              />
            </div>
          </div>
        </div>

        <!-- Khuyen Mai HOT section wrapper -->
        <div
          class="bg-[#fdebea] rounded-xl p-4 sm:p-5 mb-10 border border-red-100/50 shadow-sm relative group/slider"
        >
          <!-- Navigation Arrows for Hot Section -->
          <button
            @click="scrollHot('left')"
            class="absolute left-[-16px] top-[45%] lg:top-[50%] -translate-y-1/2 w-9 h-9 rounded-full bg-[#414141] text-white flex items-center justify-center hover:bg-[#6c6c6c] shadow-lg z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity"
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
                stroke-width="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            @click="scrollHot('right')"
            class="absolute right-[-16px] top-[45%] lg:top-[50%] -translate-y-1/2 w-9 h-9 rounded-full bg-[#414141] text-white flex items-center justify-center hover:bg-[#6c6c6c] shadow-lg z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity"
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
                stroke-width="2.5"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div ref="hotScrollRef" class="carousel-grid-2">
            <ProductCard
              v-for="product in hotDisplay"
              :key="product.uniqueId"
              :product="product"
              class="w-full"
            />
          </div>

          <div class="flex justify-center mt-6">
            <NuxtLink
              to="#"
              class="text-[#006ee6] text-[13px] font-bold hover:underline flex items-center gap-1 group/link"
            >
              Xem tất cả
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3 group-hover/link:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- The gioi trai cay section banner -->
        <div
          class="rounded-xl overflow-hidden mb-5 bg-gray-50 h-[100px] relative shadow-sm"
        >
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000"
            alt="Thế giới trái cây"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-r from-green-900/90 to-transparent px-8 flex flex-col justify-center"
          >
            <div class="flex items-center gap-4">
              <h2 class="text-3xl font-black text-[#eaff00] drop-shadow-md">
                Thế giới trái cây
              </h2>
              <span
                class="bg-gradient-to-r from-green-700 to-green-600 border border-green-500 text-white text-[11px] font-bold px-3 py-1 rounded shadow-lg uppercase tracking-wider hidden sm:inline-block"
                >Nhập khẩu trực tiếp</span
              >
            </div>
          </div>
        </div>

        <!-- Trai Cay products grid (Single Row Slider) -->
        <div class="relative group/slider mb-8">
          <!-- Navigation Arrows for Fruit Section -->
          <button
            @click="scrollFruit('left')"
            class="absolute left-[-16px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#414141] text-white flex items-center justify-center hover:bg-[#6c6c6c] shadow-lg z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity"
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
                stroke-width="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            @click="scrollFruit('right')"
            class="absolute right-[-16px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#414141] text-white flex items-center justify-center hover:bg-[#6c6c6c] shadow-lg z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity"
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
                stroke-width="2.5"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div ref="fruitScrollRef" class="carousel-grid-2 py-1">
            <ProductCard
              v-for="fruit in fruitDisplay"
              :key="fruit.uniqueId"
              :product="fruit"
              class="w-full"
            />
          </div>
        </div>

        <div class="flex justify-center mb-10 pb-6 border-b border-gray-200">
          <NuxtLink
            to="#"
            class="text-[#006ee6] text-[13px] font-bold hover:underline flex items-center gap-1 group/link"
          >
            Xem tất cả
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 group-hover/link:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </NuxtLink>
        </div>

        <!-- Blog Section component -->
        <BlogSection />
      </main>
    </div>

    <!-- Float Actions -->
    <BackToTop />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Sidebar from "~/components/layout/Sidebar.vue";
import ProductCard from "~/components/ProductCard.vue";
import HeroBanner from "~/components/HeroBanner.vue";
import BlogSection from "~/components/BlogSection.vue";
import BackToTop from "~/components/BackToTop.vue";
import SkHomePage from "~/components/skeletons/SkHomePage.vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 800);
});

// Exact mock data matching screenshot pricing
const hotProducts = ref([
  {
    id: 1,
    name: "Thùng khoai lang giống Nhật Antfarm 2kg (Hàng xuất khẩu)",
    image:
      "https://images.unsplash.com/photo-1596485750244-637dc4db0913?auto=format&fit=crop&w=800&q=80",
    price: 109000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
    buttonText: "Đặt trước",
  },
  {
    id: 2,
    name: "Thịt heo xay Meatcool (400g)",
    image:
      "https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?auto=format&fit=crop&w=800&q=80",
    price: 56400,
    originalPrice: 66400,
    discountPercent: 15,
    isBestPrice: false,
    isOnlineExclusive: true,
    buttonText: "Mua",
  },
  {
    id: 3,
    name: "Tôm sú quảng canh 1kg (20-25 con/kg)",
    image:
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
    price: 349000,
    originalPrice: 475000,
    discountPercent: 26,
    isBestPrice: true,
    isOnlineExclusive: false,
    buttonText: "Đặt trước",
  },
  {
    id: 4,
    name: "Combo táo & dưa lưới (1 Combo)",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
    price: 146500,
    originalPrice: 193900,
    discountPercent: 24,
    isBestPrice: true,
    isOnlineExclusive: true,
    buttonText: "Mua combo",
  },
  {
    id: 5,
    name: "Thùng nước tinh khiết Hikari chai 500ml (24 Chai)",
    image:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80",
    price: 69000,
    originalPrice: 98000,
    discountPercent: 29,
    isBestPrice: true,
    isOnlineExclusive: true,
    buttonText: "Mua",
  },
  {
    id: 6,
    name: "Combo Freshfoco: bò tái cắt 250g và diềm thăn bò cắt...",
    image:
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80",
    price: 145000,
    originalPrice: 186400,
    discountPercent: 22,
    isBestPrice: true,
    isOnlineExclusive: true,
    buttonText: "Mua combo",
  },
  {
    id: 7,
    name: "Combo 2 khay phi lê má đùi gà không da Japfa khay 500g",
    image:
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80",
    price: 89000,
    originalPrice: 119000,
    discountPercent: 25,
    isBestPrice: true,
    isOnlineExclusive: true,
    buttonText: "Mua combo",
  },
  {
    id: 8,
    name: "Combo 4 khay phi lê má đùi gà không da Japfa khay 500g",
    image:
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80",
    price: 172000,
    originalPrice: 238000,
    discountPercent: 27,
    isBestPrice: true,
    isOnlineExclusive: true,
    buttonText: "Mua combo",
  },
  {
    id: 9,
    name: "Combo gạo ST25 đặc sản Sóc Trăng túi 5kg và dầu nành...",
    image:
      "https://images.unsplash.com/photo-1586208556420-5dfc1e27a6c9?auto=format&fit=crop&w=800&q=80",
    price: 284000,
    originalPrice: 316000,
    discountPercent: 10,
    isBestPrice: true,
    isOnlineExclusive: true,
    buttonText: "Mua combo",
  },
  {
    id: 10,
    name: "Bánh mì que pate truyền thống Sundo 189g (2 gói)",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    price: 69000,
    originalPrice: 98000,
    discountPercent: 29,
    isBestPrice: true,
    isOnlineExclusive: true,
    buttonText: "Mua",
  },
]);

const fruitProducts = ref([
  {
    id: 11,
    name: "Combo bơ & chuối (1 Combo)",
    image:
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80",
    price: 60000,
    originalPrice: 114940,
    discountPercent: 47,
    isBestPrice: true,
    isOnlineExclusive: true,
    buttonText: "Mua combo",
  },
  {
    id: 12,
    name: "Dưa hấu giống Mỹ trái từ 2.5kg (1 Trái)",
    image:
      "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=800&q=80",
    price: 47500,
    originalPrice: 85000,
    discountPercent: 44,
    isBestPrice: false,
    isOnlineExclusive: false,
    buttonText: "Mua",
  },
  {
    id: 13,
    name: "Combo chuối Nam Mỹ + sữa uống lên men Yakult...",
    image:
      "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?auto=format&fit=crop&w=800&q=80",
    price: 40000,
    originalPrice: 59800,
    discountPercent: 33,
    isBestPrice: false,
    isOnlineExclusive: false,
    buttonText: "Mua combo",
  },
  {
    id: 14,
    name: "Combo sữa Yakult + Chuối Nam Mỹ (1 combo)",
    image:
      "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?auto=format&fit=crop&w=800&q=80",
    price: 40000,
    originalPrice: 58800,
    discountPercent: 31,
    isBestPrice: false,
    isOnlineExclusive: true,
    buttonText: "Mua combo",
  },
  {
    id: 15,
    name: "Quýt nội địa Trung (2KG)",
    image:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9db40bd?auto=format&fit=crop&w=800&q=80",
    price: 138000,
    originalPrice: 198000,
    discountPercent: 30,
    isBestPrice: true,
    isOnlineExclusive: true,
    buttonText: "Mua",
  },
]);

// Categories state
const activeCategory = ref("khuyen_mai_hot");
const categoriesMenu = ref([
  {
    id: "khuyen_mai_hot",
    name: "KHUYẾN MÃI<br/>HOT",
    color: "bg-[#e84142]",
    textColor: "text-white",
  },
  {
    id: "mua_la_tang",
    name: "MUA LÀ<br/>TẶNG",
    color: "bg-yellow-400",
    textColor: "text-white",
  },
  {
    id: "thit_meatcool",
    name: "THỊT MEATCOOL<br/>GIÁ TỐT",
    color: "bg-[#d32f2f]",
    textColor: "text-white",
  },
  {
    id: "rau_dong_gia",
    name: "RAU ĐỒNG GIÁ<br/>12K",
    color: "bg-green-600",
    textColor: "text-white",
  },
  {
    id: "combo_an_lien",
    name: "COMBO<br/>ĂN LIỀN",
    color: "bg-[#f47f20]",
    textColor: "text-white",
  },
  {
    id: "uu_dai_bill",
    name: "ƯU ĐÃI<br/>BILL 100K",
    color: "bg-red-500",
    textColor: "text-white",
  },
  {
    id: "nong_san",
    name: "Nông Sản<br/>Mùa Xuân",
    color: "bg-[#0bb5d8]",
    textColor: "text-white",
  },
]);

// Prepare duplicated data to perfectly test out slider functionality
const hotDisplay = computed(() => {
  // Shuffle/slice products dynamically to simulate tabs filtering
  const activeIndex = categoriesMenu.value.findIndex(
    (c) => c.id === activeCategory.value,
  );
  const arr = [
    ...hotProducts.value,
    ...hotProducts.value,
    ...hotProducts.value,
  ].map((item, index) => ({ ...item, uniqueId: "h" + index }));
  // Shift the array by 2 * activeIndex to visually refresh products upon clicking different tabs
  return arr.slice(activeIndex * 2).concat(arr.slice(0, activeIndex * 2));
});

const fruitDisplay = computed(() => {
  return [
    ...fruitProducts.value,
    ...fruitProducts.value,
    ...fruitProducts.value,
  ].map((item, index) => ({ ...item, uniqueId: "f" + index }));
});

// Hight-performance smooth scroll function using requestAnimationFrame
const smoothScroll = (element, targetPos, duration = 600) => {
  const startPos = element.scrollLeft;
  const distance = targetPos - startPos;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // easeOutQuart - starts fast, decelerates smoothly (very premium feel)
    const ease = 1 - Math.pow(1 - progress, 4);

    element.scrollLeft = startPos + distance * ease;

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };
  requestAnimationFrame(animation);
};

// Slider Scroll logic
const hotScrollRef = ref(null);
const scrollHot = (direction) => {
  if (hotScrollRef.value) {
    const scrollAmount = hotScrollRef.value.clientWidth * 0.95; // 95% of container width
    const target =
      hotScrollRef.value.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);
    smoothScroll(hotScrollRef.value, target, 700);
  }
};

const fruitScrollRef = ref(null);
const scrollFruit = (direction) => {
  if (fruitScrollRef.value) {
    const scrollAmount = fruitScrollRef.value.clientWidth * 0.95;
    const target =
      fruitScrollRef.value.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);
    smoothScroll(fruitScrollRef.value, target, 700);
  }
};
</script>

<style scoped>
/* Slider logic for multi rows using pure CSS grid */
.carousel-grid-2,
.carousel-grid-1 {
  display: grid;
  grid-auto-flow: column;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
}

/* Hide scrollbar for Chrome/Safari */
.carousel-grid-2::-webkit-scrollbar,
.carousel-grid-1::-webkit-scrollbar {
  display: none;
}

/* Specific Row definitions */
.carousel-grid-2 {
  grid-template-rows: repeat(2, min-content);
}
.carousel-grid-1 {
  grid-template-rows: repeat(1, min-content);
}

/* Responsive Columns setup via grid-auto-columns */

/* Desktop Extra Large: 5 columns per view */
@media (min-width: 1280px) {
  .carousel-grid-2,
  .carousel-grid-1 {
    /* 5 items -> 4 gaps of 12px = 48px */
    grid-auto-columns: calc((100% - 48px) / 5);
  }
}

/* Desktop Large: 4 columns per view */
@media (min-width: 1024px) and (max-width: 1279px) {
  .carousel-grid-2,
  .carousel-grid-1 {
    /* 4 items -> 3 gaps of 12px = 36px */
    grid-auto-columns: calc((100% - 36px) / 4);
  }
}

/* Tablet: 3 columns per view */
@media (min-width: 640px) and (max-width: 1023px) {
  .carousel-grid-2,
  .carousel-grid-1 {
    /* 3 items -> 2 gaps of 12px = 24px */
    grid-auto-columns: calc((100% - 24px) / 3);
  }
}

/* Mobile: 2 columns per view */
@media (max-width: 639px) {
  .carousel-grid-2,
  .carousel-grid-1 {
    /* 2 items -> 1 gap of 12px */
    grid-auto-columns: calc((100% - 12px) / 2);
  }
}

/* Base custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>
