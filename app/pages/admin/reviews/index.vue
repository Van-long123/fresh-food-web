<script setup lang="ts">
import { computed, ref } from "vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import type {
  AdminReviewListItem,
  AdminReviewStatus,
} from "~/types/admin-review.type";
import { validateReviewStatus } from "~/validations/admin/review.schema";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const searchQuery = ref("");
const columns: DataTableColumn[] = [
  { key: "product", label: "Product" },
  { key: "user", label: "User" },
  { key: "rating", label: "Rating" },
  { key: "comment", label: "Comment" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Date" },
  { key: "actions", label: "Actions" },
];

const { listReviews, updateReviewStatus, deleteReview } = useReviewsApi();
const { data, pending } = await useAsyncData("admin-reviews", () =>
  listReviews(),
);

const reviews = computed(
  () => (data.value?.data || []) as AdminReviewListItem[],
);
const filteredReviews = computed(() => {
  if (!searchQuery.value) return reviews.value;
  const keyword = searchQuery.value.toLowerCase();
  return reviews.value.filter((item) =>
    [item.product, item.user, item.comment].some((field) =>
      field.toLowerCase().includes(keyword),
    ),
  );
});

const total = computed(() => filteredReviews.value.length);

const runAction = async (id: string, status: AdminReviewStatus) => {
  const errors = validateReviewStatus(status);
  if (Object.keys(errors).length) return;
  await updateReviewStatus(id, status);
};

const removeReview = async (id: string) => {
  await deleteReview(id);
};
</script>

<template>
  <div class="px-4 pt-6 space-y-4">
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Reviews
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Moderate product feedback and ratings.
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
          placeholder="Search reviews"
        />
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="filteredReviews"
      :total="total"
      :page="1"
      :per-page="10"
      :loading="pending"
    >
      <template #title>Review queue</template>
      <template #subtitle
        >Approve, reject, or remove customer reviews.</template
      >
      <template #cell-rating="{ value }">
        <div class="flex items-center gap-1">
          <svg
            v-for="star in 5"
            :key="star"
            class="w-4 h-4"
            :class="star <= value ? 'text-yellow-400' : 'text-gray-300'"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.048 9.394c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69l1.287-3.967z"
            ></path>
          </svg>
        </div>
      </template>
      <template #cell-comment="{ value }">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ value.length > 60 ? `${value.slice(0, 60)}...` : value }}
        </p>
      </template>
      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="review" />
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <button
            class="text-xs font-medium text-green-600 hover:underline"
            @click="runAction(row.id, 'approved')"
          >
            Approve
          </button>
          <button
            class="text-xs font-medium text-yellow-600 hover:underline"
            @click="runAction(row.id, 'rejected')"
          >
            Reject
          </button>
          <button
            class="text-xs font-medium text-red-600 hover:underline"
            @click="removeReview(row.id)"
          >
            Delete
          </button>
        </div>
      </template>
    </DataTable>
  </div>
</template>
