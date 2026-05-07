<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ROUTES } from "~/constants/routes";
import type { AdminCategoryForm } from "~/types/admin-category.type";
import { validateAdminCategory } from "~/validations/admin/category.schema";

definePageMeta({
  layout: "admin",
});

const router = useRouter();
const { createCategory } = useCategoriesApi();

const form = reactive<AdminCategoryForm>({
  title: "",
  slug: "",
  parentId: null,
  description: "",
  position: 0,
  status: "active",
  thumbnail: "",
});

const errors = ref<Record<string, string>>({});
const slugEdited = ref(false);

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

const markSlugEdited = () => {
  slugEdited.value = true;
};

const submitForm = async () => {
  errors.value = validateAdminCategory(form);
  if (Object.keys(errors.value).length) return;
  await createCategory({ ...form });
  router.push(ROUTES.ADMIN.CATEGORIES);
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
            Catalog
          </p>
          <h1
            class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
          >
            Create category
          </h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Define a new product category.
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
            Save category
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
            Category info
          </h2>
          <div class="grid gap-4 mt-4 md:grid-cols-2">
            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Name
              </label>
              <InputText
                v-model="form.title"
                class="mt-2 w-full"
                placeholder="Meal Box"
              />
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
                Parent category
              </label>
              <Dropdown
                v-model="form.parentId"
                class="mt-2 w-full"
                :options="[
                  { label: 'No parent', value: null },
                  { label: 'Meal Box', value: 'CAT-1001' },
                  { label: 'Healthy Food', value: 'CAT-1002' },
                ]"
                option-label="label"
                option-value="value"
                placeholder="Select parent"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Description
              </label>
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
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Thumbnail
          </h2>
          <div class="mt-4">
            <ImageUploader v-model="form.thumbnail" />
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Visibility
          </h2>
          <div class="grid gap-4 mt-4">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Position
              </label>
              <InputNumber v-model="form.position" class="mt-2 w-full" />
              <p v-if="errors.position" class="mt-1 text-xs text-red-500">
                {{ errors.position }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Status
              </label>
              <Dropdown
                v-model="form.status"
                class="mt-2 w-full"
                :options="['active', 'inactive']"
                placeholder="Select status"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
