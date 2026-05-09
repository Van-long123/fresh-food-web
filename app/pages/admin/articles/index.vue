<script setup lang="ts">
import { computed, ref } from "vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import { ROUTES } from "~/constants/routes";
import type { AdminArticleListItem } from "~/types/admin-article.type";

definePageMeta({
  layout: "admin",
});

const searchQuery = ref("");
const deleteTarget = ref<AdminArticleListItem | null>(null);
const deleteLoading = ref(false);
const showDeleteDialog = ref(false);

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

const openDeleteDialog = (article: AdminArticleListItem) => {
  deleteTarget.value = article;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;
  try {
    console.log("Deleting article:", deleteTarget.value.id);
    showDeleteDialog.value = false;
    deleteTarget.value = null;
  } catch (error) {
    console.error("Delete error:", error);
  } finally {
    deleteLoading.value = false;
  }
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
  deleteTarget.value = null;
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Articles"
      subtitle="Publish news and blog content."
      :primary-action="{
        label: 'Add article',
        icon: 'pi pi-plus',
        onClick: () => $router.push(ROUTES.ADMIN.ARTICLE_CREATE),
      }"
    />

    <SearchToolbar v-model="searchQuery" placeholder="Search articles..." />

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
            class="h-10 w-10 rounded-lg object-cover"
          />
          <div>
            <p class="font-medium text-slate-900 dark:text-white">
              {{ row.title }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              ID {{ row.id }}
            </p>
          </div>
        </div>
      </template>
      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="article" />
      </template>
      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.ARTICLE_EDIT(row.id)"
          @delete="openDeleteDialog(row)"
          show-delete
        />
      </template>
    </DataTable>

    <ConfirmDialog
      :visible="showDeleteDialog"
      title="Delete Article"
      :message="`Are you sure you want to delete '${deleteTarget?.title}'? This action cannot be undone.`"
      confirm-label="Delete"
      cancel-label="Cancel"
      :loading="deleteLoading"
      danger
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      @update:visible="(v) => !v && cancelDelete()"
    />
  </div>
</template>
