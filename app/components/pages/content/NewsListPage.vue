<template>
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
          SmartFood Journal
        </p>
        <h1 class="text-balance text-3xl font-black leading-tight sm:text-5xl">
          Fresh Stories For Better Eating
        </h1>
        <p
          class="mt-4 max-w-2xl text-sm leading-7 text-emerald-50 sm:text-base"
        >
          Nutrition insights, food trends, healthy cooking notes, and seasonal
          updates from SmartFood.
        </p>

        <label
          class="mt-7 flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/30 bg-white/15 px-4 py-3 backdrop-blur-md"
        >
          <i class="pi pi-search text-sm text-emerald-100" />
          <input
            v-model="keyword"
            type="text"
            placeholder="Search topics, ingredients, or article titles..."
            class="w-full bg-transparent text-sm text-white placeholder:text-emerald-100 focus:outline-none"
            aria-label="Search articles"
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
          <label for="newsSort" class="text-slate-500">Sort by</label>
          <select
            id="newsSort"
            v-model="sortBy"
            class="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:outline-none"
            aria-label="Sort articles"
          >
            <option value="latest">Latest</option>
            <option value="popular">Popular</option>
            <option value="readTime">Read Time</option>
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
            <h2 class="text-2xl font-black text-slate-900">Featured Stories</h2>
            <span
              class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
              >Editor Picks</span
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
              :to="`/news/${featured[0]?.slug}`"
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
                :to="`/news/${item.slug}`"
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
            <h2 class="text-2xl font-black text-slate-900">Latest Articles</h2>
            <span class="text-sm font-semibold text-slate-500"
              >{{ filteredArticles.length }} posts</span
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
              :to="`/news/${article.slug}`"
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
                    <p class="text-[11px] text-slate-500">{{ article.date }}</p>
                  </div>
                </div>
                <span class="text-xs font-semibold text-slate-500"
                  >{{ article.readTime }} min</span
                >
              </div>
            </NuxtLink>
          </div>

          <div
            v-if="!loading && totalPages > 1"
            class="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            <Button
              label="Prev"
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
              label="Next"
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
          <h3 class="text-base font-black text-slate-900">Popular Posts</h3>
          <div class="mt-3 space-y-3">
            <NuxtLink
              v-for="(post, idx) in popularPosts"
              :key="post.id"
              :to="`/news/${post.slug}`"
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
          <h3 class="text-base font-black text-slate-900">Hot Tags</h3>
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="tag in hotTags"
              :key="tag"
              class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
            >
              #{{ tag }}
            </span>
          </div>
        </section>

        <section
          class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm"
        >
          <h3 class="text-base font-black text-emerald-800">Newsletter</h3>
          <p class="mt-2 text-sm leading-6 text-emerald-700">
            Get weekly nutrition and healthy recipe updates.
          </p>
          <input
            type="email"
            placeholder="you@example.com"
            class="mt-3 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            aria-label="Newsletter email"
          />
          <Button
            label="Subscribe"
            class="mt-3! w-full! rounded-xl! border-0! bg-emerald-600! hover:bg-emerald-700!"
          />
        </section>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

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
const activeCategory = ref("All");
const loading = ref(true);
const currentPage = ref(1);
const pageSize = 6;

const articles = ref<Article[]>([
  {
    id: 1,
    slug: "immune-foods-everyday",
    title: "5 Foods That Naturally Strengthen Your Immune System",
    excerpt:
      "Discover daily ingredients that support immunity, digestion, and balanced energy throughout the week.",
    category: "Nutrition",
    author: "Lena Nguyen",
    authorInitial: "L",
    date: "Apr 03, 2026",
    readTime: 6,
    cover:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    views: 2180,
  },
  {
    id: 2,
    slug: "smart-grocery-budget",
    title: "How To Cut Grocery Costs Without Compromising Nutrition",
    excerpt:
      "A practical framework to shop smarter, avoid waste, and keep healthy meals affordable.",
    category: "Shopping Tips",
    author: "Mina Tran",
    authorInitial: "M",
    date: "Apr 02, 2026",
    readTime: 5,
    cover:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    views: 1850,
  },
  {
    id: 3,
    slug: "quick-healthy-lunches",
    title: "7 Quick Lunch Ideas For Busy Weekdays",
    excerpt:
      "Balanced lunch ideas that take under 20 minutes and still taste fresh and vibrant.",
    category: "Recipes",
    author: "Quynh Le",
    authorInitial: "Q",
    date: "Apr 01, 2026",
    readTime: 4,
    cover:
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80",
    views: 1390,
  },
  {
    id: 4,
    slug: "fiber-and-gut-health",
    title: "Why Fiber Is Essential For Long-Term Gut Health",
    excerpt:
      "Learn how fiber-rich foods help your microbiome and improve satiety over time.",
    category: "Nutrition",
    author: "Lena Nguyen",
    authorInitial: "L",
    date: "Mar 30, 2026",
    readTime: 7,
    cover:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1200&q=80",
    views: 1675,
  },
  {
    id: 5,
    slug: "meal-prep-for-families",
    title: "Meal Prep For Families: Simple Weekly System",
    excerpt:
      "Build a reliable prep routine with reusable ingredient blocks and fast assembly dinners.",
    category: "Lifestyle",
    author: "Hao Vo",
    authorInitial: "H",
    date: "Mar 29, 2026",
    readTime: 8,
    cover:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    views: 1240,
  },
  {
    id: 6,
    slug: "seasonal-fruits-guide",
    title: "Seasonal Fruit Guide: What To Buy This Month",
    excerpt:
      "Use this seasonal chart to buy fresher fruit and maximize taste, texture, and value.",
    category: "Shopping Tips",
    author: "Mina Tran",
    authorInitial: "M",
    date: "Mar 28, 2026",
    readTime: 5,
    cover:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80",
    views: 990,
  },
]);

const categories = computed(() => [
  "All",
  ...new Set(articles.value.map((item) => item.category)),
]);

const filteredArticles = computed(() => {
  const query = keyword.value.trim().toLowerCase();
  const byCategory = articles.value.filter((article) =>
    activeCategory.value === "All"
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
  "clean-eating",
  "high-protein",
  "meal-prep",
  "seasonal",
  "gut-health",
  "smart-shopping",
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

<style scoped>
.hero-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(2px);
  opacity: 0.35;
  animation: orbFloat 7s ease-in-out infinite;
}

.hero-orb-a {
  right: -40px;
  top: -80px;
  height: 240px;
  width: 240px;
  background: radial-gradient(circle, #bef264 0%, #22d3ee 70%);
}

.hero-orb-b {
  bottom: -70px;
  left: -50px;
  height: 180px;
  width: 180px;
  background: radial-gradient(circle, #fef08a 0%, #6ee7b7 72%);
  animation-delay: 0.8s;
}

.news-card {
  opacity: 0;
  transform: translateY(16px);
}

.news-card.in-view {
  animation: cardUp 0.5s ease forwards;
}

@keyframes orbFloat {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
}

@keyframes cardUp {
  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
