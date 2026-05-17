import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { orderService } from '~/services/order.service'
import { useToast } from 'primevue/usetoast'

export const useOrderDetailQuery = (orderId: string) => {
  return useQuery({
    queryKey: ['order-detail', orderId],
    queryFn: () => orderService.getOrderDetail(orderId),
    enabled: !!orderId,
  })
}

export const useCancelOrderMutation = (orderId: string) => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: () => orderService.cancelOrder(orderId),
    onSuccess: () => {
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đơn hàng đã được hủy thành công',
        life: 3000
      })
      queryClient.invalidateQueries({ queryKey: ['order-detail', orderId] })
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })
    },
    onError: (error: any) => {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng',
        life: 3000
      })
    }
  })
}
