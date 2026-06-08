<script setup lang="ts">
import { reactive, ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import InputNumber from "primevue/inputnumber";
import ToggleSwitch from "primevue/toggleswitch";
import { ROUTES } from "~/constants/routes";
import ImageUploader from "~/components/admin/ImageUploader.vue";
import RichTextEditor from "~/components/admin/RichTextEditor.vue";
import { useToast } from "primevue/usetoast";
import { useAdminArticleCategoriesQuery } from "~/queries/article/useAdminArticleCategoriesQuery";
import { useCreateAdminArticle } from "~/mutations/article/useCreateAdminArticle";
import { buildCreateArticlePayload } from "~/services/admin/article.service";
import { slugify } from "~/utils/formatters";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Tạo bài viết - Quản trị SmartFood",
});

const router = useRouter();
const toast = useToast();
const { data: categoriesData, isLoading: isCategoriesLoading } =
  useAdminArticleCategoriesQuery();
const { mutate: createArticle, isPending: isSubmitting } =
  useCreateAdminArticle();

const slugEdited = ref(false);
const tagsInput = ref("");
const errors = ref<Record<string, string>>({});

const articleCategories = computed(() =>
  (categoriesData.value ?? []).map((c) => ({ label: c.title, value: c._id })),
);

const form = reactive({
  title: "",
  slug: "",
  shortDescription: "",
  content: "",
  thumbnail: "" as string | File,
  authorName: "SmartFood Editor",
  primary_category_id: "",
  category_ids: [] as string[],
  tags: [] as string[],
  status: "draft" as "active" | "draft" | "inactive",
  publishedAt: new Date().toISOString().split("T")[0],
  readTime: 5,
  views: 0,
  position: 1,
  featured: false,
});

watch(
  () => form.title,
  (value) => {
    if (slugEdited.value) return;
    form.slug = slugify(value);
  },
);

watch(tagsInput, (value) => {
  form.tags = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
});

// Đảm bảo primary_category_id luôn có trong category_ids
watch(
  () => form.primary_category_id,
  (newPrimary) => {
    if (newPrimary && !form.category_ids.includes(newPrimary)) {
      form.category_ids = [newPrimary, ...form.category_ids];
    }
  },
);

const markSlugEdited = () => {
  slugEdited.value = true;
};

const validateForm = () => {
  const errs: Record<string, string> = {};
  if (!form.title.trim()) errs.title = "Vui lòng nhập tiêu đề.";
  if (!form.slug.trim()) errs.slug = "Vui lòng nhập slug.";
  if (!form.authorName.trim()) errs.authorName = "Vui lòng nhập tên tác giả.";
  if (!form.primary_category_id)
    errs.primary_category_id = "Vui lòng chọn danh mục.";
  if (!form.category_ids || form.category_ids.length === 0)
    errs.category_ids = "Vui lòng chọn ít nhất 1 danh mục phụ.";
  if (!form.shortDescription.trim())
    errs.shortDescription = "Vui lòng nhập mô tả ngắn.";
  if (!form.content.trim()) errs.content = "Vui lòng nhập nội dung bài viết.";
  if (form.readTime <= 0) errs.readTime = "Thời gian đọc phải ít nhất 1 phút.";

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

  try {
    const payload = buildCreateArticlePayload({
      ...form,
      publishedAt: form.publishedAt
        ? new Date(form.publishedAt).toISOString()
        : null,
    });

    createArticle(payload, {
      onSuccess: (result) => {
        toast.add({
          severity: "success",
          summary: "Đã tạo bài viết",
          detail: `Đã tạo bài viết '${result.title}'`,
          life: 3000,
        });
        router.push(ROUTES.ADMIN.ARTICLES);
      },
      onError: (error: any) => {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: error?.response?.data?.message ?? "Không thể tạo bài viết.",
          life: 3000,
        });
      },
    });
  } catch {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Không thể tạo bài viết.",
      life: 3000,
    });
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
            Trung tâm nội dung
          </p>
          <h1
            class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
          >
            Tạo bài viết
          </h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Soạn công thức nấu ăn, lời khuyên dinh dưỡng hoặc bài blog chiến
            dịch.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            :disabled="isSubmitting"
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
            @click="router.back()"
          >
            Hủy
          </button>
          <button
            :disabled="isSubmitting"
            class="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-50"
            @click="submitForm"
          >
            <i v-if="isSubmitting" class="pi pi-spin pi-spinner mr-2"></i>
            Lưu bài viết
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
            Nội dung bài viết
          </h2>
          <div class="grid gap-4 mt-4 md:grid-cols-2">
            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Tiêu đề bài viết *</label
              >
              <InputText
                v-model="form.title"
                class="mt-2 w-full"
                placeholder="e.g. 10 Mẹo ăn kiêng Keto hiệu quả"
              />
              <p v-if="errors.title" class="mt-1 text-xs text-red-500">
                {{ errors.title }}
              </p>
            </div>

            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Slug URL *</label
              >
              <InputText
                v-model="form.slug"
                class="mt-2 w-full font-mono"
                @input="markSlugEdited"
              />
              <p v-if="errors.slug" class="mt-1 text-xs text-red-500">
                {{ errors.slug }}
              </p>
            </div>

            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Tên tác giả *</label
              >
              <InputText v-model="form.authorName" class="mt-2 w-full" />
              <p v-if="errors.authorName" class="mt-1 text-xs text-red-500">
                {{ errors.authorName }}
              </p>
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Danh mục chính *</label
              >
              <Select
                v-model="form.primary_category_id"
                :options="articleCategories"
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
                :options="articleCategories"
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

            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Tóm tắt ngắn / mở đầu *</label
              >
              <Textarea
                v-model="form.shortDescription"
                rows="2"
                class="mt-2 w-full"
                placeholder="Câu giới thiệu ngắn hiển thị trong danh sách..."
              />
              <p
                v-if="errors.shortDescription"
                class="mt-1 text-xs text-red-500"
              >
                {{ errors.shortDescription }}
              </p>
            </div>

            <div class="md:col-span-2">
              <label
                class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                >Nội dung chính *</label
              >
              <RichTextEditor v-model="form.content" />
              <p v-if="errors.content" class="mt-1 text-xs text-red-500">
                {{ errors.content }}
              </p>
            </div>

            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Thẻ (cách nhau bằng dấu phẩy)</label
              >
              <InputText
                v-model="tagsInput"
                class="mt-2 w-full"
                placeholder="Ví dụ: keto, ankieng, healthy"
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
            Ảnh bìa
          </h2>
          <div class="mt-4">
            <ImageUploader v-model="form.thumbnail" />
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Lịch xuất bản & tham số
          </h2>
          <div class="grid gap-4 mt-4">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Trạng thái</label
              >
              <Dropdown
                v-model="form.status"
                class="mt-2 w-full"
                :options="[
                  { label: 'Đã xuất bản / hoạt động', value: 'active' },
                  { label: 'Bản nháp', value: 'draft' },
                  { label: 'Đã lưu trữ / ngừng hoạt động', value: 'inactive' },
                ]"
                option-label="label"
                option-value="value"
              />
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Ngày xuất bản</label
              >
              <input
                v-model="form.publishedAt"
                type="date"
                class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Thời gian đọc (phút)</label
              >
              <InputNumber
                v-model="form.readTime"
                class="mt-2 w-full"
                :min="1"
              />
              <p v-if="errors.readTime" class="mt-1 text-xs text-red-500">
                {{ errors.readTime }}
              </p>
            </div>

            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >Thứ tự hiển thị / vị trí</label
              >
              <InputNumber
                v-model="form.position"
                class="mt-2 w-full"
                :min="1"
              />
            </div>
            <div
              class="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800"
            >
              <div>
                <p
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Bài viết nổi bật
                </p>
                <p class="text-xs text-slate-400 font-normal">
                  Ghim bài viết này lên đầu các mục blog trang chủ.
                </p>
              </div>
              <ToggleSwitch v-model="form.featured" />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
