<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAdminMockStore } from "~/stores/useAdminMockStore";
import StatusBadge from "~/components/admin/StatusBadge.vue";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import ConfirmDialog from "~/components/admin/ConfirmDialog.vue";
import { useToast } from "primevue/usetoast";
import { ROUTES } from "~/constants/routes";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

useHead({
  title: "Chi tiết đơn hàng - Quản trị SmartFood",
});

const route = useRoute();
const router = useRouter();
const store = useAdminMockStore();
const toast = useToast();

const orderId = route.params.id as string;
const statusValue = ref<any>("pending");
const statusNote = ref("");
const showRefundDialog = ref(false);
const refundReason = ref("");
const refundLoading = ref(false);
const isUpdatingStatus = ref(false);

const order = computed(() => {
  return store.orders.find((o) => o.id === orderId);
});

const payment = computed(() => {
  if (!order.value) return null;
  return store.payments.find((p) => p.orderId === order.value!.id);
});

// Seed mock products in order based on orderCode to match totalPrice
const orderItems = computed(() => {
  if (!order.value) return [];
  const code = order.value.orderCode;

  if (code === 2026052001) {
    return [
      {
        id: "prod-1",
        name: "Hộp Cơm Cá Hồi Áp Chảo",
        quantity: 1,
        unitPrice: 135000,
        thumbnail:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop",
      },
      {
        id: "prod-2",
        name: "Salad Ức Gà Sốt Mè Rang",
        quantity: 1,
        unitPrice: 79000,
        thumbnail:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&auto=format&fit=crop",
      },
    ];
  } else if (code === 2026052002) {
    return [
      {
        id: "prod-2",
        name: "Salad Ức Gà Sốt Mè Rang",
        quantity: 1,
        unitPrice: 79000,
        thumbnail:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&auto=format&fit=crop",
      },
    ];
  } else if (code === 2026051901) {
    return [
      {
        id: "prod-3",
        name: "Nước Ép Thải Độc Cần Tây Táo",
        quantity: 5,
        unitPrice: 49000,
        thumbnail:
          "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=150&auto=format&fit=crop",
      },
    ];
  } else if (code === 2026051801) {
    return [
      {
        id: "prod-5",
        name: "Cơm Đùi Gà Nướng Mật Ong",
        quantity: 2,
        unitPrice: 95000,
        thumbnail:
          "https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?w=150&auto=format&fit=crop",
      },
    ];
  } else {
    return [
      {
        id: "prod-1",
        name: "Hộp Cơm Cá Hồi Áp Chảo",
        quantity: 2,
        unitPrice: 135000,
        thumbnail:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop",
      },
      {
        id: "prod-3",
        name: "Nước Ép Thải Độc Cần Tây Táo",
        quantity: 1,
        unitPrice: 49000,
        thumbnail:
          "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=150&auto=format&fit=crop",
      },
    ];
  }
});

// Active steps computed based on current order status
const timelineSteps = computed(() => {
  if (!order.value) return [];

  const currentStatus = order.value.status;

  const allSteps = [
    {
      key: "pending",
      label: "Đặt hàng thành công",
      time: order.value.createdAt,
    },
    { key: "confirmed", label: "Đã xác nhận", time: "Sẽ cập nhật sớm" },
    { key: "processing", label: "Đang xử lý", time: "Sẽ cập nhật sớm" },
    { key: "shipping", label: "Đã gửi hàng", time: "Sẽ cập nhật sớm" },
    {
      key: "delivered",
      label: "Đã giao",
      time: order.value.deliveredAt || "Sẽ cập nhật sớm",
    },
  ];

  const statusOrder = [
    "pending",
    "confirmed",
    "processing",
    "shipping",
    "delivered",
  ];
  const currentIdx = statusOrder.indexOf(currentStatus);

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
        time: "Đã xử lý",
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
        time: order.value.deliveredAt || "",
        completed: true,
      },
      {
        key: "returned",
        label: "Đã trả hàng & khiếu nại",
        time: "Đã xử lý",
        completed: true,
        isError: true,
      },
    ];
  }

  return allSteps.map((step, idx) => {
    return {
      ...step,
      completed: idx <= currentIdx,
      active: idx === currentIdx,
    };
  });
});

if (order.value) {
  statusValue.value = order.value.status;
}

const submitStatus = async () => {
  if (!order.value) return;
  isUpdatingStatus.value = true;
  await new Promise((resolve) => setTimeout(resolve, 500));

  store.updateOrderStatus(orderId, statusValue.value);
  toast.add({
    severity: "success",
    summary: "Đã cập nhật trạng thái",
    detail: `Trạng thái đơn hàng hiện là ${statusValue.value}.`,
    life: 3000,
  });
  isUpdatingStatus.value = false;
};

// Process Online PayOS refund
const processRefund = async () => {
  refundLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (payment.value) {
    store.updatePaymentStatus(payment.value.id, "cancelled"); // cancelled status means refunded in the system
    toast.add({
      severity: "success",
      summary: "Đã hoàn tiền",
      detail: `Đã hoàn ${Number(payment.value.amount).toLocaleString()} VND qua cổng PayOS.`,
      life: 4000,
    });
  }
  refundLoading.value = false;
  showRefundDialog.value = false;
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN");
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <div
      v-if="!order"
      class="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20"
    >
      <h2 class="text-lg font-semibold text-red-800 dark:text-red-300">
        Không tìm thấy đơn hàng
      </h2>
      <p class="text-sm text-red-600 dark:text-red-400 mt-2">
        Đơn hàng bạn yêu cầu không tồn tại.
      </p>
      <button
        class="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        @click="router.push(ROUTES.ADMIN.ORDERS)"
      >
        Quay lại danh sách đơn hàng
      </button>
    </div>

    <template v-else>
      <section
        class="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-3">
              <span
                class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 font-mono"
                >Đơn hàng #{{ order.orderCode }}</span
              >
              <StatusBadge :status="order.status" type="order" />
            </div>
            <h1
              class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
            >
              Bảng xử lý đơn hàng
            </h1>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Tạo lúc {{ formatDate(order.createdAt) }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
              @click="router.push(ROUTES.ADMIN.ORDERS)"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </section>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <!-- Order Items -->
          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
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
                    <th scope="col" class="px-4 py-3">Sản phẩm</th>
                    <th scope="col" class="px-4 py-3">Số lượng</th>
                    <th scope="col" class="px-4 py-3 text-right">Đơn giá</th>
                    <th scope="col" class="px-4 py-3 text-right">Tạm tính</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr
                    v-for="item in orderItems"
                    :key="item.id"
                    class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                  >
                    <td class="px-4 py-4 flex items-center gap-3">
                      <img
                        :src="item.thumbnail"
                        class="w-12 h-12 rounded-lg object-cover border dark:border-slate-700"
                        alt="Sản phẩm"
                      />
                      <div>
                        <p class="font-semibold text-slate-900 dark:text-white">
                          {{ item.name }}
                        </p>
                        <p class="text-[10px] text-slate-400 font-mono">
                          {{ item.id }}
                        </p>
                      </div>
                    </td>
                    <td
                      class="px-4 py-4 font-medium text-slate-800 dark:text-slate-200"
                    >
                      x{{ item.quantity }}
                    </td>
                    <td
                      class="px-4 py-4 text-right font-medium text-slate-800 dark:text-slate-200"
                    >
                      {{ Number(item.unitPrice).toLocaleString() }} VND
                    </td>
                    <td
                      class="px-4 py-4 text-right font-bold text-slate-900 dark:text-white"
                    >
                      {{
                        Number(item.unitPrice * item.quantity).toLocaleString()
                      }}
                      VND
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
                    {{
                      Number(
                        order.totalPrice -
                          order.shippingFee +
                          order.discountVoucher,
                      ).toLocaleString()
                    }}
                    VND
                  </span>
                </div>
                <div
                  class="flex justify-between text-slate-600 dark:text-slate-400"
                >
                  <span>Giảm giá mã</span>
                  <span class="font-semibold text-emerald-600">
                    -{{ Number(order.discountVoucher).toLocaleString() }} VND
                  </span>
                </div>
                <div
                  class="flex justify-between text-slate-600 dark:text-slate-400"
                >
                  <span>Phí vận chuyển</span>
                  <span
                    class="font-semibold text-slate-800 dark:text-slate-200"
                  >
                    +{{ Number(order.shippingFee).toLocaleString() }} VND
                  </span>
                </div>
                <div
                  class="flex justify-between text-base font-bold border-t border-dashed pt-3 text-slate-900 dark:text-white"
                >
                  <span>Tổng cộng</span>
                  <span
                    >{{ Number(order.totalPrice).toLocaleString() }} VND</span
                  >
                </div>
              </div>
            </div>
          </section>

          <!-- Interactive Status Timeline -->
          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
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
                <!-- Dot icon -->
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
                    {{ formatDate(step.time) }}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="space-y-6">
          <!-- Customer Card -->
          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Thông tin khách hàng
            </h2>
            <div
              class="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-bold"
                >
                  {{ order.userInfo.fullname.charAt(0) }}
                </div>
                <div>
                  <p class="font-bold text-slate-900 dark:text-white">
                    {{ order.userInfo.fullname }}
                  </p>
                  <p class="text-xs text-slate-400">
                    Mã khách hàng: {{ order.userId }}
                  </p>
                </div>
              </div>
              <div class="border-t pt-3 dark:border-slate-800 space-y-2">
                <p>
                  <span
                    class="font-semibold text-slate-400 block text-xs uppercase"
                    >Số điện thoại</span
                  >
                  {{ order.userInfo.phone }}
                </p>
                <p>
                  <span
                    class="font-semibold text-slate-400 block text-xs uppercase"
                    >Địa chỉ giao hàng</span
                  >
                  {{ order.userInfo.address }}, Phường/Xã
                  {{ order.userInfo.ward }}, Quận/Huyện
                  {{ order.userInfo.district }}, Tỉnh/Thành phố
                  {{ order.userInfo.province }}
                </p>
                <p v-if="order.userInfo.note">
                  <span
                    class="font-semibold text-slate-400 block text-xs uppercase"
                    >Ghi chú từ khách hàng</span
                  >
                  <span class="italic text-slate-500"
                    >"{{ order.userInfo.note }}"</span
                  >
                </p>
              </div>
            </div>
          </section>

          <!-- Payment Card with PayOS Refund Option -->
          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Chi tiết thanh toán
            </h2>
            <div
              v-if="payment"
              class="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300"
            >
              <div class="flex justify-between">
                <span>Phương thức:</span>
                <span
                  class="font-bold text-slate-900 dark:text-white font-mono"
                  >{{ payment.paymentMethod }}</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span>Trạng thái:</span>
                <StatusBadge :status="payment.status" type="payment" />
              </div>
              <div class="flex justify-between">
                <span>Mã giao dịch (TxID):</span>
                <span class="font-mono text-slate-500 font-bold">{{
                  payment.transactionId
                }}</span>
              </div>
              <div
                class="flex justify-between border-t pt-3 dark:border-slate-800 text-base font-bold text-slate-900 dark:text-white"
              >
                <span>Số tiền đã thanh toán:</span>
                <span>{{ Number(payment.amount).toLocaleString() }} VND</span>
              </div>

              <!-- Refund Trigger Triggered if paymentMethod === PayOS and status === completed -->
              <div
                v-if="
                  payment.paymentMethod === 'PayOS' &&
                  payment.status === 'completed'
                "
                class="mt-4 pt-3 border-t dark:border-slate-800"
              >
                <button
                  @click="showRefundDialog = true"
                  class="w-full rounded-lg bg-red-50 text-red-700 border border-red-200 px-4 py-2 text-xs font-semibold hover:bg-red-100 transition dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50"
                >
                  <i class="pi pi-refresh mr-1"></i> Hoàn tiền qua cổng PayOS
                </button>
              </div>
            </div>
            <div v-else class="text-xs text-slate-400 italic mt-3">
              Không có dữ liệu thanh toán.
            </div>
          </section>

          <!-- Update Order Fulfillment Status -->
          <section
            class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              Cập nhật tiến độ đơn hàng
            </h2>
            <div class="mt-4 space-y-4">
              <div>
                <label
                  class="block text-xs font-semibold uppercase text-slate-400 mb-2"
                  >Chuyển trạng thái</label
                >
                <select
                  v-model="statusValue"
                  class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao hàng</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="cancelled">Đã hủy</option>
                  <option value="returned">Đã trả hàng</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-xs font-semibold uppercase text-slate-400 mb-2"
                  >Ghi chú nội bộ</label
                >
                <Textarea
                  v-model="statusNote"
                  rows="3"
                  class="w-full"
                  placeholder="Ví dụ: Đã giao cho GrabExpress..."
                />
              </div>

              <button
                @click="submitStatus"
                :disabled="isUpdatingStatus"
                class="w-full rounded-lg bg-primary-600 text-white px-4 py-2 text-sm font-semibold hover:bg-primary-700 transition"
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

    <!-- Refund Dialog -->
    <ConfirmDialog
      :visible="showRefundDialog"
      title="Hoàn tiền thanh toán trực tuyến"
      message="Bạn có chắc chắn muốn hoàn tiền cho khách hàng này? Thao tác này sẽ kích hoạt giả lập giao dịch hoàn tiền thông qua webhook PayOS."
      confirm-label="Xác nhận hoàn tiền"
      cancel-label="Hủy bỏ"
      :loading="refundLoading"
      danger
      @confirm="processRefund"
      @cancel="() => (showRefundDialog = false)"
      @update:visible="(v) => !v && (showRefundDialog = false)"
    />
  </div>
</template>
