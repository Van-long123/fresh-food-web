import { useQuery } from "@tanstack/vue-query";
import { refundService } from "~/services/refund.service";

export const refundKeys = {
  all: ["refund-requests"] as const,
  byOrder: (orderId: string) => ["refund-requests", orderId] as const,
};

export const useRefundRequestQuery = (orderId: string) => {
  return useQuery({
    queryKey: refundKeys.byOrder(orderId),
    queryFn: () => refundService.getByOrder(orderId),
    enabled: !!orderId,
  });
};
