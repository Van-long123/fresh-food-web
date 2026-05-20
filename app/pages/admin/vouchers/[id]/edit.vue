<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ROUTES } from "~/constants/routes";
import type { AdminVoucherForm } from "~/types/admin-voucher.type";
import { validateAdminVoucher } from "~/validations/admin/voucher.schema";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const route = useRoute();
const router = useRouter();
const voucherId = route.params.id as string;

const { getVoucher, updateVoucher } = useVouchersApi();

const form = reactive<AdminVoucherForm>({
  code: "",
  name: "",
  description: "",
  type: "percent",
  discountValue: 10,
  maxDiscountAmount: null,
  minOrderValue: 0,
  applyFor: "all",
  applyForIds: [],
  startDate: "",
  endDate: "",
  status: "active",
  usageLimit: 100,
  usageLimitPerUser: 1,
  isFeatured: false,
});

const applyIdsInput = ref("");
const errors = ref<Record<string, string>>({});

const { pending } = await useAsyncData(
  `admin-voucher-${voucherId}`,
  async () => {
    const data = await getVoucher(voucherId);
    if (!data) return null;
    Object.assign(form, data);
    applyIdsInput.value = data.applyForIds?.join(", ") || "";
    return data;
  },
);

watch(applyIdsInput, (value) => {
  form.applyForIds = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
});

const submitForm = async () => {
  errors.value = validateAdminVoucher(form);
  if (Object.keys(errors.value).length) return;
  await updateVoucher(voucherId, { ...form });
  router.push(ROUTES.ADMIN.VOUCHERS);
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
            Promotions
          </p>
          <h1
            class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
          >
            Edit voucher
          </h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Update voucher values and schedule.
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
      Loading voucher...
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Voucher details
          </h2>
          <div class="grid gap-4 mt-4 md:grid-cols-2">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Code
              </label>
              <InputText v-model="form.code" class="mt-2 w-full" />
              <p v-if="errors.code" class="mt-1 text-xs text-red-500">
                {{ errors.code }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Name
              </label>
              <InputText v-model="form.name" class="mt-2 w-full" />
              <p v-if="errors.name" class="mt-1 text-xs text-red-500">
                {{ errors.name }}
              </p>
            </div>
            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Description
              </label>
              <Textarea
                v-model="form.description"
                rows="3"
                class="mt-2 w-full"
              />
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Discount
          </h2>
          <div class="grid gap-4 mt-4 md:grid-cols-2">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Type
              </label>
              <Dropdown
                v-model="form.type"
                class="mt-2 w-full"
                :options="['percent', 'money', 'freeship', 'product']"
                placeholder="Select type"
              />
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Value
              </label>
              <InputNumber v-model="form.discountValue" class="mt-2 w-full" />
              <p v-if="errors.discountValue" class="mt-1 text-xs text-red-500">
                {{ errors.discountValue }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Max discount
              </label>
              <InputNumber
                v-model="form.maxDiscountAmount"
                class="mt-2 w-full"
              />
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Min order value
              </label>
              <InputNumber v-model="form.minOrderValue" class="mt-2 w-full" />
            </div>
          </div>
        </section>
      </div>

      <div class="space-y-6">
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Schedule & limits
          </h2>
          <div class="grid gap-4 mt-4">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Start date
              </label>
              <Calendar
                v-model="form.startDate"
                class="mt-2 w-full"
                show-icon
                date-format="yy-mm-dd"
              />
              <p v-if="errors.startDate" class="mt-1 text-xs text-red-500">
                {{ errors.startDate }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                End date
              </label>
              <Calendar
                v-model="form.endDate"
                class="mt-2 w-full"
                show-icon
                date-format="yy-mm-dd"
              />
              <p v-if="errors.endDate" class="mt-1 text-xs text-red-500">
                {{ errors.endDate }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Usage limit
              </label>
              <InputNumber v-model="form.usageLimit" class="mt-2 w-full" />
              <p v-if="errors.usageLimit" class="mt-1 text-xs text-red-500">
                {{ errors.usageLimit }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Limit per user
              </label>
              <InputNumber
                v-model="form.usageLimitPerUser"
                class="mt-2 w-full"
              />
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Apply for
          </h2>
          <div class="grid gap-4 mt-4">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Scope
              </label>
              <Dropdown
                v-model="form.applyFor"
                class="mt-2 w-full"
                :options="['all', 'category', 'product']"
                placeholder="Select scope"
              />
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                IDs
              </label>
              <InputText
                v-model="applyIdsInput"
                class="mt-2 w-full"
                placeholder="CAT-1001, PRD-2001"
              />
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
                :options="['active', 'inactive', 'expired']"
                placeholder="Select status"
              />
            </div>
            <div
              class="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800"
            >
              <div>
                <p
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Feature this voucher
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Highlight on the promo banner.
                </p>
              </div>
              <ToggleSwitch v-model="form.isFeatured" />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
