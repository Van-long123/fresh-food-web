import {
  getMyOrdersRequest,
  getOrderDetailRequest,
  cancelOrderRequest,
  confirmOrderReceivedRequest,
  repayOrderRequest,
  switchOrderToCodRequest,
} from '~/api/client/order.api'

export const orderService = {
  getMyOrders: () => getMyOrdersRequest(),
  getOrderDetail: (id: string) => getOrderDetailRequest(id),
  cancelOrder: (id: string, payload: Record<string, any> = {}) => cancelOrderRequest(id, payload),
  confirmReceived: (id: string) => confirmOrderReceivedRequest(id),
  repayOrder: (id: string) => repayOrderRequest(id),
  switchToCod: (id: string) => switchOrderToCodRequest(id),
}
