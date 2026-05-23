<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import ToggleSwitch from "primevue/toggleswitch";
import { ROUTES } from "~/constants/routes";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
import ImageUploader from "~/components/admin/ImageUploader.vue";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Tạo người dùng - Quản trị SmartFood",
});

const router = useRouter();
const store = useAdminMockStore();
const toast = useToast();

const isSubmitting = ref(false);
const errors = ref<Record<string, string>>({});

const roleOptions = computed(() => {
  return store.roles.map((r) => ({
    label: r.title,
    value: r.id,
    type: r.id === "role-1" ? "admin" : "client",
  }));
});

const form = reactive({
  displayName: "",
  email: "",
  phone: "",
  avatar: "",
  roleId: "role-2", // default client role
  address: "",
  gender: "Nam",
  birthday: "1995-01-01",
  isActive: true,
});

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
  if (!form.birthday) errs.birthday = "Vui lòng chọn ngày sinh.";

  errors.value = errs;
  return Object.keys(errs).length === 0;
};

const submitForm = async () => {
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
    const selectedRoleObj = store.roles.find((r) => r.id === form.roleId);
    const mappedRole = selectedRoleObj?.id === "role-1" ? "admin" : "client";

    store.createUser({
      displayName: form.displayName,
      email: form.email,
      phone: form.phone,
      avatar:
        form.avatar ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop",
      role: mappedRole,
      roleId: form.roleId,
      address: form.address,
      gender: form.gender,
      birthday: form.birthday,
      isActive: form.isActive,
    });

    toast.add({
      severity: "success",
      summary: "Đã tạo người dùng",
      detail: `Đã tạo tài khoản cho ${form.displayName}`,
      life: 3000,
    });

    router.push(ROUTES.ADMIN.USERS);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Không thể tạo người dùng.",
      life: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
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
            Quản lý bảo mật
          </p>
          <h1
            class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
          >
            Tạo người dùng
          </h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Thêm quản trị viên, nhân sự biên tập hoặc khách hàng mới.
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
            Lưu người dùng
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
              <InputText
                v-model="form.displayName"
                class="mt-2 w-full"
                placeholder="e.g. Nguyễn Văn A"
              />
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
                placeholder="e.g. contact@smartfood.vn"
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
              <InputText
                v-model="form.phone"
                class="mt-2 w-full font-mono"
                placeholder="e.g. 0912345678"
              />
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
                type="date"
                v-model="form.birthday"
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
              <Textarea
                v-model="form.address"
                rows="2"
                class="mt-2 w-full"
                placeholder="Ví dụ: Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội"
              />
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
                >Gán vai trò hệ thống</label
              >
              <Dropdown
                v-model="form.roleId"
                class="mt-2 w-full"
                :options="roleOptions"
                optionLabel="label"
                optionValue="value"
              />
            </div>

            <div
              class="flex items-center justify-between rounded-xl border border-slate-105 p-3 dark:border-slate-800"
            >
              <div>
                <p
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Tài khoản đang hoạt động
                </p>
                <p class="text-xs text-slate-400">
                  Người dùng bị khóa không thể đăng nhập hoặc thanh toán.
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
  </div>
</template>
