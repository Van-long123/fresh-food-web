<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import { ROUTES } from "~/constants/routes";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Danh sách danh mục - Quản trị SmartFood",
});

const store = useAdminMockStore();
const router = useRouter();
const toast = useToast();

const searchQuery = ref("");
const statusFilter = ref<string>("all");
const typeFilter = ref<string>("all");
const selectedIds = ref<string[]>([]);
const isBulkDeleting = ref(false);

// Pagination
const page = ref(1);
const perPage = ref(10);

// Sorting
const sortState = ref<{ key: string; direction: "asc" | "desc" } | null>(null);

// Delete targets
const deleteTarget = ref<any | null>(null);
const showDeleteDialog = ref(false);
const deleteLoading = ref(false);

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

const getParentTitle = (parentId: string | null) => {
  if (!parentId) return "Không có";
  const parent = store.categories.find((c) => c.id === parentId);
  return parent ? parent.title : "Không có";
};

const handleSortChange = (
  sort: { key: string; direction: "asc" | "desc" } | null,
) => {
  sortState.value = sort;
};

// Filtered and sorted categories
const processedCategories = computed(() => {
  let list = [...store.categories];

  // Search filter
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(keyword) ||
        c.slug.toLowerCase().includes(keyword) ||
        c.description.toLowerCase().includes(keyword),
    );
  }

  // Status filter
  if (statusFilter.value !== "all") {
    list = list.filter((c) => c.status === statusFilter.value);
  }

  // Type filter
  if (typeFilter.value !== "all") {
    list = list.filter((c) => c.type === typeFilter.value);
  }

  // Sorting
  if (sortState.value) {
    const { key, direction } = sortState.value;
    list.sort((a: any, b: any) => {
      const valA = a[key];
      const valB = b[key];

      if (typeof valA === "string") {
        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return direction === "asc" ? valA - valB : valB - valA;
      }
    });
  }

  return list;
});

const paginatedCategories = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return processedCategories.value.slice(start, start + perPage.value);
});

const total = computed(() => processedCategories.value.length);

const handleSelectionChange = (ids: Array<string | number>) => {
  selectedIds.value = ids.map((id) => String(id));
};

// Bulk operations
const handleBulkDelete = () => {
  isBulkDeleting.value = true;
  showDeleteDialog.value = true;
};

const handleBulkStatusChange = (status: "active" | "inactive") => {
  store.bulkUpdateCategoryStatus(selectedIds.value, status);
  selectedIds.value = [];
  toast.add({
    severity: "success",
    summary: "Đã cập nhật trạng thái",
    detail: "Đã cập nhật trạng thái cho các danh mục đã chọn",
    life: 3000,
  });
};

const openDeleteDialog = (category: any) => {
  deleteTarget.value = category;
  isBulkDeleting.value = false;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  deleteLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (isBulkDeleting.value) {
    store.bulkDeleteCategories(selectedIds.value);
    toast.add({
      severity: "success",
      summary: "Đã xóa danh mục",
      detail: `Đã xóa ${selectedIds.value.length} danh mục`,
      life: 3000,
    });
    selectedIds.value = [];
  } else if (deleteTarget.value) {
    store.deleteCategory(deleteTarget.value.id);
    toast.add({
      severity: "success",
      summary: "Đã xóa danh mục",
      detail: `Đã xóa danh mục ${deleteTarget.value.title}`,
      life: 3000,
    });
    deleteTarget.value = null;
  }

  showDeleteDialog.value = false;
  deleteLoading.value = false;
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
  deleteTarget.value = null;
  isBulkDeleting.value = false;
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

    <!-- Filter & Bulk Actions Bar -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex flex-wrap items-center gap-4">
        <SearchToolbar v-model="searchQuery" placeholder="Tìm danh mục..." />

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-500 uppercase"
            >Loại:</span
          >
          <select
            v-model="typeFilter"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Tất cả loại</option>
            <option value="product">Sản phẩm</option>
            <option value="article">Bài viết</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-500 uppercase"
            >Trạng thái:</span
          >
          <select
            v-model="statusFilter"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div
        v-if="selectedIds.length"
        class="flex items-center gap-2 bg-primary-50 dark:bg-primary-950/20 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-900/50"
      >
        <span class="text-sm font-medium text-primary-700 dark:text-primary-300"
          >{{ selectedIds.length }} đã chọn</span
        >
        <button
          @click="handleBulkStatusChange('active')"
          class="rounded bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Kích hoạt
        </button>
        <button
          @click="handleBulkStatusChange('inactive')"
          class="rounded bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Ngừng kích hoạt
        </button>
        <button
          @click="handleBulkDelete"
          class="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700"
        >
          Xóa mục đã chọn
        </button>
      </div>
    </div>

    <AppDataTable
      :columns="columns"
      :data="paginatedCategories"
      :total="total"
      v-model:page="page"
      v-model:perPage="perPage"
      :selectable="true"
      :sortable="true"
      @update:sort="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <template #title>Danh sách danh mục</template>
      <template #subtitle
        >Quản lý danh mục lồng nhau, ưu tiên hiển thị và nhãn.</template
      >

      <template #cell-thumbnail="{ row }">
        <img
          :src="
            row.thumbnail ||
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&auto=format&fit=crop'
          "
          alt="Thumbnail"
          class="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
        />
      </template>

      <template #cell-title="{ row }">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-semibold text-slate-900 dark:text-white">{{
              row.title
            }}</span>
            <span
              v-if="row.featured"
              class="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded dark:bg-amber-900/30 dark:text-amber-300"
            >
              Nổi bật
            </span>
          </div>
          <span class="text-xs text-slate-400 dark:text-slate-500 font-mono"
            >/{{ row.slug }}</span
          >
        </div>
      </template>

      <template #cell-type="{ value }">
        <span
          class="px-2 py-0.5 rounded text-xs font-semibold"
          :class="
            value === 'product'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
              : 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400'
          "
        >
          {{ value === "product" ? "Sản phẩm" : "Bài viết" }}
        </span>
      </template>

      <template #cell-parent="{ row }">
        <span class="text-sm text-slate-600 dark:text-slate-400">
          {{ getParentTitle(row.parent_id) }}
        </span>
      </template>

      <template #cell-position="{ value }">
        <span
          class="text-sm font-semibold font-mono text-slate-700 dark:text-slate-300"
        >
          {{ value }}
        </span>
      </template>

      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="product" />
      </template>

      <template #cell-badgeText="{ value }">
        <span
          v-if="value"
          class="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium dark:bg-slate-800 dark:text-slate-300 border border-slate-200/55 dark:border-slate-700"
        >
          {{ value }}
        </span>
        <span v-else class="text-xs text-slate-400 italic">Không có</span>
      </template>

      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.CATEGORY_EDIT(row.id)"
          @delete="openDeleteDialog(row)"
          show-delete
        />
      </template>
    </AppDataTable>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :visible="showDeleteDialog"
      :title="isBulkDeleting ? 'Xóa các danh mục đã chọn' : 'Xóa danh mục'"
      :message="
        isBulkDeleting
          ? `Bạn có chắc chắn muốn xóa ${selectedIds.length} danh mục đã chọn? Hành động này không thể hoàn tác.`
          : `Bạn có chắc chắn muốn xóa danh mục '${deleteTarget?.title}'? Hành động này không thể hoàn tác.`
      "
      confirm-label="Xóa"
      cancel-label="Hủy"
      :loading="deleteLoading"
      danger
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      @update:visible="(v) => !v && cancelDelete()"
    />
  </div>
</template>
