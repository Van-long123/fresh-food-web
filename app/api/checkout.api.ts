import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type { ShippingFeePayload, ShippingFeeResponse } from '../types/checkout.type'

export const getShippingFeeRequest = async (payload: ShippingFeePayload): Promise<ShippingFeeResponse> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.CHECKOUT.SHIPPING_FEE, payload)
  return response.data.data
}
