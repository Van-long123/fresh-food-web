<template>
  <div class="cart-page">
    <div class="container">
      <!-- HEADER SECTION -->
      <nav class="breadcrumb">
        <NuxtLink :to="ROUTES.HOME">Trang chủ</NuxtLink>
        <span>›</span>
        <span>Giỏ hàng</span>
      </nav>

      <div class="head-row head-mount">
        <h1>
          🛒 Giỏ Hàng Của Bạn <span>{{ selectedCount }} sản phẩm</span>
        </h1>
      </div>

      <template v-if="items.length">
        <!-- MAIN LAYOUT 2 cột -->
        <section class="cart-layout">
          <div>
            <div class="tools-row">
              <label>
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleAll"
                />
                Chọn tất cả ({{ items.length }})
              </label>
              <button type="button" class="danger-link" @click="removeSelected">
                Xóa đã chọn
              </button>
              <div class="sort-mini">Sắp xếp theo: Mới thêm ▾</div>
            </div>

            <TransitionGroup name="slide-list" tag="div" class="product-list">
              <article
                v-for="item in items"
                :key="item.id"
                class="cart-item"
                :class="{ active: item.checked }"
              >
                <label class="check-box">
                  <input v-model="item.checked" type="checkbox" />
                  <span />
                </label>

                <div class="thumb" :style="{ background: item.gradient }"></div>

                <div class="item-info">
                  <h3>{{ item.name }}</h3>
                  <p class="brand">{{ item.brand }}</p>
                  <p class="variant">
                    Loại: {{ item.variant }} · Mã: {{ item.sku }}
                  </p>
                  <div class="badges">
                    <span>🌿 Organic</span>
                    <span class="cold">❄️ Bảo quản lạnh</span>
                  </div>
                  <p v-if="item.lowStock" class="low">
                    ⚠️ Chỉ còn {{ item.lowStock }} sản phẩm
                  </p>

                  <div class="qty-row">
                    <button
                      type="button"
                      :disabled="item.qty <= 1"
                      @click="changeQty(item.id, -1)"
                    >
                      -
                    </button>
                    <strong :class="{ bump: qtyBumpId === item.id }">{{
                      item.qty
                    }}</strong>
                    <button type="button" @click="changeQty(item.id, 1)">
                      +
                    </button>
                  </div>
                </div>

                <div class="price-col">
                  <p v-if="item.originalPrice" class="old">
                    {{ format(item.originalPrice) }}đ
                  </p>
                  <p class="new">{{ format(item.price) }}đ</p>
                  <small>= {{ format(item.price * item.qty) }}đ</small>
                </div>

                <div class="remove-col">
                  <button
                    type="button"
                    class="trash"
                    @click="toggleRemoveAsk(item.id)"
                  >
                    🗑
                  </button>
                  <div v-if="removeAskId === item.id" class="confirm-pop">
                    <p>Xóa?</p>
                    <div>
                      <button type="button" @click="removeAskId = null">
                        Hủy
                      </button>
                      <button
                        type="button"
                        class="danger"
                        @click="removeItem(item.id)"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </TransitionGroup>

            <!-- <section class="saved-wrap">
              <button
                type="button"
                class="saved-head"
                @click="showSaved = !showSaved"
              >
                <span>🔖 Đã lưu để mua sau ({{ savedItems.length }})</span>
                <span :class="{ rotate: showSaved }">⌄</span>
              </button>
              <div v-if="showSaved" class="saved-list">
                <article
                  v-for="item in savedItems"
                  :key="item.id"
                  class="saved-item"
                >
                  <div
                    class="thumb sm"
                    :style="{ background: item.gradient }"
                  />
                  <div>
                    <h4>{{ item.name }}</h4>
                    <p>{{ format(item.price) }}đ</p>
                  </div>
                  <button type="button" @click="moveToCart(item.id)">
                    Thêm vào giỏ
                  </button>
                </article>
              </div>
            </section> -->
          </div>

          <!-- RIGHT summary -->
          <aside class="summary-card">
            <h3>Tóm Tắt Đơn Hàng</h3>
            <div class="sum-row">
              <span>Tạm tính:</span><strong>{{ format(subtotal) }}đ</strong>
            </div>
            <div class="sum-row">
              <span>Phí giao hàng:</span
              ><strong :class="{ free: shippingFee === 0 }">{{
                shippingFee === 0 ? "🎉 Miễn phí" : `${format(shippingFee)}đ`
              }}</strong>
            </div>
            <div class="sum-row">
              <span>Giảm giá voucher:</span
              ><strong class="discount">-{{ format(voucherDiscount) }}đ</strong>
            </div>
            <div class="sum-row total" :class="{ pulse: totalPulse }">
              <span>TỔNG CỘNG:</span><strong>{{ format(grandTotal) }}đ</strong>
            </div>

            <div class="free-ship">
              <p v-if="shippingFee > 0">
                Mua thêm {{ format(Math.max(0, freeShipTarget - subtotal)) }}đ
                để miễn phí vận chuyển! 🚚
              </p>
              <p v-else>🎉 Bạn được miễn phí vận chuyển!</p>
              <div class="bar">
                <span :style="{ width: `${freeShipPercent}%` }" />
                <template v-if="shippingFee === 0">
                  <i v-for="n in 4" :key="n" :style="{ '--i': `${n}` }" />
                </template>
              </div>
            </div>

            <div class="voucher-box">
              <label>Mã giảm giá / Voucher</label>
              <div class="voucher-row">
                <input
                  v-model="voucherInput"
                  type="text"
                  placeholder="Nhập mã voucher"
                  :class="{
                    ok: voucherState === 'ok',
                    error: voucherState === 'error',
                  }"
                />
                <button type="button" @click="applyVoucher">Áp dụng</button>
              </div>
              <small v-if="voucherState === 'ok'" class="ok-text"
                >✓ Giảm 30.000đ</small
              >
              <small v-if="voucherState === 'error'" class="error-text"
                >Mã không hợp lệ</small
              >
              <NuxtLink :to="ROUTES.VOUCHERS">Xem mã của tôi</NuxtLink>
            </div>

            <div class="eta-card">🚴 Dự kiến giao: Hôm nay 14:00 - 18:00</div>

            <button
              type="button"
              class="checkout-btn"
              :disabled="loadingCheckout"
              @click="checkoutNow"
            >
              <span v-if="loadingCheckout" class="spin" />
              Đặt hàng ngay →
            </button>

            <div class="trust-row">
              <span>🔒 Thanh toán an toàn SSL</span>
              <span>🔄 Đổi trả dễ dàng 24h</span>
              <span>🚚 Giao hàng nhanh 2h</span>
            </div>

            <div class="pay-icons">
              <span>VISA</span><span>Master</span><span>Momo</span
              ><span>VNPay</span><span>ZaloPay</span><span>COD</span>
            </div>
          </aside>
        </section>

        <!-- Suggestion section -->
        <section class="suggest-wrap">
          <h3>🔥 Thường Được Mua Cùng</h3>
          <div class="suggest-row">
            <article
              v-for="item in suggestItems"
              :key="item.id"
              class="suggest-card"
            >
              <div
                class="thumb-square"
                :style="{ background: item.gradient }"
              ></div>
              <h4>{{ item.name }}</h4>
              <p>
                <strong>{{ format(item.price) }}đ</strong>
                <span>{{ format(item.originalPrice) }}đ</span>
              </p>
              <button type="button" @click="quickAdd(item)">+</button>
            </article>
          </div>
        </section>
      </template>

      <!-- EMPTY state -->
      <section v-else class="empty-state">
        <svg viewBox="0 0 120 120" class="empty-svg">
          <path
            d="M20 26h18l8 48h44l10-34H40"
            fill="none"
            stroke="#F97316"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="52" cy="90" r="8" fill="#F97316" />
          <circle cx="84" cy="90" r="8" fill="#F97316" />
        </svg>
        <h2>Giỏ hàng trống trơn...</h2>
        <p>Hãy khám phá ngay kho thực phẩm tươi ngon!</p>
        <NuxtLink :to="ROUTES.HOME" class="shop-btn">🛒 Mua sắm ngay</NuxtLink>
        <!-- <NuxtLink :to="ROUTES.PROFILE" class="fav-link"
          >Xem sản phẩm yêu thích của bạn</NuxtLink
        > -->
      </section>
    </div>

    <Transition name="float-bar">
      <div v-if="showMobileFloat && items.length" class="mobile-float-summary">
        <div>
          <strong
            >{{ selectedCount }} sản phẩm · {{ format(grandTotal) }}đ</strong
          >
        </div>
        <button type="button" @click="checkoutNow">Đặt hàng</button>
      </div>
    </Transition>

    <Transition name="toast">
      <div v-if="toastText" class="local-toast">{{ toastText }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { ROUTES } from "~/constants/routes";

type CartRow = {
  id: number;
  checked: boolean;
  name: string;
  brand: string;
  variant: string;
  sku: string;
  qty: number;
  price: number;
  originalPrice?: number;
  gradient: string;
  sale?: boolean;
  lowStock?: number;
};

const items = ref<CartRow[]>([
  {
    id: 1,
    checked: true,
    name: "Cà chua bi hữu cơ Đà Lạt",
    brand: "SMARTFARM",
    variant: "500g",
    sku: "SKU001",
    qty: 2,
    price: 45000,
    originalPrice: 52000,
    gradient: "linear-gradient(135deg,#fee2e2,#fecaca)",
    sale: true,
    lowStock: 3,
  },
  {
    id: 2,
    checked: true,
    name: "Rau cải bó xôi baby",
    brand: "GREEN LIFE",
    variant: "300g",
    sku: "SKU002",
    qty: 1,
    price: 39000,
    gradient: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
  },
  {
    id: 3,
    checked: true,
    name: "Ức gà tươi fillet",
    brand: "FRESH 365",
    variant: "500g",
    sku: "SKU003",
    qty: 1,
    price: 89000,
    originalPrice: 99000,
    gradient: "linear-gradient(135deg,#fef3c7,#fde68a)",
    sale: true,
  },
  {
    id: 4,
    checked: false,
    name: "Táo Fuji nhập khẩu",
    brand: "KING FRUIT",
    variant: "1kg",
    sku: "SKU004",
    qty: 1,
    price: 125000,
    gradient: "linear-gradient(135deg,#fee2e2,#ffedd5)",
  },
  {
    id: 5,
    checked: false,
    name: "Sữa chua Hy Lạp không đường",
    brand: "DAIRY PRO",
    variant: "4 hũ",
    sku: "SKU005",
    qty: 2,
    price: 58000,
    gradient: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
  },
]);

// const savedItems = ref([
//   {
//     id: 201,
//     name: "Nho đen không hạt",
//     price: 98000,
//     gradient: "linear-gradient(135deg,#e9d5ff,#ddd6fe)",
//   },
//   {
//     id: 202,
//     name: "Khoai lang mật",
//     price: 35000,
//     gradient: "linear-gradient(135deg,#ffedd5,#fed7aa)",
//   },
// ]);

const suggestItems = [
  {
    id: 11,
    name: "Xà lách lolo",
    price: 28000,
    originalPrice: 35000,
    gradient: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
    sale: true,
  },
  {
    id: 12,
    name: "Cam vàng Mỹ",
    price: 118000,
    originalPrice: 145000,
    gradient: "linear-gradient(135deg,#fef3c7,#fcd34d)",
    sale: true,
  },
  {
    id: 13,
    name: "Cá hồi phi lê",
    price: 179000,
    originalPrice: 199000,
    gradient: "linear-gradient(135deg,#fee2e2,#fecaca)",
    sale: true,
  },
  {
    id: 14,
    name: "Bơ booth",
    price: 69000,
    originalPrice: 79000,
    gradient: "linear-gradient(135deg,#d9f99d,#bef264)",
    sale: false,
  },
  {
    id: 15,
    name: "Nấm đùi gà",
    price: 39000,
    originalPrice: 45000,
    gradient: "linear-gradient(135deg,#f3f4f6,#e5e7eb)",
    sale: true,
  },
  {
    id: 16,
    name: "Sữa hạnh nhân",
    price: 52000,
    originalPrice: 62000,
    gradient: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
    sale: true,
  },
];

const voucherInput = ref("");
const voucherState = ref<"idle" | "ok" | "error">("idle");
const removeAskId = ref<number | null>(null);
const qtyBumpId = ref<number | null>(null);
const showSaved = ref(false);
const loadingCheckout = ref(false);
const toastText = ref("");
const totalPulse = ref(false);
const showMobileFloat = ref(false);

const freeShipTarget = 150000;

const selectedItems = computed(() =>
  items.value.filter((item) => item.checked),
);
const selectedCount = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.qty, 0),
);
const allSelected = computed(
  () => items.value.length > 0 && items.value.every((item) => item.checked),
);
const subtotal = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.price * item.qty, 0),
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

const format = (n: number) => n.toLocaleString("vi-VN");

const showToast = (text: string) => {
  toastText.value = text;
  setTimeout(() => {
    toastText.value = "";
  }, 1400);
};

const toggleAll = (e: Event) => {
  const target = e.target as HTMLInputElement;
  items.value = items.value.map((item) => ({
    ...item,
    checked: target.checked,
  }));
};

const removeSelected = () => {
  items.value = items.value.filter((item) => !item.checked);
  showToast("Đã xóa các sản phẩm đã chọn");
};

const toggleRemoveAsk = (id: number) => {
  removeAskId.value = removeAskId.value === id ? null : id;
};

const removeItem = (id: number) => {
  items.value = items.value.filter((item) => item.id !== id);
  removeAskId.value = null;
  showToast("Đã xóa sản phẩm khỏi giỏ");
};

const changeQty = (id: number, delta: number) => {
  const item = items.value.find((it) => it.id === id);
  if (!item) return;
  const next = item.qty + delta;
  if (next < 1) return;
  item.qty = next;
  qtyBumpId.value = id;
  setTimeout(() => {
    qtyBumpId.value = null;
  }, 250);
};

// const moveToCart = (id: number) => {
//   const idx = savedItems.value.findIndex((it) => it.id === id);
//   if (idx < 0) return;
//   const item = savedItems.value[idx];
//   if (!item) return;
//   items.value.unshift({
//     id: Date.now(),
//     checked: true,
//     name: item.name,
//     brand: "SMARTFOOD",
//     variant: "500g",
//     sku: "SKU-SAVED",
//     qty: 1,
//     price: item.price,
//     gradient: item.gradient,
//   });
//   savedItems.value.splice(idx, 1);
//   showToast("Đã chuyển sản phẩm vào giỏ");
// };

const applyVoucher = () => {
  const code = voucherInput.value.trim().toUpperCase();
  if (["SMART30", "SALE30"].includes(code)) {
    voucherState.value = "ok";
    return;
  }
  voucherState.value = "error";
};

const checkoutNow = () => {
  loadingCheckout.value = true;
  setTimeout(() => {
    loadingCheckout.value = false;
    showToast("Đang xử lý đơn hàng...");
  }, 1000);
};

const quickAdd = (item: (typeof suggestItems)[number]) => {
  items.value.push({
    id: Date.now(),
    checked: true,
    name: item.name,
    brand: "SMARTFOOD",
    variant: "500g",
    sku: "SKU-ADD",
    qty: 1,
    price: item.price,
    originalPrice: item.originalPrice,
    gradient: item.gradient,
    sale: item.sale,
  });
  showToast(`Đã thêm ${item.name}`);
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
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
.cart-page {
  --primary: #f97316;
  --secondary: #16a34a;
  --orange-soft: #fff7ed;
  --green-soft: #f0fdf4;
  --text: #111827;
  --muted: #6b7280;
  --danger: #ef4444;
  background: #f8fafc;
  min-height: 100vh;
  color: var(--text);
  padding-bottom: 90px;
}

.container {
  width: min(1200px, 92vw);
  margin: 0 auto;
  padding-top: 24px;
}

.breadcrumb {
  display: flex;
  gap: 8px;
  color: var(--muted);
  font-size: 13px;
}

.breadcrumb a {
  color: #4b5563;
}

.head-row {
  margin-top: 10px;
}

.head-row h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
}

.head-row span {
  font-size: 13px;
  border-radius: 999px;
  padding: 4px 10px;
  background: #f97316;
  color: #fff;
}

.head-mount {
  opacity: 0;
  transform: translateY(-8px);
  animation: headIn 0.4s ease forwards;
}

.stepper {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.step {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9ca3af;
}

.step b {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #f3f4f6;
}

.step.active {
  color: #c2410c;
  font-weight: 700;
}

.step.active b {
  background: #f97316;
  color: #fff;
}

.stepper i {
  flex: 1;
  height: 1px;
  border-bottom: 1px dashed #d1d5db;
}

.cart-layout {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 63% 37%;
  gap: 24px;
  align-items: start;
}

.tools-row {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.tools-row label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.danger-link {
  border: 0;
  background: transparent;
  color: #ef4444;
  font-size: 13px;
}

.sort-mini {
  color: var(--muted);
  font-size: 13px;
}

.product-list {
  display: grid;
  gap: 12px;
}

.cart-item {
  display: grid;
  grid-template-columns: 26px 80px 1fr auto 40px;
  gap: 14px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #fff;
  padding: 16px;
  position: relative;
}

.cart-item.active {
  border-color: #fdba74;
}

.check-box {
  display: grid;
  place-items: center;
}

.check-box input {
  display: none;
}

.check-box span {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.check-box input:checked + span {
  background: #f97316;
  border-color: #f97316;
  box-shadow: inset 0 0 0 3px #fff;
}

.thumb {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  position: relative;
}

.thumb small {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
}

.item-info h3 {
  margin: 0;
  font-size: 16px;
}

.item-info h3:hover {
  color: #ea580c;
}

.brand,
.variant {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
}

.badges {
  margin-top: 8px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.badges span {
  border-radius: 999px;
  font-size: 11px;
  padding: 3px 8px;
  background: #f0fdf4;
  color: #166534;
}

.badges .cold {
  background: #eff6ff;
  color: #1d4ed8;
}

.low {
  margin: 8px 0 0;
  color: #ef4444;
  font-size: 12px;
}

.qty-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-row button {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #fff;
}

.qty-row button:hover:not(:disabled) {
  background: #f97316;
  border-color: #f97316;
  color: #fff;
}

.qty-row strong {
  min-width: 40px;
  text-align: center;
}

.qty-row strong.bump {
  animation: qtyPop 0.3s ease;
}

.price-col {
  text-align: right;
}

.old {
  margin: 0;
  color: var(--muted);
  text-decoration: line-through;
  font-size: 13px;
}

.new {
  margin: 4px 0 0;
  color: #ea580c;
  font-size: 22px;
  font-weight: 800;
}

.price-col small {
  color: var(--muted);
}

.remove-col {
  position: relative;
}

.trash {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #9ca3af;
}

.trash:hover {
  color: #ef4444;
  background: #fef2f2;
}

.confirm-pop {
  position: absolute;
  right: 0;
  top: 34px;
  width: 130px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.12);
  padding: 8px;
  z-index: 5;
}

.confirm-pop p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.confirm-pop div {
  margin-top: 6px;
  display: flex;
  gap: 6px;
}

.confirm-pop button {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  padding: 5px 8px;
  font-size: 12px;
}

.confirm-pop .danger {
  border-color: #ef4444;
  color: #ef4444;
}

.saved-wrap {
  margin-top: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
}

.saved-head {
  width: 100%;
  border: 0;
  background: transparent;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
}

.saved-head span:last-child {
  transition: transform 0.2s ease;
}

.saved-head span:last-child.rotate {
  transform: rotate(180deg);
}

.saved-list {
  border-top: 1px solid #f3f4f6;
  padding: 10px;
  display: grid;
  gap: 10px;
}

.saved-item {
  display: grid;
  grid-template-columns: 50px 1fr auto;
  gap: 10px;
  align-items: center;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  padding: 8px;
}

.thumb.sm {
  width: 50px;
  height: 50px;
}

.saved-item h4,
.saved-item p {
  margin: 0;
}

.saved-item p {
  color: #ea580c;
  font-weight: 700;
}

.saved-item button {
  border: 1px solid #f97316;
  border-radius: 999px;
  color: #f97316;
  background: #fff;
  padding: 7px 10px;
}

.summary-card {
  position: sticky;
  top: 96px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #fff;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
}

.summary-card h3 {
  margin: 0 0 12px;
}

.sum-row {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  color: #374151;
}

.sum-row strong.free {
  color: #16a34a;
}

.sum-row .discount {
  color: #16a34a;
}

.sum-row.total {
  border-top: 1px solid #f3f4f6;
  padding-top: 10px;
  font-size: 20px;
  font-weight: 900;
  color: #ea580c;
}

.sum-row.total.pulse {
  animation: totalPulse 0.3s ease;
}

.free-ship {
  margin-top: 12px;
}

.free-ship p {
  margin: 0;
  font-size: 13px;
  color: #4b5563;
}

.bar {
  margin-top: 8px;
  height: 6px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
  position: relative;
}

.bar span {
  display: block;
  height: 100%;
  background: #f97316;
  transition: width 0.5s ease;
}

.bar i {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  top: -3px;
  left: calc(var(--i) * 22%);
  background: #22c55e;
  animation: confetti 0.6s ease-out infinite;
}

.voucher-box {
  margin-top: 14px;
}

.voucher-box label {
  font-size: 13px;
  font-weight: 700;
}

.voucher-row {
  margin-top: 7px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.voucher-row input {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
}

.voucher-row input.ok {
  border-color: #16a34a;
}

.voucher-row input.error {
  border-color: #ef4444;
  animation: shake 0.25s ease;
}

.voucher-row button {
  border: 0;
  border-radius: 10px;
  background: #f97316;
  color: #fff;
  padding: 0 12px;
  font-weight: 700;
}

.ok-text {
  color: #16a34a;
}

.error-text {
  margin-top: 4px;
  display: block;
  color: #ef4444;
}

.voucher-box a {
  display: inline-block;
  margin-top: 6px;
  color: #f97316;
  font-size: 13px;
}

.eta-card {
  margin-top: 12px;
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #166534;
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
}

.checkout-btn {
  width: 100%;
  margin-top: 14px;
  height: 52px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  background: linear-gradient(90deg, #f97316, #ea580c);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 22px rgba(249, 115, 22, 0.32);
}

.checkout-btn:active {
  transform: scale(0.98);
}

.spin {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

.trust-row {
  margin-top: 10px;
  display: grid;
  gap: 4px;
  color: #6b7280;
  font-size: 12px;
}

.pay-icons {
  margin-top: 10px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.pay-icons span {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 11px;
  color: #9ca3af;
}

.pay-icons span:hover {
  filter: grayscale(0);
  color: #374151;
}

.suggest-wrap {
  margin-top: 24px;
}

.suggest-wrap h3 {
  margin: 0 0 10px;
}

.suggest-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
}

.suggest-card {
  min-width: 180px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 10px;
  scroll-snap-align: start;
}

.thumb-square {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  position: relative;
}

.thumb-square small {
  position: absolute;
  top: 6px;
  left: 6px;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
}

.suggest-card h4 {
  margin: 8px 0 0;
  min-height: 40px;
  font-size: 14px;
}

.suggest-card p {
  margin: 6px 0 0;
}

.suggest-card strong {
  color: #ea580c;
}

.suggest-card span {
  color: #9ca3af;
  text-decoration: line-through;
  margin-left: 4px;
  font-size: 13px;
}

.suggest-card button {
  margin-top: 8px;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  background: #f97316;
  color: #fff;
  font-size: 18px;
}

.empty-state {
  min-height: 60vh;
  display: grid;
  place-items: center;
  text-align: center;
}

.empty-svg {
  width: 120px;
  animation: sway 3s infinite ease-in-out;
}

.empty-state h2 {
  margin: 0;
}

.empty-state p {
  margin: 6px 0 0;
  color: #6b7280;
}

.shop-btn {
  margin-top: 10px;
  border-radius: 999px;
  background: #f97316;
  color: #fff;
  padding: 10px 18px;
  font-weight: 700;
}

.fav-link {
  margin-top: 8px;
  color: #16a34a;
}

.mobile-float-summary {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 35;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -8px 22px rgba(15, 23, 42, 0.12);
  padding: 12px 16px;
  display: none;
  justify-content: space-between;
  align-items: center;
}

.mobile-float-summary button {
  border: 0;
  border-radius: 999px;
  background: #f97316;
  color: #fff;
  font-weight: 700;
  padding: 10px 18px;
}

.local-toast {
  position: fixed;
  right: 20px;
  bottom: 90px;
  z-index: 45;
  border-radius: 10px;
  background: #111827;
  color: #fff;
  padding: 10px 14px;
}

.slide-list-enter-active,
.slide-list-leave-active {
  transition: all 0.3s ease;
}

.slide-list-enter-from,
.slide-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

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

@keyframes totalPulse {
  50% {
    transform: scale(1.03);
    color: #f97316;
  }
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shake {
  25% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
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

@keyframes headIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .summary-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 24px 64px 1fr;
    padding: 12px;
  }

  .thumb {
    width: 64px;
    height: 64px;
  }

  .price-col,
  .remove-col {
    grid-column: 3;
  }

  .remove-col {
    justify-self: end;
  }

  .tools-row {
    flex-wrap: wrap;
  }

  .mobile-float-summary {
    display: flex;
  }
}
</style>
