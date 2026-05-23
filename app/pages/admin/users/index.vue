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
  title: "Danh sách người dùng - Quản trị SmartFood",
});

const store = useAdminMockStore();
const router = useRouter();
const toast = useToast();

const searchQuery = ref("");
const roleFilter = ref<string>("all");
const statusFilter = ref<string>("all");
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
  { key: "avatar", label: "Ảnh đại diện" },
  { key: "displayName", label: "Thông tin người dùng", sortable: true },
  { key: "contact", label: "Thông tin liên hệ" },
  { key: "role", label: "Loại vai trò", sortable: true },
  { key: "gender", label: "Giới tính & ngày sinh" },
  { key: "isActive", label: "Trạng thái tài khoản", sortable: true },
  { key: "actions", label: "Thao tác" },
];

const getRoleTitle = (roleId: string) => {
  const role = store.roles.find((r) => r.id === roleId);
  return role ? role.title : "Khách hàng mặc định";
};

const handleSortChange = (
  sort: { key: string; direction: "asc" | "desc" } | null,
) => {
  sortState.value = sort;
};

// Filtered and sorted users
const processedUsers = computed(() => {
  let list = [...store.users];

  // Search filter
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase();
    list = list.filter(
      (u) =>
        u.displayName.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword) ||
        u.phone.toLowerCase().includes(keyword) ||
        u.address.toLowerCase().includes(keyword),
    );
  }

  // Role filter
  if (roleFilter.value !== "all") {
    list = list.filter((u) => u.role === roleFilter.value);
  }

  // Status filter
  if (statusFilter.value !== "all") {
    const activeBool = statusFilter.value === "active";
    list = list.filter((u) => u.isActive === activeBool);
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
      } else if (typeof valA === "boolean") {
        return direction === "asc"
          ? valA === valB
            ? 0
            : valA
              ? 1
              : -1
          : valA === valB
            ? 0
            : valA
              ? -1
              : 1;
      } else {
        return direction === "asc" ? valA - valB : valB - valA;
      }
    });
  }

  return list;
});

const paginatedUsers = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return processedUsers.value.slice(start, start + perPage.value);
});

const total = computed(() => processedUsers.value.length);

const handleSelectionChange = (ids: Array<string | number>) => {
  selectedIds.value = ids.map((id) => String(id));
};

// Bulk operations
const handleBulkDelete = () => {
  isBulkDeleting.value = true;
  showDeleteDialog.value = true;
};

const handleBulkStatusChange = (active: boolean) => {
  store.bulkUpdateUserStatus(selectedIds.value, active);
  selectedIds.value = [];
  toast.add({
    severity: "success",
    summary: "Đã cập nhật trạng thái",
    detail: `Đã cập nhật trạng thái cho người dùng đã chọn`,
    life: 3000,
  });
};

const openDeleteDialog = (user: any) => {
  deleteTarget.value = user;
  isBulkDeleting.value = false;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  deleteLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (isBulkDeleting.value) {
    store.bulkDeleteUsers(selectedIds.value);
    toast.add({
      severity: "success",
      summary: "Đã xóa người dùng",
      detail: `Đã xóa ${selectedIds.value.length} người dùng`,
      life: 3000,
    });
    selectedIds.value = [];
  } else if (deleteTarget.value) {
    store.deleteUser(deleteTarget.value.id);
    toast.add({
      severity: "success",
      summary: "Đã xóa người dùng",
      detail: `Đã xóa người dùng ${deleteTarget.value.displayName}`,
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

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Người dùng"
      subtitle="Quản lý nhật ký truy cập, chỉnh vai trò, bật/tắt trạng thái và xem danh bạ khách hàng."
      :primary-action="{
        label: 'Thêm người dùng',
        icon: 'pi pi-plus',
        onClick: () => router.push(ROUTES.ADMIN.USER_CREATE),
      }"
    />

    <!-- Filter & Bulk Actions Bar -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex flex-wrap items-center gap-4">
        <SearchToolbar
          v-model="searchQuery"
          placeholder="Tìm theo tên, email, số điện thoại..."
        />

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-500 uppercase"
            >Vai trò:</span
          >
          <select
            v-model="roleFilter"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="client">Khách hàng</option>
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
            <option value="all">Tất cả tài khoản</option>
            <option value="active">Chỉ tài khoản hoạt động</option>
            <option value="inactive">Chỉ tài khoản bị khóa</option>
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
          @click="handleBulkStatusChange(true)"
          class="rounded bg-white border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          Kích hoạt
        </button>
        <button
          @click="handleBulkStatusChange(false)"
          class="rounded bg-white border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          Tạm khóa
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
      :data="paginatedUsers"
      :total="total"
      v-model:page="page"
      v-model:perPage="perPage"
      :selectable="true"
      :sortable="true"
      @update:sort="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <template #title>Danh mục người dùng</template>
      <template #subtitle>Thông tin bảo mật và phân quyền tài khoản.</template>

      <template #cell-avatar="{ row }">
        <img
          :src="
            row.avatar ||
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop'
          "
          alt="Avatar"
          class="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
        />
      </template>

      <template #cell-displayName="{ row }">
        <div>
          <p class="font-semibold text-slate-900 dark:text-white">
            {{ row.displayName }}
          </p>
          <p class="text-xs text-slate-400 dark:text-slate-500 font-mono">
            {{ row.email }}
          </p>
        </div>
      </template>

      <template #cell-contact="{ row }">
        <div class="text-xs text-slate-700 dark:text-slate-350 space-y-0.5">
          <p>
            SĐT:
            <span class="font-semibold font-mono">{{
              row.phone || "N/A"
            }}</span>
          </p>
          <p class="line-clamp-1 max-w-xs" :title="row.address">
            Địa chỉ: {{ row.address || "N/A" }}
          </p>
        </div>
      </template>

      <template #cell-role="{ row }">
        <div class="text-xs">
          <span
            class="px-2 py-0.5 rounded font-semibold uppercase tracking-wider text-[10px]"
            :class="[
              row.role === 'admin'
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/20 dark:text-primary-400'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
            ]"
          >
            {{ row.role === 'admin' ? 'Quản trị viên' : 'Khách hàng' }}
          </span>
          <p class="text-[10px] text-slate-400 mt-1">
            {{ getRoleTitle(row.roleId) }}
          </p>
        </div>
      </template>

      <template #cell-gender="{ row }">
        <div class="text-xs text-slate-655 dark:text-slate-400">
          <p>Giới tính: {{ row.gender === 'male' ? 'Nam' : row.gender === 'female' ? 'Nữ' : (row.gender || "Chưa xác định") }}</p>
          <p>Ngày sinh: {{ formatDate(row.birthday) }}</p>
        </div>
      </template>

      <template #cell-isActive="{ value }">
        <span
          class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold"
          :class="[
            value
              ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
              : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400',
          ]"
        >
          <span
            class="h-1.5 w-1.5 rounded-full"
            :class="[value ? 'bg-green-500' : 'bg-red-500']"
          ></span>
          {{ value ? "Hoạt động" : "Bị khóa" }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.USER_EDIT(row.id)"
          @delete="openDeleteDialog(row)"
          show-delete
        />
      </template>
    </AppDataTable>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :visible="showDeleteDialog"
      :title="isBulkDeleting ? 'Xóa người dùng đã chọn' : 'Xóa người dùng'"
      :message="
        isBulkDeleting
          ? `Bạn có chắc chắn muốn xóa ${selectedIds.length} người dùng đã chọn? Hành động này không thể hoàn tác.`
          : `Bạn có chắc chắn muốn xóa người dùng '${deleteTarget?.displayName}'? Hành động này không thể hoàn tác.`
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
