<template>
  <div class="vct-page">
    <!-- ═══════════════════════════════════════
         SECTION 1 — HERO CINEMATIC
         ═══════════════════════════════════════ -->
    <section class="hero" ref="heroRef">
      <!-- SVG Pattern lá cây mờ nhạt -->
      <div class="hero-pattern" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="leaf"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 10 C40 10 50 20 50 30 C50 40 40 50 30 50 C20 50 10 40 10 30 C10 20 20 10 30 10Z M30 10 Q35 20 30 30 Q25 20 30 10Z"
                fill="white"
                fill-opacity="0.08"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leaf)" />
        </svg>
      </div>

      <div class="hero-content" :class="{ visible: heroVisible }">
        <span class="hero-badge">✦ Thành lập 2026 ✦</span>
        <h1 class="hero-title">Câu Chuyện Của SmartFood</h1>
        <p class="hero-sub">
          Hành trình mang thực phẩm sạch, an toàn đến từng bữa ăn Việt
        </p>
        <div class="hero-stats">
          <div class="hero-stat" v-for="s in heroStats" :key="s.label">
            <span class="hero-stat-num">{{ s.display }}{{ s.suffix }}</span>
            <span class="hero-stat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         SECTION 2 — CÂU CHUYỆN THƯƠNG HIỆU
         ═══════════════════════════════════════ -->
    <section class="story-section">
      <div class="sw">
        <div class="story-grid">
          <!-- Ảnh bên trái -->
          <div class="story-img-wrap reveal" ref="storyImgRef">
            <div class="story-img-placeholder">
              <div class="story-img-overlay" />
              <div class="story-img-center">
                <svg viewBox="0 0 120 120" fill="none" class="story-svg">
                  <circle
                    cx="60"
                    cy="60"
                    r="55"
                    fill="rgba(255,255,255,0.1)"
                    stroke="rgba(255,255,255,0.2)"
                    stroke-width="2"
                  />
                  <path
                    d="M60 30 Q75 45 60 60 Q45 75 60 90"
                    stroke="white"
                    stroke-width="3"
                    stroke-linecap="round"
                    fill="none"
                  />
                  <path
                    d="M40 50 Q60 45 80 50"
                    stroke="rgba(255,255,255,0.7)"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M35 65 Q60 58 85 65"
                    stroke="rgba(255,255,255,0.7)"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="8"
                    fill="white"
                    fill-opacity="0.3"
                  />
                </svg>
              </div>
              <span class="organic-badge">🌿 100% Organic</span>
            </div>
          </div>

          <!-- Text bên phải -->
          <div class="story-text reveal" ref="storyTextRef">
            <span class="story-label">VỀ CHÚNG TÔI</span>
            <h2 class="story-h2">Chúng Tôi Tin Vào<br />Thực Phẩm Sạch</h2>
            <p class="story-p">
              SmartFood ra đời năm 2018 từ một niềm tin đơn giản: mỗi gia đình
              Việt Nam xứng đáng được tiếp cận thực phẩm tươi ngon, an toàn và
              rõ nguồn gốc. Chúng tôi bắt đầu từ một cửa hàng nhỏ tại Đà Nẵng,
              với cam kết kết nối trực tiếp nông trại đến bàn ăn.
            </p>
            <p class="story-p">
              Hôm nay, SmartFood phục vụ hơn 500.000 gia đình, hợp tác cùng 50+
              nhà cung cấp được kiểm định nghiêm ngặt, và tiên phong xây dựng hệ
              thống thương mại điện tử thực phẩm sạch hàng đầu miền Trung.
            </p>
            <ul class="story-bullets">
              <li v-for="b in storyBullets" :key="b">
                <span class="bullet-check">✓</span>{{ b }}
              </li>
            </ul>
            <div class="story-btns">
              <button class="btn-primary">Xem sản phẩm của chúng tôi</button>
              <button class="btn-outline">Liên hệ</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         SECTION 3 — SỨ MỆNH & GIÁ TRỊ CỐT LÕI
         ═══════════════════════════════════════ -->
    <section class="mission-section">
      <div class="sw">
        <div class="section-header reveal" ref="missionHdrRef">
          <h2 class="section-title">Sứ Mệnh &amp; Giá Trị</h2>
          <p class="section-sub">
            Những nguyên tắc định hướng mọi quyết định của chúng tôi
          </p>
        </div>
        <div class="mission-grid">
          <div
            v-for="(m, i) in missionCards"
            :key="m.title"
            class="mission-card reveal"
            :style="{ transitionDelay: `${i * 120}ms` }"
            :ref="(el) => observeEl(el)"
          >
            <div class="mission-icon-wrap" v-html="m.icon" />
            <h3 class="mission-card-title">{{ m.title }}</h3>
            <p class="mission-card-text">{{ m.text }}</p>
          </div>
        </div>

        <!-- 4 giá trị cốt lõi -->
        <div class="core-values reveal" :ref="(el) => observeEl(el)">
          <div v-for="v in coreValues" :key="v.label" class="core-val">
            <span class="core-val-icon">{{ v.icon }}</span>
            <span class="core-val-label">{{ v.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         SECTION 4 — TIMELINE HÀNH TRÌNH
         ═══════════════════════════════════════ -->
    <section class="timeline-section">
      <div class="sw">
        <div class="section-header reveal" :ref="(el) => observeEl(el)">
          <h2 class="section-title">Hành Trình Phát Triển</h2>
          <p class="section-sub">
            Từng bước vững chắc trên con đường mang thực phẩm sạch đến mọi nhà
          </p>
        </div>
        <div class="timeline">
          <div
            class="timeline-line"
            ref="timelineLineRef"
            :style="{ height: timelineHeight }"
          />
          <div
            v-for="(item, i) in timeline"
            :key="item.year"
            class="tl-item reveal"
            :class="{ 'tl-right': i % 2 === 0, 'tl-left': i % 2 !== 0 }"
            :style="{ transitionDelay: `${i * 150}ms` }"
            :ref="(el) => observeEl(el)"
          >
            <div class="tl-dot">
              <span class="tl-pulse" />
              <span class="tl-inner" />
            </div>
            <div class="tl-card">
              <span class="tl-year">{{ item.year }}</span>
              <h4 class="tl-title">{{ item.title }}</h4>
              <p class="tl-desc">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         SECTION 5 — ĐỘI NGŨ
         ═══════════════════════════════════════ -->
    <section class="team-section">
      <div class="sw">
        <div class="section-header reveal" :ref="(el) => observeEl(el)">
          <h2 class="section-title">Đội Ngũ Lãnh Đạo</h2>
          <p class="section-sub">
            Những con người tâm huyết đứng sau SmartFood
          </p>
        </div>
        <div class="team-grid">
          <div
            v-for="(member, i) in team"
            :key="member.name"
            class="team-card reveal"
            :style="[
              { transitionDelay: `${i * 120}ms` },
              tiltStyles[i] ? { transform: tiltStyles[i] } : {},
            ]"
            :ref="(el) => observeEl(el)"
            @mousemove="handleTilt($event, i)"
            @mouseleave="resetTilt(i)"
          >
            <div class="team-card-inner">
              <div class="team-avatar" :style="{ background: member.gradient }">
                <span class="team-initials">{{ member.initials }}</span>
              </div>
              <h3 class="team-name">{{ member.name }}</h3>
              <p class="team-role">{{ member.role }}</p>
              <p class="team-quote">"{{ member.quote }}"</p>
              <!-- Hover overlay bio -->
              <div class="team-bio-overlay">
                <p class="team-bio">{{ member.bio }}</p>
                <div class="team-socials">
                  <span
                    v-for="s in member.socials"
                    :key="s"
                    class="team-social"
                    >{{ s }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="team-footer reveal" :ref="(el) => observeEl(el)">
          Cùng <strong>+200 nhân viên</strong> tận tâm trên toàn quốc
        </p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         SECTION 6 — CAM KẾT & CHỨNG NHẬN
         ═══════════════════════════════════════ -->
    <section class="cert-section">
      <div class="sw">
        <div class="section-header reveal" :ref="(el) => observeEl(el)">
          <h2 class="section-title">Cam Kết Của Chúng Tôi</h2>
          <p class="section-sub">
            Tiêu chuẩn chất lượng mà chúng tôi không bao giờ thỏa hiệp
          </p>
        </div>
        <div class="cert-grid">
          <div
            v-for="(c, i) in certs"
            :key="c.title"
            class="cert-item reveal"
            :style="{ transitionDelay: `${i * 100}ms` }"
            :ref="(el) => observeEl(el)"
          >
            <span class="cert-icon">{{ c.icon }}</span>
            <h3 class="cert-title">{{ c.title }}</h3>
            <p class="cert-badge-text">{{ c.badge }}</p>
            <p class="cert-desc">{{ c.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         SECTION 7 — LOGO ĐỐI TÁC (MARQUEE)
         ═══════════════════════════════════════ -->
    <section class="partner-section">
      <div class="sw">
        <div class="section-header reveal" :ref="(el) => observeEl(el)">
          <h2 class="section-title">Đối Tác Tin Cậy</h2>
          <p class="section-sub">
            Hệ sinh thái nhà cung cấp được kiểm định nghiêm ngặt
          </p>
        </div>
      </div>
      <div class="marquee-wrap">
        <div class="marquee-track">
          <div
            v-for="(p, idx) in [...partners, ...partners]"
            :key="`partner-${idx}`"
            class="partner-logo"
          >
            {{ p }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

// ═══ CÁC REFS ════════════════════════════════════════════
const heroRef = ref<HTMLElement | null>(null);
const heroVisible = ref(false);
const timelineLineRef = ref<HTMLElement | null>(null);
const timelineHeight = ref("0%");

// ═══ DỮ LIỆU HERO ════════════════════════════════════════
interface HeroStat {
  label: string;
  target: number;
  display: string;
  suffix: string;
}
const heroStats = reactive<HeroStat[]>([
  { label: "Năm kinh nghiệm", target: 6, display: "0", suffix: "+" },
  { label: "Khách hàng", target: 500000, display: "0", suffix: "+" },
  { label: "Nhà cung cấp", target: 50, display: "0", suffix: "+" },
]);

// ═══ CÂU CHUYỆN ══════════════════════════════════════════
const storyBullets = [
  "Truy xuất nguồn gốc 100% mọi sản phẩm",
  "Kiểm định chất lượng tại trang trại",
  "Chuỗi vận chuyển lạnh đảm bảo độ tươi",
];

// ═══ SỨ MỆNH & GIÁ TRỊ ══════════════════════════════════
const missionCards = [
  {
    title: "Sứ Mệnh",
    icon: `<svg viewBox="0 0 48 48" fill="none" class="mc-svg"><circle cx="24" cy="24" r="18" stroke="#F97316" stroke-width="3"/><circle cx="24" cy="24" r="8" fill="#F97316" fill-opacity="0.2" stroke="#F97316" stroke-width="2"/><circle cx="24" cy="24" r="3" fill="#F97316"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6" stroke="#F97316" stroke-width="2" stroke-linecap="round"/></svg>`,
    text: "Mang đến cho mỗi gia đình Việt Nam thực phẩm sạch, tươi ngon, an toàn với giá cả hợp lý — kết nối trực tiếp từ nông trại đến bàn ăn, không có khoảng cách.",
  },
  {
    title: "Tầm Nhìn",
    icon: `<svg viewBox="0 0 48 48" fill="none" class="mc-svg"><ellipse cx="24" cy="24" rx="20" ry="12" stroke="#F97316" stroke-width="3"/><circle cx="24" cy="24" r="5" fill="#F97316"/><path d="M4 24C4 24 10 10 24 10C38 10 44 24 44 24" stroke="#F97316" stroke-width="2" stroke-dasharray="3 3"/></svg>`,
    text: "Trở thành nền tảng thương mại điện tử thực phẩm sạch số 1 Việt Nam vào năm 2028, phục vụ 2 triệu gia đình với hơn 5.000 sản phẩm hữu cơ được chứng nhận.",
  },
  {
    title: "Giá Trị",
    icon: `<svg viewBox="0 0 48 48" fill="none" class="mc-svg"><path d="M24 8 C16 8 8 16 8 22 C8 32 24 42 24 42 C24 42 40 32 40 22 C40 16 32 8 24 8Z" stroke="#F97316" stroke-width="3" fill="#F97316" fill-opacity="0.1"/><path d="M19 22l3.5 3.5L29 18" stroke="#F97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    text: "Trung thực trong từng sản phẩm, minh bạch từng nguồn gốc, tận tâm từng dịch vụ. Chúng tôi tin rằng niềm tin của khách hàng là tài sản quý giá nhất.",
  },
];

const coreValues = [
  { icon: "💎", label: "Chất lượng" },
  { icon: "🤝", label: "Uy tín" },
  { icon: "🥬", label: "Tươi ngon" },
  { icon: "♻️", label: "Bền vững" },
];

// ═══ TIMELINE ════════════════════════════════════════════
const timeline = [
  {
    year: "2018",
    title: "Khai sinh SmartFood",
    desc: "Thành lập tại Đà Nẵng với cửa hàng đầu tiên, cam kết 100% thực phẩm sạch từ nông trại địa phương.",
  },
  {
    year: "2019",
    title: "Mở rộng danh mục",
    desc: "Ra mắt hơn 500 sản phẩm từ rau củ, trái cây đến thịt cá hữu cơ, hợp tác cùng 10 trang trại đối tác.",
  },
  {
    year: "2020",
    title: "Nền tảng online ra đời",
    desc: "Ứng dụng SmartFood ra mắt, mang đến trải nghiệm mua sắm thực phẩm sạch 24/7 ngay trên điện thoại.",
  },
  {
    year: "2022",
    title: "100.000 khách hàng",
    desc: "Cột mốc 100.000 gia đình tin tưởng, mở rộng giao hàng toàn tỉnh Quảng Nam và bắt đầu phủ sóng TP.HCM.",
  },
  {
    year: "2024",
    title: "Hệ sinh thái 50+ đối tác",
    desc: "Hợp tác 50+ nhà cung cấp toàn quốc, đạt chứng nhận VSATTP, triển khai chuỗi lạnh tiêu chuẩn quốc tế.",
  },
];

// ═══ ĐỘI NGŨ ═════════════════════════════════════════════
const team = [
  {
    name: "Nguyễn Minh Tuấn",
    role: "CEO & Co-Founder",
    initials: "NMT",
    gradient: "linear-gradient(135deg, #F97316, #EA580C)",
    quote: "Thực phẩm sạch không phải xa xỉ phẩm — đó là quyền cơ bản",
    bio: "10 năm kinh nghiệm ngành FMCG, từng làm việc tại Vincommerce và Big C trước khi sáng lập SmartFood.",
    socials: ["LinkedIn", "Twitter"],
  },
  {
    name: "Trần Thị Lan Anh",
    role: "COO & Co-Founder",
    initials: "TLA",
    gradient: "linear-gradient(135deg, #16A34A, #15803D)",
    quote:
      "Vận hành tốt là khi khách hàng nhận hàng mà không nghĩ đến vận hành",
    bio: "Chuyên gia chuỗi cung ứng lạnh với 8 năm kinh nghiệm tại Masan Consumer và Cargill Việt Nam.",
    socials: ["LinkedIn"],
  },
  {
    name: "Lê Hoàng Nam",
    role: "CTO",
    initials: "LHN",
    gradient: "linear-gradient(135deg, #6366F1, #4F46E5)",
    quote: "Công nghệ là cầu nối giữa nông trại và bàn ăn",
    bio: "Senior Engineer với kinh nghiệm tại Grab và Tiki, chủ trì xây dựng toàn bộ platform SmartFood từ đầu.",
    socials: ["GitHub", "LinkedIn"],
  },
  {
    name: "Phạm Đình Khoa",
    role: "Head of Sourcing",
    initials: "PDK",
    gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
    quote: "Mỗi sản phẩm tốt bắt đầu từ mảnh đất tốt",
    bio: "Kỹ sư nông nghiệp, 12 năm làm việc với nông dân trên khắp Tây Nguyên và miền Trung, am hiểu sâu về canh tác hữu cơ.",
    socials: ["LinkedIn"],
  },
];

// ═══ CAM KẾT ═════════════════════════════════════════════
const certs = [
  {
    icon: "🛡️",
    title: "An toàn thực phẩm",
    badge: "VSATTP certified",
    desc: "Đạt chứng nhận Vệ sinh An toàn Thực phẩm từ Bộ Y tế, kiểm tra định kỳ hàng quý.",
  },
  {
    icon: "🌿",
    title: "Nguồn gốc rõ ràng",
    badge: "Truy xuất 100%",
    desc: "Mọi sản phẩm đều có QR code truy xuất đến tận mảnh vườn, người nông dân.",
  },
  {
    icon: "🚚",
    title: "Giao hàng lạnh",
    badge: "Cold chain chuẩn EU",
    desc: "Chuỗi vận chuyển lạnh 2–8°C đảm bảo độ tươi từ kho đến tay khách hàng.",
  },
  {
    icon: "♻️",
    title: "Bao bì sinh thái",
    badge: "Eco-friendly packaging",
    desc: "Sử dụng túi sinh học phân hủy và hộp tái chế, giảm 70% rác thải nhựa.",
  },
];

// ═══ ĐỐI TÁC ═════════════════════════════════════════════
const partners = [
  "Trang Trại Đà Lạt Xanh",
  "Nông Nghiệp Hòa Bình",
  "VinEco Organic",
  "Thanh Long Bình Thuận",
  "Rau Sạch Mộc Châu",
  "Hải Sản Hội An",
  "Bò Một Nắng Phú Yên",
  "Nấm Tươi Lâm Đồng",
];

// ═══ TILT EFFECT ════════════════════════════════════════
const tiltStyles = reactive<Record<number, string>>({});
const handleTilt = (e: MouseEvent, i: number) => {
  const card = e.currentTarget as HTMLElement;
  const rect = card.getBoundingClientRect();
  const x = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
  const y = -((e.clientX - rect.left) / rect.width - 0.5) * 10;
  tiltStyles[i] =
    `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(1.02)`;
};
const resetTilt = (i: number) => {
  tiltStyles[i] = "";
};

// ═══ SCROLL REVEAL ═══════════════════════════════════════
const observeEl = (el: any) => {
  if (!el) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  obs.observe(el);
};

// ═══ COUNTUP ═════════════════════════════════════════════
const countUp = (stat: HeroStat) => {
  const dur = 2000;
  const step = 16;
  const inc = stat.target / (dur / step);
  let cur = 0;
  const t = setInterval(() => {
    cur = Math.min(cur + inc, stat.target);
    stat.display =
      stat.target >= 1000
        ? Math.floor(cur).toLocaleString("vi-VN")
        : Math.floor(cur).toString();
    if (cur >= stat.target) clearInterval(t);
  }, step);
};

// ═══ TIMELINE LINE DRAW ══════════════════════════════════
const animateTimeline = () => {
  let progress = 0;
  const t = setInterval(() => {
    progress = Math.min(progress + 2, 100);
    timelineHeight.value = `${progress}%`;
    if (progress >= 100) clearInterval(t);
  }, 20);
};

// ═══ LIFECYCLE ═══════════════════════════════════════════
onMounted(() => {
  // Reveal all .reveal elements
  document.querySelectorAll(".reveal").forEach((el) => observeEl(el));

  // Hero animation + countUp after short delay
  setTimeout(() => {
    heroVisible.value = true;
    heroStats.forEach((s, i) => setTimeout(() => countUp(s), 400 + i * 200));
  }, 100);

  // Timeline line draw on scroll
  const timelineObs = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        animateTimeline();
        timelineObs.disconnect();
      }
    },
    { threshold: 0.1 },
  );
  const timelineSection = document.querySelector(".timeline-section");
  if (timelineSection) timelineObs.observe(timelineSection);
});
</script>

<style scoped>
.vct-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #1f2937;
  background: white;
  overflow-x: hidden;
}

/* ── Scroll reveal ────────────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: none;
}

/* ── Common ───────────────────────────────────────────── */
.sw {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
}
.section-title {
  font-size: 1.875rem;
  font-weight: 900;
  color: #111827;
  text-align: center;
  margin: 0 0 0.5rem;
}
.section-sub {
  font-size: 0.95rem;
  color: #6b7280;
  text-align: center;
  margin: 0 0 2.5rem;
}
.section-header {
  margin-bottom: 0;
}

/* ── HERO ──────────────────────────────────────────────── */
.hero {
  position: relative;
  height: 380px;
  background:
    linear-gradient(160deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.35) 100%),
    #15803d;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.hero-pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}
.hero-content.visible {
  opacity: 1;
  transform: none;
}

.hero-badge {
  display: inline-block;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  padding: 0.375rem 1.25rem;
  border-radius: 9999px;
  margin-bottom: 1rem;
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.08);
}
.hero-title {
  font-size: 2.625rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.75rem;
  line-height: 1.2;
}
.hero-sub {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 auto 2rem;
  max-width: 520px;
}
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1.5rem;
  margin-top: 0.5rem;
}
.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}
.hero-stat-num {
  font-size: 1.875rem;
  font-weight: 900;
  color: #fed7aa;
  line-height: 1;
}
.hero-stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
}

/* ── STORY ─────────────────────────────────────────────── */
.story-section {
  padding: 5rem 0;
  background: white;
}
.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
  align-items: center;
}

.story-img-placeholder {
  background: linear-gradient(135deg, #16a34a, #15803d);
  border-radius: 1.5rem;
  aspect-ratio: 4/3;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.story-img-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 60%;
  height: 60%;
  background: linear-gradient(135deg, transparent, rgba(249, 115, 22, 0.5));
  border-radius: 1.5rem 0 1.5rem 0;
}
.story-img-center {
  position: relative;
  z-index: 1;
}
.story-svg {
  width: 8rem;
  height: 8rem;
}
.organic-badge {
  position: absolute;
  bottom: 1.25rem;
  left: 1.25rem;
  background: white;
  color: #16a34a;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.story-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #f97316;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
.story-h2 {
  font-size: 2rem;
  font-weight: 900;
  color: #111827;
  margin: 0 0 1.25rem;
  line-height: 1.25;
}
.story-p {
  font-size: 0.9375rem;
  color: #4b5563;
  line-height: 1.8;
  margin: 0 0 1rem;
}

.story-bullets {
  list-style: none;
  padding: 0;
  margin: 1rem 0 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}
.story-bullets li {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}
.bullet-check {
  color: #16a34a;
  font-weight: 900;
  font-size: 1rem;
  flex-shrink: 0;
}

.story-btns {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.btn-primary {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  border: none;
  border-radius: 12px;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.35);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.5);
}
.btn-outline {
  background: white;
  color: #f97316;
  font-weight: 700;
  font-size: 0.9rem;
  border: 2px solid #f97316;
  border-radius: 12px;
  padding: 0.85rem 1.5rem;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.btn-outline:hover {
  background: #f97316;
  color: white;
}

/* ── MISSION ───────────────────────────────────────────── */
.mission-section {
  padding: 5rem 0;
  background: #fff7ed;
}
.mission-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}
.mission-card {
  background: white;
  border-radius: 1.25rem;
  border: 1.5px solid #e5e7eb;
  border-top: 3px solid #f97316;
  padding: 2rem 1.5rem;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
.mission-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(249, 115, 22, 0.12);
}
.mission-icon-wrap {
  margin-bottom: 1.25rem;
}
:deep(.mc-svg) {
  width: 3rem;
  height: 3rem;
}
.mission-card-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.75rem;
}
.mission-card-text {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.75;
  margin: 0;
}

.core-values {
  background: white;
  border-radius: 1.25rem;
  border: 1.5px solid #fed7aa;
  padding: 1.75rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  text-align: center;
}
.core-val {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.core-val-icon {
  font-size: 2rem;
}
.core-val-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
}

/* ── TIMELINE ──────────────────────────────────────────── */
.timeline-section {
  padding: 5rem 0;
  background: white;
}
.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}
.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 3px;
  background: linear-gradient(to bottom, #f97316, #ea580c);
  border-radius: 3px;
  transition: height 2s ease;
}
.tl-item {
  position: relative;
  display: flex;
  justify-content: flex-end;
  padding-right: calc(50% + 2.5rem);
  margin-bottom: 2.5rem;
}
.tl-item.tl-left {
  justify-content: flex-start;
  padding-right: 0;
  padding-left: calc(50% + 2.5rem);
}

.tl-dot {
  position: absolute;
  left: 50%;
  top: 1.25rem;
  transform: translateX(-50%);
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tl-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(249, 115, 22, 0.35);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
.tl-inner {
  width: 0.75rem;
  height: 0.75rem;
  background: #f97316;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.3);
  position: relative;
  z-index: 1;
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.6);
    opacity: 0;
  }
}
.tl-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  max-width: 320px;
  width: 100%;
  transition:
    box-shadow 0.3s,
    transform 0.3s;
}
.tl-card:hover {
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.15);
  transform: scale(1.02);
}
.tl-year {
  font-size: 0.8rem;
  font-weight: 700;
  color: #f97316;
}
.tl-title {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin: 0.25rem 0 0.5rem;
}
.tl-desc {
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.65;
  margin: 0;
}

/* ── TEAM ──────────────────────────────────────────────── */
.team-section {
  padding: 5rem 0;
  background: #f9fafb;
}
.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.team-card {
  border-radius: 1.25rem;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
.team-card:hover {
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
}
.team-card-inner {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 2rem 1.25rem 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.team-avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}
.team-initials {
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
}
.team-name {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.25rem;
}
.team-role {
  font-size: 0.78rem;
  font-weight: 600;
  color: #f97316;
  margin: 0 0 0.75rem;
}
.team-quote {
  font-size: 0.8rem;
  color: #6b7280;
  font-style: italic;
  line-height: 1.5;
  margin: 0;
}

/* Hover overlay bio */
.team-bio-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(21, 128, 61, 0.95),
    rgba(22, 163, 74, 0.95)
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.35s ease;
  border-radius: 1.25rem;
}
.team-card-inner:hover .team-bio-overlay {
  opacity: 1;
}
.team-bio {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.65;
  text-align: center;
  margin: 0;
}
.team-socials {
  display: flex;
  gap: 0.5rem;
}
.team-social {
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
}
.team-footer {
  text-align: center;
  font-size: 1rem;
  color: #6b7280;
}
.team-footer strong {
  color: #f97316;
}

/* ── CERTS ─────────────────────────────────────────────── */
.cert-section {
  padding: 4rem 0;
  background: white;
  border-top: 2px solid #fed7aa;
  border-bottom: 2px solid #fed7aa;
}
.cert-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.cert-item {
  text-align: center;
  padding: 1.75rem 1rem;
  border-radius: 1.25rem;
  border: 1.5px solid #e5e7eb;
  background: #fafafa;
  transition:
    background 0.3s,
    box-shadow 0.3s,
    transform 0.3s;
}
.cert-item:hover {
  background: #fff7ed;
  border-color: #fed7aa;
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.12);
  transform: translateY(-4px);
}
.cert-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.75rem;
}
.cert-title {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.25rem;
}
.cert-badge-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: #f97316;
  margin: 0 0 0.625rem;
}
.cert-desc {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* ── PARTNER MARQUEE ───────────────────────────────────── */
.partner-section {
  padding: 4rem 0;
  background: white;
  overflow: hidden;
}
.marquee-wrap {
  overflow: hidden;
  margin-top: 1rem;
}
.marquee-track {
  display: flex;
  gap: 1.5rem;
  width: max-content;
  animation: marquee 25s linear infinite;
}
.marquee-track:hover {
  animation-play-state: paused;
}
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
.partner-logo {
  background: #f3f4f6;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 0.875rem;
  white-space: nowrap;
  border: 1.5px solid #e5e7eb;
  cursor: pointer;
  filter: grayscale(100%);
  opacity: 0.75;
  transition:
    filter 0.3s,
    opacity 0.3s,
    background 0.3s,
    color 0.3s;
}
.partner-logo:hover {
  filter: grayscale(0%);
  opacity: 1;
  background: #fff7ed;
  color: #ea580c;
  border-color: #fed7aa;
}

/* ── RESPONSIVE ────────────────────────────────────────── */
@media (max-width: 1024px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .cert-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .mission-grid {
    grid-template-columns: 1fr;
  }
  .core-values {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .hero {
    height: auto;
    padding: 4rem 1.5rem;
  }
  .hero-title {
    font-size: 1.75rem;
  }
  .hero-sub {
    font-size: 1rem;
  }
  .hero-stats {
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  .story-grid {
    grid-template-columns: 1fr;
  }
  .timeline-line {
    left: 1.25rem;
  }
  .tl-item {
    justify-content: flex-start;
    padding-right: 0;
    padding-left: 3.5rem;
  }
  .tl-item.tl-left {
    padding-left: 3.5rem;
  }
  .tl-dot {
    left: 1.25rem;
  }
  .tl-card {
    max-width: none;
  }
  .cert-grid {
    grid-template-columns: 1fr 1fr;
  }
  .team-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 480px) {
  .cert-grid {
    grid-template-columns: 1fr;
  }
  .team-grid {
    grid-template-columns: 1fr;
  }
  .core-values {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
