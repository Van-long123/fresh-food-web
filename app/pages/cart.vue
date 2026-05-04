<template>
  <SkCartPage v-if="isLoading" />
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
                @click="showConfirmModal = true"
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
                class="grid gap-3.5 rounded-2xl border border-[#e5e7eb] bg-white p-4 relative"
                :class="item.isAdjusted ? 'border-[#fdba74] bg-[#fff7ed]' : ''"
                style="grid-template-columns: 26px 80px 1fr auto 40px"
              >
                <!-- Checkbox -->
                <label class="grid place-items-center">
                  <input
                    v-model="checkedMap[item.id]"
                    type="checkbox"
                    class="hidden"
                  />
                  <span
                    class="w-[18px] h-[18px] rounded-md border border-[#d1d5db] block"
                    :class="
                      item.checked
                        ? 'bg-[#f97316] border-[#f97316] shadow-[inset_0_0_0_3px_#fff]'
                        : ''
                    "
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
                    v-if="item.lowStock"
                    class="mt-2 mb-0 text-[#ef4444] text-[12px]"
                  >
                    ⚠️ Chỉ còn {{ item.stock }} sản phẩm
                  </p>
                  <div class="mt-2.5 flex items-center gap-2.5">
                    <button
                      type="button"
                      :disabled="item.isUpdating"
                      class="w-7 h-7 rounded-lg border border-[#d1d5db] bg-white hover:enabled:bg-[#f97316] hover:enabled:border-[#f97316] hover:enabled:text-white"
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
                      :disabled="item.isUpdating"
                      class="w-7 h-7 rounded-lg border border-[#d1d5db] bg-white hover:enabled:bg-[#f97316] hover:enabled:border-[#f97316] hover:enabled:text-white"
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
                <div class="relative">
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

            <div class="flex justify-between my-2 text-[#374151]">
              <span>Tạm tính:</span><strong>{{ format(subtotal) }}đ</strong>
            </div>
            <!-- <div class="flex justify-between my-2 text-[#374151]">
              <span>Phí giao hàng:</span>
              <strong :class="shippingFee === 0 ? 'text-[#16a34a]' : ''">{{
                shippingFee === 0 ? "🎉 Miễn phí" : `${format(shippingFee)}đ`
              }}</strong>
            </div> -->
            <div class="flex justify-between my-2 text-[#374151]">
              <span>Giảm giá voucher:</span>
              <strong class="text-[#16a34a]"
                >-{{ format(voucherDiscount) }}đ</strong
              >
            </div>
            <div
              class="flex justify-between my-2 text-[#374151] border-t border-[#f3f4f6] pt-2.5 text-[20px] font-black text-[#ea580c]"
              :class="{ 'total-pulse': totalPulse }"
            >
              <span>TỔNG CỘNG:</span><strong>{{ format(grandTotal) }}đ</strong>
            </div>

            <!-- Free ship bar -->
            <div class="mt-3">
              <!-- <p class="m-0 text-[13px] text-[#4b5563]">
                <template v-if="shippingFee > 0"
                  >Mua thêm {{ format(freeShipRemaining) }}đ để miễn phí vận
                  chuyển! 🚚</template
                >
                <template v-else>🎉 Bạn được miễn phí vận chuyển!</template>
              </p> -->
              <div
                class="mt-2 h-1.5 rounded-full bg-[#e5e7eb] overflow-hidden relative"
              >
                <span
                  class="block h-full bg-[#f97316] transition-[width] duration-500"
                  :style="{ width: `${freeShipPercent}%` }"
                />
                <template v-if="shippingFee === 0">
                  <i
                    v-for="n in 4"
                    :key="n"
                    class="confetti-dot"
                    :style="{ '--i': `${n}` }"
                  />
                </template>
              </div>
            </div>

            <!-- Voucher -->
            <div class="mt-3.5">
              <label class="text-[13px] font-bold">Mã giảm giá / Voucher</label>
              <div class="mt-[7px] grid grid-cols-[1fr_auto] gap-2">
                <input
                  v-model="voucherInput"
                  type="text"
                  placeholder="Nhập mã voucher"
                  class="border rounded-[10px] p-2.5"
                  :class="
                    voucherState === 'ok'
                      ? 'border-[#16a34a]'
                      : voucherState === 'error'
                        ? 'border-[#ef4444] voucher-shake'
                        : 'border-[#e5e7eb]'
                  "
                />
                <button
                  type="button"
                  class="border-0 rounded-[10px] bg-[#f97316] text-white px-3 font-bold"
                  @click="applyVoucher"
                >
                  Áp dụng
                </button>
              </div>
              <small v-if="voucherState === 'ok'" class="text-[#16a34a]"
                >✓ Giảm 30.000đ</small
              >
              <small
                v-if="voucherState === 'error'"
                class="mt-1 block text-[#ef4444]"
                >Mã không hợp lệ</small
              >
              <NuxtLink
                :to="ROUTES.VOUCHERS"
                class="inline-block mt-1.5 text-[#f97316] text-[13px]"
                >Xem mã của tôi</NuxtLink
              >
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
              :disabled="loadingCheckout"
              class="w-full mt-3.5 h-[52px] border-0 rounded-xl text-white text-base font-extrabold bg-gradient-to-r from-[#f97316] to-[#ea580c] flex justify-center items-center gap-2 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_12px_22px_rgba(249,115,22,0.32)] active:scale-[0.98]"
              @click="checkoutNow"
            >
              <span v-if="loadingCheckout" class="checkout-spin" />
              Đặt hàng ngay →
            </button>

            <!-- Trust row -->
            <div class="mt-2.5 grid gap-1 text-[#6b7280] text-[12px]">
              <span>🔒 Thanh toán an toàn SSL</span>
              <span>🔄 Đổi trả dễ dàng 24h</span>
              <span>🚚 Giao hàng nhanh 2h</span>
            </div>

            <!-- Pay icons -->
            <div class="mt-2.5 flex gap-1.5 flex-wrap">
              <span
                v-for="p in [
                  'VISA',
                  'Master',
                  'Momo',
                  'VNPay',
                  'ZaloPay',
                  'COD',
                ]"
                :key="p"
                class="border border-[#e5e7eb] rounded-lg px-2 py-[5px] text-[11px] text-[#9ca3af] hover:text-[#374151]"
                >{{ p }}</span
              >
            </div>
          </aside>
        </section>

        <!-- SUGGESTIONS -->
        <section class="mt-6">
          <h3 class="m-0 mb-2.5">🔥 Thường Được Mua Cùng</h3>
          <div class="flex gap-2.5 overflow-x-auto pb-2 snap-x snap-mandatory">
            <article
              v-for="item in suggestItems"
              :key="item.id"
              class="min-w-[180px] border border-[#e5e7eb] rounded-xl bg-white p-2.5 snap-start"
            >
              <NuxtLink
                :to="ROUTES.PRODUCT_DETAIL(item.slug || '')"
                class="w-full aspect-square rounded-[10px] relative overflow-hidden bg-slate-50 block hover:opacity-80 transition-opacity"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  class="h-full w-full object-cover"
                />
              </NuxtLink>
              <NuxtLink
                :to="ROUTES.PRODUCT_DETAIL(item.slug || '')"
                class="block"
              >
                <h4
                  class="mt-2 mb-0 min-h-[40px] text-sm hover:text-[#ea580c] transition-colors"
                >
                  {{ item.name }}
                </h4>
              </NuxtLink>
              <p class="mt-1.5 mb-0">
                <strong class="text-[#ea580c]"
                  >{{ format(item.price) }}đ</strong
                >
                <span
                  v-if="item.originalPrice > item.price"
                  class="text-[#9ca3af] line-through ml-1 text-[13px]"
                  >{{ format(item.originalPrice) }}đ</span
                >
              </p>
              <button
                type="button"
                class="mt-2 w-[30px] h-[30px] border-0 rounded-full bg-[#f97316] text-white text-lg"
                @click="quickAdd(item)"
              >
                +
              </button>
            </article>
          </div>
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
          <strong
            >{{ selectedCount }} sản phẩm · {{ format(grandTotal) }}đ</strong
          >
        </div>
        <button
          type="button"
          class="border-0 rounded-full bg-[#f97316] text-white font-bold px-[18px] py-2.5"
          @click="checkoutNow"
        >
          Đặt hàng
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
import { ROUTES } from "~/constants/routes";
import SkCartPage from "~/components/skeletons/SkCartPage.vue";
import { useCart } from "~/composables/cart/useCart";
import { useProductsQuery } from "~/queries/product/useProductsQuery";

useHead({
  title: "Giỏ hàng - SmartFood",
  meta: [{ name: "description", content: "Trang Giỏ hàng của SmartFood" }],
});

const router = useRouter();
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
        updated[item.id] = true;
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

const displayItems = computed(() =>
  cartItems.value.map((item) => ({
    ...item,
    checked: Boolean(checkedMap.value[item.id]),
    isUpdating: isItemUpdating(item.id),
    isAdjusted: adjustedIds.value.has(item.id),
    lowStock: item.stock > 0 && item.stock <= 5,
    unitLabel: item.unit || "Hộp",
    sku: item.productId.slice(-6).toUpperCase(),
  })),
);

const voucherInput = ref("");
const voucherState = ref<"idle" | "ok" | "error">("idle");
const removeAskId = ref<string | null>(null);
const qtyBumpId = ref<string | null>(null);
const showConfirmModal = ref(false);
const loadingCheckout = ref(false);
const totalPulse = ref(false);
const showMobileFloat = ref(false);
const freeShipTarget = 150000;

const selectedItems = computed(() =>
  displayItems.value.filter((item) => item.checked),
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
const shippingFee = computed(() =>
  subtotal.value >= freeShipTarget ? 0 : 25000,
);
const voucherDiscount = computed(() =>
  voucherState.value === "ok" ? 30000 : 0,
);
const grandTotal = computed(() =>
  Math.max(0, subtotal.value + shippingFee.value - voucherDiscount.value),
);
const freeShipPercent = computed(() =>
  Math.min(100, Math.round((subtotal.value / freeShipTarget) * 100)),
);
const freeShipRemaining = computed(() =>
  Math.max(0, freeShipTarget - subtotal.value),
);
const format = (n: number) => n.toLocaleString("vi-VN");

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

const applyVoucher = () => {
  const code = voucherInput.value.trim().toUpperCase();
  voucherState.value = ["SMART30", "SALE30"].includes(code) ? "ok" : "error";
};

const checkoutNow = () => {
  loadingCheckout.value = true;
  setTimeout(() => {
    loadingCheckout.value = false;
    router.push(ROUTES.ORDER.CHECKOUT);
  }, 1000);
};

const { data: suggestData } = useProductsQuery({ limit: 6 });

const suggestItems = computed(() => {
  const raw = suggestData.value?.data || [];
  return raw
    .map((item: any) => ({
      id: String(item._id || item.id || ""),
      name: item.title || item.name || "",
      price: Number(item.price || 0),
      originalPrice: Number(item.originalPrice || 0),
      image: item.thumbnail || item.image || "",
      stock: Number(item.stock || 0),
      slug: item.slug || "",
    }))
    .filter((item: any) => item.id && item.name);
});

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

watch(grandTotal, () => {
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
</style>
