<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import { ROUTES } from "~/constants/routes";
import { useAdminReviewsQuery } from "~/queries/review/useAdminReviewsQuery";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Danh sách đánh giá - Quản trị SmartFood",
});

const router = useRouter();

const searchQuery = ref("");
const statusFilter = ref<"all" | "pending" | "approved" | "rejected">("all");
const ratingFilter = ref<number | "all">("all");
const page = ref(1);
const perPage = ref(10);
const sortState = ref<{ key: string; direction: "asc" | "desc" } | null>(null);

const columns = [
  { key: "productName", label: "Sản phẩm", sortable: true },
  { key: "customerName", label: "Khách hàng" },
  { key: "rating", label: "Số sao" },
  { key: "comment", label: "Nội dung" },
  { key: "status", label: "Trạng thái" },
  { key: "createdAt", label: "Ngày đánh giá", sortable: true },
  { key: "actions", label: "Thao tác" },
];



const queryParams = computed(() => ({
  page: page.value,
  limit: perPage.value,
  status: statusFilter.value !== "all" ? statusFilter.value : undefined,
  rating: ratingFilter.value !== "all" ? ratingFilter.value : undefined,
  keyword: searchQuery.value ? searchQuery.value.trim() : undefined,
  sortField: sortState.value?.key,
  sortOrder: sortState.value?.direction,
}));

const { data: reviewData, isLoading } = useAdminReviewsQuery(queryParams);

const reviews = computed(() => reviewData.value?.data ?? []);
const total = computed(() => reviewData.value?.pagination?.total ?? 0);

const ratingStats = computed(() => {
  const stats = reviewData.value?.stats ?? [];
  const map = new Map(stats.map((stat) => [stat.star, stat.count]));
  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: map.get(star) || 0,
  }));
});

watch([searchQuery, statusFilter, ratingFilter], () => {
  page.value = 1;
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
            :class="
              s <= stat.star
                ? 'text-amber-400'
                : 'text-slate-200 dark:text-slate-700'
            "
          ></i>
        </div>
        <span
          class="text-lg font-bold"
          :class="
            ratingFilter === stat.star
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-700 dark:text-slate-200'
          "
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
      <SearchToolbar
        v-model="searchQuery"
        placeholder="Tìm sản phẩm, khách hàng, nội dung..."
      />
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-slate-500 uppercase"
          >Trạng thái:</span
        >
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
      :data="reviews"
      :total="total"
      v-model:page="page"
      v-model:perPage="perPage"
      v-model:sort="sortState"
      :sortable="true"
      :loading="isLoading"
    >
      <template #title>Danh sách đánh giá</template>
      <template #subtitle
        >Duyệt và quản lý đánh giá sản phẩm của khách hàng.</template
      >

      <template #cell-productName="{ value }">
        <span class="text-sm font-semibold text-slate-800 dark:text-white">{{
          value
        }}</span>
      </template>

      <template #cell-customerName="{ row }">
        <div>
          <p class="text-sm font-semibold text-slate-900 dark:text-white">
            {{ row.customerName }}
          </p>
          <p class="text-xs text-slate-400">{{ row.userId }}</p>
        </div>
      </template>

      <template #cell-rating="{ value }">
        <div class="flex items-center gap-0.5">
          <i
            v-for="s in 5"
            :key="s"
            class="pi pi-star-fill text-sm"
            :class="
              s <= value
                ? 'text-amber-400'
                : 'text-slate-200 dark:text-slate-700'
            "
          ></i>
          <span
            class="ml-1 text-xs font-bold text-slate-600 dark:text-slate-300"
            >{{ value }}</span
          >
        </div>
      </template>

      <template #cell-comment="{ value }">
        <p
          class="max-w-xs truncate text-sm text-slate-600 dark:text-slate-300"
          :title="value"
        >
          {{ value || "—" }}
        </p>
      </template>

      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="review" />
      </template>

      <template #cell-createdAt="{ value }">
        <span class="text-xs text-slate-500 dark:text-slate-400">{{
          formatDateTime(value, 'short')
        }}</span>
      </template>

      <template #cell-actions="{ row }">
        <NuxtLink
          :to="ROUTES.ADMIN.REVIEW_DETAIL(row.id || row._id)"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <i class="pi pi-eye text-sm"></i>
          Xem & duyệt
        </NuxtLink>
      </template>

      <template #empty>Chưa có đánh giá nào phù hợp.</template>
    </AppDataTable>
  </div>
</template>
