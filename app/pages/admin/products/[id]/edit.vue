<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ROUTES } from "~/constants/routes";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import ToggleSwitch from "primevue/toggleswitch";
import ImageUploader from "~/components/admin/ImageUploader.vue";
import RichTextEditor from "~/components/admin/RichTextEditor.vue";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const route = useRoute();
const router = useRouter();
const store = useAdminMockStore();
const toast = useToast();

const productId = route.params.id as string;
const isSubmitting = ref(false);
const tagInput = ref("");

const form = reactive({
  title: "",
  slug: "",
  description: "",
  thumbnail: "",
  images: [] as string[],
  stock: 0,
  unit: "hộp" as any,
  price: 0,
  discountPercentage: 0,
  originalPrice: 0,
  status: "active" as "active" | "inactive",
  featured: false,
  isBestPrice: false,
  isOnlineExclusive: false,
  tags: [] as string[],
  primary_category_id: "",
});

const errors = ref<Record<string, string>>({});
const isNotFound = ref(false);

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

const categoryOptions = computed(() => {
  return store.categories
    .filter((c) => c.type === "product" && c.status === "active")
    .map((c) => ({ label: c.title, value: c.id }));
});

const product = store.products.find((p) => p.id === productId);
if (product) {
  Object.assign(form, {
    title: product.title,
    slug: product.slug,
    description: product.description,
    thumbnail: product.thumbnail,
    images: product.images || [],
    stock: product.stock,
    unit: product.unit,
    price: product.price,
    discountPercentage: product.discountPercentage,
    originalPrice: product.originalPrice,
    status: product.status,
    featured: product.featured,
    isBestPrice: product.isBestPrice,
    isOnlineExclusive: product.isOnlineExclusive,
    tags: product.tags || [],
    primary_category_id: product.primary_category_id,
  });
  tagInput.value = (product.tags || []).join(", ");
} else {
  isNotFound.value = true;
}

watch(
  () => [form.price, form.discountPercentage],
  () => {
    if (form.discountPercentage > 0) {
      form.originalPrice = Math.round(
        form.price / (1 - form.discountPercentage / 100),
      );
    } else {
      form.originalPrice = form.price;
    }
  },
);

watch(tagInput, (value) => {
  form.tags = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
});

const validateForm = () => {
  const errs: Record<string, string> = {};
  if (!form.title.trim()) errs.title = "Vui lòng nhập tên sản phẩm.";
  if (!form.slug.trim()) errs.slug = "Vui lòng nhập slug sản phẩm.";
  if (!form.primary_category_id)
    errs.primary_category_id = "Vui lòng chọn danh mục.";
  if (form.price <= 0) errs.price = "Giá phải lớn hơn 0 VND.";
  if (form.originalPrice < form.price)
    errs.originalPrice = "Giá gốc không được thấp hơn giá bán.";
  if (form.stock < 0) errs.stock = "Tồn kho không được âm.";
  if (!form.thumbnail) errs.thumbnail = "Vui lòng tải ảnh đại diện sản phẩm.";

  errors.value = errs;
  return Object.keys(errs).length === 0;
};

const submitForm = async () => {
  if (isNotFound.value) return;
  if (!validateForm()) {
    toast.add({
      severity: "error",
      summary: "Lỗi kiểm tra dữ liệu",
      detail: "Vui lòng kiểm tra lại các trường và nhập đúng thông tin.",
      life: 4000,
    });
    return;
  }

  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800));

  try {
    store.updateProduct(productId, {
      title: form.title,
      slug: form.slug,
      description: form.description,
      thumbnail: form.thumbnail,
      images: form.images,
      stock: form.stock,
      unit: form.unit,
      price: form.price,
      discountPercentage: form.discountPercentage,
      originalPrice: form.originalPrice,
      status: form.status,
      featured: form.featured,
      isBestPrice: form.isBestPrice,
      isOnlineExclusive: form.isOnlineExclusive,
      tags: form.tags,
      primary_category_id: form.primary_category_id,
    });

    toast.add({
      severity: "success",
      summary: "Đã cập nhật sản phẩm",
      detail: `Đã cập nhật ${form.title}.`,
      life: 3000,
    });

    router.push(ROUTES.ADMIN.PRODUCTS);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Đã xảy ra lỗi khi cập nhật sản phẩm.",
      life: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <div
      v-if="isNotFound"
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
      <section
        class="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
            >
              Danh mục
            </p>
            <h1
              class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
            >
              Chỉnh sửa sản phẩm
            </h1>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Điều chỉnh thông tin, đơn vị tính hoặc tồn kho của
              {{ form.title }}.
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
              Lưu thay đổi
            </button>
          </div>
        </div>
      </section>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Thông tin cơ bản
            </h2>
            <div class="grid gap-4 mt-4 md:grid-cols-2">
              <div class="md:col-span-2">
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Tên sản phẩm *</label
                >
                <InputText v-model="form.title" class="mt-2 w-full" />
                <p v-if="errors.title" class="mt-1 text-xs text-red-500">
                  {{ errors.title }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Slug *</label
                >
                <InputText v-model="form.slug" class="mt-2 w-full" />
                <p v-if="errors.slug" class="mt-1 text-xs text-red-500">
                  {{ errors.slug }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Danh mục *</label
                >
                <Dropdown
                  v-model="form.primary_category_id"
                  :options="categoryOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Chọn danh mục"
                  class="mt-2 w-full"
                />
                <p
                  v-if="errors.primary_category_id"
                  class="mt-1 text-xs text-red-500"
                >
                  {{ errors.primary_category_id }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Đơn vị bán *</label
                >
                <Dropdown
                  v-model="form.unit"
                  :options="unitOptions"
                  option-label="label"
                  option-value="value"
                  class="mt-2 w-full"
                />
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Thẻ (cách nhau bằng dấu phẩy)</label
                >
                <InputText v-model="tagInput" class="mt-2 w-full" />
              </div>
            </div>
          </section>

          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
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
                  suffix="%"
                />
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Giá gốc</label
                >
                <InputNumber
                  v-model="form.originalPrice"
                  mode="currency"
                  currency="VND"
                  locale="vi-VN"
                  class="mt-2 w-full"
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

          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Mô tả sản phẩm
            </h2>
            <div class="mt-4">
              <RichTextEditor v-model="form.description" />
            </div>
          </section>
        </div>

        <div class="space-y-6">
          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Hình ảnh & Album *
            </h2>
            <div class="mt-4 space-y-4">
              <div>
                <span
                  class="text-xs font-semibold text-slate-400 block mb-2 uppercase"
                  >Ảnh đại diện sản phẩm *</span
                >
                <ImageUploader v-model="form.thumbnail" :multiple="false" />
                <p v-if="errors.thumbnail" class="mt-1 text-xs text-red-500">
                  {{ errors.thumbnail }}
                </p>
              </div>

              <div>
                <span
                  class="text-xs font-semibold text-slate-400 block mb-2 uppercase"
                  >Các hình ảnh bổ sung</span
                >
                <ImageUploader v-model="form.images" :multiple="true" />
              </div>
            </div>
          </section>

          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
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
                />
                <p v-if="errors.stock" class="mt-1 text-xs text-red-500">
                  {{ errors.stock }}
                </p>
              </div>

              <div
                class="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800"
              >
                <div>
                  <p
                    class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Nổi bật
                  </p>
                  <p class="text-xs text-slate-400">
                    Hiển thị sản phẩm này trên banner trang chủ.
                  </p>
                </div>
                <ToggleSwitch v-model="form.featured" />
              </div>

              <div
                class="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800"
              >
                <div>
                  <p
                    class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Giá tốt nhất
                  </p>
                  <p class="text-xs text-slate-400">
                    Đánh dấu nhãn là ưu đãi tốt nhất.
                  </p>
                </div>
                <ToggleSwitch v-model="form.isBestPrice" />
              </div>

              <div
                class="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800"
              >
                <div>
                  <p
                    class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Chỉ bán Online
                  </p>
                  <p class="text-xs text-slate-400">
                    Chỉ áp dụng cho giao hàng trực tuyến.
                  </p>
                </div>
                <ToggleSwitch v-model="form.isOnlineExclusive" />
              </div>
            </div>
          </section>

          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Trạng thái
            </h2>
            <Dropdown
              v-model="form.status"
              class="mt-3 w-full"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              placeholder="Chọn trạng thái"
            />
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
