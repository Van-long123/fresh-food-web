<template>
  <div
    class="font-sans text-gray-900 bg-white"
    style="font-family: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;"
  >
    <section class="csb-hero">
      <!-- Animated SVG pattern background -->
      <svg
        class="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
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

        <div>
          <div class="inline-flex items-center gap-2 text-[12px] text-white/75 bg-white/[0.12] border border-white/20 rounded-full px-[14px] py-1 mb-3 tracking-[0.03em]">
            <span>Hiệu lực từ 01/01/2025</span>
            <span class="opacity-50">•</span>
            <span>Phiên bản 2.0</span>
          </div>
          <h1 class="text-[clamp(24px,4vw,36px)] font-extrabold text-white leading-[1.2] mb-[10px] tracking-[-0.02em]">Chính Sách Bảo Mật</h1>
          <p class="text-white/80 text-[15px] leading-[1.6] m-0 max-w-[500px]">
            Chúng tôi cam kết bảo vệ quyền riêng tư và minh bạch tuyệt đối về
            cách xử lý dữ liệu của bạn.
          </p>
        </div>
      </div>

      <!-- Trust badges strip -->
      <div class="relative flex justify-center flex-wrap gap-2 px-6 pt-4 pb-5 bg-black/[0.15]">
        <div v-for="(badge, i) in trustBadges" :key="i" class="flex items-center gap-[6px] text-[12px] font-semibold text-white bg-white/[0.12] border border-white/20 rounded-full px-[14px] py-[6px] hover:bg-white/20 transition-colors duration-200 cursor-default">
          <span class="text-[14px]">{{ badge.icon }}</span>
          <span>{{ badge.text }}</span>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         QUICK SUMMARY CARD
    ══════════════════════════════════════════════════════ -->
    <div class="max-w-[1200px] mx-auto px-6">
      <div class="my-8 bg-green-50 border-[1.5px] border-green-200 rounded-2xl overflow-hidden reveal" style="transition-delay: 150ms">
        <div class="flex items-center gap-[10px] px-6 py-[14px] bg-green-600 text-white">
          <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 shrink-0">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <h2 class="text-[15px] font-bold m-0">📋 Tóm tắt chính sách (TL;DR)</h2>
        </div>
        <div class="grid gap-0 px-5 py-4" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
          <div
            v-for="(item, i) in summaryItems"
            :key="i"
            class="flex items-start gap-[10px] p-[10px] text-[13.5px] text-green-800 leading-[1.5] rounded-lg hover:bg-white/50 transition-colors duration-200 cursor-default"
          >
            <span class="shrink-0 w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-[11px] font-bold mt-[1px]">✓</span>
            <span>{{ item }}</span>
          </div>
        </div>
        <p class="px-6 py-[10px] pb-[14px] text-[12px] text-[#4b7a5a] italic border-t border-green-200 m-0">
          * Đây là bản tóm tắt ngắn gọn. Vui lòng đọc đầy đủ nội dung bên dưới
          để hiểu rõ hơn.
        </p>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════
         MAIN 2-COLUMN LAYOUT
    ══════════════════════════════════════════════════════ -->
    <div class="max-w-[1200px] mx-auto px-6 csb-main-layout reveal">
      <!-- ── SIDEBAR ── -->
      <aside class="w-[260px] shrink-0">
        <div class="csb-sidebar-sticky">
          <!-- Table of contents -->
          <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div class="flex items-center gap-2 px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-gray-500 bg-gray-50 border-b border-gray-200">
              <svg viewBox="0 0 20 20" fill="currentColor" class="w-[15px] h-[15px]">
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Mục Lục</span>
            </div>
            <nav class="p-2">
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
                <span class="leading-[1.3] text-[13px]">{{ item.label }}</span>
              </button>
            </nav>
          </div>

          <!-- Privacy rights quick actions -->
          <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4">
            <div class="flex items-center gap-2 mb-2 text-[12px] font-extrabold uppercase tracking-[0.06em] text-green-700">
              <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-green-600">
                <path
                  fill-rule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Quyền Riêng Tư</span>
            </div>
            <p class="text-[12.5px] text-gray-500 leading-[1.5] mb-0">
              Chúng tôi luôn chú trọng đến việc bảo vệ thông tin và quyền riêng
              tư của người dùng.
            </p>
          </div>
        </div>
      </aside>

      <!-- ── MAIN CONTENT ── -->
      <article class="flex-1 min-w-0">
        <!-- SECTION 1: Thông tin thu thập -->
        <section
          id="info-collection"
          class="csb-section section-observe reveal"
        >
          <div class="flex items-start gap-5 mb-7">
            <div class="shrink-0 w-11 h-11 bg-green-50 text-green-700 rounded-[10px] flex items-center justify-center text-[13px] font-extrabold tracking-[0.05em] mt-1">01</div>
            <div>
              <h2 class="text-[22px] font-extrabold text-gray-900 mb-[6px] tracking-[-0.01em] leading-[1.3]">Thông tin chúng tôi thu thập</h2>
              <p class="text-[14px] text-gray-500 m-0 leading-[1.5]">
                Minh bạch về loại dữ liệu được thu thập khi bạn sử dụng dịch vụ
              </p>
            </div>
          </div>

          <div class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
            <div
              class="csb-info-card csb-info-card--provided reveal"
              style="transition-delay: 100ms"
            >
              <div class="flex items-center gap-[10px] mb-[14px]">
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-green-600">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <h3 class="text-[14px] font-bold m-0 text-gray-900">Dữ liệu bạn cung cấp</h3>
              </div>
              <ul class="list-none p-0 m-0 flex flex-col gap-2">
                <li v-for="item in providedData" :key="item" class="flex items-center gap-[10px] text-[13.5px] text-gray-500">
                  <span class="w-[6px] h-[6px] rounded-full bg-green-600 shrink-0" />
                  {{ item }}
                </li>
              </ul>
            </div>
            <div
              class="csb-info-card csb-info-card--auto reveal"
              style="transition-delay: 200ms"
            >
              <div class="flex items-center gap-[10px] mb-[14px]">
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-orange-500">
                  <path
                    fill-rule="evenodd"
                    d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                    clip-rule="evenodd"
                  />
                </svg>
                <h3 class="text-[14px] font-bold m-0 text-gray-900">Thông tin hệ thống ghi nhận</h3>
              </div>
              <ul class="list-none p-0 m-0 flex flex-col gap-2">
                <li v-for="item in autoData" :key="item" class="flex items-center gap-[10px] text-[13.5px] text-gray-500">
                  <span class="w-[6px] h-[6px] rounded-full bg-orange-500 shrink-0" />
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- SECTION 2: Mục đích sử dụng -->
        <section id="purpose" class="csb-section section-observe reveal">
          <div class="flex items-start gap-5 mb-7">
            <div class="shrink-0 w-11 h-11 bg-green-50 text-green-700 rounded-[10px] flex items-center justify-center text-[13px] font-extrabold tracking-[0.05em] mt-1">02</div>
            <div>
              <h2 class="text-[22px] font-extrabold text-gray-900 mb-[6px] tracking-[-0.01em] leading-[1.3]">Mục đích sử dụng dữ liệu</h2>
              <p class="text-[14px] text-gray-500 m-0 leading-[1.5]">
                Dữ liệu của bạn được dùng đúng mục đích, không vượt quá phạm vi
              </p>
            </div>
          </div>

          <div class="border border-gray-200 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <table class="w-full border-collapse text-[13.5px]">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-[0.06em] text-gray-500 border-b border-gray-200">Mục đích</th>
                  <th class="px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-[0.06em] text-gray-500 border-b border-gray-200">Loại dữ liệu sử dụng</th>
                  <th class="px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-[0.06em] text-gray-500 border-b border-gray-200">Cơ sở pháp lý</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in purposeRows" :key="i" class="hover:bg-green-50 transition-colors duration-150 [&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100">
                  <td class="px-4 py-[13px] font-semibold text-gray-900 align-middle">{{ row.purpose }}</td>
                  <td class="px-4 py-[13px] text-gray-500 align-middle">{{ row.type }}</td>
                  <td class="px-4 py-[13px] align-middle">
                    <span
                      class="inline-block px-[10px] py-[3px] rounded-full text-[11px] font-bold whitespace-nowrap"
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
          <div class="flex items-start gap-5 mb-7">
            <div class="shrink-0 w-11 h-11 bg-green-50 text-green-700 rounded-[10px] flex items-center justify-center text-[13px] font-extrabold tracking-[0.05em] mt-1">03</div>
            <div>
              <h2 class="text-[22px] font-extrabold text-gray-900 mb-[6px] tracking-[-0.01em] leading-[1.3]">Chia sẻ thông tin</h2>
              <p class="text-[14px] text-gray-500 m-0 leading-[1.5]">
                Chúng tôi chỉ chia sẻ dữ liệu khi thực sự cần thiết và có kiểm
                soát
              </p>
            </div>
          </div>

          <div class="grid gap-4 mb-5" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
            <div
              v-for="(s, i) in sharingOptions"
              :key="i"
              class="csb-share-card reveal"
              :style="{ transitionDelay: `${(i + 1) * 100}ms` }"
            >
              <div class="w-11 h-11 bg-green-50 rounded-[10px] flex items-center justify-center text-[22px] mb-[14px]">
                <span>{{ s.emoji }}</span>
              </div>
              <h4 class="text-[14px] font-bold m-0 mb-2 text-gray-900">{{ s.title }}</h4>
              <p class="text-[13px] text-gray-500 leading-[1.55] m-0 mb-3">{{ s.description }}</p>
              <div class="flex items-center gap-[6px] text-[11.5px] font-semibold text-green-700">
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-[14px] h-[14px] text-green-600 shrink-0">
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
          <div class="flex items-start gap-4 px-6 py-5 bg-red-50 border-[1.5px] border-red-200 rounded-2xl">
            <div class="shrink-0 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <svg viewBox="0 0 20 20" fill="currentColor" class="w-[22px] h-[22px] text-red-600">
                <path
                  fill-rule="evenodd"
                  d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div>
              <strong class="block text-[14px] font-extrabold text-red-900 mb-[6px]">Cam kết tuyệt đối: KHÔNG BÁN DỮ LIỆU</strong>
              <p class="text-[13px] text-red-700 leading-[1.55] m-0">
                SmartFood không bao giờ bán, cho thuê hoặc trao đổi thông tin cá
                nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại mà
                không có sự đồng ý rõ ràng từ bạn.
              </p>
            </div>
          </div>
        </section>

        <!-- SECTION 4 (formerly 5): Bảo mật -->
        <section id="security" class="csb-section section-observe reveal">
          <div class="flex items-start gap-5 mb-7">
            <div class="shrink-0 w-11 h-11 bg-green-50 text-green-700 rounded-[10px] flex items-center justify-center text-[13px] font-extrabold tracking-[0.05em] mt-1">04</div>
            <div>
              <h2 class="text-[22px] font-extrabold text-gray-900 mb-[6px] tracking-[-0.01em] leading-[1.3]">Bảo mật dữ liệu</h2>
              <p class="text-[14px] text-gray-500 m-0 leading-[1.5]">
                Hệ thống bảo mật đa lớp bảo vệ thông tin của bạn 24/7
              </p>
            </div>
          </div>

          <div class="grid gap-4 mb-5" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
            <div
              v-for="(sec, i) in securityMeasures"
              :key="i"
              class="p-5 bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 reveal"
              :style="{ transitionDelay: `${(i + 1) * 100}ms` }"
            >
              <div class="text-[28px] mb-3">{{ sec.emoji }}</div>
              <h4 class="text-[14px] font-bold text-gray-900 m-0 mb-2">{{ sec.title }}</h4>
              <p class="text-[13px] text-gray-500 leading-[1.55] m-0">{{ sec.description }}</p>
            </div>
          </div>

          <div class="flex items-center flex-wrap gap-3 px-5 py-4 bg-gray-100 rounded-[10px]">
            <div class="text-[12px] font-bold text-gray-500 uppercase tracking-[0.06em]">Chứng nhận & Tiêu chuẩn:</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="cert in certifications"
                :key="cert"
                class="text-[12px] font-bold text-green-700 bg-white border border-green-200 rounded-full px-3 py-1"
                >✓ {{ cert }}</span
              >
            </div>
          </div>
        </section>

        <!-- SECTION 5 (formerly 6): Quyền lợi -->
        <section id="rights" class="csb-section section-observe reveal">
          <div class="flex items-start gap-5 mb-7">
            <div class="shrink-0 w-11 h-11 bg-green-50 text-green-700 rounded-[10px] flex items-center justify-center text-[13px] font-extrabold tracking-[0.05em] mt-1">05</div>
            <div>
              <h2 class="text-[22px] font-extrabold text-gray-900 mb-[6px] tracking-[-0.01em] leading-[1.3]">Quyền lợi của bạn</h2>
              <p class="text-[14px] text-gray-500 m-0 leading-[1.5]">
                Bạn có đầy đủ quyền kiểm soát dữ liệu cá nhân theo quy định pháp
                luật
              </p>
            </div>
          </div>

          <div class="grid gap-[14px]" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
            <div
              v-for="(right, i) in userRights"
              :key="i"
              class="csb-right-card reveal"
              :style="{ transitionDelay: `${((i % 2) + 1) * 100}ms` }"
            >
              <div class="text-[26px]">{{ right.emoji }}</div>
              <div>
                <h4 class="text-[14px] font-bold text-gray-900 m-0 mb-[6px]">{{ right.title }}</h4>
                <p class="text-[13px] text-gray-500 leading-[1.5] m-0">{{ right.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 6 (formerly 7): Lưu giữ dữ liệu -->
        <section id="retention" class="csb-section section-observe reveal">
          <div class="flex items-start gap-5 mb-7">
            <div class="shrink-0 w-11 h-11 bg-green-50 text-green-700 rounded-[10px] flex items-center justify-center text-[13px] font-extrabold tracking-[0.05em] mt-1">06</div>
            <div>
              <h2 class="text-[22px] font-extrabold text-gray-900 mb-[6px] tracking-[-0.01em] leading-[1.3]">Thời gian lưu giữ dữ liệu</h2>
              <p class="text-[14px] text-gray-500 m-0 leading-[1.5]">
                Chúng tôi chỉ giữ dữ liệu trong thời gian cần thiết tối thiểu
              </p>
            </div>
          </div>

          <div class="border border-gray-200 rounded-2xl overflow-hidden">
            <div
              v-for="(r, i) in retentionItems"
              :key="i"
              class="flex items-center justify-between gap-4 px-5 py-4 bg-white hover:bg-green-50 transition-colors duration-150 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-gray-100 reveal"
              :style="{ transitionDelay: `${(i + 1) * 50}ms` }"
            >
              <div class="flex items-start gap-[14px]">
                <span class="text-[22px] shrink-0 mt-[2px]">{{ r.emoji }}</span>
                <div>
                  <strong class="block text-[14px] font-bold text-gray-900 mb-[3px]">{{ r.type }}</strong>
                  <p class="text-[12.5px] text-gray-400 m-0">{{ r.note }}</p>
                </div>
              </div>
              <div class="shrink-0 text-[12.5px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-[14px] py-[5px] whitespace-nowrap">{{ r.period }}</div>
            </div>
          </div>
        </section>
      </article>
    </div>
    <!-- end main layout -->

    <!-- ══════════════════════════════════════════════════════
         FOOTER CTA
    ══════════════════════════════════════════════════════ -->
    <div class="bg-gray-900 px-6 py-12">
      <div class="max-w-[800px] mx-auto flex flex-col items-center gap-4 text-center">
        <div class="w-[52px] h-[52px] text-white opacity-90">
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
          <h3 class="text-[20px] font-extrabold text-white m-0">Dữ liệu của bạn được bảo vệ tại SmartFood</h3>
          <p class="text-[14px] text-gray-400 m-0 leading-[1.6] max-w-[500px] mt-1">
            Chúng tôi định kỳ cập nhật chính sách để tuân thủ các quy định bảo
            vệ dữ liệu mới nhất.
          </p>
        </div>
        <div class="flex items-center gap-[10px]">
          <NuxtLink :to="ROUTES.TERMS_OF_SERVICE" class="text-[13px] text-gray-500 no-underline font-medium hover:text-green-500 transition-colors duration-200">Điều khoản dịch vụ</NuxtLink>
          <span class="text-gray-700">·</span>
          <NuxtLink :to="ROUTES.LEGAL" class="text-[13px] text-gray-500 no-underline font-medium hover:text-green-500 transition-colors duration-200">Pháp lý & Tuân thủ</NuxtLink>
          <span class="text-gray-700">·</span>
          <a href="#" class="text-[13px] text-gray-500 no-underline font-medium hover:text-green-500 transition-colors duration-200">Tải PDF</a>
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

/* ── HERO ─────────────────────────────────────────────── */
.csb-hero {
  position: relative;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  overflow: hidden;
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

/* ── SIDEBAR ──────────────────────────────────────────── */
.csb-main-layout {
  display: flex;
  gap: 32px;
  padding-top: 16px;
  padding-bottom: 64px;
  align-items: flex-start;
}
.csb-sidebar-sticky {
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* TOC items */
.csb-toc-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  color: #4b5563;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}
.csb-toc-item:hover {
  background: #f0fdf4;
  color: #15803d;
}
.csb-toc-active {
  background: #f0fdf4 !important;
  color: #15803d !important;
  font-weight: 700;
  border-left: 3px solid #16a34a;
  padding-left: 7px;
}
.csb-toc-num {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  min-width: 20px;
}
.csb-toc-active .csb-toc-num {
  color: #16a34a;
}

/* ── SECTIONS ─────────────────────────────────────────── */
.csb-section {
  padding: 48px 0;
  border-bottom: 1px solid #f3f4f6;
}
.csb-section:last-child {
  border-bottom: none;
}

/* ── INFO CARDS ───────────────────────────────────────── */
.csb-info-card {
  border: 1.5px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.csb-info-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
.csb-info-card--provided {
  border-top: 3px solid #16a34a;
}
.csb-info-card--auto {
  border-top: 3px solid #f97316;
}

/* ── SHARE CARD ─────────────────────────────────────────── */
.csb-share-card {
  padding: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}
.csb-share-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #bbf7d0;
}

/* ── RIGHTS CARD ────────────────────────────────────────── */
.csb-right-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s;
}
.csb-right-card:hover {
  border-color: #16a34a;
  background: #f0fdf4;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* ── LEGAL BADGES ─────────────────────────────────────── */
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

/* ══════════════════════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .csb-main-layout > aside {
    width: 220px;
  }
}
@media (max-width: 768px) {
  .csb-main-layout {
    flex-direction: column;
    padding-top: 8px;
  }
  .csb-main-layout > aside {
    width: 100%;
  }
  .csb-sidebar-sticky {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .csb-hero-inner {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px 20px;
    gap: 16px;
  }
  .csb-hero-inner > div:last-child p {
    margin: 0 auto;
  }
}
@media (max-width: 480px) {
  .csb-section {
    padding: 32px 0;
  }
}
</style>
