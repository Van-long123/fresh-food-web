<template>
  <div class="bg-white text-[#111827]">
    <div
      class="fixed top-0 left-0 z-50 h-0.5 bg-[#F97316] transition-all duration-150"
      :style="{ width: `${readingProgress}%` }"
    />

    <section class="relative min-h-75 overflow-hidden md:min-h-85">
      <div
        class="absolute inset-0 bg-linear-to-r from-[#F97316] to-[#EA580C]"
      />
      <div class="absolute inset-0 exchange-pattern" />

      <div
        class="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center px-4 pb-14 pt-10 text-center text-white md:pb-16"
      >
        <svg
          class="h-14 w-14 spin-soft"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.7"
            d="M4 4v6h6M20 20v-6h-6M20 8a8 8 0 00-13.657-5.657L4 4m16 16l-2.343 2.343A8 8 0 014 16"
          />
        </svg>

        <h1 class="mt-2 text-3xl font-extrabold md:text-5xl">
          Quy Định Đổi Trả Hàng
        </h1>
        <p class="mt-2 text-base text-white/90 md:text-3">
          Chính sách rõ ràng - Giải quyết nhanh chóng trong 24h
        </p>

        <div
          class="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm"
        >
          <span
            class="rounded-full bg-white px-3 py-1 font-semibold text-[#EA580C]"
            >⚡ Xử lý 24h</span
          >
          <span
            class="rounded-full bg-white px-3 py-1 font-semibold text-[#EA580C]"
            >✅ Không rắc rối</span
          >
          <span
            class="rounded-full bg-white px-3 py-1 font-semibold text-[#EA580C]"
            >🔒 Cam kết hoàn tiền</span
          >
        </div>
      </div>
    </section>

    <section
      class="relative z-10 mx-auto -mt-10 max-w-7xl px-4 md:-mt-14 md:px-6"
    >
      <div
        class="overflow-hidden rounded-2xl border border-[#FDBA74] bg-[#FFF7ED] shadow-sm"
      >
        <div class="bg-[#F97316] px-5 py-3 text-xl font-bold text-white">
          📋 Tóm tắt quy định (Đọc ngay)
        </div>
        <div class="grid grid-cols-1 gap-3 p-5 text-sm sm:grid-cols-2">
          <div
            v-for="item in quickSummary"
            :key="item"
            class="flex gap-2 text-[#374151]"
          >
            <span class="text-[#16A34A]">✅</span>
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </section>

    <section
      class="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 md:px-6 lg:grid-cols-[28%_72%]"
    >
      <aside class="h-fit lg:sticky lg:top-20">
        <div
          class="relative rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm"
        >
          <div
            class="absolute right-0 top-0 h-full w-1 overflow-hidden rounded-r-2xl bg-[#FED7AA]"
          >
            <div
              class="w-full bg-[#F97316] transition-all duration-200"
              :style="{ height: `${sidebarProgress}%` }"
            />
          </div>

          <h3 class="font-bold">Mục lục</h3>
          <ul class="mt-3 space-y-1 text-sm">
            <li v-for="sec in sections" :key="sec.id">
              <button
                class="w-full rounded-lg px-3 py-2 text-left transition"
                :class="
                  activeSection === sec.id
                    ? 'bg-[#FFF7ED] text-[#EA580C] font-semibold'
                    : 'text-[#4B5563] hover:bg-[#F9FAFB]'
                "
                @click="scrollToSection(sec.id)"
              >
                {{ sec.title }}
              </button>
            </li>
          </ul>

          <div class="mt-5 rounded-xl border border-[#FDBA74] bg-[#FFF7ED] p-4">
            <div class="flex items-center gap-2 text-[#EA580C]">
              <span class="text-xl">📞</span>
              <span class="font-semibold">Liên hệ nhanh</span>
            </div>
            <p class="mt-2 text-2xl font-extrabold text-[#F97316]">
              {{ settingsStore.phone }}
            </p>
            <!-- <button
              class="mt-3 w-full rounded-lg bg-[#F97316] py-2 font-semibold text-white transition hover:bg-[#EA580C]"
            >
              Yêu cầu đổi trả
            </button> -->
          </div>
        </div>
      </aside>

      <div class="space-y-8">
        <section
          id="dieu-kien"
          class="spy-section rounded-2xl border border-[#E5E7EB] bg-white p-5"
        >
          <h2 class="text-xl font-bold">§1 - Điều kiện được đổi trả</h2>
          <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <article
              class="condition-card rounded-xl border border-green-200 bg-[#F0FDF4] p-4"
            >
              <h3 class="font-semibold text-[#166534]">✓ ĐƯỢC đổi</h3>
              <ul class="mt-3 space-y-2 text-sm">
                <li v-for="item in accepted" :key="item" class="flex gap-2">
                  <span class="text-[#16A34A]">✓</span><span>{{ item }}</span>
                </li>
              </ul>
            </article>
            <article
              class="condition-card rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <h3 class="font-semibold text-red-700">✗ KHÔNG được đổi</h3>
              <ul class="mt-3 space-y-2 text-sm">
                <li v-for="item in rejected" :key="item" class="flex gap-2">
                  <span class="text-red-500">✗</span><span>{{ item }}</span>
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section
          id="thoi-han"
          class="spy-section rounded-2xl border border-[#E5E7EB] bg-white p-5"
        >
          <h2 class="text-xl font-bold">§2 - Thời hạn đổi trả</h2>
          <div class="mt-5 flex flex-col gap-4 md:flex-row md:items-stretch">
            <article
              v-for="(item, idx) in timelines"
              :key="item.time"
              class="timeline-item relative flex-1 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4"
            >
              <div class="flex items-center gap-2">
                <span
                  class="grid h-7 w-7 place-items-center rounded-full bg-[#F97316] text-xs font-bold text-white"
                  >🕐</span
                >
                <p class="font-semibold text-[#EA580C]">{{ item.time }}</p>
              </div>
              <p class="mt-2 text-sm">{{ item.desc }}</p>
              <div
                v-if="idx < timelines.length - 1"
                class="absolute -right-4 top-1/2 hidden h-0.5 w-6 -translate-y-1/2 bg-[#FDBA74] md:block"
              />
            </article>
          </div>
        </section>

        <section
          id="quy-trinh"
          class="spy-section overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5"
        >
          <h2 class="text-xl font-bold">§3 - Quy trình 4 bước</h2>
          <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            <article
              v-for="(step, idx) in processSteps"
              :key="step.title"
              class="relative rounded-xl border p-4 border-[#E5E7EB] bg-[#F9FAFB]"
            >
              <div
                class="mb-3 grid h-9 w-9 place-items-center rounded-full text-sm font-bold"
              >
                {{ idx + 1 }}
              </div>
              <p class="text-sm font-semibold">{{ step.title }}</p>
              <p class="mt-2 text-sm text-[#6B7280]">{{ step.desc }}</p>
              <div
                v-if="idx < processSteps.length - 1"
                class="absolute -right-4 top-8 hidden h-0.5 w-8 overflow-hidden bg-[#FDBA74] md:block"
              ></div>
            </article>
          </div>
        </section>

        <section
          id="hoan-tien"
          class="spy-section rounded-2xl border border-[#E5E7EB] bg-white p-5"
        >
          <h2 class="text-xl font-bold">§4 - Hình thức hoàn tiền</h2>
          <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <article
              v-for="item in refundMethods"
              :key="item.title"
              class="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4"
            >
              <p class="text-3xl">{{ item.icon }}</p>
              <h3 class="mt-2 font-bold">{{ item.title }}</h3>
              <p class="mt-1 text-sm text-[#16A34A]">{{ item.time }}</p>
              <p class="mt-2 text-sm text-[#6B7280]">{{ item.note }}</p>
            </article>
          </div>
        </section>

        <section
          id="dac-biet"
          class="spy-section rounded-2xl border border-[#E5E7EB] bg-white p-5"
        >
          <h2 class="text-xl font-bold">§5 - Các trường hợp đặc biệt</h2>
          <div class="mt-4 space-y-3">
            <article
              v-for="(item, idx) in specialCases"
              :key="item.title"
              class="overflow-hidden rounded-xl border border-[#E5E7EB]"
            >
              <button
                class="flex w-full items-center justify-between bg-[#F9FAFB] px-4 py-3 text-left"
                @click="toggleAccordion(idx)"
              >
                <span class="font-medium">{{ item.title }}</span>
                <span
                  class="text-xl text-[#F97316] transition-transform"
                  :class="{ 'rotate-45': openAccordion === idx }"
                  >+</span
                >
              </button>
              <div
                class="accordion-body"
                :class="{ 'is-open': openAccordion === idx }"
              >
                <p class="px-4 pb-4 text-sm text-[#6B7280]">
                  {{ item.content }}
                </p>
              </div>
            </article>
          </div>
        </section>

        <section
          id="lien-he"
          class="spy-section rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-5"
        >
          <h2 class="text-xl font-bold">§6 - Liên hệ hỗ trợ đổi trả</h2>
          <div class="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
            <p class="rounded-lg border border-[#DCFCE7] bg-white p-3">
              Hotline: <strong>{{ settingsStore.phone }}</strong>
            </p>
            <p class="rounded-lg border border-[#DCFCE7] bg-white p-3">
              Zalo: <strong>SmartFood Support</strong>
            </p>
            <p class="rounded-lg border border-[#DCFCE7] bg-white p-3">
              Email: <strong>{{ settingsStore.email }}</strong>
            </p>
          </div>

          <!-- <form
            class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
            @submit.prevent="handleSubmit"
          >
            <input
              v-model="orderCode"
              class="h-11 rounded-lg border border-[#D1D5DB] px-3"
              placeholder="Mã đơn hàng"
            />
            <select
              v-model="reason"
              class="h-11 rounded-lg border border-[#D1D5DB] px-3"
            >
              <option value="">Chọn lý do</option>
              <option
                v-for="option in reasonOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
            <button
              class="h-11 rounded-lg bg-[#F97316] px-5 font-semibold text-white transition hover:bg-[#EA580C]"
              :disabled="isSubmitting"
            >
              {{
                isSubmitting
                  ? "Đang gửi..."
                  : submitSuccess
                    ? "Đã gửi thành công"
                    : "Gửi yêu cầu"
              }}
            </button>
          </form> -->
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { useSettingsStore } from "~/stores/useSettingsStore";

const settingsStore = useSettingsStore();

const quickSummary = computed(() => [
  "Đổi trả trong 24h kể từ khi nhận hàng",
  "Sản phẩm lỗi / hư hỏng được đổi miễn phí",
  "Hoàn tiền 100% nếu không tìm được hàng thay thế",
  "Không đổi trả thực phẩm đã mở seal/bóc gói",
  "Cần giữ hóa đơn và ảnh chụp sản phẩm lỗi",
  `Hotline hỗ trợ đổi trả: ${settingsStore.phone} (miễn phí)`,
]);

const sections = [
  { id: "dieu-kien", title: "Điều kiện đổi trả" },
  { id: "thoi-han", title: "Thời hạn xử lý" },
  { id: "quy-trinh", title: "Quy trình 4 bước" },
  { id: "hoan-tien", title: "Hình thức hoàn tiền" },
  { id: "dac-biet", title: "Trường hợp đặc biệt" },
  { id: "lien-he", title: "Liên hệ hỗ trợ" },
];

const accepted = [
  "Hàng lỗi do vận chuyển",
  "Hàng hết hạn khi giao",
  "Giao sai sản phẩm",
  "Hàng kém chất lượng",
];
const rejected = [
  "Hàng đã bóc seal",
  "Hàng tươi sống đã nhận >2h",
  "Lý do cá nhân không thích",
  "Đặt nhầm sản phẩm",
];

const timelines = [
  { time: "0-2h", desc: "Phát hiện ngay khi giao -> Đổi tại chỗ" },
  { time: "2-24h", desc: "Trong ngày nhận -> Hotline/App xử lý" },
  { time: "24-48h", desc: "Sản phẩm đặc biệt -> Xem xét case by case" },
  { time: ">48h", desc: "Hết thời hạn -> Không áp dụng" },
];

const processSteps = [
  { title: "📸 Bước 1", desc: "Chụp ảnh sản phẩm lỗi + giữ hóa đơn" },
  {
    title: "📞 Bước 2",
    desc: "Liên hệ hotline hoặc gửi yêu cầu hỗ trợ qua zalo",
  },
  // { title: "📞 Bước 2", desc: "Liên hệ hotline hoặc gửi yêu cầu hỗ trợ" },
  { title: "🚚 Bước 3", desc: "Shipper đến thu hồi hoặc giao hàng mới" },
  { title: "✅ Bước 4", desc: "Hoàn tất - Hoàn tiền hoặc đổi hàng mới" },
];

const refundMethods = [
  {
    icon: "🏦",
    title: "Chuyển khoản ngân hàng",
    time: "1-3 ngày làm việc",
    note: "Áp dụng theo thông tin tài khoản khách hàng",
  },
  {
    icon: "💰",
    title: "Tiền mặt khi thu hồi",
    time: "Trong ngày",
    note: "Áp dụng với khu vực nội thành",
  },
];

const specialCases = [
  {
    title: "Sản phẩm đặt hàng theo yêu cầu",
    content:
      "Các mặt hàng đặt riêng sẽ được hỗ trợ đổi trả theo biên bản xác nhận trước khi đặt.",
  },
  // {
  //   title: "Combo/Set sản phẩm",
  //   content:
  //     "Nếu combo có sản phẩm lỗi, SmartFood xử lý đổi từng phần hoặc đổi trọn bộ tùy tình trạng hàng.",
  // },
  {
    title: "Sản phẩm khuyến mãi / flash sale",
    content:
      "Vẫn hỗ trợ đổi trả khi lỗi chất lượng, tuy nhiên cần cung cấp mã đơn và hình ảnh đầy đủ.",
  },
  {
    title: "Thực phẩm tươi sống và đông lạnh",
    content:
      "Ưu tiên xử lý nhanh trong 2h kể từ khi nhận để đảm bảo tính khách quan về chất lượng.",
  },
];

const reasonOptions = [
  "Sản phẩm lỗi",
  "Sản phẩm hư hỏng",
  "Giao sai hàng",
  "Yêu cầu hoàn tiền",
];

const activeSection = ref("dieu-kien");
const readingProgress = ref(0);
const sidebarProgress = ref(0);
const activeStep = ref(0);
const openAccordion = ref<number | null>(0);

const orderCode = ref("");
const reason = ref("");
const isSubmitting = ref(false);
const submitSuccess = ref(false);

const toggleAccordion = (idx: number) => {
  openAccordion.value = openAccordion.value === idx ? null : idx;
};

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const handleSubmit = () => {
  isSubmitting.value = true;
  submitSuccess.value = false;
  setTimeout(() => {
    isSubmitting.value = false;
    submitSuccess.value = true;
  }, 900);
};

const handleScroll = () => {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  readingProgress.value =
    height > 0 ? Math.min((scrollTop / height) * 100, 100) : 0;

  const sectionElements = sections
    .map((s) => document.getElementById(s.id))
    .filter((el): el is HTMLElement => !!el);

  sectionElements.forEach((el, idx) => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= 160 && rect.bottom >= 160) {
      const section = sections[idx];
      if (!section) return;
      activeSection.value = section.id;
      sidebarProgress.value = ((idx + 1) / sections.length) * 100;
      activeStep.value = Math.min(3, idx);
    }
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.exchange-pattern {
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.08) 1.1px,
    transparent 1.1px
  );
  background-size: 18px 18px;
}

.spin-soft {
  animation: spinSoft 5s linear infinite;
}

.spy-section {
  scroll-margin-top: 100px;
}

.condition-card {
  transition:
    transform 0.25s ease,
    border-color 0.25s ease;
}

.condition-card:hover {
  transform: translateY(-4px);
}

.timeline-item {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInStagger 0.45s ease forwards;
}

.timeline-item:nth-child(1) {
  animation-delay: 0.05s;
}
.timeline-item:nth-child(2) {
  animation-delay: 0.15s;
}
.timeline-item:nth-child(3) {
  animation-delay: 0.25s;
}
.timeline-item:nth-child(4) {
  animation-delay: 0.35s;
}

.accordion-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion-body.is-open {
  max-height: 180px;
}

@keyframes spinSoft {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(12deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes fadeInStagger {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
