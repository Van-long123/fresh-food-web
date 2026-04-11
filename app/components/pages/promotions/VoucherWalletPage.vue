<template>
  <div class="voucher-page">
    <section class="hero">
      <div class="hero-confetti" aria-hidden="true">
        <span
          v-for="shape in confettiShapes"
          :key="shape.id"
          class="confetti"
          :class="shape.type"
          :style="{
            left: `${shape.left}%`,
            top: `${shape.top}%`,
            animationDelay: `${shape.delay}s`,
            animationDuration: `${shape.duration}s`,
            backgroundColor: shape.color,
          }"
        />
      </div>

      <div class="hero-content">
        <div class="hero-icon mount-0" aria-hidden="true">
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
        <h1 class="mount-1">Kho Mã Giảm Giá</h1>
        <p class="hero-subtitle mount-2">
          Săn deal hot - Tiết kiệm mỗi ngày cùng SmartFood
        </p>

        <div class="countdown-wrap mount-3" aria-live="polite">
          <p class="count-label">Flash Sale hôm nay: {{ flashCompactText }}</p>
          <div class="deal-progress">
            <span :style="{ width: `${flashProgress}%` }" />
          </div>
          <div class="deal-stats">
            <article>
              <strong>{{ visibleCoupons.length }}</strong>
              <span>Mã đang hoạt động</span>
            </article>
            <article>
              <strong>0đ</strong>
              <span>Freeship nội thành</span>
            </article>
            <article>
              <strong>50%</strong>
              <span>Mức giảm tối đa</span>
            </article>
          </div>
          <p class="update-pill">🔥 Cập nhật mã mới mỗi thứ 2 &amp; thứ 6</p>
        </div>
      </div>
    </section>

    <section class="filter-sticky">
      <div class="container">
        <div class="filter-row">
          <label class="search-box" aria-label="Tìm mã giảm giá">
            <span>🔎</span>
            <input
              v-model="searchText"
              type="text"
              placeholder="Tìm mã giảm giá..."
            />
          </label>

          <div class="tabs" role="tablist" aria-label="Lọc mã">
            <button
              v-for="tab in filterTabs"
              :key="tab.key"
              type="button"
              :class="['tab-pill', { active: activeTab === tab.key }]"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>

          <label class="sort-box" aria-label="Sắp xếp mã giảm giá">
            <span>Sắp xếp:</span>
            <select v-model="sortKey">
              <option value="best">Giảm nhiều nhất</option>
              <option value="latest">Mới cập nhật</option>
              <option value="expiring">Sắp hết hạn</option>
            </select>
          </label>
        </div>
        <p class="result-line">
          Tìm thấy {{ visibleCoupons.length }} mã khả dụng
        </p>
      </div>
    </section>

    <main class="container main-content">
      <section>
        <div class="section-head">
          <h2>⭐ Mã Nổi Bật Hôm Nay</h2>
          <span class="hot-badge">HOT</span>
        </div>

        <div class="featured-row">
          <article
            v-for="coupon in featuredCoupons"
            :key="coupon.id"
            class="featured-card"
          >
            <span class="featured-ribbon">FEATURED</span>
            <div class="featured-top">
              <p class="brand-line">SmartFood Deals</p>
              <p class="featured-value">{{ coupon.valueLabel }}</p>
              <p class="featured-condition">{{ coupon.condition }}</p>
            </div>
            <div class="featured-divider" />
            <div class="featured-bottom">
              <div class="code-box">{{ coupon.code }}</div>
              <span class="expire-tag">⏰ {{ coupon.expireText }}</span>
              <button
                type="button"
                class="copy-featured"
                @click="copyCode(coupon.code)"
              >
                <span>{{
                  copiedCode === coupon.code ? "✓ ĐÃ SAO CHÉP" : "SAO CHÉP MÃ"
                }}</span>
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

      <section>
        <div class="section-head">
          <h2>🎟️ Tất Cả Mã Giảm Giá</h2>
        </div>

        <div class="coupon-grid">
          <article
            v-for="(coupon, idx) in visibleCoupons"
            :key="coupon.id"
            class="coupon-card"
            :class="[
              coupon.status === 'expired' ? 'is-expired' : '',
              coupon.status === 'used' ? 'is-used' : '',
            ]"
            :style="{ animationDelay: `${idx * 50}ms` }"
          >
            <div class="coupon-left" :class="coupon.type">
              <p class="coupon-value">{{ coupon.valueLabel }}</p>
              <p class="coupon-icon">{{ coupon.icon }}</p>
              <p class="coupon-type-name">{{ coupon.typeLabel }}</p>
            </div>

            <div class="vertical-divider coupon-divider" />

            <div class="coupon-right">
              <div class="coupon-code">{{ coupon.code }}</div>
              <p class="coupon-condition">{{ coupon.condition }}</p>
              <p class="coupon-expire">⏰ {{ coupon.expireDate }}</p>

              <div class="usage">
                <p>
                  Đã dùng {{ coupon.usedCount }}/{{ coupon.totalCount }} lượt
                </p>
                <div class="progress-track">
                  <span
                    class="progress-fill"
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
                class="copy-standard"
                :class="{ copied: copiedCode === coupon.code }"
                @click="copyCode(coupon.code)"
              >
                {{ copiedCode === coupon.code ? "Đã sao chép" : "Sao chép" }}
              </button>

              <span
                v-if="coupon.totalCount - coupon.usedCount <= 10"
                class="low-badge"
              >
                🔥 Còn {{ coupon.totalCount - coupon.usedCount }} lượt
              </span>
            </div>

            <div v-if="coupon.status !== 'active'" class="status-overlay">
              <span class="status-stamp">{{
                coupon.status === "expired" ? "HẾT HẠN" : "ĐÃ DÙNG"
              }}</span>
            </div>
          </article>
        </div>
      </section>

      <section class="guide">
        <h3>Hướng Dẫn Sử Dụng Mã</h3>
        <div class="guide-steps">
          <article v-for="step in guideSteps" :key="step.id" class="guide-step">
            <div class="step-number">{{ step.id }}</div>
            <p class="step-icon">{{ step.icon }}</p>
            <h4>{{ step.title }}</h4>
            <p>{{ step.desc }}</p>
          </article>
        </div>
      </section>

      <section class="notes">
        <h3>Điều Kiện &amp; Lưu Ý</h3>
        <div class="accordion">
          <article
            v-for="(item, idx) in noteItems"
            :key="item.title"
            class="acc-item"
          >
            <button type="button" class="acc-head" @click="toggleNote(idx)">
              <span>{{ item.title }}</span>
              <span>{{ openedNotes.has(idx) ? "−" : "+" }}</span>
            </button>
            <p v-if="openedNotes.has(idx)" class="acc-body">{{ item.body }}</p>
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
  // {
  //   title: "Mã freeship không áp dụng với đơn COD",
  //   body: "Để dùng mã freeship, vui lòng chọn phương thức thanh toán online khi đặt đơn.",
  // },
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
.voucher-page {
  --primary: #f97316;
  --primary-dark: #ea580c;
  --secondary: #16a34a;
  --orange-soft: #fff7ed;
  --green-soft: #f0fdf4;
  --text: #111827;
  --muted: #6b7280;
  --border: #e5e7eb;
  min-height: 100vh;
  background: linear-gradient(180deg, #fffdf9 0%, #ffffff 40%);
  color: var(--text);
}

.container {
  width: min(1120px, 92vw);
  margin: 0 auto;
}

.hero {
  position: relative;
  min-height: 260px;
  overflow: hidden;
  background: linear-gradient(135deg, #f97316, #ea580c, #dc2626);
  display: grid;
  place-items: center;
}

.hero-confetti {
  position: absolute;
  inset: 0;
}

.confetti {
  position: absolute;
  opacity: 0.15;
  animation: floatRotate linear infinite;
}

.confetti.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.confetti.diamond {
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
}

.confetti.star {
  width: 12px;
  height: 12px;
  clip-path: polygon(
    50% 0,
    62% 34%,
    100% 38%,
    72% 59%,
    82% 100%,
    50% 75%,
    18% 100%,
    28% 59%,
    0 38%,
    38% 34%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #fff;
}

.hero-icon {
  width: 64px;
  margin: 0 auto 12px;
  animation: swing 2s ease-in-out infinite;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 38px);
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -0.03em;
  text-shadow: 0 8px 26px rgba(0, 0, 0, 0.26);
}

.hero-subtitle {
  margin: 10px 0 0;
  opacity: 0.8;
}

.countdown-wrap {
  margin-top: 14px;
}

.count-label {
  margin: 0 0 8px;
  font-weight: 600;
}

.deal-progress {
  width: min(440px, 92vw);
  margin: 0 auto;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  overflow: hidden;
}

.deal-progress span {
  display: block;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #fde047, #facc15, #86efac);
  transition: width 0.4s ease;
}

.deal-stats {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.deal-stats article {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px;
  display: grid;
}

.deal-stats strong {
  font-size: 1.1rem;
}

.deal-stats span {
  font-size: 0.76rem;
  opacity: 0.86;
}

.countdown-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 80px));
  justify-content: center;
  gap: 8px;
}

.time-box {
  border-radius: 12px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(17, 24, 39, 0.3);
}

.digit-shell {
  perspective: 300px;
}

.digit {
  display: block;
  font-size: 1.3rem;
  font-weight: 800;
  transform-origin: center top;
}

.digit.flip {
  animation: flip 0.6s ease;
}

.time-box small {
  font-size: 0.7rem;
  opacity: 0.8;
}

.update-pill {
  margin: 10px auto 0;
  width: fit-content;
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 0.8rem;
  font-weight: 700;
  background: #fde047;
  color: #9a3412;
}

.mount-0,
.mount-1,
.mount-2,
.mount-3 {
  opacity: 0;
  transform: translateY(14px);
  animation: heroMount 0.5s ease forwards;
}

.mount-1 {
  animation-delay: 0.1s;
}

.mount-2 {
  animation-delay: 0.2s;
}

.mount-3 {
  animation-delay: 0.3s;
}

.filter-sticky {
  position: sticky;
  top: 4rem;
  z-index: 30;
  border-bottom: 1px solid var(--border);
  background: #fff;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.06);
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0 14px;
  height: 44px;
}

.search-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.16);
}

.search-box span {
  color: var(--primary);
}

.search-box input {
  border: 0;
  outline: 0;
  width: 100%;
  font-size: 0.95rem;
}

.tabs {
  display: flex;
  gap: 8px;
}

.tab-pill {
  border: 0;
  border-radius: 999px;
  padding: 10px 14px;
  background: #f3f4f6;
  color: #4b5563;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.tab-pill.active {
  background: var(--primary);
  color: #fff;
}

.sort-box {
  border: 1px solid var(--border);
  border-radius: 999px;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 8px;
  font-size: 0.92rem;
}

.sort-box select {
  border: 0;
  outline: 0;
  font-weight: 700;
  color: var(--text);
  background: transparent;
}

.result-line {
  margin: 0 0 12px;
  color: var(--secondary);
  font-size: 0.85rem;
  font-weight: 700;
}

.main-content {
  padding: 24px 0 56px;
  display: grid;
  gap: 28px;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.section-head h2 {
  margin: 0;
  font-size: 1.4rem;
}

.hot-badge {
  padding: 5px 10px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
  animation: pulse 1.2s infinite;
}

.featured-row {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 8px;
}

.featured-card {
  position: relative;
  min-width: 340px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(135deg, #f97316, #ea580c);
  scroll-snap-align: start;
  box-shadow: 0 16px 30px rgba(234, 88, 12, 0.3);
}

.featured-ribbon {
  position: absolute;
  top: 14px;
  right: -34px;
  transform: rotate(38deg);
  background: #fde047;
  color: #b91c1c;
  font-weight: 900;
  font-size: 0.7rem;
  padding: 4px 34px;
}

.featured-top {
  padding: 18px;
  color: #fff;
}

.brand-line {
  margin: 0;
  opacity: 0.92;
}

.featured-value {
  margin: 8px 0 0;
  font-size: 2.2rem;
  line-height: 1;
  font-weight: 900;
}

.featured-condition {
  margin: 8px 0 0;
  opacity: 0.86;
}

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

.featured-divider::before {
  left: -9px;
}

.featured-divider::after {
  right: -9px;
}

.featured-bottom {
  background: var(--orange-soft);
  padding: 16px;
}

.code-box {
  font-family: "Courier New", monospace;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--primary-dark);
  border: 2px dashed #fb923c;
  border-radius: 10px;
  background: #fff2df;
  padding: 10px;
  text-align: center;
}

.expire-tag {
  display: inline-block;
  margin-top: 10px;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.78rem;
  font-weight: 700;
  background: #ef4444;
  color: #fff;
}

.copy-featured {
  margin-top: 12px;
  width: 100%;
  border: 0;
  border-radius: 12px;
  background: var(--primary-dark);
  color: #fff;
  height: 44px;
  font-weight: 800;
  position: relative;
  overflow: hidden;
}

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

.coupon-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.coupon-card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: #fff;
  display: grid;
  grid-template-columns: 35% 14px 65%;
  border: 1px solid var(--border);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  transform: translateY(8px);
  opacity: 0;
  animation: cardIn 0.45s ease forwards;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.coupon-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 22px rgba(15, 23, 42, 0.12);
}

.coupon-left {
  padding: 14px;
  color: #fff;
  display: grid;
  align-content: center;
  justify-items: center;
  text-align: center;
}

.coupon-left.money,
.coupon-left.percent {
  background: linear-gradient(140deg, #f97316, #ea580c);
}

.coupon-left.freeship,
.coupon-left.product {
  background: linear-gradient(140deg, #22c55e, #16a34a);
}

.coupon-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
}

.coupon-icon {
  margin: 4px 0;
}

.coupon-type-name {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

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

.coupon-divider::before {
  top: -8px;
}

.coupon-divider::after {
  bottom: -8px;
}

.coupon-right {
  padding: 12px 16px;
  position: relative;
}

.coupon-code {
  width: fit-content;
  border-radius: 8px;
  padding: 6px 10px;
  border: 1px dashed #fb923c;
  background: #fff7ed;
  font-family: "Courier New", monospace;
  font-weight: 800;
}

.coupon-condition,
.coupon-expire,
.usage p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.82rem;
}

.progress-track {
  margin-top: 8px;
  height: 8px;
  border-radius: 999px;
  background: #f3f4f6;
  overflow: hidden;
}

.progress-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #f97316, #ea580c);
  transition: width 0.8s ease;
}

.copy-standard {
  margin-top: 10px;
  border: 1px solid var(--primary);
  color: var(--primary);
  background: transparent;
  border-radius: 10px;
  height: 34px;
  font-weight: 700;
  width: 100%;
}

.copy-standard.copied {
  background: var(--primary);
  color: #fff;
}

.low-badge {
  margin-top: 8px;
  display: inline-block;
  border-radius: 999px;
  padding: 4px 8px;
  background: #ef4444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  animation: pulse 1.2s infinite;
}

.status-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.4);
  display: grid;
  place-items: center;
}

.status-stamp {
  border: 3px solid #dc2626;
  color: #dc2626;
  font-weight: 900;
  letter-spacing: 0.08em;
  padding: 8px 14px;
  transform: rotate(15deg);
  background: rgba(255, 255, 255, 0.95);
  animation: stamp 1.2s ease-in-out infinite;
}

.is-used .status-stamp {
  border-color: #16a34a;
  color: #16a34a;
}

.guide {
  background: var(--orange-soft);
  border-radius: 18px;
  padding: 24px;
}

.guide h3,
.notes h3 {
  text-align: center;
  margin: 0 0 18px;
  font-size: 1.3rem;
}

.guide-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.guide-step {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  text-align: center;
  position: relative;
  transition: box-shadow 0.2s ease;
}

.guide-step:hover {
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.3);
}

.step-number {
  width: 30px;
  height: 30px;
  margin: 0 auto;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--primary);
  color: #fff;
  font-weight: 800;
}

.step-icon {
  margin: 8px 0;
  font-size: 2rem;
}

.guide-step h4 {
  margin: 0;
}

.guide-step p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.notes {
  border-radius: 18px;
  border: 1px solid var(--border);
  padding: 20px;
}

.accordion {
  display: grid;
  gap: 8px;
}

.acc-item {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.acc-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0;
  background: #fff;
  padding: 12px 14px;
  font-weight: 700;
}

.acc-body {
  margin: 0;
  padding: 0 14px 12px;
  color: var(--muted);
  line-height: 1.6;
}

@keyframes heroMount {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatRotate {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-12px) rotate(15deg);
  }
  100% {
    transform: translateY(8px) rotate(-12deg);
  }
}

@keyframes swing {
  0%,
  100% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(8deg);
  }
}

@keyframes flip {
  0% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(90deg);
  }
  100% {
    transform: rotateX(0deg);
  }
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

@keyframes cardIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.8;
  }
}

@keyframes stamp {
  0%,
  100% {
    opacity: 0.85;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .filter-row {
    flex-wrap: wrap;
  }

  .tabs {
    order: 3;
    width: 100%;
    overflow-x: auto;
    padding-bottom: 6px;
  }

  .coupon-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .countdown-grid {
    grid-template-columns: repeat(2, minmax(0, 92px));
  }

  .deal-stats {
    grid-template-columns: 1fr;
  }

  .coupon-grid {
    grid-template-columns: 1fr;
  }

  .guide-steps {
    grid-template-columns: 1fr;
  }

  .sort-box,
  .search-box {
    width: 100%;
  }
}
</style>
