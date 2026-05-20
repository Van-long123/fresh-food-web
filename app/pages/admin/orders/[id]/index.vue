<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { validateOrderStatusUpdate } from "~/validations/admin/order.schema";
import type {
  AdminOrderDetail,
  AdminOrderStatus,
} from "~/types/admin-order.type";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin"],
});

const route = useRoute();
const orderId = route.params.id as string;

const { getOrder, updateOrderStatus } = useOrdersApi();

const statusNote = ref("");
const statusValue = ref<AdminOrderStatus>("pending");
const errors = ref<Record<string, string>>({});

const { data, pending } = await useAsyncData(
  `admin-order-${orderId}`,
  async () => {
    const detail = await getOrder(orderId);
    statusValue.value = detail.orderStatus;
    return detail as AdminOrderDetail;
  },
);

const order = computed(() => data.value as AdminOrderDetail);

const submitStatus = async () => {
  errors.value = validateOrderStatusUpdate(statusValue.value, statusNote.value);
  if (Object.keys(errors.value).length) return;
  await updateOrderStatus(orderId, statusValue.value, statusNote.value);
};
</script>

<template>
  <div class="px-4 pt-6 space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Order {{ order?.id }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Manage fulfillment steps and customer communication.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <StatusBadge v-if="order" :status="order.orderStatus" type="order" />
      </div>
    </div>

    <div v-if="pending" class="p-6 text-sm text-gray-500 dark:text-gray-400">
      Loading order...
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <section
          class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Order items
          </h2>
          <div class="mt-4 overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead
                class="text-xs text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700"
              >
                <tr>
                  <th class="py-2 text-left">Product</th>
                  <th class="py-2 text-left">Variant</th>
                  <th class="py-2 text-left">Qty</th>
                  <th class="py-2 text-left">Unit price</th>
                  <th class="py-2 text-left">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in order.items"
                  :key="item.id"
                  class="border-b border-gray-100 dark:border-gray-700"
                >
                  <td class="py-3">
                    <div class="flex items-center gap-3">
                      <img
                        :src="item.thumbnail"
                        class="w-10 h-10 rounded-lg object-cover"
                        alt="Item"
                      />
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ item.name }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ item.id }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 text-gray-600 dark:text-gray-300">
                    {{ item.variant }}
                  </td>
                  <td class="py-3 text-gray-600 dark:text-gray-300">
                    {{ item.quantity }}
                  </td>
                  <td class="py-3 text-gray-600 dark:text-gray-300">
                    ${{ item.unitPrice.toFixed(2) }}
                  </td>
                  <td class="py-3 font-medium text-gray-900 dark:text-white">
                    ${{ (item.unitPrice * item.quantity).toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section
          class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Status timeline
          </h2>
          <ol class="mt-4 space-y-3">
            <li
              v-for="step in order.timeline"
              :key="step.status"
              class="flex items-center gap-3"
            >
              <span
                class="flex items-center justify-center w-8 h-8 text-xs font-semibold bg-primary-100 text-primary-700 rounded-full dark:bg-primary-900/30 dark:text-primary-300"
              >
                {{ step.label[0] }}
              </span>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ step.label }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ step.time }}
                </p>
              </div>
            </li>
          </ol>
        </section>
      </div>

      <div class="space-y-6">
        <section
          class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Customer
          </h2>
          <div class="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <span class="font-medium text-gray-900 dark:text-white"
                >Name:</span
              >
              {{ order.customerName }}
            </p>
            <p>
              <span class="font-medium text-gray-900 dark:text-white"
                >Email:</span
              >
              {{ order.customerEmail }}
            </p>
            <p>
              <span class="font-medium text-gray-900 dark:text-white"
                >Phone:</span
              >
              {{ order.customerPhone }}
            </p>
            <p>
              <span class="font-medium text-gray-900 dark:text-white"
                >Address:</span
              >
              {{ order.shippingAddress }}
            </p>
          </div>
        </section>

        <section
          class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Payment
          </h2>
          <div class="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <span class="font-medium text-gray-900 dark:text-white"
                >Method:</span
              >
              {{ order.paymentMethod }}
            </p>
            <p>
              <span class="font-medium text-gray-900 dark:text-white"
                >Status:</span
              >
              <StatusBadge :status="order.paymentStatus" type="payment" />
            </p>
          </div>
        </section>

        <section
          class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Order summary
          </h2>
          <div class="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div class="flex justify-between">
              <span>Subtotal</span
              ><span>${{ order.summary.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span
              ><span>${{ order.summary.shippingFee.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Discount</span
              ><span>-${{ order.summary.discount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tax</span><span>${{ order.summary.tax.toFixed(2) }}</span>
            </div>
            <div
              class="flex justify-between font-semibold text-gray-900 dark:text-white"
            >
              <span>Total</span
              ><span>${{ order.summary.total.toFixed(2) }}</span>
            </div>
          </div>
        </section>

        <section
          class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Update status
          </h2>
          <div class="grid gap-3 mt-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >Status</label
              >
              <select
                v-model="statusValue"
                class="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="shipping">Shipping</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <p v-if="errors.status" class="mt-1 text-xs text-red-500">
                {{ errors.status }}
              </p>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >Note</label
              >
              <textarea
                v-model="statusNote"
                rows="3"
                class="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Add a note for this status change"
              ></textarea>
              <p v-if="errors.note" class="mt-1 text-xs text-red-500">
                {{ errors.note }}
              </p>
            </div>
            <button
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              @click="submitStatus"
            >
              Update status
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
