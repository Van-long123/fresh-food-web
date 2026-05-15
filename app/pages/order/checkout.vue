<template>
  <div>
    <!-- AppLoading overlay khi đang xử lý thanh toán -->
    <AppLoading
      v-if="isSubmitting"
      variant="overlay"
      message="Đang xử lý đơn hàng..."
    />
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="mb-6 flex items-center gap-3 relative z-[45]">
          <NuxtLink
            :to="ROUTES.CART"
            class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <i class="pi pi-arrow-left text-sm text-gray-600"></i>
          </NuxtLink>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Thanh toán</h1>
            <p class="text-sm text-gray-500 mt-0.5">
              Điền thông tin giao hàng &amp; chọn thanh toán
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- ── LEFT COLUMN (7/12) ──────────────────────────────── -->
          <div class="lg:col-span-7 flex flex-col gap-5">
            <!-- Section 1: Thông tin giao hàng (Addresses) -->
            <div
              class="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <span
                    class="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="pi pi-map-marker text-[#f47f20] text-xs"></i>
                  </span>
                  <h2 class="text-base font-bold text-gray-800">
                    Địa chỉ nhận hàng
                  </h2>
                </div>
                <button
                  v-if="selectedAddress"
                  class="text-sm font-semibold text-[#006ee6] hover:text-[#005bb5] transition-colors"
                  @click="isSelectorOpen = true"
                >
                  Thay đổi
                </button>
              </div>

              <div
                v-if="selectedAddress"
                class="rounded-xl border border-orange-200 bg-orange-50/30 p-4 transition-colors"
              >
                <div class="flex items-start gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center flex-wrap gap-2 mb-1">
                      <span class="font-bold text-gray-900 text-sm">{{
                        selectedAddress.username
                      }}</span>
                      <span class="text-gray-300 text-xs">|</span>
                      <span class="font-medium text-gray-700 text-sm">{{
                        selectedAddress.phone
                      }}</span>
                      <span
                        v-if="selectedAddress.default === 1"
                        class="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#f47f20] text-white ml-1"
                      >
                        Mặc định
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed truncate">
                      {{ selectedAddress.address }}, {{ selectedAddress.ward }},
                      {{ selectedAddress.district }},
                      {{ selectedAddress.province }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50"
              >
                <div
                  class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3"
                >
                  <i class="pi pi-map text-gray-400 text-xl"></i>
                </div>
                <p class="text-sm text-gray-500 mb-4 text-center">
                  Bạn chưa có địa chỉ giao hàng nào.
                </p>
                <button
                  class="rounded-xl bg-[#f47f20] px-5 py-2 text-sm font-bold text-white hover:bg-[#e06d10] transition-colors shadow-sm"
                  @click="openCreateAddress"
                >
                  + Thêm địa chỉ mới
                </button>
              </div>

              <!-- Ghi chú -->
              <div class="mt-5 border-t border-gray-100 pt-4">
                <label
                  class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2"
                >
                  Ghi chú đơn hàng
                </label>
                <Textarea
                  v-model="note"
                  placeholder="Ghi chú thêm về đơn hàng (nếu có)..."
                  class="w-full text-sm placeholder:text-sm"
                  rows="2"
                  maxlength="3000"
                  :pt="{
                    root: {
                      class:
                        'rounded-lg border-gray-200 focus:border-[#f47f20] focus:ring-[#f47f20]',
                    },
                  }"
                />
              </div>
            </div>

            <!-- Section 2: Voucher áp dụng (Copied from info.vue) -->
            <div
              v-if="selectedVoucherCode"
              class="bg-white rounded-xl shadow-sm p-5"
            >
              <div class="flex items-center gap-2 mb-3">
                <span
                  class="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0"
                >
                  <i class="pi pi-ticket text-orange-500 text-xs"></i>
                </span>
                <h2 class="text-base font-bold text-gray-800">
                  Voucher áp dụng
                </h2>
              </div>
              <div
                class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg px-4 py-2"
              >
                <i class="pi pi-tag text-orange-500 text-sm"></i>
                <span
                  class="text-sm font-bold text-orange-600 tracking-widest uppercase"
                  >{{ selectedVoucherCode }}</span
                >
                <span
                  class="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
                  >ÁP DỤNG</span
                >
              </div>
            </div>
            <!-- Section 3: Phương thức thanh toán (Copied from info.vue) -->
            <div class="bg-white rounded-xl shadow-sm p-5">
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
                class="flex items-center gap-2 p-3 rounded-lg"
                :class="
                  paymentMethod === 0
                    ? 'bg-green-50 border border-green-200'
                    : paymentMethod === 1
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-pink-50 border border-pink-200'
                "
              >
                <i
                  :class="
                    paymentMethod === 0
                      ? 'pi pi-money-bill text-green-600'
                      : paymentMethod === 1
                      ? 'pi pi-qrcode text-blue-600'
                      : 'pi pi-wallet text-pink-600'
                  "
                  class="text-sm"
                ></i>
                <span
                  class="text-sm font-medium"
                  :class="
                    paymentMethod === 0
                      ? 'text-green-700'
                      : paymentMethod === 1
                      ? 'text-blue-700'
                      : 'text-pink-700'
                  "
                >
                  {{
                    paymentMethod === 0
                      ? 'Thanh toán khi nhận hàng — an toàn & tiện lợi'
                      : paymentMethod === 1
                      ? 'VietQR qua PayOS — quét mã nhanh chóng'
                      : 'Thanh toán qua MoMo — tiện lợi & bảo mật'
                  }}
                </span>
              </div>
            </div>
          </div>

          <!-- ── RIGHT COLUMN (5/12) ──────────────────────────────── -->
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
                  {{ cartProducts.length }} sản phẩm
                </span>
              </div>

              <div class="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                <div
                  v-for="item in cartProducts"
                  :key="item.id"
                  class="flex items-center gap-3 py-3 first:pt-0"
                >
                  <div
                    class="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100"
                  >
                    <img
                      v-if="item.thumbnail"
                      :src="item.thumbnail"
                      :alt="item.title"
                      class="w-full h-full object-cover"
                      width="56"
                      height="56"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <NuxtLink
                      :to="`/product/${item.id}`"
                      class="text-sm font-medium text-gray-800 line-clamp-2 leading-tight hover:text-red-600 transition-colors"
                      >{{ item.title }}</NuxtLink
                    >
                    <span class="text-xs text-gray-400 mt-0.5 block"
                      >x{{ item.quantity }}</span
                    >
                  </div>
                  <div class="text-right flex-shrink-0">
                    <p class="text-sm font-bold text-red-600">
                      {{ formatCurrency(item.totalPrice) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 2: Tổng tiền -->
            <div class="bg-white rounded-xl shadow-sm p-4 sticky top-6">
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

              <div class="space-y-2.5 mb-4">
                <!-- Đơn giá -->
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500">Đơn giá</span>
                  <span class="text-sm font-medium text-gray-800">{{
                    formatCurrency(basePrice)
                  }}</span>
                </div>

                <!-- Voucher giảm giá -->
                <div
                  v-if="discountVoucher > 0"
                  class="flex items-center justify-between"
                >
                  <span class="text-sm text-gray-500 flex items-center gap-1">
                    <i class="pi pi-tag text-orange-400 text-xs"></i> Voucher
                    giảm giá
                  </span>
                  <span class="text-sm font-medium text-orange-500"
                    >-{{ formatCurrency(discountVoucher) }}</span
                  >
                </div>

                <!-- Phí vận chuyển -->
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500 flex items-center gap-1">
                    <i class="pi pi-truck text-gray-400 text-xs"></i> Phí vận
                    chuyển
                    <i
                      v-if="isFetchingShippingFee"
                      class="pi pi-spin pi-spinner text-[#f47f20] text-xs ml-1"
                    ></i>
                  </span>
                  <span
                    v-if="isFetchingShippingFee"
                    class="text-sm text-gray-400 animate-pulse"
                    >Đang tính...</span
                  >
                  <span v-else class="text-sm font-medium text-gray-800">{{
                    formatCurrency(shippingFee)
                  }}</span>
                </div>

                <hr class="border-gray-200" />

                <!-- Thành tiền -->
                <div class="flex items-center justify-between">
                  <span class="text-base font-bold text-gray-900"
                    >Thành tiền</span
                  >
                  <span class="text-xl font-extrabold text-red-600">{{
                    formatCurrency(grandTotal)
                  }}</span>
                </div>
              </div>

              <!-- Checkout Button -->
              <Button
                label="Thanh toán"
                severity="contrast"
                :disabled="isFetchingShippingFee"
                class="w-full !bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700 !text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                icon="pi pi-lock"
                icon-pos="left"
                :loading="isSubmitting"
                @click="handleCheckout"
              />

              <div class="text-center mt-3">
                <NuxtLink
                  :to="ROUTES.CART"
                  class="text-sm text-gray-500 hover:text-red-600 transition-colors inline-flex items-center gap-1"
                >
                  <i class="pi pi-arrow-left text-xs"></i> Quay lại giỏ hàng
                </NuxtLink>
              </div>
              <p class="text-xs text-gray-400 mt-2 text-center">
                (Đã bao gồm VAT nếu có)
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Address Selector Modal -->
      <AddressSelectorDialog
        v-model:visible="isSelectorOpen"
        :addresses="addresses || []"
        :selected-address-id="localSelectedAddressId"
        @select="localSelectedAddressId = $event"
        @add="
          () => {
            isSelectorOpen = false;
            openCreateAddress();
          }
        "
        @edit="
          (addr) => {
            isSelectorOpen = false;
            openEditAddress(addr);
          }
        "
      />

      <!-- Create/Edit Form Modal (Teleported to body) -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="showAddressModal"
            class="fixed inset-0 z-[1100] flex items-end justify-center bg-black/50 p-4 md:items-center"
            @click.self="
              () => {
                showAddressModal = false;
                isSelectorOpen = true;
              }
            "
          >
            <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <div class="mb-5 flex items-center justify-between">
                <h3 class="text-lg font-bold text-gray-800">
                  {{
                    modalMode === "create"
                      ? "Thêm địa chỉ mới"
                      : "Cập nhật địa chỉ"
                  }}
                </h3>
                <button
                  class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                  @click="
                    () => {
                      showAddressModal = false;
                      isSelectorOpen = true;
                    }
                  "
                >
                  <i class="pi pi-times text-sm" />
                </button>
              </div>

              <form class="space-y-4" @submit.prevent="saveAddress">
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                      >Họ tên <span class="text-red-500">*</span></label
                    >
                    <InputText
                      v-model="addressForm.fullName"
                      placeholder="VD: Nguyễn Văn A"
                      class="w-full"
                      :class="{ 'p-invalid': validationErrors.fullName }"
                    />
                    <small
                      v-if="validationErrors.fullName"
                      class="text-red-500 text-xs mt-0.5"
                      >{{ validationErrors.fullName }}</small
                    >
                  </div>
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                      >Số điện thoại <span class="text-red-500">*</span></label
                    >
                    <InputText
                      v-model="addressForm.phone"
                      placeholder="VD: 0912..."
                      class="w-full"
                      :class="{ 'p-invalid': validationErrors.phone }"
                    />
                    <small
                      v-if="validationErrors.phone"
                      class="text-red-500 text-xs mt-0.5"
                      >{{ validationErrors.phone }}</small
                    >
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                      >Tỉnh/Thành phố <span class="text-red-500">*</span></label
                    >
                    <Select
                      v-model="addressForm.city"
                      :options="provinceOptions"
                      option-label="label"
                      option-value="value"
                      placeholder="Chọn tỉnh/thành"
                      class="w-full"
                      :class="{ 'p-invalid': validationErrors.city }"
                      filter
                      disabled
                      appendTo="body"
                      :pt="{ overlay: { class: '!z-[9999]' } }"
                    />
                    <small
                      v-if="validationErrors.city"
                      class="text-red-500 text-xs mt-0.5"
                      >{{ validationErrors.city }}</small
                    >
                  </div>
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                      >Quận/Huyện <span class="text-red-500">*</span></label
                    >
                    <Select
                      v-model="addressForm.district"
                      :options="districtOptions"
                      option-label="label"
                      option-value="value"
                      placeholder="Chọn quận/huyện"
                      class="w-full"
                      :class="{ 'p-invalid': validationErrors.district }"
                      :disabled="!addressForm.city"
                      filter
                      appendTo="body"
                      :pt="{ overlay: { class: '!z-[9999]' } }"
                    />
                    <small
                      v-if="validationErrors.district"
                      class="text-red-500 text-xs mt-0.5"
                      >{{ validationErrors.district }}</small
                    >
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                      >Phường/Xã <span class="text-red-500">*</span></label
                    >
                    <Select
                      v-model="addressForm.ward"
                      :options="wardOptions"
                      option-label="label"
                      option-value="value"
                      placeholder="Chọn phường/xã"
                      class="w-full"
                      :class="{ 'p-invalid': validationErrors.ward }"
                      :disabled="!addressForm.district"
                      filter
                      appendTo="body"
                      :pt="{ overlay: { class: '!z-[9999]' } }"
                    />
                    <small
                      v-if="validationErrors.ward"
                      class="text-red-500 text-xs mt-0.5"
                      >{{ validationErrors.ward }}</small
                    >
                  </div>
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                      >Số nhà / Đường <span class="text-red-500">*</span></label
                    >
                    <InputText
                      v-model="addressForm.street"
                      placeholder="123 Đường Lê Lợi"
                      class="w-full"
                      :class="{ 'p-invalid': validationErrors.street }"
                    />
                    <small
                      v-if="validationErrors.street"
                      class="text-red-500 text-xs mt-0.5"
                      >{{ validationErrors.street }}</small
                    >
                  </div>
                </div>

                <div>
                  <label class="flex items-center gap-2 text-sm">
                    <input
                      v-model="addressForm.isDefault"
                      type="checkbox"
                      class="h-4 w-4 rounded accent-[#f47f20]"
                    />
                    <span class="text-gray-600">Đặt làm địa chỉ mặc định</span>
                  </label>
                </div>

                <div
                  class="flex justify-end gap-3 border-t border-gray-100 pt-4"
                >
                  <button
                    type="button"
                    class="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                    @click="
                      () => {
                        showAddressModal = false;
                        isSelectorOpen = true;
                      }
                    "
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    class="rounded-full bg-[#f47f20] px-8 py-2 text-sm font-semibold text-white hover:bg-[#e06d10] transition"
                  >
                    Lưu địa chỉ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </Teleport>

      <ConfirmDialog></ConfirmDialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "~/stores/useOrderStore";
import { useAuthStore } from "~/stores/useAuthStore";
import { useToast } from "primevue/usetoast";
import type { OrderProduct, OrderInfo } from "~/types/order.type";
import { ROUTES } from "~/constants/routes";
import { useAddress } from "~/composables/profile/useAddress";
import { useShippingFee } from "~/composables/checkout/useShippingFee";
import { getAuthorizedAxios } from "~/utils/authorizedAxios";
import { API_ENDPOINTS } from "~/constants/api";
import ConfirmDialog from "primevue/confirmdialog";
import AddressSelectorDialog from "~/components/pages/checkout/AddressSelectorDialog.vue";

useHead({
  title: "Thanh toán — SmartFood",
  meta: [
    {
      name: "description",
      content: "Nhập thông tin giao hàng và hoàn tất đặt hàng tại SmartFood.",
    },
  ],
});

const router = useRouter();
const orderStore = useOrderStore();
const authStore = useAuthStore();
const toast = useToast();

const {
  addresses,
  modalMode,
  showAddressModal,
  addressForm,
  provinceOptions,
  districtOptions,
  wardOptions,
  validationErrors,
  openCreateAddress,
  openEditAddress,
  saveAddress,
} = useAddress();

const localSelectedAddressId = ref<string | null>(null);
const isSelectorOpen = ref(false);
const note = ref("");

const paymentOptions = [
  { label: "Thanh toán khi nhận hàng (COD)", value: 0 },
  { label: "VietQR qua PayOS", value: 1 },
  { label: "Ví điện tử MoMo", value: 2 },
];
const paymentMethod = ref(0);

// ── Checkout Data from Store ──────────────────────────────────────────────────
const checkoutData = computed(() => orderStore.checkoutData);

// If no data is passed (e.g., user reloaded page), redirect back to cart
onMounted(() => {
  if (!checkoutData.value || checkoutData.value.products.length === 0) {
    toast.add({
      severity: "warn",
      summary: "Giỏ hàng trống",
      detail: "Vui lòng chọn sản phẩm để thanh toán",
      life: 3000,
    });
    router.push(ROUTES.CART);
  }
});

const selectedVoucherCode = computed(
  () => checkoutData.value?.voucherCode || null,
);
const discountVoucher = computed(
  () => checkoutData.value?.discountVoucher || 0,
);

const cartProducts = computed(() => checkoutData.value?.products || []);
const basePrice = computed(() => checkoutData.value?.subtotal || 0);

// ── Shipping Fee (GHN)
const {
  shippingFee: ghnShippingFee,
  isFetchingShippingFee,
  fetchShippingFee,
} = useShippingFee(localSelectedAddressId, cartProducts);

// shippingFee và grandTotal phụ thuộc vào ghnShippingFee nên phải khai báo sau
const shippingFee = computed(
  () => ghnShippingFee.value ?? checkoutData.value?.shippingFee ?? 0,
);
const grandTotal = computed(
  () => basePrice.value - discountVoucher.value + shippingFee.value,
);

const selectedAddress = computed(() => {
  if (!addresses.value || !localSelectedAddressId.value) return null;
  return (
    addresses.value.find((a: any) => a._id === localSelectedAddressId.value) ||
    null
  );
});

// Set default address if none is selected
watch(
  addresses,
  (newList) => {
    if (newList && newList.length > 0 && !localSelectedAddressId.value) {
      const defaultAddr = newList.find((a: any) => a.default === 1);
      if (defaultAddr) {
        localSelectedAddressId.value = defaultAddr._id;
      } else {
        localSelectedAddressId.value = newList[0]._id;
      }
    }
  },
  { immediate: true },
);
// Re-fetch shipping fee if the selected address is updated
watch(
  () => selectedAddress.value,
  (newVal, oldVal) => {
    if (newVal && oldVal && newVal._id === oldVal._id) {
      // Có sự thay đổi về data của địa chỉ đang chọn (ví dụ sau khi edit)
      // Gọi lại API tính phí ship để cập nhật giá mới
      fetchShippingFee(newVal._id);
    }
  },
  { deep: true },
);

// ── Checkout logic ────────────────────────────────────────────────────────────
const isSubmitting = ref(false);

async function handleCheckout() {
  if (!localSelectedAddressId.value) {
    toast.add({
      severity: "warn",
      summary: "Cảnh báo",
      detail: "Vui lòng chọn địa chỉ giao hàng",
      life: 3000,
    });
    return;
  }
  const selectedAddress = addresses.value?.find(
    (a: any) => a._id === localSelectedAddressId.value,
  );
  if (!selectedAddress) {
    toast.add({
      severity: "warn",
      summary: "Cảnh báo",
      detail: "Địa chỉ không hợp lệ",
      life: 3000,
    });
    return;
  }

  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const payload = {
      userInfo: {
        fullname: selectedAddress.username,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
        ward: selectedAddress.ward,
        district: selectedAddress.district,
        province: selectedAddress.province,
        note: note.value,
      },
      products: cartProducts.value,
      deliveryMethod: 1, // Fixed since we removed selection
      paymentMethod: paymentMethod.value,
      voucherCode: selectedVoucherCode.value,
      discountVoucher: discountVoucher.value,
      shippingFee: shippingFee.value,
      totalPrice: grandTotal.value,
    } satisfies OrderInfo;

    // Call Order API
    await getAuthorizedAxios().post(API_ENDPOINTS.ORDER.CREATE, payload);

    orderStore.setOrderInfo(payload);
    router.push(ROUTES.ORDER.INFO);
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail:
        error?.response?.data?.message ||
        "Thanh toán thất bại, vui lòng thử lại.",
      life: 4000,
    });
  } finally {
    isSubmitting.value = false;
  }
}

function formatCurrency(value: number): string {
  return `${value.toLocaleString("vi-VN")}đ`;
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(24px);
}
</style>
