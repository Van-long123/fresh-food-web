<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import { ROUTES } from "~/constants/routes";
import type { AdminArticleForm } from "~/types/admin-article.type";
import { validateAdminArticle } from "~/validations/admin/article.schema";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const route = useRoute();
const router = useRouter();
const articleId = route.params.id as string;

const { getArticle, updateArticle } = useArticlesApi();

const form = reactive<AdminArticleForm>({
  title: "",
  slug: "",
  shortDescription: "",
  content: "",
  thumbnail: "",
  authorName: "",
  primaryCategoryId: null,
  tags: [],
  status: "draft",
  publishedAt: null,
  metaTitle: "",
  metaDescription: "",
});

const errors = ref<Record<string, string>>({});
const slugEdited = ref(true);
const tagsInput = ref("");

const { pending } = await useAsyncData(
  `admin-article-${articleId}`,
  async () => {
    const data = await getArticle(articleId);
    if (!data) return null;
    Object.assign(form, data);
    tagsInput.value = data.tags.join(", ");
    return data;
  },
);

watch(
  () => form.title,
  (value) => {
    if (slugEdited.value) return;
    form.slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
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

const submitForm = async () => {
  errors.value = validateAdminArticle(form);
  if (Object.keys(errors.value).length) return;
  await updateArticle(articleId, { ...form });
  router.push(ROUTES.ADMIN.ARTICLES);
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
            Content
          </p>
          <h1
            class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
          >
            Edit article
          </h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Update article content and status.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
            @click="router.back()"
          >
            Cancel
          </button>
          <button
            class="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            @click="submitForm"
          >
            Save changes
          </button>
        </div>
      </div>
    </section>

    <div
      v-if="pending"
      class="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
    >
      Loading article...
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Article content
          </h2>
          <div class="grid gap-4 mt-4">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Title
              </label>
              <InputText v-model="form.title" class="mt-2 w-full" />
              <p v-if="errors.title" class="mt-1 text-xs text-red-500">
                {{ errors.title }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Slug
              </label>
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
              >
                Author
              </label>
              <InputText v-model="form.authorName" class="mt-2 w-full" />
              <p v-if="errors.authorName" class="mt-1 text-xs text-red-500">
                {{ errors.authorName }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Category
              </label>
              <Dropdown
                v-model="form.primaryCategoryId"
                class="mt-2 w-full"
                :options="[
                  { label: 'Nutrition', value: 'CAT-1001' },
                  { label: 'Guides', value: 'CAT-1002' },
                ]"
                option-label="label"
                option-value="value"
                placeholder="Select category"
              />
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Short description
              </label>
              <Textarea
                v-model="form.shortDescription"
                rows="3"
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
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Content
              </label>
              <RichTextEditor v-model="form.content" />
              <p v-if="errors.content" class="mt-1 text-xs text-red-500">
                {{ errors.content }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Tags
              </label>
              <InputText
                v-model="tagsInput"
                class="mt-2 w-full"
                placeholder="nutrition, healthy"
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
            Thumbnail
          </h2>
          <div class="mt-4">
            <ImageUploader v-model="form.thumbnail" />
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Publishing
          </h2>
          <div class="grid gap-4 mt-4">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Status
              </label>
              <Dropdown
                v-model="form.status"
                class="mt-2 w-full"
                :options="['draft', 'active', 'inactive']"
                placeholder="Select status"
              />
              <p v-if="errors.status" class="mt-1 text-xs text-red-500">
                {{ errors.status }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Publish date
              </label>
              <Calendar
                v-model="form.publishedAt"
                class="mt-2 w-full"
                show-icon
                date-format="yy-mm-dd"
              />
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            SEO
          </h2>
          <div class="grid gap-4 mt-4">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Meta title
              </label>
              <InputText v-model="form.metaTitle" class="mt-2 w-full" />
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Meta description
              </label>
              <Textarea
                v-model="form.metaDescription"
                rows="3"
                class="mt-2 w-full"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
