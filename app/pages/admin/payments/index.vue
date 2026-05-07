<script setup lang="ts">
import { computed, ref } from "vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import type { AdminPaymentListItem } from "~/types/admin-payment.type";
import { validateRefund } from "~/validations/admin/payment.schema";

definePageMeta({
  layout: "admin",
});

const searchQuery = ref("");
const refundReason = ref("");
const refundErrors = ref<Record<string, string>>({});
const refundTarget = ref<AdminPaymentListItem | null>(null);

const columns: DataTableColumn[] = [
  { key: "id", label: "Payment ID" },
  { key: "orderId", label: "Order" },
  { key: "customer", label: "Customer" },
  { key: "method", label: "Method" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "transactionId", label: "Transaction" },
  { key: "createdAt", label: "Date" },
  { key: "actions", label: "Actions" },
];

const { listPayments, refundPayment } = usePaymentsApi();
const { data, pending } = await useAsyncData("admin-payments", () =>
  listPayments(),
);

const payments = computed(
  () => (data.value?.data || []) as AdminPaymentListItem[],
);
const filteredPayments = computed(() => {
  if (!searchQuery.value) return payments.value;
  const keyword = searchQuery.value.toLowerCase();
  return payments.value.filter((item) =>
    [item.id, item.orderId, item.customer, item.method].some((field) =>
      field.toLowerCase().includes(keyword),
    ),
  );
});

const total = computed(() => filteredPayments.value.length);

const openRefund = (payment: AdminPaymentListItem) => {
  refundTarget.value = payment;
  refundReason.value = "";
  refundErrors.value = {};
};

const submitRefund = async () => {
  if (!refundTarget.value) return;
  refundErrors.value = validateRefund(
    refundTarget.value.status,
    refundReason.value,
  );
  if (Object.keys(refundErrors.value).length) return;
  await refundPayment(
    refundTarget.value.id,
    refundReason.value,
    refundTarget.value.status,
  );
  refundTarget.value = null;
};
</script>

<template>
  <div class="px-4 pt-6 space-y-4">
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Payments
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Monitor transaction status and issue refunds.
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
          placeholder="Search payments"
        />
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="filteredPayments"
      :total="total"
      :page="1"
      :per-page="10"
      :loading="pending"
    >
      <template #title>Payment history</template>
      <template #subtitle>Track payment lifecycle and refunds.</template>
      <template #cell-amount="{ value }">
        <span class="font-medium text-gray-900 dark:text-white"
          >${{ Number(value).toFixed(2) }}</span
        >
      </template>
      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="payment" />
      </template>
      <template #cell-actions="{ row }">
        <button
          class="text-sm font-medium text-primary-600 hover:underline"
          :disabled="row.status !== 'completed'"
          @click="openRefund(row)"
        >
          Refund
        </button>
      </template>
    </DataTable>

    <div
      v-if="refundTarget"
      class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Refund {{ refundTarget.id }}
        </h2>
        <button
          class="text-sm text-gray-500 hover:underline"
          @click="refundTarget = null"
        >
          Close
        </button>
      </div>
      <div class="mt-4 grid gap-3">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Provide a reason before issuing a refund.
        </p>
        <textarea
          v-model="refundReason"
          rows="3"
          class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
        ></textarea>
        <p v-if="refundErrors.reason" class="text-xs text-red-500">
          {{ refundErrors.reason }}
        </p>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          @click="submitRefund"
        >
          Confirm refund
        </button>
      </div>
    </div>
  </div>
</template>
