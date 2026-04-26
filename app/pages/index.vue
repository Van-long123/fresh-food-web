<template>
  <SkHomePage v-if="isLoading" />

  <div
    v-else
    class="min-h-screen flex flex-col font-sans bg-gray-50/30 selection:bg-[#f47f20] selection:text-white"
  >
    <div class="max-w-360 mx-auto w-full flex items-start flex-1 gap-4">
      <Sidebar :categories="sidebarCategories" />

      <main class="flex-1 min-w-0 px-4 sm:px-6 lg:px-0 py-6 pb-16">
        <HeroBanner />

        <section
          v-if="isError"
          class="rounded-xl border border-red-100 bg-red-50 p-5 mb-8"
        >
          <p class="text-sm text-red-600 mb-3">{{ errorMessage }}</p>
          <button
            class="h-9 px-4 rounded bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors"
            @click="retry"
          >
            Thu lai
          </button>
        </section>

        <template v-else>
          <div
            v-if="campaignBadges.length"
            class="flex items-center gap-4 sm:gap-6 mb-8 overflow-x-auto pb-2 custom-scrollbar hide-scrollbar-mobile px-1 pt-1"
          >
            <div
              v-for="badge in campaignBadges"
              :key="badge.id"
              class="flex flex-col items-center gap-2 cursor-pointer group shrink-0 transition-transform duration-300 hover:-translate-y-1"
              @click="setActiveCampaign(badge.id)"
            >
              <div
                class="w-21 h-21 rounded-full flex items-center justify-center transition-all duration-300"
                :class="
                  activeCampaignId === badge.id
                    ? 'p-0.75 border-[1.5px] border-[#fbafaf] bg-[#fdebea]'
                    : 'p-0 border-transparent bg-transparent opacity-90 hover:opacity-100'
                "
              >
                <div
                  class="w-full h-full rounded-full flex items-center justify-center text-center font-black leading-tight shadow-md border-2 border-white/80 whitespace-pre-line"
                  :class="[
                    badge.color,
                    badge.textColor,
                    activeCampaignId === badge.id
                      ? 'text-[13px]'
                      : 'text-[11px]',
                  ]"
                >
                  {{ badge.name }}
                </div>
              </div>
            </div>
          </div>

          <div
            class="p-4 sm:p-5 mb-10 relative group/slider border-b border-gray-200 pb-8"
          >
            <button
              class="absolute -left-4 top-[45%] lg:top-[50%] -translate-y-1/2 w-9 h-9 rounded-full bg-[#414141] text-white flex items-center justify-center hover:bg-[#6c6c6c] shadow-lg z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity"
              @click="scrollCampaign('left')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              class="absolute -right-4 top-[45%] lg:top-[50%] -translate-y-1/2 w-9 h-9 rounded-full bg-[#414141] text-white flex items-center justify-center hover:bg-[#6c6c6c] shadow-lg z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity"
              @click="scrollCampaign('right')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div ref="campaignScrollRef" class="carousel-grid-2">
              <ProductCard
                v-for="product in campaignDisplayProducts"
                :key="product.uniqueId"
                :product="product"
                class="w-full"
              />
            </div>

            <div
              v-if="!campaignDisplayProducts.length"
              class="text-center text-sm text-gray-500 py-6"
            >
              Chua co san pham cho campaign nay.
            </div>

            <div class="flex justify-center mt-6">
              <NuxtLink
                :to="ROUTES.CATEGORY(selectedCampaignLink)"
                class="text-[#006ee6] text-[13px] font-bold hover:underline flex items-center gap-1 group/link"
              >
                Xem tat ca
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 group-hover/link:translate-x-1 transition-transform"
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
          </div>

          <section
            v-for="section in categorySectionsDisplay"
            :key="section.id"
            class="mb-10"
          >
            <div
              class="rounded-xl overflow-hidden mb-5 bg-gray-50 h-25 relative shadow-sm"
            >
              <img
                :src="section.bannerImage"
                :alt="section.title"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 px-8 flex flex-col justify-center"
                :class="section.overlayClass"
              >
                <div class="flex items-center gap-4">
                  <h2
                    class="text-3xl font-black drop-shadow-md"
                    :class="section.titleClass"
                  >
                    {{ section.title }}
                  </h2>
                  <span
                    class="text-[11px] font-bold px-3 py-1 rounded shadow-lg uppercase tracking-wider hidden sm:inline-block"
                    :class="section.badgeClass"
                  >
                    {{ section.badgeText }}
                  </span>
                </div>
              </div>
            </div>

            <div class="relative group/slider mb-8">
              <button
                class="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#414141] text-white flex items-center justify-center hover:bg-[#6c6c6c] shadow-lg z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity"
                @click="scrollCategory(section.slug, 'left')"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                class="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#414141] text-white flex items-center justify-center hover:bg-[#6c6c6c] shadow-lg z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity"
                @click="scrollCategory(section.slug, 'right')"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <div
                :ref="(el) => setCategoryScrollRef(section.slug, el)"
                class="carousel-grid-2 py-1"
              >
                <ProductCard
                  v-for="item in section.sliderProducts"
                  :key="item.uniqueId"
                  :product="item"
                  class="w-full"
                />
              </div>
            </div>

            <div class="flex justify-center pb-6 border-b border-gray-200">
              <NuxtLink
                :to="ROUTES.CATEGORY(section.slug)"
                class="text-[#006ee6] text-[13px] font-bold hover:underline flex items-center gap-1 group/link"
              >
                Xem tat ca
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 group-hover/link:translate-x-1 transition-transform"
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
          </section>

          <section
            v-if="!categorySectionsDisplay.length"
            class="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 mb-10"
          >
            Chua co section danh muc tren trang chu.
          </section>

          <BlogSection
            :primary-post="blogPrimaryPost"
            :secondary-posts="blogSecondaryPosts"
            :is-empty="blogIsEmpty"
          />
        </template>
      </main>
    </div>

    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import Sidebar from "~/components/layout/Sidebar.vue";
import ProductCard from "~/components/features/home/ProductCard.vue";
import HeroBanner from "~/components/features/home/HeroBanner.vue";
import BlogSection from "~/components/features/home/BlogSection.vue";
import BackToTop from "~/components/features/home/BackToTop.vue";
import SkHomePage from "~/components/skeletons/SkHomePage.vue";
import { ROUTES } from "~/constants/routes";
import { useHomePage } from "~/composables/home/useHomePage";

useHead({
  title: "SmartFood - Nguon Thuc Pham Sach",
  meta: [
    {
      name: "description",
      content: "He thong cua hang thuc pham sach, uy tin hang dau",
    },
  ],
});

const {
  sidebarCategories,
  activeCampaignId,
  campaignBadges,
  campaignDisplayProducts,
  selectedCampaignLink,
  categorySectionsDisplay,
  blogPrimaryPost,
  blogSecondaryPosts,
  blogIsEmpty,
  isLoading,
  isError,
  errorMessage,
  campaignScrollRef,
  setCategoryScrollRef,
  scrollCampaign,
  scrollCategory,
  setActiveCampaign,
  retry,
} = useHomePage();
</script>

<style scoped>
.carousel-grid-2,
.carousel-grid-1 {
  display: grid;
  grid-auto-flow: column;
  align-items: start;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  scroll-behavior: auto;
}

.carousel-grid-2::-webkit-scrollbar,
.carousel-grid-1::-webkit-scrollbar {
  display: none;
}

.carousel-grid-2 {
  grid-template-rows: repeat(2, min-content);
}

.carousel-grid-1 {
  grid-template-rows: repeat(1, min-content);
}

@media (min-width: 1280px) {
  .carousel-grid-2,
  .carousel-grid-1 {
    grid-auto-columns: calc((100% - 48px) / 5);
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .carousel-grid-2,
  .carousel-grid-1 {
    grid-auto-columns: calc((100% - 36px) / 4);
  }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .carousel-grid-2,
  .carousel-grid-1 {
    grid-auto-columns: calc((100% - 24px) / 3);
  }
}

@media (max-width: 639px) {
  .carousel-grid-2,
  .carousel-grid-1 {
    grid-auto-columns: calc((100% - 12px) / 2);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>
