<template>
  <SkProductDetailPage v-if="isLoading" />

  <div
    v-else-if="!detail"
    class="min-h-screen bg-[#f5f5f5] px-4 py-12 text-center text-[#222]"
  >
    <p class="text-xl font-bold">Không tìm thấy sản phẩm.</p>
    <NuxtLink
      :to="ROUTES.HOME"
      class="mt-4 inline-block text-sm font-semibold text-[#4caf50] hover:underline"
    >
      Quay về trang chủ
    </NuxtLink>
  </div>

  <div v-else class="min-h-screen bg-[#f5f5f5] pb-12 text-[#222]">
    <div class="mx-auto max-w-7xl px-4 pt-4 md:px-6">
      <nav
        aria-label="Breadcrumb"
        class="mb-4 flex items-center gap-2 text-sm text-slate-500"
      >
        <NuxtLink :to="ROUTES.HOME" class="hover:text-orange-600"
          >Trang chủ</NuxtLink
        >
        <i class="pi pi-angle-right text-xs" />
        <NuxtLink
          :to="categorySlug ? ROUTES.CATEGORY(categorySlug) : ROUTES.HOME"
          class="hover:text-orange-600"
          >{{ categoryName }}</NuxtLink
        >
        <i class="pi pi-angle-right text-xs" />
        <span class="line-clamp-1 text-slate-700">{{ shortName }}</span>
      </nav>

      <section class="mt-4 grid gap-6 lg:grid-cols-[45%_55%]">
        <div class="h-fit lg:sticky lg:top-20">
          <div class="relative rounded-2xl bg-white p-3 shadow-sm">
            <span
              v-if="product.discountPercent"
              class="absolute left-4 top-4 z-10 rounded-md bg-[#fced44] px-2 py-1 text-sm font-black text-black"
              >-{{ product.discountPercent }}%</span
            >
            <span
              v-if="product.isOnlineExclusive"
              class="absolute left-4 top-14 z-10 rounded-md bg-linear-to-r from-[#fc5c22] to-[#f47f20] px-2 py-1 text-xs font-bold text-white"
            >
              ĐỘC QUYỀN ONLINE
            </span>

            <div class="absolute right-4 top-4 z-10 flex gap-2">
              <button
                v-for="item in shareItems"
                :key="item.key"
                class="share-btn"
                @click="copyOrShare(item.key)"
              >
                <span>{{ item.icon }}</span>
                <span class="tooltip">{{ item.label }}</span>
              </button>
            </div>

            <button class="block w-full" @click="showLightbox = true">
              <img
                :src="activeImage"
                alt="Product image"
                class="aspect-square w-full rounded-xl object-cover"
              />
            </button>

            <div class="mt-3 flex gap-2 overflow-x-auto">
              <button
                v-for="img in images"
                :key="img"
                class="h-18 w-18 shrink-0 overflow-hidden rounded-xl border-2 transition hover:scale-110"
                :class="
                  activeImage === img
                    ? 'border-[#f47f20]'
                    : 'border-transparent'
                "
                @click="activeImage = img"
              >
                <img
                  :src="img"
                  alt="thumb"
                  class="h-full w-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h1
            class="animate-fade-right text-[22px] font-bold leading-[1.3] text-[#222]"
          >
            {{ product.name }}
          </h1>

          <button
            class="mt-2 flex items-center gap-2 text-left"
            @click="scrollToReviews"
          >
            <div class="flex items-center">
              <svg
                v-for="i in 5"
                :key="i"
                viewBox="0 0 20 20"
                class="h-4 w-4"
                :class="
                  i <= roundedAverage ? 'text-[#f59e0b]' : 'text-gray-300'
                "
                fill="currentColor"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <span class="text-xs text-[#666]"
              >({{ ratingSummary.totalReviews }} đánh giá)</span
            >
          </button>

          <div class="mt-4 flex flex-wrap items-end gap-3">
            <p class="text-[28px] font-black text-[#f47f20]">
              {{ formatVnd(product.price) }}đ
            </p>
            <p
              v-if="product.originalPrice > product.price"
              class="text-base text-gray-400 line-through"
            >
              {{ formatVnd(product.originalPrice) }}đ
            </p>
            <span
              v-if="product.originalPrice > product.price"
              class="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700"
              >Tiết kiệm {{ savingText }}</span
            >
          </div>

          <div class="mt-5">
            <p class="text-sm font-semibold">Chọn đơn vị</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <button
                v-for="unit in units"
                :key="unit"
                class="rounded-full border px-4 py-2 text-sm transition"
                :class="
                  selectedUnit === unit
                    ? 'scale-105 border-[#f47f20] bg-[#f47f20] text-white shadow-md'
                    : 'border-[#e5e7eb]'
                "
                @click="selectedUnit = unit"
              >
                {{ unit }}
              </button>
            </div>
          </div>

          <div class="mt-5">
            <p class="text-sm font-semibold">Số lượng</p>
            <div
              class="mt-2 inline-flex items-center gap-3 rounded-full border border-[#e5e7eb] bg-white px-3 py-2"
            >
              <button
                class="qty-btn"
                :disabled="quantity <= 1"
                @click="decreaseQty"
              >
                -
              </button>
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                :max="stock || 1"
                class="w-12 text-center text-base font-bold outline-none"
              />
              <button
                class="qty-btn"
                :disabled="stock > 0 && quantity >= stock"
                @click="increaseQty"
              >
                +
              </button>
            </div>
          </div>

          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              class="cta-buy"
              :disabled="stock === 0 || quantity > stock"
              @click="addToCart"
            >
              {{
                stock === 0
                  ? "Hết hàng"
                  : quantity > stock
                    ? "Vượt quá tồn kho"
                    : "🛒 Thêm vào giỏ"
              }}
            </button>
            <!-- <button class="cta-cart" @click="addToCart">Thêm vào giỏ</button> -->
          </div>

          <div
            class="mt-5 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 text-sm sm:grid-cols-2"
          >
            <p><span class="text-[#4caf50]">✓</span> Giao hàng 2h</p>
            <p><span class="text-[#4caf50]">✓</span> Đổi trả 7 ngày</p>
            <p><span class="text-[#4caf50]">✓</span> Chứng nhận VSATTP</p>
            <p><span class="text-[#4caf50]">✓</span> Xuất xứ rõ ràng</p>
          </div>
        </div>
      </section>

      <section class="mt-8 rounded-2xl bg-white p-4">
        <div class="flex flex-wrap gap-6 border-b border-[#e5e7eb] text-sm">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="relative pb-3 font-semibold"
            :class="activeTab === tab.key ? 'text-[#f47f20]' : 'text-gray-500'"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
            <span class="tab-line" :class="{ active: activeTab === tab.key }" />
          </button>
        </div>

        <div class="pt-4">
          <div v-if="activeTab === 'description'">
            <div
              class="prose max-w-none text-gray-700"
              :class="{ 'max-h-75 overflow-hidden': !expandDescription }"
            >
              <p>{{ descriptionText }}</p>
            </div>
            <button
              class="mt-3 text-sm font-semibold text-[#f47f20]"
              @click="expandDescription = !expandDescription"
            >
              {{ expandDescription ? "Thu gọn" : "Xem thêm" }}
            </button>
          </div>

          <div v-else id="review-tab">
            <div class="grid gap-4 md:grid-cols-[220px_1fr]">
              <div class="rounded-xl bg-[#fff7ed] p-4 text-center">
                <p class="text-4xl font-black text-[#f47f20]">
                  {{ averageRatingText }}
                </p>
                <p class="text-xs text-gray-500">trên 5 sao</p>
              </div>
              <div class="space-y-2">
                <div
                  v-for="score in [5, 4, 3, 2, 1]"
                  :key="score"
                  class="flex items-center gap-2 text-sm"
                >
                  <span>{{ score }} sao</span>
                  <div class="h-2 flex-1 rounded-full bg-gray-200">
                    <div
                      class="h-full rounded-full bg-[#f47f20]"
                      :style="{ width: `${getRatingPercent(score)}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <article
              v-for="review in reviews"
              :key="review.id"
              class="mt-4 rounded-xl border border-gray-100 p-4"
            >
              <div class="flex items-start gap-3">
                <div class="h-10 w-10 shrink-0">
                  <img
                    v-if="review.avatar"
                    :src="review.avatar"
                    alt="avatar"
                    class="h-full w-full rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-xs font-bold text-gray-400"
                  >
                    {{ review.name.charAt(0).toUpperCase() }}
                  </div>
                </div>
                <div class="flex-1">
                  <p class="font-semibold">{{ review.name }}</p>
                  <p class="text-sm text-gray-600">{{ review.content }}</p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ review.createdAt }}
                  </p>
                  <div class="mt-2 flex gap-2">
                    <img
                      v-for="(img, idx) in review.images"
                      :key="idx"
                      :src="img"
                      alt="review image"
                      class="h-14 w-14 rounded-lg object-cover"
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="mt-8">
        <h2 class="text-xl font-bold mb-4">Có thể bạn cũng thích</h2>

        <!-- Loading skeleton -->
        <div v-if="isLoadingRecommendations" class="flex gap-3 overflow-hidden">
          <div
            v-for="n in 5"
            :key="n"
            class="w-[200px] shrink-0 rounded-2xl bg-white p-3 shadow-sm"
          >
            <Skeleton height="180px" class="mb-2 rounded-xl" />
            <Skeleton height="1rem" class="mb-1" />
            <Skeleton height="1rem" width="60%" />
          </div>
        </div>

        <!-- Empty state -->
        <p
          v-else-if="recommendations.length === 0"
          class="text-sm text-gray-400"
        >
          Không có sản phẩm tương tự.
        </p>

        <!-- Carousel -->
        <Carousel
          v-else
          :value="recommendations"
          :numVisible="5"
          :numScroll="1"
          :responsiveOptions="responsiveOptions"
          circular
          :autoplayInterval="4000"
          :showIndicators="false"
        >
          <template #item="slotProps">
            <div class="px-2">
              <ProductCard :product="slotProps.data" bg="#f5f5f5" />
            </div>
          </template>
        </Carousel>
      </section>
    </div>

    <Teleport to="body">
      <div
        v-if="showLightbox"
        class="fixed inset-0 z-70 flex items-center justify-center bg-black/80 p-4"
        @click.self="showLightbox = false"
      >
        <img
          :src="activeImage"
          alt="Lightbox"
          class="lightbox-image max-h-[85vh] w-auto max-w-[90vw] rounded-xl"
        />
      </div>
    </Teleport>

    >
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useProductDetailQuery } from "~/queries/product/useProductDetailQuery";
import { useProductRecommendations } from "~/composables/product/useProductRecommendations";
import { useCart } from "~/composables/cart/useCart";
import SkProductDetailPage from "~/components/skeletons/SkProductDetailPage.vue";
import { ROUTES } from "~/constants/routes";
import type { HomeProduct } from "~/types/home.type";

useHead({
  title: "Chi tiết sản phẩm - SmartFood",
  meta: [
    { name: "description", content: "Trang Chi tiết sản phẩm của SmartFood" },
  ],
});

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));

const { data: detail, isLoading } = useProductDetailQuery(slug);

// Product _id (needed for recommendations — Python service needs ObjectId, not slug)
const productId = computed(() => String(detail.value?._id || ""));

const { recommendations, isLoadingRecommendations } = useProductRecommendations(
  productId,
  { limit: 8 },
);

const categoryName = computed(
  () => detail.value?.primary_category?.title || "Danh mục",
);
const categorySlug = computed(() => detail.value?.primary_category?.slug || "");

const product = computed(() => ({
  id: String(detail.value?._id || ""),
  name: detail.value?.title || "",
  slug: detail.value?.slug || "",
  price: Number(detail.value?.price || 0),
  originalPrice: Number(
    detail.value?.originalPrice || detail.value?.price || 0,
  ),
  discountPercent: Number(detail.value?.discountPercentage || 0),
  isOnlineExclusive: Boolean(detail.value?.isOnlineExclusive),
  image: detail.value?.thumbnail || "",
}));

const stock = computed(() => Number(detail.value?.stock || 0));

const images = computed(() => {
  const rawImages = Array.isArray(detail.value?.images)
    ? detail.value?.images.filter((item) => typeof item === "string")
    : [];
  if (rawImages.length > 0) return rawImages;
  if (detail.value?.thumbnail) return [detail.value.thumbnail];
  return [];
});

const activeImage = ref("");
const showLightbox = ref(false);

watch(
  images,
  (newImages) => {
    activeImage.value = newImages[0] || "";
  },
  { immediate: true },
);

const shareItems = [
  { key: "facebook", icon: "f", label: "Facebook" },
  { key: "zalo", icon: "Z", label: "Zalo" },
  { key: "copy", icon: "⧉", label: "Copy link" },
];

const units = computed(() => [detail.value?.unit || "kg"]);

const selectedUnit = ref("");
watch(
  units,
  (newUnits) => {
    selectedUnit.value = newUnits[0] || "kg";
  },
  { immediate: true },
);

const quantity = ref(1);

watch(
  [quantity, stock],
  ([nextQty, nextStock]) => {
    if (nextQty < 1) {
      quantity.value = 1;
      return;
    }
    if (nextStock > 0 && nextQty > nextStock) {
      quantity.value = nextStock;
    }
  },
  { immediate: true },
);

const ratingSummary = computed(() => {
  const defaultTotalRating = Number(detail.value?.ratings?.totalRating || 0);
  const defaultNumberOfRatings = Number(
    detail.value?.ratings?.numberOfRatings || 0,
  );
  const fallbackDistribution = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: 0,
  }));

  if (detail.value?.ratingSummary) {
    return {
      totalReviews: Number(detail.value.ratingSummary.totalReviews || 0),
      averageRating: Number(detail.value.ratingSummary.averageRating || 0),
      distribution: Array.isArray(detail.value.ratingSummary.distribution)
        ? detail.value.ratingSummary.distribution
        : fallbackDistribution,
    };
  }

  return {
    totalReviews: defaultNumberOfRatings,
    averageRating:
      defaultNumberOfRatings > 0
        ? Number((defaultTotalRating / defaultNumberOfRatings).toFixed(1))
        : 0,
    distribution: fallbackDistribution,
  };
});

const tabs = computed(() => {
  const baseTabs = [
    { key: "description", label: "Mô tả" },
    {
      key: "reviews",
      label: `Đánh giá (${ratingSummary.value.totalReviews})`,
    },
  ];
  return baseTabs;
});

const activeTab = ref("");
const expandDescription = ref(false);

const responsiveOptions = ref([
  {
    breakpoint: "1399px",
    numVisible: 4,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
    numScroll: 1,
  },
]);

const descriptionText = computed(() => detail.value?.description || "");

const reviews = computed(() => {
  const rawReviews = Array.isArray(detail.value?.reviews)
    ? detail.value.reviews
    : [];
  return rawReviews.map((review) => ({
    id: String(review._id || ""),
    name: review.user?.displayName || "Khách hàng",
    avatar: review.user?.avatar || "",
    content: review.comment || "",
    images: Array.isArray(review.images) ? review.images : [],
    createdAt: review.createdAt
      ? new Date(review.createdAt).toLocaleDateString("vi-VN")
      : "",
  }));
});

const shortName = computed(() =>
  product.value.name.length > 30
    ? `${product.value.name.slice(0, 30)}...`
    : product.value.name,
);

const savingText = computed(() => {
  const diff = product.value.originalPrice - product.value.price;
  return `${Math.round(diff / 1000)}K`;
});

const averageRatingText = computed(() =>
  ratingSummary.value.averageRating.toFixed(1),
);
const roundedAverage = computed(() =>
  Math.round(ratingSummary.value.averageRating),
);

const getRatingCount = (score: number) => {
  const found = ratingSummary.value.distribution.find(
    (item) => item.star === score,
  );
  return found?.count || 0;
};

const getRatingPercent = (score: number) => {
  const totalReviews = ratingSummary.value.totalReviews;
  if (!totalReviews) return 0;
  return Math.round((getRatingCount(score) / totalReviews) * 100);
};

const formatVnd = (value: number) => value.toLocaleString("vi-VN");

const { addToCart: pushToCart } = useCart();

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value -= 1;
};

const increaseQty = () => {
  if (stock.value > 0 && quantity.value >= stock.value) return;
  quantity.value += 1;
};

const buyNow = () => {
  addToCart();
};

const addToCart = () => {
  if (stock.value === 0) return;
  if (quantity.value > stock.value) return;
  pushToCart({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
    stock: stock.value,
    slug: product.value.slug,
    quantity: quantity.value,
    categoryId: detail.value?.primary_category?._id || null,
  });
};

const copyOrShare = async (key: string) => {
  if (key !== "copy") return;
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch {
    // no-op
  }
};

const scrollToReviews = () => {
  activeTab.value = "reviews";
  document
    .getElementById("review-tab")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

watch(
  tabs,
  (newTabs) => {
    const hasActiveTab = newTabs.some((tab) => tab.key === activeTab.value);
    if (!hasActiveTab && newTabs.length > 0) {
      activeTab.value = newTabs[0]?.key || "description";
    }
  },
  {
    immediate: true,
  },
);
</script>

<style scoped>
.share-btn {
  position: relative;
  display: grid;
  height: 30px;
  width: 30px;
  place-items: center;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.92);
  font-weight: 700;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  right: 0;
  border-radius: 6px;
  background: #111827;
  color: #fff;
  font-size: 11px;
  padding: 4px 6px;
  opacity: 0;
  transform: translateY(4px);
  pointer-events: none;
  transition: all 0.2s ease;
}

.share-btn:hover .tooltip {
  opacity: 1;
  transform: translateY(0);
}

.qty-btn {
  display: grid;
  height: 36px;
  width: 36px;
  place-items: center;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  transition: background 0.2s ease;
}

.qty-btn:hover {
  background: #f3f4f6;
}

.cta-buy {
  height: 48px;
  border-radius: 9999px;
  background: linear-gradient(90deg, #fc5c22, #f47f20);
  font-weight: 700;
  color: white;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;
}

.cta-buy:hover {
  filter: brightness(1.1);
}

.cta-buy:active {
  transform: scale(0.95);
}

.cta-cart {
  height: 48px;
  border-radius: 9999px;
  background: #eef5fd;
  color: #006ee6;
  font-weight: 600;
  transition: background 0.2s ease;
}

.cta-cart:hover {
  background: #d6e7f9;
}

.tab-line {
  position: absolute;
  left: 0;
  bottom: -1px;
  height: 2px;
  width: 100%;
  background: #f47f20;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 200ms ease;
}

.tab-line.active {
  transform: scaleX(1);
}

.suggestion-card {
  opacity: 0;
  transform: translateY(18px);
  animation: fadeInUp 0.45s ease forwards;
}

.lightbox-image {
  animation: scaleIn 300ms ease;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.animate-fade-right {
  animation: fadeRight 0.5s ease both;
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}

@keyframes fadeRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
