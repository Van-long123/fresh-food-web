<script setup lang="ts">
import Chart from "primevue/chart";
import Tag from "primevue/tag";
import DataTable from "~/components/admin/DataTable.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Tổng quan - Quản trị SmartFood",
});

const stats = [
  {
    title: "Tổng sản phẩm",
    value: "1.248",
    trend: 4.2,
    trendLabel: "so với tháng trước",
    icon: "pi pi-box",
  },
  {
    title: "Tổng đơn hàng",
    value: "2.483",
    trend: 12.4,
    trendLabel: "so với tháng trước",
    icon: "pi pi-shopping-bag",
  },
  {
    title: "Tổng doanh thu",
    value: "2.130.000.000đ",
    trend: 8.2,
    trendLabel: "so với tháng trước",
    icon: "pi pi-wallet",
  },
  {
    title: "Tổng khách hàng",
    value: "892",
    trend: 6.1,
    trendLabel: "so với tháng trước",
    icon: "pi pi-users",
  },
];

const recentOrders = [
  {
    id: "#ORD-1042",
    customer: "Nguyễn Văn An",
    total: "3.200.000đ",
    status: "confirmed",
    date: "06/05/2026",
  },
  {
    id: "#ORD-1041",
    customer: "Trần Minh Thu",
    total: "1.600.000đ",
    status: "preparing",
    date: "06/05/2026",
  },
  {
    id: "#ORD-1040",
    customer: "Lê Quang Huy",
    total: "5.300.000đ",
    status: "shipping",
    date: "05/05/2026",
  },
  {
    id: "#ORD-1039",
    customer: "Phạm Anh Đào",
    total: "1.100.000đ",
    status: "delivered",
    date: "05/05/2026",
  },
  {
    id: "#ORD-1038",
    customer: "Võ Minh Khoa",
    total: "2.400.000đ",
    status: "pending",
    date: "04/05/2026",
  },
];

const topProducts = [
  {
    id: 1,
    product: "Tô cá hồi hữu cơ",
    category: "Suất ăn",
    sold: 312,
    revenue: "156.200.000đ",
    stock: 64,
    image: "https://flowbite.com/docs/images/products/apple-watch.png",
  },
  {
    id: 2,
    product: "Salad bơ tươi",
    category: "Đồ ăn lành mạnh",
    sold: 285,
    revenue: "123.000.000đ",
    stock: 42,
    image: "https://flowbite.com/docs/images/products/apple-watch.png",
  },
  {
    id: 3,
    product: "Bít tết bò cao cấp",
    category: "Suất ăn sẵn",
    sold: 244,
    revenue: "177.600.000đ",
    stock: 28,
    image: "https://flowbite.com/docs/images/products/apple-watch.png",
  },
  {
    id: 4,
    product: "Set bento thuần chay",
    category: "Suất ăn",
    sold: 198,
    revenue: "93.500.000đ",
    stock: 91,
    image: "https://flowbite.com/docs/images/products/apple-watch.png",
  },
  {
    id: 5,
    product: "Hộp granola lành mạnh",
    category: "Ăn vặt",
    sold: 176,
    revenue: "72.250.000đ",
    stock: 120,
    image: "https://flowbite.com/docs/images/products/apple-watch.png",
  },
];

const orderColumns = [
  { key: "id", label: "Mã đơn" },
  { key: "customer", label: "Khách hàng" },
  { key: "total", label: "Tổng tiền" },
  { key: "status", label: "Trạng thái" },
  { key: "date", label: "Ngày" },
  { key: "actions", label: "Thao tác" },
];

const productColumns = [
  { key: "product", label: "Sản phẩm" },
  { key: "category", label: "Danh mục" },
  { key: "sold", label: "Đã bán" },
  { key: "revenue", label: "Doanh thu" },
  { key: "stock", label: "Tồn kho" },
];

const statusSeverity: Record<string, string> = {
  pending: "warning",
  confirmed: "info",
  preparing: "warn",
  shipping: "help",
  delivered: "success",
};

const revenueChartData = {
  labels: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  datasets: [
    {
      label: "Doanh thu",
      data: [12, 18, 22, 19, 25, 32, 35, 30, 28, 36, 40, 45],
      borderColor: "#2563eb",
      backgroundColor: "rgba(37, 99, 235, 0.12)",
      tension: 0.35,
      fill: true,
    },
  ],
};

const ordersChartData = {
  labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
  datasets: [
    {
      label: "Đơn hàng",
      data: [120, 190, 170, 220, 260, 210, 240],
      backgroundColor: "rgba(16, 185, 129, 0.6)",
      borderRadius: 12,
    },
  ],
};

const topProductChartColors = [
  "#1d4ed8",
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
];

const topProductChartData = {
  labels: topProducts.map((item) => item.product),
  datasets: [
    {
      data: topProducts.map((item) => item.sold),
      backgroundColor: topProductChartColors,
    },
  ],
};

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
    },
  },
};

const topProductChartOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: "55%",
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
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
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
          >
            Xuất báo cáo
          </button>
        </div>
      </div>
    </section>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        v-for="stat in stats"
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
    </div>

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
          <button class="text-sm font-medium text-primary-600 hover:underline">
            Xem báo cáo
          </button>
        </div>
        <div class="mt-6 h-72">
          <Chart
            type="line"
            :data="revenueChartData"
            :options="baseChartOptions"
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
          <button class="text-sm font-medium text-primary-600 hover:underline">
            Xem xét
          </button>
        </div>
        <div class="mt-6 h-72">
          <Chart
            type="bar"
            :data="ordersChartData"
            :options="baseChartOptions"
          />
        </div>
      </section>
    </div>

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
          <button class="text-sm font-medium text-primary-600 hover:underline">
            Quản lý
          </button>
        </div>
        <div class="mt-6 flex flex-col items-center justify-center">
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
              :key="item.id"
              class="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              <span
                class="h-2.5 w-2.5 rounded-full shrink-0"
                :style="{ backgroundColor: topProductChartColors[index] }"
              ></span>
              <span class="truncate" :title="item.product">{{
                item.product
              }}</span>
            </div>
          </div>
        </div>
      </section>
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
          <button
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10"
            >
              <i class="pi pi-plus"></i>
            </span>
            Tạo sản phẩm
          </button>
          <button
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
            >
              <i class="pi pi-ticket"></i>
            </span>
            Phát hành mã giảm giá
          </button>
          <button
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10"
            >
              <i class="pi pi-user-plus"></i>
            </span>
            Thêm khách hàng
          </button>
          <button
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-700"
            >
              <i class="pi pi-chart-line"></i>
            </span>
            Xem phân tích
          </button>
          <button
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10"
            >
              <i class="pi pi-shopping-cart"></i>
            </span>
            Quản lý đơn hàng
          </button>
          <button
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10"
            >
              <i class="pi pi-undo"></i>
            </span>
            Yêu cầu hoàn tiền
          </button>
          <button
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10"
            >
              <i class="pi pi-pencil"></i>
            </span>
            Viết bài mới
          </button>
          <button
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10"
            >
              <i class="pi pi-star"></i>
            </span>
            Đánh giá & Phản hồi
          </button>
        </div>
      </section>
    </div>

    <div class="grid gap-4 xl:grid-cols-2">
      <DataTable
        :columns="orderColumns"
        :data="recentOrders"
        :total="recentOrders.length"
        :page="1"
        :per-page="5"
      >
        <template #title>Đơn hàng gần đây</template>
        <template #subtitle
          >Theo dõi các đơn mới nhất và trạng thái xử lý.</template
        >
        <template #cell-status="{ value }">
          <Tag
            :value="
              value === 'pending'
                ? 'Chờ xử lý'
                : value === 'confirmed'
                  ? 'Đã xác nhận'
                  : value === 'preparing'
                    ? 'Đang chế biến'
                    : value === 'shipping'
                      ? 'Đang giao hàng'
                      : value === 'delivered'
                        ? 'Đã giao'
                        : value
            "
            :severity="statusSeverity[value] || 'secondary'"
          />
        </template>
        <template #cell-actions>
          <div class="flex items-center gap-2">
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
            >
              <i class="pi pi-eye text-xs"></i>
            </button>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
            >
              <i class="pi pi-ellipsis-h text-xs"></i>
            </button>
          </div>
        </template>
      </DataTable>

      <DataTable
        :columns="productColumns"
        :data="topProducts"
        :total="topProducts.length"
        :page="1"
        :per-page="5"
      >
        <template #title>Sản phẩm nổi bật</template>
        <template #subtitle
          >Những sản phẩm có hiệu suất tốt nhất tuần này.</template
        >
        <template #cell-product="{ row }">
          <div class="flex items-center gap-3">
            <img
              :src="row.image"
              alt="Sản phẩm"
              class="h-10 w-10 rounded-xl object-cover"
            />
            <div>
              <p class="font-medium text-slate-900 dark:text-white">
                {{ row.product }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                SKU: {{ row.id }}
              </p>
            </div>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>
