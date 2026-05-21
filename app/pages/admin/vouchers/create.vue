<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ROUTES } from "~/constants/routes";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import ToggleSwitch from "primevue/toggleswitch";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const router = useRouter();
const store = useAdminMockStore();
const toast = useToast();

const isSubmitting = ref(false);
const applyIdsInput = ref("");
const errors = ref<Record<string, string>>({});

const statusOptions = [
  { label: "Hoạt động", value: "active" },
  { label: "Ngừng hoạt động", value: "inactive" },
  { label: "Hết hạn", value: "expired" },
];

const form = reactive({
  code: "",
  name: "",
  description: "",
  type: "percent" as "money" | "percent" | "freeship" | "product",
  discountValue: 10,
  maxDiscountAmount: 0,
  minOrderValue: 0,
  applyFor: "all" as "all" | "category" | "product",
  applyForIds: [] as string[],
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  status: "active" as "active" | "inactive" | "expired",
  quantity: 100,
  usageLimitPerUser: 1,
  isFeatured: false,
});

watch(applyIdsInput, (value) => {
  form.applyForIds = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
});

watch(
  () => form.code,
  (val) => {
    form.code = val.toUpperCase().replace(/[^A-Z0-9]/g, "");
  },
);

const generateCode = () => {
  form.code = `SF${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
};

const validateForm = () => {
  const errs: Record<string, string> = {};
  if (!form.code.trim()) errs.code = "Vui lòng nhập mã coupon.";
  if (form.code.trim().length < 4) errs.code = "Mã phải có ít nhất 4 ký tự.";
  if (!form.name.trim()) errs.name = "Vui lòng nhập tên chiến dịch.";
  if (form.discountValue <= 0)
    errs.discountValue = "Giá trị giảm phải lớn hơn 0.";
  if (form.quantity <= 0) errs.quantity = "Tổng số lượng phải ít nhất là 1.";
  if (!form.startDate) errs.startDate = "Vui lòng chọn ngày bắt đầu.";
  if (!form.endDate) errs.endDate = "Vui lòng chọn ngày kết thúc.";
  if (new Date(form.startDate) > new Date(form.endDate)) {
    errs.endDate = "Ngày kết thúc phải sau ngày bắt đầu.";
  }

  errors.value = errs;
  return Object.keys(errs).length === 0;
};

const submitForm = async () => {
  if (!validateForm()) {
    toast.add({
      severity: "error",
      summary: "Lỗi kiểm tra dữ liệu",
      detail: "Vui lòng sửa các lỗi trước khi lưu.",
      life: 3000,
    });
    return;
  }

  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));

  try {
    store.createVoucher({
      code: form.code,
      name: form.name,
      description: form.description,
      type: form.type,
      discountValue: form.discountValue,
      maxDiscountAmount: form.maxDiscountAmount,
      minOrderValue: form.minOrderValue,
      applyFor: form.applyFor,
      applyForIds: form.applyForIds,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
      quantity: form.quantity,
      usedCount: 0,
      usageLimitPerUser: form.usageLimitPerUser,
      isFeatured: form.isFeatured,
    });

    toast.add({
      severity: "success",
      summary: "Đã tạo mã giảm giá",
      detail: `Đã tạo mã giảm giá ${form.code}.`,
      life: 3000,
    });

    router.push(ROUTES.ADMIN.VOUCHERS);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Đã xảy ra lỗi khi tạo mã giảm giá.",
      life: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <section
      class="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80"
    >
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
          >
            Tiếp thị & bán hàng
          </p>
          <h1
            class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
          >
            Tạo mã giảm giá
          </h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Thiết lập chiến dịch giảm giá hoặc miễn phí vận chuyển.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
            @click="router.back()"
            :disabled="isSubmitting"
          >
            Hủy
          </button>
          <button
            class="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-50"
            @click="submitForm"
            :disabled="isSubmitting"
          >
            <i v-if="isSubmitting" class="pi pi-spin pi-spinner mr-2"></i>
            Lưu mã giảm giá
          </button>
        </div>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Định nghĩa mã giảm giá
          </h2>
          <div class="grid gap-4 mt-4 md:grid-cols-2">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Mã khuyến mãi *</label
              >
              <div class="mt-2 flex gap-2">
                <InputText
                  v-model="form.code"
                  class="flex-1 font-mono uppercase"
                  placeholder="e.g. SMARTFOOD50"
                />
                <button
                  type="button"
                  class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                  @click="generateCode"
                >
                  Tự tạo
                </button>
              </div>
              <p v-if="errors.code" class="mt-1 text-xs text-red-500">
                {{ errors.code }}
              </p>
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Tên chiến dịch / mã giảm giá *</label
              >
              <InputText
                v-model="form.name"
                class="mt-2 w-full"
                placeholder="e.g. Giảm 50k Đơn Đầu Tiên"
              />
              <p v-if="errors.name" class="mt-1 text-xs text-red-500">
                {{ errors.name }}
              </p>
            </div>

            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Điều khoản & mô tả</label
              >
              <Textarea
                v-model="form.description"
                rows="3"
                class="mt-2 w-full"
                placeholder="Nêu hướng dẫn, điều kiện áp dụng..."
              />
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Thiết lập giảm giá
          </h2>
          <div class="grid gap-4 mt-4 md:grid-cols-2">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Loại giảm giá *</label
              >
              <Dropdown
                v-model="form.type"
                class="mt-2 w-full"
                :options="[
                  { label: 'Phần trăm (%)', value: 'percent' },
                  { label: 'Số tiền cố định (VND)', value: 'money' },
                  { label: 'Miễn phí vận chuyển', value: 'freeship' },
                  { label: 'Giảm cho sản phẩm cụ thể', value: 'product' },
                ]"
                option-label="label"
                option-value="value"
              />
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Giá trị giảm *</label
              >
              <InputNumber
                v-model="form.discountValue"
                class="mt-2 w-full"
                :min="1"
              />
              <p v-if="errors.discountValue" class="mt-1 text-xs text-red-500">
                {{ errors.discountValue }}
              </p>
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Giới hạn giảm tối đa (VND)</label
              >
              <InputNumber
                v-model="form.maxDiscountAmount"
                class="mt-2 w-full"
                placeholder="0 (Không giới hạn)"
              />
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Giá trị đơn hàng tối thiểu (VND)</label
              >
              <InputNumber
                v-model="form.minOrderValue"
                class="mt-2 w-full"
                placeholder="0 (Không yêu cầu)"
              />
            </div>
          </div>
        </section>
      </div>

      <div class="space-y-6">
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Thời hạn & giới hạn
          </h2>
          <div class="grid gap-4 mt-4">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Ngày bắt đầu *</label
              >
              <input
                type="date"
                v-model="form.startDate"
                class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
              <p v-if="errors.startDate" class="mt-1 text-xs text-red-500">
                {{ errors.startDate }}
              </p>
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Ngày kết thúc *</label
              >
              <input
                type="date"
                v-model="form.endDate"
                class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
              <p v-if="errors.endDate" class="mt-1 text-xs text-red-500">
                {{ errors.endDate }}
              </p>
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Tổng số lượng phát hành *</label
              >
              <InputNumber
                v-model="form.quantity"
                class="mt-2 w-full"
                :min="1"
              />
              <p v-if="errors.quantity" class="mt-1 text-xs text-red-500">
                {{ errors.quantity }}
              </p>
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Giới hạn sử dụng mỗi khách hàng</label
              >
              <InputNumber
                v-model="form.usageLimitPerUser"
                class="mt-2 w-full"
                :min="1"
              />
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Đối tượng áp dụng
          </h2>
          <div class="grid gap-4 mt-4">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Phân loại đối tượng</label
              >
              <Dropdown
                v-model="form.applyFor"
                class="mt-2 w-full"
                :options="[
                  { label: 'Tất cả sản phẩm', value: 'all' },
                  { label: 'Chỉ danh mục cụ thể', value: 'category' },
                  { label: 'Chỉ sản phẩm được chọn', value: 'product' },
                ]"
                optionLabel="label"
                optionValue="value"
              />
            </div>

            <div v-if="form.applyFor !== 'all'">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Mã đối tượng áp dụng (cách nhau bằng dấu phẩy)</label
              >
              <InputText
                v-model="applyIdsInput"
                class="mt-2 w-full"
                placeholder="Ví dụ: prod-1, cat-2"
              />
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Trạng thái</label
              >
              <Dropdown
                v-model="form.status"
                class="mt-2 w-full"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
              />
            </div>

            <div
              class="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800"
            >
              <div>
                <p
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Khuyến mãi nổi bật
                </p>
                <p class="text-xs text-slate-400">
                  Hiển thị mã giảm giá này tại mục khuyến mãi khi thanh toán.
                </p>
              </div>
              <ToggleSwitch v-model="form.isFeatured" />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
