import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminOrderService } from '~/services/admin/order.service'
import { adminOrderKeys } from '~/queries/order/useAdminOrdersQuery'

export const useUpdateAdminOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminOrderService.updateStatus(id, status),
    onSuccess: (data) => {
      // Invalidate list + update detail cache optimistically
      queryClient.invalidateQueries({
        queryKey: adminOrderKeys.all,
        refetchType: 'all'
      })
      if (data?._id) {
        queryClient.setQueryData(adminOrderKeys.detail(data._id), data)
      }
    },
  })
}
