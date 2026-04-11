<template>
  <div class="min-h-screen bg-[#f5f5f5] pb-12 text-[#222]">
    <div class="mx-auto max-w-7xl px-4 pt-4 md:px-6">
      <nav class="text-xs text-[#666]">
        <NuxtLink :to="ROUTES.HOME" class="hover:underline hover:text-[#4caf50]"
          >Trang chủ</NuxtLink
        >
        <span class="mx-1 text-[#ccc]">›</span>
        <NuxtLink
          :to="ROUTES.CATEGORY('rau-cu')"
          class="hover:underline hover:text-[#4caf50]"
          >{{ categoryName }}</NuxtLink
        >
        <span class="mx-1 text-[#ccc]">›</span>
        <span>{{ shortName }}</span>
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
                :class="i <= 4 ? 'text-[#f59e0b]' : 'text-gray-300'"
                fill="currentColor"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <span class="text-xs text-[#666]">(128 đánh giá)</span>
          </button>

          <div class="mt-4 flex flex-wrap items-end gap-3">
            <p class="text-[28px] font-black text-[#f47f20]">
              {{ formatVnd(product.price) }}đ
            </p>
            <p class="text-base text-gray-400 line-through">
              {{ formatVnd(product.originalPrice) }}đ
            </p>
            <span
              class="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700"
              >Tiết kiệm {{ savingText }}</span
            >
          </div>

          <div
            class="mt-4 rounded-2xl bg-linear-to-r from-[#fc5c22] to-[#ef4444] p-4 text-white"
            v-if="remainingSeconds > 0"
          >
            <p class="text-sm font-semibold">Flash Sale kết thúc sau</p>
            <div class="mt-2 flex gap-2 font-mono text-xl font-black">
              <span class="rounded bg-white/95 px-3 py-1 text-[#f47f20]">{{
                countdown.hh
              }}</span>
              <span class="rounded bg-white/95 px-3 py-1 text-[#f47f20]">{{
                countdown.mm
              }}</span>
              <span class="rounded bg-white/95 px-3 py-1 text-[#f47f20]">{{
                countdown.ss
              }}</span>
            </div>
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
              <button class="qty-btn" @click="decreaseQty">-</button>
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                class="w-12 text-center text-base font-bold outline-none"
              />
              <button class="qty-btn" @click="increaseQty">+</button>
            </div>
          </div>

          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            <button class="cta-buy" @click="buyNow">🛒 Mua ngay</button>
            <button class="cta-cart" @click="addToCart">Thêm vào giỏ</button>
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
              <p>{{ longDescription }}</p>
            </div>
            <button
              class="mt-3 text-sm font-semibold text-[#f47f20]"
              @click="expandDescription = !expandDescription"
            >
              {{ expandDescription ? "Thu gọn" : "Xem thêm" }}
            </button>
          </div>

          <div v-else-if="activeTab === 'nutrition'" class="overflow-x-auto">
            <table class="w-full min-w-125 border-collapse text-sm">
              <thead>
                <tr class="bg-[#fff3e8] text-orange-700">
                  <th class="px-3 py-2 text-left">Thành phần</th>
                  <th class="px-3 py-2 text-left">Giá trị / 100g</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, idx) in nutritionRows"
                  :key="row.label"
                  :class="idx % 2 ? 'bg-gray-50' : ''"
                >
                  <td class="px-3 py-2">{{ row.label }}</td>
                  <td class="px-3 py-2">{{ row.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else id="review-tab">
            <div class="grid gap-4 md:grid-cols-[220px_1fr]">
              <div class="rounded-xl bg-[#fff7ed] p-4 text-center">
                <p class="text-4xl font-black text-[#f47f20]">4.8</p>
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
                      :style="{ width: `${score * 18}%` }"
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
                <img
                  :src="review.avatar"
                  alt="avatar"
                  class="h-10 w-10 rounded-full object-cover"
                />
                <div class="flex-1">
                  <p class="font-semibold">{{ review.name }}</p>
                  <p class="text-sm text-gray-600">{{ review.content }}</p>
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
        <h2 class="text-xl font-bold">Có thể bạn cũng thích</h2>
        <div
          class="mt-4 grid grid-flow-col auto-cols-[65%] gap-3 overflow-x-auto pb-2 md:auto-cols-[31%] lg:grid-flow-row lg:grid-cols-5 lg:overflow-visible"
        >
          <div
            v-for="(item, idx) in suggestions"
            :key="item.id"
            class="suggestion-card"
            :style="{ animationDelay: `${idx * 90}ms` }"
          >
            <ProductCard :product="item" />
          </div>
        </div>
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

    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="showToast"
          class="fixed right-4 top-4 z-80 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-lg"
        >
          Đã thêm sản phẩm vào giỏ hàng.
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { ROUTES } from "~/constants/routes";

const categoryName = "Rau củ";
const product = {
  name: "Bông cải xanh hữu cơ Đà Lạt loại tuyển chọn tươi mới mỗi ngày",
  price: 89000,
  originalPrice: 119000,
  discountPercent: 25,
  isOnlineExclusive: true,
};

const images = [
  "https://picsum.photos/seed/food-detail-1/800/800",
  "https://picsum.photos/seed/food-detail-2/800/800",
  "https://picsum.photos/seed/food-detail-3/800/800",
  "https://picsum.photos/seed/food-detail-4/800/800",
];

const activeImage = ref(images[0] || "");
const showLightbox = ref(false);

const shareItems = [
  { key: "facebook", icon: "f", label: "Facebook" },
  { key: "zalo", icon: "Z", label: "Zalo" },
  { key: "copy", icon: "⧉", label: "Copy link" },
];

const units = ["500g", "1kg", "Thùng 12 chai"];
const selectedUnit = ref(units[0] || "500g");
const quantity = ref(1);

const tabs = [
  { key: "description", label: "Mô tả" },
  { key: "nutrition", label: "Thông tin dinh dưỡng" },
  { key: "reviews", label: "Đánh giá (12)" },
] as const;

const activeTab = ref<(typeof tabs)[number]["key"]>("description");
const expandDescription = ref(false);
const showToast = ref(false);

const longDescription =
  "Bông cải xanh hữu cơ được trồng theo quy chuẩn VietGAP, thu hoạch trong ngày và đóng gói lạnh để giữ độ tươi. Sản phẩm phù hợp cho salad, luộc, hấp hoặc xào nhanh. Hương vị thanh nhẹ, giòn ngọt tự nhiên và giàu vitamin C, K, chất xơ. Nguồn gốc minh bạch, truy xuất được lô hàng.";

const nutritionRows = [
  { label: "Năng lượng", value: "34 kcal" },
  { label: "Chất xơ", value: "2.6 g" },
  { label: "Vitamin C", value: "89.2 mg" },
  { label: "Canxi", value: "47 mg" },
  { label: "Protein", value: "2.8 g" },
];

const reviews = [
  {
    id: 1,
    name: "Ngọc H.",
    avatar: "https://i.pravatar.cc/80?img=11",
    content: "Rau tươi, đóng gói sạch. Luộc lên vẫn giòn và ngọt.",
    images: ["https://picsum.photos/seed/review-a/120/120"],
  },
  {
    id: 2,
    name: "Phú L.",
    avatar: "https://i.pravatar.cc/80?img=14",
    content: "Giao nhanh trong 2h như cam kết, sẽ mua lại.",
    images: [
      "https://picsum.photos/seed/review-b/120/120",
      "https://picsum.photos/seed/review-c/120/120",
    ],
  },
];

const suggestions = Array.from({ length: 8 }).map((_, idx) => ({
  id: idx + 1,
  name: `Gợi ý sản phẩm ${idx + 1}`,
  image: `https://picsum.photos/seed/suggest-food-${idx + 1}/400/400`,
  price: 45000 + idx * 5000,
  originalPrice: 58000 + idx * 5000,
  discountPercent: 12 + (idx % 3) * 4,
  isOnlineExclusive: idx % 2 === 0,
  isBestPrice: idx % 4 === 0,
  buttonText: "Mua",
}));

const shortName = computed(() =>
  product.name.length > 30 ? `${product.name.slice(0, 30)}...` : product.name,
);

const savingText = computed(() => {
  const diff = product.originalPrice - product.price;
  return `${Math.round(diff / 1000)}K`;
});

const formatVnd = (value: number) => value.toLocaleString("vi-VN");

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value -= 1;
};

const increaseQty = () => {
  quantity.value += 1;
};

const buyNow = () => {
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2500);
};

const addToCart = () => {
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2500);
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

const remainingSeconds = ref(7 * 60 * 60 + 15 * 60 + 32);
let timer: ReturnType<typeof setInterval> | null = null;

const countdown = computed(() => {
  const total = Math.max(remainingSeconds.value, 0);
  const hh = String(Math.floor(total / 3600)).padStart(2, "0");
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return { hh, mm, ss };
});

onMounted(() => {
  timer = setInterval(() => {
    if (remainingSeconds.value > 0) remainingSeconds.value -= 1;
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
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
