<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import FileUpload from "primevue/fileupload";
import { useCreateRefundMutation } from "~/mutations/refund/useRefundMutations";

import type { OrderItem, RefundRequestData } from "~/types/refund.type";

interface Props {
  visible: boolean;
  orderId: string;
  items: OrderItem[];
  refundRequest?: RefundRequestData | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{ "update:visible": [boolean] }>();

type EvidenceFileItem = {
  file: File;
  previewUrl: string;
  type: "image" | "video";
};

const selectedMap = ref<Record<string, { checked: boolean; quantity: number }>>(
  {},
);
const reason = ref("");
const evidenceFiles = ref<EvidenceFileItem[]>([]);

// --- Refund Method ---
const refundMethod = ref<"bank_transfer" | "cash_on_pickup">("bank_transfer");

// --- Bank info fields (only for bank_transfer) ---
const bankName = ref("");
const accountNumber = ref("");
const accountHolder = ref("");

const { mutate: createRefund, isPending: isCreating } = useCreateRefundMutation(
  props.orderId,
);

type VietQrBank = {
  shortName: string;
  name: string;
};

const { data: bankData, pending: isBankLoading } = useFetch<{
  data: VietQrBank[];
}>("https://api.vietqr.io/v2/banks", { server: false });

const bankOptions = computed(() => {
  const banks = bankData.value?.data || [];
  return banks.map((bank: VietQrBank) => ({
    label: `${bank.shortName} - ${bank.name}`,
    value: bank.name,
  }));
});

// Lấy trạng thái của yêu cầu hoàn tiền hiện tại
const refundStatus = computed(() => props.refundRequest?.status || "");
const isWaitingPickup = computed(
  () => refundStatus.value === "approved_waiting_pickup",
);
const isRejected = computed(() => refundStatus.value === "rejected");

// Kiểm tra có yêu cầu hoàn tiền nào đang tồn tại (không phải bị từ chối)
const hasExistingRequest = computed(() => {
  if (!props.refundRequest?._id) return false;
  return props.refundRequest.status !== "rejected";
});

// Computed: có hiển thị form nhập thông tin ngân hàng không
const isShowBankForm = computed(() => refundMethod.value === "bank_transfer");

// Lọc ra danh sách các sản phẩm được người dùng tick chọn
const selectedItems = computed(() => {
  return props.items
    .filter((item) => selectedMap.value[item.productId]?.checked)
    .map((item) => ({
      productId: item.productId,
      quantity: selectedMap.value[item.productId]?.quantity || 1,
    }));
});

const uploadedImages = computed(() =>
  evidenceFiles.value
    .filter((item) => item.type === "image")
    .map((item) => item.previewUrl),
);

const uploadedVideos = computed(() =>
  evidenceFiles.value
    .filter((item) => item.type === "video")
    .map((item) => item.previewUrl),
);

const canSubmitRequest = computed(() => {
  const baseValid =
    selectedItems.value.length > 0 &&
    reason.value.trim().length > 0 &&
    evidenceFiles.value.length > 0 &&
    !isRejected.value;

  if (refundMethod.value === "bank_transfer") {
    return (
      baseValid &&
      bankName.value.trim().length > 0 &&
      accountNumber.value.trim().length > 0 &&
      accountHolder.value.trim().length > 0
    );
  }
  return baseValid;
});

//Xóa sạch dữ liệu trên form (bỏ chọn sản phẩm, xóa lý do, xóa các link ảnh đã upload).
const resetForm = () => {
  selectedMap.value = props.items.reduce(
    (acc, item) => {
      acc[item.productId] = { checked: false, quantity: 1 };
      return acc;
    },
    {} as Record<string, { checked: boolean; quantity: number }>,
  );
  reason.value = "";
  evidenceFiles.value.forEach((item) => URL.revokeObjectURL(item.previewUrl));
  evidenceFiles.value = [];
  refundMethod.value = "bank_transfer";
  bankName.value = "";
  accountNumber.value = "";
  accountHolder.value = "";
};

watch(
  () => props.items,
  () => resetForm(),
  { immediate: true },
);

watch(
  () => props.visible,
  (value) => {
    if (value) {
      resetForm();
      bankName.value = props.refundRequest?.bankInfo?.bankName || "";
      accountNumber.value = props.refundRequest?.bankInfo?.accountNumber || "";
      accountHolder.value = props.refundRequest?.bankInfo?.accountHolder || "";
    }
  },
);

const onSelectEvidence = async (event: { files?: File[] }) => {
  const files = event.files || [];
  if (!files.length) return;

  const nextFiles: EvidenceFileItem[] = files.map((file) => {
    const type = file.type.startsWith("video/") ? "video" : "image";
    return {
      file,
      type,
      previewUrl: URL.createObjectURL(file),
    };
  });

  evidenceFiles.value = [...evidenceFiles.value, ...nextFiles];
};

const removeEvidence = (_type: "image" | "video", url: string) => {
  const target = evidenceFiles.value.find((item) => item.previewUrl === url);
  if (target) {
    URL.revokeObjectURL(target.previewUrl);
  }
  evidenceFiles.value = evidenceFiles.value.filter(
    (item) => item.previewUrl !== url,
  );
};

const submitRefundRequest = () => {
  if (!canSubmitRequest.value) return;

  const payload = new FormData();
  payload.append("orderId", props.orderId);
  payload.append("items", JSON.stringify(selectedItems.value));
  payload.append("reason", reason.value.trim());
  payload.append("refundMethod", refundMethod.value);
  payload.append("images", JSON.stringify([]));
  payload.append("videos", JSON.stringify([]));

  if (refundMethod.value === "bank_transfer") {
    payload.append(
      "bankInfo",
      JSON.stringify({
        bankName: bankName.value.trim(),
        accountNumber: accountNumber.value.trim(),
        accountHolder: accountHolder.value.trim(),
      }),
    );
  }

  evidenceFiles.value.forEach((item) => {
    payload.append("evidence", item.file);
  });

  createRefund(payload, {
    onSuccess: () => {
      evidenceFiles.value.forEach((item) =>
        URL.revokeObjectURL(item.previewUrl),
      );
      evidenceFiles.value = [];
      emit("update:visible", false);
    },
  });
};

onBeforeUnmount(() => {
  evidenceFiles.value.forEach((item) => URL.revokeObjectURL(item.previewUrl));
});
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Trả hàng / Hoàn tiền"
    class="w-full max-w-3xl"
    @update:visible="(v) => emit('update:visible', v)"
  >
    <div class="space-y-5">
      <div
        class="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700"
      >
        Lưu ý: Yêu cầu hoàn tiền chỉ hợp lệ trong 24 giờ kể từ khi đơn hàng giao
        thành công.
      </div>

      <div
        v-if="isRejected"
        class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
      >
        Yêu cầu hoàn tiền đã bị từ chối. Lý do:
        {{ refundRequest?.rejectReason || "Không có lý do được cung cấp" }}
      </div>

      <div v-else-if="isWaitingPickup" class="space-y-4">
        <div
          class="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          ✅ Yêu cầu đã được duyệt. Shipper sẽ liên hệ để đến lấy hàng và hoàn
          trả tiền mặt cho bạn.
        </div>
        <div
          class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700 flex items-start gap-2"
        >
          <span class="text-base mt-0.5">📦</span>
          <span
            >Vui lòng chuẩn bị sản phẩm cần hoàn trả và tiếp nhận shipper khi họ
            đến lấy hàng. Bạn sẽ nhận lại tiền mặt trực tiếp.</span
          >
        </div>
        <div class="flex justify-end">
          <button
            class="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            type="button"
            @click="() => emit('update:visible', false)"
          >
            Đóng
          </button>
        </div>
      </div>

      <div v-else-if="!hasExistingRequest" class="space-y-5">
        <div class="space-y-3">
          <h3 class="text-base font-semibold text-gray-900">
            Chọn sản phẩm cần hoàn
          </h3>
          <div class="space-y-3">
            <div
              v-for="item in items"
              :key="item.productId"
              class="flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 p-3"
            >
              <label class="flex items-center gap-3">
                <input
                  v-model="selectedMap[item.productId]!.checked"
                  type="checkbox"
                  class="h-4 w-4 accent-[#f47f20]"
                  :disabled="isRejected"
                />
                <img
                  :src="item.thumbnail"
                  :alt="item.title"
                  class="h-12 w-12 rounded-lg object-cover"
                />
                <div>
                  <p class="text-sm font-semibold text-gray-800">
                    {{ item.title }}
                  </p>
                  <p class="text-xs text-gray-500">
                    Đã mua: {{ item.quantity }}
                  </p>
                </div>
              </label>
              <div class="ml-auto flex items-center gap-2">
                <span class="text-xs text-gray-500">Số lượng</span>
                <InputNumber
                  v-model="selectedMap[item.productId]!.quantity"
                  :min="1"
                  :max="item.quantity"
                  :disabled="
                    !selectedMap[item.productId]!.checked || isRejected
                  "
                  class="w-24"
                  input-class="w-full"
                  show-buttons
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="text-sm font-semibold text-gray-700">Lý do hoàn</label>
          <Textarea
            v-model="reason"
            rows="4"
            class="mt-2 w-full"
            placeholder="Mô tả tình trạng món ăn, lỗi đóng gói, thiếu món..."
            :disabled="isRejected"
          />
        </div>

        <div class="space-y-3">
          <h3 class="text-base font-semibold text-gray-900">
            Phương thức nhận hoàn tiền
          </h3>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label
              :class="[
                'flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all',
                refundMethod === 'bank_transfer'
                  ? 'border-[#f47f20] bg-orange-50'
                  : 'border-gray-100 hover:border-gray-200',
              ]"
            >
              <input
                v-model="refundMethod"
                type="radio"
                value="bank_transfer"
                class="mt-0.5 accent-[#f47f20]"
              />
              <div>
                <p class="text-sm font-semibold text-gray-800">
                  🏦 Chuyển khoản ngân hàng
                </p>
                <p class="mt-0.5 text-xs text-gray-500">
                  Nhận tiền hoàn qua tài khoản ngân hàng
                </p>
              </div>
            </label>

            <label
              :class="[
                'flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all',
                refundMethod === 'cash_on_pickup'
                  ? 'border-[#f47f20] bg-orange-50'
                  : 'border-gray-100 hover:border-gray-200',
              ]"
            >
              <input
                v-model="refundMethod"
                type="radio"
                value="cash_on_pickup"
                class="mt-0.5 accent-[#f47f20]"
              />
              <div>
                <p class="text-sm font-semibold text-gray-800">
                  💵 Tiền mặt khi shipper đến lấy
                </p>
                <p class="mt-0.5 text-xs text-gray-500">
                  Nhận tiền mặt trực tiếp khi shipper đến lấy hàng hoàn trả
                </p>
              </div>
            </label>
          </div>

          <div
            v-if="!isShowBankForm"
            class="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700"
          >
            <span class="text-base mt-0.5">ℹ️</span>
            <span
              >Shipper sẽ hoàn trả tiền mặt khi đến lấy sản phẩm hoàn trả. Vui
              lòng chuẩn bị sản phẩm và ở nhà để tiếp nhận shipper.</span
            >
          </div>
        </div>

        <div v-if="isShowBankForm" class="space-y-3">
          <h3 class="text-base font-semibold text-gray-900">
            Thông tin tài khoản ngân hàng <span class="text-red-500">*</span>
          </h3>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="md:col-span-2">
              <label class="text-sm font-semibold text-gray-700"
                >Ngân hàng</label
              >
              <Dropdown
                v-model="bankName"
                :options="bankOptions"
                option-label="label"
                option-value="value"
                :loading="isBankLoading"
                placeholder="Chọn ngân hàng"
                class="mt-2 w-full"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-700"
                >Số tài khoản</label
              >
              <InputText
                v-model="accountNumber"
                class="mt-2 w-full"
                placeholder="Nhập số tài khoản"
              />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-700"
                >Chủ tài khoản</label
              >
              <InputText
                v-model="accountHolder"
                class="mt-2 w-full"
                placeholder="Nhập tên chủ tài khoản"
              />
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <label class="text-sm font-semibold text-gray-700"
            >Minh chứng (bắt buộc ít nhất 1 ảnh/video)</label
          >
          <div class="flex items-center gap-3">
            <FileUpload
              name="evidence"
              mode="basic"
              choose-label="Chọn ảnh/video"
              custom-upload
              :auto="true"
              :multiple="true"
              accept="image/*,video/*"
              :max-file-size="10485760"
              :disabled="isRejected"
              @select="onSelectEvidence"
            />
          </div>

          <div v-if="uploadedImages.length" class="grid gap-3 md:grid-cols-3">
            <div
              v-for="image in uploadedImages"
              :key="image"
              class="relative overflow-hidden rounded-xl border border-gray-100"
            >
              <img
                :src="image"
                alt="evidence"
                class="h-24 w-full object-cover"
              />
              <button
                type="button"
                class="absolute right-2 top-2 rounded-full bg-white/80 px-2 py-1 text-xs text-gray-600"
                @click="removeEvidence('image', image)"
              >
                Xóa
              </button>
            </div>
          </div>

          <div v-if="uploadedVideos.length" class="space-y-2">
            <div
              v-for="video in uploadedVideos"
              :key="video"
              class="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2 text-sm"
            >
              <span class="truncate text-gray-600">{{ video }}</span>
              <button
                type="button"
                class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                @click="removeEvidence('video', video)"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            class="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            type="button"
            @click="() => emit('update:visible', false)"
          >
            Đóng
          </button>
          <button
            class="rounded-full bg-[#f47f20] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#e06e10] disabled:opacity-60"
            type="button"
            :disabled="!canSubmitRequest || isCreating"
            @click="submitRefundRequest"
          >
            <span v-if="isCreating" class="inline-flex items-center gap-2">
              <i class="pi pi-spin pi-spinner text-sm"></i>
              Đang gửi...
            </span>
            <span v-else>Gửi yêu cầu</span>
          </button>
        </div>
      </div>

      <div
        v-else
        class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600"
      >
        Yêu cầu hoàn tiền đang được xử lý. Vui lòng theo dõi trạng thái tại
        trang chi tiết đơn hàng.
      </div>
    </div>
  </Dialog>
</template>
