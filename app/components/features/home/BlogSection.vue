<template>
  <section
    class="bg-white rounded border border-gray-100 mb-10 overflow-hidden shadow-sm"
  >
    <!-- ── Header ── -->
    <div
      class="flex items-center justify-between px-5 py-4 border-b border-gray-100"
    >
      <h2 class="text-[19px] font-bold text-[#222] tracking-tight">
        Bạn Không Nên Bỏ Lỡ
      </h2>
      <NuxtLink
        :to="ROUTES.NEWS"
        class="flex items-center gap-1 text-[13px] font-semibold text-[#4caf50] hover:underline"
      >
        Xem tất cả
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </NuxtLink>
    </div>

    <div v-if="isLoading" class="px-5 py-8 text-center text-sm text-gray-500">
      Đang tải bài viết...
    </div>

    <div v-else-if="isError" class="px-5 py-8 text-center text-sm text-red-500">
      {{ errorMessage }}
    </div>

    <div
      v-else-if="isEmpty"
      class="px-5 py-8 text-center text-sm text-gray-500"
    >
      Chưa có bài viết nổi bật.
    </div>

    <!-- ── Body: 2 cột ── -->
    <div v-else class="flex flex-col lg:flex-row gap-0">
      <!-- LEFT: Ảnh lớn + info -->
      <article
        class="w-full lg:w-[48%] p-4 lg:p-5 flex flex-col group cursor-pointer border-b lg:border-b-0 lg:border-r border-gray-100"
      >
        <!-- Ảnh -->
        <div class="w-full overflow-hidden rounded mb-3">
          <img
            :src="primaryPost.image"
            :alt="primaryPost.title"
            class="w-full aspect-4/3 object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <!-- Title -->
        <NuxtLink :to="ROUTES.NEWS_DETAIL(primaryPost.slug)">
          <h3
            class="text-[17px] font-semibold text-[#222] leading-snug mb-1.5 line-clamp-2 group-hover:text-[#4caf50] transition-colors"
          >
            {{ primaryPost.title }}
          </h3>
        </NuxtLink>
        <!-- Date -->
        <p class="text-[11px] text-gray-400 font-medium mb-2">
          {{ primaryPost.publishedLabel }}
        </p>
        <!-- Description -->
        <p class="text-[13px] text-gray-600 leading-relaxed line-clamp-3">
          {{ primaryPost.description }}
          <span
            class="text-[#4caf50] font-medium ml-0.5 cursor-pointer hover:underline"
            >Đọc tiếp</span
          >
        </p>
      </article>

      <!-- RIGHT: Danh sách bài nhỏ có scroll -->
      <div
        class="w-full lg:w-[52%] overflow-y-auto max-h-130 lg:max-h-140 scrollbar-green"
      >
        <article
          v-for="(post, index) in secondaryPosts"
          :key="post.id"
          class="flex gap-3 px-4 py-3.5 group cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{
            'border-b border-gray-100': index !== secondaryPosts.length - 1,
          }"
        >
          <!-- Thumbnail -->
          <div
            class="w-25 sm:w-30 h-17.5 sm:h-20.5 shrink-0 overflow-hidden rounded bg-gray-100"
          >
            <img
              :src="post.image"
              :alt="post.title"
              class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
              loading="lazy"
            />
          </div>

          <!-- Text -->
          <div class="flex flex-col flex-1 min-w-0 py-0.5">
            <NuxtLink :to="ROUTES.NEWS_DETAIL(post.slug)">
              <h4
                class="text-[14px] sm:text-[15px] font-semibold text-[#222] leading-snug mb-1 line-clamp-2 group-hover:text-[#4caf50] transition-colors"
              >
                {{ post.title }}
              </h4>
            </NuxtLink>
            <p class="text-[11px] text-gray-400 font-medium mb-1.5">
              {{ post.publishedLabel }}
            </p>
            <p
              class="text-[12.5px] text-gray-500 leading-relaxed line-clamp-2 hidden sm:block"
            >
              {{ post.description }}
              <span class="text-[#4caf50] font-medium ml-0.5 hover:underline"
                >Đọc tiếp</span
              >
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ROUTES } from "~/constants/routes";
import type { HomeBlogPost } from "~/types/home.type";

const props = withDefaults(
  defineProps<{
    primaryPost: HomeBlogPost | null;
    secondaryPosts: HomeBlogPost[];
    isLoading?: boolean;
    isError?: boolean;
    isEmpty?: boolean;
    errorMessage?: string;
  }>(),
  {
    isLoading: false,
    isError: false,
    isEmpty: false,
    errorMessage: "Khong the tai danh sach bai viet.",
  },
);

const primaryPost = computed<HomeBlogPost>(() => {
  if (props.primaryPost) return props.primaryPost;

  return {
    id: "blog-fallback",
    slug: "news",
    title: "Tin tuc dang cap nhat",
    description: "Noi dung dang duoc cap nhat.",
    image:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1200",
    publishedAt: new Date().toISOString(),
    publishedLabel: "--/--/----",
  };
});

const secondaryPosts = computed(() => props.secondaryPosts);
const isLoading = computed(() => props.isLoading);
const isError = computed(() => props.isError);
const isEmpty = computed(() => props.isEmpty);
const errorMessage = computed(() => props.errorMessage);
</script>

<style scoped>
/* Scrollbar xanh mỏng giống ảnh */
.scrollbar-green {
  scrollbar-width: thin;
  scrollbar-color: #4caf50 transparent;
}
.scrollbar-green::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-green::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-green::-webkit-scrollbar-thumb {
  background-color: #4caf50;
  border-radius: 4px;
}
</style>
