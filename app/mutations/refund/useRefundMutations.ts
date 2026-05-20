import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useToast } from "primevue/usetoast";
import { refundService } from "~/services/refund.service";
import type { BankInfoPayload, CreateRefundPayload } from "~/types/refund.type";
import { refundKeys } from "~/queries/refund/useRefundQuery";

export const useCreateRefundMutation = (orderId: string) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: CreateRefundPayload) => refundService.createRefund(payload),
    onSuccess: () => {
      toast.add({
        severity: "success",
        summary: "Thành công",
        detail: "Yêu cầu hoàn tiền đã được gửi",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: refundKeys.byOrder(orderId) });
      queryClient.invalidateQueries({ queryKey: ["order-detail", orderId] });
    },
    onError: (error: any) => {
      toast.add({
        severity: "error",
        summary: "Lỗi",
        detail: error?.response?.data?.message || "Không thể gửi yêu cầu hoàn tiền",
        life: 3000,
      });
    },
  });
};

export const useSubmitBankInfoMutation = (orderId: string) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BankInfoPayload }) =>
      refundService.submitBankInfo(id, payload),
    onSuccess: () => {
      toast.add({
        severity: "success",
        summary: "Thành công",
        detail: "Đã gửi thông tin ngân hàng",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: refundKeys.byOrder(orderId) });
      queryClient.invalidateQueries({ queryKey: ["order-detail", orderId] });
    },
    onError: (error: any) => {
      toast.add({
        severity: "error",
        summary: "Lỗi",
        detail: error?.response?.data?.message || "Không thể cập nhật thông tin ngân hàng",
        life: 3000,
      });
    },
  });
};
