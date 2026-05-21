<script setup lang="ts">
import { reactive, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import ToggleSwitch from "primevue/toggleswitch";
import { ROUTES } from "~/constants/routes";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
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

const articleId = route.params.id as string;
const isSubmitting = ref(false);
const slugEdited = ref(true);
const tagsInput = ref("");
const errors = ref<Record<string, string>>({});
const isNotFound = ref(false);

const articleCategories = computed(() => {
  return store.categories.filter((c) => c.type === "article");
});

const form = reactive({
  title: "",
  slug: "",
  shortDescription: "",
  content: "",
  thumbnail: "",
  authorName: "",
  primary_category_id: "",
  tags: [] as string[],
  status: "draft" as "active" | "draft" | "inactive",
  publishedAt: "",
  readTime: 5,
  position: 1,
  featured: false,
});

const article = store.articles.find((a) => a.id === articleId);
if (article) {
  Object.assign(form, {
    title: article.title,
    slug: article.slug,
    shortDescription: article.shortDescription,
    content: article.content,
    thumbnail: article.thumbnail,
    authorName: article.authorName,
    primary_category_id: article.primary_category_id,
    tags: article.tags || [],
    status: article.status,
    publishedAt: article.publishedAt
      ? article.publishedAt.split("T")[0]
      : new Date().toISOString().split("T")[0],
    readTime: article.readTime || 5,
    position: article.position || 1,
    featured: article.featured || false,
  });
  tagsInput.value = (article.tags || []).join(", ");
} else {
  isNotFound.value = true;
}

watch(
  () => form.title,
  (value) => {
    if (slugEdited.value) return;
    form.slug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  },
);

watch(tagsInput, (value) => {
  form.tags = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
});

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
  if (!form.shortDescription.trim())
    errs.shortDescription = "Vui lòng nhập mô tả ngắn.";
  if (!form.content.trim()) errs.content = "Vui lòng nhập nội dung bài viết.";
  if (form.readTime <= 0) errs.readTime = "Thời gian đọc phải ít nhất 1 phút.";

  errors.value = errs;
  return Object.keys(errs).length === 0;
};

const submitForm = async () => {
  if (isNotFound.value) return;
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
    store.updateArticle(articleId, {
      title: form.title,
      slug: form.slug,
      shortDescription: form.shortDescription,
      content: form.content,
      thumbnail: form.thumbnail,
      authorName: form.authorName,
      readTime: form.readTime,
      publishedAt: new Date(
        form.publishedAt || new Date().toISOString(),
      ).toISOString(),
      status: form.status,
      featured: form.featured,
      position: form.position,
      primary_category_id: form.primary_category_id,
      tags: form.tags,
    });

    toast.add({
      severity: "success",
      summary: "Đã cập nhật bài viết",
      detail: `Đã cập nhật bài viết '${form.title}'`,
      life: 3000,
    });

    router.push(ROUTES.ADMIN.ARTICLES);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Không thể cập nhật bài viết.",
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
        Không tìm thấy bài viết
      </h2>
      <p class="text-sm text-red-600 dark:text-red-400 mt-2">
        Bài viết bạn đang chỉnh sửa không tồn tại hoặc đã bị xóa.
      </p>
      <button
        class="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        @click="router.push(ROUTES.ADMIN.ARTICLES)"
      >
        Quay lại bài viết
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
              Trung tâm nội dung
            </p>
            <h1
              class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
            >
              Chỉnh sửa bài viết
            </h1>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Cập nhật tham số bài viết và mức hiển thị.
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
              Nội dung bài viết
            </h2>
            <div class="grid gap-4 mt-4">
              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Tiêu đề bài viết *</label
                >
                <InputText v-model="form.title" class="mt-2 w-full" />
                <p v-if="errors.title" class="mt-1 text-xs text-red-500">
                  {{ errors.title }}
                </p>
              </div>

              <div>
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

              <div class="grid gap-4 md:grid-cols-2">
                <div>
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
                  <Dropdown
                    v-model="form.primary_category_id"
                    class="mt-2 w-full"
                    :options="articleCategories"
                    option-label="title"
                    option-value="id"
                    placeholder="Chọn danh mục"
                  />
                  <p
                    v-if="errors.primary_category_id"
                    class="mt-1 text-xs text-red-500"
                  >
                    {{ errors.primary_category_id }}
                  </p>
                </div>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Tóm tắt ngắn / mở đầu *</label
                >
                <Textarea
                  v-model="form.shortDescription"
                  rows="2"
                  class="mt-2 w-full"
                />
                <p
                  v-if="errors.shortDescription"
                  class="mt-1 text-xs text-red-500"
                >
                  {{ errors.shortDescription }}
                </p>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                  >Nội dung chính *</label
                >
                <RichTextEditor v-model="form.content" />
                <p v-if="errors.content" class="mt-1 text-xs text-red-500">
                  {{ errors.content }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Thẻ (cách nhau bằng dấu phẩy)</label
                >
                <InputText v-model="tagsInput" class="mt-2 w-full" />
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
                    {
                      label: 'Đã lưu trữ / ngừng hoạt động',
                      value: 'inactive',
                    },
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

              <div class="grid grid-cols-2 gap-4">
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
    </template>
  </div>
</template>
