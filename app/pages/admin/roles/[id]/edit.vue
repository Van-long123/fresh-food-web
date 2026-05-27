<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import { ROUTES } from "~/constants/routes";
import { useAdminRoleDetailQuery } from "~/queries/role/useAdminRoleDetailQuery";
import { useUpdateAdminRole } from "~/mutations/role/useUpdateAdminRole";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Chỉnh sửa vai trò - Quản trị SmartFood",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const roleId = ref(route.params.id as string);
const {
  data: role,
  isLoading,
  isError,
  error,
} = useAdminRoleDetailQuery(roleId);
const { mutate: updateRole, isPending: isSubmitting } = useUpdateAdminRole();

const errors = ref<Record<string, string>>({});

const moduleDefs = [
  { key: "dashboard", label: "Tổng quan" },
  { key: "articles", label: "Bài viết" },
  { key: "products", label: "Sản phẩm" },
  { key: "categories", label: "Danh mục" },
  { key: "orders", label: "Đơn hàng" },
  { key: "users", label: "Người dùng" },
  { key: "vouchers", label: "Mã giảm giá" },
  { key: "refund_requests", label: "Yêu cầu hoàn tiền" },
  { key: "reviews", label: "Đánh giá" },
  { key: "payments", label: "Thanh toán" },
  { key: "settings", label: "Cài đặt" },
];

const permissions = ["view", "create", "edit", "delete"] as const;
type PermissionType = (typeof permissions)[number];

/**
 * Kiểm tra xem một quyền cụ thể (ví dụ: tạo, sửa, xóa) có được phép áp dụng cho module hay không.
 * Riêng module "dashboard" chỉ cho phép quyền "view", các module khác cho phép đầy đủ quyền.
 */
const isPermAllowed = (moduleKey: string, perm: PermissionType) => {
  return moduleKey !== "dashboard" || perm === "view";
};

/**
 * Lấy danh sách các quyền hợp lệ của một module (đã lọc bỏ các quyền không được phép qua isPermAllowed).
 */
const getEnabledPermissions = (moduleKey: string) => {
  return permissions.filter((perm) => isPermAllowed(moduleKey, perm));
};

const permMatrix = reactive<Record<string, PermissionType[]>>({});
moduleDefs.forEach((mod) => {
  permMatrix[mod.key] = [];
});

const permissionLabels: Record<PermissionType, string> = {
  view: "Xem",
  create: "Tạo mới",
  edit: "Chỉnh sửa",
  delete: "Xóa",
};

const form = reactive({
  title: "",
  description: "",
});

const formInitialized = ref(false);

const isNotFound = computed(
  () => isError.value && (error.value as any)?.response?.status === 404,
);

watchEffect(() => {
  if (!role.value || formInitialized.value) return;

  form.title = role.value.title ?? "";
  form.description = role.value.description ?? "";

  moduleDefs.forEach((mod) => {
    permMatrix[mod.key] = [];
  });

  (role.value.permissions || []).forEach((pStr) => {
    const parts = pStr.split(".");
    if (parts.length === 2) {
      const modKey = parts[0];
      const permAction = parts[1] as PermissionType;
      const matchingMod = moduleDefs.find((m) => m.key === modKey);
      if (matchingMod && permissions.includes(permAction)) {
        if (!permMatrix[matchingMod.key].includes(permAction)) {
          permMatrix[matchingMod.key].push(permAction);
        }
      }
    }
  });

  formInitialized.value = true;
});

const togglePermission = (moduleKey: string, perm: PermissionType) => {
  if (!isPermAllowed(moduleKey, perm)) return;

  const current = permMatrix[moduleKey] || [];
  if (current.includes(perm)) {
    permMatrix[moduleKey] = current.filter((p) => p !== perm);
  } else {
    permMatrix[moduleKey] = [...current, perm];
  }
};

const toggleRow = (moduleKey: string) => {
  const enabledPerms = getEnabledPermissions(moduleKey);
  const current = permMatrix[moduleKey] || [];
  if (current.length === enabledPerms.length) {
    permMatrix[moduleKey] = [];
  } else {
    permMatrix[moduleKey] = [...enabledPerms];
  }
};

const toggleColumn = (perm: PermissionType) => {
  const modules = moduleDefs.filter((mod) => isPermAllowed(mod.key, perm));
  const allChecked = modules.every((mod) =>
    (permMatrix[mod.key] || []).includes(perm),
  );
  modules.forEach((mod) => {
    const current = permMatrix[mod.key] || [];
    if (allChecked) {
      permMatrix[mod.key] = current.filter((p) => p !== perm);
    } else if (!current.includes(perm)) {
      permMatrix[mod.key] = [...current, perm];
    }
  });
};

const isRowChecked = (moduleKey: string) => {
  const enabledPerms = getEnabledPermissions(moduleKey);
  const current = permMatrix[moduleKey] || [];
  return enabledPerms.length > 0 && current.length === enabledPerms.length;
};

const isColumnChecked = (perm: PermissionType) => {
  const modules = moduleDefs.filter((mod) => isPermAllowed(mod.key, perm));
  return modules.every((mod) => (permMatrix[mod.key] || []).includes(perm));
};

const permissionPreview = computed(() => {
  const preview: Record<string, string> = {};
  moduleDefs.forEach((mod) => {
    const current = permMatrix[mod.key] || [];
    preview[mod.key] = current.length
      ? current.map((p) => permissionLabels[p]).join(", ")
      : "Chưa chọn quyền";
  });
  return preview;
});

const validateForm = () => {
  const errs: Record<string, string> = {};
  if (!form.title.trim()) errs.title = "Vui lòng nhập tên vai trò.";
  if (!form.description.trim())
    errs.description = "Vui lòng nhập mô tả vai trò.";

  errors.value = errs;
  return Object.keys(errs).length === 0;
};

const submitForm = () => {
  if (isNotFound.value || !role.value) return;
  if (!validateForm()) {
    toast.add({
      severity: "error",
      summary: "Lỗi kiểm tra dữ liệu",
      detail: "Vui lòng sửa các lỗi trước khi lưu.",
      life: 3000,
    });
    return;
  }

  const flatPermissions: string[] = [];
  moduleDefs.forEach((mod) => {
    const perms = (permMatrix[mod.key] || []).filter((p) =>
      isPermAllowed(mod.key, p),
    );
    perms.forEach((p) => {
      flatPermissions.push(`${mod.key}.${p}`);
    });
  });

  updateRole(
    {
      id: roleId.value,
      payload: {
        title: form.title,
        description: form.description,
        permissions: flatPermissions,
      },
    },
    {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Đã cập nhật vai trò",
          detail: `Đã cập nhật vai trò bảo mật '${form.title}'`,
          life: 3000,
        });

        // router.push(ROUTES.ADMIN.ROLES);
      },
      onError: (error: any) => {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail:
            error?.response?.data?.message ??
            "Không thể cập nhật vai trò bảo mật.",
          life: 3000,
        });
      },
    },
  );
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <div
      v-if="isLoading"
      class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex items-center gap-2 text-slate-500">
        <i class="pi pi-spin pi-spinner"></i>
        <span>Đang tải dữ liệu vai trò...</span>
      </div>
    </div>

    <div
      v-else-if="isNotFound"
      class="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20"
    >
      <h2 class="text-lg font-semibold text-red-800 dark:text-red-300">
        Không tìm thấy vai trò bảo mật
      </h2>
      <p class="text-sm text-red-600 dark:text-red-400 mt-2">
        Nhóm chính sách bảo mật bạn đang chỉnh sửa không tồn tại hoặc đã bị xóa.
      </p>
      <button
        class="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        @click="router.push(ROUTES.ADMIN.ROLES)"
      >
        Quay lại vai trò
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
              Quản lý bảo mật
            </p>
            <h1
              class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
            >
              Chỉnh sửa vai trò bảo mật
            </h1>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Thiết lập và điều chỉnh phạm vi quyền cho nhóm này.
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
              Thông tin vai trò
            </h2>
            <div class="grid gap-4 mt-4">
              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Tên vai trò *</label
                >
                <InputText v-model="form.title" class="mt-2 w-full" />
                <p v-if="errors.title" class="mt-1 text-xs text-red-500">
                  {{ errors.title }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Mô tả *</label
                >
                <Textarea
                  v-model="form.description"
                  rows="3"
                  class="mt-2 w-full"
                />
                <p v-if="errors.description" class="mt-1 text-xs text-red-500">
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
                <h2
                  class="text-lg font-semibold text-slate-900 dark:text-white"
                >
                  Ma trận phân quyền theo module
                </h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-350">
                  Thiết lập mức truy cập cho từng module nghiệp vụ.
                </p>
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
                    <th class="px-4 py-3 text-left">Tên module</th>
                    <th
                      v-for="perm in permissions"
                      :key="perm"
                      class="px-4 py-3 text-left"
                    >
                      <label
                        class="flex items-center gap-2 cursor-pointer select-none"
                      >
                        <Checkbox
                          :binary="true"
                          :modelValue="isColumnChecked(perm)"
                          @update:modelValue="toggleColumn(perm)"
                        />
                        <span class="capitalize">{{
                          permissionLabels[perm]
                        }}</span>
                      </label>
                    </th>
                    <th class="px-4 py-3 text-left">Chuyển toàn bộ</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr
                    v-for="mod in moduleDefs"
                    :key="mod.key"
                    class="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td
                      class="px-4 py-3 font-semibold text-slate-900 dark:text-white"
                    >
                      {{ mod.label }}
                    </td>
                    <td
                      v-for="perm in permissions"
                      :key="perm"
                      class="px-4 py-3"
                    >
                      <Checkbox
                        :binary="true"
                        :modelValue="(permMatrix[mod.key] || []).includes(perm)"
                        :disabled="!isPermAllowed(mod.key, perm)"
                        @update:modelValue="togglePermission(mod.key, perm)"
                      />
                    </td>
                    <td class="px-4 py-3">
                      <button
                        type="button"
                        class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-655 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        @click="toggleRow(mod.key)"
                      >
                        {{ isRowChecked(mod.key) ? "Bỏ chọn" : "Chọn tất cả" }}
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
                Quyền đang hoạt động
              </h2>
              <span
                class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                >Xem trực tiếp</span
              >
            </div>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-350">
              Xem trước phạm vi quyền đang gán cho vai trò này.
            </p>

            <ul
              class="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300"
            >
              <li
                v-for="mod in moduleDefs"
                :key="mod.key"
                class="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div class="font-bold text-slate-900 dark:text-white">
                  {{ mod.label }}
                </div>
                <div
                  class="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono"
                >
                  {{ permissionPreview[mod.key] }}
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
