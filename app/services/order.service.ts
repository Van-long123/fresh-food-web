import { getMyOrdersRequest, getOrderDetailRequest, cancelOrderRequest } from '~/api/order.api'

export const orderService = {
  getMyOrders: () => getMyOrdersRequest(),
  getOrderDetail: (id: string) => getOrderDetailRequest(id),
  cancelOrder: (id: string) => cancelOrderRequest(id)
}
