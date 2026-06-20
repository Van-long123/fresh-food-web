<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import { ROUTES } from "~/constants/routes";
import { useToast } from "primevue/usetoast";
import { useAdminOrdersQuery } from "~/queries/order/useAdminOrdersQuery";
import { useBulkUpdateAdminOrderStatus } from "~/mutations/order/useBulkUpdateAdminOrderStatus";
import { useUpdateAdminOrderStatus } from "~/mutations/order/useUpdateAdminOrderStatus";
import { formatDateTime, formatVND } from "~/utils/formatters";
import {
  ORDER_STATUSES,
  NEXT_STATUS_VALUES,
  type OrderStatus,
  type AdminOrderQueryParams,
} from "~/types/order.type";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});
useHead({ title: "Danh sách đơn hàng - Quản trị SmartFood" });

const router = useRouter();
const route = useRoute();
const toast = useToast();

// Filter state
const searchQuery = ref("");
const statusFilter = ref<string>("all");
const page = computed(() => Number(route.query.page) || 1);
const perPage = computed(() => Number(route.query.limit) || 10);

const updateQuery = (patch: Record<string, string | undefined>) => {
  router.replace({ query: { ...route.query, ...patch } });
};
const sortState = ref<{ key: string; direction: "asc" | "desc" } | null>(null);
const selectedIds = ref<string[]>([]);

// Inline status editing
const editingStatusId = ref<string | null>(null);
const editingStatusValue = ref<string>("");

// Query params (reactive, drives refetch)
const queryParams = computed<AdminOrderQueryParams>(() => ({
  page: page.value,
  perPage: perPage.value,
  keyword: searchQuery.value || undefined,
  status:
    statusFilter.value === "all"
      ? undefined
      : (statusFilter.value as OrderStatus),
  sortField: sortState.value?.key || "createdAt",
  sortOrder: sortState.value?.direction || "desc",
}));

// Data fetching
const {
  data: ordersData,
  isLoading,
  isError,
} = useAdminOrdersQuery(queryParams);

const orders = computed<Record<string, any>[]>(
  () => (ordersData.value?.data ?? []) as Record<string, any>[],
);
const total = computed(() => ordersData.value?.pagination?.total ?? 0);

// Reset page on filter change
watch([searchQuery, statusFilter], () => {
  updateQuery({ page: undefined });
});

// Mutations
const { mutate: updateStatus, isPending: isUpdatingStatus } =
  useUpdateAdminOrderStatus();
const { mutate: bulkUpdateStatus, isPending: isBulkUpdatingStatus } =
  useBulkUpdateAdminOrderStatus();

// Table columns
const columns = [
  { key: "orderCode", label: "Mã đơn", sortable: true },
  { key: "customer", label: "Khách hàng" },
  { key: "totalPrice", label: "Tổng tiền", sortable: true },
  { key: "paymentStatus", label: "Thanh toán" },
  { key: "status", label: "Trạng thái xử lý", sortable: true },
  { key: "createdAt", label: "Ngày đặt", sortable: true },
  { key: "actions", label: "Thao tác" },
];

// Computed helpers (no logic in template)
const getStatusLabel = (status: string) => {
  const found = ORDER_STATUSES.find((s) => s.value === status);
  return found ? found.label : status;
};

const getNextStatuses = (currentStatus: string) => {
  const allowed = NEXT_STATUS_VALUES[currentStatus as OrderStatus] ?? [];
  return ORDER_STATUSES.filter((s) => allowed.includes(s.value));
};

const getPaymentMethod = (row: any): string =>
  row.payment?.paymentMethod ?? "—";
const getPaymentStatus = (row: any): string => row.payment?.status ?? "pending";

const getMethodClass = (method: string) => {
  if (method === "PayOS")
    return "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300";
  if (method === "COD")
    return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300";
  return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300";
};

// Sort
const handleSortChange = (
  sort: { key: string; direction: "asc" | "desc" } | null,
) => {
  sortState.value = sort;
};

// Selection
const handleSelectionChange = (ids: Array<string | number>) => {
  selectedIds.value = ids.map((id) => String(id));
};

const clearSelectedIds = () => {
  selectedIds.value = [];
};

const handleBulkStatusChange = (status: OrderStatus) => {
  if (!selectedIds.value.length) return;

  const idsToUpdate = [...selectedIds.value];
  bulkUpdateStatus(
    { order_ids: idsToUpdate, status },
    {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Đã cập nhật",
          detail: `Đã cập nhật trạng thái cho ${idsToUpdate.length} đơn hàng.`,
          life: 3000,
        });
        clearSelectedIds();
      },
      onError: (err: any) => {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail:
            err?.response?.data?.message ??
            "Không thể cập nhật trạng thái cho các đơn hàng đã chọn.",
          life: 3000,
        });
      },
    },
  );
};

// Inline status edit
const startEditStatus = (row: any) => {
  editingStatusId.value = row._id;
  editingStatusValue.value = row.status;
};

const applyInlineStatus = (row: any) => {
  if (!editingStatusValue.value || editingStatusValue.value === row.status) {
    editingStatusId.value = null;
    return;
  }
  
  updateStatus(
    { id: row._id, status: editingStatusValue.value },
    {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Đã cập nhật",
          detail: "Trạng thái đơn hàng đã được cập nhật.",
          life: 2500,
        });
        editingStatusId.value = null;
      },
      onError: (err: any) => {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail:
            err?.response?.data?.message ?? "Không thể cập nhật trạng thái.",
          life: 3000,
        });
      },
    },
  );
};

const cancelEditStatus = () => {
  editingStatusId.value = null;
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Đơn hàng"
      subtitle="Theo dõi mua hàng, quản lý trạng thái xử lý và hoàn tiền."
    />

    <!-- Filter Bar -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex flex-wrap items-center gap-3">
        <SearchToolbar
          v-model="searchQuery"
          placeholder="Tìm theo mã, khách hàng, SĐT..."
        />

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-500 uppercase"
            >Trạng thái:</span
          >
          <select
            v-model="statusFilter"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">⏳ Chờ xử lý</option>
            <option value="confirmed">✅ Đã xác nhận</option>
            <option value="processing">⚙️ Đang xử lý</option>
            <option value="shipping">🚚 Đang giao hàng</option>
            <option value="delivered">✔️ Đã giao</option>
            <option value="cancelled">❌ Đã hủy</option>
            <option value="returned">↩️ Đã trả hàng</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-if="isError"
      class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400"
    >
      Không thể tải danh sách đơn hàng. Vui lòng thử lại.
    </div>

    <AppDataTable
      :columns="columns"
      :data="orders"
      :total="total"
      :page="page"
      :perPage="perPage"
      @update:page="(p) => updateQuery({ page: p > 1 ? String(p) : undefined })"
      @update:perPage="(l) => updateQuery({ limit: String(l), page: undefined })"
      :sortable="true"
      :sort="sortState"
      @update:sort="handleSortChange"
    >
      <template #title>Danh sách đơn hàng</template>
      <template #subtitle
        >Quản lý và thực hiện các đơn đặt hàng của khách hàng.</template
      >

      <!-- Mã đơn -->
      <template #cell-orderCode="{ row }">
        <button
          @click="router.push(ROUTES.ADMIN.ORDER_DETAIL(row._id))"
          class="text-sm font-bold text-primary-600 hover:underline font-mono"
        >
          #{{ row.orderCode ?? row._id.toString().slice(-6).toUpperCase() }}
        </button>
      </template>

      <!-- Khách hàng -->
      <template #cell-customer="{ row }">
        <div>
          <p class="text-sm font-semibold text-slate-900 dark:text-white">
            {{ row.userInfo?.fullname }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            📞 {{ row.userInfo?.phone }}
          </p>
          <p
            class="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[200px]"
          >
            {{ row.userInfo?.district }}, {{ row.userInfo?.province }}
          </p>
        </div>
      </template>

      <!-- Tổng tiền -->
      <template #cell-totalPrice="{ value }">
        <span class="text-sm font-bold text-slate-900 dark:text-white">
          {{ formatVND(value) }}
        </span>
      </template>

      <!-- Thanh toán -->
      <template #cell-paymentStatus="{ row }">
        <div class="flex flex-col gap-1">
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded border"
            :class="getMethodClass(getPaymentMethod(row))"
          >
            {{ getPaymentMethod(row) }}
          </span>
          <StatusBadge :status="getPaymentStatus(row)" type="payment" />
        </div>
      </template>

      <!-- Trạng thái với inline edit -->
      <template #cell-status="{ row }">
        <div
          v-if="editingStatusId === row._id"
          class="flex items-center gap-1.5"
        >
          <select
            v-model="editingStatusValue"
            class="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option :value="row.status" disabled>
              — Hiện tại: {{ getStatusLabel(row.status) }} —
            </option>
            <option
              v-for="s in getNextStatuses(row.status)"
              :key="s.value"
              :value="s.value"
            >
              {{ s.label }}
            </option>
          </select>
          <button
            @click="applyInlineStatus(row)"
            :disabled="isUpdatingStatus"
            class="rounded bg-primary-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-primary-700 disabled:opacity-50"
            title="Lưu"
          >
            ✓
          </button>
          <button
            @click="cancelEditStatus"
            class="rounded border border-slate-300 px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-50"
            title="Hủy"
          >
            ✕
          </button>
        </div>
        <div
          v-else
          class="flex items-center gap-2 cursor-pointer group"
          @click="startEditStatus(row)"
          :title="
            getNextStatuses(row.status).length
              ? 'Click để thay đổi trạng thái'
              : 'Không thể thay đổi trạng thái'
          "
        >
          <StatusBadge :status="row.status" type="order" />
          <i
            v-if="getNextStatuses(row.status).length"
            class="pi pi-pencil text-[10px] text-slate-300 group-hover:text-primary-500 transition"
          ></i>
        </div>
      </template>

      <!-- Ngày đặt -->
      <template #cell-createdAt="{ value }">
        <span class="text-xs text-slate-500 dark:text-slate-400">
          {{ formatDateTime(value) }}
        </span>
      </template>

      <!-- Thao tác -->
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <button
            @click="router.push(ROUTES.ADMIN.ORDER_DETAIL(row._id))"
            class="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-primary-900/20"
            title="Xem chi tiết"
          >
            <i class="pi pi-eye text-sm"></i>
          </button>
        </div>
      </template>

      <template #empty>Chưa có đơn hàng nào.</template>
    </AppDataTable>
  </div>
</template>
