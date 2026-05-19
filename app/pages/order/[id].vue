<template>
  <div
    class="max-w-[900px] mx-auto space-y-4 px-4 py-6 animate-fadeUp pb-24 lg:pb-6"
  >
    <ConfirmDialog />

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <i class="pi pi-spinner animate-spin text-4xl text-[#f47f20]"></i>
    </div>
    <div v-else-if="!orderData" class="text-center py-12 text-gray-500">
      Không tìm thấy đơn hàng
    </div>
    <template v-else>
      <!-- BLOCK 1: Header -->
      <header class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <button
            @click="
              router.push({ path: ROUTES.PROFILE, query: { tab: 'orders' } })
            "
            class="text-sm text-gray-500 hover:text-[#f47f20] flex items-center gap-2 transition-colors"
          >
            <span class="text-lg leading-none">←</span>
            <span class="hidden sm:inline">Quay lại</span>
          </button>
          <span class="text-gray-300 hidden sm:inline">|</span>
          <div class="text-xs text-gray-400">
            Đơn hàng /
            <span class="font-mono text-gray-600 font-semibold"
              >#{{ order.orderCode || order._id }}</span
            >
          </div>
        </div>

        <h1 class="text-xl font-black text-gray-900">Chi tiết đơn hàng</h1>

        <div class="flex items-center gap-2">
          <button
            @click="goToPrintPage"
            class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 transition"
          >
            🖨️ In đơn
          </button>
          <!-- <button
          class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 transition"
        >
          📤 Chia sẻ
        </button> -->
        </div>
      </header>

      <!-- BLOCK 2: Status Card -->
      <section
        :class="[
          'bg-white rounded-2xl shadow-sm overflow-hidden',
          statusBorderClass,
        ]"
      >
        <div class="px-5 py-4 flex justify-between items-start gap-4">
          <div>
            <div class="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
              Mã đơn hàng
            </div>
            <div class="font-mono font-black text-xl text-gray-900">
              #{{ order.orderCode || order._id }}
            </div>
            <div class="text-xs text-gray-400 mt-1">
              {{ formatDateTime(order.createdAt) }}
            </div>
          </div>

          <div class="text-right flex-shrink-0">
            <div
              :class="[
                'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold',
                statusMeta.color,
              ]"
            >
              <span
                v-if="statusMeta.dot"
                class="w-2 h-2 rounded-full bg-current animate-pulse"
              ></span>
              <span>{{ statusMeta.icon }} {{ statusMeta.label }}</span>
            </div>
            <div class="mt-2">
              <span
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                  paymentStatusClass,
                ]"
              >
                {{ paymentMeta.label }}
              </span>
            </div>
          </div>
        </div>

        <hr class="border-gray-100" />

        <!-- Timeline: FIXED -->
        <div class="px-5 pb-5 pt-4">
          <!-- Desktop: horizontal timeline -->
          <div class="relative hidden md:flex justify-between items-start">
            <!-- Background track line: align to center of circles (h-10 = 40px, center = 20px from top) -->
            <div
              class="absolute left-[calc(10%+20px)] right-[calc(10%+20px)] top-5 h-0.5 bg-gray-200 -translate-y-1/2 z-0"
            ></div>
            <!-- Progress fill line -->
            <!-- <div
            class="absolute left-[calc(10%+20px)] top-5 h-0.5 bg-[#f47f20] -translate-y-1/2 z-10 transition-all duration-700"
            :style="{ width: timelineProgressWidth }"
          ></div> -->

            <div
              v-for="(step, idx) in timelineStepsWithTime"
              :key="step.key"
              class="flex-1 flex flex-col items-center gap-1.5 relative z-20"
            >
              <!-- Circle -->
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-base shadow-sm transition-all duration-300',
                  idx < currentStepIndex
                    ? 'bg-[#f47f20] text-white ring-4 ring-orange-100'
                    : idx === currentStepIndex
                      ? 'bg-[#f47f20] text-white ring-4 ring-orange-200 shadow-[0_0_0_4px_rgba(244,127,32,0.15)]'
                      : 'bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300',
                ]"
              >
                <span v-if="idx < currentStepIndex" class="text-sm font-bold"
                  >✓</span
                >
                <span v-else>{{ step.icon }}</span>
              </div>
              <!-- Label -->
              <div
                :class="[
                  'text-xs font-semibold text-center',
                  idx <= currentStepIndex ? 'text-gray-800' : 'text-gray-400',
                ]"
              >
                {{ step.label }}
              </div>
              <div class="text-[10px] text-gray-400 text-center h-3">
                {{ step.time || "" }}
              </div>
            </div>
          </div>

          <!-- Mobile: vertical timeline (unchanged) -->
          <div class="md:hidden flex flex-col gap-0">
            <div
              v-for="(step, idx) in timelineStepsWithTime"
              :key="step.key"
              class="flex items-start gap-3"
            >
              <div class="flex flex-col items-center">
                <div
                  :class="[
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0',
                    idx <= currentStepIndex
                      ? 'bg-[#f47f20] text-white'
                      : 'bg-gray-100 text-gray-400',
                  ]"
                >
                  <span v-if="idx < currentStepIndex">✓</span>
                  <span v-else>{{ step.icon }}</span>
                </div>
                <div
                  v-if="idx < timelineStepsWithTime.length - 1"
                  :class="[
                    'w-0.5 h-8 mt-1',
                    idx < currentStepIndex ? 'bg-[#f47f20]' : 'bg-gray-200',
                  ]"
                ></div>
              </div>
              <div class="pt-1.5 pb-4">
                <div
                  :class="[
                    'text-sm font-semibold',
                    idx <= currentStepIndex ? 'text-gray-800' : 'text-gray-500',
                  ]"
                >
                  {{ step.label }}
                </div>
                <div class="text-[10px] text-gray-400 mt-0.5">
                  {{ step.time || "" }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- BLOCK 3: Grid 2 columns -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        <!-- LEFT: Products -->
        <div class="order-2 lg:order-1">
          <div class="bg-white rounded-2xl shadow-sm p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-gray-900">Sản phẩm đặt mua</h3>
              <span
                class="bg-orange-50 text-orange-600 border border-orange-100 rounded-full px-2.5 py-0.5 text-xs font-semibold"
              >
                {{ items.length }} sản phẩm
              </span>
            </div>

            <div class="divide-y divide-gray-50">
              <article
                v-for="item in items"
                :key="item.productId"
                class="flex gap-3 py-3 hover:bg-gray-50/70 rounded-xl -mx-2 px-2 transition-colors"
              >
                <!-- Fixed size image container: FIXED -->
                <div class="flex-shrink-0 relative">
                  <img
                    :src="item.thumbnail"
                    :alt="item.title"
                    class="w-16 h-16 rounded-xl object-cover border border-gray-100 block"
                  />
                  <div
                    v-if="item.quantity > 1"
                    class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#f47f20] text-white rounded-full text-[10px] font-black flex items-center justify-center shadow"
                  >
                    {{ item.quantity }}
                  </div>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0 flex flex-col justify-center">
                  <p
                    class="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug"
                  >
                    {{ item.title }}
                  </p>
                  <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      class="text-xs text-gray-400 bg-gray-50 rounded px-1.5 py-0.5"
                      >x{{ item.quantity }}</span
                    >
                    <span class="text-xs text-gray-400"
                      >{{ formatVnd(item.price) }}/sp</span
                    >
                  </div>
                </div>

                <!-- Price + action -->
                <div
                  class="flex-shrink-0 text-right flex flex-col justify-center gap-1.5"
                >
                  <p class="font-bold text-sm text-gray-900">
                    {{ formatVnd(item.totalPrice) }}
                  </p>
                  <div class="flex flex-col gap-1 items-end">
                    <button
                      v-if="order.status === 'delivered'"
                      @click="reviewProduct(item)"
                      class="text-xs bg-orange-50 text-[#f47f20] px-2 py-1 rounded-md font-bold hover:bg-orange-100 transition whitespace-nowrap"
                    >
                      ⭐ Đánh giá
                    </button>
                    <!-- <button
                      @click="buyAgain(item)"
                      class="text-xs text-gray-400 hover:text-[#f47f20] font-medium hover:underline whitespace-nowrap"
                    >
                      Mua lại →
                    </button> -->
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>

        <!-- RIGHT: Summary + Shipping + Payment -->
        <aside class="order-1 lg:order-2 space-y-4">
          <!-- Order Summary -->
          <div class="bg-white rounded-2xl shadow-sm p-5">
            <h4 class="font-bold text-gray-900 mb-4">Tổng kết đơn hàng</h4>
            <div class="space-y-2.5 text-sm text-gray-600">
              <div class="flex justify-between">
                <span>Tạm tính ({{ totalQty }} SP)</span>
                <span class="font-medium text-gray-800">{{
                  formatVnd(subtotal)
                }}</span>
              </div>
              <div
                v-if="order.voucherCode"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <span>Mã giảm giá</span>
                  <span
                    class="bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 text-xs font-semibold"
                  >
                    #{{ order.voucherCode }}
                  </span>
                </div>
                <span class="text-green-600 font-semibold"
                  >− {{ formatVnd(order.discountVoucher) }}</span
                >
              </div>
              <div class="flex justify-between">
                <span>Phí giao hàng</span>
                <span
                  :class="
                    order.shippingFee === 0
                      ? 'text-green-600 font-semibold'
                      : 'text-gray-800 font-medium'
                  "
                >
                  {{
                    order.shippingFee === 0
                      ? "Miễn phí"
                      : formatVnd(order.shippingFee)
                  }}
                </span>
              </div>
            </div>

            <hr class="border-dashed border-gray-200 my-3" />

            <div class="flex justify-between items-center">
              <div class="font-black text-base text-gray-900">
                Tổng thanh toán
              </div>
              <div class="font-black text-xl text-[#f47f20]">
                {{ formatVnd(order.totalPrice) }}
              </div>
            </div>

            <div
              v-if="order.discountVoucher"
              class="mt-3 p-3 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2 text-sm font-semibold text-green-700"
            >
              <span>🎉</span>
              <span>Tiết kiệm {{ formatVnd(order.discountVoucher) }}</span>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="bg-white rounded-2xl shadow-sm p-5">
            <div class="flex items-center gap-2 mb-4">
              <div
                class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-base"
              >
                📍
              </div>
              <h5 class="font-bold text-gray-900">Địa chỉ giao hàng</h5>
            </div>
            <div class="space-y-1.5 text-sm">
              <div class="font-semibold text-gray-900">
                {{ order.userInfo?.fullname }}
              </div>
              <div class="text-gray-500">📞 {{ order.userInfo?.phone }}</div>
              <p class="text-gray-600 leading-relaxed">
                {{ order.userInfo?.address }}, {{ order.userInfo?.ward }},
                {{ order.userInfo?.district }}, {{ order.userInfo?.province }}
              </p>
              <div
                v-if="order.userInfo?.note"
                class="mt-2 p-2.5 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-yellow-800 flex items-start gap-2"
              >
                <span>📝</span>
                <span>{{ order.userInfo?.note }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Info -->
          <div class="bg-white rounded-2xl shadow-sm p-5">
            <div class="flex items-center gap-2 mb-4">
              <div
                class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-base"
              >
                💳
              </div>
              <h5 class="font-bold text-gray-900">Thanh toán</h5>
            </div>
            <div class="space-y-2.5 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Phương thức</span>
                <span :class="['font-semibold', paymentMethodMeta.color]"
                  >{{ paymentMethodMeta.icon }}
                  {{ paymentMethodMeta.label }}</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Trạng thái</span>
                <span
                  :class="[
                    'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                    paymentStatusClass,
                  ]"
                  >{{ paymentMeta.label }}</span
                >
              </div>
              <div
                v-if="payment.transactionId"
                class="flex justify-between items-center gap-2"
              >
                <span class="text-gray-500 flex-shrink-0">Mã GD</span>
                <div
                  class="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg flex items-center gap-1.5 border border-gray-100 overflow-hidden"
                >
                  <span class="truncate max-w-[130px]">{{
                    payment.transactionId
                  }}</span>
                  <button
                    @click="copyTransactionId"
                    class="text-gray-400 hover:text-[#f47f20] flex-shrink-0 transition-colors"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Số tiền</span>
                <span class="font-bold text-[#f47f20]">{{
                  formatVnd(payment.amount)
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Thời gian</span>
                <span class="text-gray-700 text-xs">{{
                  formatDateTime(payment.createdAt)
                }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <!-- BLOCK 4: Action bar -->
      <div
        class="bg-white/95 backdrop-blur border-t border-gray-100 px-5 py-3 fixed bottom-0 left-0 right-0 z-50 lg:relative lg:rounded-2xl lg:shadow-sm lg:border lg:border-gray-100 lg:bg-white"
      >
        <div
          class="max-w-[900px] mx-auto flex items-center justify-between gap-3 flex-wrap"
        >
          <div class="flex items-center gap-2">
            <button
              v-if="order.status === 'pending' || order.status === 'confirmed'"
              @click="triggerCancel"
              :disabled="isCancelling"
              class="text-sm text-red-500 border border-red-200 rounded-full px-4 py-2 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <i v-if="isCancelling" class="pi pi-spinner animate-spin"></i>
              <span v-else>✕</span>
              Hủy đơn
            </button>
            <button
              v-if="order.status === 'shipping'"
              @click="confirmReceived"
              :disabled="isConfirmingReceived"
              class="text-sm bg-green-600 text-white rounded-full px-4 py-2 hover:bg-green-700 transition font-semibold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <i
                v-if="isConfirmingReceived"
                class="pi pi-spinner animate-spin"
              ></i>
              <span v-else>✓</span>
              {{ isConfirmingReceived ? "Đang xác nhận..." : "Đã nhận hàng" }}
            </button>
          </div>
          <div class="flex items-center gap-2 ml-auto">
            <button
              @click="router.push('/support')"
              class="text-sm border border-gray-200 rounded-full px-4 py-2 hover:border-[#f47f20] hover:text-[#f47f20] transition flex items-center gap-2"
            >
              <span>💬</span>
              <span>Hỗ trợ</span>
            </button>
            <button
              @click="reorderAll"
              :disabled="isMergingCart"
              class="text-sm bg-[#f47f20] text-white rounded-full px-5 py-2 font-semibold shadow-[0_4px_14px_rgba(244,127,32,0.35)] hover:bg-[#e06e10] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <i v-if="isMergingCart" class="pi pi-spinner animate-spin"></i>
              <span v-else>🔄</span>
              {{ isMergingCart ? "Đang xử lý..." : "Mua lại" }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ConfirmDialog from "primevue/confirmdialog";
import { useOrderDetail } from "~/composables/order/useOrderDetail";
import { formatVnd } from "~/utils/currency";
import { ROUTES } from "~/constants/routes";

const route = useRoute();
const orderId = route.params.id as string;

const {
  orderData,
  isLoading,
  isCancelling,
  isConfirmingReceived,
  isMergingCart,
  order,
  items,
  payment,
  showCancelConfirm,
  cancelMessage,
  subtotal,
  totalQty,
  currentStepIndex,
  timelineStepsWithTime,
  statusMeta,
  statusBorderClass,
  paymentMeta,
  paymentStatusClass,
  paymentMethodMeta,
  formatDateTime,
  copyTransactionId,
  reviewProduct,
  buyAgain,
  reorderAll,
  onAcceptCancel,
  triggerCancel,
  confirmReceived,
  router,
} = useOrderDetail(orderId);

useHead({
  title: computed(() =>
    order.value?._id
      ? `Đơn hàng #${order.value._id} - SmartFood`
      : "Chi tiết đơn hàng - SmartFood",
  ),
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const goToPrintPage = () => {
  if (order.value && order.value._id) {
    router.push(`/print/order/${order.value._id}`);
  }
};
</script>

<style scoped>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeUp {
  animation: fadeUp 350ms ease both;
}

/* Ensure action bar doesn't overlap on desktop */
@media (min-width: 1024px) {
  .fixed.bottom-0.left-0.right-0 {
    position: relative;
    bottom: auto;
    left: auto;
    right: auto;
  }
}
</style>
