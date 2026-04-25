<template>
  <div>
    <SkNewsListPage v-if="isLoading" />
    <div else>
      <div class="min-h-screen bg-slate-50 text-slate-800">
        <section
          class="relative overflow-hidden bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 px-4 pb-12 pt-16 text-white"
        >
          <div class="hero-orb hero-orb-a" />
          <div class="hero-orb hero-orb-b" />
          <div class="mx-auto w-full max-w-6xl">
            <p
              class="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100"
            >
              Tạp chí SmartFood
            </p>
            <h1
              class="text-balance text-3xl font-black leading-tight sm:text-5xl"
            >
              Câu Chuyện Tươi Mới Cho Bữa Ăn Thú Vị Hơn
            </h1>
            <p
              class="mt-4 max-w-2xl text-sm leading-7 text-emerald-50 sm:text-base"
            >
              Kiến thức dinh dưỡng, xu hướng ẩm thực, mẹo nấu ăn lành mạnh và
              cập nhật theo mùa từ SmartFood.
            </p>

            <label
              class="mt-7 flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/30 bg-white/15 px-4 py-3 backdrop-blur-md"
            >
              <i class="pi pi-search text-sm text-emerald-100" />
              <input
                v-model="keyword"
                type="text"
                placeholder="Tìm kiếm chủ đề, nguyên liệu hoặc tiêu đề bài viết..."
                class="w-full bg-transparent text-sm text-white placeholder:text-emerald-100 focus:outline-none"
                aria-label="Tìm kiếm bài viết"
              />
            </label>
          </div>
        </section>

        <section
          class="sticky top-16 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur"
        >
          <div
            class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3"
          >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="category in categories"
                :key="category"
                type="button"
                class="rounded-full border px-4 py-1.5 text-xs font-semibold transition"
                :class="
                  activeCategory === category
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                "
                @click="activeCategory = category"
              >
                {{ category }}
              </button>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <label for="newsSort" class="text-slate-500">Sắp xếp theo</label>
              <select
                id="newsSort"
                v-model="sortBy"
                class="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:outline-none"
                aria-label="Sắp xếp bài viết"
              >
                <option value="latest">Mới nhất</option>
                <option value="popular">Phổ biến</option>
                <option value="readTime">Thời gian đọc</option>
              </select>
            </div>
          </div>
        </section>

        <main
          class="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px]"
        >
          <div class="space-y-10">
            <section>
              <div class="mb-4 flex items-center justify-between">
                <h2 class="text-2xl font-black text-slate-900">
                  Bài Viết Nổi Bật
                </h2>
                <span
                  class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
                  >Biên Tập Viên Chọn</span
                >
              </div>

              <div v-if="loading" class="grid grid-cols-1 gap-4 md:grid-cols-5">
                <article class="md:col-span-3">
                  <Skeleton height="300px" borderRadius="1rem" />
                </article>
                <div class="grid gap-4 md:col-span-2">
                  <Skeleton height="142px" borderRadius="1rem" />
                  <Skeleton height="142px" borderRadius="1rem" />
                </div>
              </div>

              <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-5">
                <NuxtLink
                  :to="ROUTES.NEWS_DETAIL(featured[0]?.slug)"
                  class="group relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white md:col-span-3"
                >
                  <img
                    :src="featured[0]?.cover"
                    :alt="featured[0]?.title"
                    class="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105"
                  />
                  <div
                    class="absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-transparent"
                  />
                  <div class="relative z-10 flex h-full flex-col justify-end">
                    <p
                      class="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-200"
                    >
                      {{ featured[0]?.category }}
                    </p>
                    <h3 class="mt-2 text-2xl font-black leading-tight">
                      {{ featured[0]?.title }}
                    </h3>
                    <p class="mt-3 line-clamp-2 text-sm text-slate-100">
                      {{ featured[0]?.excerpt }}
                    </p>
                  </div>
                </NuxtLink>

                <div class="grid gap-4 md:col-span-2">
                  <NuxtLink
                    v-for="item in featured.slice(1, 3)"
                    :key="item.id"
                    :to="ROUTES.NEWS_DETAIL(item.slug)"
                    class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <img
                      :src="item.cover"
                      :alt="item.title"
                      class="mb-3 h-28 w-full rounded-xl object-cover"
                    />
                    <p
                      class="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600"
                    >
                      {{ item.category }}
                    </p>
                    <h4
                      class="mt-1 line-clamp-2 text-base font-extrabold text-slate-900"
                    >
                      {{ item.title }}
                    </h4>
                  </NuxtLink>
                </div>
              </div>
            </section>

            <section>
              <div class="mb-4 flex items-center justify-between">
                <h2 class="text-2xl font-black text-slate-900">
                  Bài Viết Mới Nhất
                </h2>
                <span class="text-sm font-semibold text-slate-500"
                  >{{ filteredArticles.length }} bài viết</span
                >
              </div>

              <div
                v-if="loading"
                class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
              >
                <article
                  v-for="n in 6"
                  :key="n"
                  class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <Skeleton height="150px" borderRadius="0.85rem" />
                  <Skeleton width="45%" height="12px" />
                  <Skeleton width="100%" height="16px" />
                  <Skeleton width="82%" height="14px" />
                  <Skeleton width="66%" height="14px" />
                </article>
              </div>

              <div
                v-else
                class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
              >
                <NuxtLink
                  v-for="(article, index) in pagedArticles"
                  :key="article.id"
                  :to="ROUTES.NEWS_DETAIL(article.slug)"
                  class="news-card group overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  :data-index="index + (currentPage - 1) * pageSize"
                >
                  <img
                    :src="article.cover"
                    :alt="article.title"
                    class="h-40 w-full rounded-xl object-cover"
                  />
                  <p
                    class="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600"
                  >
                    {{ article.category }}
                  </p>
                  <h3
                    class="mt-1 line-clamp-2 text-lg font-extrabold text-slate-900"
                  >
                    {{ article.title }}
                  </h3>
                  <p class="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                    {{ article.excerpt }}
                  </p>
                  <Divider class="my-3!" />
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Avatar
                        :label="article.authorInitial"
                        shape="circle"
                        class="bg-emerald-100! text-emerald-700!"
                      />
                      <div>
                        <p class="text-xs font-semibold text-slate-700">
                          {{ article.author }}
                        </p>
                        <p class="text-[11px] text-slate-500">
                          {{ article.date }}
                        </p>
                      </div>
                    </div>
                    <span class="text-xs font-semibold text-slate-500"
                      >{{ article.readTime }} phút</span
                    >
                  </div>
                </NuxtLink>
              </div>

              <div
                v-if="!loading && totalPages > 1"
                class="mt-6 flex flex-wrap items-center justify-center gap-2"
              >
                <Button
                  label="Trước"
                  severity="secondary"
                  outlined
                  :disabled="currentPage === 1"
                  @click="currentPage -= 1"
                />

                <Button
                  v-for="page in pageButtons"
                  :key="String(page)"
                  :label="String(page)"
                  :severity="page === currentPage ? 'success' : 'secondary'"
                  :outlined="page !== currentPage"
                  :disabled="page === '...'"
                  class="min-w-10!"
                  @click="typeof page === 'number' && (currentPage = page)"
                />

                <Button
                  label="Sau"
                  severity="secondary"
                  outlined
                  :disabled="currentPage === totalPages"
                  @click="currentPage += 1"
                />
              </div>
            </section>
          </div>

          <aside class="space-y-4 lg:sticky lg:top-32 lg:h-fit">
            <section
              class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h3 class="text-base font-black text-slate-900">
                Bài Viết Phổ Biến
              </h3>
              <div class="mt-3 space-y-3">
                <NuxtLink
                  v-for="(post, idx) in popularPosts"
                  :key="post.id"
                  :to="ROUTES.NEWS_DETAIL(post.slug)"
                  class="flex items-start gap-3"
                >
                  <span class="mt-0.5 text-lg font-black text-emerald-500">{{
                    String(idx + 1).padStart(2, "0")
                  }}</span>
                  <p class="text-sm font-semibold leading-5 text-slate-700">
                    {{ post.title }}
                  </p>
                </NuxtLink>
              </div>
            </section>

            <section
              class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h3 class="text-base font-black text-slate-900">
                Chủ Đề Nổi Bật
              </h3>
              <div class="mt-3 space-y-2">
                <div
                  v-for="(topic, idx) in [
                    { label: 'Dinh dưỡng cân bằng', count: '24 bài' },
                    { label: 'Công thức lành mạnh', count: '18 bài' },
                    { label: 'Mua sắm thông minh', count: '12 bài' },
                    { label: 'Ăn theo mùa', count: '9 bài' },
                    { label: 'Sức khoẻ tiêu hoá', count: '7 bài' },
                  ]"
                  :key="idx"
                  class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                >
                  <span class="text-sm font-semibold text-slate-700">{{
                    topic.label
                  }}</span>
                  <span class="text-xs font-bold text-emerald-600">{{
                    topic.count
                  }}</span>
                </div>
              </div>
            </section>

            <section
              class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h3 class="text-base font-black text-slate-900">Về SmartFood</h3>
              <p class="mt-2 text-sm leading-6 text-slate-500">
                SmartFood là tạp chí ẩm thực & dinh dưỡng, nơi chia sẻ kiến thức
                khoa học, công thức thực tiễn và lối sống lành mạnh dành cho mọi
                gia đình Việt.
              </p>
              <div class="mt-4 grid grid-cols-3 gap-2 text-center">
                <div class="rounded-xl bg-emerald-50 px-2 py-3">
                  <p class="text-lg font-black text-emerald-600">120+</p>
                  <p class="text-[11px] font-semibold text-slate-500">
                    Bài viết
                  </p>
                </div>
                <div class="rounded-xl bg-emerald-50 px-2 py-3">
                  <p class="text-lg font-black text-emerald-600">8</p>
                  <p class="text-[11px] font-semibold text-slate-500">
                    Chuyên gia
                  </p>
                </div>
                <div class="rounded-xl bg-emerald-50 px-2 py-3">
                  <p class="text-lg font-black text-emerald-600">4k+</p>
                  <p class="text-[11px] font-semibold text-slate-500">
                    Độc giả
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkNewsListPage from "~/components/skeletons/SkNewsListPage.vue";
import { ROUTES } from "~/constants/routes";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

useHead({
  title: "Tin tức & Khuyến mãi - SmartFood",
  meta: [
    {
      name: "description",
      content: "Trang Tin tức & Khuyến mãi của SmartFood",
    },
  ],
});

const isLoading = ref(false);

type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorInitial: string;
  date: string;
  readTime: number;
  cover: string;
  views: number;
};

const keyword = ref("");
const sortBy = ref<"latest" | "popular" | "readTime">("latest");
const activeCategory = ref("Tất cả");
const loading = ref(true);
const currentPage = ref(1);
const pageSize = 6;

const articles = ref<Article[]>([
  {
    id: 1,
    slug: "immune-foods-everyday",
    title: "5 Thực Phẩm Tự Nhiên Tăng Cường Miễn Dịch",
    excerpt:
      "Khám phá các nguyên liệu hỗ trợ hệ miễn dịch, tiêu hóa và cân bằng năng lượng hàng ngày.",
    category: "Dinh dưỡng",
    author: "Lena Nguyen",
    authorInitial: "L",
    date: "03 Th04, 2026",
    readTime: 6,
    cover:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    views: 2180,
  },
  {
    id: 2,
    slug: "smart-grocery-budget",
    title: "Cách Cắt Giảm Chi Phí Mua Sắm Không Ảnh Hưởng Dinh Dưỡng",
    excerpt:
      "Nguyên tắc mua sắm thông minh, tránh lãng phí và giữ được chi phí hợp lý.",
    category: "Mẹo mua sắm",
    author: "Mina Tran",
    authorInitial: "M",
    date: "02 Th04, 2026",
    readTime: 5,
    cover:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    views: 1850,
  },
  {
    id: 3,
    slug: "quick-healthy-lunches",
    title: "7 Ý Tưởng Bữa Trưa Nhanh Chóng Cho Ngày Bận Rộn",
    excerpt:
      "Bữa ăn sáng tạo chỉ tốn chưa đầy 20 phút mà vẫn đảm bảo độ tươi ngon.",
    category: "Công thức",
    author: "Quynh Le",
    authorInitial: "Q",
    date: "01 Th04, 2026",
    readTime: 4,
    cover:
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80",
    views: 1390,
  },
  {
    id: 4,
    slug: "fiber-and-gut-health",
    title: "Tại Sao Chất Xơ Là Thiết Yếu Cho Tiêu Hóa Khỏe Mạnh",
    excerpt:
      "Tìm hiểu cách thực phẩm giàu chất xơ hỗ trợ hệ vi sinh đường ruột và cải thiện độ no.",
    category: "Dinh dưỡng",
    author: "Lena Nguyen",
    authorInitial: "L",
    date: "30 Th03, 2026",
    readTime: 7,
    cover:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1200&q=80",
    views: 1675,
  },
  {
    id: 5,
    slug: "meal-prep-for-families",
    title: "Chuẩn Bị Bữa Ăn Cho Gia Đình: Hệ Thống Đơn Giản Hàng Tuần",
    excerpt: "Lập thói quen chuẩn bị nhanh chóng cho các bữa tối tuyệt đỉnh.",
    category: "Lối sống",
    author: "Hao Vo",
    authorInitial: "H",
    date: "29 Th03, 2026",
    readTime: 8,
    cover:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    views: 1240,
  },
  {
    id: 6,
    slug: "seasonal-fruits-guide",
    title: "Hướng Dẫn Trái Cây Theo Mùa: Nên Mua Gì Tháng Nay",
    excerpt:
      "Sử dụng bảng theo mùa này để mua trái cây đúng mùa, tươi ngon và nhiều hương vị hơn.",
    category: "Mẹo mua sắm",
    author: "Mina Tran",
    authorInitial: "M",
    date: "28 Th03, 2026",
    readTime: 5,
    cover:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80",
    views: 990,
  },
]);

const categories = computed(() => [
  "Tất cả",
  ...new Set(articles.value.map((item) => item.category)),
]);

const filteredArticles = computed(() => {
  const query = keyword.value.trim().toLowerCase();
  const byCategory = articles.value.filter((article) =>
    activeCategory.value === "Tất cả"
      ? true
      : article.category === activeCategory.value,
  );

  const byKeyword = byCategory.filter((article) => {
    if (!query) return true;
    return (
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    );
  });

  if (sortBy.value === "popular") {
    return [...byKeyword].sort((a, b) => b.views - a.views);
  }
  if (sortBy.value === "readTime") {
    return [...byKeyword].sort((a, b) => a.readTime - b.readTime);
  }
  return [...byKeyword].sort((a, b) => b.id - a.id);
});

const featured = computed(() => filteredArticles.value.slice(0, 3));
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredArticles.value.length / pageSize)),
);

const pagedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredArticles.value.slice(start, start + pageSize);
});

const pageButtons = computed<(number | "...")[]>(() => {
  if (totalPages.value <= 6) {
    return Array.from({ length: totalPages.value }, (_, idx) => idx + 1);
  }

  if (currentPage.value <= 3) {
    return [1, 2, 3, "...", totalPages.value - 1, totalPages.value];
  }

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
const popularPosts = computed(() =>
  [...articles.value].sort((a, b) => b.views - a.views).slice(0, 5),
);
const hotTags = [
  "an-sach",
  "giau-protein",
  "chuan-bi-bua-an",
  "theo-mua",
  "suc-khoe-tieu-hoa",
  "mua-sam-thong-minh",
];

let observer: IntersectionObserver | null = null;

const bindCardObserver = async () => {
  await nextTick();

  const cards = document.querySelectorAll(".news-card");
  cards.forEach((card) => card.classList.remove("in-view"));

  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Number((entry.target as HTMLElement).dataset.index || 0);
        (entry.target as HTMLElement).style.animationDelay = `${index * 90}ms`;
        entry.target.classList.add("in-view");
      });
    },
    { threshold: 0.18 },
  );

  cards.forEach((card) => observer?.observe(card));
};

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
    bindCardObserver();
  }, 700);
});

watch([keyword, activeCategory, sortBy], () => {
  currentPage.value = 1;
});

watch([pagedArticles, loading], () => {
  if (loading.value) return;
  bindCardObserver();
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>
