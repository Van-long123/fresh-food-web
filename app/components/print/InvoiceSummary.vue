<template>
  <div class="bg-gray-50 rounded-xl p-5 border border-gray-200 keep-colors page-break-inside-avoid">
    <div class="space-y-3 text-sm">
      <div class="flex justify-between items-center">
        <span class="text-gray-600">Tạm tính:</span>
        <span class="font-medium text-gray-800">{{ formatVnd(subtotal) }}</span>
      </div>
      
      <div class="flex justify-between items-center" v-if="order.discountVoucher">
        <span class="text-gray-600">Giảm giá (Voucher):</span>
        <span class="font-medium text-green-600">-{{ formatVnd(order.discountVoucher) }}</span>
      </div>
      
      <div class="flex justify-between items-center">
        <span class="text-gray-600">Phí vận chuyển:</span>
        <span class="font-medium text-gray-800">{{ order.shippingFee === 0 ? 'Miễn phí' : formatVnd(order.shippingFee) }}</span>
      </div>
      
      <hr class="border-gray-300 my-3" />
      
      <div class="flex flex-col items-end gap-1">
        <div class="font-bold text-gray-800 text-sm uppercase">Tổng thanh toán:</div>
        <div class="font-black text-2xl text-[#f47f20]">{{ formatVnd(order.totalPrice) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatVnd } from '~/utils/currency';

defineProps({
  subtotal: {
    type: Number,
    required: true
  },
  order: {
    type: Object,
    required: true
  }
});
</script>
