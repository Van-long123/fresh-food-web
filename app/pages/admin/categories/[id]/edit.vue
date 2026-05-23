<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ROUTES } from "~/constants/routes";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import ToggleSwitch from "primevue/toggleswitch";
import ImageUploader from "~/components/admin/ImageUploader.vue";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Chỉnh sửa danh mục - Quản trị SmartFood",
});

const route = useRoute();
const router = useRouter();
const store = useAdminMockStore();
const toast = useToast();

const categoryId = route.params.id as string;
const isSubmitting = ref(false);
const isNotFound = ref(false);

const form = reactive({
  title: "",
  slug: "",
  type: "product" as "product" | "article",
  description: "",
  thumbnail: "",
  bannerImage: "",
  badgeText: "",
  status: "active" as "active" | "inactive",
  featured: false,
  position: 1,
  parent_id: null as string | null,
});

const errors = ref<Record<string, string>>({});

const typeOptions = [
  { label: "Danh mục sản phẩm", value: "product" },
  { label: "Bài viết / tin tức", value: "article" },
];

const parentOptions = computed(() => {
  const list = store.categories
    .filter(
      (c) =>
        c.status === "active" &&
        c.parent_id === null &&
        c.type === form.type &&
        c.id !== categoryId,
    )
    .map((c) => ({ label: c.title, value: c.id }));
  return [{ label: "Không có danh mục cha (gốc)", value: null }, ...list];
});

const category = store.categories.find((c) => c.id === categoryId);
if (category) {
  Object.assign(form, {
    title: category.title,
    slug: category.slug,
    type: category.type,
    description: category.description,
    thumbnail: category.thumbnail,
    bannerImage: category.bannerImage,
    badgeText: category.badgeText,
    status: category.status,
    featured: category.featured,
    position: category.position,
    parent_id: category.parent_id,
  });
} else {
  isNotFound.value = true;
}

const validateForm = () => {
  const errs: Record<string, string> = {};
  if (!form.title.trim()) errs.title = "Vui lòng nhập tên danh mục.";
  if (!form.slug.trim()) errs.slug = "Vui lòng nhập slug danh mục.";
  if (form.position < 0) errs.position = "Vị trí phải là số dương.";
  if (!form.thumbnail) errs.thumbnail = "Vui lòng tải ảnh đại diện danh mục.";

  errors.value = errs;
  return Object.keys(errs).length === 0;
};

const submitForm = async () => {
  if (isNotFound.value) return;
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
  await new Promise((resolve) => setTimeout(resolve, 600));

  try {
    store.updateCategory(categoryId, {
      title: form.title,
      slug: form.slug,
      type: form.type,
      description: form.description,
      thumbnail: form.thumbnail,
      bannerImage: form.bannerImage,
      badgeText: form.badgeText,
      status: form.status,
      featured: form.featured,
      position: form.position,
      parent_id: form.parent_id,
    });

    toast.add({
      severity: "success",
      summary: "Đã cập nhật danh mục",
      detail: `Đã cập nhật danh mục ${form.title}.`,
      life: 3000,
    });

    router.push(ROUTES.ADMIN.CATEGORIES);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Không thể cập nhật danh mục.",
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
        Không tìm thấy danh mục
      </h2>
      <p class="text-sm text-red-600 dark:text-red-400 mt-2">
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
            <div class="grid gap-4 mt-4 md:grid-cols-2">
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
                <InputText v-model="form.slug" class="mt-2 w-full" />
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
                  placeholder="Chọn danh mục cha"
                  class="mt-2 w-full"
                />
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Nhãn hiển thị</label
                >
                <InputText v-model="form.badgeText" class="mt-2 w-full" />
              </div>

              <div class="md:col-span-2">
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Mô tả</label
                >
                <Textarea
                  v-model="form.description"
                  rows="4"
                  class="mt-2 w-full"
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
              Tài nguyên hình ảnh
            </h2>
            <div class="mt-4 space-y-4">
              <div>
                <span
                  class="text-xs font-semibold text-slate-400 block mb-2 uppercase"
                  >Ảnh đại diện danh mục *</span
                >
                <ImageUploader v-model="form.thumbnail" />
                <p v-if="errors.thumbnail" class="mt-1 text-xs text-red-500">
                  {{ errors.thumbnail }}
                </p>
              </div>
              <div>
                <span
                  class="text-xs font-semibold text-slate-400 block mb-2 uppercase"
                  >Banner đầu trang danh mục</span
                >
                <ImageUploader v-model="form.bannerImage" />
              </div>
            </div>
          </section>

          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Quy tắc hiển thị danh mục
            </h2>
            <div class="grid gap-4 mt-4">
              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Vị trí / trọng số sắp xếp *</label
                >
                <InputNumber
                  v-model="form.position"
                  :min="1"
                  class="mt-2 w-full"
                />
                <p v-if="errors.position" class="mt-1 text-xs text-red-500">
                  {{ errors.position }}
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
                    Ghim lên mục gợi ý trang chủ.
                  </p>
                </div>
                <ToggleSwitch v-model="form.featured" />
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Trạng thái</label
                >
                <Dropdown
                  v-model="form.status"
                  class="mt-2 w-full"
                  :options="[
                    { label: 'Hoạt động', value: 'active' },
                    { label: 'Ngừng hoạt động', value: 'inactive' }
                  ]"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Chọn trạng thái"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
