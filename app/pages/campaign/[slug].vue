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
        <span class="text-slate-400">Chiến dịch</span>
        <i class="pi pi-angle-right text-xs" />
        <span class="text-slate-700l">{{ campaignName }}</span>
      </nav>

      <section class="mt-5">
        <div>
          <div
            v-if="isLoadingGrid"
            class="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          >
            <SkProductCard v-for="n in 10" :key="n" />
          </div>

          <div
            v-else-if="products.length"
            class="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          >
            <div
              v-for="(product, idx) in products"
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
import { computed, onMounted, watch } from "vue";
import { ROUTES } from "~/constants/routes";
import BasePagination from "~/components/common/BasePagination.vue";
import SkProductCard from "~/components/skeletons/SkProductCard.vue";
import SkCategoryProductsPage from "~/components/skeletons/SkCategoryProductsPage.vue";
import ProductCard from "~/components/features/home/ProductCard.vue";
import { useCampaignProducts } from "~/composables/campaign/useCampaignProducts";

const route = useRoute();
const campaignSlug = computed(() => String(route.params.slug || "").trim());

const {
  campaign,
  products,
  pagination,
  isLoading,
  isError,
  errorMessage,
  fetchPage,
  handlePageChange,
  setPageSize,
} = useCampaignProducts(campaignSlug);

const campaignName = computed(
  () => campaign.value?.name.replace(/<[^>]*>?/gm, " ") || "",
);

useHead(() => ({
  title: campaignName.value
    ? `${campaignName.value} - SmartFood`
    : "Chiến dịch - SmartFood",
  meta: [
    { name: "description", content: "Sản phẩm theo chiến dịch của SmartFood" },
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
    : "Hiện chưa có sản phẩm nào cho chiến dịch này.";
});

const emptyStateActionLabel = computed(() => {
  if (isLoading.value) return "";
  if (products.value.length) return "";
  return isError.value ? "Thử lại" : "Làm mới";
});

const isLoadingGrid = computed(
  () => isLoading.value && products.value.length === 0,
);

const handleEmptyAction = async () => {
  await fetchPage(1);
};

onMounted(() => {
  setPageSize(20);
  void fetchPage(1);

  watch(campaignSlug, () => {
    void fetchPage(1);
  });
});
</script>

<style scoped>
.card-enter {
  opacity: 0;
  transform: translateY(20px);
  animation: cardEnter 0.45s ease forwards;
}

.veggie-bounce {
  animation: veggieBounce 1.5s infinite;
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
