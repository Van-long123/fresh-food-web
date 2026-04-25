import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useArticleListQuery } from "~/queries/article/useArticleListQuery";
import { useArticleCategoriesQuery } from "~/queries/article/useArticleCategoriesQuery";
import { ROUTES } from "~/constants/routes";
import { useDebounceFn } from "~/customHooks/useDebounceFn";
export const useNewsPage = () => {
  // --- States ---
  const keyword = ref("");
  const searchInput = ref(""); // Dùng cho v-model tại UI để debounce
  const sortBy = ref<"latest" | "popular" | "readTime">("latest");
  const activeCategory = ref("Tất cả");
  const currentPage = ref(1);
  const pageSize = 6;

  // Debounce search: Khi người dùng nhập vào searchInput, sau 500ms mới cập nhật keyword để gọi API
  const debounceSearch = useDebounceFn((val: string) => {
    keyword.value = val;
  }, 500);

  watch(searchInput, (newVal) => {
    debounceSearch(newVal);
  });

  // --- Queries ---
  const { data: categoriesData } = useArticleCategoriesQuery();

  // --- Computed Params ---
  const categories = computed(() => [
    "Tất cả",
    ...(categoriesData.value?.data.map((c) => c.title) || []),
  ]);

  // const activeCategoryId = computed(() => {
  //   if (activeCategory.value === "Tất cả") return undefined;
  //   return categoriesData.value?.data.find(
  //     (c) => c.title === activeCategory.value,
  //   )?._id;
  // });

  const listParams = computed(() => ({
    page: 1,
    limit: 1000,
    keyword: keyword.value,
    sortField:
      sortBy.value === "popular"
        ? "views"
        : sortBy.value === "readTime"
          ? "readTime"
          : "publishedAt",
    sortOrder: "desc" as const,
  }));

  const featuredParams = computed(() => ({
    page: 1,
    limit: 3,
    featured: true,
  }));

  const popularParams = computed(() => ({
    page: 1,
    limit: 5,
    sortField: "views" as const,
    sortOrder: "desc" as const,
  }));

  // --- Data Fetching ---
  const { data: articlesData, isPending: loadingArticles } = useArticleListQuery(
    () => listParams.value,
  );
  const { data: featuredData, isPending: loadingFeatured } = useArticleListQuery(
    () => featuredParams.value,
  );
  const { data: popularData } = useArticleListQuery(() => popularParams.value);

  const mapArticle = (a: any) => ({
    id: a._id,
    slug: a.slug,
    title: a.title,
    excerpt: a.shortDescription || "",
    category:
      categoriesData.value?.data.find(
        (c: any) => c._id === a.article_category_id,
      )?.title || "Chưa phân loại",
    author: a.authorName || "Ẩn danh",
    authorInitial: a.authorName ? a.authorName.charAt(0).toUpperCase() : "A",
    date: formatDate(a.publishedAt),
    readTime: a.readTime || 0,
    cover: a.thumbnail || "",
    views: a.views || 0,
  });

  // --- Processed Data ---
  const isLoading = computed(
    () => loadingArticles.value && loadingFeatured.value,
  );
  const loading = computed(() => loadingArticles.value);

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

  // --- Observer (Animation) ---
  // let observer: IntersectionObserver | null = null;

  // const bindCardObserver = async () => {
  //   await nextTick();

  //   const cards = document.querySelectorAll(".news-card");
  //   cards.forEach((card) => card.classList.remove("in-view"));

  //   observer?.disconnect();
  //   observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (!entry.isIntersecting) return;
  //         const index = Number((entry.target as HTMLElement).dataset.index || 0);
  //         (entry.target as HTMLElement).style.animationDelay = `${(index % pageSize) * 90}ms`;
  //         entry.target.classList.add("in-view");
  //       });
  //     },
  //     { threshold: 0.18 },
  //   );

  //   cards.forEach((card) => observer?.observe(card));
  // };

  // --- Watchers ---
  watch([keyword, activeCategory, sortBy], () => {
    currentPage.value = 1;
  });

  // watch([pagedArticles, loading], () => {
  //   if (loading.value) return;
  //   bindCardObserver();
  // });

  // // --- Lifecycle ---
  // onMounted(() => {
  //   if (!loading.value) {
  //     bindCardObserver();
  //   }
  // });

  // onUnmounted(() => {
  //   observer?.disconnect();
  // });

  return {
    // Refs
    keyword,
    searchInput,
    sortBy,
    activeCategory,
    currentPage,
    pageSize,

    // Computeds
    categories,
    isLoading,
    loading,
    articlesData,
    filteredArticles,
    pagedArticles,
    featured,
    popularPosts,
    totalPages,

    // Utils
    formatCount,
    ROUTES,
  };
};
