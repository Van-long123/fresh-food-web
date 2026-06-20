import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminOrderService } from '~/services/admin/order.service'
import { adminOrderKeys } from '~/queries/order/useAdminOrdersQuery'

export const useUpdateAdminOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminOrderService.updateStatus(id, status),
    onSuccess: (data) => {
      if (data?._id) {
        queryClient.setQueryData(adminOrderKeys.detail(data._id), data)
        
        queryClient.setQueriesData(
          { queryKey: ['admin-orders', 'list'] },
          (oldData: any) => {
            if (!oldData || !oldData.data) return oldData
            return {
              ...oldData,
              data: oldData.data.map((item: any) =>
                item._id === data._id ? { ...item, ...data } : item
              ),
            }
          }
        )
      }
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.all })
    },
  })
}
