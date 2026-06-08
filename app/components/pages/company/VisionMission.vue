<template>
  <div class="bg-white text-[#111827]">
    <!-- SECTION 1: Hero cinematic -->
    <section class="relative h-80 overflow-hidden">
      <div class="absolute inset-0 hero-gradient"></div>
      <div class="absolute inset-0 leaf-pattern"></div>

      <div class="absolute inset-0 pointer-events-none">
        <span
          v-for="particle in particles"
          :key="particle.id"
          class="particle"
          :style="{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }"
        ></span>
      </div>

      <div
        class="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center text-white"
      >
        <div
          class="animate-item badge-enter border border-white/60 rounded-full px-5 py-1.5 text-xs sm:text-sm tracking-wide"
          data-delay="300"
        >
          ✦ Thành lập 2026 · Đà Nẵng ✦
        </div>
        <h1 class="animate-item hero-title mt-4" data-delay="0">
          Tầm Nhìn &amp; Sứ Mệnh
        </h1>
        <p class="animate-item hero-subtitle mt-3" data-delay="150">
          Hành trình xây dựng niềm tin - từng bữa ăn sạch mỗi ngày
        </p>
      </div>

      <div
        class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 animate-bounce"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>

    <!-- SECTION 2: Mission statement -->
    <section class="section-reveal relative bg-white noise-bg py-20 px-6">
      <div class="max-w-225 mx-auto relative">
        <div
          class="absolute -top-8 left-0 text-[120px] leading-none text-[#F97316]/20 select-none"
        >
          “
        </div>
        <blockquote
          class="relative text-[22px] md:text-[26px] leading-[1.7] italic font-light pl-8 md:pl-12"
        >
          Chúng tôi tin rằng mỗi gia đình Việt Nam xứng đáng được tiếp cận
          <span class="text-[#16A34A] font-medium">
            thực phẩm sạch, an toàn
          </span>
          và giá cả hợp lý.
        </blockquote>
        <div class="pl-8 md:pl-12 mt-8">
          <div class="w-15 h-0.75 bg-[#F97316]"></div>
          <p class="mt-3 text-sm text-[#6B7280]">CEO &amp; Founder SmartFood</p>
        </div>
      </div>
    </section>

    <!-- SECTION 3: Mission vs Vision -->
    <section class="section-reveal bg-[#F9FAFB] py-20 px-6">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <article
          class="card-equal mission-card bg-white rounded-2xl p-7 border border-[#E5E7EB] border-t-4 border-t-[#F97316] shadow-sm"
        >
          <div class="text-[#F97316] w-13 h-13">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2c.4 2.8-1.2 4.5-2.5 6.1C8 10 7 11.1 7 13a5 5 0 0010 0c0-3.6-2.7-5.7-5-11z"
              />
              <path
                d="M12 22a3 3 0 003-3c0-2.2-1.5-3.5-3-5-1.5 1.5-3 2.8-3 5a3 3 0 003 3z"
              />
            </svg>
          </div>
          <p class="mt-4 text-xs tracking-[0.15em] uppercase text-[#6B7280]">
            Sứ mệnh
          </p>
          <h3 class="mt-2 text-2xl font-bold">Nuôi dưỡng sức khỏe cộng đồng</h3>
          <p class="mt-4 text-[#6B7280] leading-7">
            SmartFood xây dựng hệ sinh thái thực phẩm sạch từ nguồn cung đáng
            tin cậy đến bàn ăn mỗi gia đình. Chúng tôi tập trung vào chất lượng
            ổn định, dịch vụ tử tế và trải nghiệm mua sắm minh bạch để tạo thói
            quen tiêu dùng tốt cho sức khỏe lâu dài.
          </p>
          <ul class="mt-5 space-y-2">
            <li
              v-for="item in missionBullets"
              :key="item"
              class="flex items-start gap-2 text-sm text-[#374151]"
            >
              <span class="text-[#16A34A] font-bold">✓</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </article>

        <article
          class="card-equal vision-card bg-[#F0FDF4] rounded-2xl p-7 border border-[#BBF7D0] border-t-4 border-t-[#16A34A] shadow-sm"
        >
          <div class="text-[#16A34A] w-13 h-13">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
              <path d="M15.5 8.5l3-3" />
            </svg>
          </div>
          <p class="mt-4 text-xs tracking-[0.15em] uppercase text-[#6B7280]">
            Tầm nhìn
          </p>
          <h3 class="mt-2 text-2xl font-bold">
            Trở thành chuỗi thực phẩm sạch #1 Đà Nẵng
          </h3>
          <p class="mt-4 text-[#6B7280] leading-7">
            SmartFood hướng tới tiêu chuẩn bán lẻ hiện đại, ứng dụng công nghệ
            để tối ưu truy xuất nguồn gốc, vận hành chuỗi lạnh và chăm sóc khách
            hàng toàn diện. Mục tiêu là trở thành thương hiệu được tin chọn hàng
            đầu cho mọi bữa ăn an toàn, tiện lợi và giàu dinh dưỡng.
          </p>
          <ul class="mt-5 space-y-2">
            <li
              v-for="item in visionBullets"
              :key="item"
              class="flex items-start gap-2 text-sm text-[#374151]"
            >
              <span class="text-[#16A34A] font-bold">✓</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <!-- SECTION 4: Core values -->
    <section class="section-reveal py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-center text-3xl font-extrabold">Giá Trị Cốt Lõi</h2>
        <div class="mx-auto mt-3 w-20 h-1 bg-[#F97316] rounded-full"></div>

        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <article
            v-for="(value, idx) in coreValues"
            :key="value.title"
            class="value-card relative border border-[#E5E7EB] rounded-2xl p-5 bg-white shadow-sm"
          >
            <span
              class="absolute top-3 right-4 text-5xl font-black text-[#F97316]/10"
              >{{ String(idx + 1).padStart(2, "0") }}</span
            >
            <div class="text-[40px]">{{ value.icon }}</div>
            <h3 class="mt-2 text-lg font-bold">{{ value.title }}</h3>
            <p class="mt-2 text-sm text-[#6B7280] leading-6">
              {{ value.desc }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- SECTION 5: Highlights -->
    <section
      class="section-reveal py-20 px-6 bg-linear-to-b from-[#FFF7ED] to-white"
    >
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="item in stats"
            :key="item.label"
            class="text-center px-6 py-8 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col items-center hover:shadow-md transition duration-300"
          >
            <span class="text-4xl mb-3">{{ item.icon }}</span>
            <p class="text-[#F97316] text-2xl font-extrabold">
              {{ item.value }}
            </p>
            <p class="mt-1.5 text-[#16A34A] font-bold text-sm">
              {{ item.label }}
            </p>
            <p class="mt-2 text-xs text-[#6B7280] leading-relaxed">
              {{ item.desc }}
            </p>
          </div>
        </div>

        <div class="mt-12 flex justify-center">
          <NuxtLink
            :to="ROUTES.HOME"
            class="w-full max-w-xs text-center bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3.5 px-6 rounded-xl transition shadow-lg shadow-[#F97316]/25 hover:shadow-xl hover:shadow-[#F97316]/35"
          >
            Khám phá sản phẩm của chúng tôi ->
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- SECTION 6: Commitments -->
    <section class="section-reveal py-20 px-6 bg-[#15803D]">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-center text-3xl font-extrabold text-white">
          Cam Kết Thương Hiệu
        </h2>
        <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          <article
            v-for="item in commitments"
            :key="item.title"
            class="rounded-2xl border border-white/20 bg-white/10 p-6 text-white transition hover:bg-white/15"
          >
            <p class="text-4xl">{{ item.icon }}</p>
            <h3 class="mt-3 text-xl font-bold">{{ item.title }}</h3>
            <p class="mt-2 text-white/85 leading-7">{{ item.desc }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ROUTES } from "~/constants/routes";

// Du lieu mock cho particles
const particles = [
  { id: 1, left: 10, top: 72, size: 8, delay: 0.2, duration: 4.2 },
  { id: 2, left: 20, top: 30, size: 10, delay: 0.9, duration: 5.1 },
  { id: 3, left: 34, top: 62, size: 7, delay: 1.4, duration: 4.6 },
  { id: 4, left: 49, top: 28, size: 11, delay: 2.2, duration: 5.4 },
  { id: 5, left: 62, top: 68, size: 9, delay: 0.5, duration: 4.9 },
  { id: 6, left: 74, top: 40, size: 12, delay: 1.7, duration: 5.6 },
  { id: 7, left: 86, top: 60, size: 8, delay: 2.8, duration: 4.4 },
];

const missionBullets = [
  "Kiểm soát chất lượng xuyên suốt chuỗi cung ứng",
  "Giá cả hợp lý cho nhu cầu hằng ngày",
  "Dịch vụ chăm sóc khách hàng tận tâm",
];

const visionBullets = [
  "Mở rộng mạng lưới phủ khắp Đà Nẵng",
  "Chuẩn hóa trải nghiệm mua sắm đa kênh",
  "Tạo tác động tích cực cho cộng đồng địa phương",
];

const coreValues = [
  {
    icon: "🌿",
    title: "Chất lượng thuần túy",
    desc: "Lựa chọn nguồn hàng sạch và minh bạch, ưu tiên tiêu chuẩn an toàn thực phẩm nghiêm ngặt.",
  },
  {
    icon: "🤝",
    title: "Uy tín & Minh bạch",
    desc: "Cam kết thông tin rõ ràng về xuất xứ, giá bán và chính sách hậu mãi cho mọi khách hàng.",
  },
  {
    icon: "🚀",
    title: "Đổi mới liên tục",
    desc: "Liên tục cải tiến dịch vụ, tối ưu công nghệ để việc mua thực phẩm sạch trở nên nhanh và tiện.",
  },
  {
    icon: "💚",
    title: "Trách nhiệm cộng đồng",
    desc: "Đồng hành cùng nông sản địa phương, lan tỏa lối sống lành mạnh và tiêu dùng bền vững.",
  },
];

const commitments = [
  {
    icon: "🌱",
    title: "Nguồn gốc rõ ràng",
    desc: "Truy xuất 100% thông tin sản phẩm trước khi đến tay khách hàng.",
  },
  {
    icon: "❄️",
    title: "Chuỗi lạnh chuẩn",
    desc: "Bảo quản đúng tiêu chuẩn và giao tận tay luôn tươi ngon.",
  },
  {
    icon: "🏆",
    title: "Kiểm định chất lượng",
    desc: "Đảm bảo đáp ứng tiêu chuẩn VSATTP trong toàn bộ quá trình vận hành.",
  },
];

const stats = ref([
  {
    label: "Khách hàng",
    value: "Đồng hành",
    desc: "Cung cấp bữa ăn sạch cho các gia đình Việt",
    icon: "👥",
  },
  {
    label: "Sản phẩm",
    value: "Đa dạng",
    desc: "Danh mục thực phẩm phong phú, an toàn",
    icon: "🥦",
  },
  {
    label: "Nhà cung cấp",
    value: "Uy tín",
    desc: "Hợp tác chặt chẽ cùng các nhà vườn đạt chuẩn",
    icon: "🏡",
  },
  {
    label: "Dịch vụ",
    value: "Tận tâm",
    desc: "Luôn đặt sự hài lòng của khách hàng lên đầu",
    icon: "💚",
  },
]);

onMounted(() => {
  // Hieu ung mount hero theo delay tung item
  const heroItems = document.querySelectorAll<HTMLElement>(".animate-item");
  heroItems.forEach((el) => {
    const delay = Number(el.dataset.delay || 0);
    setTimeout(() => {
      el.classList.add("is-visible");
    }, delay);
  });

  // Reveal section khi vao viewport
  const reveals = document.querySelectorAll<HTMLElement>(".section-reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.2 },
  );
  reveals.forEach((el) => revealObserver.observe(el));
});
</script>

<style scoped>
.hero-gradient {
  background: linear-gradient(135deg, #15803d 0%, #166534 50%, #14532d 100%);
}

.leaf-pattern {
  background-image:
    radial-gradient(
      circle at 20% 20%,
      rgba(255, 255, 255, 0.07) 0 2px,
      transparent 3px
    ),
    radial-gradient(
      circle at 70% 60%,
      rgba(255, 255, 255, 0.07) 0 2px,
      transparent 3px
    );
  background-size: 120px 120px;
}

.particle {
  position: absolute;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.1);
  animation: floatUpDown 5s ease-in-out infinite alternate;
}

.hero-title {
  font-size: clamp(30px, 5vw, 40px);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: clamp(15px, 2.4vw, 17px);
  opacity: 0.8;
}

.animate-item {
  opacity: 0;
  transform: translateY(22px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.animate-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.section-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
}

.section-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.noise-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    rgba(17, 24, 39, 0.04) 0.5px,
    transparent 0.5px
  );
  background-size: 4px 4px;
  pointer-events: none;
}

.card-equal {
  min-height: 470px;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.mission-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 28px rgba(15, 23, 42, 0.12);
  border-color: #fb923c;
}

.vision-card {
  animation: missionVisionEnter 0.6s ease both;
  animation-delay: 0.1s;
}

.mission-card {
  animation: missionVisionEnter 0.6s ease both;
}

.value-card::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background: #f97316;
  transition: width 0.3s ease;
}

.value-card:hover::after {
  width: 100%;
}

@keyframes floatUpDown {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
}

@keyframes missionVisionEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
