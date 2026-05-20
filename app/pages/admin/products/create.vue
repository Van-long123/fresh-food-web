<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ROUTES } from "~/constants/routes";
import type { AdminProductForm } from "~/types/admin-product.type";
import { validateAdminProduct } from "~/validations/admin/product.schema";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const router = useRouter();
const { createProduct } = useProductsApi();

const form = reactive<AdminProductForm>({
  title: "",
  slug: "",
  sku: "",
  categories: [],
  tags: [],
  price: 0,
  salePrice: null,
  costPrice: null,
  saleStart: null,
  saleEnd: null,
  stock: 0,
  lowStockThreshold: 10,
  trackInventory: true,
  shortDescription: "",
  description: "",
  images: [],
  status: "draft",
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
});

const errors = ref<Record<string, string>>({});
const slugEdited = ref(false);
const categoryInput = ref("");
const tagInput = ref("");

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

watch(categoryInput, (value) => {
  form.categories = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
});

watch(tagInput, (value) => {
  form.tags = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
});

const markSlugEdited = () => {
  slugEdited.value = true;
};

const submitForm = async () => {
  errors.value = validateAdminProduct(form);
  if (Object.keys(errors.value).length) return;
  await createProduct({ ...form });
  router.push(ROUTES.ADMIN.PRODUCTS);
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
            Create product
          </h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Add a new item to your catalog.
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
            Save product
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
            Basic information
          </h2>
          <div class="grid gap-4 mt-4 md:grid-cols-2">
            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Product name
              </label>
              <InputText
                v-model="form.title"
                class="mt-2 w-full"
                placeholder="Organic Salmon Bowl"
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
                SKU
              </label>
              <InputText
                v-model="form.sku"
                class="mt-2 w-full"
                placeholder="FD-1024"
              />
              <p v-if="errors.sku" class="mt-1 text-xs text-red-500">
                {{ errors.sku }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Categories
              </label>
              <InputText
                v-model="categoryInput"
                class="mt-2 w-full"
                placeholder="Meal Box, Healthy Food"
              />
              <p v-if="errors.categories" class="mt-1 text-xs text-red-500">
                {{ errors.categories }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Tags
              </label>
              <InputText
                v-model="tagInput"
                class="mt-2 w-full"
                placeholder="fresh, organic"
              />
            </div>
            <div class="md:col-span-2">
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
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Pricing
          </h2>
          <div class="grid gap-4 mt-4 md:grid-cols-3">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Price
              </label>
              <InputNumber v-model="form.price" class="mt-2 w-full" />
              <p v-if="errors.price" class="mt-1 text-xs text-red-500">
                {{ errors.price }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Sale price
              </label>
              <InputNumber v-model="form.salePrice" class="mt-2 w-full" />
              <p v-if="errors.salePrice" class="mt-1 text-xs text-red-500">
                {{ errors.salePrice }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Cost price
              </label>
              <InputNumber v-model="form.costPrice" class="mt-2 w-full" />
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Description
          </h2>
          <div class="mt-4">
            <RichTextEditor
              v-model="form.description"
              placeholder="Write product details here..."
            />
          </div>
        </section>
      </div>

      <div class="space-y-6">
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Media
          </h2>
          <div class="mt-4">
            <ImageUploader v-model="form.images" multiple :max-size="5" />
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Inventory
          </h2>
          <div class="grid gap-4 mt-4">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Stock
              </label>
              <InputNumber v-model="form.stock" class="mt-2 w-full" />
              <p v-if="errors.stock" class="mt-1 text-xs text-red-500">
                {{ errors.stock }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Low stock threshold
              </label>
              <InputNumber
                v-model="form.lowStockThreshold"
                class="mt-2 w-full"
              />
            </div>
            <div
              class="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800"
            >
              <div>
                <p
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Track inventory
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Enable stock alerts for this product.
                </p>
              </div>
              <ToggleSwitch v-model="form.trackInventory" />
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
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

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Status
          </h2>
          <Dropdown
            v-model="form.status"
            class="mt-3 w-full"
            :options="['draft', 'active', 'inactive']"
            placeholder="Select status"
          />
        </section>
      </div>
    </div>
  </div>
</template>
