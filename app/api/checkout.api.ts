import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type { 
  ShippingFeePayload, 
  ShippingFeeResponse, 
  StockValidationItem, 
  ValidationResponse,
  CodCheckoutPayload,
  PayOSCheckoutPayload,
  PayOSCheckoutResponse
} from '../types/checkout.type'

export const getShippingFeeRequest = async (payload: ShippingFeePayload): Promise<ShippingFeeResponse> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.CHECKOUT.SHIPPING_FEE, payload)
  return response.data.data
}

export const validateStockRequest = async (items: StockValidationItem[]): Promise<ValidationResponse> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.ORDER.VALIDATE_STOCK, { items })
  return response.data.data
}

export const createCodOrderRequest = async (payload: CodCheckoutPayload): Promise<any> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.CHECKOUT.COD, payload)
  return response.data
}

export const createPayOSOrderRequest = async (payload: PayOSCheckoutPayload): Promise<PayOSCheckoutResponse> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.CHECKOUT.PAYOS, payload)
  return response.data.data
}
