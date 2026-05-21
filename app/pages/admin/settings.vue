<script setup lang="ts">
import { reactive, ref } from "vue";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import PageHeader from "~/components/admin/PageHeader.vue";
import ImageUploader from "~/components/admin/ImageUploader.vue";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const store = useAdminMockStore();
const toast = useToast();
const isSubmitting = ref(false);
const errors = ref<Record<string, string>>({});

const form = reactive({
  websiteName: store.settings.websiteName,
  logo: store.settings.logo,
  phone: store.settings.phone,
  email: store.settings.email,
  address: store.settings.address,
  copyright: store.settings.copyright,
});

const validateForm = () => {
  const errs: Record<string, string> = {};
  if (!form.websiteName.trim()) errs.websiteName = "Vui lòng nhập tên website.";
  if (!form.email.trim()) {
    errs.email = "Vui lòng nhập email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errs.email = "Định dạng email không hợp lệ.";
  }
  if (!form.phone.trim()) errs.phone = "Vui lòng nhập số điện thoại.";
  if (!form.address.trim()) errs.address = "Vui lòng nhập địa chỉ.";

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
    store.updateSettings({
      websiteName: form.websiteName,
      logo: form.logo,
      phone: form.phone,
      email: form.email,
      address: form.address,
      copyright: form.copyright,
    });

    toast.add({
      severity: "success",
      summary: "Đã lưu cài đặt",
      detail: "Đã cập nhật thành công cấu hình hệ thống.",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Không thể cập nhật cài đặt.",
      life: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <PageHeader
      title="Cài đặt hệ thống"
      subtitle="Điều chỉnh cấu hình website, nhận diện thương hiệu, metadata và thông tin liên hệ doanh nghiệp."
    />

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Left: Logo Upload -->
      <div class="space-y-6">
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Logo cửa hàng
          </h2>
          <p class="text-xs text-slate-400 mt-1 mb-4">
            Tải lên logo thương hiệu nền trong, độ phân giải cao.
          </p>
          <div>
            <ImageUploader v-model="form.logo" />
          </div>
        </section>
      </div>

      <!-- Right: General Info -->
      <div class="space-y-6 lg:col-span-2">
        <section
          class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Cấu hình chung
          </h2>

          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="md:col-span-2">
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Tên website *</label
                >
                <InputText v-model="form.websiteName" class="mt-2 w-full" />
                <p v-if="errors.websiteName" class="mt-1 text-xs text-red-500">
                  {{ errors.websiteName }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Email hỗ trợ *</label
                >
                <InputText v-model="form.email" class="mt-2 w-full font-mono" />
                <p v-if="errors.email" class="mt-1 text-xs text-red-500">
                  {{ errors.email }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Hotline hỗ trợ *</label
                >
                <InputText v-model="form.phone" class="mt-2 w-full font-mono" />
                <p v-if="errors.phone" class="mt-1 text-xs text-red-500">
                  {{ errors.phone }}
                </p>
              </div>

              <div class="md:col-span-2">
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Địa chỉ trụ sở *</label
                >
                <Textarea v-model="form.address" rows="2" class="mt-2 w-full" />
                <p v-if="errors.address" class="mt-1 text-xs text-red-500">
                  {{ errors.address }}
                </p>
              </div>

              <div class="md:col-span-2">
                <label
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >Dòng bản quyền chân trang</label
                >
                <InputText v-model="form.copyright" class="mt-2 w-full" />
              </div>
            </div>

            <div
              class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end"
            >
              <button
                type="submit"
                class="rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-50"
                :disabled="isSubmitting"
              >
                <i v-if="isSubmitting" class="pi pi-spin pi-spinner mr-2"></i>
                Lưu cài đặt
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>
