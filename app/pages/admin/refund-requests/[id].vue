<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Dialog from "primevue/dialog";
import FileUpload from "primevue/fileupload";
import PageHeader from "~/components/admin/PageHeader.vue";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import { ROUTES } from "~/constants/routes";
import { useAdminRefundRequestDetailQuery } from "~/queries/refund/useAdminRefundQuery";
import {
  useApproveAdminRefundRequestMutation,
  useCompleteAdminRefundRequestMutation,
  useRejectAdminRefundRequestMutation,
} from "~/mutations/refund/useAdminRefundMutations";
import { formatDateTime, formatVND } from "~/utils/formatters";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Chi tiết yêu cầu hoàn tiền - Quản trị SmartFood",
});

const route = useRoute();
const router = useRouter();

const requestId = computed(() => String(route.params.id || ""));
const { data, isLoading, isFetching } =
  useAdminRefundRequestDetailQuery(requestId);

const request = computed(() => data.value || null);
const isLoadingRequest = computed(() => isLoading.value || isFetching.value);

// Dialog states
const showApproveDialog = ref(false);
const showConfirmTransferDialog = ref(false);
const showConfirmPickupDialog = ref(false);
const showRejectDialog = ref(false);

// Reject form
const rejectReason = ref("");
const rejectError = ref("");

// Transaction proof
const transactionFile = ref<File | null>(null);
const transactionError = ref("");

const isPending = computed(() => request.value?.status === "pending");
const isProcessingRefund = computed(
  () => request.value?.status === "processing_refund",
);
const isApprovedWaitingPickup = computed(
  () => request.value?.status === "approved_waiting_pickup",
);
const isRejected = computed(() => request.value?.status === "rejected");
const isCashOnPickup = computed(
  () => request.value?.refundMethod === "cash_on_pickup",
);

const createdAtLabel = computed(() =>
  formatDateTime(request.value?.createdAt || null),
);
const updatedAtLabel = computed(() =>
  formatDateTime(request.value?.updatedAt || null),
);
const amountLabel = computed(() => formatVND(request.value?.amount || 0));

const imageList = computed(() => request.value?.images || []);
const videoList = computed(() => request.value?.videos || []);
const itemList = computed(() => request.value?.items || []);

const hasImages = computed(() => imageList.value.length > 0);
const hasVideos = computed(() => videoList.value.length > 0);
const hasRejectReason = computed(() => Boolean(request.value?.rejectReason));

const displayItems = computed(() =>
  itemList.value.map((item) => ({
    ...item,
    displayPrice: formatVND(item.price || 0),
    displaySubtotal: formatVND((item.price || 0) * (item.quantity || 0)),
  })),
);

const customerInfo = computed(() => ({
  name: request.value?.customerName || "—",
  userId: request.value?.userId || "—",
  orderId: request.value?.orderId || "",
}));

const refundMethodLabel = computed(() =>
  isCashOnPickup.value
    ? "💵 Tiền mặt khi shipper lấy hàng"
    : "🏦 Chuyển khoản ngân hàng",
);

const bankInfo = computed(() => request.value?.bankInfo || null);
const hasBankInfo = computed(() => Boolean(bankInfo.value));
const transactionImage = computed(() => request.value?.transactionImage || "");
const hasTransactionImage = computed(() => Boolean(transactionImage.value));

const { mutate: approveRefund, isPending: isApproving } =
  useApproveAdminRefundRequestMutation();
const { mutate: rejectRefund, isPending: isRejecting } =
  useRejectAdminRefundRequestMutation();
const { mutate: completeRefund, isPending: isCompleting } =
  useCompleteAdminRefundRequestMutation();

const actionLoading = computed(
  () => isApproving.value || isRejecting.value || isCompleting.value,
);

const resetRejectForm = () => {
  rejectReason.value = "";
  rejectError.value = "";
};

const resetTransaction = () => {
  transactionFile.value = null;
  transactionError.value = "";
};

const openRejectDialog = () => {
  resetRejectForm();
  showRejectDialog.value = true;
};

const onSelectTransaction = (event: any) => {
  const files: File[] = event.files || [];
  transactionFile.value = files[0] || null;
  transactionError.value = "";
};

const buildCompletePayload = () => {
  const formData = new FormData();
  if (transactionFile.value) {
    formData.append("transactionImage", transactionFile.value);
  }
  return formData;
};

const handleApprove = () => {
  if (!request.value?.id) return;
  approveRefund(request.value.id, {
    onSuccess: () => {
      showApproveDialog.value = false;
    },
  });
};

const handleConfirmTransfer = () => {
  if (!transactionFile.value) {
    transactionError.value = "Vui lòng tải ảnh minh chứng chuyển khoản.";
    return;
  }
  if (!request.value?.id) return;
  completeRefund(
    { id: request.value.id, payload: buildCompletePayload() },
    {
      onSuccess: () => {
        showConfirmTransferDialog.value = false;
        resetTransaction();
      },
    },
  );
};

const handleConfirmPickup = () => {
  if (!request.value?.id) return;
  completeRefund(
    { id: request.value.id, payload: buildCompletePayload() },
    {
      onSuccess: () => {
        showConfirmPickupDialog.value = false;
        resetTransaction();
      },
    },
  );
};

const handleReject = () => {
  const reason = rejectReason.value.trim();
  if (!reason) {
    rejectError.value = "Vui lòng nhập lý do từ chối.";
    return;
  }
  if (!request.value?.id) return;
  rejectRefund(
    { id: request.value.id, reason },
    {
      onSuccess: () => {
        showRejectDialog.value = false;
        resetRejectForm();
      },
    },
  );
};

watch(showConfirmTransferDialog, (visible) => {
  if (!visible) resetTransaction();
});

watch(showRejectDialog, (visible) => {
  if (!visible) resetRejectForm();
});
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Chi tiết yêu cầu hoàn tiền"
      :subtitle="request ? `Mã yêu cầu: ${request.id}` : 'Đang tải...'"
      show-back-button
    />

    <div
      v-if="isLoadingRequest"
      class="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-12 text-slate-500 dark:border-slate-700 dark:bg-slate-900"
    >
      <i class="pi pi-spin pi-spinner text-3xl text-slate-300"></i>
      <p>Đang tải yêu cầu hoàn tiền...</p>
    </div>

    <!-- Not found -->
    <div
      v-else-if="!request"
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
            Tạo lúc {{ createdAtLabel }}
          </span>
          <span
            v-if="request.updatedAt"
            class="text-sm text-slate-400 dark:text-slate-500"
          >
            · Cập nhật {{ updatedAtLabel }}
          </span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Approve button (only when pending) -->
          <button
            v-if="isPending"
            @click="showApproveDialog = true"
            class="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
          >
            <i class="pi pi-check-circle"></i>
            Duyệt yêu cầu
          </button>
          <!-- Confirm Transfer (when processing_refund) -->
          <button
            v-if="isProcessingRefund"
            @click="showConfirmTransferDialog = true"
            class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            <i class="pi pi-wallet"></i>
            Xác nhận đã chuyển khoản
          </button>
          <!-- Confirm Pickup (when approved_waiting_pickup) -->
          <button
            v-if="isApprovedWaitingPickup"
            @click="showConfirmPickupDialog = true"
            class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            <i class="pi pi-check-square"></i>
            Xác nhận đã lấy hàng & hoàn tiền
          </button>
          <!-- Reject button (pending or approved_waiting_pickup) -->
          <!-- Shipper chạy đến nhà khách lấy hàng, nhưng phát hiện khách cố tình tráo hàng giả hoặc làm hỏng hàng chứ không phải lỗi do shop. Shipper gọi báo Admin, Admin có thể bấm Từ chối yêu cầu ngay lúc đó với lý do "Khách hàng tráo sản phẩm". -->
          <button
            v-if="isPending"
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
        v-if="isRejected && hasRejectReason"
        class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20"
      >
        <i class="pi pi-exclamation-circle mt-0.5 text-red-500"></i>
        <div>
          <p class="text-sm font-semibold text-red-700 dark:text-red-400">
            Lý do từ chối
          </p>
          <p class="mt-1 text-sm text-red-600 dark:text-red-300">
            {{ request.rejectReason }}
          </p>
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
            <h2
              class="mb-3 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2"
            >
              <i class="pi pi-comment text-primary-500"></i>
              Lý do hoàn tiền
            </h2>
            <p
              class="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
            >
              {{ request.reason }}
            </p>
          </section>

          <!-- Evidence: images -->
          <section
            v-if="hasImages"
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2
              class="mb-4 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2"
            >
              <i class="pi pi-images text-primary-500"></i>
              Hình ảnh minh chứng ({{ imageList.length }})
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <a
                v-for="(img, idx) in imageList"
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
            v-if="hasVideos"
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2
              class="mb-4 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2"
            >
              <i class="pi pi-video text-primary-500"></i>
              Video minh chứng ({{ videoList.length }})
            </h2>
            <div class="space-y-3">
              <video
                v-for="(vid, idx) in videoList"
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
            <h2
              class="mb-4 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2"
            >
              <i class="pi pi-list text-primary-500"></i>
              Sản phẩm yêu cầu hoàn ({{ itemList.length }})
            </h2>
            <div class="overflow-x-auto">
              <table
                class="min-w-full divide-y divide-slate-200 dark:divide-slate-700"
              >
                <thead>
                  <tr class="text-left">
                    <th
                      class="py-2 text-xs font-semibold uppercase text-slate-500"
                    >
                      Sản phẩm
                    </th>
                    <th
                      class="py-2 text-xs font-semibold uppercase text-slate-500 text-center"
                    >
                      SL
                    </th>
                    <th
                      class="py-2 text-xs font-semibold uppercase text-slate-500 text-right"
                    >
                      Giá
                    </th>
                    <th
                      class="py-2 text-xs font-semibold uppercase text-slate-500 text-right"
                    >
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="item in displayItems" :key="item.productId">
                    <td
                      class="py-2.5 text-sm font-medium text-slate-800 dark:text-white"
                    >
                      {{ item.productName }}
                    </td>
                    <td
                      class="py-2.5 text-sm text-center text-slate-600 dark:text-slate-300"
                    >
                      {{ item.quantity }}
                    </td>
                    <td
                      class="py-2.5 text-sm text-right text-slate-600 dark:text-slate-300"
                    >
                      {{ item.displayPrice }}
                    </td>
                    <td
                      class="py-2.5 text-sm font-bold text-right text-slate-900 dark:text-white"
                    >
                      {{ item.displaySubtotal }}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-t-2 border-slate-200 dark:border-slate-700">
                    <td
                      colspan="3"
                      class="pt-3 text-sm font-semibold text-slate-700 dark:text-slate-200 text-right"
                    >
                      Tổng hoàn tiền:
                    </td>
                    <td
                      class="pt-3 text-right text-base font-bold text-rose-600 dark:text-rose-400"
                    >
                      {{ amountLabel }}
                    </td>
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
            <h2
              class="mb-4 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2"
            >
              <i class="pi pi-user text-primary-500"></i>
              Thông tin khách hàng
            </h2>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-500">Tên</dt>
                <dd class="font-medium text-slate-900 dark:text-white">
                  {{ customerInfo.name }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">User ID</dt>
                <dd
                  class="font-mono text-xs text-slate-600 dark:text-slate-300"
                >
                  {{ customerInfo.userId }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">Mã đơn hàng</dt>
                <dd
                  class="font-mono text-xs font-bold text-primary-600 dark:text-primary-400"
                >
                  #{{ customerInfo.orderId }}
                </dd>
              </div>
            </dl>
          </section>

          <!-- Bank Info / Refund Method Info -->
          <section
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2
              class="mb-4 text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2"
            >
              <i class="pi pi-building-columns text-primary-500"></i>
              Thông tin nhận tiền
            </h2>

            <div class="mb-4 flex items-center justify-between text-sm">
              <span class="text-slate-500">Phương thức:</span>
              <span class="font-bold text-slate-900 dark:text-white">
                {{ refundMethodLabel }}
              </span>
            </div>

            <!-- Nếu là cash_on_pickup -->
            <div
              v-if="isCashOnPickup"
              class="space-y-3 rounded-xl bg-orange-50 p-4 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30"
            >
              <div
                class="flex items-center gap-2 text-orange-800 dark:text-orange-300"
              >
                <i class="pi pi-info-circle"></i>
                <span class="text-xs font-semibold">Nhận tiền mặt tại chỗ</span>
              </div>
              <p class="text-xs text-orange-700 dark:text-orange-400">
                Shipper sẽ mang tiền mặt và hoàn trả trực tiếp cho khách khi lấy
                hàng hoàn. Không cần thông tin ngân hàng.
              </p>
              <div
                class="border-t border-orange-200/60 pt-3 dark:border-orange-800/40"
              >
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Số tiền cần hoàn trả:</span>
                  <span
                    class="text-base font-bold text-rose-600 dark:text-rose-400"
                    >{{ amountLabel }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Nếu là bank_transfer và đã có thông tin ngân hàng -->
            <div
              v-else-if="hasBankInfo"
              class="space-y-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-500">Ngân hàng</span>
                <span
                  class="text-sm font-bold text-slate-900 dark:text-white"
                  >{{ bankInfo?.bankName }}</span
                >
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-500">Số tài khoản</span>
                <span
                  class="font-mono text-sm font-bold text-primary-600 dark:text-primary-400"
                  >{{ bankInfo?.accountNumber }}</span
                >
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-500">Chủ tài khoản</span>
                <span
                  class="text-sm font-semibold text-slate-900 dark:text-white"
                  >{{ bankInfo?.accountHolder }}</span
                >
              </div>
              <div class="border-t border-slate-200 pt-3 dark:border-slate-700">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-slate-500">Số tiền cần chuyển</span>
                  <span
                    class="text-base font-bold text-rose-600 dark:text-rose-400"
                    >{{ amountLabel }}</span
                  >
                </div>
              </div>
            </div>

            <div
              v-else
              class="flex flex-col items-center gap-2 py-6 text-center text-slate-400"
            >
              <i class="pi pi-clock text-2xl"></i>
              <p class="text-sm">
                Khách hàng chưa cung cấp thông tin tài khoản.
              </p>
            </div>

            <div
              v-if="hasTransactionImage"
              class="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <p class="text-xs font-semibold uppercase text-slate-500">
                Minh chứng chuyển khoản
              </p>
              <a
                :href="transactionImage"
                target="_blank"
                class="mt-3 block overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <img
                  :src="transactionImage"
                  alt="Minh chứng chuyển khoản"
                  class="h-48 w-full object-cover"
                />
              </a>
            </div>
          </section>
        </div>
      </div>
    </template>

    <!-- Approve Dialog -->
    <ConfirmDialog
      :visible="showApproveDialog"
      title="Duyệt yêu cầu hoàn tiền"
      message="Bạn xác nhận duyệt yêu cầu này? "
      confirm-label="Duyệt"
      cancel-label="Hủy"
      :loading="actionLoading"
      @confirm="handleApprove"
      @cancel="showApproveDialog = false"
      @update:visible="(v) => !v && (showApproveDialog = false)"
    />

    <!-- Confirm Transfer Dialog -->
    <Dialog
      :visible="showConfirmTransferDialog"
      modal
      header="Xác nhận đã chuyển khoản"
      class="w-full sm:max-w-md"
      :closable="!actionLoading"
      @update:visible="(v) => (showConfirmTransferDialog = v)"
    >
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Vui lòng tải ảnh minh chứng chuyển khoản trước khi xác nhận hoàn tất.
      </p>

      <div class="mt-4 space-y-2">
        <label class="text-xs font-semibold uppercase text-slate-500">
          Minh chứng chuyển khoản <span class="text-red-500">*</span>
        </label>
        <FileUpload
          name="transactionImage"
          mode="basic"
          customUpload
          :auto="true"
          :multiple="false"
          accept="image/*"
          :maxFileSize="10485760"
          :chooseLabel="transactionFile ? 'Đã chọn' : 'Chọn ảnh'"
          :disabled="actionLoading"
          @select="onSelectTransaction"
        />
        <p v-if="transactionFile" class="text-xs text-slate-500">
          {{ transactionFile.name }}
        </p>
        <p v-if="transactionError" class="text-xs text-red-500">
          {{ transactionError }}
        </p>
      </div>

      <template #footer>
        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="actionLoading"
            class="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
            @click="showConfirmTransferDialog = false"
          >
            Hủy
          </button>
          <button
            type="button"
            :disabled="actionLoading"
            class="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 hover:bg-primary-700"
            @click="handleConfirmTransfer"
          >
            <i v-if="actionLoading" class="pi pi-spin pi-spinner mr-2"></i>
            Xác nhận
          </button>
        </div>
      </template>
    </Dialog>

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
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30"
            >
              <i class="pi pi-exclamation-triangle text-red-600 text-lg"></i>
            </div>
            <span class="text-lg font-semibold text-slate-900 dark:text-white"
              >Từ chối yêu cầu</span
            >
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Vui lòng nhập lý do từ chối để khách hàng được biết.
          </p>
          <textarea
            v-model="rejectReason"
            rows="4"
            placeholder="Nhập lý do từ chối..."
            class="w-full rounded-lg border px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200"
            :class="
              rejectError
                ? 'border-red-400 focus:ring-red-300'
                : 'border-slate-300 focus:ring-primary-300 dark:border-slate-600'
            "
          ></textarea>
          <p v-if="rejectError" class="mt-1 text-xs text-red-500">
            {{ rejectError }}
          </p>
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
