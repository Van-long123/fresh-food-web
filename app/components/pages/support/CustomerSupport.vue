<template>
  <div class="font-sans text-gray-800 bg-white">
    <!-- ========================================================
         SECTION 1 — HERO BANNER
         ======================================================== -->
    <section class="hero-banner reveal" ref="heroRef">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="dots"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="3" fill="white" fill-opacity="0.10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <div class="hero-inner">
        <div class="hero-left">
          <div class="w-16 h-16 shrink-0">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="32"
                cy="28"
                r="16"
                stroke="white"
                stroke-width="3"
                fill="none"
              />
              <path
                d="M20 28 C20 21 25.4 16 32 16 C38.6 16 44 21 44 28"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
                fill="none"
              />
              <path
                d="M18 28 C16.3 28 15 29.3 15 31 L15 33 C15 34.7 16.3 36 18 36 L18 28Z"
                fill="white"
              />
              <path
                d="M46 28 L46 36 C47.7 36 49 34.7 49 33 L49 31 C49 29.3 47.7 28 46 28Z"
                fill="white"
              />
              <path
                d="M32 44 L32 50 M26 50 L38 50"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div class="hero-text">
            <h1 class="hero-title">Hỗ Trợ Khách Hàng</h1>
            <p class="hero-sub">Chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7</p>
          </div>
        </div>
        <div class="hero-badges">
          <span class="badge">🕐 24/7 Hỗ trợ</span>
          <span class="badge">⚡ Phản hồi nhanh</span>
          <span class="badge">✅ Giải quyết tận tâm</span>
        </div>
      </div>
    </section>

    <!-- ========================================================
         SECTION 2 — KÊNH LIÊN HỆ NHANH
         ======================================================== -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-[1200px] mx-auto px-5">
        <h2 class="text-[1.75rem] font-black text-gray-900 text-center mb-2">
          Kênh Liên Hệ Nhanh
        </h2>
        <div class="contact-grid">
          <div
            v-for="(channel, i) in channels"
            :key="channel.id"
            class="contact-card reveal"
            :style="{ transitionDelay: `${i * 100}ms` }"
            :ref="(el) => setRef(el, `card${i}`)"
          >
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center mb-1"
              :style="{ background: channel.iconBg }"
            >
              <span class="card-svg w-8 h-8" v-html="channel.icon" />
            </div>
            <h3 class="text-base font-extrabold text-gray-900 m-0">
              {{ channel.name }}
            </h3>
            <p class="text-[0.95rem] font-bold text-orange-500 m-0">
              {{ channel.detail }}
            </p>
            <p class="text-[0.78rem] text-gray-500 m-0">{{ channel.meta }}</p>
            <button
              class="card-btn"
              :class="channel.btnStyle"
              @click="handleChannelAction(channel.id)"
            >
              {{ channel.btnLabel }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================
         SECTION 3 — FAQ
         ======================================================== -->
    <section class="py-12 bg-white">
      <div class="max-w-[1200px] mx-auto px-5">
        <div class="mb-6 reveal" ref="faqHeaderRef">
          <h2 class="text-[1.75rem] font-black text-gray-900 text-center mb-2">
            Câu Hỏi Thường Gặp
          </h2>
          <p class="text-[0.95rem] text-gray-500 text-center mb-8">
            Tìm câu trả lời nhanh cho những thắc mắc phổ biến
          </p>
        </div>

        <TabView class="faq-tabs" v-model:activeIndex="activeTab">
          <TabPanel v-for="tab in faqTabs" :key="tab.label" :header="tab.label">
            <Accordion :multiple="true" class="faq-accordion">
              <AccordionPanel
                v-for="(item, idx) in tab.items"
                :key="idx"
                :value="String(idx)"
              >
                <AccordionHeader>
                  <span class="mr-2">💬</span>
                  {{ item.q }}
                </AccordionHeader>
                <AccordionContent>
                  <p class="text-gray-600 leading-[1.75] m-0 text-[0.9rem]">
                    {{ item.a }}
                  </p>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </TabPanel>
        </TabView>
      </div>
    </section>

    <!-- ========================================================
         SECTION 4 — FORM GỬI YÊU CẦU
         ======================================================== -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-[1200px] mx-auto px-5">
        <div class="form-grid">
          <!-- LEFT: Form -->
          <div class="reveal" ref="formRef">
            <h2 class="text-[1.75rem] font-black text-gray-900 text-left mb-1">
              Gửi Yêu Cầu Hỗ Trợ
            </h2>
            <p class="text-[0.95rem] text-gray-500 text-left mb-6">
              Điền thông tin bên dưới, chúng tôi sẽ liên hệ trong vòng 2 giờ
            </p>

            <!-- Success overlay -->
            <Transition name="succ-fade">
              <div v-if="submitSuccess" class="form-success">
                <svg viewBox="0 0 90 90" class="w-20 h-20">
                  <circle
                    cx="45"
                    cy="45"
                    r="38"
                    fill="none"
                    stroke="#16A34A"
                    stroke-width="4"
                    stroke-dasharray="239"
                    stroke-dashoffset="239"
                    class="succ-circle"
                  />
                  <path
                    d="M26 45l13 13 25-25"
                    fill="none"
                    stroke="#16A34A"
                    stroke-width="5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-dasharray="55"
                    stroke-dashoffset="55"
                    class="succ-check"
                  />
                </svg>
                <h3 class="text-2xl font-black text-green-600 m-0">
                  Gửi thành công!
                </h3>
                <p class="text-gray-500 m-0">
                  Chúng tôi sẽ liên hệ với bạn trong vòng 2 giờ!
                </p>
                <button class="btn-primary" @click="submitSuccess = false">
                  Gửi yêu cầu khác
                </button>
              </div>
            </Transition>

            <form
              v-if="!submitSuccess"
              novalidate
              @submit.prevent="handleSubmit"
              class="flex flex-col gap-4"
            >
              <div class="flex flex-col gap-[0.375rem]">
                <label class="text-[0.875rem] font-semibold text-gray-700"
                  >Loại yêu cầu <span class="text-red-500">*</span></label
                >
                <Select
                  v-model="form.type"
                  :options="requestTypes"
                  option-label="label"
                  option-value="value"
                  placeholder="Chọn loại yêu cầu"
                  class="w-full"
                />
                <small v-if="errors.type" class="text-xs text-red-500">{{
                  errors.type
                }}</small>
              </div>

              <div class="field-row">
                <div class="flex flex-col gap-[0.375rem]">
                  <label class="text-[0.875rem] font-semibold text-gray-700"
                    >Họ và tên <span class="text-red-500">*</span></label
                  >
                  <div class="relative">
                    <i class="pi pi-user input-icon" />
                    <InputText
                      v-model="form.name"
                      placeholder="Nguyễn Văn A"
                      class="w-full"
                      :invalid="!!errors.name"
                    />
                  </div>
                  <small v-if="errors.name" class="text-xs text-red-500">{{
                    errors.name
                  }}</small>
                </div>
                <div class="flex flex-col gap-[0.375rem]">
                  <label class="text-[0.875rem] font-semibold text-gray-700"
                    >Số điện thoại <span class="text-red-500">*</span></label
                  >
                  <div class="relative">
                    <i class="pi pi-phone input-icon" />
                    <InputText
                      v-model="form.phone"
                      placeholder="0912 345 678"
                      class="w-full"
                      :invalid="!!errors.phone"
                    />
                  </div>
                  <small v-if="errors.phone" class="text-xs text-red-500">{{
                    errors.phone
                  }}</small>
                </div>
              </div>

              <div class="field-row">
                <div class="flex flex-col gap-[0.375rem]">
                  <label class="text-[0.875rem] font-semibold text-gray-700"
                    >Email <span class="text-red-500">*</span></label
                  >
                  <div class="relative">
                    <i class="pi pi-envelope input-icon" />
                    <InputText
                      v-model="form.email"
                      placeholder="email@example.com"
                      class="w-full"
                      :invalid="!!errors.email"
                    />
                  </div>
                  <small v-if="errors.email" class="text-xs text-red-500">{{
                    errors.email
                  }}</small>
                </div>
                <div class="flex flex-col gap-[0.375rem]">
                  <label class="text-[0.875rem] font-semibold text-gray-700"
                    >Mã đơn hàng
                    <span class="text-gray-400 text-[0.8rem] font-normal"
                      >(tuỳ chọn)</span
                    ></label
                  >
                  <div class="relative">
                    <i class="pi pi-barcode input-icon" />
                    <InputText
                      v-model="form.orderId"
                      placeholder="SF-2024-XXXXXX"
                      class="w-full"
                    />
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-[0.375rem]">
                <label class="text-[0.875rem] font-semibold text-gray-700"
                  >Nội dung yêu cầu <span class="text-red-500">*</span></label
                >
                <Textarea
                  v-model="form.message"
                  :rows="4"
                  placeholder="Mô tả chi tiết vấn đề bạn gặp phải để chúng tôi hỗ trợ nhanh hơn..."
                  class="w-full"
                  :invalid="!!errors.message"
                />
                <small v-if="errors.message" class="text-xs text-red-500">{{
                  errors.message
                }}</small>
              </div>

              <div class="flex flex-col gap-[0.375rem]">
                <label class="text-[0.875rem] font-semibold text-gray-700"
                  >Đính kèm ảnh
                  <span class="text-gray-400 text-[0.8rem] font-normal"
                    >(tuỳ chọn)</span
                  ></label
                >
                <div
                  class="upload-box"
                  @click="triggerFileInput"
                  @dragover.prevent
                  @drop.prevent="handleDrop"
                >
                  <i class="pi pi-upload text-2xl text-gray-400" />
                  <p class="text-[0.875rem] text-gray-500 my-1">
                    Kéo thả hoặc
                    <span class="text-orange-500 font-semibold">chọn ảnh</span>
                  </p>
                  <p class="text-xs text-gray-400 m-0">PNG, JPG tối đa 5MB</p>
                  <input
                    ref="fileInputRef"
                    type="file"
                    accept="image/*"
                    multiple
                    style="display: none"
                    @change="handleFileChange"
                  />
                </div>
                <div
                  v-if="uploadedFiles.length"
                  class="flex flex-wrap gap-2 mt-2"
                >
                  <span
                    v-for="f in uploadedFiles"
                    :key="f.name"
                    class="flex items-center gap-[0.375rem] bg-orange-50 border border-orange-200 text-orange-600 text-[0.78rem] font-semibold py-1 px-[0.625rem] rounded-full"
                  >
                    📎 {{ f.name }}
                    <button
                      type="button"
                      @click="removeFile(f.name)"
                      class="bg-transparent border-0 cursor-pointer text-orange-600 text-base leading-none p-0"
                    >
                      ×
                    </button>
                  </span>
                </div>
              </div>

              <button
                type="submit"
                class="btn-primary btn-submit"
                :disabled="submitting"
              >
                <svg
                  v-if="submitting"
                  class="spinner"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    class="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    class="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <i v-else class="pi pi-send" />
                {{ submitting ? "Đang gửi..." : "Gửi Yêu Cầu" }}
              </button>
            </form>
          </div>

          <!-- RIGHT: Info box -->
          <div class="reveal" ref="infoRef">
            <div
              class="bg-orange-50 border-[1.5px] border-orange-200 rounded-[1.25rem] p-7"
            >
              <h3 class="text-[1.1rem] font-extrabold text-gray-900 mb-5 mt-0">
                Thông Tin Liên Hệ
              </h3>
              <ul class="list-none p-0 mb-5 mt-0 flex flex-col gap-4">
                <li class="flex gap-[0.875rem] items-start">
                  <i
                    class="pi pi-map-marker text-orange-500 text-base mt-[0.2rem] shrink-0"
                  />
                  <div>
                    <p class="text-xs font-semibold text-gray-400 m-0">
                      Địa chỉ văn phòng
                    </p>
                    <p class="text-[0.875rem] text-gray-700 m-0 font-medium">
                      123 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng
                    </p>
                  </div>
                </li>
                <li class="flex gap-[0.875rem] items-start">
                  <i
                    class="pi pi-clock text-orange-500 text-base mt-[0.2rem] shrink-0"
                  />
                  <div>
                    <p class="text-xs font-semibold text-gray-400 m-0">
                      Giờ làm việc
                    </p>
                    <p class="text-[0.875rem] text-gray-700 m-0 font-medium">
                      Thứ 2 – Thứ 7: 8:00 – 22:00
                    </p>
                    <p class="text-[0.875rem] text-gray-700 m-0 font-medium">
                      Chủ nhật: 9:00 – 20:00
                    </p>
                  </div>
                </li>
                <li class="flex gap-[0.875rem] items-start">
                  <i
                    class="pi pi-phone text-orange-500 text-base mt-[0.2rem] shrink-0"
                  />
                  <div>
                    <p class="text-xs font-semibold text-gray-400 m-0">
                      Hotline
                    </p>
                    <p
                      class="text-[0.875rem] m-0 font-medium"
                      style="color: #f97316; font-weight: 700"
                    >
                      1800.5858
                    </p>
                  </div>
                </li>
                <li class="flex gap-[0.875rem] items-start">
                  <i
                    class="pi pi-envelope text-orange-500 text-base mt-[0.2rem] shrink-0"
                  />
                  <div>
                    <p class="text-xs font-semibold text-gray-400 m-0">Email</p>
                    <p class="text-[0.875rem] text-gray-700 m-0 font-medium">
                      hotro@smartfood.vn
                    </p>
                  </div>
                </li>
              </ul>

              <!-- Map placeholder -->
              <div class="map-placeholder">
                <i class="pi pi-map" style="font-size: 2rem; color: #9ca3af" />
                <p>Bản đồ Google Maps</p>
                <small>Nhấn để mở chỉ đường</small>
              </div>

              <!-- SLA commitments -->
              <div
                class="bg-green-50 border border-green-200 rounded-xl p-4 pb-[1rem]"
              >
                <p
                  class="text-[0.85rem] font-bold text-green-800 mb-[0.625rem] mt-0"
                >
                  Cam kết của chúng tôi
                </p>
                <ul class="list-none p-0 m-0 flex flex-col gap-[0.375rem]">
                  <li
                    class="text-[0.8rem] text-green-800 flex gap-2 items-center"
                  >
                    <span class="font-black">✓</span> Phản hồi trong vòng 2 giờ
                    (8h–22h)
                  </li>
                  <li
                    class="text-[0.8rem] text-green-800 flex gap-2 items-center"
                  >
                    <span class="font-black">✓</span> Giải quyết triệt để trong
                    24 giờ
                  </li>
                  <li
                    class="text-[0.8rem] text-green-800 flex gap-2 items-center"
                  >
                    <span class="font-black">✓</span> Hoàn tiền 100% nếu lỗi từ
                    SmartFood
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================
         SECTION 5 — THỐNG KÊ TIN TƯỞNG
         ======================================================== -->
    <section class="py-12 bg-orange-50" ref="statsRef">
      <div class="max-w-[1200px] mx-auto px-5">
        <div class="stats-grid">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="flex flex-col items-center gap-2"
          >
            <span class="text-[2rem]">{{ stat.icon }}</span>
            <span
              class="text-[2.5rem] font-black text-orange-500 leading-none"
              >{{ stat.display }}</span
            >
            <span class="text-[0.875rem] text-gray-500 font-semibold">{{
              stat.label
            }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

// ===== TYPES =====
interface FormData {
  type: string;
  name: string;
  phone: string;
  email: string;
  orderId: string;
  message: string;
}

interface FaqItem {
  q: string;
  a: string;
}
interface FaqTab {
  label: string;
  items: FaqItem[];
}
interface Stat {
  icon: string;
  label: string;
  target: number;
  display: string;
  suffix: string;
}

// ===== REFS =====
const activeTab = ref(0);
const submitting = ref(false);
const submitSuccess = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const uploadedFiles = ref<{ name: string }[]>([]);
const statsRef = ref<HTMLElement | null>(null);
const statsStarted = ref(false);

// ===== FORM =====
const form = reactive<FormData>({
  type: "",
  name: "",
  phone: "",
  email: "",
  orderId: "",
  message: "",
});
const errors = reactive({
  type: "",
  name: "",
  phone: "",
  email: "",
  message: "",
});

const requestTypes = [
  { label: "Vấn đề đặt hàng", value: "order" },
  { label: "Vấn đề giao hàng", value: "delivery" },
  { label: "Vấn đề thanh toán", value: "payment" },
  { label: "Đổi / Trả hàng", value: "return" },
  { label: "Khiếu nại", value: "complaint" },
  { label: "Khác", value: "other" },
];

const validate = () => {
  errors.type = errors.name = errors.phone = errors.email = errors.message = "";
  let ok = true;
  if (!form.type) {
    errors.type = "Vui lòng chọn loại yêu cầu.";
    ok = false;
  }
  if (!form.name) {
    errors.name = "Vui lòng nhập họ tên.";
    ok = false;
  }
  if (!form.phone) {
    errors.phone = "Vui lòng nhập số điện thoại.";
    ok = false;
  }
  if (!form.email) {
    errors.email = "Vui lòng nhập email.";
    ok = false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = "Email không hợp lệ.";
    ok = false;
  }
  if (!form.message) {
    errors.message = "Vui lòng mô tả yêu cầu.";
    ok = false;
  }
  return ok;
};

const handleSubmit = async () => {
  if (!validate()) return;
  submitting.value = true;
  await new Promise((r) => setTimeout(r, 1800));
  submitting.value = false;
  submitSuccess.value = true;
  Object.assign(form, {
    type: "",
    name: "",
    phone: "",
    email: "",
    orderId: "",
    message: "",
  });
  uploadedFiles.value = [];
};

// ===== FILE UPLOAD =====
const triggerFileInput = () => fileInputRef.value?.click();
const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  for (const f of Array.from(files)) {
    if (!uploadedFiles.value.find((x) => x.name === f.name)) {
      uploadedFiles.value.push({ name: f.name });
    }
  }
};
const handleDrop = (e: DragEvent) => {
  const files = e.dataTransfer?.files;
  if (!files) return;
  for (const f of Array.from(files)) {
    if (!uploadedFiles.value.find((x) => x.name === f.name)) {
      uploadedFiles.value.push({ name: f.name });
    }
  }
};
const removeFile = (name: string) => {
  uploadedFiles.value = uploadedFiles.value.filter((f) => f.name !== name);
};

// ===== SCROLL REVEAL =====
const setRef = (el: any, _key: string) => {
  if (el) observeEl(el);
};

const observeEl = (el: Element) => {
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

// ===== CONTACT CHANNELS =====
const channelActions: Record<string, () => void> = {
  hotline: () => window.open("tel:18005858"),
  chat: () => {},
  email: () => window.open("mailto:hotro@smartfood.vn"),
  zalo: () => {},
};
const handleChannelAction = (id: string) => channelActions[id]?.();

const channels = [
  {
    id: "hotline",
    name: "Hotline",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`,
    iconBg: "#FFF7ED",
    detail: "1800.5858",
    meta: "Miễn phí • 8h–22h hàng ngày",
    btnLabel: "Gọi ngay",
    btnStyle: "btn-primary",
  },
  {
    id: "chat",
    name: "Live Chat",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>`,
    iconBg: "#FFF7ED",
    detail: "Chat trực tiếp",
    meta: "Phản hồi trong 2 phút",
    btnLabel: "Chat ngay",
    btnStyle: "btn-outline",
  },
  {
    id: "email",
    name: "Email",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
    iconBg: "#FFF7ED",
    detail: "hotro@smartfood.vn",
    meta: "Phản hồi trong 2–4 giờ",
    btnLabel: "Gửi email",
    btnStyle: "btn-outline",
  },
  {
    id: "zalo",
    name: "Zalo OA",
    icon: `<svg viewBox="0 0 48 48" fill="#0068FF" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="12" fill="#0068FF"/><text x="50%" y="58%" text-anchor="middle" fill="white" font-size="20" font-weight="bold" font-family="Arial">Z</text></svg>`,
    iconBg: "#EFF6FF",
    detail: "SmartFood Official",
    meta: "Nhắn tin qua Zalo",
    btnLabel: "Kết nối Zalo",
    btnStyle: "btn-zalo",
  },
];

// ===== FAQ DATA =====
const faqTabs: FaqTab[] = [
  {
    label: "🛒 Đặt hàng",
    items: [
      {
        q: "Làm thế nào để đặt hàng trên SmartFood?",
        a: "Bạn có thể đặt hàng bằng cách chọn sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán. Quá trình rất đơn giản và chỉ mất vài phút.",
      },
      {
        q: "Tôi có thể đặt hàng số lượng lớn không?",
        a: "Có! Đối với đơn hàng số lượng lớn (từ 50kg trở lên), vui lòng liên hệ hotline 1800.5858 để được hỗ trợ và nhận báo giá ưu đãi.",
      },
      {
        q: "Có thể đặt hàng trước không?",
        a: "SmartFood hỗ trợ đặt hàng trước tối đa 7 ngày. Bạn chọn ngày giao mong muốn khi thanh toán.",
      },
      {
        q: "Làm sao để hủy đơn hàng?",
        a: 'Bạn có thể hủy đơn trong vòng 30 phút sau khi đặt. Vào "Đơn hàng của tôi" và nhấn "Hủy đơn". Sau 30 phút vui lòng liên hệ hotline.',
      },
      {
        q: "Sản phẩm out-of-stock, tôi phải làm gì?",
        a: 'Nhấn "Thông báo khi có hàng" trên trang sản phẩm. Chúng tôi sẽ gửi email ngay khi hàng về.',
      },
    ],
  },
  {
    label: "🚚 Giao hàng",
    items: [
      {
        q: "Thời gian giao hàng là bao lâu?",
        a: "Giao hàng trong 2 giờ với đơn hàng đặt trước 20h tại Đà Nẵng.",
      },
      {
        q: "Phí giao hàng như thế nào?",
        a: "Miễn phí giao hàng cho đơn từ 200.000đ trong nội thành. Đơn dưới 200.000đ phí 15.000đ.",
      },
      // {
      //   q: "Tôi có thể theo dõi đơn hàng không?",
      //   a: 'Có! Sau khi đặt hàng, bạn nhận được link theo dõi qua SMS và email. Vào "Đơn hàng" → "Theo dõi đơn".',
      // },
      {
        q: "Shipper không giao đúng giờ phải làm sao?",
        a: "Vui lòng liên hệ hotline 1800.5858 ngay khi giao trễ quá 30 phút. Chúng tôi sẽ xử lý và bồi thường nếu lỗi từ phía chúng tôi.",
      },
      {
        q: "Giao hàng vào cuối tuần và ngày lễ không?",
        a: "Giao đầy đủ 7 ngày/tuần kể cả ngày lễ từ 6h–22h. Một số ngày lễ lớn có thể có điều chỉnh, thông báo trước 3 ngày.",
      },
    ],
  },
  {
    label: "💳 Thanh toán",
    items: [
      {
        q: "SmartFood hỗ trợ những phương thức thanh toán nào?",
        a: "Tiền mặt khi nhận hàng (COD), thẻ ATM nội địa, VISA/Mastercard, ZaloPay, MoMo, VNPay QR, chuyển khoản ngân hàng.",
      },
      {
        q: "Thanh toán online có an toàn không?",
        a: "Chúng tôi sử dụng chuẩn bảo mật SSL 256-bit và tích hợp cổng thanh toán được PCI DSS chứng nhận. Thông tin thẻ không được lưu trữ.",
      },
      {
        q: "Tôi bị trừ tiền nhưng đơn hàng không thành công?",
        a: "Vui lòng chờ 5–15 phút để hệ thống xử lý. Nếu sau 30 phút vẫn chưa thấy đơn, liên hệ hotline với thông tin giao dịch để được hoàn tiền ngay.",
      },
      {
        q: "Có thể sử dụng voucher cùng với ưu đãi khác không?",
        a: "Mỗi đơn hàng áp dụng tối đa 1 mã voucher. Một số chương trình khuyến mãi tự động có thể kết hợp được, xem điều kiện từng chương trình.",
      },
      // {
      //   q: "Hóa đơn điện tử lấy ở đâu?",
      //   a: 'Sau khi đặt hàng thành công, hóa đơn điện tử gửi qua email trong vòng 24 giờ. Có thể yêu cầu lại qua mục "Đơn hàng" → "Xuất hóa đơn".',
      // },
    ],
  },
  {
    label: "🔄 Đổi & Trả",
    items: [
      {
        q: "Chính sách đổi trả của SmartFood như thế nào?",
        a: "Đổi trả trong vòng 24 giờ kể từ khi nhận hàng đối với thực phẩm hỏng, sai sản phẩm, hoặc không đúng mô tả. Hoàn tiền 100% nếu lỗi từ SmartFood.",
      },
      {
        q: "Thực phẩm tươi có được đổi trả không?",
        a: "Có! Nếu hàng tươi không đạt chất lượng (héo úa, hỏng), chụp ảnh gửi qua Zalo OA hoặc email trong vòng 24h, chúng tôi đổi hàng hoặc hoàn tiền.",
      },
      {
        q: "Quy trình đổi trả như thế nào?",
        a: "Liên hệ hotline → Mô tả vấn đề + gửi ảnh → Được xác nhận → Shipper đến lấy hàng (miễn phí) → Đổi hàng mới hoặc hoàn tiền trong 1–3 ngày.",
      },
      {
        q: "Hoàn tiền mất bao lâu?",
        a: "Ví điện tử: 5–10 phút. Thẻ ngân hàng: 3–7 ngày làm việc tùy ngân hàng. COD: chuyển khoản trong 24 giờ.",
      },
      {
        q: "Sản phẩm nào không được đổi trả?",
        a: "Sản phẩm đã qua sử dụng, thực phẩm đã mở bao bì không do lỗi của SmartFood, sản phẩm khuyến mãi đặc biệt (có ghi rõ điều kiện).",
      },
    ],
  },
];

// ===== STATS =====
const stats = reactive<Stat[]>([
  {
    icon: "👥",
    label: "Khách hàng",
    target: 500000,
    display: "0",
    suffix: "+",
  },
  { icon: "😊", label: "Hài lòng", target: 98, display: "0", suffix: "%" },
  {
    icon: "⚡",
    label: "Thời gian phản hồi",
    target: 2,
    display: "0",
    suffix: " phút",
  },
  {
    icon: "🕐",
    label: "Hỗ trợ liên tục",
    target: 24,
    display: "0",
    suffix: "/7",
  },
]);

const countUp = (stat: Stat) => {
  const dur = 1800;
  const step = 16;
  const inc = stat.target / (dur / step);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + inc, stat.target);
    stat.display =
      stat.target >= 1000
        ? current >= stat.target
          ? stat.target.toLocaleString("vi-VN")
          : Math.floor(current).toLocaleString("vi-VN")
        : Math.floor(current).toString();
    if (current >= stat.target) clearInterval(timer);
  }, step);
};

// ===== LIFECYCLE =====
onMounted(() => {
  // Scroll reveal for all .reveal elements
  document.querySelectorAll(".reveal").forEach((el) => observeEl(el));

  // IntersectionObserver for stats countUp
  const obs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !statsStarted.value) {
        statsStarted.value = true;
        stats.forEach((s) => countUp(s));
      }
    },
    { threshold: 0.3 },
  );
  if (statsRef.value) obs.observe(statsRef.value);
});
</script>

<style scoped>
/* ── Reveal animation ───────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.55s ease,
    transform 0.55s ease;
}
.reveal.visible {
  opacity: 1;
  transform: none;
}

/* ── SECTION 1 — HERO ───────────────────────────────── */
.hero-banner {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  display: flex;
  align-items: center;
  overflow: hidden;
}
.hero-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.hero-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.hero-title {
  font-size: 2rem;
  font-weight: 900;
  color: white;
  margin: 0 0 0.25rem;
}
.hero-sub {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}
.hero-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}
.badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem 0.875rem;
  border-radius: 9999px;
  white-space: nowrap;
}

/* ── SECTION 2 — CONTACT CARDS ──────────────────────── */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-top: 1.5rem;
}
.contact-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.75rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  transition:
    transform 0.3s,
    box-shadow 0.3s,
    border-color 0.3s;
  cursor: default;
}
.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(249, 115, 22, 0.15);
  border-color: #f97316;
}
:deep(.card-svg svg) {
  width: 2rem;
  height: 2rem;
}

/* ── SECTION 3 — FAQ ────────────────────────────────── */
.faq-tabs {
  margin-top: 1rem;
}

:deep(.p-tabview-nav) {
  border-bottom: 2px solid #e5e7eb;
}
:deep(.p-tabview-nav li .p-tabview-nav-link) {
  font-weight: 600;
  color: #6b7280;
  border: none !important;
  padding: 0.75rem 1.25rem;
}
:deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  color: #f97316 !important;
  border-bottom: 2px solid #f97316 !important;
}
:deep(.p-tabview-panels) {
  padding: 1.5rem 0;
}
:deep(.p-accordion .p-accordion-header .p-accordion-header-link) {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}
:deep(
  .p-accordion
    .p-accordion-header:not(.p-disabled).p-highlight
    .p-accordion-header-link
) {
  background: #fff7ed;
  border-color: #fdba74;
  color: #ea580c;
}

/* ── SECTION 4 — FORM ───────────────────────────────── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0.875rem;
  display: flex;
  align-items: center;
  color: #9ca3af;
  font-size: 0.875rem;
  z-index: 10;
  pointer-events: none;
}
:deep(.p-inputtext) {
  padding-left: 2.5rem !important;
  width: 100%;
  border-radius: 10px !important;
}
:deep(.p-textarea) {
  border-radius: 10px !important;
  width: 100%;
}
:deep(.p-select) {
  border-radius: 10px !important;
}

/* Upload */
.upload-box {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
}
.upload-box:hover {
  border-color: #f97316;
  background: #fff7ed;
}

/* Buttons common */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  font-weight: 700;
  font-size: 0.9375rem;
  border: none;
  border-radius: 12px;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.35);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.btn-primary:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.5);
}
.btn-primary:active:not(:disabled) {
  transform: scale(0.98);
}
.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.btn-submit {
  width: 100%;
  margin-top: 0.25rem;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: white;
  color: #f97316;
  font-weight: 700;
  font-size: 0.85rem;
  border: 2px solid #f97316;
  border-radius: 10px;
  padding: 0.625rem 1rem;
  cursor: pointer;
  width: 100%;
  transition:
    background 0.2s,
    color 0.2s,
    transform 0.15s;
}
.btn-outline:hover {
  background: #f97316;
  color: white;
  transform: translateY(-1px);
}

.btn-zalo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #0068ff;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  border: none;
  border-radius: 10px;
  padding: 0.625rem 1rem;
  cursor: pointer;
  width: 100%;
  gap: 0.5rem;
  transition:
    background 0.2s,
    transform 0.15s;
}
.btn-zalo:hover {
  background: #0052cc;
  transform: translateY(-1px);
}

/* Success state */
.form-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 2rem;
  text-align: center;
}
.succ-circle {
  animation: drawC 0.6s ease-out 0.1s forwards;
}
.succ-check {
  animation: drawK 0.45s ease-out 0.65s forwards;
}
@keyframes drawC {
  from {
    stroke-dashoffset: 239;
  }
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes drawK {
  from {
    stroke-dashoffset: 55;
  }
  to {
    stroke-dashoffset: 0;
  }
}
.succ-fade-enter-active,
.succ-fade-leave-active {
  transition: opacity 0.3s;
}
.succ-fade-enter-from,
.succ-fade-leave-to {
  opacity: 0;
}

/* Map placeholder */
.map-placeholder {
  background: #e5e7eb;
  border-radius: 12px;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
  cursor: pointer;
  transition: background 0.2s;
}
.map-placeholder:hover {
  background: #d1d5db;
}
.map-placeholder small {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* ── SECTION 5 — STATS ──────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  text-align: center;
}

/* Spinner */
.spinner {
  width: 1rem;
  height: 1rem;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── RESPONSIVE ─────────────────────────────────────── */
@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .hero-banner {
    height: auto;
    padding: 2rem 1rem;
  }
  .hero-inner {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
  .hero-left {
    flex-direction: column;
    align-items: center;
  }
  .hero-badges {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .hero-title {
    font-size: 1.5rem;
  }
  .contact-grid {
    grid-template-columns: 1fr;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .field-row {
    grid-template-columns: 1fr;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
