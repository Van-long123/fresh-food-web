<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import { API_ENDPOINTS } from "~/constants/api";
import { ROUTES } from "~/constants/routes";
import type { AdminProductListItem } from "~/types/admin-product.type";

definePageMeta({
  layout: "admin",
});

const searchQuery = ref("");
const deleteTarget = ref<AdminProductListItem | null>(null);
const deleteLoading = ref(false);
const showDeleteDialog = ref(false);

const columns: DataTableColumn[] = [
  { key: "product", label: "Product" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "status", label: "Status" },
  { key: "updatedAt", label: "Updated" },
  { key: "actions", label: "Actions" },
];

const data = ref([]);
const pending = ref(false);

const fetchProducts = async () => {
  try {
    pending.value = true;
    const response = await getAuthorizedAxios().get(API_ENDPOINTS.PRODUCT.LIST);
    data.value = response.data.data;
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});

const products = computed(() => {
  return (data.value || []).map((item: any) => ({
    ...item,
    id: item._id,
    sku: item.sku || "N/A",
    category: item.category || "Uncategorized",
  })) as AdminProductListItem[];
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  const keyword = searchQuery.value.toLowerCase();
  return products.value.filter((item) =>
    [item.title, item.slug, item.sku, item.category]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(keyword)),
  );
});

const total = computed(() => filteredProducts.value.length);

const openDeleteDialog = (product: AdminProductListItem) => {
  deleteTarget.value = product;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;
  try {
    // TODO: Call deleteProduct API when available
    // await deleteProduct(deleteTarget.value.id);
    console.log("Deleting product:", deleteTarget.value.id);
    showDeleteDialog.value = false;
    deleteTarget.value = null;
    await fetchProducts();
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
      title="Products"
      subtitle="Manage your catalog, pricing, and inventory."
      :primary-action="{
        label: 'Add product',
        icon: 'pi pi-plus',
        onClick: () => $router.push(ROUTES.ADMIN.PRODUCT_CREATE),
      }"
    />

    <SearchToolbar
      v-model="searchQuery"
      placeholder="Search products by name, SKU, or category..."
    />

    <AppDataTable
      :columns="columns"
      :data="filteredProducts"
      :total="total"
      :page="1"
      :per-page="10"
      :loading="pending"
    >
      <template #title>Product list</template>
      <template #subtitle>Quick view of your latest catalog updates.</template>
      <template #cell-product="{ row }">
        <div class="flex items-center gap-3">
          <img
            :src="row.thumbnail"
            alt="Product"
            class="h-10 w-10 rounded-lg object-cover"
          />
          <div>
            <p class="font-medium text-slate-900 dark:text-white">
              {{ row.title }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              SKU {{ row.sku }}
            </p>
          </div>
        </div>
      </template>
      <template #cell-price="{ value }">
        <span class="font-medium text-slate-900 dark:text-white"
          >{{ Number(value).toLocaleString() }} VND</span
        >
      </template>
      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="product" />
      </template>
      <template #cell-updatedAt="{ value }">
        <span class="text-sm text-slate-500 dark:text-slate-400">{{
          value
        }}</span>
      </template>
      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.PRODUCT_EDIT(row.id)"
          @delete="openDeleteDialog(row)"
          show-delete
        />
      </template>
    </AppDataTable>

    <ConfirmDialog
      :visible="showDeleteDialog"
      title="Delete Product"
      :message="`Are you sure you want to delete '${deleteTarget?.title}'? This action cannot be undone.`"
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
