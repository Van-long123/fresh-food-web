<script setup lang="ts">
import { computed, ref } from "vue";
import PageHeader from "~/components/admin/PageHeader.vue";
import SearchToolbar from "~/components/admin/SearchToolbar.vue";
import ActionButtons from "~/components/admin/ActionButtons.vue";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import type { DataTableColumn } from "~/components/admin/DataTable.vue";
import { ROUTES } from "~/constants/routes";
import type { AdminUserListItem } from "~/types/admin-user.type";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const searchQuery = ref("");
const deleteTarget = ref<AdminUserListItem | null>(null);
const deleteLoading = ref(false);
const showDeleteDialog = ref(false);

const columns: DataTableColumn[] = [
  { key: "user", label: "User" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "joinedAt", label: "Joined" },
  { key: "actions", label: "Actions" },
];

const { listUsers } = useUsersApi();
const { data, pending } = await useAsyncData("admin-users", () => listUsers());

const users = computed(() => (data.value?.data || []) as AdminUserListItem[]);
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const keyword = searchQuery.value.toLowerCase();
  return users.value.filter((item) =>
    [item.name, item.email, item.role].some((field) =>
      field.toLowerCase().includes(keyword),
    ),
  );
});

const total = computed(() => filteredUsers.value.length);

const openDeleteDialog = (user: AdminUserListItem) => {
  deleteTarget.value = user;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;
  try {
    console.log("Deleting user:", deleteTarget.value.id);
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
      title="Users"
      subtitle="Manage access and permissions."
      :primary-action="{
        label: 'Add user',
        icon: 'pi pi-plus',
        onClick: () => $router.push(ROUTES.ADMIN.USER_CREATE),
      }"
    />

    <SearchToolbar v-model="searchQuery" placeholder="Search users..." />

    <DataTable
      :columns="columns"
      :data="filteredUsers"
      :total="total"
      :page="1"
      :per-page="10"
      :loading="pending"
    >
      <template #title>User list</template>
      <template #subtitle>Keep track of user activity and roles.</template>
      <template #cell-user="{ row }">
        <div class="flex items-center gap-3">
          <img
            :src="row.avatar"
            alt="User"
            class="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p class="font-medium text-slate-900 dark:text-white">
              {{ row.name }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ row.email }}
            </p>
          </div>
        </div>
      </template>
      <template #cell-status="{ value }">
        <StatusBadge :status="value" type="user" />
      </template>
      <template #cell-actions="{ row }">
        <ActionButtons
          :edit-href="ROUTES.ADMIN.USER_EDIT(row.id)"
          @delete="openDeleteDialog(row)"
          show-delete
        />
      </template>
    </DataTable>

    <ConfirmDialog
      :visible="showDeleteDialog"
      title="Delete User"
      :message="`Are you sure you want to delete '${deleteTarget?.name}'? This action cannot be undone.`"
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
