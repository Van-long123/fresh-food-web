import { useQuery } from '@tanstack/vue-query'
import { orderService } from '~/services/order.service'

export const useOrderQuery = () => {
  const { data: orders, isLoading: isOrdersLoading, error: ordersError, refetch: refetchOrders } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders(),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  return {
    orders,
    isOrdersLoading,
    ordersError,
    refetchOrders
  }
}
