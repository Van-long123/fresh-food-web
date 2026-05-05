<template>
  <div>
    <!-- AppLoading overlay khi đang xử lý thanh toán -->
    <AppLoading
      v-if="isSubmitting"
      variant="overlay"
      message="Đang xử lý đơn hàng..."
    />
    <AppLoading
      v-if="isProvincesLoading"
      variant="overlay"
      message="Đang tải dữ liệu khu vực..."
    />
    <div
      v-if="provincesErrorMessage"
      class="mx-auto mt-4 max-w-6xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {{ provincesErrorMessage }}
    </div>

    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="mb-6 flex items-center gap-3">
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

        <!-- 2-column layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- ── LEFT COLUMN (7/12) ──────────────────────────────── -->
          <div class="lg:col-span-7 flex flex-col gap-5">
            <!-- Section 1: Form thông tin khách hàng -->
            <div class="bg-white rounded-xl shadow-sm p-5">
              <div class="flex items-center gap-2 mb-5">
                <span
                  class="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"
                >
                  <i class="pi pi-user text-red-600 text-xs"></i>
                </span>
                <h2 class="text-base font-bold text-gray-800">
                  Thông tin giao hàng
                </h2>
              </div>

              <div class="space-y-4">
                <!-- Row 1: Họ tên + Số điện thoại -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Họ tên -->
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >
                      Họ tên <span class="text-red-500">*</span>
                    </label>
                    <InputText
                      v-model="form.full_name"
                      placeholder="Nguyễn Văn A"
                      class="w-full"
                      :class="{ 'p-invalid': errors.full_name }"
                      maxlength="200"
                      @input="validateField('full_name')"
                      @blur="validateField('full_name')"
                    />
                    <small
                      v-if="errors.full_name"
                      class="text-red-500 text-xs mt-0.5"
                    >
                      {{ errors.full_name }}
                    </small>
                  </div>

                  <!-- Số điện thoại -->
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >
                      Số điện thoại <span class="text-red-500">*</span>
                    </label>
                    <InputText
                      v-model="form.phone"
                      placeholder="0901234567"
                      class="w-full"
                      :class="{ 'p-invalid': errors.phone }"
                      maxlength="200"
                      @input="validateField('phone')"
                      @blur="validateField('phone')"
                    />
                    <small
                      v-if="errors.phone"
                      class="text-red-500 text-xs mt-0.5"
                    >
                      {{ errors.phone }}
                    </small>
                  </div>
                </div>

                <!-- Row 2: Tỉnh/thành + Quận/huyện -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Tỉnh/thành -->
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >
                      Tỉnh/Thành phố <span class="text-red-500">*</span>
                    </label>
                    <Select
                      v-model="form.province_code"
                      :options="provinceOptions"
                      option-label="label"
                      option-value="value"
                      placeholder="Chọn tỉnh/thành"
                      class="w-full"
                      :class="{ 'p-invalid': errors.province }"
                      filter
                      filter-placeholder="Tìm tỉnh/thành..."
                      @change="onProvinceChange"
                    />
                    <small
                      v-if="errors.province"
                      class="text-red-500 text-xs mt-0.5"
                    >
                      {{ errors.province }}
                    </small>
                  </div>

                  <!-- Quận/huyện -->
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >
                      Quận/Huyện <span class="text-red-500">*</span>
                    </label>
                    <Select
                      v-model="form.district_code"
                      :options="districtOptions"
                      option-label="label"
                      option-value="value"
                      placeholder="Chọn quận/huyện"
                      class="w-full"
                      :class="{ 'p-invalid': errors.district }"
                      :disabled="districtOptions.length === 0"
                      filter
                      filter-placeholder="Tìm quận/huyện..."
                      @change="onDistrictChange"
                    />
                    <small
                      v-if="errors.district"
                      class="text-red-500 text-xs mt-0.5"
                    >
                      {{ errors.district }}
                    </small>
                  </div>
                </div>

                <!-- Row 3: Phường/xã + Số nhà/đường -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Phường/xã -->
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >
                      Phường/Xã <span class="text-red-500">*</span>
                    </label>
                    <Select
                      v-model="form.ward_code"
                      :options="wardOptions"
                      option-label="label"
                      option-value="value"
                      placeholder="Chọn phường/xã"
                      class="w-full"
                      :class="{ 'p-invalid': errors.ward }"
                      :disabled="wardOptions.length === 0"
                      filter
                      filter-placeholder="Tìm phường/xã..."
                      @change="validateField('ward')"
                    />
                    <small
                      v-if="errors.ward"
                      class="text-red-500 text-xs mt-0.5"
                    >
                      {{ errors.ward }}
                    </small>
                  </div>

                  <!-- Số nhà/đường -->
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >
                      Số nhà / Đường <span class="text-red-500">*</span>
                    </label>
                    <InputText
                      v-model="form.address"
                      placeholder="123 Đường Lê Lợi"
                      class="w-full"
                      :class="{ 'p-invalid': errors.address }"
                      maxlength="200"
                      @input="validateField('address')"
                      @blur="validateField('address')"
                    />
                    <small
                      v-if="errors.address"
                      class="text-red-500 text-xs mt-0.5"
                    >
                      {{ errors.address }}
                    </small>
                  </div>
                </div>

                <!-- Row 4: Ghi chú -->
                <div class="grid grid-cols-1 gap-4">
                  <div class="flex flex-col gap-1">
                    <label
                      class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >
                      Ghi chú
                    </label>
                    <Textarea
                      v-model="form.note"
                      placeholder="Ghi chú thêm về đơn hàng..."
                      class="w-full"
                      :class="{ 'p-invalid': errors.note }"
                      rows="3"
                      maxlength="3000"
                      minlength="3"
                      @input="validateField('note')"
                      @blur="validateField('note')"
                    />
                    <small
                      v-if="errors.note"
                      class="text-red-500 text-xs mt-0.5"
                    >
                      {{ errors.note }}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 2: Phương thức giao hàng -->
            <div class="bg-white rounded-xl shadow-sm p-5">
              <div class="flex items-center gap-2 mb-4">
                <span
                  class="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"
                >
                  <i class="pi pi-truck text-blue-600 text-xs"></i>
                </span>
                <h2 class="text-base font-bold text-gray-800">
                  Phương thức giao hàng
                </h2>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  v-for="option in deliveryOptions"
                  :key="option.value"
                  class="relative flex flex-col items-center text-center cursor-pointer rounded-xl border-2 p-4 transition-all duration-200"
                  :class="
                    deliveryMethod === option.value
                      ? 'border-red-500 bg-red-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  "
                >
                  <RadioButton
                    v-model="deliveryMethod"
                    :value="option.value"
                    :input-id="`delivery-${option.value}`"
                    class="absolute top-3 right-3"
                    @change="updateShipping"
                  />
                  <div
                    class="w-10 h-10 rounded-full mb-2 flex items-center justify-center"
                    :class="
                      deliveryMethod === option.value
                        ? 'bg-red-100'
                        : 'bg-gray-100'
                    "
                  >
                    <i
                      :class="[
                        option.icon,
                        deliveryMethod === option.value
                          ? 'text-red-600'
                          : 'text-gray-500',
                      ]"
                      class="text-base"
                    ></i>
                  </div>
                  <span class="text-sm font-bold text-gray-800">{{
                    option.label
                  }}</span>
                  <span class="text-xs text-gray-400 mt-1">{{
                    option.duration
                  }}</span>
                  <span
                    class="text-xs font-bold mt-1.5 px-2 py-0.5 rounded-full"
                    :class="
                      deliveryMethod === option.value
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    "
                  >
                    {{ option.price }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Section 3: Voucher (chỉ hiển thị nếu đã đăng nhập) -->
            <div
              v-if="authStore.isLoggedIn"
              class="bg-white rounded-xl shadow-sm p-5"
            >
              <div class="flex items-center gap-2 mb-4">
                <span
                  class="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0"
                >
                  <i class="pi pi-ticket text-orange-500 text-xs"></i>
                </span>
                <h2 class="text-base font-bold text-gray-800">
                  Voucher &amp; Mã giảm giá
                </h2>
              </div>

              <!-- Selected voucher display -->
              <div
                v-if="selectedVoucherCode"
                class="flex items-center gap-2 mb-3 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5"
              >
                <i class="pi pi-tag text-orange-500 text-sm"></i>
                <span
                  class="text-sm font-bold text-orange-600 tracking-widest uppercase flex-1"
                  >{{ selectedVoucherCode }}</span
                >
                <button
                  class="text-gray-400 hover:text-red-500 transition-colors"
                  @click="removeVoucher"
                >
                  <i class="pi pi-times text-xs"></i>
                </button>
              </div>

              <!-- Open dialog button -->
              <Button
                :label="
                  selectedVoucherCode ? 'Đổi mã voucher' : 'Chọn Hoặc Nhập Mã'
                "
                severity="secondary"
                outlined
                icon="pi pi-tag"
                icon-pos="left"
                class="w-full !border-dashed !border-orange-300 !text-orange-600 hover:!bg-orange-50"
                @click="openVoucherDialog"
              />
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
                  <!-- Thumbnail -->
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

                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <NuxtLink
                      v-if="orderStore.cartDetail"
                      :to="`/product/${item.id}`"
                      class="text-sm font-medium text-gray-800 line-clamp-2 leading-tight hover:text-red-600 transition-colors"
                      >{{ item.title }}</NuxtLink
                    >
                    <p
                      v-else
                      class="text-sm font-medium text-gray-800 line-clamp-2 leading-tight"
                    >
                      {{ item.title }}
                    </p>
                    <span class="text-xs text-gray-400 mt-0.5 block"
                      >x{{ item.quantity }}</span
                    >
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
                    <i class="pi pi-tag text-orange-400 text-xs"></i>
                    Voucher giảm giá
                  </span>
                  <span class="text-sm font-medium text-orange-500"
                    >-{{ formatCurrency(discountVoucher) }}</span
                  >
                </div>

                <!-- Phí vận chuyển -->
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500 flex items-center gap-1">
                    <i class="pi pi-truck text-gray-400 text-xs"></i>
                    Phí vận chuyển
                  </span>
                  <span class="text-sm font-medium text-gray-800">{{
                    formatCurrency(shippingFee)
                  }}</span>
                </div>

                <!-- Divider -->
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
                class="w-full !bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700 !text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                icon="pi pi-lock"
                icon-pos="left"
                :loading="isSubmitting"
                @click="handleCheckout"
              />

              <!-- Back link -->
              <div class="text-center mt-3">
                <NuxtLink
                  :to="ROUTES.CART"
                  class="text-sm text-gray-500 hover:text-red-600 transition-colors inline-flex items-center gap-1"
                >
                  <i class="pi pi-arrow-left text-xs"></i>
                  Quay lại giỏ hàng
                </NuxtLink>
              </div>

              <!-- VAT notice -->
              <p class="text-xs text-gray-400 mt-2 text-center">
                (Đã bao gồm VAT nếu có)
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── VOUCHER DIALOG ────────────────────────────────────────── -->
      <Dialog
        v-model:visible="showVoucherDialog"
        modal
        header="Chọn Hoặc Nhập Mã Voucher"
        :style="{ width: '500px', maxWidth: '95vw' }"
        :pt="{
          header: { class: 'border-b border-gray-100 pb-3' },
          content: { class: 'p-0' },
        }"
      >
        <!-- Dialog Content -->
        <div class="p-5">
          <!-- Input mã voucher -->
          <div class="flex gap-2 mb-4">
            <InputText
              v-model="voucherInput"
              placeholder="Nhập mã voucher..."
              class="flex-1"
              :class="{ 'p-invalid': voucherError }"
              @keydown.enter="applyVoucher"
            />
            <Button
              label="Lưu"
              severity="contrast"
              class="!bg-red-600 !border-red-600 hover:!bg-red-700 !text-white"
              @click="applyVoucher"
            />
          </div>

          <!-- Error message -->
          <Message
            v-if="voucherError"
            severity="error"
            :closable="false"
            class="mb-4"
          >
            {{ voucherError }}
          </Message>

          <!-- Divider -->
          <div class="flex items-center gap-3 mb-4">
            <hr class="flex-1 border-gray-200" />
            <span
              class="text-xs text-gray-400 font-medium uppercase tracking-wide"
              >Hoặc chọn voucher</span
            >
            <hr class="flex-1 border-gray-200" />
          </div>

          <!-- Voucher list -->
          <div class="space-y-3 max-h-80 overflow-y-auto pr-1">
            <div
              v-for="voucher in authStore.vouchers"
              :key="voucher.id"
              class="border border-gray-200 rounded-xl overflow-hidden hover:border-red-300 hover:shadow-sm transition-all duration-200"
            >
              <!-- Ribbon -->
              <div class="flex">
                <!-- Left accent -->
                <div
                  class="w-2 bg-gradient-to-b from-red-500 to-red-700 flex-shrink-0"
                ></div>

                <!-- Card content -->
                <div class="flex-1 p-3">
                  <div class="flex items-start gap-3">
                    <!-- Icon -->
                    <div
                      class="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0"
                    >
                      <i class="pi pi-ticket text-red-600 text-sm"></i>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap mb-0.5">
                        <span
                          class="text-[10px] font-bold text-gray-400 uppercase tracking-wide"
                          >Toàn Ngành Hàng</span
                        >
                      </div>
                      <p class="text-sm font-bold text-gray-800">
                        {{ voucher.title }}
                      </p>
                      <p class="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {{ voucher.detail }}
                      </p>

                      <!-- Progress bar -->
                      <div class="mt-2">
                        <div class="flex items-center justify-between mb-1">
                          <span class="text-[10px] text-gray-400"
                            >Đã dùng: {{ voucher.usedCount }}/{{
                              voucher.totalCount
                            }}</span
                          >
                          <span class="text-[10px] text-gray-400"
                            >{{
                              Math.round(
                                (voucher.usedCount / voucher.totalCount) * 100,
                              )
                            }}%</span
                          >
                        </div>
                        <ProgressBar
                          :value="
                            Math.round(
                              (voucher.usedCount / voucher.totalCount) * 100,
                            )
                          "
                          :show-value="false"
                          class="h-1.5"
                        />
                      </div>
                    </div>

                    <!-- Use button -->
                    <div class="flex-shrink-0">
                      <Button
                        label="Dùng ngay"
                        size="small"
                        class="!bg-red-600 !border-red-600 hover:!bg-red-700 !text-white !text-xs"
                        @click="selectVoucher(voucher)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div
              v-if="authStore.vouchers.length === 0"
              class="text-center py-8"
            >
              <i class="pi pi-inbox text-3xl text-gray-300 mb-2 block"></i>
              <p class="text-sm text-gray-400">Bạn chưa có voucher nào</p>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "~/stores/useOrderStore";
import { useAuthStore } from "~/stores/useAuthStore";
import { useToast } from "primevue/usetoast";
import type { OrderProduct, OrderInfo, Voucher } from "~/stores/useOrderStore";
import { ROUTES } from "~/constants/routes";
import { useProvincesQuery } from "~/queries/location/useProvincesQuery";
import type { Province } from "~/types/location.type";

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

// ── Province API ─────────────────────────────────────────────────────────────

const allProvinces = ref<Province[]>([]);
const districtOptions = ref<{ label: string; value: number }[]>([]);
const wardOptions = ref<{ label: string; value: number }[]>([]);
const provincesQuery = useProvincesQuery();
const isProvincesLoading = computed(() => provincesQuery.isLoading.value);
const provincesErrorMessage = computed(() => {
  if (!provincesQuery.isError.value) return "";
  return "Không thể tải danh sách tỉnh/thành. Vui lòng thử lại.";
});
const isProvincePrefilled = ref(false);

const provinceOptions = computed(() =>
  allProvinces.value.map((p) => ({ label: p.name, value: p.code })),
);

watch(
  () => provincesQuery.data.value,
  (provinces) => {
    allProvinces.value = provinces ?? [];

    if (
      isProvincePrefilled.value ||
      !authStore.user ||
      !allProvinces.value.length
    ) {
      return;
    }

    const u = authStore.user;
    form.value.full_name = u.fullname ?? "";
    form.value.phone = u.phone ?? "";
    form.value.address = u.address ?? "";

    const targetCode =
      u.provinceCode ?? (u.province === "Đà Nẵng" ? 48 : undefined);

    if (targetCode) {
      const found = allProvinces.value.find((p) => p.code === targetCode);
      if (found) {
        form.value.province_code = found.code;
        districtOptions.value = found.districts.map((d) => ({
          label: d.name,
          value: d.code,
        }));

        if (u.districtCode) {
          form.value.district_code = u.districtCode;
          const foundDistrict = found.districts.find(
            (d) => d.code === u.districtCode,
          );
          if (foundDistrict) {
            wardOptions.value = foundDistrict.wards.map((w) => ({
              label: w.name,
              value: w.code,
            }));
            if (u.wardCode) {
              form.value.ward_code = u.wardCode;
            }
          }
        }
      }
    }

    isProvincePrefilled.value = true;
  },
  { immediate: true },
);

function onProvinceChange() {
  form.value.district_code = null;
  form.value.ward_code = null;
  districtOptions.value = [];
  wardOptions.value = [];
  errors.value.province = "";

  const found = allProvinces.value.find(
    (p) => p.code === form.value.province_code,
  );
  if (found) {
    districtOptions.value = found.districts.map((d) => ({
      label: d.name,
      value: d.code,
    }));
  }
}

function onDistrictChange() {
  form.value.ward_code = null;
  wardOptions.value = [];
  errors.value.district = "";

  const province = allProvinces.value.find(
    (p) => p.code === form.value.province_code,
  );
  if (!province) return;
  const district = province.districts.find(
    (d) => d.code === form.value.district_code,
  );
  if (district) {
    wardOptions.value = district.wards.map((w) => ({
      label: w.name,
      value: w.code,
    }));
  }
}

// Helpers to get names from codes
function getProvinceName(): string {
  return (
    allProvinces.value.find((p) => p.code === form.value.province_code)?.name ??
    ""
  );
}
function getDistrictName(): string {
  const province = allProvinces.value.find(
    (p) => p.code === form.value.province_code,
  );
  return (
    province?.districts.find((d) => d.code === form.value.district_code)
      ?.name ?? ""
  );
}
function getWardName(): string {
  const province = allProvinces.value.find(
    (p) => p.code === form.value.province_code,
  );
  const district = province?.districts.find(
    (d) => d.code === form.value.district_code,
  );
  return (
    district?.wards.find((w) => w.code === form.value.ward_code)?.name ?? ""
  );
}

// ── Form state ────────────────────────────────────────────────────────────────

const form = ref({
  full_name: "",
  phone: "",
  province_code: null as number | null,
  district_code: null as number | null,
  ward_code: null as number | null,
  address: "",
  note: "",
});

const errors = ref({
  full_name: "",
  phone: "",
  province: "",
  district: "",
  ward: "",
  address: "",
  note: "",
});

// ── Delivery ──────────────────────────────────────────────────────────────────

const DELIVERY_FEES: Record<number, number> = { 1: 20000, 2: 30000, 3: 50000 };

const deliveryMethod = ref<number>(1);
const shippingFee = ref<number>(20000);

const deliveryOptions = [
  {
    value: 1,
    label: "Tiết kiệm",
    duration: "40-50 phút",
    price: "20.000đ",
    icon: "pi pi-clock",
  },
  {
    value: 2,
    label: "Tiêu chuẩn",
    duration: "30-40 phút",
    price: "30.000đ",
    icon: "pi pi-truck",
  },
  {
    value: 3,
    label: "Hỏa tốc",
    duration: "15-25 phút",
    price: "50.000đ",
    icon: "pi pi-bolt",
  },
];

function updateShipping() {
  shippingFee.value = DELIVERY_FEES[deliveryMethod.value] ?? 20000;
}

// ── Voucher ───────────────────────────────────────────────────────────────────

const showVoucherDialog = ref(false);
const voucherInput = ref("");
const voucherError = ref("");
const selectedVoucherCode = ref("");
const discountVoucher = ref(0);

function openVoucherDialog() {
  voucherError.value = "";
  voucherInput.value = "";
  showVoucherDialog.value = true;
}

function selectVoucher(voucher: Voucher) {
  selectedVoucherCode.value = voucher.code;
  discountVoucher.value =
    voucher.discountAmount ??
    Math.min(
      Math.round(basePrice.value * ((voucher.discountPercent ?? 0) / 100)),
      voucher.maxDiscountAmount ?? Infinity,
    );
  showVoucherDialog.value = false;
  voucherError.value = "";
}

function applyVoucher() {
  const code = voucherInput.value.trim().toUpperCase();
  if (!code) {
    voucherError.value = "Vui lòng nhập mã voucher.";
    return;
  }

  const found = authStore.vouchers.find((v) => v.code.toUpperCase() === code);
  if (!found) {
    voucherError.value = "Mã voucher không hợp lệ hoặc đã hết hạn.";
    return;
  }

  selectVoucher(found);
}

function removeVoucher() {
  selectedVoucherCode.value = "";
  discountVoucher.value = 0;
  voucherInput.value = "";
  voucherError.value = "";
}

// ── Cart products ─────────────────────────────────────────────────────────────

// const cartProducts = computed<OrderProduct[]>(() => {
//   if (orderStore.cartDetail) return orderStore.cartDetail.products
//   if (orderStore.product) {
//     return [{
//       id: orderStore.product.id,
//       title: orderStore.product.title,
//       thumbnail: orderStore.product.thumbnail,
//       quantity: 1,
//       totalPrice: orderStore.product.priceNew,
//     }]
//   }
//   return []
// })
const cartProducts = ref<OrderProduct[]>([
  {
    id: 1,
    title: "Gà rán giòn sốt mật ong",
    thumbnail: "https://picsum.photos/seed/food1/200/200",
    quantity: 2,
    totalPrice: 120000,
  },
  {
    id: 2,
    title: "Bún bò Huế đặc biệt",
    thumbnail: "https://picsum.photos/seed/food2/200/200",
    quantity: 1,
    totalPrice: 65000,
  },
  {
    id: 3,
    title: "Cơm tấm sườn bì chả",
    thumbnail: "https://picsum.photos/seed/food3/200/200",
    quantity: 1,
    totalPrice: 55000,
  },
]);
// ── Price calculation ─────────────────────────────────────────────────────────
const basePrice = computed<number>(() =>
  cartProducts.value.reduce((sum, item) => sum + item.totalPrice, 0),
);
// const basePrice = computed<number>(() => {
//   if (orderStore.cartDetail) return orderStore.cartDetail.totalPrice;
//   if (orderStore.product) return orderStore.product.priceNew;
//   return 0;
// });

const grandTotal = computed<number>(() =>
  Math.max(0, basePrice.value - discountVoucher.value + shippingFee.value),
);

// ── Validation ────────────────────────────────────────────────────────────────

const PHONE_REGEX = /^(0[3|5|7|8|9])+([0-9]{8})$/;

function validateField(field: string) {
  switch (field) {
    case "full_name":
      if (!form.value.full_name.trim()) {
        errors.value.full_name = "Vui lòng nhập họ tên.";
      } else if (form.value.full_name.trim().length < 3) {
        errors.value.full_name = "Họ tên phải có ít nhất 3 ký tự.";
      } else {
        errors.value.full_name = "";
      }
      break;
    case "phone":
      if (!form.value.phone.trim()) {
        errors.value.phone = "Vui lòng nhập số điện thoại.";
      } else if (!PHONE_REGEX.test(form.value.phone)) {
        errors.value.phone = "Số điện thoại không hợp lệ (VD: 0901234567).";
      } else {
        errors.value.phone = "";
      }
      break;
    case "province":
      errors.value.province = form.value.province_code
        ? ""
        : "Vui lòng chọn tỉnh/thành.";
      break;
    case "district":
      errors.value.district = form.value.district_code
        ? ""
        : "Vui lòng chọn quận/huyện.";
      break;
    case "ward":
      errors.value.ward = form.value.ward_code
        ? ""
        : "Vui lòng chọn phường/xã.";
      break;
    case "address":
      if (!form.value.address.trim()) {
        errors.value.address = "Vui lòng nhập số nhà / đường.";
      } else if (form.value.address.trim().length < 3) {
        errors.value.address = "Địa chỉ phải có ít nhất 3 ký tự.";
      } else {
        errors.value.address = "";
      }
      break;
    case "note":
      if (form.value.note.trim() && form.value.note.trim().length < 3) {
        errors.value.note = "Ghi chú phải có ít nhất 3 ký tự (hoặc để trống).";
      } else {
        errors.value.note = "";
      }
      break;
  }
}

function validateAll(): boolean {
  (
    [
      "full_name",
      "phone",
      "province",
      "district",
      "ward",
      "address",
      "note",
    ] as const
  ).forEach((field) => validateField(field));
  return Object.values(errors.value).every((e) => e === "");
}

// ── Checkout logic ────────────────────────────────────────────────────────────

const isSubmitting = ref(false);

async function handleCheckout() {
  if (!validateAll()) return;

  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 30000));

  try {
    const payload = {
      userInfo: {
        fullname: form.value.full_name,
        phone: form.value.phone,
        address: form.value.address,
        ward: getWardName(),
        district: getDistrictName(),
        province: getProvinceName(),
        note: form.value.note,
      },
      products: cartProducts.value,
      deliveryMethod: deliveryMethod.value,
      paymentMethod: 0, // Default to COD; user picks on info page
      voucherCode: selectedVoucherCode.value || undefined,
      discountVoucher: discountVoucher.value,
      shippingFee: shippingFee.value,
      totalPrice: grandTotal.value,
    } satisfies OrderInfo;

    // Call API (bypassed if no endpoint)
    try {
      await $fetch("/api/orders", {
        method: "POST",
        body: payload,
      });
    } catch {
      // ignore
    }

    // Save to store and redirect
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

// ── Utils ─────────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return `${value.toLocaleString("vi-VN")}đ`;
}
</script>
