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
  title: "Danh sách đơn hàng - Quản trị SmartFood",
});

const store = useAdminMockStore();
const router = useRouter();
const toast = useToast();

const searchQuery = ref("");
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
  { key: "orderCode", label: "Mã đơn", sortable: true },
  { key: "customer", label: "Khách hàng" },
  { key: "createdAt", label: "Ngày", sortable: true },
  { key: "voucherCode", label: "Mã giảm giá đã dùng" },
  { key: "totalPrice", label: "Tổng tiền", sortable: true },
  { key: "paymentStatus", label: "Thanh toán" },
  { key: "status", label: "Trạng thái xử lý", sortable: true },
  { key: "actions", label: "Thao tác" },
];

const getPaymentStatus = (orderId: string) => {
  const pay = store.payments.find((p) => p.orderId === orderId);
  return pay ? pay.status : "pending";
};

const handleSortChange = (
  sort: { key: string; direction: "asc" | "desc" } | null,
) => {
  sortState.value = sort;
};

// Filtered and sorted orders
const processedOrders = computed(() => {
  let list = [...store.orders];

  // Search filter
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase();
    list = list.filter(
      (o) =>
        String(o.orderCode).includes(keyword) ||
        o.userInfo.fullname.toLowerCase().includes(keyword) ||
        o.userInfo.phone.includes(keyword) ||
        o.voucherCode.toLowerCase().includes(keyword),
    );
  }

  // Status filter
  if (statusFilter.value !== "all") {
    list = list.filter((o) => o.status === statusFilter.value);
  }

  // Sorting
  if (sortState.value) {
    const { key, direction } = sortState.value;
    list.sort((a: any, b: any) => {
      let valA = a[key];
      let valB = b[key];

      if (key === "paymentStatus") {
        valA = getPaymentStatus(a.id);
        valB = getPaymentStatus(b.id);
      }

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

const paginatedOrders = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return processedOrders.value.slice(start, start + perPage.value);
});

const total = computed(() => processedOrders.value.length);

const handleSelectionChange = (ids: Array<string | number>) => {
  selectedIds.value = ids.map((id) => String(id));
};

// Bulk operations
const handleBulkDelete = () => {
  isBulkDeleting.value = true;
  showDeleteDialog.value = true;
};

const handleBulkStatusChange = (status: any) => {
  store.bulkUpdateOrderStatus(selectedIds.value, status);
  selectedIds.value = [];
  toast.add({
    severity: "success",
    summary: "Đã cập nhật trạng thái",
    detail: "Đã cập nhật trạng thái cho các đơn hàng đã chọn",
    life: 3000,
  });
};

const openDeleteDialog = (order: any) => {
  deleteTarget.value = order;
  isBulkDeleting.value = false;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  deleteLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (isBulkDeleting.value) {
    store.bulkDeleteOrders(selectedIds.value);
    toast.add({
      severity: "success",
      summary: "Đã xóa đơn hàng",
      detail: `Đã xóa ${selectedIds.value.length} đơn hàng`,
      life: 3000,
    });
    selectedIds.value = [];
  } else if (deleteTarget.value) {
    store.deleteOrder(deleteTarget.value.id);
    toast.add({
      severity: "success",
      summary: "Đã xóa đơn hàng",
      detail: `Đã xóa đơn hàng #${deleteTarget.value.orderCode}`,
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
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Đơn hàng"
      subtitle="Theo dõi mua hàng, quản lý trạng thái xử lý và hoàn tiền."
    />

    <!-- Filter & Bulk Actions Bar -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex flex-wrap items-center gap-4">
        <SearchToolbar
          v-model="searchQuery"
          placeholder="Tìm theo mã, khách hàng..."
        />

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-500 uppercase"
            >Xử lý:</span
          >
          <select
            v-model="statusFilter"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
            <option value="returned">Đã trả hàng</option>
          </select>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div
        v-if="selectedIds.length"
        class="flex flex-wrap items-center gap-2 bg-primary-50 dark:bg-primary-950/20 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-900/50"
      >
        <span class="text-sm font-medium text-primary-700 dark:text-primary-300"
          >{{ selectedIds.length }} đã chọn</span
        >
        <button
          @click="handleBulkStatusChange('confirmed')"
          class="rounded bg-white border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          Xác nhận
        </button>
        <button
          @click="handleBulkStatusChange('processing')"
          class="rounded bg-white border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          Xử lý
        </button>
        <button
          @click="handleBulkStatusChange('shipping')"
          class="rounded bg-white border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          Giao hàng
        </button>
        <button
          @click="handleBulkStatusChange('delivered')"
          class="rounded bg-white border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          Hoàn tất giao
        </button>
        <button
          @click="handleBulkDelete"
          class="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700"
        >
          Xóa
        </button>
      </div>
    </div>

    <AppDataTable
      :columns="columns"
      :data="paginatedOrders"
      :total="total"
      v-model:page="page"
      v-model:perPage="perPage"
      :selectable="true"
      :selection="selectedIds"
      :sortable="true"
      :sort="sortState"
      @update:sort="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <template #title>Danh sách đơn hàng</template>
      <template #subtitle>Quản lý và thực hiện các đơn đặt hàng của khách hàng.</template>

      <template #cell-orderCode="{ row }">
        <button
          @click="router.push(ROUTES.ADMIN.ORDER_DETAIL(row.id))"
          class="text-sm font-bold text-primary-600 hover:underline font-mono"
        >
          #{{ row.orderCode }}
        </button>
      </template>

      <template #cell-customer="{ row }">
        <div>
          <p class="text-sm font-semibold text-slate-900 dark:text-white">
            {{ row.userInfo.fullname }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            {{ row.userInfo.phone }}
          </p>
        </div>
      </template>

      <template #cell-createdAt="{ value }">
        <span class="text-xs text-slate-500 dark:text-slate-400">
          {{ formatDate(value) }}
        </span>
      </template>

      <template #cell-voucherCode="{ value }">
        <span
          v-if="value"
          class="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold dark:bg-emerald-950/20 dark:text-emerald-400"
        >
          {{ value }}
        </span>
        <span v-else class="text-xs text-slate-400 italic">Không có</span>
      </template>

      <template #cell-totalPrice="{ value }">
        <span class="text-sm font-bold text-slate-900 dark:text-white">
          {{ Number(value).toLocaleString() }} VND
        </span>
      </template>

      <template #cell-paymentStatus="{ row }">
        <StatusBadge :status="getPaymentStatus(row.id)" type="payment" />
      </template>

      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="order" />
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <button
            @click="router.push(ROUTES.ADMIN.ORDER_DETAIL(row.id))"
            class="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Xem chi tiết"
          >
            <i class="pi pi-eye text-sm"></i>
          </button>
          <button
            @click="openDeleteDialog(row)"
            class="inline-flex items-center justify-center rounded-lg border border-red-200 p-2 text-red-500 transition hover:border-red-300 hover:bg-red-50 dark:border-red-950 dark:text-red-400 dark:hover:bg-red-900/20"
            title="Xóa"
          >
            <i class="pi pi-trash text-sm"></i>
          </button>
        </div>
      </template>
    </AppDataTable>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :visible="showDeleteDialog"
      :title="isBulkDeleting ? 'Xóa các đơn hàng đã chọn' : 'Xóa đơn hàng'"
      :message="
        isBulkDeleting
          ? `Bạn có chắc chắn muốn xóa ${selectedIds.length} đơn hàng đã chọn? Hành động này không thể hoàn tác.`
          : `Bạn có chắc chắn muốn xóa đơn hàng #${deleteTarget?.orderCode}? Hành động này không thể hoàn tác.`
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
