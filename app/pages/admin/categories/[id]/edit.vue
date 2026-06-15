<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import ToggleSwitch from "primevue/toggleswitch";
import ImageUploader from "~/components/admin/ImageUploader.vue";
import { ROUTES } from "~/constants/routes";
import { slugify } from "~/utils/formatters";
import { useAdminCategoriesQuery } from "~/queries/category/useAdminCategoriesQuery";
import { useAdminCategoryDetailQuery } from "~/queries/category/useAdminCategoryDetailQuery";
import { useUpdateAdminCategory } from "~/mutations/category/useUpdateAdminCategory";
import { buildUpdateCategoryPayload } from "~/services/admin/category.service";
import type { CategoryFormData } from "~/types/category.type";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Chỉnh sửa danh mục - Quản trị SmartFood",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const categoryId = ref(route.params.id as string);
const slugEdited = ref(false);
const formInitialized = ref(false);
const isSubmitting = ref(false);

const form = reactive<CategoryFormData>({
  title: "",
  slug: "",
  type: "product",
  description: "",
  thumbnail: "",
  bannerImage: "",
  badgeText: "",
  status: "active",
  featured: false,
  position: null,
  parent_id: null,
});

const errors = ref<Record<string, string>>({});

const typeOptions = [
  { label: "Danh mục sản phẩm", value: "product" },
  { label: "Bài viết / tin tức", value: "article" },
];

const statusOptions = [
  { label: "Hoạt động", value: "active" },
  { label: "Ngừng hoạt động", value: "inactive" },
];

const categoryQueryParams = computed(() => ({
  limit: 1000,
  typeFilter: form.type,
  statusFilter: "active",
  sortField: "position",
  sortOrder: "asc" as const,
}));

const {
  data: categoryDetail,
  isLoading,
  isError,
} = useAdminCategoryDetailQuery(categoryId);
const { data: categoriesData, isLoading: isCategoriesLoading } =
  useAdminCategoriesQuery(categoryQueryParams);
const { mutate: updateCategory } = useUpdateAdminCategory();

const parentOptions = computed(() => {
  const categories = categoriesData.value?.data ?? [];
  const list = categories
    .filter(
      (category) =>
        category.status === "active" &&
        category.parent_id === null &&
        category._id !== categoryId.value &&
        category.type === form.type,
    )
    .map((category) => ({ label: category.title, value: category._id }));

  return [{ label: "Không có danh mục cha (gốc)", value: null }, ...list];
});

watch(
  () => categoryDetail.value,
  (value) => {
    if (!value || formInitialized.value) return;

    Object.assign(form, {
      title: value.title ?? "",
      slug: value.slug ?? "",
      type: value.type ?? "product",
      description: value.description ?? "",
      thumbnail: value.thumbnail ?? "",
      bannerImage: value.bannerImage ?? "",
      badgeText: value.badgeText ?? "",
      status: value.status ?? "active",
      featured: value.featured ?? false,
      position: value.position ?? null,
      parent_id: value.parent_id ? String(value.parent_id) : null,
    });

    formInitialized.value = true;
  },
  { immediate: true },
);

watch(
  () => form.title,
  (value) => {
    if (slugEdited.value) return;
    form.slug = slugify(value);
  },
);

watch(
  () => form.type,
  () => {
    form.parent_id = null;
  },
);

const markSlugEdited = () => {
  slugEdited.value = true;
};

const validateForm = () => {
  const nextErrors: Record<string, string> = {};

  if (!form.title.trim()) nextErrors.title = "Vui lòng nhập tên danh mục.";
  if (!form.slug.trim()) nextErrors.slug = "Vui lòng nhập slug danh mục.";
  if (form.position !== null && form.position < 0)
    nextErrors.position = "Vị trí phải là số dương.";
  if (!form.thumbnail)
    nextErrors.thumbnail = "Vui lòng tải ảnh đại diện danh mục.";

  errors.value = nextErrors;
  return Object.keys(nextErrors).length === 0;
};

const submitForm = () => {
  if (!validateForm()) {
    toast.add({
      severity: "error",
      summary: "Lỗi kiểm tra dữ liệu",
      detail: "Vui lòng nhập đầy đủ các trường bắt buộc.",
      life: 3000,
    });
    return;
  }

  isSubmitting.value = true;
  updateCategory(
    {
      id: categoryId.value,
      payload: buildUpdateCategoryPayload(form),
    },
    {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Đã cập nhật danh mục",
          detail: `Đã cập nhật danh mục ${form.title}.`,
          life: 3000,
        });
        router.back();
      },
      onError: () => {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Không thể cập nhật danh mục.",
          life: 3000,
        });
      },
      onSettled: () => {
        isSubmitting.value = false;
      },
    },
  );
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <div
      v-if="isError"
      class="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20"
    >
      <h2 class="text-lg font-semibold text-red-800 dark:text-red-300">
        Không tìm thấy danh mục
      </h2>
      <p class="mt-2 text-sm text-red-600 dark:text-red-400">
        Danh mục bạn đang chỉnh sửa không tồn tại hoặc đã bị xóa.
      </p>
      <button
        class="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        @click="router.push(ROUTES.ADMIN.CATEGORIES)"
      >
        Quay lại danh mục
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
              Hệ thống danh mục
            </p>
            <h1
              class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
            >
              Chỉnh sửa danh mục
            </h1>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Điều chỉnh cấu trúc và thiết lập phân loại.
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
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Thông tin danh mục
            </h2>
            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <div class="md:col-span-2">
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Tên danh mục *</label
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
                <InputText
                  v-model="form.slug"
                  class="mt-2 w-full"
                  @input="markSlugEdited"
                />
                <p v-if="errors.slug" class="mt-1 text-xs text-red-500">
                  {{ errors.slug }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Loại phân loại *</label
                >
                <Dropdown
                  v-model="form.type"
                  :options="typeOptions"
                  option-label="label"
                  option-value="value"
                  class="mt-2 w-full"
                />
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Danh mục cha</label
                >
                <Dropdown
                  v-model="form.parent_id"
                  :options="parentOptions"
                  option-label="label"
                  option-value="value"
                  class="mt-2 w-full"
                  :loading="isCategoriesLoading"
                  placeholder="Chọn danh mục cha"
                />
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Trạng thái</label
                >
                <Dropdown
                  v-model="form.status"
                  :options="statusOptions"
                  option-label="label"
                  option-value="value"
                  class="mt-2 w-full"
                />
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Vị trí hiển thị
                  <span class="text-xs text-slate-400 font-normal ml-1"
                    >(để trống = tự động)</span
                  >
                </label>
                <InputNumber
                  v-model="form.position"
                  class="mt-2 w-full"
                  :min="0"
                  placeholder="Để trống để tự động"
                />
                <p v-if="errors.position" class="mt-1 text-xs text-red-500">
                  {{ errors.position }}
                </p>
              </div>

              <div class="md:col-span-2">
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Nhãn hiển thị</label
                >
                <InputText
                  v-model="form.badgeText"
                  class="mt-2 w-full"
                  placeholder="Bestseller, New, ..."
                />
              </div>

              <div class="md:col-span-2">
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Mô tả</label
                >
                <Textarea
                  v-model="form.description"
                  rows="5"
                  class="mt-2 w-full"
                  placeholder="Mô tả ngắn cho danh mục..."
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
              Ảnh danh mục
            </h2>
            <div class="mt-4 space-y-5">
              <div>
                <p
                  class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Thumbnail *
                </p>
                <ImageUploader v-model="form.thumbnail" />
                <p v-if="errors.thumbnail" class="mt-1 text-xs text-red-500">
                  {{ errors.thumbnail }}
                </p>
              </div>

              <div>
                <p
                  class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Banner Image
                </p>
                <ImageUploader v-model="form.bannerImage" />
              </div>
            </div>
          </section>

          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Thiết lập nhanh
            </h2>
            <div
              class="mt-4 flex items-center justify-between rounded-xl border border-slate-200/70 px-4 py-3 dark:border-slate-700"
            >
              <div>
                <p
                  class="text-sm font-medium text-slate-800 dark:text-slate-100"
                >
                  Danh mục nổi bật
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Hiển thị ở các khối gợi ý
                </p>
              </div>
              <ToggleSwitch v-model="form.featured" />
            </div>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
