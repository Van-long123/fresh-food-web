<script setup lang="ts">
import { computed, ref } from "vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import { ROUTES } from "~/constants/routes";
import type { AdminOrderListItem } from "~/types/admin-order.type";

definePageMeta({
  layout: "admin",
});

const searchQuery = ref("");
const deleteTarget = ref<AdminOrderListItem | null>(null);
const deleteLoading = ref(false);
const showDeleteDialog = ref(false);

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

const openDeleteDialog = (order: AdminOrderListItem) => {
  deleteTarget.value = order;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;
  try {
    console.log("Deleting order:", deleteTarget.value.id);
    showDeleteDialog.value = false;
    deleteTarget.value = null;
  } catch (error) {
    console.error("Delete error:", error);
  } finally {
    deleteLoading.value = false;
  }
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
  deleteTarget.value = null;
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Orders"
      subtitle="Track purchases, payment status, and fulfillment progress."
    />

    <SearchToolbar v-model="searchQuery" placeholder="Search orders..." />

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
          <p class="font-medium text-slate-900 dark:text-white">
            {{ row.customerName }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            {{ row.customerEmail }}
          </p>
        </div>
      </template>
      <template #cell-total="{ value }">
        <span class="font-medium text-slate-900 dark:text-white"
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
        <ActionButtons
          :edit-href="ROUTES.ADMIN.ORDER_DETAIL(row.id)"
          @delete="openDeleteDialog(row)"
          show-edit
          show-delete
          show-view
        />
      </template>
    </DataTable>

    <ConfirmDialog
      :visible="showDeleteDialog"
      title="Delete Order"
      :message="`Are you sure you want to delete order '${deleteTarget?.id}'? This action cannot be undone.`"
      confirm-label="Delete"
      cancel-label="Cancel"
      :loading="deleteLoading"
      danger
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      @update:visible="(v) => !v && cancelDelete()"
    />
  </div>
</template>
