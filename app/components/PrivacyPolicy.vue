<template>
  <div class="csb-wrapper">
    <section class="csb-hero">
      <!-- Animated SVG pattern background -->
      <svg
        class="csb-hero-pattern"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
      >
        <defs>
          <pattern
            id="shieldPat"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M25 4 L42 12 L42 28 C42 38 34 46 25 50 C16 46 8 38 8 28 L8 12 Z"
              fill="none"
              stroke="white"
              stroke-width="1.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#shieldPat)" />
      </svg>

      <div class="csb-hero-inner reveal">
        <!-- Animated shield icon -->
        <div class="csb-hero-icon">
          <svg
            viewBox="0 0 64 64"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 3L10 13v18c0 13 9 24 22 28 13-4 22-15 22-28V13L32 3z"
            />
            <path
              d="M22 30l6 6 14-14"
              fill="none"
              stroke="white"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              opacity="0.9"
            />
          </svg>
        </div>

        <div class="csb-hero-text">
          <div class="csb-hero-badge">
            <span>Hiệu lực từ 01/01/2025</span>
            <span class="csb-badge-dot">•</span>
            <span>Phiên bản 2.0</span>
          </div>
          <h1>Chính Sách Bảo Mật</h1>
          <p>
            Chúng tôi cam kết bảo vệ quyền riêng tư và minh bạch tuyệt đối về
            cách xử lý dữ liệu của bạn.
          </p>
        </div>
      </div>

      <!-- Trust badges strip -->
      <div class="csb-trust-strip">
        <div v-for="(badge, i) in trustBadges" :key="i" class="csb-trust-badge">
          <span class="csb-trust-icon">{{ badge.icon }}</span>
          <span>{{ badge.text }}</span>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════
         QUICK SUMMARY CARD
    ══════════════════════════════════════════ -->
    <div class="csb-container">
      <div class="csb-summary-card reveal" style="transition-delay: 150ms">
        <div class="csb-summary-header">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <h2>📋 Tóm tắt chính sách (TL;DR)</h2>
        </div>
        <div class="csb-summary-grid">
          <div
            v-for="(item, i) in summaryItems"
            :key="i"
            class="csb-summary-item"
          >
            <span class="csb-summary-check">✓</span>
            <span>{{ item }}</span>
          </div>
        </div>
        <p class="csb-summary-note">
          * Đây là bản tóm tắt ngắn gọn. Vui lòng đọc đầy đủ nội dung bên dưới
          để hiểu rõ hơn.
        </p>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         MAIN 2-COLUMN LAYOUT
    ══════════════════════════════════════════ -->
    <div class="csb-container csb-main-layout reveal">
      <!-- ── SIDEBAR ── -->
      <aside class="csb-sidebar">
        <div class="csb-sidebar-sticky">
          <!-- Table of contents -->
          <div class="csb-toc-card">
            <div class="csb-toc-header">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Mục Lục</span>
            </div>
            <nav class="csb-toc-nav">
              <button
                v-for="(item, i) in navItems"
                :key="i"
                class="csb-toc-item"
                :class="{ 'csb-toc-active': activeSection === item.id }"
                @click="scrollToSection(item.id)"
              >
                <span class="csb-toc-num">{{
                  String(i + 1).padStart(2, "0")
                }}</span>
                <span class="csb-toc-label">{{ item.label }}</span>
              </button>
            </nav>
          </div>

          <!-- Privacy rights quick actions -->
          <div class="csb-rights-card">
            <div class="csb-rights-header">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Quyền Riêng Tư</span>
            </div>
            <p class="csb-rights-desc">
              Chúng tôi luôn chú trọng đến việc bảo vệ thông tin và quyền riêng
              tư của người dùng.
            </p>
          </div>
        </div>
      </aside>

      <!-- ── MAIN CONTENT ── -->
      <article class="csb-content">
        <!-- SECTION 1: Thông tin thu thập -->
        <section
          id="info-collection"
          class="csb-section section-observe reveal"
        >
          <div class="csb-section-header">
            <div class="csb-section-num">01</div>
            <div>
              <h2 class="csb-section-title">Thông tin chúng tôi thu thập</h2>
              <p class="csb-section-sub">
                Minh bạch về loại dữ liệu được thu thập khi bạn sử dụng dịch vụ
              </p>
            </div>
          </div>

          <div class="csb-info-grid">
            <div
              class="csb-info-card csb-info-card--provided reveal"
              style="transition-delay: 100ms"
            >
              <div class="csb-info-card-header">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <h3>Dữ liệu bạn cung cấp</h3>
              </div>
              <ul class="csb-info-list">
                <li v-for="item in providedData" :key="item">
                  <span class="csb-list-dot" />
                  {{ item }}
                </li>
              </ul>
            </div>
            <div
              class="csb-info-card csb-info-card--auto reveal"
              style="transition-delay: 200ms"
            >
              <div class="csb-info-card-header">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                    clip-rule="evenodd"
                  />
                </svg>
                <h3>Thông tin hệ thống ghi nhận</h3>
              </div>
              <ul class="csb-info-list">
                <li v-for="item in autoData" :key="item">
                  <span class="csb-list-dot" />
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- SECTION 2: Mục đích sử dụng -->
        <section id="purpose" class="csb-section section-observe reveal">
          <div class="csb-section-header">
            <div class="csb-section-num">02</div>
            <div>
              <h2 class="csb-section-title">Mục đích sử dụng dữ liệu</h2>
              <p class="csb-section-sub">
                Dữ liệu của bạn được dùng đúng mục đích, không vượt quá phạm vi
              </p>
            </div>
          </div>

          <div class="csb-table-wrapper">
            <table class="csb-table">
              <thead>
                <tr>
                  <th>Mục đích</th>
                  <th>Loại dữ liệu sử dụng</th>
                  <th>Cơ sở pháp lý</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in purposeRows" :key="i">
                  <td class="csb-td-purpose">{{ row.purpose }}</td>
                  <td class="csb-td-type">{{ row.type }}</td>
                  <td>
                    <span
                      class="csb-legal-badge"
                      :class="`csb-legal--${row.legalClass}`"
                      >{{ row.legal }}</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- SECTION 3: Chia sẻ thông tin -->
        <section id="sharing" class="csb-section section-observe reveal">
          <div class="csb-section-header">
            <div class="csb-section-num">03</div>
            <div>
              <h2 class="csb-section-title">Chia sẻ thông tin</h2>
              <p class="csb-section-sub">
                Chúng tôi chỉ chia sẻ dữ liệu khi thực sự cần thiết và có kiểm
                soát
              </p>
            </div>
          </div>

          <div class="csb-share-grid">
            <div
              v-for="(s, i) in sharingOptions"
              :key="i"
              class="csb-share-card reveal"
              :style="{ transitionDelay: `${(i + 1) * 100}ms` }"
            >
              <div class="csb-share-icon">
                <span>{{ s.emoji }}</span>
              </div>
              <h4>{{ s.title }}</h4>
              <p>{{ s.description }}</p>
              <div class="csb-share-limit">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ s.limit }}
              </div>
            </div>
          </div>

          <!-- No-sell guarantee -->
          <div class="csb-nosell-box">
            <div class="csb-nosell-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div>
              <strong>Cam kết tuyệt đối: KHÔNG BÁN DỮ LIỆU</strong>
              <p>
                SmartFood không bao giờ bán, cho thuê hoặc trao đổi thông tin cá
                nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại mà
                không có sự đồng ý rõ ràng từ bạn.
              </p>
            </div>
          </div>
        </section>

        <!-- SECTION 4: Cookie -->
        <!-- <section id="cookies" class="csb-section section-observe">
          <div class="csb-section-header">
            <div class="csb-section-num">04</div>
            <div>
              <h2 class="csb-section-title">Cookie & Công nghệ theo dõi</h2>
              <p class="csb-section-sub">
                Tùy chỉnh loại cookie bạn cho phép chúng tôi sử dụng
              </p>
            </div>
          </div>

          <div class="csb-cookie-list">
            <div
              v-for="(c, i) in cookieCategories"
              :key="i"
              class="csb-cookie-row"
            >
              <div class="csb-cookie-info">
                <div class="csb-cookie-name-row">
                  <span class="csb-cookie-name">{{ c.type }}</span>
                  <span v-if="c.required" class="csb-cookie-required"
                    >Bắt buộc</span
                  >
                </div>
                <p class="csb-cookie-desc">{{ c.description }}</p>
              </div>
              <div class="csb-toggle-wrap">
                <button
                  class="csb-toggle"
                  :class="{
                    'csb-toggle--on': c.enabled,
                    'csb-toggle--disabled': c.required,
                  }"
                  :disabled="c.required"
                  @click="!c.required && (c.enabled = !c.enabled)"
                  :aria-label="`Toggle ${c.type}`"
                >
                  <span class="csb-toggle-knob" />
                </button>
              </div>
            </div>
          </div>

          <div class="csb-cookie-actions">
            <button class="csb-btn-secondary">Từ chối tất cả</button>
            <button class="csb-btn-primary">Lưu tùy chọn</button>
          </div>
        </section> -->

        <!-- SECTION 5: Bảo mật -->
        <section id="security" class="csb-section section-observe reveal">
          <div class="csb-section-header">
            <div class="csb-section-num">04</div>
            <div>
              <h2 class="csb-section-title">Bảo mật dữ liệu</h2>
              <p class="csb-section-sub">
                Hệ thống bảo mật đa lớp bảo vệ thông tin của bạn 24/7
              </p>
            </div>
          </div>

          <div class="csb-security-grid">
            <div
              v-for="(sec, i) in securityMeasures"
              :key="i"
              class="csb-security-card reveal"
              :style="{ transitionDelay: `${(i + 1) * 100}ms` }"
            >
              <div class="csb-security-icon">{{ sec.emoji }}</div>
              <h4>{{ sec.title }}</h4>
              <p>{{ sec.description }}</p>
            </div>
          </div>

          <div class="csb-cert-strip">
            <div class="csb-cert-label">Chứng nhận & Tiêu chuẩn:</div>
            <div class="csb-cert-items">
              <span
                v-for="cert in certifications"
                :key="cert"
                class="csb-cert-item"
                >✓ {{ cert }}</span
              >
            </div>
          </div>
        </section>

        <!-- SECTION 6: Quyền lợi -->
        <section id="rights" class="csb-section section-observe reveal">
          <div class="csb-section-header">
            <div class="csb-section-num">05</div>
            <div>
              <h2 class="csb-section-title">Quyền lợi của bạn</h2>
              <p class="csb-section-sub">
                Bạn có đầy đủ quyền kiểm soát dữ liệu cá nhân theo quy định pháp
                luật
              </p>
            </div>
          </div>

          <div class="csb-rights-grid">
            <div
              v-for="(right, i) in userRights"
              :key="i"
              class="csb-right-card reveal"
              :style="{ transitionDelay: `${((i % 2) + 1) * 100}ms` }"
            >
              <div class="csb-right-icon">{{ right.emoji }}</div>
              <div class="csb-right-body">
                <h4>{{ right.title }}</h4>
                <p>{{ right.description }}</p>
              </div>
              <!-- <div class="csb-right-action">Thực hiện →</div> -->
            </div>
          </div>
        </section>

        <!-- SECTION 7: Lưu giữ dữ liệu (mục bổ sung) -->
        <section id="retention" class="csb-section section-observe reveal">
          <div class="csb-section-header">
            <div class="csb-section-num">06</div>
            <div>
              <h2 class="csb-section-title">Thời gian lưu giữ dữ liệu</h2>
              <p class="csb-section-sub">
                Chúng tôi chỉ giữ dữ liệu trong thời gian cần thiết tối thiểu
              </p>
            </div>
          </div>

          <div class="csb-retention-list">
            <div
              v-for="(r, i) in retentionItems"
              :key="i"
              class="csb-retention-row reveal"
              :style="{ transitionDelay: `${(i + 1) * 50}ms` }"
            >
              <div class="csb-retention-left">
                <span class="csb-retention-emoji">{{ r.emoji }}</span>
                <div>
                  <strong>{{ r.type }}</strong>
                  <p>{{ r.note }}</p>
                </div>
              </div>
              <div class="csb-retention-period">{{ r.period }}</div>
            </div>
          </div>
        </section>

        <!-- SECTION 8: Liên hệ -->
        <!-- <section id="contact" class="csb-section section-observe reveal">
          <div class="csb-section-header">
            <div class="csb-section-num">07</div>
            <div>
              <h2 class="csb-section-title">Liên hệ về bảo mật</h2>
              <p class="csb-section-sub">
                Đội ngũ DPO của chúng tôi sẵn sàng hỗ trợ trong 72 giờ
              </p>
            </div>
          </div>

          <div class="csb-contact-box">
            <div class="csb-contact-info">
              <div class="csb-contact-dpo">
                <div class="csb-dpo-avatar">DPO</div>
                <div>
                  <strong>SmartFood Privacy Team</strong>
                  <span>Bộ phận Bảo vệ Dữ liệu</span>
                </div>
              </div>
              <div class="csb-contact-details">
                <div class="csb-contact-row">
                  <span class="csb-contact-icon">✉</span>
                  <a href="mailto:privacy@smartfood.vn">privacy@smartfood.vn</a>
                </div>
                <div class="csb-contact-row">
                  <span class="csb-contact-icon">📞</span>
                  <span>1900 1234 (Nhánh 4)</span>
                </div>
                <div class="csb-contact-row">
                  <span class="csb-contact-icon">🕐</span>
                  <span>Phản hồi trong 72 giờ làm việc</span>
                </div>
                <div class="csb-contact-row">
                  <span class="csb-contact-icon">📍</span>
                  <span>727 Nguyễn Văn Linh, Đà Nẵng</span>
                </div>
              </div>
            </div>

            <div class="csb-contact-form">
              <h4>Gửi yêu cầu trực tiếp</h4>

              <div class="csb-form-group">
                <label>Loại yêu cầu</label>
                <select v-model="contactForm.type" class="csb-select">
                  <option value="" disabled>Chọn loại yêu cầu...</option>
                  <option
                    v-for="opt in contactOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="csb-form-group">
                <label>Họ và tên</label>
                <input
                  v-model="contactForm.name"
                  type="text"
                  class="csb-input"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div class="csb-form-group">
                <label>Email liên hệ</label>
                <input
                  v-model="contactForm.email"
                  type="email"
                  class="csb-input"
                  placeholder="email@example.com"
                />
              </div>

              <div class="csb-form-group">
                <label>Nội dung chi tiết</label>
                <textarea
                  v-model="contactForm.message"
                  class="csb-textarea"
                  rows="4"
                  placeholder="Mô tả yêu cầu của bạn..."
                ></textarea>
              </div>

              <div v-if="formSubmitted" class="csb-form-success">
                <span>✓</span> Yêu cầu đã gửi! Chúng tôi sẽ phản hồi trong 72
                giờ làm việc.
              </div>

              <button
                class="csb-btn-submit"
                :disabled="formLoading"
                @click="handleContactSubmit"
              >
                <span v-if="formLoading" class="csb-spinner" />
                <span v-else>Gửi yêu cầu →</span>
              </button>
            </div>
          </div>
        </section> -->
      </article>
    </div>
    <!-- end main layout -->

    <!-- ══════════════════════════════════════════
         FOOTER CTA
    ══════════════════════════════════════════ -->
    <div class="csb-footer-cta">
      <div class="csb-footer-cta-inner">
        <div class="csb-footer-shield">
          <svg viewBox="0 0 64 64" fill="currentColor">
            <path
              d="M32 3L10 13v18c0 13 9 24 22 28 13-4 22-15 22-28V13L32 3z"
            />
            <path
              d="M22 30l6 6 14-14"
              fill="none"
              stroke="#16A34A"
              stroke-width="3.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div>
          <h3>Dữ liệu của bạn được bảo vệ tại SmartFood</h3>
          <p>
            Chúng tôi định kỳ cập nhật chính sách để tuân thủ các quy định bảo
            vệ dữ liệu mới nhất.
          </p>
        </div>
        <div class="csb-footer-links">
          <NuxtLink :to="ROUTES.TERMS_OF_SERVICE">Điều khoản dịch vụ</NuxtLink>
          <span>·</span>
          <NuxtLink :to="ROUTES.LEGAL">Pháp lý & Tuân thủ</NuxtLink>
          <span>·</span>
          <a href="#">Tải PDF</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { ROUTES } from "~/constants/routes";

// ─── Reactive state ─────────────────────────────
const activeSection = ref("info-collection");
const readingProgress = ref(0);
const formSubmitted = ref(false);
const formLoading = ref(false);

const contactForm = ref({
  type: "",
  name: "",
  email: "",
  message: "",
});

// ─── Mock data ──────────────────────────────────
const trustBadges = [
  // { icon: "🔒", text: "SSL 256-bit" },
  { icon: "🛡️", text: "Không bán dữ liệu" },
  { icon: "👁️", text: "Minh bạch 100%" },
  // { icon: "✉️", text: "Quyền được quên" },
];

const summaryItems = [
  "Thu thập: Tên, Email, SĐT, Địa chỉ giao hàng, IP thiết bị và lịch sử mua hàng.",
  "Sử dụng: Chỉ dùng để xử lý đơn hàng, thanh toán và cải thiện trải nghiệm mua sắm.",
  "Chia sẻ: Chỉ với đối tác vận chuyển và cổng thanh toán — có ràng buộc bảo mật chặt chẽ.",
  "Không bao giờ bán, cho thuê hoặc trao đổi dữ liệu vì mục đích thương mại.",
  "Bạn có quyền xem, sửa, xuất hoặc yêu cầu xóa dữ liệu bất kỳ lúc nào.",
  "Mọi dữ liệu được mã hóa SSL 256-bit và lưu tại máy chủ bảo mật tại Việt Nam.",
];

const navItems = [
  { id: "info-collection", label: "Thông tin thu thập" },
  { id: "purpose", label: "Mục đích sử dụng" },
  { id: "sharing", label: "Chia sẻ thông tin" },
  // { id: "cookies", label: "Cookie & Tracking" },
  { id: "security", label: "Bảo mật dữ liệu" },
  { id: "rights", label: "Quyền của bạn" },
  { id: "retention", label: "Lưu giữ dữ liệu" },
  // { id: "contact", label: "Liên hệ DPO" },
];

const providedData = [
  "Họ tên và thông tin liên hệ",
  "Địa chỉ giao hàng và hóa đơn",
  "Tài khoản (username, mật khẩu mã hóa)",
  "Thông tin thanh toán",
  "Đánh giá sản phẩm và phản hồi",
];

const autoData = [
  "Thông tin kết nối mạng",
  "Loại trình duyệt và hệ điều hành",
  "Lịch sử duyệt và xem sản phẩm",
  "Thời gian và thời lượng truy cập",
  "Vị trí địa lý (cấp thành phố)",
];

const purposeRows = [
  {
    purpose: "Xử lý đơn hàng",
    type: "Cá nhân + Địa chỉ + Liên hệ",
    legal: "Hợp đồng",
    legalClass: "contract",
  },
  {
    purpose: "Thanh toán an toàn",
    type: "Giao dịch + Thẻ (mã hóa)",
    legal: "Hợp đồng",
    legalClass: "contract",
  },
  {
    purpose: "Cải tiến dịch vụ",
    type: "Hành vi duyệt + Phản hồi",
    legal: "Lợi ích hợp pháp",
    legalClass: "legitimate",
  },
  {
    purpose: "Gửi khuyến mãi",
    type: "Email + Lịch sử mua hàng",
    legal: "Sự đồng ý",
    legalClass: "consent",
  },
  {
    purpose: "Phòng chống gian lận",
    type: "IP + Thiết bị + Giao dịch",
    legal: "Nghĩa vụ pháp lý",
    legalClass: "legal",
  },
];

const sharingOptions = [
  {
    emoji: "🚚",
    title: "Đối tác Vận chuyển",
    description:
      "Chia sẻ tên, SĐT và địa chỉ giao hàng với đơn vị vận chuyển để thực hiện giao hàng tận nơi.",
    limit: "Chỉ tên + SĐT + địa chỉ",
  },
  {
    emoji: "💳",
    title: "Cổng Thanh toán",
    description:
      "Kết nối qua VNPay/MoMo/ZaloPay với tiêu chuẩn bảo mật PCI DSS cấp độ quốc tế.",
    limit: "Chỉ thông tin giao dịch",
  },
  {
    emoji: "⚖️",
    title: "Cơ quan Pháp lý",
    description:
      "Chỉ cung cấp dữ liệu khi có yêu cầu bằng văn bản từ cơ quan chức năng có thẩm quyền.",
    limit: "Theo yêu cầu pháp luật",
  },
];

// const cookieCategories = ref([
//   {
//     type: "Thiết yếu",
//     description:
//       "Cần thiết để website hoạt động, xác thực đăng nhập và giỏ hàng.",
//     enabled: true,
//     required: true,
//   },
//   {
//     type: "Hiệu suất",
//     description:
//       "Ghi nhớ sở thích, ngôn ngữ và cài đặt để cải thiện trải nghiệm.",
//     enabled: true,
//     required: false,
//   },
//   {
//     type: "Phân tích",
//     description:
//       "Giúp chúng tôi hiểu cách người dùng tương tác để tối ưu giao diện.",
//     enabled: false,
//     required: false,
//   },
//   {
//     type: "Tiếp thị",
//     description:
//       "Hiển thị quảng cáo cá nhân hóa dựa trên sở thích và lịch sử của bạn.",
//     enabled: false,
//     required: false,
//   },
// ]);

const securityMeasures = [
  {
    emoji: "🔐",
    title: "Mã hóa SSL/TLS 256-bit",
    description:
      "Toàn bộ dữ liệu truyền tải giữa bạn và máy chủ đều được mã hóa end-to-end.",
  },
  {
    emoji: "📱",
    title: "Xác thực 2 lớp (2FA)",
    description:
      "Bảo vệ tài khoản bằng mã OTP khi đăng nhập hoặc thay đổi thông tin quan trọng.",
  },
  {
    emoji: "🧱",
    title: "Tường lửa WAF",
    description:
      "Hàng rào bảo mật tiên tiến ngăn chặn DDoS, SQL Injection và XSS attacks.",
  },
  {
    emoji: "🔄",
    title: "Kiểm toán định kỳ",
    description:
      "Hệ thống được quét lỗ hổng và audit bảo mật hàng tuần bởi đội ngũ chuyên gia.",
  },
];

const certifications = [
  "ISO 27001",
  "PCI DSS Level 1",
  "SSL Secured",
  "GDPR Compliant",
];

const userRights = [
  {
    emoji: "👁️",
    title: "Quyền truy cập",
    description:
      "Yêu cầu cung cấp bản sao đầy đủ dữ liệu cá nhân chúng tôi đang lưu giữ.",
  },
  {
    emoji: "✏️",
    title: "Quyền chỉnh sửa",
    description:
      "Yêu cầu cập nhật hoặc sửa thông tin sai lệch trong hồ sơ của bạn.",
  },
  {
    emoji: "🗑️",
    title: "Quyền xóa bỏ",
    description:
      "Yêu cầu xóa vĩnh viễn dữ liệu (quyền được lãng quên) khi không còn cần thiết.",
  },
  {
    emoji: "📦",
    title: "Quyền xuất dữ liệu",
    description:
      "Nhận bản sao dữ liệu theo định dạng chuẩn (JSON/CSV) để chuyển sang dịch vụ khác.",
  },
  {
    emoji: "⛔",
    title: "Quyền từ chối",
    description:
      "Từ chối xử lý dữ liệu cho mục đích tiếp thị hoặc phân tích bất kỳ lúc nào.",
  },
  {
    emoji: "📢",
    title: "Quyền khiếu nại",
    description:
      "Gửi khiếu nại đến Bộ Thông tin & Truyền thông nếu quyền lợi bị vi phạm.",
  },
];

const retentionItems = [
  {
    emoji: "👤",
    type: "Thông tin tài khoản",
    period: "Suốt vòng đời tài khoản",
    note: "Xóa trong 30 ngày sau khi đóng tài khoản",
  },
  {
    emoji: "🛒",
    type: "Lịch sử đơn hàng",
    period: "5 năm",
    note: "Theo yêu cầu kế toán và pháp lý",
  },
  {
    emoji: "💳",
    type: "Dữ liệu thanh toán",
    period: "3 năm",
    note: "Mã hóa toàn bộ, không lưu số thẻ đầy đủ",
  },
  {
    emoji: "📊",
    type: "Dữ liệu phân tích",
    period: "24 tháng",
    note: "Ẩn danh hóa hoàn toàn sau khi lưu",
  },
  {
    emoji: "📝",
    type: "Nhật ký truy cập",
    period: "12 tháng",
    note: "Phục vụ bảo mật và điều tra sự cố",
  },
];

const contactOptions = [
  { label: "Yêu cầu xem/xuất bản sao dữ liệu", value: "data_export" },
  { label: "Yêu cầu xóa dữ liệu vĩnh viễn", value: "data_deletion" },
  { label: "Yêu cầu chỉnh sửa thông tin", value: "data_correction" },
  { label: "Khiếu nại về bảo mật", value: "security_complaint" },
  { label: "Câu hỏi về chính sách", value: "policy_question" },
];

// ─── Methods ────────────────────────────────────
const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top, behavior: "smooth" });
  activeSection.value = id;
};

const handleContactSubmit = async () => {
  if (!contactForm.value.type || !contactForm.value.message) return;
  formLoading.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  formLoading.value = false;
  formSubmitted.value = true;
  contactForm.value = { type: "", name: "", email: "", message: "" };
  setTimeout(() => {
    formSubmitted.value = false;
  }, 5000);
};

// ─── Scroll spy + reading progress ──────────────
let observer: IntersectionObserver | null = null;

const updateProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  readingProgress.value =
    docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
};

onMounted(() => {
  window.addEventListener("scroll", updateProgress, { passive: true });

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) activeSection.value = e.target.id;
      });
    },
    { rootMargin: "-15% 0px -75% 0px", threshold: 0 },
  );
  document
    .querySelectorAll(".section-observe")
    .forEach((el) => observer?.observe(el));

  // IntersectionObserver for reveal animation
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateProgress);
  observer?.disconnect();
});
</script>

<style scoped>
/* ═══════════════════════════════════════════════
   CSS VARIABLES
═══════════════════════════════════════════════ */
.csb-wrapper {
  --green: #16a34a;
  --green-dark: #15803d;
  --green-light: #f0fdf4;
  --green-mid: #dcfce7;
  --orange: #f97316;
  --orange-light: #fff7ed;
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --text-muted: #9ca3af;
  --border: #e5e7eb;
  --border-light: #f3f4f6;
  --white: #ffffff;
  --radius: 16px;
  --radius-sm: 10px;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
  font-family: "Be Vietnam Pro", "Segoe UI", system-ui, sans-serif;
  color: var(--text-primary);
  background: #fff;
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

/* ═══════════════════════════════════════════════
   READING PROGRESS BAR
═══════════════════════════════════════════════ */
.csb-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--border-light);
  z-index: 100;
}
.csb-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--green), var(--orange));
  transition: width 0.1s ease;
}

/* ═══════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════ */
.csb-hero {
  position: relative;
  background: linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);
  overflow: hidden;
}
.csb-hero-pattern {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.06;
}
.csb-hero-inner {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 56px 24px 24px;
  display: flex;
  align-items: center;
  gap: 32px;
}
.csb-hero-icon {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  color: white;
  animation: shieldPulse 3s ease-in-out infinite;
}
@keyframes shieldPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.06);
    opacity: 1;
  }
}
.csb-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  padding: 4px 14px;
  margin-bottom: 12px;
  letter-spacing: 0.03em;
}
.csb-badge-dot {
  opacity: 0.5;
}
.csb-hero-text h1 {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}
.csb-hero-text p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  max-width: 500px;
}
.csb-trust-strip {
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 24px 20px;
  background: rgba(0, 0, 0, 0.15);
}
.csb-trust-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  padding: 6px 14px;
  transition: background 0.2s;
}
.csb-trust-badge:hover {
  background: rgba(255, 255, 255, 0.2);
}
.csb-trust-icon {
  font-size: 14px;
}

/* ═══════════════════════════════════════════════
   CONTAINER
═══════════════════════════════════════════════ */
.csb-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ═══════════════════════════════════════════════
   SUMMARY CARD
═══════════════════════════════════════════════ */
.csb-summary-card {
  margin: 32px auto;
  background: var(--green-light);
  border: 1.5px solid #bbf7d0;
  border-radius: var(--radius);
  overflow: hidden;
}
.csb-summary-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  background: var(--green);
  color: white;
}
.csb-summary-header svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.csb-summary-header h2 {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}
.csb-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0;
  padding: 16px 20px;
}
.csb-summary-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  font-size: 13.5px;
  color: #166534;
  line-height: 1.5;
  border-radius: 8px;
  transition: background 0.2s;
}
.csb-summary-item:hover {
  background: rgba(255, 255, 255, 0.5);
}
.csb-summary-check {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  background: var(--green);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  margin-top: 1px;
}
.csb-summary-note {
  padding: 10px 24px 14px;
  font-size: 12px;
  color: #4b7a5a;
  font-style: italic;
  border-top: 1px solid #bbf7d0;
  margin: 0;
}

/* ═══════════════════════════════════════════════
   MAIN LAYOUT
═══════════════════════════════════════════════ */
.csb-main-layout {
  display: flex;
  gap: 32px;
  padding-top: 16px;
  padding-bottom: 64px;
  align-items: flex-start;
}

/* ═══════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════ */
.csb-sidebar {
  width: 260px;
  flex-shrink: 0;
}
.csb-sidebar-sticky {
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.csb-toc-card,
.csb-rights-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}
.csb-toc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  background: var(--border-light);
  border-bottom: 1px solid var(--border);
}
.csb-toc-header svg {
  width: 15px;
  height: 15px;
}
.csb-toc-nav {
  padding: 8px;
}
.csb-toc-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}
.csb-toc-item:hover {
  background: var(--green-light);
  color: var(--green-dark);
}
.csb-toc-active {
  background: var(--green-light) !important;
  color: var(--green-dark) !important;
  font-weight: 700;
  border-left: 3px solid var(--green);
  padding-left: 7px;
}
.csb-toc-num {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  min-width: 20px;
}
.csb-toc-active .csb-toc-num {
  color: var(--green);
}
.csb-toc-label {
  line-height: 1.3;
}

.csb-rights-card {
  padding: 16px;
}
.csb-rights-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--green-dark);
}
.csb-rights-header svg {
  width: 16px;
  height: 16px;
  color: var(--green);
}
.csb-rights-desc {
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0 0 14px;
}
.csb-rights-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.csb-rights-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid;
  background: white;
  transition: all 0.2s;
  text-align: left;
}
.csb-rights-btn--view {
  color: var(--green-dark);
  border-color: #bbf7d0;
}
.csb-rights-btn--view:hover {
  background: var(--green-light);
}
.csb-rights-btn--delete {
  color: #b91c1c;
  border-color: #fecaca;
}
.csb-rights-btn--delete:hover {
  background: #fef2f2;
}
.csb-btn-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════════
   CONTENT SECTIONS
═══════════════════════════════════════════════ */
.csb-content {
  flex: 1;
  min-width: 0;
}

.csb-section {
  padding: 48px 0;
  border-bottom: 1px solid var(--border-light);
}
.csb-section:last-child {
  border-bottom: none;
}

.csb-section-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 28px;
}
.csb-section-num {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: var(--green-light);
  color: var(--green-dark);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
  margin-top: 4px;
}
.csb-section-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 6px;
  letter-spacing: -0.01em;
  line-height: 1.3;
}
.csb-section-sub {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* Section 1 - Info cards */
.csb-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.csb-info-card {
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  background: white;
  box-shadow: var(--shadow);
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.csb-info-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.csb-info-card--provided {
  border-top: 3px solid var(--green);
}
.csb-info-card--auto {
  border-top: 3px solid var(--orange);
}
.csb-info-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.csb-info-card-header svg {
  width: 20px;
  height: 20px;
}
.csb-info-card--provided .csb-info-card-header svg {
  color: var(--green);
}
.csb-info-card--auto .csb-info-card-header svg {
  color: var(--orange);
}
.csb-info-card-header h3 {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}
.csb-info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.csb-info-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: var(--text-secondary);
}
.csb-list-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  flex-shrink: 0;
}
.csb-info-card--auto .csb-list-dot {
  background: var(--orange);
}

/* Section 2 - Table */
.csb-table-wrapper {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}
.csb-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}
.csb-table thead tr {
  background: #f9fafb;
}
.csb-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
}
.csb-table tbody tr {
  transition: background 0.15s;
}
.csb-table tbody tr:hover {
  background: var(--green-light);
}
.csb-table tbody tr:not(:last-child) td {
  border-bottom: 1px solid var(--border-light);
}
.csb-table td {
  padding: 13px 16px;
  color: var(--text-secondary);
  vertical-align: middle;
}
.csb-td-purpose {
  font-weight: 600;
  color: var(--text-primary);
}
.csb-td-type {
  color: var(--text-secondary);
}
.csb-legal-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}
.csb-legal--contract {
  background: #dcfce7;
  color: #166534;
}
.csb-legal--legitimate {
  background: #fef3c7;
  color: #92400e;
}
.csb-legal--consent {
  background: #dbeafe;
  color: #1e40af;
}
.csb-legal--legal {
  background: #fce7f3;
  color: #9d174d;
}

/* Section 3 - Sharing */
.csb-share-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.csb-share-card {
  padding: 20px;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transition: all 0.2s;
}
.csb-share-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: #bbf7d0;
}
.csb-share-icon {
  width: 44px;
  height: 44px;
  background: var(--green-light);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 14px;
}
.csb-share-card h4 {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--text-primary);
}
.csb-share-card p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.55;
  margin: 0 0 12px;
}
.csb-share-limit {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--green-dark);
}
.csb-share-limit svg {
  width: 14px;
  height: 14px;
  color: var(--green);
  flex-shrink: 0;
}
.csb-nosell-box {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
  background: #fef2f2;
  border: 1.5px solid #fecaca;
  border-radius: var(--radius);
}
.csb-nosell-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow);
}
.csb-nosell-icon svg {
  width: 22px;
  height: 22px;
  color: #dc2626;
}
.csb-nosell-box strong {
  display: block;
  font-size: 14px;
  font-weight: 800;
  color: #7f1d1d;
  margin-bottom: 6px;
}
.csb-nosell-box p {
  font-size: 13px;
  color: #991b1b;
  line-height: 1.55;
  margin: 0;
}

/* Section 4 - Cookies */
.csb-cookie-list {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 16px;
}
.csb-cookie-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: white;
  transition: background 0.15s;
}
.csb-cookie-row:not(:last-child) {
  border-bottom: 1px solid var(--border-light);
}
.csb-cookie-row:hover {
  background: #fafafa;
}
.csb-cookie-info {
  flex: 1;
  min-width: 0;
}
.csb-cookie-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.csb-cookie-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}
.csb-cookie-required {
  font-size: 10px;
  font-weight: 700;
  background: var(--green-light);
  color: var(--green-dark);
  border-radius: 100px;
  padding: 2px 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.csb-cookie-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}
.csb-toggle-wrap {
  flex-shrink: 0;
}
.csb-toggle {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  background: var(--border);
  transition: background 0.25s;
  padding: 0;
}
.csb-toggle--on {
  background: var(--green);
}
.csb-toggle--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.csb-toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  transition: transform 0.25s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  display: block;
}
.csb-toggle--on .csb-toggle-knob {
  transform: translateX(20px);
}
.csb-cookie-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Section 5 - Security */
.csb-security-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.csb-security-card {
  padding: 20px;
  background: linear-gradient(135deg, var(--green-light), white);
  border: 1px solid #bbf7d0;
  border-radius: var(--radius);
  transition: all 0.2s;
}
.csb-security-card:hover {
  box-shadow: var(--shadow-md);
}
.csb-security-icon {
  font-size: 28px;
  margin-bottom: 12px;
}
.csb-security-card h4 {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
}
.csb-security-card p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.55;
  margin: 0;
}
.csb-cert-strip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 20px;
  background: var(--border-light);
  border-radius: var(--radius-sm);
}
.csb-cert-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.csb-cert-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.csb-cert-item {
  font-size: 12px;
  font-weight: 700;
  color: var(--green-dark);
  background: white;
  border: 1px solid #bbf7d0;
  border-radius: 100px;
  padding: 4px 12px;
}

/* Section 6 - Rights */
.csb-rights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 14px;
}
.csb-right-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 20px;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: all 0.2s;
}
.csb-right-card:hover {
  border-color: var(--green);
  background: var(--green-light);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.csb-right-icon {
  font-size: 26px;
}
.csb-right-body h4 {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
}
.csb-right-body p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}
.csb-right-action {
  font-size: 12px;
  font-weight: 700;
  color: var(--green);
  opacity: 0;
  transition: opacity 0.2s;
}
.csb-right-card:hover .csb-right-action {
  opacity: 1;
}

/* Section 7 - Retention */
.csb-retention-list {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.csb-retention-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  background: white;
  transition: background 0.15s;
}
.csb-retention-row:not(:last-child) {
  border-bottom: 1px solid var(--border-light);
}
.csb-retention-row:hover {
  background: var(--green-light);
}
.csb-retention-left {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.csb-retention-emoji {
  font-size: 22px;
  flex-shrink: 0;
  margin-top: 2px;
}
.csb-retention-left strong {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 3px;
}
.csb-retention-left p {
  font-size: 12.5px;
  color: var(--text-muted);
  margin: 0;
}
.csb-retention-period {
  flex-shrink: 0;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--green-dark);
  background: var(--green-light);
  border: 1px solid #bbf7d0;
  border-radius: 100px;
  padding: 5px 14px;
  white-space: nowrap;
}

/* Section 8 - Contact */
.csb-contact-box {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}
.csb-contact-info {
  padding: 28px;
  background: var(--green-light);
  border-right: 1px solid #bbf7d0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.csb-contact-dpo {
  display: flex;
  align-items: center;
  gap: 14px;
}
.csb-dpo-avatar {
  width: 48px;
  height: 48px;
  background: var(--green);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}
.csb-contact-dpo strong {
  display: block;
  font-size: 15px;
  font-weight: 800;
  color: var(--text-primary);
}
.csb-contact-dpo span {
  font-size: 12.5px;
  color: var(--green-dark);
}
.csb-contact-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.csb-contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13.5px;
  color: var(--text-secondary);
}
.csb-contact-icon {
  font-size: 16px;
  flex-shrink: 0;
}
.csb-contact-row a {
  color: var(--green-dark);
  font-weight: 600;
  text-decoration: none;
}
.csb-contact-row a:hover {
  text-decoration: underline;
}

.csb-contact-form {
  padding: 28px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.csb-contact-form h4 {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}
.csb-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.csb-form-group label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}
.csb-select,
.csb-input,
.csb-textarea {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: white;
  color: var(--text-primary);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  appearance: none;
}
.csb-select:focus,
.csb-input:focus,
.csb-textarea:focus {
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
}
.csb-textarea {
  resize: vertical;
  min-height: 90px;
}
.csb-form-success {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--green-light);
  border: 1.5px solid #bbf7d0;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-weight: 600;
  color: #166534;
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Buttons */
.csb-btn-primary,
.csb-btn-secondary,
.csb-btn-submit {
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: 1.5px solid;
  font-family: inherit;
}
.csb-btn-primary {
  background: var(--green);
  border-color: var(--green);
  color: white;
}
.csb-btn-primary:hover {
  background: var(--green-dark);
  border-color: var(--green-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}
.csb-btn-secondary {
  background: white;
  border-color: var(--border);
  color: var(--text-secondary);
}
.csb-btn-secondary:hover {
  border-color: var(--text-secondary);
}
.csb-btn-submit {
  width: 100%;
  background: var(--green);
  border-color: var(--green);
  color: white;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.csb-btn-submit:hover:not(:disabled) {
  background: var(--green-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}
.csb-btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.csb-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ═══════════════════════════════════════════════
   FOOTER CTA
═══════════════════════════════════════════════ */
.csb-footer-cta {
  background: #111827;
  padding: 48px 24px;
}
.csb-footer-cta-inner {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}
.csb-footer-shield {
  width: 52px;
  height: 52px;
  color: white;
  opacity: 0.9;
}
.csb-footer-cta h3 {
  font-size: 20px;
  font-weight: 800;
  color: white;
  margin: 0;
}
.csb-footer-cta p {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.6;
  max-width: 500px;
}
.csb-footer-links {
  display: flex;
  align-items: center;
  gap: 10px;
}
.csb-footer-links a {
  font-size: 13px;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.csb-footer-links a:hover {
  color: var(--green);
}
.csb-footer-links span {
  color: #374151;
}

/* ═══════════════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .csb-sidebar {
    width: 220px;
  }
  .csb-contact-box {
    grid-template-columns: 1fr;
  }
  .csb-contact-info {
    border-right: none;
    border-bottom: 1px solid #bbf7d0;
  }
}
@media (max-width: 768px) {
  .csb-main-layout {
    flex-direction: column;
    padding-top: 8px;
  }
  .csb-sidebar {
    width: 100%;
  }
  .csb-sidebar-sticky {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .csb-toc-card {
    flex: 1;
    min-width: 200px;
  }
  .csb-rights-card {
    flex: 1;
    min-width: 200px;
  }
  .csb-hero-inner {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px 20px;
    gap: 16px;
  }
  .csb-hero-text p {
    margin: 0 auto;
  }
  .csb-share-grid {
    grid-template-columns: 1fr;
  }
  .csb-security-grid {
    grid-template-columns: 1fr 1fr;
  }
  .csb-rights-grid {
    grid-template-columns: 1fr;
  }
  .csb-cookie-actions {
    justify-content: stretch;
  }
  .csb-cookie-actions .csb-btn-primary,
  .csb-cookie-actions .csb-btn-secondary {
    flex: 1;
  }
}
@media (max-width: 480px) {
  .csb-info-grid {
    grid-template-columns: 1fr;
  }
  .csb-security-grid {
    grid-template-columns: 1fr;
  }
  .csb-table {
    font-size: 12px;
  }
  .csb-table th,
  .csb-table td {
    padding: 10px 12px;
  }
  .csb-retention-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .csb-trust-strip {
    gap: 6px;
  }
  .csb-trust-badge {
    font-size: 11px;
    padding: 5px 10px;
  }
}
</style>
