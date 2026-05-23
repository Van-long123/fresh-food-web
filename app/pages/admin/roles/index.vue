<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import { ROUTES } from "~/constants/routes";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Danh sách vai trò - Quản trị SmartFood",
});

const store = useAdminMockStore();
const router = useRouter();
const toast = useToast();

const searchQuery = ref("");
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
  { key: "title", label: "Tên vai trò", sortable: true },
  { key: "description", label: "Mô tả" },
  { key: "usersCount", label: "Người dùng đang hoạt động" },
  { key: "permissionsCount", label: "Số quyền" },
  { key: "actions", label: "Thao tác" },
];

const getUsersCount = (roleId: string) => {
  return store.users.filter((u) => u.roleId === roleId).length;
};

const handleSortChange = (
  sort: { key: string; direction: "asc" | "desc" } | null,
) => {
  sortState.value = sort;
};

// Filtered and sorted roles
const processedRoles = computed(() => {
  let list = [...store.roles];

  // Search filter
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase();
    list = list.filter(
      (r) =>
        r.title.toLowerCase().includes(keyword) ||
        r.description.toLowerCase().includes(keyword),
    );
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

const paginatedRoles = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return processedRoles.value.slice(start, start + perPage.value);
});

const total = computed(() => processedRoles.value.length);

const handleSelectionChange = (ids: Array<string | number>) => {
  selectedIds.value = ids.map((id) => String(id));
};

// Bulk operations
const handleBulkDelete = () => {
  isBulkDeleting.value = true;
  showDeleteDialog.value = true;
};

const openDeleteDialog = (role: any) => {
  deleteTarget.value = role;
  isBulkDeleting.value = false;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  deleteLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (isBulkDeleting.value) {
    store.bulkDeleteRoles(selectedIds.value);
    toast.add({
      severity: "success",
      summary: "Đã xóa vai trò",
      detail: `Đã xóa ${selectedIds.value.length} vai trò`,
      life: 3000,
    });
    selectedIds.value = [];
  } else if (deleteTarget.value) {
    store.deleteRole(deleteTarget.value.id);
    toast.add({
      severity: "success",
      summary: "Đã xóa vai trò",
      detail: `Đã xóa vai trò ${deleteTarget.value.title}`,
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
      title="Vai trò & chính sách bảo mật"
      subtitle="Thiết lập cấp quyền và giới hạn thao tác người dùng trong bảng quản trị SmartFood."
      :primary-action="{
        label: 'Tạo vai trò',
        icon: 'pi pi-plus',
        onClick: () => router.push(ROUTES.ADMIN.ROLE_CREATE),
      }"
    />

    <!-- Filter & Bulk Actions Bar -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex flex-wrap items-center gap-4">
        <SearchToolbar
          v-model="searchQuery"
          placeholder="Tìm theo tên vai trò..."
        />
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
          @click="handleBulkDelete"
          class="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700"
        >
          Xóa mục đã chọn
        </button>
      </div>
    </div>

    <AppDataTable
      :columns="columns"
      :data="paginatedRoles"
      :total="total"
      v-model:page="page"
      v-model:perPage="perPage"
      :selectable="true"
      :sortable="true"
      @update:sort="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <template #title>Ma trận phân quyền RBAC</template>
      <template #subtitle>Chi tiết kiểm soát truy cập theo vai trò.</template>

      <template #cell-title="{ row }">
        <span class="text-sm font-bold text-slate-900 dark:text-white">{{
          row.title
        }}</span>
      </template>

      <template #cell-description="{ value }">
        <span
          class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-sm"
          >{{ value }}</span
        >
      </template>

      <template #cell-usersCount="{ row }">
        <span
          class="text-sm font-bold font-mono text-slate-800 dark:text-slate-200"
        >
          {{ getUsersCount(row.id) }} người dùng
        </span>
      </template>

      <template #cell-permissionsCount="{ row }">
        <span
          class="text-xs font-bold font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded dark:bg-blue-950/20 dark:text-blue-400"
        >
          {{ (row.permissions || []).length }} quyền
        </span>
      </template>

      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.ROLE_EDIT(row.id)"
          @delete="openDeleteDialog(row)"
          :show-delete="row.id !== 'role-1' && row.id !== 'role-2'"
        />
      </template>
    </AppDataTable>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :visible="showDeleteDialog"
      :title="isBulkDeleting ? 'Xóa các vai trò đã chọn' : 'Xóa vai trò'"
      :message="
        isBulkDeleting
          ? `Bạn có chắc muốn xóa ${selectedIds.length} vai trò đã chọn? Thao tác này không thể hoàn tác.`
          : `Bạn có chắc muốn xóa vai trò '${deleteTarget?.title}'? Thao tác này không thể hoàn tác.`
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
