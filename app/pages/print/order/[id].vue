<template>
  <div
    class="print-page print-container bg-gray-50 min-h-screen p-4 sm:p-8 print:bg-white print:p-0"
  >
    <div
      v-if="isLoading"
      class="flex justify-center items-center h-screen no-print"
    >
      <i class="pi pi-spinner animate-spin text-4xl text-[#f47f20]"></i>
    </div>

    <div
      v-else-if="!orderData"
      class="text-center py-12 text-gray-500 no-print flex flex-col items-center justify-center h-screen"
    >
      <i class="pi pi-exclamation-circle text-6xl text-gray-300 mb-4"></i>
      <p class="text-xl font-semibold mb-6">Không tìm thấy đơn hàng</p>
      <button
        @click="goBack"
        class="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
      >
        ← Quay lại
      </button>
    </div>

    <div
      v-else
      class="max-w-[850px] mx-auto bg-white shadow-xl rounded-2xl p-8 sm:p-10 print:shadow-none print:rounded-none print:p-0 print:max-w-full relative"
    >
      <!-- Action buttons for normal view -->
      <div
        class="mb-8 flex justify-end gap-3 no-print absolute top-8 right-8 print:hidden"
      >
        <button
          @click="goBack"
          class="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
        >
          ← Quay lại
        </button>
        <button
          @click="printInvoice"
          class="px-4 py-2 text-sm font-semibold text-white bg-[#f47f20] border border-transparent rounded-lg shadow-md hover:bg-[#e06e10] transition flex items-center gap-2"
        >
          <span>🖨️</span>
          <span>In ngay</span>
        </button>
      </div>

      <!-- Invoice Content -->
      <div class="print-content pt-16 print:pt-0">
        <InvoiceHeader :order="order" :formatDateTime="formatDateTime" />

        <hr class="border-t border-gray-200 my-8" />

        <InvoiceCustomerInfo
          :order="order"
          :paymentMeta="paymentMeta"
          :paymentMethodMeta="paymentMethodMeta"
        />

        <div class="mt-8">
          <InvoiceProductsTable :items="items" />
        </div>

        <div class="mt-8 flex justify-end">
          <div class="w-full sm:w-2/3 md:w-1/2 lg:w-[40%]">
            <InvoiceSummary :subtotal="subtotal" :order="order" />
          </div>
        </div>

        <div
          class="mt-16 pt-8 border-t border-gray-100 flex flex-col items-center justify-center text-sm text-gray-500"
        >
          <p class="font-bold text-gray-800 text-base mb-1 text-center">
            Cảm ơn quý khách đã mua sắm tại SmartFood!
          </p>
          <div class="flex items-center gap-4 mt-2">
            <div class="flex items-center gap-1.5">
              <span>📞</span>
              <span class="font-medium text-gray-700">1900 xxxx</span>
            </div>
            <div class="w-1 h-1 rounded-full bg-gray-300"></div>
            <div class="flex items-center gap-1.5">
              <span>🌐</span>
              <span class="font-medium text-gray-700">smartfood.vn</span>
            </div>
          </div>
          <p class="mt-6 text-xs italic text-gray-400">
            Hóa đơn được tạo tự động bởi hệ thống vào lúc
            {{ formatDateTime(new Date().toISOString()) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrderDetail } from "~/composables/order/useOrderDetail";
import InvoiceHeader from "~/components/print/InvoiceHeader.vue";
import InvoiceCustomerInfo from "~/components/print/InvoiceCustomerInfo.vue";
import InvoiceProductsTable from "~/components/print/InvoiceProductsTable.vue";
import InvoiceSummary from "~/components/print/InvoiceSummary.vue";

definePageMeta({
  layout: false,
});

const route = useRoute();
const router = useRouter();
const orderId = route.params.id as string;

const {
  orderData,
  isLoading,
  order,
  items,
  subtotal,
  paymentMeta,
  paymentMethodMeta,
  formatDateTime,
} = useOrderDetail(orderId);

useHead({
  title: computed(() =>
    order.value?._id
      ? `In hóa đơn #${order.value._id} - SmartFood`
      : "In hóa đơn - SmartFood",
  ),
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const goBack = () => {
  router.back();
};

const printInvoice = () => {
  window.print();
};

// Auto print when data is loaded
watch([isLoading, orderData], ([loading, data]) => {
  if (!loading && data) {
    setTimeout(() => {
      window.print();
    }, 500);
  }
});

// Listener for after print dialog closes
onMounted(() => {
  const handleAfterPrint = () => {
    // Optional: automatically go back after printing
    // setTimeout(() => {
    //   router.back();
    // }, 1000);
  };

  window.addEventListener("afterprint", handleAfterPrint);

  return () => {
    window.removeEventListener("afterprint", handleAfterPrint);
  };
});
</script>

<style>
@media print {
  @page {
    margin: 0; /* Hides standard browser headers (URL, title) and footers (page number) */
    size: A4 portrait;
  }

  body {
    background: white !important;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .print-page {
    padding: 15mm !important; /* Safe padding for invoice content on A4 */
    background: white !important;
  }

  .no-print {
    display: none !important;
  }

  .print-container {
    width: 100%;
    max-width: 100%;
    box-shadow: none !important;
    border: none !important;
    margin: 0;
    padding: 0;
    background: white !important;
  }

  .print-content {
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .page-break-inside-avoid {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Force black text for better printing if needed, though colors are allowed */
  .text-black-print * {
    color: black !important;
    text-shadow: none !important;
    box-shadow: none !important;
  }

  .keep-colors {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
