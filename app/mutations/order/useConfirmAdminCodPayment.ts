import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminOrderService } from '~/services/admin/order.service'
import { adminPaymentKeys } from '~/queries/order/useAdminPaymentsQuery'
import { adminOrderKeys } from '~/queries/order/useAdminOrdersQuery'

export const useConfirmAdminCodPayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (paymentId: string) => adminOrderService.confirmCod(paymentId),
    onSuccess: () => {
      // Invalidate both payment and order caches since confirming COD also updates order status
      queryClient.invalidateQueries({
        queryKey: adminPaymentKeys.all,
      })
      queryClient.invalidateQueries({
        queryKey: adminOrderKeys.all,
      })
    },
  })
}
