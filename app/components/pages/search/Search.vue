<template>
  <div
    class="min-h-screen flex flex-col font-sans bg-gray-50/30 selection:bg-[#f47f20] selection:text-white"
  >
    <!-- Same layout wrapper as homepage -->
    <div class="max-w-[1440px] mx-auto w-full flex items-start flex-1 gap-4">
      <!-- Left Sidebar (reuse from homepage) -->
      <Sidebar />

      <!-- Right Content -->
      <main class="flex-1 min-w-0 px-4 sm:px-6 lg:px-0 py-6 pb-16">
        <!-- Category badges scroll strip -->
        <div
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
        </div>

        <!-- Result count -->
        <p class="text-[14px] text-gray-500 mb-4">
          Có
          <strong class="text-gray-800">{{ filteredProducts.length }}</strong>
          sản phẩm phù hợp với từ khóa "<strong class="text-gray-800">{{
            searchQuery || "mận"
          }}</strong
          >"
        </p>

        <!-- Product Grid -->
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
        >
          <ProductCard
            v-for="item in pagedProducts"
            :key="item.id"
            :product="item"
          />
        </div>

        <!-- Pagination -->
        <BasePagination
          v-model="currentPage"
          :total="filteredProducts.length"
          :per-page="perPage"
          @change="scrollToTop"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Sidebar from "~/components/layout/Sidebar.vue";
import ProductCard from "~/components/features/home/ProductCard.vue";
const route = useRoute();

const searchQuery = computed(() => (route.query.q as string) || "mận");

const selectedCategory = ref("");
const currentPage = ref(1);
const perPage = 30;

const toggleCategory = (name: string) => {
  selectedCategory.value = selectedCategory.value === name ? "" : name;
  currentPage.value = 1;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/* Category badges for the scroll strip */
const relatedCategories = [
  {
    name: "Trái cây Việt Nam",
    icon: "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Trái cây nhập khẩu",
    icon: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Trái cây cắt sẵn",
    icon: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Đào, mận, hồng, ổi",
    icon: "https://images.unsplash.com/photo-1595124231685-c255698ddce5?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Đào, mận, hồng",
    icon: "https://images.unsplash.com/photo-1563252722-97e42f3dbe0e?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Trái cây nhiệt đới",
    icon: "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?auto=format&fit=crop&w=160&q=80",
  },
];

/* ── 44 mock products matching ProductCard props ── */
const allProducts = ref([
  {
    id: 101,
    name: "Mận Tam Hoa (1KG)",
    image:
      "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?auto=format&fit=crop&w=800&q=80",
    price: 65000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 102,
    name: "Mận sữa (1KG)",
    image:
      "https://images.unsplash.com/photo-1595124231685-c255698ddce5?auto=format&fit=crop&w=800&q=80",
    price: 49000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 103,
    name: "Mận hậu hộp 500g (1 Hộp)",
    image:
      "https://images.unsplash.com/photo-1563252722-97e42f3dbe0e?auto=format&fit=crop&w=800&q=80",
    price: 60000,
    originalPrice: 75000,
    discountPercent: 20,
    isBestPrice: true,
    isOnlineExclusive: true,
  },
  {
    id: 104,
    name: "Mận Úc hộp 500g (1 Hộp)",
    image:
      "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=800&q=80",
    price: 159000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 105,
    name: "Mận đá đường (1KG)",
    image:
      "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=800&q=80",
    price: 45000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 106,
    name: "Mít dẻ lột sẵn hộp 350g (1 Hộp)",
    image:
      "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?auto=format&fit=crop&w=800&q=80",
    price: 49000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 107,
    name: "Mận ruby hộp 500g (1 Hộp)",
    image:
      "https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?auto=format&fit=crop&w=800&q=80",
    price: 79000,
    originalPrice: 95000,
    discountPercent: 17,
    isBestPrice: false,
    isOnlineExclusive: true,
  },
  {
    id: 108,
    name: "Mận xanh Đà Lạt (1KG)",
    image:
      "https://images.unsplash.com/photo-1625753783767-be40d5b1015e?auto=format&fit=crop&w=800&q=80",
    price: 55000,
    originalPrice: 65000,
    discountPercent: 15,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 109,
    name: "Combo mận mix nhiệt đới (1.5KG)",
    image:
      "https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=800&q=80",
    price: 129000,
    originalPrice: 160000,
    discountPercent: 19,
    isBestPrice: true,
    isOnlineExclusive: true,
  },
  {
    id: 110,
    name: "Mận cherry nhập khẩu (500g)",
    image:
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80",
    price: 189000,
    originalPrice: 229000,
    discountPercent: 17,
    isBestPrice: true,
    isOnlineExclusive: false,
  },
  {
    id: 111,
    name: "Mận Nhật tím hộp 400g",
    image:
      "https://images.unsplash.com/photo-1595124231685-c255698ddce5?auto=format&fit=crop&w=800&q=80",
    price: 210000,
    originalPrice: 250000,
    discountPercent: 16,
    isBestPrice: false,
    isOnlineExclusive: true,
  },
  {
    id: 112,
    name: "Set mận hỗn hợp 4 loại (2KG)",
    image:
      "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?auto=format&fit=crop&w=800&q=80",
    price: 199000,
    originalPrice: 245000,
    discountPercent: 19,
    isBestPrice: true,
    isOnlineExclusive: true,
  },
  {
    id: 113,
    name: "Mận An Phước hộp 1KG",
    image:
      "https://images.unsplash.com/photo-1563252722-97e42f3dbe0e?auto=format&fit=crop&w=800&q=80",
    price: 72000,
    originalPrice: 85000,
    discountPercent: 15,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 114,
    name: "Mận vàng Hà Nội (1KG)",
    image:
      "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=800&q=80",
    price: 58000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 115,
    name: "Mận đỏ Sapa (500g)",
    image:
      "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=800&q=80",
    price: 89000,
    originalPrice: 105000,
    discountPercent: 15,
    isBestPrice: false,
    isOnlineExclusive: true,
  },
  {
    id: 116,
    name: "Combo 3 loại mận Đà Lạt",
    image:
      "https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?auto=format&fit=crop&w=800&q=80",
    price: 149000,
    originalPrice: 185000,
    discountPercent: 19,
    isBestPrice: true,
    isOnlineExclusive: true,
  },
  {
    id: 117,
    name: "Mận tím Mộc Châu (1KG)",
    image:
      "https://images.unsplash.com/photo-1595124231685-c255698ddce5?auto=format&fit=crop&w=800&q=80",
    price: 62000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 118,
    name: "Mận hồng đào premium (500g)",
    image:
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80",
    price: 175000,
    originalPrice: 210000,
    discountPercent: 17,
    isBestPrice: true,
    isOnlineExclusive: false,
  },
  {
    id: 119,
    name: "Nước ép mận tươi 500ml",
    image:
      "https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=800&q=80",
    price: 35000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 120,
    name: "Mận sấy dẻo Đà Lạt 200g",
    image:
      "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?auto=format&fit=crop&w=800&q=80",
    price: 42000,
    originalPrice: 50000,
    discountPercent: 16,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 121,
    name: "Mận Trung Quốc hộp 1KG",
    image:
      "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?auto=format&fit=crop&w=800&q=80",
    price: 95000,
    originalPrice: 120000,
    discountPercent: 21,
    isBestPrice: true,
    isOnlineExclusive: true,
  },
  {
    id: 122,
    name: "Mận xanh giòn (1KG)",
    image:
      "https://images.unsplash.com/photo-1625753783767-be40d5b1015e?auto=format&fit=crop&w=800&q=80",
    price: 48000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 123,
    name: "Mận ngâm đường lon 350ml",
    image:
      "https://images.unsplash.com/photo-1563252722-97e42f3dbe0e?auto=format&fit=crop&w=800&q=80",
    price: 28000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 124,
    name: "Mật mận Bắc hộp 250ml",
    image:
      "https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=800&q=80",
    price: 55000,
    originalPrice: 68000,
    discountPercent: 19,
    isBestPrice: false,
    isOnlineExclusive: true,
  },
  {
    id: 125,
    name: "Kẹo mận muối Hà Nội 150g",
    image:
      "https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?auto=format&fit=crop&w=800&q=80",
    price: 22000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 126,
    name: "Mận organic Lâm Đồng (1KG)",
    image:
      "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=800&q=80",
    price: 110000,
    originalPrice: 135000,
    discountPercent: 19,
    isBestPrice: true,
    isOnlineExclusive: false,
  },
  {
    id: 127,
    name: "Mận Hàn Quốc loại 1 (500g)",
    image:
      "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=800&q=80",
    price: 245000,
    originalPrice: 290000,
    discountPercent: 16,
    isBestPrice: true,
    isOnlineExclusive: true,
  },
  {
    id: 128,
    name: "Mận đông lạnh IQF 1KG",
    image:
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80",
    price: 85000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 129,
    name: "Sinh tố mận tươi 350ml",
    image:
      "https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=800&q=80",
    price: 32000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 130,
    name: "Mận giòn Ninh Thuận (1KG)",
    image:
      "https://images.unsplash.com/photo-1625753783767-be40d5b1015e?auto=format&fit=crop&w=800&q=80",
    price: 52000,
    originalPrice: 60000,
    discountPercent: 13,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 131,
    name: "Mận Mỹ tím hộp 500g",
    image:
      "https://images.unsplash.com/photo-1595124231685-c255698ddce5?auto=format&fit=crop&w=800&q=80",
    price: 198000,
    originalPrice: 235000,
    discountPercent: 16,
    isBestPrice: true,
    isOnlineExclusive: true,
  },
  {
    id: 132,
    name: "Combo mận + đào hộp quà",
    image:
      "https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?auto=format&fit=crop&w=800&q=80",
    price: 265000,
    originalPrice: 320000,
    discountPercent: 17,
    isBestPrice: true,
    isOnlineExclusive: true,
  },
  {
    id: 133,
    name: "Mận cherry Chile (250g)",
    image:
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80",
    price: 155000,
    originalPrice: 185000,
    discountPercent: 16,
    isBestPrice: false,
    isOnlineExclusive: true,
  },
  {
    id: 134,
    name: "Ô mai mận Hàng Đường 200g",
    image:
      "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?auto=format&fit=crop&w=800&q=80",
    price: 38000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 135,
    name: "Mận cơm vàng (1KG)",
    image:
      "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=800&q=80",
    price: 55000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 136,
    name: "Mứt mận homemade 300g",
    image:
      "https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=800&q=80",
    price: 45000,
    originalPrice: 55000,
    discountPercent: 18,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 137,
    name: "Mận đen Úc premium (500g)",
    image:
      "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=800&q=80",
    price: 220000,
    originalPrice: 265000,
    discountPercent: 17,
    isBestPrice: true,
    isOnlineExclusive: true,
  },
  {
    id: 138,
    name: "Nước mận lên men 500ml",
    image:
      "https://images.unsplash.com/photo-1563252722-97e42f3dbe0e?auto=format&fit=crop&w=800&q=80",
    price: 42000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 139,
    name: "Mận Bắc Hà tươi (1KG)",
    image:
      "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?auto=format&fit=crop&w=800&q=80",
    price: 68000,
    originalPrice: 80000,
    discountPercent: 15,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 140,
    name: "Combo quà mận 5 loại (3KG)",
    image:
      "https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?auto=format&fit=crop&w=800&q=80",
    price: 350000,
    originalPrice: 420000,
    discountPercent: 17,
    isBestPrice: true,
    isOnlineExclusive: true,
  },
  {
    id: 141,
    name: "Mận dầm tắc 350ml",
    image:
      "https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=800&q=80",
    price: 25000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
  {
    id: 142,
    name: "Mận sấy khô Nhật 100g",
    image:
      "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?auto=format&fit=crop&w=800&q=80",
    price: 75000,
    originalPrice: 90000,
    discountPercent: 17,
    isBestPrice: false,
    isOnlineExclusive: true,
  },
  {
    id: 143,
    name: "Mận anh đào hộp 300g",
    image:
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80",
    price: 135000,
    originalPrice: 160000,
    discountPercent: 16,
    isBestPrice: true,
    isOnlineExclusive: false,
  },
  {
    id: 144,
    name: "Mận tím ngọt Lào Cai (1KG)",
    image:
      "https://images.unsplash.com/photo-1595124231685-c255698ddce5?auto=format&fit=crop&w=800&q=80",
    price: 58000,
    originalPrice: null,
    discountPercent: null,
    isBestPrice: false,
    isOnlineExclusive: false,
  },
]);

const filteredProducts = computed(() => {
  return allProducts.value;
});

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredProducts.value.slice(start, start + perPage);
});

watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  scrollbar-width: none;
}
</style>
