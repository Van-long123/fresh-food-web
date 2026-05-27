<template>
  <SkSearchPage v-if="isLoading" />
  <div
    v-else
    class="min-h-screen flex flex-col font-sans bg-gray-50/30 selection:bg-[#f47f20] selection:text-white"
  >
    <!-- Same layout wrapper as homepage -->
    <div class="max-w-[1440px] mx-auto w-full flex items-start flex-1 gap-4">
      <!-- Left Sidebar (reuse from homepage) -->
      <Sidebar />

      <!-- Right Content -->
      <main class="flex-1 min-w-0 px-4 sm:px-6 lg:px-0 py-6 pb-16">
        <nav
          aria-label="Breadcrumb"
          class="mb-4 flex items-center gap-2 text-sm text-slate-500"
        >
          <NuxtLink :to="ROUTES.HOME" class="hover:text-orange-600"
            >Trang chủ</NuxtLink
          >
          <i class="pi pi-angle-right text-xs" />
          <span class="text-slate-700 font-bold">Tìm kiếm</span>
        </nav>
        <!-- Category badges scroll strip -->
        <!-- <div
          class="flex items-center gap-4 sm:gap-6 mb-6 overflow-x-auto pb-2 hide-scrollbar px-1 pt-1"
        >
          <div
            v-for="cat in relatedCategories"
            :key="cat.name"
            class="flex flex-col items-center gap-1.5 cursor-pointer group flex-shrink-0 transition-transform duration-300 hover:-translate-y-1"
            @click="toggleCategory(cat.name)"
          >
            <div
              class="w-[60px] h-[60px] rounded-full overflow-hidden border-2 transition-all duration-200 flex-shrink-0"
              :class="
                selectedCategory === cat.name
                  ? 'border-[#f47f20] shadow-[0_0_0_3px_rgba(244,127,32,0.15)]'
                  : 'border-gray-200 group-hover:border-gray-300'
              "
            >
              <img
                :src="cat.icon"
                :alt="cat.name"
                class="w-full h-full object-cover"
              />
            </div>
            <span
              class="text-[11px] text-center max-w-[72px] leading-tight"
              :class="
                selectedCategory === cat.name
                  ? 'text-[#f47f20] font-bold'
                  : 'text-gray-600 font-medium'
              "
            >
              {{ cat.name }}
            </span>
          </div>
        </div> -->

        <!-- Result count -->
        <p class="text-[14px] text-gray-500 mb-4">
          Có
          <strong class="text-gray-800">{{ pagination.total }}</strong>
          sản phẩm phù hợp với từ khóa "<strong class="text-gray-800">{{
            routeKeyword || "mận"
          }}</strong
          >"
        </p>

        <!-- Product Grid -->
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
        >
          <ProductCard
            v-for="item in products"
            :key="item.id"
            :product="item"
          />
        </div>

        <!-- Pagination -->
        <BasePagination
          v-if="pagination.total > 0"
          v-model="currentPage"
          :total="pagination.total"
          :per-page="perPage"
          @change="scrollToTop"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ROUTES } from "~/constants/routes";
import Sidebar from "~/components/layout/Sidebar.vue";
import ProductCard from "~/components/features/home/ProductCard.vue";
import SkSearchPage from "~/components/skeletons/SkSearchPage.vue";
import { useProductSearch } from "~/composables/product/useProductSearch";

useHead({
  title: "Tìm kiếm sản phẩm - SmartFood",
  meta: [
    { name: "description", content: "Trang Tìm kiếm sản phẩm của SmartFood" },
  ],
});

const {
  routeKeyword,
  // selectedCategory,
  currentPage,
  perPage,
  isLoading,
  products,
  pagination,
  // toggleCategory,
  scrollToTop,
} = useProductSearch();

/* Category badges for the scroll strip */
// const relatedCategories = [
// {
// name: "Trái cây Việt Nam",
// icon: "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?auto=format&fit=crop&w=160&q=80",
// },
// {
// name: "Trái cây nhập khẩu",
// icon: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=160&q=80",
// },
// {
// name: "Trái cây cắt sẵn",
// icon: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=160&q=80",
// },
// {
// name: "Đào, mận, hồng, ổi",
// icon: "https://images.unsplash.com/photo-1595124231685-c255698ddce5?auto=format&fit=crop&w=160&q=80",
// },
// {
// name: "Đào, mận, hồng",
// icon: "https://images.unsplash.com/photo-1563252722-97e42f3dbe0e?auto=format&fit=crop&w=160&q=80",
// },
// {
// name: "Trái cây nhiệt đới",
// icon: "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?auto=format&fit=crop&w=160&q=80",
// },
// ];
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  scrollbar-width: none;
}
</style>
