<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ROUTES } from "~/constants/routes";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import ToggleSwitch from "primevue/toggleswitch";
import ImageUploader from "~/components/admin/ImageUploader.vue";
import RichTextEditor from "~/components/admin/RichTextEditor.vue";
import { useToast } from "primevue/usetoast";
import { useAdminCategoriesQuery } from "~/queries/product/useAdminCategoriesQuery";
import { useCreateAdminProduct } from "~/mutations/product/useCreateProduct";
import { buildCreateProductPayload } from "~/services/admin/product.service";
import { slugify } from "~/utils/formatters";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Tạo sản phẩm - Quản trị SmartFood",
});

const router = useRouter();
const toast = useToast();

// TanStack Query
const { data: categoriesData, isLoading: isCategoriesLoading } =
  useAdminCategoriesQuery();
const { mutate: createProduct, isPending: isSubmitting } =
  useCreateAdminProduct();

// State
const slugEdited = ref(false);
const tagInput = ref("");

const form = reactive({
  title: "",
  slug: "",
  description: "",
  thumbnail: "" as string | File,
  images: [] as (string | File)[],
  stock: 10,
  unit: "hộp" as string,
  price: 0,
  discountPercentage: 0,
  originalPrice: 0,
  status: "active" as "active" | "inactive",
  featured: false,
  isBestPrice: false,
  isOnlineExclusive: false,
  tags: [] as string[],
  position: null as number | null,
  primary_category_id: "",
  category_ids: [] as string[],
});

const errors = ref<Record<string, string>>({});

// Options
const unitOptions = [
  { label: "Kilôgam (kg)", value: "kg" },
  { label: "Gam (g)", value: "g" },
  { label: "Hộp", value: "hộp" },
  { label: "Chai", value: "chai" },
  { label: "Gói", value: "gói" },
  { label: "Túi", value: "túi" },
  { label: "Cái", value: "cái" },
  { label: "Lốc", value: "lốc" },
  { label: "Combo", value: "combo" },
];

const statusOptions = [
  { label: "Hoạt động", value: "active" },
  { label: "Ngừng hoạt động", value: "inactive" },
];

// Computed
const categoryOptions = computed(() =>
  (categoriesData.value ?? []).map((c) => ({ label: c.title, value: c._id })),
);

// Watchers
// Auto-slug từ title nếu user chưa chỉnh slug
watch(
  () => form.title,
  (value) => {
    if (slugEdited.value) return;
    form.slug = slugify(value);
  },
);

// Auto-calculate originalPrice khi discount thay đổi
watch(
  () => [form.price, form.discountPercentage],
  () => {
    if (form.discountPercentage > 0) {
      const calculated = form.price / (1 - form.discountPercentage / 100);
      form.originalPrice = Math.round(calculated / 1000) * 1000;
    } else {
      form.originalPrice = form.price;
    }
  },
);

// Parse tags từ tagInput
watch(tagInput, (value) => {
  form.tags = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
});

const markSlugEdited = () => {
  slugEdited.value = true;
};

// Đảm bảo primary_category_id luôn có trong category_ids
watch(
  () => form.primary_category_id,
  (newPrimary) => {
    if (newPrimary && !form.category_ids.includes(newPrimary)) {
      form.category_ids = [newPrimary, ...form.category_ids];
    }
  },
);

// Validation
const validateForm = () => {
  const errs: Record<string, string> = {};
  if (!form.title.trim()) errs.title = "Vui lòng nhập tên sản phẩm.";
  if (!form.slug.trim()) errs.slug = "Vui lòng nhập slug sản phẩm.";
  if (!form.primary_category_id)
    errs.primary_category_id = "Vui lòng chọn danh mục chính.";
  if (!form.category_ids || form.category_ids.length === 0)
    errs.category_ids = "Vui lòng chọn ít nhất 1 danh mục phụ.";
  if (form.price <= 0) errs.price = "Giá phải lớn hơn 0 VND.";
  if (form.originalPrice > 0 && form.originalPrice < form.price)
    errs.originalPrice = "Giá gốc không được thấp hơn giá bán.";
  if (form.stock < 0) errs.stock = "Tồn kho không được âm.";
  if (!form.thumbnail) errs.thumbnail = "Vui lòng tải ảnh đại diện sản phẩm.";
  errors.value = errs;
  return Object.keys(errs).length === 0;
};

// Submit
const submitForm = () => {
  if (!validateForm()) {
    toast.add({
      severity: "error",
      summary: "Lỗi kiểm tra dữ liệu",
      detail: "Vui lòng kiểm tra lại các trường và nhập đúng thông tin.",
      life: 4000,
    });
    return;
  }

  const payload = buildCreateProductPayload({ ...form });

  createProduct(payload, {
    onSuccess: (result) => {
      toast.add({
        severity: "success",
        summary: "Đã tạo sản phẩm",
        detail: `Đã thêm ${result.title} vào danh sách sản phẩm.`,
        life: 3000,
      });
      router.push(ROUTES.ADMIN.PRODUCTS);
    },
    onError: (error: any) => {
      toast.add({
        severity: "error",
        summary: "Lỗi tạo sản phẩm",
        detail:
          error?.response?.data?.message ?? "Đã xảy ra lỗi khi lưu sản phẩm.",
        life: 4000,
      });
    },
  });
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <!-- Header -->
    <section
      class="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80"
    >
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
          >
            Quản trị
          </p>
          <h1
            class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
          >
            Tạo sản phẩm
          </h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Thêm một sản phẩm thực phẩm mới vào cửa hàng của bạn.
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
            {{ isSubmitting ? "Đang lưu..." : "Lưu sản phẩm" }}
          </button>
        </div>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Left column: main info -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Thông tin cơ bản -->
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Thông tin cơ bản
          </h2>
          <div class="grid gap-4 mt-4 md:grid-cols-2">
            <!-- Tên sản phẩm -->
            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Tên sản phẩm *</label
              >
              <InputText
                v-model="form.title"
                class="mt-2 w-full"
                placeholder="Ví dụ: Bát Salad Cá Ngừ Đại Dương"
              />
              <p v-if="errors.title" class="mt-1 text-xs text-red-500">
                {{ errors.title }}
              </p>
            </div>

            <!-- Slug (auto-generated) -->
            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Slug *
                <span class="text-xs text-slate-400 font-normal ml-1"
                  >(Tự động tạo từ tên, có thể chỉnh sửa)</span
                >
              </label>
              <div class="relative mt-2">
                <InputText
                  v-model="form.slug"
                  class="w-full font-mono text-sm"
                  placeholder="vd: bat-salad-ca-ngu"
                  @input="markSlugEdited"
                />
                <button
                  v-if="slugEdited"
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-primary-600"
                  @click="
                    () => {
                      slugEdited = false;
                      form.slug = slugify(form.title);
                    }
                  "
                >
                  Tự động
                </button>
              </div>
              <p v-if="errors.slug" class="mt-1 text-xs text-red-500">
                {{ errors.slug }}
              </p>
            </div>

            <!-- Danh mục chính -->
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Danh mục chính *</label
              >
              <Select
                v-model="form.primary_category_id"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Chọn danh mục chính"
                class="mt-2 w-full"
                :loading="isCategoriesLoading"
                filter
              />
              <p
                v-if="errors.primary_category_id"
                class="mt-1 text-xs text-red-500"
              >
                {{ errors.primary_category_id }}
              </p>
            </div>

            <!-- Danh mục phụ (MultiSelect) -->
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Danh mục phụ
                <span class="text-xs text-slate-400 font-normal ml-1"
                  >(chọn nhiều)</span
                >
              </label>
              <MultiSelect
                v-model="form.category_ids"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Chọn danh mục phụ"
                class="mt-2 w-full"
                :loading="isCategoriesLoading"
                filter
                display="chip"
              />
              <p v-if="errors.category_ids" class="mt-1 text-xs text-red-500">
                {{ errors.category_ids }}
              </p>
            </div>

            <!-- Đơn vị bán -->
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Đơn vị bán *</label
              >
              <Select
                v-model="form.unit"
                :options="unitOptions"
                optionLabel="label"
                optionValue="value"
                class="mt-2 w-full"
              />
            </div>

            <!-- Tags -->
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Thẻ
                <span class="text-xs text-slate-400 font-normal ml-1"
                  >(cách nhau bằng dấu phẩy)</span
                >
              </label>
              <InputText
                v-model="tagInput"
                class="mt-2 w-full"
                placeholder="fresh, diet, organic"
              />
            </div>

            <!-- Thứ tự hiển thị -->
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Thứ tự hiển thị (Position)
                <span class="text-xs text-slate-400 font-normal ml-1"
                  >(để trống = tự động)</span
                >
              </label>
              <InputNumber
                v-model="form.position"
                :min="0"
                class="mt-2 w-full"
                placeholder="Để trống để tự động"
              />
            </div>
          </div>
        </section>

        <!-- Giá bán -->
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Giá bán
          </h2>
          <div class="grid gap-4 mt-4 md:grid-cols-3">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Giá bán *</label
              >
              <InputNumber
                v-model="form.price"
                mode="currency"
                currency="VND"
                locale="vi-VN"
                class="mt-2 w-full"
              />
              <p v-if="errors.price" class="mt-1 text-xs text-red-500">
                {{ errors.price }}
              </p>
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Giảm giá (%)</label
              >
              <InputNumber
                v-model="form.discountPercentage"
                :min="0"
                :max="99"
                class="mt-2 w-full"
                placeholder="0"
                suffix="%"
              />
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Giá gốc
                <span class="text-xs text-slate-400 font-normal ml-1"
                  >(tự tính từ % giảm)</span
                >
              </label>
              <InputNumber
                v-model="form.originalPrice"
                mode="currency"
                currency="VND"
                locale="vi-VN"
                class="mt-2 w-full"
              />
              <p v-if="errors.originalPrice" class="mt-1 text-xs text-red-500">
                {{ errors.originalPrice }}
              </p>
            </div>
          </div>
        </section>

        <!-- Mô tả sản phẩm -->
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Mô tả sản phẩm
          </h2>
          <div class="mt-4">
            <RichTextEditor
              v-model="form.description"
              placeholder="Nhập công thức, hàm lượng dinh dưỡng/calo và mô tả chi tiết sản phẩm..."
            />
          </div>
        </section>
      </div>

      <!-- Right column: images + settings -->
      <div class="space-y-6">
        <!-- Hình ảnh -->
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Hình ảnh & Album *
          </h2>
          <div class="mt-4 space-y-4">
            <div>
              <span
                class="text-xs font-semibold text-slate-400 block mb-2 uppercase"
                >Ảnh đại diện *</span
              >
              <ImageUploader v-model="form.thumbnail" :multiple="false" />
              <p v-if="errors.thumbnail" class="mt-1 text-xs text-red-500">
                {{ errors.thumbnail }}
              </p>
            </div>
            <div>
              <span
                class="text-xs font-semibold text-slate-400 block mb-2 uppercase"
                >Hình ảnh bổ sung</span
              >
              <ImageUploader v-model="form.images" :multiple="true" />
            </div>
          </div>
        </section>

        <!-- Kho hàng & Nhãn -->
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Kho hàng & Nhãn hiển thị
          </h2>
          <div class="grid gap-4 mt-4">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Số lượng tồn kho *</label
              >
              <InputNumber v-model="form.stock" :min="0" class="mt-2 w-full" />
              <p v-if="errors.stock" class="mt-1 text-xs text-red-500">
                {{ errors.stock }}
              </p>
            </div>

            <div
              v-for="item in [
                {
                  key: 'featured',
                  label: 'Nổi bật',
                  desc: 'Hiển thị sản phẩm này trên banner trang chủ.',
                },
                {
                  key: 'isBestPrice',
                  label: 'Giá tốt nhất',
                  desc: 'Đánh dấu nhãn là ưu đãi tốt nhất.',
                },
                {
                  key: 'isOnlineExclusive',
                  label: 'Chỉ bán Online',
                  desc: 'Chỉ áp dụng cho giao hàng trực tuyến.',
                },
              ]"
              :key="item.key"
              class="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800"
            >
              <div>
                <p
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {{ item.label }}
                </p>
                <p class="text-xs text-slate-400">{{ item.desc }}</p>
              </div>
              <ToggleSwitch v-model="(form as any)[item.key]" />
            </div>
          </div>
        </section>

        <!-- Trạng thái -->
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Trạng thái
          </h2>
          <Dropdown
            v-model="form.status"
            class="mt-3 w-full"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Chọn trạng thái"
          />
        </section>
      </div>
    </div>
  </div>
</template>
