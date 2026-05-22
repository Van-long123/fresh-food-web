<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import { formatVnd } from "~/utils/currency";

interface Props {
  visible: boolean;
  totalPrice: number;
  isPending?: boolean;
}

interface CancelPayload {
  reason: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:visible": [boolean];
  confirm: [payload: CancelPayload];
}>();

// --- Form fields ---
const reason = ref("");
const bankName = ref("");
const accountNumber = ref("");
const accountHolderName = ref("");

// --- Error states ---
const errors = ref({
  reason: "",
  bankName: "",
  accountNumber: "",
  accountHolderName: "",
});

// --- Bank list from VietQR ---
const { data: bankData, pending: isBankLoading } = useFetch<{ data: any[] }>(
  "https://api.vietqr.io/v2/banks",
  { server: false },
);

const bankOptions = computed(() => {
  const banks = bankData.value?.data || [];
  return banks.map((bank: any) => ({
    label: `${bank.shortName} - ${bank.name}`,
    value: bank.shortName,
  }));
});

// --- Auto uppercase accountHolderName ---
watch(accountHolderName, (val) => {
  const upper = val.toUpperCase();
  if (upper !== val) accountHolderName.value = upper;
});

// --- Reset form when dialog opens ---
watch(
  () => props.visible,
  (val) => {
    if (val) resetForm();
  },
);

function resetForm() {
  reason.value = "";
  bankName.value = "";
  accountNumber.value = "";
  accountHolderName.value = "";
  errors.value = {
    reason: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
  };
}

// --- Validation ---
function validate(): boolean {
  let valid = true;
  errors.value = {
    reason: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
  };

  if (!reason.value.trim()) {
    errors.value.reason = "Vui lòng nhập lý do hủy đơn";
    valid = false;
  } else if (reason.value.trim().length < 10) {
    errors.value.reason = "Lý do cần ít nhất 10 ký tự";
    valid = false;
  }

  if (!bankName.value) {
    errors.value.bankName = "Vui lòng chọn ngân hàng";
    valid = false;
  }

  if (!accountNumber.value.trim()) {
    errors.value.accountNumber = "Vui lòng nhập số tài khoản";
    valid = false;
  } else if (!/^\d{6,20}$/.test(accountNumber.value.trim())) {
    errors.value.accountNumber = "Số tài khoản không hợp lệ (6-20 chữ số)";
    valid = false;
  }

  if (!accountHolderName.value.trim()) {
    errors.value.accountHolderName = "Vui lòng nhập tên chủ tài khoản";
    valid = false;
  }

  return valid;
}

const canSubmit = computed(
  () =>
    reason.value.trim().length >= 10 &&
    bankName.value &&
    accountNumber.value.trim() &&
    accountHolderName.value.trim() &&
    !props.isPending,
);

function handleSubmit() {
  if (!validate()) return;
  emit("confirm", {
    reason: reason.value.trim(),
    bankName: bankName.value,
    accountNumber: accountNumber.value.trim(),
    accountHolderName: accountHolderName.value.trim(),
  });
}
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="(v) => emit('update:visible', v)"
    modal
    :showHeader="false"
    :draggable="false"
    :closable="false"
    class="w-full max-w-lg mx-4"
    :pt="{
      root: { class: '!rounded-2xl !shadow-2xl !overflow-hidden !p-0' },
      content: { class: '!p-0 max-h-[85vh] overflow-y-auto' },
    }"
  >
    <!-- ===== CUSTOM HEADER (gradient, no PrimeVue close btn interference) ===== -->
    <div
      class="relative bg-gradient-to-r from-red-500 to-rose-600 px-6 pt-5 pb-5 sticky top-0 z-20 shadow-sm"
    >
      <!-- Close button — positioned inside gradient -->
      <button
        v-if="!isPending"
        type="button"
        class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
        @click="emit('update:visible', false)"
        aria-label="Đóng"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <!-- Title row -->
      <div class="flex items-center gap-3 pr-10">
        <div
          class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg flex-shrink-0"
        >
          💸
        </div>
        <div>
          <h2 class="text-white font-black text-base leading-snug">
            Yêu cầu hủy đơn &amp; hoàn tiền
          </h2>
          <p class="text-red-100 text-xs mt-0.5">
            Đơn đã thanh toán qua PayOS · Hoàn tiền qua chuyển khoản
          </p>
        </div>
      </div>

      <!-- Amount badge -->
      <div
        class="mt-4 bg-white/15 rounded-xl px-4 py-3 flex items-center justify-between"
      >
        <span class="text-red-100 text-sm">Số tiền sẽ được hoàn lại</span>
        <span class="text-white font-black text-xl"
          >{{ formatVnd(totalPrice) }}đ</span
        >
      </div>
    </div>

    <!-- ===== BODY ===== -->
    <div class="px-6 py-5 space-y-5 bg-white">
      <!-- Info notice -->
      <div
        class="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
      >
        <span class="text-amber-500 text-base mt-0.5 flex-shrink-0">⚠️</span>
        <p class="text-amber-700 text-xs leading-relaxed">
          Sau khi xác nhận, đơn hàng sẽ bị hủy và một yêu cầu hoàn tiền sẽ được
          gửi đến Admin. Tiền sẽ được chuyển khoản về tài khoản bên dưới trong
          vòng
          <strong>1–3 ngày làm việc</strong>.
        </p>
      </div>

      <!-- Reason -->
      <div class="space-y-1.5">
        <label class="block text-sm font-bold text-gray-700">
          Lý do hủy đơn <span class="text-red-500">*</span>
        </label>
        <Textarea
          v-model="reason"
          rows="3"
          class="w-full text-sm"
          :class="errors.reason ? '!border-red-400' : ''"
          placeholder="Ví dụ: Tôi đặt nhầm sản phẩm, muốn thay đổi địa chỉ giao hàng..."
          :disabled="isPending"
        />
        <p
          v-if="errors.reason"
          class="text-xs text-red-500 flex items-center gap-1"
        >
          <span>⚠</span> {{ errors.reason }}
        </p>
        <p v-else class="text-xs text-gray-400">
          {{ reason.trim().length }}/10 ký tự tối thiểu
        </p>
      </div>

      <!-- Section divider -->
      <div class="flex items-center gap-3">
        <div class="flex-1 h-px bg-gray-100" />
        <span
          class="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
        >
          🏦 Thông tin tài khoản nhận hoàn tiền
        </span>
        <div class="flex-1 h-px bg-gray-100" />
      </div>

      <!-- Bank Name -->
      <div class="space-y-1.5">
        <label class="block text-sm font-bold text-gray-700">
          Ngân hàng thụ hưởng <span class="text-red-500">*</span>
        </label>
        <Dropdown
          v-model="bankName"
          :options="bankOptions"
          optionLabel="label"
          optionValue="value"
          :loading="isBankLoading"
          placeholder="Chọn ngân hàng..."
          filter
          filterPlaceholder="Tìm ngân hàng..."
          class="w-full"
          :class="errors.bankName ? '!border-red-400' : ''"
          :disabled="isPending"
        />
        <p
          v-if="errors.bankName"
          class="text-xs text-red-500 flex items-center gap-1"
        >
          <span>⚠</span> {{ errors.bankName }}
        </p>
      </div>

      <!-- Account Number + Holder Name -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="space-y-1.5">
          <label class="block text-sm font-bold text-gray-700">
            Số tài khoản <span class="text-red-500">*</span>
          </label>
          <InputText
            v-model="accountNumber"
            class="w-full"
            :class="errors.accountNumber ? '!border-red-400' : ''"
            placeholder="Nhập số tài khoản"
            :disabled="isPending"
            inputmode="numeric"
          />
          <p
            v-if="errors.accountNumber"
            class="text-xs text-red-500 flex items-center gap-1"
          >
            <span>⚠</span> {{ errors.accountNumber }}
          </p>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-bold text-gray-700">
            Tên chủ tài khoản <span class="text-red-500">*</span>
          </label>
          <InputText
            v-model="accountHolderName"
            class="w-full uppercase"
            :class="errors.accountHolderName ? '!border-red-400' : ''"
            placeholder="NGUYEN VAN A"
            :disabled="isPending"
          />
          <p
            v-if="errors.accountHolderName"
            class="text-xs text-red-500 flex items-center gap-1"
          >
            <span>⚠</span> {{ errors.accountHolderName }}
          </p>
          <p v-else class="text-xs text-gray-400">Tự động viết hoa</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-1">
        <button
          type="button"
          :disabled="isPending"
          class="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
          @click="emit('update:visible', false)"
        >
          Đóng
        </button>
        <button
          type="button"
          :disabled="!canSubmit"
          class="flex-[2] rounded-xl py-2.5 text-sm font-black text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition shadow-[0_4px_14px_rgba(239,68,68,0.35)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="handleSubmit"
        >
          <i v-if="isPending" class="pi pi-spinner animate-spin text-sm" />
          <span>{{
            isPending
              ? "Đang xử lý..."
              : "✓ Xác nhận hủy & gửi yêu cầu hoàn tiền"
          }}</span>
        </button>
      </div>
    </div>
  </Dialog>
</template>
