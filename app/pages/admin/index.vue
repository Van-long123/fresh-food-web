<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Chart from "primevue/chart";
import Tag from "primevue/tag";
import Skeleton from "primevue/skeleton";
import DataTable from "~/components/admin/DataTable.vue";
import { useDashboardOverviewQuery } from "~/queries/dashboard/useDashboardOverviewQuery";
import {
  mapOrdersChartData,
  mapRevenueChartData,
  mapTopProductChartData,
  formatRevenue,
  formatStatRevenue,
  formatStatNumber,
} from "~/utils/dashboardMappers";
import { mapOrderStatus } from "~/utils/formatters";
import { ROUTES } from "~/constants/routes";
import { adminDashboardService } from "~/services/admin/dashboard.service";
import { exportToExcel } from "~/utils/excelExport";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Tổng quan - Quản trị SmartFood",
});

// Query
const { data: overview, isLoading } = useDashboardOverviewQuery();

// Router & Toast
const router = useRouter();
const toast = useToast();

const isExporting = ref(false);
const handleExport = async () => {
  if (isExporting.value) return;
  isExporting.value = true;
  toast.add({
    severity: "info",
    summary: "Đang xuất báo cáo",
    detail: "Vui lòng chờ trong giây lát...",
    life: 3000,
  });

  try {
    const data = await adminDashboardService.exportData();
    // Map backend data to correct sheet names
    const sheets = {
      "Doanh Thu": data.revenueSheet,
      "Đơn Hàng": data.ordersSheet,
      "Sản Phẩm": data.productsSheet,
      "Hoàn Tiền": data.refundsSheet,
    };

    exportToExcel(
      sheets,
      `SmartFood_Dashboard_${new Date().toISOString().slice(0, 10)}`,
    );

    toast.add({
      severity: "success",
      summary: "Thành công",
      detail: "Đã xuất báo cáo Excel.",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Không thể xuất báo cáo. Vui lòng thử lại.",
      life: 3000,
    });
    console.error("Export error:", error);
  } finally {
    isExporting.value = false;
  }
};

// Constants
const TOP_PRODUCT_CHART_COLORS = [
  "#1d4ed8",
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#a5f3fc",
  "#c7d2fe",
];

const statusSeverity: Record<string, string> = {
  pending: "warning",
  confirmed: "info",
  processing: "warn",
  shipping: "help",
  delivered: "success",
  cancelled: "danger",
  returned: "secondary",
};

const orderColumns = [
  { key: "orderCode", label: "Mã đơn" },
  { key: "customerName", label: "Khách hàng" },
  { key: "totalPrice", label: "Tổng tiền" },
  { key: "status", label: "Trạng thái" },
  { key: "createdAt", label: "Ngày" },
  { key: "actions", label: "Thao tác" },
];

const productColumns = [
  { key: "product", label: "Sản phẩm" },
  { key: "category", label: "Danh mục" },
  { key: "soldCount", label: "Đã bán" },
  { key: "revenue", label: "Doanh thu" },
  { key: "stock", label: "Tồn kho" },
];

// Computed: Stats cards
const statsCards = computed(() => {
  const s = overview.value?.stats;
  if (!s) return [];
  return [
    {
      title: "Tổng sản phẩm",
      value: formatStatNumber(s.totalProducts),
      trend: s.growth.products,
      trendLabel: "so với tháng trước",
      icon: "pi pi-box",
    },
    {
      title: "Tổng đơn hàng",
      value: formatStatNumber(s.totalOrders),
      trend: s.growth.orders,
      trendLabel: "so với tháng trước",
      icon: "pi pi-shopping-bag",
    },
    {
      title: "Tổng doanh thu",
      value: formatStatRevenue(s.totalRevenue),
      trend: s.growth.revenue,
      trendLabel: "so với tháng trước",
      icon: "pi pi-wallet",
    },
    {
      title: "Tổng khách hàng",
      value: formatStatNumber(s.totalCustomers),
      trend: s.growth.customers,
      trendLabel: "so với tháng trước",
      icon: "pi pi-users",
    },
  ];
});

// Computed: Revenue Chart
const revenueChartData = computed(() => {
  const raw = overview.value?.revenueChart ?? Array(12).fill(0);
  const { labels, data } = mapRevenueChartData(raw);
  return {
    labels,
    datasets: [
      {
        label: "Doanh thu",
        data,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        tension: 0.35,
        cubicInterpolationMode: "monotone",
        fill: true,
      },
    ],
  };
});

// Computed: Orders Chart
const ordersChartData = computed(() => {
  const raw = overview.value?.ordersChart ?? [];
  const { labels, data } = mapOrdersChartData(raw);
  return {
    labels,
    datasets: [
      {
        label: "Đơn hàng",
        data,
        backgroundColor: "rgba(16, 185, 129, 0.6)",
        borderRadius: 12,
      },
    ],
  };
});

// Computed: Top Products Chart
const topProductChartData = computed(() => {
  const products = overview.value?.topProducts ?? [];
  return mapTopProductChartData(products, TOP_PRODUCT_CHART_COLORS);
});

// Computed: Tables
const recentOrders = computed(() => overview.value?.recentOrders ?? []);
const topProducts = computed(() => overview.value?.topProducts ?? []);

// Computed: Formatted recent orders for DataTable
const recentOrdersForTable = computed(() =>
  recentOrders.value.map((o) => ({
    ...o,
    formattedTotal: `${(o.totalPrice || 0).toLocaleString("vi-VN")}đ`,
    formattedDate: new Date(o.createdAt).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  })),
);

// Computed: Formatted top products for DataTable
const topProductsForTable = computed(() =>
  topProducts.value.map((p) => ({
    ...p,
    formattedRevenue: formatRevenue(p.revenue),
  })),
);

// Chart Options
const baseChartOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
    y: {
      grid: { color: "rgba(148, 163, 184, 0.2)" },
      ticks: { color: "#94a3b8" },
      beginAtZero: true,
    },
  },
};

const revenueChartOptions = {
  ...baseChartOptions,
  plugins: {
    ...baseChartOptions.plugins,
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(context.parsed.y);
          }
          return label;
        },
      },
    },
  },
  scales: {
    ...baseChartOptions.scales,
    y: {
      ...baseChartOptions.scales.y,
      ticks: {
        ...baseChartOptions.scales.y.ticks,
        callback: function (value: any) {
          if (value >= 1000000000) return value / 1000000000 + " Tỷ";
          if (value >= 1000000) return value / 1000000 + " Tr";
          if (value >= 1000) return value / 1000 + " k";
          return value;
        },
      },
    },
  },
};

const ordersChartOptions = {
  ...baseChartOptions,
  scales: {
    ...baseChartOptions.scales,
    y: {
      ...baseChartOptions.scales.y,
      ticks: {
        ...baseChartOptions.scales.y.ticks,
        stepSize: 1,
      },
    },
  },
};

const topProductChartOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  cutout: "55%",
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <!-- Header -->
    <section
      class="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80"
    >
      <div
        class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
          >
            Tổng quan phân tích
          </p>
          <h1
            class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
          >
            Tổng quan
          </h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Tổng quan doanh số, đơn hàng và hiệu suất tồn kho.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isExporting"
            @click="handleExport"
          >
            <i
              class="pi mr-1.5 text-xs"
              :class="isExporting ? 'pi-spinner pi-spin' : 'pi-download'"
            ></i>
            {{ isExporting ? "Đang xuất..." : "Xuất báo cáo" }}
          </button>
        </div>
      </div>
    </section>

    <!-- Stats Cards -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Skeleton loading -->
      <template v-if="isLoading">
        <div
          v-for="n in 4"
          :key="n"
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <Skeleton height="1.5rem" width="60%" class="mb-3" />
          <Skeleton height="2.5rem" width="80%" class="mb-2" />
          <Skeleton height="1rem" width="50%" />
        </div>
      </template>

      <template v-else>
        <StatCard
          v-for="stat in statsCards"
          :key="stat.title"
          :title="stat.title"
          :value="stat.value"
          :trend="stat.trend"
          :trend-label="stat.trendLabel"
        >
          <template #icon>
            <i :class="stat.icon" class="text-xl"></i>
          </template>
        </StatCard>
      </template>
    </div>

    <!-- Revenue & Orders Charts -->
    <div class="grid gap-4 xl:grid-cols-3">
      <section
        class="xl:col-span-2 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Phân tích doanh thu
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-300">
              Hiệu suất doanh thu trong 12 tháng gần nhất.
            </p>
          </div>
          <!-- <button
            class="text-sm font-medium text-primary-600 hover:underline"
            @click="router.push(ROUTES.ADMIN.PAYMENTS)"
          >
            Xem báo cáo
          </button> -->
        </div>
        <div class="mt-6 h-72">
          <Skeleton v-if="isLoading" height="100%" />
          <Chart
            v-else
            type="line"
            :data="revenueChartData"
            :options="revenueChartOptions"
            class="h-full w-full"
          />
        </div>
      </section>

      <section
        class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Xu hướng đơn hàng
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-300">
              Số đơn trong 7 ngày gần nhất.
            </p>
          </div>
          <button
            class="text-sm font-medium text-primary-600 hover:underline"
            @click="router.push(ROUTES.ADMIN.ORDERS)"
          >
            Xem xét
          </button>
        </div>
        <div class="mt-6 h-72">
          <Skeleton v-if="isLoading" height="100%" />
          <Chart
            v-else
            type="bar"
            :data="ordersChartData"
            :options="ordersChartOptions"
            class="h-full w-full"
          />
        </div>
      </section>
    </div>

    <!-- Top Products Chart & Quick Actions -->
    <div class="grid gap-4 xl:grid-cols-3">
      <section
        class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Sản phẩm bán chạy nhất
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-300">
              Phân bổ theo sản lượng bán.
            </p>
          </div>
          <button
            class="text-sm font-medium text-primary-600 hover:underline"
            @click="router.push(ROUTES.ADMIN.PRODUCTS)"
          >
            Quản lý
          </button>
        </div>

        <div class="mt-6 flex flex-col items-center justify-center">
          <!-- Skeleton -->
          <template v-if="isLoading">
            <Skeleton
              shape="circle"
              width="11rem"
              height="11rem"
              class="mb-4"
            />
            <div class="grid grid-cols-2 gap-2 w-full mt-2">
              <Skeleton v-for="n in 6" :key="n" height="1rem" />
            </div>
          </template>

          <template v-else>
            <div class="h-44 w-44">
              <Chart
                type="doughnut"
                :data="topProductChartData"
                :options="topProductChartOptions"
                style="
                  display: block;
                  box-sizing: border-box;
                  height: 180px;
                  width: 206px;
                "
              />
            </div>
            <div
              class="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 w-full border-t border-slate-100 dark:border-slate-800 pt-4"
            >
              <div
                v-for="(item, index) in topProducts"
                :key="item._id"
                class="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                <span
                  class="h-2.5 w-2.5 rounded-full shrink-0"
                  :style="{ backgroundColor: TOP_PRODUCT_CHART_COLORS[index] }"
                />
                <span class="truncate" :title="item.title">{{
                  item.title
                }}</span>
              </div>
            </div>
          </template>
        </div>
      </section>

      <!-- Quick Actions -->
      <section
        class="xl:col-span-2 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Thao tác nhanh
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-300">
              Các lối tắt quản trị phổ biến giúp tối ưu quy trình.
            </p>
          </div>
        </div>
        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            :to="ROUTES.ADMIN.PRODUCT_CREATE"
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10"
            >
              <i class="pi pi-plus"></i>
            </span>
            Tạo sản phẩm
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.ADMIN.VOUCHER_CREATE"
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
            >
              <i class="pi pi-ticket"></i>
            </span>
            Phát hành mã giảm giá
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.ADMIN.USER_CREATE"
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10"
            >
              <i class="pi pi-user-plus"></i>
            </span>
            Thêm khách hàng
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.ADMIN.PAYMENTS"
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-700"
            >
              <i class="pi pi-chart-line"></i>
            </span>
            Xem phân tích
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.ADMIN.ORDERS"
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10"
            >
              <i class="pi pi-shopping-cart"></i>
            </span>
            Quản lý đơn hàng
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.ADMIN.REFUND_REQUESTS"
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10"
            >
              <i class="pi pi-undo"></i>
            </span>
            Yêu cầu hoàn tiền
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.ADMIN.ARTICLE_CREATE"
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10"
            >
              <i class="pi pi-pencil"></i>
            </span>
            Viết bài mới
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.ADMIN.REVIEWS"
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10"
            >
              <i class="pi pi-star"></i>
            </span>
            Đánh giá & Phản hồi
          </NuxtLink>
        </div>
      </section>
    </div>

    <!-- Recent Orders & Top Products Tables -->
    <div class="grid gap-4 xl:grid-cols-2">
      <!-- Đơn hàng gần đây -->
      <DataTable
        :columns="orderColumns"
        :data="recentOrdersForTable"
        :total="recentOrdersForTable.length"
        :page="1"
        :per-page="5"
        hide-pagination
      >
        <template #title>Đơn hàng gần đây</template>
        <template #subtitle
          >Theo dõi các đơn mới nhất và trạng thái xử lý.</template
        >
        <template #toolbar>
          <NuxtLink
            :to="ROUTES.ADMIN.ORDERS"
            class="text-xs font-medium text-primary-600 hover:underline whitespace-nowrap"
          >
            Xem tất cả →
          </NuxtLink>
        </template>
        <template #cell-totalPrice="{ row }">
          {{ row.formattedTotal }}
        </template>

        <template #cell-createdAt="{ row }">
          {{ row.formattedDate }}
        </template>

        <template #cell-status="{ value }">
          <Tag
            :value="mapOrderStatus(value)"
            :severity="statusSeverity[value] || 'secondary'"
          />
        </template>

        <template #cell-actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
              :title="'Xem chi tiết đơn hàng'"
              @click="row && router.push(ROUTES.ADMIN.ORDER_DETAIL(row._id))"
            >
              <i class="pi pi-eye text-xs"></i>
            </button>
            <NuxtLink
              :to="ROUTES.ADMIN.ORDERS"
              class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
              title="Xem tất cả đơn hàng"
            >
              <i class="pi pi-ellipsis-h text-xs"></i>
            </NuxtLink>
          </div>
        </template>
      </DataTable>

      <!-- Sản phẩm nổi bật -->
      <DataTable
        :columns="productColumns"
        :data="topProductsForTable"
        :total="topProductsForTable.length"
        :page="1"
        :per-page="7"
        hide-pagination
      >
        <template #title>Sản phẩm nổi bật</template>
        <template #subtitle>Những sản phẩm có hiệu suất tốt nhất.</template>
        <template #toolbar>
          <NuxtLink
            :to="ROUTES.ADMIN.PRODUCTS"
            class="text-xs font-medium text-primary-600 hover:underline whitespace-nowrap"
          >
            Xem tất cả →
          </NuxtLink>
        </template>
        <template #cell-product="{ row }">
          <div class="flex items-center gap-3">
            <img
              :src="row.thumbnail || 'https://via.placeholder.com/40'"
              :alt="row.title"
              class="h-10 w-10 rounded-xl object-cover"
            />
            <div>
              <p class="font-medium text-slate-900 dark:text-white">
                {{ row.title }}
              </p>
              <!-- <p class="text-xs text-slate-500 dark:text-slate-400">
                SKU: {{ row._id?.slice(-6)?.toUpperCase() }}
              </p> -->
            </div>
          </div>
        </template>

        <template #cell-revenue="{ row }">
          {{ row.formattedRevenue }}
        </template>
      </DataTable>
    </div>
  </div>
</template>
