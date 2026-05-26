<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Dropdown from "primevue/dropdown";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import { ROUTES } from "~/constants/routes";
import { useAdminCategoriesQuery } from "~/queries/category/useAdminCategoriesQuery";
import { useDeleteAdminCategory } from "~/mutations/category/useDeleteAdminCategory";
import { useBulkDeleteAdminCategory } from "~/mutations/category/useBulkDeleteAdminCategory";
import { useBulkUpdateAdminCategoryStatus } from "~/mutations/category/useBulkUpdateAdminCategoryStatus";
import type {
  AdminCategory,
  AdminCategoryQueryParams,
} from "~/types/category.type";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Danh sách danh mục - Quản trị SmartFood",
});

const router = useRouter();
const toast = useToast();

const searchQuery = ref("");
const statusFilter = ref<string>("all");
const typeFilter = ref<string>("all");
const page = ref(1);
const perPage = ref(10);
const sortState = ref<{ key: string; direction: "asc" | "desc" } | null>({
  key: "position",
  direction: "asc",
});
const selectedIds = ref<string[]>([]);
const deleteTarget = ref<AdminCategory | null>(null);
const deleteMode = ref<"single" | "bulk">("single");
const showDeleteDialog = ref(false);

const statusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Hoạt động", value: "active" },
  { label: "Ngừng hoạt động", value: "inactive" },
];

const typeOptions = [
  { label: "Tất cả loại", value: "all" },
  { label: "Sản phẩm", value: "product" },
  { label: "Bài viết", value: "article" },
];

const queryParams = computed<AdminCategoryQueryParams>(() => ({
  page: page.value,
  limit: perPage.value,
  searchQuery: searchQuery.value || undefined,
  statusFilter: statusFilter.value,
  typeFilter: typeFilter.value,
  sortField: sortState.value?.key || "position",
  sortOrder: sortState.value?.direction || "asc",
}));

const { data, isLoading, isFetching } = useAdminCategoriesQuery(queryParams);
const { mutate: deleteCategory, isPending: isDeleting } =
  useDeleteAdminCategory();
const { mutate: bulkDeleteCategories, isPending: isBulkDeleting } =
  useBulkDeleteAdminCategory();
const { mutate: bulkUpdateStatus, isPending: isBulkUpdatingStatus } =
  useBulkUpdateAdminCategoryStatus();

const categories = computed(() => data.value?.data ?? []);
const total = computed(() => data.value?.pagination?.total ?? 0);

const columns = [
  { key: "thumbnail", label: "Ảnh" },
  { key: "title", label: "Tên danh mục", sortable: true },
  { key: "type", label: "Loại", sortable: true },
  { key: "parent", label: "Danh mục cha" },
  { key: "position", label: "Vị trí", sortable: true },
  { key: "status", label: "Trạng thái", sortable: true },
  { key: "badgeText", label: "Nhãn" },
  { key: "actions", label: "Thao tác" },
];

watch([searchQuery, statusFilter, typeFilter, perPage], () => {
  page.value = 1;
  selectedIds.value = [];
});

const handleSortChange = (
  sort: { key: string; direction: "asc" | "desc" } | null,
) => {
  if (
    sortState.value?.key === sort?.key &&
    sortState.value?.direction === sort?.direction
  ) {
    return;
  }
  sortState.value = sort || { key: "position", direction: "asc" };
  page.value = 1;
};

const handleSelectionChange = (ids: Array<string | number>) => {
  selectedIds.value = ids.map(String);
};

const openDeleteDialog = (category: AdminCategory) => {
  deleteTarget.value = category;
  deleteMode.value = "single";
  showDeleteDialog.value = true;
};

const handleBulkDelete = () => {
  if (!selectedIds.value.length) return;
  deleteTarget.value = null;
  deleteMode.value = "bulk";
  showDeleteDialog.value = true;
};

const handleBulkStatusChange = (status: "active" | "inactive") => {
  if (!selectedIds.value.length) return;

  bulkUpdateStatus(
    { category_ids: [...selectedIds.value], status },
    {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Đã cập nhật trạng thái",
          detail: `Đã cập nhật ${selectedIds.value.length} danh mục`,
          life: 3000,
        });
        selectedIds.value = [];
      },
    },
  );
};

const confirmDelete = () => {
  if (deleteMode.value === "bulk") {
    const idsToDelete = [...selectedIds.value];
    bulkDeleteCategories(
      { category_ids: idsToDelete },
      {
        onSuccess: () => {
          toast.add({
            severity: "success",
            summary: "Đã xóa danh mục",
            detail: `Đã xóa ${idsToDelete.length} danh mục`,
            life: 3000,
          });
          selectedIds.value = [];
          showDeleteDialog.value = false;
        },
      },
    );
    return;
  }

  if (!deleteTarget.value) return;

  deleteCategory(deleteTarget.value._id, {
    onSuccess: () => {
      toast.add({
        severity: "success",
        summary: "Đã xóa danh mục",
        detail: `Đã xóa danh mục ${deleteTarget.value?.title}`,
        life: 3000,
      });
      deleteTarget.value = null;
      showDeleteDialog.value = false;
    },
  });
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
  deleteTarget.value = null;
  deleteMode.value = "single";
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Danh mục"
      subtitle="Tổ chức hệ thống danh mục cho sản phẩm và bài viết tin tức."
      :primary-action="{
        label: 'Thêm danh mục',
        icon: 'pi pi-plus',
        onClick: () => router.push(ROUTES.ADMIN.CATEGORY_CREATE),
      }"
    />

    <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex flex-wrap items-center gap-4">
        <SearchToolbar v-model="searchQuery" placeholder="Tìm danh mục..." />

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase text-slate-500"
            >Loại:</span
          >
          <Dropdown
            v-model="typeFilter"
            :options="typeOptions"
            option-label="label"
            option-value="value"
            class="w-48"
          />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase text-slate-500"
            >Trạng thái:</span
          >
          <Dropdown
            v-model="statusFilter"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            class="w-48"
          />
        </div>
      </div>

      <div
        v-if="selectedIds.length"
        class="flex items-center gap-2 rounded-lg border border-primary-100 bg-primary-50 px-3 py-1.5 dark:border-primary-900/50 dark:bg-primary-950/20"
      >
        <span class="text-sm font-medium text-primary-700 dark:text-primary-300"
          >{{ selectedIds.length }} đã chọn</span
        >
        <button
          type="button"
          class="rounded bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
          :disabled="isBulkUpdatingStatus"
          @click="handleBulkStatusChange('active')"
        >
          Kích hoạt
        </button>
        <button
          type="button"
          class="rounded bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
          :disabled="isBulkUpdatingStatus"
          @click="handleBulkStatusChange('inactive')"
        >
          Ngừng kích hoạt
        </button>
        <button
          type="button"
          class="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          :disabled="isBulkDeleting"
          @click="handleBulkDelete"
        >
          Xóa mục đã chọn
        </button>
      </div>
    </div>

    <AppDataTable
      :columns="columns"
      :data="categories"
      :loading="isLoading || isFetching"
      :total="total"
      v-model:page="page"
      v-model:perPage="perPage"
      selectable
      :selection="selectedIds"
      sortable
      :sort="sortState"
      @update:sort="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <template #cell-thumbnail="{ row }">
        <img
          :src="row.thumbnail"
          alt="thumbnail"
          class="h-12 w-12 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
        />
      </template>

      <template #cell-title="{ row }">
        <div class="space-y-1">
          <div class="font-medium text-slate-900 dark:text-white">
            {{ row.title }}
          </div>
          <div class="text-xs text-slate-500 dark:text-slate-400">
            {{ row.slug }}
          </div>
        </div>
      </template>

      <template #cell-type="{ value }">
        <span class="text-sm capitalize text-slate-700 dark:text-slate-200">{{
          value
        }}</span>
      </template>

      <template #cell-parent="{ row }">
        <span class="text-sm text-slate-700 dark:text-slate-200">
          {{ row.parent?.title || "Không có" }}
        </span>
      </template>

      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="category" />
      </template>

      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.CATEGORY_EDIT(row._id)"
          @delete="openDeleteDialog(row)"
          :disabled="isDeleting"
        />
      </template>

      <template #empty> Không có danh mục nào phù hợp. </template>
    </AppDataTable>

    <ConfirmDialog
      v-model:visible="showDeleteDialog"
      danger
      :title="deleteMode === 'bulk' ? 'Xóa danh mục đã chọn' : 'Xóa danh mục'"
      :message="
        deleteMode === 'bulk'
          ? `Bạn có chắc muốn xóa ${selectedIds.length} danh mục đã chọn không?`
          : `Bạn có chắc muốn xóa danh mục ${deleteTarget?.title || ''} không?`
      "
      :confirm-label="deleteMode === 'bulk' ? 'Xóa' : 'Xóa'"
      :loading="isDeleting || isBulkDeleting"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>
