<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import ChangePasswordPage from "~/pages/auth/change-password.vue";
import { ROUTES } from "~/constants/routes";
import { userService } from "~/services/user.service";
import { getProvincesRequest } from "~/api/location.api";
import { isValidPhone } from "~/utils/authFormUtils";
import { useAuthStore } from "~/stores/useAuthStore";
import { useProfile } from "~/composables/useProfile";
import SkProfilePage from "~/components/skeletons/SkProfilePage.vue";

definePageMeta({ middleware: "auth" });

useHead({
  title: "Hồ sơ cá nhân - SmartFood",
  meta: [{ name: "description", content: "Trang Hồ sơ cá nhân của SmartFood" }],
});

const router = useRouter();
const authStore = useAuthStore();
const {
  user,
  isLoading,
  saving,
  saveDone,
  editForm,
  minDate,
  maxDate,
  formattedBirthday,
  avatarPreview,
  userInitial,
  onAvatarChange,
  saveProfile,
  selectGender,
  GENDER_OPTIONS,
} = useProfile();

const menuItems = [
  { key: "profile", icon: "👤", label: "Hồ sơ cá nhân" },
  { key: "orders", icon: "📋", label: "Đơn hàng của tôi" },
  { key: "address", icon: "📍", label: "Địa chỉ" },
  { key: "notify", icon: "🔔", label: "Thông báo" },
  { key: "changePassword", icon: "🔑", label: "Đổi mật khẩu" },
  { key: "logout", icon: "🚪", label: "Đăng xuất" },
] as const;

type MenuKey = (typeof menuItems)[number]["key"];

const mobileTabs = [
  { key: "profile", icon: "👤", label: "Hồ sơ" },
  { key: "orders", icon: "📋", label: "Đơn hàng" },
  { key: "changePassword", icon: "🔑", label: "Mật khẩu" },
  { key: "address", icon: "📍", label: "Địa chỉ" },
] as const satisfies ReadonlyArray<{
  key: MenuKey;
  icon: string;
  label: string;
}>;

const activeMenu = ref<MenuKey>("profile");
const loggingOut = ref(false);
const rankProgressVisible = ref(false);

const orders = [
  {
    code: "DH240115",
    date: "15/01/2026",
    status: "Đang giao",
    total: 324000,
    images: [
      "https://picsum.photos/seed/o-1/80/80",
      "https://picsum.photos/seed/o-2/80/80",
      "https://picsum.photos/seed/o-3/80/80",
    ],
  },
  {
    code: "DH240102",
    date: "02/01/2026",
    status: "Thành công",
    total: 518000,
    images: [
      "https://picsum.photos/seed/o-4/80/80",
      "https://picsum.photos/seed/o-5/80/80",
      "https://picsum.photos/seed/o-6/80/80",
    ],
  },
  {
    code: "DH231228",
    date: "28/12/2025",
    status: "Đã hủy",
    total: 189000,
    images: [
      "https://picsum.photos/seed/o-7/80/80",
      "https://picsum.photos/seed/o-8/80/80",
      "https://picsum.photos/seed/o-9/80/80",
    ],
  },
];

// Address management (local list + create/edit modal)
type Address = {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault?: boolean;
};

const addresses = ref<Address[]>([
  {
    id: "a1",
    fullName: "Nguyễn Văn A",
    phone: "0912345678",
    street: "25 Nguyễn Trãi",
    ward: "Phường Bến Thành",
    district: "Quận 1",
    city: "TP.HCM",
    isDefault: true,
  },
  {
    id: "b1",
    fullName: "Trần Thị B",
    phone: "0987654321",
    street: "123 Lê Lợi",
    ward: "Phường 5",
    district: "Quận 3",
    city: "TP.HCM",
    isDefault: false,
  },
]);

const selectedAddressId = ref<string | null>(
  addresses.value.find((a) => a.isDefault)?.id || null,
);

const modalMode = ref<"create" | "edit">("create");
const editingId = ref<string | null>(null);
const showAddressModal = ref(false);

const addressForm = ref<Partial<Address>>({
  fullName: "",
  phone: "",
  street: "",
  ward: "",
  district: "",
  city: "",
  isDefault: false,
});

const provinces = ref<any[]>([]);
const districts = computed(() => {
  const p = provinces.value.find((p: any) => p.name === addressForm.value.city);
  return p?.districts || [];
});
const wards = computed(() => {
  const d = districts.value.find(
    (d: any) => d.name === addressForm.value.district,
  );
  return d?.wards || [];
});

// Options for PrimeVue Select
const provinceOptions = computed(() =>
  provinces.value.map((p: any) => ({ label: p.name, value: p.name })),
);
const districtOptions = computed(() =>
  districts.value.map((d: any) => ({ label: d.name, value: d.name })),
);
const wardOptions = computed(() =>
  wards.value.map((w: any) => ({ label: w.name, value: w.name })),
);

watch(
  () => addressForm.value.city,
  () => {
    addressForm.value.district = "";
    addressForm.value.ward = "";
  },
);

watch(
  () => addressForm.value.district,
  () => {
    addressForm.value.ward = "";
  },
);

const wasSubmitted = ref(false);
const validationErrors = ref<{ [k: string]: string }>({});
const statusClass = (status: string) => {
  if (status === "Đang giao") return "bg-blue-100 text-blue-700";
  if (status === "Thành công") return "bg-green-100 text-green-700";
  return "bg-red-100 text-red-700";
};

const formatVnd = (v: number) => v.toLocaleString("vi-VN");

const loadProvinces = async () => {
  try {
    const res = await getProvincesRequest();
    provinces.value = res;
  } catch {
    provinces.value = [];
  }
};

const openCreateAddress = () => {
  modalMode.value = "create";
  editingId.value = null;
  addressForm.value = {
    fullName: "",
    phone: "",
    street: "",
    ward: "",
    district: "",
    city: provinces.value?.[0]?.name || "TP.HCM",
    isDefault: false,
  };
  wasSubmitted.value = false;
  validationErrors.value = {};
  showAddressModal.value = true;
};

const openEditAddress = (a: Address) => {
  modalMode.value = "edit";
  editingId.value = a.id;
  addressForm.value = { ...a };
  wasSubmitted.value = false;
  validationErrors.value = {};
  showAddressModal.value = true;
};

const setDefaultAddress = (id: string) => {
  addresses.value = addresses.value.map((a) => ({
    ...a,
    isDefault: a.id === id,
  }));
  selectedAddressId.value = id;
};

const validateAddressForm = (): boolean => {
  validationErrors.value = {};
  if (
    !addressForm.value.fullName ||
    !String(addressForm.value.fullName).trim()
  ) {
    validationErrors.value.fullName = "Tên người nhận là bắt buộc.";
  }
  if (
    !addressForm.value.phone ||
    !isValidPhone(String(addressForm.value.phone))
  ) {
    validationErrors.value.phone = "Số điện thoại không hợp lệ.";
  }
  if (!addressForm.value.street || !String(addressForm.value.street).trim()) {
    validationErrors.value.street = "Địa chỉ chi tiết là bắt buộc.";
  }
  if (!addressForm.value.city) {
    validationErrors.value.city = "Vui lòng chọn Tỉnh/Thành.";
  }
  if (!addressForm.value.district) {
    validationErrors.value.district = "Vui lòng chọn Quận/Huyện.";
  }
  if (!addressForm.value.ward) {
    validationErrors.value.ward = "Vui lòng chọn Phường/Xã.";
  }
  return Object.keys(validationErrors.value).length === 0;
};

watch(
  () => [
    addressForm.value.fullName,
    addressForm.value.phone,
    addressForm.value.street,
    addressForm.value.city,
    addressForm.value.district,
    addressForm.value.ward,
  ],
  () => {
    if (wasSubmitted.value) {
      validateAddressForm();
    }
  },
  { deep: true },
);

const saveAddress = () => {
  wasSubmitted.value = true;
  if (!validateAddressForm()) return;

  if (modalMode.value === "create") {
    const id = `a${Date.now()}`;
    const newAddr: Address = {
      id,
      fullName: String(addressForm.value.fullName || ""),
      phone: String(addressForm.value.phone || ""),
      street: String(addressForm.value.street || ""),
      ward: String(addressForm.value.ward || ""),
      district: String(addressForm.value.district || ""),
      city: String(addressForm.value.city || ""),
      isDefault: Boolean(addressForm.value.isDefault),
    };
    if (newAddr.isDefault) {
      addresses.value = addresses.value.map((a) => ({
        ...a,
        isDefault: false,
      }));
      selectedAddressId.value = id;
    }
    addresses.value.unshift(newAddr);
  } else if (modalMode.value === "edit" && editingId.value) {
    addresses.value = addresses.value.map((a) => {
      if (a.id !== editingId.value) return a;
      const updated: Address = {
        ...a,
        fullName: String(addressForm.value.fullName || a.fullName),
        phone: String(addressForm.value.phone || a.phone),
        street: String(addressForm.value.street || a.street),
        ward: String(addressForm.value.ward || a.ward),
        district: String(addressForm.value.district || a.district),
        city: String(addressForm.value.city || a.city),
        isDefault: Boolean(addressForm.value.isDefault),
      };
      return updated;
    });
    if (addressForm.value.isDefault) {
      setDefaultAddress(editingId.value);
    }
  }

  // Hậu kiểm: Đảm bảo luôn có đúng 1 địa chỉ mặc định nếu danh sách không trống
  const defaultCount = addresses.value.filter((a) => a.isDefault).length;
  if (defaultCount !== 1 && addresses.value.length > 0) {
    // Nếu có nhiều hơn 1 hoặc không có cái nào, lấy cái đầu tiên làm mặc định
    addresses.value = addresses.value.map((a, idx) => ({
      ...a,
      isDefault: idx === 0,
    }));
    selectedAddressId.value = addresses.value[0].id;
  }

  showAddressModal.value = false;
};

const handleLogout = async () => {
  if (loggingOut.value) return;

  loggingOut.value = true;
  try {
    await userService.logout();
    authStore.logout();
    await router.replace(ROUTES.AUTH.LOGIN);
  } catch {
    // Không chặn luồng logout phía client nếu API lỗi.
  } finally {
    loggingOut.value = false;
  }
};

onMounted(() => {
  requestAnimationFrame(() => {
    rankProgressVisible.value = true;
  });
  loadProvinces();
});
</script>

<template>
  <SkProfilePage v-if="isLoading" />
  <div v-else class="min-h-screen bg-[#f5f5f5] pb-24 text-[#111827]">
    <div class="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <nav
        aria-label="Breadcrumb"
        class="mb-4 flex items-center gap-2 text-sm text-slate-500"
      >
        <NuxtLink :to="ROUTES.HOME" class="hover:text-orange-600"
          >Trang chủ</NuxtLink
        >
        <i class="pi pi-angle-right text-xs" />
        <span class="line-clamp-1 text-slate-700">Tài khoản cá nhân</span>
      </nav>
      <section class="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div class="h-20 bg-linear-to-b from-[#fff3e8] to-white" />
        <div class="px-6 pb-6">
          <div class="-mt-11 flex flex-wrap items-end justify-between gap-4">
            <div class="flex items-end gap-4">
              <label class="avatar-wrap">
                <img
                  v-if="avatarPreview"
                  :src="avatarPreview"
                  alt="Avatar"
                  class="h-22 w-22 rounded-full object-cover"
                />
                <div
                  v-else
                  class="h-22 w-22 rounded-full bg-orange-100 flex items-center justify-center"
                >
                  <span class="text-2xl font-black text-orange-500">{{
                    userInitial
                  }}</span>
                </div>
                <div class="avatar-overlay">
                  <span>📷 Đổi ảnh</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onAvatarChange"
                />
              </label>

              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-xl font-bold">{{ user?.fullname }}</h1>
                  <span
                    v-if="user?.verified"
                    class="inline-flex items-center gap-1 rounded-full bg-[#e8f5e9] px-2 py-1 text-xs font-semibold text-[#4caf50]"
                    >✓ Đã xác minh</span
                  >
                </div>
                <div class="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                  <span>📞 {{ user?.phone }}</span>
                  <span>📧 {{ user?.email }}</span>
                  <span v-if="formattedBirthday"
                    >📅 {{ formattedBirthday }}</span
                  >
                </div>
              </div>
            </div>

            <button
              class="rounded-full border border-[#f47f20] px-4 py-2 text-sm font-semibold text-[#f47f20] transition hover:bg-[#f47f20] hover:text-white"
              @click="activeMenu = 'profile'"
            >
              ✎ Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>
      </section>

      <div class="mt-6 grid gap-5 lg:grid-cols-[220px_1fr]">
        <aside
          class="hidden h-fit rounded-2xl bg-white p-3 shadow-sm lg:sticky lg:top-20 lg:block"
        >
          <button
            v-for="item in menuItems"
            :key="item.key"
            class="mb-1 flex w-full items-center gap-2 rounded-r-lg border-l-4 px-3 py-2 text-left text-sm transition"
            :class="
              activeMenu === item.key
                ? 'border-[#f47f20] bg-[#fff3e8] font-semibold text-[#f47f20]'
                : 'border-transparent hover:bg-gray-50 text-gray-700'
            "
            @click="activeMenu = item.key"
          >
            <span class="w-4">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </button>
        </aside>

        <main class="space-y-5">
          <template v-if="activeMenu === 'profile'">
            <section class="rounded-2xl bg-white p-5 shadow-sm">
              <h2 class="text-lg font-bold">Thông tin cá nhân</h2>
              <form
                class="mt-4 grid gap-4 md:grid-cols-2"
                @submit.prevent="saveProfile"
              >
                <label class="field">
                  <span>Họ tên</span>
                  <input
                    v-model="editForm.name"
                    class="input"
                    placeholder="Nhập họ tên"
                  />
                </label>

                <label class="field">
                  <span>Ngày sinh</span>
                  <DatePicker
                    v-model="editForm.birthday"
                    dateFormat="dd/mm/yy"
                    show-icon
                    icon-display="input"
                    :min-date="minDate"
                    :max-date="maxDate"
                    fluid
                    input-class="input !h-[44px]"
                  />
                </label>

                <label class="field">
                  <span>Email</span>
                  <div class="relative">
                    <input
                      v-model="editForm.email"
                      disabled
                      class="input bg-gray-100"
                    />
                    <span
                      class="absolute right-2 top-2 rounded-full bg-gray-200 px-2 py-0.5 text-[10px]"
                      >Không thể thay đổi</span
                    >
                  </div>
                </label>

                <label class="field">
                  <span>Số điện thoại</span>
                  <input
                    v-model="editForm.phone"
                    class="input"
                    placeholder="Nhập số điện thoại"
                  />
                </label>

                <label class="field">
                  <span>Giới tính</span>
                  <div class="mt-1 flex gap-2">
                    <div
                      v-for="g in GENDER_OPTIONS"
                      :key="g.value"
                      class="relative"
                    >
                      <input
                        type="radio"
                        :id="'gender-' + g.value"
                        name="gender"
                        :value="g.value"
                        v-model="editForm.gender"
                        class="peer sr-only"
                      />
                      <label
                        :for="'gender-' + g.value"
                        class="inline-block cursor-pointer rounded-full border px-4 py-2 text-sm transition-all peer-checked:border-[#f47f20] peer-checked:bg-[#f47f20] peer-checked:text-white peer-checked:shadow-md hover:border-gray-300 bg-white text-gray-600 border-gray-200"
                      >
                        {{ g.label }}
                      </label>
                    </div>
                  </div>
                </label>

                <div class="md:col-span-2">
                  <button class="save-btn" :disabled="saving">
                    <span
                      v-if="saving"
                      class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                    />
                    <span v-if="saveDone">✓ Đã lưu</span>
                    <span v-else>{{
                      saving ? "Đang lưu..." : "Lưu thay đổi"
                    }}</span>
                  </button>
                </div>
              </form>
            </section>
          </template>

          <template v-if="activeMenu === 'orders'">
            <section class="rounded-2xl bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Đơn hàng gần đây</h2>
                <button class="text-sm font-semibold text-[#006ee6]">
                  Xem tất cả
                </button>
              </div>

              <article
                v-for="(order, idx) in orders"
                :key="order.code"
                class="order-card mt-3 rounded-xl border border-gray-100 p-4"
                :style="{ animationDelay: `${idx * 80}ms` }"
              >
                <div
                  class="flex flex-wrap items-center justify-between gap-2 text-sm"
                >
                  <p class="font-semibold">#{{ order.code }}</p>
                  <p class="text-gray-500">{{ order.date }}</p>
                  <span
                    class="rounded-full px-2 py-1 text-xs font-semibold"
                    :class="statusClass(order.status)"
                  >
                    {{ order.status }}
                  </span>
                </div>
                <div class="mt-3 flex items-center justify-between gap-3">
                  <div class="flex -space-x-2">
                    <img
                      v-for="img in order.images"
                      :key="img"
                      :src="img"
                      alt="item"
                      class="h-10 w-10 rounded-lg border-2 border-white object-cover"
                    />
                  </div>
                  <p class="font-bold text-[#f47f20]">
                    {{ formatVnd(order.total) }}đ
                  </p>
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <button class="text-sm font-semibold text-[#006ee6]">
                    Xem chi tiết
                  </button>
                  <button
                    class="rounded-full bg-[#f47f20] px-3 py-1 text-sm font-semibold text-white"
                  >
                    Mua lại
                  </button>
                </div>
              </article>
            </section>
          </template>

          <template v-if="activeMenu === 'address'">
            <section class="rounded-2xl bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Địa chỉ giao hàng</h2>
                <button
                  class="rounded-full border border-[#f47f20] px-3 py-1 text-sm font-semibold text-[#f47f20]"
                  @click="openCreateAddress()"
                >
                  + Thêm địa chỉ
                </button>
              </div>

              <div class="mt-4">
                <TransitionGroup name="list" tag="div" class="space-y-3">
                  <template #default>
                    <div
                      v-for="addr in addresses"
                      :key="addr.id"
                      class="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
                    >
                      <div class="flex items-start gap-3 flex-1 min-w-0">
                        <input
                          type="radio"
                          name="selectedAddress"
                          :value="addr.id"
                          v-model="selectedAddressId"
                          class="mt-1 h-4 w-4 shrink-0 accent-[#f47f20]"
                          @change="() => setDefaultAddress(addr.id)"
                        />
                        <div class="flex-1 min-w-0">
                          <div
                            class="flex flex-wrap items-center gap-x-2 gap-y-1"
                          >
                            <p class="font-semibold text-gray-900 text-sm">
                              {{ addr.fullName }}
                            </p>
                            <span class="text-gray-300 text-xs select-none"
                              >|</span
                            >
                            <p class="text-sm text-gray-500">
                              {{ addr.phone }}
                            </p>
                            <span
                              v-if="addr.isDefault"
                              class="rounded-full bg-orange-50 border border-orange-200 px-2 py-0.5 text-xs font-semibold text-[#f47f20]"
                              >Mặc định</span
                            >
                          </div>
                          <p
                            class="mt-1 text-sm text-gray-500 leading-relaxed truncate"
                          >
                            {{ addr.street }}, {{ addr.ward }},
                            {{ addr.district }}, {{ addr.city }}
                          </p>
                        </div>
                      </div>

                      <div class="flex items-center gap-2 shrink-0">
                        <button
                          class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                          @click="openEditAddress(addr)"
                        >
                          ✏️ Sửa
                        </button>
                      </div>
                    </div>
                  </template>
                </TransitionGroup>

                <div
                  v-if="addresses.length === 0"
                  class="mt-8 flex flex-col items-center gap-2 text-center"
                >
                  <p class="text-sm text-gray-400">Bạn chưa có địa chỉ nào.</p>
                </div>
              </div>
            </section>
          </template>

          <template v-if="activeMenu === 'notify'">
            <section class="rounded-2xl bg-white p-5 shadow-sm">
              <h2 class="text-lg font-bold">Thông báo</h2>
              <div
                class="mt-8 flex flex-col items-center justify-center pb-8 text-gray-500"
              >
                <span class="mb-2 text-4xl">🔔</span>
                <p>Bạn không có thông báo mới.</p>
              </div>
            </section>
          </template>

          <template v-if="activeMenu === 'changePassword'">
            <div
              class="change-password-wrapper overflow-hidden rounded-2xl bg-white shadow-sm p-0"
            >
              <ChangePasswordPage />
            </div>
          </template>

          <template v-if="activeMenu === 'logout'">
            <section
              class="flex flex-col items-center justify-center rounded-2xl bg-white p-5 py-10 shadow-sm"
            >
              <h2 class="mb-4 text-xl font-bold">
                Bạn chắc chắn muốn đăng xuất?
              </h2>
              <div class="flex gap-4">
                <button
                  class="px-6 py-2 rounded-full border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                  @click="activeMenu = 'profile'"
                >
                  Hủy
                </button>
                <button
                  class="px-6 py-2 rounded-full bg-red-500 font-semibold text-white hover:bg-red-600"
                  :disabled="loggingOut"
                  @click="handleLogout"
                >
                  {{ loggingOut ? "Đang đăng xuất..." : "Đăng xuất" }}
                </button>
              </div>
            </section>
          </template>
        </main>
      </div>
    </div>

    <div
      class="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white py-2 shadow-[0_-8px_20px_rgba(15,23,42,0.08)] lg:hidden"
    >
      <div class="mx-auto grid max-w-md grid-cols-5 text-center text-xs">
        <button
          v-for="tab in mobileTabs"
          :key="tab.key"
          class="flex flex-col items-center gap-1"
          :class="activeMenu === tab.key ? 'text-[#f47f20]' : 'text-gray-400'"
          @click="activeMenu = tab.key"
        >
          <span class="text-base">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showAddressModal"
          class="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-4 md:items-center"
          @click.self="showAddressModal = false"
        >
          <div class="w-full max-w-lg rounded-2xl bg-white p-6">
            <!-- Header -->
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-lg font-bold text-gray-800">
                {{
                  modalMode === "create" ? "Thêm địa chỉ" : "Chỉnh sửa địa chỉ"
                }}
              </h3>
              <button
                class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                @click="showAddressModal = false"
              >
                <i class="pi pi-times text-sm" />
              </button>
            </div>

            <form class="space-y-5" @submit.prevent="saveAddress">
              <!-- Tên + SĐT -->
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label
                    class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >Họ tên <span class="text-red-500">*</span></label
                  >
                  <InputText
                    v-model="addressForm.fullName"
                    placeholder="VD: Nguyễn Văn A"
                    class="w-full"
                    :class="{ 'p-invalid': validationErrors.fullName }"
                  />
                  <small
                    v-if="validationErrors.fullName"
                    class="text-red-500 text-xs mt-0.5"
                  >
                    {{ validationErrors.fullName }}
                  </small>
                </div>
                <div class="flex flex-col gap-1">
                  <label
                    class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >Số điện thoại <span class="text-red-500">*</span></label
                  >
                  <InputText
                    v-model="addressForm.phone"
                    placeholder="VD: 0912..."
                    class="w-full"
                    :class="{ 'p-invalid': validationErrors.phone }"
                  />
                  <small
                    v-if="validationErrors.phone"
                    class="text-red-500 text-xs mt-0.5"
                  >
                    {{ validationErrors.phone }}
                  </small>
                </div>
              </div>

              <!-- Tỉnh/Thành + Quận/Huyện -->
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label
                    class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >Tỉnh/Thành phố <span class="text-red-500">*</span></label
                  >
                  <Select
                    v-model="addressForm.city"
                    :options="provinceOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Chọn tỉnh/thành"
                    class="w-full"
                    :class="{ 'p-invalid': validationErrors.city }"
                    filter
                  />
                  <small
                    v-if="validationErrors.city"
                    class="text-red-500 text-xs mt-0.5"
                  >
                    {{ validationErrors.city }}
                  </small>
                </div>

                <div class="flex flex-col gap-1">
                  <label
                    class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >Quận/Huyện <span class="text-red-500">*</span></label
                  >
                  <Select
                    v-model="addressForm.district"
                    :options="districtOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Chọn quận/huyện"
                    class="w-full"
                    :class="{ 'p-invalid': validationErrors.district }"
                    :disabled="!addressForm.city"
                    filter
                  />
                  <small
                    v-if="validationErrors.district"
                    class="text-red-500 text-xs mt-0.5"
                  >
                    {{ validationErrors.district }}
                  </small>
                </div>
              </div>

              <!-- Phường/Xã + Số nhà -->
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label
                    class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >Phường/Xã <span class="text-red-500">*</span></label
                  >
                  <Select
                    v-model="addressForm.ward"
                    :options="wardOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Chọn phường/xã"
                    class="w-full"
                    :class="{ 'p-invalid': validationErrors.ward }"
                    :disabled="!addressForm.district"
                    filter
                  />
                  <small
                    v-if="validationErrors.ward"
                    class="text-red-500 text-xs mt-0.5"
                  >
                    {{ validationErrors.ward }}
                  </small>
                </div>

                <div class="flex flex-col gap-1">
                  <label
                    class="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >Số nhà / Đường <span class="text-red-500">*</span></label
                  >
                  <InputText
                    v-model="addressForm.street"
                    placeholder="123 Đường Lê Lợi"
                    class="w-full"
                    :class="{ 'p-invalid': validationErrors.street }"
                  />
                  <small
                    v-if="validationErrors.street"
                    class="text-red-500 text-xs mt-0.5"
                  >
                    {{ validationErrors.street }}
                  </small>
                </div>
              </div>

              <!-- Checkbox mặc định -->
              <div>
                <label class="flex items-center gap-2 text-sm">
                  <input
                    v-model="addressForm.isDefault"
                    type="checkbox"
                    class="h-4 w-4 rounded accent-[#f47f20]"
                  />
                  <span class="text-gray-600">Đặt làm địa chỉ mặc định</span>
                </label>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  class="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                  @click="showAddressModal = false"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  class="rounded-full bg-[#f47f20] px-8 py-2 text-sm font-semibold text-white hover:bg-[#e06d10] transition"
                >
                  Lưu địa chỉ
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.avatar-wrap {
  position: relative;
  border-radius: 9999px;
  border: 4px solid #fff;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
  cursor: pointer;
  overflow: hidden;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 12px;
  opacity: 0;
  transition: opacity 200ms ease;
}

.avatar-wrap:hover .avatar-overlay {
  opacity: 1;
}

.field span {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
}

.input {
  height: 44px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background-color: #fff;
  padding: 0 12px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input:focus {
  border-color: #f47f20;
  box-shadow: 0 0 0 3px rgba(244, 127, 32, 0.2);
}

.save-btn {
  height: 44px;
  border-radius: 9999px;
  background: linear-gradient(90deg, #fc5c22, #f47f20);
  color: white;
  padding: 0 32px;
  font-weight: 700;
}

.order-card {
  opacity: 0;
  transform: translateY(16px);
  animation: fadeUp 0.45s ease forwards;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(24px);
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.change-password-wrapper :deep(.cp-page) {
  min-height: auto;
  padding: 0;
  background: white;
}
.change-password-wrapper :deep(.breadcrumb) {
  display: none;
}
.change-password-wrapper :deep(.cp-card) {
  box-shadow: none;
  max-width: 100%;
  padding: 1.5rem;
  border-radius: 0;
  animation: none;
}

:deep(.p-datepicker) {
  font-family: inherit;
}

:deep(.p-datepicker-input) {
  border-radius: 10px !important;
  border: 1px solid #e5e7eb !important;
  height: 44px !important;
  padding: 0 12px !important;
  font-size: 14px !important;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease !important;
}

:deep(.p-datepicker-input:focus) {
  border-color: #f47f20 !important;
  box-shadow: 0 0 0 3px rgba(244, 127, 32, 0.2) !important;
  outline: none !important;
}

:deep(.p-datepicker-input:hover) {
  border-color: #f47f20 !important;
}

:deep(.p-datepicker .p-inputtext) {
  border-color: #e5e7eb;
}
</style>
