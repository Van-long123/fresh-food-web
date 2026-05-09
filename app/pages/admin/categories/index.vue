<script setup lang="ts">
import { computed, ref } from "vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import { ROUTES } from "~/constants/routes";
import type { AdminCategoryListItem } from "~/types/admin-category.type";

definePageMeta({
  layout: "admin",
});

const searchQuery = ref("");
const deleteTarget = ref<AdminCategoryListItem | null>(null);
const deleteLoading = ref(false);
const showDeleteDialog = ref(false);

const columns: DataTableColumn[] = [
  { key: "category", label: "Category" },
  { key: "parent", label: "Parent" },
  { key: "productCount", label: "Products" },
  { key: "status", label: "Status" },
  { key: "position", label: "Position" },
  { key: "actions", label: "Actions" },
];

const { listCategories } = useCategoriesApi();
const { data, pending } = await useAsyncData("admin-categories", () =>
  listCategories(),
);

const categories = computed(
  () => (data.value?.data || []) as AdminCategoryListItem[],
);

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;
  const keyword = searchQuery.value.toLowerCase();
  return categories.value.filter((item) =>
    [item.title, item.slug, item.parent || ""].some((field) =>
      field.toLowerCase().includes(keyword),
    ),
  );
});

const total = computed(() => filteredCategories.value.length);

const openDeleteDialog = (category: AdminCategoryListItem) => {
  deleteTarget.value = category;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;
  try {
    // TODO: Call deleteCategory API when available
    console.log("Deleting category:", deleteTarget.value.id);
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
      title="Categories"
      subtitle="Organize products with parent-child categories."
      :primary-action="{
        label: 'Add category',
        icon: 'pi pi-plus',
        onClick: () => $router.push(ROUTES.ADMIN.CATEGORY_CREATE),
      }"
    />

    <SearchToolbar v-model="searchQuery" placeholder="Search categories..." />

    <DataTable
      :columns="columns"
      :data="filteredCategories"
      :total="total"
      :page="1"
      :per-page="10"
      :loading="pending"
    >
      <template #title>Category list</template>
      <template #subtitle>Manage taxonomy and visibility rules.</template>
      <template #cell-category="{ row }">
        <div class="flex items-center gap-3">
          <img
            :src="row.thumbnail"
            alt="Category"
            class="h-10 w-10 rounded-lg object-cover"
          />
          <div>
            <p class="font-medium text-slate-900 dark:text-white">
              {{ row.title }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              /{{ row.slug }}
            </p>
          </div>
        </div>
      </template>
      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="product" />
      </template>
      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.CATEGORY_EDIT(row.id)"
          @delete="openDeleteDialog(row)"
          show-delete
        />
      </template>
    </DataTable>

    <ConfirmDialog
      :visible="showDeleteDialog"
      title="Delete Category"
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
