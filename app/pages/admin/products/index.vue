<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import { ROUTES } from "~/constants/routes";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const store = useAdminMockStore();
const router = useRouter();
const toast = useToast();

const searchQuery = ref("");
const statusFilter = ref<string>("all");
const selectedIds = ref<string[]>([]);
const isBulkDeleting = ref(false);

// Pagination
const page = ref(1);
const perPage = ref(10);

// Sorting
const sortState = ref<{ key: string; direction: "asc" | "desc" } | null>(null);

// Delete targets
const deleteTarget = ref<any | null>(null);
const showDeleteDialog = ref(false);
const deleteLoading = ref(false);

const columns = [
  { key: "thumbnail", label: "Ảnh" },
  { key: "title", label: "Thông tin sản phẩm", sortable: true },
  { key: "category", label: "Danh mục" },
  { key: "price", label: "Giá", sortable: true },
  { key: "stock", label: "Tồn kho/Đơn vị", sortable: true },
  { key: "status", label: "Trạng thái", sortable: true },
  { key: "soldCount", label: "Đã bán", sortable: true },
  { key: "rating", label: "Đánh giá" },
  { key: "actions", label: "Thao tác" },
];

const getCategoryTitle = (catId: string) => {
  const cat = store.categories.find((c) => c.id === catId);
  return cat ? cat.title : "Chưa phân loại";
};

const handleSortChange = (
  sort: { key: string; direction: "asc" | "desc" } | null,
) => {
  sortState.value = sort;
};

// Filtered and sorted products
const processedProducts = computed(() => {
  let list = [...store.products];

  // Search filter
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.slug.toLowerCase().includes(keyword) ||
        p.tags.some((t) => t.toLowerCase().includes(keyword)),
    );
  }

  // Status filter
  if (statusFilter.value !== "all") {
    list = list.filter((p) => p.status === statusFilter.value);
  }

  // Sorting
  if (sortState.value) {
    const { key, direction } = sortState.value;
    list.sort((a: any, b: any) => {
      let valA = a[key];
      let valB = b[key];

      if (key === "rating") {
        valA = a.ratings.totalRating;
        valB = b.ratings.totalRating;
      }

      if (typeof valA === "string") {
        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return direction === "asc" ? valA - valB : valB - valA;
      }
    });
  }

  return list;
});

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return processedProducts.value.slice(start, start + perPage.value);
});

const total = computed(() => processedProducts.value.length);

const handleSelectionChange = (ids: Array<string | number>) => {
  selectedIds.value = ids.map((id) => String(id));
};

// Bulk operations
const handleBulkDelete = () => {
  isBulkDeleting.value = true;
  showDeleteDialog.value = true;
};

const handleBulkStatusChange = (status: "active" | "inactive") => {
  store.bulkUpdateProductStatus(selectedIds.value, status);
  selectedIds.value = [];
  toast.add({
    severity: "success",
    summary: "Đã cập nhật trạng thái",
    detail: "Đã cập nhật trạng thái cho các sản phẩm đã chọn",
    life: 3000,
  });
};

const openDeleteDialog = (product: any) => {
  deleteTarget.value = product;
  isBulkDeleting.value = false;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  deleteLoading.value = true;
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (isBulkDeleting.value) {
    store.bulkDeleteProducts(selectedIds.value);
    toast.add({
      severity: "success",
      summary: "Đã xóa sản phẩm",
      detail: `Đã xóa ${selectedIds.value.length} sản phẩm`,
      life: 3000,
    });
    selectedIds.value = [];
  } else if (deleteTarget.value) {
    store.deleteProduct(deleteTarget.value.id);
    toast.add({
      severity: "success",
      summary: "Đã xóa sản phẩm",
      detail: `Đã xóa sản phẩm ${deleteTarget.value.title}`,
      life: 3000,
    });
    deleteTarget.value = null;
  }

  showDeleteDialog.value = false;
  deleteLoading.value = false;
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
  deleteTarget.value = null;
  isBulkDeleting.value = false;
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Sản phẩm"
      subtitle="Quản lý danh mục, đơn vị tính và tồn kho sản phẩm hữu cơ."
      :primary-action="{
        label: 'Thêm sản phẩm',
        icon: 'pi pi-plus',
        onClick: () => router.push(ROUTES.ADMIN.PRODUCT_CREATE),
      }"
    />

    <!-- Filter & Bulk Actions Bar -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex flex-wrap items-center gap-3">
        <SearchToolbar v-model="searchQuery" placeholder="Tìm sản phẩm..." />
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-500 uppercase"
            >Trạng thái:</span
          >
          <select
            v-model="statusFilter"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div
        v-if="selectedIds.length"
        class="flex items-center gap-2 bg-primary-50 dark:bg-primary-950/20 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-900/50"
      >
        <span class="text-sm font-medium text-primary-700 dark:text-primary-300"
          >{{ selectedIds.length }} đã chọn</span
        >
        <button
          @click="handleBulkStatusChange('active')"
          class="rounded bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Kích hoạt
        </button>
        <button
          @click="handleBulkStatusChange('inactive')"
          class="rounded bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Ngừng kích hoạt
        </button>
        <button
          @click="handleBulkDelete"
          class="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700"
        >
          Xóa mục đã chọn
        </button>
      </div>
    </div>

    <AppDataTable
      :columns="columns"
      :data="paginatedProducts"
      :total="total"
      v-model:page="page"
      v-model:perPage="perPage"
      :selectable="true"
      :sortable="true"
      @update:sort="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <template #title>Danh sách sản phẩm</template>
      <template #subtitle
        >Quản lý danh mục mô phỏng theo thời gian thực.</template
      >

      <template #cell-thumbnail="{ row }">
        <img
          :src="
            row.thumbnail ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop'
          "
          alt="Ảnh sản phẩm"
          class="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
        />
      </template>

      <template #cell-title="{ row }">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-semibold text-slate-900 dark:text-white">{{
              row.title
            }}</span>
            <span
              v-if="row.featured"
              class="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded dark:bg-amber-900/30 dark:text-amber-300"
            >
              Nổi bật
            </span>
          </div>
          <span class="text-xs text-slate-400 dark:text-slate-500 font-mono">{{
            row.slug
          }}</span>
          <div class="flex gap-1 mt-1">
            <span
              v-for="t in row.tags"
              :key="t"
              class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded dark:bg-slate-800 dark:text-slate-400"
            >
              {{ t }}
            </span>
          </div>
        </div>
      </template>

      <template #cell-category="{ row }">
        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
          {{ getCategoryTitle(row.primary_category_id) }}
        </span>
      </template>

      <template #cell-price="{ row }">
        <div class="text-sm">
          <div class="font-bold text-slate-900 dark:text-white">
            {{ Number(row.price).toLocaleString() }} VND
          </div>
          <div
            v-if="row.discountPercentage > 0"
            class="text-xs text-slate-400 line-through"
          >
            {{ Number(row.originalPrice).toLocaleString() }} VND
          </div>
          <div
            v-if="row.discountPercentage > 0"
            class="text-xs text-red-500 font-semibold"
          >
            -{{ row.discountPercentage }}%
          </div>
        </div>
      </template>

      <template #cell-stock="{ row }">
        <div class="text-sm">
          <span
            :class="
              row.stock === 0
                ? 'text-red-500 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            "
          >
            {{ row.stock }} {{ row.unit }}
          </span>
          <div class="text-[10px] text-slate-400 mt-0.5">
            <span
              v-if="row.isBestPrice"
              class="mr-1 text-green-600 font-semibold"
              >Giá tốt nhất</span
            >
            <span
              v-if="row.isOnlineExclusive"
              class="text-blue-600 font-semibold"
              >Độc quyền Online</span
            >
          </div>
        </div>
      </template>

      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="product" />
      </template>

      <template #cell-soldCount="{ value }">
        <span class="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {{ value }}
        </span>
      </template>

      <template #cell-rating="{ row }">
        <div class="flex items-center gap-1 text-sm text-amber-500">
          <i class="pi pi-star-fill text-xs"></i>
          <span class="font-bold">{{ row.ratings.totalRating }}</span>
          <span class="text-xs text-slate-400"
            >({{ row.ratings.numberOfRatings }})</span
          >
        </div>
      </template>

      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.PRODUCT_EDIT(row.id)"
          @delete="openDeleteDialog(row)"
          show-delete
        />
      </template>
    </AppDataTable>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :visible="showDeleteDialog"
      :title="isBulkDeleting ? 'Xóa sản phẩm đã chọn' : 'Xóa sản phẩm'"
      :message="
        isBulkDeleting
          ? `Bạn có chắc chắn muốn xóa ${selectedIds.length} sản phẩm đã chọn? Hành động này không thể hoàn tác.`
          : `Bạn có chắc chắn muốn xóa sản phẩm '${deleteTarget?.title}'? Hành động này không thể hoàn tác.`
      "
      confirm-label="Xóa"
      cancel-label="Hủy"
      :loading="deleteLoading"
      danger
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      @update:visible="(v) => !v && cancelDelete()"
    />
  </div>
</template>
