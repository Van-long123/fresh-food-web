<script setup lang="ts">
import { computed, ref } from "vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import { ROUTES } from "~/constants/routes";
import type { AdminRoleListItem } from "~/types/admin-role.type";

definePageMeta({
  layout: "admin",
});

const columns: DataTableColumn[] = [
  { key: "name", label: "Role" },
  { key: "description", label: "Description" },
  { key: "usersCount", label: "Users" },
  { key: "actions", label: "Actions" },
];

const { listRoles } = useRolesApi();
const { data, pending } = await useAsyncData("admin-roles", () => listRoles());

const roles = computed(() => (data.value?.data || []) as AdminRoleListItem[]);
const searchQuery = ref("");

const filteredRoles = computed(() => {
  if (!searchQuery.value.trim()) return roles.value;
  const query = searchQuery.value.trim().toLowerCase();
  return roles.value.filter((role) =>
    [role.name, role.description, role.usersCount]
      .map((value) => String(value ?? "").toLowerCase())
      .some((value) => value.includes(query)),
  );
});

const total = computed(() => filteredRoles.value.length);
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
            Access Control
          </p>
          <h1
            class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
          >
            Roles & permissions
          </h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Manage role access to modules and staff workflows.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
          >
            Export
          </button>
          <button
            class="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            Create role
          </button>
        </div>
      </div>
    </section>

    <DataTable
      :columns="columns"
      :data="filteredRoles"
      :total="total"
      :page="1"
      :per-page="10"
      :loading="pending"
      searchable
      @update:search="(value) => (searchQuery = value)"
    >
      <template #title>Role list</template>
      <template #subtitle>Assign permissions per role.</template>
      <template #toolbar>
        <div
          class="hidden items-center gap-2 text-xs text-slate-500 dark:text-slate-300 sm:flex"
        >
          <i class="pi pi-shield"></i>
          <span>{{ total }} roles</span>
        </div>
      </template>
      <template #cell-actions="{ row }">
        <NuxtLink
          :to="ROUTES.ADMIN.ROLE_EDIT(row.id)"
          class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
        >
          <i class="pi pi-pen-to-square"></i>
          Edit permissions
        </NuxtLink>
      </template>
      <template #empty>
        <div class="text-sm text-slate-500">
          No roles found. Try adjusting your search.
        </div>
      </template>
    </DataTable>
  </div>
</template>
