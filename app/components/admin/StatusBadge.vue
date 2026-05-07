<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{
  status: string;
  type?: "order" | "payment" | "user" | "product" | "voucher" | "review";
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
    failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
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
};

const badgeClass = computed(() => {
  const map = statusMap[props.type || "order"] || {};
  return (
    map[props.status] ||
    "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
  );
});
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full"
    :class="badgeClass"
  >
    {{ status.replace(/_/g, " ") }}
  </span>
</template>
