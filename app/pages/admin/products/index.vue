<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import { ROUTES } from "~/constants/routes";
import { useAdminProductsQuery } from "~/queries/product/useAdminProductsQuery";
import { useDeleteAdminProduct } from "~/mutations/product/useDeleteProduct";
import { useBulkDeleteAdminProduct } from "~/mutations/product/useBulkDeleteProduct";
import { useUpdateAdminProduct } from "~/mutations/product/useUpdateProduct";
import { useBulkUpdateAdminProductStatus } from "~/mutations/product/useBulkUpdateProductStatus";
import { useToast } from "primevue/usetoast";
import type {
  AdminProduct,
  AdminProductQueryParams,
} from "~/types/product.type";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Danh sách sản phẩm - Quản trị SmartFood",
});

const router = useRouter();
const toast = useToast();

// ─── State ────────────────────────────────────────────────────────────────────
const searchQuery = ref("");
const statusFilter = ref<string>("all");
const page = ref(1);
const perPage = ref(10);
const sortState = ref<{ key: string; direction: "asc" | "desc" } | null>({
  key: "position",
  direction: "asc",
});
const selectedIds = ref<string[]>([]);

// Delete state
const deleteTarget = ref<AdminProduct | null>(null);
const showDeleteDialog = ref(false);
const isBulkDeleting = ref(false);

// ─── Query Params (reactive) ──────────────────────────────────────────────────
const queryParams = computed<AdminProductQueryParams>(() => {
  const params: AdminProductQueryParams = {
    page: page.value,
    limit: perPage.value,
  };
  if (searchQuery.value) params.keyword = searchQuery.value;
  if (statusFilter.value !== "all") params.status = statusFilter.value;
  if (sortState.value) {
    params.sortField = sortState.value.key;
    params.sortOrder = sortState.value.direction;
  }
  return params;
});

// ─── TanStack Query ───────────────────────────────────────────────────────────
const { data, isLoading, isFetching } = useAdminProductsQuery(queryParams);
const { mutate: deleteProduct, isPending: isDeleting } =
  useDeleteAdminProduct();
const { mutate: bulkDeleteProducts, isPending: isBulkDeletingPending } =
  useBulkDeleteAdminProduct();
const { mutate: updateProduct } = useUpdateAdminProduct();
const { mutate: bulkUpdateProductsStatus } = useBulkUpdateAdminProductStatus();

// ─── Computed ─────────────────────────────────────────────────────────────────
const products = computed(() => data.value?.data ?? []);
const total = computed(() => data.value?.pagination?.total ?? 0);

const columns = [
  { key: "thumbnail", label: "Ảnh" },
  { key: "title", label: "Thông tin sản phẩm", sortable: true },
  { key: "category", label: "Danh mục" },
  { key: "price", label: "Giá", sortable: true },
  { key: "stock", label: "Tồn kho/Đơn vị", sortable: true },
  { key: "status", label: "Trạng thái", sortable: true },
  { key: "soldCount", label: "Đã bán", sortable: true },
  { key: "rating", label: "Đánh giá" },
  { key: "position", label: "Vị trí", sortable: true },
  { key: "actions", label: "Thao tác" },
];

// ─── Handlers ─────────────────────────────────────────────────────────────────
// Reset page về 1 khi search/filter thay đổi
watch([searchQuery, statusFilter], () => {
  page.value = 1;
});

const handleSortChange = (
  sort: { key: string; direction: "asc" | "desc" } | null,
) => {
  if (
    sortState.value?.key === sort?.key &&
    sortState.value?.direction === sort?.direction
  ) {
    return;
  }
  sortState.value = sort || { key: "position", direction: "asc" };
  page.value = 1;
};

const handleSelectionChange = (ids: Array<string | number>) => {
  selectedIds.value = ids.map(String);
};

const openDeleteDialog = (product: AdminProduct) => {
  deleteTarget.value = product;
  isBulkDeleting.value = false;
  showDeleteDialog.value = true;
};

const handleBulkDelete = () => {
  isBulkDeleting.value = true;
  showDeleteDialog.value = true;
};

const confirmDelete = () => {
  if (isBulkDeleting.value) {
    const idsToDelete = [...selectedIds.value];
    bulkDeleteProducts(
      { product_ids: idsToDelete },
      {
        onSuccess: () => {
          toast.add({
            severity: "success",
            summary: "Đã xóa sản phẩm",
            detail: `Đã xóa ${idsToDelete.length} sản phẩm`,
            life: 3000,
          });
          selectedIds.value = [];
          showDeleteDialog.value = false;
        },
        onError: () => {
          toast.add({
            severity: "error",
            summary: "Lỗi",
            detail: "Không thể xóa một hoặc nhiều sản phẩm",
            life: 3000,
          });
        },
      },
    );
  } else if (deleteTarget.value) {
    const target = deleteTarget.value;
    deleteProduct(target._id, {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Đã xóa sản phẩm",
          detail: `Đã xóa sản phẩm ${target.title}`,
          life: 3000,
        });
        deleteTarget.value = null;
        showDeleteDialog.value = false;
      },
      onError: () => {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Không thể xóa sản phẩm này",
          life: 3000,
        });
      },
    });
  }
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
  deleteTarget.value = null;
  isBulkDeleting.value = false;
};

const handleBulkStatusChange = (status: "active" | "inactive") => {
  const idsToUpdate = [...selectedIds.value];
  bulkUpdateProductsStatus(
    { product_ids: idsToUpdate, status },
    {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Đã cập nhật trạng thái",
          detail: `Đã cập nhật trạng thái cho ${idsToUpdate.length} sản phẩm`,
          life: 3000,
        });
        selectedIds.value = [];
      },
      onError: () => {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Không thể cập nhật trạng thái một hoặc nhiều sản phẩm",
          life: 3000,
        });
      },
    },
  );
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Sản phẩm"
      subtitle="Quản lý danh mục, đơn vị tính và tồn kho sản phẩm."
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
        <!-- Loading indicator -->
        <span
          v-if="isFetching && !isLoading"
          class="text-xs text-slate-400 flex items-center gap-1"
        >
          <i class="pi pi-spin pi-spinner text-xs"></i> Đang tải...
        </span>
      </div>

      <!-- Bulk Actions -->
      <div
        v-if="selectedIds.length"
        class="flex items-center gap-2 bg-primary-50 dark:bg-primary-950/20 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-900/50"
      >
        <span
          class="text-sm font-medium text-primary-700 dark:text-primary-300"
        >
          {{ selectedIds.length }} đã chọn
        </span>
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
      :data="products"
      :total="total"
      v-model:page="page"
      v-model:perPage="perPage"
      :selectable="true"
      :selection="selectedIds"
      :sortable="true"
      :sort="sortState"
      :loading="isLoading"
      @update:sort="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <template #title>Danh sách sản phẩm</template>
      <template #subtitle>{{ total }} sản phẩm trong hệ thống.</template>

      <!-- Skeleton loading rows -->
      <template v-if="isLoading" #body>
        <tr v-for="i in perPage" :key="i" class="animate-pulse">
          <td v-for="col in columns" :key="col.key" class="px-4 py-3">
            <div
              class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"
            ></div>
          </td>
        </tr>
      </template>

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
          <div class="flex gap-1 mt-1 flex-wrap">
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
          {{ row.primary_category?.title ?? "Chưa phân loại" }}
        </span>
      </template>

      <template #cell-price="{ row }">
        <div class="text-sm">
          <div class="font-bold text-slate-900 dark:text-white">
            {{ Number(row.price).toLocaleString("vi-VN") }} ₫
          </div>
          <div
            v-if="row.discountPercentage > 0"
            class="text-xs text-slate-400 line-through"
          >
            {{ Number(row.originalPrice).toLocaleString("vi-VN") }} ₫
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
        <span
          class="text-sm font-semibold text-slate-800 dark:text-slate-200"
          >{{ value }}</span
        >
      </template>

      <template #cell-rating="{ row }">
        <div class="flex items-center gap-1 text-sm text-amber-500">
          <i class="pi pi-star-fill text-xs"></i>
          <span class="font-bold">
            {{
              row.ratings?.numberOfRatings > 0
                ? (
                    row.ratings.totalRating / row.ratings.numberOfRatings
                  ).toFixed(1)
                : "0"
            }}
          </span>
          <span class="text-xs text-slate-400"
            >({{ row.ratings?.numberOfRatings ?? 0 }})</span
          >
        </div>
      </template>

      <template #cell-position="{ row }">
        <span
          class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          {{ row.position }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.PRODUCT_EDIT(row._id)"
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
      :loading="isBulkDeleting ? isBulkDeletingPending : isDeleting"
      danger
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      @update:visible="(v) => !v && cancelDelete()"
    />
  </div>
</template>
