<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import { ROUTES } from "~/constants/routes";
import { useAdminMockStore } from "~/stores/useAdminMockStore";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Danh sách đánh giá - Quản trị SmartFood",
});

const store = useAdminMockStore();
const router = useRouter();

const searchQuery = ref("");
const statusFilter = ref<string>("all");
const ratingFilter = ref<number | "all">("all");
const page = ref(1);
const perPage = ref(10);

const columns = [
  { key: "productName", label: "Sản phẩm", sortable: true },
  { key: "customerName", label: "Khách hàng" },
  { key: "rating", label: "Số sao" },
  { key: "comment", label: "Nội dung" },
  { key: "status", label: "Trạng thái" },
  { key: "createdAt", label: "Ngày đánh giá", sortable: true },
  { key: "actions", label: "Thao tác" },
];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const processedList = computed(() => {
  let list = [...store.reviews];
  if (searchQuery.value) {
    const kw = searchQuery.value.toLowerCase();
    list = list.filter(
      (r) =>
        r.productName.toLowerCase().includes(kw) ||
        r.customerName.toLowerCase().includes(kw) ||
        r.comment.toLowerCase().includes(kw),
    );
  }
  if (statusFilter.value !== "all") {
    list = list.filter((r) => r.status === statusFilter.value);
  }
  if (ratingFilter.value !== "all") {
    list = list.filter((r) => r.rating === ratingFilter.value);
  }
  return list;
});

const paginatedList = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return processedList.value.slice(start, start + perPage.value);
});

const total = computed(() => processedList.value.length);

const ratingStats = computed(() => {
  const all = store.reviews;
  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: all.filter((r) => r.rating === star).length,
  }));
});
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Đánh giá sản phẩm"
      subtitle="Kiểm duyệt và quản lý các đánh giá từ khách hàng."
    />

    <!-- Rating stats bar -->
    <div class="grid grid-cols-5 gap-3">
      <button
        v-for="stat in ratingStats"
        :key="stat.star"
        @click="ratingFilter = ratingFilter === stat.star ? 'all' : stat.star"
        :class="[
          'flex flex-col items-center gap-1 rounded-xl border p-3 transition',
          ratingFilter === stat.star
            ? 'border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800',
        ]"
      >
        <div class="flex items-center gap-0.5">
          <i
            v-for="s in 5"
            :key="s"
            class="pi pi-star-fill text-xs"
            :class="s <= stat.star ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'"
          ></i>
        </div>
        <span
          class="text-lg font-bold"
          :class="ratingFilter === stat.star ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'"
        >
          {{ stat.count }}
        </span>
        <span class="text-xs text-slate-500">đánh giá</span>
      </button>
    </div>

    <!-- Filter Bar -->
    <div
      class="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <SearchToolbar v-model="searchQuery" placeholder="Tìm sản phẩm, khách hàng, nội dung..." />
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-slate-500 uppercase">Trạng thái:</span>
        <select
          v-model="statusFilter"
          class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="all">Tất cả</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
      </div>
      <button
        v-if="ratingFilter !== 'all'"
        @click="ratingFilter = 'all'"
        class="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
      >
        <i class="pi pi-star-fill text-amber-400"></i>
        Lọc {{ ratingFilter }} sao
        <i class="pi pi-times"></i>
      </button>
    </div>

    <!-- Data Table -->
    <AppDataTable
      :columns="columns"
      :data="paginatedList"
      :total="total"
      v-model:page="page"
      v-model:perPage="perPage"
      :sortable="true"
    >
      <template #title>Danh sách đánh giá</template>
      <template #subtitle>Duyệt và quản lý đánh giá sản phẩm của khách hàng.</template>

      <template #cell-productName="{ value }">
        <span class="text-sm font-semibold text-slate-800 dark:text-white">{{ value }}</span>
      </template>

      <template #cell-customerName="{ row }">
        <div>
          <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ row.customerName }}</p>
          <p class="text-xs text-slate-400">{{ row.userId }}</p>
        </div>
      </template>

      <template #cell-rating="{ value }">
        <div class="flex items-center gap-0.5">
          <i
            v-for="s in 5"
            :key="s"
            class="pi pi-star-fill text-sm"
            :class="s <= value ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'"
          ></i>
          <span class="ml-1 text-xs font-bold text-slate-600 dark:text-slate-300">{{ value }}</span>
        </div>
      </template>

      <template #cell-comment="{ value }">
        <p class="max-w-xs truncate text-sm text-slate-600 dark:text-slate-300" :title="value">
          {{ value || '—' }}
        </p>
      </template>

      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="review" />
      </template>

      <template #cell-createdAt="{ value }">
        <span class="text-xs text-slate-500 dark:text-slate-400">{{ formatDate(value) }}</span>
      </template>

      <template #cell-actions="{ row }">
        <button
          @click="router.push(ROUTES.ADMIN.REVIEW_DETAIL(row.id))"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <i class="pi pi-eye text-sm"></i>
          Xem & duyệt
        </button>
      </template>

      <template #empty>Chưa có đánh giá nào phù hợp.</template>
    </AppDataTable>
  </div>
</template>
