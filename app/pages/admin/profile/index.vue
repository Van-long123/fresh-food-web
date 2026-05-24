<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import ImageUploader from "~/components/admin/ImageUploader.vue";
import { ROUTES } from "~/constants/routes";
import {
  isValidPhone,
  PHONE_FORMAT_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  isValidPassword,
} from "~/utils/authFormUtils";
import { useAuthStore } from "~/stores/useAuthStore";
import { usePasswordStrength } from "~/composables/auth/usePasswordStrength";
import { useAdminProfileMutation } from "~/mutations/user/useAdminProfileMutation";
import { useAdminChangePasswordMutation } from "~/mutations/user/useAdminChangePasswordMutation";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Hồ sơ cá nhân - Quản trị SmartFood",
});

type ProfileFormState = {
  avatar: string | File | "";
  displayName: string;
  email: string;
  phone: string;
  gender: string;
  birthday: Date | null;
  address: string;
};

type SecurityFormState = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
watch(authStore, (newVal) => {
  console.log("🚀 ~ authStore changed:", newVal);
});
const { isPending: isProfilePending, mutateAsync: mutateProfileAsync } =
  useAdminProfileMutation();
const {
  isPending: isChangePasswordPending,
  mutateAsync: mutateChangePasswordAsync,
} = useAdminChangePasswordMutation();

const genderOptions = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
  { label: "Khác", value: "Khác" },
];

const profileForm = reactive<ProfileFormState>({
  avatar: "",
  displayName: "",
  email: "",
  phone: "",
  gender: "",
  birthday: null,
  address: "",
});

const profileErrors = reactive({
  displayName: "",
  phone: "",
});

const securityForm = reactive<SecurityFormState>({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const securityErrors = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const activeTab = ref(route.query.tab === "security" ? 1 : 0);

const newPasswordRef = computed(() => securityForm.newPassword);
const { rules, strength } = usePasswordStrength(newPasswordRef);

const profileTitle = computed(
  () => authStore.user?.fullname || "Quản trị viên",
);
const profileAvatar = computed(() => authStore.user?.avatar || "");
const profileInitial = computed(() => {
  const name = authStore.user?.fullname?.trim();
  if (!name) return "A";
  const parts = name.split(/\s+/);
  return (
    parts[parts.length - 1]?.charAt(0).toUpperCase() ||
    name.charAt(0).toUpperCase()
  );
});

const formatDateToInput = (value?: string) => {
  if (!value) return null;
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateToPayload = (value: Date | null) => {
  if (!value) return "";
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const syncProfileForm = () => {
  const user = authStore.user;
  console.log("🚀 ~ syncProfileForm ~ user:", user);
  if (!user) return;

  profileForm.avatar = user.avatar || "";
  profileForm.displayName = user.fullname || "";
  profileForm.email = user.email || "";
  profileForm.phone = user.phone || "";
  profileForm.gender = user.gender || "";
  profileForm.birthday = formatDateToInput(user.birthday);
  profileForm.address = user.address || "";
};

watch(
  () => authStore.user,
  () => {
    syncProfileForm();
  },
  { immediate: true, deep: true },
);

watch(
  () => route.query.tab,
  (tab) => {
    activeTab.value = tab === "security" ? 1 : 0;
  },
  { immediate: true },
);

watch(activeTab, async (nextIndex) => {
  const nextTab = nextIndex === 1 ? "security" : undefined;
  if ((route.query.tab || undefined) === nextTab) return;

  const nextQuery: Record<string, string | string[]> = { ...route.query };
  if (nextTab) {
    nextQuery.tab = nextTab;
  } else {
    delete nextQuery.tab;
  }

  await router.replace({ query: nextQuery });
});

const clearProfileErrors = () => {
  profileErrors.displayName = "";
  profileErrors.phone = "";
};

const clearSecurityErrors = () => {
  securityErrors.oldPassword = "";
  securityErrors.newPassword = "";
  securityErrors.confirmPassword = "";
};

const validateProfileForm = () => {
  clearProfileErrors();

  let valid = true;
  if (!profileForm.displayName.trim()) {
    profileErrors.displayName = "Họ tên không được để trống.";
    valid = false;
  }

  if (!profileForm.phone.trim()) {
    profileErrors.phone = "Số điện thoại không được để trống.";
    valid = false;
  } else if (!isValidPhone(profileForm.phone)) {
    profileErrors.phone = PHONE_FORMAT_MESSAGE;
    valid = false;
  }

  return valid;
};

const validateSecurityForm = () => {
  clearSecurityErrors();

  let valid = true;
  if (!securityForm.oldPassword) {
    securityErrors.oldPassword = "Vui lòng nhập mật khẩu hiện tại.";
    valid = false;
  }

  if (!securityForm.newPassword) {
    securityErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
    valid = false;
  } else if (!isValidPassword(securityForm.newPassword)) {
    securityErrors.newPassword = PASSWORD_RULE_MESSAGE;
    valid = false;
  }

  if (!securityForm.confirmPassword) {
    securityErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới.";
    valid = false;
  } else if (securityForm.confirmPassword !== securityForm.newPassword) {
    securityErrors.confirmPassword = "Xác nhận mật khẩu không khớp.";
    valid = false;
  }

  return valid;
};

const buildProfilePayload = () => {
  const payload = new FormData();
  payload.append("displayName", profileForm.displayName.trim());
  payload.append("phone", profileForm.phone.trim());
  payload.append("gender", profileForm.gender || "");
  payload.append("address", profileForm.address.trim());

  const birthday = formatDateToPayload(profileForm.birthday);
  if (birthday) {
    payload.append("birthday", birthday);
  }

  if (profileForm.avatar instanceof File) {
    payload.append("avatar", profileForm.avatar, profileForm.avatar.name);
  } else if (profileForm.avatar === "") {
    payload.append("avatar", "");
  }

  console.log("🚀 ~ buildProfilePayload ~ payload:", payload);
  return payload;
};

const resetSecurityForm = () => {
  securityForm.oldPassword = "";
  securityForm.newPassword = "";
  securityForm.confirmPassword = "";
  clearSecurityErrors();
};

const handleProfileSubmit = async () => {
  if (!validateProfileForm()) return;

  try {
    const response = await mutateProfileAsync(buildProfilePayload());
    authStore.patchUserFromApi(response);
    syncProfileForm();
    toast.add({
      severity: "success",
      summary: "Thành công",
      detail: "Cập nhật hồ sơ cá nhân thành công.",
      life: 3000,
    });
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: error?.response?.data?.message || "Không thể cập nhật hồ sơ.",
      life: 3500,
    });
  }
};

const handleChangePassword = async () => {
  if (!validateSecurityForm()) return;

  try {
    await mutateChangePasswordAsync({
      oldPassword: securityForm.oldPassword,
      newPassword: securityForm.newPassword,
    });

    resetSecurityForm();
    toast.add({
      severity: "success",
      summary: "Thành công",
      detail: "Đổi mật khẩu thành công.",
      life: 3000,
    });
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: error?.response?.data?.message || "Không thể đổi mật khẩu.",
      life: 3500,
    });
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-6 text-slate-800 lg:px-6">
    <div class="mx-auto max-w-7xl space-y-6">
      <section
        class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <div
          class="bg-linear-to-r from-orange-50 via-amber-50 to-white px-6 py-6 sm:px-8"
        >
          <div
            class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-center gap-4">
              <Avatar
                v-if="profileAvatar"
                :image="profileAvatar"
                shape="circle"
                size="xlarge"
                class="border border-slate-200 shadow-sm"
              />
              <Avatar
                v-else
                :label="profileInitial"
                shape="circle"
                size="xlarge"
                class="bg-orange-100 text-orange-600 border border-orange-200 shadow-sm"
              />

              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500"
                >
                  Hồ sơ quản trị
                </p>
                <h1 class="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {{ profileTitle }}
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                  Quản lý thông tin cá nhân và thay đổi mật khẩu của tài khoản
                  đang đăng nhập.
                </p>
              </div>
            </div>

            <Button
              label="Đổi mật khẩu"
              icon="pi pi-shield"
              severity="secondary"
              outlined
              @click="activeTab = 1"
            />
          </div>
        </div>
      </section>

      <TabView v-model:activeIndex="activeTab" class="profile-tabs">
        <TabPanel header="Thông tin chung">
          <section class="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div
              class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div class="flex items-center gap-3">
                <Avatar
                  v-if="profileAvatar"
                  :image="profileAvatar"
                  shape="circle"
                  size="large"
                />
                <Avatar
                  v-else
                  :label="profileInitial"
                  shape="circle"
                  size="large"
                  class="bg-orange-100 text-orange-600"
                />

                <div>
                  <p class="font-semibold text-slate-900">{{ profileTitle }}</p>
                  <p class="text-sm text-slate-500">Ảnh đại diện tài khoản</p>
                </div>
              </div>

              <div class="mt-5">
                <ImageUploader
                  v-model="profileForm.avatar"
                  :max-size="5"
                  accept="image/*"
                />
              </div>

              <p class="mt-4 text-xs leading-5 text-slate-500">
                Chỉ chấp nhận ảnh mới khi người dùng chủ động chọn file. Email,
                vai trò và trạng thái tài khoản không thể chỉnh sửa ở màn hình
                này.
              </p>
            </div>

            <div
              class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <form
                class="grid gap-5 md:grid-cols-2"
                @submit.prevent="handleProfileSubmit"
              >
                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-semibold text-slate-700"
                    >Họ tên</label
                  >
                  <InputText
                    v-model="profileForm.displayName"
                    class="w-full"
                    :invalid="!!profileErrors.displayName"
                    placeholder="Nhập họ tên"
                  />
                  <small
                    v-if="profileErrors.displayName"
                    class="mt-1 block text-xs text-red-500"
                    >{{ profileErrors.displayName }}</small
                  >
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-slate-700"
                    >Email</label
                  >
                  <InputText
                    v-model="profileForm.email"
                    class="w-full bg-slate-100"
                    disabled
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-slate-700"
                    >Số điện thoại</label
                  >
                  <InputText
                    v-model="profileForm.phone"
                    class="w-full"
                    :invalid="!!profileErrors.phone"
                    placeholder="Nhập số điện thoại"
                  />
                  <small
                    v-if="profileErrors.phone"
                    class="mt-1 block text-xs text-red-500"
                    >{{ profileErrors.phone }}</small
                  >
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-slate-700"
                    >Giới tính</label
                  >
                  <Dropdown
                    v-model="profileForm.gender"
                    :options="genderOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Chọn giới tính"
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-slate-700"
                    >Ngày sinh</label
                  >
                  <DatePicker
                    v-model="profileForm.birthday"
                    class="w-full"
                    show-icon
                    icon-display="input"
                    date-format="dd/mm/yy"
                    placeholder="Chọn ngày sinh"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-semibold text-slate-700"
                    >Địa chỉ</label
                  >
                  <InputText
                    v-model="profileForm.address"
                    class="w-full"
                    placeholder="Nhập địa chỉ"
                  />
                </div>

                <div
                  class="md:col-span-2 flex flex-wrap items-center justify-end gap-3 pt-2"
                >
                  <Button
                    type="button"
                    label="Khôi phục"
                    icon="pi pi-undo"
                    severity="secondary"
                    outlined
                    @click="syncProfileForm()"
                  />
                  <Button
                    type="submit"
                    :label="isProfilePending ? 'Đang lưu...' : 'Lưu thay đổi'"
                    icon="pi pi-check"
                    :loading="isProfilePending"
                  />
                </div>
              </form>
            </div>
          </section>
        </TabPanel>

        <TabPanel header="Bảo mật">
          <section
            class="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <form class="grid gap-5" @submit.prevent="handleChangePassword">
              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700"
                  >Mật khẩu hiện tại</label
                >
                <Password
                  v-model="securityForm.oldPassword"
                  class="w-full"
                  input-class="w-full"
                  placeholder="Nhập mật khẩu hiện tại"
                  toggle-mask
                  :feedback="false"
                  :invalid="!!securityErrors.oldPassword"
                />
                <small
                  v-if="securityErrors.oldPassword"
                  class="mt-1 block text-xs text-red-500"
                  >{{ securityErrors.oldPassword }}</small
                >
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700"
                  >Mật khẩu mới</label
                >
                <Password
                  v-model="securityForm.newPassword"
                  class="w-full"
                  input-class="w-full"
                  placeholder="Mật khẩu mới"
                  :toggle-mask="true"
                  :feedback="false"
                  :invalid="!!securityErrors.newPassword"
                />
                <small
                  v-if="securityErrors.newPassword"
                  class="mt-1 block text-xs text-red-500"
                  >{{ securityErrors.newPassword }}</small
                >

                <div
                  v-if="securityForm.newPassword"
                  class="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div class="mb-2 flex gap-1.5">
                    <span
                      v-for="index in 4"
                      :key="index"
                      class="h-2 flex-1 rounded-full bg-slate-200 transition-colors"
                      :class="{ 'bg-orange-500!': strength.score >= index }"
                    />
                  </div>
                  <p
                    class="text-xs font-semibold"
                    :style="{ color: strength.color }"
                  >
                    {{ strength.label }}
                  </p>
                  <div class="mt-3 grid gap-2 sm:grid-cols-2">
                    <div
                      v-for="rule in rules"
                      :key="rule.label"
                      class="flex items-center gap-2 text-xs text-slate-500"
                      :class="{ 'text-emerald-600!': rule.met }"
                    >
                      <i
                        :class="
                          rule.met ? 'pi pi-check-circle' : 'pi pi-circle-off'
                        "
                      />
                      {{ rule.label }}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700"
                  >Xác nhận mật khẩu mới</label
                >
                <Password
                  v-model="securityForm.confirmPassword"
                  class="w-full"
                  input-class="w-full"
                  placeholder="Nhập lại mật khẩu mới"
                  toggle-mask
                  :feedback="false"
                  :invalid="!!securityErrors.confirmPassword"
                />
                <small
                  v-if="securityErrors.confirmPassword"
                  class="mt-1 block text-xs text-red-500"
                  >{{ securityErrors.confirmPassword }}</small
                >
              </div>

              <div
                class="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-800"
              >
                Mật khẩu mới phải dài tối thiểu 8 ký tự, có 1 chữ hoa, 1 số và 1
                ký tự đặc biệt.
              </div>

              <div class="flex flex-wrap items-center justify-end gap-3">
                <Button
                  type="button"
                  label="Làm mới"
                  icon="pi pi-refresh"
                  severity="secondary"
                  outlined
                  @click="resetSecurityForm"
                />
                <Button
                  type="submit"
                  :label="
                    isChangePasswordPending ? 'Đang đổi...' : 'Đổi mật khẩu'
                  "
                  icon="pi pi-lock"
                  :loading="isChangePasswordPending"
                />
              </div>
            </form>
          </section>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>
