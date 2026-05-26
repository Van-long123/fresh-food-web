<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AppDataTable from "~/components/admin/DataTable.vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import { ROUTES } from "~/constants/routes";
import { useToast } from "primevue/usetoast";
import { useAdminArticlesQuery } from "~/queries/article/useAdminArticlesQuery";
import { useAdminArticleCategoriesQuery } from "~/queries/article/useAdminArticleCategoriesQuery";
import { useDeleteAdminArticle } from "~/mutations/article/useDeleteAdminArticle";
import { useBulkDeleteAdminArticle } from "~/mutations/article/useBulkDeleteAdminArticle";
import { useBulkUpdateAdminArticleStatus } from "~/mutations/article/useBulkUpdateAdminArticleStatus";
import type { AdminArticleQueryParams, Article } from "~/types/article.type";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Danh sách bài viết - Quản trị SmartFood",
});

const router = useRouter();
const toast = useToast();

const searchQuery = ref("");
const statusFilter = ref<string>("all");
const categoryFilter = ref<string>("all");
const selectedIds = ref<string[]>([]);
const isBulkDeleting = ref(false);
const page = ref(1);
const perPage = ref(10);
const sortState = ref<{ key: string; direction: "asc" | "desc" } | null>({
  key: "publishedAt",
  direction: "desc",
});

const deleteTarget = ref<Article | null>(null);
const showDeleteDialog = ref(false);

const columns = [
  { key: "thumbnail", label: "Ảnh bìa" },
  { key: "title", label: "Chi tiết bài viết" },
  { key: "category", label: "Danh mục" },
  { key: "authorName", label: "Tác giả", sortable: true },
  { key: "views", label: "Lượt xem", sortable: true },
  { key: "position", label: "Vị trí", sortable: true },
  { key: "status", label: "Trạng thái", sortable: true },
  { key: "publishedAt", label: "Ngày xuất bản", sortable: true },
  { key: "actions", label: "Thao tác" },
];

const queryParams = computed<AdminArticleQueryParams>(() => {
  const params: AdminArticleQueryParams = {
    page: page.value,
    limit: perPage.value,
  };
  if (searchQuery.value) params.keyword = searchQuery.value;
  if (statusFilter.value !== "all") params.status = statusFilter.value as any;
  if (categoryFilter.value !== "all")
    params.primary_category_id = categoryFilter.value;
  if (sortState.value) {
    params.sortField = sortState.value.key;
    params.sortOrder = sortState.value.direction;
  }
  return params;
});

const { data, isLoading, isFetching } = useAdminArticlesQuery(queryParams);
const { data: categoriesData } = useAdminArticleCategoriesQuery();
const { mutate: deleteArticle, isPending: isDeleting } =
  useDeleteAdminArticle();
const { mutate: bulkDeleteArticles, isPending: isBulkDeletingPending } =
  useBulkDeleteAdminArticle();
const { mutate: bulkUpdateStatus } = useBulkUpdateAdminArticleStatus();

const articles = computed(() => data.value?.data ?? []);
const total = computed(() => data.value?.pagination?.total ?? 0);
const articleCategories = computed(() => categoriesData.value ?? []);

const getCategoryTitle = (catId: string) => {
  const cat = articleCategories.value.find(
    (c: any) => c._id?.toString() === catId,
  );
  return cat ? cat.title : "Chưa phân loại";
};

watch([searchQuery, statusFilter, categoryFilter], () => {
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
  sortState.value = sort || { key: "publishedAt", direction: "desc" };
  page.value = 1;
};

const handleSelectionChange = (ids: Array<string | number>) => {
  selectedIds.value = ids.map((id) => String(id));
};

// Bulk operations
const handleBulkDelete = () => {
  isBulkDeleting.value = true;
  showDeleteDialog.value = true;
};

const handleBulkStatusChange = (status: "active" | "draft" | "inactive") => {
  const idsToUpdate = [...selectedIds.value];
  bulkUpdateStatus(
    { article_ids: idsToUpdate, status },
    {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Đã cập nhật trạng thái",
          detail: `Đã cập nhật trạng thái cho ${idsToUpdate.length} bài viết`,
          life: 3000,
        });
        selectedIds.value = [];
      },
      onError: () => {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Không thể cập nhật trạng thái cho các bài viết đã chọn",
          life: 3000,
        });
      },
    },
  );
};

const openDeleteDialog = (article: any) => {
  deleteTarget.value = article;
  isBulkDeleting.value = false;
  showDeleteDialog.value = true;
};

const confirmDelete = () => {
  if (isBulkDeleting.value) {
    const idsToDelete = [...selectedIds.value];
    bulkDeleteArticles(
      { article_ids: idsToDelete },
      {
        onSuccess: () => {
          toast.add({
            severity: "success",
            summary: "Đã xóa bài viết",
            detail: `Đã xóa ${idsToDelete.length} bài viết`,
            life: 3000,
          });
          selectedIds.value = [];
          showDeleteDialog.value = false;
        },
        onError: () => {
          toast.add({
            severity: "error",
            summary: "Lỗi",
            detail: "Không thể xóa một hoặc nhiều bài viết",
            life: 3000,
          });
        },
      },
    );
  } else if (deleteTarget.value) {
    const target = deleteTarget.value;
    deleteArticle(target._id, {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Đã xóa bài viết",
          detail: `Đã xóa bài viết ${target.title}`,
          life: 3000,
        });
        deleteTarget.value = null;
        showDeleteDialog.value = false;
      },
      onError: () => {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Không thể xóa bài viết này",
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

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Bài viết & tin tức"
      subtitle="Đăng tải hướng dẫn dinh dưỡng, công thức nấu ăn, bài review và chiến dịch blog."
      :primary-action="{
        label: 'Thêm bài viết',
        icon: 'pi pi-plus',
        onClick: () => router.push(ROUTES.ADMIN.ARTICLE_CREATE),
      }"
    />

    <!-- Filter & Bulk Actions Bar -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex flex-wrap items-center gap-4">
        <SearchToolbar v-model="searchQuery" placeholder="Tìm bài viết..." />

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-500 uppercase"
            >Danh mục:</span
          >
          <select
            v-model="categoryFilter"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Tất cả danh mục</option>
            <option v-for="c in articleCategories" :key="c._id" :value="c._id">
              {{ c.title }}
            </option>
          </select>
        </div>

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
            <option value="draft">Bản nháp</option>
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
          class="rounded bg-white border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          Xuất bản
        </button>
        <button
          @click="handleBulkStatusChange('draft')"
          class="rounded bg-white border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          Chuyển nháp
        </button>
        <button
          @click="handleBulkStatusChange('inactive')"
          class="rounded bg-white border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          Ngừng hoạt động
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
      :data="articles"
      :total="total"
      v-model:page="page"
      v-model:perPage="perPage"
      :loading="isLoading || isFetching"
      :selectable="true"
      :selection="selectedIds"
      :sortable="true"
      :sort="sortState"
      @update:sort="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <template #title>Bài viết & Tin tức</template>
      <template #subtitle>Quản lý nội dung tiếp thị và tin tức.</template>

      <template #cell-thumbnail="{ row }">
        <img
          :src="
            row.thumbnail ||
            'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=100&auto=format&fit=crop'
          "
          alt="Article cover"
          class="h-12 w-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
        />
      </template>

      <template #cell-title="{ row }">
        <div>
          <div class="flex items-center gap-2">
            <span
              class="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-sm"
              >{{ row.title }}</span
            >
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
              v-for="t in row.tags || []"
              :key="t"
              class="text-[10px] bg-slate-100 text-slate-655 px-1.5 py-0.5 rounded dark:bg-slate-800 dark:text-slate-400"
            >
              #{{ t }}
            </span>
          </div>
        </div>
      </template>

      <template #cell-category="{ row }">
        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
          {{ getCategoryTitle(row.primary_category_id) }}
        </span>
      </template>

      <template #cell-authorName="{ row }">
        <div class="text-xs">
          <p class="font-bold text-slate-800 dark:text-slate-200">
            {{ row.authorName }}
          </p>
          <p class="text-slate-400">Đọc: {{ row.readTime }} phút</p>
        </div>
      </template>

      <template #cell-views="{ value }">
        <div
          class="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300"
        >
          <i class="pi pi-eye text-xs text-slate-400"></i>
          <span class="font-semibold font-mono">{{
            Number(value).toLocaleString()
          }}</span>
        </div>
      </template>

      <template #cell-position="{ value }">
        <span
          class="text-sm font-semibold font-mono text-slate-700 dark:text-slate-350"
        >
          {{ value }}
        </span>
      </template>

      <template #cell-status="{ value }">
        <!-- Status badge maps draft, active, inactive -->
        <span
          class="px-2 py-0.5 rounded text-xs font-semibold"
          :class="[
            value === 'active'
              ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
              : '',
            value === 'draft'
              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
              : '',
            value === 'inactive'
              ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
              : '',
          ]"
        >
          {{
            value === "active"
              ? "Đã xuất bản"
              : value === "draft"
                ? "Bản nháp"
                : "Ngừng hoạt động"
          }}
        </span>
      </template>

      <template #cell-publishedAt="{ value }">
        <span class="text-xs font-mono text-slate-500 dark:text-slate-400">
          {{ formatDate(value) }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.ARTICLE_EDIT(row._id)"
          @delete="openDeleteDialog(row)"
          show-delete
        />
      </template>
    </AppDataTable>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :visible="showDeleteDialog"
      :title="isBulkDeleting ? 'Xóa các bài viết đã chọn' : 'Xóa bài viết'"
      :message="
        isBulkDeleting
          ? `Bạn có chắc muốn xóa ${selectedIds.length} bài viết đã chọn? Thao tác này không thể hoàn tác.`
          : `Bạn có chắc muốn xóa bài viết '${deleteTarget?.title}'? Thao tác này không thể hoàn tác.`
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
