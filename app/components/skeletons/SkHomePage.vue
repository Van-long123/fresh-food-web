<template>
  <div
    class="min-h-screen flex flex-col font-sans bg-gray-50/30"
  >
    <!-- Main Area with max width -->
    <div class="max-w-[1440px] mx-auto w-full flex items-start flex-1 gap-4">
      <!-- Left Sidebar -->
      <SkSidebar />

      <!-- Right Content -->
      <main class="flex-1 min-w-0 px-4 sm:px-6 lg:px-0 py-6 pb-16">
        <!-- Hero Banner -->
        <SkHeroBanner />

        <!-- Category Badges -->
        <SkCategoryBadges />

        <!-- Hot Products Section -->
        <SkProductGrid />

        <!-- Fruit Section (banner + products) -->
        <SkFruitSection />

        <!-- Blog Section -->
        <SkBlogSection />
      </main>
    </div>
  </div>
</template>

<script setup>
import SkSidebar from "./SkSidebar.vue";
import SkHeroBanner from "./SkHeroBanner.vue";
import SkCategoryBadges from "./SkCategoryBadges.vue";
import SkProductGrid from "./SkProductGrid.vue";
import SkFruitSection from "./SkFruitSection.vue";
import SkBlogSection from "./SkBlogSection.vue";
</script>
