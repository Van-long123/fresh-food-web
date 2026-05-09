<script setup lang="ts">
import { computed, ref } from "vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import { ROUTES } from "~/constants/routes";
import type { AdminVoucherListItem } from "~/types/admin-voucher.type";

definePageMeta({
  layout: "admin",
});

const searchQuery = ref("");
const deleteTarget = ref<AdminVoucherListItem | null>(null);
const deleteLoading = ref(false);
const showDeleteDialog = ref(false);

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

const openDeleteDialog = (voucher: AdminVoucherListItem) => {
  deleteTarget.value = voucher;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;
  try {
    console.log("Deleting voucher:", deleteTarget.value.id);
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
      title="Vouchers"
      subtitle="Manage discount codes and promotions."
      :primary-action="{
        label: 'Add voucher',
        icon: 'pi pi-plus',
        onClick: () => $router.push(ROUTES.ADMIN.VOUCHER_CREATE),
      }"
    />

    <SearchToolbar v-model="searchQuery" placeholder="Search vouchers..." />

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
        <span class="font-medium text-slate-900 dark:text-white">
          {{ row.type === "percent" ? `${row.value}%` : row.value }}
        </span>
      </template>
      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="voucher" />
      </template>
      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.VOUCHER_EDIT(row.id)"
          @delete="openDeleteDialog(row)"
          show-delete
        />
      </template>
    </DataTable>

    <ConfirmDialog
      :visible="showDeleteDialog"
      title="Delete Voucher"
      :message="`Are you sure you want to delete voucher '${deleteTarget?.code}'? This action cannot be undone.`"
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
