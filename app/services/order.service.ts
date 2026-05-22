import {
  getMyOrdersRequest,
  getOrderDetailRequest,
  cancelOrderRequest,
  confirmOrderReceivedRequest,
} from '~/api/order.api'

export const orderService = {
  getMyOrders: () => getMyOrdersRequest(),
  getOrderDetail: (id: string) => getOrderDetailRequest(id),
  cancelOrder: (id: string, payload: Record<string, any> = {}) => cancelOrderRequest(id, payload),
  confirmReceived: (id: string) => confirmOrderReceivedRequest(id),
}
