<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import { ROUTES } from "~/constants/routes";
import type {
  AdminRoleForm,
  AdminRolePermission,
} from "~/types/admin-role.type";
import { validateAdminRole } from "~/validations/admin/role.schema";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const route = useRoute();
const router = useRouter();
const roleId = route.params.id as string;

const modules = [
  "Articles",
  "Products",
  "Categories",
  "Orders",
  "Users",
  "Vouchers",
  "Reviews",
];
const permissions: AdminRolePermission[] = ["view", "create", "edit", "delete"];

const { getRole, updateRole } = useRolesApi();

const form = reactive<AdminRoleForm>({
  name: "",
  description: "",
  permissions: {},
});

const errors = ref<Record<string, string>>({});

const { pending } = await useAsyncData(`admin-role-${roleId}`, async () => {
  const data = await getRole(roleId);
  if (!data) return null;
  Object.assign(form, data);
  return data;
});

const togglePermission = (
  moduleName: string,
  permission: AdminRolePermission,
) => {
  const current = form.permissions[moduleName] || [];
  if (current.includes(permission)) {
    form.permissions[moduleName] = current.filter(
      (item) => item !== permission,
    );
  } else {
    form.permissions[moduleName] = [...current, permission];
  }
};

const toggleRow = (moduleName: string) => {
  const current = form.permissions[moduleName] || [];
  form.permissions[moduleName] =
    current.length === permissions.length ? [] : [...permissions];
};

const toggleColumn = (permission: AdminRolePermission) => {
  modules.forEach((moduleName) => {
    const current = form.permissions[moduleName] || [];
    if (current.includes(permission)) {
      form.permissions[moduleName] = current.filter(
        (item) => item !== permission,
      );
    } else {
      form.permissions[moduleName] = [...current, permission];
    }
  });
};

const isRowChecked = (moduleName: string) => {
  const current = form.permissions[moduleName] || [];
  return current.length === permissions.length;
};

const isColumnChecked = (permission: AdminRolePermission) => {
  return modules.every((moduleName) =>
    (form.permissions[moduleName] || []).includes(permission),
  );
};

const submitForm = async () => {
  errors.value = validateAdminRole(form);
  if (Object.keys(errors.value).length) return;
  await updateRole(roleId, { ...form });
  router.push(ROUTES.ADMIN.ROLES);
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
            Role Management
          </p>
          <h1
            class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
          >
            Edit role
          </h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Assign module permissions to {{ form.name || "role" }}.
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
      Loading role...
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Role information
            </h2>
            <span
              class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300"
            >
              Basic details
            </span>
          </div>
          <div class="grid gap-5 mt-5 md:grid-cols-2">
            <div class="md:col-span-2">
              <label
                class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Role name
              </label>
              <InputText
                v-model="form.name"
                class="mt-2 w-full"
                :class="errors.name ? 'p-invalid' : ''"
                placeholder="e.g. Operations manager"
              />
              <p v-if="errors.name" class="mt-2 text-xs text-red-500">
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
                rows="4"
                class="mt-2 w-full"
                :class="errors.description ? 'p-invalid' : ''"
                placeholder="Short summary of what this role can do"
              />
              <p v-if="errors.description" class="mt-2 text-xs text-red-500">
                {{ errors.description }}
              </p>
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                Permission matrix
              </h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                Toggle permissions by module or use column controls.
              </p>
            </div>
            <div
              class="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-300"
            >
              {{ modules.length }} modules
            </div>
          </div>
          <div
            class="mt-5 overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800"
          >
            <table class="min-w-full text-sm">
              <thead
                class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-300"
              >
                <tr>
                  <th class="px-4 py-3 text-left">Module</th>
                  <th
                    v-for="permission in permissions"
                    :key="permission"
                    class="px-4 py-3 text-left"
                  >
                    <label class="flex items-center gap-2">
                      <Checkbox
                        :binary="true"
                        :model-value="isColumnChecked(permission)"
                        @update:model-value="toggleColumn(permission)"
                      />
                      <span class="capitalize">{{ permission }}</span>
                    </label>
                  </th>
                  <th class="px-4 py-3 text-left">All</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr
                  v-for="moduleName in modules"
                  :key="moduleName"
                  class="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td
                    class="px-4 py-3 font-medium text-slate-900 dark:text-white"
                  >
                    {{ moduleName }}
                  </td>
                  <td
                    v-for="permission in permissions"
                    :key="permission"
                    class="px-4 py-3"
                  >
                    <Checkbox
                      :binary="true"
                      :model-value="
                        (form.permissions[moduleName] || []).includes(
                          permission,
                        )
                      "
                      @update:model-value="
                        togglePermission(moduleName, permission)
                      "
                    />
                  </td>
                  <td class="px-4 py-3">
                    <button
                      type="button"
                      class="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                      @click="toggleRow(moduleName)"
                    >
                      {{ isRowChecked(moduleName) ? "Clear" : "All" }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div class="space-y-6">
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Summary
            </h2>
            <span
              class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
            >
              Live preview
            </span>
          </div>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-300">
            Select permissions per module. Use column headers to toggle whole
            columns.
          </p>
          <ul class="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li
              v-for="moduleName in modules"
              :key="moduleName"
              class="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div class="font-medium text-slate-900 dark:text-white">
                {{ moduleName }}
              </div>
              <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {{
                  (form.permissions[moduleName] || []).join(", ") || "No access"
                }}
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>
