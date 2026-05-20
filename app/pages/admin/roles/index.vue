<script setup lang="ts">
import { computed, ref } from "vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import { ROUTES } from "~/constants/routes";
import type { AdminRoleListItem } from "~/types/admin-role.type";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
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
const deleteTarget = ref<AdminRoleListItem | null>(null);
const deleteLoading = ref(false);
const showDeleteDialog = ref(false);

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

const openDeleteDialog = (role: AdminRoleListItem) => {
  deleteTarget.value = role;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;
  try {
    console.log("Deleting role:", deleteTarget.value.id);
    showDeleteDialog.value = false;
    deleteTarget.value = null;
  } catch (error) {
    console.error("Delete error:", error);
  } finally {
    deleteLoading.value = false;
  }
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
  deleteTarget.value = null;
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Roles & Permissions"
      subtitle="Manage role access to modules and staff workflows."
      breadcrumb="Access Control"
      :primary-action="{
        label: 'Create role',
        icon: 'pi pi-plus',
        onClick: () => $router.push(ROUTES.ADMIN.ROLE_CREATE),
      }"
    />

    <SearchToolbar v-model="searchQuery" placeholder="Search roles..." />

    <DataTable
      :columns="columns"
      :data="filteredRoles"
      :total="total"
      :page="1"
      :per-page="10"
      :loading="pending"
    >
      <template #title>Role list</template>
      <template #subtitle>Assign permissions per role.</template>
      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.ROLE_EDIT(row.id)"
          @delete="openDeleteDialog(row)"
          show-delete
        />
      </template>
      <template #empty>
        <div class="text-sm text-slate-500">
          No roles found. Try adjusting your search.
        </div>
      </template>
    </DataTable>

    <ConfirmDialog
      :visible="showDeleteDialog"
      title="Delete Role"
      :message="`Are you sure you want to delete the '${deleteTarget?.name}' role? This action cannot be undone.`"
      confirm-label="Delete"
      cancel-label="Cancel"
      :loading="deleteLoading"
      danger
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      @update:visible="(v) => !v && cancelDelete()"
    />
  </div>
</template>
