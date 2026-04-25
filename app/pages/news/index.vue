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
            <section v-if="activeCategory === 'Tất cả'">
              <div class="mb-4 flex items-center justify-between">
                <h2 class="text-2xl font-black text-slate-900">
                  Bài Viết Nổi Bật
                </h2>
                <span
                  class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
                  >Được Chọn Lọc</span
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
                <span class="text-sm font-semibold text-slate-500">
                  {{ filteredArticles.length }} bài viết
                </span>
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
                v-if="!loading && pagedArticles.length === 0"
                class="flex flex-col items-center justify-center py-20 text-center"
              >
                <div
                  class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300"
                >
                  <i class="pi pi-inbox text-4xl"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-900">
                  Chưa có bài viết nào
                </h3>
                <p class="mt-1 text-sm text-slate-500">
                  Rất tiếc, chưa có bài viết nào trong mục
                  <span class="font-bold text-emerald-600">{{
                    activeCategory
                  }}</span
                  >.
                </p>
                <button
                  v-if="activeCategory !== 'Tất cả'"
                  class="mt-6 text-sm font-bold text-emerald-600 hover:underline"
                  @click="activeCategory = 'Tất cả'"
                >
                  Xem tất cả bài viết
                </button>
              </div>

              <BasePagination
                v-if="!loading && totalPages > 1"
                v-model="currentPage"
                :total="filteredArticles.length"
                :per-page="pageSize"
              />
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

            <!-- <section
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
            </section> -->

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
                  <p class="text-lg font-black text-emerald-600">
                    {{ articlesData?.pagination.total || 0 }}+
                  </p>
                  <p class="text-[11px] font-semibold text-slate-500">
                    Bài viết
                  </p>
                </div>
                <div class="rounded-xl bg-emerald-50 px-2 py-3">
                  <p class="text-lg font-black text-emerald-600">
                    {{ articlesData?.stats.totalAuthors || 0 }}
                  </p>
                  <p class="text-[11px] font-semibold text-slate-500">
                    Tác giả
                  </p>
                </div>
                <div class="rounded-xl bg-emerald-50 px-2 py-3">
                  <p class="text-lg font-black text-emerald-600">
                    {{ formatCount(articlesData?.stats.totalViews) }}
                  </p>
                  <p class="text-[11px] font-semibold text-slate-500">
                    Lượt đọc
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
import BasePagination from "~/components/common/BasePagination.vue";
import { useArticleListQuery } from "~/queries/article/useArticleListQuery";
import { useArticleCategoriesQuery } from "~/queries/article/useArticleCategoriesQuery";

useHead({
  title: "Tin tức & Khuyến mãi - SmartFood",
  meta: [
    {
      name: "description",
      content: "Trang Tin tức & Khuyến mãi của SmartFood",
    },
  ],
});

const keyword = ref("");
const sortBy = ref<"latest" | "popular" | "readTime">("latest");
const activeCategory = ref("Tất cả");
const currentPage = ref(1);
const pageSize = 6;

const { data: categoriesData } = useArticleCategoriesQuery();

const categories = computed(() => [
  "Tất cả",
  ...(categoriesData.value?.data.map((c) => c.title) || []),
]);

const activeCategoryId = computed(() => {
  if (activeCategory.value === "Tất cả") return undefined;
  return categoriesData.value?.data.find(
    (c) => c.title === activeCategory.value,
  )?._id;
});

const listParams = computed(() => {
  return {
    page: 1,
    limit: 1000,
    keyword: keyword.value,
    sortField:
      sortBy.value === "popular"
        ? "views"
        : sortBy.value === "readTime"
          ? "readTime"
          : "publishedAt",
    sortOrder: "desc",
  };
});

const featuredParams = computed(() => {
  return {
    page: 1,
    limit: 3,
    featured: true,
  };
});

const popularParams = computed(() => {
  return {
    page: 1,
    limit: 5,
    sortField: "views",
    sortOrder: "desc" as const,
  };
});

const { data: articlesData, isPending: loadingArticles } = useArticleListQuery(
  () => listParams.value,
);
const { data: featuredData, isPending: loadingFeatured } = useArticleListQuery(
  () => featuredParams.value,
);
const { data: popularData } = useArticleListQuery(() => popularParams.value);

const isLoading = computed(
  () => loadingArticles.value && loadingFeatured.value,
);
const loading = computed(() => loadingArticles.value);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const mapArticle = (a: any) => ({
  id: a._id,
  slug: a.slug,
  title: a.title,
  excerpt: a.shortDescription || "",
  category:
    categoriesData.value?.data.find((c: any) => c._id === a.article_category_id)
      ?.title || "Chưa phân loại",
  author: a.authorName || "Ẩn danh",
  authorInitial: a.authorName ? a.authorName.charAt(0).toUpperCase() : "A",
  date: formatDate(a.publishedAt),
  readTime: a.readTime || 0,
  cover: a.thumbnail || "",
  views: a.views || 0,
});

const allArticles = computed(() => articlesData.value?.data || []);

const allMappedArticles = computed(() =>
  allArticles.value.map((a: any) => mapArticle(a)),
);

const filteredArticles = computed(() => {
  if (activeCategory.value === "Tất cả") return allMappedArticles.value;
  return allMappedArticles.value.filter(
    (a: any) => a.category === activeCategory.value,
  );
});

const pagedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredArticles.value.slice(start, start + pageSize);
});

const featured = computed(() =>
  (featuredData.value?.data || []).map(mapArticle),
);
const popularPosts = computed(() =>
  (popularData.value?.data || []).map(mapArticle),
);

const totalPages = computed(
  () => Math.ceil(filteredArticles.value.length / pageSize) || 1,
);

const formatCount = (num: number | undefined) => {
  if (num === undefined) return "0";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k+";
  return num.toString();
};

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
        (entry.target as HTMLElement).style.animationDelay =
          `${(index % pageSize) * 90}ms`;
        entry.target.classList.add("in-view");
      });
    },
    { threshold: 0.18 },
  );

  cards.forEach((card) => observer?.observe(card));
};

watch([keyword, activeCategory, sortBy], () => {
  currentPage.value = 1;
});

watch([pagedArticles, loading], () => {
  if (loading.value) return;
  bindCardObserver();
});

onMounted(() => {
  if (!loading.value) {
    bindCardObserver();
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>
