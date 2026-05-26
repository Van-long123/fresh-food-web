<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import { ROUTES } from "~/constants/routes";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
import { useToast } from "primevue/usetoast";

definePageMeta({ layout: "admin", middleware: ["auth", "admin"] });
useHead({ title: "Danh sách yêu cầu hoàn tiền - Quản trị SmartFood" });

const store = useAdminMockStore();
const router = useRouter();
const toast = useToast();

const searchQuery = ref("");
const statusFilter = ref<string>("all");
const methodFilter = ref<string>("all");
const page = ref(1);
const perPage = ref(10);
const sortState = ref<{ key: string; direction: "asc" | "desc" } | null>(null);

const columns = [
  { key: "id", label: "Mã yêu cầu" },
  { key: "orderId", label: "Mã đơn hàng", sortable: true },
  { key: "customerName", label: "Khách hàng" },
  { key: "refundMethod", label: "Phương thức hoàn" },
  { key: "amount", label: "Số tiền hoàn", sortable: true },
  { key: "status", label: "Trạng thái" },
  { key: "createdAt", label: "Ngày tạo", sortable: true },
  { key: "actions", label: "Thao tác" },
];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
const formatCurrency = (amount: number) => amount.toLocaleString("vi-VN") + " ₫";

const handleSortChange = (sort: { key: string; direction: "asc" | "desc" } | null) => { sortState.value = sort; };

const processedList = computed(() => {
  let list = [...store.refundRequests];
  if (searchQuery.value) {
    const kw = searchQuery.value.toLowerCase();
    list = list.filter(
      (r) => r.id.toLowerCase().includes(kw) || r.orderId.toLowerCase().includes(kw) || r.customerName.toLowerCase().includes(kw),
    );
  }
  if (statusFilter.value !== "all") list = list.filter((r) => r.status === statusFilter.value);
  if (methodFilter.value !== "all") list = list.filter((r) => r.refundMethod === methodFilter.value);

  if (sortState.value) {
    const { key, direction } = sortState.value;
    list.sort((a: any, b: any) => {
      const valA = a[key]; const valB = b[key];
      if (typeof valA === "string") return direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return direction === "asc" ? valA - valB : valB - valA;
    });
  }
  return list;
});

const paginatedList = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return processedList.value.slice(start, start + perPage.value);
});
const total = computed(() => processedList.value.length);

const statusStats = computed(() => {
  const all = store.refundRequests;
  return {
    pending: all.filter((r) => r.status === "pending").length,
    approved_waiting_pickup: all.filter((r) => r.status === "approved_waiting_pickup").length,
    processing_refund: all.filter((r) => r.status === "processing_refund").length,
    completed: all.filter((r) => r.status === "completed").length,
    rejected: all.filter((r) => r.status === "rejected").length,
    totalAmount: all.filter((r) => r.status === "completed").reduce((sum, r) => sum + r.amount, 0),
  };
});
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader title="Yêu cầu hoàn tiền" subtitle="Xem xét và xử lý các yêu cầu hoàn tiền từ khách hàng." />

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div class="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800/40 dark:bg-yellow-900/20">
        <p class="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">Chờ duyệt</p>
        <p class="mt-1 text-2xl font-bold text-yellow-700 dark:text-yellow-300">{{ statusStats.pending }}</p>
      </div>
      <div class="rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-800/40 dark:bg-sky-900/20">
        <p class="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wide">Chờ lấy hàng</p>
        <p class="mt-1 text-2xl font-bold text-sky-700 dark:text-sky-300">{{ statusStats.approved_waiting_pickup }}</p>
      </div>
      <div class="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-800/40 dark:bg-orange-900/20">
        <p class="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Đang xử lý</p>
        <p class="mt-1 text-2xl font-bold text-orange-700 dark:text-orange-300">{{ statusStats.processing_refund }}</p>
      </div>
      <div class="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800/40 dark:bg-green-900/20">
        <p class="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Hoàn thành</p>
        <p class="mt-1 text-2xl font-bold text-green-700 dark:text-green-300">{{ statusStats.completed }}</p>
      </div>
      <div class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/40 dark:bg-red-900/20">
        <p class="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">Từ chối</p>
        <p class="mt-1 text-2xl font-bold text-red-700 dark:text-red-300">{{ statusStats.rejected }}</p>
      </div>
      <div class="rounded-xl border border-primary-200 bg-primary-50 p-4 dark:border-primary-800/40 dark:bg-primary-900/20">
        <p class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">Đã hoàn tiền</p>
        <p class="mt-1 text-sm font-bold text-primary-700 dark:text-primary-300">{{ formatCurrency(statusStats.totalAmount) }}</p>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <SearchToolbar v-model="searchQuery" placeholder="Tìm mã yêu cầu, mã đơn, khách hàng..." />

      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-slate-500 uppercase">Trạng thái:</span>
        <select v-model="statusFilter" class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <option value="all">Tất cả</option>
          <option value="pending">⏳ Chờ duyệt</option>
          <option value="approved_waiting_pickup">📦 Chờ lấy hàng & hoàn tiền</option>
          <option value="processing_refund">⚙️ Đang xử lý hoàn tiền</option>
          <option value="completed">✅ Đã hoàn tiền</option>
          <option value="rejected">❌ Từ chối</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-slate-500 uppercase">Phương thức:</span>
        <select v-model="methodFilter" class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <option value="all">Tất cả</option>
          <option value="bank_transfer">🏦 Chuyển khoản</option>
          <option value="cash_on_pickup">💵 Tiền mặt</option>
        </select>
      </div>
    </div>

    <!-- Data Table -->
    <AppDataTable
      :columns="columns"
      :data="paginatedList"
      :total="total"
      v-model:page="page"
      v-model:perPage="perPage"
      :sortable="true"
      :sort="sortState"
      @update:sort="handleSortChange"
    >
      <template #title>Danh sách yêu cầu hoàn tiền</template>
      <template #subtitle>Quản lý và xử lý các yêu cầu hoàn tiền của khách hàng.</template>

      <template #cell-id="{ value }">
        <span class="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400 select-all">{{ value }}</span>
      </template>

      <template #cell-orderId="{ row }">
        <button @click="router.push(ROUTES.ADMIN.ORDER_DETAIL(row.orderId))" class="font-mono text-xs font-bold text-primary-600 hover:underline">
          #{{ row.orderId }}
        </button>
      </template>

      <template #cell-customerName="{ row }">
        <div>
          <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ row.customerName }}</p>
          <p class="text-xs text-slate-400 dark:text-slate-500 font-mono">{{ row.userId }}</p>
        </div>
      </template>

      <template #cell-refundMethod="{ value }">
        <span v-if="value === 'cash_on_pickup'" class="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded dark:bg-orange-900/20 dark:text-orange-300">
          💵 Tiền mặt
        </span>
        <span v-else class="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded dark:bg-primary-900/20 dark:text-primary-300">
          🏦 Chuyển khoản
        </span>
      </template>

      <template #cell-amount="{ value }">
        <span class="text-sm font-bold text-rose-600 dark:text-rose-400">{{ formatCurrency(value) }}</span>
      </template>

      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="refund" />
      </template>

      <template #cell-createdAt="{ value }">
        <span class="text-xs text-slate-500 dark:text-slate-400">{{ formatDate(value) }}</span>
      </template>

      <template #cell-actions="{ row }">
        <button
          @click="router.push(ROUTES.ADMIN.REFUND_REQUEST_DETAIL(row.id))"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-primary-900/20"
        >
          <i class="pi pi-eye text-sm"></i>
          Xem & xử lý
        </button>
      </template>

      <template #empty>Chưa có yêu cầu hoàn tiền nào.</template>
    </AppDataTable>
  </div>
</template>
