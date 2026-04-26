<template>
  <div class="system-error-page">
    <header class="status-bar">
      <p>🔧 Chúng tôi đang khắc phục sự cố...</p>
      <div class="dot-status">
        <span>Đang xử lý</span>
        <i /><i /><i />
      </div>
    </header>
    <div class="status-progress" aria-hidden="true" />

    <main class="content-wrap">
      <section class="illustration-zone" aria-hidden="true">
        <p class="error-bg">ERROR</p>
      </section>

      <p class="code-500">500</p>

      <section class="text-content">
        <h1>Ôm! Bếp nhà mình đang có sự cố nhỏ 🔧</h1>
        <p>
          Đừng lo lắng - dữ liệu và đơn hàng của bạn hoàn toàn an toàn. Đội kỹ
          thuật SmartFood đang xử lý gấp!
        </p>

        <button
          type="button"
          class="toggle-error"
          @click="showErrorDetail = !showErrorDetail"
        >
          Mã lỗi: 500 Internal Server Error
          <span>{{ showErrorDetail ? "▲" : "▼" }}</span>
        </button>
        <pre v-if="showErrorDetail" class="error-detail">
[{{ nowText }}] HTTP 500
Server temporarily unavailable
Trace ID: SF-500-{{ nowToken }}</pre
        >
      </section>

      <section>
        <p class="status-title">Tình trạng hệ thống hiện tại:</p>
        <div class="status-cards">
          <article class="status-card green card-1">
            <h3>📦 ✅ Đơn hàng của bạn an toàn</h3>
            <p>Không ảnh hưởng</p>
          </article>
          <article class="status-card orange card-2">
            <h3>
              🛡️ ⚠️ Thanh toán tạm gián đoạn
              <span class="pulse-dot" />
            </h3>
            <p>Đang khắc phục</p>
          </article>
          <article class="status-card green card-3">
            <h3>🗃️ ✅ Dữ liệu được bảo toàn</h3>
            <p>An toàn 100%</p>
          </article>
        </div>
      </section>

      <section class="retry-card">
        <div class="retry-inner">
          <svg viewBox="0 0 120 120" class="count-circle" aria-hidden="true">
            <circle cx="60" cy="60" r="48" class="track" />
            <circle
              cx="60"
              cy="60"
              r="48"
              class="ring"
              :style="{ strokeDashoffset: circleDashOffset }"
            />
          </svg>

          <div class="retry-main">
            <p class="retry-icon">🔄</p>
            <p class="retry-label">Trang sẽ tự động tải lại sau</p>
            <p class="retry-seconds">{{ remaining }}</p>
            <button type="button" class="reload-btn" @click="reloadNow">
              Tải lại ngay
            </button>
            <NuxtLink
:to="ROUTES.HOME"
class="home-link"
              >Hoặc về trang chủ</NuxtLink
            >
          </div>
        </div>
      </section>

      <section class="contact-wrap">
        <p>Vấn đề vẫn còn? Liên hệ ngay:</p>
        <div class="contact-cards">
          <article>📞 Hotline: 1800.xxxx (Miễn phí)</article>
          <article>💬 Live Chat: Chat ngay trên app</article>
          <article>✉️ Email: hotro@smartfood.vn</article>
        </div>
      </section>
    </main>

    <footer class="branding">
      <strong>SmartFood</strong>
      <span>Xin lỗi vì sự bất tiện này 🙏</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { ROUTES } from "~/constants/routes";

const totalSeconds = 30;
const remaining = ref(totalSeconds);
const showErrorDetail = ref(false);
const now = new Date();
const nowText = now.toLocaleString("vi-VN");
const nowToken = `${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;

const circleLength = 2 * Math.PI * 48;
const circleDashOffset = computed(() => {
  const progress = (totalSeconds - remaining.value) / totalSeconds;
  return circleLength * progress;
});

let countdownTimer: ReturnType<typeof setInterval> | null = null;

const reloadNow = () => {
  window.location.reload();
};

onMounted(() => {
  countdownTimer = setInterval(() => {
    if (remaining.value <= 0) {
      window.location.reload();
      return;
    }
    remaining.value -= 1;
  }, 1000);
});

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
.system-error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #fff7ed 0%, #fff 48%);
  color: #111827;
}

.status-bar {
  height: 44px;
  background: #f97316;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  font-size: 13px;
}

.status-bar p {
  margin: 0;
}

.dot-status {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  animation: blinkDot 1.1s infinite;
}

.dot-status i:nth-child(2) {
  animation-delay: 0.2s;
}

.dot-status i:nth-child(3) {
  animation-delay: 0.4s;
}

.status-progress {
  height: 4px;
  background: linear-gradient(90deg, transparent, #fb923c, transparent);
  background-size: 200% 100%;
  animation: progressMove 1.2s linear infinite;
}

.content-wrap {
  flex: 1;
  width: min(640px, 94vw);
  margin: 0 auto;
  padding: 40px 24px;
  display: grid;
  gap: 22px;
  align-content: center;
}

.illustration-zone {
  height: 300px;
  position: relative;
}

.error-bg {
  position: absolute;
  inset: 30px auto auto 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: clamp(120px, 22vw, 220px);
  letter-spacing: 0.3em;
  color: #111827;
  opacity: 0.04;
  z-index: 0;
}

.scene-svg {
  width: 100%;
  position: relative;
  z-index: 1;
}

.led-green {
  animation: greenBlink 1.6s infinite;
}

.led-red {
  animation: redBlink 0.8s infinite;
}

.steam {
  opacity: 0;
  animation: steamUp 2s ease-in-out infinite;
}

.steam-2 {
  animation-delay: 0.5s;
}

.steam-3 {
  animation-delay: 1s;
}

.steam-4 {
  animation-delay: 1.5s;
}

.wrench-work {
  transform-origin: center;
  animation: wrench 1s infinite alternate ease-in-out;
}

.mechanic-body {
  animation: mechanicBob 2.4s infinite ease-in-out;
}

.arm-right {
  transform-origin: 10px -10px;
  animation: armFix 1.2s infinite alternate ease-in-out;
}

.code-500 {
  margin: -8px 0 0;
  text-align: center;
  font-size: clamp(90px, 18vw, 140px);
  line-height: 1;
  font-weight: 900;
  background: linear-gradient(130deg, #ef4444, #dc2626);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 0 #f97316;
  -webkit-text-stroke: 2px #f97316;
  animation: codeIn 0.55s ease forwards;
  filter: blur(6px);
  opacity: 0;
}

.text-content {
  text-align: center;
}

.text-content h1 {
  margin: 0;
  font-size: 22px;
}

.text-content p {
  margin: 10px auto 0;
  max-width: 500px;
  color: #4b5563;
  font-size: 15px;
  line-height: 1.7;
}

.toggle-error {
  margin: 12px auto 0;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
}

.error-detail {
  margin: 8px auto 0;
  width: min(430px, 100%);
  border-radius: 10px;
  padding: 10px;
  background: #f3f4f6;
  text-align: left;
  color: #111827;
  font-size: 12px;
  font-family: "Courier New", monospace;
}

.status-title {
  margin: 0 0 10px;
  font-weight: 700;
  text-align: center;
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.status-card {
  border-radius: 12px;
  padding: 12px;
  border: 1px solid;
  opacity: 0;
  transform: translateY(8px);
  animation: cardIn 0.4s ease forwards;
}

.status-card h3 {
  margin: 0;
  font-size: 14px;
}

.status-card p {
  margin: 8px 0 0;
  font-size: 13px;
  font-weight: 700;
}

.status-card.green {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.status-card.orange {
  background: #fff7ed;
  border-color: #fed7aa;
  color: #9a3412;
}

.card-1 {
  animation-delay: 0.1s;
}

.card-2 {
  animation-delay: 0.2s;
}

.card-3 {
  animation-delay: 0.3s;
}

.pulse-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f97316;
  margin-left: 6px;
  animation: pulseDot 1s infinite;
}

.retry-card {
  border: 2px dashed #d1d5db;
  background: #f9fafb;
  border-radius: 14px;
  padding: 16px;
}

.retry-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.count-circle {
  width: 120px;
  height: 120px;
  transform: rotate(-90deg);
}

.track {
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 8;
}

.ring {
  fill: none;
  stroke: #f97316;
  stroke-width: 8;
  stroke-dasharray: 301.6;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.6s linear;
}

.retry-main {
  text-align: center;
}

.retry-icon {
  margin: 0;
  font-size: 22px;
  animation: spin 1s linear infinite;
}

.retry-label {
  margin: 6px 0 0;
  color: #4b5563;
}

.retry-seconds {
  margin: 2px 0 10px;
  font-size: 32px;
  color: #f97316;
  font-weight: 900;
}

.reload-btn {
  border: 0;
  border-radius: 999px;
  background: #f97316;
  color: #fff;
  font-weight: 700;
  padding: 10px 20px;
}

.home-link {
  display: block;
  margin-top: 8px;
  color: #6b7280;
  font-size: 13px;
}

.contact-wrap p {
  margin: 0 0 10px;
  text-align: center;
  color: #4b5563;
}

.contact-cards {
  display: flex;
  gap: 10px;
}

.contact-cards article {
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
  text-align: center;
  transition: background 0.2s ease;
}

.contact-cards article:hover {
  background: #fff7ed;
}

.branding {
  text-align: center;
  padding: 0 0 22px;
  color: #6b7280;
  font-size: 13px;
}

@keyframes progressMove {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

@keyframes blinkDot {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

@keyframes greenBlink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@keyframes redBlink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}

@keyframes steamUp {
  0% {
    opacity: 0;
    transform: translateY(0) scaleX(1.2);
  }
  45% {
    opacity: 0.4;
  }
  100% {
    opacity: 0;
    transform: translateY(-30px) scaleX(0.8);
  }
}

@keyframes wrench {
  from {
    transform: rotate(-20deg);
  }
  to {
    transform: rotate(20deg);
  }
}

@keyframes mechanicBob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes armFix {
  from {
    transform: rotate(-6deg);
  }
  to {
    transform: rotate(8deg);
  }
}

@keyframes codeIn {
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}

@keyframes cardIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseDot {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.4);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .status-bar p {
    font-size: 12px;
  }

  .dot-status span {
    display: none;
  }

  .illustration-zone {
    transform: scale(0.75);
    height: 220px;
  }

  .status-cards {
    grid-template-columns: 1fr;
  }

  .retry-inner {
    flex-direction: column;
  }

  .contact-cards {
    flex-direction: column;
  }
}
</style>
