<script setup lang="ts">
import { computed, ref } from "vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import type { AdminPaymentListItem } from "~/types/admin-payment.type";
import { validateRefund } from "~/validations/admin/payment.schema";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const searchQuery = ref("");
const refundReason = ref("");
const refundErrors = ref<Record<string, string>>({});
const refundTarget = ref<AdminPaymentListItem | null>(null);
const showRefundDialog = ref(false);
const refundLoading = ref(false);

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
  showRefundDialog.value = true;
};

const submitRefund = async () => {
  if (!refundTarget.value) return;
  refundErrors.value = validateRefund(
    refundTarget.value.status,
    refundReason.value,
  );
  if (Object.keys(refundErrors.value).length) return;
  refundLoading.value = true;
  try {
    await refundPayment(
      refundTarget.value.id,
      refundReason.value,
      refundTarget.value.status,
    );
    showRefundDialog.value = false;
    refundTarget.value = null;
    refundReason.value = "";
  } catch (error) {
    console.error("Refund error:", error);
  } finally {
    refundLoading.value = false;
  }
};

const cancelRefund = () => {
  showRefundDialog.value = false;
  refundTarget.value = null;
  refundReason.value = "";
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Payments"
      subtitle="Monitor transaction status and issue refunds."
    />

    <SearchToolbar
      v-model="searchQuery"
      placeholder="Search by payment ID, order, or customer..."
    />

    <DataTable
      :columns="columns"
      :data="filteredPayments"
      :total="total"
      :page="1"
      :per-page="10"
      :loading="pending"
    >
      <template #title>Payment history</template>
      <template #subtitle>Track payment lifecycle and issue refunds.</template>
      <template #cell-customer="{ value }">
        <span class="font-medium text-slate-900 dark:text-white">{{
          value
        }}</span>
      </template>
      <template #cell-amount="{ value }">
        <span class="font-medium text-slate-900 dark:text-white">
          ₫{{ Number(value).toLocaleString() }}
        </span>
      </template>
      <template #cell-method="{ value }">
        <span class="capitalize text-slate-600 dark:text-slate-300">{{
          value
        }}</span>
      </template>
      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="payment" />
      </template>
      <template #cell-createdAt="{ value }">
        <span class="text-sm text-slate-500 dark:text-slate-400">{{
          value
        }}</span>
      </template>
      <template #cell-actions="{ row }">
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition"
          :class="
            row.status === 'completed'
              ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-900/20'
              : 'border-slate-300 text-slate-500 cursor-not-allowed opacity-50 dark:border-slate-700 dark:text-slate-400'
          "
          :disabled="row.status !== 'completed'"
          @click="openRefund(row)"
        >
          <i class="pi pi-undo text-xs"></i>
          Refund
        </button>
      </template>
    </DataTable>

    <RefundDialog
      :visible="showRefundDialog"
      v-model:reason="refundReason"
      :payment-id="refundTarget?.id"
      :loading="refundLoading"
      @confirm="submitRefund"
      @cancel="cancelRefund"
      @update:visible="(v) => !v && cancelRefund()"
    />
  </div>
</template>
