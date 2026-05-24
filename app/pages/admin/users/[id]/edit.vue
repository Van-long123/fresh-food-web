<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import ToggleSwitch from "primevue/toggleswitch";
import { ROUTES } from "~/constants/routes";
import ImageUploader from "~/components/admin/ImageUploader.vue";
import { useToast } from "primevue/usetoast";
import { useAdminRolesQuery } from "~/queries/role/useAdminRolesQuery";
import { useAdminUserDetailQuery } from "~/queries/user/useAdminUserDetailQuery";
import { useUpdateAdminUser } from "~/mutations/user/useUpdateAdminUser";
import { buildUpdateAdminUserPayload } from "~/services/admin/user.service";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Chỉnh sửa người dùng - Quản trị SmartFood",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();
const updateUserMutation = useUpdateAdminUser();
const { data: rolesData } = useAdminRolesQuery({ page: 1, limit: 200 });
const roles = computed(() => rolesData.value?.data || []);

const userId = route.params.id as string;
const isSubmitting = ref(false);
const errors = ref<Record<string, string>>({});
const isNotFound = ref(false);

const accountRoleOptions = [
  { label: "Khách hàng", value: "client" },
  { label: "Quản trị viên", value: "admin" },
];

const adminRoleOptions = computed(() => {
  return roles.value.map((role) => ({
    label: role.title,
    value: role._id,
  }));
});

const form = reactive({
  displayName: "",
  email: "",
  phone: "",
  avatar: "",
  role: "client",
  roleId: "",
  address: "",
  gender: "Nam",
  birthday: "",
  isActive: true,
});

const { data: userData, isError } = useAdminUserDetailQuery(userId);

watch(
  userData,
  (user) => {
    if (!user) return;
    Object.assign(form, {
      displayName: user.displayName || "",
      email: user.email || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
      role: user.role || "client",
      roleId: user.roleId || "",
      address: user.address || "",
      gender: user.gender || "Nam",
      birthday: user.birthday || "1995-01-01",
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
  },
  { immediate: true },
);

watch(
  [roles, () => form.role],
  ([nextRoles, roleValue]) => {
    if (roleValue !== "admin") {
      form.roleId = "";
      return;
    }

    if (!form.roleId && nextRoles.length) {
      const firstRole = nextRoles.find((role) => role.isSystem) || nextRoles[0];
      form.roleId = firstRole?._id || "";
    }
  },
  { immediate: true },
);

watch(
  () => isError.value,
  (value) => {
    if (value) isNotFound.value = true;
  },
  { immediate: true },
);

const validateForm = () => {
  const errs: Record<string, string> = {};
  if (!form.displayName.trim()) errs.displayName = "Vui lòng nhập họ và tên.";
  if (!form.email.trim()) {
    errs.email = "Vui lòng nhập email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errs.email = "Định dạng email không hợp lệ.";
  }
  if (!form.phone.trim()) {
    errs.phone = "Vui lòng nhập số điện thoại.";
  } else if (!/^\d{9,11}$/.test(form.phone.replace(/[^0-9]/g, ""))) {
    errs.phone = "Số điện thoại phải từ 9 đến 11 chữ số.";
  }
  if (!form.role) errs.role = "Vui lòng chọn loại tài khoản.";
  if (form.role === "admin" && !form.roleId) {
    errs.roleId = "Vui lòng chọn vai trò quản trị.";
  }
  if (!form.birthday) errs.birthday = "Vui lòng chọn ngày sinh.";

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
  try {
    const payload = buildUpdateAdminUserPayload({
      displayName: form.displayName,
      email: form.email,
      phone: form.phone,
      avatar: form.avatar,
      role: form.role as "admin" | "client",
      roleId: form.role === "admin" ? form.roleId || null : null,
      address: form.address,
      gender: form.gender,
      birthday: form.birthday,
      isActive: form.isActive,
    });

    await updateUserMutation.mutateAsync({ id: userId, payload });

    toast.add({
      severity: "success",
      summary: "Đã cập nhật người dùng",
      detail: `Đã cập nhật thông tin cho ${form.displayName}`,
      life: 3000,
    });

    router.push(ROUTES.ADMIN.USERS);
  } catch (error: unknown) {
    const errorMessage =
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { data?: { message?: string } } })
        .response === "object"
        ? (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message
        : undefined;
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: errorMessage || "Không thể cập nhật thông tin người dùng.",
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
        Không tìm thấy người dùng
      </h2>
      <p class="text-sm text-red-600 dark:text-red-400 mt-2">
        Người dùng bạn đang chỉnh sửa không tồn tại hoặc đã bị xóa.
      </p>
      <button
        class="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        @click="router.push(ROUTES.ADMIN.USERS)"
      >
        Quay lại người dùng
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
              Chỉnh sửa người dùng
            </h1>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Cập nhật hồ sơ tài khoản, giới tính và giới hạn quyền truy cập.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
              :disabled="isSubmitting"
              @click="router.back()"
            >
              Hủy
            </button>
            <button
              class="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-50"
              :disabled="isSubmitting"
              @click="submitForm"
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
              Thông tin định danh
            </h2>
            <div class="grid gap-4 mt-4 md:grid-cols-2">
              <div class="md:col-span-2">
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Họ và tên *</label
                >
                <InputText v-model="form.displayName" class="mt-2 w-full" />
                <p v-if="errors.displayName" class="mt-1 text-xs text-red-500">
                  {{ errors.displayName }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Email *</label
                >
                <InputText
                  v-model="form.email"
                  class="mt-2 w-full font-mono"
                  disabled
                />
                <p v-if="errors.email" class="mt-1 text-xs text-red-500">
                  {{ errors.email }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Số điện thoại *</label
                >
                <InputText v-model="form.phone" class="mt-2 w-full font-mono" />
                <p v-if="errors.phone" class="mt-1 text-xs text-red-500">
                  {{ errors.phone }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Giới tính</label
                >
                <Dropdown
                  v-model="form.gender"
                  class="mt-2 w-full"
                  :options="['Nam', 'Nữ', 'Khác']"
                />
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Ngày sinh *</label
                >
                <input
                  v-model="form.birthday"
                  type="date"
                  class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
                <p v-if="errors.birthday" class="mt-1 text-xs text-red-500">
                  {{ errors.birthday }}
                </p>
              </div>

              <div class="md:col-span-2">
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Địa chỉ sinh sống / giao hàng</label
                >
                <Textarea v-model="form.address" rows="2" class="mt-2 w-full" />
              </div>
            </div>
          </section>

          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Bảo mật & phân quyền
            </h2>
            <div class="grid gap-4 mt-4 md:grid-cols-2">
              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Loại tài khoản *</label
                >
                <Dropdown
                  v-model="form.role"
                  class="mt-2 w-full"
                  :options="accountRoleOptions"
                  option-label="label"
                  option-value="value"
                />
                <p v-if="errors.role" class="mt-1 text-xs text-red-500">
                  {{ errors.role }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Vai trò quản trị</label
                >
                <Dropdown
                  v-model="form.roleId"
                  class="mt-2 w-full"
                  :options="adminRoleOptions"
                  option-label="label"
                  option-value="value"
                  :disabled="form.role !== 'admin'"
                />
                <p v-if="errors.roleId" class="mt-1 text-xs text-red-500">
                  {{ errors.roleId }}
                </p>
              </div>

              <div
                class="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800"
              >
                <div>
                  <p
                    class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Tài khoản đang hoạt động
                  </p>
                  <p class="text-xs text-slate-400">
                    Người dùng bị tạm khóa không thể đăng nhập hoặc thanh toán.
                  </p>
                </div>
                <ToggleSwitch v-model="form.isActive" />
              </div>
            </div>
          </section>
        </div>

        <div class="space-y-6">
          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Ảnh đại diện
            </h2>
            <div class="mt-4">
              <ImageUploader v-model="form.avatar" />
            </div>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
