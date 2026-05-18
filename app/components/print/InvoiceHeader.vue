<template>
  <div class="flex justify-between items-start">
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2 mb-2">
        <div
          class="w-10 h-10 bg-[#f47f20] text-white rounded-lg flex items-center justify-center font-black text-xl keep-colors"
        >
          SF
        </div>
        <div class="font-black text-2xl tracking-tight">SmartFood</div>
      </div>
      <div class="text-sm text-gray-600">
        📍 123 Nguyễn Văn Linh, Thành phố Đà Nẵng, Việt Nam
      </div>
      <div class="text-sm text-gray-600">📞 Hotline: 0775580605</div>
      <div class="text-sm text-gray-600">✉️ Email: support@smartfood.vn</div>
    </div>

    <div class="text-right">
      <h1 class="text-3xl font-black uppercase tracking-wider mb-2">HÓA ĐƠN</h1>
      <div class="text-sm text-gray-600 mb-1">
        <span class="font-medium">Mã đơn:</span>
        <span class="font-mono">#{{ order.orderCode || order._id }}</span>
      </div>
      <div class="text-sm text-gray-600 mb-1">
        <span class="font-medium">Ngày đặt:</span>
        {{ formatDateTime(order.createdAt) }}
      </div>
      <div class="text-sm text-gray-600">
        <span class="font-medium">Trạng thái:</span>
        <span
          class="ml-1 px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 border border-gray-200 keep-colors"
        >
          {{ orderStatusLabel }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { STATUS_MAP } from "~/constants/order";

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
  formatDateTime: {
    type: Function,
    required: true,
  },
});

const orderStatusLabel = computed(() => {
  const status = props.order?.status;
  return STATUS_MAP[status]?.label || "Đang xử lý";
});
</script>
