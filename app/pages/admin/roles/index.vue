<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import { ROUTES } from "~/constants/routes";
import { useAdminRolesQuery } from "~/queries/role/useAdminRolesQuery";
import { useDeleteAdminRole } from "~/mutations/role/useDeleteAdminRole";
import { useDeleteAdminRoles } from "~/mutations/role/useDeleteAdminRoles";
import { useToast } from "primevue/usetoast";
import type { AdminRole, AdminRoleQueryParams } from "~/types/role.type";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Danh sách vai trò - Quản trị SmartFood",
});

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
const deleteTarget = ref<AdminRole | null>(null);
const showDeleteDialog = ref(false);

const columns = [
  { key: "title", label: "Tên vai trò", sortable: true },
  { key: "description", label: "Mô tả" },
  { key: "usersCount", label: "Người dùng đang hoạt động" },
  { key: "permissionsCount", label: "Số quyền" },
  { key: "actions", label: "Thao tác" },
];

const queryParams = computed<AdminRoleQueryParams>(() => {
  const params: AdminRoleQueryParams = {
    page: page.value,
    limit: perPage.value,
  };
  if (searchQuery.value) params.keyword = searchQuery.value;
  if (sortState.value) {
    params.sortField = sortState.value.key;
    params.sortOrder = sortState.value.direction;
  }
  return params;
});

const { data, isLoading, isFetching } = useAdminRolesQuery(queryParams);
const { mutate: deleteRole, isPending: isDeleting } = useDeleteAdminRole();
const { mutate: deleteRoles, isPending: isBulkDeletingPending } =
  useDeleteAdminRoles();

const roles = computed(() =>
  (data.value?.data ?? []).map((role) => ({
    ...role,
    permissionsCount: role.permissionsCount ?? role.permissions?.length ?? 0,
  })),
);
const total = computed(() => data.value?.pagination?.total ?? 0);
const deleteLoading = computed(
  () => isDeleting.value || isBulkDeletingPending.value,
);

watch(searchQuery, () => {
  page.value = 1;
});

const handleSortChange = (
  sort: { key: string; direction: "asc" | "desc" } | null,
) => {
  sortState.value = sort;
  page.value = 1;
};

const handleSelectionChange = (ids: Array<string | number>) => {
  selectedIds.value = ids.map((id) => String(id));
};

// Bulk operations
const handleBulkDelete = () => {
  isBulkDeleting.value = true;
  showDeleteDialog.value = true;
};

const openDeleteDialog = (role: AdminRole) => {
  deleteTarget.value = role;
  isBulkDeleting.value = false;
  showDeleteDialog.value = true;
};

const confirmDelete = () => {
  if (isBulkDeleting.value) {
    deleteRoles(selectedIds.value, {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Đã xóa vai trò",
          detail: `Đã xóa ${selectedIds.value.length} vai trò`,
          life: 3000,
        });
        selectedIds.value = [];
        showDeleteDialog.value = false;
      },
      onError: (error: any) => {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail:
            error?.response?.data?.message ??
            "Không thể xóa một hoặc nhiều vai trò.",
          life: 3000,
        });
      },
    });
  } else if (deleteTarget.value) {
    const target = deleteTarget.value;
    deleteRole(target._id, {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Đã xóa vai trò",
          detail: `Đã xóa vai trò ${target.title}`,
          life: 3000,
        });
        deleteTarget.value = null;
        showDeleteDialog.value = false;
      },
      onError: (error: any) => {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail:
            error?.response?.data?.message ?? "Không thể xóa vai trò này.",
          life: 3000,
        });
      },
    });
  }
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
        <span
          v-if="isFetching && !isLoading"
          class="text-xs text-slate-400 flex items-center gap-1"
        >
          <i class="pi pi-spin pi-spinner text-xs"></i> Đang tải...
        </span>
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
      :data="roles"
      :total="total"
      v-model:page="page"
      v-model:perPage="perPage"
      :selectable="true"
      :sortable="true"
      :sort="sortState"
      :loading="isLoading"
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
          {{ row.usersCount ?? 0 }} người dùng
        </span>
      </template>

      <template #cell-permissionsCount="{ row }">
        <span
          class="text-xs font-bold font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded dark:bg-blue-950/20 dark:text-blue-400"
        >
          {{ row.permissionsCount ?? 0 }} quyền
        </span>
      </template>

      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.ROLE_EDIT(row._id)"
          @delete="openDeleteDialog(row)"
          :show-delete="!row.isSystem"
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
