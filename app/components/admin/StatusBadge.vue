<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{
  status: string;
  type?: "order" | "payment" | "user" | "product" | "voucher" | "review" | "refund";
}>();

const statusMap: Record<string, Record<string, string>> = {
  order: {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    confirmed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    preparing:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    shipping:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    delivered:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  payment: {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    refunded: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  },
  user: {
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    banned: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  product: {
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    draft:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    out_of_stock:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  voucher: {
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    expired: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  review: {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    approved:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  refund: {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    approved_waiting_bank_info:
      "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    approved_waiting_pickup:
      "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    processing_refund:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
};

const badgeClass = computed(() => {
  const map = statusMap[props.type || "order"] || {};
  return (
    map[props.status] ||
    "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
  );
});

const labelMap: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  shipping: "Đang giao hàng",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
  paid: "Đã thanh toán",
  completed: "Hoàn thành",
  failed: "Thanh toán thất bại",
  refunded: "Đã hoàn tiền",
  active: "Hoạt động",
  inactive: "Ngừng hoạt động",
  banned: "Bị khóa",
  draft: "Bản nháp",
  out_of_stock: "Hết hàng",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  expired: "Hết hạn",
  approved_waiting_bank_info: "Chờ thông tin TK",
  approved_waiting_pickup: "Chờ lấy hàng & hoàn tiền",
  processing_refund: "Đang xử lý hoàn tiền",
};
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full"
    :class="badgeClass"
  >
    {{ labelMap[status] || status.replace(/_/g, " ") }}
  </span>
</template>
