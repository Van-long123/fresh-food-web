<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ROUTES } from "~/constants/routes";
import type { AdminUserForm } from "~/types/admin-user.type";
import { validateAdminUser } from "~/validations/admin/user.schema";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const route = useRoute();
const router = useRouter();
const userId = route.params.id as string;

const { getUser, updateUser } = useUsersApi();

const form = reactive<AdminUserForm>({
  name: "",
  email: "",
  phone: "",
  role: "staff",
  status: "active",
  address: "",
  avatar: "",
});

const password = ref("");
const errors = ref<Record<string, string>>({});

const { pending } = await useAsyncData(`admin-user-${userId}`, async () => {
  const data = await getUser(userId);
  if (!data) return null;
  Object.assign(form, data);
  return data;
});

const submitForm = async () => {
  const payload = {
    ...form,
    ...(password.value ? { password: password.value } : {}),
  };
  errors.value = validateAdminUser(payload);
  if (Object.keys(errors.value).length) return;
  await updateUser(userId, payload);
  router.push(ROUTES.ADMIN.USERS);
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
            Team
          </p>
          <h1
            class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
          >
            Edit user
          </h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Update user profile and permissions.
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
      Loading user...
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Profile
          </h2>
          <div class="grid gap-4 mt-4 md:grid-cols-2">
            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Full name
              </label>
              <InputText v-model="form.name" class="mt-2 w-full" />
              <p v-if="errors.name" class="mt-1 text-xs text-red-500">
                {{ errors.name }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Email
              </label>
              <InputText v-model="form.email" class="mt-2 w-full" />
              <p v-if="errors.email" class="mt-1 text-xs text-red-500">
                {{ errors.email }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Phone
              </label>
              <InputText v-model="form.phone" class="mt-2 w-full" />
            </div>
            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Address
              </label>
              <Textarea v-model="form.address" rows="3" class="mt-2 w-full" />
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Access
          </h2>
          <div class="grid gap-4 mt-4 md:grid-cols-2">
            <div>
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Role
              </label>
              <Dropdown
                v-model="form.role"
                class="mt-2 w-full"
                :options="['admin', 'staff', 'customer']"
                placeholder="Select role"
              />
              <p v-if="errors.role" class="mt-1 text-xs text-red-500">
                {{ errors.role }}
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
                :options="['active', 'pending', 'banned']"
                placeholder="Select status"
              />
              <p v-if="errors.status" class="mt-1 text-xs text-red-500">
                {{ errors.status }}
              </p>
            </div>
            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Change password
              </label>
              <Password
                v-model="password"
                class="mt-2 w-full"
                toggle-mask
                placeholder="Leave blank to keep current password"
              />
              <p v-if="errors.password" class="mt-1 text-xs text-red-500">
                {{ errors.password }}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div class="space-y-6">
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Avatar
          </h2>
          <div class="mt-4">
            <ImageUploader v-model="form.avatar" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
