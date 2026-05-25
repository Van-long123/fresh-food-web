<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import { ROUTES } from "~/constants/routes";
import { formatDate } from "~/utils/formatters";
import { useAdminVouchersQuery } from "~/queries/voucher/useAdminVouchersQuery";
import { useDeleteAdminVoucher } from "~/mutations/voucher/useDeleteAdminVoucher";
import { useBulkDeleteAdminVoucher } from "~/mutations/voucher/useBulkDeleteAdminVoucher";
import { useBulkUpdateAdminVoucherStatus } from "~/mutations/voucher/useBulkUpdateAdminVoucherStatus";
import type { AdminVoucher, AdminVoucherQueryParams } from "~/types/voucher";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Danh sách mã giảm giá - Quản trị SmartFood",
});

const router = useRouter();
const toast = useToast();

const searchQuery = ref("");
const statusFilter = ref<string>("all");
const typeFilter = ref<string>("all");
const selectedIds = ref<string[]>([]);

// Pagination
const page = ref(1);
const perPage = ref(10);

// Sorting
const sortState = ref<{ key: string; direction: "asc" | "desc" } | null>(null);

// Delete targets
const deleteTarget = ref<AdminVoucher | null>(null);
const showDeleteDialog = ref(false);

const columns = [
  { key: "code", label: "Mã khuyến mãi" },
  { key: "name", label: "Thông tin chiến dịch" },
  { key: "type", label: "Loại", sortable: true },
  { key: "discountValue", label: "Giảm giá", sortable: true },
  { key: "minOrderValue", label: "Điều kiện" },
  { key: "usage", label: "Lượt dùng" },
  { key: "duration", label: "Thời hạn" },
  { key: "status", label: "Trạng thái", sortable: true },
  { key: "actions", label: "Thao tác" },
];

const queryParams = computed<AdminVoucherQueryParams>(() => {
  const params: AdminVoucherQueryParams = {
    page: page.value,
    perPage: perPage.value,
  };

  if (searchQuery.value.trim()) params.keyword = searchQuery.value.trim();
  if (statusFilter.value !== "all") params.status = statusFilter.value as any;
  if (typeFilter.value !== "all") params.type = typeFilter.value as any;
  if (sortState.value) {
    params.sortField = sortState.value.key;
    params.sortOrder = sortState.value.direction;
  }

  return params;
});

const { data, isLoading, isFetching } = useAdminVouchersQuery(queryParams);
const { mutate: deleteVoucher, isPending: isDeleting } =
  useDeleteAdminVoucher();
const { mutate: bulkDeleteVouchers, isPending: isBulkDeletingPending } =
  useBulkDeleteAdminVoucher();
const { mutate: bulkUpdateVoucherStatus, isPending: isBulkUpdatingPending } =
  useBulkUpdateAdminVoucherStatus();

const handleSortChange = (
  sort: { key: string; direction: "asc" | "desc" } | null,
) => {
  sortState.value = sort;
};

const paginatedVouchers = computed(() => {
  return data.value?.data ?? [];
});

const total = computed(() => data.value?.pagination?.total ?? 0);

const handleSelectionChange = (ids: Array<string | number>) => {
  selectedIds.value = ids.map((id) => String(id));
};

watch([searchQuery, statusFilter, typeFilter], () => {
  page.value = 1;
  selectedIds.value = [];
});

// Bulk operations
const handleBulkDelete = () => {
  if (!selectedIds.value.length) return;
  deleteTarget.value = null;
  showDeleteDialog.value = true;
};

const handleBulkStatusChange = (status: "active" | "inactive") => {
  if (!selectedIds.value.length) return;

  const voucherIds = [...selectedIds.value];
  bulkUpdateVoucherStatus(
    { voucher_ids: voucherIds, status },
    {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Đã cập nhật trạng thái",
          detail: `Đã cập nhật trạng thái cho ${voucherIds.length} mã giảm giá`,
          life: 3000,
        });
        selectedIds.value = [];
      },
      onError: () => {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Không thể cập nhật một hoặc nhiều mã giảm giá",
          life: 3000,
        });
      },
    },
  );
};

const openDeleteDialog = (voucher: AdminVoucher) => {
  deleteTarget.value = voucher;
  showDeleteDialog.value = true;
};

const confirmDelete = () => {
  if (selectedIds.value.length && !deleteTarget.value) {
    const voucherIds = [...selectedIds.value];
    bulkDeleteVouchers(
      { voucher_ids: voucherIds },
      {
        onSuccess: () => {
          toast.add({
            severity: "success",
            summary: "Đã xóa mã giảm giá",
            detail: `Đã xóa ${voucherIds.length} mã giảm giá`,
            life: 3000,
          });
          selectedIds.value = [];
          showDeleteDialog.value = false;
        },
        onError: () => {
          toast.add({
            severity: "error",
            summary: "Lỗi",
            detail: "Không thể xóa một hoặc nhiều mã giảm giá",
            life: 3000,
          });
        },
      },
    );
    return;
  }

  if (!deleteTarget.value) return;

  const target = deleteTarget.value;
  deleteVoucher(target._id, {
    onSuccess: () => {
      toast.add({
        severity: "success",
        summary: "Đã xóa mã giảm giá",
        detail: `Đã xóa mã giảm giá ${target.code}`,
        life: 3000,
      });
      deleteTarget.value = null;
      showDeleteDialog.value = false;
    },
    onError: () => {
      toast.add({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể xóa mã giảm giá này",
        life: 3000,
      });
    },
  });
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
  deleteTarget.value = null;
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Mã giảm giá & ưu đãi"
      subtitle="Cấu hình mã coupon, giảm giá theo số lượng và ưu đãi chiến dịch."
      :primary-action="{
        label: 'Thêm voucher',
        icon: 'pi pi-plus',
        onClick: () => router.push(ROUTES.ADMIN.VOUCHER_CREATE),
      }"
    />

    <!-- Filter & Bulk Actions Bar -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex flex-wrap items-center gap-4">
        <SearchToolbar
          v-model="searchQuery"
          placeholder="Tìm mã, chiến dịch..."
        />

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-500 uppercase"
            >Loại:</span
          >
          <select
            v-model="typeFilter"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Tất cả loại</option>
            <option value="money">Giảm tiền</option>
            <option value="percent">Giảm phần trăm</option>
            <option value="freeship">Miễn phí vận chuyển</option>
            <option value="product">Theo sản phẩm</option>
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
            <option value="expired">Hết hạn</option>
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
          class="rounded bg-white border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          Kích hoạt
        </button>
        <button
          @click="handleBulkStatusChange('inactive')"
          class="rounded bg-white border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
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
      :data="paginatedVouchers"
      :total="total"
      :loading="isLoading || isFetching"
      v-model:page="page"
      v-model:perPage="perPage"
      :selectable="true"
      :sortable="true"
      :sort="sortState"
      @update:sort="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <template #title>Danh sách mã giảm giá</template>
      <template #subtitle
        >Quản lý quy tắc coupon, giới hạn và mức giảm giá.</template
      >

      <template #cell-code="{ row }">
        <div>
          <span
            class="text-sm font-bold font-mono bg-slate-100 text-slate-800 border px-2 py-0.5 rounded dark:bg-slate-800 dark:text-slate-200 dark:border-slate-750"
          >
            {{ row.code }}
          </span>
          <div
            v-if="row.isFeatured"
            class="mt-1 text-[9px] bg-amber-100 text-amber-800 font-bold px-1 py-0.2 rounded w-max dark:bg-amber-950/20 dark:text-amber-400"
          >
            Nổi bật
          </div>
        </div>
      </template>

      <template #cell-name="{ row }">
        <div>
          <p class="font-semibold text-slate-900 dark:text-white">
            {{ row.name }}
          </p>
          <p
            class="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 max-w-xs"
          >
            {{ row.description }}
          </p>
        </div>
      </template>

      <template #cell-type="{ value }">
        <span class="text-xs font-semibold font-mono">
          {{
            value === "percent"
              ? "Phần trăm"
              : value === "freeship"
                ? "Miễn phí vận chuyển"
                : "Số tiền cố định"
          }}
        </span>
      </template>

      <template #cell-discountValue="{ row }">
        <span class="text-sm font-bold text-slate-900 dark:text-white">
          {{
            row.type === "percent"
              ? `${row.discountValue}%`
              : `${Number(row.discountValue).toLocaleString("vi-VN")} VND`
          }}
        </span>
      </template>

      <template #cell-minOrderValue="{ row }">
        <div class="text-xs space-y-0.5 text-slate-700 dark:text-slate-350">
          <p>
            Đơn tối thiểu:
            <span class="font-bold font-mono"
              >{{ Number(row.minOrderValue).toLocaleString() }} VND</span
            >
          </p>
          <p v-if="row.maxDiscountAmount">
            Giảm tối đa:
            <span class="font-bold font-mono"
              >{{ Number(row.maxDiscountAmount).toLocaleString() }} VND</span
            >
          </p>
        </div>
      </template>

      <template #cell-usage="{ row }">
        <div class="text-xs">
          <div
            class="flex justify-between mb-1 font-semibold text-slate-800 dark:text-slate-300"
          >
            <span>{{ row.usedCount }} / {{ row.quantity }}</span>
            <span class="text-slate-400"
              >({{ Math.round((row.usedCount / row.quantity) * 100) }}%)</span
            >
          </div>
          <div
            class="w-24 bg-slate-100 rounded-full h-1.5 dark:bg-slate-800 overflow-hidden"
          >
            <div
              class="bg-primary-600 h-1.5 rounded-full"
              :style="`width: ${Math.min((row.usedCount / row.quantity) * 100, 100)}%`"
            ></div>
          </div>
        </div>
      </template>

      <template #cell-duration="{ row }">
        <div class="text-xs text-slate-500 space-y-0.5 font-mono">
          <p>Từ: {{ formatDate(row.startDate) }}</p>
          <p>Đến: {{ formatDate(row.endDate) }}</p>
        </div>
      </template>

      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="voucher" />
      </template>

      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.VOUCHER_EDIT(row._id)"
          @delete="openDeleteDialog(row)"
          show-delete
        />
      </template>
    </AppDataTable>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :visible="showDeleteDialog"
      :title="
        selectedIds.length && !deleteTarget
          ? 'Xóa các khuyến mãi đã chọn'
          : 'Xóa mã khuyến mãi'
      "
      :message="
        selectedIds.length && !deleteTarget
          ? `Bạn có chắc chắn muốn xóa ${selectedIds.length} mã khuyến mãi đã chọn? Hành động này không thể hoàn tác.`
          : `Bạn có chắc chắn muốn xóa mã khuyến mãi '${deleteTarget?.code}'? Hành động này không thể hoàn tác.`
      "
      confirm-label="Xóa"
      cancel-label="Hủy"
      :loading="isDeleting || isBulkDeletingPending || isBulkUpdatingPending"
      danger
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      @update:visible="(v) => !v && cancelDelete()"
    />
  </div>
</template>
