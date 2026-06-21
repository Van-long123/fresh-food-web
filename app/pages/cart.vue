<template>
  <SkCartPage v-if="isLoading" />
  <AppLoading
    v-else-if="isValidating"
    variant="overlay"
    message="Đang kiểm tra tồn kho..."
  />
  <div
    v-else
    class="bg-[#f8fafc] min-h-screen text-[#111827] pb-[90px]"
    style="--primary: #f97316; --secondary: #16a34a"
  >
    <div class="w-[min(1200px,92vw)] mx-auto pt-6">
      <!-- BREADCRUMB -->
      <nav
        aria-label="Breadcrumb"
        class="mb-4 flex items-center gap-2 text-sm text-slate-500"
      >
        <NuxtLink :to="ROUTES.HOME" class="hover:text-orange-600"
          >Trang chủ</NuxtLink
        >
        <i class="pi pi-angle-right text-xs" />
        <span class="line-clamp-1 text-slate-700">Giỏ hàng</span>
      </nav>

      <!-- HEAD ROW -->
      <div class="mt-2.5 head-mount">
        <h1 class="m-0 text-[28px] font-extrabold flex items-center gap-2.5">
          🛒 Giỏ Hàng Của Bạn
          <span
            class="text-[13px] rounded-full px-2.5 py-1 bg-[#f97316] text-white"
            >{{ selectedCount }} sản phẩm</span
          >
        </h1>
      </div>

      <template v-if="displayItems.length">
        <!-- MAIN LAYOUT -->
        <section
          class="mt-5 grid grid-cols-1 lg:grid-cols-[63%_37%] gap-6 items-start"
        >
          <div>
            <!-- TOOLS ROW -->
            <div
              class="flex items-center gap-3 justify-between mb-2.5 text-sm flex-wrap"
            >
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleAll"
                />
                Chọn tất cả ({{ displayItems.length }})
              </label>
              <button
                type="button"
                class="border-0 bg-transparent text-[#ef4444] text-[13px] hover:underline transition-all"
                :disabled="!selectedItems.length"
                @click="removeSelected"
              >
                Xóa đã chọn
              </button>
              <div class="text-[#6b7280] text-[13px]">
                Sắp xếp theo: Mới thêm ▾
              </div>
            </div>

            <TransitionGroup name="slide-list" tag="div" class="grid gap-3">
              <article
                v-for="item in displayItems"
                :key="item.id"
                class="grid gap-3.5 rounded-2xl border border-[#e5e7eb] bg-white p-4 relative transition-opacity"
                :class="{
                  'opacity-50 pointer-events-none': item.isOutOfStock,
                }"
                style="grid-template-columns: 26px 80px 1fr auto 40px"
              >
                <!-- Checkbox -->
                <label class="grid place-items-center">
                  <input
                    v-model="checkedMap[item.id]"
                    type="checkbox"
                    class="hidden"
                    :disabled="item.isOutOfStock"
                  />
                  <span
                    class="w-[18px] h-[18px] rounded-md border border-[#d1d5db] block transition-all"
                    :class="{
                      'bg-[#f97316] border-[#f97316] shadow-[inset_0_0_0_3px_#fff]':
                        item.checked && !item.isOutOfStock,
                      'bg-[#e5e7eb] border-[#d1d5db]': item.isOutOfStock,
                    }"
                  />
                </label>

                <!-- Thumb -->
                <NuxtLink
                  :to="ROUTES.PRODUCT_DETAIL(item.slug || '')"
                  class="w-20 h-20 rounded-xl relative overflow-hidden bg-slate-50 block hover:opacity-80 transition-opacity"
                >
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.name"
                    class="h-full w-full object-cover"
                  />
                </NuxtLink>

                <div class="item-info">
                  <NuxtLink
                    :to="ROUTES.PRODUCT_DETAIL(item.slug || '')"
                    class="block"
                  >
                    <h3
                      class="m-0 text-base hover:text-[#ea580c] transition-colors"
                    >
                      {{ item.name }}
                    </h3>
                  </NuxtLink>
                  <p class="mt-1 mb-0 text-[#6b7280] text-[12px] uppercase">
                    SMARTFOOD
                  </p>
                  <p class="mt-1 mb-0 text-[#6b7280] text-[12px] uppercase">
                    Đơn vị: {{ item.unitLabel }} · Mã: {{ item.sku }}
                  </p>
                  <div class="mt-2 flex gap-1.5 flex-wrap">
                    <span
                      class="rounded-full text-[11px] px-2 py-0.5 bg-[#f0fdf4] text-[#166534]"
                      >🌿 Organic</span
                    >
                    <span
                      class="rounded-full text-[11px] px-2 py-0.5 bg-[#eff6ff] text-[#1d4ed8]"
                      >❄️ Bảo quản lạnh</span
                    >
                  </div>
                  <p
                    v-if="item.isOutOfStock"
                    class="mt-2 mb-0 text-[#ef4444] text-[13px] font-semibold"
                  >
                    ❌ Sản phẩm đã hết hàng
                  </p>
                  <p
                    v-else-if="item.lowStock"
                    class="mt-2 mb-0 text-[#ef4444] text-[12px]"
                  >
                    ⚠️ Chỉ còn {{ item.stock }} sản phẩm
                  </p>
                  <div class="mt-2.5 flex items-center gap-2.5">
                    <button
                      type="button"
                      :disabled="item.isUpdating || item.isOutOfStock"
                      class="w-7 h-7 rounded-lg border border-[#d1d5db] bg-white hover:enabled:bg-[#f97316] hover:enabled:border-[#f97316] hover:enabled:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      @click="changeQty(item.id, -1)"
                    >
                      -
                    </button>
                    <strong
                      class="min-w-[40px] text-center"
                      :class="{ 'qty-bump': qtyBumpId === item.id }"
                      >{{ item.quantity }}</strong
                    >
                    <button
                      type="button"
                      :disabled="item.isUpdating || item.isOutOfStock"
                      class="w-7 h-7 rounded-lg border border-[#d1d5db] bg-white hover:enabled:bg-[#f97316] hover:enabled:border-[#f97316] hover:enabled:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      @click="changeQty(item.id, 1)"
                    >
                      +
                    </button>
                  </div>
                </div>

                <!-- Price -->
                <div class="text-right">
                  <p
                    v-if="item.originalPrice"
                    class="m-0 text-[#6b7280] line-through text-[13px]"
                  >
                    {{ format(item.originalPrice) }}đ
                  </p>
                  <p
                    class="mt-1 mb-0 text-[#ea580c] text-[22px] font-extrabold"
                  >
                    {{ format(item.price) }}đ
                  </p>
                  <small class="text-[#6b7280]"
                    >= {{ format(item.price * item.quantity) }}đ</small
                  >
                </div>

                <!-- Remove -->
                <!-- pointer-events: auto; Cho phép: các event chuột hoạt động bình thường -->
                <div
                  class="relative"
                  :class="{ 'pointer-events-auto': item.isOutOfStock }"
                >
                  <button
                    type="button"
                    class="w-[30px] h-[30px] border-0 rounded-lg bg-transparent text-[#9ca3af] hover:text-[#ef4444] hover:bg-[#fef2f2]"
                    @click="toggleRemoveAsk(item.id)"
                  >
                    🗑
                  </button>
                  <div
                    v-if="removeAskId === item.id"
                    class="absolute right-0 top-[34px] w-[130px] rounded-[10px] border border-[#e5e7eb] bg-white shadow-[0_12px_20px_rgba(15,23,42,0.12)] p-2 z-[5]"
                  >
                    <p class="m-0 text-[13px] text-[#6b7280]">Xóa?</p>
                    <div class="mt-1.5 flex gap-1.5">
                      <button
                        type="button"
                        class="border border-[#d1d5db] rounded-lg bg-white px-2 py-1 text-[12px]"
                        @click="removeAskId = null"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        class="border border-[#ef4444] rounded-lg bg-white px-2 py-1 text-[12px] text-[#ef4444]"
                        @click="handleRemoveItem(item.id)"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </TransitionGroup>
          </div>

          <!-- SUMMARY CARD -->
          <aside
            class="lg:sticky lg:top-24 border border-[#e5e7eb] rounded-2xl bg-white p-5 shadow-[0_6px_16px_rgba(15,23,42,0.06)]"
          >
            <h3 class="m-0 mb-3">Tóm Tắt Đơn Hàng</h3>

            <!-- <div class="flex justify-between my-2 text-[#374151]">
              <span>Tạm tính:</span><strong>{{ format(subtotal) }}đ</strong>
            </div>
            <div class="flex justify-between my-2 text-[#374151]">
              <span>Giảm giá voucher:</span>
              <strong class="text-[#16a34a]"
                >-{{ format(voucherDiscount) }}đ</strong
              >
            </div> -->
            <div
              class="flex justify-between my-2 text-[#374151] border-t border-[#f3f4f6] pt-2.5 text-[20px] font-black text-[#ea580c]"
              :class="{ 'total-pulse': totalPulse }"
            >
              <!-- <span>TỔNG CỘNG:</span><strong>{{ format(grandTotal) }}đ</strong>
            </div>
            <div class="mt-3.5">
              <label class="text-[13px] font-bold">Mã giảm giá / Voucher</label>
              <div class="mt-[7px] grid grid-cols-[1fr_auto] gap-2">
                <input
                  v-model="voucherInput"
                  type="text"
                  placeholder="Nhập mã voucher"
                  class="border rounded-[10px] p-2.5"
                  :disabled="!!appliedVoucher"
                  :class="
                    appliedVoucher ? 'border-[#16a34a]' : 'border-[#e5e7eb]'
                  "
                />
                <button
                  v-if="!appliedVoucher"
                  type="button"
                  :disabled="isApplying"
                  class="border-0 rounded-[10px] bg-[#f97316] text-white px-3 font-bold flex items-center gap-1"
                  @click="() => handleApplyVoucher()"
                >
                  <i v-if="isApplying" class="pi pi-spinner pi-spin"></i>
                  <span>Áp dụng</span>
                </button>
                <button
                  v-else
                  type="button"
                  class="border border-[#ef4444] rounded-[10px] bg-white text-[#ef4444] px-3 font-bold"
                  @click="() => removeVoucher()"
                >
                  Bỏ
                </button>
              </div>
              <small v-if="appliedVoucher" class="text-[#16a34a] mt-1 block"
                >✓ Đã áp dụng mã {{ appliedVoucher.code }} (giảm
                {{ format(voucherDiscount) }}đ)</small
              >
              <NuxtLink
                :to="ROUTES.VOUCHERS"
                class="inline-block mt-1.5 text-[#f97316] text-[13px]"
                >Xem mã của tôi</NuxtLink
              > -->
              <span>TỔNG CỘNG:</span><strong>{{ format(subtotal) }}đ</strong>
            </div>

            <!-- ETA -->
            <!-- <div
              class="mt-3 border border-[#bbf7d0] bg-[#f0fdf4] text-[#166534] rounded-[10px] p-2.5 text-[13px]"
            >
              🚴 Dự kiến giao: Hôm nay 14:00 - 18:00
            </div> -->

            <!-- Checkout button -->
            <button
              type="button"
              :disabled="isValidating"
              class="w-full mt-3.5 h-[52px] border-0 rounded-xl text-white text-base font-extrabold bg-gradient-to-r from-[#f97316] to-[#ea580c] flex justify-center items-center gap-2 transition-[transform,box-shadow] hover:disabled:opacity-75 hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_12px_22px_rgba(249,115,22,0.32)] active:enabled:scale-[0.98]"
              @click="checkoutNow"
            >
              <i v-if="isValidating" class="pi pi-spinner pi-spin"></i>
              <span>{{
                isValidating ? "Đang kiểm tra..." : "Đặt hàng ngay →"
              }}</span>
            </button>

            <!-- Trust row -->
            <div class="mt-2.5 grid gap-1 text-[#6b7280] text-[12px]">
              <span>🔒 Thanh toán an toàn</span>
              <span>🔄 Đổi trả dễ dàng 24h</span>
              <span>🚚 Giao hàng nhanh 2h</span>
            </div>

            <!-- Pay icons -->
            <div class="mt-2.5 flex gap-1.5 flex-wrap">
              <span
                v-for="p in ['PayOS', 'COD']"
                :key="p"
                class="border border-[#e5e7eb] rounded-lg px-2 py-[5px] text-[11px] text-[#9ca3af] hover:text-[#374151]"
                >{{ p }}</span
              >
            </div>
          </aside>
        </section>

        <!-- SUGGESTIONS -->
        <section class="mt-6">
          <h3 class="m-0 mb-2.5">🎁 Sản Phẩm Ưu Đãi</h3>
          <Carousel
            :value="suggestItems"
            :num-visible="5"
            :num-scroll="1"
            :responsive-options="suggestResponsiveOptions"
            circular
            :show-indicators="false"
            :show-navigation-pane="false"
            class="suggestions-carousel"
          >
            <template #item="slotProps">
              <div class="px-2">
                <article
                  class="border border-[#e5e7eb] rounded-xl bg-white p-2.5 h-full"
                >
                  <NuxtLink
                    :to="ROUTES.PRODUCT_DETAIL(slotProps.data.slug || '')"
                    class="w-full aspect-square rounded-[10px] relative overflow-hidden bg-slate-50 block hover:opacity-80 transition-opacity"
                  >
                    <img
                      v-if="slotProps.data.image"
                      :src="slotProps.data.image"
                      :alt="slotProps.data.name"
                      class="h-full w-full object-cover"
                    />
                  </NuxtLink>
                  <NuxtLink
                    :to="ROUTES.PRODUCT_DETAIL(slotProps.data.slug || '')"
                    class="block"
                  >
                    <h4
                      class="mt-2 mb-0 min-h-[40px] text-sm hover:text-[#ea580c] transition-colors line-clamp-2"
                    >
                      {{ slotProps.data.name }}
                    </h4>
                  </NuxtLink>
                  <div
                    v-if="slotProps.data.originalPrice > slotProps.data.price"
                    class="mt-1 mb-0"
                  >
                    <p class="text-[#9ca3af] line-through text-[12px] mb-1">
                      {{ format(slotProps.data.originalPrice) }}đ
                    </p>
                  </div>
                  <p class="mt-1.5 mb-0">
                    <strong class="text-[#ea580c]"
                      >{{ format(slotProps.data.price) }}đ</strong
                    >
                  </p>
                  <button
                    type="button"
                    class="mt-2 w-full h-[32px] border-0 rounded-lg bg-[#f97316] text-white text-sm font-semibold hover:bg-[#ea580c] transition-colors"
                    @click="quickAdd(slotProps.data)"
                  >
                    + Thêm vào giỏ
                  </button>
                </article>
              </div>
            </template>
          </Carousel>
        </section>
      </template>

      <!-- EMPTY STATE -->
      <section v-else class="min-h-[60vh] grid place-items-center text-center">
        <div>
          <h2 class="m-0">Giỏ hàng trống trơn...</h2>
          <p class="mt-1.5 mb-0 text-[#6b7280]">
            Hãy khám phá ngay kho thực phẩm tươi ngon!
          </p>
          <NuxtLink
            :to="ROUTES.HOME"
            class="inline-block mt-2.5 rounded-full bg-[#f97316] text-white px-[18px] py-2.5 font-bold"
            >🛒 Mua sắm ngay</NuxtLink
          >
        </div>
      </section>
    </div>

    <!-- MOBILE FLOAT -->
    <Transition name="float-bar">
      <div
        v-if="showMobileFloat && displayItems.length"
        class="fixed left-0 right-0 bottom-0 z-[35] bg-white border-t border-[#e5e7eb] shadow-[0_-8px_22px_rgba(15,23,42,0.12)] px-4 py-3 hidden max-[768px]:flex justify-between items-center"
      >
        <div>
          <!-- <strong>{{ selectedCount }} sản phẩm · {{ format(grandTotal) }}đ</strong -->

          <strong
            >{{ selectedCount }} sản phẩm · {{ format(subtotal) }}đ</strong
          >
        </div>
        <button
          type="button"
          :disabled="isValidating || hasSelectedOutOfStock"
          class="border-0 rounded-full bg-[#f97316] text-white font-bold px-[18px] py-2.5 flex items-center gap-1.5 transition-opacity hover:disabled:opacity-75"
          @click="checkoutNow"
        >
          <i v-if="isValidating" class="pi pi-spinner pi-spin text-sm"></i>
          <span>{{ isValidating ? "Kiểm tra..." : "Đặt hàng" }}</span>
        </button>
      </div>
    </Transition>

    <!-- CONFIRM REMOVE MODAL -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showConfirmModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          @click.self="showConfirmModal = false"
        >
          <div
            class="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all animate-in fade-in zoom-in duration-200"
          >
            <div
              class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <i class="pi pi-trash text-2xl text-red-500"></i>
            </div>
            <h3 class="text-xl font-bold text-center text-slate-800 mb-2">
              Xác nhận xóa?
            </h3>
            <p class="text-slate-500 text-center mb-8">
              Bạn có chắc chắn muốn xóa {{ selectedItems.length }} sản phẩm đã
              chọn khỏi giỏ hàng không?
            </p>
            <div class="flex gap-3">
              <button
                class="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                @click="showConfirmModal = false"
              >
                Hủy
              </button>
              <button
                class="flex-1 py-3 px-4 rounded-xl bg-red-500 font-semibold text-white hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95"
                @click="confirmRemoveSelected"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { ROUTES } from "~/constants/routes";
import SkCartPage from "~/components/skeletons/SkCartPage.vue";
import { useCart } from "~/composables/cart/useCart";
import { useCheckout } from "~/composables/checkout/useCheckout";
import { useProductsQuery } from "~/queries/product/useProductsQuery";
// import { useApplyVoucher } from "~/composables/voucher/useApplyVoucher";
import Carousel from "primevue/carousel";

import { useOrderStore } from "~/stores/useOrderStore";

useHead({
  title: "Giỏ hàng - SmartFood",
  meta: [{ name: "description", content: "Trang Giỏ hàng của SmartFood" }],
});

const orderStore = useOrderStore();
const { isValidating, itemsOutOfStock, proceedToCheckout } = useCheckout();
const {
  cartItems,
  isLoading,
  isItemUpdating,
  increaseQty,
  decreaseQty,
  removeItem,
  removeItems,
  addToCart,
  ensureCartReady,
  adjustedIds,
} = useCart();

const checkedMap = ref<Record<string, boolean>>({});

watch(
  cartItems,
  (next) => {
    const updated = { ...checkedMap.value };
    next.forEach((item) => {
      if (updated[item.id] === undefined) {
        // Chỉ tự động tích chọn nếu sản phẩm còn hàng
        updated[item.id] = (item.stock || 0) > 0;
      }
    });
    Object.keys(updated).forEach((id) => {
      if (!next.some((item) => item.id === id)) {
        delete updated[id];
      }
    });
    checkedMap.value = updated;
  },
  { immediate: true },
);

// Auto-uncheck items marked as out-of-stock
watch(itemsOutOfStock, (outOfStockIds) => {
  if (outOfStockIds.size > 0) {
    const updated = { ...checkedMap.value };
    outOfStockIds.forEach((id) => {
      updated[id] = false;
    });
    checkedMap.value = updated;
  }
});

const displayItems = computed(() => {
  return [...cartItems.value]
    .filter((item) => !item.deleted && item.status !== "inactive")
    .sort((a, b) => {
      const aOOS =
        itemsOutOfStock.value.has(a.id) || Number(a.stock || 0) === 0;
      const bOOS =
        itemsOutOfStock.value.has(b.id) || Number(b.stock || 0) === 0;

      // 1. Đẩy sản phẩm hết hàng xuống dưới cùng
      if (aOOS !== bOOS) return aOOS ? 1 : -1;

      // 2. Sản phẩm còn hàng: Sắp xếp theo thời gian thêm vào (Mới nhất lên trên)
      const aTime = new Date(a.addedAt || 0).getTime();
      const bTime = new Date(b.addedAt || 0).getTime();
      return bTime - aTime;
    })
    .map((item) => {
      const isOutOfStock =
        itemsOutOfStock.value.has(item.id) || Number(item.stock || 0) === 0;
      return {
        ...item,
        isOutOfStock,
        // Ép trạng thái checked về false nếu hết hàng để không gửi lên validate
        checked: !isOutOfStock && Boolean(checkedMap.value[item.id]),
        isUpdating: isItemUpdating(item.id),
        isAdjusted: adjustedIds.value.has(item.id),
        lowStock: item.stock > 0 && item.stock <= 5,
        unitLabel: item.unit || "Hộp",
        sku: item.productId.slice(-6).toUpperCase(),
      };
    });
});

const hasSelectedOutOfStock = computed(() =>
  selectedItems.value.some((it) => Number(it.stock || 0) === 0),
);

// const {
// appliedVoucher,
// voucherDiscount,
// voucherBreakdown,
// isApplying,
// applyVoucher: mutateVoucher,
// removeVoucher,
// } = useApplyVoucher();

// const voucherInput = ref("");
const removeAskId = ref<string | null>(null);
const qtyBumpId = ref<string | null>(null);
const showConfirmModal = ref(false);
const totalPulse = ref(false);
const showMobileFloat = ref(false);

const selectedItems = computed(() =>
  displayItems.value.filter((item) => item.checked),
);
const selectedItemsSignature = computed(() =>
  selectedItems.value
    .map(
      (item) =>
        `${item.id}:${item.quantity}:${item.price}:${item.categoryId || ""}`,
    )
    .join("|"),
);
const selectedCount = computed(() => selectedItems.value.length);
const allSelected = computed(
  () =>
    displayItems.value.length > 0 && displayItems.value.every((i) => i.checked),
);
const subtotal = computed(() =>
  selectedItems.value.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  ),
);
// const grandTotal = computed(() =>
// Math.max(0, subtotal.value - voucherDiscount.value),
// );
const format = (n: number) => n.toLocaleString("vi-VN");
// const itemDiscountMap = computed<Record<string, number>>(
// () => voucherBreakdown.value || {},
// );

// const buildVoucherPayloadItems = () =>
// selectedItems.value.map((item) => ({
// productId: item.productId,
// categoryId: item.categoryId,
// quantity: item.quantity,
// price: item.price,
// }));

const toggleAll = (e: Event) => {
  const t = e.target as HTMLInputElement;
  const next = { ...checkedMap.value };
  displayItems.value.forEach((item) => {
    next[item.id] = t.checked;
  });
  checkedMap.value = next;
};

const removeSelected = async () => {
  if (!selectedItems.value.length) return;
  showConfirmModal.value = true;
};

const confirmRemoveSelected = async () => {
  const ids = selectedItems.value.map((item) => item.id);
  await removeItems(ids);
  showConfirmModal.value = false;
};

const toggleRemoveAsk = (id: string) => {
  removeAskId.value = removeAskId.value === id ? null : id;
};

const handleRemoveItem = async (id: string) => {
  await removeItem(id);
  removeAskId.value = null;
};

const changeQty = async (id: string, delta: number) => {
  if (delta > 0) {
    await increaseQty(id);
  } else {
    await decreaseQty(id);
  }
  qtyBumpId.value = id;
  setTimeout(() => {
    qtyBumpId.value = null;
  }, 250);
};

// watch([subtotal, selectedItemsSignature], ([newTotal]) => {
// if (appliedVoucher.value && newTotal < appliedVoucher.value.minOrderValue) {
// // Auto-remove silently when order value drops.
// // The user will see the price change and the total pulse animation.
// removeVoucher({ silent: true });
// } else if (appliedVoucher.value) {
// // Recalculate scope-based discounts whenever cart composition changes.
// handleApplyVoucher({ silent: true });
// }
// });

// const handleApplyVoucher = (options: { silent?: boolean } = {}) => {
// const code = (appliedVoucher.value?.code || voucherInput.value)
// .trim()
// .toUpperCase();
// if (!code) return;
// mutateVoucher(
// { code, orderValue: subtotal.value, items: buildVoucherPayloadItems() },
// options,
// );
// };

const checkoutNow = async () => {
  if (selectedItems.value.length === 0) return;

  const checkoutPayload = {
    products: selectedItems.value.map((item) => ({
      id: item.id,
      title: item.name,
      thumbnail: item.image || "",
      quantity: item.quantity,
      priceNew: item.price,
      totalPrice: item.price * item.quantity,
      categoryId: item.categoryId || null,
    })),
    voucherCode: undefined,
    discountVoucher: 0,

    shippingFee: 0,
    subtotal: subtotal.value,
    grandTotal: subtotal.value,
  };

  // Callback để tự động bỏ tích items hết hàng
  const handleOutOfStock = (outOfStockIds: Set<string>) => {
    const updated = { ...checkedMap.value };
    outOfStockIds.forEach((id) => {
      updated[id] = false;
    });
    checkedMap.value = updated;
  };

  // Gọi composable để thực hiện kiểm tra auth, validate stock, và redirect checkout
  await proceedToCheckout(
    selectedItems.value,
    checkoutPayload,
    handleOutOfStock,
  );
};

const { data: suggestData } = useProductsQuery({
  limit: 20,
  sortField: "discountPercentage",
  sortOrder: "desc",
});

const suggestItems = computed(() => {
  const raw = suggestData.value?.data || [];
  return raw
    .filter((item: any) => (item.stock || 0) > 0)
    .map((item: any) => ({
      id: String(item._id || item.id || ""),
      name: item.title || item.name || "",
      price: Number(item.price || 0),
      originalPrice: Number(item.originalPrice || item.price || 0),
      image: item.thumbnail || item.image || "",
      stock: Number(item.stock || 0),
      slug: item.slug || "",
      discount:
        item.discountPercentage ||
        Math.round(
          ((Number(item.originalPrice || item.price) - Number(item.price)) /
            Number(item.originalPrice || item.price)) *
            100,
        ),
    }))
    .filter(
      (item: any) => item.id && item.name && item.originalPrice > item.price,
    )
    .sort(
      (a: any, b: any) =>
        b.originalPrice - b.price - (a.originalPrice - a.price),
    );
});

const suggestResponsiveOptions = [
  { breakpoint: '1400px', numVisible: 5, numScroll: 1 },
  { breakpoint: '1024px', numVisible: 4, numScroll: 1 },
  { breakpoint: '768px', numVisible: 3, numScroll: 1 },
  { breakpoint: '576px', numVisible: 2, numScroll: 1 },
  { breakpoint: '400px', numVisible: 1, numScroll: 1 },
];

const quickAdd = async (item: (typeof suggestItems.value)[number]) => {
  await addToCart({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    stock: item.stock,
    slug: item.slug,
  });
};

const onScroll = () => {
  showMobileFloat.value = window.scrollY > 260;
};

watch(subtotal, () => {
  totalPulse.value = true;
  setTimeout(() => {
    totalPulse.value = false;
  }, 320);
});

onMounted(() => {
  ensureCartReady();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
/* Animations */
.head-mount {
  opacity: 0;
  transform: translateY(-8px);
  animation: headIn 0.4s ease forwards;
}
@keyframes headIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.qty-bump {
  animation: qtyPop 0.3s ease;
}
@keyframes qtyPop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.total-pulse {
  animation: totalPulse 0.3s ease;
}
@keyframes totalPulse {
  50% {
    transform: scale(1.03);
    color: #f97316;
  }
}

.voucher-shake {
  animation: shake 0.25s ease;
}
@keyframes shake {
  25% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
}

.confetti-dot {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  top: -3px;
  left: calc(var(--i) * 22%);
  background: #22c55e;
  animation: confetti 0.6s ease-out infinite;
}
@keyframes confetti {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-12px);
    opacity: 0;
  }
}

.cart-sway {
  animation: sway 3s infinite ease-in-out;
}
@keyframes sway {
  0%,
  100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

.checkout-spin {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* List transitions */
.slide-list-enter-active,
.slide-list-leave-active {
  transition: all 0.3s ease;
}
.slide-list-enter-from,
.slide-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Float bar & toast transitions */
.float-bar-enter-active,
.float-bar-leave-active,
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.float-bar-enter-from,
.float-bar-leave-to,
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Mobile cart item layout */
@media (max-width: 768px) {
  article.cart-item-mobile {
    grid-template-columns: 24px 64px 1fr !important;
    padding: 12px !important;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Carousel styles */
:deep(.suggestions-carousel) {
  .p-carousel-content {
    gap: 0.625rem;
  }

  .p-carousel-item {
    padding: 0;
  }

  .p-carousel-next,
  .p-carousel-prev {
    background-color: #f97316;
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
      background-color: #ea580c;
    }
  }

  .p-carousel-next {
    right: -50px;

    @media (max-width: 1024px) {
      right: -35px;
    }
  }

  .p-carousel-prev {
    left: -50px;

    @media (max-width: 1024px) {
      left: -35px;
    }
  }
}
</style>
