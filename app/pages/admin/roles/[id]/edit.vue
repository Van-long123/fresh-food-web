<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import { ROUTES } from "~/constants/routes";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const route = useRoute();
const router = useRouter();
const store = useAdminMockStore();
const toast = useToast();

const roleId = route.params.id as string;
const isSubmitting = ref(false);
const errors = ref<Record<string, string>>({});
const isNotFound = ref(false);

const modules = [
  "Bài viết",
  "Sản phẩm",
  "Danh mục",
  "Đơn hàng",
  "Người dùng",
  "Mã giảm giá",
  "Đánh giá",
  "Thanh toán",
  "Cài đặt",
];

const permissions = ["view", "create", "edit", "delete"] as const;
type PermissionType = (typeof permissions)[number];

const permMatrix = reactive<Record<string, PermissionType[]>>({});
modules.forEach((mod) => {
  permMatrix[mod] = [];
});

const form = reactive({
  title: "",
  description: "",
});

const role = store.roles.find((r) => r.id === roleId);
if (role) {
  form.title = role.title;
  form.description = role.description;

  // Populate permMatrix from role.permissions e.g. ['articles.view', 'products.create']
  role.permissions.forEach((pStr) => {
    const parts = pStr.split(".");
    if (parts.length === 2) {
      const modLower = parts[0];
      const permAction = parts[1] as PermissionType;

      // Find matching module case-insensitive
      const matchingMod = modules.find((m) => m.toLowerCase() === modLower);
      if (matchingMod && permissions.includes(permAction)) {
        if (!permMatrix[matchingMod].includes(permAction)) {
          permMatrix[matchingMod].push(permAction);
        }
      }
    }
  });
} else {
  isNotFound.value = true;
}

const togglePermission = (moduleName: string, perm: PermissionType) => {
  const current = permMatrix[moduleName] || [];
  if (current.includes(perm)) {
    permMatrix[moduleName] = current.filter((p) => p !== perm);
  } else {
    permMatrix[moduleName] = [...current, perm];
  }
};

const toggleRow = (moduleName: string) => {
  const current = permMatrix[moduleName] || [];
  if (current.length === permissions.length) {
    permMatrix[moduleName] = [];
  } else {
    permMatrix[moduleName] = [...permissions];
  }
};

const toggleColumn = (perm: PermissionType) => {
  const allChecked = modules.every((mod) =>
    (permMatrix[mod] || []).includes(perm),
  );
  modules.forEach((mod) => {
    const current = permMatrix[mod] || [];
    if (allChecked) {
      permMatrix[mod] = current.filter((p) => p !== perm);
    } else if (!current.includes(perm)) {
      permMatrix[mod] = [...current, perm];
    }
  });
};

const isRowChecked = (moduleName: string) => {
  const current = permMatrix[moduleName] || [];
  return current.length === permissions.length;
};

const isColumnChecked = (perm: PermissionType) => {
  return modules.every((mod) => (permMatrix[mod] || []).includes(perm));
};

const validateForm = () => {
  const errs: Record<string, string> = {};
  if (!form.title.trim()) errs.title = "Vui lòng nhập tên vai trò.";
  if (!form.description.trim())
    errs.description = "Vui lòng nhập mô tả vai trò.";

  errors.value = errs;
  return Object.keys(errs).length === 0;
};

const submitForm = async () => {
  if (isNotFound.value) return;
  if (!validateForm()) {
    toast.add({
      severity: "error",
      summary: "Lỗi kiểm tra dữ liệu",
      detail: "Vui lòng sửa các lỗi trước khi lưu.",
      life: 3000,
    });
    return;
  }

  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));

  try {
    // Flatten matrix of { Articles: ['view', 'create'] } -> ['articles.view', 'articles.create']
    const flatPermissions: string[] = [];
    modules.forEach((mod) => {
      const lowerMod = mod.toLowerCase();
      const perms = permMatrix[mod] || [];
      perms.forEach((p) => {
        flatPermissions.push(`${lowerMod}.${p}`);
      });
    });

    store.updateRole(roleId, {
      title: form.title,
      description: form.description,
      permissions: flatPermissions,
    });

    toast.add({
      severity: "success",
      summary: "Đã cập nhật vai trò",
      detail: `Đã cập nhật vai trò bảo mật '${form.title}'`,
      life: 3000,
    });

    router.push(ROUTES.ADMIN.ROLES);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Không thể cập nhật vai trò bảo mật.",
      life: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <div
      v-if="isNotFound"
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
                        <span class="capitalize">{{ perm === 'view' ? 'Xem' : perm === 'create' ? 'Tạo mới' : perm === 'edit' ? 'Chỉnh sửa' : 'Xóa' }}</span>
                      </label>
                    </th>
                    <th class="px-4 py-3 text-left">Chuyển toàn bộ</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr
                    v-for="mod in modules"
                    :key="mod"
                    class="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td
                      class="px-4 py-3 font-semibold text-slate-900 dark:text-white"
                    >
                      {{ mod }}
                    </td>
                    <td
                      v-for="perm in permissions"
                      :key="perm"
                      class="px-4 py-3"
                    >
                      <Checkbox
                        :binary="true"
                        :modelValue="(permMatrix[mod] || []).includes(perm)"
                        @update:modelValue="togglePermission(mod, perm)"
                      />
                    </td>
                    <td class="px-4 py-3">
                      <button
                        type="button"
                        class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-655 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        @click="toggleRow(mod)"
                      >
                        {{ isRowChecked(mod) ? "Bỏ chọn" : "Chọn tất cả" }}
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
                v-for="mod in modules"
                :key="mod"
                class="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div class="font-bold text-slate-900 dark:text-white">
                  {{ mod }}
                </div>
                <div
                  class="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono"
                >
                  {{
                    (permMatrix[mod] || []).map(p => p === 'view' ? 'Xem' : p === 'create' ? 'Tạo mới' : p === 'edit' ? 'Chỉnh sửa' : 'Xóa').join(", ") ||
                    "Chưa chọn quyền"
                  }}
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
