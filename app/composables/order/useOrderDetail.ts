import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import {
  useOrderDetailQuery as useOrderQuery,
  useCancelOrderMutation,
  useConfirmReceivedMutation,
} from "~/queries/order/useOrderDetailQuery";
import { useMergeCartMutation } from "~/mutations/cart/useCartMutations";
import {
  STATUS_MAP,
  PAYMENT_METHOD_MAP,
  PAYMENT_STATUS_MAP,
  TIMELINE_STEPS,
} from "~/constants/order";

export const useOrderDetail = (orderId: string) => {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const { data: orderData, isLoading, error } = useOrderQuery(orderId);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrderMutation(orderId);
  const { mutate: confirmReceivedMutation, isPending: isConfirmingReceived } = useConfirmReceivedMutation(orderId);
  const { mutate: mergeCart, isPending: isMergingCart } = useMergeCartMutation();
 
  const order = computed(() => orderData.value || {});
  const items = computed(() => order.value.items || []);
  const payment = computed(() => order.value.payment || {});

  const showCancelConfirm = ref(false);
  const cancelMessage = "Bạn có chắc muốn hủy đơn hàng này? Hành động không thể hoàn tác.";
  const showRefundDialog = ref(false);

  const subtotal = computed(() =>
    items.value.reduce((s: number, i: any) => s + i.totalPrice, 0),
  );
  const totalQty = computed(() =>
    items.value.reduce((s: number, i: any) => s + i.quantity, 0),
  );
  const currentStepIndex = computed(() =>
    TIMELINE_STEPS.findIndex((s) => s.key === order.value.status),
  );

  const isRefundable = computed(() => {
    if (order.value.status !== "delivered") return false;
    if (!order.value.deliveredAt) return false;
    const deliveredAt = new Date(order.value.deliveredAt).getTime();
    if (Number.isNaN(deliveredAt)) return false;
    return Date.now() - deliveredAt <= 24 * 60 * 60 * 1000;
  });

  function formatDateTime(ts: string | number) {
    if (!ts) return "";
    return new Date(ts).toLocaleString("vi-VN");
  }

  // Tính toán động danh sách các bước tiến trình kèm mốc thời gian thực tế:
  const timelineStepsWithTime = computed(() => {
    return TIMELINE_STEPS.map((step, idx) => {
      let time = null;
      if (idx <= currentStepIndex.value && order.value.createdAt) {
        if (idx === 0) {
          time = formatDateTime(order.value.createdAt);
        } else if (step.key === "delivered" && order.value.deliveredAt) {
          time = formatDateTime(order.value.deliveredAt);
        } else if (idx === currentStepIndex.value && order.value.updatedAt) {
          time = formatDateTime(order.value.updatedAt);
        }
      }
      return { ...step, time };
    });
  });

  const statusMeta = computed(
    () => STATUS_MAP[order.value.status] || STATUS_MAP.pending,
  );

  const statusBorderClass = computed(() => {
    switch (order.value.status) {
      case "shipping": return "border-t-4 border-sky-400";
      case "delivered": return "border-t-4 border-green-500";
      case "cancelled": return "border-t-4 border-red-400";
      case "pending": return "border-t-4 border-yellow-400";
      case "processing": return "border-t-4 border-indigo-400";
      default: return "";
    }
  });

  const paymentMeta = computed(
    () => PAYMENT_STATUS_MAP[payment.value.status] || PAYMENT_STATUS_MAP.pending,
  );
  const paymentStatusClass = computed(() => paymentMeta.value.color);
  
  const paymentMethodMeta = computed(
    () => PAYMENT_METHOD_MAP[payment.value.paymentMethod] || PAYMENT_METHOD_MAP["COD"],
  );

  async function copyTransactionId() {
    try {
      await navigator.clipboard.writeText(payment.value.transactionId || "");
      toast.add({ severity: "success", summary: "Đã sao chép", detail: "Mã giao dịch đã được sao chép", life: 2000 });
    } catch {
      toast.add({ severity: "error", summary: "Lỗi", detail: "Không thể sao chép", life: 2000 });
    }
  }

  function reviewProduct(item: any) {
    router.push({ path: `/product/${item.productId}` });
  }

  function buyAgain(item: any) {
    router.push({ path: `/product/${item.productId}` });
  }

  function reorderAll() {
    // Map items thành CartRequestItem[] (productId + quantity)
    const payload = items.value.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    // Gọi mutation để hợp nhất vào giỏ hàng
    mergeCart(payload, {
      onSuccess: () => {
        toast.add({
          severity: "success",
          summary: "Thành công",
          detail: "Đã thêm toàn bộ sản phẩm vào giỏ hàng!",
          life: 2000,
        });
        // Chuyển hướng tới trang giỏ hàng
        router.push("/cart");
      },
      onError: () => {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.",
          life: 2000,
        });
      },
    });
  }

  function onAcceptCancel() {
    cancelOrder();
  }

  function triggerCancel() {
    confirm.require({
      message: cancelMessage,
      header: "Xác nhận hủy đơn",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Hủy đơn",
      rejectLabel: "Không",
      acceptClass: "p-button-danger",
      accept: () => {
        onAcceptCancel();
      },
    });
  }

  function confirmReceived() {
    confirm.require({
      message: "Bạn có chắc chắn đã nhận được đơn hàng này và muốn hoàn tất giao dịch?",
      header: "Xác nhận đã nhận hàng",
      icon: "pi pi-check-circle",
      acceptLabel: "Đã nhận hàng",
      rejectLabel: "Chưa",
      acceptClass: "p-button-success",
      accept: () => {
        confirmReceivedMutation(undefined, {
          onSuccess: () => {
            toast.add({
              severity: "success",
              summary: "Thành công",
              detail: "Đơn hàng đã được xác nhận giao thành công",
              life: 3000,
            });
          },
          onError: (error: any) => {
            toast.add({
              severity: "error",
              summary: "Lỗi",
              detail: error?.response?.data?.message || "Không thể xác nhận đã nhận hàng. Vui lòng thử lại.",
              life: 3000,
            });
          },
        });
      },
    });
  }

  function openRefundDialog() {
    showRefundDialog.value = true;
  }

  function closeRefundDialog() {
    showRefundDialog.value = false;
  }

  return {
    orderData,
    isLoading,
    isCancelling,
    isConfirmingReceived,
    isMergingCart,
    error,
    order,
    items,
    payment,
    showCancelConfirm,
    cancelMessage,
    showRefundDialog,
    subtotal,
    totalQty,
    currentStepIndex,
    timelineStepsWithTime,
    isRefundable,
    statusMeta,
    statusBorderClass,
    paymentMeta,
    paymentStatusClass,
    paymentMethodMeta,
    formatDateTime,
    copyTransactionId,
    reviewProduct,
    buyAgain,
    reorderAll,
    onAcceptCancel,
    triggerCancel,
    confirmReceived,
    openRefundDialog,
    closeRefundDialog,
    router
  };
};
