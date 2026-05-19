import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type { MyOrder } from '~/types/order.type'

export const getMyOrdersRequest = async (): Promise<MyOrder[]> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ORDER.MY_ORDERS)
  return response.data.data
}

export const getOrderDetailRequest = async (id: string): Promise<any> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ORDER.DETAIL(id))
  return response.data.data
}

export const cancelOrderRequest = async (id: string): Promise<any> => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ORDER.CANCEL(id))
  return response.data
}

export const confirmOrderReceivedRequest = async (id: string): Promise<any> => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ORDER.RECEIVED(id))
  return response.data
}
