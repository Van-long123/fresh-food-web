<template>
  <SkCategoryProductsPage v-if="isLoadingPage" />
  <div v-else class="min-h-screen bg-[#fff] pb-14 text-[#111827]">
    <div class="mx-auto max-w-7xl px-4 pt-4 md:px-6">
      <nav
        aria-label="Breadcrumb"
        class="mb-4 flex items-center gap-2 text-sm text-slate-500"
      >
        <NuxtLink :to="ROUTES.HOME" class="hover:text-orange-600"
          >Trang chủ</NuxtLink
        >
        <i class="pi pi-angle-right text-xs" />
        <span class="text-slate-400">Danh mục</span>
        <i class="pi pi-angle-right text-xs" />
        <span class="line-clamp-1 text-slate-700">{{ categoryName }}</span>
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
            v-if="isLoadingGrid"
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
            <p class="mt-3 text-lg font-bold">{{ emptyStateTitle }}</p>
            <p class="mt-1 text-sm text-gray-500">
              {{ emptyStateDescription }}
            </p>
            <button
              class="mt-4 rounded-full bg-[#f47f20] px-5 py-2 font-semibold text-white"
              @click="handleEmptyAction"
            >
              {{ emptyStateActionLabel }}
            </button>
          </div>

          <div v-if="pagination.total > pagination.limit" class="mt-10">
            <BasePagination
              :model-value="pagination.page"
              :total="pagination.total"
              :per-page="pagination.limit"
              @update:model-value="handlePageChange"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ROUTES } from "~/constants/routes";
import BasePagination from "~/components/common/BasePagination.vue";
import SkProductCard from "~/components/skeletons/SkProductCard.vue";
import SkCategoryProductsPage from "~/components/skeletons/SkCategoryProductsPage.vue";
import { useCategoryProducts } from "~/composables/category/useCategoryProducts";
import { formatVnd } from "~/utils/currency";

const route = useRoute();
const categorySlug = computed(() => String(route.params.slug || "").trim());

const {
  category,
  products,
  pagination,
  priceStats,
  activeFilter,
  sortBy,
  minPrice,
  maxPrice,
  selectedBrands,
  isLoading,
  isSystemUpdatingPrice,
  isError,
  errorMessage,
  fetchPage,
  handlePageChange,
  resetFilters,
  setPageSize,
} = useCategoryProducts(categorySlug);

const categoryName = computed(() => category.value?.title || "");

useHead(() => ({
  title: categoryName.value
    ? `${categoryName.value} - SmartFood`
    : "Danh mục sản phẩm - SmartFood",
  meta: [
    { name: "description", content: "Trang Danh mục sản phẩm của SmartFood" },
  ],
}));

const isLoadingPage = computed(
  () => isLoading.value && products.value.length === 0,
);

const emptyStateTitle = computed(() => {
  if (isLoading.value) return "";
  if (products.value.length) return "";
  return isError.value ? "Không thể tải sản phẩm" : "Không tìm thấy sản phẩm";
});

const emptyStateDescription = computed(() => {
  if (isLoading.value) return "";
  if (products.value.length) return "";
  return isError.value
    ? errorMessage.value || "Vui lòng thử lại sau."
    : "Thử nới điều kiện lọc hoặc quay về danh mục tổng.";
});

const emptyStateActionLabel = computed(() => {
  if (isLoading.value) return "";
  if (products.value.length) return "";
  return isError.value ? "Thử lại" : "Xem tất cả";
});

const showMobileSort = ref(false);
const gridCols = ref<4 | 5>(5);

const visibleProducts = computed(() => products.value);

const handleEmptyAction = async () => {
  if (isError.value) {
    await fetchPage(1);
    return;
  }

  resetFilters();
  await fetchPage(1);
};

const filterChips = [
  { label: "Tất cả", value: "all" },
  { label: "Bán chạy", value: "best" },
  { label: "Giảm giá", value: "discount" },
  // { label: "Mới nhất", value: "new" },
] as const;

const rangeTrackStyle = computed(() => {
  const floor = priceFloor.value;
  const ceil = priceCeil.value;
  const span = Math.max(1, ceil - floor);

  const currentMin = Math.min(minPrice.value, maxPrice.value);
  const currentMax = Math.max(minPrice.value, maxPrice.value);

  const left = ((currentMin - floor) / span) * 100;
  const right = ((currentMax - floor) / span) * 100;
  return { left: `${left}%`, width: `${Math.max(0, right - left)}%` };
});

const priceFloor = computed(() => priceStats.value.minPrice || 20000);
const priceCeil = computed(() => priceStats.value.maxPrice || 200000);

const isLoadingGrid = computed(
  () => isLoading.value && products.value.length === 0,
);

let refetchTimer: ReturnType<typeof setTimeout> | null = null;
const scheduleRefetch = () => {
  if (refetchTimer) clearTimeout(refetchTimer);
  refetchTimer = setTimeout(() => {
    void fetchPage(1);
  }, 250);
};

onMounted(() => {
  setPageSize(15);

  void fetchPage(1);

  watch(
    categorySlug,
    () => {
      // Khi đổi slug, reset range để nhận range mới từ API
      minPrice.value = 0;
      maxPrice.value = 0;
      selectedBrands.value = [];
      activeFilter.value = "all";
      sortBy.value = "popular";
      void fetchPage(1);
    },
    { flush: "post" },
  );

  watch(activeFilter, () => {
    void fetchPage(1);
  });

  watch(sortBy, () => {
    void fetchPage(1);
  });

  watch([minPrice, maxPrice], () => {
    // Nếu đang load hoặc hệ thống đang tự đồng bộ giá thì không gọi lại
    if (isLoading.value || isSystemUpdatingPrice.value) return;
    
    scheduleRefetch();
  });

  watch(
    selectedBrands,
    () => {
      void fetchPage(1);
    },
    { deep: true },
  );
});

onBeforeUnmount(() => {
  if (refetchTimer) clearTimeout(refetchTimer);
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
