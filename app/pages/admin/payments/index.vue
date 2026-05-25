<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
import { useToast } from "primevue/usetoast";
import { ROUTES } from "~/constants/routes";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Danh sách thanh toán - Quản trị SmartFood",
});

const store = useAdminMockStore();
const router = useRouter();
const toast = useToast();

const searchQuery = ref("");
const statusFilter = ref<string>("all");
const methodFilter = ref<string>("all");
const selectedIds = ref<string[]>([]);

// Pagination
const page = ref(1);
const perPage = ref(10);

// Sorting
const sortState = ref<{ key: string; direction: "asc" | "desc" } | null>(null);

// Refund State
const refundTarget = ref<any | null>(null);
const showRefundDialog = ref(false);
const refundReason = ref("");
const refundLoading = ref(false);

const columns = [
  { key: "id", label: "Mã thanh toán", sortable: true },
  { key: "orderCode", label: "Mã đơn" },
  { key: "customer", label: "Tên khách hàng" },
  { key: "paymentMethod", label: "Phương thức", sortable: true },
  { key: "amount", label: "Số tiền", sortable: true },
  { key: "status", label: "Trạng thái", sortable: true },
  { key: "transactionId", label: "Mã giao dịch" },
  { key: "actions", label: "Thao tác" },
];

const getOrderCode = (orderId: string) => {
  const ord = store.orders.find((o) => o.id === orderId);
  return ord ? `#${ord.orderCode}` : "Không có";
};

const getCustomerName = (userId: string) => {
  const usr = store.users.find((u) => u.id === userId);
  return usr ? usr.displayName : "Khách vãng lai";
};

const handleSortChange = (
  sort: { key: string; direction: "asc" | "desc" } | null,
) => {
  sortState.value = sort;
};

// Filtered and sorted payments
const processedPayments = computed(() => {
  let list = [...store.payments];

  // Search filter
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase();
    list = list.filter(
      (p) =>
        p.id.toLowerCase().includes(keyword) ||
        p.transactionId.toLowerCase().includes(keyword) ||
        getCustomerName(p.userId).toLowerCase().includes(keyword),
    );
  }

  // Status filter
  if (statusFilter.value !== "all") {
    list = list.filter((p) => p.status === statusFilter.value);
  }

  // Method filter
  if (methodFilter.value !== "all") {
    list = list.filter((p) => p.paymentMethod === methodFilter.value);
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

const paginatedPayments = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return processedPayments.value.slice(start, start + perPage.value);
});

const total = computed(() => processedPayments.value.length);

const handleSelectionChange = (ids: Array<string | number>) => {
  selectedIds.value = ids.map((id) => String(id));
};

const handleStatusChange = (
  paymentId: string,
  status: "completed" | "cancelled" | "pending",
) => {
  store.updatePaymentStatus(paymentId, status);

  // If payment completes, update the corresponding order status to processing/confirmed
  if (status === "completed") {
    const pay = store.payments.find((p) => p.id === paymentId);
    if (pay) {
      store.updateOrderStatus(pay.orderId, "confirmed");
    }
  }

  toast.add({
    severity: "info",
    summary: "Đã mô phỏng trạng thái",
    detail: `Đã đặt trạng thái thanh toán thành ${status}.`,
    life: 3000,
  });
};

const openRefundDialog = (payment: any) => {
  refundTarget.value = payment;
  refundReason.value = "";
  showRefundDialog.value = true;
};

const confirmRefund = async () => {
  if (!refundTarget.value) return;
  refundLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));

  store.updatePaymentStatus(refundTarget.value.id, "cancelled");
  store.updateOrderStatus(refundTarget.value.orderId, "returned");

  toast.add({
    severity: "success",
    summary: "Đã hoàn tiền",
    detail: `Đã hoàn ${Number(refundTarget.value.amount).toLocaleString()} VND cho mã thanh toán ${refundTarget.value.id}.`,
    life: 3000,
  });

  refundTarget.value = null;
  showRefundDialog.value = false;
  refundLoading.value = false;
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Sổ thanh toán"
      subtitle="Theo dõi giao dịch PayOS, thanh toán tiền mặt và xử lý hoàn tiền qua cổng thanh toán."
    />

    <!-- Filter & Toolbar -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex flex-wrap items-center gap-4">
        <SearchToolbar
          v-model="searchQuery"
          placeholder="Tìm mã giao dịch, khách hàng..."
        />

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-500 uppercase"
            >Phương thức:</span
          >
          <select
            v-model="methodFilter"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Tất cả phương thức</option>
            <option value="PayOS">PayOS (trực tuyến)</option>
            <option value="COD">COD (thanh toán khi nhận hàng)</option>
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
            <option value="pending">Chờ xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy / hoàn tiền</option>
          </select>
        </div>
      </div>
    </div>

    <AppDataTable
      :columns="columns"
      :data="paginatedPayments"
      :total="total"
      v-model:page="page"
      v-model:perPage="perPage"
      :selectable="false"
      :sortable="true"
      :sort="sortState"
      @update:sort="handleSortChange"
    >
      <template #title>Nhật ký giao dịch</template>
      <template #subtitle
        >Trạng thái đồng bộ cổng thanh toán và công cụ mô phỏng.</template
      >

      <template #cell-id="{ row }">
        <span
          class="text-sm font-bold font-mono text-slate-800 dark:text-slate-200"
          >{{ row.id }}</span
        >
      </template>

      <template #cell-orderCode="{ row }">
        <button
          @click="router.push(ROUTES.ADMIN.ORDER_DETAIL(row.orderId))"
          class="text-sm font-bold text-primary-600 hover:underline font-mono"
        >
          {{ getOrderCode(row.orderId) }}
        </button>
      </template>

      <template #cell-customer="{ row }">
        <span class="text-sm font-medium text-slate-900 dark:text-white">
          {{ getCustomerName(row.userId) }}
        </span>
      </template>

      <template #cell-paymentMethod="{ value }">
        <span
          class="text-xs font-bold bg-slate-100 text-slate-800 border px-2 py-0.5 rounded dark:bg-slate-800 dark:text-slate-200 dark:border-slate-750"
        >
          {{ value }}
        </span>
      </template>

      <template #cell-amount="{ value }">
        <span class="text-sm font-bold text-slate-900 dark:text-white">
          {{ Number(value).toLocaleString() }} VND
        </span>
      </template>

      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="payment" />
      </template>

      <template #cell-transactionId="{ value }">
        <span
          class="text-sm font-mono text-slate-500 dark:text-slate-400 font-semibold select-all"
        >
          {{ value }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <!-- Pending controls -->
          <template v-if="row.status === 'pending'">
            <button
              @click="handleStatusChange(row.id, 'completed')"
              class="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 text-xs font-semibold"
              title="Giả lập webhook thanh toán thành công"
            >
              Giả lập Thanh toán
            </button>
            <button
              @click="handleStatusChange(row.id, 'cancelled')"
              class="rounded bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs font-semibold"
              title="Giả lập webhook thanh toán thất bại"
            >
              Giả lập Hủy
            </button>
          </template>

          <!-- Completed controls -->
          <template v-else-if="row.status === 'completed'">
            <button
              @click="openRefundDialog(row)"
              class="rounded bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 text-xs font-semibold"
              title="Khởi tạo giao dịch hoàn tiền"
            >
              Hoàn tiền
            </button>
          </template>

          <span v-else class="text-xs text-slate-400 italic"
            >Không có hành động khả dụng</span
          >
        </div>
      </template>
    </AppDataTable>

    <!-- Refund Confirmation Dialog -->
    <ConfirmDialog
      :visible="showRefundDialog"
      title="Yêu cầu hoàn tiền"
      message="Xác nhận thực hiện giả lập hoàn tiền. Thao tác này sẽ hủy giao dịch thanh toán và đánh dấu đơn hàng tương ứng ở trạng thái 'đã trả hàng' (returned)."
      confirm-label="Xác nhận hoàn tiền"
      cancel-label="Hủy bỏ"
      :loading="refundLoading"
      danger
      @confirm="confirmRefund"
      @cancel="() => (showRefundDialog = false)"
      @update:visible="(v) => !v && (showRefundDialog = false)"
    />
  </div>
</template>
