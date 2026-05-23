<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ROUTES } from "~/constants/routes";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import ToggleSwitch from "primevue/toggleswitch";
import ImageUploader from "~/components/admin/ImageUploader.vue";
import RichTextEditor from "~/components/admin/RichTextEditor.vue";
import { useToast } from "primevue/usetoast";
import { useAdminProductDetailQuery } from "~/queries/product/useAdminProductDetailQuery";
import { useAdminCategoriesQuery } from "~/queries/product/useAdminCategoriesQuery";
import { useUpdateAdminProduct } from "~/mutations/product/useUpdateProduct";
import { buildUpdateProductPayload } from "~/services/admin/product.service";
import { slugify } from "~/utils/formatters";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Chỉnh sửa sản phẩm - Quản trị SmartFood",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const productId = ref(route.params.id as string);

// ─── TanStack Query ───────────────────────────────────────────────────────────
const {
  data: product,
  isLoading,
  isError,
} = useAdminProductDetailQuery(productId);
const { data: categoriesData, isLoading: isCategoriesLoading } =
  useAdminCategoriesQuery();
const { mutate: updateProduct, isPending: isSubmitting } =
  useUpdateAdminProduct();

// ─── Form state ───────────────────────────────────────────────────────────────
const slugEdited = ref(false);
const tagInput = ref("");
const formInitialized = ref(false);

const form = reactive({
  title: "",
  slug: "",
  description: "",
  thumbnail: "" as string | File,
  images: [] as (string | File)[],
  stock: 0,
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

// ─── Options ─────────────────────────────────────────────────────────────────
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

// ─── Computed ─────────────────────────────────────────────────────────────────
const categoryOptions = computed(() =>
  (categoriesData.value ?? []).map((c) => ({ label: c.title, value: c._id })),
);

const averageRating = computed(() => {
  const r = product.value?.ratings;
  if (!r || r.numberOfRatings === 0) return "0.0";
  return (r.totalRating / r.numberOfRatings).toFixed(1);
});

// ─── Populate form khi data load xong ────────────────────────────────────────
watchEffect(() => {
  if (product.value && !formInitialized.value) {
    const p = product.value;
    Object.assign(form, {
      title: p.title ?? "",
      slug: p.slug ?? "",
      description: p.description ?? "",
      thumbnail: p.thumbnail ?? "",
      images: p.images ?? [],
      stock: p.stock ?? 0,
      unit: p.unit ?? "kg",
      price: p.price ?? 0,
      discountPercentage: p.discountPercentage ?? 0,
      originalPrice: p.originalPrice ?? 0,
      status: p.status ?? "active",
      featured: p.featured ?? false,
      isBestPrice: p.isBestPrice ?? false,
      isOnlineExclusive: p.isOnlineExclusive ?? false,
      tags: p.tags ?? [],
      position: p.position ?? null,
      primary_category_id:
        p.primary_category_id?.toString() ??
        p.primary_category?._id?.toString() ??
        "",
      // Lấy category_ids từ mảng categories trả về bởi aggregate
      category_ids: Array.isArray(p.categories)
        ? p.categories.map(
            (c: any) => c?._id?.toString() ?? c?.id?.toString() ?? c,
          )
        : [],
    });
    tagInput.value = (p.tags ?? []).join(", ");
    formInitialized.value = true;
  }
});

// ─── Watchers ─────────────────────────────────────────────────────────────────
// Auto-slug từ title nếu user chưa chỉnh slug
watch(
  () => form.title,
  (value) => {
    if (slugEdited.value || !formInitialized.value) return;
    // Với edit page, chỉ auto-update nếu title thay đổi nhiều so với slug cũ
    form.slug = slugify(value);
  },
);

// Auto-calculate originalPrice khi discount thay đổi
watch(
  () => [form.price, form.discountPercentage],
  () => {
    if (!formInitialized.value) return;
    if (form.discountPercentage > 0) {
      form.originalPrice = Math.round(
        form.price / (1 - form.discountPercentage / 100),
      );
    } else {
      form.originalPrice = form.price;
    }
  },
);

// Parse tags từ tagInput
watch(tagInput, (value) => {
  if (!formInitialized.value) return;
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

// ─── Validation ───────────────────────────────────────────────────────────────
const validateForm = () => {
  const errs: Record<string, string> = {};
  if (!form.title.trim()) errs.title = "Vui lòng nhập tên sản phẩm.";
  if (!form.slug.trim()) errs.slug = "Vui lòng nhập slug sản phẩm.";
  if (!form.primary_category_id)
    errs.primary_category_id = "Vui lòng chọn danh mục chính.";
  if (form.price <= 0) errs.price = "Giá phải lớn hơn 0 VND.";
  if (form.originalPrice > 0 && form.originalPrice < form.price)
    errs.originalPrice = "Giá gốc không được thấp hơn giá bán.";
  if (form.stock < 0) errs.stock = "Tồn kho không được âm.";
  if (!form.thumbnail) errs.thumbnail = "Vui lòng tải ảnh đại diện sản phẩm.";
  errors.value = errs;
  return Object.keys(errs).length === 0;
};

// ─── Submit ───────────────────────────────────────────────────────────────────
const submitForm = () => {
  if (isError.value || !product.value) return;
  if (!validateForm()) {
    toast.add({
      severity: "error",
      summary: "Lỗi kiểm tra dữ liệu",
      detail: "Vui lòng kiểm tra lại các trường và nhập đúng thông tin.",
      life: 4000,
    });
    return;
  }

  const payload = buildUpdateProductPayload({ ...form });
  console.log("🚀 ~ submitForm ~ payload:", payload);

  updateProduct(
    { id: productId.value, payload },
    {
      onSuccess: (result) => {
        toast.add({
          severity: "success",
          summary: "Đã cập nhật sản phẩm",
          detail: `Đã cập nhật ${result.title}.`,
          life: 3000,
        });
      },
      onError: (error: any) => {
        toast.add({
          severity: "error",
          summary: "Lỗi cập nhật sản phẩm",
          detail:
            error?.response?.data?.message ??
            "Đã xảy ra lỗi khi cập nhật sản phẩm.",
          life: 4000,
        });
      },
    },
  );
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <!-- Not found -->
    <div
      v-if="isError"
      class="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20"
    >
      <h2 class="text-lg font-semibold text-red-800 dark:text-red-300">
        Không tìm thấy sản phẩm
      </h2>
      <p class="text-sm text-red-600 dark:text-red-400 mt-2">
        Sản phẩm bạn đang chỉnh sửa không tồn tại hoặc đã bị xóa.
      </p>
      <button
        class="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        @click="router.push(ROUTES.ADMIN.PRODUCTS)"
      >
        Quay lại sản phẩm
      </button>
    </div>

    <template v-else>
      <!-- Header skeleton -->
      <section
        v-if="isLoading"
        class="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm animate-pulse dark:border-slate-700/70 dark:bg-slate-900/80"
      >
        <div class="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div class="h-4 w-72 bg-slate-100 dark:bg-slate-800 rounded"></div>
      </section>

      <!-- Header loaded -->
      <section
        v-else
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
              Chỉnh sửa sản phẩm
            </h1>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Điều chỉnh thông tin, đơn vị tính hoặc tồn kho của
              <strong>{{ form.title }}</strong
              >.
            </p>
            <!-- Meta info -->
            <div class="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
              <span class="flex items-center gap-1">
                <i class="pi pi-star-fill text-amber-400"></i>
                {{ averageRating }} ({{
                  product?.ratings?.numberOfRatings ?? 0
                }}
                đánh giá)
              </span>
              <span class="flex items-center gap-1">
                <i class="pi pi-shopping-bag"></i>
                {{ product?.soldCount ?? 0 }} đã bán
              </span>
              <span class="flex items-center gap-1">
                <i class="pi pi-sort-numeric-up-alt"></i>
                Vị trí: {{ product?.position ?? "—" }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
              @click="router.back()"
              :disabled="isSubmitting"
            >
              Hủy
            </button>
            <button
              class="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-50"
              @click="submitForm"
              :disabled="isSubmitting || isLoading"
            >
              <i v-if="isSubmitting" class="pi pi-spin pi-spinner mr-2"></i>
              {{ isSubmitting ? "Đang lưu..." : "Lưu thay đổi" }}
            </button>
          </div>
        </div>
      </section>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Left column -->
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
                  :disabled="isLoading"
                />
                <p v-if="errors.title" class="mt-1 text-xs text-red-500">
                  {{ errors.title }}
                </p>
              </div>

              <!-- Slug -->
              <div class="md:col-span-2">
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Slug *
                  <span class="text-xs text-slate-400 font-normal ml-1"
                    >(có thể chỉnh sửa)</span
                  >
                </label>
                <div class="relative mt-2">
                  <InputText
                    v-model="form.slug"
                    class="w-full font-mono text-sm"
                    :disabled="isLoading"
                    @input="markSlugEdited"
                  />
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
                  :loading="isCategoriesLoading || isLoading"
                  filter
                />
                <p
                  v-if="errors.primary_category_id"
                  class="mt-1 text-xs text-red-500"
                >
                  {{ errors.primary_category_id }}
                </p>
              </div>

              <!-- Danh mục phụ -->
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
                  :loading="isCategoriesLoading || isLoading"
                  filter
                  display="chip"
                />
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
                  :disabled="isLoading"
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
                  :disabled="isLoading"
                />
              </div>

              <!-- Thứ tự hiển thị -->
              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Thứ tự hiển thị (Position)
                </label>
                <InputNumber
                  v-model="form.position"
                  :min="0"
                  class="mt-2 w-full"
                  :disabled="isLoading"
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
                  :disabled="isLoading"
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
                  suffix="%"
                  :disabled="isLoading"
                />
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Giá gốc
                  <span class="text-xs text-slate-400 font-normal ml-1"
                    >(tự tính)</span
                  >
                </label>
                <InputNumber
                  v-model="form.originalPrice"
                  mode="currency"
                  currency="VND"
                  locale="vi-VN"
                  class="mt-2 w-full"
                  :disabled="isLoading"
                />
                <p
                  v-if="errors.originalPrice"
                  class="mt-1 text-xs text-red-500"
                >
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
              <RichTextEditor v-model="form.description" />
            </div>
          </section>
        </div>

        <!-- Right column -->
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
                <InputNumber
                  v-model="form.stock"
                  :min="0"
                  class="mt-2 w-full"
                  :disabled="isLoading"
                />
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
                <ToggleSwitch
                  v-model="(form as any)[item.key]"
                  :disabled="isLoading"
                />
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
              :disabled="isLoading"
            />
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
