<template>
  <div class="article-shell">
    <main
      v-if="loading"
      class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8"
    >
      <Skeleton height="24px" width="220px" border-radius="0.5rem" />
      <Skeleton class="mt-4" height="360px" border-radius="1.5rem" />
      <div
        class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <div class="space-y-4">
          <Skeleton height="34px" width="70%" />
          <Skeleton height="18px" width="100%" />
          <Skeleton height="18px" width="92%" />
          <Skeleton height="18px" width="95%" />
        </div>
        <div class="space-y-3">
          <Skeleton height="180px" border-radius="1rem" />
          <Skeleton height="180px" border-radius="1rem" />
        </div>
      </div>
    </main>

    <template v-else-if="hasArticle && article">
      <section class="hero-wrap px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div class="mx-auto w-full max-w-6xl">
          <nav
            aria-label="Breadcrumb"
            class="mb-4 flex items-center gap-2 text-sm text-slate-500"
          >
            <NuxtLink :to="ROUTES.HOME" class="hover:text-orange-600"
              >Trang chủ</NuxtLink
            >
            <i class="pi pi-angle-right text-xs" />
            <NuxtLink :to="ROUTES.NEWS" class="hover:text-orange-600"
              >Tin tức</NuxtLink
            >
            <i class="pi pi-angle-right text-xs" />
            <span class="line-clamp-1 text-slate-700">{{ article.title }}</span>
          </nav>

          <header class="hero-card">
            <img :src="article.cover" :alt="article.title" class="hero-image" />
            <div class="hero-overlay" />
            <button
              type="button"
              aria-label="Mở menu chia sẻ"
              class="share-toggle"
              @click="showShareMenu = !showShareMenu"
            >
              <i class="pi pi-share-alt" />
            </button>
            <div v-if="showShareMenu" class="share-popover">
              <!-- <button
                type="button"
                class="share-row"
                @click="shareArticle('facebook')"
              >
                <i class="pi pi-facebook text-blue-600" /> Facebook
              </button> -->
              <!-- <button
                type="button"
                class="share-row"
                @click="shareArticle('zalo')"
              >
                <i class="pi pi-comments text-green-600" /> Zalo
              </button> -->
              <button
                type="button"
                class="share-row"
                @click="shareArticle('copy')"
              >
                <i class="pi pi-link text-orange-600" /> Sao chép liên kết
              </button>
            </div>

            <div class="hero-content">
              <p class="hero-kicker">SmartFood Journal</p>
              <h1 class="hero-title">{{ article.title }}</h1>
              <div
                class="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/90"
              >
                <Avatar
                  :label="article.authorInitial"
                  shape="circle"
                  class="bg-orange-500! text-white!"
                />
                <span>{{ article.author }}</span>
                <span>•</span>
                <span>{{ article.date }}</span>
                <span>•</span>
                <span>{{ article.readTime }} phút đọc</span>
              </div>
            </div>
          </header>
        </div>
      </section>

      <main
        class="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 pb-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8"
      >
        <article
          class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <details
            class="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:hidden"
          >
            <summary class="cursor-pointer text-sm font-bold text-slate-900">
              Mục lục bài viết
            </summary>
            <div class="mt-3 space-y-1">
              <button
                v-for="item in sections"
                :key="item.id"
                type="button"
                class="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-orange-50"
                @click="scrollTo(item.id)"
              >
                {{ item.title }}
              </button>
            </div>
          </details>

          <p class="lead reveal">
            {{ article.intro }}
          </p>

          <div
            class="reveal article-content mt-8"
            v-html="article.contentHtml"
          />

          <section class="reveal mt-4">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in tags"
                :key="tag"
                type="button"
                class="tag-chip"
              >
                #{{ tag }}
              </button>
            </div>
          </section>

          <section class="reveal mt-10" aria-labelledby="comment-title">
            <h2 id="comment-title" class="text-2xl font-black text-slate-900">
              Bình luận ({{ comments.length }})
            </h2>

            <div class="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div class="flex gap-3">
                <Avatar
                  label="U"
                  shape="circle"
                  class="bg-orange-100! text-orange-700!"
                />
                <form class="w-full" @submit.prevent="submitComment">
                  <textarea
                    v-model="newComment"
                    :rows="commentFocused ? 4 : 2"
                    placeholder="Chia sẻ góc nhìn của bạn..."
                    class="comment-box"
                    @focus="commentFocused = true"
                    @blur="commentFocused = false"
                  />
                  <div class="mt-3 flex justify-end">
                    <Button
                      type="submit"
                      label="Gửi bình luận"
                      :loading="isCreatingComment"
                      :disabled="!newComment.trim() || isCreatingComment"
                      @mousedown.prevent
                    />
                  </div>
                </form>
              </div>
            </div>

            <div class="mt-4 space-y-3">
              <article
                v-for="comment in comments"
                :key="comment.id"
                class="comment-card"
              >
                <div class="flex gap-3">
                  <Avatar
                    :label="comment.initial"
                    shape="circle"
                    class="bg-green-100! text-green-700!"
                  />
                  <div>
                    <p class="text-sm font-bold text-slate-900">
                      {{ comment.name }}
                    </p>
                    <p class="text-xs text-slate-500">{{ comment.time }}</p>
                    <p class="mt-2 text-sm leading-7 text-slate-700">
                      {{ comment.content }}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </article>

        <aside class="sidebar" :class="{ elevated: sidebarElevated }">
          <section class="panel">
            <h3 class="text-base font-black text-slate-900">Mục lục</h3>
            <button
              v-for="item in sections"
              :key="item.id"
              type="button"
              class="toc-item"
              :class="{ active: activeSection === item.id }"
              @click="scrollTo(item.id)"
            >
              {{ item.title }}
            </button>
          </section>

          <section class="panel text-center">
            <Avatar
              :label="article.authorInitial"
              shape="circle"
              class="mx-auto h-16 w-16 bg-orange-500! text-white!"
            />
            <p class="mt-3 text-lg font-black text-slate-900">
              {{ article.author }}
            </p>
            <p class="text-sm text-green-700">Chuyên gia dinh dưỡng</p>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              Đồng hành cùng SmartFood trong các chủ đề ăn sạch, sống khỏe và
              tối ưu thực đơn.
            </p>
          </section>

          <section class="panel">
            <h3 class="text-base font-black text-slate-900">
              Bài viết phổ biến
            </h3>
            <NuxtLink
              v-for="item in popularArticles"
              :key="item.id"
              :to="ROUTES.NEWS_DETAIL(item.slug)"
              class="popular-row"
            >
              <span>{{ item.rank }}</span>
              <div>
                <p>{{ item.title }}</p>
                <small>{{ item.viewsLabel }} lượt xem</small>
              </div>
            </NuxtLink>
          </section>
        </aside>
      </main>

      <section class="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-black text-slate-900">Có thể bạn quan tâm</h2>
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="item in relatedArticles"
            :key="item.id"
            :to="ROUTES.NEWS_DETAIL(item.slug)"
            class="related-card"
          >
            <img
              :src="item.cover"
              :alt="item.title"
              class="h-40 w-full rounded-xl object-cover"
            />
            <h3 class="mt-1 line-clamp-2 text-lg font-black text-slate-900">
              {{ item.title }}
            </h3>
            <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
              {{ item.excerpt }}
            </p>
          </NuxtLink>
        </div>
      </section>
    </template>

    <section
      v-else
      class="mx-auto flex min-h-[55vh] w-full max-w-6xl items-center justify-center px-4 py-10 text-center"
    >
      <div>
        <h2 class="text-2xl font-black text-slate-900">
          Không tìm thấy bài viết
        </h2>
        <NuxtLink
          :to="ROUTES.NEWS"
          class="mt-3 inline-block text-sm font-semibold text-orange-600 hover:underline"
        >
          Quay lại trang tin tức
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useCreateArticleCommentMutation } from "~/mutations/article/useCreateArticleCommentMutation";
import { useAuthStore } from "~/stores/useAuthStore";
import { useNewsDetail } from "~/composables/news/useNewsDetail";

useHead({
  title: "Chi tiết tin tức - SmartFood",
  meta: [
    { name: "description", content: "Trang Chi tiết tin tức của SmartFood" },
  ],
});

type NewsComment = {
  id: string;
  avatar: string;
  initial: string;
  name: string;
  time: string;
  content: string;
};

const {
  loading,
  hasArticle,
  article,
  sections,
  tags,
  comments: articleComments,
  relatedArticles,
  popularArticles,
  ROUTES,
} = useNewsDetail();

const authStore = useAuthStore();
const toast = useToast();
const { mutateAsync: createArticleComment, isPending: isCreatingComment } =
  useCreateArticleCommentMutation();

const comments = ref<NewsComment[]>([]);
const showShareMenu = ref(false);
const commentFocused = ref(false);
const newComment = ref("");
const readingProgress = ref(0);
const sidebarElevated = ref(false);
const activeSection = ref("");

let sectionObserver: IntersectionObserver | null = null;
let revealObserver: IntersectionObserver | null = null;

watch(
  articleComments,
  (newComments) => {
    comments.value = [...newComments];
  },
  { immediate: true },
);

watch(
  sections,
  (newSections) => {
    activeSection.value = newSections[0]?.id || "";
  },
  { immediate: true },
);

const updateProgress = () => {
  const root = document.documentElement;
  const total = root.scrollHeight - root.clientHeight;
  readingProgress.value =
    total > 0 ? Math.min(100, (root.scrollTop / total) * 100) : 0;
  sidebarElevated.value = root.scrollTop > 280;
};

const scrollTo = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;

  // Trừ đi chiều cao của header (khoảng 80-85px) để dừng đúng vị trí tiêu đề
  const headerOffset = 85;
  const elementPosition = target.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

const shareArticle = async (channel: string) => {
  if (channel === "copy") {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // no-op
    }
  }

  showShareMenu.value = false;
};

const submitComment = async () => {
  const content = newComment.value.trim();
  if (!content || isCreatingComment.value) return;

  if (!authStore.isLoggedIn || !authStore.user) {
    await navigateTo(ROUTES.AUTH.LOGIN);
    return;
  }

  if (!article.value?.slug) return;

  try {
    await createArticleComment({
      slug: article.value.slug,
      payload: { content },
    });
    newComment.value = "";
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail:
        error?.response?.data?.message ||
        "Không thể gửi bình luận, vui lòng thử lại.",
      life: 3000,
    });
  }
};

const bindObservers = async () => {
  sectionObserver?.disconnect();
  revealObserver?.disconnect();

  if (!hasArticle.value) return;

  await nextTick();

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activeSection.value = entry.target.id;
      });
    },
    {
      threshold: 0.1,
      rootMargin: "-90px 0px -70% 0px",
    },
  );

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.15 },
  );

  sections.value.forEach((section) => {
    const node = document.getElementById(section.id);
    if (node) sectionObserver?.observe(node);
  });

  document
    .querySelectorAll(".reveal")
    .forEach((node) => revealObserver?.observe(node));
};

watch(sections, () => {
  bindObservers();
});

onMounted(() => {
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
  bindObservers();
});

onUnmounted(() => {
  sectionObserver?.disconnect();
  revealObserver?.disconnect();
  window.removeEventListener("scroll", updateProgress);
});
</script>

<style scoped>
.article-shell {
  background:
    radial-gradient(
      circle at 10% -10%,
      rgba(249, 115, 22, 0.09),
      transparent 35%
    ),
    radial-gradient(
      circle at 90% -15%,
      rgba(22, 163, 74, 0.08),
      transparent 30%
    ),
    #f8fafc;
  color: #0f172a;
  min-height: 100vh;
  padding-bottom: 88px;
}

.hero-wrap {
  background: linear-gradient(180deg, #fff7ed, transparent);
}

.hero-card {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  min-height: 380px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.14);
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(2, 6, 23, 0.18),
    rgba(2, 6, 23, 0.75)
  );
}

.hero-content {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  z-index: 10;
  padding: 2rem;
}

.hero-kicker {
  width: fit-content;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.32);
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0.38rem 0.7rem;
}

.hero-title {
  margin-top: 0.85rem;
  color: white;
  font-weight: 900;
  line-height: 1.15;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  max-width: 22ch;
}

.share-toggle {
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 11;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  color: white;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
}

.share-popover {
  position: absolute;
  right: 1rem;
  top: 4rem;
  z-index: 12;
  width: 13rem;
  border-radius: 0.9rem;
  border: 1px solid #e2e8f0;
  background: white;
  padding: 0.35rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.2);
}

.share-row {
  width: 100%;
  border: 0;
  background: transparent;
  border-radius: 0.65rem;
  text-align: left;
  padding: 0.58rem 0.65rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.share-row:hover {
  background: #fff7ed;
}

.lead {
  border-left: 4px solid #f97316;
  padding-left: 1rem;
  color: #334155;
  font-size: 1.09rem;
  line-height: 1.95;
}

.section-title {
  font-size: 1.45rem;
  line-height: 1.3;
  font-weight: 900;
  color: #0f172a;
}

:deep(.article-content h1) {
  scroll-margin-top: 7rem;
  margin-top: 2rem;
  color: #0f172a;
  font-size: 1.55rem;
  line-height: 1.3;
  font-weight: 900;
}

:deep(.article-content p) {
  margin-top: 1rem;
  color: #334155;
  font-size: 1.02rem;
  line-height: 1.95;
}

:deep(.article-content ul),
:deep(.article-content ol) {
  margin-top: 1rem;
  margin-left: 1.2rem;
  color: #334155;
  line-height: 1.85;
}

:deep(.article-content img) {
  margin-top: 1rem;
  width: 100%;
  border-radius: 1rem;
}

:deep(.article-content blockquote) {
  margin-top: 1rem;
  border-left: 4px solid #f97316;
  background: #fff7ed;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: #9a3412;
}

.step-row {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: 0.7rem;
  align-items: start;
}

.step-row span {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  font-size: 0.84rem;
  font-weight: 800;
  color: #c2410c;
  background: #ffedd5;
}

.step-row p {
  margin: 0;
  color: #475569;
  line-height: 1.8;
}

.tag-chip {
  border-radius: 9999px;
  border: 1px solid #fed7aa;
  background: #fff7ed;
  color: #c2410c;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.4rem 0.68rem;
}

.share-circle {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  border: 0;
  color: white;
  font-weight: 700;
}

.reaction {
  border-radius: 9999px;
  padding: 0.55rem 1rem;
  border: 1.5px solid;
  font-weight: 700;
  font-size: 0.86rem;
}

.reaction.orange {
  color: #ea580c;
  border-color: #fb923c;
  background: white;
}

.reaction.green {
  color: #15803d;
  border-color: #4ade80;
  background: white;
}

.reaction.orange.active {
  background: #f97316;
  color: white;
  border-color: #f97316;
}

.reaction.green.active {
  background: #16a34a;
  color: white;
  border-color: #16a34a;
}

.comment-box {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid #cbd5e1;
  min-height: 2.9rem;
  padding: 0.65rem 0.8rem;
  resize: vertical;
}

.comment-box:focus {
  outline: none;
  border-color: #f97316;
}

.comment-card {
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  padding: 0.9rem;
}

.sidebar {
  position: sticky;
  top: 5.8rem;
  align-self: start;
  display: grid;
  gap: 0.9rem;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform, box-shadow;
}

.sidebar.elevated {
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
}

.panel {
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  padding: 0.9rem;
}

.toc-item {
  width: 100%;
  border: 0;
  border-left: 2px solid transparent;
  border-radius: 0.6rem;
  text-align: left;
  padding: 0.52rem 0.58rem;
  margin-top: 0.3rem;
  color: #475569;
  background: transparent;
}

.toc-item.active {
  color: #9a3412;
  border-left-color: #f97316;
  background: #fff7ed;
  font-weight: 700;
}

.popular-row {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.popular-row span {
  font-size: 1.45rem;
  line-height: 1;
  font-weight: 900;
  color: rgba(249, 115, 22, 0.4);
}

.popular-row p {
  margin: 0;
  font-size: 0.86rem;
  font-weight: 700;
  color: #0f172a;
}

.popular-row small {
  color: #64748b;
  font-size: 0.73rem;
}

.related-card {
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  padding: 0.75rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.related-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 22px rgba(15, 23, 42, 0.12);
}

.reveal {
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.mobile-share {
  position: fixed;
  left: 50%;
  bottom: 0.8rem;
  transform: translateX(-50%);
  z-index: 40;
  display: flex;
  gap: 0.45rem;
  padding: 0.52rem 0.62rem;
  border-radius: 9999px;
  background: rgba(15, 23, 42, 0.86);
}

@media (max-width: 1024px) {
  .sidebar {
    position: static;
  }
}

@media (max-width: 640px) {
  .hero-card {
    min-height: 330px;
    border-radius: 1.1rem;
  }

  .hero-content {
    padding: 1.2rem;
  }
}
</style>
