<template>
  <div
    class="min-h-screen text-gray-900"
    style="background: linear-gradient(180deg, #fffdf9 0%, #ffffff 40%)"
  >
    <!-- ══════════ HERO ══════════ -->
    <section
      class="relative min-h-[260px] overflow-hidden grid place-items-center"
      style="background: linear-gradient(135deg, #f97316, #ea580c, #dc2626)"
    >
      <!-- Confetti -->
      <div class="absolute inset-0" aria-hidden="true">
        <span
          v-for="shape in confettiShapes"
          :key="shape.id"
          class="absolute opacity-15"
          :class="[
            shape.type === 'dot'
              ? 'w-[10px] h-[10px] rounded-full'
              : shape.type === 'diamond'
                ? 'w-[10px] h-[10px] rotate-45'
                : 'w-3 h-3 star-shape',
            'animate-floatRotate',
          ]"
          :style="{
            left: `${shape.left}%`,
            top: `${shape.top}%`,
            animationDelay: `${shape.delay}s`,
            animationDuration: `${shape.duration}s`,
            backgroundColor: shape.color,
          }"
        />
      </div>

      <!-- Content -->
      <div class="relative z-[2] text-center text-white">
        <div class="w-16 mx-auto mb-3 mount-0 animate-swing" aria-hidden="true">
          <svg viewBox="0 0 64 64" role="img">
            <path
              d="M8 20a6 6 0 0 1 6-6h34l8 8v22a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V20z"
              fill="#fff"
              opacity="0.95"
            />
            <circle cx="20" cy="32" r="4" fill="#EA580C" />
            <path
              d="M26 29h20M26 35h12"
              stroke="#EA580C"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <h1
          class="m-0 font-black leading-[1.1] tracking-[-0.03em] mount-1"
          style="
            font-size: clamp(2rem, 4vw, 38px);
            text-shadow: 0 8px 26px rgba(0,0,0,0.26);
          "
        >
          Kho Mã Giảm Giá
        </h1>
        <p class="mt-[10px] mb-0 opacity-80 mount-2">
          Săn deal hot - Tiết kiệm mỗi ngày cùng SmartFood
        </p>

        <div class="mt-[14px] mount-3" aria-live="polite">
          <p class="mb-2 mt-0 font-semibold">
            Flash Sale hôm nay: {{ flashCompactText }}
          </p>
          <!-- Progress bar -->
          <div
            class="mx-auto h-2 rounded-full overflow-hidden"
            style="width: min(440px, 92vw); background: rgba(255,255,255,0.22)"
          >
            <span
              class="block h-full w-0 transition-[width] duration-[400ms] ease-out"
              style="background: linear-gradient(90deg, #fde047, #facc15, #86efac)"
              :style="{ width: `${flashProgress}%` }"
            />
          </div>
          <!-- Stats -->
          <div class="mt-[10px] grid grid-cols-3 gap-2">
            <article
              class="rounded-[10px] p-2 grid"
              style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.2)"
            >
              <strong class="text-[1.1rem]">{{ visibleCoupons.length }}</strong>
              <span class="text-[0.76rem] opacity-[0.86]">Mã đang hoạt động</span>
            </article>
            <article
              class="rounded-[10px] p-2 grid"
              style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.2)"
            >
              <strong class="text-[1.1rem]">0đ</strong>
              <span class="text-[0.76rem] opacity-[0.86]">Freeship nội thành</span>
            </article>
            <article
              class="rounded-[10px] p-2 grid"
              style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.2)"
            >
              <strong class="text-[1.1rem]">50%</strong>
              <span class="text-[0.76rem] opacity-[0.86]">Mức giảm tối đa</span>
            </article>
          </div>
          <p
            class="mt-[10px] mx-auto w-fit rounded-full px-3 py-[5px] text-[0.8rem] font-bold text-[#9a3412]"
            style="background: #fde047"
          >
            🔥 Cập nhật mã mới mỗi thứ 2 &amp; thứ 6
          </p>
        </div>
      </div>
    </section>

    <!-- ══════════ FILTER STICKY ══════════ -->
    <section
      class="sticky top-16 z-30 border-b border-gray-200 bg-white"
      style="box-shadow: 0 4px 10px rgba(15,23,42,0.06)"
    >
      <div class="w-[min(1120px,92vw)] mx-auto">
        <div class="flex items-center gap-[14px] py-3 flex-wrap lg:flex-nowrap">
          <!-- Search -->
          <label
            class="flex items-center gap-2 flex-1 border border-gray-200 rounded-full px-[14px] h-11 focus-within:border-orange-500 focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.16)] transition-shadow"
            aria-label="Tìm mã giảm giá"
          >
            <span class="text-orange-500">🔎</span>
            <input
              v-model="searchText"
              type="text"
              placeholder="Tìm mã giảm giá..."
              class="border-0 outline-none w-full text-[0.95rem] bg-transparent"
            />
          </label>

          <!-- Tabs -->
          <div
            class="flex gap-2 order-3 w-full lg:order-none lg:w-auto overflow-x-auto pb-[6px] lg:pb-0"
            role="tablist"
            aria-label="Lọc mã"
          >
            <button
              v-for="tab in filterTabs"
              :key="tab.key"
              type="button"
              class="border-0 rounded-full px-[14px] py-[10px] font-bold cursor-pointer whitespace-nowrap transition-colors duration-200"
              :class="
                activeTab === tab.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              "
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Sort -->
          <label
            class="border border-gray-200 rounded-full h-11 flex items-center px-[14px] gap-2 text-[0.92rem] w-full lg:w-auto"
            aria-label="Sắp xếp mã giảm giá"
          >
            <span>Sắp xếp:</span>
            <select
              v-model="sortKey"
              class="border-0 outline-none font-bold text-gray-900 bg-transparent"
            >
              <option value="best">Giảm nhiều nhất</option>
              <option value="latest">Mới cập nhật</option>
              <option value="expiring">Sắp hết hạn</option>
            </select>
          </label>
        </div>
        <p class="mb-3 mt-0 text-green-700 text-[0.85rem] font-bold">
          Tìm thấy {{ visibleCoupons.length }} mã khả dụng
        </p>
      </div>
    </section>

    <!-- ══════════ MAIN ══════════ -->
    <main class="w-[min(1120px,92vw)] mx-auto py-6 pb-14 grid gap-7">

      <!-- Featured -->
      <section>
        <div class="flex items-center gap-[10px] mb-3">
          <h2 class="m-0 text-[1.4rem]">⭐ Mã Nổi Bật Hôm Nay</h2>
          <span
            class="px-[10px] py-[5px] rounded-full bg-red-500 text-white text-[0.8rem] font-extrabold animate-pulse-scale"
          >HOT</span>
        </div>

        <div
          class="flex gap-[14px] overflow-x-auto pb-2"
          style="scroll-snap-type: x mandatory"
        >
          <article
            v-for="coupon in featuredCoupons"
            :key="coupon.id"
            class="relative min-w-[340px] rounded-[18px] overflow-hidden scroll-snap-start"
            style="
              background: linear-gradient(135deg, #f97316, #ea580c);
              box-shadow: 0 16px 30px rgba(234,88,12,0.3);
            "
          >
            <!-- Ribbon -->
            <span
              class="absolute top-[14px] right-[-34px] rotate-[38deg] font-black text-[0.7rem] px-[34px] py-1 text-red-700"
              style="background: #fde047"
              >FEATURED</span
            >
            <!-- Top -->
            <div class="p-[18px] text-white">
              <p class="m-0 opacity-[0.92]">SmartFood Deals</p>
              <p class="mt-2 mb-0 text-[2.2rem] leading-none font-black">
                {{ coupon.valueLabel }}
              </p>
              <p class="mt-2 mb-0 opacity-[0.86]">{{ coupon.condition }}</p>
            </div>
            <!-- Dashed divider with notches -->
            <div class="featured-divider" />
            <!-- Bottom -->
            <div class="p-4 bg-orange-50">
              <div
                class="font-mono text-[1.2rem] font-extrabold tracking-[0.1em] text-orange-700 border-2 border-dashed border-orange-400 rounded-[10px] bg-[#fff2df] p-[10px] text-center"
              >
                {{ coupon.code }}
              </div>
              <span
                class="inline-block mt-[10px] rounded-full px-[10px] py-1 text-[0.78rem] font-bold bg-red-500 text-white"
              >⏰ {{ coupon.expireText }}</span>
              <button
                type="button"
                class="mt-3 w-full border-0 rounded-xl text-white h-11 font-extrabold relative overflow-hidden cursor-pointer transition-colors duration-300"
                :class="copiedCode === coupon.code ? 'bg-green-600' : 'bg-orange-700'"
                @click="copyCode(coupon.code)"
              >
                <Transition name="copy-slide" mode="out-in">
                  <span
                    :key="copiedCode === coupon.code ? 'copied' : 'default'"
                    class="flex items-center justify-center gap-2"
                  >
                    <template v-if="copiedCode === coupon.code">
                      <svg class="w-[18px] h-[18px] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      ĐÃ SAO CHÉP
                    </template>
                    <template v-else>SAO CHÉP MÃ</template>
                  </span>
                </Transition>
                <span
                  v-if="burstCode === coupon.code"
                  v-for="n in 6"
                  :key="`${coupon.code}-${n}`"
                  class="burst"
                  :style="{ '--i': `${n}` }"
                />
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- All coupons -->
      <section>
        <div class="flex items-center gap-[10px] mb-3">
          <h2 class="m-0 text-[1.4rem]">🎟️ Tất Cả Mã Giảm Giá</h2>
        </div>

        <div
          class="coupon-grid"
        >
          <article
            v-for="(coupon, idx) in visibleCoupons"
            :key="coupon.id"
            class="relative overflow-hidden rounded-2xl bg-white grid border border-gray-200 coupon-card hover:-translate-y-[3px] hover:shadow-[0_12px_22px_rgba(15,23,42,0.12)] transition-[transform,box-shadow] duration-[250ms]"
            :class="[
              coupon.status === 'expired' ? 'is-expired' : '',
              coupon.status === 'used' ? 'is-used' : '',
            ]"
            style="grid-template-columns: 35% 14px 65%"
            :style="{ animationDelay: `${idx * 50}ms` }"
          >
            <!-- Left colored column -->
            <div
              class="p-[14px] text-white grid content-center justify-items-center text-center"
              :style="{
                background:
                  coupon.type === 'money' || coupon.type === 'percent'
                    ? 'linear-gradient(140deg, #f97316, #ea580c)'
                    : 'linear-gradient(140deg, #22c55e, #16a34a)',
              }"
            >
              <p class="m-0 text-2xl font-black">{{ coupon.valueLabel }}</p>
              <p class="my-1 mx-0">{{ coupon.icon }}</p>
              <p class="m-0 text-[0.7rem] font-bold tracking-[0.06em]">
                {{ coupon.typeLabel }}
              </p>
            </div>

            <!-- Dashed vertical divider with notches -->
            <div class="coupon-divider vertical-divider" />

            <!-- Right info column -->
            <div class="p-3 px-4 relative">
              <div
                class="w-fit rounded-lg px-[10px] py-[6px] border border-dashed border-orange-400 bg-orange-50 font-mono font-extrabold"
              >
                {{ coupon.code }}
              </div>
              <p class="mt-2 mb-0 text-gray-500 text-[0.82rem]">
                {{ coupon.condition }}
              </p>
              <p class="mt-2 mb-0 text-gray-500 text-[0.82rem]">
                ⏰ {{ coupon.expireDate }}
              </p>

              <div class="mt-2">
                <p class="m-0 text-gray-500 text-[0.82rem]">
                  Đã dùng {{ coupon.usedCount }}/{{ coupon.totalCount }} lượt
                </p>
                <div class="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <span
                    class="block h-full transition-[width] duration-[800ms] ease-out"
                    style="background: linear-gradient(90deg, #f97316, #ea580c)"
                    :style="{
                      width: progressVisible
                        ? `${usagePercent(coupon)}%`
                        : '0%',
                    }"
                  />
                </div>
              </div>

              <button
                type="button"
                class="mt-[10px] rounded-[10px] h-[34px] font-bold w-full cursor-pointer transition-colors duration-300 relative overflow-hidden"
                :class="
                  copiedCode === coupon.code
                    ? 'bg-green-600 border border-green-600 text-white'
                    : 'border border-orange-500 text-orange-500 bg-transparent'
                "
                @click="copyCode(coupon.code)"
              >
                <Transition name="copy-slide" mode="out-in">
                  <span
                    :key="copiedCode === coupon.code ? 'copied' : 'default'"
                    class="flex items-center justify-center gap-1 text-[0.82rem]"
                  >
                    <template v-if="copiedCode === coupon.code">
                      <svg class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      Đã sao chép!
                    </template>
                    <template v-else>Sao chép</template>
                  </span>
                </Transition>
              </button>

              <span
                v-if="coupon.totalCount - coupon.usedCount <= 10"
                class="mt-2 inline-block rounded-full px-2 py-1 bg-red-500 text-white text-[0.7rem] font-bold animate-pulse-scale"
              >
                🔥 Còn {{ coupon.totalCount - coupon.usedCount }} lượt
              </span>
            </div>

            <!-- Status overlay -->
            <div
              v-if="coupon.status !== 'active'"
              class="absolute inset-0 bg-white/40 grid place-items-center"
            >
              <span
                class="border-[3px] font-black tracking-[0.08em] px-[14px] py-2 bg-white/95 animate-stamp"
                :class="
                  coupon.status === 'used'
                    ? 'border-green-600 text-green-600'
                    : 'border-red-600 text-red-600'
                "
                style="transform: rotate(15deg)"
              >{{
                coupon.status === "expired" ? "HẾT HẠN" : "ĐÃ DÙNG"
              }}</span>
            </div>
          </article>
        </div>
      </section>

      <!-- Guide -->
      <section class="bg-orange-50 rounded-[18px] p-6">
        <h3 class="text-center m-0 mb-[18px] text-[1.3rem]">Hướng Dẫn Sử Dụng Mã</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <article
            v-for="step in guideSteps"
            :key="step.id"
            class="bg-white rounded-[14px] p-[14px] text-center relative hover:shadow-[0_0_0_2px_rgba(249,115,22,0.3)] transition-shadow duration-200"
          >
            <div
              class="w-[30px] h-[30px] mx-auto rounded-full grid place-items-center bg-orange-500 text-white font-extrabold"
            >
              {{ step.id }}
            </div>
            <p class="my-2 mx-0 text-[2rem]">{{ step.icon }}</p>
            <h4 class="m-0">{{ step.title }}</h4>
            <p class="mt-[6px] mb-0 text-gray-500 text-[0.85rem]">
              {{ step.desc }}
            </p>
          </article>
        </div>
      </section>

      <!-- Notes / Accordion -->
      <section class="rounded-[18px] border border-gray-200 p-5">
        <h3 class="text-center m-0 mb-[18px] text-[1.3rem]">
          Điều Kiện &amp; Lưu Ý
        </h3>
        <div class="grid gap-2">
          <article
            v-for="(item, idx) in noteItems"
            :key="item.title"
            class="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              type="button"
              class="w-full flex justify-between items-center border-0 bg-white px-[14px] py-3 font-bold cursor-pointer"
              @click="toggleNote(idx)"
            >
              <span>{{ item.title }}</span>
              <span>{{ openedNotes.has(idx) ? "−" : "+" }}</span>
            </button>
            <p
              v-if="openedNotes.has(idx)"
              class="m-0 px-[14px] pb-3 text-gray-500 leading-[1.6]"
            >
              {{ item.body }}
            </p>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

type CouponType = "freeship" | "percent" | "money" | "product";
type CouponStatus = "active" | "expired" | "used";

type Coupon = {
  id: number;
  code: string;
  type: CouponType;
  typeLabel: string;
  valueLabel: string;
  condition: string;
  expireDate: string;
  expireText: string;
  totalCount: number;
  usedCount: number;
  status: CouponStatus;
  featured?: boolean;
  updatedAt: number;
  icon: string;
  amount: number;
};

const filterTabs = [
  { key: "all", label: "Tất cả" },
  { key: "freeship", label: "Freeship" },
  { key: "percent", label: "Giảm %" },
  { key: "money", label: "Giảm tiền" },
  { key: "product", label: "Sản phẩm cụ thể" },
] as const;

const guideSteps = [
  {
    id: 1,
    icon: "🔍",
    title: "Tìm mã phù hợp",
    desc: "Chọn mã có điều kiện khớp giỏ hàng hiện tại của bạn.",
  },
  {
    id: 2,
    icon: "📋",
    title: "Sao chép mã",
    desc: "Nhấn nút sao chép để lưu mã vào clipboard trong 1 chạm.",
  },
  {
    id: 3,
    icon: "🛒",
    title: "Dán khi thanh toán",
    desc: "Dán mã vào ô voucher ở bước checkout để nhận ưu đãi.",
  },
];

const noteItems = [
  {
    title: "Mỗi mã chỉ dùng được 1 lần/tài khoản",
    body: "Sau khi áp dụng thành công, mã sẽ không thể sử dụng lại trên cùng tài khoản.",
  },
  {
    title: "Không áp dụng đồng thời 2 mã giảm giá",
    body: "Hệ thống chỉ ghi nhận một mã tối ưu nhất cho mỗi đơn hàng tại cùng thời điểm.",
  },
  {
    title: "Mã có thể hết lượt trước ngày hết hạn",
    body: "Một số mã giới hạn số lượt nên có thể dừng sớm khi đạt ngưỡng phát hành.",
  },
];

const coupons = ref<Coupon[]>([
  {
    id: 1,
    code: "SMART50K",
    type: "money",
    typeLabel: "GIẢM TIỀN",
    valueLabel: "GIẢM 50K",
    condition: "Đơn tối thiểu 200.000đ",
    expireDate: "08/04/2026",
    expireText: "Còn 2 ngày",
    totalCount: 200,
    usedCount: 185,
    status: "active",
    featured: true,
    updatedAt: 4,
    icon: "💰",
    amount: 50000,
  },
  {
    id: 2,
    code: "SALE30P",
    type: "percent",
    typeLabel: "GIẢM %",
    valueLabel: "GIẢM 30%",
    condition: "Tối đa 90.000đ - đơn từ 250.000đ",
    expireDate: "10/04/2026",
    expireText: "Còn 4 ngày",
    totalCount: 180,
    usedCount: 102,
    status: "active",
    featured: true,
    updatedAt: 6,
    icon: "%",
    amount: 30,
  },
  {
    id: 3,
    code: "SHIP0K",
    type: "freeship",
    typeLabel: "FREESHIP",
    valueLabel: "0Đ SHIP",
    condition: "Đơn từ 99.000đ khu vực nội thành",
    expireDate: "07/04/2026",
    expireText: "Còn 1 ngày",
    totalCount: 300,
    usedCount: 292,
    status: "active",
    featured: true,
    updatedAt: 5,
    icon: "🚚",
    amount: 25000,
  },
  {
    id: 4,
    code: "RAUCU25",
    type: "product",
    typeLabel: "SẢN PHẨM",
    valueLabel: "GIẢM 25K",
    condition: "Cho danh mục rau củ hữu cơ",
    expireDate: "12/04/2026",
    expireText: "Còn 6 ngày",
    totalCount: 120,
    usedCount: 62,
    status: "active",
    updatedAt: 3,
    icon: "🥦",
    amount: 25000,
  },
  {
    id: 5,
    code: "THIT15",
    type: "percent",
    typeLabel: "GIẢM %",
    valueLabel: "GIẢM 15%",
    condition: "Ngành thịt cá - tối đa 70.000đ",
    expireDate: "11/04/2026",
    expireText: "Còn 5 ngày",
    totalCount: 240,
    usedCount: 220,
    status: "active",
    updatedAt: 2,
    icon: "%",
    amount: 15,
  },
  {
    id: 6,
    code: "ORDER40",
    type: "money",
    typeLabel: "GIẢM TIỀN",
    valueLabel: "GIẢM 40K",
    condition: "Đơn tối thiểu 300.000đ",
    expireDate: "14/04/2026",
    expireText: "Còn 8 ngày",
    totalCount: 160,
    usedCount: 40,
    status: "active",
    updatedAt: 1,
    icon: "💰",
    amount: 40000,
  },
  {
    id: 7,
    code: "APPLE20",
    type: "product",
    typeLabel: "SẢN PHẨM",
    valueLabel: "GIẢM 20K",
    condition: "Áp dụng cho trái cây nhập khẩu",
    expireDate: "09/04/2026",
    expireText: "Còn 3 ngày",
    totalCount: 110,
    usedCount: 109,
    status: "active",
    updatedAt: 7,
    icon: "🍎",
    amount: 20000,
  },
  {
    id: 8,
    code: "FASTSHIP",
    type: "freeship",
    typeLabel: "FREESHIP",
    valueLabel: "GIẢM 30K",
    condition: "Giảm tối đa phí ship 30.000đ",
    expireDate: "13/04/2026",
    expireText: "Còn 7 ngày",
    totalCount: 260,
    usedCount: 170,
    status: "active",
    updatedAt: 8,
    icon: "🚚",
    amount: 30000,
  },
  {
    id: 9,
    code: "NEWUSER",
    type: "money",
    typeLabel: "GIẢM TIỀN",
    valueLabel: "GIẢM 60K",
    condition: "Chỉ dành cho khách mới",
    expireDate: "02/04/2026",
    expireText: "Đã hết hạn",
    totalCount: 100,
    usedCount: 100,
    status: "expired",
    updatedAt: 9,
    icon: "💰",
    amount: 60000,
  },
  {
    id: 10,
    code: "VIPFOOD",
    type: "percent",
    typeLabel: "GIẢM %",
    valueLabel: "GIẢM 20%",
    condition: "Tối đa 120.000đ cho hội viên VIP",
    expireDate: "30/04/2026",
    expireText: "Còn 24 ngày",
    totalCount: 90,
    usedCount: 90,
    status: "used",
    updatedAt: 10,
    icon: "%",
    amount: 20,
  },
  {
    id: 11,
    code: "FRESH10",
    type: "percent",
    typeLabel: "GIẢM %",
    valueLabel: "GIẢM 10%",
    condition: "Áp dụng toàn bộ thực phẩm tươi sống",
    expireDate: "16/04/2026",
    expireText: "Còn 10 ngày",
    totalCount: 300,
    usedCount: 155,
    status: "active",
    updatedAt: 11,
    icon: "%",
    amount: 10,
  },
  {
    id: 12,
    code: "ORGANIC35",
    type: "money",
    typeLabel: "GIẢM TIỀN",
    valueLabel: "GIẢM 35K",
    condition: "Đơn từ 220.000đ - rau hữu cơ",
    expireDate: "18/04/2026",
    expireText: "Còn 12 ngày",
    totalCount: 150,
    usedCount: 68,
    status: "active",
    updatedAt: 12,
    icon: "💰",
    amount: 35000,
  },
]);

const confettiShapes = Array.from({ length: 24 }).map((_, idx) => ({
  id: idx + 1,
  left: (idx * 13) % 100,
  top: (idx * 17) % 100,
  delay: (idx % 6) * 0.35,
  duration: 4 + (idx % 5) * 0.8,
  type: ["dot", "diamond", "star"][idx % 3],
  color: ["#ffffff", "#fde047", "#86efac"][idx % 3],
}));

const activeTab = ref<(typeof filterTabs)[number]["key"]>("all");
const searchText = ref("");
const sortKey = ref<"best" | "latest" | "expiring">("best");
const copiedCode = ref("");
const burstCode = ref("");
const openedNotes = ref(new Set<number>([0]));
const flashCountdown = ref(48 * 60 * 60);
const flipKey = ref("Giờ");
const progressVisible = ref(false);

const featuredCoupons = computed(() =>
  coupons.value.filter((item) => item.featured).slice(0, 3),
);

const visibleCoupons = computed(() => {
  const query = searchText.value.trim().toLowerCase();
  let list = coupons.value.filter((coupon) => {
    const matchTab =
      activeTab.value === "all" || coupon.type === activeTab.value;
    const matchSearch =
      coupon.code.toLowerCase().includes(query) ||
      coupon.condition.toLowerCase().includes(query) ||
      coupon.valueLabel.toLowerCase().includes(query);
    return matchTab && matchSearch;
  });

  if (sortKey.value === "best") {
    list = list.sort((a, b) => b.amount - a.amount);
  }
  if (sortKey.value === "latest") {
    list = list.sort((a, b) => b.updatedAt - a.updatedAt);
  }
  if (sortKey.value === "expiring") {
    list = list.sort((a, b) => a.expireDate.localeCompare(b.expireDate));
  }

  return list;
});

const countdownUnits = computed(() => {
  const safe = Math.max(flashCountdown.value, 0);
  const days = Math.floor(safe / 86400);
  const hours = Math.floor((safe % 86400) / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;

  return [
    { label: "Ngày", value: String(days).padStart(2, "0") },
    { label: "Giờ", value: String(hours).padStart(2, "0") },
    { label: "Phút", value: String(mins).padStart(2, "0") },
    { label: "Giây", value: String(secs).padStart(2, "0") },
  ];
});

const flashCompactText = computed(
  () =>
    `${countdownUnits.value[1]?.value}:${countdownUnits.value[2]?.value}:${countdownUnits.value[3]?.value}`,
);

const flashProgress = computed(() => {
  const total = 48 * 60 * 60;
  return Math.round(((total - flashCountdown.value) / total) * 100);
});

const usagePercent = (coupon: Coupon) =>
  Math.round((coupon.usedCount / coupon.totalCount) * 100);

const toggleNote = (index: number) => {
  const next = new Set(openedNotes.value);
  if (next.has(index)) {
    next.delete(index);
  } else {
    next.add(index);
  }
  openedNotes.value = next;
};

const copyCode = async (code: string) => {
  copiedCode.value = code;
  burstCode.value = code;
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    // Trình duyệt không hỗ trợ clipboard thì vẫn hiển thị trạng thái copy.
  }

  setTimeout(() => {
    burstCode.value = "";
  }, 500);

  setTimeout(() => {
    copiedCode.value = "";
  }, 1500);
};

let flashTimer: ReturnType<typeof setInterval> | null = null;
let observer: IntersectionObserver | null = null;

onMounted(() => {
  flashTimer = setInterval(() => {
    flashCountdown.value =
      flashCountdown.value > 0 ? flashCountdown.value - 1 : 0;
    const labels = ["Ngày", "Giờ", "Phút", "Giây"];
    flipKey.value = labels[flashCountdown.value % 4] ?? "Giây";
  }, 1000);

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          progressVisible.value = true;
        }
      });
    },
    { threshold: 0.25 },
  );

  const grid = document.querySelector(".coupon-grid");
  if (grid && observer) {
    observer.observe(grid);
  }
});

onUnmounted(() => {
  if (flashTimer) {
    clearInterval(flashTimer);
  }
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
/* ── Mount animations ─────────────────────────────── */
.mount-0,
.mount-1,
.mount-2,
.mount-3 {
  opacity: 0;
  transform: translateY(14px);
  animation: heroMount 0.5s ease forwards;
}
.mount-1 { animation-delay: 0.1s; }
.mount-2 { animation-delay: 0.2s; }
.mount-3 { animation-delay: 0.3s; }

@keyframes heroMount {
  to { opacity: 1; transform: translateY(0); }
}

/* ── Confetti float ───────────────────────────────── */
@keyframes floatRotate {
  0%   { transform: translateY(0) rotate(0deg); }
  50%  { transform: translateY(-12px) rotate(15deg); }
  100% { transform: translateY(8px) rotate(-12deg); }
}
.animate-floatRotate { animation: floatRotate linear infinite; }

/* ── Hero icon swing ──────────────────────────────── */
@keyframes swing {
  0%, 100% { transform: rotate(-8deg); }
  50%       { transform: rotate(8deg); }
}
.animate-swing { animation: swing 2s ease-in-out infinite; }

/* ── Star clip-path ───────────────────────────────── */
.star-shape {
  clip-path: polygon(
    50% 0, 62% 34%, 100% 38%, 72% 59%,
    82% 100%, 50% 75%, 18% 100%, 28% 59%,
    0 38%, 38% 34%
  );
}

/* ── Coupon grid ──────────────────────────────────── */
.coupon-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

/* ── Coupon card animation ────────────────────────── */
.coupon-card {
  transform: translateY(8px);
  opacity: 0;
  animation: cardIn 0.45s ease forwards;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}
@keyframes cardIn {
  to { opacity: 1; transform: translateY(0); }
}

/* ── Featured divider with ::before/::after notches ─ */
.featured-divider {
  position: relative;
  border-top: 1px dashed rgba(255, 255, 255, 0.7);
}
.featured-divider::before,
.featured-divider::after {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  top: -9px;
}
.featured-divider::before { left: -9px; }
.featured-divider::after  { right: -9px; }

/* ── Coupon card divider notches ─────────────────── */
.vertical-divider {
  position: relative;
  border-left: 2px dashed #cbd5e1;
}
.coupon-divider::before,
.coupon-divider::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  left: -9px;
}
.coupon-divider::before { top: -8px; }
.coupon-divider::after  { bottom: -8px; }

/* ── Burst animation (copy button) ───────────────── */
.burst {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  animation: burst 0.5s ease-out forwards;
  transform: rotate(calc(var(--i) * 60deg)) translateY(-4px);
}
@keyframes burst {
  from {
    opacity: 1;
    transform: rotate(calc(var(--i) * 60deg)) translateY(-4px) scale(1);
  }
  to {
    opacity: 0;
    transform: rotate(calc(var(--i) * 60deg)) translateY(-26px) scale(0.2);
  }
}

/* ── Pulse (HOT badge & low-badge) ───────────────── */
@keyframes pulsScale {
  0%, 100% { transform: scale(1);    opacity: 1;   }
  50%       { transform: scale(1.08); opacity: 0.8; }
}
.animate-pulse-scale { animation: pulsScale 1.2s infinite; }

/* ── Stamp (status overlay) ──────────────────────── */
@keyframes stamp {
  0%, 100% { opacity: 0.85; }
  50%       { opacity: 1;    }
}
.animate-stamp { animation: stamp 1.2s ease-in-out infinite; }

/* ── Scroll snap for featured row ─────────────────── */
.scroll-snap-start { scroll-snap-align: start; }

/* ── Copy slide transition (Vue <Transition>) ─────── */
.copy-slide-enter-active {
  transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.copy-slide-leave-active {
  transition: all 0.14s ease-in;
}
.copy-slide-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.92);
}
.copy-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}
.copy-slide-enter-to,
.copy-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* ── Responsive overrides ─────────────────────────── */
@media (max-width: 1024px) {
  .coupon-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .coupon-grid {
    grid-template-columns: 1fr;
  }
}
</style>
