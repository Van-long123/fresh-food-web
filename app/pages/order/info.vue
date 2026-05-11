<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Xác nhận đơn hàng</h1>
        <p class="text-sm text-gray-500 mt-1">
          Kiểm tra lại thông tin trước khi thanh toán
        </p>
      </div>

      <!-- Loading state -->
      <div
        v-if="!orderInfo"
        class="flex flex-col items-center justify-center py-24 gap-4"
      >
        <div
          class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center"
        >
          <i class="pi pi-shopping-cart text-2xl text-red-600"></i>
        </div>
        <p class="text-gray-500 text-base">
          Không tìm thấy thông tin đơn hàng.
        </p>
        <NuxtLink
          :to="ROUTES.ORDER.CHECKOUT"
          class="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
        >
          <i class="pi pi-arrow-left text-xs"></i>
          Quay lại thanh toán
        </NuxtLink>
      </div>

      <!-- Main 2-column layout -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- ── LEFT COLUMN (7/12) ─────────────────────────────── -->
        <div class="lg:col-span-7 flex flex-col gap-5">
          <!-- Section 1: Thông tin khách hàng -->
          <div class="bg-white rounded-xl shadow-sm p-4">
            <div class="flex items-center gap-2 mb-4">
              <span
                class="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"
              >
                <i class="pi pi-user text-red-600 text-xs"></i>
              </span>
              <h2 class="text-base font-bold text-gray-800">
                Thông tin khách hàng
              </h2>
            </div>

            <div class="space-y-3">
              <!-- Fullname -->
              <div class="flex items-start gap-3">
                <i
                  class="pi pi-id-card text-gray-400 text-sm mt-0.5 flex-shrink-0"
                ></i>
                <div>
                  <span class="text-xs text-gray-400 uppercase tracking-wide"
                    >Họ tên</span
                  >
                  <p class="text-sm font-semibold text-gray-800 mt-0.5">
                    {{ orderInfo.userInfo.fullname }}
                  </p>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex items-start gap-3">
                <i
                  class="pi pi-phone text-gray-400 text-sm mt-0.5 flex-shrink-0"
                ></i>
                <div>
                  <span class="text-xs text-gray-400 uppercase tracking-wide"
                    >Số điện thoại</span
                  >
                  <p class="text-sm font-semibold text-gray-800 mt-0.5">
                    {{ orderInfo.userInfo.phone }}
                  </p>
                </div>
              </div>

              <!-- Address -->
              <div class="flex items-start gap-3">
                <i
                  class="pi pi-map-marker text-gray-400 text-sm mt-0.5 flex-shrink-0"
                ></i>
                <div>
                  <span class="text-xs text-gray-400 uppercase tracking-wide"
                    >Địa chỉ giao hàng</span
                  >
                  <p class="text-sm font-semibold text-gray-800 mt-0.5">
                    {{ fullAddress }}
                  </p>
                </div>
              </div>

              <!-- Note -->
              <div v-if="orderInfo.userInfo.note" class="flex items-start gap-3">
                <i
                  class="pi pi-file-edit text-gray-400 text-sm mt-0.5 flex-shrink-0"
                ></i>
                <div>
                  <span class="text-xs text-gray-400 uppercase tracking-wide"
                    >Ghi chú</span
                  >
                  <p class="text-sm font-medium text-gray-600 mt-0.5 bg-gray-50 border border-gray-100 p-2 rounded-lg break-words">
                    {{ orderInfo.userInfo.note }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Voucher Badge (if exists) -->
          <div
            v-if="orderInfo.voucherCode"
            class="bg-white rounded-xl shadow-sm p-4"
          >
            <div class="flex items-center gap-2 mb-3">
              <span
                class="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0"
              >
                <i class="pi pi-ticket text-orange-500 text-xs"></i>
              </span>
              <h2 class="text-base font-bold text-gray-800">Voucher áp dụng</h2>
            </div>
            <div
              class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg px-4 py-2"
            >
              <i class="pi pi-tag text-orange-500 text-sm"></i>
              <span
                class="text-sm font-bold text-orange-600 tracking-widest uppercase"
                >{{ orderInfo.voucherCode }}</span
              >
              <span
                class="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
                >ÁP DỤNG</span
              >
            </div>
          </div>

          <!-- Section 2: Phương thức thanh toán -->
          <div class="bg-white rounded-xl shadow-sm p-4">
            <div class="flex items-center gap-2 mb-4">
              <span
                class="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"
              >
                <i class="pi pi-wallet text-blue-600 text-xs"></i>
              </span>
              <h2 class="text-base font-bold text-gray-800">
                Phương thức thanh toán
              </h2>
            </div>

            <Select
              v-model="paymentMethod"
              :options="paymentOptions"
              option-label="label"
              option-value="value"
              class="w-full mb-4"
              :pt="{
                root: { class: 'w-full border border-gray-200 rounded-lg' },
              }"
            />

            <!-- Payment info badge -->
            <div
              class="flex items-center gap-2 p-3 rounded-lg mb-4"
              :class="
                paymentMethod === 0
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-blue-50 border border-blue-200'
              "
            >
              <i
                :class="
                  paymentMethod === 0
                    ? 'pi pi-money-bill text-green-600'
                    : 'pi pi-credit-card text-blue-600'
                "
                class="text-sm"
              ></i>
              <span
                class="text-sm font-medium"
                :class="
                  paymentMethod === 0 ? 'text-green-700' : 'text-blue-700'
                "
              >
                {{
                  paymentMethod === 0
                    ? "Thanh toán khi nhận hàng — an toàn &amp; tiện lợi"
                    : "Thanh toán qua ZaloPay — nhanh chóng &amp; bảo mật"
                }}
              </span>
            </div>

            <!-- CTA Button -->
            <Button
              label="Thanh toán ngay"
              severity="contrast"
              class="w-full !bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700 !text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              icon="pi pi-lock"
              icon-pos="left"
              @click="handlePayment"
            />
          </div>
        </div>

        <!-- ── RIGHT COLUMN (5/12) ────────────────────────────── -->
        <div class="lg:col-span-5 flex flex-col gap-5">
          <!-- Section 1: Giỏ hàng -->
          <div class="bg-white rounded-xl shadow-sm p-4">
            <div class="flex items-center gap-2 mb-4">
              <span
                class="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"
              >
                <i class="pi pi-shopping-bag text-red-600 text-xs"></i>
              </span>
              <h2 class="text-base font-bold text-gray-800">Giỏ hàng</h2>
              <span
                class="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium"
              >
                {{ orderInfo.products.length }} sản phẩm
              </span>
            </div>

            <div class="divide-y divide-gray-100">
              <div
                v-for="item in orderInfo.products"
                :key="item.id"
                class="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <!-- Thumbnail -->
                <div
                  class="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100"
                >
                  <img
                    :src="item.thumbnail"
                    :alt="item.title"
                    class="w-full h-full object-cover"
                  />
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-medium text-gray-800 line-clamp-2 leading-tight"
                  >
                    {{ item.title }}
                  </p>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="text-xs text-gray-400"
                      >x{{ item.quantity }}</span
                    >
                  </div>
                </div>

                <!-- Price -->
                <div class="text-right flex-shrink-0">
                  <p class="text-sm font-bold text-red-600">
                    {{ formatCurrency(item.totalPrice) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Tổng tiền -->
          <div class="bg-white rounded-xl shadow-sm p-4">
            <div class="flex items-center gap-2 mb-4">
              <span
                class="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
              >
                <i class="pi pi-receipt text-green-600 text-xs"></i>
              </span>
              <h2 class="text-base font-bold text-gray-800">
                Chi tiết thanh toán
              </h2>
            </div>

            <div class="space-y-2.5">
              <!-- Đơn giá -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Đơn giá</span>
                <span class="text-sm font-medium text-gray-800">{{
                  formatCurrency(
                    orderInfo.totalPrice +
                      orderInfo.discountVoucher -
                      orderInfo.shippingFee,
                  )
                }}</span>
              </div>

              <!-- Voucher giảm giá (chỉ hiện nếu > 0) -->
              <div
                v-if="orderInfo.discountVoucher > 0"
                class="flex items-center justify-between"
              >
                <span class="text-sm text-gray-500 flex items-center gap-1">
                  <i class="pi pi-tag text-orange-400 text-xs"></i>
                  Voucher giảm giá
                </span>
                <span class="text-sm font-medium text-orange-500"
                  >-{{ formatCurrency(orderInfo.discountVoucher) }}</span
                >
              </div>

              <!-- Phí vận chuyển -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 flex items-center gap-1">
                  <i class="pi pi-truck text-gray-400 text-xs"></i>
                  Phí vận chuyển
                </span>
                <span class="text-sm font-medium text-gray-800">{{
                  formatCurrency(orderInfo.shippingFee)
                }}</span>
              </div>

              <!-- Divider -->
              <hr class="border-gray-200 my-1" />

              <!-- Thành tiền -->
              <div class="flex items-center justify-between">
                <span class="text-base font-bold text-gray-900"
                  >Thành tiền</span
                >
                <span class="text-lg font-extrabold text-red-600">{{
                  formatCurrency(orderInfo.totalPrice)
                }}</span>
              </div>
            </div>

            <!-- VAT notice -->
            <p class="text-xs text-gray-400 mt-3 text-center">
              (Đã bao gồm VAT nếu có)
            </p>
          </div>

          <!-- Delivery info card -->
          <div
            class="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100 p-4"
          >
            <div class="flex items-center gap-2 mb-2">
              <i class="pi pi-truck text-red-600 text-sm"></i>
              <span class="text-sm font-bold text-red-700"
                >Thông tin giao hàng</span
              >
            </div>
            <p class="text-xs text-gray-600">
              {{ deliveryLabel }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "~/stores/useOrderStore";
import { ROUTES } from "~/constants/routes";

useHead({
  title: "Xác nhận đơn hàng — SmartFood",
  meta: [
    {
      name: "description",
      content: "Xem lại thông tin đơn hàng trước khi thanh toán.",
    },
  ],
});

const router = useRouter();
const orderStore = useOrderStore();

// ── Data ──────────────────────────────────────────────────────────────────
const orderInfo = computed(() => orderStore.orderInfo);

onMounted(() => {
  if (!orderInfo.value) {
    router.push(ROUTES.ORDER.CHECKOUT);
  }
});

// Payment method reactive ref
const paymentMethod = ref<number>(orderInfo.value?.paymentMethod ?? 0);

const paymentOptions = [
  { label: "Thanh toán tiền mặt khi nhận hàng", value: 0 },
  { label: "Thanh toán bằng ZaloPay", value: 2 },
];

// ── Computed ───────────────────────────────────────────────────────────────
const fullAddress = computed(() => {
  if (!orderInfo.value) return "";
  const { address, ward, district, province } = orderInfo.value.userInfo;
  return [address, ward, district, province].filter(Boolean).join(", ");
});

const deliveryLabel = computed(() => {
  const method = orderInfo.value?.deliveryMethod ?? 1;
  const labels: Record<number, string> = {
    1: "Giao hàng tiết kiệm • 40-50 phút • 20.000đ",
    2: "Giao hàng tiêu chuẩn • 30-40 phút • 30.000đ",
    3: "Giao hàng hỏa tốc • 15-25 phút • 50.000đ",
  };
  return labels[method] ?? labels[1];
});

// ── Utils ──────────────────────────────────────────────────────────────────
function formatCurrency(value: number): string {
  return `${value.toLocaleString("vi-VN")}đ`;
}

// ── Actions ────────────────────────────────────────────────────────────────
function handlePayment() {
  if (!orderInfo.value) return;

  if (paymentMethod.value === 2) {
    // ZaloPay redirect logic (placeholder)
    alert("Đang chuyển hướng đến ZaloPay...");
  } else {
    // COD — order confirmed
    alert("Đặt hàng thành công! Cảm ơn bạn đã mua hàng.");
    orderStore.clearOrder();
    router.push(ROUTES.HOME);
  }
}
</script>
