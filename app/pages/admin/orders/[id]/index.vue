<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import { useToast } from "primevue/usetoast";
import { ROUTES } from "~/constants/routes";
import { useAdminOrderDetailQuery } from "~/queries/order/useAdminOrdersQuery";
import { useUpdateAdminOrderStatus } from "~/mutations/order/useUpdateAdminOrderStatus";
import { formatDateTime, formatVND } from "~/utils/formatters";
import { NEXT_STATUS_MAP, type OrderStatus } from "~/types/order.type";

definePageMeta({ layout: "admin", middleware: ["auth", "admin"] });

const route = useRoute();
const router = useRouter();
const toast = useToast();

const orderId = computed(() => route.params.id as string);

// ── Data fetching
const { data: order, isLoading, isError } = useAdminOrderDetailQuery(orderId);

useHead({
  title: computed(() =>
    order.value
      ? `Đơn hàng #${order.value.orderCode ?? order.value._id.toString().slice(-6).toUpperCase()} - Quản trị SmartFood`
      : "Chi tiết đơn hàng - Quản trị SmartFood",
  ),
});

// ── Mutation
const { mutate: updateStatus, isPending: isUpdatingStatus } =
  useUpdateAdminOrderStatus();

// ── Local state
const statusValue = ref<string>("");
const statusNote = ref<string>("");

// ── Computed: next available statuses
const nextStatuses = computed(
  () => NEXT_STATUS_MAP[order.value?.status as OrderStatus] ?? [],
);

// ── Computed: order items
const orderItems = computed(() => order.value?.items ?? []);

// ── Computed: payment info
const payment = computed(() => order.value?.payment ?? null);

// ── Computed: timeline steps
const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipping",
  "delivered",
];

const STATUS_LABELS: Record<string, string> = {
  pending: "Đặt hàng thành công",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipping: "Đã gửi hàng",
  delivered: "Đã giao hàng",
  cancelled: "Đã hủy",
  returned: "Đã trả hàng & khiếu nại",
};

const timelineSteps = computed(() => {
  if (!order.value) return [];
  const currentStatus = order.value.status;

  if (currentStatus === "cancelled") {
    return [
      {
        key: "pending",
        label: "Đặt hàng thành công",
        time: order.value.createdAt,
        completed: true,
      },
      {
        key: "cancelled",
        label: "Đã hủy",
        time: null,
        completed: true,
        isError: true,
      },
    ];
  }

  if (currentStatus === "returned") {
    return [
      {
        key: "pending",
        label: "Đặt hàng thành công",
        time: order.value.createdAt,
        completed: true,
      },
      {
        key: "delivered",
        label: "Đã giao",
        time: order.value.deliveredAt ?? null,
        completed: true,
      },
      {
        key: "returned",
        label: "Đã trả hàng & khiếu nại",
        time: null,
        completed: true,
        isError: true,
      },
    ];
  }

  const currentIdx = STATUS_ORDER.indexOf(currentStatus as OrderStatus);
  return STATUS_ORDER.map((key, idx) => ({
    key,
    label: STATUS_LABELS[key],
    time:
      key === "pending"
        ? order.value!.createdAt
        : key === "delivered"
          ? (order.value!.deliveredAt ?? null)
          : null,
    completed: idx <= currentIdx,
    active: idx === currentIdx,
    isError: false,
  }));
});

// ── Computed: financial summary
const subtotal = computed(() => {
  if (!order.value) return 0;
  return (
    order.value.totalPrice -
    order.value.shippingFee +
    order.value.discountVoucher
  );
});

// ── Computed: payment method class
const paymentMethodClass = computed(() =>
  payment.value?.paymentMethod === "PayOS"
    ? "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300"
    : "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
);

// ── Computed: customer avatar initial
const customerInitial = computed(
  () => order.value?.userInfo?.fullname?.charAt(0)?.toUpperCase() ?? "?",
);

// ── Actions
const submitStatus = () => {
  if (!order.value || !statusValue.value) return;

  updateStatus(
    { id: orderId.value, status: statusValue.value },
    {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Đã cập nhật trạng thái",
          detail: `Trạng thái đơn hàng: ${statusValue.value}`,
          life: 3000,
        });
        statusValue.value = "";
        statusNote.value = "";
      },
      onError: (err: any) => {
        toast.add({
          severity: "error",
          summary: "Lỗi cập nhật",
          detail:
            err?.response?.data?.message ?? "Không thể cập nhật trạng thái.",
          life: 3000,
        });
      },
    },
  );
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <!-- Loading -->
    <div
      v-if="isLoading"
      class="flex items-center justify-center py-20 text-slate-400 dark:text-slate-500"
    >
      <i class="pi pi-spin pi-spinner text-3xl mr-3"></i>
      <span class="text-lg">Đang tải đơn hàng...</span>
    </div>

    <!-- Error / Not found -->
    <div
      v-else-if="isError || !order"
      class="rounded-2xl border border-red-200 bg-red-50 p-8 dark:border-red-900 dark:bg-red-950/20"
    >
      <h2 class="text-lg font-semibold text-red-800 dark:text-red-300">
        Không tìm thấy đơn hàng
      </h2>
      <p class="text-sm text-red-600 dark:text-red-400 mt-2">
        Đơn hàng bạn yêu cầu không tồn tại hoặc đã bị xóa.
      </p>
      <button
        class="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        @click="router.push(ROUTES.ADMIN.ORDERS)"
      >
        Quay lại danh sách
      </button>
    </div>

    <template v-else>
      <!-- Header -->
      <section
        class="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-3">
              <span
                class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 font-mono"
              >
                Đơn hàng #{{
                  order.orderCode ??
                  order._id.toString().slice(-6).toUpperCase()
                }}
              </span>
              <StatusBadge :status="order.status" type="order" />
            </div>
            <h1
              class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
            >
              Bảng xử lý đơn hàng
            </h1>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Tạo lúc {{ formatDateTime(order.createdAt) }}
            </p>
            <p
              v-if="order.deliveredAt"
              class="text-sm text-green-600 dark:text-green-400 mt-0.5"
            >
              <i class="pi pi-check-circle mr-1"></i>Giao lúc
              {{ formatDateTime(order.deliveredAt) }}
            </p>
          </div>
          <button
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="router.push(ROUTES.ADMIN.ORDERS)"
          >
            ← Quay lại danh sách
          </button>
        </div>
      </section>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- LEFT: Items + Timeline -->
        <div class="space-y-6 lg:col-span-2">
          <!-- Order Items -->
          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Sản phẩm trong đơn
            </h2>
            <div class="mt-4 overflow-x-auto">
              <table
                class="w-full text-sm text-left text-slate-500 dark:text-slate-400"
              >
                <thead
                  class="text-xs text-slate-400 uppercase bg-slate-50 dark:bg-slate-850 dark:text-slate-500"
                >
                  <tr>
                    <th class="px-4 py-3">Sản phẩm</th>
                    <th class="px-4 py-3 text-center">SL</th>
                    <th class="px-4 py-3 text-right">Đơn giá</th>
                    <th class="px-4 py-3 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr
                    v-for="item in orderItems"
                    :key="item._id ?? item.productId"
                    class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                  >
                    <td class="px-4 py-4 flex items-center gap-3">
                      <img
                        v-if="item.thumbnail"
                        :src="item.thumbnail"
                        class="w-12 h-12 rounded-lg object-cover border dark:border-slate-700"
                        :alt="item.title"
                      />
                      <div
                        v-else
                        class="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
                      >
                        <i class="pi pi-image text-slate-400"></i>
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900 dark:text-white">
                          {{ item.title }}
                        </p>
                        <p class="text-[10px] text-slate-400 font-mono">
                          {{ item.productId }}
                        </p>
                      </div>
                    </td>
                    <td
                      class="px-4 py-4 font-medium text-slate-800 dark:text-slate-200 text-center"
                    >
                      x{{ item.quantity }}
                    </td>
                    <td
                      class="px-4 py-4 text-right font-medium text-slate-800 dark:text-slate-200"
                    >
                      {{ formatVND(item.price) }}
                    </td>
                    <td
                      class="px-4 py-4 text-right font-bold text-slate-900 dark:text-white"
                    >
                      {{ formatVND(item.totalPrice) }}
                    </td>
                  </tr>

                  <tr v-if="!orderItems.length">
                    <td
                      colspan="4"
                      class="px-4 py-8 text-center text-sm text-slate-400 italic"
                    >
                      Không có sản phẩm trong đơn hàng này.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Financial Summary -->
            <div
              class="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800 flex justify-end"
            >
              <div class="w-full md:w-80 space-y-3 text-sm">
                <div
                  class="flex justify-between text-slate-600 dark:text-slate-400"
                >
                  <span>Tạm tính</span>
                  <span
                    class="font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {{ formatVND(subtotal) }}
                  </span>
                </div>
                <div
                  v-if="order.voucherCode"
                  class="flex justify-between text-slate-600 dark:text-slate-400"
                >
                  <span class="flex items-center gap-1.5">
                    Mã giảm giá
                    <span
                      class="font-mono text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded dark:bg-emerald-950/20 dark:text-emerald-400"
                    >
                      {{ order.voucherCode }}
                    </span>
                  </span>
                  <span class="font-semibold text-emerald-600">
                    -{{ formatVND(order.discountVoucher) }}
                  </span>
                </div>
                <div
                  class="flex justify-between text-slate-600 dark:text-slate-400"
                >
                  <span>Phí vận chuyển</span>
                  <span
                    class="font-semibold text-slate-800 dark:text-slate-200"
                  >
                    +{{ formatVND(order.shippingFee) }}
                  </span>
                </div>
                <div
                  class="flex justify-between text-base font-bold border-t border-dashed pt-3 text-slate-900 dark:text-white"
                >
                  <span>Tổng cộng</span>
                  <span class="text-primary-600">{{
                    formatVND(order.totalPrice)
                  }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Timeline -->
          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2
              class="text-lg font-semibold text-slate-900 dark:text-white mb-6"
            >
              Tiến trình giao hàng
            </h2>
            <div
              class="relative pl-8 border-l border-slate-200 dark:border-slate-700 space-y-8"
            >
              <div
                v-for="step in timelineSteps"
                :key="step.key"
                class="relative"
              >
                <span
                  class="absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-900"
                  style="left: -41px"
                  :class="[
                    step.completed
                      ? 'border-primary-500 text-primary-500'
                      : 'border-slate-200 dark:border-slate-700 text-slate-300',
                    step.isError ? 'border-red-500 text-red-500' : '',
                  ]"
                >
                  <i
                    class="text-[10px]"
                    :class="[
                      step.isError
                        ? 'pi pi-times'
                        : step.completed
                          ? 'pi pi-check'
                          : 'pi pi-circle-fill',
                    ]"
                  ></i>
                </span>
                <div>
                  <h3
                    class="text-sm font-semibold"
                    :class="[
                      step.completed
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-400',
                      step.isError ? 'text-red-600 dark:text-red-400' : '',
                    ]"
                  >
                    {{ step.label }}
                  </h3>
                  <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {{ step.time ? formatDateTime(step.time) : "" }}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- RIGHT: Customer + Payment + Status Update -->
        <div class="space-y-6">
          <!-- Customer Card -->
          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Thông tin khách hàng
            </h2>
            <div
              class="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 font-bold text-lg"
                >
                  {{ customerInitial }}
                </div>
                <div>
                  <p class="font-bold text-slate-900 dark:text-white">
                    {{ order.userInfo.fullname }}
                  </p>
                  <p class="text-xs text-slate-400">ID: {{ order.userId }}</p>
                </div>
              </div>
              <div class="border-t pt-3 dark:border-slate-800 space-y-2.5">
                <div>
                  <span
                    class="text-[11px] font-semibold text-slate-400 uppercase block"
                  >
                    📞 Số điện thoại
                  </span>
                  <span class="font-medium">{{ order.userInfo.phone }}</span>
                </div>
                <div>
                  <span
                    class="text-[11px] font-semibold text-slate-400 uppercase block"
                  >
                    📍 Địa chỉ giao hàng
                  </span>
                  <span>
                    {{ order.userInfo.address }}, Phường
                    {{ order.userInfo.ward }}, Quận
                    {{ order.userInfo.district }}, {{ order.userInfo.province }}
                  </span>
                </div>
                <div v-if="order.userInfo.note">
                  <span
                    class="text-[11px] font-semibold text-slate-400 uppercase block"
                  >
                    💬 Ghi chú
                  </span>
                  <span class="italic text-slate-500 dark:text-slate-400">
                    "{{ order.userInfo.note }}"
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Payment Card -->
          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Chi tiết thanh toán
            </h2>
            <div
              v-if="payment"
              class="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300"
            >
              <div class="flex justify-between items-center">
                <span>Phương thức:</span>
                <span
                  class="font-bold px-2 py-0.5 rounded text-xs border"
                  :class="paymentMethodClass"
                >
                  {{ payment.paymentMethod }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span>Trạng thái:</span>
                <StatusBadge :status="payment.status" type="payment" />
              </div>
              <div v-if="payment.transactionId" class="flex justify-between">
                <span>Mã giao dịch:</span>
                <span
                  class="font-mono text-xs text-slate-500 font-bold select-all"
                >
                  {{ payment.transactionId }}
                </span>
              </div>
              <div
                class="flex justify-between border-t pt-3 dark:border-slate-800 text-base font-bold text-slate-900 dark:text-white"
              >
                <span>Số tiền:</span>
                <span>{{ formatVND(payment.amount) }}</span>
              </div>
            </div>
            <div v-else class="text-xs text-slate-400 italic mt-3">
              Không có dữ liệu thanh toán.
            </div>
          </section>

          <!-- Update Status -->
          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Cập nhật tiến độ đơn hàng
            </h2>
            <div class="mt-4 space-y-4">
              <div v-if="nextStatuses.length">
                <label
                  class="block text-xs font-semibold uppercase text-slate-400 mb-2"
                >
                  Chuyển sang trạng thái
                </label>
                <select
                  v-model="statusValue"
                  class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="" disabled>
                    — Chọn trạng thái tiếp theo —
                  </option>
                  <option
                    v-for="s in nextStatuses"
                    :key="s.value"
                    :value="s.value"
                  >
                    {{ s.label }}
                  </option>
                </select>
                <p class="mt-1 text-xs text-slate-400">
                  Trạng thái hiện tại:
                  <StatusBadge
                    :status="order.status"
                    type="order"
                    class="inline"
                  />
                </p>
              </div>
              <div
                v-else
                class="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-center"
              >
                <i class="pi pi-lock mr-1"></i>
                Đơn hàng ở trạng thái <strong>{{ order.status }}</strong> —
                không thể thay đổi thêm.
              </div>
              <div>
                <label
                  class="block text-xs font-semibold uppercase text-slate-400 mb-2"
                >
                  Ghi chú nội bộ
                </label>
                <textarea
                  v-model="statusNote"
                  rows="3"
                  class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  placeholder="Ví dụ: Đã giao cho GrabExpress..."
                ></textarea>
              </div>
              <button
                v-if="nextStatuses.length"
                @click="submitStatus"
                :disabled="isUpdatingStatus || !statusValue"
                class="w-full rounded-lg bg-primary-600 text-white px-4 py-2 text-sm font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i
                  v-if="isUpdatingStatus"
                  class="pi pi-spin pi-spinner mr-2"
                ></i>
                Áp dụng thay đổi
              </button>
            </div>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
