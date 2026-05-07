<script setup lang="ts">
import { computed, ref } from "vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import { ROUTES } from "~/constants/routes";
import type { AdminOrderListItem } from "~/types/admin-order.type";

definePageMeta({
  layout: "admin",
});

const searchQuery = ref("");
const columns: DataTableColumn[] = [
  { key: "id", label: "Order" },
  { key: "customer", label: "Customer" },
  { key: "items", label: "Items" },
  { key: "total", label: "Total" },
  { key: "paymentStatus", label: "Payment" },
  { key: "orderStatus", label: "Status" },
  { key: "createdAt", label: "Date" },
  { key: "actions", label: "Actions" },
];

const { listOrders } = useOrdersApi();
const { data, pending } = await useAsyncData("admin-orders", () =>
  listOrders(),
);

const orders = computed(() => (data.value?.data || []) as AdminOrderListItem[]);
const filteredOrders = computed(() => {
  if (!searchQuery.value) return orders.value;
  const keyword = searchQuery.value.toLowerCase();
  return orders.value.filter((item) =>
    [item.id, item.customerName, item.customerEmail].some((field) =>
      field.toLowerCase().includes(keyword),
    ),
  );
});

const total = computed(() => filteredOrders.value.length);
</script>

<template>
  <div class="px-4 pt-6 space-y-4">
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Orders
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Track purchases, payment status, and fulfillment progress.
        </p>
      </div>
      <div class="relative w-full sm:max-w-xs">
        <div
          class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
        >
          <svg
            class="w-4 h-4 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          class="w-full pl-9 pr-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Search orders"
        />
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="filteredOrders"
      :total="total"
      :page="1"
      :per-page="10"
      :loading="pending"
    >
      <template #title>Order list</template>
      <template #subtitle>Latest orders with quick access to details.</template>
      <template #cell-customer="{ row }">
        <div>
          <p class="font-medium text-gray-900 dark:text-white">
            {{ row.customerName }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ row.customerEmail }}
          </p>
        </div>
      </template>
      <template #cell-total="{ value }">
        <span class="font-medium text-gray-900 dark:text-white"
          >{{ Number(value).toFixed(2) }} $</span
        >
      </template>
      <template #cell-paymentStatus="{ value }">
        <StatusBadge :status="value" type="payment" />
      </template>
      <template #cell-orderStatus="{ value }">
        <StatusBadge :status="value" type="order" />
      </template>
      <template #cell-actions="{ row }">
        <NuxtLink
          :to="ROUTES.ADMIN.ORDER_DETAIL(row.id)"
          class="text-sm font-medium text-primary-600 hover:underline"
          >View</NuxtLink
        >
      </template>
    </DataTable>
  </div>
</template>
