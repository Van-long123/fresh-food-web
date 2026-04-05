<template>
  <div class="search-page" @click="onRootClick">
    <!-- SECTION 1: SEARCH BAR HERO -->
    <section class="search-hero">
      <div class="hero-inner">
        <div class="search-shell" ref="searchShellRef">
          <span class="icon">🔎</span>
          <input
            ref="searchInputRef"
            v-model="inputValue"
            type="text"
            placeholder="Tìm thực phẩm, rau củ, trái cây..."
            @focus="onFocusInput"
            @keydown.down.prevent="moveActive(1)"
            @keydown.up.prevent="moveActive(-1)"
            @keydown.enter.prevent="applyKeyboardSelect"
          />
          <button
            v-if="inputValue"
            type="button"
            class="clear-btn"
            @click="clearInput"
          >
            ×
          </button>
          <button type="button" class="search-btn" @click="submitSearch">
            Tìm kiếm
          </button>

          <div v-if="showDropdown" class="auto-dropdown" @click.stop>
            <section>
              <h5>Gợi ý tìm kiếm</h5>
              <button
                v-for="(item, idx) in filteredSuggests"
                :key="item"
                type="button"
                :class="{ active: activeSuggestIndex === idx }"
                @mouseenter="activeSuggestIndex = idx"
                @click="pickSuggestion(item)"
                v-html="highlight(item, inputValue)"
              />
            </section>

            <hr />

            <section>
              <h5>Sản phẩm gợi ý</h5>
              <button
                v-for="item in quickProducts"
                :key="item.id"
                type="button"
                class="mini-row"
                @click="pickSuggestion(item.name)"
              >
                <div class="thumb" :style="{ background: item.gradient }" />
                <div>
                  <p>{{ item.name }}</p>
                  <strong>{{ format(item.price) }}đ</strong>
                </div>
              </button>
            </section>

            <section>
              <h5>Danh mục phù hợp</h5>
              <div class="chips">
                <button
                  v-for="cat in categoryChips"
                  :key="cat"
                  type="button"
                  @click="pickSuggestion(cat)"
                >
                  {{ cat }}
                </button>
              </div>
            </section>
          </div>
        </div>

        <div v-if="!inputFocused && !searchQuery" class="trending">
          <span>🔥 Tìm kiếm phổ biến:</span>
          <button
            v-for="item in trending"
            :key="item"
            type="button"
            @click="pickSuggestion(item)"
          >
            {{ item }}
          </button>
        </div>

        <div
          v-if="inputFocused && !inputValue && history.length"
          class="history"
        >
          <span>🕐 Tìm kiếm gần đây:</span>
          <button
            v-for="item in history"
            :key="item"
            type="button"
            @click="pickSuggestion(item)"
          >
            ⏱ {{ item }}
          </button>
          <button type="button" class="clear-history" @click="history = []">
            Xóa tất cả
          </button>
        </div>
      </div>
    </section>

    <main class="container">
      <template v-if="searchQuery">
        <!-- SECTION 2: RESULT HEADER -->
        <section class="result-head">
          <div>
            <p>
              Kết quả cho: <strong>{{ searchQuery }}</strong>
              <small>({{ filteredProducts.length }} sản phẩm)</small>
            </p>
            <div class="crumb">Tất cả > Rau củ > {{ searchQuery }}</div>
          </div>

          <div class="head-actions">
            <div class="view-toggle">
              <button
                type="button"
                :class="{ active: viewMode === 'grid' }"
                @click="viewMode = 'grid'"
              >
                ⊞
              </button>
              <button
                type="button"
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                ☰
              </button>
            </div>
            <select v-model="sortBy">
              <option value="relevance">Phù hợp nhất</option>
              <option value="priceAsc">Giá tăng dần</option>
              <option value="priceDesc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>
        </section>

        <!-- SECTION 3: MAIN LAYOUT -->
        <section class="main-layout">
          <aside class="filters">
            <div v-if="activeFilters.length" class="active-filter-box">
              <button
                v-for="f in activeFilters"
                :key="f"
                type="button"
                @click="removeActiveFilter(f)"
              >
                {{ f }} ×
              </button>
              <button type="button" class="clear-all" @click="clearFilters">
                Xóa tất cả
              </button>
            </div>

            <details open>
              <summary>DANH MỤC</summary>
              <label v-for="cat in categories" :key="cat.name">
                <input
                  v-model="selectedCategories"
                  type="checkbox"
                  :value="cat.name"
                />
                <span>{{ cat.name }} ({{ cat.count }})</span>
              </label>
            </details>

            <details open>
              <summary>KHOẢNG GIÁ</summary>
              <div class="range-wrap">
                <input
                  v-model.number="priceMin"
                  type="range"
                  min="10000"
                  max="500000"
                  step="1000"
                />
                <input
                  v-model.number="priceMax"
                  type="range"
                  min="10000"
                  max="500000"
                  step="1000"
                />
                <div class="range-track"><span :style="rangeStyle" /></div>
                <p>{{ format(priceMin) }}đ → {{ format(priceMax) }}đ</p>
              </div>
              <div class="quick-price">
                <button type="button" @click="setPrice(10000, 50000)">
                  50K
                </button>
                <button type="button" @click="setPrice(50000, 100000)">
                  50-100K
                </button>
                <button type="button" @click="setPrice(100000, 200000)">
                  100-200K
                </button>
                <button type="button" @click="setPrice(200000, 500000)">
                  >200K
                </button>
              </div>
            </details>

            <details open>
              <summary>THƯƠNG HIỆU</summary>
              <input
                v-model="brandSearch"
                type="text"
                placeholder="Tìm thương hiệu..."
                class="brand-search"
              />
              <label v-for="brand in visibleBrands" :key="brand.name">
                <input
                  v-model="selectedBrands"
                  type="checkbox"
                  :value="brand.name"
                />
                <span>{{ brand.name }} ({{ brand.count }})</span>
              </label>
            </details>

            <details open>
              <summary>ĐÁNH GIÁ</summary>
              <button
                v-for="n in [5, 4, 3, 2, 1]"
                :key="n"
                type="button"
                class="star-row"
                :class="{ active: ratingAtLeast === n }"
                @click="ratingAtLeast = n"
              >
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span
                ><span>⭐</span>
                <small>{{ n }}+</small>
              </button>
            </details>

            <details open>
              <summary>XUẤT XỨ</summary>
              <label v-for="origin in origins" :key="origin">
                <input
                  v-model="selectedOrigins"
                  type="checkbox"
                  :value="origin"
                />
                <span>{{ origin }}</span>
              </label>
            </details>

            <details open>
              <summary>TÌNH TRẠNG</summary>
              <div class="state-pills">
                <button
                  v-for="st in states"
                  :key="st"
                  type="button"
                  :class="{ active: selectedStates.includes(st) }"
                  @click="toggleState(st)"
                >
                  {{ st }}
                </button>
              </div>
            </details>
          </aside>

          <div>
            <div
              v-if="loading"
              class="skeleton-grid"
              :class="{ list: viewMode === 'list' }"
            >
              <article v-for="n in 6" :key="n" class="skeleton-item" />
            </div>

            <template v-else>
              <div v-if="pagedProducts.length === 0" class="empty-result">
                <svg viewBox="0 0 120 120">
                  <circle
                    cx="52"
                    cy="52"
                    r="30"
                    fill="none"
                    stroke="#F97316"
                    stroke-width="8"
                  />
                  <line
                    x1="74"
                    y1="74"
                    x2="102"
                    y2="102"
                    stroke="#F97316"
                    stroke-width="8"
                    stroke-linecap="round"
                  />
                </svg>
                <h3>Không tìm thấy kết quả cho "{{ searchQuery }}"</h3>
                <p>Thử tìm kiếm khác hoặc duyệt theo danh mục</p>
                <div class="empty-chips">
                  <button type="button">Kiểm tra chính tả</button>
                  <button type="button">Thử từ khóa ngắn hơn</button>
                  <button type="button">Tìm danh mục tương tự</button>
                </div>
                <NuxtLink to="/" class="outline-btn"
                  >Xem tất cả sản phẩm</NuxtLink
                >
              </div>

              <div v-else class="result-grid" :class="viewMode">
                <article
                  v-for="item in pagedProducts"
                  :key="item.id"
                  class="product-card"
                >
                  <div
                    class="card-image"
                    :style="{ background: item.gradient }"
                  >
                    <small v-if="item.flash">FLASH SALE</small>
                    <button
                      type="button"
                      class="wish"
                      :class="{ on: wishlist.includes(item.id) }"
                      @click="toggleWish(item.id)"
                    >
                      ♥
                    </button>
                    <span class="quick">👁️ Xem nhanh</span>
                  </div>

                  <div class="card-body">
                    <p class="brand">{{ item.brand }}</p>
                    <h4>{{ item.name }}</h4>
                    <div class="stars">
                      ⭐⭐⭐⭐⭐ <small>({{ item.reviews }})</small>
                    </div>
                    <div class="price-row">
                      <span class="old">{{ format(item.originalPrice) }}đ</span>
                      <strong>{{ format(item.price) }}đ</strong>
                      <small>-{{ item.discount }}%</small>
                    </div>
                    <p class="stock">Còn {{ item.stock }} sản phẩm</p>
                    <div v-if="item.flash" class="flash-track">
                      <span :style="{ width: `${item.soldPercent}%` }" />
                    </div>
                    <button
                      type="button"
                      class="add-btn"
                      @click="addToCart(item)"
                    >
                      {{ addedId === item.id ? "✓ Đã thêm" : "Thêm vào giỏ" }}
                    </button>
                  </div>
                </article>
              </div>

              <!-- PAGINATION -->
              <div class="pagination" v-if="totalPages > 1">
                <button
                  type="button"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >
                  ← Prev
                </button>
                <template v-if="!isMobile">
                  <button
                    v-for="p in pageNumbers"
                    :key="p"
                    type="button"
                    :class="{ active: currentPage === p, dot: p === '...' }"
                    :disabled="p === '...'"
                    @click="typeof p === 'number' && (currentPage = p)"
                  >
                    {{ p }}
                  </button>
                </template>
                <template v-else>
                  <span>Trang {{ currentPage }} / {{ totalPages }}</span>
                </template>
                <button
                  type="button"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >
                  Next →
                </button>
              </div>
            </template>
          </div>
        </section>

        <!-- Related search -->
        <section class="related-search">
          <strong>🔍 Tìm kiếm liên quan:</strong>
          <button
            v-for="item in relatedTerms"
            :key="item"
            type="button"
            @click="pickSuggestion(item)"
          >
            {{ item }}
          </button>
        </section>
      </template>

      <!-- SECTION 5: chưa search -->
      <section v-else class="explore-section">
        <h2>Khám Phá Theo Danh Mục</h2>
        <div class="cate-grid">
          <article
            v-for="cat in exploreCategories"
            :key="cat.name"
            :style="{ background: cat.bg }"
          >
            <p>{{ cat.icon }}</p>
            <h3>{{ cat.name }}</h3>
            <small>{{ cat.count }} sản phẩm</small>
          </article>
        </div>
      </section>
    </main>

    <button
      type="button"
      class="mobile-filter-btn"
      @click="mobileFilterOpen = true"
    >
      🔽 Lọc & Sắp xếp
    </button>

    <Transition name="sheet">
      <section
        v-if="mobileFilterOpen"
        class="mobile-sheet"
        @click.self="mobileFilterOpen = false"
      >
        <div class="sheet-body">
          <div class="sheet-handle" />
          <h3>Lọc & Sắp xếp</h3>
          <div class="sheet-group">
            <label v-for="cat in categories" :key="`m-${cat.name}`">
              <input
                v-model="selectedCategories"
                type="checkbox"
                :value="cat.name"
              />
              <span>{{ cat.name }}</span>
            </label>
          </div>
          <button
            type="button"
            class="apply-sheet"
            @click="mobileFilterOpen = false"
          >
            Áp dụng
          </button>
        </div>
      </section>
    </Transition>

    <Transition name="toast">
      <div v-if="toastText" class="toast">{{ toastText }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  origin: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  stock: number;
  flash: boolean;
  soldPercent: number;
  discount: number;
  gradient: string;
};

const inputValue = ref("");
const searchQuery = ref("");
const inputFocused = ref(false);
const showDropdown = ref(false);
const activeSuggestIndex = ref(0);
const loading = ref(false);
const sortBy = ref("relevance");
const viewMode = ref<"grid" | "list">("grid");
const currentPage = ref(1);
const addedId = ref<number | null>(null);
const toastText = ref("");
const mobileFilterOpen = ref(false);
const isMobile = ref(false);

const searchInputRef = ref<HTMLInputElement | null>(null);
const searchShellRef = ref<HTMLElement | null>(null);

const priceMin = ref(20000);
const priceMax = ref(200000);
const selectedCategories = ref<string[]>([]);
const selectedBrands = ref<string[]>([]);
const selectedOrigins = ref<string[]>([]);
const selectedStates = ref<string[]>([]);
const ratingAtLeast = ref(0);
const brandSearch = ref("");

const history = ref(["Cà chua bi", "Rau hữu cơ", "Thịt bò Úc"]);
const trending = [
  "Cà chua bi",
  "Thịt bò Úc",
  "Salad rau",
  "Sữa tươi",
  "Trứng gà ta",
  "Nước ép",
];
const categoryChips = ["🥦 Rau củ", "🍎 Trái cây", "🥩 Thịt cá", "🥛 Sữa"];
const states = ["Còn hàng", "Flash Sale", "Hàng mới", "Organic"];

const suggestions = [
  "Cà chua bi hữu cơ",
  "Cà chua beef",
  "Rau cải bó xôi",
  "Táo fuji nhập khẩu",
  "Nước ép cam tươi",
];

const categories = [
  { name: "Rau củ", count: 45 },
  { name: "Trái cây", count: 32 },
  { name: "Thịt cá", count: 21 },
  { name: "Đồ khô", count: 18 },
  { name: "Sữa", count: 15 },
];

const brands = [
  { name: "SmartFarm", count: 26 },
  { name: "GreenLife", count: 18 },
  { name: "Fresh365", count: 15 },
  { name: "KingFruit", count: 12 },
  { name: "Dalat Organics", count: 10 },
  { name: "Natural Home", count: 9 },
];

const origins = ["🇻🇳 Việt Nam", "🇯🇵 Nhật", "🇰🇷 Hàn", "🇦🇺 Úc", "🇺🇸 Mỹ"];

const products = ref<Product[]>([
  {
    id: 1,
    name: "Cà chua bi hữu cơ",
    brand: "SmartFarm",
    category: "Rau củ",
    origin: "🇻🇳 Việt Nam",
    price: 42000,
    originalPrice: 55000,
    rating: 4.8,
    reviews: 89,
    stock: 12,
    flash: true,
    soldPercent: 80,
    discount: 24,
    gradient: "linear-gradient(135deg,#fee2e2,#fecaca)",
  },
  {
    id: 2,
    name: "Rau cải kale baby",
    brand: "GreenLife",
    category: "Rau củ",
    origin: "🇻🇳 Việt Nam",
    price: 56000,
    originalPrice: 69000,
    rating: 4.7,
    reviews: 77,
    stock: 16,
    flash: false,
    soldPercent: 45,
    discount: 19,
    gradient: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
  },
  {
    id: 3,
    name: "Cam vàng nhập khẩu",
    brand: "KingFruit",
    category: "Trái cây",
    origin: "🇺🇸 Mỹ",
    price: 118000,
    originalPrice: 145000,
    rating: 4.9,
    reviews: 142,
    stock: 8,
    flash: true,
    soldPercent: 66,
    discount: 19,
    gradient: "linear-gradient(135deg,#fef3c7,#fde68a)",
  },
  {
    id: 4,
    name: "Dưa leo baby",
    brand: "Fresh365",
    category: "Rau củ",
    origin: "🇻🇳 Việt Nam",
    price: 32000,
    originalPrice: 39000,
    rating: 4.4,
    reviews: 40,
    stock: 22,
    flash: false,
    soldPercent: 22,
    discount: 18,
    gradient: "linear-gradient(135deg,#bbf7d0,#86efac)",
  },
  {
    id: 5,
    name: "Bơ booth Đắk Lắk",
    brand: "SmartFarm",
    category: "Trái cây",
    origin: "🇻🇳 Việt Nam",
    price: 69000,
    originalPrice: 85000,
    rating: 4.5,
    reviews: 53,
    stock: 11,
    flash: true,
    soldPercent: 54,
    discount: 19,
    gradient: "linear-gradient(135deg,#d9f99d,#bef264)",
  },
  {
    id: 6,
    name: "Thịt bò Úc cắt lát",
    brand: "Natural Home",
    category: "Thịt cá",
    origin: "🇦🇺 Úc",
    price: 189000,
    originalPrice: 220000,
    rating: 4.8,
    reviews: 68,
    stock: 6,
    flash: false,
    soldPercent: 31,
    discount: 14,
    gradient: "linear-gradient(135deg,#fee2e2,#fecdd3)",
  },
  {
    id: 7,
    name: "Cà rốt baby",
    brand: "GreenLife",
    category: "Rau củ",
    origin: "🇻🇳 Việt Nam",
    price: 28000,
    originalPrice: 34000,
    rating: 4.2,
    reviews: 33,
    stock: 26,
    flash: false,
    soldPercent: 18,
    discount: 18,
    gradient: "linear-gradient(135deg,#ffedd5,#fed7aa)",
  },
  {
    id: 8,
    name: "Táo fuji premium",
    brand: "KingFruit",
    category: "Trái cây",
    origin: "🇯🇵 Nhật",
    price: 155000,
    originalPrice: 182000,
    rating: 4.9,
    reviews: 120,
    stock: 7,
    flash: true,
    soldPercent: 72,
    discount: 15,
    gradient: "linear-gradient(135deg,#fce7f3,#fbcfe8)",
  },
  {
    id: 9,
    name: "Nấm đùi gà tươi",
    brand: "Dalat Organics",
    category: "Rau củ",
    origin: "🇻🇳 Việt Nam",
    price: 43000,
    originalPrice: 52000,
    rating: 4.3,
    reviews: 26,
    stock: 14,
    flash: false,
    soldPercent: 38,
    discount: 17,
    gradient: "linear-gradient(135deg,#f3f4f6,#e5e7eb)",
  },
  {
    id: 10,
    name: "Sữa hạnh nhân không đường",
    brand: "Natural Home",
    category: "Sữa",
    origin: "🇺🇸 Mỹ",
    price: 52000,
    originalPrice: 62000,
    rating: 4.6,
    reviews: 49,
    stock: 18,
    flash: false,
    soldPercent: 27,
    discount: 16,
    gradient: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
  },
  {
    id: 11,
    name: "Trứng gà ta hữu cơ",
    brand: "SmartFarm",
    category: "Đồ khô",
    origin: "🇻🇳 Việt Nam",
    price: 39000,
    originalPrice: 47000,
    rating: 4.7,
    reviews: 58,
    stock: 24,
    flash: true,
    soldPercent: 61,
    discount: 17,
    gradient: "linear-gradient(135deg,#fff7ed,#fed7aa)",
  },
  {
    id: 12,
    name: "Bắp cải tím",
    brand: "Fresh365",
    category: "Rau củ",
    origin: "🇻🇳 Việt Nam",
    price: 36000,
    originalPrice: 43000,
    rating: 4.1,
    reviews: 22,
    stock: 17,
    flash: false,
    soldPercent: 20,
    discount: 16,
    gradient: "linear-gradient(135deg,#e9d5ff,#ddd6fe)",
  },
]);

const quickProducts = computed(() => products.value.slice(0, 3));
const filteredSuggests = computed(() => {
  const q = inputValue.value.trim().toLowerCase();
  if (!q) return suggestions.slice(0, 5);
  return suggestions
    .filter((item) => item.toLowerCase().includes(q))
    .slice(0, 5);
});

const visibleBrands = computed(() => {
  const q = brandSearch.value.trim().toLowerCase();
  if (!q) return brands;
  return brands.filter((b) => b.name.toLowerCase().includes(q));
});

const activeFilters = computed(() => [
  ...selectedCategories.value,
  ...selectedBrands.value,
  ...(ratingAtLeast.value ? [`⭐ ${ratingAtLeast.value}+`] : []),
]);

const sortedProducts = computed(() => {
  const list = [...products.value];
  if (sortBy.value === "priceAsc")
    return list.sort((a, b) => a.price - b.price);
  if (sortBy.value === "priceDesc")
    return list.sort((a, b) => b.price - a.price);
  if (sortBy.value === "rating")
    return list.sort((a, b) => b.rating - a.rating);
  return list;
});

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return sortedProducts.value.filter((item) => {
    const qMatch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query);
    const cMatch =
      selectedCategories.value.length === 0 ||
      selectedCategories.value.includes(item.category);
    const bMatch =
      selectedBrands.value.length === 0 ||
      selectedBrands.value.includes(item.brand);
    const oMatch =
      selectedOrigins.value.length === 0 ||
      selectedOrigins.value.includes(item.origin);
    const pMatch = item.price >= priceMin.value && item.price <= priceMax.value;
    const rMatch =
      ratingAtLeast.value === 0 || item.rating >= ratingAtLeast.value;
    const sMatch =
      selectedStates.value.length === 0 ||
      selectedStates.value.every((state) => {
        if (state === "Còn hàng") return item.stock > 0;
        if (state === "Flash Sale") return item.flash;
        if (state === "Organic") return item.category === "Rau củ";
        if (state === "Hàng mới") return item.id > 8;
        return true;
      });
    return qMatch && cMatch && bMatch && oMatch && pMatch && rMatch && sMatch;
  });
});

const pageSize = computed(() => (viewMode.value === "grid" ? 6 : 5));
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProducts.value.length / pageSize.value)),
);
const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredProducts.value.slice(start, start + pageSize.value);
});

const pageNumbers = computed<(number | "...")[]>(() => {
  if (totalPages.value <= 6)
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  if (currentPage.value <= 3)
    return [1, 2, 3, "...", totalPages.value - 1, totalPages.value];
  if (currentPage.value >= totalPages.value - 2) {
    return [
      1,
      2,
      "...",
      totalPages.value - 2,
      totalPages.value - 1,
      totalPages.value,
    ];
  }
  return [
    1,
    "...",
    currentPage.value - 1,
    currentPage.value,
    currentPage.value + 1,
    "...",
    totalPages.value,
  ];
});

const rangeStyle = computed(() => {
  const left = ((priceMin.value - 10000) / (500000 - 10000)) * 100;
  const right = ((priceMax.value - 10000) / (500000 - 10000)) * 100;
  return { left: `${left}%`, width: `${Math.max(0, right - left)}%` };
});

const relatedTerms = computed(() => [
  `${searchQuery.value} hữu cơ`,
  `${searchQuery.value} tươi`,
  `${searchQuery.value} nhập khẩu`,
  `combo ${searchQuery.value}`,
]);

const exploreCategories = [
  {
    icon: "🥬",
    name: "Rau củ",
    count: 245,
    bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
  },
  {
    icon: "🍎",
    name: "Trái cây",
    count: 180,
    bg: "linear-gradient(135deg,#fff7ed,#ffedd5)",
  },
  {
    icon: "🥩",
    name: "Thịt cá",
    count: 122,
    bg: "linear-gradient(135deg,#fee2e2,#fecaca)",
  },
  {
    icon: "🥛",
    name: "Sữa & đồ uống",
    count: 95,
    bg: "linear-gradient(135deg,#eff6ff,#dbeafe)",
  },
  {
    icon: "🍞",
    name: "Đồ khô",
    count: 74,
    bg: "linear-gradient(135deg,#f3f4f6,#e5e7eb)",
  },
  {
    icon: "🌰",
    name: "Hạt dinh dưỡng",
    count: 63,
    bg: "linear-gradient(135deg,#fef9c3,#fef08a)",
  },
  {
    icon: "🐟",
    name: "Hải sản",
    count: 56,
    bg: "linear-gradient(135deg,#ecfeff,#cffafe)",
  },
  {
    icon: "🧴",
    name: "Gia vị",
    count: 42,
    bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
  },
];

const wishlist = ref<number[]>([]);

const format = (v: number) => v.toLocaleString("vi-VN");

const clearInput = () => {
  inputValue.value = "";
  searchInputRef.value?.focus();
};

const pickSuggestion = (text: string) => {
  inputValue.value = text;
  submitSearch();
};

const submitSearch = () => {
  searchQuery.value = inputValue.value.trim();
  if (searchQuery.value) {
    history.value = [
      searchQuery.value,
      ...history.value.filter((h) => h !== searchQuery.value),
    ].slice(0, 5);
  }
  showDropdown.value = false;
};

const onFocusInput = () => {
  inputFocused.value = true;
  showDropdown.value = true;
};

const onRootClick = () => {
  inputFocused.value = false;
  showDropdown.value = false;
};

const moveActive = (delta: number) => {
  const total = filteredSuggests.value.length;
  if (total === 0) return;
  activeSuggestIndex.value = (activeSuggestIndex.value + delta + total) % total;
};

const applyKeyboardSelect = () => {
  if (!showDropdown.value) {
    submitSearch();
    return;
  }
  const selected = filteredSuggests.value[activeSuggestIndex.value];
  if (selected) pickSuggestion(selected);
};

const highlight = (text: string, keyword: string) => {
  const kw = keyword.trim();
  if (!kw) return `🔎 ${text}`;
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const reg = new RegExp(`(${escaped})`, "ig");
  return `🔎 ${text.replace(reg, "<mark>$1</mark>")}`;
};

const clearFilters = () => {
  selectedCategories.value = [];
  selectedBrands.value = [];
  selectedOrigins.value = [];
  selectedStates.value = [];
  ratingAtLeast.value = 0;
  setPrice(20000, 200000);
};

const removeActiveFilter = (filter: string) => {
  selectedCategories.value = selectedCategories.value.filter(
    (f) => f !== filter,
  );
  selectedBrands.value = selectedBrands.value.filter((f) => f !== filter);
  if (filter.startsWith("⭐")) {
    ratingAtLeast.value = 0;
  }
};

const setPrice = (min: number, max: number) => {
  priceMin.value = min;
  priceMax.value = max;
};

const toggleState = (state: string) => {
  if (selectedStates.value.includes(state)) {
    selectedStates.value = selectedStates.value.filter((s) => s !== state);
  } else {
    selectedStates.value.push(state);
  }
};

const addToCart = (item: Product) => {
  addedId.value = item.id;
  toastText.value = `Đã thêm ${item.name} vào giỏ hàng`;
  setTimeout(() => {
    addedId.value = null;
    toastText.value = "";
  }, 1200);
};

const toggleWish = (id: number) => {
  if (wishlist.value.includes(id)) {
    wishlist.value = wishlist.value.filter((itemId) => itemId !== id);
    return;
  }
  wishlist.value.push(id);
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let priceDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

watch(inputValue, () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    showDropdown.value = inputFocused.value && !searchQuery.value;
  }, 300);
});

watch([priceMin, priceMax], () => {
  if (priceMin.value > priceMax.value) {
    const tmp = priceMin.value;
    priceMin.value = priceMax.value;
    priceMax.value = tmp;
  }

  if (priceDebounceTimer) clearTimeout(priceDebounceTimer);
  loading.value = true;
  priceDebounceTimer = setTimeout(() => {
    loading.value = false;
  }, 300);
});

watch(
  [
    selectedCategories,
    selectedBrands,
    selectedOrigins,
    selectedStates,
    sortBy,
    viewMode,
    ratingAtLeast,
  ],
  () => {
    currentPage.value = 1;
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 200);
  },
);

watch(searchQuery, () => {
  currentPage.value = 1;
});

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped>
.search-page {
  --primary: #f97316;
  --secondary: #16a34a;
  --orange-soft: #fff7ed;
  --green-soft: #f0fdf4;
  --text: #111827;
  --muted: #6b7280;
  --border: #e5e7eb;
  min-height: 100vh;
  background: #f8fafc;
  color: var(--text);
  padding-bottom: 88px;
}

.search-hero {
  background: #fff;
  padding: 32px 0 20px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
}

.hero-inner {
  width: min(1000px, 92vw);
  margin: 0 auto;
}

.search-shell {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  background: #fff;
  height: 56px;
  padding-left: 52px;
  padding-right: 160px;
  transition: border-color 0.2s ease;
}

.search-shell:focus-within {
  border-color: #f97316;
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.16);
}

.icon {
  position: absolute;
  left: 18px;
  color: #f97316;
}

.search-shell input {
  width: 100%;
  border: 0;
  outline: 0;
  font-size: 16px;
}

.clear-btn {
  position: absolute;
  right: 126px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 0;
  background: #f3f4f6;
  color: #6b7280;
}

.search-btn {
  position: absolute;
  right: 8px;
  height: 44px;
  border-radius: 999px;
  border: 0;
  background: #f97316;
  color: #fff;
  font-weight: 700;
  padding: 0 18px;
}

.search-btn:hover {
  background: #ea580c;
  transform: scale(1.02);
}

.auto-dropdown {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 16px 26px rgba(15, 23, 42, 0.14);
  z-index: 50;
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
  animation: dropDown 0.15s ease;
}

.auto-dropdown section {
  display: grid;
  gap: 4px;
}

.auto-dropdown h5 {
  margin: 2px 6px;
  color: #6b7280;
  font-size: 11px;
  text-transform: uppercase;
}

.auto-dropdown button {
  border: 0;
  background: transparent;
  text-align: left;
  border-radius: 10px;
  padding: 8px;
}

.auto-dropdown button.active,
.auto-dropdown button:hover {
  background: #fff7ed;
}

.auto-dropdown :deep(mark) {
  background: transparent;
  color: #f97316;
  font-weight: 700;
}

.auto-dropdown hr {
  border: 0;
  border-top: 1px solid #f3f4f6;
  margin: 8px 0;
}

.mini-row {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 8px;
  align-items: center;
}

.mini-row .thumb {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.mini-row p,
.mini-row strong {
  margin: 0;
}

.mini-row strong {
  color: #ea580c;
  font-size: 13px;
}

.chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 6px;
}

.chips button {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 5px 10px;
}

.trending,
.history {
  margin: 12px auto 0;
  max-width: 800px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.trending span,
.history span {
  color: #6b7280;
  font-size: 14px;
}

.trending button,
.history button {
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 5px 10px;
  background: #fff;
  font-size: 13px;
}

.trending button:hover {
  border-color: #f97316;
  background: #fff7ed;
  color: #f97316;
}

.clear-history {
  border: 0;
  background: transparent;
  color: #ef4444;
}

.container {
  width: min(1240px, 94vw);
  margin: 0 auto;
  padding-top: 20px;
}

.result-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.result-head p {
  margin: 0;
  color: #6b7280;
}

.result-head strong {
  color: #f97316;
  font-size: 20px;
}

.result-head small {
  margin-left: 4px;
  font-size: 13px;
}

.crumb {
  margin-top: 4px;
  color: #9ca3af;
  font-size: 12px;
}

.head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-toggle {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.view-toggle button {
  border: 0;
  background: #fff;
  padding: 8px 10px;
}

.view-toggle button.active {
  background: #f97316;
  color: #fff;
}

.head-actions select {
  border: 1px solid #f97316;
  border-radius: 10px;
  height: 36px;
  padding: 0 10px;
}

.main-layout {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 24% 76%;
  gap: 16px;
}

.filters {
  position: sticky;
  top: 80px;
  align-self: start;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  padding: 12px;
  display: grid;
  gap: 8px;
}

.active-filter-box {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}

.active-filter-box button {
  border: 1px solid #fdba74;
  border-radius: 999px;
  background: #fff7ed;
  color: #c2410c;
  padding: 4px 8px;
  font-size: 12px;
}

.active-filter-box .clear-all {
  border: 0;
  background: transparent;
  color: #ef4444;
}

.filters details {
  border-top: 1px solid #f3f4f6;
  padding-top: 8px;
}

.filters summary {
  cursor: pointer;
  font-weight: 700;
  margin-bottom: 6px;
}

.filters label {
  display: flex;
  gap: 8px;
  margin: 6px 0;
  font-size: 14px;
}

.range-wrap {
  position: relative;
}

.range-wrap input {
  width: 100%;
}

.range-track {
  height: 6px;
  border-radius: 999px;
  background: #e5e7eb;
  position: relative;
  margin-top: 8px;
}

.range-track span {
  position: absolute;
  height: 100%;
  border-radius: 999px;
  background: #f97316;
}

.range-wrap p {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.quick-price {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.quick-price button {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 999px;
  padding: 5px 8px;
  font-size: 12px;
}

.brand-search {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 7px 8px;
}

.star-row {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  text-align: left;
  padding: 6px 8px;
  margin: 5px 0;
}

.star-row.active {
  border-color: #f97316;
  background: #fff7ed;
}

.star-row small {
  margin-left: 8px;
}

.state-pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.state-pills button {
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: #fff;
  padding: 5px 9px;
  font-size: 12px;
}

.state-pills button.active {
  border-color: #f97316;
  background: #f97316;
  color: #fff;
}

.result-grid {
  display: grid;
  gap: 12px;
}

.result-grid.grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.result-grid.list {
  grid-template-columns: 1fr;
}

.product-card {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 24px rgba(15, 23, 42, 0.12);
}

.card-image {
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
}

.card-image small {
  position: absolute;
  top: 8px;
  left: 8px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  padding: 3px 8px;
}

.wish {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  background: #fff;
  color: #ef4444;
}

.wish.on {
  background: #ef4444;
  color: #fff;
  animation: heart 0.35s ease;
}

.quick {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translate(-50%, 18px);
  opacity: 0;
  transition: all 0.2s ease;
  border-radius: 999px;
  background: #fff;
  padding: 5px 10px;
  font-size: 12px;
}

.product-card:hover .quick {
  transform: translate(-50%, 0);
  opacity: 1;
}

.card-body {
  padding: 12px;
}

.brand {
  margin: 0;
  color: #6b7280;
  text-transform: uppercase;
  font-size: 11px;
}

.card-body h4 {
  margin: 6px 0;
  font-size: 16px;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-body h4:hover {
  color: #f97316;
}

.stars {
  color: #fbbf24;
  font-size: 13px;
}

.stars small {
  color: #6b7280;
}

.price-row {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.price-row .old {
  color: #9ca3af;
  text-decoration: line-through;
  font-size: 12px;
}

.price-row strong {
  color: #ea580c;
  font-size: 18px;
}

.price-row small {
  border-radius: 999px;
  background: #fee2e2;
  color: #dc2626;
  font-size: 11px;
  padding: 2px 6px;
}

.stock {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 12px;
}

.flash-track {
  margin-top: 6px;
  height: 5px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.flash-track span {
  display: block;
  height: 100%;
  background: #f97316;
}

.add-btn {
  margin-top: 9px;
  width: 100%;
  border: 0;
  border-radius: 10px;
  background: #f97316;
  color: #fff;
  height: 36px;
  font-weight: 700;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.skeleton-grid.list {
  grid-template-columns: 1fr;
}

.skeleton-item {
  height: 280px;
  border-radius: 14px;
  background: linear-gradient(100deg, #f3f4f6 20%, #e5e7eb 35%, #f3f4f6 50%);
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}

.pagination {
  margin-top: 14px;
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
}

.pagination button {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  padding: 6px 10px;
}

.pagination button.active {
  background: #f97316;
  color: #fff;
}

.pagination button.dot {
  border: 0;
  background: transparent;
}

.pagination span {
  color: #6b7280;
}

.empty-result {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  padding: 24px;
  text-align: center;
}

.empty-result svg {
  width: 100px;
  animation: sway 2s infinite ease-in-out;
}

.empty-result h3 {
  color: #f97316;
}

.empty-result p {
  color: #6b7280;
}

.empty-chips {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.empty-chips button {
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #fff;
  padding: 6px 10px;
}

.outline-btn {
  margin-top: 12px;
  display: inline-flex;
  border: 1px solid #f97316;
  color: #f97316;
  border-radius: 999px;
  padding: 8px 14px;
}

.related-search {
  margin-top: 18px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.related-search button {
  border: 1px solid #fdba74;
  border-radius: 999px;
  background: #fff7ed;
  color: #c2410c;
  padding: 5px 10px;
}

.explore-section h2 {
  margin: 0 0 12px;
}

.cate-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.cate-grid article {
  border-radius: 14px;
  padding: 14px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.cate-grid article:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.12);
}

.cate-grid p,
.cate-grid h3,
.cate-grid small {
  margin: 0;
}

.cate-grid p {
  font-size: 34px;
}

.mobile-filter-btn {
  display: none;
  position: fixed;
  right: 14px;
  bottom: 20px;
  z-index: 36;
  border: 0;
  border-radius: 999px;
  background: #f97316;
  color: #fff;
  padding: 10px 14px;
  font-weight: 700;
}

.mobile-sheet {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.35);
  backdrop-filter: blur(2px);
  z-index: 50;
  display: flex;
  align-items: flex-end;
}

.sheet-body {
  width: 100%;
  max-height: 85vh;
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding: 12px;
  overflow-y: auto;
}

.sheet-handle {
  width: 40px;
  height: 5px;
  border-radius: 999px;
  margin: 0 auto 8px;
  background: #e5e7eb;
}

.sheet-group {
  display: grid;
  gap: 8px;
}

.apply-sheet {
  margin-top: 10px;
  width: 100%;
  border: 0;
  border-radius: 10px;
  background: #f97316;
  color: #fff;
  height: 40px;
}

.toast {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 60;
  border-radius: 10px;
  background: #111827;
  color: #fff;
  padding: 10px 14px;
}

.sheet-enter-active,
.sheet-leave-active,
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.sheet-enter-from,
.sheet-leave-to,
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes dropDown {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

@keyframes heart {
  50% {
    transform: scale(1.2);
  }
}

@keyframes sway {
  0%,
  100% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

@media (max-width: 1200px) {
  .result-grid.grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cate-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 992px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .filters {
    display: none;
  }

  .mobile-filter-btn {
    display: inline-flex;
  }
}

@media (max-width: 768px) {
  .search-hero {
    padding: 16px 0;
  }

  .search-shell {
    padding-right: 114px;
    height: 52px;
  }

  .clear-btn {
    right: 94px;
  }

  .search-btn {
    padding: 0 12px;
    height: 38px;
  }

  .head-actions {
    width: 100%;
    justify-content: space-between;
  }

  .result-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .result-grid.grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cate-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 360px) {
  .result-grid.grid {
    grid-template-columns: 1fr;
  }
}
</style>
