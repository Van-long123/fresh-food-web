<template>
  <div class="grid grid-cols-2 gap-8">
    <div>
      <h3 class="font-bold text-gray-800 mb-3 uppercase text-sm border-b pb-2 border-gray-200">Thông tin khách hàng</h3>
      <div class="space-y-1.5 text-sm">
        <div class="flex">
          <span class="text-gray-500 w-24">Họ tên:</span>
          <span class="font-semibold text-gray-900">{{ order.userInfo?.fullname }}</span>
        </div>
        <div class="flex">
          <span class="text-gray-500 w-24">Điện thoại:</span>
          <span class="text-gray-900">{{ order.userInfo?.phone }}</span>
        </div>
        <div class="flex">
          <span class="text-gray-500 w-24 flex-shrink-0">Địa chỉ:</span>
          <span class="flex-1 text-gray-900">{{ formatAddress }}</span>
        </div>
        <div class="flex" v-if="order.userInfo?.note">
          <span class="text-gray-500 w-24 flex-shrink-0">Ghi chú:</span>
          <span class="flex-1 italic text-gray-700">{{ order.userInfo?.note }}</span>
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="font-bold text-gray-800 mb-3 uppercase text-sm border-b pb-2 border-gray-200">Thông tin thanh toán</h3>
      <div class="space-y-1.5 text-sm">
        <div class="flex">
          <span class="text-gray-500 w-32">Phương thức:</span>
          <span class="font-semibold text-gray-900">{{ paymentMethodMeta?.label || 'COD' }}</span>
        </div>
        <div class="flex">
          <span class="text-gray-500 w-32">Trạng thái:</span>
          <span class="font-semibold text-gray-900">{{ paymentMeta?.label || 'Chờ thanh toán' }}</span>
        </div>
        <div class="flex" v-if="order.payment?.transactionId">
          <span class="text-gray-500 w-32">Mã giao dịch:</span>
          <span class="font-mono text-gray-900">{{ order.payment.transactionId }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  paymentMeta: {
    type: Object,
    required: true
  },
  paymentMethodMeta: {
    type: Object,
    required: true
  }
});

const formatAddress = computed(() => {
  const info = props.order?.userInfo;
  if (!info) return '';
  return [info.address, info.ward, info.district, info.province].filter(Boolean).join(', ');
});
</script>
