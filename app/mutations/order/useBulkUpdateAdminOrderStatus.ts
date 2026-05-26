import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminOrderService } from '~/services/admin/order.service'
import { adminOrderKeys } from '~/queries/order/useAdminOrdersQuery'

export const useBulkUpdateAdminOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { order_ids: string[]; status: string }) =>
      adminOrderService.bulkUpdateStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminOrderKeys.all,
      })
    },
  })
}