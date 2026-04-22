<template>
  <div class="bg-white text-[#111827]">
    <div
      class="fixed top-0 left-0 z-50 h-0.75 bg-[#F97316] transition-all duration-150"
      :style="{ width: `${readingProgress}%` }"
    ></div>

    <!-- SECTION 1: Hero -->
    <section
      class="relative h-50 overflow-hidden bg-linear-to-r from-[#F97316] to-[#EA580C] text-white"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_42%),radial-gradient(circle_at_85%_65%,rgba(255,255,255,0.14),transparent_32%)]"
      ></div>
      <div
        class="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
      >
        <svg
          class="w-14 h-14 float-soft"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="1.7"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 3h2l2 12h11l2-8H7M10 21a1 1 0 100-2 1 1 0 000 2zM18 21a1 1 0 100-2 1 1 0 000 2z"
          />
        </svg>
        <h1 class="mt-2 text-3xl md:text-4xl font-extrabold">
          Hướng Dẫn Mua Sắm Online
        </h1>
        <p class="mt-1 text-white/90">
          Đặt hàng đơn giản - Giao hàng nhanh - Thanh toán an toàn
        </p>
        <div
          class="mt-3 flex flex-wrap justify-center gap-2 text-xs md:text-sm"
        >
          <span class="pill">🛒 Dễ dàng</span>
          <span class="pill">🚚 Giao nhanh 2h</span>
          <span class="pill">💳 Đa thanh toán</span>
          <span class="pill">🔒 An toàn</span>
        </div>
      </div>
    </section>

    <!-- SECTION 2: Flow -->
    <section class="py-14 px-4 md:px-6 section-reveal">
      <div class="max-w-250 mx-auto">
        <h2 class="text-center text-3xl font-extrabold">Tổng Quan Quy Trình</h2>
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <article
            v-for="(step, idx) in flowSteps"
            :key="step.title"
            class="flow-item relative rounded-2xl border border-[#E5E7EB] bg-white p-4 text-center"
            :class="{ 'is-active': idx === highlightedFlow }"
          >
            <div
              class="w-14 h-14 rounded-full bg-[#FFF7ED] text-[#F97316] mx-auto grid place-items-center text-2xl"
            >
              {{ step.icon }}
            </div>
            <h3 class="mt-3 font-bold">{{ step.title }}</h3>
            <p class="text-sm text-[#6B7280] mt-1">{{ step.subtitle }}</p>
            <p class="tooltip">{{ step.tip }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- SECTION 3: Detail with sidebar -->
    <section class="py-10 px-4 md:px-6 bg-[#F9FAFB]">
      <div
        class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[28%_72%] gap-6"
      >
        <aside
          class="lg:sticky lg:top-8 h-fit rounded-2xl border border-[#E5E7EB] p-4 bg-white"
        >
          <h3 class="font-bold">Chi tiết từng bước</h3>
          <ul class="mt-3 space-y-2">
            <li v-for="(step, idx) in detailSteps" :key="step.id">
              <button
                class="w-full text-left px-3 py-2 rounded-lg"
                :class="
                  activeDetail === step.id
                    ? 'bg-[#FFF7ED] text-[#EA580C] font-semibold'
                    : 'hover:bg-[#F3F4F6]'
                "
                @click="scrollToSection(step.id)"
              >
                {{ idx + 1 }}. {{ step.title }}
              </button>
            </li>
          </ul>
          <div class="mt-4 rounded-xl border border-[#FDBA74] bg-[#FFF7ED] p-3">
            <p class="font-semibold">Cần hỗ trợ?</p>
            <button
              class="mt-2 w-full h-10 rounded-lg bg-[#F97316] text-white font-semibold"
            >
              Liên hệ ngay
            </button>
          </div>
        </aside>

        <div class="space-y-6">
          <section
            id="search"
            class="detail-section rounded-2xl border border-[#E5E7EB] bg-white p-5"
          >
            <h3 class="text-xl font-bold">§1 - Tìm kiếm & khám phá sản phẩm</h3>
            <div class="mt-4 space-y-3">
              <article class="rounded-xl border border-[#E5E7EB] p-4">
                🔍 Tìm kiếm theo tên -
                <span class="text-sm text-[#6B7280]"
                  >ô search giúp truy cập nhanh sản phẩm cần mua.</span
                >
              </article>
              <article class="rounded-xl border border-[#E5E7EB] p-4">
                📂 Duyệt theo danh mục -
                <span class="text-sm text-[#6B7280]"
                  >xem theo nhóm rau củ, thịt cá, đồ khô...</span
                >
              </article>
              <article class="rounded-xl border border-[#E5E7EB] p-4">
                🏷️ Lọc theo giá -
                <span class="text-sm text-[#6B7280]"
                  >rút gọn kết quả theo nhu cầu.</span
                >
              </article>
            </div>
            <p
              class="mt-3 rounded-lg bg-[#FFF7ED] border border-[#FED7AA] p-3 text-sm text-[#B45309]"
            >
              Mẹo: Gõ từ khóa ngắn + tên thương hiệu để kết quả chính xác hơn.
            </p>
          </section>

          <section
            id="product"
            class="detail-section rounded-2xl border border-[#E5E7EB] bg-white p-5"
          >
            <h3 class="text-xl font-bold">§2 - Xem chi tiết & chọn sản phẩm</h3>
            <div
              class="mt-4 rounded-xl border border-[#E5E7EB] bg-[#f8fafc] p-4 max-w-2xl"
            >
              <div
                class="grid grid-cols-[120px_1fr] sm:grid-cols-[180px_1fr] gap-4 sm:gap-6 rounded-2xl bg-white p-4 shadow-sm"
              >
                <div class="relative">
                  <span
                    class="absolute left-2 top-2 z-10 rounded bg-[#fced44] px-1.5 py-0.5 text-[10px] font-black text-black"
                    >-15%</span
                  >
                  <div
                    class="aspect-square w-full rounded-xl bg-gray-100 border border-gray-50 flex items-center justify-center text-gray-300 text-xs shadow-inner"
                  >
                    <svg
                      class="w-8 h-8 opacity-20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"
                      />
                    </svg>
                  </div>
                </div>
                <div class="flex flex-col justify-center">
                  <h4
                    class="font-bold text-[#222] text-[15px] sm:text-[17px] leading-tight"
                  >
                    Cá hồi Nauy phi lê tươi ngon 300g (Giao nhanh 2h)
                  </h4>
                  <div class="flex items-center gap-2 text-xs mt-2">
                    <div class="text-[#f59e0b] tracking-wider">★★★★★</div>
                    <span class="text-gray-400">(128)</span>
                  </div>
                  <div class="mt-3 flex items-end gap-2 sm:gap-3">
                    <p class="text-xl sm:text-[22px] font-black text-[#f47f20]">
                      179.000đ
                    </p>
                    <p class="text-sm text-gray-400 line-through mb-0.5">
                      210.000đ
                    </p>
                  </div>
                  <div class="mt-4 flex gap-2">
                    <button
                      class="flex-1 max-w-[140px] rounded-full bg-linear-to-r from-[#fc5c22] to-[#f47f20] px-3 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:brightness-110 transition-all"
                    >
                      🛒 Mua ngay
                    </button>
                    <button
                      class="flex-1 max-w-[140px] rounded-full bg-[#eef5fd] text-[#006ee6] px-3 py-2 text-xs sm:text-sm font-semibold hover:bg-[#d6e7f9] transition-colors"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <ul class="mt-4 list-disc pl-5 text-sm text-[#4B5563] space-y-1">
              <li>Ảnh sản phẩm đa góc, xuất xứ và hạn sử dụng.</li>
              <li>Thành phần, hướng dẫn bảo quản và đánh giá khách hàng.</li>
              <li>Sản phẩm tương tự để lựa chọn thêm.</li>
            </ul>
            <p
              class="mt-3 text-sm text-[#B45309] bg-[#FFF7ED] border border-[#FED7AA] p-3 rounded-lg"
            >
              ⚠️ Luôn kiểm tra hạn sử dụng và xuất xứ trước khi thêm vào giỏ.
            </p>
          </section>

          <section
            id="cart"
            class="detail-section rounded-2xl border border-[#E5E7EB] bg-white p-5"
          >
            <h3 class="text-xl font-bold">§3 - Giỏ hàng & đặt hàng</h3>
            <div
              class="mt-4 rounded-xl border border-[#E5E7EB] p-4 bg-[#f8fafc]"
            >
              <div class="space-y-3">
                <article
                  v-for="item in 2"
                  :key="item"
                  class="flex items-center gap-3 sm:gap-4 rounded-xl border bg-white p-3 sm:p-4 relative"
                  :class="item === 1 ? 'border-[#fdba74]' : 'border-[#e5e7eb]'"
                >
                  <div
                    class="grid place-items-center w-5 h-5 rounded border"
                    :class="
                      item === 1
                        ? 'border-[#f97316] bg-[#f97316] text-white'
                        : 'border-gray-300 bg-white'
                    "
                  >
                    <span
                      v-if="item === 1"
                      class="text-[10px] font-bold fill-current"
                      ><svg viewBox="0 0 14 14" class="w-3 h-3">
                        <path d="M5 10L2 7l1-1 2 2 6-6 1 1-7 7z" /></svg
                    ></span>
                  </div>
                  <div
                    class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-300 border border-gray-50 shadow-inner"
                  >
                    <svg
                      class="w-6 h-6 opacity-30"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"
                      />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="font-semibold text-[13px] sm:text-[15px] truncate text-[#111827]"
                    >
                      Sản phẩm Demo {{ item }}
                    </p>
                    <p class="text-[11px] sm:text-xs text-[#6B7280] mt-0.5">
                      Loại: Tươi sống · Mã: SP0{{ item }}
                    </p>
                    <div class="mt-2 flex items-center gap-2">
                      <button
                        class="w-6 h-6 sm:w-7 sm:h-7 rounded-md border border-gray-300 bg-gray-50 flex items-center justify-center hover:bg-[#fff7ed] hover:border-[#f97316] hover:text-[#f97316] transition-colors"
                      >
                        -
                      </button>
                      <strong
                        class="text-[13px] sm:text-[14px] w-4 text-center"
                        >{{ item }}</strong
                      >
                      <button
                        class="w-6 h-6 sm:w-7 sm:h-7 rounded-md border border-gray-300 bg-gray-50 flex items-center justify-center hover:bg-[#fff7ed] hover:border-[#f97316] hover:text-[#f97316] transition-colors"
                        :class="{
                          'cart-bounce text-[#f97316] border-[#f97316] bg-[#fff7ed]':
                            item === 1,
                        }"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div
                    class="text-right flex flex-col justify-between h-full items-end self-stretch py-1"
                  >
                    <p class="text-[15px] sm:text-lg font-bold text-[#ea580c]">
                      {{ item * 89 }}.000đ
                    </p>
                    <button
                      class="text-gray-400 hover:text-red-500 hover:bg-red-50 w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                    >
                      🗑
                    </button>
                  </div>
                </article>
              </div>
              <div class="mt-4 flex gap-2">
                <input
                  class="flex-1 h-10 border border-[#D1D5DB] rounded-lg px-3"
                  placeholder="Nhập mã voucher"
                />
                <button class="h-10 px-4 rounded-lg bg-[#F97316] text-white">
                  Áp dụng
                </button>
              </div>
            </div>
            <ul class="mt-4 text-sm space-y-1 text-[#374151]">
              <li>☑ Kiểm tra số lượng đúng chưa</li>
              <li>☑ Áp mã khuyến mãi nếu có</li>
              <li>☑ Chọn địa chỉ giao hàng chính xác</li>
              <li>☑ Chọn khung giờ giao phù hợp</li>
            </ul>
          </section>

          <section
            id="payment"
            class="detail-section rounded-2xl border border-[#E5E7EB] bg-white p-5"
          >
            <h3 class="text-xl font-bold">§4 - Thanh toán</h3>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <article
                v-for="item in payments"
                :key="item.title"
                class="pay-card rounded-xl border border-[#E5E7EB] p-4 bg-[#F9FAFB]"
              >
                <p class="text-2xl">{{ item.icon }}</p>
                <h4 class="font-semibold mt-1">{{ item.title }}</h4>
                <p
                  class="text-xs inline-block mt-1 px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#EA580C]"
                >
                  {{ item.badge }}
                </p>
                <p class="mt-2 text-sm text-[#6B7280]">{{ item.desc }}</p>
              </article>
            </div>
            <p
              class="mt-4 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] text-[#166534] p-3 text-sm"
            >
              Bảo mật SSL 256-bit - PCI DSS
            </p>
            <p class="mt-2 text-sm text-[#B45309]">
              ⚠️ Không chia sẻ OTP thanh toán với bất kỳ ai.
            </p>
          </section>

          <section
            id="delivery"
            class="detail-section rounded-2xl border border-[#E5E7EB] bg-white p-5"
          >
            <h3 class="text-xl font-bold">§5 - Nhận hàng & sau mua</h3>
            <div class="mt-4 relative pl-5">
              <div class="timeline-line"></div>
              <div
                v-for="item in deliveryTimeline"
                :key="item"
                class="relative mb-4 pl-4"
              >
                <span
                  class="absolute -left-5.5 top-1 w-3 h-3 rounded-full bg-[#F97316]"
                ></span>
                <p class="text-sm">{{ item }}</p>
              </div>
            </div>
            <ul class="text-sm text-[#374151] space-y-1">
              <li>☑ Kiểm tra bao bì, tình trạng sản phẩm</li>
              <li>☑ Đối chiếu số lượng và hóa đơn</li>
              <li>☑ Đánh giá sau mua để tích điểm</li>
              <li>☑ Nhận ưu đãi cho đơn kế tiếp</li>
            </ul>
          </section>
        </div>
      </div>
    </section>

    <!-- SECTION 4 delivery methods -->
    <section class="py-14 px-4 md:px-6 section-reveal">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-extrabold text-center">
          Phương Thức Giao Hàng
        </h2>
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <article
            v-for="item in shippingMethods"
            :key="item.title"
            class="rounded-2xl border border-[#E5E7EB] p-5 bg-white"
          >
            <p class="text-3xl">{{ item.icon }}</p>
            <h3 class="mt-2 font-bold">{{ item.title }}</h3>
            <p class="mt-1 text-sm text-[#6B7280]">{{ item.desc }}</p>
          </article>
        </div>

        <div class="mt-6 overflow-x-auto rounded-xl border border-[#E5E7EB]">
          <table class="w-full text-sm">
            <thead class="bg-[#FFF7ED]">
              <tr>
                <th class="text-left px-4 py-2">Khoảng cách</th>
                <th class="text-left px-4 py-2">Phí giao</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in fees"
                :key="row.distance"
                class="border-t border-[#E5E7EB]"
              >
                <td class="px-4 py-2">{{ row.distance }}</td>
                <td class="px-4 py-2">{{ row.fee }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p
          class="mt-3 text-center rounded-lg bg-[#FFF7ED] border border-[#FDBA74] p-3 text-[#C2410C] font-semibold"
        >
          Miễn phí giao hàng khi đơn >= 200.000đ
        </p>
      </div>
    </section>

    <!-- SECTION 5 vouchers -->
    <section class="py-12 px-4 md:px-6 bg-[#F9FAFB] section-reveal">
      <div
        class="max-w-4xl mx-auto rounded-2xl border border-[#E5E7EB] bg-white p-6"
      >
        <h2 class="text-2xl font-bold">Mã khuyến mãi & voucher</h2>
        <div class="mt-4 flex gap-2">
          <input
            class="flex-1 h-11 rounded-lg border px-3"
            placeholder="Nhập mã voucher"
          />
          <button class="h-11 px-5 rounded-lg bg-[#F97316] text-white">
            Áp dụng
          </button>
        </div>
        <div
          class="mt-3 rounded-lg border border-[#16A34A] bg-[#F0FDF4] p-3 text-sm text-[#166534] voucher-success"
        >
          ✓ Áp mã thành công - Đã giảm 30.000đ
        </div>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div class="rounded-lg border border-[#E5E7EB] p-3">
            🏷️ SMART10 - Giảm 10%
          </div>
          <div class="rounded-lg border border-[#E5E7EB] p-3">
            💰 SAVE30K - Giảm 30.000đ
          </div>
          <div class="rounded-lg border border-[#E5E7EB] p-3">
            🚚 FREESHIP50 - Miễn phí giao
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 6 FAQ -->
    <section class="py-14 px-4 md:px-6 section-reveal">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-extrabold">FAQ mua sắm</h2>
        <div class="mt-5 space-y-3">
          <article
            v-for="(faq, idx) in faqs"
            :key="faq.q"
            class="border border-[#E5E7EB] rounded-xl overflow-hidden"
          >
            <button
              class="w-full px-4 py-3 bg-[#F9FAFB] text-left flex justify-between items-center"
              @click="toggleFaq(idx)"
            >
              <span>{{ faq.q }}</span>
              <span
                class="text-[#F97316] text-xl"
                :class="{ 'rotate-45': openFaq === idx }"
                >+</span
              >
            </button>
            <div class="faq-body" :class="{ open: openFaq === idx }">
              <p class="px-4 pb-4 text-sm text-[#6B7280]">{{ faq.a }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";

const readingProgress = ref(0);
const highlightedFlow = ref(0);
const activeDetail = ref("search");
const openFaq = ref<number | null>(0);

const flowSteps = [
  {
    icon: "🔎",
    title: "Tìm sản phẩm",
    subtitle: "Khám phá nhanh",
    tip: "Tìm theo tên hoặc danh mục",
  },
  {
    icon: "🧺",
    title: "Thêm giỏ hàng",
    subtitle: "Chọn số lượng",
    tip: "Kiểm tra ưu đãi trước khi thêm",
  },
  {
    icon: "📝",
    title: "Đặt hàng",
    subtitle: "Xác nhận thông tin",
    tip: "Điền địa chỉ và khung giờ giao",
  },
  {
    icon: "💳",
    title: "Thanh toán",
    subtitle: "Nhiều lựa chọn",
    tip: "Ưu tiên phương thức phù hợp",
  },
  {
    icon: "✅",
    title: "Nhận hàng",
    subtitle: "Kiểm tra sản phẩm",
    tip: "Đánh giá để tích điểm thưởng",
  },
];

const detailSteps = [
  { id: "search", title: "Tìm kiếm sản phẩm" },
  { id: "product", title: "Xem chi tiết sản phẩm" },
  { id: "cart", title: "Giỏ hàng & đặt hàng" },
  { id: "payment", title: "Thanh toán" },
  { id: "delivery", title: "Nhận hàng & sau mua" },
];

const payments = [
  {
    icon: "💳",
    title: "Thẻ ATM/VISA/Master",
    badge: "Phổ biến",
    desc: "Xử lý nhanh, tiện lợi cho đơn giá trị cao.",
  },
  {
    icon: "📱",
    title: "Ví MoMo / ZaloPay / VNPay",
    badge: "Nhanh nhất",
    desc: "Hoàn tất chỉ trong vài giây.",
  },
  {
    icon: "🏦",
    title: "Chuyển khoản ngân hàng",
    badge: "An toàn",
    desc: "Phù hợp doanh nghiệp và đơn đặt trước.",
  },
  {
    icon: "💵",
    title: "Tiền mặt khi nhận hàng",
    badge: "Tiện lợi",
    desc: "Thanh toán trực tiếp khi shipper giao hàng.",
  },
];

const deliveryTimeline = [
  "📧 Xác nhận qua email (ngay lập tức)",
  "🏪 Xử lý đơn & đóng gói (1-2h)",
  "🚴 Shipper lấy hàng & giao (trong ngày hoặc hẹn giờ)",
  "✅ Nhận hàng - kiểm tra trước khi ký",
];

const shippingMethods = [
  {
    icon: "⚡",
    title: "Giao nhanh.",
    desc: "Trong nội thành Đà Nẵng.",
  },
  {
    icon: "📅",
    title: "Giao theo lịch",
    desc: "Chọn khung giờ phù hợp lịch trình.",
  },
  {
    icon: "🏪",
    title: "Nhận tại cửa hàng",
    desc: "Chủ động đến lấy khi đơn sẵn sàng.",
  },
];

const fees = [
  { distance: "< 5km", fee: "15.000đ" },
  { distance: "5-10km", fee: "25.000đ" },
  { distance: "> 10km", fee: "35.000đ" },
];

const faqs = [
  {
    q: "Đặt hàng xong bao lâu thì nhận được?",
    a: "Nội thành có thể giao trong 2h, ngoài khu vực tùy khung giờ bạn chọn.",
  },
  {
    q: "Tôi có thể thay đổi / hủy đơn hàng không?",
    a: "Có, trước khi đơn chuyển sang trạng thái đang giao.",
  },
  {
    q: "Đơn hàng tối thiểu là bao nhiêu?",
    a: "SmartFood không áp mức tối thiểu, nhưng freeship áp dụng theo ngưỡng.",
  },
  {
    q: "Tôi ở ngoại thành có giao không?",
    a: "Hiện tại chưa hỗ trợ giao hàng đến khu vực ngoại thành.",
  },
  {
    q: "Làm sao biết shipper đang giao đến đâu?",
    a: "Bạn theo dõi realtime trong phần đơn hàng của tài khoản.",
  },
  {
    q: "Đặt hàng qua app và web có khác nhau không?",
    a: "Giá và chương trình cơ bản giống nhau, một số ưu đãi có thể áp dụng riêng theo kênh.",
  },
];

const toggleFaq = (idx: number) => {
  openFaq.value = openFaq.value === idx ? null : idx;
};

const scrollToSection = (id: string) => {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const onScroll = () => {
  const top = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  readingProgress.value =
    maxScroll > 0 ? Math.min((top / maxScroll) * 100, 100) : 0;

  const reveals = document.querySelectorAll<HTMLElement>(".section-reveal");
  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 90) el.classList.add("is-visible");
  });

  detailSteps.forEach((step) => {
    const el = document.getElementById(step.id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top <= 130 && rect.bottom >= 130) activeDetail.value = step.id;
  });
};

let flowInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  flowInterval = setInterval(() => {
    highlightedFlow.value = (highlightedFlow.value + 1) % flowSteps.length;
  }, 1200);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  if (flowInterval) clearInterval(flowInterval);
});
</script>

<style scoped>
.pill {
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 9999px;
  padding: 4px 10px;
}

.float-soft {
  animation: floatSoft 2.8s ease-in-out infinite alternate;
}

.section-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.section-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.flow-item {
  opacity: 0;
  transform: translateY(16px);
  animation: flowEnter 0.45s ease forwards;
}

.flow-item:nth-child(1) {
  animation-delay: 0.1s;
}
.flow-item:nth-child(2) {
  animation-delay: 0.2s;
}
.flow-item:nth-child(3) {
  animation-delay: 0.3s;
}
.flow-item:nth-child(4) {
  animation-delay: 0.4s;
}
.flow-item:nth-child(5) {
  animation-delay: 0.5s;
}

.flow-item .tooltip {
  opacity: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -28px;
  background: #111827;
  color: #fff;
  font-size: 11px;
  border-radius: 6px;
  padding: 4px 8px;
  white-space: nowrap;
  transition: opacity 0.2s ease;
}

.flow-item:hover .tooltip {
  opacity: 1;
}

.flow-item.is-active {
  border-color: #f97316;
  box-shadow: 0 10px 20px rgba(249, 115, 22, 0.18);
}

.detail-section {
  scroll-margin-top: 92px;
}

.cart-bounce {
  animation: cartBounce 1.2s ease-in-out infinite;
}

.pay-card {
  transition: transform 0.25s ease;
}

.pay-card:hover {
  transform: perspective(500px) rotateY(5deg);
}

.timeline-line {
  position: absolute;
  left: -2px;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: linear-gradient(#f97316, #fb923c);
  animation: drawLine 0.8s ease;
}

.voucher-success {
  animation: voucherSuccess 0.8s ease;
}

.faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-body.open {
  max-height: 170px;
}

@keyframes floatSoft {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-8px);
  }
}

@keyframes flowEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cartBounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.12);
  }
}

@keyframes drawLine {
  from {
    transform: scaleY(0);
    transform-origin: top;
  }
  to {
    transform: scaleY(1);
    transform-origin: top;
  }
}

@keyframes voucherSuccess {
  0% {
    transform: scale(0.98);
    border-color: #f97316;
  }
  100% {
    transform: scale(1);
    border-color: #16a34a;
  }
}
</style>
