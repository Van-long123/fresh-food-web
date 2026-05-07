<script setup lang="ts">
import { computed, ref } from "vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import { ROUTES } from "~/constants/routes";
import type { AdminVoucherListItem } from "~/types/admin-voucher.type";

definePageMeta({
  layout: "admin",
});

const searchQuery = ref("");
const columns: DataTableColumn[] = [
  { key: "code", label: "Code" },
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "value", label: "Value" },
  { key: "usage", label: "Usage" },
  { key: "expiresAt", label: "Expires" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const { listVouchers } = useVouchersApi();
const { data, pending } = await useAsyncData("admin-vouchers", () =>
  listVouchers(),
);

const vouchers = computed(
  () => (data.value?.data || []) as AdminVoucherListItem[],
);
const filteredVouchers = computed(() => {
  if (!searchQuery.value) return vouchers.value;
  const keyword = searchQuery.value.toLowerCase();
  return vouchers.value.filter((item) =>
    [item.code, item.name, item.type].some((field) =>
      field.toLowerCase().includes(keyword),
    ),
  );
});

const total = computed(() => filteredVouchers.value.length);
</script>

<template>
  <div class="px-4 pt-6 space-y-4">
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Vouchers
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Manage discount codes and promotions.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
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
            placeholder="Search vouchers"
          />
        </div>
        <NuxtLink
          :to="ROUTES.ADMIN.VOUCHER_CREATE"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
        >
          Add voucher
        </NuxtLink>
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="filteredVouchers"
      :total="total"
      :page="1"
      :per-page="10"
      :loading="pending"
    >
      <template #title>Voucher list</template>
      <template #subtitle>Overview of active and upcoming vouchers.</template>
      <template #cell-type="{ value }">
        <span class="capitalize">{{ value }}</span>
      </template>
      <template #cell-value="{ row }">
        <span class="font-medium text-gray-900 dark:text-white">
          {{ row.type === "percent" ? `${row.value}%` : row.value }}
        </span>
      </template>
      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="voucher" />
      </template>
      <template #cell-actions="{ row }">
        <NuxtLink
          :to="ROUTES.ADMIN.VOUCHER_EDIT(row.id)"
          class="text-sm font-medium text-primary-600 hover:underline"
          >Edit</NuxtLink
        >
      </template>
    </DataTable>
  </div>
</template>
