<template>
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-gray-100 border-y-2 border-gray-300 keep-colors">
        <th class="py-3 px-4 font-bold text-sm text-gray-800 w-12 text-center">STT</th>
        <th class="py-3 px-4 font-bold text-sm text-gray-800">Sản phẩm</th>
        <th class="py-3 px-4 font-bold text-sm text-gray-800 text-right w-32">Đơn giá</th>
        <th class="py-3 px-4 font-bold text-sm text-gray-800 text-center w-24">SL</th>
        <th class="py-3 px-4 font-bold text-sm text-gray-800 text-right w-36">Thành tiền</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 border-b-2 border-gray-300">
      <tr v-for="(item, index) in items" :key="item.productId" class="page-break-inside-avoid hover:bg-gray-50 transition-colors">
        <td class="py-4 px-4 text-sm text-center text-gray-600">{{ index + 1 }}</td>
        <td class="py-4 px-4 text-sm">
          <div class="font-semibold text-gray-800">{{ item.title }}</div>
        </td>
        <td class="py-4 px-4 text-sm text-right text-gray-600">{{ formatVnd(item.price) }}</td>
        <td class="py-4 px-4 text-sm text-center font-medium text-gray-800">{{ item.quantity }}</td>
        <td class="py-4 px-4 text-sm text-right font-bold text-gray-900">{{ formatVnd(item.totalPrice) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { formatVnd } from '~/utils/currency';

defineProps({
  items: {
    type: Array as () => any[],
    required: true
  }
});
</script>
