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

const route = useRoute();
const router = useRouter();
const store = useAdminMockStore();
const toast = useToast();

const request = computed(() =>
  store.refundRequests.find((r) => r.id === route.params.id),
);

// Dialog states
const showApproveDialog = ref(false);
const showConfirmTransferDialog = ref(false);
const showConfirmPickupDialog = ref(false);
const showRejectDialog = ref(false);
const actionLoading = ref(false);

// Reject form
const rejectReason = ref("");
const rejectError = ref("");

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: number) =>
  amount.toLocaleString("vi-VN") + " ₫";

// Actions
const handleApprove = async () => {
  actionLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 700));
  
  const isCashOnPickup = request.value?.refundMethod === "cash_on_pickup";
  const nextStatus = isCashOnPickup ? "approved_waiting_pickup" : "processing_refund";
  
  store.updateRefundStatus(request.value!.id, nextStatus);
  
  toast.add({
    severity: "success",
    summary: "Đã duyệt yêu cầu",
    detail: isCashOnPickup
      ? "Đã duyệt. Shipper sẽ đến lấy hàng và hoàn tiền mặt."
      : "Đã duyệt. Tiến hành xử lý chuyển khoản.",
    life: 3000,
  });
  showApproveDialog.value = false;
  actionLoading.value = false;
};

const handleConfirmTransfer = async () => {
  actionLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 700));
  store.updateRefundStatus(request.value!.id, "completed");
  toast.add({
    severity: "success",
    summary: "Đã xác nhận chuyển khoản",
    detail: "Yêu cầu hoàn tiền đã được hoàn tất thành công.",
    life: 3000,
  });
  showConfirmTransferDialog.value = false;
  actionLoading.value = false;
};

const handleConfirmPickup = async () => {
  actionLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 700));
  store.updateRefundStatus(request.value!.id, "completed");
  toast.add({
    severity: "success",
    summary: "Đã xác nhận hoàn tiền mặt",
    detail: "Đã hoàn thành thu hồi sản phẩm và hoàn tiền mặt cho khách hàng.",
    life: 3000,
  });
  showConfirmPickupDialog.value = false;
  actionLoading.value = false;
};

const handleReject = async () => {
  if (!rejectReason.value.trim()) {
    rejectError.value = "Vui lòng nhập lý do từ chối.";
    return;
  }
  actionLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 700));
  store.updateRefundStatus(request.value!.id, "rejected", {
    rejectReason: rejectReason.value.trim(),
  });
  toast.add({
    severity: "warn",
    summary: "Đã từ chối yêu cầu",
    detail: "Yêu cầu hoàn tiền đã bị từ chối.",
    life: 3000,
  });
  showRejectDialog.value = false;
  rejectReason.value = "";
  rejectError.value = "";
  actionLoading.value = false;
};

const openRejectDialog = () => {
  rejectReason.value = "";
  rejectError.value = "";
  showRejectDialog.value = true;
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Chi tiết yêu cầu hoàn tiền"
      :subtitle="request ? `Mã yêu cầu: ${request.id}` : 'Đang tải...'"
      show-back-button
    />

    <!-- Not found -->
    <div
      v-if="!request"
      class="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-12 text-slate-500 dark:border-slate-700 dark:bg-slate-900"
    >
      <i class="pi pi-inbox text-4xl text-slate-300"></i>
      <p>Không tìm thấy yêu cầu hoàn tiền.</p>
      <button
        @click="router.push(ROUTES.ADMIN.REFUND_REQUESTS)"
        class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
      >
        Quay lại danh sách
      </button>
    </div>

    <template v-else>
      <!-- Status & Action Bar -->
      <div
        class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="flex items-center gap-3">
          <StatusBadge :status="request.status" type="refund" />
          <span class="text-sm text-slate-500 dark:text-slate-400">
            Tạo lúc {{ formatDate(request.createdAt) }}
          </span>
          <span
            v-if="request.updatedAt"
            class="text-sm text-slate-400 dark:text-slate-500"
          >
            · Cập nhật {{ formatDate(request.updatedAt) }}
          </span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Approve button (only when pending) -->
          <button
            v-if="request.status === 'pending'"
            @click="showApproveDialog = true"
            class="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
          >
            <i class="pi pi-check-circle"></i>
            Duyệt yêu cầu
          </button>
          <!-- Confirm Transfer (when processing_refund) -->
          <button
            v-if="request.status === 'processing_refund'"
            @click="showConfirmTransferDialog = true"
            class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            <i class="pi pi-wallet"></i>
            Xác nhận đã chuyển khoản
          </button>
          <!-- Confirm Pickup (when approved_waiting_pickup) -->
          <button
            v-if="request.status === 'approved_waiting_pickup'"
            @click="showConfirmPickupDialog = true"
            class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            <i class="pi pi-check-square"></i>
            Xác nhận đã lấy hàng & hoàn tiền
          </button>
          <!-- Reject button (pending or approved_waiting_pickup) -->
          <button
            v-if="request.status === 'pending' || request.status === 'approved_waiting_pickup'"
            @click="openRejectDialog"
            class="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:bg-slate-900 dark:hover:bg-red-900/20"
          >
            <i class="pi pi-times-circle"></i>
            Từ chối yêu cầu
          </button>
        </div>
      </div>

      <!-- Reject Reason (shown if rejected) -->
      <div
        v-if="request.status === 'rejected' && request.rejectReason"
        class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20"
      >
        <i class="pi pi-exclamation-circle mt-0.5 text-red-500"></i>
        <div>
          <p class="text-sm font-semibold text-red-700 dark:text-red-400">Lý do từ chối</p>
          <p class="mt-1 text-sm text-red-600 dark:text-red-300">{{ request.rejectReason }}</p>
        </div>
      </div>

      <!-- Main grid -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Left column: reason + evidence + items -->
        <div class="space-y-6 lg:col-span-2">
          <!-- Reason -->
          <section
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="mb-3 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="pi pi-comment text-primary-500"></i>
              Lý do hoàn tiền
            </h2>
            <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {{ request.reason }}
            </p>
          </section>

          <!-- Evidence: images -->
          <section
            v-if="request.images.length"
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="mb-4 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="pi pi-images text-primary-500"></i>
              Hình ảnh minh chứng ({{ request.images.length }})
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <a
                v-for="(img, idx) in request.images"
                :key="idx"
                :href="img"
                target="_blank"
                class="block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <img
                  :src="img"
                  :alt="`Hình ${idx + 1}`"
                  class="aspect-square w-full object-cover transition hover:scale-105"
                />
              </a>
            </div>
          </section>

          <!-- Evidence: videos -->
          <section
            v-if="request.videos.length"
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="mb-4 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="pi pi-video text-primary-500"></i>
              Video minh chứng ({{ request.videos.length }})
            </h2>
            <div class="space-y-3">
              <video
                v-for="(vid, idx) in request.videos"
                :key="idx"
                :src="vid"
                controls
                class="w-full rounded-xl border border-slate-200 dark:border-slate-700"
              ></video>
            </div>
          </section>

          <!-- Items -->
          <section
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="mb-4 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="pi pi-list text-primary-500"></i>
              Sản phẩm yêu cầu hoàn ({{ request.items.length }})
            </h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead>
                  <tr class="text-left">
                    <th class="py-2 text-xs font-semibold uppercase text-slate-500">Sản phẩm</th>
                    <th class="py-2 text-xs font-semibold uppercase text-slate-500 text-center">SL</th>
                    <th class="py-2 text-xs font-semibold uppercase text-slate-500 text-right">Giá</th>
                    <th class="py-2 text-xs font-semibold uppercase text-slate-500 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="item in request.items" :key="item.productId">
                    <td class="py-2.5 text-sm font-medium text-slate-800 dark:text-white">{{ item.productName }}</td>
                    <td class="py-2.5 text-sm text-center text-slate-600 dark:text-slate-300">{{ item.quantity }}</td>
                    <td class="py-2.5 text-sm text-right text-slate-600 dark:text-slate-300">{{ formatCurrency(item.price) }}</td>
                    <td class="py-2.5 text-sm font-bold text-right text-slate-900 dark:text-white">{{ formatCurrency(item.price * item.quantity) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-t-2 border-slate-200 dark:border-slate-700">
                    <td colspan="3" class="pt-3 text-sm font-semibold text-slate-700 dark:text-slate-200 text-right">Tổng hoàn tiền:</td>
                    <td class="pt-3 text-right text-base font-bold text-rose-600 dark:text-rose-400">{{ formatCurrency(request.amount) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>

        <!-- Right column: customer info + bank info -->
        <div class="space-y-6">
          <!-- Customer Info -->
          <section
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="mb-4 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="pi pi-user text-primary-500"></i>
              Thông tin khách hàng
            </h2>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-500">Tên</dt>
                <dd class="font-medium text-slate-900 dark:text-white">{{ request.customerName }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">User ID</dt>
                <dd class="font-mono text-xs text-slate-600 dark:text-slate-300">{{ request.userId }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">Mã đơn hàng</dt>
                <dd class="font-mono text-xs font-bold text-primary-600 dark:text-primary-400">#{{ request.orderId }}</dd>
              </div>
            </dl>
          </section>

          <!-- Bank Info / Refund Method Info -->
          <section
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="mb-4 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="pi pi-building-columns text-primary-500"></i>
              Thông tin nhận tiền
            </h2>
            
            <div class="mb-4 flex items-center justify-between text-sm">
              <span class="text-slate-500">Phương thức:</span>
              <span class="font-bold text-slate-900 dark:text-white">
                {{ request.refundMethod === 'cash_on_pickup' ? '💵 Tiền mặt khi shipper lấy hàng' : '🏦 Chuyển khoản ngân hàng' }}
              </span>
            </div>

            <!-- Nếu là cash_on_pickup -->
            <div
              v-if="request.refundMethod === 'cash_on_pickup'"
              class="space-y-3 rounded-xl bg-orange-50 p-4 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30"
            >
              <div class="flex items-center gap-2 text-orange-800 dark:text-orange-300">
                <i class="pi pi-info-circle"></i>
                <span class="text-xs font-semibold">Nhận tiền mặt tại chỗ</span>
              </div>
              <p class="text-xs text-orange-700 dark:text-orange-400">
                Shipper sẽ mang tiền mặt và hoàn trả trực tiếp cho khách khi lấy hàng hoàn. Không cần thông tin ngân hàng.
              </p>
              <div class="border-t border-orange-200/60 pt-3 dark:border-orange-800/40">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Số tiền cần hoàn trả:</span>
                  <span class="text-base font-bold text-rose-600 dark:text-rose-400">{{ formatCurrency(request.amount) }}</span>
                </div>
              </div>
            </div>

            <!-- Nếu là bank_transfer và đã có thông tin ngân hàng -->
            <div
              v-else-if="request.bankInfo"
              class="space-y-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-500">Ngân hàng</span>
                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ request.bankInfo.bankName }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-500">Số tài khoản</span>
                <span class="font-mono text-sm font-bold text-primary-600 dark:text-primary-400">{{ request.bankInfo.accountNumber }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-500">Chủ tài khoản</span>
                <span class="text-sm font-semibold text-slate-900 dark:text-white">{{ request.bankInfo.accountHolder }}</span>
              </div>
              <div class="border-t border-slate-200 pt-3 dark:border-slate-700">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-slate-500">Số tiền cần chuyển</span>
                  <span class="text-base font-bold text-rose-600 dark:text-rose-400">{{ formatCurrency(request.amount) }}</span>
                </div>
              </div>
            </div>
            
            <div
              v-else
              class="flex flex-col items-center gap-2 py-6 text-center text-slate-400"
            >
              <i class="pi pi-clock text-2xl"></i>
              <p class="text-sm">Khách hàng chưa cung cấp thông tin tài khoản.</p>
            </div>
          </section>
        </div>
      </div>
    </template>

    <!-- Approve Dialog -->
    <ConfirmDialog
      :visible="showApproveDialog"
      title="Duyệt yêu cầu hoàn tiền"
      message="Bạn xác nhận duyệt yêu cầu này? Hệ thống sẽ thông báo khách hàng cung cấp thông tin tài khoản ngân hàng."
      confirm-label="Duyệt"
      cancel-label="Hủy"
      :loading="actionLoading"
      @confirm="handleApprove"
      @cancel="showApproveDialog = false"
      @update:visible="(v) => !v && (showApproveDialog = false)"
    />

    <!-- Confirm Transfer Dialog -->
    <ConfirmDialog
      :visible="showConfirmTransferDialog"
      title="Xác nhận đã chuyển khoản"
      message="Bạn xác nhận đã chuyển tiền hoàn về tài khoản khách hàng? Thao tác này sẽ đánh dấu yêu cầu là Hoàn thành."
      confirm-label="Xác nhận"
      cancel-label="Hủy"
      :loading="actionLoading"
      @confirm="handleConfirmTransfer"
      @cancel="showConfirmTransferDialog = false"
      @update:visible="(v) => !v && (showConfirmTransferDialog = false)"
    />

    <!-- Confirm Pickup Dialog -->
    <ConfirmDialog
      :visible="showConfirmPickupDialog"
      title="Xác nhận đã lấy hàng & hoàn tiền"
      message="Bạn xác nhận đã thu hồi lại sản phẩm và hoàn trả tiền mặt trực tiếp cho khách hàng? Thao tác này sẽ đánh dấu yêu cầu là Hoàn thành."
      confirm-label="Xác nhận"
      cancel-label="Hủy"
      :loading="actionLoading"
      @confirm="handleConfirmPickup"
      @cancel="showConfirmPickupDialog = false"
      @update:visible="(v) => !v && (showConfirmPickupDialog = false)"
    />

    <!-- Reject Dialog (with textarea form) -->
    <Teleport to="body">
      <div
        v-if="showRejectDialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      >
        <div
          class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <i class="pi pi-exclamation-triangle text-red-600 text-lg"></i>
            </div>
            <span class="text-lg font-semibold text-slate-900 dark:text-white">Từ chối yêu cầu</span>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Vui lòng nhập lý do từ chối để khách hàng được biết.
          </p>
          <textarea
            v-model="rejectReason"
            rows="4"
            placeholder="Nhập lý do từ chối..."
            class="w-full rounded-lg border px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200"
            :class="rejectError ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:ring-primary-300 dark:border-slate-600'"
          ></textarea>
          <p v-if="rejectError" class="mt-1 text-xs text-red-500">{{ rejectError }}</p>
          <div class="mt-4 flex items-center gap-2">
            <button
              type="button"
              :disabled="actionLoading"
              class="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              @click="showRejectDialog = false"
            >
              Hủy
            </button>
            <button
              type="button"
              :disabled="actionLoading"
              class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              @click="handleReject"
            >
              <i v-if="actionLoading" class="pi pi-spin pi-spinner mr-2"></i>
              Từ chối
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
