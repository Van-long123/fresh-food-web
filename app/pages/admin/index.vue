<script setup lang="ts">
import Chart from "primevue/chart";
import Tag from "primevue/tag";

definePageMeta({
  layout: "admin",
});

useHead({
  title: "Dashboard - Admin SmartFood",
});

const stats = [
  {
    title: "Total products",
    value: "1,248",
    trend: 4.2,
    trendLabel: "vs last month",
    icon: "pi pi-box",
  },
  {
    title: "Total orders",
    value: "2,483",
    trend: 12.4,
    trendLabel: "vs last month",
    icon: "pi pi-shopping-bag",
  },
  {
    title: "Total revenue",
    value: "$84,920",
    trend: 8.2,
    trendLabel: "vs last month",
    icon: "pi pi-wallet",
  },
  {
    title: "Total customers",
    value: "892",
    trend: 6.1,
    trendLabel: "vs last month",
    icon: "pi pi-users",
  },
];

const recentOrders = [
  {
    id: "#ORD-1042",
    customer: "Nguyen Van An",
    total: "$128.50",
    status: "Confirmed",
    date: "May 6, 2026",
  },
  {
    id: "#ORD-1041",
    customer: "Tran Minh Thu",
    total: "$64.00",
    status: "Preparing",
    date: "May 6, 2026",
  },
  {
    id: "#ORD-1040",
    customer: "Le Quang Huy",
    total: "$212.90",
    status: "Shipping",
    date: "May 5, 2026",
  },
  {
    id: "#ORD-1039",
    customer: "Pham Anh Dao",
    total: "$45.00",
    status: "Delivered",
    date: "May 5, 2026",
  },
  {
    id: "#ORD-1038",
    customer: "Vo Minh Khoa",
    total: "$97.30",
    status: "Pending",
    date: "May 4, 2026",
  },
];

const topProducts = [
  {
    id: 1,
    product: "Organic Salmon Bowl",
    category: "Meal Box",
    sold: 312,
    revenue: "$6,248",
    stock: 64,
    image: "https://flowbite.com/docs/images/products/apple-watch.png",
  },
  {
    id: 2,
    product: "Fresh Avocado Salad",
    category: "Healthy Food",
    sold: 285,
    revenue: "$4,920",
    stock: 42,
    image: "https://flowbite.com/docs/images/products/apple-watch.png",
  },
  {
    id: 3,
    product: "Premium Beef Steak",
    category: "Ready Meals",
    sold: 244,
    revenue: "$7,105",
    stock: 28,
    image: "https://flowbite.com/docs/images/products/apple-watch.png",
  },
  {
    id: 4,
    product: "Vegan Bento Set",
    category: "Meal Box",
    sold: 198,
    revenue: "$3,740",
    stock: 91,
    image: "https://flowbite.com/docs/images/products/apple-watch.png",
  },
  {
    id: 5,
    product: "Healthy Granola Pack",
    category: "Snacks",
    sold: 176,
    revenue: "$2,890",
    stock: 120,
    image: "https://flowbite.com/docs/images/products/apple-watch.png",
  },
];

const orderColumns = [
  { key: "id", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
  { key: "date", label: "Date" },
  { key: "actions", label: "Actions" },
];

const productColumns = [
  { key: "product", label: "Product" },
  { key: "category", label: "Category" },
  { key: "sold", label: "Sold" },
  { key: "revenue", label: "Revenue" },
  { key: "stock", label: "Stock" },
];

const statusSeverity: Record<string, string> = {
  Pending: "warning",
  Confirmed: "info",
  Preparing: "warn",
  Shipping: "help",
  Delivered: "success",
};

const revenueChartData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Revenue",
      data: [12, 18, 22, 19, 25, 32, 35, 30, 28, 36, 40, 45],
      borderColor: "#2563eb",
      backgroundColor: "rgba(37, 99, 235, 0.12)",
      tension: 0.35,
      fill: true,
    },
  ],
};

const ordersChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Orders",
      data: [120, 190, 170, 220, 260, 210, 240],
      backgroundColor: "rgba(16, 185, 129, 0.6)",
      borderRadius: 12,
    },
  ],
};

const topProductChartData = {
  labels: topProducts.map((item) => item.product),
  datasets: [
    {
      data: topProducts.map((item) => item.sold),
      backgroundColor: ["#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"],
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
            Analytics Overview
          </p>
          <h1
            class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
          >
            Dashboard
          </h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Overview of sales, orders, and inventory performance.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
          >
            Export report
          </button>
          <button
            class="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            Create campaign
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
              Revenue analytics
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-300">
              Last 12 months revenue performance.
            </p>
          </div>
          <button class="text-sm font-medium text-primary-600 hover:underline">
            View report
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
              Orders trend
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-300">
              Orders across the last 7 days.
            </p>
          </div>
          <button class="text-sm font-medium text-primary-600 hover:underline">
            Review
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
              Top selling products
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-300">
              Sales volume breakdown.
            </p>
          </div>
          <button class="text-sm font-medium text-primary-600 hover:underline">
            Manage
          </button>
        </div>
        <div class="mt-6 h-72">
          <Chart
            type="doughnut"
            :data="topProductChartData"
            :options="{ plugins: { legend: { position: 'bottom' } } }"
          />
        </div>
      </section>
      <section
        class="xl:col-span-2 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Quick actions
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-300">
              Common admin tasks for faster workflows.
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
            Create product
          </button>
          <button
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
            >
              <i class="pi pi-ticket"></i>
            </span>
            Issue voucher
          </button>
          <button
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10"
            >
              <i class="pi pi-user-plus"></i>
            </span>
            Add customer
          </button>
          <button
            class="flex flex-col items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-700"
            >
              <i class="pi pi-chart-line"></i>
            </span>
            View analytics
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
        <template #title>Recent orders</template>
        <template #subtitle
          >Track the latest purchases and fulfillment status.</template
        >
        <template #cell-status="{ value }">
          <Tag
            :value="value"
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
        <template #title>Top products</template>
        <template #subtitle>Best performing items this week.</template>
        <template #cell-product="{ row }">
          <div class="flex items-center gap-3">
            <img
              :src="row.image"
              alt="Product"
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
