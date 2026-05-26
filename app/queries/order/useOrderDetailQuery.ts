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
    mutationFn: (payload: Record<string, any> = {}) => orderService.cancelOrder(orderId, payload),
    onSuccess: (data: any) => {
      const detail = data?.message || 'Đơn hàng đã được hủy thành công'
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail,
        life: 5000
      })
      queryClient.invalidateQueries({ queryKey: ['order-detail', orderId] })
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })
      queryClient.invalidateQueries({ queryKey: ['refund-requests', orderId] })
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

export const useConfirmReceivedMutation = (orderId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => orderService.confirmReceived(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-detail', orderId] })
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })
    }
  })
}
