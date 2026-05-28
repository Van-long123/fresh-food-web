<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import { useToast } from "primevue/usetoast";
import { ROUTES } from "~/constants/routes";
import {
  useAdminPaymentsQuery,
  useAdminPaymentStatsQuery,
} from "~/queries/order/useAdminPaymentsQuery";
import { useConfirmAdminCodPayment } from "~/mutations/order/useConfirmAdminCodPayment";
import { formatDateTime, formatVND } from "~/utils/formatters";
import type {
  AdminPaymentQueryParams,
  AdminPayment,
  PaymentMethod,
  PaymentStatus,
} from "~/types/order.type";

definePageMeta({ layout: "admin", middleware: ["auth", "admin"] });
useHead({ title: "Danh sách thanh toán - Quản trị SmartFood" });

const router = useRouter();
const toast = useToast();

// Filter state
const searchQuery = ref("");
const statusFilter = ref<AdminPaymentQueryParams["status"] | "all">("all");
const methodFilter = ref<AdminPaymentQueryParams["paymentMethod"] | "all">(
  "all",
);
const page = ref(1);
const perPage = ref(10);
const sortState = ref<{ key: string; direction: "asc" | "desc" } | null>(null);

// COD confirm dialog
const codTarget = ref<AdminPayment | null>(null);
const showCodDialog = ref(false);

// Query params (reactive)
const queryParams = computed<AdminPaymentQueryParams>(() => ({
  page: page.value,
  perPage: perPage.value,
  keyword: searchQuery.value || undefined,
  status:
    statusFilter.value === "all"
      ? undefined
      : (statusFilter.value as PaymentStatus),
  paymentMethod:
    methodFilter.value === "all"
      ? undefined
      : (methodFilter.value as PaymentMethod),
  sortField: sortState.value?.key || "createdAt",
  sortOrder: sortState.value?.direction || "desc",
}));

const {
  data: paymentsData,
  isLoading: _isLoading,
  isError,
} = useAdminPaymentsQuery(queryParams);
const { data: statsData } = useAdminPaymentStatsQuery();

const payments = computed(() => paymentsData.value?.data ?? []);
const tablePayments = computed<Record<string, unknown>[]>(
  () => payments.value as unknown as Record<string, unknown>[],
);
const total = computed(() => paymentsData.value?.pagination?.total ?? 0);

// Stats
const stats = computed(() => ({
  pending: statsData.value?.pending ?? 0,
  completed: statsData.value?.completed ?? 0,
  cancelled: statsData.value?.cancelled ?? 0,
  totalRevenue: statsData.value?.totalRevenue ?? 0,
}));

// Reset page on filter changes
watch([searchQuery, statusFilter, methodFilter], () => {
  page.value = 1;
});

// Mutations
const { mutate: confirmCod, isPending: isCodLoading } =
  useConfirmAdminCodPayment();

// Table columns
const columns = [
  { key: "_id", label: "Mã thanh toán", sortable: true },
  { key: "orderId", label: "Mã đơn hàng" },
  { key: "customer", label: "Khách hàng" },
  { key: "paymentMethod", label: "Phương thức", sortable: true },
  { key: "amount", label: "Số tiền", sortable: true },
  { key: "status", label: "Trạng thái", sortable: true },
  { key: "transactionId", label: "Mã giao dịch" },
  { key: "createdAt", label: "Ngày tạo", sortable: true },
  { key: "actions", label: "Thao tác" },
];

// Computed helpers
const getOrderCode = (row: AdminPayment): string => {
  const order = row.order;
  if (!order) return "N/A";
  return `#${order.orderCode ?? order._id?.toString().slice(-6).toUpperCase()}`;
};

const getOrderId = (row: AdminPayment): string => {
  return String(row.orderId);
};

const getCustomerInfo = (row: AdminPayment) => {
  const order = row.order;
  if (!order) return { name: "Khách vãng lai", phone: "" };
  return {
    name: order.userInfo?.fullname ?? "—",
    phone: order.userInfo?.phone ?? "",
  };
};

const getMethodClass = (method: string): string =>
  method === "PayOS"
    ? "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300"
    : "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300";

// Sort
const handleSortChange = (
  sort: { key: string; direction: "asc" | "desc" } | null,
) => {
  sortState.value = sort;
};

// COD confirm
const openCodConfirm = (payment: AdminPayment) => {
  codTarget.value = payment;
  showCodDialog.value = true;
};

const getConfirmCodErrorMessage = (err: unknown) => {
  const error = err as { response?: { data?: { message?: string } } };
  return error.response?.data?.message ?? "Không thể xác nhận COD.";
};

const confirmCodReceived = () => {
  if (!codTarget.value) return;

  confirmCod(codTarget.value._id, {
    onSuccess: () => {
      toast.add({
        severity: "success",
        summary:
          codTarget.value?.paymentMethod === "PayOS"
            ? "Đã xác nhận thanh toán PayOS"
            : "Đã xác nhận thu tiền COD",
        detail: `Đã thu ${formatVND(codTarget.value!.amount)}. Thanh toán đã chuyển sang "Hoàn thành" và đơn hàng đã được đồng bộ.`,
        life: 3500,
      });
      codTarget.value = null;
      showCodDialog.value = false;
    },
    onError: (err: unknown) => {
      toast.add({
        severity: "error",
        summary: "Lỗi xác nhận",
        detail: getConfirmCodErrorMessage(err),
        life: 3000,
      });
    },
  });
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Sổ thanh toán"
      subtitle="Theo dõi giao dịch PayOS, thanh toán COD và đồng bộ trạng thái đơn hàng."
    />

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div
        class="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800/40 dark:bg-yellow-900/20"
      >
        <p
          class="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide"
        >
          Chờ thanh toán
        </p>
        <p class="mt-1 text-2xl font-bold text-yellow-700 dark:text-yellow-300">
          {{ stats.pending }}
        </p>
      </div>
      <div
        class="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800/40 dark:bg-green-900/20"
      >
        <p
          class="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide"
        >
          Hoàn thành
        </p>
        <p class="mt-1 text-2xl font-bold text-green-700 dark:text-green-300">
          {{ stats.completed }}
        </p>
      </div>
      <div
        class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/40 dark:bg-red-900/20"
      >
        <p
          class="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide"
        >
          Đã hủy / Hoàn tiền
        </p>
        <p class="mt-1 text-2xl font-bold text-red-700 dark:text-red-300">
          {{ stats.cancelled }}
        </p>
      </div>
      <div
        class="rounded-xl border border-primary-200 bg-primary-50 p-4 dark:border-primary-800/40 dark:bg-primary-900/20"
      >
        <p
          class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide"
        >
          Doanh thu hoàn thành
        </p>
        <p
          class="mt-1 text-lg font-bold text-primary-700 dark:text-primary-300"
        >
          {{ formatVND(stats.totalRevenue) }}
        </p>
      </div>
    </div>

    <!-- Filter & Toolbar -->
    <div
      class="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <SearchToolbar
        v-model="searchQuery"
        placeholder="Tìm mã giao dịch, khách hàng, mã đơn..."
      />

      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-slate-500 uppercase"
          >Phương thức:</span
        >
        <select
          v-model="methodFilter"
          class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="all">Tất cả</option>
          <option value="PayOS">PayOS (trực tuyến)</option>
          <option value="COD">COD (tiền mặt khi nhận)</option>
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
          <option value="pending">⏳ Chờ thanh toán</option>
          <option value="completed">✅ Hoàn thành</option>
          <option value="cancelled">❌ Đã hủy</option>
        </select>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-if="isError"
      class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400"
    >
      Không thể tải danh sách thanh toán. Vui lòng thử lại.
    </div>

    <AppDataTable
      v-model:page="page"
      v-model:per-page="perPage"
      :columns="columns"
      :data="tablePayments"
      :total="total"
      :selectable="false"
      :sortable="true"
      :sort="sortState"
      @update:sort="handleSortChange"
    >
      <template #title>Nhật ký giao dịch</template>
      <template #subtitle
        >Trạng thái đồng bộ cổng thanh toán và công cụ xác nhận COD.</template
      >

      <!-- Mã thanh toán -->
      <template #cell-_id="{ row }">
        <span
          class="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 select-all"
        >
          {{ row._id }}
        </span>
      </template>

      <!-- Mã đơn hàng -->
      <template #cell-orderId="{ row }">
        <button
          class="text-sm font-bold text-primary-600 hover:underline font-mono"
          @click="router.push(ROUTES.ADMIN.ORDER_DETAIL(getOrderId(row)))"
        >
          {{ getOrderCode(row) }}
        </button>
      </template>

      <!-- Khách hàng -->
      <template #cell-customer="{ row }">
        <div>
          <p class="text-sm font-semibold text-slate-900 dark:text-white">
            {{ getCustomerInfo(row).name }}
          </p>
          <p
            v-if="getCustomerInfo(row).phone"
            class="text-xs text-slate-500 dark:text-slate-400"
          >
            {{ getCustomerInfo(row).phone }}
          </p>
        </div>
      </template>

      <!-- Phương thức -->
      <template #cell-paymentMethod="{ value }">
        <span
          class="text-xs font-bold px-2 py-0.5 rounded border"
          :class="getMethodClass(value)"
        >
          {{ value === "PayOS" ? "💳 PayOS" : "💵 COD" }}
        </span>
      </template>

      <!-- Số tiền -->
      <template #cell-amount="{ value }">
        <span class="text-sm font-bold text-slate-900 dark:text-white">
          {{ formatVND(value) }}
        </span>
      </template>

      <!-- Trạng thái -->
      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="payment" />
      </template>

      <!-- Mã giao dịch -->
      <template #cell-transactionId="{ value }">
        <span
          class="text-xs font-mono text-slate-500 dark:text-slate-400 select-all"
          :class="
            value
              ? 'font-semibold text-slate-700 dark:text-slate-200'
              : 'italic'
          "
        >
          {{ value || "—" }}
        </span>
      </template>

      <!-- Ngày tạo -->
      <template #cell-createdAt="{ value }">
        <span class="text-xs text-slate-500 dark:text-slate-400">
          {{ formatDateTime(value) }}
        </span>
      </template>

      <!-- Thao tác -->
      <template #cell-actions="{ row }">
        <div class="flex flex-wrap items-center gap-1.5">
          <!-- COD / PayOS pending: xác nhận đã nhận tiền -->
          <template
            v-if="
              ['COD'].includes(row.paymentMethod) && row.status === 'pending'
            "
          >
            <button
              class="rounded bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs font-semibold"
              :title="
                row.paymentMethod === 'PayOS'
                  ? 'Xác nhận đã nhận tiền PayOS'
                  : 'Xác nhận đã nhận tiền COD'
              "
              @click="openCodConfirm(row)"
            >
              💵 Đã thu tiền
            </button>
          </template>
          <span v-else class="text-xs text-slate-400 italic">
            Không có thao tác
          </span>

          <!-- Luôn có nút xem đơn hàng -->
          <button
            class="rounded border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            title="Xem đơn hàng"
            @click="router.push(ROUTES.ADMIN.ORDER_DETAIL(getOrderId(row)))"
          >
            <i class="pi pi-external-link text-xs"></i>
          </button>
        </div>
      </template>

      <template #empty>Chưa có giao dịch nào.</template>
    </AppDataTable>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :visible="showCodDialog"
      :title="
        codTarget?.paymentMethod === 'PayOS'
          ? 'Xác nhận đã nhận tiền PayOS'
          : 'Xác nhận đã thu tiền COD'
      "
      :message="
        codTarget?.paymentMethod === 'PayOS'
          ? `Xác nhận đã nhận được ${codTarget ? formatVND(codTarget.amount) : ''} qua PayOS từ khách? Trạng thái thanh toán sẽ chuyển sang 'Hoàn thành' và đơn hàng sẽ được cập nhật theo hệ thống.`
          : `Xác nhận nhân viên giao hàng đã thu ${codTarget ? formatVND(codTarget.amount) : ''} tiền mặt từ khách? Trạng thái thanh toán sẽ chuyển sang 'Hoàn thành' và đơn hàng sẽ được cập nhật theo hệ thống.`
      "
      confirm-label="Xác nhận đã thu"
      cancel-label="Hủy"
      :loading="isCodLoading"
      @confirm="confirmCodReceived"
      @cancel="() => (showCodDialog = false)"
      @update:visible="(v) => !v && (showCodDialog = false)"
    />
  </div>
</template>
