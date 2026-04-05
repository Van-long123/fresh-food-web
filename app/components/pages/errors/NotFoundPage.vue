<template>
  <div class="not-found-page">
    <div class="floating-items" aria-hidden="true">
      <span
        v-for="item in floatingItems"
        :key="item.id"
        class="float-item"
        :style="{
          left: `${item.left}%`,
          top: `${item.top}%`,
          animationDelay: `${item.delay}s`,
          animationDuration: `${item.duration}s`,
        }"
      >
        {{ item.icon }}
      </span>
    </div>

    <main class="content-wrap">
      <section class="illustration-zone mount-illustration" aria-hidden="true">
        <svg viewBox="0 0 520 280" class="cart-svg" role="img">
          <path
            d="M36 206h162"
            stroke="#94a3b8"
            stroke-width="4"
            stroke-dasharray="7 8"
          />
          <g class="dead-end-sign">
            <rect
              x="138"
              y="164"
              width="84"
              height="34"
              rx="6"
              fill="#f97316"
            />
            <text
              x="180"
              y="186"
              text-anchor="middle"
              fill="#fff"
              font-size="10"
              letter-spacing="0.4"
              font-weight="700"
            >
              DEAD END
            </text>
          </g>

          <g class="cart-wobble">
            <path
              d="M170 82h224l-26 108H200z"
              fill="none"
              stroke="#f97316"
              stroke-width="9"
              stroke-linejoin="round"
            />
            <circle cx="224" cy="212" r="20" fill="#f97316" />
            <circle cx="340" cy="212" r="20" fill="#f97316" />
            <circle cx="224" cy="212" r="8" fill="#fff" opacity="0.85" />
            <circle cx="340" cy="212" r="8" fill="#fff" opacity="0.85" />
          </g>

          <g class="question-flow q1">
            <text
              x="250"
              y="94"
              fill="#fdba74"
              font-size="30"
              font-weight="900"
            >
              ?
            </text>
          </g>
          <g class="question-flow q2">
            <text
              x="290"
              y="106"
              fill="#fb923c"
              font-size="28"
              font-weight="900"
            >
              ?
            </text>
          </g>
          <g class="question-flow q3">
            <text
              x="322"
              y="92"
              fill="#fed7aa"
              font-size="26"
              font-weight="900"
            >
              ?
            </text>
          </g>

          <g transform="translate(408 192)">
            <text x="0" y="0" font-size="34">🥬</text>
            <circle cx="16" cy="-10" r="2.8" fill="#111827" />
            <circle cx="26" cy="-10" r="2.8" fill="#111827" />
          </g>
        </svg>
      </section>

      <p class="code-404 mount-code">404</p>

      <section class="text-content">
        <h1 class="mount-title">Ôi! Trang này đã... về quê ăn Tết 🌾</h1>
        <p>
          Có vẻ trang bạn tìm không tồn tại hoặc đã được chuyển đi nơi khác.
          Đừng lo, kho thực phẩm của chúng tôi vẫn đang chờ bạn!
        </p>
      </section>

      <section class="actions">
        <NuxtLink to="/" class="btn btn-primary">🏠 Về Trang Chủ</NuxtLink>
        <NuxtLink to="/category/rau-cu-huu-co" class="btn btn-secondary"
          >🛒 Xem Sản Phẩm</NuxtLink
        >
        <button type="button" class="back-link" @click="router.back()">
          ← Quay lại trang trước
        </button>
      </section>

      <section class="quick-links">
        <p>Hoặc bạn đang tìm kiếm?</p>
        <div class="quick-grid">
          <NuxtLink
            v-for="item in quickLinks"
            :key="item.label"
            :to="item.to"
            class="quick-pill"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>
      </section>

      <section class="search-box-wrap">
        <label for="search404">Thử tìm kiếm sản phẩm bạn cần:</label>
        <div class="search-row">
          <span>🔎</span>
          <input
            id="search404"
            v-model="keyword"
            type="text"
            placeholder="Nhập tên sản phẩm..."
          />
          <NuxtLink :to="searchLink" class="search-btn">Tìm</NuxtLink>
        </div>
      </section>
    </main>

    <footer class="branding">
      <strong>SmartFood</strong>
      <span>Thực phẩm sạch - Sống khỏe mỗi ngày</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const keyword = ref("");

const quickLinks = [
  {
    icon: "🥩",
    label: "Thực phẩm tươi sống",
    to: "/category/thuc-pham-tuoi-song",
  },
  { icon: "🥦", label: "Rau củ hữu cơ", to: "/category/rau-cu-huu-co" },
  {
    icon: "🍎",
    label: "Trái cây nhập khẩu",
    to: "/category/trai-cay-nhap-khau",
  },
  { icon: "🎁", label: "Khuyến mãi hôm nay", to: "/vouchers" },
];

const floatingItems = [
  { id: 1, icon: "🥦", left: 8, top: 8, delay: 0, duration: 3 },
  { id: 2, icon: "🍎", left: 20, top: 20, delay: 0.5, duration: 4 },
  { id: 3, icon: "🥕", left: 82, top: 10, delay: 1, duration: 5 },
  { id: 4, icon: "🛒", left: 90, top: 26, delay: 1.5, duration: 4 },
  { id: 5, icon: "🍐", left: 14, top: 74, delay: 2, duration: 3.8 },
  { id: 6, icon: "🥬", left: 86, top: 76, delay: 2.2, duration: 4.2 },
];

const searchLink = computed(() => {
  const query = keyword.value.trim();
  if (!query) return "/";
  return `/category/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, "-"))}`;
});
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #fff;
  color: #111827;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.floating-items {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.float-item {
  position: absolute;
  font-size: 36px;
  opacity: 0.22;
  animation: floatItem alternate infinite ease-in-out;
}

.content-wrap {
  position: relative;
  z-index: 1;
  width: min(600px, 94vw);
  text-align: center;
  padding: 40px 24px;
}

.illustration-zone {
  height: 280px;
  display: grid;
  place-items: center;
}

.cart-svg {
  width: 100%;
  max-width: 520px;
}

.cart-wobble {
  transform-origin: 52% 60%;
  animation: wobble 4s ease-in-out infinite;
}

.dead-end-sign {
  transform-origin: 179px 182px;
  transform: rotate(-10deg);
}

.question-flow {
  opacity: 0;
  animation: questionFloat 2.4s linear infinite;
}

.question-flow.q2 {
  animation-delay: 0.7s;
}

.question-flow.q3 {
  animation-delay: 1.3s;
}

.code-404 {
  margin: -8px 0 0;
  font-size: clamp(100px, 20vw, 160px);
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.05em;
  background: linear-gradient(120deg, #f97316, #ea580c);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  filter: blur(0);
}

.text-content h1 {
  margin: 4px 0 10px;
  font-size: 22px;
  font-weight: 700;
}

.text-content p {
  margin: 0 auto;
  max-width: 440px;
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
}

.actions {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.btn {
  height: 46px;
  border-radius: 999px;
  padding: 0 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.btn-primary {
  background: #f97316;
  color: #fff;
}

.btn-primary:hover {
  background: #ea580c;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(249, 115, 22, 0.32);
}

.btn-secondary {
  border: 2px solid #f97316;
  color: #f97316;
}

.btn-secondary:hover {
  background: #f97316;
  color: #fff;
}

.back-link {
  width: 100%;
  border: 0;
  background: transparent;
  color: #f97316;
  font-size: 13px;
  margin-top: 2px;
  cursor: pointer;
}

.quick-links {
  margin-top: 20px;
}

.quick-links p {
  margin: 0 0 10px;
  color: #6b7280;
  font-size: 14px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.quick-pill {
  border-radius: 999px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #111827;
  padding: 10px 12px;
  text-decoration: none;
  display: flex;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  transition: background 0.2s ease;
}

.quick-pill:hover {
  background: #fff7ed;
}

.search-box-wrap {
  margin-top: 18px;
}

.search-box-wrap label {
  font-size: 14px;
  color: #6b7280;
}

.search-row {
  margin: 10px auto 0;
  max-width: 400px;
  border: 1px solid #f97316;
  border-radius: 999px;
  height: 44px;
  display: flex;
  align-items: center;
  padding-left: 14px;
  gap: 8px;
}

.search-row:focus-within {
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
}

.search-row span {
  color: #f97316;
}

.search-row input {
  border: 0;
  outline: 0;
  flex: 1;
  font-size: 14px;
}

.search-btn {
  background: #f97316;
  color: #fff;
  border-radius: 999px;
  padding: 0 20px;
  height: 36px;
  margin-right: 4px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  font-weight: 700;
}

.branding {
  margin-top: auto;
  padding-bottom: 32px;
  display: grid;
  gap: 2px;
  text-align: center;
  color: #6b7280;
  font-size: 13px;
}

.mount-illustration {
  opacity: 0;
  transform: scale(0.8);
  animation: mountSpring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.mount-code {
  opacity: 0;
  filter: blur(8px);
  animation: codeShow 0.6s ease 0.2s forwards;
}

.mount-title {
  opacity: 0;
  transform: translateY(12px);
  animation: titleIn 0.55s ease 0.4s forwards;
}

.actions .btn {
  opacity: 0;
  transform: translateY(10px);
  animation: titleIn 0.45s ease forwards;
}

.actions .btn:nth-child(1) {
  animation-delay: 0.6s;
}

.actions .btn:nth-child(2) {
  animation-delay: 0.7s;
}

@keyframes mountSpring {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes codeShow {
  to {
    opacity: 1;
    filter: blur(0);
  }
}

@keyframes titleIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatItem {
  0% {
    transform: translateY(10px) rotate(-10deg);
  }
  100% {
    transform: translateY(-20px) rotate(10deg);
  }
}

@keyframes wobble {
  0%,
  100% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
}

@keyframes questionFloat {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}

@media (max-width: 768px) {
  .float-item {
    font-size: 30px;
  }

  .float-item:nth-child(5),
  .float-item:nth-child(6) {
    display: none;
  }

  .illustration-zone {
    transform: scale(0.8);
    height: 220px;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .quick-grid {
    grid-template-columns: 1fr;
  }
}
</style>
