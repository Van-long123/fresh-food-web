<script setup lang="ts">
import { computed, ref } from "vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import { ROUTES } from "~/constants/routes";
import type { AdminArticleListItem } from "~/types/admin-article.type";

definePageMeta({
  layout: "admin",
});

const searchQuery = ref("");
const columns: DataTableColumn[] = [
  { key: "article", label: "Article" },
  { key: "category", label: "Category" },
  { key: "author", label: "Author" },
  { key: "status", label: "Status" },
  { key: "publishedAt", label: "Published" },
  { key: "actions", label: "Actions" },
];

const { listArticles } = useArticlesApi();
const { data, pending } = await useAsyncData("admin-articles", () =>
  listArticles(),
);

const articles = computed(
  () => (data.value?.data || []) as AdminArticleListItem[],
);
const filteredArticles = computed(() => {
  if (!searchQuery.value) return articles.value;
  const keyword = searchQuery.value.toLowerCase();
  return articles.value.filter((item) =>
    [item.title, item.category, item.author].some((field) =>
      field.toLowerCase().includes(keyword),
    ),
  );
});

const total = computed(() => filteredArticles.value.length);
</script>

<template>
  <div class="px-4 pt-6 space-y-4">
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Articles
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Publish news and blog content.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative w-full sm:max-w-xs">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="w-full pl-9 pr-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Search articles"
          />
        </div>
        <NuxtLink
          :to="ROUTES.ADMIN.ARTICLE_CREATE"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
        >
          Add article
        </NuxtLink>
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="filteredArticles"
      :total="total"
      :page="1"
      :per-page="10"
      :loading="pending"
    >
      <template #title>Article list</template>
      <template #subtitle>Latest published and draft articles.</template>
      <template #cell-article="{ row }">
        <div class="flex items-center gap-3">
          <img
            :src="row.thumbnail"
            alt="Article"
            class="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ row.title }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              ID {{ row.id }}
            </p>
          </div>
        </div>
      </template>
      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="article" />
      </template>
      <template #cell-actions="{ row }">
        <NuxtLink
          :to="ROUTES.ADMIN.ARTICLE_EDIT(row.id)"
          class="text-sm font-medium text-primary-600 hover:underline"
          >Edit</NuxtLink
        >
      </template>
    </DataTable>
  </div>
</template>
