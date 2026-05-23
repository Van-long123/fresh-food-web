<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "~/components/admin/PageHeader.vue";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import { ROUTES } from "~/constants/routes";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Chi tiết đánh giá - Quản trị SmartFood",
});

const route = useRoute();
const router = useRouter();
const store = useAdminMockStore();
const toast = useToast();

const review = computed(() =>
  store.reviews.find((r) => r.id === route.params.id),
);

// Approve / Reject dialogs
const showApproveDialog = ref(false);
const showRejectDialog = ref(false);
const actionLoading = ref(false);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleApprove = async () => {
  actionLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));
  store.updateReviewStatus(review.value!.id, "approved");
  toast.add({
    severity: "success",
    summary: "Đã duyệt đánh giá",
    detail: "Đánh giá sẽ được hiển thị công khai trên trang sản phẩm.",
    life: 3000,
  });
  showApproveDialog.value = false;
  actionLoading.value = false;
};

const handleReject = async () => {
  actionLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));
  store.updateReviewStatus(review.value!.id, "rejected");
  toast.add({
    severity: "warn",
    summary: "Đã từ chối đánh giá",
    detail: "Đánh giá đã bị ẩn khỏi trang sản phẩm.",
    life: 3000,
  });
  showRejectDialog.value = false;
  actionLoading.value = false;
};

const handleReset = async () => {
  store.updateReviewStatus(review.value!.id, "pending");
  toast.add({
    severity: "info",
    summary: "Đặt lại trạng thái",
    detail: "Đánh giá đã được đặt lại về trạng thái Chờ duyệt.",
    life: 3000,
  });
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Chi tiết đánh giá"
      :subtitle="review ? review.productName : 'Đang tải...'"
      show-back-button
    />

    <!-- Not found -->
    <div
      v-if="!review"
      class="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-12 text-slate-500 dark:border-slate-700 dark:bg-slate-900"
    >
      <i class="pi pi-inbox text-4xl text-slate-300"></i>
      <p>Không tìm thấy đánh giá.</p>
      <button
        @click="router.push(ROUTES.ADMIN.REVIEWS)"
        class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
      >
        Quay lại danh sách
      </button>
    </div>

    <template v-else>
      <!-- Action bar -->
      <div
        class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="flex items-center gap-3">
          <StatusBadge :status="review.status" type="review" />
          <span class="text-sm text-slate-500">{{ formatDate(review.createdAt) }}</span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-if="review.status !== 'approved'"
            @click="showApproveDialog = true"
            class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            <i class="pi pi-check-circle"></i>
            Duyệt đánh giá
          </button>
          <button
            v-if="review.status !== 'rejected'"
            @click="showRejectDialog = true"
            class="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:bg-slate-900 dark:hover:bg-red-900/20"
          >
            <i class="pi pi-times-circle"></i>
            Từ chối
          </button>
          <button
            v-if="review.status !== 'pending'"
            @click="handleReset"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <i class="pi pi-refresh"></i>
            Đặt lại
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Review Content -->
        <div class="space-y-6 lg:col-span-2">
          <!-- Rating + Comment -->
          <section
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-lg font-semibold text-slate-900 dark:text-white">{{ review.customerName }}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ review.userId }}</p>
              </div>
              <!-- Stars -->
              <div class="flex items-center gap-1">
                <i
                  v-for="s in 5"
                  :key="s"
                  class="pi pi-star-fill text-xl"
                  :class="s <= review.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'"
                ></i>
                <span class="ml-2 text-xl font-bold text-slate-700 dark:text-slate-200">
                  {{ review.rating }}/5
                </span>
              </div>
            </div>
            <div
              class="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60"
            >
              <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {{ review.comment || 'Khách hàng không để lại bình luận.' }}
              </p>
            </div>
          </section>

          <!-- Attached Images -->
          <section
            v-if="review.images.length"
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="mb-4 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="pi pi-images text-primary-500"></i>
              Hình ảnh đính kèm ({{ review.images.length }})
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <a
                v-for="(img, idx) in review.images"
                :key="idx"
                :href="img"
                target="_blank"
                class="block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <img
                  :src="img"
                  :alt="`Ảnh ${idx + 1}`"
                  class="aspect-square w-full object-cover transition hover:scale-105"
                />
              </a>
            </div>
          </section>
        </div>

        <!-- Product & Status Info -->
        <div class="space-y-6">
          <!-- Product Info -->
          <section
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="mb-4 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="pi pi-box text-primary-500"></i>
              Sản phẩm được đánh giá
            </h2>
            <dl class="space-y-3 text-sm">
              <div>
                <dt class="text-slate-500 mb-0.5">Tên sản phẩm</dt>
                <dd class="font-semibold text-slate-900 dark:text-white">{{ review.productName }}</dd>
              </div>
              <div>
                <dt class="text-slate-500 mb-0.5">Product ID</dt>
                <dd class="font-mono text-xs text-slate-600 dark:text-slate-300">{{ review.productId }}</dd>
              </div>
            </dl>
          </section>

          <!-- Status history card -->
          <section
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="mb-4 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="pi pi-history text-primary-500"></i>
              Thông tin duyệt
            </h2>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <dt class="text-slate-500">Trạng thái hiện tại</dt>
                <dd><StatusBadge :status="review.status" type="review" /></dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">Ngày đánh giá</dt>
                <dd class="text-slate-700 dark:text-slate-300 text-right text-xs">{{ formatDate(review.createdAt) }}</dd>
              </div>
              <div v-if="review.updatedAt" class="flex justify-between">
                <dt class="text-slate-500">Lần cập nhật</dt>
                <dd class="text-slate-700 dark:text-slate-300 text-right text-xs">{{ formatDate(review.updatedAt) }}</dd>
              </div>
            </dl>

            <!-- Quick status update -->
            <div class="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <p class="text-xs font-semibold text-slate-500 uppercase mb-2">Cập nhật nhanh</p>
              <div class="flex flex-col gap-2">
                <button
                  @click="handleApprove"
                  :disabled="review.status === 'approved'"
                  class="flex items-center gap-2 rounded-lg border border-green-200 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-900/20"
                >
                  <i class="pi pi-check-circle text-green-500"></i>
                  Duyệt
                </button>
                <button
                  @click="handleReject"
                  :disabled="review.status === 'rejected'"
                  class="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <i class="pi pi-times-circle text-red-500"></i>
                  Từ chối
                </button>
                <button
                  @click="handleReset"
                  :disabled="review.status === 'pending'"
                  class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <i class="pi pi-refresh"></i>
                  Chờ duyệt lại
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </template>

    <!-- Approve Dialog -->
    <ConfirmDialog
      :visible="showApproveDialog"
      title="Duyệt đánh giá"
      message="Đánh giá này sẽ được hiển thị công khai trên trang sản phẩm. Bạn xác nhận duyệt?"
      confirm-label="Duyệt"
      cancel-label="Hủy"
      :loading="actionLoading"
      @confirm="handleApprove"
      @cancel="showApproveDialog = false"
      @update:visible="(v) => !v && (showApproveDialog = false)"
    />

    <!-- Reject Dialog -->
    <ConfirmDialog
      :visible="showRejectDialog"
      title="Từ chối đánh giá"
      message="Đánh giá sẽ bị ẩn và không hiển thị trên trang sản phẩm. Bạn xác nhận từ chối?"
      confirm-label="Từ chối"
      cancel-label="Hủy"
      danger
      :loading="actionLoading"
      @confirm="handleReject"
      @cancel="showRejectDialog = false"
      @update:visible="(v) => !v && (showRejectDialog = false)"
    />
  </div>
</template>
