<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import AppDataTable from "~/components/admin/DataTable.vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import { API_ENDPOINTS } from "~/constants/api";
import { ROUTES } from "~/constants/routes";
import type { AdminProductListItem } from "~/types/admin-product.type";

definePageMeta({
  layout: "admin",
});

const searchQuery = ref("");

const columns: DataTableColumn[] = [
  { key: "product", label: "Product" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "status", label: "Status" },
  { key: "updatedAt", label: "Updated" },
];
const data = ref([]);
const pending = ref(false);
const fetchProducts = async () => {
  try {
    pending.value = true;
    console.log("Fetching products from:", API_ENDPOINTS.PRODUCT.LIST);
    const response = await getAuthorizedAxios().get(API_ENDPOINTS.PRODUCT.LIST);
    console.log("API Response:", response.data);
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
// const { listProducts } = useProductsApi();
// const { data, pending } = await useAsyncData("admin-products", () =>
//   listProducts(),
// );

const products = computed(() => {
  return (data.value || []).map((item: any) => ({
    ...item,
    id: item._id,
    sku: item.sku || "N/A",
    category: item.category || "Uncategorized",
  })) as AdminProductListItem[];
});

watch(products, (newData) => {
  console.log("Products data updated:", newData);
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
</script>

<template>
  <div class="px-4 pt-6 space-y-4">
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Products
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Manage your catalog, pricing, and inventory.
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
            placeholder="Search products"
          />
        </div>
        <NuxtLink
          :to="ROUTES.ADMIN.PRODUCT_CREATE"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
        >
          Add product
        </NuxtLink>
      </div>
    </div>

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
            class="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ row.title }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              SKU {{ row.sku }}
            </p>
          </div>
        </div>
      </template>
      <template #cell-price="{ value }">
        <span class="font-medium text-gray-900 dark:text-white"
          >{{ Number(value).toLocaleString() }} VND</span
        >
      </template>
      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="product" />
      </template>
      <template #cell-updatedAt="{ value }">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{
          value
        }}</span>
      </template>
    </AppDataTable>
  </div>
</template>
