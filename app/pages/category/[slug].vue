<template>
  <SkCategoryProductsPage v-if="isLoadingPage" />
  <div v-else class="min-h-screen bg-[#f5f5f5] pb-14 text-[#111827]">
    <div class="mx-auto max-w-7xl px-4 pt-4 md:px-6">
      <nav class="text-xs text-[#666]">
        <NuxtLink :to="ROUTES.HOME" class="hover:text-[#4caf50]"
          >Trang chủ</NuxtLink
        >
        <span class="mx-1 text-[#ccc]">›</span>
        <span>Danh mục</span>
        <span class="mx-1 text-[#ccc]">›</span>
        <span class="font-semibold">{{ categoryName }}</span>
      </nav>

      <div
        class="sticky top-15 z-30 mt-3 border-b border-[#e5e7eb] bg-white shadow-sm"
      >
        <div class="flex items-center justify-between gap-3 px-3 py-3 md:px-4">
          <div class="hide-scrollbar flex items-center gap-2 overflow-x-auto">
            <button
              v-for="chip in filterChips"
              :key="chip.value"
              class="shrink-0 rounded-full border px-4 py-1.5 text-sm transition"
              :class="
                activeFilter === chip.value
                  ? 'border-[#f47f20] bg-[#f47f20] text-white'
                  : 'border-[#e5e7eb] bg-white hover:border-[#f47f20]'
              "
              @click="activeFilter = chip.value"
            >
              {{ chip.label }}
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="grid h-9 w-9 place-items-center rounded-lg border border-[#e5e7eb] md:hidden"
              @click="showMobileSort = !showMobileSort"
            >
              <span>⏳</span>
            </button>
            <select
              v-model="sortBy"
              class="hidden h-9 rounded-lg border border-[#e5e7eb] px-3 text-sm md:block"
            >
              <option value="popular">Sắp xếp</option>
              <option value="priceAsc">Giá tăng dần</option>
              <option value="priceDesc">Giá giảm dần</option>
              <option value="discountDesc">% giảm nhiều nhất</option>
            </select>

            <button
              class="grid h-9 w-9 place-items-center rounded-lg border border-[#e5e7eb]"
              @click="gridCols = gridCols === 5 ? 4 : 5"
            >
              <svg
                viewBox="0 0 24 24"
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
              </svg>
            </button>
          </div>
        </div>

        <div
          v-if="showMobileSort"
          class="border-t border-[#f3f4f6] px-3 py-2 md:hidden"
        >
          <select
            v-model="sortBy"
            class="h-9 w-full rounded-lg border border-[#e5e7eb] px-3 text-sm"
          >
            <option value="popular">Sắp xếp</option>
            <option value="priceAsc">Giá tăng dần</option>
            <option value="priceDesc">Giá giảm dần</option>
            <option value="discountDesc">% giảm nhiều nhất</option>
          </select>
        </div>
      </div>

      <section class="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        <aside
          class="hidden h-fit rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:sticky lg:top-20 lg:block"
        >
          <h3 class="text-sm font-bold">Danh mục liên quan</h3>
          <div class="mt-3 space-y-1">
            <button
              v-for="cat in relatedCategories"
              :key="cat.name"
              class="flex w-full items-center gap-2 border-l-4 px-2 py-2 text-left text-sm transition"
              :class="
                cat.name === categoryName
                  ? 'border-[#f47f20] font-bold text-[#f47f20]'
                  : 'border-transparent hover:text-green-600'
              "
            >
              <span>{{ cat.icon }}</span>
              <span>{{ cat.name }}</span>
            </button>
          </div>

          <div class="mt-5">
            <h3 class="text-sm font-bold">Lọc giá</h3>
            <p class="mt-2 text-sm text-gray-600">
              {{ formatVnd(minPrice) }}đ - {{ formatVnd(maxPrice) }}đ
            </p>
            <div class="relative mt-4 h-8">
              <div class="absolute top-3 h-1 w-full rounded-full bg-gray-200" />
              <div
                class="absolute top-3 h-1 rounded-full bg-[#f47f20]"
                :style="rangeTrackStyle"
              />
              <input
                v-model.number="minPrice"
                type="range"
                :min="priceFloor"
                :max="priceCeil"
                step="1000"
                class="range-input"
              />
              <input
                v-model.number="maxPrice"
                type="range"
                :min="priceFloor"
                :max="priceCeil"
                step="1000"
                class="range-input"
              />
            </div>
          </div>

          <!-- <div class="mt-5">
            <h3 class="text-sm font-bold">Thương hiệu</h3>
            <label
              v-for="brand in brands"
              :key="brand"
              class="mt-2 flex items-center gap-2 text-sm"
            >
              <input
                v-model="selectedBrands"
                type="checkbox"
                :value="brand"
                class="accent-[#f47f20]"
              />
              <span>{{ brand }}</span>
            </label>
          </div> -->
        </aside>

        <div>
          <div
            v-if="isLoading"
            class="grid gap-4 grid-cols-2 md:grid-cols-3"
            :class="gridCols === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'"
          >
            <SkProductCard v-for="n in 10" :key="n" />
          </div>

          <div
            v-else-if="visibleProducts.length"
            class="grid gap-4 grid-cols-2 md:grid-cols-3"
            :class="gridCols === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'"
          >
            <div
              v-for="(product, idx) in visibleProducts"
              :key="product.id"
              class="card-enter"
              :style="{ animationDelay: `${idx * 50}ms` }"
            >
              <ProductCard :product="product" />
            </div>
          </div>

          <div v-else class="mt-10 rounded-2xl bg-white p-10 text-center">
            <svg
              class="mx-auto h-20 w-20 veggie-bounce"
              viewBox="0 0 120 120"
              fill="none"
            >
              <ellipse cx="60" cy="108" rx="30" ry="8" fill="#e5e7eb" />
              <path
                d="M60 20c-16 0-30 15-30 33 0 24 30 47 30 47s30-23 30-47c0-18-14-33-30-33z"
                fill="#f47f20"
              />
              <path
                d="M60 26c8-11 20-13 26-11-2 10-8 18-18 22"
                stroke="#4caf50"
                stroke-width="5"
                stroke-linecap="round"
              />
            </svg>
            <p class="mt-3 text-lg font-bold">Không tìm thấy sản phẩm</p>
            <p class="mt-1 text-sm text-gray-500">
              Thử nới điều kiện lọc hoặc quay về danh mục tổng.
            </p>
            <button
              class="mt-4 rounded-full bg-[#f47f20] px-5 py-2 font-semibold text-white"
              @click="resetFilters"
            >
              Xem tất cả
            </button>
          </div>

          <div v-if="showLoadSpinner" class="flex justify-center py-6">
            <div
              class="h-6 w-6 animate-spin rounded-full border-2 border-[#f47f20] border-t-transparent"
            />
          </div>
          <div ref="loadSentinel" class="h-2" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ROUTES } from "~/constants/routes";
import SkProductCard from "~/components/skeletons/SkProductCard.vue";
import SkCategoryProductsPage from "~/components/skeletons/SkCategoryProductsPage.vue";

useHead({
  title: "Danh mục sản phẩm - SmartFood",
  meta: [
    { name: "description", content: "Trang Danh mục sản phẩm của SmartFood" },
  ],
});

const isLoadingPage = ref(false);

const categoryName = ref("Rau củ tươi");

const filterChips = [
  { label: "Tất cả", value: "all" },
  { label: "Bán chạy", value: "best" },
  { label: "Giảm giá", value: "discount" },
  { label: "Mới nhất", value: "new" },
] as const;

const relatedCategories = [
  { icon: "🥬", name: "Rau củ tươi" },
  { icon: "🍎", name: "Trái cây" },
  { icon: "🥩", name: "Thịt cá" },
  { icon: "🥛", name: "Sữa bơ" },
];

const brands = ["SmartFarm", "Fresh365", "GreenLife", "Dalat Organics"];

const allProducts = Array.from({ length: 32 }).map((_, idx) => {
  const price = 25000 + idx * 4000;
  const discount = idx % 3 === 0 ? 10 + (idx % 5) * 5 : 0;
  return {
    id: idx + 1,
    name: `Sản phẩm rau củ số ${idx + 1}`,
    slug: `san-pham-${idx + 1}`,
    image: `https://picsum.photos/seed/food-cat-${idx + 1}/400/400`,
    price,
    originalPrice: discount ? Math.round(price * 1.2) : null,
    discountPercent: discount || null,
    isOnlineExclusive: idx % 4 === 0,
    isBestPrice: idx % 5 === 0,
    buttonText: "Mua",
    sold: 120 + idx * 7,
    isNew: idx > 24,
    brand: brands[idx % brands.length],
  };
});

const activeFilter = ref<(typeof filterChips)[number]["value"]>("all");
const sortBy = ref("popular");
const showMobileSort = ref(false);
const gridCols = ref<4 | 5>(5);
const isLoading = ref(true);
const showLoadSpinner = ref(false);

const priceFloor = 20000;
const priceCeil = 200000;
const minPrice = ref(50000);
const maxPrice = ref(150000);
const selectedBrands = ref<string[]>([]);

const pageSize = 10;
const currentPage = ref(1);
const loadSentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const parallaxOffset = ref(0);

const filteredProducts = computed(() => {
  const currentMin = Math.min(minPrice.value, maxPrice.value);
  const currentMax = Math.max(minPrice.value, maxPrice.value);

  return allProducts
    .filter((item) => {
      if (activeFilter.value === "best") return item.sold > 220;
      if (activeFilter.value === "discount") return !!item.discountPercent;
      if (activeFilter.value === "new") return item.isNew;
      return true;
    })
    .filter((item) => item.price >= currentMin && item.price <= currentMax)
    .filter(
      (item) =>
        !selectedBrands.value.length ||
        selectedBrands.value.includes(item.brand ?? ""),
    );
});

const sortedProducts = computed(() => {
  const list = [...filteredProducts.value];
  if (sortBy.value === "priceAsc")
    return list.sort((a, b) => a.price - b.price);
  if (sortBy.value === "priceDesc")
    return list.sort((a, b) => b.price - a.price);
  if (sortBy.value === "discountDesc") {
    return list.sort(
      (a, b) => (b.discountPercent || 0) - (a.discountPercent || 0),
    );
  }
  return list.sort((a, b) => b.sold - a.sold);
});

const visibleProducts = computed(() =>
  sortedProducts.value.slice(0, currentPage.value * pageSize),
);

const rangeTrackStyle = computed(() => {
  const left = ((minPrice.value - priceFloor) / (priceCeil - priceFloor)) * 100;
  const right =
    ((maxPrice.value - priceFloor) / (priceCeil - priceFloor)) * 100;
  return { left: `${left}%`, width: `${right - left}%` };
});

const resetFilters = () => {
  activeFilter.value = "all";
  sortBy.value = "popular";
  minPrice.value = 50000;
  maxPrice.value = 150000;
  selectedBrands.value = [];
};

const formatVnd = (value: number) => value.toLocaleString("vi-VN");

const loadMore = () => {
  if (visibleProducts.value.length >= sortedProducts.value.length) return;
  showLoadSpinner.value = true;
  setTimeout(() => {
    currentPage.value += 1;
    showLoadSpinner.value = false;
  }, 550);
};

watch([activeFilter, sortBy, minPrice, maxPrice, selectedBrands], () => {
  currentPage.value = 1;
});

const handleParallax = () => {
  parallaxOffset.value = Math.min(window.scrollY * 0.04, 16);
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 700);

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) loadMore();
      });
    },
    { rootMargin: "200px" },
  );

  if (loadSentinel.value) observer.observe(loadSentinel.value);
  window.addEventListener("scroll", handleParallax, { passive: true });
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener("scroll", handleParallax);
});
</script>

<style scoped>
.category-banner {
  background: linear-gradient(90deg, #fc5c22 0%, #f47f20 100%);
  min-height: 120px;
}

.reveal-up {
  animation: revealUp 500ms ease-out both;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.range-input {
  position: absolute;
  top: 0;
  width: 100%;
  background: transparent;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  height: 16px;
  width: 16px;
  border-radius: 9999px;
  border: 2px solid #fff;
  background: #f47f20;
  cursor: pointer;
}

.card-enter {
  opacity: 0;
  transform: translateY(20px);
  animation: cardEnter 0.45s ease forwards;
}

.veggie-bounce {
  animation: veggieBounce 1.5s infinite;
}

@keyframes revealUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes veggieBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
